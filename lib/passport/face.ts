import type { FaceDetector, FaceLandmarker } from '@mediapipe/tasks-vision';

const WASM_URL =
  'https://cdn.bgg.one/mediapipe/tasks-vision/1.2.3/wasm';
const MODEL_URL =
  'https://cdn.bgg.one/mediapipe/face_landmarker/float16/1/face_landmarker.task';
const FACE_DETECTOR_MODEL_URL =
  'https://cdn.bgg.one/mediapipe/face_detector/blaze_face_full_range/float16/1/blaze_face_full_range.tflite';

let landmarkerReady: Promise<FaceLandmarker> | null = null;
let cpuReady: Promise<FaceLandmarker> | null = null;
const multiLandmarkers = new Map<number, Promise<FaceLandmarker>>();
const multiCpuLandmarkers = new Map<number, Promise<FaceLandmarker>>();
const faceDetectors = new Map<number, Promise<FaceDetector>>();
const faceDetectorCpu = new Map<number, Promise<FaceDetector>>();

async function createLandmarker(
  delegate: 'GPU' | 'CPU',
  numFaces = 1,
  minConfidence = 0.5
) {
  const { FaceLandmarker, FilesetResolver } = await import(
    '@mediapipe/tasks-vision'
  );
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  return FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate,
    },
    runningMode: 'IMAGE',
    numFaces,
    minFaceDetectionConfidence: minConfidence,
    minFacePresenceConfidence: minConfidence,
    minTrackingConfidence: minConfidence,
  });
}

export function getFaceLandmarker() {
  landmarkerReady ??= (async () => {
    try {
      return await createLandmarker('GPU');
    } catch {
      cpuReady ??= createLandmarker('CPU');
      return cpuReady;
    }
  })();
  return landmarkerReady;
}

function getCpuLandmarker() {
  cpuReady ??= createLandmarker('CPU');
  return cpuReady;
}

function getMultiFaceLandmarker(minConfidence: number) {
  const key = Math.round(minConfidence * 100);
  let ready = multiLandmarkers.get(key);
  if (!ready) {
    ready = (async () => {
      try {
        return await createLandmarker('GPU', 10, minConfidence);
      } catch {
        return getMultiFaceCpuLandmarker(minConfidence);
      }
    })();
    multiLandmarkers.set(key, ready);
  }
  return ready;
}

function getMultiFaceCpuLandmarker(minConfidence: number) {
  const key = Math.round(minConfidence * 100);
  let ready = multiCpuLandmarkers.get(key);
  if (!ready) {
    ready = createLandmarker('CPU', 10, minConfidence);
    multiCpuLandmarkers.set(key, ready);
  }
  return ready;
}

async function createFaceDetector(
  delegate: 'GPU' | 'CPU',
  minConfidence: number
) {
  const { FaceDetector, FilesetResolver } = await import(
    '@mediapipe/tasks-vision'
  );
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  return FaceDetector.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: FACE_DETECTOR_MODEL_URL,
      delegate,
    },
    runningMode: 'IMAGE',
    minDetectionConfidence: minConfidence,
  });
}

function getFaceDetector(minConfidence: number) {
  const key = Math.round(minConfidence * 100);
  let ready = faceDetectors.get(key);
  if (!ready) {
    ready = (async () => {
      try {
        return await createFaceDetector('GPU', minConfidence);
      } catch {
        return getFaceDetectorCpu(minConfidence);
      }
    })();
    faceDetectors.set(key, ready);
  }
  return ready;
}

function getFaceDetectorCpu(minConfidence: number) {
  const key = Math.round(minConfidence * 100);
  let ready = faceDetectorCpu.get(key);
  if (!ready) {
    ready = createFaceDetector('CPU', minConfidence);
    faceDetectorCpu.set(key, ready);
  }
  return ready;
}

export type FaceMetrics = {
  width: number;
  height: number;
  eyeX: number;
  eyeY: number;
  chinY: number;
  crownY: number;
  headHeight: number;
};

export async function detectFaceMetrics(
  image: HTMLImageElement | ImageBitmap
): Promise<FaceMetrics> {
  let landmarker = await getFaceLandmarker();
  let result;
  try {
    result = landmarker.detect(image);
  } catch (error) {
    if (landmarker === (await cpuReady)) throw error;
    landmarker = await getCpuLandmarker();
    result = landmarker.detect(image);
  }
  const landmarks = result.faceLandmarks?.[0];

  if (!landmarks?.length) {
    throw new Error('no-face');
  }

  const width =
    image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const height =
    image instanceof HTMLImageElement ? image.naturalHeight : image.height;
  const point = (index: number) => landmarks[index];
  const forehead = point(10);
  const chin = point(152);
  const eyes = [point(33), point(133), point(362), point(263)];

  if (!forehead || !chin || eyes.some((eye) => !eye)) {
    throw new Error('no-face');
  }

  const eyeX =
    (eyes.reduce((sum, eye) => sum + eye.x, 0) / eyes.length) * width;
  const eyeY =
    (eyes.reduce((sum, eye) => sum + eye.y, 0) / eyes.length) * height;
  const foreheadY = forehead.y * height;
  const chinY = chin.y * height;
  const foreheadToChin = Math.max(1, chinY - foreheadY);
  const crownY = Math.max(0, foreheadY - foreheadToChin * 0.25);

  return {
    width,
    height,
    eyeX,
    eyeY,
    chinY,
    crownY,
    headHeight: Math.max(1, chinY - crownY),
  };
}

export type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function detectFaceBoxes(
  image: HTMLImageElement | ImageBitmap,
  minConfidence = 0.35
): Promise<FaceBox[]> {
  const width =
    image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const height =
    image instanceof HTMLImageElement ? image.naturalHeight : image.height;

  try {
    let detector = await getFaceDetector(minConfidence);
    let detection;
    try {
      detection = detector.detect(image);
    } catch (error) {
      detector = await getFaceDetectorCpu(minConfidence);
      detection = detector.detect(image);
    }
    const boxes = detection.detections
      .map((item) => {
        const box = item.boundingBox;
        if (!box) return null;
        const padX = box.width * 0.12;
        const padY = box.height * 0.15;
        const x = Math.max(0, box.originX - padX);
        const y = Math.max(0, box.originY - padY);
        return {
          x,
          y,
          width: Math.min(width - x, box.width + padX * 2),
          height: Math.min(height - y, box.height + padY * 2),
        };
      })
      .filter((box): box is FaceBox => !!box);
    if (boxes.length) return boxes;
  } catch (error) {
    console.error('Face detector failed, trying landmarks', error);
  }

  let landmarker = await getMultiFaceLandmarker(minConfidence);
  let result;
  try {
    result = landmarker.detect(image);
  } catch (error) {
    landmarker = await getMultiFaceCpuLandmarker(minConfidence);
    result = landmarker.detect(image);
  }

  return (result.faceLandmarks ?? [])
    .map((landmarks) => {
      let minX = 1;
      let minY = 1;
      let maxX = 0;
      let maxY = 0;
      for (const point of landmarks) {
        if (point.x < minX) minX = point.x;
        if (point.x > maxX) maxX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.y > maxY) maxY = point.y;
      }
      const boxWidth = (maxX - minX) * width;
      const boxHeight = (maxY - minY) * height;
      if (boxWidth <= 0 || boxHeight <= 0) return null;
      const padX = boxWidth * 0.12;
      const padY = boxHeight * 0.15;
      const x = Math.max(0, minX * width - padX);
      const y = Math.max(0, minY * height - padY);
      return {
        x,
        y,
        width: Math.min(width - x, boxWidth + padX * 2),
        height: Math.min(height - y, boxHeight + padY * 2),
      };
    })
    .filter((box): box is FaceBox => !!box);
}

import type { FaceLandmarker } from '@mediapipe/tasks-vision';

const WASM_URL =
  'https://cdn.bgg.one/mediapipe/tasks-vision/1.2.3/wasm';
const MODEL_URL =
  'https://cdn.bgg.one/mediapipe/face_landmarker/float16/1/face_landmarker.task';

let landmarkerReady: Promise<FaceLandmarker> | null = null;
let cpuReady: Promise<FaceLandmarker> | null = null;

async function createLandmarker(delegate: 'GPU' | 'CPU') {
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
    numFaces: 1,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
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

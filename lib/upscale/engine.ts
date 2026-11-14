'use client';

export type UpscaleProgress = {
  stage: 'model' | 'session' | 'tile' | 'encode';
  loaded?: number;
  total?: number;
  tile?: number;
  tiles?: number;
  pass?: number;
  passes?: number;
  backend?: UpscaleBackend;
};

export type UpscaleBackend = 'webgpu' | 'wasm';
export type UpscaleScale = 2 | 4;

export type UpscaleResult = {
  blob: Blob;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  backend: UpscaleBackend;
  scale: UpscaleScale;
  elapsedMs: number;
};

type Runtime = {
  ort: any;
  session: any;
  backend: UpscaleBackend;
};

const CDN = 'https://cdn.bgg.one/upscale/1.0.0';
const MODEL_URL = `${CDN}/realesrgan-x2.onnx`;
const DESKTOP_OUTPUT_EDGE = 2800;
const TILE = 256;
const OVERLAP = 16;
const JPEG_QUALITY = 0.92;

export type UpscaleLimits = {
  maxOutputEdge: number;
  max2x: number;
  max4x: number;
  mobile: boolean;
  ios: boolean;
};

export function getUpscaleLimits(): UpscaleLimits {
  if (typeof navigator === 'undefined') {
    return {
      maxOutputEdge: DESKTOP_OUTPUT_EDGE,
      max2x: DESKTOP_OUTPUT_EDGE / 2,
      max4x: DESKTOP_OUTPUT_EDGE / 4,
      mobile: false,
      ios: false,
    };
  }

  const ua = navigator.userAgent;
  const ios =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const mobile = ios || /Android|Mobile|Windows Phone/i.test(ua);
  const maxOutputEdge = ios ? 1600 : mobile ? 2000 : DESKTOP_OUTPUT_EDGE;

  return {
    maxOutputEdge,
    max2x: Math.floor(maxOutputEdge / 2),
    max4x: Math.floor(maxOutputEdge / 4),
    mobile,
    ios,
  };
}

let modelPromise: Promise<ArrayBuffer> | null = null;
let runtimePromise: Promise<Runtime> | null = null;

function abortError() {
  return new DOMException('Aborted', 'AbortError');
}

async function fetchModel(
  signal: AbortSignal | undefined,
  onProgress?: (progress: UpscaleProgress) => void
) {
  const response = await fetch(MODEL_URL, { signal });
  if (!response.ok) {
    throw new Error(`Model download failed (${response.status})`);
  }

  const total = Number(response.headers.get('content-length')) || 0;
  if (!response.body) {
    return response.arrayBuffer();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (signal?.aborted) throw abortError();
    chunks.push(value);
    loaded += value.length;
    onProgress?.({ stage: 'model', loaded, total });
  }

  const output = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output.buffer;
}

function configureOrt(ort: any, backend: UpscaleBackend) {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;
  ort.env.wasm.proxy = backend === 'wasm';
  ort.env.wasm.wasmPaths = `${CDN}/`;
  ort.env.logLevel = 'error';
}

async function createSession(
  ort: any,
  model: ArrayBuffer,
  backend: UpscaleBackend
) {
  configureOrt(ort, backend);
  return ort.InferenceSession.create(model, {
    executionProviders: [backend],
    graphOptimizationLevel: 'all',
    executionMode: 'sequential',
  });
}

async function getRuntime(
  onProgress?: (progress: UpscaleProgress) => void
): Promise<Runtime> {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    const model = modelPromise ?? (modelPromise = fetchModel(undefined, onProgress));
    const buffer = await model;

    const canUseWebGpu =
      typeof navigator !== 'undefined' &&
      !!(await (navigator as unknown as { gpu?: GPU })
        .gpu?.requestAdapter()
        .catch(() => null));

    if (canUseWebGpu) {
      try {
        onProgress?.({ stage: 'session', backend: 'webgpu' });
        const ort = await import('onnxruntime-web/webgpu');
        const session = await createSession(ort, buffer, 'webgpu');
        return { ort, session, backend: 'webgpu' };
      } catch (error) {
        console.warn('WebGPU upscaler failed, falling back to WASM', error);
      }
    }

    onProgress?.({ stage: 'session', backend: 'wasm' });
    const ort = await import('onnxruntime-web');
    const session = await createSession(ort, buffer, 'wasm');
    return { ort, session, backend: 'wasm' };
  })();

  runtimePromise.catch(() => {
    runtimePromise = null;
    modelPromise = null;
  });
  return runtimePromise;
}

function releaseRuntime() {
  runtimePromise = null;
}

async function decodeImage(file: File, maxEdge: number) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bitmap = await createImageBitmap(file);
  }

  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  const ratio = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * ratio));
  const height = Math.max(1, Math.round(sourceHeight * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is not available');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = ratio < 1;
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return { canvas, width, height };
}

function tileInput(
  pixels: Uint8ClampedArray,
  imageWidth: number,
  x0: number,
  y0: number,
  tileWidth: number,
  tileHeight: number
) {
  const width = Math.ceil(tileWidth / 4) * 4;
  const height = Math.ceil(tileHeight / 4) * 4;
  const area = width * height;
  const data = new Float32Array(area * 3);
  data.fill(1);

  for (let y = 0; y < tileHeight; y += 1) {
    for (let x = 0; x < tileWidth; x += 1) {
      const source = ((y0 + y) * imageWidth + (x0 + x)) * 4;
      const target = y * width + x;
      data[target] = pixels[source] / 255;
      data[area + target] = pixels[source + 1] / 255;
      data[2 * area + target] = pixels[source + 2] / 255;
    }
  }

  return { data, width, height };
}

async function upscaleCanvas(
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  runtime: Runtime,
  signal: AbortSignal | undefined,
  onProgress: ((progress: UpscaleProgress) => void) | undefined,
  pass: number,
  passes: number
) {
  const context = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is not available');
  const source = context.getImageData(0, 0, width, height).data;

  const outputWidth = width * 2;
  const outputHeight = height * 2;
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputContext = outputCanvas.getContext('2d');
  if (!outputContext) throw new Error('Canvas is not available');
  const output = outputContext.createImageData(outputWidth, outputHeight);

  const inputName = runtime.session.inputNames[0];
  const outputName = runtime.session.outputNames[0];
  const tilesX = Math.ceil(width / TILE);
  const tilesY = Math.ceil(height / TILE);
  const tiles = tilesX * tilesY;
  let tileIndex = 0;

  try {
    for (let ty = 0; ty < height; ty += TILE) {
      for (let tx = 0; tx < width; tx += TILE) {
        if (signal?.aborted) throw abortError();

        const x0 = Math.max(0, tx - OVERLAP);
        const y0 = Math.max(0, ty - OVERLAP);
        const x1 = Math.min(width, tx + TILE + OVERLAP);
        const y1 = Math.min(height, ty + TILE + OVERLAP);
        const tileWidth = x1 - x0;
        const tileHeight = y1 - y0;
        const tile = tileInput(source, width, x0, y0, tileWidth, tileHeight);

        const input = new runtime.ort.Tensor('float32', tile.data, [
          1,
          3,
          tile.height,
          tile.width,
        ]);
        let result: any;
        try {
          result = await runtime.session.run({ [inputName]: input });
        } catch (error) {
          throw new Error(
            `Upscale failed at pass ${pass}/${passes}, tile ${tileIndex + 1}/${tiles} (${tileWidth}x${tileHeight}): ${String(error)}`
          );
        }
        const tensor = result[outputName];
        const dims = tensor.dims as number[];
        const pixels = tensor.data as Float32Array;
        const outTileWidth = dims[3];
        const outTileHeight = dims[2];

        if (outTileWidth !== tile.width * 2 || outTileHeight !== tile.height * 2) {
          throw new Error('Unexpected upscaler output size');
        }

        const copyWidth = Math.min(TILE, width - tx);
        const copyHeight = Math.min(TILE, height - ty);
        const srcX = (tx - x0) * 2;
        const srcY = (ty - y0) * 2;

        for (let y = 0; y < copyHeight * 2; y += 1) {
          for (let x = 0; x < copyWidth * 2; x += 1) {
            const si = (srcY + y) * outTileWidth + srcX + x;
            const di = ((ty * 2 + y) * outputWidth + tx * 2 + x) * 4;
            output.data[di] = Math.min(255, Math.max(0, Math.round(pixels[si] * 255)));
            output.data[di + 1] = Math.min(
              255,
              Math.max(0, Math.round(pixels[outTileWidth * outTileHeight + si] * 255))
            );
            output.data[di + 2] = Math.min(
              255,
              Math.max(
                0,
                Math.round(pixels[outTileWidth * outTileHeight * 2 + si] * 255)
              )
            );
            output.data[di + 3] = 255;
          }
        }

        tileIndex += 1;
        onProgress?.({
          stage: 'tile',
          tile: tileIndex,
          tiles,
          pass,
          passes,
          backend: runtime.backend,
        });
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }

    outputContext.putImageData(output, 0, 0);
    return outputCanvas;
  } catch (error) {
    if (runtime.backend === 'webgpu') {
      releaseRuntime();
    }
    throw error;
  }
}

export async function upscaleImage(
  file: File,
  options: {
    scale?: UpscaleScale;
    signal?: AbortSignal;
    onProgress?: (progress: UpscaleProgress) => void;
  } = {}
): Promise<UpscaleResult> {
  const startedAt = performance.now();
  const scale = options.scale === 4 ? 4 : 2;
  const passes = scale === 4 ? 2 : 1;
  const { signal, onProgress } = options;
  const runtime = await getRuntime(onProgress);
  if (signal?.aborted) throw abortError();

  const maxInputEdge = Math.floor(getUpscaleLimits().maxOutputEdge / scale);
  const { canvas, width, height } = await decodeImage(file, maxInputEdge);
  let currentCanvas = canvas;
  let currentWidth = width;
  let currentHeight = height;

  for (let pass = 1; pass <= passes; pass += 1) {
    if (signal?.aborted) throw abortError();
    currentCanvas = await upscaleCanvas(
      currentCanvas,
      currentWidth,
      currentHeight,
      runtime,
      signal,
      onProgress,
      pass,
      passes
    );
    currentWidth *= 2;
    currentHeight *= 2;
  }

  onProgress?.({ stage: 'encode', backend: runtime.backend });
  const blob = await new Promise<Blob>((resolve, reject) => {
    currentCanvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error('Encode failed'))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });

  return {
    blob,
    width: currentWidth,
    height: currentHeight,
    sourceWidth: width,
    sourceHeight: height,
    backend: runtime.backend,
    scale,
    elapsedMs: performance.now() - startedAt,
  };
}

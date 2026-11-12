import type { OutputFormat, QualityId } from '@/lib/compress/protocol';

const WASM = '/compress';

const QUALITY: Record<QualityId, number> = {
  smaller: 60,
  balanced: 75,
  high: 90,
};

type Kind = 'jpeg' | 'webp' | 'png';

const MIME: Record<Kind, string> = {
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  png: 'image/png',
};

const EXT: Record<Kind, string> = {
  jpeg: 'jpg',
  webp: 'webp',
  png: 'png',
};

export type EncodeRequest = {
  bytes: ArrayBuffer;
  mime: string;
  name: string;
  format: OutputFormat;
  quality: QualityId;
  maxEdge: number;
  targetBytes: number;
};

export type EncodeResult = {
  bytes: ArrayBuffer;
  mime: string;
  name: string;
  width: number;
  height: number;
};

type WebpModule = {
  encode: (
    data: BufferSource,
    width: number,
    height: number,
    options: Record<string, number>
  ) => Uint8Array | null;
};

type OxiModule = {
  default: (input?: string) => Promise<unknown>;
  optimise_raw: (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    level: number,
    interlace: boolean,
    optimizeAlpha: boolean
  ) => Uint8Array;
};

let jpegReady: Promise<void> | null = null;
let webpReady: Promise<WebpModule> | null = null;
let pngReady: Promise<OxiModule> | null = null;

function locateWasm(path: string) {
  const file = path.split('/').pop() || path;
  return `${WASM}/${file}`;
}

function simdSupported() {
  try {
    return WebAssembly.validate(
      Uint8Array.from([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0,
        253, 15, 253, 98, 11,
      ])
    );
  } catch {
    return false;
  }
}

function jpegEncoder() {
  jpegReady ??= import('@jsquash/jpeg/encode').then(({ init }) =>
    init({ locateFile: locateWasm })
  );
  return jpegReady;
}

function webpEncoder() {
  webpReady ??= (async () => {
    const [{ initEmscriptenModule }, glue] = await Promise.all([
      import('@jsquash/webp/utils.js'),
      simdSupported()
        ? import('@jsquash/webp/codec/enc/webp_enc_simd.js')
        : import('@jsquash/webp/codec/enc/webp_enc.js'),
    ]);
    const ready = await initEmscriptenModule(glue.default, undefined, {
      locateFile: locateWasm,
    });
    if (!ready) throw new Error('webp');
    return ready as WebpModule;
  })();
  return webpReady;
}

function pngEncoder() {
  pngReady ??= import('@jsquash/oxipng/codec/pkg/squoosh_oxipng.js').then(async (mod) => {
    await mod.default(`${WASM}/squoosh_oxipng_bg.wasm`);
    return mod;
  });
  return pngReady;
}

function normalizeMime(mime: string) {
  if (mime === 'image/jpg' || mime === 'image/pjpeg') return 'image/jpeg';
  return mime;
}

function chooseKind(mime: string, format: OutputFormat): Kind {
  if (format !== 'keep') return format;
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpeg';
}

function fileName(name: string, kind: Kind) {
  const base = (name.replace(/\.[^.]+$/, '') || 'image').replace(/_min_BgGone$/, '');
  return `${base}_min_BgGone.${EXT[kind]}`;
}

function flattenOnWhite(data: ImageData) {
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const alpha = px[i + 3] / 255;
    if (alpha >= 1) continue;
    px[i] = Math.round(px[i] * alpha + 255 * (1 - alpha));
    px[i + 1] = Math.round(px[i + 1] * alpha + 255 * (1 - alpha));
    px[i + 2] = Math.round(px[i + 2] * alpha + 255 * (1 - alpha));
    px[i + 3] = 255;
  }
}

function asArrayBuffer(buffer: ArrayBufferLike): ArrayBuffer {
  if (buffer instanceof ArrayBuffer) return buffer;
  return new Uint8Array(buffer).slice().buffer as ArrayBuffer;
}

function ownedBuffer(buffer: ArrayBuffer) {
  return buffer.slice(0);
}

// The encoder may hand back its whole wasm memory. Keep only the file bytes.
function trimEncoded(kind: Kind, buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  if (kind === 'jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let i = 2; i < bytes.length - 1; i++) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0xd9) {
        return i + 2 === bytes.length ? buffer : buffer.slice(0, i + 2);
      }
    }
  }
  if (kind === 'webp' && bytes.length >= 12) {
    const mark = String.fromCharCode(...bytes.subarray(0, 4), ...bytes.subarray(8, 12));
    if (mark === 'RIFFWEBP') {
      const size = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);
      const total = size + 8;
      if (total > 12 && total < bytes.length) return buffer.slice(0, total);
    }
  }
  return buffer;
}

async function pixelsFrom(bytes: ArrayBuffer, mime: string, maxEdge: number) {
  const blob = new Blob([bytes], { type: mime || 'application/octet-stream' });
  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  let width = bitmap.width;
  let height = bitmap.height;
  const sourceWidth = width;
  const sourceHeight = height;
  if (maxEdge > 0 && Math.max(width, height) > maxEdge) {
    const scale = maxEdge / Math.max(width, height);
    width = Math.max(1, Math.round(sourceWidth * scale));
    height = Math.max(1, Math.round(sourceHeight * scale));
  }

  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(width, height)
      : Object.assign(document.createElement('canvas'), { width, height });
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    bitmap.close();
    throw new Error('canvas');
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const data = ctx.getImageData(0, 0, width, height);
  return { data, canvas, width, height, sourceWidth, sourceHeight };
}

async function encodeWasm(kind: Kind, data: ImageData, quality: number) {
  if (kind === 'jpeg') {
    await jpegEncoder();
    const { default: encode } = await import('@jsquash/jpeg/encode');
    flattenOnWhite(data);
    return ownedBuffer(trimEncoded(kind, await encode(data, { quality })));
  }
  if (kind === 'webp') {
    const [module, { defaultOptions }] = await Promise.all([
      webpEncoder(),
      import('@jsquash/webp/meta.js'),
    ]);
    const encoded = module.encode(data.data, data.width, data.height, {
      ...defaultOptions,
      quality,
    });
    if (!encoded) throw new Error('encode');
    return ownedBuffer(trimEncoded(kind, asArrayBuffer(encoded.buffer)));
  }
  const oxi = await pngEncoder();
  return ownedBuffer(
    trimEncoded(
      kind,
      oxi.optimise_raw(data.data, data.width, data.height, 2, false, true).buffer as ArrayBuffer
    )
  );
}

async function encodeCanvas(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  kind: Kind,
  quality: number
) {
  const type = MIME[kind];
  const qualityArg = kind === 'png' ? undefined : quality / 100;
  let blob: Blob | null = null;
  if ('convertToBlob' in canvas) {
    blob = await canvas.convertToBlob({ type, quality: qualityArg });
  } else {
    blob = await new Promise((resolve) => {
      canvas.toBlob((result) => resolve(result), type, qualityArg);
    });
  }
  if (!blob || blob.size === 0) throw new Error('encode');
  if (blob.type && blob.type !== type) throw new Error('encode');
  return blob.arrayBuffer();
}

const MIN_QUALITY = 20;

async function encodeAt(
  kind: Kind,
  data: ImageData,
  canvas: OffscreenCanvas | HTMLCanvasElement,
  quality: number,
  canvasOnly: { current: boolean }
) {
  if (!canvasOnly.current) {
    try {
      return await encodeWasm(kind, data, quality);
    } catch {
      canvasOnly.current = true;
    }
  }
  return encodeCanvas(canvas, kind, quality);
}

async function encodeToTarget(
  kind: Kind,
  data: ImageData,
  canvas: OffscreenCanvas | HTMLCanvasElement,
  quality: number,
  targetBytes: number
) {
  const canvasOnly = { current: false };
  let encoded = await encodeAt(kind, data, canvas, quality, canvasOnly);
  if (kind === 'png' || targetBytes <= 0 || encoded.byteLength <= targetBytes) return encoded;

  let smallest = encoded;
  let fitted: ArrayBuffer | null = null;
  for (let attempt = 0; attempt < 4 && quality > MIN_QUALITY; attempt += 1) {
    const next = Math.max(
      MIN_QUALITY,
      Math.min(quality - 5, Math.round(quality * (targetBytes / encoded.byteLength) * 0.92))
    );
    if (next === quality) break;
    quality = next;
    encoded = await encodeAt(kind, data, canvas, quality, canvasOnly);
    if (encoded.byteLength < smallest.byteLength) smallest = encoded;
    if (encoded.byteLength <= targetBytes) {
      fitted = encoded;
      break;
    }
  }
  return fitted ?? smallest;
}

export async function compressImage(request: EncodeRequest): Promise<EncodeResult> {
  const mime = normalizeMime(request.mime);
  const kind = chooseKind(mime, request.format);
  const quality = QUALITY[request.quality];
  const { data, canvas, width, height, sourceWidth, sourceHeight } = await pixelsFrom(
    request.bytes,
    mime,
    request.maxEdge
  );
  const resized = width !== sourceWidth || height !== sourceHeight;
  const encoded = await encodeToTarget(kind, data, canvas, quality, request.targetBytes);

  const outputMime = MIME[kind];
  const sameFile =
    !resized && outputMime === mime && encoded.byteLength >= request.bytes.byteLength;
  const bytes = sameFile ? ownedBuffer(request.bytes) : encoded;

  return {
    bytes,
    mime: sameFile ? mime : outputMime,
    name: sameFile ? request.name : fileName(request.name, kind),
    width,
    height,
  };
}

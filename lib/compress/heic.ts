// libheif-js's Node entry reads the wasm with fs. These two files are copied
// from libheif-js/libheif-wasm and loaded only when a HEIC file shows up.
// Upgrading libheif-js means copying libheif.js and libheif.wasm again.

const GLUE = '/compress/libheif.js';
const WASM = '/compress/libheif.wasm';

const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis']);

type HeifImage = {
  get_width(): number;
  get_height(): number;
  is_primary(): boolean;
  display(image: ImageData, callback: (result: ImageData | null) => void): void;
  free(): void;
};

type HeifDecoder = {
  decoder: number | null;
  decode(data: Uint8Array): HeifImage[];
};

type HeifModule = {
  HeifDecoder: new () => HeifDecoder;
  heif_context_free(ptr: number): void;
};

let ready: Promise<HeifModule> | null = null;

function libheif() {
  ready ??= (async () => {
    const [source, wasm] = await Promise.all([
      fetch(GLUE).then((res) => {
        if (!res.ok) throw new Error('heic');
        return res.text();
      }),
      fetch(WASM).then((res) => {
        if (!res.ok) throw new Error('heic');
        return res.arrayBuffer();
      }),
    ]);
    const url = URL.createObjectURL(
      new Blob(
        [
          'const process=undefined,require=undefined,__filename=undefined,exports=undefined,module=undefined,define=undefined;\n',
          source,
          '\nexport default libheif;\n',
        ],
        { type: 'text/javascript' }
      )
    );
    try {
      const mod = (await import(/* webpackIgnore: true */ url)) as { default: (options: { wasmBinary: ArrayBuffer }) => HeifModule };
      const lib = mod.default({ wasmBinary: wasm });
      if (!lib?.HeifDecoder) throw new Error('heic');
      return lib;
    } finally {
      URL.revokeObjectURL(url);
    }
  })();
  return ready;
}

export function nameLooksLikeHeic(name: string, mime: string) {
  return /\.hei[cf]$/i.test(name) || /^image\/hei[cf]/i.test(mime);
}

export function bytesLookLikeHeic(bytes: Uint8Array) {
  if (bytes.length < 16) return false;
  if (String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]) !== 'ftyp') return false;
  const size = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  const end = Math.min(bytes.length, size);
  const brands: string[] = [];
  for (let i = 8; i + 4 <= end; i += 4) {
    brands.push(String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]));
  }
  if (HEIC_BRANDS.has(brands[0])) return true;
  return brands.slice(2).some((brand) => HEIC_BRANDS.has(brand));
}

export function looksLikeHeic(mime: string, name: string, bytes?: ArrayBuffer) {
  if (nameLooksLikeHeic(name, mime)) return true;
  if (!bytes) return false;
  return bytesLookLikeHeic(new Uint8Array(bytes, 0, Math.min(64, bytes.byteLength)));
}

export async function decodeHeic(bytes: ArrayBuffer) {
  const lib = await libheif();
  const decoder = new lib.HeifDecoder();
  const images = decoder.decode(new Uint8Array(bytes));
  try {
    const image = images.find((item) => item.is_primary()) ?? images[0];
    if (!image) throw new Error('heic');
    const width = image.get_width();
    const height = image.get_height();
    if (!width || !height) throw new Error('heic');
    return await new Promise<ImageData>((resolve, reject) => {
      image.display(new ImageData(width, height), (result) => {
        if (result) resolve(result);
        else reject(new Error('heic'));
      });
    });
  } finally {
    for (const image of images) image.free();
    if (decoder.decoder) lib.heif_context_free(decoder.decoder);
  }
}

export async function heicPreview(bytes: ArrayBuffer) {
  const image = await decodeHeic(bytes);
  const bitmap = await createImageBitmap(image);
  try {
    const canvas =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(bitmap.width, bitmap.height)
        : Object.assign(document.createElement('canvas'), {
            width: bitmap.width,
            height: bitmap.height,
          });
    const ctx = canvas.getContext('2d') as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null;
    if (!ctx) throw new Error('canvas');
    ctx.drawImage(bitmap, 0, 0);
    const blob =
      'convertToBlob' in canvas
        ? await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 })
        : await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.92);
          });
    if (!blob) throw new Error('heic');
    return blob.arrayBuffer();
  } finally {
    bitmap.close();
  }
}

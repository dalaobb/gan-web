export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  return { canvas, ctx };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/jpeg',
  quality = 0.92
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('encode'))),
      type,
      quality
    );
  });
}

export async function loadBitmap(blob: Blob) {
  return createImageBitmap(blob, { imageOrientation: 'from-image' });
}

export function imageSize(image: HTMLImageElement | ImageBitmap) {
  return image instanceof HTMLImageElement
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height };
}

export type AlphaBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export async function opaqueBounds(
  bitmap: ImageBitmap
): Promise<AlphaBounds | null> {
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const { ctx } = makeCanvas(width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= 32) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) return null;
  return {
    left: Math.round(left / scale),
    top: Math.round(top / scale),
    right: Math.round((right + 1) / scale),
    bottom: Math.round((bottom + 1) / scale),
  };
}

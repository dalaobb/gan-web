import {
  bytesLookLikeHeic,
  decodeHeic,
  looksLikeHeic,
} from '@/lib/compress/heic';

function canvasToPng(image: ImageData) {
  const node = document.createElement('canvas');
  node.width = image.width;
  node.height = image.height;
  const ctx = node.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.putImageData(image, 0, 0);
  return new Promise<Blob>((resolve, reject) => {
    node.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('heic'))),
      'image/png'
    );
  });
}

export async function normalizePortrait(file: File) {
  const mime = file.type.toLowerCase();
  if (!looksLikeHeic(mime, file.name)) return file;

  const bytes = await file.arrayBuffer();
  const head = new Uint8Array(bytes, 0, Math.min(64, bytes.byteLength));
  if (!bytesLookLikeHeic(head)) return file;

  const image = await decodeHeic(bytes);
  const blob = await canvasToPng(image);
  const name = file.name.replace(/\.hei[cf]$/i, '.png');
  return new File([blob], name, { type: 'image/png' });
}

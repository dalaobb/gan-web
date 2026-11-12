import { bytesLookLikeHeic, nameLooksLikeHeic } from '@/lib/compress/heic';

const MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/x-ms-bmp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
]);

const EXT = /\.(jpe?g|png|webp|gif|bmp|avif|hei[cf])$/i;

export type ImageKind = 'heic' | 'gif' | 'image';

function isGif(name: string, mime: string) {
  return mime === 'image/gif' || /\.gif$/i.test(name);
}

export function classifyImage(file: File, head?: Uint8Array): ImageKind | null {
  const mime = file.type.toLowerCase();
  if (nameLooksLikeHeic(file.name, mime) || (head && bytesLookLikeHeic(head))) return 'heic';
  if (isGif(file.name, mime)) return 'gif';
  if (MIME.has(mime) || EXT.test(file.name)) return 'image';
  return null;
}

export async function classifyFile(file: File): Promise<ImageKind | null> {
  const quick = classifyImage(file);
  if (quick) return quick;
  const head = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  return classifyImage(file, head);
}

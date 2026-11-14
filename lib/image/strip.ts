import { normalizePortrait } from '@/lib/passport/normalize';
import { canvasToBlob, loadBitmap, makeCanvas } from '@/lib/image/canvas';
import { readMetadata } from '@/lib/image/metadata';

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function stripPng(bytes: Uint8Array) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (signature.some((value, index) => bytes[index] !== value)) return null;
  const parts: Uint8Array[] = [bytes.slice(0, 8)];
  const remove = new Set(['eXIf', 'tEXt', 'iTXt', 'zTXt', 'tIME']);
  let changed = false;
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );
    const end = offset + 12 + length;
    if (end > bytes.length) break;
    if (remove.has(type)) changed = true;
    else parts.push(bytes.slice(offset, end));
    offset = end;
    if (type === 'IEND') break;
  }
  return changed ? concat(parts) : null;
}

function stripJpeg(bytes: Uint8Array) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let offset = 2;
  let changed = false;

  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const markerStart = offset;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) return null;
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0xda) {
      parts.push(bytes.slice(markerStart));
      break;
    }
    if (marker === 0xd9) {
      parts.push(bytes.slice(markerStart, offset));
      break;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(bytes.slice(markerStart, offset));
      continue;
    }
    if (offset + 2 > bytes.length) return null;
    const length = (bytes[offset] << 8) | bytes[offset + 1];
    if (length < 2 || offset + length > bytes.length) return null;
    const end = offset + length;
    const remove =
      marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (remove) changed = true;
    else parts.push(bytes.slice(markerStart, end));
    offset = end;
  }

  return changed ? concat(parts) : null;
}

function readU32LE(bytes: Uint8Array, offset: number) {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeU32LE(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function chunkName(bytes: Uint8Array, offset: number) {
  return String.fromCharCode(
    bytes[offset],
    bytes[offset + 1],
    bytes[offset + 2],
    bytes[offset + 3]
  );
}

function stripWebp(bytes: Uint8Array) {
  if (chunkName(bytes, 0) !== 'RIFF' || chunkName(bytes, 8) !== 'WEBP') {
    return null;
  }
  const kept: Uint8Array[] = [];
  let offset = 12;
  let changed = false;

  while (offset + 8 <= bytes.length) {
    const name = chunkName(bytes, offset);
    const size = readU32LE(bytes, offset + 4);
    const total = 8 + size + (size % 2);
    if (offset + total > bytes.length) return null;

    if (name === 'EXIF' || name === 'XMP ') {
      changed = true;
    } else {
      const chunk = bytes.slice(offset, offset + total);
      if (name === 'VP8X') {
        // Clear the EXIF and XMP feature flags.
        chunk[8] &= ~0x0c;
      }
      kept.push(chunk);
    }
    offset += total;
  }

  if (!changed) return null;
  const payload = concat(kept);
  const out = new Uint8Array(12 + payload.length);
  out.set([0x52, 0x49, 0x46, 0x46], 0);
  writeU32LE(out, 4, out.length - 8);
  out.set([0x57, 0x45, 0x42, 0x50], 8);
  out.set(payload, 12);
  return out;
}

export async function stripMetadata(file: File) {
  const metadata = await readMetadata(file);
  const input = await normalizePortrait(file);
  const base = file.name.replace(/\.[^.]+$/, '') || 'image';
  const bytes = new Uint8Array(await input.arrayBuffer());
  const orientation = metadata.orientation;
  let stripped: Uint8Array | null = null;
  let type = input.type;

  if (input.type === 'image/png') {
    stripped = stripPng(bytes);
  } else if (
    input.type === 'image/jpeg' &&
    (!orientation || orientation === 1)
  ) {
    stripped = stripJpeg(bytes);
  } else if (
    input.type === 'image/webp' &&
    (!orientation || orientation === 1)
  ) {
    stripped = stripWebp(bytes);
  }

  if (stripped) {
    const blob = new Blob([stripped.slice().buffer as ArrayBuffer], {
      type,
    });
    const bitmap = await loadBitmap(blob);
    try {
      return {
        blob,
        name: `${base}-clean.${
          type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
        }`,
        width: bitmap.width,
        height: bitmap.height,
      };
    } finally {
      bitmap.close();
    }
  }

  if (!metadata.hasAny) {
    const bitmap = await loadBitmap(input);
    try {
      return {
        blob: file,
        name: file.name,
        width: bitmap.width,
        height: bitmap.height,
      };
    } finally {
      bitmap.close();
    }
  }

  const bitmap = await loadBitmap(input);
  try {
    const { canvas, ctx } = makeCanvas(bitmap.width, bitmap.height);
    type = input.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);

    let best: Blob | null = null;
    for (const quality of [0.92, 0.85, 0.78, 0.7, 0.62]) {
      const blob = await canvasToBlob(canvas, type, quality);
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= file.size) {
        best = blob;
        break;
      }
    }
    if (!best) throw new Error('encode');
    const ext = type === 'image/webp' ? 'webp' : 'jpg';
    return {
      blob: best,
      name: `${base}-clean.${ext}`,
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}

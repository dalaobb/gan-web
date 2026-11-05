export type Backdrop =
  | { type: 'transparent' }
  | { type: 'color'; color: string }
  | { type: 'image'; url: string };

export function backdropStyle(
  backdrop: Backdrop
): Record<string, string> | undefined {
  if (backdrop.type === 'color') {
    return { backgroundColor: backdrop.color, backgroundImage: 'none' };
  }
  if (backdrop.type === 'image') {
    return {
      backgroundColor: '#ffffff',
      backgroundImage: `url("${backdrop.url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return undefined;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource & { width: number; height: number },
  width: number,
  height: number
) {
  const scale = Math.max(width / source.width, height / source.height);
  const dw = source.width * scale;
  const dh = source.height * scale;
  ctx.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

async function loadBitmap(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error('background image');
  return createImageBitmap(await response.blob());
}

export async function paintBackground(
  cutout: Blob,
  backdrop: Exclude<Backdrop, { type: 'transparent' }>
): Promise<Blob> {
  const foreground = await createImageBitmap(cutout);
  const canvas = document.createElement('canvas');
  canvas.width = foreground.width;
  canvas.height = foreground.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    foreground.close();
    throw new Error('canvas');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (backdrop.type === 'color') {
    ctx.fillStyle = backdrop.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    const background = await loadBitmap(backdrop.url);
    drawCover(ctx, background, canvas.width, canvas.height);
    background.close();
  }
  ctx.drawImage(foreground, 0, 0);
  foreground.close();

  const type = cutout.type === 'image/webp' ? 'image/webp' : 'image/png';
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), type, 1);
  });
  if (!blob) throw new Error('export');
  return blob;
}

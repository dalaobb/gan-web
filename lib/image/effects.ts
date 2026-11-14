import {
  canvasToBlob,
  loadBitmap,
  makeCanvas,
  opaqueBounds,
} from '@/lib/image/canvas';

export type ImageResult = {
  blob: Blob;
  width: number;
  height: number;
};

export type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function renderBlurredBackground(
  original: Blob,
  cutout: Blob,
  blur: number
): Promise<ImageResult> {
  const source = await loadBitmap(original);
  const foreground = await loadBitmap(cutout);
  try {
    const { canvas, ctx } = makeCanvas(source.width, source.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `blur(${blur}px)`;
    const pad = Math.max(2, blur * 2);
    ctx.drawImage(
      source,
      -pad,
      -pad,
      source.width + pad * 2,
      source.height + pad * 2
    );
    ctx.filter = 'none';
    ctx.drawImage(foreground, 0, 0);
    return {
      blob: await canvasToBlob(canvas),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    source.close();
    foreground.close();
  }
}

export async function renderWhiteBackground(
  cutout: Blob,
  {
    size,
    padding,
    shadow,
  }: { size: number; padding: number; shadow: boolean }
): Promise<ImageResult> {
  const foreground = await loadBitmap(cutout);
  try {
    const bounds = await opaqueBounds(foreground);
    if (!bounds) throw new Error('empty');
    const { canvas, ctx } = makeCanvas(size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const productWidth = bounds.right - bounds.left;
    const productHeight = bounds.bottom - bounds.top;
    const inner = size * (1 - padding * 2);
    const scale = Math.min(inner / productWidth, inner / productHeight);
    const drawWidth = productWidth * scale;
    const drawHeight = productHeight * scale;
    const x = (size - drawWidth) / 2;
    const y = (size - drawHeight) / 2;

    if (shadow) {
      ctx.save();
      ctx.filter = `blur(${Math.round(size * 0.012)}px)`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.beginPath();
      ctx.ellipse(
        size / 2,
        y + drawHeight - drawHeight * 0.015,
        drawWidth * 0.36,
        Math.max(10, drawHeight * 0.035),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    ctx.drawImage(
      foreground,
      bounds.left,
      bounds.top,
      productWidth,
      productHeight,
      x,
      y,
      drawWidth,
      drawHeight
    );

    return {
      blob: await canvasToBlob(canvas),
      width: size,
      height: size,
    };
  } finally {
    foreground.close();
  }
}

export async function renderFaceBlur(
  original: Blob,
  boxes: FaceBox[],
  blur: number
): Promise<ImageResult> {
  const source = await loadBitmap(original);
  try {
    const { canvas, ctx } = makeCanvas(source.width, source.height);
    ctx.drawImage(source, 0, 0);
    for (const box of boxes) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        (box.width / 2) * 1.1,
        (box.height / 2) * 1.15,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(source, 0, 0);
      ctx.restore();
    }
    return {
      blob: await canvasToBlob(canvas),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    source.close();
  }
}

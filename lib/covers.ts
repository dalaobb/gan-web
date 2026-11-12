export const COVER_FORMATS = [
  { id: 'blog', width: 1200, height: 630 },
  { id: 'youtube', width: 1280, height: 720 },
  { id: 'x', width: 1500, height: 500 },
] as const;

export const COVER_TEMPLATES = ['title', 'split', 'bleed', 'banner'] as const;

export type CoverFormat = (typeof COVER_FORMATS)[number];
export type CoverFormatId = CoverFormat['id'];
export type CoverTemplateId = (typeof COVER_TEMPLATES)[number];

const PAPER = '#f4f1ea';
const INK = '#1c1915';
const MUTED = '#6f685f';

export type CoverPaintInput = {
  format: CoverFormat;
  template: CoverTemplateId;
  title: string;
  subtitle: string;
  image: CanvasImageSource | null;
  fontFamily: string;
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    const parts = /\s/.test(paragraph)
      ? paragraph.split(/(\s+)/).filter((part) => part.length > 0)
      : [...paragraph];
    let line = '';
    for (const part of parts) {
      const next = line + part;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line.trimEnd());
        line = part.trimStart();
      } else {
        line = next;
      }
    }
    if (line.trim()) lines.push(line.trimEnd());
  }
  return lines.length ? lines : [''];
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const sourceWidth =
    'naturalWidth' in image && image.naturalWidth
      ? image.naturalWidth
      : 'width' in image
        ? Number(image.width)
        : width;
  const sourceHeight =
    'naturalHeight' in image && image.naturalHeight
      ? image.naturalHeight
      : 'height' in image
        ? Number(image.height)
        : height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawnWidth = sourceWidth * scale;
  const drawnHeight = sourceHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.drawImage(
    image,
    x + (width - drawnWidth) / 2,
    y + (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight
  );
  ctx.restore();
}

function drawTitleBlock(
  ctx: CanvasRenderingContext2D,
  input: {
    title: string;
    subtitle: string;
    fontFamily: string;
    x: number;
    y: number;
    width: number;
    height: number;
    align: 'left' | 'center';
    maxSize: number;
  }
) {
  const subtitle = input.subtitle.trim();
  const subSize = subtitle ? Math.max(22, Math.round(input.maxSize * 0.34)) : 0;
  const subGap = subtitle ? Math.round(subSize * 0.7) : 0;
  let size = input.maxSize;
  let lines = [input.title];
  const minSize = Math.max(28, Math.round(input.maxSize * 0.34));
  while (size > minSize) {
    ctx.font = `560 ${size}px ${input.fontFamily}`;
    lines = wrapLines(ctx, input.title, input.width).slice(0, 4);
    const lonelyTail = lines.length > 1 && [...lines[lines.length - 1]].length <= 1;
    const block = lines.length * size * 1.12 + subGap + (subtitle ? subSize * 1.3 : 0);
    if (block <= input.height && !lonelyTail) break;
    size -= 4;
  }
  const lineHeight = size * 1.12;
  ctx.font = `460 ${subSize}px ${input.fontFamily}`;
  const subLines = subtitle ? wrapLines(ctx, subtitle, input.width).slice(0, 2) : [];
  const total =
    lines.length * lineHeight + (subLines.length ? subGap + subLines.length * subSize * 1.3 : 0);
  let top = input.y + Math.max(0, (input.height - total) / 2);
  ctx.textBaseline = 'top';
  ctx.textAlign = input.align;
  ctx.fillStyle = INK;
  ctx.font = `560 ${size}px ${input.fontFamily}`;
  const textX = input.align === 'center' ? input.x + input.width / 2 : input.x;
  for (const line of lines) {
    ctx.fillText(line, textX, top);
    top += lineHeight;
  }
  if (!subLines.length) return;
  top += subGap;
  ctx.fillStyle = MUTED;
  ctx.font = `460 ${subSize}px ${input.fontFamily}`;
  for (const line of subLines) {
    ctx.fillText(line, textX, top);
    top += subSize * 1.3;
  }
}

export function paintCover(canvas: HTMLCanvasElement, input: CoverPaintInput) {
  const { width, height } = input.format;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pad = Math.round(Math.min(width, height) * 0.08);
  const title = input.title.trim() || ' ';
  const wide = width / height > 2.4;

  if (input.template === 'title') {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, width, height);
    drawTitleBlock(ctx, {
      title,
      subtitle: input.subtitle,
      fontFamily: input.fontFamily,
      x: pad,
      y: pad,
      width: width - pad * 2,
      height: height - pad * 2,
      align: 'center',
      maxSize: Math.round(Math.min(width * 0.09, height * 0.22)),
    });
    return;
  }

  if (input.template === 'split') {
    const textWidth = Math.round(width * 0.56);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, textWidth, height);
    if (input.image) {
      drawCoverImage(ctx, input.image, textWidth, 0, width - textWidth, height);
    } else {
      ctx.fillStyle = INK;
      ctx.fillRect(textWidth, 0, width - textWidth, height);
    }
    drawTitleBlock(ctx, {
      title,
      subtitle: input.subtitle,
      fontFamily: input.fontFamily,
      x: pad,
      y: pad,
      width: textWidth - pad * 2,
      height: height - pad * 2,
      align: 'left',
      maxSize: Math.round(Math.min(textWidth * 0.12, height * 0.18)),
    });
    return;
  }

  if (input.template === 'bleed') {
    if (input.image) {
      drawCoverImage(ctx, input.image, 0, 0, width, height);
    } else {
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, width, height);
    }
    const bar = Math.round(height * (wide ? 0.42 : 0.32));
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, height - bar, width, bar);
    drawTitleBlock(ctx, {
      title,
      subtitle: input.subtitle,
      fontFamily: input.fontFamily,
      x: pad,
      y: height - bar + pad * 0.6,
      width: width - pad * 2,
      height: bar - pad,
      align: 'left',
      maxSize: Math.round(Math.min(width * 0.07, bar * 0.42)),
    });
    return;
  }

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);
  const left = wide ? Math.round(width * 0.2) : pad;
  let right = width - pad;
  if (input.image) {
    const photoWidth = Math.round(width * (wide ? 0.3 : 0.36));
    drawCoverImage(ctx, input.image, width - photoWidth, 0, photoWidth, height);
    right = width - photoWidth - pad;
  }
  drawTitleBlock(ctx, {
    title,
    subtitle: input.subtitle,
    fontFamily: input.fontFamily,
    x: left,
    y: pad,
    width: Math.max(120, right - left),
    height: height - pad * 2,
    align: 'left',
    maxSize: Math.round(Math.min((right - left) * 0.14, height * 0.28)),
  });
}

export async function coverBlob(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
  if (!blob) throw new Error('cover export failed');
  return blob;
}

import type { FaceMetrics } from '@/lib/passport/face';
import type { PassportSpec } from '@/lib/passport/specs';

export type PassportAdjustments = {
  background: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export const SHEET_WIDTH = 1200;
export const SHEET_HEIGHT = 1800;
const SHEET_MARGIN = 24;
const SHEET_GAP = 12;

function canvas(width: number, height: number) {
  const node = document.createElement('canvas');
  node.width = width;
  node.height = height;
  const ctx = node.getContext('2d');
  if (!ctx) throw new Error('canvas');
  return { node, ctx };
}

function toBlob(node: HTMLCanvasElement, quality = 0.95) {
  return new Promise<Blob>((resolve, reject) => {
    node.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('encode'))),
      'image/jpeg',
      quality
    );
  });
}

function drawPhoto(
  image: ImageBitmap,
  metrics: FaceMetrics,
  spec: PassportSpec,
  adjustments: PassportAdjustments
) {
  const { node, ctx } = canvas(spec.width, spec.height);
  const scale =
    (spec.headTarget * adjustments.zoom) / Math.max(1, metrics.headHeight);
  const cropWidth = spec.width / scale;
  const cropHeight = spec.height / scale;
  const cropLeft =
    metrics.eyeX - (spec.width / 2 + adjustments.offsetX) / scale;
  const topMargin = spec.topMargin ?? Math.round(spec.height * 0.06);
  const eyeCropTop =
    metrics.eyeY - (spec.eyeTarget + adjustments.offsetY) / scale;
  const topCropTop =
    metrics.crownY - (topMargin + adjustments.offsetY) / scale;
  const cropTop = Math.min(eyeCropTop, topCropTop);

  ctx.fillStyle = adjustments.background;
  ctx.fillRect(0, 0, spec.width, spec.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    spec.width,
    spec.height
  );

  return node;
}

function drawSheet(photo: HTMLCanvasElement, spec: PassportSpec) {
  const { node, ctx } = canvas(SHEET_WIDTH, SHEET_HEIGHT);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SHEET_WIDTH, SHEET_HEIGHT);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const cols = spec.sheetCols ?? 2;
  const rows = spec.sheetRows ?? 3;
  const availableWidth =
    SHEET_WIDTH - SHEET_MARGIN * 2 - SHEET_GAP * (cols - 1);
  const availableHeight =
    SHEET_HEIGHT - SHEET_MARGIN * 2 - SHEET_GAP * (rows - 1);
  const cellScale = Math.min(
    1,
    availableWidth / (spec.width * cols),
    availableHeight / (spec.height * rows)
  );
  const width = spec.width * cellScale;
  const height = spec.height * cellScale;
  const startX =
    (SHEET_WIDTH - (width * cols + SHEET_GAP * (cols - 1))) / 2;
  const startY =
    (SHEET_HEIGHT - (height * rows + SHEET_GAP * (rows - 1))) / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      ctx.drawImage(
        photo,
        startX + col * (width + SHEET_GAP),
        startY + row * (height + SHEET_GAP),
        width,
        height
      );
    }
  }

  return node;
}

export async function renderPassport(
  cutout: Blob,
  metrics: FaceMetrics,
  spec: PassportSpec,
  adjustments: PassportAdjustments
) {
  const image = await createImageBitmap(cutout);
  try {
    const photo = drawPhoto(image, metrics, spec, adjustments);
    const sheet = drawSheet(photo, spec);
    return {
      photo: await toBlob(photo),
      sheet: await toBlob(sheet),
    };
  } finally {
    image.close();
  }
}

import { PDFDocument } from 'pdf-lib';
import { normalizePortrait } from '@/lib/passport/normalize';
import { canvasToBlob, loadBitmap, makeCanvas } from '@/lib/image/canvas';

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 24;

export async function imagesToPdf(
  files: File[],
  onProgress?: (current: number, total: number) => void
) {
  const pdf = await PDFDocument.create();

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const input = await normalizePortrait(file);
    const bitmap = await loadBitmap(input);
    try {
      const { canvas, ctx } = makeCanvas(bitmap.width, bitmap.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);
      const jpeg = await canvasToBlob(canvas, 'image/jpeg', 0.92);
      const image = await pdf.embedJpg(await jpeg.arrayBuffer());

      const landscape = bitmap.width > bitmap.height;
      const width = landscape ? A4.height : A4.width;
      const height = landscape ? A4.width : A4.height;
      const page = pdf.addPage([width, height]);
      const maxWidth = width - MARGIN * 2;
      const maxHeight = height - MARGIN * 2;
      const scale = Math.min(
        maxWidth / bitmap.width,
        maxHeight / bitmap.height
      );
      const drawWidth = bitmap.width * scale;
      const drawHeight = bitmap.height * scale;
      page.drawImage(image, {
        x: (width - drawWidth) / 2,
        y: (height - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });
    } finally {
      bitmap.close();
      onProgress?.(index + 1, files.length);
    }
  }

  const bytes = await pdf.save();
  const base =
    (files[0]?.name.replace(/\.[^.]+$/, '') || 'images') + '_BgGone.pdf';
  return {
    blob: new Blob([bytes.slice().buffer as ArrayBuffer], {
      type: 'application/pdf',
    }),
    name: base,
  };
}

import { canvasToBlob, makeCanvas } from '@/lib/image/canvas';

export type PdfPageImage = {
  id: string;
  blob: Blob;
  url: string;
  name: string;
  width: number;
  height: number;
};

const PDFJS_ASSETS_URL = 'https://cdn.bgg.one/pdfjs/6.5.438';

export async function pdfToImages(
  file: File,
  format: 'jpeg' | 'png',
  onProgress?: (current: number, total: number) => void
) {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.min.mjs';

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({
    data,
    cMapUrl: `${PDFJS_ASSETS_URL}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${PDFJS_ASSETS_URL}/standard_fonts/`,
  });
  const document = await loadingTask.promise;
  const base = file.name.replace(/\.pdf$/i, '') || 'document';
  const type = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';
  const pages: PdfPageImage[] = [];

  try {
    for (let index = 1; index <= document.numPages; index += 1) {
      const page = await document.getPage(index);
      const viewport = page.getViewport({ scale: 2 });
      const width = Math.max(1, Math.ceil(viewport.width));
      const height = Math.max(1, Math.ceil(viewport.height));
      const { canvas, ctx } = makeCanvas(width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      const blob = await canvasToBlob(canvas, type, 0.92);
      pages.push({
        id: `${index}`,
        blob,
        url: URL.createObjectURL(blob),
        name: `${base}-page-${index}.${ext}`,
        width,
        height,
      });
      page.cleanup();
      onProgress?.(index, document.numPages);
    }
  } finally {
    await loadingTask.destroy();
  }

  return pages;
}

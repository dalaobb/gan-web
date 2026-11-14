'use client';

import { useEffect, useId, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import { pdfToImages, type PdfPageImage } from '@/lib/pdf/pdf-to-images';
import OutputRow from '@/components/OutputRow';
import CompressCompareStage from '@/components/CompressCompareStage';

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function PdfToImagesDesk({
  lang,
  heading,
  lead,
}: {
  lang: Lang;
  heading: string;
  lead: string;
}) {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [pages, setPages] = useState<PdfPageImage[]>([]);
  const [running, setRunning] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    return () => urls.current.forEach(revoke);
  }, []);

  function clearPages() {
    pages.forEach((page) => revoke(page.url));
    setPages([]);
    setPreviewId(null);
  }

  function takeFile(selected?: File | null) {
    if (!selected) return;
    if (
      selected.type !== 'application/pdf' &&
      !/\.pdf$/i.test(selected.name)
    ) {
      return;
    }
    clearPages();
    setFile(selected);
    setError('');
  }

  async function convert() {
    if (!file || running) return;
    setRunning(true);
    setError('');
    clearPages();
    setProgress({ current: 0, total: 1 });
    try {
      const next = await pdfToImages(file, format, (current, total) =>
        setProgress({ current, total })
      );
      for (const page of next) urls.current.push(page.url);
      if (!next.length) {
        setError(t(lang, 'pdfNoPages'));
      } else {
        setPages(next);
      }
    } catch (reason) {
      console.error(reason);
      setError(t(lang, 'pdfLoadFailed'));
    } finally {
      setRunning(false);
      setProgress(null);
    }
  }

  async function downloadAll() {
    if (!pages.length || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const page of pages) zip.file(page.name, page.blob);
      FileSaver.saveAs(
        await zip.generateAsync({ type: 'blob' }),
        'BgGone-pdf-pages.zip'
      );
    } catch (reason) {
      console.error(reason);
    } finally {
      setZipping(false);
    }
  }

  const previewItems = pages.map((page) => ({
    id: page.id,
    file: new File([page.blob], page.name, { type: page.blob.type }),
    preview: page.url,
    width: page.width,
    height: page.height,
  }));

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{heading}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{lead}</p>
      </header>

      <div className="main-width">
        <div className="glass-effect p-4">
          <input
            id={inputId}
            type="file"
            accept="application/pdf,.pdf"
            className="h-0 opacity-0"
            disabled={running}
            onChange={(event) => {
              takeFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <label
            htmlFor={inputId}
            className="drop-zone flex min-h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (!running) takeFile(event.dataTransfer.files?.[0]);
            }}
          >
            {file ? (
              <div className="bg-(--paper) px-8 py-6">
                <p className="font-display text-2xl leading-tight text-(--ink)">
                  {file.name}
                </p>
                <p className="mt-2 text-sm text-(--muted-ink)">
                  {formatFileSize(file.size)}
                </p>
              </div>
            ) : (
              <div className="bg-(--paper) px-8 py-6">
                <p className="font-display text-3xl leading-tight text-(--ink)">
                  {t(lang, 'pdfOpen')}
                </p>
                <p className="mt-3 text-sm text-(--muted-ink)">
                  {t(lang, 'pdfDropHint')}
                </p>
              </div>
            )}
          </label>
          <p className="mt-3 text-sm text-(--muted-ink)">
            {t(lang, 'pdfToImagesNote')}
          </p>
        </div>

        <div className="glass-effect mt-4 flex flex-wrap items-center justify-between gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-(--muted-ink)">
              {t(lang, 'pdfOutputFormat')}
            </span>
            {(['jpeg', 'png'] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={format === item}
                disabled={running}
                className={
                  format === item
                    ? 'border border-(--ink) px-3 py-2 text-sm'
                    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)'
                }
                onClick={() => setFormat(item)}
              >
                {t(lang, item === 'png' ? 'compressPng' : 'compressJpeg')}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-solid"
              disabled={!file || running}
              onClick={convert}
            >
              {running && progress
                ? t(lang, 'compressProgress', {
                    current: String(progress.current),
                    total: String(progress.total),
                  })
                : t(lang, 'convertPdf')}
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            {pages.length ? (
              <span className="text-sm text-(--muted-ink)">
                {t(lang, 'pdfPageCount', { count: String(pages.length) })}
              </span>
            ) : null}
            {pages.length > 0 ? (
              <button
                type="button"
                className="btn btn-line"
                disabled={zipping}
                onClick={downloadAll}
              >
                {zipping ? t(lang, 'processing') : t(lang, 'downloadAllZip')}
              </button>
            ) : null}
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-(--muted-ink)">{error}</p> : null}

        {pages.length ? (
          <div className="mt-4">
            <h2 className="font-display text-2xl">
              {t(lang, 'pdfPagesTitle')}
            </h2>
            <ul className="mt-3 space-y-2">
              {pages.map((page) => (
                <OutputRow
                  key={page.id}
                  lang={lang}
                  name={page.name}
                  blob={page.blob}
                  url={page.url}
                  width={page.width}
                  height={page.height}
                  onPreview={() => setPreviewId(page.id)}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {previewId && previewItems.length ? (
        <CompressCompareStage
          items={previewItems}
          lang={lang}
          initialId={previewId}
          compare={false}
          title={t(lang, 'preview')}
          onClose={() => setPreviewId(null)}
        />
      ) : null}
    </div>
  );
}

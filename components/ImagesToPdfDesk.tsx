'use client';

import { useEffect, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import { imagesToPdf } from '@/lib/pdf/images-to-pdf';
import UploadBox from '@/components/tools/UploadBox';
import FileListRow from '@/components/FileListRow';

type Item = {
  id: string;
  file: File;
  preview: string;
};

type Result = {
  blob: Blob;
  url: string;
  name: string;
};

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function ImagesToPdfDesk({
  lang,
  heading,
  lead,
}: {
  lang: Lang;
  heading: string;
  lead: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const urls = useRef<string[]>([]);

  useEffect(() => {
    return () => urls.current.forEach(revoke);
  }, []);

  function clearResult() {
    setResult((current) => {
      if (current) revoke(current.url);
      return null;
    });
  }

  function addFiles(files: File[]) {
    const picked = files.filter(
      (file) => file.type.startsWith('image/') || /\.hei[cf]$/i.test(file.name)
    );
    if (!picked.length) return;
    clearResult();
    const next = picked.map((file) => {
      const preview = URL.createObjectURL(file);
      urls.current.push(preview);
      return { id: crypto.randomUUID(), file, preview };
    });
    setItems((current) => [...current, ...next]);
  }

  function removeItem(id: string) {
    clearResult();
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) revoke(item.preview);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function move(index: number, direction: -1 | 1) {
    clearResult();
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function createPdf() {
    if (running || !items.length) return;
    setRunning(true);
    setProgress({ current: 0, total: items.length });
    setError('');
    clearResult();
    try {
      const next = await imagesToPdf(
        items.map((item) => item.file),
        (current, total) => setProgress({ current, total })
      );
      const url = URL.createObjectURL(next.blob);
      urls.current.push(url);
      setResult({ blob: next.blob, url, name: next.name });
    } catch (reason) {
      console.error(reason);
      setError(t(lang, 'toolFailed'));
    } finally {
      setRunning(false);
      setProgress(null);
    }
  }

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{heading}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{lead}</p>
      </header>

      <div className="main-width">
        <UploadBox
          lang={lang}
          preview=""
          busy={running}
          multiple
          onFiles={addFiles}
        />
        <p className="mt-3 text-sm text-(--muted-ink)">
          {t(lang, 'pdfImagesNote')}
        </p>

        {items.length ? (
          <div className="glass-effect mt-4 flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-solid"
                disabled={running}
                onClick={createPdf}
              >
                {running && progress
                  ? t(lang, 'compressProgress', {
                      current: String(progress.current),
                      total: String(progress.total),
                    })
                  : t(lang, 'createPdf')}
              </button>
              <button
                type="button"
                className="btn btn-line"
                disabled={running}
                onClick={() => {
                  clearResult();
                  items.forEach((item) => revoke(item.preview));
                  setItems([]);
                }}
              >
                {t(lang, 'clear')}
              </button>
            </div>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <span className="text-sm text-(--muted-ink)">
                {t(lang, 'pdfPageCount', { count: String(items.length) })}
              </span>
              {result ? (
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={() => FileSaver.saveAs(result.blob, result.name)}
                >
                  {t(lang, 'download')} PDF
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-(--muted-ink)">{error}</p> : null}

        {result ? (
          <div className="glass-effect mt-4 flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{result.name}</p>
              <p className="mt-1 text-sm text-(--muted-ink)">
                {formatFileSize(result.blob.size)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => FileSaver.saveAs(result.blob, result.name)}
            >
              {t(lang, 'download')}
            </button>
          </div>
        ) : null}

        {items.length ? (
          <ul className="mt-4 space-y-2">
            {items.map((item, index) => (
              <FileListRow
                key={item.id}
                onRemove={() => removeItem(item.id)}
                removeLabel={t(lang, 'remove')}
                removeDisabled={running}
                thumbnail={
                  <img
                    src={item.preview}
                    alt=""
                    className="h-14 w-14 shrink-0 border border-(--line) object-cover"
                  />
                }
                actions={
                  <>
                    <button
                      type="button"
                      className="btn btn-line"
                      disabled={running || index === 0}
                      onClick={() => move(index, -1)}
                      aria-label={t(lang, 'moveUp')}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-line"
                      disabled={running || index === items.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label={t(lang, 'moveDown')}
                    >
                      ↓
                    </button>
                  </>
                }
              >
                <p className="truncate text-sm">{item.file.name}</p>
                <p className="mt-1 text-sm text-(--muted-ink)">
                  {formatFileSize(item.file.size)}
                </p>
              </FileListRow>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

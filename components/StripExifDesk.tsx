'use client';

import { useEffect, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import { stripMetadata } from '@/lib/image/strip';
import { readMetadata, type MetadataSummary } from '@/lib/image/metadata';
import UploadBox from '@/components/tools/UploadBox';
import CompressCompareStage from '@/components/CompressCompareStage';

type Result = {
  blob: Blob;
  url: string;
  name: string;
  width: number;
  height: number;
};

type Item = {
  id: string;
  file: File;
  preview: string;
  status: 'ready' | 'working' | 'done' | 'error';
  metadata?: MetadataSummary;
  cleaned?: MetadataSummary;
  result?: Result;
};

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

function savedPercent(before: number, after: number) {
  if (before <= 0) return 0;
  return Math.max(0, Math.round((1 - after / before) * 100));
}

function grewPercent(before: number, after: number) {
  if (before <= 0) return 0;
  return Math.max(0, Math.round((after / before - 1) * 100));
}

function uniqueName(name: string, used: Set<string>) {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let index = 2;
  while (used.has(`${base}-${index}${ext}`)) index += 1;
  const next = `${base}-${index}${ext}`;
  used.add(next);
  return next;
}

export default function StripExifDesk({
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
  const [zipping, setZipping] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState('');
  const urls = useRef<string[]>([]);

  useEffect(() => {
    return () => urls.current.forEach(revoke);
  }, []);

  function addFiles(files: File[]) {
    const picked = files.filter(
      (file) => file.type.startsWith('image/') || /\.hei[cf]$/i.test(file.name)
    );
    if (!picked.length) return;
    const next = picked.map((file) => {
      const preview = URL.createObjectURL(file);
      urls.current.push(preview);
      return {
        id: crypto.randomUUID(),
        file,
        preview,
        status: 'ready' as const,
      };
    });
    setItems((current) => [...current, ...next]);
    for (const item of next) {
      void readMetadata(item.file).then((metadata) => {
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, metadata } : entry
          )
        );
      });
    }
  }

  function removeItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (item) {
      revoke(item.preview);
      if (item.result) revoke(item.result.url);
      if (previewId === id) setPreviewId(null);
    }
    setItems((current) => current.filter((entry) => entry.id !== id));
  }

  function clearAll() {
    for (const item of items) {
      revoke(item.preview);
      if (item.result) revoke(item.result.url);
    }
    setItems([]);
    setPreviewId(null);
  }

  async function stripAll() {
    if (running || !items.length) return;
    setRunning(true);
    const queue = items;
    for (const item of queue) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: 'working' } : entry
        )
      );
      try {
        const result = await stripMetadata(item.file);
        const cleaned = await readMetadata(result.blob);
        const url = URL.createObjectURL(result.blob);
        urls.current.push(url);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: 'done',
                  result: { ...result, url },
                  cleaned,
                }
              : entry
          )
        );
      } catch (error) {
        console.error(error);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: 'error' } : entry
          )
        );
      }
    }
    setRunning(false);
  }

  function finishedItems() {
    return items.filter(
      (item) => item.status === 'done' && item.result
    ) as (Item & { result: Result })[];
  }

  function downloadEach() {
    const done = finishedItems();
    if (!done.length) return;
    const used = new Set<string>();
    for (const item of done) {
      FileSaver.saveAs(item.result.blob, uniqueName(item.result.name, used));
    }
  }

  async function downloadAll() {
    const done = finishedItems();
    if (!done.length || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (const item of done) {
        zip.file(uniqueName(item.result.name, used), item.result.blob);
      }
      FileSaver.saveAs(
        await zip.generateAsync({ type: 'blob' }),
        'BgGone-clean-metadata.zip'
      );
    } catch (error) {
      console.error(error);
    } finally {
      setZipping(false);
    }
  }

  async function copyResult(item: Item, result: Result) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [result.blob.type]: result.blob }),
      ]);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(''), 1200);
    } catch (error) {
      console.error(error);
      alert(t(lang, 'copyFailed'));
    }
  }

  const doneCount = items.filter((item) => item.status === 'done').length;
  const previewItem = items.find((item) => item.id === previewId) ?? null;
  const previewItems = previewItem
    ? [
        {
          id: previewItem.id,
          file: previewItem.file,
          preview: previewItem.preview,
          result: previewItem.result?.blob,
          resultName: previewItem.result?.name,
          width: previewItem.result?.width,
          height: previewItem.result?.height,
        },
      ]
    : [];

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{heading}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{lead}</p>
      </header>

      <div className="main-width">
        <div className="glass-effect p-4">
          <UploadBox
            lang={lang}
            preview=""
            busy={running}
            multiple
            onFiles={addFiles}
          />
          <p className="mt-3 text-sm text-(--muted-ink)">
            {t(lang, 'exifNote')}
          </p>
        </div>
      </div>

      {items.length ? (
        <div className="glass-effect main-width mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-solid"
              disabled={running || !items.length}
              onClick={stripAll}
            >
              {running ? t(lang, 'processing') : t(lang, 'exifStart')}
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={running || !items.length}
              onClick={clearAll}
            >
              {t(lang, 'clear')}
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <span className="text-sm text-(--muted-ink)">
              {t(lang, 'selected')} {items.length}
            </span>
            {doneCount > 0 ? (
              <button
                type="button"
                className="btn btn-line"
                disabled={running || zipping}
                onClick={downloadEach}
              >
                {t(lang, 'download')}
              </button>
            ) : null}
            {doneCount > 0 ? (
              <button
                type="button"
                className="btn btn-line"
                disabled={running || zipping}
                onClick={downloadAll}
              >
                {zipping ? t(lang, 'processing') : t(lang, 'downloadAllZip')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {items.length ? (
        <ul className="main-width mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`glass-effect flex flex-wrap items-center gap-3 p-3 ${
                item.status === 'working' ? 'processing' : ''
              }`}
            >
              <img
                src={item.result?.url ?? item.preview}
                alt=""
                className="h-14 w-14 shrink-0 border border-(--line) bg-white object-cover"
              />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate text-sm">
                  {item.result?.name ?? item.file.name}
                </p>
                <p className="mt-1 text-sm text-(--muted-ink)">
                  {item.status === 'working'
                    ? t(lang, 'processing')
                    : item.status === 'error'
                      ? t(lang, 'toolFailed')
                      : item.result
                        ? t(
                            lang,
                            item.result.blob.size > item.file.size
                              ? 'compressGrew'
                              : 'compressSaved',
                            {
                              before: formatFileSize(item.file.size),
                              after: formatFileSize(item.result.blob.size),
                              pct: String(
                                item.result.blob.size > item.file.size
                                  ? grewPercent(
                                      item.file.size,
                                      item.result.blob.size
                                    )
                                  : savedPercent(
                                      item.file.size,
                                      item.result.blob.size
                                    )
                              ),
                            }
                          )
                        : formatFileSize(item.file.size)}
                  {item.result
                    ? ` · ${item.result.width}×${item.result.height}`
                    : null}
                </p>
                <p className="mt-1 text-xs text-(--muted-ink)">
                  {item.cleaned && item.result
                    ? item.cleaned.hasAny
                      ? t(lang, 'metadataStill')
                      : item.metadata?.hasAny
                        ? t(lang, 'metadataRemoved')
                        : t(lang, 'metadataNone')
                    : item.metadata
                      ? item.metadata.hasAny
                        ? t(lang, 'metadataFound', {
                            count: String(item.metadata.fields),
                          })
                        : t(lang, 'metadataNone')
                      : t(lang, 'metadataChecking')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={() => setPreviewId(item.id)}
                >
                  {t(lang, 'preview')}
                </button>
                {item.result ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-line"
                      onClick={() => copyResult(item, item.result!)}
                    >
                      {copiedId === item.id
                        ? t(lang, 'copied')
                        : t(lang, 'copy')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={() =>
                        FileSaver.saveAs(item.result!.blob, item.result!.name)
                      }
                    >
                      {t(lang, 'save')}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="flex h-7 w-7 shrink-0 items-center justify-center border border-(--line)"
                  disabled={running}
                  onClick={() => removeItem(item.id)}
                  aria-label={t(lang, 'compressClose')}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {previewItem && previewItems.length ? (
        <CompressCompareStage
          items={previewItems}
          lang={lang}
          initialId={previewItem.id}
          compare={!!previewItem.result}
          title={t(lang, 'preview')}
          outputLabel={t(lang, 'exifOutput')}
          onClose={() => setPreviewId(null)}
        />
      ) : null}
    </div>
  );
}

'use client';

import { useEffect, useId, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import type { CompressJob, CompressReply, OutputFormat, QualityId } from '@/lib/compress/protocol';
import { t, type Lang } from '@/lib/i18n';
import CompressCompareStage from '@/components/CompressCompareStage';

const FORMATS: OutputFormat[] = ['keep', 'jpeg', 'webp', 'png'];
const QUALITIES: QualityId[] = ['smaller', 'balanced', 'high'];
const EDGES = [0, 2560, 1920, 1280, 1024, 512] as const;

const FORMAT_KEY = {
  keep: 'compressKeep',
  jpeg: 'compressJpeg',
  webp: 'compressWebp',
  png: 'compressPng',
} as const;

const QUALITY_KEY = {
  smaller: 'compressSmaller',
  balanced: 'compressBalanced',
  high: 'compressHigh',
} as const;

type Item = {
  id: string;
  file: File;
  preview: string;
  status: 'ready' | 'working' | 'done' | 'error';
  result?: Blob;
  resultName?: string;
  width?: number;
  height?: number;
};

function chip(on: boolean) {
  return on
    ? 'border border-(--ink) px-3 py-2 text-sm'
    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)';
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? mb.toFixed(0) : mb.toFixed(1)} MB`;
}

function savedPercent(before: number, after: number) {
  if (before <= 0) return 0;
  return Math.max(0, Math.round((1 - after / before) * 100));
}

function CompressRow({
  item,
  lang,
  onClose,
  onPreview,
}: {
  item: Item;
  lang: Lang;
  onClose: () => void;
  onPreview: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const name =
    item.status === 'done' && item.resultName
      ? item.resultName
      : item.file.name || t(lang, 'compressTitle');

  async function pngBlob(blob: Blob) {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
    bitmap.close();
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('png');
    return png;
  }

  async function copyFile() {
    if (!item.result) return;
    const blob = item.result;
    const type = blob.type === 'image/png' || blob.type === 'image/jpeg' ? blob.type : 'image/png';
    const data = type === blob.type ? blob : pngBlob(blob);
    try {
      await navigator.clipboard.write([new ClipboardItem({ [type]: data })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error(err);
      alert(t(lang, 'copyFailed'));
    }
  }

  return (
    <li
      className={`glass-effect flex flex-wrap items-center gap-3 p-3 ${
        item.status === 'working' ? 'processing' : ''
      }`}
    >
      <img src={item.preview} alt="" className="h-14 w-14 shrink-0 border border-(--line) object-cover" />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm">{name}</p>
        <p className="mt-1 text-sm text-(--muted-ink)">
          {item.status === 'working' ? t(lang, 'processing') : null}
          {item.status === 'error' ? t(lang, 'compressFailed') : null}
          {item.status === 'ready' ? formatBytes(item.file.size) : null}
          {item.status === 'done' && item.result
            ? t(lang, 'compressSaved', {
                before: formatBytes(item.file.size),
                after: formatBytes(item.result.size),
                pct: String(savedPercent(item.file.size, item.result.size)),
              })
            : null}
          {item.status === 'done' && item.width && item.height
            ? ` · ${item.width}×${item.height}`
            : null}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-line" onClick={onPreview}>
          {t(lang, 'preview')}
        </button>
        {item.result && item.resultName ? (
          <>
            <button type="button" className="btn btn-line" onClick={copyFile}>
              {copied ? t(lang, 'copied') : t(lang, 'copy')}
            </button>
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => FileSaver.saveAs(item.result as Blob, item.resultName)}
            >
              {t(lang, 'save')}
            </button>
          </>
        ) : null}
      </div>
      <button
        type="button"
        className="flex h-7 w-7 shrink-0 items-center justify-center border border-(--line)"
        onClick={onClose}
        aria-label={t(lang, 'compressClose')}
      >
        ×
      </button>
    </li>
  );
}

export default function CompressDesk({ lang }: { lang: Lang }) {
  const fileInputId = useId();
  const dropRef = useRef<HTMLLabelElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const mainRef = useRef(false);
  const jobsRef = useRef(new Map<number, (reply: CompressReply) => void>());
  const jobId = useRef(0);
  const runRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<OutputFormat>('keep');
  const [quality, setQuality] = useState<QualityId>('balanced');
  const [maxEdge, setMaxEdge] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [message, setMessage] = useState('');
  const [previewId, setPreviewId] = useState<string>();

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      for (const item of items) URL.revokeObjectURL(item.preview);
    };
    // Revoke the previews held at unmount. Later additions are revoked in replaceItems.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((entry) => entry.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function replaceItems(next: Item[]) {
    setItems((current) => {
      const keep = new Set(next.map((item) => item.preview));
      for (const item of current) {
        if (!keep.has(item.preview)) URL.revokeObjectURL(item.preview);
      }
      return next;
    });
  }

  function takeFiles(files?: FileList | File[] | null) {
    if (running || !files?.length) return;
    const images = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!images.length) return;
    setMessage('');
    replaceItems(
      images.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'ready',
      }))
    );
  }

  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;

    function dragOverEvent(event: DragEvent) {
      event.preventDefault();
      drop?.classList.add('drag-over');
      setDragging(true);
    }
    function dragLeaveEvent(event: DragEvent) {
      event.preventDefault();
      const next = event.relatedTarget;
      if (next instanceof Node && drop?.contains(next)) return;
      drop?.classList.remove('drag-over');
      setDragging(false);
    }
    function dropEvent(event: DragEvent) {
      event.preventDefault();
      drop?.classList.remove('drag-over');
      setDragging(false);
      takeFiles(event.dataTransfer?.files);
    }

    drop.addEventListener('dragover', dragOverEvent);
    drop.addEventListener('dragleave', dragLeaveEvent);
    drop.addEventListener('drop', dropEvent);
    return () => {
      drop.removeEventListener('dragover', dragOverEvent);
      drop.removeEventListener('dragleave', dragLeaveEvent);
      drop.removeEventListener('drop', dropEvent);
    };
  });

  useEffect(() => {
    function pasteEvent(event: ClipboardEvent) {
      const pasted: File[] = [];
      const list = event.clipboardData?.items;
      for (let i = 0; list && i < list.length; i++) {
        const file = list[i].getAsFile();
        if (file && file.type.startsWith('image/')) pasted.push(file);
      }
      takeFiles(pasted);
    }
    document.documentElement.addEventListener('paste', pasteEvent);
    return () => document.documentElement.removeEventListener('paste', pasteEvent);
  });

  function worker() {
    if (workerRef.current) return workerRef.current;
    const next = new Worker(new URL('../lib/compress/worker.ts', import.meta.url));
    next.onmessage = (event: MessageEvent<CompressReply>) => {
      const pending = jobsRef.current.get(event.data.id);
      if (!pending) return;
      jobsRef.current.delete(event.data.id);
      pending(event.data);
    };
    next.onerror = () => {
      for (const [id, pending] of jobsRef.current) {
        pending({ id, ok: false, message: 'worker' });
      }
      jobsRef.current.clear();
    };
    workerRef.current = next;
    return next;
  }

  async function compressHere(item: Item, runFormat: OutputFormat, runQuality: QualityId, runEdge: number) {
    const { compressImage } = await import('@/lib/compress/engine');
    const result = await compressImage({
      bytes: await item.file.arrayBuffer(),
      mime: item.file.type,
      name: item.file.name || 'image',
      format: runFormat,
      quality: runQuality,
      maxEdge: runEdge,
    });
    return result;
  }

  async function compressOne(item: Item, runFormat: OutputFormat, runQuality: QualityId, runEdge: number) {
    if (mainRef.current) return compressHere(item, runFormat, runQuality, runEdge);

    const bytes = await item.file.arrayBuffer();
    const id = ++jobId.current;
    const job: CompressJob = {
      id,
      bytes,
      mime: item.file.type,
      name: item.file.name || 'image',
      format: runFormat,
      quality: runQuality,
      maxEdge: runEdge,
    };

    let reply: CompressReply;
    try {
      reply = await new Promise((resolve) => {
        jobsRef.current.set(id, resolve);
        worker().postMessage(job, [job.bytes]);
      });
    } catch {
      mainRef.current = true;
      return compressHere(item, runFormat, runQuality, runEdge);
    }

    if (!reply.ok && reply.message === 'worker') {
      mainRef.current = true;
      workerRef.current?.terminate();
      workerRef.current = null;
      return compressHere(item, runFormat, runQuality, runEdge);
    }
    if (!reply.ok) throw new Error(reply.message);
    return reply;
  }

  async function compressAll() {
    if (running || !items.length) return;
    const run = ++runRef.current;
    const runFormat = format;
    const runQuality = quality;
    const runEdge = maxEdge;
    setRunning(true);
    setMessage('');

    for (const item of items) {
      if (runRef.current !== run) break;
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: 'working' } : entry
        )
      );
      try {
        const result = await compressOne(item, runFormat, runQuality, runEdge);
        if (runRef.current !== run) break;
        const blob = new Blob([result.bytes], { type: result.mime });
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: 'done',
                  result: blob,
                  resultName: result.name,
                  width: result.width,
                  height: result.height,
                }
              : entry
          )
        );
      } catch (error) {
        console.error(error);
        if (runRef.current !== run) break;
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: 'error' } : entry
          )
        );
      }
    }

    if (runRef.current === run) setRunning(false);
  }

  function finishedItems() {
    return items.filter((item) => item.status === 'done' && item.result && item.resultName);
  }

  function uniqueName(name: string, used: Set<string>) {
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    let n = 2;
    while (used.has(`${base}-${n}${ext}`)) n += 1;
    const next = `${base}-${n}${ext}`;
    used.add(next);
    return next;
  }

  function downloadEach() {
    const done = finishedItems();
    if (!done.length) return;
    const used = new Set<string>();
    for (const item of done) {
      FileSaver.saveAs(item.result as Blob, uniqueName(item.resultName || 'image', used));
    }
  }

  async function downloadAll() {
    const done = finishedItems();
    if (!done.length) return;
    setZipping(true);
    setMessage('');
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (const item of done) {
        zip.file(uniqueName(item.resultName || 'image', used), item.result as Blob);
      }
      FileSaver.saveAs(await zip.generateAsync({ type: 'blob' }), 'compressed.zip');
    } catch {
      setMessage(t(lang, 'failedPackage'));
    } finally {
      setZipping(false);
    }
  }

  const doneCount = items.filter((item) => item.status === 'done').length;

  return (
    <div className="pt-12 pb-16">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{t(lang, 'compressTitle')}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{t(lang, 'compressLead')}</p>
      </header>

      <div className="main-width">
        <div className="relative m-auto h-64 text-sm sm:h-72 md:h-80">
          <input
            type="file"
            accept="image/*"
            multiple
            id={fileInputId}
            className="h-0 opacity-0"
            disabled={running}
            onChange={(event) => {
              takeFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <label
            ref={dropRef}
            htmlFor={fileInputId}
            className="drop-zone absolute inset-0 flex cursor-pointer items-center justify-center border-2 border-dashed text-center"
          >
            <div className="bg-(--paper) px-8 py-6">
              <p className="font-display text-4xl leading-none tracking-tight text-(--ink) sm:text-5xl">
                {dragging ? t(lang, 'dropRelease') : t(lang, 'dropTitle')}
              </p>
              <p className="mt-3 text-sm text-(--muted-ink)">{t(lang, 'dropHint')}</p>
            </div>
          </label>
        </div>
      </div>

      <div className="glass-effect main-width mt-5 p-4">
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === format}
              disabled={running}
              className={chip(item === format)}
              onClick={() => setFormat(item)}
            >
              {t(lang, FORMAT_KEY[item])}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUALITIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === quality}
              disabled={running}
              className={chip(item === quality)}
              onClick={() => setQuality(item)}
            >
              {t(lang, QUALITY_KEY[item])}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EDGES.map((edge) => (
            <button
              key={edge}
              type="button"
              aria-pressed={edge === maxEdge}
              disabled={running}
              className={chip(edge === maxEdge)}
              onClick={() => setMaxEdge(edge)}
            >
              {edge === 0 ? t(lang, 'compressEdgeOriginal') : t(lang, 'compressEdge', { edge: String(edge) })}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-(--muted-ink)">{t(lang, 'compressPngNote')}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-solid"
              disabled={running || !items.length}
              onClick={compressAll}
            >
              {running ? t(lang, 'processing') : t(lang, 'compressStart')}
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={running || !items.length}
              onClick={() => {
                runRef.current += 1;
                setRunning(false);
                replaceItems([]);
                setMessage('');
                setPreviewId(undefined);
              }}
            >
              {t(lang, 'clear')}
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            {items.length ? (
              <span className="text-sm text-(--muted-ink)">
                {t(lang, 'selected')} {items.length}
              </span>
            ) : null}
            {doneCount > 0 ? (
              <button type="button" className="btn btn-line" disabled={zipping || running} onClick={downloadEach}>
                {t(lang, 'download')}
              </button>
            ) : null}
            {doneCount > 1 ? (
              <button type="button" className="btn btn-line" disabled={zipping || running} onClick={downloadAll}>
                {t(lang, 'downloadAllZip')}
              </button>
            ) : null}
          </div>
        </div>
        {message ? <p className="mt-3 text-sm text-(--muted-ink)">{message}</p> : null}
      </div>

      {items.length ? (
        <ul className="main-width mt-4 space-y-2">
          {items.map((item) => (
            <CompressRow
              key={item.id}
              item={item}
              lang={lang}
              onClose={() => removeItem(item.id)}
              onPreview={() => setPreviewId(item.id)}
            />
          ))}
        </ul>
      ) : null}
      {previewId && items.length ? (
        <CompressCompareStage
          lang={lang}
          initialId={items.some((item) => item.id === previewId) ? previewId : items[0].id}
          onClose={() => setPreviewId(undefined)}
          items={items.map((item) => ({
            id: item.id,
            file: item.file,
            preview: item.preview,
            result: item.result,
            resultName: item.resultName,
            width: item.width,
            height: item.height,
          }))}
        />
      ) : null}
    </div>
  );
}

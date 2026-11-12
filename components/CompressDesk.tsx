'use client';

import { useEffect, useId, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import type { CompressJob, CompressReply, OutputFormat, PreviewReply, QualityId } from '@/lib/compress/protocol';
import { classifyFile } from '@/lib/compress/files';
import { cachedHeic, forgetHeic, previewJpeg } from '@/lib/compress/heic';
import { t, type Lang } from '@/lib/i18n';
import CompressCompareStage from '@/components/CompressCompareStage';

const FORMATS: OutputFormat[] = ['keep', 'jpeg', 'webp', 'png'];
const QUALITIES: QualityId[] = ['smaller', 'balanced', 'high'];
const EDGES = [0, 2560, 1920, 1280, 1024, 512] as const;
const CAPS = [0, 100 * 1024, 200 * 1024, 500 * 1024, 1024 * 1024] as const;
const MAX_CUSTOM_KB = 10240;

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
  cap?: number;
  gif?: boolean;
  heic?: boolean;
};

function chip(on: boolean) {
  return on
    ? 'border border-(--ink) px-3 py-2 text-sm'
    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)';
}

function customCapBytes(raw: string) {
  if (!raw) return null;
  const kb = Number(raw);
  if (!Number.isFinite(kb) || kb <= 0) return null;
  return Math.min(kb, MAX_CUSTOM_KB) * 1024;
}

function revokePreview(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
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

function grewPercent(before: number, after: number) {
  if (before <= 0) return 0;
  return Math.max(0, Math.round((after / before - 1) * 100));
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
      {item.preview ? (
        <img src={item.preview} alt="" className="h-14 w-14 shrink-0 border border-(--line) object-cover" />
      ) : (
        <span className="inline-block h-14 w-14 shrink-0 border border-(--line)" />
      )}
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm">{name}</p>
        <p className="mt-1 text-sm text-(--muted-ink)">
          {item.status === 'working' ? t(lang, 'processing') : null}
          {item.status === 'error' ? t(lang, 'compressFailed') : null}
          {item.status === 'ready' ? formatBytes(item.file.size) : null}
          {item.status === 'done' && item.result
            ? t(lang, item.result.size > item.file.size ? 'compressGrew' : 'compressSaved', {
                before: formatBytes(item.file.size),
                after: formatBytes(item.result.size),
                pct: String(
                  item.result.size > item.file.size
                    ? grewPercent(item.file.size, item.result.size)
                    : savedPercent(item.file.size, item.result.size)
                ),
              })
            : null}
          {item.status === 'done' && item.width && item.height
            ? ` · ${item.width}×${item.height}`
            : null}
          {item.gif ? ` · ${t(lang, 'compressGifFrame')}` : null}
          {item.status === 'done' && item.cap && item.result && item.result.size > item.cap
            ? ` · ${t(lang, 'compressOver', { size: formatBytes(item.cap) })}`
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
  const previewRef = useRef(new Map<number, string>());
  const itemsRef = useRef<Item[]>([]);
  const jobId = useRef(0);
  const runRef = useRef(0);
  const runningRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<OutputFormat>('keep');
  const [quality, setQuality] = useState<QualityId>('balanced');
  const [maxEdge, setMaxEdge] = useState<number>(0);
  const [targetBytes, setTargetBytes] = useState<number>(0);
  const [customKb, setCustomKb] = useState('');
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [running, setRunning] = useState(false);
  runningRef.current = running;
  itemsRef.current = items;
  const [zipping, setZipping] = useState(false);
  const [message, setMessage] = useState('');
  const [previewId, setPreviewId] = useState<string>();

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) forgetPixels(item);
      workerRef.current?.terminate();
      for (const item of itemsRef.current) revokePreview(item.preview);
    };
    // Revoke the previews held at unmount. Later additions are revoked in replaceItems.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function forgetPixels(item: Item) {
    if (!item.heic) return;
    forgetHeic(item.id);
    workerRef.current?.postMessage({ type: 'drop', cacheId: item.id });
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((entry) => entry.id === id);
      if (removed) {
        forgetPixels(removed);
        revokePreview(removed.preview);
      }
      return current.filter((entry) => entry.id !== id);
    });
  }

  function replaceItems(next: Item[]) {
    setItems((current) => {
      const keep = new Set(next.map((item) => item.id));
      for (const item of current) {
        if (!keep.has(item.id)) forgetPixels(item);
        if (!next.some((entry) => entry.preview && entry.preview === item.preview)) {
          revokePreview(item.preview);
        }
      }
      return next;
    });
  }

  function takeFiles(files?: FileList | File[] | null) {
    void addFiles(files);
  }

  async function addFiles(files?: FileList | File[] | null) {
    if (runningRef.current || !files?.length) return;
    const picked: { file: File; kind: 'heic' | 'gif' | 'image' }[] = [];
    let skipped = 0;
    for (const file of Array.from(files)) {
      const kind = await classifyFile(file);
      if (!kind) {
        skipped += 1;
        continue;
      }
      picked.push({ file, kind });
    }
    if (runningRef.current) return;
    setMessage(skipped ? t(lang, 'compressSkipped', { count: String(skipped) }) : '');
    if (!picked.length) return;
    const next = picked.map(({ file, kind }) => ({
      id: crypto.randomUUID(),
      file,
      preview: kind === 'heic' ? '' : URL.createObjectURL(file),
      status: 'ready' as const,
      gif: kind === 'gif',
      heic: kind === 'heic',
    }));
    itemsRef.current = next;
    replaceItems(next);
    for (const item of next) {
      if (!item.preview) void showHeicPreview(item);
    }
  }

  function setHeicPreview(itemId: string, url: string) {
    setItems((current) => {
      if (!current.some((entry) => entry.id === itemId)) {
        revokePreview(url);
        return current;
      }
      return current.map((entry) => {
        if (entry.id !== itemId) return entry;
        revokePreview(entry.preview);
        return { ...entry, preview: url };
      });
    });
  }

  async function previewOnMain(itemId: string) {
    const item = itemsRef.current.find((entry) => entry.id === itemId);
    if (!item) return;
    try {
      const image = await cachedHeic(itemId, await item.file.arrayBuffer());
      if (!itemsRef.current.some((entry) => entry.id === itemId)) {
        forgetHeic(itemId);
        return;
      }
      const encoded = await previewJpeg(image);
      setHeicPreview(itemId, URL.createObjectURL(new Blob([encoded], { type: 'image/jpeg' })));
    } catch (error) {
      console.error(error);
    }
  }

  async function showHeicPreview(item: Item) {
    if (mainRef.current) {
      await previewOnMain(item.id);
      return;
    }
    const bytes = await item.file.arrayBuffer();
    const id = ++jobId.current;
    previewRef.current.set(id, item.id);
    try {
      worker().postMessage({ type: 'preview', id, cacheId: item.id, bytes }, [bytes]);
    } catch (error) {
      console.error(error);
      previewRef.current.delete(id);
      mainRef.current = true;
      await previewOnMain(item.id);
    }
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
        if (file) pasted.push(file);
      }
      takeFiles(pasted);
    }
    document.documentElement.addEventListener('paste', pasteEvent);
    return () => document.documentElement.removeEventListener('paste', pasteEvent);
  });

  function worker() {
    if (workerRef.current) return workerRef.current;
    const next = new Worker(new URL('../lib/compress/worker.ts', import.meta.url));
    next.onmessage = (event: MessageEvent<CompressReply | PreviewReply>) => {
      const data = event.data;
      if ('type' in data && data.type === 'preview') {
        const itemId = previewRef.current.get(data.id);
        previewRef.current.delete(data.id);
        if (!itemId || !data.ok) return;
        setHeicPreview(itemId, URL.createObjectURL(new Blob([data.bytes], { type: 'image/jpeg' })));
        return;
      }
      const reply = data as CompressReply;
      const pending = jobsRef.current.get(reply.id);
      if (!pending) return;
      jobsRef.current.delete(reply.id);
      pending(reply);
    };
    next.onerror = () => {
      mainRef.current = true;
      for (const [id, pending] of jobsRef.current) {
        pending({ id, ok: false, message: 'worker' });
      }
      jobsRef.current.clear();
      const pendingPreviews = [...previewRef.current.values()];
      previewRef.current.clear();
      workerRef.current?.terminate();
      workerRef.current = null;
      for (const itemId of pendingPreviews) void previewOnMain(itemId);
    };
    workerRef.current = next;
    return next;
  }

  async function compressHere(
    item: Item,
    runFormat: OutputFormat,
    runQuality: QualityId,
    runEdge: number,
    runCap: number
  ) {
    const { compressImage } = await import('@/lib/compress/engine');
    const result = await compressImage({
      bytes: await item.file.arrayBuffer(),
      mime: item.file.type,
      name: item.file.name || 'image',
      format: runFormat,
      quality: runQuality,
      maxEdge: runEdge,
      targetBytes: runCap,
      cacheId: item.heic ? item.id : undefined,
    });
    return result;
  }

  async function compressOne(
    item: Item,
    runFormat: OutputFormat,
    runQuality: QualityId,
    runEdge: number,
    runCap: number
  ) {
    if (mainRef.current) return compressHere(item, runFormat, runQuality, runEdge, runCap);

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
      targetBytes: runCap,
      cacheId: item.heic ? item.id : undefined,
    };

    let reply: CompressReply;
    try {
      reply = await new Promise((resolve) => {
        jobsRef.current.set(id, resolve);
        worker().postMessage(job, [job.bytes]);
      });
    } catch {
      mainRef.current = true;
      return compressHere(item, runFormat, runQuality, runEdge, runCap);
    }

    if (!reply.ok && reply.message === 'worker') {
      mainRef.current = true;
      workerRef.current?.terminate();
      workerRef.current = null;
      return compressHere(item, runFormat, runQuality, runEdge, runCap);
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
    const runCap = customCapBytes(customKb) ?? targetBytes;
    const queue = items;
    setProgress({ current: 1, total: queue.length });
    setRunning(true);
    setMessage('');

    for (let index = 0; index < queue.length; index += 1) {
      const item = queue[index];
      if (runRef.current !== run) break;
      setProgress({ current: index + 1, total: queue.length });
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: 'working' } : entry
        )
      );
      try {
        const result = await compressOne(item, runFormat, runQuality, runEdge, runCap);
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
                  cap: runCap > 0 ? runCap : undefined,
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

    if (runRef.current === run) {
      setRunning(false);
      setProgress(null);
    }
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
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{t(lang, 'compressTitle')}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{t(lang, 'compressLead')}</p>
      </header>

      <div className="main-width">
        <div className="relative m-auto h-64 text-sm sm:h-72 md:h-80">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.heic,.heif"
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
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CAPS.map((cap) => (
            <button
              key={cap}
              type="button"
              aria-pressed={cap === (customCapBytes(customKb) ?? targetBytes)}
              disabled={running}
              className={chip(cap === (customCapBytes(customKb) ?? targetBytes))}
              onClick={() => {
                setTargetBytes(cap);
                setCustomKb('');
              }}
            >
              {cap === 0
                ? t(lang, 'compressCapNone')
                : cap >= 1024 * 1024
                  ? t(lang, 'compressCapMb', { size: String(cap / (1024 * 1024)) })
                  : t(lang, 'compressCapKb', { size: String(Math.round(cap / 1024)) })}
            </button>
          ))}
          <label className="flex items-center gap-2 border border-(--line) px-3 py-2 text-sm">
            <input
              type="text"
              inputMode="numeric"
              value={customKb}
              disabled={running}
              placeholder={t(lang, 'compressCapCustom')}
              aria-label={t(lang, 'compressCapCustom')}
              className="w-16 bg-transparent text-(--ink) outline-none placeholder:text-(--muted-ink) disabled:opacity-40"
              onChange={(event) => setCustomKb(event.target.value.replace(/\D/g, '').slice(0, 5))}
              onBlur={() => {
                if (!customKb) return;
                const kb = Math.min(Number(customKb), MAX_CUSTOM_KB);
                setCustomKb(kb > 0 ? String(kb) : '');
              }}
            />
            <span className="text-(--muted-ink)">KB</span>
          </label>
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
              {running && progress
                ? t(lang, 'compressProgress', {
                    current: String(progress.current),
                    total: String(progress.total),
                  })
                : t(lang, 'compressStart')}
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={running || !items.length}
              onClick={() => {
                runRef.current += 1;
                setRunning(false);
                setProgress(null);
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

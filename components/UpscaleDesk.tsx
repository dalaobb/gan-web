'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import * as Sentry from '@sentry/nextjs';
import { formatFileSize, formatTime } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import {
  upscaleImage,
  type UpscaleBackend,
  type UpscaleProgress,
  type UpscaleScale,
} from '@/lib/upscale/engine';
import CompressCompareStage from '@/components/CompressCompareStage';

type Item = {
  id: string;
  file: File;
  preview: string;
  status: 'ready' | 'working' | 'done' | 'error';
  result?: Blob;
  resultName?: string;
  width?: number;
  height?: number;
  backend?: UpscaleBackend;
  elapsedMs?: number;
};

const COPY = {
  en: {
    start: 'Upscale',
    upscaling: 'Upscaling',
    loading: 'Loading model',
    preparing: 'Preparing the model',
    encoding: 'Encoding JPEG',
    tile: 'Upscaling',
    pass: 'pass',
    after: 'Result',
    failed: 'Failed',
    scale: 'Scale',
    note:
      'The first run downloads a ~67 MB model once. Later runs reuse it from the browser cache.',
    limits:
      'Beta: 2× accepts up to 1400 px on the long edge. 4× runs the 2× model twice and accepts up to 700 px. Output is capped at 2800 px. Transparent areas are flattened to white. WebGPU is used when available; otherwise it falls back to CPU and can be slow.',
  },
  zh: {
    start: '开始放大',
    upscaling: '正在放大',
    loading: '正在加载模型',
    preparing: '正在准备模型',
    encoding: '正在编码 JPEG',
    tile: '正在放大',
    pass: '第',
    after: '结果',
    failed: '失败',
    scale: '放大倍数',
    note: '首次使用会下载约 67MB 模型，之后会复用浏览器缓存。',
    limits:
      '测试版：2× 输入长边最大 1400px；4× 会用 2× 模型跑两遍，输入长边最大 700px。输出长边限制 2800px。透明区域会铺白。优先使用 WebGPU，不支持时会退回 CPU，速度会慢很多。',
  },
};

function revokePreview(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

function outputName(file: File, scale: UpscaleScale) {
  return `${file.name.replace(/\.[^.]+$/, '') || 'image'}_${scale}x_BgGone.jpg`;
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

function chip(on: boolean) {
  return on
    ? 'border border-(--ink) px-3 py-2 text-sm'
    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)';
}

function UpscaleRow({
  item,
  lang,
  onPreview,
  onClose,
}: {
  item: Item;
  lang: Lang;
  onPreview: () => void;
  onClose: () => void;
}) {
  const copy = COPY[lang];
  const [copied, setCopied] = useState(false);
  const result = item.result;
  const name = item.file.name;

  async function copyFile() {
    if (!result) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [result.type || 'image/jpeg']: result }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (reason) {
      console.error(reason);
      alert(t(lang, 'copyFailed'));
    }
  }

  return (
    <li
      className={`glass-effect flex flex-wrap items-center gap-3 p-3 ${
        item.status === 'working' ? 'processing' : ''
      }`}
    >
      <img
        src={item.preview}
        alt=""
        className="h-14 w-14 shrink-0 border border-(--line) object-cover"
      />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm">{name}</p>
        <p
          className={`mt-1 text-sm ${
            item.status === 'error' ? 'text-[#9f2d2d]' : 'text-(--muted-ink)'
          }`}
        >
          {item.status === 'working' ? t(lang, 'processing') : null}
          {item.status === 'error' ? copy.failed : null}
          {item.status === 'ready' ? formatFileSize(item.file.size) : null}
          {item.status === 'done' && result
            ? `${formatFileSize(item.file.size)} → ${formatFileSize(
                result.size
              )}${item.width ? ` · ${item.width}×${item.height}` : ''}`
            : null}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-line" onClick={onPreview}>
          {t(lang, 'preview')}
        </button>
        {result && item.resultName ? (
          <>
            <button type="button" className="btn btn-line" onClick={copyFile}>
              {copied ? t(lang, 'copied') : t(lang, 'copy')}
            </button>
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => FileSaver.saveAs(result, item.resultName!)}
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
        disabled={item.status === 'working'}
        aria-label={t(lang, 'compressClose')}
      >
        ×
      </button>
    </li>
  );
}

export default function UpscaleDesk({
  lang,
  heading,
  lead,
}: {
  lang: Lang;
  heading: string;
  lead: string;
}) {
  const copy = COPY[lang];
  const inputId = useId();
  const dropRef = useRef<HTMLLabelElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const runningRef = useRef(false);
  const runRef = useRef(0);
  const stageRef = useRef('init');
  const backendRef = useRef<UpscaleBackend | undefined>(undefined);
  const viewedRef = useRef(false);
  const [items, setItems] = useState<Item[]>([]);
  const [scale, setScale] = useState<UpscaleScale>(2);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const [previewId, setPreviewId] = useState<string>();
  const [detail, setDetail] = useState('');
  const [ratio, setRatio] = useState(0);
  const [message, setMessage] = useState('');
  const [zipping, setZipping] = useState(false);

  itemsRef.current = items;
  runningRef.current = running;

  useEffect(() => {
    return () => {
      runRef.current += 1;
      for (const item of itemsRef.current) revokePreview(item.preview);
    };
  }, []);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    track('upscale_view', { tool: 'upscale' });
  }, []);

  const addFiles = useCallback(
    (
      files?: FileList | File[] | null,
      source: 'picker' | 'drop' | 'paste' = 'picker'
    ) => {
      if (runningRef.current || !files?.length) return;
      const picked = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (!picked.length) return;

      const next = picked.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'ready' as const,
      }));

      setItems((current) => {
        for (const item of current) revokePreview(item.preview);
        return next;
      });
      track('upscale_files_added', {
        tool: 'upscale',
        count: next.length,
        total_bytes: next.reduce((sum, item) => sum + item.file.size, 0),
        source,
        mime: next[0]?.file.type,
      });
      setPreviewId(undefined);
      setDetail('');
      setRatio(0);
      setMessage('');
    },
    []
  );

  function replaceItems(next: Item[]) {
    setItems((current) => {
      for (const item of current) revokePreview(item.preview);
      return next;
    });
  }

  function removeItem(id: string) {
    if (runningRef.current) return;
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) revokePreview(removed.preview);
      return current.filter((item) => item.id !== id);
    });
    setPreviewId((current) => (current === id ? undefined : current));
  }

  function clear() {
    runRef.current += 1;
    replaceItems([]);
    setRunning(false);
    setPreviewId(undefined);
    setDetail('');
    setRatio(0);
    setMessage('');
  }

  function changeScale(next: UpscaleScale) {
    if (running || next === scale) return;
    track('upscale_scale_selected', { tool: 'upscale', scale: next });
    setScale(next);
    setItems((current) =>
      current.map((item) => ({
        ...item,
        status: 'ready',
        result: undefined,
        resultName: undefined,
        width: undefined,
        height: undefined,
        backend: undefined,
        elapsedMs: undefined,
      }))
    );
    setPreviewId(undefined);
    setDetail('');
    setRatio(0);
    setMessage('');
  }

  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;

    function dragOver(event: DragEvent) {
      event.preventDefault();
      drop?.classList.add('drag-over');
      setDragging(true);
    }
    function dragLeave(event: DragEvent) {
      event.preventDefault();
      const next = event.relatedTarget;
      if (next instanceof Node && drop?.contains(next)) return;
      drop?.classList.remove('drag-over');
      setDragging(false);
    }
    function dropFiles(event: DragEvent) {
      event.preventDefault();
      drop?.classList.remove('drag-over');
      setDragging(false);
      addFiles(event.dataTransfer?.files, 'drop');
    }

    drop.addEventListener('dragover', dragOver);
    drop.addEventListener('dragleave', dragLeave);
    drop.addEventListener('drop', dropFiles);
    return () => {
      drop.removeEventListener('dragover', dragOver);
      drop.removeEventListener('dragleave', dragLeave);
      drop.removeEventListener('drop', dropFiles);
    };
  }, [addFiles]);

  useEffect(() => {
    function pasteFiles(event: ClipboardEvent) {
      const pasted: File[] = [];
      const list = event.clipboardData?.items;
      for (let index = 0; list && index < list.length; index += 1) {
        if (list[index].kind !== 'file') continue;
        const file = list[index].getAsFile();
        if (file?.type.startsWith('image/')) pasted.push(file);
      }
      if (pasted.length) addFiles(pasted, 'paste');
    }

    document.documentElement.addEventListener('paste', pasteFiles);
    return () =>
      document.documentElement.removeEventListener('paste', pasteFiles);
  }, [addFiles]);

  const report = useCallback(
    (progress: UpscaleProgress, index: number, total: number) => {
      stageRef.current = progress.stage;
      if (progress.backend) backendRef.current = progress.backend;

      if (progress.stage === 'model') {
        if (progress.total) {
          const percent = Math.min(
            99,
            Math.round(((progress.loaded ?? 0) / progress.total) * 100)
          );
          setDetail(`${copy.loading} ${percent}%`);
          setRatio((percent / 100) * 0.15);
        } else {
          setDetail(
            `${copy.loading} ${((progress.loaded ?? 0) / 1024 / 1024).toFixed(1)} MB`
          );
        }
        return;
      }

      if (progress.stage === 'session') {
        setDetail(
          `${copy.preparing} · ${
            progress.backend === 'webgpu' ? 'WebGPU' : 'CPU'
          }`
        );
        return;
      }

      if (progress.stage === 'tile') {
        const current = (progress.tile ?? 0) / (progress.tiles ?? 1);
        const pass =
          progress.passes && progress.passes > 1
            ? ` · ${copy.pass} ${progress.pass}/${progress.passes}`
            : '';
        setDetail(
          `${copy.tile} ${index + 1}/${total}${pass} · ${progress.tile}/${progress.tiles}`
        );
        const overall =
          progress.passes && progress.passes > 1
            ? ((progress.pass ?? 1) - 1 + current) / progress.passes
            : current;
        setRatio((index + overall) / total);
        return;
      }

      setDetail(copy.encoding);
    },
    [copy.encoding, copy.loading, copy.pass, copy.preparing, copy.tile]
  );

  async function run() {
    if (running || !items.length) return;

    const runId = ++runRef.current;
    const queue = items;
    const startedAt = performance.now();
    const totalBytes = queue.reduce((sum, item) => sum + item.file.size, 0);
    let failed = 0;
    let succeeded = 0;

    track('upscale_start', {
      tool: 'upscale',
      scale,
      count: queue.length,
      total_bytes: totalBytes,
    });
    setRunning(true);
    setMessage('');
    setDetail(copy.loading);
    setRatio(0);

    for (let index = 0; index < queue.length; index += 1) {
      if (runRef.current !== runId) return;
      const item = queue[index];
      if (item.status === 'done') {
        setRatio((index + 1) / queue.length);
        continue;
      }

      stageRef.current = 'start';
      backendRef.current = undefined;
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                status: 'working',
                result: undefined,
                resultName: undefined,
              }
            : entry
        )
      );

      try {
        const output = await upscaleImage(item.file, {
          scale,
          onProgress: (progress) => report(progress, index, queue.length),
        });
        if (runRef.current !== runId) return;
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: 'done',
                  result: output.blob,
                  resultName: outputName(item.file, output.scale),
                  width: output.width,
                  height: output.height,
                  backend: output.backend,
                  elapsedMs: output.elapsedMs,
                }
              : entry
          )
        );
        succeeded += 1;
        track('upscale_success', {
          tool: 'upscale',
          scale: output.scale,
          backend: output.backend,
          duration_ms: Math.round(output.elapsedMs),
          width: output.width,
          height: output.height,
          input_bytes: item.file.size,
          output_bytes: output.blob.size,
          batch_count: queue.length,
        });
      } catch (reason) {
        console.error('Failed to upscale', item.file.name, reason);
        if (runRef.current !== runId) return;
        failed += 1;
        const stage = stageRef.current;
        track('upscale_error', {
          tool: 'upscale',
          scale,
          stage,
          backend: backendRef.current,
          input_bytes: item.file.size,
          batch_count: queue.length,
          error: String(reason).slice(0, 160),
        });
        Sentry.captureException(reason, {
          tags: { tool: 'upscale', stage, scale: String(scale) },
          extra: { inputBytes: item.file.size, batchCount: queue.length },
        });
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: 'error' } : entry
          )
        );
      }

      setRatio((index + 1) / queue.length);
    }

    if (runRef.current !== runId) return;
    track('upscale_batch_complete', {
      tool: 'upscale',
      scale,
      count: queue.length,
      success_count: succeeded,
      fail_count: failed,
      duration_ms: Math.round(performance.now() - startedAt),
    });
    setRunning(false);
    setDetail('');
    setRatio(1);
    if (failed === queue.length) {
      setMessage(t(lang, 'toolFailed'));
    } else {
      setMessage(
        t(lang, 'done', {
          time: formatTime(performance.now() - startedAt),
        })
      );
    }
  }

  const doneItems = items.filter(
    (item): item is Item & { result: Blob; resultName: string } =>
      item.status === 'done' && !!item.result && !!item.resultName
  );

  function downloadEach() {
    if (!doneItems.length || zipping) return;
    const used = new Set<string>();
    track('upscale_download', {
      tool: 'upscale',
      kind: 'single',
      count: doneItems.length,
      total_bytes: doneItems.reduce((sum, item) => sum + item.result.size, 0),
    });
    for (const item of doneItems) {
      FileSaver.saveAs(item.result, uniqueName(item.resultName, used));
    }
  }

  async function downloadAll() {
    if (!doneItems.length || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (const item of doneItems) {
        zip.file(uniqueName(item.resultName, used), item.result);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      track('upscale_download', {
        tool: 'upscale',
        kind: 'zip',
        count: doneItems.length,
        total_bytes: content.size,
      });
      FileSaver.saveAs(content, 'BgGone-upscaled.zip');
    } catch (reason) {
      console.error(reason);
      setMessage(t(lang, 'failedPackage'));
    } finally {
      setZipping(false);
    }
  }

  const compareItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        file: item.file,
        preview: item.preview,
        result: item.result,
        resultName: item.resultName ?? item.file.name,
        width: item.width,
        height: item.height,
        caption: item.result
          ? `${formatFileSize(item.file.size)} → ${formatFileSize(
              item.result.size
            )}${item.width ? ` · ${item.width}×${item.height}` : ''}`
          : formatFileSize(item.file.size),
      })),
    [items]
  );

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{heading}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{lead}</p>
      </header>

      <div className="main-width">
        <div className="relative m-auto h-64 text-sm sm:h-72 md:h-80">
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
            multiple
            className="h-0 opacity-0"
            disabled={running}
            onChange={(event) => {
              addFiles(event.target.files, 'picker');
              event.target.value = '';
            }}
          />
          <label
            ref={dropRef}
            htmlFor={inputId}
            className="drop-zone absolute inset-0 flex cursor-pointer items-center justify-center border-2 border-dashed text-center"
          >
            <div className="bg-(--paper) px-8 py-6">
              <p className="font-display text-4xl leading-none tracking-tight text-(--ink) sm:text-5xl">
                {dragging ? t(lang, 'dropRelease') : t(lang, 'dropTitle')}
              </p>
              <p className="mt-3 text-sm text-(--muted-ink)">
                {t(lang, 'dropHint')}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="glass-effect main-width mt-5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-(--muted-ink)">{copy.scale}</span>
            {([2, 4] as UpscaleScale[]).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={scale === value}
                disabled={running}
                className={chip(scale === value)}
                onClick={() => changeScale(value)}
              >
                {value}×
              </button>
            ))}
            <button
              type="button"
              className="btn btn-solid"
              disabled={running || !items.length}
              onClick={run}
            >
              {running ? `${copy.upscaling}...` : copy.start}
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={running || !items.length}
              onClick={clear}
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
            {doneItems.length ? (
              <button
                type="button"
                className="btn btn-line"
                disabled={zipping || running}
                onClick={downloadEach}
              >
                {t(lang, 'download')}
              </button>
            ) : null}
            {doneItems.length > 1 ? (
              <button
                type="button"
                className="btn btn-line"
                disabled={zipping || running}
                onClick={downloadAll}
              >
                {t(lang, 'downloadAllZip')}
              </button>
            ) : null}
          </div>
        </div>

        {detail || message ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-(--muted-ink)">{message || detail}</p>
            {running ? (
              <div className="h-1 w-full bg-(--line)">
                <div
                  className="h-full bg-(--ink) transition-[width]"
                  style={{
                    width: `${Math.max(4, Math.round(ratio * 100))}%`,
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {items.length ? (
        <ul className="main-width mt-4 space-y-2">
          {items.map((item) => (
            <UpscaleRow
              key={item.id}
              item={item}
              lang={lang}
              onPreview={() => {
                track('upscale_preview', {
                  tool: 'upscale',
                  has_result: !!item.result,
                });
                setPreviewId(item.id);
              }}
              onClose={() => removeItem(item.id)}
            />
          ))}
        </ul>
      ) : null}

      <div className="main-width mt-4">
        <div className="glass-effect space-y-2 p-4 text-sm text-(--muted-ink)">
          <p>{copy.note}</p>
          <p>{copy.limits}</p>
        </div>
      </div>

      {previewId && items.length ? (
        <CompressCompareStage
          lang={lang}
          initialId={
            items.some((item) => item.id === previewId)
              ? previewId
              : items[0].id
          }
          title={copy.after}
          outputLabel={copy.after}
          onClose={() => setPreviewId(undefined)}
          items={compareItems}
        />
      ) : null}
    </div>
  );
}

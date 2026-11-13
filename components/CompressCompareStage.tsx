'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';

type StageItem = {
  id: string;
  file: Blob & { name: string };
  preview: string;
  result?: Blob;
  resultName?: string;
  width?: number;
  height?: number;
  caption?: string;
};

type Pan = { x: number; y: number };
type Box = { w: number; h: number };

type View = {
  mode: 'fit' | 'manual';
  manualScale: number;
  pan: Pan;
  box: Box;
  imgW: number;
  imgH: number;
  fitScale: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
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

function clampPan(x: number, y: number, scale: number, box: Box, imgW: number, imgH: number): Pan {
  const maxX = Math.max(0, (imgW * scale - box.w) / 2);
  const maxY = Math.max(0, (imgH * scale - box.h) / 2);
  return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
}

function chip(on: boolean) {
  return on
    ? 'border border-(--ink) px-3 py-2 text-sm'
    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)';
}

export default function CompressCompareStage({
  items,
  lang,
  initialId,
  outputLabel,
  compare = true,
  title,
  onClose,
}: {
  items: StageItem[];
  lang: Lang;
  initialId: string;
  outputLabel?: string;
  compare?: boolean;
  title?: string;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View>({
    mode: 'fit',
    manualScale: 1,
    pan: { x: 0, y: 0 },
    box: { w: 0, h: 0 },
    imgW: 0,
    imgH: 0,
    fitScale: 1,
  });
  const panDrag = useRef<{ x: number; y: number; pan: Pan } | null>(null);
  const splitDrag = useRef(false);
  const [activeId, setActiveId] = useState(initialId);
  const [afterSrc, setAfterSrc] = useState<string>();
  const [natural, setNatural] = useState<{ w: number; h: number }>();
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [mode, setMode] = useState<'fit' | 'manual'>('fit');
  const [manualScale, setManualScale] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [split, setSplit] = useState(0.5);

  const ids = items.map((item) => item.id).join('|');
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const active = items.find((item) => item.id === activeId) ?? items[items.length - 1];
  const index = active ? items.findIndex((item) => item.id === active.id) : -1;
  const result = active?.result;

  useEffect(() => {
    const list = itemsRef.current;
    setActiveId((current) => {
      if (current && list.some((item) => item.id === current)) return current;
      if (list.some((item) => item.id === initialId)) return initialId;
      return list[list.length - 1]?.id ?? current;
    });
  }, [ids, initialId]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    setMode('fit');
    setManualScale(1);
    setPan({ x: 0, y: 0 });
    setSplit(0.5);
    setNatural(undefined);
  }, [active?.id]);

  useEffect(() => {
    if (!result) {
      setAfterSrc(undefined);
      return;
    }
    const url = URL.createObjectURL(result);
    setAfterSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const next = { w: el.clientWidth, h: el.clientHeight };
      setBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [active?.id]);

  const imgW = active?.width || natural?.w || 0;
  const imgH = active?.height || natural?.h || 0;
  const fitScale = box.w > 0 && imgW > 0 ? Math.min(box.w / imgW, box.h / imgH) : 1;
  const scale = mode === 'fit' ? fitScale : manualScale;
  viewRef.current = { mode, manualScale, pan, box, imgW, imgH, fitScale };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const view = viewRef.current;
      if (!view.box.w || !view.imgW) return;
      const current = view.mode === 'fit' ? view.fitScale : view.manualScale;
      const next = clamp(current * Math.exp(-event.deltaY * 0.0015), Math.min(view.fitScale, 1), Math.max(view.fitScale, 8));
      const left = view.box.w / 2 + view.pan.x - (view.imgW * current) / 2;
      const top = view.box.h / 2 + view.pan.y - (view.imgH * current) / 2;
      const sx = event.clientX - rect.left;
      const sy = event.clientY - rect.top;
      const ix = (sx - left) / current;
      const iy = (sy - top) / current;
      const panX = sx - ix * next - view.box.w / 2 + (view.imgW * next) / 2;
      const panY = sy - iy * next - view.box.h / 2 + (view.imgH * next) / 2;
      const nextPan = clampPan(panX, panY, next, view.box, view.imgW, view.imgH);
      viewRef.current = { ...view, mode: 'manual', manualScale: next, pan: nextPan };
      setMode('manual');
      setManualScale(next);
      setPan(nextPan);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [active?.id]);

  if (!active) return null;

  const dispW = imgW * scale;
  const dispH = imgH * scale;
  const left = box.w / 2 + pan.x - dispW / 2;
  const top = box.h / 2 + pan.y - dispH / 2;
  const cut = dispW > 0 ? (split * box.w - left) / dispW : 0;
  const rightInset = clamp((1 - cut) * 100, 0, 100);
  const canPan = dispW > box.w + 1 || dispH > box.h + 1;
  const name = active.resultName || active.file.name;
  const atActual = mode === 'manual' && Math.abs(scale - 1) < 0.02;

  function moveSplit(clientX: number) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    setSplit(clamp((clientX - rect.left) / rect.width, 0, 1));
  }

  function showFit() {
    setMode('fit');
    setPan({ x: 0, y: 0 });
  }

  function showActual() {
    setMode('manual');
    setManualScale(1);
    setPan({ x: 0, y: 0 });
  }

  return (
    <section
      id="large-compare"
      className="fixed inset-0 z-50 flex flex-col bg-(--paper) p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? t(lang, 'compressStage')}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-2xl">{title ?? t(lang, 'compressStage')}</h2>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center border border-(--line)"
          onClick={onClose}
          aria-label={t(lang, 'compressClose')}
        >
          ×
        </button>
      </div>
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden border border-(--line) bg-[color-mix(in_srgb,var(--ink)_6%,var(--paper))] select-none"
        style={{ cursor: canPan ? 'grab' : 'default' }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if ((event.target as HTMLElement).closest('[data-split]')) return;
          panDrag.current = { x: event.clientX, y: event.clientY, pan: { ...viewRef.current.pan } };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = panDrag.current;
          if (!drag) return;
          const view = viewRef.current;
          const next = clampPan(
            drag.pan.x + event.clientX - drag.x,
            drag.pan.y + event.clientY - drag.y,
            view.mode === 'fit' ? view.fitScale : view.manualScale,
            view.box,
            view.imgW,
            view.imgH,
          );
          viewRef.current = { ...view, pan: next };
          setPan(next);
        }}
        onPointerUp={() => {
          panDrag.current = null;
        }}
        onPointerCancel={() => {
          panDrag.current = null;
        }}
        onDoubleClick={(event) => {
          if ((event.target as HTMLElement).closest('[data-split]')) return;
          if (mode === 'fit') showActual();
          else showFit();
        }}
      >
        {active.width && active.height ? null : afterSrc || active.preview ? (
          <img
            src={afterSrc || active.preview}
            alt=""
            className="hidden"
            onLoad={(event) => {
              const el = event.currentTarget;
              if (el.naturalWidth) setNatural({ w: el.naturalWidth, h: el.naturalHeight });
            }}
          />
        ) : null}
        {box.w > 0 && imgW > 0 ? (
          <div className="checker absolute" style={{ left, top, width: dispW, height: dispH }}>
            {!compare ? (
              afterSrc || active.preview ? (
                <img
                  src={afterSrc ?? active.preview}
                  alt={name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full"
                />
              ) : null
            ) : (
              <>
                {afterSrc ? (
                  <img src={afterSrc} alt={name} draggable={false} className="absolute inset-0 h-full w-full" />
                ) : null}
                {active.preview ? (
                  <img
                    src={active.preview}
                    alt={active.file.name}
                    draggable={false}
                    className="absolute inset-0 h-full w-full"
                    style={afterSrc ? { clipPath: `inset(0 ${rightInset}% 0 0)` } : undefined}
                  />
                ) : null}
              </>
            )}
          </div>
        ) : null}
        {compare ? (
          <>
            <div className="pointer-events-none absolute top-3 left-3 bg-(--paper) px-2 py-1 text-xs">
              {t(lang, 'compressOriginal')}
            </div>
            {afterSrc ? (
              <div className="pointer-events-none absolute top-3 right-3 bg-(--paper) px-2 py-1 text-xs">
                {outputLabel ?? t(lang, 'compressOutput')}
              </div>
            ) : null}
          </>
        ) : null}
        {compare && afterSrc ? (
        <div
          data-split
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split * 100)}
          aria-label={t(lang, 'compressStage')}
          className="absolute top-0 bottom-0 z-3 w-11 -translate-x-1/2 cursor-ew-resize"
          style={{ left: `${split * 100}%` }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.stopPropagation();
            splitDrag.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            moveSplit(event.clientX);
          }}
          onPointerMove={(event) => {
            if (!splitDrag.current) return;
            moveSplit(event.clientX);
          }}
          onPointerUp={() => {
            splitDrag.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              setSplit((value) => clamp(value - 0.02, 0, 1));
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              setSplit((value) => clamp(value + 0.02, 0, 1));
            }
          }}
        >
          <div className="compare-handle" style={{ left: '50%', pointerEvents: 'none' }}>
            <span className="compare-handle-arrow compare-handle-arrow-left" />
            <span className="compare-handle-arrow compare-handle-arrow-right" />
          </div>
        </div>
        ) : null}
      </div>
      <div className="mx-auto mt-3 flex max-w-5xl flex-wrap items-center gap-2 px-3">
        <button type="button" className={chip(mode === 'fit')} aria-pressed={mode === 'fit'} onClick={showFit}>
          {t(lang, 'compressFit')}
        </button>
        <button type="button" className={chip(atActual)} aria-pressed={atActual} onClick={showActual}>
          {t(lang, 'compressActual')}
        </button>
        <span className="text-sm text-(--muted-ink)">{Math.round(scale * 100)}%</span>
        <span className="min-w-0 flex-1 truncate text-sm text-(--muted-ink)">
          {name}
          {' · '}
          {active.caption
            ? `${active.caption}${imgW && imgH ? ` · ${imgW}×${imgH}` : ''}`
            : active.result
              ? `${t(lang, 'compressSaved', {
                  before: formatBytes(active.file.size),
                  after: formatBytes(active.result.size),
                  pct: String(savedPercent(active.file.size, active.result.size)),
                })}${imgW && imgH ? ` · ${imgW}×${imgH}` : ''}`
              : formatBytes(active.file.size)}
        </span>
        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="btn btn-line"
              disabled={index <= 0}
              onClick={() => {
                const id = items[index - 1]?.id;
                if (id) setActiveId(id);
              }}
            >
              {t(lang, 'compressPrev')}
            </button>
            <span className="text-sm text-(--muted-ink)">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              className="btn btn-line"
              disabled={index < 0 || index >= items.length - 1}
              onClick={() => {
                const id = items[index + 1]?.id;
                if (id) setActiveId(id);
              }}
            >
              {t(lang, 'compressNext')}
            </button>
          </>
        ) : null}
      </div>
      {compare && afterSrc ? (
        <p className="mt-2 text-center text-sm text-(--muted-ink)">{t(lang, 'compressStageHint')}</p>
      ) : null}
    </section>
  );
}

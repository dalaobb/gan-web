'use client';

import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { t, type Lang } from '@/lib/i18n';
import type { FaceBox } from '@/lib/passport/face';

type Size = { width: number; height: number };
type Point = { x: number; y: number };

function normalize(start: Point, end: Point, size: Size): FaceBox {
  const x = Math.max(0, Math.min(start.x, end.x));
  const y = Math.max(0, Math.min(start.y, end.y));
  return {
    x,
    y,
    width: Math.min(size.width, Math.max(start.x, end.x)) - x,
    height: Math.min(size.height, Math.max(start.y, end.y)) - y,
  };
}

export default function ManualFaceBoxEditor({
  lang,
  url,
  initialBoxes,
  onApply,
  onClose,
}: {
  lang: Lang;
  url: string;
  initialBoxes: FaceBox[];
  onApply: (boxes: FaceBox[]) => void;
  onClose: () => void;
}) {
  const [size, setSize] = useState<Size | null>(null);
  const [boxes, setBoxes] = useState<FaceBox[]>(initialBoxes);
  const [start, setStart] = useState<Point | null>(null);
  const [draft, setDraft] = useState<FaceBox | null>(null);

  function point(event: ReactPointerEvent<SVGSVGElement>): Point | null {
    if (!size) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: Math.max(
        0,
        Math.min(size.width, ((event.clientX - rect.left) / rect.width) * size.width)
      ),
      y: Math.max(
        0,
        Math.min(
          size.height,
          ((event.clientY - rect.top) / rect.height) * size.height
        )
      ),
    };
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    const next = point(event);
    if (!next) return;
    setStart(next);
    setDraft({ x: next.x, y: next.y, width: 0, height: 0 });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!start || !size) return;
    const next = point(event);
    if (!next) return;
    setDraft(normalize(start, next, size));
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (!start || !size) return;
    const next = point(event);
    if (next) {
      const box = normalize(start, next, size);
      if (box.width > 8 && box.height > 8) {
        setBoxes((current) => [...current, box]);
      }
    }
    setStart(null);
    setDraft(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      className="fixed inset-0 z-50 flex flex-col bg-(--paper) p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t(lang, 'manualBoxesTitle')}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl">{t(lang, 'manualBoxesTitle')}</h2>
          <p className="mt-1 text-sm text-(--muted-ink)">
            {t(lang, 'manualBoxesHint')}
          </p>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-(--line)"
          onClick={onClose}
          aria-label={t(lang, 'compressClose')}
        >
          ×
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden border border-(--line) bg-(--paper-2)">
        <div className="relative inline-block max-h-full max-w-full">
          <img
            src={url}
            alt=""
            className="block max-h-[70vh] max-w-full select-none"
            draggable={false}
            onLoad={(event) =>
              setSize({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
          />
          {size ? (
            <svg
              className="absolute inset-0 h-full w-full touch-none"
              viewBox={`0 0 ${size.width} ${size.height}`}
              preserveAspectRatio="none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {boxes.map((box, index) => (
                <rect
                  key={`${box.x}-${box.y}-${index}`}
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  fill="rgba(216, 0, 27, 0.18)"
                  stroke="#d9001b"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {draft ? (
                <rect
                  x={draft.x}
                  y={draft.y}
                  width={draft.width}
                  height={draft.height}
                  fill="rgba(216, 0, 27, 0.12)"
                  stroke="#d9001b"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
            </svg>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-(--muted-ink)">
          {t(lang, 'manualBoxesCount', { count: String(boxes.length) })}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-line"
            disabled={!boxes.length}
            onClick={() => setBoxes([])}
          >
            {t(lang, 'manualBoxesClear')}
          </button>
          <button type="button" className="btn btn-line" onClick={onClose}>
            {t(lang, 'manualBoxesCancel')}
          </button>
          <button
            type="button"
            className="btn btn-solid"
            disabled={!boxes.length}
            onClick={() => onApply(boxes)}
          >
            {t(lang, 'manualBoxesApply')}
          </button>
        </div>
      </div>
    </section>
  );
}

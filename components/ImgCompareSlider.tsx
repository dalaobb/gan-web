'use client';

import { useRef, useEffect } from 'react';
import { t, type Lang } from '@/lib/i18n';
import { backdropStyle, type Backdrop } from '@/lib/utils/background';

export default function ImgCompareSlider({
  beforeSrc,
  afterSrc,
  processing,
  lang = 'en',
  backdrop = { type: 'transparent' },
  onClose,
}: {
  beforeSrc?: string;
  afterSrc?: string;
  processing?: boolean;
  lang?: Lang;
  backdrop?: Backdrop;
  onClose: () => void;
}) {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const imgBeforeRef = useRef<HTMLImageElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const showAfter = !processing && afterSrc;

  useEffect(() => {
    if (!showAfter) return;

    const imgContainer = imgContainerRef.current;
    const imgBefore = imgBeforeRef.current;
    const slider = sliderRef.current;

    if (!imgContainer || !imgBefore || !slider) return;

    function touchmoveEvent(e: TouchEvent) {
      if (!imgContainer || !imgBefore || !slider) return;

      const containerWidth = imgContainer.offsetWidth;
      const currentPoint = e.changedTouches[0].clientX;

      const startOfDiv = imgContainer.offsetLeft;

      const modifiedCurrentPoint = currentPoint - startOfDiv;

      const leftPercent = (modifiedCurrentPoint * 100) / containerWidth;
      const rightPercent = 100 - leftPercent;

      imgBefore.setAttribute(
        'style',
        `clip-path: inset(0 ${rightPercent}% 0 0);`
      );
      slider.style.left = leftPercent + '%';
    }

    imgContainer.addEventListener('touchmove', touchmoveEvent, {
      passive: true,
    });

    function mousemoveEvent(e: MouseEvent) {
      if (!imgContainer || !imgBefore || !slider) return;

      const containerWidth = imgContainer.offsetWidth;
      const leftPercent = (e.offsetX * 100) / containerWidth;
      const rightPercent = 100 - leftPercent;

      // if (e.offsetX > 10 && e.offsetX < containerWidth - 10) {
      imgBefore.setAttribute(
        'style',
        `clip-path: inset(0 ${rightPercent}% 0 0);`
      );
      slider.style.left = leftPercent + '%';
      // }
    }
    imgContainer.addEventListener('mousemove', mousemoveEvent);

    return () => {
      imgContainer.removeEventListener('touchmove', touchmoveEvent);
      imgContainer.removeEventListener('mousemove', mousemoveEvent);
    };
  }, [showAfter]);

  return (
    <div
      className="h-50 relative cursor-grab overflow-hidden"
      ref={imgContainerRef}
    >
      {showAfter ? (
        <>
          <img
            className="checker w-full h-full object-cover"
            style={backdropStyle(backdrop)}
            src={afterSrc}
            alt="After | BgGone - Free AI Background Remover"
          />
          <div ref={sliderRef} className="compare-handle backdrop-blur-md">
            <span className="compare-handle-arrow compare-handle-arrow-left" />
            <span className="compare-handle-arrow compare-handle-arrow-right" />
          </div>
        </>
      ) : null}

      <img
        ref={imgBeforeRef}
        className="w-full h-full object-cover absolute top-0"
        src={beforeSrc}
        style={{
          clipPath: afterSrc ? `inset(0 50% 0 0)` : 'inset(0 0 0 0)',
        }}
        alt="Before | BgGone - Free AI Background Remover"
      />

      {processing ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--paper)_72%,transparent)]"
        >
          <div className="text-center text-(--ink)">
            <div className="mb-2 inline-block h-5 w-5 animate-spin rounded-full border border-(--line) border-t-(--ink)"></div>
            <p>{t(lang, 'processing')}</p>
          </div>
        </div>
      ) : (
        <div className="absolute top-3 right-3">
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-(--line) bg-(--paper) text-(--ink)"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

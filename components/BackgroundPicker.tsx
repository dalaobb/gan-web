'use client';

import { useRef, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';
import type { Backdrop } from '@/lib/utils/background';

const PRESETS = [
  { color: '#ffffff', key: 'bgWhite' },
  { color: '#f4f1ea', key: 'bgPaper' },
  { color: '#000000', key: 'bgBlack' },
] as const;

export default function BackgroundPicker({
  lang,
  value,
  imageUrl,
  onChange,
  onImage,
}: {
  lang: Lang;
  value: Backdrop;
  imageUrl: string | null;
  onChange: (next: Backdrop) => void;
  onImage: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [custom, setCustom] = useState('#8c3a3a');
  const customActive =
    value.type === 'color' &&
    !PRESETS.some((preset) => preset.color === value.color);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="mr-1 text-(--muted-ink)">{t(lang, 'background')}</span>
      <button
        type="button"
        aria-pressed={value.type === 'transparent'}
        aria-label={t(lang, 'bgTransparent')}
        title={t(lang, 'bgTransparent')}
        onClick={() => onChange({ type: 'transparent' })}
        className={`checker h-7 w-7 ${swatchClass(value.type === 'transparent')}`}
      />
      {PRESETS.map((preset) => {
        const active = value.type === 'color' && value.color === preset.color;
        return (
          <button
            key={preset.color}
            type="button"
            aria-pressed={active}
            aria-label={t(lang, preset.key)}
            title={t(lang, preset.key)}
            onClick={() => onChange({ type: 'color', color: preset.color })}
            className={`h-7 w-7 ${swatchClass(active)}`}
            style={{ backgroundColor: preset.color }}
          />
        );
      })}
      <label
        title={t(lang, 'bgCustom')}
        className={`relative inline-block h-7 w-7 cursor-pointer ${swatchClass(customActive)}`}
        style={{ backgroundColor: custom }}
      >
        <span className="sr-only">{t(lang, 'bgCustom')}</span>
        <input
          type="color"
          value={custom}
          aria-label={t(lang, 'bgCustom')}
          className="absolute inset-0 cursor-pointer opacity-0"
          onClick={() => onChange({ type: 'color', color: custom })}
          onChange={(event) => {
            const color = event.target.value;
            setCustom(color);
            onChange({ type: 'color', color });
          }}
        />
      </label>
      {imageUrl && (
        <button
          type="button"
          aria-pressed={value.type === 'image'}
          aria-label={t(lang, 'bgImage')}
          title={t(lang, 'bgImage')}
          onClick={() => onChange({ type: 'image', url: imageUrl })}
          className={`h-7 w-7 bg-cover bg-center ${swatchClass(value.type === 'image')}`}
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      )}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="btn btn-line h-7 px-2 text-xs"
      >
        {imageUrl ? t(lang, 'bgReplace') : t(lang, 'bgImage')}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onImage(file);
        }}
      />
    </div>
  );
}

function swatchClass(active: boolean) {
  return active
    ? 'outline outline-2 outline-offset-2 outline-(--ink)'
    : 'border border-(--line)';
}

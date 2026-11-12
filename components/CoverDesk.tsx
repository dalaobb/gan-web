'use client';

import { useEffect, useRef, useState } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import {
  COVER_FORMATS,
  COVER_TEMPLATES,
  coverBlob,
  paintCover,
  type CoverFormatId,
  type CoverTemplateId,
} from '@/lib/covers';
import { t, type Lang, type TKey } from '@/lib/i18n';

const FORMAT_LABEL: Record<CoverFormatId, TKey> = {
  blog: 'coverBlog',
  youtube: 'coverYoutube',
  x: 'coverX',
};

const TEMPLATE_LABEL: Record<CoverTemplateId, TKey> = {
  title: 'coverTemplateTitle',
  split: 'coverTemplateSplit',
  bleed: 'coverTemplateBleed',
  banner: 'coverTemplateBanner',
};

function displayFamily() {
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-newsreader')
    .trim();
  return `${family || 'Newsreader'}, "Songti SC", "Noto Serif SC", serif`;
}

function fileSlug(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return slug || 'cover';
}

export default function CoverDesk({ lang }: { lang: Lang }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formatId, setFormatId] = useState<CoverFormatId>('blog');
  const [template, setTemplate] = useState<CoverTemplateId>('title');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const format = COVER_FORMATS.find((item) => item.id === formatId) ?? COVER_FORMATS[0];

  useEffect(() => {
    if (!photoUrl) {
      setImage(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.src = photoUrl;
    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const family = displayFamily();
    document.fonts.load(`64px ${family}`).then(() => {
      if (cancelled) return;
      paintCover(canvas, {
        format,
        template,
        title: title.trim() || t(lang, 'coverTitlePlaceholder'),
        subtitle,
        image,
        fontFamily: family,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [format, template, title, subtitle, image, lang]);

  async function paintToBlob(target: (typeof COVER_FORMATS)[number]) {
    const canvas = document.createElement('canvas');
    const family = displayFamily();
    await document.fonts.load(`64px ${family}`);
    paintCover(canvas, {
      format: target,
      template,
      title: title.trim(),
      subtitle,
      image,
      fontFamily: family,
    });
    return coverBlob(canvas);
  }

  async function downloadCurrent() {
    if (!title.trim()) {
      setMessage(t(lang, 'coverNeedTitle'));
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const blob = await paintToBlob(format);
      FileSaver.saveAs(blob, `cover-${format.id}-${fileSlug(title)}.png`);
    } catch {
      setMessage(t(lang, 'coverFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function downloadAll() {
    if (!title.trim()) {
      setMessage(t(lang, 'coverNeedTitle'));
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const zip = new JSZip();
      const slug = fileSlug(title);
      for (const item of COVER_FORMATS) {
        const blob = await paintToBlob(item);
        zip.file(`cover-${item.id}-${slug}.png`, blob);
      }
      FileSaver.saveAs(await zip.generateAsync({ type: 'blob' }), `covers-${slug}.zip`);
    } catch {
      setMessage(t(lang, 'coverFailed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{t(lang, 'coversTitle')}</h1>
      <p className="mt-3 max-w-xl text-(--muted-ink)">{t(lang, 'coversLead')}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {COVER_FORMATS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === formatId}
            onClick={() => setFormatId(item.id)}
            className={
              item.id === formatId
                ? 'border border-(--ink) bg-(--paper) px-3 py-2 text-left'
                : 'border border-(--line) bg-(--paper) px-3 py-2 text-left hover:border-(--ink)'
            }
          >
            <span className="block text-sm">{t(lang, FORMAT_LABEL[item.id])}</span>
            <span className="block text-xs text-(--muted-ink)">
              {item.width}×{item.height}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {COVER_TEMPLATES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === template}
            onClick={() => setTemplate(item)}
            className={
              item === template
                ? 'border border-(--ink) px-3 py-2 text-sm'
                : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)'
            }
          >
            {t(lang, TEMPLATE_LABEL[item])}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <div className="space-y-4">
          <label className="block text-sm">
            {t(lang, 'coverTitleLabel')}
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setMessage('');
              }}
              placeholder={t(lang, 'coverTitlePlaceholder')}
              className="mt-1 w-full border border-(--line) bg-(--paper) px-3 py-2 text-base outline-none focus:border-(--ink)"
            />
          </label>
          <label className="block text-sm">
            {t(lang, 'coverSubtitleLabel')}
            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder={t(lang, 'coverSubtitlePlaceholder')}
              className="mt-1 w-full border border-(--line) bg-(--paper) px-3 py-2 text-base outline-none focus:border-(--ink)"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <label className="btn btn-line cursor-pointer">
              {photoUrl ? t(lang, 'coverPhotoReplace') : t(lang, 'coverPhoto')}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (!file) return;
                  setPhotoUrl((current) => {
                    if (current) URL.revokeObjectURL(current);
                    return URL.createObjectURL(file);
                  });
                }}
              />
            </label>
            {photoUrl ? (
              <button type="button" className="btn btn-line" onClick={() => setPhotoUrl(null)}>
                {t(lang, 'coverPhotoClear')}
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <canvas
            ref={canvasRef}
            className="w-full border border-(--line) bg-(--paper)"
            style={{ aspectRatio: `${format.width} / ${format.height}` }}
          />
          <p className="mt-2 text-sm text-(--muted-ink)">
            {format.width}×{format.height}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-solid" disabled={saving} onClick={downloadCurrent}>
              {t(lang, 'coverDownload')}
            </button>
            <button type="button" className="btn btn-line" disabled={saving} onClick={downloadAll}>
              {t(lang, 'coverDownloadAll')}
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-(--muted-ink)">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}

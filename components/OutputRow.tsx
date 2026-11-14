'use client';

import { useState } from 'react';
import FileSaver from 'file-saver';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';

export default function OutputRow({
  lang,
  name,
  blob,
  url,
  width,
  height,
  onPreview,
}: {
  lang: Lang;
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  onPreview: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error(error);
      alert(t(lang, 'copyFailed'));
    }
  }

  return (
    <li className="glass-effect flex flex-wrap items-center gap-3 p-3">
      <img
        src={url}
        alt=""
        className="h-14 w-14 shrink-0 border border-(--line) bg-white object-contain"
      />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm">{name}</p>
        <p className="mt-1 text-sm text-(--muted-ink)">
          {formatFileSize(blob.size)} · {width}×{height}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-line" onClick={onPreview}>
          {t(lang, 'preview')}
        </button>
        <button type="button" className="btn btn-line" onClick={copy}>
          {copied ? t(lang, 'copied') : t(lang, 'copy')}
        </button>
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => FileSaver.saveAs(blob, name)}
        >
          {t(lang, 'save')}
        </button>
      </div>
    </li>
  );
}

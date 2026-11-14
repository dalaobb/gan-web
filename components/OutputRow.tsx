'use client';

import { useState } from 'react';
import FileSaver from 'file-saver';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import FileListRow from '@/components/FileListRow';

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
    <FileListRow
      thumbnail={
        <img
          src={url}
          alt=""
          className="h-14 w-14 shrink-0 border border-(--line) bg-white object-contain"
        />
      }
      actions={
        <>
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
        </>
      }
    >
      <p className="truncate text-sm">{name}</p>
      <p className="mt-1 text-sm text-(--muted-ink)">
        {formatFileSize(blob.size)} · {width}×{height}
      </p>
    </FileListRow>
  );
}

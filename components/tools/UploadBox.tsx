'use client';

import { useId } from 'react';
import { t, type Lang } from '@/lib/i18n';
import { useImagePaste } from '@/lib/hooks/useImagePaste';

export default function UploadBox({
  lang,
  preview,
  afterPreview,
  beforeLabel,
  afterLabel,
  accept,
  busy,
  single = false,
  multiple = false,
  onFile,
  onFiles,
}: {
  lang: Lang;
  preview: string;
  afterPreview?: string;
  beforeLabel?: string;
  afterLabel?: string;
  accept?: string;
  busy: boolean;
  single?: boolean;
  multiple?: boolean;
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
}) {
  const inputId = useId();
  useImagePaste((files) => {
    if (onFiles) onFiles(files);
    else if (files[0]) onFile?.(files[0]);
  }, !busy);

  function take(files: FileList | File[] | null | undefined) {
    if (!files?.length) return;
    const list = Array.from(files);
    if (onFiles) onFiles(list);
    else if (list[0]) onFile?.(list[0]);
  }

  return (
    <>
      <input
        id={inputId}
        type="file"
        multiple={multiple}
        accept={
          accept ??
          'image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,.jpg,.jpeg,.png,.webp,.heic,.heif,.avif'
        }
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          take(event.target.files);
          event.target.value = '';
        }}
      />
      <label
        htmlFor={inputId}
        className="drop-zone flex min-h-72 w-full cursor-pointer items-center justify-center border-2 border-dashed p-4 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (!busy) take(event.dataTransfer.files);
        }}
      >
        {preview ? (
          afterPreview ? (
            <div className="grid w-full grid-cols-2 gap-px bg-(--line)">
              <figure className="flex h-full min-w-0 flex-col items-center bg-(--paper-2)">
                <div className="flex w-full flex-1 items-center justify-center">
                  <img
                    src={preview}
                    alt=""
                    className="block h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="py-1 text-xs text-(--muted-ink)">
                  {beforeLabel ?? t(lang, 'compressOriginal')}
                </figcaption>
              </figure>
              <figure className="flex h-full min-w-0 flex-col items-center bg-(--paper-2)">
                <div className="flex w-full flex-1 items-center justify-center">
                  <img
                    src={afterPreview}
                    alt=""
                    className="block h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="py-1 text-xs text-(--muted-ink)">
                  {afterLabel ?? t(lang, 'cutoutOutput')}
                </figcaption>
              </figure>
            </div>
          ) : (
            <img
              src={preview}
              alt=""
              className="max-h-[32rem] w-auto max-w-full object-contain"
            />
          )
        ) : (
          <div className="bg-(--paper) px-8 py-6">
            <p className="upload-title">
              {t(lang, single ? 'dropTitleSingle' : 'dropTitle')}
            </p>
            <p className="upload-hint">{t(lang, 'dropHint')}</p>
          </div>
        )}
      </label>
    </>
  );
}

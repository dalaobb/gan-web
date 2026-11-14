'use client';

// import Image from 'next/image';
import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { exampleImgs, smallModelKey } from '@/lib/utils/const';
import { exampleAlts, t, type Lang } from '@/lib/i18n';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';

export default function SelectImage({
  onChange,
  lang = 'en',
}: {
  onChange: (data: File[]) => void;
  lang?: Lang;
}) {
  const fileInputId = useId();
  // const fileInputId = useRef(`input-${crypto.randomUUID()}`).current;
  // const fileInputId = inputId;
  const dropRef = useRef<HTMLLabelElement>(null);
  const [dragging, setDragging] = useState(false);

  function clearLocalStorage() {
    if (!!new URLSearchParams(window.location.search).get('debug')) {
      window.localStorage.removeItem(smallModelKey);
    }
  }

  const handleFiles = useCallback(
    async (files?: FileList | File[] | null) => {
      if (!files?.length) return;

      const imgFiles = Array.from(files).filter((it) =>
        it.type.startsWith('image/')
      );

      if (!imgFiles?.length) return;
      onChange([...files]);
    },
    [onChange]
  );

  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;

    function dragOverEvent(e: DragEvent) {
      e.preventDefault();
      drop?.classList.add('drag-over');
      setDragging(true);
    }

    function dragLeaveEvent(e: DragEvent) {
      e.preventDefault();
      const next = e.relatedTarget;
      if (next instanceof Node && drop?.contains(next)) return;
      drop?.classList.remove('drag-over');
      setDragging(false);
    }

    function dropEvent(e: DragEvent) {
      e.preventDefault();
      drop?.classList.remove('drag-over');
      setDragging(false);
      const files = e.dataTransfer?.files;
      handleFiles(files);
    }

    drop.addEventListener('dragover', dragOverEvent);
    drop.addEventListener('dragleave', dragLeaveEvent);
    drop.addEventListener('drop', dropEvent);

    return () => {
      drop.removeEventListener('dragover', dragOverEvent);
      drop.removeEventListener('dragleave', dragLeaveEvent);
      drop.removeEventListener('drop', dropEvent);
    };
  }, [handleFiles]);

  useEffect(() => {
    function pasteEvent(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      const imgs: File[] = [];
      for (let i = 0; items && i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && file.type.startsWith('image/')) {
            imgs.push(file);
          }
        }
      }
      handleFiles(imgs);
    }
    document.documentElement.addEventListener('paste', pasteEvent);

    return () => {
      document.documentElement.removeEventListener('paste', pasteEvent);
    };
  }, [handleFiles]);

  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingImgLeft, setLoadingImgLeft] = useState(0);
  async function exampleImgClick(
    e: React.MouseEvent<HTMLDivElement | HTMLImageElement, MouseEvent>
  ) {
    const img = e.target;
    if (img instanceof HTMLImageElement) {
      setLoadingImg(true);
      setLoadingImgLeft(img.offsetLeft);
      const blob = await new Promise<Blob | null>((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(resolve);
      });
      if (!blob) {
        throw Error('Image to Blob');
      }
      const file = new File([blob], (e.target as HTMLImageElement).alt, {
        type: blob.type,
      });
      handleFiles([file]);
      setLoadingImg(false);
    }
  }

  return (
    <>
      <div className="relative m-auto min-h-72 w-full text-sm">
        <input
          type="file"
          accept="image/*"
          multiple
          id={fileInputId}
          className="opacity-0 h-0"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <label
          ref={dropRef}
          htmlFor={fileInputId}
          className="drop-zone absolute inset-0 flex cursor-pointer items-center justify-center border-2 border-dashed text-center"
        >
          <div className="bg-(--paper) px-8 py-6">
            <p className="upload-title">
              {dragging ? t(lang, 'dropRelease') : t(lang, 'dropTitle')}
            </p>
            <p className="upload-hint">{t(lang, 'dropHint')}</p>
          </div>
        </label>
      </div>
      <div className="mt-5 block items-center sm:flex">
        <div
          className="mb-3 text-center text-sm text-(--muted-ink) sm:mr-8 sm:mb-0 sm:text-start"
          onClick={clearLocalStorage}
        >
          <p className="text-(--ink)">{t(lang, 'startRemoving')}</p>
          <p>{t(lang, 'tryExamples')}</p>
        </div>
        <div
          className="relative flex flex-1 justify-around sm:justify-between"
          onClickCapture={exampleImgClick}
        >
          <div
            className={`absolute inset-0 bg-black/3 ${
              loadingImg ? 'flex' : 'hidden'
            } items-center`}
          >
            <div
              style={{ left: loadingImgLeft }}
              className="absolute ml-5 md:ml-6 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"
            ></div>
          </div>
          {exampleImgs.map(({ src }, index) => (
            <ImageWithSkeleton
              key={src}
              src={src}
              alt={exampleAlts[lang][index] || src}
              className="h-14 w-14 cursor-pointer border border-(--line) object-cover md:h-16 md:w-16"
            />
          ))}
        </div>
      </div>
    </>
  );
}

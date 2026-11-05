'use client';

import { useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import {
  backdropStyle,
  paintBackground,
  type Backdrop,
} from '@/lib/utils/background';
import ImgCompareSlider from './ImgCompareSlider';
import ImgModal from './ImgModal';

export interface IPreviewDownloadProps {
  beforeFile: Blob & { name: string };
  afterFile?: Blob & { name: string };
  processing: boolean;
  lang?: Lang;
  backdrop?: Backdrop;
  className?: string;
  onClose: () => void;
}

export default function PreviewDownload({
  beforeFile,
  afterFile,
  className,
  processing,
  lang = 'en',
  backdrop = { type: 'transparent' },
  onClose,
}: IPreviewDownloadProps) {
  const [beforeSrc, setBeforeSrc] = useState<string>();
  const [afterSrc, setAfterSrc] = useState<string>();
  const [composited, setComposited] = useState<
    (Blob & { name: string }) | null
  >(null);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownFile =
    backdrop.type !== 'transparent' && composited ? composited : afterFile;
  const frameStyle =
    backdrop.type !== 'transparent' && !composited
      ? backdropStyle(backdrop)
      : undefined;

  function preview() {
    setShow(true);
  }

  async function resultFile() {
    if (!afterFile) return;
    if (backdrop.type === 'transparent') return afterFile;
    if (composited) return composited;
    try {
      return Object.assign(await paintBackground(afterFile, backdrop), {
        name: afterFile.name,
      });
    } catch (err) {
      console.error(err);
      alert(t(lang, 'bgFailed'));
    }
  }

  async function copyFile() {
    const file = await resultFile();
    if (!file) return;

    try {
      const clipboardItem = new ClipboardItem({
        [file.type]: file,
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error(err);
      alert(t(lang, 'bgFailed'));
    }
  }

  async function saveFile() {
    const file = await resultFile();
    if (!file) return;
    FileSaver.saveAs(file, file.name);
  }

  useEffect(() => {
    const url = URL.createObjectURL(beforeFile);
    setBeforeSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [beforeFile]);

  useEffect(() => {
    if (!afterFile || backdrop.type === 'transparent') {
      setComposited(null);
      return;
    }
    let cancelled = false;
    setComposited(null);
    const cutout = afterFile;
    const choice = backdrop;
    paintBackground(cutout, choice)
      .then((blob) => {
        if (!cancelled) {
          setComposited(Object.assign(blob, { name: cutout.name }));
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setComposited(null);
      });
    return () => {
      cancelled = true;
    };
  }, [afterFile, backdrop]);

  useEffect(() => {
    if (!shownFile) return;

    const url = URL.createObjectURL(shownFile);
    setAfterSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [shownFile]);
  return (
    <div
      className={`glass-effect ${processing ? 'processing' : ''} ${className}`}
    >
      <ImgCompareSlider
        beforeSrc={beforeSrc}
        afterSrc={afterSrc}
        processing={processing}
        lang={lang}
        backdrop={
          frameStyle ? backdrop : { type: 'transparent' }
        }
        onClose={onClose}
      />
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 truncate">
          {beforeFile.name}
        </h3>
        <p className="mb-3 flex justify-between text-xs text-(--muted-ink)">
          <span>{formatFileSize(beforeFile.size)}</span>
          {shownFile?.size && (
            <span>
              {t(lang, 'after')} {formatFileSize(shownFile.size)}
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button onClick={preview} className="btn btn-line flex-1">
            {t(lang, 'preview')}
          </button>
          {!!afterSrc && (
            <>
              <button onClick={copyFile} className="btn btn-line flex-1">
                {copied ? t(lang, 'copied') : t(lang, 'copy')}
              </button>
              <button onClick={saveFile} className="btn btn-solid flex-1">
                {t(lang, 'save')}
              </button>
            </>
          )}
        </div>
      </div>
      {beforeSrc && (
        <ImgModal
          isVisible={show}
          url={afterSrc || beforeSrc}
          imgStyle={frameStyle}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import ImgCompareSlider from './ImgCompareSlider';
import ImgModal from './ImgModal';

export interface IPreviewDownloadProps {
  beforeFile: Blob & { name: string };
  afterFile?: Blob & { name: string };
  processing: boolean;
  lang?: Lang;
  className?: string;
  onClose: () => void;
}

export default function PreviewDownload({
  beforeFile,
  afterFile,
  className,
  processing,
  lang = 'en',
  onClose,
}: IPreviewDownloadProps) {
  const [beforeSrc, setBeforeSrc] = useState<string>();
  const [afterSrc, setAfterSrc] = useState<string>();
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  function preview() {
    setShow(true);
  }

  async function copyFile() {
    if (!afterFile) return;

    const clipboardItem = new ClipboardItem({
      [afterFile.type]: afterFile,
    });
    await navigator.clipboard.write([clipboardItem]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    console.log('good');
  }

  async function saveFile() {
    if (!afterFile) return;

    FileSaver.saveAs(afterFile, afterFile.name);
  }

  useEffect(() => {
    const url = URL.createObjectURL(beforeFile);
    setBeforeSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [beforeFile]);

  useEffect(() => {
    if (!afterFile) return;

    const url = URL.createObjectURL(afterFile);
    setAfterSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [afterFile]);
  return (
    <div
      className={`glass-effect ${processing ? 'processing' : ''} ${className}`}
    >
      <ImgCompareSlider
        beforeSrc={beforeSrc}
        afterSrc={afterSrc}
        processing={processing}
        lang={lang}
        onClose={onClose}
      />
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 truncate">
          {beforeFile.name}
        </h3>
        <p className="mb-3 flex justify-between text-xs text-[var(--muted-ink)]">
          <span>{formatFileSize(beforeFile.size)}</span>
          {afterFile?.size && (
            <span>
              {t(lang, 'after')} {formatFileSize(afterFile.size)}
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
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}

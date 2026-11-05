'use client';

import { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { formatTime } from '@/lib/utils';
import { smallModelKey } from '@/lib/utils/const';
import { removeBackground } from '@/lib/utils/remover';
import { isMobileDevice } from '@/lib/utils/remover/utils';
import { ImageType } from '@/lib/types';
import { t, type Lang } from '@/lib/i18n';
import PreviewDownload from '@/components/PreviewDownload';
import SelectImage from '@/components/SelectImage';

const MODEL_CDN = 'https://cdn.bgg.one/remove-bg/model/1.5.3/';

export default function RemoveBg({ lang = 'en' }: { lang?: Lang }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [outOfMemory, setOutOfMemory] = useState(false);
  const [imgSliders, setImgSliders] = useState<
    {
      beforeFile: Blob & { name: string };
      afterFile?: Blob & { name: string };
      status?: 'fulfilled' | 'rejected' | 'processing';
    }[]
  >();
  const [format, setFormat] = useState<ImageType>(ImageType.PNG);
  const [time, setTime] = useState('');
  const [wasmOnnxModel, setWasmOnnxModel] = useState(false);

  useEffect(() => {
    const model = window.localStorage.getItem(smallModelKey);
    setWasmOnnxModel(!!model);
  }, []);

  function changeModel() {
    const model = 'u2netp.onnx';
    window.localStorage.setItem(smallModelKey, model);
    window.location.reload();
  }

  const handleFiles = useCallback(async (imgFiles: File[]) => {
    setOutOfMemory(false);
    setImgSliders(
      imgFiles.map((file) => ({
        beforeFile: file,
      }))
    );
  }, []);

  const remove = useCallback(async () => {
    if (isLoading || !imgSliders?.length) return;

    const startTime = performance.now();
    setIsLoading(true);
    setOutOfMemory(false);
    // const isLow = isLowEndDevice();
    const isMobile = isMobileDevice();
    // const result: Array<PromiseSettledResult<Blob>> = [];
    const model = window.localStorage.getItem(smallModelKey);
    for (const item of imgSliders) {
      const { beforeFile: file } = item;
      try {
        item.status = 'processing';
        setImgSliders([...imgSliders]);
        const output = await removeBackground(file, {
          device: 'gpu',
          publicPath: MODEL_CDN,
          proxyToWorker: true,
          progress: (key, current, total) => {
            if (
              typeof current === 'number' &&
              (current === total || total < 8)
            ) {
              setIsDownloading(false);
            } else {
              setIsDownloading(true);
            }
          },
          model: isMobile ? 'isnet_quint8' : 'isnet',
          ...(model
            ? {
                mInfo: {
                  modelUrl: `https://cdn.bgg.one/remove-bg/model/${model}`,
                  size: 320,
                  inputKey: 'input.1',
                },
              }
            : {}),
          debug:
            process.env.NODE_ENV === 'development' ||
            !!new URLSearchParams(window.location.search).get('debug'),
          output: {
            format,
            quality: isMobile ? 0.4 : 1,
          },
        });
        item.status = 'fulfilled';
        item.afterFile = Object.assign(output, {
          name:
            file.name.replace(/\.\w+$/, '') +
            '_BgGone' +
            output.type.replace(/^\w+\//, '.'),
        });
      } catch (err) {
        console.error('Failed to process', file.name, err);
        item.status = 'rejected';
        // item.err = err;
      }
    }
    console.log('result', imgSliders);
    const fulfilled = imgSliders.filter((it) => it.status === 'fulfilled');
    console.log('fulfilled', fulfilled);
    if (!fulfilled.length) {
      setOutOfMemory(true);
    }
    setImgSliders([...imgSliders]);
    setIsLoading(false);

    const duringTime = performance.now() - startTime;
    setTime(formatTime(duringTime));
  }, [isLoading, imgSliders, format, lang]);

  const imgs = imgSliders
    ?.filter((it) => !!it.afterFile)
    ?.map((it) => it.afterFile);
  const isDone = !isLoading && !!imgs?.length;

  const downloadSingle = () => {
    if (!isDone) return;

    for (let file of imgs) {
      FileSaver.saveAs(file!, file!.name);
    }
  };

  const downloadAll = async () => {
    if (!isDone) return;

    try {
      const zip = new JSZip();
      imgs.forEach((file) => {
        zip.file(file!.name, file!);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      FileSaver.saveAs(content, 'BgGone.zip');
    } catch (err) {
      console.error(err);
      alert(t(lang, 'failedPackage'));
    }
  };

  return (
    <>
      <div className="main-width">
        <SelectImage lang={lang} onChange={handleFiles} />
      </div>
      <div className="main-width mt-2 flex h-7 items-center text-sm text-[var(--muted-ink)] md:h-8">
        {wasmOnnxModel && <span>{t(lang, 'noticeLightModel')}</span>}
      </div>
      {!!imgSliders?.length && (
        <div>
          <div className="glass-effect main-width p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm">
                <span>
                  {t(lang, 'selected')} <span>{imgSliders?.length}</span>
                </span>
                <div className="flex items-center gap-2">
                  <label>{t(lang, 'outputFormat')}</label>
                  <select
                    className="border border-[var(--line)] bg-[var(--paper)] px-2 py-1"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ImageType)}
                  >
                    <option value={ImageType.PNG}>PNG</option>
                    <option value={ImageType.WEBP}>WebP</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={isLoading}
                  onClick={remove}
                  className="btn btn-solid"
                >
                  {isDownloading
                    ? t(lang, 'loading')
                    : isLoading
                      ? t(lang, 'removing')
                      : t(lang, 'start')}
                </button>
                <button
                  disabled={isLoading}
                  onClick={() => setImgSliders([])}
                  className="btn btn-line"
                >
                  {t(lang, 'clear')}
                </button>
              </div>
            </div>
          </div>
          <div className="main-width pt-2 pb-6 text-sm text-[#9f2d2d]">
            {outOfMemory && (
              <>
                <span>{t(lang, 'oomWarning')}</span>
                {!wasmOnnxModel && (
                  <button
                    onClick={changeModel}
                    className="btn btn-solid mt-2 w-full"
                  >
                    {t(lang, 'trySmallerModel')}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-3 main-max-width">
            {imgSliders?.map(({ beforeFile, afterFile, status }, index) => (
              <PreviewDownload
                lang={lang}
                className="image-card mb-5 break-inside-avoid border border-[var(--line)]"
                key={beforeFile.name + (afterFile?.name || '')}
                beforeFile={beforeFile}
                afterFile={afterFile}
                processing={status === 'processing'}
                onClose={() =>
                  setImgSliders(imgSliders.filter((_, i) => i !== index))
                }
              />
            ))}
          </div>
          <div
            className={`glass-effect main-width mt-4 p-6 ${
              isDone ? 'block' : 'hidden'
            }`}
          >
            <div className="text-center">
              <h3 className="mb-4 text-2xl">{t(lang, 'done', { time })}</h3>
              <div className="flex justify-center gap-2">
                <button onClick={downloadSingle} className="btn btn-solid">
                  {t(lang, 'download')}
                </button>
                <button onClick={downloadAll} className="btn btn-line">
                  {t(lang, 'downloadAllZip')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

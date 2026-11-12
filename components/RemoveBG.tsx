'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { formatFileSize, formatTime } from '@/lib/utils';
import { smallModelKey } from '@/lib/utils/const';
import { removeBackground } from '@/lib/utils/remover';
import { isMobileDevice } from '@/lib/utils/remover/utils';
import { ImageType } from '@/lib/types';
import { t, type Lang } from '@/lib/i18n';
import { paintBackground, type Backdrop } from '@/lib/utils/background';
import BackgroundPicker from '@/components/BackgroundPicker';
import CompressCompareStage from '@/components/CompressCompareStage';
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
  const [backdrop, setBackdrop] = useState<Backdrop>({ type: 'transparent' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState('');
  const [wasmOnnxModel, setWasmOnnxModel] = useState(false);
  const [compareAt, setCompareAt] = useState<number | null>(null);
  const [beforeUrls, setBeforeUrls] = useState<string[]>([]);
  const [compareResults, setCompareResults] = useState<(Blob | undefined)[]>([]);

  useEffect(() => {
    const model = window.localStorage.getItem(smallModelKey);
    setWasmOnnxModel(!!model);
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    setBackdrop({ type: 'image', url });
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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

  const slidersRef = useRef(imgSliders);
  slidersRef.current = imgSliders;
  const backdropRef = useRef(backdrop);
  backdropRef.current = backdrop;

  const fileKey = imgSliders?.map((item) => `${item.beforeFile.name}:${item.beforeFile.size}`).join('|') ?? '';
  const resultKey =
    imgSliders?.map((item) => (item.afterFile ? `${item.afterFile.size}:${item.afterFile.type}` : '')).join('|') ?? '';
  const backdropKey =
    backdrop.type === 'color'
      ? `color:${backdrop.color}`
      : backdrop.type === 'image'
        ? `image:${backdrop.url}`
        : 'transparent';
  const openKey = compareAt == null ? '' : `${compareAt}:${fileKey}`;
  const resultStamp = compareAt == null ? '' : `${fileKey}|${resultKey}|${backdropKey}`;
  const [urlKey, setUrlKey] = useState('');
  const [shownStamp, setShownStamp] = useState('');
  if (openKey !== urlKey) {
    setUrlKey(openKey);
    setBeforeUrls([]);
  }
  if (resultStamp !== shownStamp) {
    setShownStamp(resultStamp);
    setCompareResults([]);
  }

  useEffect(() => {
    const items = slidersRef.current;
    if (compareAt == null || !items?.length) return;
    const urls = items.map((item) => URL.createObjectURL(item.beforeFile));
    setBeforeUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [compareAt, fileKey]);

  useEffect(() => {
    const items = slidersRef.current;
    if (compareAt == null || !items?.length) return;
    let cancelled = false;
    const choice = backdropRef.current;
    Promise.all(
      items.map(async (item) => {
        if (!item.afterFile) return undefined;
        if (choice.type === 'transparent') return item.afterFile;
        return Object.assign(await paintBackground(item.afterFile, choice), {
          name: item.afterFile.name,
        });
      })
    )
      .then((list) => {
        if (!cancelled) setCompareResults(list);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setCompareResults(items.map((item) => item.afterFile));
      });
    return () => {
      cancelled = true;
    };
  }, [compareAt, resultKey, backdropKey]);

  const compareItems = useMemo(() => {
    if (compareAt == null || !imgSliders || beforeUrls.length !== imgSliders.length) return [];
    return imgSliders.map((item, index) => {
      const result = compareResults[index];
      return {
        id: String(index),
        file: item.beforeFile,
        preview: beforeUrls[index],
        result,
        resultName: item.afterFile?.name ?? item.beforeFile.name,
        caption: result
          ? `${formatFileSize(item.beforeFile.size)} → ${formatFileSize(result.size)}`
          : formatFileSize(item.beforeFile.size),
      };
    });
  }, [compareAt, imgSliders, beforeUrls, compareResults]);

  const imgs = imgSliders
    ?.filter((it) => !!it.afterFile)
    ?.map((it) => it.afterFile);
  const isDone = !isLoading && !!imgs?.length;

  const filesToSave = useCallback(async () => {
    const ready = (imgs ?? []).filter((file): file is Blob & { name: string } => !!file);
    if (backdrop.type === 'transparent') return ready;
    return Promise.all(
      ready.map(async (file) =>
        Object.assign(await paintBackground(file, backdrop), { name: file.name })
      )
    );
  }, [imgs, backdrop]);

  const downloadSingle = async () => {
    if (!isDone || saving) return;
    setSaving(true);
    try {
      for (const file of await filesToSave()) {
        FileSaver.saveAs(file, file.name);
      }
    } catch (err) {
      console.error(err);
      alert(t(lang, 'bgFailed'));
    } finally {
      setSaving(false);
    }
  };

  const downloadAll = async () => {
    if (!isDone || saving) return;
    setSaving(true);
    try {
      const zip = new JSZip();
      for (const file of await filesToSave()) {
        zip.file(file.name, file);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      FileSaver.saveAs(content, 'BgGone.zip');
    } catch (err) {
      console.error(err);
      alert(t(lang, 'failedPackage'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="main-width">
        <SelectImage lang={lang} onChange={handleFiles} />
      </div>
      <div className="main-width mt-2 flex h-7 items-center text-sm text-(--muted-ink) md:h-8">
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
                    className="border border-(--line) bg-(--paper) px-2 py-1"
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
            <div className="mt-4 border-t border-(--line) pt-4">
                <BackgroundPicker
                  lang={lang}
                  value={backdrop}
                  imageUrl={imageUrl}
                  onChange={setBackdrop}
                  onImage={setImageFile}
                />
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
                className="image-card mb-5 break-inside-avoid border border-(--line)"
                key={beforeFile.name + (afterFile?.name || '')}
                beforeFile={beforeFile}
                afterFile={afterFile}
                backdrop={backdrop}
                processing={status === 'processing'}
                onPreview={() => setCompareAt(index)}
                onClose={() => {
                  setCompareAt(null);
                  setImgSliders(imgSliders.filter((_, i) => i !== index));
                }}
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
                <button
                  onClick={downloadSingle}
                  disabled={saving}
                  className="btn btn-solid"
                >
                  {t(lang, 'download')}
                </button>
                <button
                  onClick={downloadAll}
                  disabled={saving}
                  className="btn btn-line"
                >
                  {t(lang, 'downloadAllZip')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {compareAt != null && compareItems.length ? (
        <CompressCompareStage
          lang={lang}
          initialId={String(compareAt)}
          outputLabel={t(lang, 'cutoutOutput')}
          onClose={() => setCompareAt(null)}
          items={compareItems}
        />
      ) : null}
    </>
  );
}

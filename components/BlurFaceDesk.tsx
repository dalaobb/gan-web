'use client';

import { useEffect, useRef, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';
import { normalizePortrait } from '@/lib/passport/normalize';
import { detectFaceBoxes, type FaceBox } from '@/lib/passport/face';
import { renderFaceBlur } from '@/lib/image/effects';
import UploadBox from '@/components/tools/UploadBox';
import OutputRow from '@/components/OutputRow';
import CompressCompareStage from '@/components/CompressCompareStage';
import ManualFaceBoxEditor from '@/components/ManualFaceBoxEditor';

type Result = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  name: string;
};

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function BlurFaceDesk({
  lang,
  heading,
  lead,
}: {
  lang: Lang;
  heading: string;
  lead: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [boxes, setBoxes] = useState<FaceBox[]>([]);
  const [blur, setBlur] = useState(18);
  const [confidence, setConfidence] = useState(0.35);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const previewRef = useRef('');
  const resultRef = useRef('');

  useEffect(() => {
    return () => {
      revoke(previewRef.current);
      revoke(resultRef.current);
    };
  }, []);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setDetecting(true);
    setError('');
    setStatus(t(lang, 'processing'));
    setBoxes([]);
    setResult(null);
    revoke(resultRef.current);
    resultRef.current = '';

    void (async () => {
      try {
        const bitmap = await createImageBitmap(file, {
          imageOrientation: 'from-image',
        });
        try {
          const faces = await detectFaceBoxes(bitmap, confidence);
          if (cancelled) return;
          if (!faces.length) {
            setError(t(lang, 'noFaces'));
            setStatus('');
          } else {
            setBoxes(faces);
            setStatus(
              t(lang, 'facesFound', { count: String(faces.length) })
            );
          }
        } finally {
          bitmap.close();
        }
      } catch (reason) {
        console.error(reason);
        if (!cancelled) {
          setError(t(lang, 'toolFailed'));
          setStatus('');
        }
      } finally {
        if (!cancelled) setDetecting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [confidence, file, lang]);

  useEffect(() => {
    if (!file || !boxes.length) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      renderFaceBlur(file, boxes, blur)
        .then((next) => {
          if (cancelled) return;
          revoke(resultRef.current);
          resultRef.current = URL.createObjectURL(next.blob);
          setResult({
            blob: next.blob,
            url: resultRef.current,
            width: next.width,
            height: next.height,
            name: `${file.name.replace(/\.[^.]+$/, '') || 'image'}_faces_BgGone.jpg`,
          });
          setError('');
        })
        .catch((reason) => {
          console.error(reason);
          if (!cancelled) setError(t(lang, 'toolFailed'));
        });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [blur, boxes, file, lang]);

  async function handleFile(selected: File) {
    setBusy(true);
    setError('');
    setStatus(t(lang, 'processing'));
    setBoxes([]);
    setResult(null);
    setFile(null);
    setManualOpen(false);
    if (previewRef.current) revoke(previewRef.current);
    if (resultRef.current) revoke(resultRef.current);
    previewRef.current = '';
    resultRef.current = '';
    setPreview('');

    try {
      const input = await normalizePortrait(selected);
      previewRef.current = URL.createObjectURL(input);
      setPreview(previewRef.current);
      setFile(input);
    } catch (reason) {
      console.error(reason);
      setError(t(lang, 'toolFailed'));
      setStatus('');
    } finally {
      setBusy(false);
    }
  }

  const items =
    file && result
      ? [
          {
            id: '0',
            file: new File([file], result.name, { type: file.type }),
            preview,
            result: result.blob,
            resultName: result.name,
            width: result.width,
            height: result.height,
          },
        ]
      : [];

  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">{heading}</h1>
        <p className="mt-3 text-base text-(--muted-ink)">{lead}</p>
      </header>

      <div className="main-width">
        <UploadBox
          lang={lang}
          preview={preview}
          afterPreview={result?.url}
          busy={busy || detecting}
          single
          onFile={handleFile}
        />
        {status || error ? (
          <p className="mt-3 text-sm text-(--muted-ink)">{error || status}</p>
        ) : null}

        <div className="glass-effect mt-4 p-4">
          <label className="block text-sm">
            <span className="flex justify-between text-(--muted-ink)">
              <span>{t(lang, 'blurAmount')}</span>
              <span>{blur}px</span>
            </span>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={blur}
              disabled={busy || detecting || !boxes.length}
              className="mt-2 w-full"
              onChange={(event) => setBlur(Number(event.target.value))}
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="flex justify-between text-(--muted-ink)">
              <span>{t(lang, 'detectionSensitivity')}</span>
              <span>{Math.round(confidence * 100)}%</span>
            </span>
            <input
              type="range"
              min={0.2}
              max={0.7}
              step={0.05}
              value={confidence}
              disabled={!file || busy || detecting}
              className="mt-2 w-full"
              onChange={(event) =>
                setConfidence(Number(event.target.value))
              }
            />
          </label>
          <p className="mt-2 text-sm text-(--muted-ink)">
            {t(lang, 'detectionSensitivityNote')}
          </p>

          <button
            type="button"
            className="btn btn-line mt-3 w-full"
            disabled={!file || busy || detecting}
            onClick={() => setManualOpen(true)}
          >
            {t(lang, 'manualBoxes')}
          </button>

          <p className="mt-3 text-sm text-(--muted-ink)">
            {t(lang, 'blurFaceNote')}
          </p>
        </div>
      </div>

      {result ? (
        <div className="main-width mt-6">
          <ul>
            <OutputRow
              lang={lang}
              name={result.name}
              blob={result.blob}
              url={result.url}
              width={result.width}
              height={result.height}
              onPreview={() => setPreviewOpen(true)}
            />
          </ul>
        </div>
      ) : null}

      {manualOpen && file && preview ? (
        <ManualFaceBoxEditor
          lang={lang}
          url={preview}
          initialBoxes={boxes}
          onApply={(next) => {
            setBoxes(next);
            setManualOpen(false);
            setError('');
            setStatus(
              t(lang, 'manualBoxesCount', { count: String(next.length) })
            );
          }}
          onClose={() => setManualOpen(false)}
        />
      ) : null}

      {previewOpen && items.length ? (
        <CompressCompareStage
          items={items}
          lang={lang}
          initialId="0"
          title={t(lang, 'preview')}
          outputLabel={t(lang, 'blurFaceOutput')}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
}

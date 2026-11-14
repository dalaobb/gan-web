'use client';

import { useEffect, useRef, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';
import { normalizePortrait } from '@/lib/passport/normalize';
import { removeLocalBackground } from '@/lib/image/remove';
import { renderWhiteBackground } from '@/lib/image/effects';
import UploadBox from '@/components/tools/UploadBox';
import OutputRow from '@/components/OutputRow';
import CompressCompareStage from '@/components/CompressCompareStage';

type Result = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  name: string;
};

const SIZE = 2000;

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function WhiteBackgroundDesk({
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
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [padding, setPadding] = useState(0.12);
  const [shadow, setShadow] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef('');
  const resultRef = useRef('');

  useEffect(() => {
    return () => {
      revoke(previewRef.current);
      revoke(resultRef.current);
    };
  }, []);

  useEffect(() => {
    if (!file || !cutout) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      renderWhiteBackground(cutout, { size: SIZE, padding, shadow })
        .then((next) => {
          if (cancelled) return;
          revoke(resultRef.current);
          resultRef.current = URL.createObjectURL(next.blob);
          setResult({
            blob: next.blob,
            url: resultRef.current,
            width: next.width,
            height: next.height,
            name: `${file.name.replace(/\.[^.]+$/, '') || 'product'}_white_BgGone.jpg`,
          });
          setStatus('');
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
  }, [cutout, file, lang, padding, shadow]);

  async function handleFile(selected: File) {
    setBusy(true);
    setError('');
    setStatus(t(lang, 'processing'));
    setCutout(null);
    setResult(null);
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
      setCutout(await removeLocalBackground(input));
    } catch (reason) {
      console.error(reason);
      setError(t(lang, 'toolFailed'));
      setStatus('');
    } finally {
      setBusy(false);
    }
  }

  const items =
    result && file
      ? [
          {
            id: '0',
            file: new File([result.blob], result.name, {
              type: result.blob.type,
            }),
            preview: result.url,
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
        <div className="glass-effect p-4">
          <UploadBox
            lang={lang}
            preview={preview}
            afterPreview={result?.url}
            busy={busy}
            onFile={handleFile}
          />
          {status || error ? (
            <p className="mt-3 text-sm text-(--muted-ink)">{error || status}</p>
          ) : null}
        </div>

        <div className="glass-effect mt-4 p-4">
          <label className="block text-sm">
            <span className="flex justify-between text-(--muted-ink)">
              <span>{t(lang, 'whitePadding')}</span>
              <span>{Math.round(padding * 100)}%</span>
            </span>
            <input
              type="range"
              min={0.05}
              max={0.2}
              step={0.01}
              value={padding}
              disabled={busy || !cutout}
              className="mt-2 w-full"
              onChange={(event) => setPadding(Number(event.target.value))}
            />
          </label>

          <label className="mt-3 flex items-center gap-2 text-sm text-(--muted-ink)">
            <input
              type="checkbox"
              checked={shadow}
              disabled={busy || !cutout}
              onChange={(event) => setShadow(event.target.checked)}
            />
            {t(lang, 'whiteShadow')}
          </label>

          <p className="mt-3 text-sm text-(--muted-ink)">
            {t(lang, 'whiteBackgroundNote', {
              size: `${SIZE}×${SIZE}`,
            })}
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

      {previewOpen && items.length ? (
        <CompressCompareStage
          items={items}
          lang={lang}
          initialId="0"
          compare={false}
          title={t(lang, 'preview')}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { formatFileSize } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import { compressGif, type GifCompressResult } from '@/lib/gif/compress';
import UploadBox from '@/components/tools/UploadBox';
import OutputRow from '@/components/OutputRow';
import CompressCompareStage from '@/components/CompressCompareStage';

const TARGETS = [
  { label: '100 KB', bytes: 100 * 1024 },
  { label: '256 KB', bytes: 256 * 1024 },
  { label: '512 KB', bytes: 512 * 1024 },
  { label: '1 MB', bytes: 1024 * 1024 },
  { label: '2 MB', bytes: 2 * 1024 * 1024 },
  { label: '3 MB', bytes: 3 * 1024 * 1024 },
  { label: '5 MB', bytes: 5 * 1024 * 1024 },
] as const;

function revoke(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function GifCompressDesk({
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
  const [targetBytes, setTargetBytes] = useState<number>(2 * 1024 * 1024);
  const [result, setResult] = useState<GifCompressResult | null>(null);
  const [running, setRunning] = useState(false);
  const [attempt, setAttempt] = useState<{ current: number; total: number } | null>(null);
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

  function takeFile(selected: File) {
    if (!selected.type.startsWith('image/gif') && !/\.gif$/i.test(selected.name)) {
      return;
    }
    revoke(previewRef.current);
    revoke(resultRef.current);
    previewRef.current = URL.createObjectURL(selected);
    resultRef.current = '';
    setPreview(previewRef.current);
    setFile(selected);
    setResult(null);
    setError('');
  }

  async function run() {
    if (!file || running) return;
    setRunning(true);
    setError('');
    setAttempt(null);
    revoke(resultRef.current);
    resultRef.current = '';
    setResult(null);
    try {
      const next = await compressGif(
        file,
        targetBytes,
        (current, total) => setAttempt({ current, total })
      );
      resultRef.current = next.url;
      setResult(next);
    } catch (reason) {
      console.error(reason);
      setError(t(lang, 'toolFailed'));
    } finally {
      setRunning(false);
      setAttempt(null);
    }
  }

  const items =
    file && result
      ? [
          {
            id: '0',
            file,
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
        <div className="glass-effect p-4">
          <UploadBox
            lang={lang}
            preview={preview}
            afterPreview={result?.url}
            accept="image/gif,.gif"
            busy={running}
            onFile={takeFile}
          />
          {error ? (
            <p className="mt-3 text-sm text-(--muted-ink)">{error}</p>
          ) : null}
        </div>

        <div className="glass-effect mt-4 p-4">
          <p className="text-sm text-(--muted-ink)">{t(lang, 'gifTarget')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TARGETS.map((target) => (
              <button
                key={target.label}
                type="button"
                aria-pressed={targetBytes === target.bytes}
                disabled={running}
                className={
                  targetBytes === target.bytes
                    ? 'border border-(--ink) px-3 py-2 text-sm'
                    : 'border border-(--line) px-3 py-2 text-sm text-(--muted-ink) hover:border-(--ink) hover:text-(--ink)'
                }
                onClick={() => setTargetBytes(target.bytes)}
              >
                {target.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-solid"
              disabled={!file || running}
              onClick={run}
            >
              {running && attempt
                ? t(lang, 'compressProgress', {
                    current: String(attempt.current),
                    total: String(attempt.total),
                  })
                : t(lang, 'gifStart')}
            </button>
            {result ? (
              <span className="text-sm text-(--muted-ink)">
                {file ? formatFileSize(file.size) : ''} →{' '}
                {formatFileSize(result.blob.size)} · {result.width}×
                {result.height} ·{' '}
                {t(lang, 'gifFrames', {
                  count: String(result.frames),
                })}
                {result.alreadySmall
                  ? ` · ${t(lang, 'gifAlreadySmall')}`
                  : result.blob.size > targetBytes
                    ? ` · ${t(lang, 'gifOverTarget')}`
                    : null}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-(--muted-ink)">
            {t(lang, 'gifNote')}
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
          title={t(lang, 'preview')}
          outputLabel={t(lang, 'compressOutput')}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
}

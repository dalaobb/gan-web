'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { IMAGE_CREDITS } from '@/lib/credit-costs';
import { localizedPath, t, type Lang } from '@/lib/i18n';
import type { StylePreset } from '@/lib/db/prompt';
import { styleMedia } from '@/lib/style-media';
import { useFalAsyncGeneration } from '@/lib/hooks/ai';

export default function StyleStudio({
  lang,
  preset,
}: {
  lang: Lang;
  preset: StylePreset;
}) {
  const { data: session, isPending } = authClient.useSession();
  const { generate, result, isLoading } = useFalAsyncGeneration();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const title = lang === 'zh' ? preset.nameZh : preset.name;
  const media = styleMedia(preset.id);
  const backHref = localizedPath(lang, '/styles/');
  const nextPath = localizedPath(lang, `/styles/${preset.id}/`);
  const loginHref = `${localizedPath(lang, '/login/')}?next=${encodeURIComponent(nextPath)}`;
  const imageUrl = result?.data?.images?.[0]?.url;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!file) {
      setMessage(t(lang, 'styleNeedImage'));
      return;
    }
    try {
      await generate({
        modelId: 'g1',
        prompt: preset.id,
        files: [file],
        image_urls: [],
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t(lang, 'styleFailed'));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      <a href={backHref} className="text-sm text-(--muted-ink) hover:text-(--ink)">
        {t(lang, 'styleBack')}
      </a>
      <h1 className="mt-4 text-4xl leading-tight sm:text-[2.75rem]">{title}</h1>
      <section className="mt-8">
        <h2 className="text-sm text-(--muted-ink)">{t(lang, 'styleExamples')}</h2>
        <div className="mt-3">
          <img
            src={media.cover}
            alt={title}
            className="aspect-[16/10] w-full border border-(--line) object-cover"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {media.examples.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="aspect-[4/3] w-full border border-(--line) object-cover"
              />
            ))}
          </div>
        </div>
      </section>
      <p className="mt-6 max-w-2xl text-(--muted-ink)">{preset.prompt}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="drop-zone flex h-56 cursor-pointer items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="font-display text-3xl">{t(lang, 'styleUpload')}</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setMessage('');
            }}
          />
        </label>
        {!isPending && !session?.user ? (
          <a className="btn btn-solid" href={loginHref}>
            {t(lang, 'styleSignIn')}
          </a>
        ) : (
          <button className="btn btn-solid" type="submit" disabled={isLoading || isPending}>
            {isLoading
              ? t(lang, 'styleWorking')
              : `${t(lang, 'styleGenerate')} · ${t(lang, 'styleCredits', { cost: String(IMAGE_CREDITS) })}`}
          </button>
        )}
        {message ? <p className="text-sm text-(--muted-ink)">{message}</p> : null}
      </form>
      {imageUrl ? (
        <figure className="mt-8">
          <figcaption className="mb-3 text-sm text-(--muted-ink)">
            {t(lang, 'styleResult')}
          </figcaption>
          <img src={imageUrl} alt={title} className="w-full border border-(--line)" />
        </figure>
      ) : null}
    </div>
  );
}

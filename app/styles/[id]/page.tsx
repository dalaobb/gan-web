import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StyleStudio from '@/components/StyleStudio';
import { stylePreset, stylePresets } from '@/lib/db/prompt';
import { localizedPath, SITE_URL } from '@/lib/i18n';

export function generateStaticParams() {
  return stylePresets().map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const preset = stylePreset(id);
  if (!preset) return {};
  const path = `/styles/${preset.id}/`;
  return {
    title: `${preset.name} | BgGone`,
    description: preset.prompt,
    alternates: {
      canonical: new URL(localizedPath('en', path), SITE_URL).href,
      languages: {
        en: new URL(localizedPath('en', path), SITE_URL).href,
        zh: new URL(localizedPath('zh', path), SITE_URL).href,
        'x-default': new URL(localizedPath('en', path), SITE_URL).href,
      },
    },
  };
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const preset = stylePreset(id);
  if (!preset) notFound();
  return <StyleStudio lang="en" preset={preset} />;
}

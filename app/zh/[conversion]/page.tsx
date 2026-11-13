import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ConvertDesk from '@/components/ConvertDesk';
import ConversionCopy from '@/components/ConversionCopy';
import {
  conversionMetadata,
  conversions,
  findConversion,
} from '@/lib/conversions';

export const dynamicParams = false;

export function generateStaticParams() {
  return conversions.map(({ slug }) => ({ conversion: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ conversion: string }>;
}): Promise<Metadata> {
  const { conversion } = await params;
  const entry = findConversion(conversion);
  if (!entry) return {};
  return conversionMetadata('zh', entry);
}

export default async function ZhConversionPage({
  params,
}: {
  params: Promise<{ conversion: string }>;
}) {
  const { conversion } = await params;
  const entry = findConversion(conversion);
  if (!entry) notFound();

  const copy = entry.copy.zh;

  return (
    <>
      <ConvertDesk
        lang="zh"
        format={entry.format}
        heading={copy.h1}
        lead={copy.lead}
      />
      <ConversionCopy lang="zh" entry={entry} />
    </>
  );
}

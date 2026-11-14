import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ConvertDesk from '@/components/ConvertDesk';
import ConversionCopy from '@/components/ConversionCopy';
import PassportDesk from '@/components/PassportDesk';
import PassportCopy from '@/components/PassportCopy';
import QuickToolDesk from '@/components/QuickToolDesk';
import QuickToolCopy from '@/components/QuickToolCopy';
import {
  conversionMetadata,
  conversions,
  findConversion,
} from '@/lib/conversions';
import {
  findPassportPage,
  passportPageMetadataFor,
  passportPages,
} from '@/lib/passport/pages';
import { findPassportSpec } from '@/lib/passport/specs';
import {
  findQuickTool,
  quickToolMetadata,
  quickToolPages,
} from '@/lib/quick-tools';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...conversions.map(({ slug }) => ({ slug })),
    ...passportPages.map(({ slug }) => ({ slug })),
    ...quickToolPages.map(({ slug }) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const conversion = findConversion(slug);
  if (conversion) return conversionMetadata('zh', conversion);
  const passport = findPassportPage(slug);
  if (passport) return passportPageMetadataFor('zh', passport);
  const quick = findQuickTool(slug);
  if (quick) return quickToolMetadata('zh', quick);
  return {};
}

export default async function ZhSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conversion = findConversion(slug);
  if (conversion) {
    const copy = conversion.copy.zh;
    return (
      <>
        <ConvertDesk
          lang="zh"
          format={conversion.format}
          heading={copy.h1}
          lead={copy.lead}
        />
        <ConversionCopy lang="zh" entry={conversion} />
      </>
    );
  }

  const passport = findPassportPage(slug);
  if (passport) {
    const copy = passport.copy.zh;
    const spec = findPassportSpec(passport.specId);
    return (
      <>
        <PassportDesk lang="zh" initialSpecId={passport.specId} />
        <PassportCopy
          lang="zh"
          copy={copy}
          path={`/${passport.slug}`}
          spec={spec}
        />
      </>
    );
  }

  const quick = findQuickTool(slug);
  if (quick) {
    return (
      <>
        <QuickToolDesk lang="zh" tool={quick} />
        <QuickToolCopy lang="zh" tool={quick} />
      </>
    );
  }

  notFound();
}

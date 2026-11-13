import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ConvertDesk from '@/components/ConvertDesk';
import ConversionCopy from '@/components/ConversionCopy';
import PassportDesk from '@/components/PassportDesk';
import PassportCopy from '@/components/PassportCopy';
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

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...conversions.map(({ slug }) => ({ slug })),
    ...passportPages.map(({ slug }) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const conversion = findConversion(slug);
  if (conversion) return conversionMetadata('en', conversion);
  const passport = findPassportPage(slug);
  if (passport) return passportPageMetadataFor('en', passport);
  return {};
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conversion = findConversion(slug);
  if (conversion) {
    const copy = conversion.copy.en;
    return (
      <>
        <ConvertDesk
          lang="en"
          format={conversion.format}
          heading={copy.h1}
          lead={copy.lead}
        />
        <ConversionCopy lang="en" entry={conversion} />
      </>
    );
  }

  const passport = findPassportPage(slug);
  if (passport) {
    const copy = passport.copy.en;
    const spec = findPassportSpec(passport.specId);
    return (
      <>
        <PassportDesk lang="en" initialSpecId={passport.specId} />
        <PassportCopy
          lang="en"
          copy={copy}
          path={`/${passport.slug}`}
          spec={spec}
        />
      </>
    );
  }

  notFound();
}

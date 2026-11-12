import EnCompress from '@/content/en/compress.md';
import ZhCompress from '@/content/zh/compress.md';
import type { Lang } from '@/lib/i18n';
import { compressAppJsonLd, faqJsonLd } from '@/lib/seo';

const content = { en: EnCompress, zh: ZhCompress } as const;

export default function CompressCopy({ lang }: { lang: Lang }) {
  const Content = content[lang];

  return (
    <div className="main-width mt-5 px-4 pt-4 pb-16 md:mt-8">
      <div className="prose prose-neutral max-w-none">
        <Content />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(lang, 'compress.md')),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(compressAppJsonLd(lang)),
        }}
      />
    </div>
  );
}

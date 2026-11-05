import type { Lang, PageKey } from '@/lib/i18n';
import { pageCopy } from '@/lib/i18n';
import { faqJsonLd } from '@/lib/seo';
import RemoveBG from '@/components/RemoveBG';
import BackToTop from '@/components/BackToTop';
import EnIndex from '@/content/en/index.md';
import ZhIndex from '@/content/zh/index.md';
import EnAbout from '@/content/en/about.md';
import ZhAbout from '@/content/zh/about.md';
import EnPrivacy from '@/content/en/privacy.md';
import ZhPrivacy from '@/content/zh/privacy.md';

const content = {
  en: { home: EnIndex, about: EnAbout, privacy: EnPrivacy },
  zh: { home: ZhIndex, about: ZhAbout, privacy: ZhPrivacy },
} as const;

export default function SitePage({
  lang,
  page,
}: {
  lang: Lang;
  page: PageKey;
}) {
  const copy = pageCopy[lang][page];
  const Content = content[lang][page];

  return (
    <>
      <header className="mx-auto max-w-3xl px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-[2.75rem] leading-tight">
          {copy.pageTitle}
        </h1>
        <p className="mt-3 text-base text-[var(--muted-ink)]">
          {copy.secondTitle}
        </p>
      </header>
      {page === 'home' ? <RemoveBG lang={lang} /> : null}
      <div className="mt-5 md:mt-8 px-4 main-width">
        <div className="prose prose-neutral max-w-none">
          <Content />
        </div>
        {page === 'home' ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqJsonLd(lang)),
            }}
          />
        ) : null}
        {page === 'home' ? <BackToTop lang={lang} /> : null}
      </div>
    </>
  );
}

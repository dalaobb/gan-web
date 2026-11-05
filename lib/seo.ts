import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  descriptions,
  localizedPath,
  pageCopy,
  SITE_URL,
  type Lang,
  type PageKey,
} from '@/lib/i18n';

export function extractFaq(lang: Lang) {
  const body = readFileSync(
    path.join(process.cwd(), 'content', lang, 'index.md'),
    'utf8'
  );
  const faqs: { q: string; a: string }[] = [];
  let q = '';
  let buf: string[] = [];
  const flush = () => {
    const answer = buf.join(' ').replace(/\s+/g, ' ').trim();
    if (q && answer) faqs.push({ q: q.replace(/\*\*/g, '').trim(), a: answer });
  };
  for (const line of body.split('\n')) {
    if (line.startsWith('### ')) {
      flush();
      q = line.slice(4);
      buf = [];
    } else if (line.startsWith('## ')) {
      flush();
      q = '';
    } else if (q) {
      buf.push(line);
    }
  }
  flush();
  return faqs;
}

export function faqJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extractFaq(lang).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function siteJsonLd(lang: Lang, pathname: string) {
  const isHome =
    pathname === '/' || pathname === '/zh' || pathname === '/zh/';
  const description = descriptions[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'BgGone',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
      },
      ...(isHome
        ? [
            {
              '@type': 'WebApplication',
              name: 'BgGone',
              url: SITE_URL,
              description,
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              browserRequirements:
                'Requires a modern browser with WebAssembly support',
              inLanguage: ['en', 'zh'],
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'AI background remover',
                'Batch background removal',
                'Runs entirely in the browser',
                'No uploads, privacy-first',
                'Free, no signup, no watermarks',
              ],
              image: `${SITE_URL}/bggone-bg-remover.jpg`,
            },
          ]
        : []),
    ],
  };
}

const pagePath: Record<PageKey, string> = {
  home: '/',
  about: '/about/',
  privacy: '/privacy/',
};

export function pageMetadata(lang: Lang, page: PageKey): Metadata {
  const copy = pageCopy[lang][page];
  const description = descriptions[lang];
  const canonicalPath = localizedPath(lang, pagePath[page]);
  const enUrl = new URL(localizedPath('en', pagePath[page]), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', pagePath[page]), SITE_URL).href;
  const canonical = new URL(canonicalPath, SITE_URL).href;
  const ogImage = '/bggone-bg-remover.jpg';
  const ogImageAlt =
    lang === 'zh' ? 'BgGone – 免费 AI 抠图工具' : 'BgGone – Free AI Background Remover';

  return {
    title: copy.title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        zh: zhUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: copy.title,
      description,
      type: 'website',
      url: canonical,
      siteName: 'BgGone',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description,
      images: [
        {
          url: ogImage,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

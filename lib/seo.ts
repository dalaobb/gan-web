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

export function extractFaq(lang: Lang, file = 'index.md') {
  const body = readFileSync(
    path.join(process.cwd(), 'content', lang, file),
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

export function faqJsonLd(lang: Lang, file = 'index.md') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extractFaq(lang, file).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BgGone',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  };
}

export function webApplicationJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BgGone',
    url: SITE_URL,
    description: descriptions[lang],
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser with WebAssembly support',
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

const compressCopy = {
  en: {
    title: 'Compress Images Online – Batch, Target Size, HEIC to JPEG | BgGone',
    description:
      'Compress JPEG, PNG, WebP, and HEIC in your browser. Set a target size, resize the long edge, and download a batch. No upload and no login.',
    name: 'BgGone Image Compressor',
    alt: 'BgGone – compress images in the browser',
    features: [
      'Batch image compression',
      'Compress JPEG and WebP to a chosen file size',
      'HEIC to JPEG',
      'Runs in the browser',
      'No login and no uploads',
    ],
  },
  zh: {
    title: '在线压缩图片 – 批量、指定体积、HEIC 转 JPEG | BgGone',
    description:
      '在浏览器里批量压缩 JPEG、PNG、WebP 和 HEIC，可压到指定体积、限制长边后下载。无需上传，也无需登录。',
    name: 'BgGone 图片压缩',
    alt: 'BgGone – 在浏览器里压缩图片',
    features: [
      '批量压缩图片',
      '把 JPEG 和 WebP 压到指定体积',
      'HEIC 转 JPEG',
      '在浏览器里完成',
      '无需登录、无需上传',
    ],
  },
} as const;

export function compressAppJsonLd(lang: Lang) {
  const copy = compressCopy[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.name,
    url: new URL(localizedPath(lang, '/compress/'), SITE_URL).href,
    description: copy.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser with WebAssembly support',
    inLanguage: ['en', 'zh'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [...copy.features],
  };
}

export function compressMetadata(lang: Lang): Metadata {
  const copy = compressCopy[lang];
  const canonical = new URL(localizedPath(lang, '/compress/'), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', '/compress/'), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', '/compress/'), SITE_URL).href;
  const ogImage = '/bggone-compress.jpg';

  return {
    title: copy.title,
    description: copy.description,
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
      description: copy.description,
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
          alt: copy.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [{ url: ogImage, alt: copy.alt }],
    },
  };
}

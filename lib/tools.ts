import { conversions } from '@/lib/conversions';
import type { Lang } from '@/lib/i18n';

export type ToolLink = {
  path: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
};

export const publicTools: ToolLink[] = [
  {
    path: '/',
    name: { en: 'Background remover', zh: '去背景' },
    description: {
      en: 'Remove image backgrounds in the browser, in a batch.',
      zh: '在浏览器里批量去除图片背景。',
    },
  },
  {
    path: '/compress',
    name: { en: 'Image compressor', zh: '图片压缩' },
    description: {
      en: 'Compress JPEG, PNG, WebP, and HEIC to a size you choose.',
      zh: '把 JPEG、PNG、WebP、HEIC 压到指定体积。',
    },
  },
  {
    path: '/convert',
    name: { en: 'Image converter', zh: '格式转换' },
    description: {
      en: 'Convert HEIC, WebP, AVIF, PNG, and JPG in the browser.',
      zh: '在浏览器里转换 HEIC、WebP、AVIF、PNG、JPG。',
    },
  },
];

export const conversionPaths = conversions.map(
  (conversion) => `/${conversion.slug}`
);

export const publicPaths = [
  '/',
  '/about',
  '/privacy',
  '/tools',
  '/compress',
  '/convert',
  ...conversionPaths,
];

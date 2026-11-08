import type { Metadata } from 'next';
import StyleGallery from '@/components/StyleGallery';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = '图片风格 | BgGone';
const description = '把照片变成手办、漫画、大理石雕塑，以及其他预设风格。';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('zh', '/styles/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/styles/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/styles/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/styles/'), SITE_URL).href,
    },
  },
};

export default function ZhStylesPage() {
  return <StyleGallery lang="zh" />;
}

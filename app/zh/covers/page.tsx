import type { Metadata } from 'next';
import CoverDesk from '@/components/CoverDesk';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = '封面 | BgGone';
const description = '用一行标题做博客封面、YouTube 封面或 X 个人简介背景。尺寸准确，在浏览器里完成。';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('zh', '/covers/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/covers/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/covers/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/covers/'), SITE_URL).href,
    },
  },
};

export default function ZhCoversPage() {
  return <CoverDesk lang="zh" />;
}

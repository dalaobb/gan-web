import type { Metadata } from 'next';
import CompressDesk from '@/components/CompressDesk';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = '压缩图片 | BgGone';
const description = '在浏览器里批量压缩 JPEG、WebP 和 PNG。文件不会上传。';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('zh', '/compress/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/compress/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/compress/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/compress/'), SITE_URL).href,
    },
  },
};

export default function ZhCompressPage() {
  return <CompressDesk lang="zh" />;
}

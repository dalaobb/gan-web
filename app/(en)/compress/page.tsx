import type { Metadata } from 'next';
import CompressDesk from '@/components/CompressDesk';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = 'Compress images | BgGone';
const description = 'Batch compress JPEG, WebP, and PNG in the browser. Nothing is uploaded.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('en', '/compress/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/compress/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/compress/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/compress/'), SITE_URL).href,
    },
  },
};

export default function CompressPage() {
  return <CompressDesk lang="en" />;
}

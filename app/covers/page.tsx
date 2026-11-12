import type { Metadata } from 'next';
import CoverDesk from '@/components/CoverDesk';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = 'Covers | BgGone';
const description = 'Make a blog cover, a YouTube thumbnail, or an X header from a title. Exact pixels, drawn in the browser.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('en', '/covers/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/covers/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/covers/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/covers/'), SITE_URL).href,
    },
  },
};

export default function CoversPage() {
  return <CoverDesk lang="en" />;
}

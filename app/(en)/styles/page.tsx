import type { Metadata } from 'next';
import StyleGallery from '@/components/StyleGallery';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const title = 'Image styles | BgGone';
const description = 'Turn a photo into a figure, a manga page, a marble sculpture, and other preset looks.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: new URL(localizedPath('en', '/styles/'), SITE_URL).href,
    languages: {
      en: new URL(localizedPath('en', '/styles/'), SITE_URL).href,
      zh: new URL(localizedPath('zh', '/styles/'), SITE_URL).href,
      'x-default': new URL(localizedPath('en', '/styles/'), SITE_URL).href,
    },
  },
};

export default function StylesPage() {
  return <StyleGallery lang="en" />;
}

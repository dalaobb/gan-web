import type { MetadataRoute } from 'next';
import { localizedPath, SITE_URL } from '@/lib/i18n';

const paths = ['/', '/about/', '/privacy/'];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const urls = paths.flatMap((path) =>
    (['en', 'zh'] as const).map((lang) => {
      const localized = localizedPath(lang, path);
      return {
        url: new URL(localized, SITE_URL).href,
        lastModified: today,
        alternates: {
          languages: {
            en: new URL(localizedPath('en', path), SITE_URL).href,
            zh: new URL(localizedPath('zh', path), SITE_URL).href,
            'x-default': new URL(localizedPath('en', path), SITE_URL).href,
          },
        },
      };
    })
  );
  return urls;
}

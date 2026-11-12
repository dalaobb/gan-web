import type { MetadataRoute } from 'next';
import { showUnfinished, unfinishedPaths } from '@/lib/launch';

const hidden = unfinishedPaths.flatMap((path) => [path, `/zh${path}`]);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: showUnfinished ? [] : [...hidden],
      },
    ],
    sitemap: 'https://bgg.one/sitemap.xml',
  };
}

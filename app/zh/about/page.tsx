import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('zh', 'about');

export default function ZhAbout() {
  return <SitePage lang="zh" page="about" />;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('zh', 'home');

export default function ZhHome() {
  return <SitePage lang="zh" page="home" />;
}

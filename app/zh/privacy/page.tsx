import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('zh', 'privacy');

export default function ZhPrivacy() {
  return <SitePage lang="zh" page="privacy" />;
}

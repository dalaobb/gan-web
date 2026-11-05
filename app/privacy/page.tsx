import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('en', 'privacy');

export default function Privacy() {
  return <SitePage lang="en" page="privacy" />;
}

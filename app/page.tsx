import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('en', 'home');

export default function Home() {
  return <SitePage lang="en" page="home" />;
}

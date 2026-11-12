import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SitePage from '@/components/SitePage';

export const metadata: Metadata = pageMetadata('en', 'about');

export default function About() {
  return <SitePage lang="en" page="about" />;
}

import type { Metadata } from 'next';
import ToolsIndex from '@/components/ToolsIndex';
import { toolsMetadata } from '@/lib/seo';

export const metadata: Metadata = toolsMetadata('en');

export default function ToolsPage() {
  return <ToolsIndex lang="en" />;
}

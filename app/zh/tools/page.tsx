import type { Metadata } from 'next';
import ToolsIndex from '@/components/ToolsIndex';
import { toolsMetadata } from '@/lib/seo';

export const metadata: Metadata = toolsMetadata('zh');

export default function ZhToolsPage() {
  return <ToolsIndex lang="zh" />;
}

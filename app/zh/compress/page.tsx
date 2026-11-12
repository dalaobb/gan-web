import type { Metadata } from 'next';
import CompressCopy from '@/components/CompressCopy';
import CompressDesk from '@/components/CompressDesk';
import { compressMetadata } from '@/lib/seo';

export const metadata: Metadata = compressMetadata('zh');

export default function ZhCompressPage() {
  return (
    <>
      <CompressDesk lang="zh" />
      <CompressCopy lang="zh" />
    </>
  );
}

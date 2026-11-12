import type { Metadata } from 'next';
import CompressCopy from '@/components/CompressCopy';
import CompressDesk from '@/components/CompressDesk';
import { compressMetadata } from '@/lib/seo';

export const metadata: Metadata = compressMetadata('en');

export default function CompressPage() {
  return (
    <>
      <CompressDesk lang="en" />
      <CompressCopy lang="en" />
    </>
  );
}

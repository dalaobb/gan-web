import type { Metadata } from 'next';
import ConvertDesk from '@/components/ConvertDesk';
import ConvertIndexCopy from '@/components/ConvertIndexCopy';
import { convertMetadata } from '@/lib/conversions';

export const metadata: Metadata = convertMetadata('en');

export default function ConvertPage() {
  return (
    <>
      <ConvertDesk lang="en" />
      <ConvertIndexCopy lang="en" />
    </>
  );
}

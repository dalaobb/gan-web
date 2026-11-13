import type { Metadata } from 'next';
import ConvertDesk from '@/components/ConvertDesk';
import ConvertIndexCopy from '@/components/ConvertIndexCopy';
import { convertMetadata } from '@/lib/conversions';

export const metadata: Metadata = convertMetadata('zh');

export default function ZhConvertPage() {
  return (
    <>
      <ConvertDesk lang="zh" />
      <ConvertIndexCopy lang="zh" />
    </>
  );
}

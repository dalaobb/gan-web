import type { Metadata } from 'next';
import PassportDesk from '@/components/PassportDesk';
import PassportCopy from '@/components/PassportCopy';
import {
  passportPageMetadata,
  passportToolCopy,
} from '@/lib/passport/pages';

export const metadata: Metadata = passportPageMetadata(
  'zh',
  passportToolCopy.zh
);

export default function ZhPassportPhotoPage() {
  return (
    <>
      <PassportDesk lang="zh" />
      <PassportCopy
        lang="zh"
        copy={passportToolCopy.zh}
        path="/passport-photo"
      />
    </>
  );
}

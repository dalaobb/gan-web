import type { Metadata } from 'next';
import PassportDesk from '@/components/PassportDesk';
import PassportCopy from '@/components/PassportCopy';
import {
  passportPageMetadata,
  passportToolCopy,
} from '@/lib/passport/pages';

export const metadata: Metadata = passportPageMetadata(
  'en',
  passportToolCopy.en
);

export default function PassportPhotoPage() {
  return (
    <>
      <PassportDesk lang="en" />
      <PassportCopy
        lang="en"
        copy={passportToolCopy.en}
        path="/passport-photo"
      />
    </>
  );
}

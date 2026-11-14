import type { Lang } from '@/lib/i18n';
import type { QuickToolPage } from '@/lib/quick-tools';
import BlurBackgroundDesk from '@/components/BlurBackgroundDesk';
import WhiteBackgroundDesk from '@/components/WhiteBackgroundDesk';
import StripExifDesk from '@/components/StripExifDesk';
import BlurFaceDesk from '@/components/BlurFaceDesk';

export default function QuickToolDesk({
  lang,
  tool,
}: {
  lang: Lang;
  tool: QuickToolPage;
}) {
  const copy = tool.copy[lang];
  const props = { lang, heading: copy.h1, lead: copy.lead };

  switch (tool.key) {
    case 'blur-background':
      return <BlurBackgroundDesk {...props} />;
    case 'white-background':
      return <WhiteBackgroundDesk {...props} />;
    case 'remove-exif':
      return <StripExifDesk {...props} />;
    case 'blur-face':
      return <BlurFaceDesk {...props} />;
  }
}

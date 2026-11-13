import type { Lang } from '@/lib/i18n';
import type { OutputFormat } from '@/lib/compress/protocol';
import CompressDesk from '@/components/CompressDesk';

export default function ConvertDesk({
  lang,
  format = 'jpeg',
  heading,
  lead,
}: {
  lang: Lang;
  format?: OutputFormat;
  heading?: string;
  lead?: string;
}) {
  return (
    <CompressDesk
      lang={lang}
      mode="convert"
      initialFormat={format}
      heading={heading}
      lead={lead}
    />
  );
}

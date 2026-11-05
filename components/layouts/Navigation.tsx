import type { Lang } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export default function Navigation({ lang }: { lang: Lang }) {
  return (
    <a
      href="/"
      aria-label={t(lang, 'logoAlt')}
      className="flex items-center gap-3 text-(--ink)"
    >
      <img className="w-6 h-6" src="/favicon_48x48.png" alt="" />
      <span className="font-display text-[1.35rem] leading-none tracking-tight">
        BgGone
      </span>
    </a>
  );
}

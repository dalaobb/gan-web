import { localizedPath, t, type Lang } from '@/lib/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-20 mb-10 border-t border-(--line) pt-6 text-center text-sm text-(--muted-ink)">
      <p>
        <a className="hover:text-(--ink)" href="https://bgg.one">
          BgGone
        </a>
        <span> © 2026 </span>
        <a className="hover:text-(--ink)" href="https://dalaobb.com">
          DaLaoBB
        </a>
      </p>
      <p className="mt-2 flex justify-center gap-4">
        <a className="hover:text-(--ink)" href={localizedPath(lang, '/about')}>
          {t(lang, 'aboutNav')}
        </a>
        <a className="hover:text-(--ink)" href={localizedPath(lang, '/privacy')}>
          {t(lang, 'privacyNav')}
        </a>
      </p>
    </footer>
  );
}

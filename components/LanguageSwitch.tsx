'use client';

import { usePathname } from 'next/navigation';
import { LANG_STORAGE_KEY, localizedPath, type Lang } from '@/lib/i18n';

export default function LanguageSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() || '/';
  const enHref = localizedPath('en', pathname);
  const zhHref = localizedPath('zh', pathname);

  return (
    <div className="flex items-center gap-2 text-sm text-(--muted-ink)">
      <a
        href={enHref}
        hrefLang="en"
        aria-current={lang === 'en' ? 'true' : undefined}
        onClick={() => {
          try {
            localStorage.setItem(LANG_STORAGE_KEY, 'en');
          } catch {
            /* ignore */
          }
        }}
        className={
          lang === 'en' ? 'text-(--ink)' : 'hover:text-(--ink)'
        }
      >
        EN
      </a>
      <span aria-hidden="true">/</span>
      <a
        href={zhHref}
        hrefLang="zh"
        aria-current={lang === 'zh' ? 'true' : undefined}
        onClick={() => {
          try {
            localStorage.setItem(LANG_STORAGE_KEY, 'zh');
          } catch {
            /* ignore */
          }
        }}
        className={
          lang === 'zh' ? 'text-(--ink)' : 'hover:text-(--ink)'
        }
      >
        中文
      </a>
    </div>
  );
}

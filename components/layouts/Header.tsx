import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from './Navigation';
import ThemeIcon from './ThemeIcon';
import LanguageSwitch from '@/components/LanguageSwitch';
import MobileMenu from './MobileMenu';
import { localizedPath, t, type Lang } from '@/lib/i18n';
import { showUnfinished } from '@/lib/launch';

export default function Header({ lang }: { lang: Lang }) {
  return (
    <header>
      <nav className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-(--line) py-2">
        <Navigation lang={lang} />
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <div className="hidden items-center gap-x-4 md:flex">
            <a
              href={localizedPath(lang, '/tools')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'toolsNav')}
          </a>
          <a
            href={localizedPath(lang, '/convert')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'convertNav')}
          </a>
          <a
            href={localizedPath(lang, '/passport-photo')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'passportNav')}
          </a>
          <a
            href={localizedPath(lang, '/compress')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'compressNav')}
          </a>
          {showUnfinished ? (
            <>
              <a
                href={localizedPath(lang, '/covers')}
                className="text-sm text-(--muted-ink) hover:text-(--ink)"
              >
                {t(lang, 'coversNav')}
              </a>
              <a
                href={localizedPath(lang, '/styles')}
                className="text-sm text-(--muted-ink) hover:text-(--ink)"
              >
                {t(lang, 'stylesNav')}
              </a>
            </>
          ) : null}
          </div>
          <LanguageSwitch lang={lang} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeIcon />
          </ThemeProvider>
          <MobileMenu lang={lang} />
        </div>
      </nav>
    </header>
  );
}

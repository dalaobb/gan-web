import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from './Navigation';
import ThemeIcon from './ThemeIcon';
import LanguageSwitch from '@/components/LanguageSwitch';
import { localizedPath, t, type Lang } from '@/lib/i18n';

export default function Header({ lang }: { lang: Lang }) {
  return (
    <header>
      <nav className="flex justify-between items-center h-14 border-b border-(--line)">
        <Navigation lang={lang} />
        <div className="flex items-center gap-4">
          <a
            href={localizedPath(lang, '/covers/')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'coversNav')}
          </a>
          <a
            href={localizedPath(lang, '/styles/')}
            className="text-sm text-(--muted-ink) hover:text-(--ink)"
          >
            {t(lang, 'stylesNav')}
          </a>
          <LanguageSwitch lang={lang} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeIcon />
          </ThemeProvider>
        </div>
      </nav>
    </header>
  );
}

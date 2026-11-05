import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from './Navigation';
import ThemeIcon from './ThemeIcon';
import LanguageSwitch from '@/components/LanguageSwitch';
import type { Lang } from '@/lib/i18n';

export default function Header({ lang }: { lang: Lang }) {
  return (
    <header>
      <nav className="flex justify-between items-center h-14 border-b border-[var(--line)]">
        <Navigation lang={lang} />
        <div className="flex items-center gap-2">
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

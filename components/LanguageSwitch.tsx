'use client';

import { Check, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  LANG_STORAGE_KEY,
  languageList,
  localizedPath,
  type Lang,
} from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() || '/';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-(--muted-ink) hover:text-(--ink)"
        >
          {languageList.find((item) => item.code === lang)?.short ?? lang}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60] min-w-32">
        {languageList.map((item) => (
          <DropdownMenuItem key={item.code} asChild>
            <a
              href={localizedPath(item.code, pathname)}
              hrefLang={item.htmlLang}
              aria-current={item.code === lang ? 'true' : undefined}
              onClick={() => {
                try {
                  localStorage.setItem(LANG_STORAGE_KEY, item.code);
                } catch {
                  /* ignore */
                }
              }}
              className={`flex w-full items-center justify-between gap-3 ${
                item.code === lang ? 'text-(--ink)' : ''
              }`}
            >
              <span>{item.label}</span>
              {item.code === lang ? <Check className="h-3.5 w-3.5" /> : null}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

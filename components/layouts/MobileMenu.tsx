'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';
import { navLinks } from '@/lib/nav';

export default function MobileMenu({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    function closeOnOutside(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutside);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutside);
    };
  }, [open]);

  const links = navLinks(lang);

  return (
    <div ref={menuRef} className="relative xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t(lang, 'menuClose') : t(lang, 'menuLabel')}
        className="flex h-9 w-9 items-center justify-center border border-(--line) text-(--ink)"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto overscroll-contain border-y border-(--line) bg-(--paper) p-2 shadow-lg"
        >
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm text-(--ink) hover:bg-(--paper-2)"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

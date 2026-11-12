'use client';

import { useEffect, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';

const SHOW_AFTER = 480;
const GAP = 16;

export default function ScrollTop({ lang }: { lang: Lang }) {
  const [shown, setShown] = useState(false);
  const [bottom, setBottom] = useState(GAP);

  useEffect(() => {
    const footer = document.querySelector('footer');
    const place = () => {
      setShown(window.scrollY > SHOW_AFTER);
      if (!footer) return;
      const margin = parseFloat(getComputedStyle(footer).marginBottom) || 0;
      setBottom(footer.offsetHeight + margin + GAP);
    };
    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={t(lang, 'scrollTop')}
      aria-hidden={shown ? undefined : true}
      tabIndex={shown ? 0 : -1}
      style={{ bottom }}
      className={`fixed right-4 z-40 flex h-11 w-11 items-center justify-center border border-(--line) bg-(--paper) text-(--ink) transition duration-200 hover:border-(--ink) sm:right-6 ${
        shown ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 3.2 3.2 8.4M8 3.2 12.8 8.4M8 3.4V13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

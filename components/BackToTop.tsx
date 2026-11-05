'use client';

import { t, type Lang } from '@/lib/i18n';

export default function BackToTop({ lang }: { lang: Lang }) {
  return (
    <div className="mt-4">
      <button
        type="button"
        className="cursor-pointer hover:underline"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {t(lang, 'backToTop')}
      </button>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LANG_STORAGE_KEY } from '@/lib/i18n';

export default function LocaleRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      return;
    }
    if (stored) return;

    const path = pathname || '/';
    const onIndex = path === '/' || path === '/zh' || path === '/zh/';
    if (!onIndex) return;

    const prefersZh = (navigator.language || '').toLowerCase().startsWith('zh');
    if (prefersZh && path === '/') {
      window.location.replace('/zh/');
    } else if (!prefersZh && (path === '/zh' || path === '/zh/')) {
      window.location.replace('/');
    }
  }, [pathname]);

  return null;
}

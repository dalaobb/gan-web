'use client';

import { useEffect, useRef } from 'react';

export function useImagePaste(
  onFiles: (files: File[]) => void,
  enabled = true
) {
  const callback = useRef(onFiles);
  callback.current = onFiles;

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (!enabled) return;
      const files: File[] = [];
      const items = event.clipboardData?.items;
      for (let index = 0; items && index < items.length; index += 1) {
        const file = items[index].getAsFile();
        if (file?.type.startsWith('image/')) files.push(file);
      }
      if (!files.length) return;
      event.preventDefault();
      callback.current(files);
    }
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [enabled]);
}

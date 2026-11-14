'use client';

import type { ReactNode } from 'react';

export default function FileListRow({
  thumbnail,
  children,
  actions,
  onRemove,
  removeLabel,
  removeDisabled = false,
  processing = false,
  className = '',
}: {
  thumbnail: ReactNode;
  children: ReactNode;
  actions: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  removeDisabled?: boolean;
  processing?: boolean;
  className?: string;
}) {
  return (
    <li
      className={`glass-effect flex flex-wrap items-center gap-3 p-3 ${
        processing ? 'processing' : ''
      } ${className}`}
    >
      {thumbnail}
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex flex-wrap gap-2 max-sm:flex-col">{actions}</div>
      {onRemove ? (
        <button
          type="button"
          className="flex h-7 w-7 shrink-0 items-center justify-center border border-(--line)"
          onClick={onRemove}
          disabled={removeDisabled}
          aria-label={removeLabel}
        >
          ×
        </button>
      ) : null}
    </li>
  );
}

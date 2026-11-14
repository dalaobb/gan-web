'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-3xl">Something went wrong</h1>
          <p className="text-sm text-(--muted-ink)">
            The error was reported. You can try again.
          </p>
          <button type="button" className="btn btn-solid" onClick={reset}>
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Newsreader, Source_Sans_3 } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SessionProvider } from 'next-auth/react';
import { headers } from 'next/headers';

import ErrorHandlerProvider from '@/components/layouts/ErrorHandlerProvider';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import DebugMobile from '@/components/DebugMobile';
import LocaleRedirect from '@/components/LocaleRedirect';
import { Toaster } from '@/components/ui/sonner';
import { localeFromPath, type Lang } from '@/lib/i18n';
import { siteJsonLd } from '@/lib/seo';

import '@/styles/globals.css';

const display = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const sans = Source_Sans_3({
  variable: '--font-source',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bgg.one'),
  keywords: [
    'background remover',
    'remove background',
    'background removal',
    'free background remover',
    'transparent PNG',
    'AI image editing',
    '抠图',
    '去除背景',
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon_32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon_96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon_114x114.png', sizes: '114x114', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f1ea' },
    { media: '(prefers-color-scheme: dark)', color: '#141210' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-pathname') || '/';
  const lang: Lang =
    requestHeaders.get('x-locale') === 'zh' || localeFromPath(pathname) === 'zh'
      ? 'zh'
      : 'en';

  return (
    <html
      lang={lang}
      data-lang={lang}
      className={`${display.variable} ${sans.variable} text-[16px]`}
      suppressHydrationWarning
    >
      <body
        className="antialiased px-4 sm:px-6"
      >
        <ErrorHandlerProvider>
          <SessionProvider>
            <Header lang={lang} />
            <main>{children}</main>
            <Footer />
          </SessionProvider>
        </ErrorHandlerProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd(lang, pathname)),
          }}
        />
        <GoogleAnalytics gaId="G-CZS9K7V64W" />
        <LocaleRedirect />
        <DebugMobile />
        <Toaster richColors />
      </body>
    </html>
  );
}

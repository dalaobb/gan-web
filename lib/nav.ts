import { localizedPath, t, type Lang } from '@/lib/i18n';

export function navLinks(lang: Lang) {
  return [
    { href: localizedPath(lang, '/tools'), label: t(lang, 'toolsNav') },
    { href: localizedPath(lang, '/convert'), label: t(lang, 'convertNav') },
    {
      href: localizedPath(lang, '/passport-photo'),
      label: t(lang, 'passportNav'),
    },
    {
      href: localizedPath(lang, '/compress'),
      label: t(lang, 'compressNav'),
    },
    {
      href: localizedPath(lang, '/blur-background'),
      label: t(lang, 'blurBackgroundNav'),
    },
    {
      href: localizedPath(lang, '/white-background'),
      label: t(lang, 'whiteBackgroundNav'),
    },
    {
      href: localizedPath(lang, '/remove-exif'),
      label: t(lang, 'removeExifNav'),
    },
    {
      href: localizedPath(lang, '/blur-face'),
      label: t(lang, 'blurFaceNav'),
    },
  ];
}

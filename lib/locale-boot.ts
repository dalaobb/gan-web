import { LANG_STORAGE_KEY } from '@/lib/i18n';

// Runs from the document head, before the page is painted. Keep the key in sync with LANG_STORAGE_KEY.
export const localeBootScript = `(function () {
  var path = location.pathname;
  var zh = path === '/zh' || path.indexOf('/zh/') === 0;
  var lang = zh ? 'zh' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  var stored = null;
  try {
    stored = localStorage.getItem('${LANG_STORAGE_KEY}');
  } catch (e) {}
  if (stored) return;
  var onIndex = path === '/' || path === '/zh' || path === '/zh/';
  if (!onIndex) return;
  var prefersZh = (navigator.language || '').toLowerCase().indexOf('zh') === 0;
  if (prefersZh && path === '/') location.replace('/zh/');
  else if (!prefersZh && (path === '/zh' || path === '/zh/')) location.replace('/');
})();`;

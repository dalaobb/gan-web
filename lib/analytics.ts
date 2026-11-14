type EventProps = Record<string, string | number | boolean | undefined>;

export function track(event: string, props: EventProps = {}) {
  if (typeof window === 'undefined') return;

  const target = window as unknown as { dataLayer?: unknown[] };
  const dataLayer = (target.dataLayer ||= []);

  dataLayer.push({
    event,
    ...props,
    lang: document.documentElement.lang || undefined,
    path: window.location.pathname,
  });
}

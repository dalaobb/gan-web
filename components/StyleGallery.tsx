import { localizedPath, t, type Lang } from '@/lib/i18n';
import { stylePresets } from '@/lib/db/prompt';
import { styleMedia } from '@/lib/style-media';

export default function StyleGallery({ lang }: { lang: Lang }) {
  const presets = stylePresets();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      <h1 className="text-4xl leading-tight sm:text-[2.75rem]">
        {t(lang, 'stylesTitle')}
      </h1>
      <p className="mt-3 max-w-xl text-(--muted-ink)">{t(lang, 'stylesLead')}</p>
      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {presets.map((item) => {
          const title = lang === 'zh' ? item.nameZh : item.name;
          const media = styleMedia(item.id);
          return (
            <li key={item.id}>
              <a
                href={localizedPath(lang, `/styles/${item.id}/`)}
                className="group block border border-(--line) bg-(--paper) hover:border-(--ink)"
              >
                <span className="relative block overflow-hidden">
                  <img
                    src={media.cover}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] px-3 py-3">
                    <span className="font-display text-xl leading-tight sm:text-2xl line-clamp-2">
                      {title}
                    </span>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

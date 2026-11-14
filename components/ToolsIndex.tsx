import { localizedPath, t, type Lang } from '@/lib/i18n';
import { conversions } from '@/lib/conversions';
import { passportPages } from '@/lib/passport/pages';
import { publicTools } from '@/lib/tools';

export default function ToolsIndex({ lang }: { lang: Lang }) {
  return (
    <div className="pt-12">
      <header className="mx-auto max-w-3xl px-4 pb-8 text-center">
        <h1 className="text-4xl leading-tight sm:text-[2.75rem]">
          {t(lang, 'toolsTitle')}
        </h1>
        <p className="mt-3 text-base text-(--muted-ink)">
          {t(lang, 'toolsLead')}
        </p>
      </header>

      <div className="main-width-wide">
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {publicTools.map((tool) => (
            <li key={tool.path} className="glass-effect p-4">
              <a
                href={localizedPath(lang, tool.path)}
                className="font-display text-xl text-(--ink) hover:underline"
              >
                {tool.name[lang]}
              </a>
              <p className="mt-2 text-sm text-(--muted-ink)">
                {tool.description[lang]}
              </p>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl">
          {lang === 'zh' ? '格式转换' : 'Format converters'}
        </h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {conversions.map((conversion) => (
            <li key={conversion.slug}>
              <a
                href={localizedPath(lang, `/${conversion.slug}`)}
                className="text-(--ink) hover:underline"
              >
                {conversion.from} to {conversion.to}
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl">
          {lang === 'zh' ? '证件照' : 'Passport photos'}
        </h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {passportPages.map((page) => (
            <li key={page.slug}>
              <a
                href={localizedPath(lang, `/${page.slug}`)}
                className="text-(--ink) hover:underline"
              >
                {page.copy[lang].h1}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

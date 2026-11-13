import { localizedPath, type Lang } from '@/lib/i18n';
import type { PassportPageCopy } from '@/lib/passport/pages';
import {
  passportPageFaqJsonLd,
  passportPageJsonLd,
  passportPages,
} from '@/lib/passport/pages';
import type { PassportSpec } from '@/lib/passport/specs';

export default function PassportCopy({
  lang,
  copy,
  path,
  spec,
}: {
  lang: Lang;
  copy: PassportPageCopy;
  path: string;
  spec?: PassportSpec;
}) {
  const others = passportPages.filter((page) => `/${page.slug}` !== path);

  return (
    <div className="main-width-wide mt-5 px-4 pt-4 pb-16 md:mt-8">
      <div className="prose prose-neutral max-w-none">
        <p>{copy.intro}</p>

        {spec ? (
          <p>
            <strong>{spec.name[lang]}</strong> · {spec.sizeLabel[lang]}
            <br />
            {spec.note[lang]}
          </p>
        ) : null}

        <h2>{lang === 'zh' ? '能做什么' : 'What this page does'}</h2>
        <ul>
          {copy.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{lang === 'zh' ? '常见问题' : 'FAQ'}</h2>
        {copy.faq.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}

        <h2>{lang === 'zh' ? '其他国家' : 'Other countries'}</h2>
        <ul>
          <li>
            <a href={localizedPath(lang, '/passport-photo')}>
              {lang === 'zh' ? '通用证件照制作' : 'General passport photo maker'}
            </a>
          </li>
          {others.map((page) => (
            <li key={page.slug}>
              <a href={localizedPath(lang, `/${page.slug}`)}>
                {page.copy[lang].h1}
              </a>
            </li>
          ))}
        </ul>

        <p>
          {lang === 'zh'
            ? '打印前请核对官方要求。这个工具只提供裁切和背景处理，不保证证件机关一定接受。'
            : 'Check the official requirements before printing. This tool handles the crop and background; it does not guarantee acceptance by an issuing authority.'}
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(passportPageJsonLd(lang, copy, path)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(passportPageFaqJsonLd(copy)),
        }}
      />
    </div>
  );
}

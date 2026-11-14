import { localizedPath, type Lang } from '@/lib/i18n';
import {
  quickToolFaqJsonLd,
  quickToolJsonLd,
  quickToolPages,
  type QuickToolPage,
} from '@/lib/quick-tools';

export default function QuickToolCopy({
  lang,
  tool,
}: {
  lang: Lang;
  tool: QuickToolPage;
}) {
  const copy = tool.copy[lang];
  const others = quickToolPages.filter((item) => item.slug !== tool.slug);
  const coreTools = [
    {
      href: '/',
      label: lang === 'zh' ? '去除背景' : 'Background remover',
    },
    {
      href: '/compress',
      label: lang === 'zh' ? '图片压缩' : 'Image compressor',
    },
    {
      href: '/convert',
      label: lang === 'zh' ? '图片格式转换' : 'Image converter',
    },
    {
      href: '/passport-photo',
      label: lang === 'zh' ? '证件照制作' : 'Passport photo maker',
    },
  ];

  return (
    <div className="main-width mt-5 px-4 pt-4 pb-16 md:mt-8">
      <div className="prose prose-neutral max-w-none">
        <p>{copy.intro}</p>

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

        <h2>{lang === 'zh' ? '其他工具' : 'Other tools'}</h2>
        <ul>
          <li>
            <a href={localizedPath(lang, '/tools')}>
              {lang === 'zh' ? '全部工具' : 'All tools'}
            </a>
          </li>
          {coreTools.map((item) => (
            <li key={item.href}>
              <a href={localizedPath(lang, item.href)}>{item.label}</a>
            </li>
          ))}
          {others.map((item) => (
            <li key={item.slug}>
              <a href={localizedPath(lang, `/${item.slug}`)}>
                {item.copy[lang].h1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quickToolJsonLd(lang, tool)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quickToolFaqJsonLd(lang, tool)),
        }}
      />
    </div>
  );
}

import { localizedPath, type Lang } from '@/lib/i18n';
import {
  conversionFaqJsonLd,
  conversionJsonLd,
  conversions,
  type Conversion,
} from '@/lib/conversions';

export default function ConversionCopy({
  lang,
  entry,
}: {
  lang: Lang;
  entry: Conversion;
}) {
  const copy = entry.copy[lang];
  const others = conversions.filter((item) => item.slug !== entry.slug);

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

        <h2>{lang === 'zh' ? '其他格式转换' : 'Other converters'}</h2>
        <p>
          {lang === 'zh'
            ? '也可以直接打开通用转换器，或选择另一组格式：'
            : 'Open the general converter, or pick another format pair:'}
        </p>
        <ul>
          <li>
            <a href={localizedPath(lang, '/convert')}>
              {lang === 'zh' ? '全部格式转换' : 'All image converters'}
            </a>
          </li>
          {others.map((item) => (
            <li key={item.slug}>
              <a href={localizedPath(lang, `/${item.slug}`)}>
                {item.from} to {item.to}
              </a>
            </li>
          ))}
        </ul>

        <h2>{lang === 'zh' ? '更多图片工具' : 'More image tools'}</h2>
        <ul>
          <li>
            <a href={localizedPath(lang, '/')}>
              {lang === 'zh' ? '去除背景' : 'Background remover'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/compress')}>
              {lang === 'zh' ? '图片压缩' : 'Image compressor'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/passport-photo')}>
              {lang === 'zh' ? '证件照制作' : 'Passport photo maker'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/images-to-pdf')}>
              {lang === 'zh' ? '图片转 PDF' : 'Images to PDF'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/pdf-to-jpg')}>
              {lang === 'zh' ? 'PDF 转图片' : 'PDF to images'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/compress-gif')}>
              {lang === 'zh' ? 'GIF 压缩' : 'GIF compressor'}
            </a>
          </li>
          <li>
            <a href={localizedPath(lang, '/tools')}>
              {lang === 'zh' ? '全部工具' : 'All tools'}
            </a>
          </li>
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(conversionJsonLd(lang, entry)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(conversionFaqJsonLd(lang, entry)),
        }}
      />
    </div>
  );
}

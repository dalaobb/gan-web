import { localizedPath, type Lang } from '@/lib/i18n';
import {
  conversions,
  convertAppJsonLd,
  convertPageContent,
} from '@/lib/conversions';

export default function ConvertIndexCopy({ lang }: { lang: Lang }) {
  const copy = convertPageContent(lang);

  return (
    <div className="main-width mt-5 px-4 pt-4 pb-16 md:mt-8">
      <div className="prose prose-neutral max-w-none">
        <p>
          {lang === 'zh'
            ? '这里处理的是格式，不改变图片尺寸。选择目标格式后，文件会在浏览器里解码并重新编码，不会上传到服务器。'
            : 'This page changes the file format, not the dimensions. Pick an output format, and each file is decoded and re-encoded in the browser without being uploaded.'}
        </p>

        <h2>{lang === 'zh' ? '按格式选择' : 'Pick a converter'}</h2>
        <ul>
          {conversions.map((conversion) => (
            <li key={conversion.slug}>
              <a href={localizedPath(lang, `/${conversion.slug}`)}>
                {conversion.from} to {conversion.to}
              </a>
            </li>
          ))}
        </ul>

        <h2>{lang === 'zh' ? '能做什么' : 'What it handles'}</h2>
        <ul>
          {copy.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <h2>{lang === 'zh' ? '需要压到指定体积？' : 'Need a target file size?'}</h2>
        <p>
          {lang === 'zh' ? (
            <>
              用{' '}
              <a href={localizedPath(lang, '/compress')}>图片压缩</a>
              ，可以按体积或长边处理，也可以继续在这里转换格式。
            </>
          ) : (
            <>
              Use the{' '}
              <a href={localizedPath(lang, '/compress')}>image compressor</a>{' '}
              to hit a target size or long edge, then convert the format here.
            </>
          )}
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(convertAppJsonLd(lang)),
        }}
      />
    </div>
  );
}

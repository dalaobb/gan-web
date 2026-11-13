import type { Metadata } from 'next';
import { localizedPath, SITE_URL, type Lang } from '@/lib/i18n';

export type ConversionFormat = 'jpeg' | 'png' | 'webp';

export type ConversionFaq = {
  q: string;
  a: string;
};

export type ConversionCopy = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  intro: string;
  bullets: string[];
  faq: ConversionFaq[];
};

export type Conversion = {
  slug: string;
  from: string;
  to: string;
  format: ConversionFormat;
  copy: Record<Lang, ConversionCopy>;
};

export const conversions: Conversion[] = [
  {
    slug: 'heic-to-jpg',
    from: 'HEIC',
    to: 'JPG',
    format: 'jpeg',
    copy: {
      en: {
        title: 'HEIC to JPG Converter, No Upload | BgGone',
        description:
          'Convert iPhone HEIC photos to JPG in your browser. Batch convert, choose JPEG quality, and keep the files on your device.',
        h1: 'HEIC to JPG Converter',
        lead: 'Turn iPhone HEIC photos into JPG files that open anywhere. The conversion happens on this device.',
        intro:
          'HEIC is the default camera format on many iPhones, but forms, websites, and older apps often ask for JPG. Add the files here and this page decodes each HEIC image locally, then saves a standard JPEG copy.',
        bullets: [
          'Batch-convert a folder of iPhone photos',
          'No upload, no login, and no watermark',
          'Choose Smaller, Balanced, or High JPEG quality',
          'The original HEIC file stays untouched',
        ],
        faq: [
          {
            q: 'Are my HEIC photos uploaded?',
            a: 'No. The HEIC decoder and the JPEG encoder both run in this browser. The files stay on this device.',
          },
          {
            q: 'Does converting HEIC to JPG lose quality?',
            a: 'JPG uses lossy compression, so a small amount of detail is discarded. High keeps more detail; Smaller makes a smaller file.',
          },
          {
            q: 'Can I convert several photos at once?',
            a: 'Yes. Add a batch, convert, then save the files one by one or download one ZIP.',
          },
          {
            q: 'Does the JPG keep location and camera data?',
            a: 'The new JPEG is re-encoded, so location, camera, and time are not written into that copy. The original HEIC file is unchanged.',
          },
        ],
      },
      zh: {
        title: 'HEIC 转 JPG 工具，无需上传 | BgGone',
        description:
          '在浏览器里把 iPhone 的 HEIC 照片转成 JPG，可批量、可选质量，文件留在本机。',
        h1: 'HEIC 转 JPG',
        lead: '把 iPhone 的 HEIC 照片转成到处都能打开的 JPG，转换在这台设备上完成。',
        intro:
          'HEIC 是很多 iPhone 的默认相机格式，但表单、网站和旧软件经常要求 JPG。把文件加进来，这个页面会在本机解码 HEIC，再保存为标准 JPEG。',
        bullets: [
          '批量转换整个文件夹的 iPhone 照片',
          '无需上传、无需登录、无水印',
          '可选更小、均衡或高质量 JPEG',
          '原始 HEIC 文件保持不动',
        ],
        faq: [
          {
            q: 'HEIC 照片会被上传吗？',
            a: '不会。HEIC 解码和 JPEG 编码都在浏览器里完成，文件留在本机。',
          },
          {
            q: 'HEIC 转 JPG 会损失画质吗？',
            a: 'JPG 使用有损压缩，会丢弃少量细节。高质量保留更多细节，更小则会得到更小的文件。',
          },
          {
            q: '可以一次转换多张吗？',
            a: '可以。批量加入并转换后，可以逐张保存，也可以打包成一个 ZIP 下载。',
          },
          {
            q: 'JPG 会保留位置和相机信息吗？',
            a: '新 JPEG 会重新编码，位置、相机和时间不会写入这份副本。原始 HEIC 文件不会被修改。',
          },
        ],
      },
    },
  },
  {
    slug: 'heic-to-png',
    from: 'HEIC',
    to: 'PNG',
    format: 'png',
    copy: {
      en: {
        title: 'HEIC to PNG Converter, No Upload | BgGone',
        description:
          'Convert HEIC photos to PNG in your browser. Batch convert without uploading, and keep transparency when it exists.',
        h1: 'HEIC to PNG Converter',
        lead: 'Convert iPhone HEIC photos to lossless PNG files on this device.',
        intro:
          'PNG is a good choice when you need a lossless file for editing. Add HEIC photos here and the page decodes them locally, then writes PNG output without sending the image to a server.',
        bullets: [
          'Lossless PNG output for editing',
          'Batch conversion in the browser',
          'No upload and no account',
          'Transparency is preserved when present',
        ],
        faq: [
          {
            q: 'Why choose PNG instead of JPG?',
            a: 'PNG is lossless and works well for editing or screenshots. The trade-off is a larger file than JPG.',
          },
          {
            q: 'Are HEIC files uploaded for conversion?',
            a: 'No. Decoding and encoding happen in the browser, and the files stay on your device.',
          },
          {
            q: 'Can I convert a batch of HEIC photos?',
            a: 'Yes. Add several files, convert them together, and download them one by one or as a ZIP.',
          },
          {
            q: 'Does PNG keep EXIF data?',
            a: 'The new PNG is re-encoded from pixels, so camera and location metadata is not copied into it.',
          },
        ],
      },
      zh: {
        title: 'HEIC 转 PNG 工具，无需上传 | BgGone',
        description:
          '在浏览器里把 HEIC 照片转成 PNG，可批量、无需上传，有透明通道时会保留。',
        h1: 'HEIC 转 PNG',
        lead: '在本机把 iPhone 的 HEIC 照片转成无损 PNG。',
        intro:
          '需要无损文件继续编辑时，PNG 更合适。把 HEIC 照片加进来，这个页面会在本地解码并输出 PNG，不会把图片发到服务器。',
        bullets: [
          '适合继续编辑的无损 PNG',
          '在浏览器里批量转换',
          '无需上传、无需账号',
          '有透明通道时会保留',
        ],
        faq: [
          {
            q: '为什么选 PNG 而不是 JPG？',
            a: 'PNG 是无损格式，适合编辑或截图。代价是文件通常比 JPG 大。',
          },
          {
            q: 'HEIC 文件会被上传吗？',
            a: '不会。解码和编码都在浏览器里完成，文件留在本机。',
          },
          {
            q: '可以批量转换 HEIC 吗？',
            a: '可以。一次加入多张，批量转换后逐张保存或打包下载。',
          },
          {
            q: 'PNG 会保留 EXIF 吗？',
            a: '新 PNG 是从像素重新编码的，相机和位置信息不会复制进去。',
          },
        ],
      },
    },
  },
  {
    slug: 'webp-to-png',
    from: 'WebP',
    to: 'PNG',
    format: 'png',
    copy: {
      en: {
        title: 'WebP to PNG Converter, No Upload | BgGone',
        description:
          'Convert WebP images to PNG in your browser. Keep transparency, batch convert, and avoid uploading files.',
        h1: 'WebP to PNG Converter',
        lead: 'Turn WebP images into PNG files locally, with transparency preserved.',
        intro:
          'WebP is efficient on the web, but some editors and older apps prefer PNG. Add WebP files here to decode them in the browser and save lossless PNG copies.',
        bullets: [
          'Keep transparency in the PNG output',
          'Batch-convert WebP files',
          'No server upload and no login',
          'Useful when an editor rejects WebP',
        ],
        faq: [
          {
            q: 'Does WebP to PNG lose quality?',
            a: 'No. The decoded pixels are written to a lossless PNG. The file may be larger than the WebP original.',
          },
          {
            q: 'Is transparency kept?',
            a: 'Yes. WebP transparency is preserved in the PNG output.',
          },
          {
            q: 'Are my images uploaded?',
            a: 'No. The conversion runs in this browser, and the files stay on this device.',
          },
          {
            q: 'Can I convert many WebP files at once?',
            a: 'Yes. Add a batch, convert, then save each PNG or download a ZIP.',
          },
        ],
      },
      zh: {
        title: 'WebP 转 PNG 工具，无需上传 | BgGone',
        description:
          '在浏览器里把 WebP 图片转成 PNG，保留透明通道，可批量，无需上传。',
        h1: 'WebP 转 PNG',
        lead: '在本机把 WebP 图片转成 PNG，透明通道会保留。',
        intro:
          'WebP 在网页上很高效，但有些编辑器和旧软件更认 PNG。把 WebP 加进来，页面会在浏览器里解码并保存无损 PNG。',
        bullets: [
          'PNG 输出保留透明通道',
          '批量转换 WebP 文件',
          '无需上传服务器、无需登录',
          '适合编辑器不接受 WebP 的情况',
        ],
        faq: [
          {
            q: 'WebP 转 PNG 会损失画质吗？',
            a: '不会。解码后的像素会写成无损 PNG，但文件通常比 WebP 大。',
          },
          {
            q: '透明背景会保留吗？',
            a: '会。WebP 的透明通道会保留到 PNG 输出里。',
          },
          {
            q: '图片会被上传吗？',
            a: '不会。转换在浏览器里完成，文件留在本机。',
          },
          {
            q: '可以一次转换多张 WebP 吗？',
            a: '可以。批量加入并转换后，逐张保存或打包下载。',
          },
        ],
      },
    },
  },
  {
    slug: 'webp-to-jpg',
    from: 'WebP',
    to: 'JPG',
    format: 'jpeg',
    copy: {
      en: {
        title: 'WebP to JPG Converter, Batch and No Upload | BgGone',
        description:
          'Convert WebP to JPG in your browser. Batch convert, choose JPEG quality, and keep every file on your device.',
        h1: 'WebP to JPG Converter',
        lead: 'Convert WebP images to widely supported JPG files without uploading them.',
        intro:
          'JPG opens almost everywhere, while WebP support still varies in older software. Add WebP images here to decode them locally and save JPG copies with the quality you choose.',
        bullets: [
          'Works with old apps that reject WebP',
          'Batch conversion in the browser',
          'Smaller, Balanced, or High JPEG quality',
          'No upload and no watermark',
        ],
        faq: [
          {
            q: 'Does WebP to JPG reduce quality?',
            a: 'JPG is lossy, so some detail is discarded. High keeps more detail; Smaller produces a smaller file.',
          },
          {
            q: 'What happens to transparent areas?',
            a: 'JPG does not support transparency, so transparent areas are filled with white.',
          },
          {
            q: 'Are the images uploaded?',
            a: 'No. The decoder and JPEG encoder run in this browser, and files stay on the device.',
          },
          {
            q: 'Can I convert a batch?',
            a: 'Yes. Add several WebP files, convert them together, and download one ZIP or individual JPGs.',
          },
        ],
      },
      zh: {
        title: 'WebP 转 JPG 工具，可批量、无需上传 | BgGone',
        description:
          '在浏览器里把 WebP 转成 JPG，可批量、可选质量，文件留在本机。',
        h1: 'WebP 转 JPG',
        lead: '把 WebP 图片转成兼容性更广的 JPG，不需要上传。',
        intro:
          'JPG 的兼容性很广，而旧软件对 WebP 的支持仍不一致。把 WebP 加进来，页面会在本机解码并保存 JPG，质量可以自己选。',
        bullets: [
          '适合不接受 WebP 的旧软件',
          '在浏览器里批量转换',
          '更小、均衡或高质量 JPEG',
          '无需上传、无水印',
        ],
        faq: [
          {
            q: 'WebP 转 JPG 会掉画质吗？',
            a: 'JPG 是有损格式，会丢弃少量细节。高质量保留更多细节，更小会得到更小的文件。',
          },
          {
            q: '透明区域会怎样？',
            a: 'JPG 不支持透明，透明区域会被填成白色。',
          },
          {
            q: '图片会被上传吗？',
            a: '不会。解码和 JPEG 编码都在浏览器里完成，文件留在本机。',
          },
          {
            q: '可以批量转换吗？',
            a: '可以。一次加入多张 WebP，批量转换后打包或逐张下载。',
          },
        ],
      },
    },
  },
  {
    slug: 'avif-to-jpg',
    from: 'AVIF',
    to: 'JPG',
    format: 'jpeg',
    copy: {
      en: {
        title: 'AVIF to JPG Converter, No Upload | BgGone',
        description:
          'Convert AVIF images to JPG in your browser. Batch convert without uploading, for apps that do not support AVIF yet.',
        h1: 'AVIF to JPG Converter',
        lead: 'Turn AVIF images into JPG files on this device, with no upload.',
        intro:
          'AVIF saves space on the web, but many older editors and upload forms still expect JPG. Add AVIF files here to decode them in the browser and save JPG copies.',
        bullets: [
          'Use AVIF images in older apps',
          'Batch-convert in the browser',
          'No server upload and no login',
          'Choose the JPEG quality you need',
        ],
        faq: [
          {
            q: 'Does AVIF to JPG lose quality?',
            a: 'JPG is lossy, so some detail is discarded. High keeps more detail; Smaller makes a smaller file.',
          },
          {
            q: 'Why convert AVIF to JPG?',
            a: 'AVIF is efficient but not accepted everywhere. JPG is a safer format for older software and forms.',
          },
          {
            q: 'Are AVIF files uploaded?',
            a: 'No. The image is decoded and re-encoded in this browser, and the file stays on the device.',
          },
          {
            q: 'Does JPG keep transparency?',
            a: 'No. JPG does not support transparency, so transparent areas are filled with white.',
          },
        ],
      },
      zh: {
        title: 'AVIF 转 JPG 工具，无需上传 | BgGone',
        description:
          '在浏览器里把 AVIF 转成 JPG，可批量、无需上传，适合还不支持 AVIF 的软件。',
        h1: 'AVIF 转 JPG',
        lead: '在本机把 AVIF 图片转成 JPG，不需要上传。',
        intro:
          'AVIF 在网页上能省体积，但不少旧编辑器和上传表单仍要求 JPG。把 AVIF 加进来，页面会在浏览器里解码并保存 JPG。',
        bullets: [
          '让 AVIF 图片能在旧软件里使用',
          '在浏览器里批量转换',
          '无需上传服务器、无需登录',
          '可按需要选择 JPEG 质量',
        ],
        faq: [
          {
            q: 'AVIF 转 JPG 会损失画质吗？',
            a: 'JPG 是有损格式，会丢弃少量细节。高质量保留更多细节，更小会得到更小的文件。',
          },
          {
            q: '为什么要转成 JPG？',
            a: 'AVIF 很高效，但并非所有软件都支持。JPG 对旧软件和表单更稳妥。',
          },
          {
            q: 'AVIF 文件会被上传吗？',
            a: '不会。图片在浏览器里解码和重新编码，文件留在本机。',
          },
          {
            q: 'JPG 会保留透明通道吗？',
            a: '不会。JPG 不支持透明，透明区域会被填成白色。',
          },
        ],
      },
    },
  },
  {
    slug: 'png-to-jpg',
    from: 'PNG',
    to: 'JPG',
    format: 'jpeg',
    copy: {
      en: {
        title: 'PNG to JPG Converter, Smaller Files | BgGone',
        description:
          'Convert PNG to JPG in your browser. Batch convert, flatten transparency to white, and keep the files on your device.',
        h1: 'PNG to JPG Converter',
        lead: 'Make JPG copies of PNG images without uploading them.',
        intro:
          'PNG is lossless but often much larger than JPG. Add PNG files here to flatten transparency to white, encode a JPG, and download a smaller file for sharing or upload limits.',
        bullets: [
          'Smaller files for forms and attachments',
          'Batch-convert PNG images',
          'Transparent areas become white',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What happens to transparency?',
            a: 'JPG does not support transparency, so transparent areas are filled with white.',
          },
          {
            q: 'Does PNG to JPG reduce quality?',
            a: 'JPG is lossy. High keeps more detail; Smaller makes a smaller file.',
          },
          {
            q: 'Are the images uploaded?',
            a: 'No. The conversion runs in this browser, and the files stay on this device.',
          },
          {
            q: 'Can I convert a batch of PNG files?',
            a: 'Yes. Add several files, convert them together, and download individual JPGs or a ZIP.',
          },
        ],
      },
      zh: {
        title: 'PNG 转 JPG 工具，文件更小 | BgGone',
        description:
          '在浏览器里把 PNG 转成 JPG，可批量、透明区域填白，文件留在本机。',
        h1: 'PNG 转 JPG',
        lead: '不经过上传，把 PNG 图片存成 JPG 副本。',
        intro:
          'PNG 无损但通常比 JPG 大。把 PNG 加进来，页面会把透明区域填白、编码成 JPG，方便分享或满足上传体积限制。',
        bullets: [
          '适合表单和附件的小体积文件',
          '批量转换 PNG 图片',
          '透明区域会变成白色',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '透明区域会怎样？',
            a: 'JPG 不支持透明，透明区域会被填成白色。',
          },
          {
            q: 'PNG 转 JPG 会掉画质吗？',
            a: 'JPG 是有损格式。高质量保留更多细节，更小会得到更小的文件。',
          },
          {
            q: '图片会被上传吗？',
            a: '不会。转换在浏览器里完成，文件留在本机。',
          },
          {
            q: '可以批量转换 PNG 吗？',
            a: '可以。一次加入多张，批量转换后逐张或打包下载 JPG。',
          },
        ],
      },
    },
  },
  {
    slug: 'jpg-to-png',
    from: 'JPG',
    to: 'PNG',
    format: 'png',
    copy: {
      en: {
        title: 'JPG to PNG Converter, Lossless | BgGone',
        description:
          'Convert JPG to PNG in your browser. Batch convert to a lossless format without uploading your photos.',
        h1: 'JPG to PNG Converter',
        lead: 'Save lossless PNG copies of JPG images, locally in your browser.',
        intro:
          'PNG is useful when you need a lossless file for editing. JPG photos do not gain detail when converted, but a PNG copy avoids another lossy save and is accepted by more editors.',
        bullets: [
          'Lossless PNG output for editing',
          'Batch-convert JPG files',
          'No upload and no login',
          'Keeps the pixels of the original JPG',
        ],
        faq: [
          {
            q: 'Does JPG to PNG improve quality?',
            a: 'No. The pixels are copied into a lossless container. It cannot restore detail that the JPG already discarded.',
          },
          {
            q: 'Why convert JPG to PNG?',
            a: 'PNG is convenient for editing workflows and avoids another lossy save. The trade-off is a larger file.',
          },
          {
            q: 'Are the photos uploaded?',
            a: 'No. The conversion runs in this browser, and the files stay on your device.',
          },
          {
            q: 'Can I convert several JPG files at once?',
            a: 'Yes. Add a batch, convert, and download the PNG files one by one or as a ZIP.',
          },
        ],
      },
      zh: {
        title: 'JPG 转 PNG 工具，无损输出 | BgGone',
        description:
          '在浏览器里把 JPG 转成 PNG，可批量、无损输出，无需上传照片。',
        h1: 'JPG 转 PNG',
        lead: '在本机把 JPG 图片保存为无损 PNG 副本。',
        intro:
          '需要无损文件继续编辑时，PNG 更合适。JPG 转 PNG 不会恢复已经丢失的细节，但可以避免再次有损保存，也更容易被编辑器接受。',
        bullets: [
          '适合编辑的无损 PNG',
          '批量转换 JPG 文件',
          '无需上传、无需登录',
          '保留原 JPG 的像素',
        ],
        faq: [
          {
            q: 'JPG 转 PNG 会提升画质吗？',
            a: '不会。只是把像素放进无损容器，无法恢复 JPG 已经丢弃的细节。',
          },
          {
            q: '为什么要转成 PNG？',
            a: 'PNG 适合编辑流程，也能避免再次有损保存，代价是文件更大。',
          },
          {
            q: '照片会被上传吗？',
            a: '不会。转换在浏览器里完成，文件留在本机。',
          },
          {
            q: '可以一次转换多张 JPG 吗？',
            a: '可以。批量加入并转换后，逐张保存或打包下载 PNG。',
          },
        ],
      },
    },
  },
  {
    slug: 'png-to-webp',
    from: 'PNG',
    to: 'WebP',
    format: 'webp',
    copy: {
      en: {
        title: 'PNG to WebP Converter, Smaller Images | BgGone',
        description:
          'Convert PNG to WebP in your browser. Batch convert for smaller web images without uploading files.',
        h1: 'PNG to WebP Converter',
        lead: 'Make smaller WebP copies of PNG images for the web, on this device.',
        intro:
          'WebP usually produces smaller files than PNG at similar visual quality, which helps page speed. Add PNG images here to decode them locally and save WebP output with the quality you choose.',
        bullets: [
          'Smaller files for web pages',
          'Transparency stays supported',
          'Batch conversion in the browser',
          'No upload and no watermark',
        ],
        faq: [
          {
            q: 'Does WebP support transparency?',
            a: 'Yes. WebP supports an alpha channel, and transparency is preserved in the output.',
          },
          {
            q: 'Is WebP smaller than PNG?',
            a: 'Usually yes at similar visual quality, although the result depends on the image and the quality setting.',
          },
          {
            q: 'Are the PNG files uploaded?',
            a: 'No. The encoder runs in this browser, and the files stay on your device.',
          },
          {
            q: 'Can I convert a batch of PNG files?',
            a: 'Yes. Add several files, convert them together, and download the WebP files or a ZIP.',
          },
        ],
      },
      zh: {
        title: 'PNG 转 WebP 工具，图片更小 | BgGone',
        description:
          '在浏览器里把 PNG 转成 WebP，可批量、适合网页使用，无需上传。',
        h1: 'PNG 转 WebP',
        lead: '在本机把 PNG 图片转成更小的 WebP，适合网页使用。',
        intro:
          '在相近视觉质量下，WebP 通常比 PNG 体积更小，有利于网页加载速度。把 PNG 加进来，页面会在本地解码并保存 WebP，质量可以自己选。',
        bullets: [
          '适合网页的更小文件',
          '继续支持透明通道',
          '在浏览器里批量转换',
          '无需上传、无水印',
        ],
        faq: [
          {
            q: 'WebP 支持透明吗？',
            a: '支持。WebP 有 alpha 通道，透明区域会保留到输出里。',
          },
          {
            q: 'WebP 一定比 PNG 小吗？',
            a: '在相近视觉质量下通常更小，但具体取决于图片内容和质量设置。',
          },
          {
            q: 'PNG 文件会被上传吗？',
            a: '不会。编码器在浏览器里运行，文件留在本机。',
          },
          {
            q: '可以批量转换 PNG 吗？',
            a: '可以。一次加入多张，批量转换后逐张或打包下载 WebP。',
          },
        ],
      },
    },
  },
];

export function findConversion(slug: string) {
  return conversions.find((conversion) => conversion.slug === slug);
}

export function conversionMetadata(
  lang: Lang,
  conversion: Conversion
): Metadata {
  const copy = conversion.copy[lang];
  const path = `/${conversion.slug}`;
  const canonical = new URL(localizedPath(lang, path), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', path), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', path), SITE_URL).href;
  const ogImage = '/bggone-compress.jpg';
  const ogImageAlt =
    lang === 'zh'
      ? `${copy.h1} - 在浏览器里转换`
      : `${copy.h1} - convert in the browser`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        zh: zhUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: canonical,
      siteName: 'BgGone',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [{ url: ogImage, alt: ogImageAlt }],
    },
  };
}

export function conversionJsonLd(lang: Lang, conversion: Conversion) {
  const copy = conversion.copy[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.h1,
    url: new URL(localizedPath(lang, `/${conversion.slug}`), SITE_URL).href,
    description: copy.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser with WebAssembly support',
    inLanguage: ['en', 'zh'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: copy.bullets,
  };
}

export function conversionFaqJsonLd(lang: Lang, conversion: Conversion) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: conversion.copy[lang].faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

const convertPageCopy = {
  en: {
    title: 'Image Converter, HEIC, WebP, AVIF, PNG, JPG | BgGone',
    description:
      'Convert HEIC, WebP, AVIF, PNG, and JPG images in your browser. Batch convert without uploading and keep the files on your device.',
    name: 'BgGone Image Converter',
    h1: 'Image Converter',
    lead: 'Convert HEIC, WebP, AVIF, PNG, and JPG images in your browser. Batch, no upload, no login.',
    features: [
      'HEIC to JPG and PNG',
      'WebP to PNG and JPG',
      'AVIF to JPG',
      'PNG and JPG conversion',
      'Batch conversion',
      'Runs in the browser',
    ],
  },
  zh: {
    title: '图片格式转换器，HEIC、WebP、AVIF、PNG、JPG | BgGone',
    description:
      '在浏览器里转换 HEIC、WebP、AVIF、PNG、JPG 图片，可批量，无需上传，文件留在本机。',
    name: 'BgGone 图片格式转换',
    h1: '图片格式转换',
    lead: '在浏览器里转换 HEIC、WebP、AVIF、PNG、JPG 图片，可批量，无需上传，也无需登录。',
    features: [
      'HEIC 转 JPG 和 PNG',
      'WebP 转 PNG 和 JPG',
      'AVIF 转 JPG',
      'PNG 和 JPG 互转',
      '批量转换',
      '在浏览器里完成',
    ],
  },
} as const;

export function convertMetadata(lang: Lang): Metadata {
  const copy = convertPageCopy[lang];
  const canonical = new URL(localizedPath(lang, '/convert'), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', '/convert'), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', '/convert'), SITE_URL).href;
  const ogImage = '/bggone-compress.jpg';

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        zh: zhUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: canonical,
      siteName: 'BgGone',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: copy.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [{ url: ogImage, alt: copy.h1 }],
    },
  };
}

export function convertPageContent(lang: Lang) {
  return convertPageCopy[lang];
}

export function convertAppJsonLd(lang: Lang) {
  const copy = convertPageCopy[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.name,
    url: new URL(localizedPath(lang, '/convert'), SITE_URL).href,
    description: copy.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser with WebAssembly support',
    inLanguage: ['en', 'zh'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [...copy.features],
  };
}

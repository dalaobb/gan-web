import type { Metadata } from 'next';
import { localizedPath, SITE_URL, type Lang } from '@/lib/i18n';

export type QuickToolKey =
  | 'blur-background'
  | 'white-background'
  | 'remove-exif'
  | 'blur-face';

export type QuickToolCopy = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  intro: string;
  bullets: string[];
  faq: { q: string; a: string }[];
};

export type QuickToolPage = {
  slug: string;
  key: QuickToolKey;
  ogImage: string;
  copy: Record<Lang, QuickToolCopy>;
};

export const quickToolPages: QuickToolPage[] = [
  {
    slug: 'blur-background',
    key: 'blur-background',
    ogImage: '/bggone-bg-remover.jpg',
    copy: {
      en: {
        title: 'Blur Image Background Online, No Upload | BgGone',
        description:
          'Blur the background of a photo in your browser. Keep the subject sharp, choose the blur amount, and download without uploading.',
        h1: 'Blur Background',
        lead: 'Keep the subject sharp while the background softens. The image stays on this device.',
        intro:
          'This tool finds the main subject, removes the original background, and puts a blurred copy behind it. Use it for portraits, product shots, or screenshots where the background distracts.',
        bullets: [
          'Adjustable blur amount',
          'Works on portraits and products',
          'No upload and no login',
          'Download a JPEG',
        ],
        faq: [
          {
            q: 'Are my photos uploaded?',
            a: 'No. Background removal, blurring, and export all run in this browser.',
          },
          {
            q: 'Can I change the blur strength?',
            a: 'Yes. Move the blur slider and the result updates before you download.',
          },
          {
            q: 'What kind of photos work best?',
            a: 'Photos with one clear subject, such as a person or a product, work best.',
          },
          {
            q: 'What format is the download?',
            a: 'The result is a JPEG. Transparent areas are not needed for a blurred background.',
          },
        ],
      },
      zh: {
        title: '在线背景虚化，无需上传 | BgGone',
        description:
          '在浏览器里虚化照片背景，保留主体清晰，可调模糊强度，无需上传。',
        h1: '背景虚化',
        lead: '让主体保持清晰、背景变柔，图片留在这台设备上。',
        intro:
          '这个工具会识别主要主体、去掉原背景，再在背后放一张模糊副本。适合人像、产品图或背景太杂的照片。',
        bullets: [
          '可调模糊强度',
          '适合人像和产品图',
          '无需上传、无需登录',
          '下载 JPEG',
        ],
        faq: [
          {
            q: '照片会被上传吗？',
            a: '不会。去背景、模糊和导出都在浏览器里完成。',
          },
          {
            q: '可以调整模糊程度吗？',
            a: '可以。拖动模糊滑块，下载前会实时更新效果。',
          },
          {
            q: '什么样的照片效果最好？',
            a: '主体明确的人像或产品照效果最好。',
          },
          {
            q: '输出是什么格式？',
            a: '输出是 JPEG，虚化背景不需要透明通道。',
          },
        ],
      },
    },
  },
  {
    slug: 'white-background',
    key: 'white-background',
    ogImage: '/bggone-bg-remover.jpg',
    copy: {
      en: {
        title: 'White Background Product Photo, 2000×2000 | BgGone',
        description:
          'Remove a product background and place the item on a clean white 2000×2000 canvas with optional shadow, without uploading.',
        h1: 'White Background Product Photo',
        lead: 'Turn a product photo into a clean white-background image, locally.',
        intro:
          'This tool removes the background and places the product on a square white canvas. The padding and soft shadow controls help match marketplace listing styles.',
        bullets: [
          '2000 × 2000 white canvas',
          'Adjustable padding',
          'Optional soft shadow',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'What size is the output?',
            a: 'The output is a 2000 × 2000 JPEG, a common size for marketplace product images.',
          },
          {
            q: 'Can I add a shadow?',
            a: 'Yes. Turn on the soft shadow option to add a subtle shadow under the product.',
          },
          {
            q: 'Are my product photos uploaded?',
            a: 'No. Background removal and export run in this browser.',
          },
          {
            q: 'What photos work best?',
            a: 'Use a well-lit product photo with the whole item visible and a simple background.',
          },
        ],
      },
      zh: {
        title: '白底产品图制作，2000×2000 | BgGone',
        description:
          '去掉产品背景，放到干净的 2000×2000 白色画布上，可选柔和阴影，无需上传。',
        h1: '白底产品图',
        lead: '在本机把产品照做成干净的白底图。',
        intro:
          '这个工具会去掉背景，把产品放到正方形白色画布上。留白和柔和阴影选项可以接近电商平台的商品图风格。',
        bullets: [
          '2000×2000 白色画布',
          '可调留白',
          '可选柔和阴影',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '输出尺寸是多少？',
            a: '输出是 2000×2000 JPEG，适合电商平台商品图。',
          },
          {
            q: '可以加阴影吗？',
            a: '可以。打开柔和阴影选项，会在产品下方加一层淡淡的阴影。',
          },
          {
            q: '产品照片会被上传吗？',
            a: '不会。去背景和导出都在浏览器里完成。',
          },
          {
            q: '什么样的照片效果最好？',
            a: '使用光线充足、产品完整、背景简单的照片。',
          },
        ],
      },
    },
  },
  {
    slug: 'remove-exif',
    key: 'remove-exif',
    ogImage: '/bggone-compress.jpg',
    copy: {
      en: {
        title: 'Remove EXIF Metadata from Photos | BgGone',
        description:
          'Remove EXIF, camera, location, and other metadata from JPEG, PNG, WebP, and HEIC images in your browser.',
        h1: 'Remove EXIF Metadata',
        lead: 'Strip camera, location, and timestamp metadata by re-encoding the pixels locally.',
        intro:
          'Photos often carry hidden EXIF data such as camera model, GPS location, and timestamps. Add images here and this page re-encodes them in the browser, leaving the visible pixels and removing the metadata.',
        bullets: [
          'Remove location and camera data',
          'Batch process images',
          'JPEG, PNG, WebP, and HEIC',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'What metadata is removed?',
            a: 'The output is re-encoded from pixels, so EXIF, GPS, camera, and timestamp fields are not copied into the new file.',
          },
          {
            q: 'Does this change the image quality?',
            a: 'JPEG and WebP are re-encoded, so there can be a small quality change. PNG stays lossless.',
          },
          {
            q: 'Can I clean several images at once?',
            a: 'Yes. Add a batch and download the cleaned files one by one.',
          },
          {
            q: 'Are the images uploaded?',
            a: 'No. The re-encoding happens in this browser, and the files stay on your device.',
          },
        ],
      },
      zh: {
        title: '删除照片 EXIF 元数据 | BgGone',
        description:
          '在浏览器里删除 JPEG、PNG、WebP、HEIC 图片的 EXIF、相机、位置等元数据。',
        h1: '删除 EXIF 元数据',
        lead: '在本机重新编码像素，去掉相机、位置和时间等元数据。',
        intro:
          '照片里常带有相机型号、GPS 位置、拍摄时间等隐藏信息。把图片加进来，这个页面会在浏览器里重新编码，保留可见像素并去掉元数据。',
        bullets: [
          '删除位置和相机信息',
          '可批量处理',
          '支持 JPEG、PNG、WebP、HEIC',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '会删除哪些信息？',
            a: '输出是从像素重新编码的，EXIF、GPS、相机和时间字段不会写入新文件。',
          },
          {
            q: '会影响画质吗？',
            a: 'JPEG 和 WebP 会重新编码，可能有轻微画质变化。PNG 保持无损。',
          },
          {
            q: '可以一次清理多张吗？',
            a: '可以。批量加入后逐张下载清理后的文件。',
          },
          {
            q: '图片会被上传吗？',
            a: '不会。重新编码在浏览器里完成，文件留在本机。',
          },
        ],
      },
    },
  },
  {
    slug: 'blur-face',
    key: 'blur-face',
    ogImage: '/bggone-bg-remover.jpg',
    copy: {
      en: {
        title: 'Blur Faces in Photos, Local and No Upload | BgGone',
        description:
          'Detect and blur faces in photos in your browser. Adjust the blur and download without uploading.',
        h1: 'Blur Faces',
        lead: 'Detect faces and blur them for privacy, all on this device.',
        intro:
          'Add a photo and this tool finds the faces, then blurs each one. Use it before sharing photos of other people, children, or public scenes.',
        bullets: [
          'Detects multiple faces',
          'Adjustable blur amount',
          'No upload and no login',
          'Download a JPEG',
        ],
        faq: [
          {
            q: 'Can it blur more than one face?',
            a: 'Yes. The detector looks for multiple faces and blurs each one it finds.',
          },
          {
            q: 'Can I undo the blur?',
            a: 'The result is a new copy, so the original file stays untouched. Reload the page to start over.',
          },
          {
            q: 'Are the photos uploaded?',
            a: 'No. Face detection, blurring, and export all run in this browser.',
          },
          {
            q: 'What photos work best?',
            a: 'Straight, well-lit faces are detected most reliably.',
          },
        ],
      },
      zh: {
        title: '照片人脸模糊，本地处理、无需上传 | BgGone',
        description:
          '在浏览器里识别并模糊照片中的人脸，可调模糊强度，无需上传。',
        h1: '人脸模糊',
        lead: '在本机识别人脸并模糊，保护照片里的隐私。',
        intro:
          '把照片加进来，这个工具会找到人脸并逐张模糊。分享别人的照片、儿童照片或公共场景前可以用。',
        bullets: [
          '可识别多张人脸',
          '可调模糊强度',
          '无需上传、无需登录',
          '下载 JPEG',
        ],
        faq: [
          {
            q: '可以模糊多张脸吗？',
            a: '可以。检测器会寻找多张人脸，并分别模糊。',
          },
          {
            q: '可以撤销模糊吗？',
            a: '处理结果另存为副本，原文件不受影响。刷新页面即可重新开始。',
          },
          {
            q: '照片会被上传吗？',
            a: '不会。人脸识别、模糊和导出都在浏览器里完成。',
          },
          {
            q: '什么样的照片效果最好？',
            a: '正面、光线充足的人脸识别最稳定。',
          },
        ],
      },
    },
  },
];

export function findQuickTool(slug: string) {
  return quickToolPages.find((tool) => tool.slug === slug);
}

export function quickToolMetadata(
  lang: Lang,
  tool: QuickToolPage
): Metadata {
  const copy = tool.copy[lang];
  const path = `/${tool.slug}`;
  const canonical = new URL(localizedPath(lang, path), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', path), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', path), SITE_URL).href;

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
          url: tool.ogImage,
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
      images: [{ url: tool.ogImage, alt: copy.h1 }],
    },
  };
}

export function quickToolJsonLd(lang: Lang, tool: QuickToolPage) {
  const copy = tool.copy[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.h1,
    url: new URL(localizedPath(lang, `/${tool.slug}`), SITE_URL).href,
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

export function quickToolFaqJsonLd(lang: Lang, tool: QuickToolPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.copy[lang].faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

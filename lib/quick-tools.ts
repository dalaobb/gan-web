import type { Metadata } from 'next';
import { localizedPath, SITE_URL, type Lang } from '@/lib/i18n';

export type QuickToolKey =
  | 'blur-background'
  | 'white-background'
  | 'remove-exif'
  | 'blur-face'
  | 'images-to-pdf'
  | 'pdf-to-jpg'
  | 'compress-gif'
  | 'upscale';

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
    ogImage: '/bggone-blur-background.jpg',
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
    ogImage: '/bggone-white-background.jpg',
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
    ogImage: '/bggone-remove-exif.jpg',
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
    ogImage: '/bggone-blur-face.jpg',
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
  {
    slug: 'images-to-pdf',
    key: 'images-to-pdf',
    ogImage: '/bggone-images-to-pdf.jpg',
    copy: {
      en: {
        title: 'Images to PDF Converter, No Upload | BgGone',
        description:
          'Combine JPG, PNG, WebP, AVIF, and HEIC images into one PDF in your browser. Reorder the pages and download without uploading.',
        h1: 'Images to PDF',
        lead: 'Put several images into one PDF, locally in your browser.',
        intro:
          'Add the images you want, put them in order, and export one PDF. Each image becomes an A4 page with white margins, and the files stay on this device.',
        bullets: [
          'Combine multiple images',
          'Reorder pages before export',
          'A4 pages with white margins',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'Which image formats work?',
            a: 'JPEG, PNG, WebP, AVIF, and HEIC are accepted. Each image is placed on its own A4 page.',
          },
          {
            q: 'Can I change the page order?',
            a: 'Yes. Use the up and down buttons in the file list before creating the PDF.',
          },
          {
            q: 'Are the images uploaded?',
            a: 'No. The PDF is assembled in this browser, and the files stay on your device.',
          },
          {
            q: 'Does it keep transparency?',
            a: 'Transparent areas are placed on a white page background, which is standard for PDF output.',
          },
        ],
      },
      zh: {
        title: '图片转 PDF，无需上传 | BgGone',
        description:
          '在浏览器里把 JPG、PNG、WebP、AVIF、HEIC 图片合并成一个 PDF，可调整页面顺序，无需上传。',
        h1: '图片转 PDF',
        lead: '把多张图片合成一个 PDF，全程在本机完成。',
        intro:
          '加入图片、调整顺序，然后导出 PDF。每张图片会成为一页带白边的 A4 页面，文件留在这台设备上。',
        bullets: [
          '合并多张图片',
          '导出前调整页面顺序',
          'A4 页面，带白边',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '支持哪些图片格式？',
            a: '支持 JPEG、PNG、WebP、AVIF、HEIC。每张图片会单独放在一页 A4 上。',
          },
          {
            q: '可以调整页面顺序吗？',
            a: '可以。生成 PDF 前，用文件列表里的上移/下移按钮调整。',
          },
          {
            q: '图片会被上传吗？',
            a: '不会。PDF 在浏览器里生成，文件留在本机。',
          },
          {
            q: '会保留透明背景吗？',
            a: '透明区域会放在白色页面背景上，这是 PDF 的常规处理方式。',
          },
        ],
      },
    },
  },
  {
    slug: 'pdf-to-jpg',
    key: 'pdf-to-jpg',
    ogImage: '/bggone-pdf-to-jpg.jpg',
    copy: {
      en: {
        title: 'PDF to JPG Converter, No Upload | BgGone',
        description:
          'Turn PDF pages into JPG or PNG images in your browser. Download pages one by one or as a ZIP, without uploading.',
        h1: 'PDF to Images',
        lead: 'Render each PDF page as a JPG or PNG, locally.',
        intro:
          'Choose a PDF and convert its pages into images. The pages are rendered at 2× resolution, and you can download them one by one or as a ZIP.',
        bullets: [
          'JPG or PNG output',
          '2× page resolution',
          'Download one page or a ZIP',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'Can I get PNG instead of JPG?',
            a: 'Yes. Choose PNG before converting to keep lossless page images.',
          },
          {
            q: 'Are all pages converted?',
            a: 'Yes. Each page becomes a separate image in the results list.',
          },
          {
            q: 'Is the PDF uploaded?',
            a: 'No. PDF parsing and page rendering run in this browser.',
          },
          {
            q: 'Why is the image larger than the PDF?',
            a: 'Pages are rendered at 2× resolution as raster images, so the output can be larger than the original PDF.',
          },
        ],
      },
      zh: {
        title: 'PDF 转 JPG，无需上传 | BgGone',
        description:
          '在浏览器里把 PDF 页面转成 JPG 或 PNG，可逐页下载或打包下载，无需上传。',
        h1: 'PDF 转图片',
        lead: '在本机把 PDF 每一页渲染成 JPG 或 PNG。',
        intro:
          '选择 PDF，把页面转换成图片。页面按 2 倍分辨率渲染，可以逐页下载或打包成 ZIP。',
        bullets: [
          '输出 JPG 或 PNG',
          '2 倍页面分辨率',
          '逐页下载或打包下载',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '可以输出 PNG 吗？',
            a: '可以。转换前选择 PNG，页面图片会保持无损。',
          },
          {
            q: '所有页面都会转换吗？',
            a: '会。每一页都会在结果列表里生成一张图片。',
          },
          {
            q: 'PDF 会被上传吗？',
            a: '不会。PDF 解析和页面渲染都在浏览器里完成。',
          },
          {
            q: '为什么图片比 PDF 大？',
            a: '页面按 2 倍分辨率渲染成位图，输出体积可能比原 PDF 大。',
          },
        ],
      },
    },
  },
  {
    slug: 'compress-gif',
    key: 'compress-gif',
    ogImage: '/bggone-compress-gif.jpg',
    copy: {
      en: {
        title: 'Compress GIF Online to a Target Size | BgGone',
        description:
          'Compress animated GIFs in your browser to a target size. Reduce dimensions, frames, or colors and download without uploading.',
        h1: 'GIF Compressor',
        lead: 'Shrink an animated GIF toward a target size, locally in your browser.',
        intro:
          'Choose a target size and this tool re-encodes the animation. It may reduce dimensions, drop frames, or use fewer colors to get under the limit, and the result stays on this device.',
        bullets: [
          'Targets from 100 KB to 5 MB',
          'Keeps the animation',
          'Adjusts size, frames, and colors',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'How does it hit the target size?',
            a: 'It tries smaller dimensions, fewer frames, and smaller color palettes until the GIF fits or no smaller option helps.',
          },
          {
            q: 'Does it keep the animation?',
            a: 'Yes. The output is still an animated GIF, though some frames or dimensions may be reduced.',
          },
          {
            q: 'Is my GIF uploaded?',
            a: 'No. Parsing, re-encoding, and download all happen in this browser.',
          },
          {
            q: 'Why is it still above the target?',
            a: 'Some GIFs cannot get under a very small target without losing too much. The result will show if it is still above the limit.',
          },
        ],
      },
      zh: {
        title: '在线压缩 GIF 到指定体积 | BgGone',
        description:
          '在浏览器里把动图 GIF 压到目标体积，可缩小尺寸、减少帧数或颜色数，无需上传。',
        h1: 'GIF 压缩',
        lead: '在本机把动图 GIF 压向目标体积。',
        intro:
          '选择目标体积后，这个工具会重新编码动图。为了压到限制以内，可能会缩小尺寸、减少帧数或颜色数，结果文件留在这台设备上。',
        bullets: [
          '目标体积 100KB 到 5MB',
          '保留动画',
          '自动调整尺寸、帧数和颜色',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '它怎么达到目标体积？',
            a: '会依次尝试更小的尺寸、更少的帧数和更小的颜色表，直到 GIF 符合要求或没有更小的方案。',
          },
          {
            q: '还会保留动画吗？',
            a: '会。输出仍然是动图 GIF，但尺寸、帧数或颜色可能减少。',
          },
          {
            q: 'GIF 会被上传吗？',
            a: '不会。解析、重新编码和下载都在浏览器里完成。',
          },
          {
            q: '为什么还是超过目标体积？',
            a: '有些 GIF 在目标太小时无法兼顾体积和画质。结果会提示是否仍然超过限制。',
          },
        ],
      },
    },
  },
  {
    slug: 'upscale',
    key: 'upscale',
    ogImage: '/bggone-upscale.jpg',
    copy: {
      en: {
        title: '2× / 4× Image Upscaler with Real-ESRGAN, Local | BgGone',
        description:
          'Upscale a photo 2× or 4× in your browser with Real-ESRGAN. The image stays on your device; the first run downloads the model once.',
        h1: '2× / 4× Image Upscaler',
        lead: "Double or quadruple a photo's resolution locally with Real-ESRGAN.",
        intro:
          'This beta tool runs Real-ESRGAN in the browser. Add one or several photos, choose 2× or 4×, start the batch, and preview each result before downloading. 2× accepts inputs up to 1400 px on the long edge; 4× runs the model twice and accepts up to 700 px. The first run downloads about 67 MB; later runs reuse the cached model. Transparent areas are flattened to white.',
        bullets: [
          '2× and 4× modes',
          'Batch upscale with previews',
          'Runs locally in the browser',
          'WebGPU with CPU fallback',
          'No upload and no login',
        ],
        faq: [
          {
            q: 'Is the output really 2× or 4×?',
            a: 'Yes. 2× doubles the width and height of the processed image. 4× runs the 2× model twice, producing four times the width and height.',
          },
          {
            q: 'Why is 4× limited to 700 px?',
            a: 'A 4× result has 16 times as many pixels as the input. The cap keeps the output at or below 2800 px and avoids browser memory errors.',
          },
          {
            q: 'Can I upscale more than one photo?',
            a: 'Yes. Add a batch, start it once, then preview each row. Use the close button on a row to remove it before downloading.',
          },
          {
            q: 'Why is there a size limit?',
            a: 'The model is heavy. Keeping the input at 1400 px or less avoids browser memory errors and very long runtimes.',
          },
          {
            q: 'What happens without WebGPU?',
            a: 'It falls back to CPU with WebAssembly. That still works, but it can take much longer.',
          },
          {
            q: 'Are my photos uploaded?',
            a: 'No. Downloading the model is the only network request; the image itself is processed in this browser.',
          },
        ],
      },
      zh: {
        title: '2× / 4× 图片高清放大，本地 Real-ESRGAN | BgGone',
        description:
          '在浏览器里用 Real-ESRGAN 把照片放大 2 倍或 4 倍，图片不离开本机，首次使用下载一次模型。',
        h1: '2× / 4× 图片高清放大',
        lead: '在本机用 Real-ESRGAN 把照片分辨率放大 2 倍或 4 倍。',
        intro:
          '这是一个测试版工具，模型在浏览器里运行。可以一次加入多张照片，选择 2× 或 4×，开始批量放大，逐张预览后再下载。2× 输入长边最大 1400px；4× 会把 2× 模型跑两遍，输入长边最大 700px。首次使用会下载约 67MB 模型，之后复用缓存；透明区域会铺白。',
        bullets: [
          '2× 和 4× 两种模式',
          '批量放大，可逐张预览',
          '浏览器本地运行',
          '优先 WebGPU，支持 CPU 回退',
          '无需上传、无需登录',
        ],
        faq: [
          {
            q: '输出真的是 2 倍或 4 倍吗？',
            a: '是。2× 会把处理后图片的宽高翻倍；4× 会把 2× 模型跑两遍，宽高变成 4 倍。',
          },
          {
            q: '为什么 4× 限制 700px？',
            a: '4× 结果的像素数是输入的 16 倍。限制输入可以避免输出超过 2800px，减少浏览器内存不足的风险。',
          },
          {
            q: '可以一次放大多张照片吗？',
            a: '可以。加入一批照片后点一次开始，等结果出来后逐张预览。下载前可以用列表里的关闭按钮删除不满意的图片。',
          },
          {
            q: '为什么限制输入尺寸？',
            a: '模型比较重。把输入长边控制在 1400px 以内，可以避免浏览器内存不足和过长的等待。',
          },
          {
            q: '没有 WebGPU 会怎样？',
            a: '会退回 WebAssembly + CPU。仍然能用，但速度会慢很多。',
          },
          {
            q: '照片会被上传吗？',
            a: '不会。唯一的网络请求是下载模型，图片本身只在浏览器里处理。',
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

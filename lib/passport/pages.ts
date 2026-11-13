import type { Metadata } from 'next';
import { localizedPath, SITE_URL, type Lang } from '@/lib/i18n';
import type { PassportSpecId } from '@/lib/passport/specs';

export type PassportPageCopy = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  intro: string;
  bullets: string[];
  faq: { q: string; a: string }[];
};

export type PassportPage = {
  slug: string;
  specId: PassportSpecId;
  copy: Record<Lang, PassportPageCopy>;
};

export const passportPages: PassportPage[] = [
  {
    slug: 'us-passport-photo',
    specId: 'us',
    copy: {
      en: {
        title: 'US Passport Photo Maker, 2×2 in | BgGone',
        description:
          'Make a US passport photo in your browser. Crop to 2×2 in, replace the background, and download a 4×6 print sheet without uploading.',
        h1: 'US Passport Photo Maker',
        lead: 'Crop a portrait to the US 2×2 in size and export a print sheet, all on this device.',
        intro:
          'A US passport photo is 2 × 2 inches. This page finds the face, removes the background, and lets you adjust the head size before exporting a 600 × 600 px photo and a 4 × 6 print sheet.',
        bullets: [
          '2 × 2 in at 300 dpi, 600 × 600 px',
          'Plain white or off-white background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a US passport photo?',
            a: 'The printed photo is 2 × 2 inches. At 300 dpi that is 600 × 600 pixels.',
          },
          {
            q: 'Can I use a phone photo?',
            a: 'Yes, if the face is straight, well lit, and the whole head is visible. A plain background is easiest to replace.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then a white or off-white background is added for the export.',
          },
          {
            q: 'Is the print sheet ready for a photo lab?',
            a: 'The sheet is 4 × 6 inches at 300 dpi with six photos. Check the official requirements before printing.',
          },
        ],
      },
      zh: {
        title: '美国护照照片制作，2×2 英寸 | BgGone',
        description:
          '在浏览器里制作美国护照照片：裁成 2×2 英寸、替换背景，并下载 4×6 排版，无需上传。',
        h1: '美国护照照片制作',
        lead: '把正面照裁成美国 2×2 英寸规格，并导出排版，全程在这台设备上完成。',
        intro:
          '美国护照照片是 2×2 英寸。这个页面会识别人脸、去除背景，并允许调整头部大小，最后导出 600×600 像素照片和 4×6 排版。',
        bullets: [
          '2×2 英寸，300 dpi，600×600 像素',
          '纯白或米白背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '美国护照照片尺寸是多少？',
            a: '打印尺寸是 2×2 英寸，300 dpi 下是 600×600 像素。',
          },
          {
            q: '可以用手机拍的照片吗？',
            a: '可以，只要正面、光线充足、头部完整。纯色背景最容易替换。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后为导出加上纯白或米白背景。',
          },
          {
            q: '排版可以直接拿去冲印吗？',
            a: '排版是 4×6 英寸、300 dpi，排六张。打印前请核对官方要求。',
          },
        ],
      },
    },
  },
  {
    slug: 'uk-passport-photo',
    specId: 'uk',
    copy: {
      en: {
        title: 'UK Passport Photo Maker, 35×45 mm | BgGone',
        description:
          'Make a UK passport photo in your browser. Crop to 35×45 mm, replace the background, and download a print sheet without uploading.',
        h1: 'UK Passport Photo Maker',
        lead: 'Crop a portrait to the UK 35×45 mm size and export a print sheet locally.',
        intro:
          'UK passport photos are 35 × 45 mm. This page finds the face, removes the background, and lets you adjust the head size before exporting a 413 × 531 px photo and a 4 × 6 print sheet.',
        bullets: [
          '35 × 45 mm at 300 dpi, 413 × 531 px',
          'Plain light grey, cream, or white background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a UK passport photo?',
            a: 'The printed photo is 35 × 45 mm. At 300 dpi that is 413 × 531 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain light grey, cream, or white background with no pattern.',
          },
          {
            q: 'How large should the head be?',
            a: 'UK guidance puts the head between 29 mm and 34 mm from chin to crown. Use the head size slider to match that range.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '英国护照照片制作，35×45 毫米 | BgGone',
        description:
          '在浏览器里制作英国护照照片：裁成 35×45 毫米、替换背景，并下载排版，无需上传。',
        h1: '英国护照照片制作',
        lead: '把正面照裁成英国 35×45 毫米规格，并在本机导出排版。',
        intro:
          '英国护照照片是 35×45 毫米。这个页面会识别人脸、去除背景，并允许调整头部大小，最后导出 413×531 像素照片和 4×6 排版。',
        bullets: [
          '35×45 毫米，300 dpi，413×531 像素',
          '纯色浅灰、米色或白色背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '英国护照照片尺寸是多少？',
            a: '打印尺寸是 35×45 毫米，300 dpi 下是 413×531 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯色浅灰、米色或白色背景，不要有图案。',
          },
          {
            q: '头部需要多大？',
            a: '英国要求从下巴到头顶约 29–34 毫米。可以用头部大小滑块调整。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
  {
    slug: 'india-passport-photo',
    specId: 'india',
    copy: {
      en: {
        title: 'India Passport Photo Maker, 35×45 mm | BgGone',
        description:
          'Make an Indian passport photo in your browser. Crop to 35×45 mm, use a white background, and download a print sheet without uploading.',
        h1: 'India Passport Photo Maker',
        lead: 'Crop a portrait to the Indian 35×45 mm size and export a print sheet locally.',
        intro:
          'Indian passport photos commonly use 35 × 45 mm with a plain white background. This page finds the face, removes the background, and lets you adjust the head size before exporting.',
        bullets: [
          '35 × 45 mm at 300 dpi, 413 × 531 px',
          'Plain white background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is an Indian passport photo?',
            a: 'A common size is 35 × 45 mm. At 300 dpi that is 413 × 531 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain white background. Avoid patterns and shadows.',
          },
          {
            q: 'Can I use a phone photo?',
            a: 'Yes, if the face is straight, well lit, and the whole head is visible.',
          },
          {
            q: 'Is the print sheet ready for a photo lab?',
            a: 'The sheet is 4 × 6 inches at 300 dpi with six photos. Check the official requirements before printing.',
          },
        ],
      },
      zh: {
        title: '印度护照照片制作，35×45 毫米 | BgGone',
        description:
          '在浏览器里制作印度护照照片：裁成 35×45 毫米、使用白色背景，并下载排版，无需上传。',
        h1: '印度护照照片制作',
        lead: '把正面照裁成印度 35×45 毫米规格，并在本机导出排版。',
        intro:
          '印度护照照片常用 35×45 毫米、纯白背景。这个页面会识别人脸、去除背景，并允许调整头部大小后导出。',
        bullets: [
          '35×45 毫米，300 dpi，413×531 像素',
          '纯白背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '印度护照照片尺寸是多少？',
            a: '常用尺寸是 35×45 毫米，300 dpi 下是 413×531 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯白背景，避免图案和阴影。',
          },
          {
            q: '可以用手机拍的照片吗？',
            a: '可以，只要正面、光线充足、头部完整。',
          },
          {
            q: '排版可以直接拿去冲印吗？',
            a: '排版是 4×6 英寸、300 dpi，排六张。打印前请核对官方要求。',
          },
        ],
      },
    },
  },
  {
    slug: 'schengen-passport-photo',
    specId: 'schengen',
    copy: {
      en: {
        title: 'Schengen Visa Photo Maker, 35×45 mm | BgGone',
        description:
          'Make a Schengen visa photo in your browser. Crop to 35×45 mm, replace the background, and download a print sheet without uploading.',
        h1: 'Schengen Visa Photo Maker',
        lead: 'Crop a portrait to the Schengen 35×45 mm size and export a print sheet locally.',
        intro:
          'Schengen visa photos are 35 × 45 mm with a plain light background. This page finds the face, removes the background, and lets you adjust the head size before exporting.',
        bullets: [
          '35 × 45 mm at 300 dpi, 413 × 531 px',
          'Plain light background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a Schengen visa photo?',
            a: 'The printed photo is 35 × 45 mm. At 300 dpi that is 413 × 531 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain light background, usually light grey or white, with no pattern.',
          },
          {
            q: 'How large should the head be?',
            a: 'Schengen guidance commonly puts the head around 32–36 mm from chin to crown. Use the head size slider to match it.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '申根签证照片制作，35×45 毫米 | BgGone',
        description:
          '在浏览器里制作申根签证照片：裁成 35×45 毫米、替换背景，并下载排版，无需上传。',
        h1: '申根签证照片制作',
        lead: '把正面照裁成申根 35×45 毫米规格，并在本机导出排版。',
        intro:
          '申根签证照片是 35×45 毫米，使用纯色浅色背景。这个页面会识别人脸、去除背景，并允许调整头部大小后导出。',
        bullets: [
          '35×45 毫米，300 dpi，413×531 像素',
          '纯色浅色背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '申根签证照片尺寸是多少？',
            a: '打印尺寸是 35×45 毫米，300 dpi 下是 413×531 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯色浅色背景，通常是浅灰或白色，不要有图案。',
          },
          {
            q: '头部需要多大？',
            a: '申根常见要求从下巴到头顶约 32–36 毫米，可以用头部大小滑块调整。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
  {
    slug: 'canada-passport-photo',
    specId: 'canada',
    copy: {
      en: {
        title: 'Canada Passport Photo Maker, 50×70 mm | BgGone',
        description:
          'Make a Canadian passport photo in your browser. Crop to 50×70 mm, replace the background, and download a 4×6 print sheet without uploading.',
        h1: 'Canada Passport Photo Maker',
        lead: 'Crop a portrait to the Canadian 50×70 mm size and export a print sheet locally.',
        intro:
          'Canadian passport photos are 50 × 70 mm. This page finds the face, removes the background, and lets you adjust the head size before exporting a 591 × 827 px photo and a 4 × 6 print sheet.',
        bullets: [
          '50 × 70 mm at 300 dpi, 591 × 827 px',
          'Plain white or light grey background',
          'Four photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a Canadian passport photo?',
            a: 'The printed photo is 50 × 70 mm. At 300 dpi that is 591 × 827 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain white or light grey background with no pattern.',
          },
          {
            q: 'How large should the head be?',
            a: 'Canadian guidance commonly puts the head between 31 mm and 36 mm from chin to crown. Use the head size slider to match it.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '加拿大护照照片制作，50×70 毫米 | BgGone',
        description:
          '在浏览器里制作加拿大护照照片：裁成 50×70 毫米、替换背景，并下载 4×6 排版，无需上传。',
        h1: '加拿大护照照片制作',
        lead: '把正面照裁成加拿大 50×70 毫米规格，并在本机导出排版。',
        intro:
          '加拿大护照照片是 50×70 毫米。这个页面会识别人脸、去除背景，并允许调整头部大小，最后导出 591×827 像素照片和 4×6 排版。',
        bullets: [
          '50×70 毫米，300 dpi，591×827 像素',
          '纯白或浅灰背景',
          '一张 4×6 相纸排四张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '加拿大护照照片尺寸是多少？',
            a: '打印尺寸是 50×70 毫米，300 dpi 下是 591×827 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯白或浅灰背景，不要有图案。',
          },
          {
            q: '头部需要多大？',
            a: '加拿大常见要求从下巴到头顶约 31–36 毫米，可以用头部大小滑块调整。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
  {
    slug: 'australia-passport-photo',
    specId: 'australia',
    copy: {
      en: {
        title: 'Australia Passport Photo Maker, 35×45 mm | BgGone',
        description:
          'Make an Australian passport photo in your browser. Crop to 35×45 mm, replace the background, and download a print sheet without uploading.',
        h1: 'Australia Passport Photo Maker',
        lead: 'Crop a portrait to the Australian 35×45 mm size and export a print sheet locally.',
        intro:
          'Australian passport photos are 35 × 45 mm. This page finds the face, removes the background, and lets you adjust the head size before exporting a 413 × 531 px photo and a 4 × 6 print sheet.',
        bullets: [
          '35 × 45 mm at 300 dpi, 413 × 531 px',
          'Plain white or light grey background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is an Australian passport photo?',
            a: 'The printed photo is 35 × 45 mm. At 300 dpi that is 413 × 531 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain white or light grey background with no pattern.',
          },
          {
            q: 'How large should the head be?',
            a: 'Australian guidance commonly puts the head around 32–36 mm from chin to crown. Use the head size slider to match it.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '澳大利亚护照照片制作，35×45 毫米 | BgGone',
        description:
          '在浏览器里制作澳大利亚护照照片：裁成 35×45 毫米、替换背景，并下载排版，无需上传。',
        h1: '澳大利亚护照照片制作',
        lead: '把正面照裁成澳大利亚 35×45 毫米规格，并在本机导出排版。',
        intro:
          '澳大利亚护照照片是 35×45 毫米。这个页面会识别人脸、去除背景，并允许调整头部大小，最后导出 413×531 像素照片和 4×6 排版。',
        bullets: [
          '35×45 毫米，300 dpi，413×531 像素',
          '纯白或浅灰背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '澳大利亚护照照片尺寸是多少？',
            a: '打印尺寸是 35×45 毫米，300 dpi 下是 413×531 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯白或浅灰背景，不要有图案。',
          },
          {
            q: '头部需要多大？',
            a: '澳大利亚常见要求从下巴到头顶约 32–36 毫米，可以用头部大小滑块调整。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
  {
    slug: 'japan-passport-photo',
    specId: 'japan',
    copy: {
      en: {
        title: 'Japan Passport Photo Maker, 35×45 mm | BgGone',
        description:
          'Make a Japanese passport photo in your browser. Crop to 35×45 mm, replace the background, and download a print sheet without uploading.',
        h1: 'Japan Passport Photo Maker',
        lead: 'Crop a portrait to the Japanese 35×45 mm size and export a print sheet locally.',
        intro:
          'Japanese passport photos are 35 × 45 mm. This page finds the face, removes the background, and lets you adjust the head size before exporting a 413 × 531 px photo and a 4 × 6 print sheet.',
        bullets: [
          '35 × 45 mm at 300 dpi, 413 × 531 px',
          'Plain white or light background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a Japanese passport photo?',
            a: 'The printed photo is 35 × 45 mm. At 300 dpi that is 413 × 531 pixels.',
          },
          {
            q: 'What background should I use?',
            a: 'Use a plain white or light background with no pattern.',
          },
          {
            q: 'How large should the head be?',
            a: 'Japanese guidance commonly puts the head around 32–36 mm from chin to crown. Use the head size slider to match it.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '日本护照照片制作，35×45 毫米 | BgGone',
        description:
          '在浏览器里制作日本护照照片：裁成 35×45 毫米、替换背景，并下载排版，无需上传。',
        h1: '日本护照照片制作',
        lead: '把正面照裁成日本 35×45 毫米规格，并在本机导出排版。',
        intro:
          '日本护照照片是 35×45 毫米。这个页面会识别人脸、去除背景，并允许调整头部大小，最后导出 413×531 像素照片和 4×6 排版。',
        bullets: [
          '35×45 毫米，300 dpi，413×531 像素',
          '纯白或浅色背景',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '日本护照照片尺寸是多少？',
            a: '打印尺寸是 35×45 毫米，300 dpi 下是 413×531 像素。',
          },
          {
            q: '背景应该用什么颜色？',
            a: '使用纯白或浅色背景，不要有图案。',
          },
          {
            q: '头部需要多大？',
            a: '日本常见要求从下巴到头顶约 32–36 毫米，可以用头部大小滑块调整。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
  {
    slug: 'china-passport-photo',
    specId: 'china',
    copy: {
      en: {
        title: 'China ID Photo Maker, 35×49 mm | BgGone',
        description:
          'Make a Chinese ID photo in your browser. Crop to 35×49 mm, choose a red, blue, or white background, and download a print sheet without uploading.',
        h1: 'China ID Photo Maker',
        lead: 'Crop a portrait to the Chinese 35×49 mm ID photo size with a red, blue, or white background, locally.',
        intro:
          'Chinese ID and visa photos commonly use 35 × 49 mm with a red, blue, or white background. This page finds the face, removes the background, and lets you adjust the head size before exporting.',
        bullets: [
          '35 × 49 mm at 300 dpi, 413 × 579 px',
          'Red, blue, or white background',
          'Six photos on one 4 × 6 sheet',
          'No upload and no account',
        ],
        faq: [
          {
            q: 'What size is a Chinese ID photo?',
            a: 'A common size is 35 × 49 mm. At 300 dpi that is 413 × 579 pixels.',
          },
          {
            q: 'Which background colours are available?',
            a: 'Red, blue, and white are available. Choose the one required by your document.',
          },
          {
            q: 'How large should the head be?',
            a: 'Chinese ID photos usually keep the head large in the frame. Use the head size slider and the official document requirements to fine-tune it.',
          },
          {
            q: 'Does this remove the background?',
            a: 'Yes. The background is removed locally, then the colour you choose is added for the export.',
          },
        ],
      },
      zh: {
        title: '中国证件照制作，35×49 毫米 | BgGone',
        description:
          '在浏览器里制作中国证件照：裁成 35×49 毫米，可选红、蓝、白背景，并下载排版，无需上传。',
        h1: '中国证件照制作',
        lead: '把正面照裁成中国 35×49 毫米证件照规格，可选红、蓝、白背景，并在本机导出。',
        intro:
          '中国证件照常用 35×49 毫米，并提供红、蓝、白背景。这个页面会识别人脸、去除背景，并允许调整头部大小后导出。',
        bullets: [
          '35×49 毫米，300 dpi，413×579 像素',
          '红、蓝、白背景可选',
          '一张 4×6 相纸排六张',
          '无需上传、无需账号',
        ],
        faq: [
          {
            q: '中国证件照尺寸是多少？',
            a: '常用尺寸是 35×49 毫米，300 dpi 下是 413×579 像素。',
          },
          {
            q: '有哪些背景颜色？',
            a: '提供红、蓝、白三种背景，按证件要求选择即可。',
          },
          {
            q: '头部需要多大？',
            a: '中国证件照通常头部占画面比例较大，可以用头部大小滑块结合证件要求微调。',
          },
          {
            q: '会自动去背景吗？',
            a: '会。背景在本机去除，然后加上你选择的背景色。',
          },
        ],
      },
    },
  },
];

export const passportToolCopy = {
  en: {
    title: 'Passport Photo Maker, Local and No Upload | BgGone',
    description:
      'Make passport and visa photos in your browser. Pick a country size, remove the background, adjust the crop, and download a print sheet.',
    h1: 'Passport photo maker',
    lead: 'Pick a country size, remove the background, and export a passport photo and a 4×6 print sheet. Everything stays on this device.',
    intro:
      'Passport photo sizes differ by country. This tool finds the face, removes the background, and lets you fine-tune the head size before exporting a photo and a print sheet.',
    bullets: [
      'US, UK, India, Schengen, Canada, Australia, Japan, and China presets',
      'Background removal in the browser',
      'Adjustable head size and position',
      '4×6 print sheet with six photos',
    ],
    faq: [
      {
        q: 'Are the photos uploaded?',
        a: 'No. Face detection, background removal, cropping, and export all run in this browser.',
      },
      {
        q: 'Which countries are supported?',
        a: 'The presets cover the United States, United Kingdom, India, Schengen visa, Canada, Australia, Japan, and China. You can adjust the crop manually for other sizes.',
      },
      {
        q: 'Can I print the sheet at a photo lab?',
        a: 'The sheet is 4 × 6 inches at 300 dpi. Check the official requirements for your document before printing.',
      },
      {
        q: 'What photo should I use?',
        a: 'Use a straight, well-lit portrait with the whole head visible and no heavy shadows.',
      },
    ],
  },
  zh: {
    title: '证件照制作，本地处理、无需上传 | BgGone',
    description:
      '在浏览器里制作护照和签证照片：选择国家尺寸、去除背景、调整裁切，并下载排版。',
    h1: '证件照制作',
    lead: '选择国家尺寸、去除背景，导出证件照和 4×6 排版。全部在这台设备上完成。',
    intro:
      '不同国家的证件照尺寸不同。这个工具会识别人脸、去除背景，并允许在导出前微调头部大小。',
    bullets: [
      '美国、英国、印度、申根、加拿大、澳大利亚、日本、中国预设',
      '在浏览器里去除背景',
      '可调整头部大小和位置',
      '4×6 相纸排六张',
    ],
    faq: [
      {
        q: '照片会被上传吗？',
        a: '不会。人脸识别、去背景、裁切和导出都在浏览器里完成。',
      },
      {
        q: '支持哪些国家？',
        a: '预设包含美国、英国、印度、申根签证、加拿大、澳大利亚、日本和中国。其他尺寸可以手动调整裁切。',
      },
      {
        q: '排版可以直接拿去冲印吗？',
        a: '排版是 4×6 英寸、300 dpi。打印前请核对你的证件官方要求。',
      },
      {
        q: '应该用什么样的照片？',
        a: '使用正面、光线充足、头部完整、没有明显阴影的照片。',
      },
    ],
  },
};

export function findPassportPage(slug: string) {
  return passportPages.find((page) => page.slug === slug);
}

export function passportPageMetadata(
  lang: Lang,
  copy: PassportPageCopy
): Metadata {
  const canonical = new URL(localizedPath(lang, '/passport-photo'), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', '/passport-photo'), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', '/passport-photo'), SITE_URL).href;
  const ogImage = '/bggone-passport.jpg';

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

export function passportPageMetadataFor(
  lang: Lang,
  page: PassportPage
): Metadata {
  const copy = page.copy[lang];
  const path = `/${page.slug}`;
  const canonical = new URL(localizedPath(lang, path), SITE_URL).href;
  const enUrl = new URL(localizedPath('en', path), SITE_URL).href;
  const zhUrl = new URL(localizedPath('zh', path), SITE_URL).href;
  const metadata = passportPageMetadata(lang, copy);
  return {
    ...metadata,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        zh: zhUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      ...metadata.openGraph,
      url: canonical,
    },
  };
}

export function passportPageJsonLd(
  lang: Lang,
  copy: PassportPageCopy,
  path = '/passport-photo'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.h1,
    url: new URL(localizedPath(lang, path), SITE_URL).href,
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

export function passportPageFaqJsonLd(copy: PassportPageCopy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

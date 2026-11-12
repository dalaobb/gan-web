export type Lang = 'en' | 'zh';

export const LANG_STORAGE_KEY = 'bgg-lang';

export const SITE_URL = 'https://bgg.one';

export const translations = {
  en: {
    click: 'Click',
    dragDrop: 'Drag & Drop',
    pasteImage: 'Paste Image (Ctrl+V/Cmd+V)',
    dropTitle: 'Drop images',
    dropHint: 'Click to choose, or paste with Ctrl+V',
    dropRelease: 'Release to start',
    startRemoving: 'Start Removing Backgrounds',
    tryExamples: 'No image? Try one of these:',
    noticeLightModel: "Notice: You're using a lightweight model.",
    selected: 'Selected:',
    outputFormat: 'Output format:',
    background: 'Background',
    bgTransparent: 'Transparent',
    bgWhite: 'White',
    bgPaper: 'Paper',
    bgBlack: 'Black',
    bgCustom: 'Custom color',
    bgImage: 'Image',
    bgReplace: 'Replace image',
    bgFailed: 'Could not apply that background.',
    loading: 'Loading...',
    removing: 'Removing...',
    start: 'Start',
    clear: 'Clear',
    oomWarning:
      'Your device may struggle with this task. A desktop usually handles it better.',
    trySmallerModel: 'Try a smaller model?',
    done: 'Done in {time}',
    download: 'Download',
    downloadAllZip: 'Download All as ZIP',
    failedPackage: 'Failed to package images.',
    after: 'After:',
    preview: 'Preview',
    copied: 'Copied',
    copy: 'Copy',
    copyFailed: 'Could not copy this image.',
    save: 'Save',
    processing: 'Processing...',
    backToTop: 'Remove Backgrounds Now',
    logoAlt: 'BgGone - Free AI Background Remover',
    stylesNav: 'Styles',
    stylesTitle: 'Image styles',
    stylesLead: 'Pick a look, upload a photo, and spend 2 credits.',
    styleBack: 'All styles',
    styleExamples: 'Examples',
    styleUpload: 'Upload a photo',
    styleReplace: 'Replace photo',
    styleGenerate: 'Generate',
    styleCredits: '{cost} credits',
    styleSignIn: 'Sign in to generate',
    styleNeedImage: 'Choose a photo first.',
    styleFailed: 'Generation failed.',
    styleResult: 'Result',
    styleWorking: 'Working...',
    coversNav: 'Covers',
    coversTitle: 'Covers',
    coversLead: 'Type a title and export the exact size for a blog, YouTube, or an X header. The type is drawn here, and the file stays on this device.',
    coverBlog: 'Blog',
    coverYoutube: 'YouTube',
    coverX: 'X header',
    coverTemplateTitle: 'Big title',
    coverTemplateSplit: 'Text and photo',
    coverTemplateBleed: 'Photo bar',
    coverTemplateBanner: 'Wide bar',
    coverTitleLabel: 'Title',
    coverTitlePlaceholder: 'Three things I learned this week',
    coverSubtitleLabel: 'Subtitle',
    coverSubtitlePlaceholder: 'Optional',
    coverPhoto: 'Photo',
    coverPhotoReplace: 'Replace photo',
    coverPhotoClear: 'Remove photo',
    coverDownload: 'Download this size',
    coverDownloadAll: 'Download all three',
    coverNeedTitle: 'Write a title first.',
    coverFailed: 'Could not export that cover.',
    compressNav: 'Compress',
    compressTitle: 'Compress images',
    compressLead:
      'Batch-compress JPEG, PNG, WebP, HEIC, and more, down to a size you choose. The files stay on this device.',
    compressKeep: 'Original format',
    compressJpeg: 'JPEG',
    compressWebp: 'WebP',
    compressPng: 'PNG',
    compressSmaller: 'Smaller',
    compressBalanced: 'Balanced',
    compressHigh: 'High',
    compressEdgeOriginal: 'Original size',
    compressEdge: 'Long edge {edge}',
    compressPngNote: 'PNG stays lossless. Quality and the size cap apply to JPEG and WebP.',
    compressCapNone: 'No limit',
    compressCapKb: '{size} KB',
    compressCapMb: '{size} MB',
    compressOver: 'Still above {size}',
    compressCapCustom: 'Custom',
    compressProgress: '{current} / {total}',
    compressStart: 'Compress',
    compressSaved: '{before} → {after} · {pct}%',
    compressGrew: '{before} → {after} · {pct}% larger',
    compressGifFrame: 'First frame only',
    compressSkipped: 'Left out {count}. This page takes JPEG, PNG, WebP, HEIC, GIF, BMP, and AVIF.',
    compressFailed: 'This image could not be compressed.',
    compressStage: 'Large compare',
    compressFit: 'Fit',
    compressActual: '100%',
    compressPrev: 'Previous',
    compressNext: 'Next',
    compressOriginal: 'Original',
    compressOutput: 'Compressed',
    compressStageHint: 'Drag the line. Scroll to zoom, double-click to toggle 100%. Drag the picture when it is larger than the frame.',
    compressClose: 'Close',
  },
  zh: {
    click: '点击上传',
    dragDrop: '拖拽上传',
    pasteImage: '粘贴图片 (Ctrl+V)',
    dropTitle: '把图片拖进来',
    dropHint: '点击选择，或 Ctrl+V 粘贴',
    dropRelease: '松开即可开始',
    startRemoving: '开始去除背景',
    tryExamples: '没有图片？试试这些示例：',
    noticeLightModel: '提示：你正在使用轻量级模型。',
    selected: '已选择：',
    outputFormat: '输出格式：',
    background: '背景',
    bgTransparent: '透明',
    bgWhite: '白色',
    bgPaper: '纸色',
    bgBlack: '黑色',
    bgCustom: '自定义颜色',
    bgImage: '图片',
    bgReplace: '更换图片',
    bgFailed: '这个背景没有加上。',
    loading: '加载中...',
    removing: '处理中...',
    start: '开始',
    clear: '清空',
    oomWarning:
      '这台设备可能吃力。用电脑处理通常更稳。',
    trySmallerModel: '尝试更小的模型？',
    done: '完成，用时 {time}',
    download: '下载',
    downloadAllZip: '打包下载 (ZIP)',
    failedPackage: '图片打包失败。',
    after: '处理后：',
    preview: '预览',
    copied: '已复制',
    copy: '复制',
    copyFailed: '这张图片没有复制上。',
    save: '保存',
    processing: '处理中...',
    backToTop: '立即去除背景',
    logoAlt: 'BgGone - 免费 AI 抠图工具',
    stylesNav: '风格',
    stylesTitle: '图片风格',
    stylesLead: '选一种风格，上传一张照片，消耗 2 积分。',
    styleBack: '全部风格',
    styleExamples: '示例',
    styleUpload: '上传照片',
    styleReplace: '更换照片',
    styleGenerate: '生成',
    styleCredits: '{cost} 积分',
    styleSignIn: '登录后生成',
    styleNeedImage: '先选一张照片。',
    styleFailed: '生成失败。',
    styleResult: '结果',
    styleWorking: '生成中...',
    coversNav: '封面',
    coversTitle: '封面',
    coversLead: '写一行标题，导出博客、YouTube 和 X 背景的准确尺寸。字在这台设备上画好，文件不上传。',
    coverBlog: '博客',
    coverYoutube: 'YouTube',
    coverX: 'X 背景',
    coverTemplateTitle: '大标题',
    coverTemplateSplit: '左字右图',
    coverTemplateBleed: '满幅加字条',
    coverTemplateBanner: '横条',
    coverTitleLabel: '标题',
    coverTitlePlaceholder: '这一周学会的三件事',
    coverSubtitleLabel: '副标题',
    coverSubtitlePlaceholder: '可选',
    coverPhoto: '照片',
    coverPhotoReplace: '更换照片',
    coverPhotoClear: '去掉照片',
    coverDownload: '下载这张',
    coverDownloadAll: '下载三种尺寸',
    coverNeedTitle: '先写标题。',
    coverFailed: '这张封面没有导出。',
    compressNav: '压缩',
    compressTitle: '压缩图片',
    compressLead:
      '批量压缩 JPEG、PNG、WebP、HEIC 等图片，也可以压到指定体积。文件留在这台设备上。',
    compressKeep: '原格式',
    compressJpeg: 'JPEG',
    compressWebp: 'WebP',
    compressPng: 'PNG',
    compressSmaller: '更小',
    compressBalanced: '均衡',
    compressHigh: '较高',
    compressEdgeOriginal: '原尺寸',
    compressEdge: '长边 {edge}',
    compressPngNote: 'PNG 只做无损优化。质量和体积上限作用于 JPEG 和 WebP。',
    compressCapNone: '不限体积',
    compressCapKb: '{size} KB',
    compressCapMb: '{size} MB',
    compressOver: '还是大于 {size}',
    compressCapCustom: '自定义',
    compressProgress: '第 {current} / {total} 张',
    compressStart: '开始压缩',
    compressSaved: '{before} → {after} · {pct}%',
    compressGrew: '{before} → {after} · 大了 {pct}%',
    compressGifFrame: '只留第一帧',
    compressSkipped: '留在外面 {count} 个。这里收 JPEG、PNG、WebP、HEIC、GIF、BMP、AVIF。',
    compressFailed: '这张图片没有压成。',
    compressStage: '大图对比',
    compressFit: '适应屏幕',
    compressActual: '100%',
    compressPrev: '上一张',
    compressNext: '下一张',
    compressOriginal: '原图',
    compressOutput: '压缩后',
    compressStageHint: '拖动分割线。滚轮缩放，双击切换 100%。图片大于画面时，拖动可平移。',
    compressClose: '关闭',
  },
} as const;

export type TKey = keyof typeof translations['en'];

export function t(
  lang: Lang,
  key: TKey,
  vars?: Record<string, string>
): string {
  let s: string = translations[lang][key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, v);
    }
  }
  return s;
}

export const exampleAlts: Record<Lang, string[]> = {
  en: [
    'Car photo with background removed | AI background remover',
    'Pet cutout with transparent background | BgGone',
    'Eagle with background removed | AI background remover',
    'Person cutout with transparent background | BgGone',
    'Motorcycle with background removed | AI background remover',
  ],
  zh: [
    '去除背景后的汽车照片 | AI 抠图工具',
    '透明背景的宠物抠图 | AI 去背景',
    '去除背景后的鹰 | AI 抠图工具',
    '透明背景的人物抠图 | AI 去背景',
    '去除背景后的摩托车 | AI 抠图工具',
  ],
};

export const descriptions: Record<Lang, string> = {
  en: 'BgGone (bgg.one): a free, private AI background remover that runs entirely in your browser. No login, no uploads — remove image backgrounds instantly.',
  zh: 'BgGone（bgg.one）：免费、私密的 AI 抠图工具，完全在浏览器中运行。无需登录、无需上传，一键去除图片背景。',
};

export type PageKey = 'home' | 'about' | 'privacy';

export const pageCopy: Record<
  Lang,
  Record<PageKey, { pageTitle: string; secondTitle: string; title: string }>
> = {
  en: {
    home: {
      pageTitle: 'BgGone – AI Background Remover',
      secondTitle: 'Free · Batch · No Login · No Upload · No Quality Loss',
      title: 'BgGone – Free AI Background Remover, No Login or Upload',
    },
    about: {
      pageTitle: 'About AI Background Remover',
      secondTitle: 'Free, Batch, No Login, No Quality Loss',
      title: 'About BgGone | Free AI Background Remover',
    },
    privacy: {
      pageTitle: 'Privacy Policy',
      secondTitle: 'Your images belong to you',
      title: 'Privacy Policy | BgGone - AI Background Remover',
    },
  },
  zh: {
    home: {
      pageTitle: 'BgGone – AI 抠图工具',
      secondTitle: '免费 · 批量 · 无需登录 · 无需上传 · 画质无损',
      title: 'BgGone – 免费 AI 抠图工具，无需登录、无需上传',
    },
    about: {
      pageTitle: '关于 AI 智能抠图',
      secondTitle: '免费、批量、无需登录、画质无损',
      title: '关于 BgGone | 免费 AI 抠图工具',
    },
    privacy: {
      pageTitle: '隐私政策',
      secondTitle: '您的图片属于您自己',
      title: '隐私政策 | BgGone - AI 抠图工具',
    },
  },
};

export function isZhPath(pathname: string) {
  return pathname === '/zh' || pathname.startsWith('/zh/');
}

export function localeFromPath(pathname: string): Lang {
  return isZhPath(pathname) ? 'zh' : 'en';
}

/** Path without a locale prefix, always starting with `/`. */
export function unprefixedPath(pathname: string) {
  if (!isZhPath(pathname)) return pathname || '/';
  const stripped = pathname.replace(/^\/zh/, '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function localizedPath(lang: Lang, pathname: string) {
  const bare = unprefixedPath(pathname);
  const withSlash =
    bare === '/' ? '/' : bare.endsWith('/') ? bare : `${bare}/`;
  if (lang === 'en') return withSlash;
  return withSlash === '/' ? '/zh/' : `/zh${withSlash}`;
}

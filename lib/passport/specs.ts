import type { Lang } from '@/lib/i18n';

export type PassportSpecId =
  | 'us'
  | 'uk'
  | 'india'
  | 'schengen'
  | 'canada'
  | 'australia'
  | 'japan'
  | 'china';

export type PassportBackground = {
  color: string;
  label: Record<Lang, string>;
};

export type PassportSpec = {
  id: PassportSpecId;
  width: number;
  height: number;
  headTarget: number;
  eyeTarget: number;
  topMargin?: number;
  sheetCols?: number;
  sheetRows?: number;
  background: string;
  backgrounds: PassportBackground[];
  name: Record<Lang, string>;
  sizeLabel: Record<Lang, string>;
  note: Record<Lang, string>;
};

const WHITE = '#ffffff';
const OFF_WHITE = '#f7f4ee';
const LIGHT_GREY = '#eeeeee';
const CREAM = '#f5f1e8';
const ID_BLUE = '#438edb';
const ID_RED = '#d9001b';

export const passportSpecs: PassportSpec[] = [
  {
    id: 'us',
    width: 600,
    height: 600,
    headTarget: 356,
    eyeTarget: 225,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: OFF_WHITE, label: { en: 'Off-white', zh: '米白' } },
    ],
    name: { en: 'United States', zh: '美国' },
    sizeLabel: { en: '2 × 2 in · 600 × 600 px', zh: '2 × 2 英寸 · 600 × 600 像素' },
    note: {
      en: 'Use a plain white or off-white background. The head should fill most of the frame.',
      zh: '使用纯白或米白背景，头部应占画面的大部分。',
    },
  },
  {
    id: 'uk',
    width: 413,
    height: 531,
    headTarget: 372,
    eyeTarget: 160,
    background: LIGHT_GREY,
    backgrounds: [
      { color: LIGHT_GREY, label: { en: 'Light grey', zh: '浅灰' } },
      { color: CREAM, label: { en: 'Cream', zh: '米色' } },
      { color: WHITE, label: { en: 'White', zh: '白色' } },
    ],
    name: { en: 'United Kingdom', zh: '英国' },
    sizeLabel: { en: '35 × 45 mm · 413 × 531 px', zh: '35 × 45 毫米 · 413 × 531 像素' },
    note: {
      en: 'Use a plain light grey, cream, or white background with no pattern.',
      zh: '使用纯色浅灰、米色或白色背景，不要有图案。',
    },
  },
  {
    id: 'india',
    width: 413,
    height: 531,
    headTarget: 354,
    eyeTarget: 178,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: OFF_WHITE, label: { en: 'Off-white', zh: '米白' } },
    ],
    name: { en: 'India', zh: '印度' },
    sizeLabel: { en: '35 × 45 mm · 413 × 531 px', zh: '35 × 45 毫米 · 413 × 531 像素' },
    note: {
      en: 'Use a plain white background. Keep the full head and shoulders in the frame.',
      zh: '使用纯白背景，画面里保留完整的头部和肩膀。',
    },
  },
  {
    id: 'schengen',
    width: 413,
    height: 531,
    headTarget: 402,
    eyeTarget: 190,
    background: LIGHT_GREY,
    backgrounds: [
      { color: LIGHT_GREY, label: { en: 'Light grey', zh: '浅灰' } },
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: OFF_WHITE, label: { en: 'Off-white', zh: '米白' } },
    ],
    name: { en: 'Schengen visa', zh: '申根签证' },
    sizeLabel: { en: '35 × 45 mm · 413 × 531 px', zh: '35 × 45 毫米 · 413 × 531 像素' },
    note: {
      en: 'Use a plain light background. The face should be centred and fill the frame.',
      zh: '使用纯色浅色背景，脸部居中并占满画面。',
    },
  },
  {
    id: 'canada',
    width: 591,
    height: 827,
    headTarget: 396,
    eyeTarget: 240,
    sheetCols: 2,
    sheetRows: 2,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: LIGHT_GREY, label: { en: 'Light grey', zh: '浅灰' } },
    ],
    name: { en: 'Canada', zh: '加拿大' },
    sizeLabel: {
      en: '50 × 70 mm · 591 × 827 px',
      zh: '50 × 70 毫米 · 591 × 827 像素',
    },
    note: {
      en: 'Use a plain white or light grey background with the full head and shoulders visible.',
      zh: '使用纯白或浅灰背景，画面里保留完整的头部和肩膀。',
    },
  },
  {
    id: 'australia',
    width: 413,
    height: 531,
    headTarget: 402,
    eyeTarget: 190,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: LIGHT_GREY, label: { en: 'Light grey', zh: '浅灰' } },
    ],
    name: { en: 'Australia', zh: '澳大利亚' },
    sizeLabel: {
      en: '35 × 45 mm · 413 × 531 px',
      zh: '35 × 45 毫米 · 413 × 531 像素',
    },
    note: {
      en: 'Use a plain white or light grey background with a neutral expression.',
      zh: '使用纯白或浅灰背景，表情自然。',
    },
  },
  {
    id: 'japan',
    width: 413,
    height: 531,
    headTarget: 396,
    eyeTarget: 190,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: LIGHT_GREY, label: { en: 'Light grey', zh: '浅灰' } },
    ],
    name: { en: 'Japan', zh: '日本' },
    sizeLabel: {
      en: '35 × 45 mm · 413 × 531 px',
      zh: '35 × 45 毫米 · 413 × 531 像素',
    },
    note: {
      en: 'Use a plain white or light background with the face centred and shadows kept low.',
      zh: '使用纯白或浅色背景，脸部居中，尽量没有阴影。',
    },
  },
  {
    id: 'china',
    width: 413,
    height: 579,
    headTarget: 360,
    eyeTarget: 190,
    sheetCols: 2,
    sheetRows: 3,
    background: WHITE,
    backgrounds: [
      { color: WHITE, label: { en: 'White', zh: '白色' } },
      { color: ID_BLUE, label: { en: 'Blue', zh: '蓝色' } },
      { color: ID_RED, label: { en: 'Red', zh: '红色' } },
    ],
    name: { en: 'China', zh: '中国' },
    sizeLabel: {
      en: '35 × 49 mm · 413 × 579 px',
      zh: '35 × 49 毫米 · 413 × 579 像素',
    },
    note: {
      en: 'Red, blue, and white backgrounds are common for Chinese ID photos. Check the specific document requirements.',
      zh: '中国证件照常用红、蓝、白背景，具体以证件要求为准。',
    },
  },
];

export function findPassportSpec(id: string) {
  return passportSpecs.find((spec) => spec.id === id);
}

export function defaultPassportBackground(spec: PassportSpec) {
  return spec.backgrounds.find((background) => background.color === spec.background)
    ?.color ?? spec.background;
}

import type { PromptsKey } from '@/lib/db/prompt';

export type StyleMedia = {
  cover: string;
  examples: string[];
};

// 正式图放到 public/styles/<id>/ ，再把下面的扩展名改成 jpg 或 webp。
export function styleMedia(id: PromptsKey): StyleMedia {
  return {
    cover: `/styles/${id}/cover.svg`,
    examples: [1, 2, 3].map((index) => `/styles/${id}/${index}.svg`),
  };
}

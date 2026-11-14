import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import {
  decompressFrames,
  parseGIF,
  type ParsedFrame,
} from 'gifuct-js';
import { makeCanvas } from '@/lib/image/canvas';

type DecodedFrame = {
  image: ImageData;
  delay: number;
};

export type GifCompressResult = {
  blob: Blob;
  url: string;
  name: string;
  width: number;
  height: number;
  frames: number;
  scale: number;
  step: number;
  colors: number;
  alreadySmall: boolean;
};

type Candidate = {
  scale: number;
  step: number;
  colors: number;
};

const CANDIDATES: Candidate[] = [
  { scale: 1, step: 1, colors: 256 },
  { scale: 0.9, step: 1, colors: 256 },
  { scale: 0.8, step: 1, colors: 256 },
  { scale: 0.7, step: 1, colors: 128 },
  { scale: 0.6, step: 1, colors: 128 },
  { scale: 0.5, step: 1, colors: 64 },
  { scale: 0.4, step: 1, colors: 64 },
  { scale: 0.36, step: 1, colors: 32 },
  { scale: 0.32, step: 1, colors: 32 },
  { scale: 0.28, step: 1, colors: 16 },
  { scale: 0.24, step: 1, colors: 16 },
  { scale: 0.2, step: 1, colors: 8 },
  { scale: 0.18, step: 1, colors: 8 },
  { scale: 0.15, step: 1, colors: 8 },
  { scale: 0.12, step: 1, colors: 4 },
  { scale: 0.35, step: 2, colors: 32 },
  { scale: 0.3, step: 2, colors: 16 },
  { scale: 0.25, step: 2, colors: 16 },
  { scale: 0.2, step: 3, colors: 8 },
  { scale: 0.15, step: 4, colors: 8 },
];

function patchCanvas(frame: ParsedFrame) {
  const { canvas, ctx } = makeCanvas(frame.dims.width, frame.dims.height);
  const pixels = new Uint8ClampedArray(frame.patch);
  ctx.putImageData(
    new ImageData(pixels, frame.dims.width, frame.dims.height),
    0,
    0
  );
  return canvas;
}

function decodeFrames(
  frames: ParsedFrame[],
  width: number,
  height: number,
  hasTransparency: boolean,
  background: [number, number, number] | null
): DecodedFrame[] {
  const { canvas, ctx } = makeCanvas(width, height);
  const fill = background
    ? `rgb(${background[0]}, ${background[1]}, ${background[2]})`
    : '#ffffff';
  if (!hasTransparency) {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
  }
  let previous: ParsedFrame | null = null;
  let savedImage: ImageData | null = null;
  const decoded: DecodedFrame[] = [];

  for (const frame of frames) {
    if (previous) {
      if (previous.disposalType === 2) {
        if (hasTransparency) {
          ctx.clearRect(
            previous.dims.left,
            previous.dims.top,
            previous.dims.width,
            previous.dims.height
          );
        } else {
          ctx.fillStyle = fill;
          ctx.fillRect(
            previous.dims.left,
            previous.dims.top,
            previous.dims.width,
            previous.dims.height
          );
        }
      } else if (previous.disposalType === 3 && savedImage) {
        ctx.putImageData(savedImage, 0, 0);
      }
    }

    if (frame.disposalType === 3) {
      savedImage = ctx.getImageData(0, 0, width, height);
    }

    ctx.drawImage(patchCanvas(frame), frame.dims.left, frame.dims.top);
    decoded.push({
      image: ctx.getImageData(0, 0, width, height),
      delay: Math.max(10, frame.delay || 10),
    });
    previous = frame;
  }

  return decoded;
}

function sampleFrames(
  frames: DecodedFrame[],
  step: number
): DecodedFrame[] {
  if (step <= 1) return frames;
  const sampled: DecodedFrame[] = [];
  let delay = 0;
  for (let index = 0; index < frames.length; index += 1) {
    delay += frames[index].delay;
    if (index % step === 0) {
      sampled.push({ image: frames[index].image, delay });
      delay = 0;
    }
  }
  if (delay && sampled.length) sampled[sampled.length - 1].delay += delay;
  return sampled;
}

async function encode(
  frames: DecodedFrame[],
  width: number,
  height: number,
  candidate: Candidate,
  hasTransparency: boolean
) {
  const sampled = sampleFrames(frames, candidate.step);
  const targetWidth = Math.max(1, Math.round(width * candidate.scale));
  const targetHeight = Math.max(1, Math.round(height * candidate.scale));
  const source = makeCanvas(width, height);
  const target = makeCanvas(targetWidth, targetHeight);
  const gif = GIFEncoder();

  for (let index = 0; index < sampled.length; index += 1) {
    const frame = sampled[index];
    source.ctx.putImageData(frame.image, 0, 0);
    target.ctx.clearRect(0, 0, targetWidth, targetHeight);
    target.ctx.drawImage(source.canvas, 0, 0, targetWidth, targetHeight);
    const data = target.ctx.getImageData(0, 0, targetWidth, targetHeight).data;
    const palette = quantize(
      data,
      candidate.colors,
      hasTransparency ? { format: 'rgba4444', oneBitAlpha: true } : undefined
    );
    const transparentIndex = hasTransparency
      ? palette.findIndex((color) => (color[3] ?? 255) < 128)
      : -1;
    const indexed = applyPalette(
      data,
      palette,
      hasTransparency ? 'rgba4444' : 'rgb565'
    );
    gif.writeFrame(indexed, targetWidth, targetHeight, {
      palette,
      delay: frame.delay,
      repeat: index === 0 ? 0 : undefined,
      transparent: transparentIndex >= 0,
      transparentIndex: Math.max(0, transparentIndex),
    });
    if (index % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  gif.finish();
  return new Blob([gif.bytes().slice().buffer as ArrayBuffer], {
    type: 'image/gif',
  });
}

export async function compressGif(
  file: File,
  targetBytes: number,
  onAttempt?: (attempt: number, total: number) => void
): Promise<GifCompressResult> {
  const parsed = parseGIF(await file.arrayBuffer());
  const frames = decompressFrames(parsed, true);
  if (!frames.length) throw new Error('gif');
  const width = parsed.lsd.width;
  const height = parsed.lsd.height;
  const hasTransparency = frames.some((frame) => frame.transparentIndex >= 0);
  const background =
    parsed.lsd.gct.exists && parsed.gct[parsed.lsd.backgroundColorIndex]
      ? (parsed.gct[parsed.lsd.backgroundColorIndex] as [
          number,
          number,
          number,
        ])
      : null;
  const decoded = decodeFrames(
    frames,
    width,
    height,
    hasTransparency,
    background
  );
  const base = file.name.replace(/\.gif$/i, '') || 'image';

  if (file.size <= targetBytes) {
    const blob = file;
    return {
      blob,
      url: URL.createObjectURL(blob),
      name: `${base}_BgGone.gif`,
      width,
      height,
      frames: frames.length,
      scale: 1,
      step: 1,
      colors: 256,
      alreadySmall: true,
    };
  }

  let best: { blob: Blob; candidate: Candidate } | null = null;
  for (let index = 0; index < CANDIDATES.length; index += 1) {
    const candidate = CANDIDATES[index];
    onAttempt?.(index + 1, CANDIDATES.length);
    const blob = await encode(
      decoded,
      width,
      height,
      candidate,
      hasTransparency
    );
    if (!best || blob.size < best.blob.size) best = { blob, candidate };
    if (blob.size <= targetBytes) {
      best = { blob, candidate };
      break;
    }
  }

  if (!best) throw new Error('gif');
  return {
    blob: best.blob,
    url: URL.createObjectURL(best.blob),
    name: `${base}_BgGone.gif`,
    width: Math.max(1, Math.round(width * best.candidate.scale)),
    height: Math.max(1, Math.round(height * best.candidate.scale)),
    frames: sampleFrames(decoded, best.candidate.step).length,
    scale: best.candidate.scale,
    step: best.candidate.step,
    colors: best.candidate.colors,
    alreadySmall: false,
  };
}

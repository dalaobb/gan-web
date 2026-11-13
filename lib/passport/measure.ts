const MAX_SCAN = 1200;

export async function measureCutoutTop(cutout: Blob): Promise<number | null> {
  const bitmap = await createImageBitmap(cutout);
  try {
    const scale = Math.min(
      1,
      MAX_SCAN / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    const minCount = Math.max(2, Math.floor(width * 0.01));

    for (let y = 0; y < height; y += 1) {
      let count = 0;
      for (let x = 0; x < width; x += 1) {
        if (data[(y * width + x) * 4 + 3] > 32) count += 1;
        if (count >= minCount) return Math.round(y / scale);
      }
    }
    return null;
  } finally {
    bitmap.close();
  }
}

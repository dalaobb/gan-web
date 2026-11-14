import { orientation, parse } from 'exifr';

const PICK = [
  'Make',
  'Model',
  'LensModel',
  'Software',
  'Artist',
  'Copyright',
  'DateTimeOriginal',
  'CreateDate',
  'ModifyDate',
  'DateTimeDigitized',
  'latitude',
  'longitude',
  'GPSLatitude',
  'GPSLongitude',
  'GPSAltitude',
  'Orientation',
];

export type MetadataSummary = {
  fields: number;
  hasAny: boolean;
  camera?: string;
  date?: string;
  gps?: string;
  orientation?: number;
};

export async function readMetadata(file: Blob): Promise<MetadataSummary> {
  try {
    const data = await parse(file, { pick: PICK, translateKeys: true });
    const rotation = await orientation(file).catch(() => undefined);
    if (!data || typeof data !== 'object') {
      return { fields: 0, hasAny: false, orientation: rotation };
    }
    const camera = [data.Make, data.Model]
      .filter((value) => typeof value === 'string' && value)
      .join(' ');
    const date =
      data.DateTimeOriginal ?? data.CreateDate ?? data.ModifyDate ?? undefined;
    const gps =
      data.latitude != null && data.longitude != null
        ? `${data.latitude}, ${data.longitude}`
        : undefined;
    const fields = Object.keys(data).length;
    return {
      fields,
      hasAny: fields > 0,
      camera: camera || undefined,
      date: date ? String(date) : undefined,
      gps,
      orientation: rotation ?? data.Orientation,
    };
  } catch {
    return { fields: 0, hasAny: false };
  }
}

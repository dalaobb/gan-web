export type OutputFormat = 'keep' | 'jpeg' | 'webp' | 'png';
export type QualityId = 'smaller' | 'balanced' | 'high';

export type CompressJob = {
  id: number;
  bytes: ArrayBuffer;
  mime: string;
  name: string;
  format: OutputFormat;
  quality: QualityId;
  maxEdge: number;
  targetBytes: number;
  cacheId?: string;
  suffix?: string;
};

export type CompressSuccess = {
  id: number;
  ok: true;
  bytes: ArrayBuffer;
  mime: string;
  name: string;
  width: number;
  height: number;
};

export type CompressFailure = {
  id: number;
  ok: false;
  message: string;
};

export type CompressReply = CompressSuccess | CompressFailure;

export type PreviewJob = {
  type: 'preview';
  id: number;
  cacheId: string;
  bytes: ArrayBuffer;
};

export type DropJob = {
  type: 'drop';
  cacheId: string;
};

export type PreviewReply =
  | { type: 'preview'; id: number; ok: true; bytes: ArrayBuffer }
  | { type: 'preview'; id: number; ok: false; message: string };

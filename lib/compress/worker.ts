/// <reference lib="webworker" />

import { compressImage } from '@/lib/compress/engine';
import { heicPreview } from '@/lib/compress/heic';
import type { CompressJob, CompressReply, PreviewJob, PreviewReply } from '@/lib/compress/protocol';

const scope = self as DedicatedWorkerGlobalScope;

let tail: Promise<void> = Promise.resolve();

scope.onmessage = (event: MessageEvent<CompressJob | PreviewJob>) => {
  const data = event.data;
  tail = tail.then(() => handle(data), () => handle(data));
};

async function handle(data: CompressJob | PreviewJob) {
  if ('type' in data && data.type === 'preview') {
    try {
      const bytes = await heicPreview(data.bytes);
      const reply: PreviewReply = { type: 'preview', id: data.id, ok: true, bytes };
      scope.postMessage(reply, [bytes]);
    } catch (error) {
      const reply: PreviewReply = {
        type: 'preview',
        id: data.id,
        ok: false,
        message: error instanceof Error ? error.message : 'failed',
      };
      scope.postMessage(reply);
    }
    return;
  }

  const job = data as CompressJob;
  try {
    const result = await compressImage(job);
    const reply: CompressReply = { id: job.id, ok: true, ...result };
    scope.postMessage(reply, [result.bytes]);
  } catch (error) {
    const reply: CompressReply = {
      id: data.id,
      ok: false,
      message: error instanceof Error ? error.message : 'failed',
    };
    scope.postMessage(reply);
  }
}

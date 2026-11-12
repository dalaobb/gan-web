/// <reference lib="webworker" />

import { compressImage } from '@/lib/compress/engine';
import type { CompressJob, CompressReply } from '@/lib/compress/protocol';

const scope = self as DedicatedWorkerGlobalScope;

scope.onmessage = async (event: MessageEvent<CompressJob>) => {
  const job = event.data;
  try {
    const result = await compressImage(job);
    const reply: CompressReply = { id: job.id, ok: true, ...result };
    scope.postMessage(reply, [result.bytes]);
  } catch (error) {
    const reply: CompressReply = {
      id: job.id,
      ok: false,
      message: error instanceof Error ? error.message : 'failed',
    };
    scope.postMessage(reply);
  }
};

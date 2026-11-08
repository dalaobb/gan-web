import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import verifyWebhookSignature from '@/lib/utils/falVerify';
import { ok, fail } from '@/lib/services/apiRes';
import { uploadToCloudFlare } from '../upload/util';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { refundCredits } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. 读取原始 body（raw bytes）
    const bodyArrayBuffer = await req.arrayBuffer();
    const bodyBuffer = Buffer.from(bodyArrayBuffer);

    // ✅ 2. 从 headers 取出 Fal 的签名信息
    const requestId = req.headers.get('X-Fal-Webhook-Request-Id');
    const userId = req.headers.get('X-Fal-Webhook-User-Id');
    const timestamp = req.headers.get('X-Fal-Webhook-Timestamp');
    const signatureHex = req.headers.get('X-Fal-Webhook-Signature');

    // ✅ 3. 验证签名
    const isValid = await verifyWebhookSignature(
      requestId,
      userId,
      timestamp,
      signatureHex,
      bodyBuffer
    );

    if (!isValid) {
      console.error('Fal webhook signature invalid!');
      return fail(500);
    }

    // ✅ 4. 验证通过后再安全解析 JSON
    const rst = JSON.parse(bodyBuffer.toString('utf-8'));

    console.log('✅ Valid Fal webhook payload:', rst);
    const falRequestId = requestId || rst.request_id;
    const [job] = falRequestId
      ? await db
          .select()
          .from(generations)
          .where(eq(generations.falRequestId, falRequestId))
      : [];

    if (job && (job.status === 'completed' || job.status === 'failed')) {
      return ok();
    }

    if (rst.status === 'OK' && rst.payload !== null) {
      const resultUrl = await uploadToCloudFlare(rst.payload.images[0], 'ai3');
      if (job) {
        await db
          .update(generations)
          .set({
            status: 'completed',
            resultUrl,
            completedAt: new Date(),
          })
          .where(eq(generations.id, job.id));
      }
      return ok();
    }

    if (job) {
      await refundCredits({ userId: job.userId, idempotencyKey: job.id });
      await db
        .update(generations)
        .set({
          status: 'failed',
          errorMessage:
            typeof rst.error === 'string' ? rst.error : 'generation failed',
          completedAt: new Date(),
        })
        .where(eq(generations.id, job.id));
    }

    return ok();
  } catch (e) {
    console.error('Webhook handler error:', e);
    return fail(500);
  }
}

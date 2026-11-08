import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { creditLedger, users, type CreditReason } from '@/lib/db/schema';
import { IMAGE_CREDITS, SIGNUP_CREDITS } from '@/lib/credit-costs';

export { IMAGE_CREDITS, SIGNUP_CREDITS, VIDEO_CREDITS } from '@/lib/credit-costs';

export class InsufficientCreditsError extends Error {
  balance: number;

  constructor(balance: number) {
    super('insufficient credits');
    this.name = 'InsufficientCreditsError';
    this.balance = balance;
  }
}

async function applyCreditChange(input: {
  userId: string;
  amount: number;
  reason: CreditReason;
  idempotencyKey: string;
  generationId?: string;
  paymentId?: string;
}) {
  return db.transaction(async (tx) => {
    const [user] = await tx
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, input.userId))
      .for('update');

    if (!user) throw new Error('user not found');

    const [existing] = await tx
      .select({ id: creditLedger.id })
      .from(creditLedger)
      .where(eq(creditLedger.idempotencyKey, input.idempotencyKey));

    if (existing) return { balance: user.credits, duplicate: true };

    if (user.credits + input.amount < 0) {
      throw new InsufficientCreditsError(user.credits);
    }

    await tx.insert(creditLedger).values({
      userId: input.userId,
      amount: input.amount,
      reason: input.reason,
      idempotencyKey: input.idempotencyKey,
      generationId: input.generationId,
      paymentId: input.paymentId,
    });

    const [updated] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, input.userId),
          sql`${users.credits} + ${input.amount} >= 0`
        )
      )
      .returning({ credits: users.credits });

    if (!updated) throw new InsufficientCreditsError(user.credits);
    return { balance: updated.credits, duplicate: false };
  });
}

export async function grantCredits(input: {
  userId: string;
  amount: number;
  reason: Extract<CreditReason, 'signup_bonus' | 'purchase' | 'adjustment'>;
  idempotencyKey: string;
  paymentId?: string;
}) {
  if (input.amount <= 0) throw new Error('grant amount must be positive');
  return applyCreditChange(input);
}

export async function reserveCredits(input: {
  userId: string;
  amount: number;
  idempotencyKey: string;
  generationId: string;
}) {
  if (input.amount <= 0) throw new Error('reserve amount must be positive');
  return applyCreditChange({
    userId: input.userId,
    amount: -input.amount,
    reason: 'generation',
    idempotencyKey: input.idempotencyKey,
    generationId: input.generationId,
  });
}

export async function refundCredits(input: {
  userId: string;
  idempotencyKey: string;
}) {
  return db.transaction(async (tx) => {
    const [user] = await tx
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, input.userId))
      .for('update');

    if (!user) throw new Error('user not found');

    const refundKey = `${input.idempotencyKey}:refund`;
    const [already] = await tx
      .select({ id: creditLedger.id })
      .from(creditLedger)
      .where(eq(creditLedger.idempotencyKey, refundKey));

    if (already) return { balance: user.credits, duplicate: true };

    const [spend] = await tx
      .select({
        amount: creditLedger.amount,
        generationId: creditLedger.generationId,
      })
      .from(creditLedger)
      .where(eq(creditLedger.idempotencyKey, input.idempotencyKey));

    if (!spend || spend.amount >= 0) throw new Error('spend not found');

    const amount = -spend.amount;
    await tx.insert(creditLedger).values({
      userId: input.userId,
      amount,
      reason: 'refund',
      idempotencyKey: refundKey,
      generationId: spend.generationId,
    });

    const [updated] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.userId))
      .returning({ credits: users.credits });

    return { balance: updated.credits, duplicate: false };
  });
}

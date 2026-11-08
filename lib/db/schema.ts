import { sql } from 'drizzle-orm';
import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  index,
  uniqueIndex,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// ==================== 枚举定义 ====================

export const paymentStatusEnum = pgEnum('paymentStatus', [
  'pending',
  'paid',
  'failed',
]);

export const creditReasonEnum = pgEnum('creditReason', [
  'signup_bonus',
  'purchase',
  'generation',
  'refund',
  'adjustment',
]);

export const generationKindEnum = pgEnum('generationKind', ['image', 'video']);

export const generationStatusEnum = pgEnum('generationStatus', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

// ==================== Better Auth ====================

export const users = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    role: text('role', { enum: ['user', 'admin'] })
      .notNull()
      .default('user'),
    // 余额缓存。流水在 creditLedger，变动必须走 lib/credits.ts
    credits: integer('credits').notNull().default(0),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('userEmailUniqueIdx').on(sql`lower(${table.email})`)]
);

export const sessions = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [index('sessionUserIdIdx').on(table.userId)]
);

export const accounts = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { mode: 'date' }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { mode: 'date' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('accountUserIdIdx').on(table.userId),
    uniqueIndex('accountProviderIdx').on(table.providerId, table.accountId),
  ]
);

export const verifications = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('verificationIdentifierIdx').on(table.identifier)]
);

// ==================== 积分包 ====================

export const creditPackages = pgTable(
  'creditPackage',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    credits: integer('credits').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    stripePriceId: text('stripePriceId').unique(),
    isActive: boolean('isActive').notNull().default(true),
    displayOrder: integer('displayOrder').notNull().default(0),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('creditPackageActiveIdx').on(table.isActive)]
);

// ==================== 付款记录 ====================

export const payments = pgTable(
  'payment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    packageId: text('packageId').references(() => creditPackages.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    status: paymentStatusEnum('status').notNull().default('pending'),
    stripeCheckoutSessionId: text('stripeCheckoutSessionId').unique(),
    stripePaymentIntentId: text('stripePaymentIntentId').unique(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    paidAt: timestamp('paidAt', { mode: 'date' }),
  },
  (table) => [
    index('paymentUserIdIdx').on(table.userId),
    index('paymentStatusIdx').on(table.status),
  ]
);

// ==================== 生成任务 ====================

export const generations = pgTable(
  'generation',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    kind: generationKindEnum('kind').notNull(),
    status: generationStatusEnum('status').notNull().default('pending'),
    modelId: text('modelId').notNull(),
    prompt: text('prompt').notNull(),
    sourceUrl: text('sourceUrl'),
    resultUrl: text('resultUrl'),
    falRequestId: text('falRequestId').unique(),
    credits: integer('credits').notNull(),
    errorMessage: text('errorMessage'),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    completedAt: timestamp('completedAt', { mode: 'date' }),
  },
  (table) => [
    index('generationUserIdIdx').on(table.userId),
    index('generationStatusIdx').on(table.status),
  ]
);

// ==================== 积分流水 ====================

export const creditLedger = pgTable(
  'creditLedger',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    reason: creditReasonEnum('reason').notNull(),
    idempotencyKey: text('idempotencyKey').notNull().unique(),
    generationId: text('generationId').references(() => generations.id),
    paymentId: text('paymentId').references(() => payments.id),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('creditLedgerUserIdIdx').on(table.userId)]
);

// ==================== 表关系定义 ====================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  payments: many(payments),
  generations: many(generations),
  creditLedger: many(creditLedger),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const creditPackagesRelations = relations(creditPackages, ({ many }) => ({
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  package: one(creditPackages, {
    fields: [payments.packageId],
    references: [creditPackages.id],
  }),
  creditLedger: many(creditLedger),
}));

export const generationsRelations = relations(generations, ({ one, many }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  creditLedger: many(creditLedger),
}));

export const creditLedgerRelations = relations(creditLedger, ({ one }) => ({
  user: one(users, {
    fields: [creditLedger.userId],
    references: [users.id],
  }),
  generation: one(generations, {
    fields: [creditLedger.generationId],
    references: [generations.id],
  }),
  payment: one(payments, {
    fields: [creditLedger.paymentId],
    references: [payments.id],
  }),
}));

export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
export type CreditReason = (typeof creditReasonEnum.enumValues)[number];
export type GenerationKind = (typeof generationKindEnum.enumValues)[number];
export type GenerationStatus = (typeof generationStatusEnum.enumValues)[number];

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
export type CreditPackage = typeof creditPackages.$inferSelect;
export type NewCreditPackage = typeof creditPackages.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
export type CreditLedgerEntry = typeof creditLedger.$inferSelect;
export type NewCreditLedgerEntry = typeof creditLedger.$inferInsert;

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { magicLink } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { accounts, sessions, users, verifications } from '@/lib/db/schema';
import { grantCredits, SIGNUP_CREDITS } from '@/lib/credits';

async function sendMagicLink({ email, url }: { email: string; url: string }) {
  const apiKey = process.env.RESEND_API_KEY || process.env.AUTH_RESEND_KEY;
  const from = process.env.AUTH_RESEND_FROM || process.env.RESEND_FROM;
  if (!apiKey || !from) {
    throw new Error('magic link mail is not configured');
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Sign in to bgg.one',
    html: `<p><a href="${url}">Sign in to bgg.one</a></p>`,
  });
  if (error) throw new Error(error.message);
}

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    camelCase: true,
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
  },
  user: {
    additionalFields: {
      role: {
        type: ['user', 'admin'],
        required: true,
        defaultValue: 'user',
        input: false,
      },
      credits: {
        type: 'number',
        required: true,
        defaultValue: 0,
        input: false,
      },
    },
  },
  advanced: {
    // Next is configured with trailingSlash, so /api/auth/get-session/ must match.
    skipTrailingSlashes: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await grantCredits({
              userId: user.id,
              amount: SIGNUP_CREDITS,
              reason: 'signup_bonus',
              idempotencyKey: `signup:${user.id}`,
            });
          } catch (error) {
            console.error('signup credit grant failed', error);
          }
        },
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink,
    }),
    nextCookies(),
  ],
});

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

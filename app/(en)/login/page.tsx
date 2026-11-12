import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SignInForm from '@/components/SignInForm';

function callbackPath(next: string | string[] | undefined) {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const callbackURL = callbackPath((await searchParams).next);

  if (session) {
    redirect(callbackURL);
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-md border border-(--line) bg-(--paper) p-6">
      <h1 className="mb-6 text-center font-display text-3xl">Sign in</h1>
      <SignInForm callbackURL={callbackURL} />
    </div>
  );
}

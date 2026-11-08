import { NextRequest } from 'next/server';
import { auth, type AuthSession } from '@/lib/auth';
import { fail } from '@/lib/services/apiRes';

export interface WithAuthOptions {
  required?: boolean;
  roles?: string[];
}

export default function withAuth(
  handler: Function,
  options: WithAuthOptions = {}
) {
  const { required = true, roles = [] } = options;

  return async (req: NextRequest, ...args: any[]) => {
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user;

    if (required && !user) {
      return fail(401);
    }

    if (user && roles.length > 0) {
      if (!user.role || !roles.includes(user.role)) {
        return fail(403);
      }
    }

    return handler(req, ...args, session);
  };
}

export function withOptionalAuth(handler: Function) {
  return withAuth(handler, { required: false });
}

export function withRole(roles: string[], handler: Function) {
  return withAuth(handler, { required: true, roles });
}

export type { AuthSession };

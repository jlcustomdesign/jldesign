/**
 * auth.ts — Admin authentication.
 *
 * Production: requires the GitHub OAuth token cookie AND that the user has push
 * access to the content repo (so only real collaborators can edit).
 * Development: always authenticated (local machine), so the admin can be built
 * and tested without GitHub.
 */
import type { APIContext } from 'astro';
import { TOKEN_COOKIE, IS_DEV } from './config';
import { getUser, canPush, type GitHubUser } from './github';

export interface AuthResult {
  ok: boolean;
  token: string | null;
  user: GitHubUser | null;
  /** Reason when not ok: 'no-token' | 'invalid' | 'no-access'. */
  reason?: string;
}

/** Minimal shape shared by APIContext and the Astro page global. */
type CookieCtx = { cookies: APIContext['cookies'] };

export function getToken(ctx: CookieCtx): string | null {
  return ctx.cookies.get(TOKEN_COOKIE)?.value || null;
}

/** Resolve the current auth state. Cheap in dev, hits GitHub in prod. */
export async function getAuth(ctx: CookieCtx): Promise<AuthResult> {
  if (IS_DEV) {
    return { ok: true, token: null, user: { login: 'local', name: 'Local Dev', email: null, avatar_url: '' } };
  }
  const token = getToken(ctx);
  if (!token) return { ok: false, token: null, user: null, reason: 'no-token' };

  const user = await getUser(token);
  if (!user) return { ok: false, token: null, user: null, reason: 'invalid' };

  const allowed = await canPush(token);
  if (!allowed) return { ok: false, token, user, reason: 'no-access' };

  return { ok: true, token, user };
}

/** For API routes: returns a 401 Response when not authenticated, otherwise null. */
export async function requireAuth(ctx: CookieCtx): Promise<{ auth: AuthResult; error: Response | null }> {
  const auth = await getAuth(ctx);
  if (!auth.ok) {
    return {
      auth,
      error: new Response(JSON.stringify({ error: 'Unauthorized', reason: auth.reason }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { auth, error: null };
}

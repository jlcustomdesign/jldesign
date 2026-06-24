import type { APIContext } from 'astro';
import { getAuth } from '../../../lib/admin/auth';
import { IS_DEV } from '../../../lib/admin/config';

export const prerender = false;

export async function GET(ctx: APIContext) {
  const auth = await getAuth(ctx);
  return new Response(
    JSON.stringify({
      authenticated: auth.ok,
      reason: auth.reason,
      dev: IS_DEV,
      user: auth.user ? { login: auth.user.login, name: auth.user.name, avatar: auth.user.avatar_url } : null,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

import type { APIContext } from 'astro';
import { TOKEN_COOKIE } from '../../../lib/admin/config';

export const prerender = false;

export async function GET(ctx: APIContext) {
  ctx.cookies.delete(TOKEN_COOKIE, { path: '/' });
  return ctx.redirect('/admin');
}

import type { APIContext } from 'astro';
import * as cookie from 'cookie';

export const prerender = false;

const adminRouteRegex = /^\/(admin|keystatic)\b/;

export async function GET({ request }: APIContext) {
  const reqUrl = new URL(request.url);
  const code = reqUrl.searchParams.get('code');
  const state = reqUrl.searchParams.get('state');
  
  if (!code) {
    return new Response('Bad Request: No code', { status: 400 });
  }
  
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  
  // Get the 'from' value from the state cookie
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const fromCookie = state ? cookies['ks-' + state] : undefined;
  const from = typeof fromCookie === 'string' && adminRouteRegex.test(fromCookie) ? fromCookie : '';
  
  // Exchange code for access token
  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);
  
  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Accept': 'application/json' }
  });
  
  if (!tokenRes.ok) {
    return new Response('Authorization failed: Token exchange failed', { status: 401 });
  }
  
  const tokenData = await tokenRes.json();
  
  if (!tokenData.access_token) {
    return new Response(`Authorization failed: ${tokenData.error_description || tokenData.error || 'Unknown error'}`, { status: 401 });
  }
  
  // For OAuth Apps without refresh tokens, set a long-lived access token cookie
  // OAuth App tokens don't expire (unless revoked), so we set a 30-day max age
  const accessTokenCookie = cookie.serialize('keystatic-gh-access-token', tokenData.access_token, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    path: '/'
  });
  
  // Clear the state cookie (it served its purpose)
  const clearStateCookie = state ? cookie.serialize('ks-' + state, '', {
    maxAge: 0,
    expires: new Date(0),
    path: '/'
  }) : '';
  
  // Redirect back to wherever the sign-in started (defaults to the admin).
  const redirectUrl = from || '/admin';
  
  const headers = new Headers();
  headers.set('Location', redirectUrl);
  headers.append('Set-Cookie', accessTokenCookie);
  if (clearStateCookie) {
    headers.append('Set-Cookie', clearStateCookie);
  }
  
  return new Response(null, {
    status: 302,
    headers
  });
}

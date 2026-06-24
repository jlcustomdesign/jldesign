import type { APIContext } from 'astro';
import * as cookie from 'cookie';

export const prerender = false;

// Generate hex string from random bytes
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function GET({ request }: APIContext) {
  const reqUrl = new URL(request.url);
  const rawFrom = reqUrl.searchParams.get('from');

  // Default to the custom admin. Only allow same-site admin paths as targets.
  const from = rawFrom && /^\/(admin|keystatic)/.test(rawFrom) ? rawFrom : '/admin';
  
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  
  // Generate state
  const state = bytesToHex(crypto.getRandomValues(new Uint8Array(10)));
  
  // Build GitHub OAuth URL
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${reqUrl.origin}/api/keystatic/github/oauth/callback`);
  url.searchParams.set('state', state);  // ALWAYS include state
  url.searchParams.set('scope', 'repo user');  // Required for Keystatic to access repo
  
  // Generate cookie
  const setCookieHeader = cookie.serialize('ks-' + state, from, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    path: '/',
    httpOnly: true
  });
  
  // Redirect to GitHub with cookie set
  return new Response(null, {
    status: 307,
    headers: {
      'Location': url.toString(),
      'Set-Cookie': setCookieHeader
    }
  });
}

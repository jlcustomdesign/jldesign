
export const prerender = false;

export async function GET({ request }) {
  const cookie = request.headers.get('cookie') || '';
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  return new Response(JSON.stringify({
    location: 'SHADOW_ENDPOINT_HIT',
    cookieLength: cookie.length,
    hasKeystaticState: cookie.includes('keystatic-state'),
    codeReceived: !!code,
    stateReceived: !!state,
    fullCookie: cookie // Careful, don't share this if it has sensitive info, but here it's ephemeral
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

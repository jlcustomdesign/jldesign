
export const prerender = false;

export async function GET({ request }) {
  const cookie = request.headers.get('cookie') || '';
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  return new Response(JSON.stringify({
    location: 'SHADOW_ENDPOINT_HIT_AGAIN',
    serverTime: new Date().toISOString(),
    cookieLength: cookie.length,
    hasKeystaticState: cookie.includes('keystatic-state'),
    codeReceived: !!code,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

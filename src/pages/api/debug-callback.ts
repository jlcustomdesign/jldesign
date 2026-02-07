
export const prerender = false;

export async function GET({ request }) {
  const cookie = request.headers.get('cookie');
  const headers = Object.fromEntries(request.headers.entries());
  
  return new Response(JSON.stringify({
    cookie: cookie || 'MISSING',
    headers: headers
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

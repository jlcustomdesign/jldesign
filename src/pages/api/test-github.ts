
export const prerender = false;

export async function GET({ request, redirect }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  
  // 1. If no code, start the OAuth flow manually
  if (!code) {
    const redirectUri = new URL('/api/test-github', url.origin).toString();
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
    return redirect(githubUrl);
  }

  // 2. If code exists, try to exchange it manually
  const redirectUri = new URL('/api/test-github', url.origin).toString();
  
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      status: response.status,
      data: data,
      debug: {
        clientIdSent: clientId?.substring(0, 5) + '...',
        redirectUriSent: redirectUri,
      }
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }, null, 2));
  }
}

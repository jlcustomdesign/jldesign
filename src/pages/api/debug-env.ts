
export const prerender = false;

export async function GET() {
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const secret = import.meta.env.KEYSTATIC_SECRET || process.env.KEYSTATIC_SECRET;

  return new Response(
    JSON.stringify({
      KEYSTATIC_GITHUB_CLIENT_ID: clientId ? `${clientId.substring(0, 5)}...` : 'MISSING',
      KEYSTATIC_GITHUB_CLIENT_SECRET: clientSecret ? `${clientSecret.substring(0, 5)}...` : 'MISSING',
      KEYSTATIC_SECRET: secret ? 'PRESENT' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

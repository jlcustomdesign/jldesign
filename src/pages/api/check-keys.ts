
export const prerender = false;

export async function GET() {
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID || '';
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '';
  const secret = import.meta.env.KEYSTATIC_SECRET || process.env.KEYSTATIC_SECRET || '';

  return new Response(
    JSON.stringify({
      KEYSTATIC_GITHUB_CLIENT_ID: {
        start: clientId.substring(0, 5) + '...',
        length: clientId.length
      },
      KEYSTATIC_GITHUB_CLIENT_SECRET: {
        start: clientSecret.substring(0, 5) + '...',
        length: clientSecret.length
      },
      KEYSTATIC_SECRET: {
        present: !!secret,
        length: secret.length
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

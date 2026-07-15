import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      return new Response(JSON.stringify({ error: "Eroare de configurare: cheia lipsește." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = {
      ...body,
      access_key: accessKey
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://mobilapersonalizatabrasov.ro",
        "Referer": "https://mobilapersonalizatabrasov.ro/"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Web3Forms API Error:", errorText);
      return new Response(JSON.stringify({ error: "Eroare la trimiterea către Web3Forms.", details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Eroare de server internă." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

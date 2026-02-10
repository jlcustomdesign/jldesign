import * as cookie from 'cookie';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function GET({ request }) {
  const reqUrl = new URL(request.url);
  const rawFrom = reqUrl.searchParams.get("from");
  const from = rawFrom || "/keystatic";
  const clientId = "Ov23li5bSRpV0qo4WVNk";
  const state = bytesToHex(crypto.getRandomValues(new Uint8Array(10)));
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${reqUrl.origin}/api/keystatic/github/oauth/callback`);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "repo user");
  const setCookieHeader = cookie.serialize("ks-" + state, from, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1e3),
    path: "/",
    httpOnly: true
  });
  return new Response(null, {
    status: 307,
    headers: {
      "Location": url.toString(),
      "Set-Cookie": setCookieHeader
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

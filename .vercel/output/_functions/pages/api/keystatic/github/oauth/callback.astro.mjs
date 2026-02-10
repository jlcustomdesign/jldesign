import * as cookie from 'cookie';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const keystaticRouteRegex = /^\/keystatic\/?/;
async function GET({ request }) {
  const reqUrl = new URL(request.url);
  const code = reqUrl.searchParams.get("code");
  const state = reqUrl.searchParams.get("state");
  if (!code) {
    return new Response("Bad Request: No code", { status: 400 });
  }
  const clientId = "Ov23li5bSRpV0qo4WVNk";
  const clientSecret = "7afb875a76eccfea505de2caf95315256a7f65ac";
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const fromCookie = state ? cookies["ks-" + state] : void 0;
  const from = typeof fromCookie === "string" && keystaticRouteRegex.test(fromCookie) ? fromCookie : "";
  const tokenUrl = new URL("https://github.com/login/oauth/access_token");
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set("code", code);
  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Accept": "application/json" }
  });
  if (!tokenRes.ok) {
    return new Response("Authorization failed: Token exchange failed", { status: 401 });
  }
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response(`Authorization failed: ${tokenData.error_description || tokenData.error || "Unknown error"}`, { status: 401 });
  }
  const accessTokenCookie = cookie.serialize("keystatic-gh-access-token", tokenData.access_token, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    // 30 days
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1e3),
    path: "/"
  });
  const clearStateCookie = state ? cookie.serialize("ks-" + state, "", {
    maxAge: 0,
    expires: /* @__PURE__ */ new Date(0),
    path: "/"
  }) : "";
  const redirectUrl = from ? `/keystatic${from.replace(/^\/keystatic/, "")}` : "/keystatic";
  const headers = new Headers();
  headers.set("Location", redirectUrl);
  headers.append("Set-Cookie", accessTokenCookie);
  if (clearStateCookie) {
    headers.append("Set-Cookie", clearStateCookie);
  }
  return new Response(null, {
    status: 302,
    headers
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

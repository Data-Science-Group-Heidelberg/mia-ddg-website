// Passwortschutz für die Vorschau auf Cloudflare Pages (npm run deploy:preview).
// Gilt nur dort: Die echte Website auf GitHub Pages enthält diesen Ordner nicht.
// Das Passwort steht in Cloudflare unter Workers & Pages → Projekt → Settings →
// Variables and Secrets als Secret PREVIEW_PASSWORD. Der Benutzername ist beliebig.

const REALM = "MiA DDG Vorschau";
const NOINDEX = "noindex, nofollow";

function reply(status, text, extra = {}) {
  return new Response(text, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": NOINDEX,
      ...extra,
    },
  });
}

// Passwort aus dem Header "Authorization: Basic …" lesen (auch mit Umlauten)
function passwordFrom(request) {
  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const colon = decoded.indexOf(":");
    return colon === -1 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

// Vergleich in konstanter Zeit, damit sich das Passwort nicht erraten lässt
async function matches(given, expected) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(given)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

export async function onRequest(context) {
  const expected = context.env.PREVIEW_PASSWORD;
  // Ohne hinterlegtes Passwort bleibt die Vorschau gesperrt
  if (!expected) return reply(503, "Die Vorschau ist noch nicht eingerichtet: Es ist kein Passwort hinterlegt.");

  const given = passwordFrom(context.request);
  if (given === null || !(await matches(given, expected))) {
    return reply(401, "Bitte melden Sie sich mit dem Passwort für die Vorschau an.", {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    });
  }

  const response = await context.next();
  const protectedResponse = new Response(response.body, response);
  protectedResponse.headers.set("X-Robots-Tag", NOINDEX);
  protectedResponse.headers.set("Cache-Control", "private, no-store");
  return protectedResponse;
}

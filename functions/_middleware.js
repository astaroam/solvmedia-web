// DEV MÓD (Cloudflare Pages): celý web dočasně ukazuje stránku „Web ladíme“ s kódem 503 (údržba).
// Google stránky z vyhledávání nevyřadí, jen se vrátí později (Retry-After).
// Vypnutí dev módu: smazat tento soubor (functions/_middleware.js) a nasadit.

const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Web ladíme | Solv Media</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@700&display=swap">
<style>
html, body { margin: 0; height: 100%; }
body { display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: #FFF7EC; color: #1A1513; font: 400 17px/1.6 Inter, system-ui, sans-serif; text-align: center; }
.logo { font: 700 2rem/1 Poppins, system-ui, sans-serif; letter-spacing: -0.04em; margin: 0 0 40px; color: #442F2A; }
.logo svg { width: 0.62em; height: 0.55em; fill: #F5CBD7; vertical-align: -0.02em; margin-left: 0.02em; }
h1 { font: 700 clamp(2.4rem, 8vw, 4.4rem)/1.1 Poppins, system-ui, sans-serif; letter-spacing: -0.035em; margin: 0 0 16px; }
h1 span { background: linear-gradient(transparent 60%, #F5CBD7 60%, #F5CBD7 92%, transparent 92%); }
p { margin: 0 0 28px; color: #5c4f4b; }
.links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.links a { display: inline-block; padding: 1em 1.6em; border-radius: 999px; background: #1A1513; color: #FFF7EC; font: 600 1rem/1 Poppins, system-ui, sans-serif; text-decoration: none; }
.links a + a { background: transparent; color: #1A1513; box-shadow: inset 0 0 0 2px #1A1513; }
.links a:focus-visible { outline: 3px solid #442F2A; outline-offset: 3px; }
</style>
</head>
<body>
<main>
<div class="logo" aria-label="solv">sol<svg viewBox="755 98 365 320" aria-hidden="true"><polygon points="755,280 818,218 880,283 1060,98 1120,158 880,418"/></svg></div>
<h1>Web právě <span>ladíme</span>.</h1>
<p>Brzy jsme zpátky. Mezitím nám klidně napište.</p>
<div class="links">
<a href="mailto:info@solvmedia.cz">info@solvmedia.cz</a>
<a href="https://www.instagram.com/solv.media/">Instagram</a>
</div>
</main>
</body>
</html>`;

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  // Ikona webu zůstává dostupná, aby se ukázala i na stránce údržby
  if (pathname === "/favicon.svg") return context.next();
  return new Response(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "86400",
      "cache-control": "no-store",
    },
  });
}

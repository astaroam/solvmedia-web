/* Vyskakovací okno: nábor do týmu (tvorba obsahu: video + foto).
   Ukáže se po pár sekundách, ale až když zmizí cookie lišta. Po zavření (křížek, „Teď ne“, Esc,
   klik mimo okno nebo klik na tlačítko) se 14 dní neukáže znovu. Vypnout jde smazáním
   <script src="/nabor.js"> ze stránek, texty se mění níže v TEXT. */
(function () {
  var KEY = 'solv-nabor-2026';
  var HIDE_FOR = 14 * 24 * 60 * 60 * 1000;
  var DELAY = 5000;

  var TEXT = {
    eyebrow: 'Nábor',
    title: 'Rozšiřujeme <span>tým</span>',
    body: 'Hledáme kreativce na tvorbu obsahu. Točíš, fotíš a víš, co lidi na sítích zastaví?',
    items: [
      ['🎥', 'Videotvorba', 'natáčení u klientů, střih reels a TikToků'],
      ['📷', 'Fotografie', 'produkty, portréty, firmy a akce']
    ],
    cta: 'Ozvi se nám',
    email: 'info@solvmedia.cz',
    subject: 'Nábor: tvorba obsahu',
    later: 'Teď ne'
  };

  function dismissed() {
    try { var t = +localStorage.getItem(KEY); return t && Date.now() - t < HIDE_FOR; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }
  if (dismissed()) return;

  var css = '' +
    '.nb { position: fixed; inset: 0; z-index: 30; display: grid; place-items: center; padding: 20px; background: color-mix(in srgb, var(--noir, #070D0D) 55%, transparent); animation: nb-fade .3s ease both; }' +
    '.nb[hidden] { display: none; }' +
    '.nb-box { position: relative; width: min(440px, 100%); padding: 36px 28px 24px; max-height: calc(100dvh - 40px); overflow-y: auto; border-radius: 32px; background: var(--cream, #FFF7EC); color: var(--ink, #1A1513); text-align: center; box-shadow: 0 40px 80px -30px rgba(7, 13, 13, 0.7); animation: nb-in .4s cubic-bezier(.2,.8,.2,1) both; }' +
    '.nb-tick { display: block; width: 54px; height: 47px; margin: 0 auto 14px; fill: var(--blush, #F5CBD7); filter: drop-shadow(0 6px 10px rgba(68, 47, 42, 0.18)); }' +
    '.nb-eyebrow { margin: 0 0 8px; font: 600 0.8rem/1 var(--display, Poppins, system-ui, sans-serif); letter-spacing: 0.12em; text-transform: uppercase; color: var(--mocha, #442F2A); }' +
    '.nb h2 { margin: 0 0 14px; font: 700 clamp(1.7rem, 6vw, 2.1rem)/1.15 var(--display, Poppins, system-ui, sans-serif); letter-spacing: -0.03em; }' +
    '.nb h2 span { background: linear-gradient(transparent 60%, var(--blush, #F5CBD7) 60%, var(--blush, #F5CBD7) 92%, transparent 92%); padding-inline: 0.04em; }' +
    '.nb p.nb-body { margin: 0 0 18px; font: 400 1rem/1.6 var(--body, Inter, system-ui, sans-serif); color: var(--ink-dim, #5E4F4A); }' +
    '.nb-cta { display: flex; align-items: center; justify-content: center; gap: 0.6em; width: 100%; min-height: 54px; border-radius: 999px; text-decoration: none; background: var(--ink, #1A1513); color: var(--cream, #FFF7EC); font: 600 1rem/1 var(--display, Poppins, system-ui, sans-serif); transition: transform .2s ease; }' +
    '.nb-cta:hover { transform: translateY(-2px); }' +
    '.nb-cta .arr { color: var(--blush, #F5CBD7); }' +
    '.nb-list { list-style: none; margin: 0 0 22px; padding: 0; display: grid; gap: 8px; text-align: left; }' +
    '.nb-list li { display: flex; gap: 12px; align-items: center; padding: 11px 14px; border-radius: 16px; background: var(--latte, #F2E8DD); font: 500 0.95rem/1.35 var(--body, Inter, system-ui, sans-serif); }' +
    '.nb-list b { font-family: var(--display, Poppins, system-ui, sans-serif); font-weight: 600; }' +
    '.nb-list .ico { flex: none; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: var(--blush, #F5CBD7); font-size: 1rem; }' +
    '.nb-ig { display: inline-block; margin-top: 14px; font: 500 0.92rem/1.4 var(--body, Inter, system-ui, sans-serif); color: var(--ink-dim, #5E4F4A); }' +
    '.nb-ig a { color: var(--ink, #1A1513); font-weight: 600; text-underline-offset: 3px; }' +
    '.nb-later { display: block; margin: 6px auto 0; padding: 10px 16px; border: 0; background: none; cursor: pointer; font: 500 0.92rem/1 var(--body, Inter, system-ui, sans-serif); color: var(--ink-dim, #5E4F4A); text-decoration: underline; text-underline-offset: 3px; }' +
    '.nb-x { position: absolute; top: 14px; right: 14px; width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 50%; cursor: pointer; background: var(--latte, #F2E8DD); color: var(--ink, #1A1513); transition: background-color .2s ease; }' +
    '.nb-x:hover { background: var(--blush, #F5CBD7); }' +
    '.nb-x svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }' +
    '.nb-box:focus, .nb-box:focus-visible { outline: none; }' +
    '.nb :focus-visible { outline: 3px solid var(--mocha, #442F2A); outline-offset: 3px; }' +
    '@keyframes nb-fade { from { opacity: 0; } }' +
    '@keyframes nb-in { from { opacity: 0; transform: translateY(18px) scale(.97); } }' +
    '@media (prefers-reduced-motion: reduce) { .nb, .nb-box { animation: none; } }';

  var wrap, lastFocus;

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var items = TEXT.items.map(function (i) {
      return '<li><span class="ico" aria-hidden="true">' + i[0] + '</span><span><b>' + i[1] + '</b><br>' + i[2] + '</span></li>';
    }).join('');

    wrap = document.createElement('div');
    wrap.className = 'nb';
    wrap.innerHTML =
      '<section class="nb-box" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="nb-title">' +
        '<button type="button" class="nb-x" aria-label="Zavřít"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></button>' +
        '<svg class="nb-tick" viewBox="755 98 365 320" aria-hidden="true"><polygon points="755,280 818,218 880,283 1060,98 1120,158 880,418"/></svg>' +
        '<p class="nb-eyebrow">' + TEXT.eyebrow + '</p>' +
        '<h2 id="nb-title">' + TEXT.title + '</h2>' +
        '<p class="nb-body">' + TEXT.body + '</p>' +
        '<ul class="nb-list">' + items + '</ul>' +
        '<a class="nb-cta" href="mailto:' + TEXT.email + '?subject=' + encodeURIComponent(TEXT.subject) + '"><span>' + TEXT.cta + '</span><span class="arr" aria-hidden="true">→</span></a>' +
        '<p class="nb-ig">' + TEXT.email + ' · <a href="https://instagram.com/solv.media/" target="_blank" rel="noopener">IG @solv.media</a></p>' +
        '<button type="button" class="nb-later">' + TEXT.later + '</button>' +
      '</section>';

    wrap.querySelector('.nb-x').addEventListener('click', close);
    wrap.querySelector('.nb-later').addEventListener('click', close);
    wrap.querySelector('.nb-cta').addEventListener('click', close);
    wrap.querySelector('.nb-ig a').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = wrap.querySelectorAll('button, a');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.body.appendChild(wrap);
  }

  function show() {
    if (!wrap) build();
    lastFocus = document.activeElement;
    wrap.hidden = false;
    wrap.querySelector('.nb-box').focus({ preventScroll: true });
  }
  function close() {
    remember();
    wrap.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function cookieBarOpen() {
    var cc = document.querySelector('.cc');
    return cc && !cc.hidden;
  }

  function init() {
    setTimeout(function wait() {
      if (cookieBarOpen()) { setTimeout(wait, 1000); return; }
      if (!dismissed()) show();
    }, DELAY);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

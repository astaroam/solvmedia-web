/* Vyskakovací okno: soutěž „web zdarma“.
   Ukáže se po pár sekundách, ale až když zmizí cookie lišta. Po zavření (křížek, „Teď ne“, Esc,
   klik mimo okno nebo klik na tlačítko) se 14 dní neukáže znovu. Vypnout jde smazáním
   <script src="/promo.js"> ze stránek, text se mění níže v TEXT. */
(function () {
  var KEY = 'solv-promo-web-zdarma';
  var HIDE_FOR = 14 * 24 * 60 * 60 * 1000;
  var DELAY = 6000;

  var TEXT = {
    eyebrow: 'Soutěž',
    title: 'Rozdáváme web <span>zdarma</span>',
    body: 'Jeden web teď navrhneme úplně zdarma. Napište nám, čemu se věnujete, a jste ve hře. Výherce vylosujeme a ozveme se mu.',
    cta: 'Chci web zdarma',
    later: 'Teď ne',
    message: 'Chci web zdarma. Věnuji se: '
  };

  function dismissed() {
    try { var t = +localStorage.getItem(KEY); return t && Date.now() - t < HIDE_FOR; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }
  if (dismissed()) return;

  var css = '' +
    '.pm { position: fixed; inset: 0; z-index: 30; display: grid; place-items: center; padding: 20px; background: color-mix(in srgb, var(--noir, #070D0D) 55%, transparent); animation: pm-fade .3s ease both; }' +
    '.pm[hidden] { display: none; }' +
    '.pm-box { position: relative; width: min(440px, 100%); padding: 40px 30px 28px; border-radius: 32px; background: var(--cream, #FFF7EC); color: var(--ink, #1A1513); text-align: center; box-shadow: 0 40px 80px -30px rgba(7, 13, 13, 0.7); animation: pm-in .4s cubic-bezier(.2,.8,.2,1) both; }' +
    '.pm-tick { display: block; width: 54px; height: 47px; margin: 0 auto 18px; fill: var(--blush, #F5CBD7); filter: drop-shadow(0 6px 10px rgba(68, 47, 42, 0.18)); }' +
    '.pm-eyebrow { margin: 0 0 8px; font: 600 0.8rem/1 var(--display, Poppins, system-ui, sans-serif); letter-spacing: 0.12em; text-transform: uppercase; color: var(--mocha, #442F2A); }' +
    '.pm h2 { margin: 0 0 14px; font: 700 clamp(1.7rem, 6vw, 2.1rem)/1.15 var(--display, Poppins, system-ui, sans-serif); letter-spacing: -0.03em; }' +
    '.pm h2 span { background: linear-gradient(transparent 60%, var(--blush, #F5CBD7) 60%, var(--blush, #F5CBD7) 92%, transparent 92%); padding-inline: 0.04em; }' +
    '.pm p.pm-body { margin: 0 0 24px; font: 400 1rem/1.6 var(--body, Inter, system-ui, sans-serif); color: var(--ink-dim, #5E4F4A); }' +
    '.pm-cta { display: flex; align-items: center; justify-content: center; gap: 0.6em; width: 100%; min-height: 54px; border-radius: 999px; text-decoration: none; background: var(--ink, #1A1513); color: var(--cream, #FFF7EC); font: 600 1rem/1 var(--display, Poppins, system-ui, sans-serif); transition: transform .2s ease; }' +
    '.pm-cta:hover { transform: translateY(-2px); }' +
    '.pm-cta .arr { color: var(--blush, #F5CBD7); }' +
    '.pm-later { margin-top: 10px; padding: 10px 16px; border: 0; background: none; cursor: pointer; font: 500 0.92rem/1 var(--body, Inter, system-ui, sans-serif); color: var(--ink-dim, #5E4F4A); text-decoration: underline; text-underline-offset: 3px; }' +
    '.pm-x { position: absolute; top: 14px; right: 14px; width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 50%; cursor: pointer; background: var(--latte, #F2E8DD); color: var(--ink, #1A1513); transition: background-color .2s ease; }' +
    '.pm-x:hover { background: var(--blush, #F5CBD7); }' +
    '.pm-x svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }' +
    '.pm-box:focus { outline: none; }' +
    '.pm :focus-visible { outline: 3px solid var(--mocha, #442F2A); outline-offset: 3px; }' +
    '@keyframes pm-fade { from { opacity: 0; } }' +
    '@keyframes pm-in { from { opacity: 0; transform: translateY(18px) scale(.97); } }' +
    '@media (prefers-reduced-motion: reduce) { .pm, .pm-box { animation: none; } }';

  var wrap, lastFocus;

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    wrap = document.createElement('div');
    wrap.className = 'pm';
    wrap.innerHTML =
      '<section class="pm-box" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="pm-title">' +
        '<button type="button" class="pm-x" aria-label="Zavřít"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></button>' +
        '<svg class="pm-tick" viewBox="755 98 365 320" aria-hidden="true"><polygon points="755,280 818,218 880,283 1060,98 1120,158 880,418"/></svg>' +
        '<p class="pm-eyebrow">' + TEXT.eyebrow + '</p>' +
        '<h2 id="pm-title">' + TEXT.title + '</h2>' +
        '<p class="pm-body">' + TEXT.body + '</p>' +
        '<a class="pm-cta" href="/?web-zdarma#kontakt"><span>' + TEXT.cta + '</span><span class="arr" aria-hidden="true">→</span></a>' +
        '<button type="button" class="pm-later">' + TEXT.later + '</button>' +
      '</section>';

    wrap.querySelector('.pm-x').addEventListener('click', close);
    wrap.querySelector('.pm-later').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = wrap.querySelectorAll('button, a');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    wrap.querySelector('.pm-cta').addEventListener('click', function (e) {
      remember();
      // Na úvodní stránce jen předvyplníme formulář a sjedeme k němu, bez načítání znovu.
      if (document.getElementById('inquiry')) {
        e.preventDefault();
        hide();
        prefill();
        document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' });
        setTimeout(function () { var n = document.getElementById('f-name'); if (n) n.focus({ preventScroll: true }); }, 600);
      }
    });
    document.body.appendChild(wrap);
  }

  function show() {
    if (!wrap) build();
    lastFocus = document.activeElement;
    wrap.hidden = false;
    wrap.querySelector('.pm-box').focus({ preventScroll: true });
  }
  function hide() {
    wrap.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function close() { remember(); hide(); }

  function prefill() {
    var web = document.getElementById('f-web');
    var msg = document.getElementById('f-msg');
    if (web) web.checked = true;
    if (msg && !msg.value) msg.value = TEXT.message;
  }

  function cookieBarOpen() {
    var cc = document.querySelector('.cc');
    return cc && !cc.hidden;
  }

  function init() {
    // Příchod z tlačítka okna z jiné podstránky: předvyplnit formulář.
    if (/[?&]web-zdarma\b/.test(location.search)) { prefill(); return; }
    setTimeout(function wait() {
      if (cookieBarOpen()) { setTimeout(wait, 1000); return; }
      if (!dismissed()) show();
    }, DELAY);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

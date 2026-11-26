/* Cookies: Google Analytics 4 se souhlasem (Google Consent Mode v2).
   gtag.js se načte vždy, ale bez souhlasu má analytics_storage 'denied',
   takže neukládá cookies a Googlu posílá jen anonymní signály. Volba se pamatuje 12 měsíců,
   změnit ji jde přes odkaz s atributem data-cookies (např. v patičce). */
(function () {
  var GA_IDS = ['G-ZRWQ2SS1BN', 'G-N7H6KXFF0D'];
  var KEY = 'solv-cookies';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && typeof c.analytics === 'boolean' && Date.now() - c.at < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }
  function save(analytics) {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, at: Date.now() })); } catch (e) {}
  }

  // Po odvolání souhlasu smaže cookies _ga a _ga_*
  function clearGA() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function apply(analytics) {
    gtag('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' });
    if (!analytics) clearGA();
  }

  var css = '' +
    '.cc { position: fixed; z-index: 20; left: 50%; bottom: calc(12px + env(safe-area-inset-bottom, 0px)); width: min(560px, calc(100% - 20px)); transform: translateX(-50%); display: grid; gap: 14px; padding: 22px 22px 20px; border-radius: 28px; background: var(--ink, #1A1513); color: var(--cream, #FFF7EC); font: 400 0.92rem/1.55 var(--body, Inter, system-ui, sans-serif); box-shadow: 0 30px 60px -24px rgba(7, 13, 13, 0.6); animation: cc-in .35s ease both; }' +
    '.cc[hidden] { display: none; }' +
    '.cc h2 { margin: 0; font: 700 1.15rem/1.2 var(--display, Poppins, system-ui, sans-serif); letter-spacing: -0.02em; }' +
    '.cc h2 span { color: var(--blush, #F5CBD7); }' +
    '.cc p { margin: 0; color: var(--cream-dim, #D8CCC2); }' +
    '.cc a { color: var(--cream, #FFF7EC); }' +
    '.cc-row { display: flex; flex-wrap: wrap; gap: 8px; }' +
    '.cc button { flex: 1 1 160px; min-height: 46px; padding: 0 1.2em; border: 0; border-radius: 999px; cursor: pointer; font: 600 0.95rem/1 var(--display, Poppins, system-ui, sans-serif); }' +
    '.cc .cc-yes { background: var(--blush, #F5CBD7); color: var(--ink, #1A1513); }' +
    '.cc .cc-no { background: transparent; color: var(--cream, #FFF7EC); box-shadow: inset 0 0 0 1.5px var(--cream-line, rgba(255, 247, 236, 0.3)); }' +
    '.cc .cc-no:hover { box-shadow: inset 0 0 0 1.5px var(--cream, #FFF7EC); }' +
    '.cc :focus-visible { outline: 3px solid var(--blush, #F5CBD7); outline-offset: 3px; }' +
    '@keyframes cc-in { from { opacity: 0; transform: translate(-50%, 16px); } }' +
    '@media (min-width: 760px) { .cc { left: 20px; transform: none; width: 440px; } @keyframes cc-in { from { opacity: 0; transform: translateY(16px); } } }' +
    '@media (prefers-reduced-motion: reduce) { .cc { animation: none; } }';

  var box;
  function show() {
    if (!box) {
      var style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      box = document.createElement('section');
      box.className = 'cc';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-labelledby', 'cc-title');
      box.innerHTML =
        '<h2 id="cc-title">Schválíte nám <span>cookies?</span></h2>' +
        '<p>Pomocí Google Analytics zjišťujeme, které části webu lidi čtou, abychom ho mohli zlepšovat. Tyto cookies použijeme jen s vaším souhlasem a nikdy pro reklamu. Více v <a href="/obchodni-podminky.html#cookies">podmínkách</a>.</p>' +
        '<div class="cc-row"><button type="button" class="cc-no">Jen nezbytné</button><button type="button" class="cc-yes">Schválit cookies</button></div>';
      box.querySelector('.cc-yes').addEventListener('click', function () { choose(true); });
      box.querySelector('.cc-no').addEventListener('click', function () { choose(false); });
      document.body.appendChild(box);
    }
    box.hidden = false;
  }
  function choose(analytics) {
    save(analytics);
    apply(analytics);
    box.hidden = true;
  }

  var stored = read();
  if (stored && stored.analytics) gtag('consent', 'update', { analytics_storage: 'granted' });

  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_IDS[0];
  document.head.appendChild(tag);
  gtag('js', new Date());
  GA_IDS.forEach(function (id) { gtag('config', id); });

  function init() {
    if (!stored) show();
    document.querySelectorAll('[data-cookies]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(); box.querySelector('.cc-yes').focus(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

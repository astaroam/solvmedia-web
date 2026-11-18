/* Solv Media – společné skripty webu */
(function () {
  // Mobilní menu
  var btn = document.querySelector('.burger');
  if (btn) {
    var close = function () { document.body.classList.remove('menu-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) close(); });
  }

  // Video v úvodu: pustí se jen bez omezení pohybu a bez úsporného režimu dat
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData);
  document.querySelectorAll('video[data-autoplay]').forEach(function (v) {
    if (still) return;
    var start = function () { if (!v.src) { v.src = v.getAttribute('data-src'); } var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    var watch = function () {
      if (!('IntersectionObserver' in window)) { start(); return; }
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) start(); else if (v.src) v.pause(); });
      }, { rootMargin: '100px' }).observe(v);
    };
    // až po načtení stránky, aby video nebrzdilo první zobrazení
    if (document.readyState === 'complete') watch(); else window.addEventListener('load', watch);
  });

  // Portfolio videa: klik pustí video se zvukem, ostatní se zastaví
  var reels = document.querySelectorAll('.reel');
  function stop(fig) { var v = fig.querySelector('video'); v.pause(); v.controls = false; fig.classList.remove('on'); }
  reels.forEach(function (fig) {
    var v = fig.querySelector('video');
    fig.querySelector('.play').addEventListener('click', function () {
      reels.forEach(function (o) { if (o !== fig) stop(o); });
      v.muted = false; v.controls = true; fig.classList.add('on');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
    v.addEventListener('ended', function () { stop(fig); });
  });

  // Poptávkový formulář: na solvmedia.cz / Cloudflare Pages odesílá přes Web3Forms na info@solvmedia.cz.
  var form = document.getElementById('inquiry');
  if (form) {
    // Přístupový klíč z web3forms.com je veřejný (patří do stránky), jen určuje, kam poptávky chodí.
    var WEB3FORMS_KEY = 'SEM-VLOZTE-KLIC-Z-WEB3FORMS';
    var status = document.getElementById('form-status');
    var submit = document.getElementById('f-submit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var live = /(^|\.)solvmedia\.cz$|\.pages\.dev$/.test(location.hostname);
      status.hidden = false;
      if (!live) { status.textContent = 'Tohle je náhled webu, poptávka se odešle až na solvmedia.cz.'; return; }
      if (document.getElementById('bot-field').value) { form.reset(); status.textContent = 'Díky, poptávka je odeslaná.'; return; }
      submit.disabled = true;
      status.textContent = 'Odesílám…';
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== 'bot-field') data[k] = v; });
      data.access_key = WEB3FORMS_KEY;
      data.subject = 'Nová poptávka z webu: ' + (data.jmeno || '');
      data.from_name = 'Web Solv Media';
      data.replyto = data.email;
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.success) throw new Error(r.status); }); })
        .then(function () { form.reset(); status.textContent = 'Díky, poptávka je odeslaná. Ozveme se do dvou pracovních dnů.'; })
        .catch(function () { status.textContent = 'Poptávku se nepodařilo odeslat. Zkuste to znovu, nebo napište na info@solvmedia.cz.'; })
        .then(function () { submit.disabled = false; });
    });
  }

  // Kopírování e-mailu
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { var o = b.textContent; b.textContent = 'Zkopírováno'; setTimeout(function () { b.textContent = o; }, 1600); });
    });
  });
})();

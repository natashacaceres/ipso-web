/* IPSO · movimiento común, ligero: scroll nativo, títulos palabra a palabra, entradas y la hoja de "Tu TPV". */
(function () {
  if (window.__ipsoMotion) return; window.__ipsoMotion = 1;
  var EASE = 'cubic-bezier(.22,1,.36,1)';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document.documentElement;

  var st = document.createElement('style'); st.id = 'ipso-motion-css';
  st.textContent =
    'html{scroll-behavior:' + (RM ? 'auto' : 'smooth') + '}' +
    'html body *:not(#_m),html body *:not(#_m)::before,html body *:not(#_m)::after{transition-timing-function:' + EASE + '!important}' +
    'html body a:not(#_m),html body button:not(#_m),html body summary:not(#_m){transition-duration:150ms!important}' +
    'html body [data-mo-t="0"][data-mo-t="0"]{visibility:hidden!important}' +
    'html body [data-mo-c="0"][data-mo-c="0"][data-mo-c="0"]{opacity:0!important}' +
    '[data-mo-w]{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.16em;margin-bottom:-.16em}' +
    '[data-mo-i]{display:inline-block}' +
    '@media (prefers-reduced-motion: reduce){html body *,html body *::before,html body *::after{animation:none!important;transition:none!important}}';
  (document.head || doc).appendChild(st);

  var vh = function () { return window.innerHeight || doc.clientHeight; };
  var cl = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* imágenes que el navegador dejó en error al montarse: se piden de nuevo */
  function heal() {
    Array.prototype.forEach.call(document.images, function (im) {
      if (!im.complete || im.naturalWidth || im.__moHeal || !im.getAttribute('src')) return;
      im.__moHeal = 1;
      var s = im.getAttribute('src'), ss = im.getAttribute('srcset');
      im.removeAttribute('srcset'); im.removeAttribute('src');
      requestAnimationFrame(function () { if (ss) im.setAttribute('srcset', ss); im.setAttribute('src', s); });
    });
  }

  /* enlaces internos: desplazamiento suave nativo */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var beh = RM ? 'auto' : 'smooth';
    if (!id || id === 'top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: beh }); return; }
    var el = document.getElementById(id); if (!el) return;
    e.preventDefault();
    var hdr = document.querySelector('header');
    var off = (hdr ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0) + 16;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: beh });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  function boot() {
    if (!document.body || !document.querySelector('h1, h2, section')) { setTimeout(boot, 60); return; }
    heal(); [800, 2000].forEach(function (t) { setTimeout(heal, t); });
    if (RM) return;
    scan(); [400, 1200, 2500].forEach(function (t) { setTimeout(scan, t); });
    setupSheet();
  }

  /* ---------- títulos palabra a palabra ---------- */
  var SKIP = '#asi-funciona, #sol-intro, #sol-rail, #sol-track, [data-mnav], header, [data-h5card], [data-rv], [data-reveal], [data-ind], [data-late], [data-af], [data-anim]';
  function playTitle(h) {
    var words = [], nodes = [];
    var walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null);
    while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var w = document.createElement('span'); w.setAttribute('data-mo-w', '1');
        var i = document.createElement('span'); i.setAttribute('data-mo-i', '1'); i.textContent = p;
        w.appendChild(i); frag.appendChild(w); words.push(i);
      });
      n.parentNode.replaceChild(frag, n);
    });
    h.removeAttribute('data-mo-t');
    var last = null;
    words.forEach(function (i, k) {
      last = i.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], { duration: 500, delay: k * 40, easing: EASE, fill: 'backwards' });
    });
    var restore = function () {
      Array.prototype.slice.call(h.querySelectorAll('[data-mo-w]')).forEach(function (w) { w.parentNode.replaceChild(document.createTextNode(w.textContent), w); });
      h.normalize();
    };
    if (last) last.onfinish = restore; else restore();
  }

  /* ---------- bloques y tarjetas ---------- */
  var batch = [], batchT = 0;
  function playCard(el) {
    batch.push(el);
    if (batchT) return;
    batchT = requestAnimationFrame(function () {
      batch.forEach(function (c, k) {
        c.removeAttribute('data-mo-c');
        c.animate([{ opacity: 0, translate: '0 16px' }, { opacity: 1, translate: '0 0' }], { duration: 400, delay: k * 50, easing: EASE, fill: 'backwards' });
      });
      batch = []; batchT = 0;
    });
  }

  var pending = new Set();
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) reveal(e.target); });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 }) : null;
  function reveal(el) {
    if (!pending.has(el)) return;
    pending.delete(el); if (io) io.unobserve(el);
    if (el.hasAttribute('data-mo-t')) playTitle(el); else playCard(el);
  }
  /* respaldo por si el observador no llega a avisar: solo mira los pendientes */
  var guard = setInterval(function () {
    if (!pending.size) return;
    var H = vh() * 0.95;
    pending.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < H && r.bottom > 0) reveal(el); });
  }, 900);

  function isCardish(el) {
    if (el.closest(SKIP) || el.closest('#top') || el.closest('footer')) return false;
    var s = el.getAttribute('style') || '';
    if (/position:\s*(fixed|sticky|absolute)/.test(s)) return false;
    if (getComputedStyle(el).animationName !== 'none') return false;
    var r = el.getBoundingClientRect(); if (r.width < 40 || r.height < 40) return false;
    return true;
  }

  var seen = new WeakSet();
  function scan() {
    var H = vh() * 0.95;
    Array.prototype.forEach.call(document.querySelectorAll('h1, h2'), function (h) {
      if (seen.has(h)) return; seen.add(h);
      if (h.closest(SKIP) || !h.textContent.trim()) return;
      var r = h.getBoundingClientRect();
      if (r.top < H && r.bottom > 0) { playTitle(h); return; }
      h.setAttribute('data-mo-t', '0'); pending.add(h); if (io) io.observe(h);
    });
    var picked = [];
    Array.prototype.forEach.call(document.querySelectorAll('section img, section picture, section figure, section [data-plan], section details, section form, section article, section [data-indcard]'), function (el) {
      if (seen.has(el)) return; seen.add(el);
      if (!isCardish(el)) return;
      if (picked.some(function (p) { return p.contains(el); })) return;
      picked.push(el);
    });
    picked.forEach(function (el) {
      if (el.hasAttribute('data-fx')) { el.removeAttribute('data-fx'); el.removeAttribute('data-fx-now'); }
      var r = el.getBoundingClientRect();
      if (r.top < H && r.bottom > 0) { playCard(el); return; }
      el.setAttribute('data-mo-c', '0'); pending.add(el); if (io) io.observe(el);
    });
  }

  /* ---------- hoja de "Tu TPV": un solo bucle que se para al quedarse quieto ---------- */
  function setupSheet() {
    var hero = document.getElementById('top');
    var bh = document.querySelector('h2[data-band-h2]');
    var band = bh ? bh.closest('section') : null;
    if (!hero || !band) return;
    band.style.position = 'relative'; band.style.zIndex = '2'; band.style.marginTop = '-48px';
    band.style.minHeight = '100svh'; band.style.display = 'flex'; band.style.flexDirection = 'column';
    var inner = bh.parentElement; inner.style.marginTop = 'auto'; inner.style.marginBottom = 'auto'; inner.style.width = '100%';
    hero.style.transformOrigin = '50% 100%';
    var raf = 0, lastP = -1, lastR = -1, idle = 0;
    function frame() {
      raf = 0;
      var H = vh(), top = band.getBoundingClientRect().top;
      var p = cl((H - top) / (H * 0.6), 0, 1);
      var R = window.innerWidth >= 768 ? 32 : 24;
      var rad = Math.round(R * (1 - p) * 10) / 10;
      if (rad !== lastR) { lastR = rad; band.style.clipPath = rad > 0 ? 'inset(0 round ' + rad + 'px ' + rad + 'px 0 0)' : ''; }
      if (p !== lastP) {
        lastP = p; idle = 0;
        var moving = p > 0 && p < 1;
        hero.style.willChange = moving ? 'transform, opacity' : '';
        hero.style.transform = p > 0 ? 'scale(' + (1 - 0.05 * p).toFixed(4) + ')' : '';
        hero.style.opacity = p > 0 ? (1 - 0.55 * p).toFixed(3) : '';
      } else idle++;
      if (idle < 3) raf = requestAnimationFrame(frame);
      else hero.style.willChange = '';
    }
    var kick = function () { idle = 0; if (!raf) raf = requestAnimationFrame(frame); };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });
    kick();
  }

  boot();
})();

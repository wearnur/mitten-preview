// Progressive enhancement only: the page works fully without this file.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  var top = document.querySelector('.top');
  if (top) {
    var heroCta = document.querySelector('.hero .cta-row');
    var onScroll = function () {
      top.classList.toggle('scrolled', window.scrollY > 8);
      if (heroCta) doc.classList.toggle('show-callbar', heroCta.getBoundingClientRect().bottom < 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    // Belt and braces: content must never stay invisible if the observer is throttled or late
    // (seen in headless Edge, 2026-10-05). Anything already in or above the viewport is shown.
    var pending = false;
    var sweep = function () {
      pending = false;
      var limit = window.innerHeight * 0.96;
      items = items.filter(function (el) {
        if (el.classList.contains('in')) return false;
        if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
        return true;
      });
      if (!items.length) window.removeEventListener('scroll', onSweep);
    };
    var onSweep = function () { if (!pending) { pending = true; setTimeout(sweep, 120); } };
    window.addEventListener('scroll', onSweep, { passive: true });
    window.addEventListener('load', sweep);
  }

  // Replay logo animations (chooser page button, or tapping a mark there).
  function replay(scope) {
    (scope || document).querySelectorAll('svg.mark').forEach(function (svg) {
      var clone = svg.cloneNode(true);
      svg.parentNode.replaceChild(clone, svg);
    });
  }
  document.querySelectorAll('[data-replay]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-replay');
      replay(sel ? document.querySelector(sel) : document);
    });
  });

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());
})();

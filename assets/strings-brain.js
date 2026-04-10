/**
 * STRINGS „mozog“ — jeden časový takt pre motion vrstvy (2D canvas, Three.js, …).
 * window.STRINGS_BRAIN.subscribe(fn) — fn(t) kde t je sekundy od štartu stránky.
 * CustomEvent: stringsbrain:tick, detail.t
 */
(function () {
  if (window.STRINGS_BRAIN) return;

  var t0 = performance.now();
  var subs = [];
  var rafId = 0;

  function getT() {
    return (performance.now() - t0) * 0.001;
  }

  function loop() {
    rafId = 0;
    var t = getT();
    var list = subs.slice();
    for (var i = 0; i < list.length; i += 1) {
      try {
        list[i](t);
      } catch (e) {}
    }
    try {
      window.dispatchEvent(new CustomEvent('stringsbrain:tick', { detail: { t: t } }));
    } catch (e2) {}

    if (subs.length) rafId = requestAnimationFrame(loop);
  }

  function ensureLoop() {
    if (rafId || !subs.length) return;
    rafId = requestAnimationFrame(loop);
  }

  window.STRINGS_BRAIN = {
    getT: getT,
    subscribe: function (fn) {
      if (typeof fn !== 'function') return function () {};
      subs.push(fn);
      ensureLoop();
      return function unsubscribe() {
        var j = subs.indexOf(fn);
        if (j !== -1) subs.splice(j, 1);
      };
    },
    unsubscribe: function (fn) {
      var j = subs.indexOf(fn);
      if (j !== -1) subs.splice(j, 1);
    }
  };
})();

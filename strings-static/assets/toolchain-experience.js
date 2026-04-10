/**
 * STRINGS toolchain layer: Three.js + Lottie (+ optional Rive, Spline via data-* on <body>).
 * Set on index.html <body>:
 *   data-spline-embed="https://my.spline.design/..."  (Spline → Publish → Copy link)
 *   data-rive-url="assets/rive/strings.riv"           (export z Rive)
 *   data-lottie-url="https://...json"                 (voliteľné; inak použije sa default)
 *   data-toolchain-three="off"                        (vypne Three.js vrstvu)
 */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var body = document.body;
  if (!body || body.getAttribute('data-page') !== 'index') return;

  var splineUrl = (body.dataset.splineEmbed || '').trim();
  var riveUrl = (body.dataset.riveUrl || '').trim();
  var lottieUrl = (body.dataset.lottieUrl || '').trim();
  var threeOff = (body.dataset.toolchainThree || '').toLowerCase() === 'off';

  function mountSpline() {
    if (!splineUrl) return;
    var slot = document.getElementById('hero-spline-slot');
    if (!slot) return;
    var frame = slot.querySelector('iframe');
    if (!frame) return;
    frame.src = splineUrl;
    frame.title = '3D — Spline';
    slot.hidden = false;
    slot.setAttribute('aria-hidden', 'false');
  }

  function mountLottie() {
    var el = document.getElementById('hero-lottie');
    if (!el) return;
    var url =
      lottieUrl ||
      'https://assets3.lottiefiles.com/packages/lf20_jcikwtux.json';

    import('https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/esm/lottie.min.js')
      .then(function (mod) {
        var lottie = mod.default;
        lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: url,
        });
      })
      .catch(function () {});
  }

  function mountRive() {
    if (!riveUrl) return;
    var canvas = document.getElementById('hero-rive-canvas');
    if (!canvas) return;

    var wrap = canvas.parentElement;
    if (wrap) wrap.hidden = false;

    import('https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.10.3/+esm')
      .then(function (mod) {
        var Rive = mod.Rive;
        new Rive({
          src: riveUrl,
          canvas: canvas,
          autoplay: true,
          onLoadError: function () {
            if (wrap) wrap.hidden = true;
          },
        });
      })
      .catch(function () {
        if (canvas.parentElement) canvas.parentElement.hidden = true;
      });
  }

  function mountThree() {
    if (threeOff) return;
    var host = document.getElementById('str-three-host');
    if (!host) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')
      .then(function (THREE) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
          55,
          host.clientWidth / Math.max(1, host.clientHeight),
          0.1,
          100
        );
        camera.position.z = 4.2;

        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(host.clientWidth, host.clientHeight);
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        var geom = new THREE.BufferGeometry();
        var count = 900;
        var pos = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
          var r = 2.2 + Math.random() * 2.8;
          var th = Math.random() * Math.PI * 2;
          var ph = Math.acos(2 * Math.random() - 1);
          pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
          pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
          pos[i * 3 + 2] = r * Math.cos(ph);
        }
        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        var mat = new THREE.PointsMaterial({
          color: 0x2dd4bf,
          size: 0.018,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        var points = new THREE.Points(geom, mat);
        scene.add(points);

        var lineGeom = new THREE.TorusGeometry(1.15, 0.012, 8, 120);
        var lineMat = new THREE.MeshBasicMaterial({
          color: 0x5eead4,
          transparent: true,
          opacity: 0.12,
          wireframe: true,
        });
        var torus = new THREE.Mesh(lineGeom, lineMat);
        scene.add(torus);

        var t0 = performance.now();
        function tick(now) {
          var t = (now - t0) * 0.001;
          points.rotation.y = t * 0.06;
          points.rotation.x = Math.sin(t * 0.2) * 0.08;
          torus.rotation.x = t * 0.11;
          torus.rotation.y = t * 0.17;
          renderer.render(scene, camera);
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        function resize() {
          var w = host.clientWidth;
          var h = host.clientHeight;
          camera.aspect = w / Math.max(1, h);
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
        window.addEventListener('resize', resize);
      })
      .catch(function () {});
  }

  mountSpline();
  mountLottie();
  mountRive();
  mountThree();
})();

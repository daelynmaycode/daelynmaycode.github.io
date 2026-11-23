/* FF1 3D Remake — development portal behaviour.
   Progressive enhancement only: every page works without JavaScript.

   Motion is four systems sharing one language, all optional:
     1. elemental identity — the page takes one crystal's light
     2. ambient field      — drifting motes on a capped canvas
     3. reveals            — sections arrive as they are reached
     4. the veil           — light parts between pages
   Anything that moves is skipped when the visitor asks for reduced motion. */
(function () {
  "use strict";

  /* Effective motion state. The inline head script writes data-motion on the
     root before first paint from the stored choice, falling back to the OS
     preference, so this reads exactly what the stylesheet is using. */
  var motionRoot = document.documentElement;

  function reduced() {
    return motionRoot.getAttribute("data-motion") === "off";
  }

  /* Sound lives in js/audio.js; the page only announces what happened. */
  function cue(id) {
    document.dispatchEvent(new CustomEvent("ff1:sound", { detail: { id: id } }));
  }

  /* --- Elemental identity ------------------------------------------------ */
  /* Each page carries one of the crystals. The palette itself lives in CSS
     (--el-rgb); this note only says which one, and how its dust behaves. */
  var ELEMENTS = {
    "index.html": { name: "light", rise: 0.85, scale: 1 },
    "progress.html": { name: "fire", rise: 1.75, scale: 0.85 },
    "atlas.html": { name: "wind", rise: 1.35, scale: 1 },
    "gallery.html": { name: "ice", rise: 0.6, scale: 1.15 },
    "timeline.html": { name: "storm", rise: 1.25, scale: 0.95 },
    "roadmap.html": { name: "earth", rise: 0.6, scale: 0.95 },
    "tales.html": { name: "water", rise: 0.8, scale: 1.05 }
  };

  var pageFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  var element = ELEMENTS[pageFile] || ELEMENTS["index.html"];
  document.body.setAttribute("data-element", element.name);

  /* --- Mobile navigation ------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      toggle.textContent = open ? "Menu" : "Close";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
        toggle.focus();
      }
    });
  }

  /* --- Gallery ----------------------------------------------------------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var shots = Array.prototype.slice.call(document.querySelectorAll(".gallery .shot"));
  var gallery = document.getElementById("gallery");

  /* Printed counts are read from the gallery itself, so they cannot drift. */
  document.querySelectorAll("[data-gallery-count]").forEach(function (node) {
    node.textContent = String(shots.length);
  });

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.getAttribute("data-filter");

      filters.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });

      shots.forEach(function (shot) {
        var matches = group === "all" || shot.getAttribute("data-group") === group;
        shot.hidden = !matches;
      });

      cue("tap");

      /* The grid re-forms rather than snapping. */
      if (gallery && !reduced() && typeof gallery.animate === "function") {
        gallery.animate(
          [
            { opacity: 0.35, transform: "translateY(6px)" },
            { opacity: 1, transform: "none" }
          ],
          { duration: 340, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" }
        );
      }
    });
  });

  /* --- Lightbox ---------------------------------------------------------- */
  var dialog = document.getElementById("lightbox");
  var lastFocused = null;

  function closeLightbox() {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      cue("close");
    }
    if (lastFocused) lastFocused.focus();
  }

  if (dialog) {
    var lbImage = dialog.querySelector("img");
    var lbTitle = dialog.querySelector(".lb-title");
    var lbMeta = dialog.querySelector(".lb-meta");

    shots.forEach(function (shot) {
      shot.addEventListener("click", function () {
        var image = shot.querySelector("img");
        if (!image) return;

        lastFocused = shot;
        lbImage.src = image.getAttribute("src");
        lbImage.alt = image.getAttribute("alt") || "";
        if (lbTitle) lbTitle.textContent = shot.getAttribute("data-title") || "";
        if (lbMeta) lbMeta.textContent = shot.getAttribute("data-meta") || "";
        lbImage.classList.toggle("pixel", shot.classList.contains("pixel"));

        cue("open");

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      });
    });

    dialog.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", closeLightbox);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeLightbox();
    });

    dialog.addEventListener("close", function () {
      if (lbImage) lbImage.removeAttribute("src");
      /* Covers the close button, the backdrop and Escape alike. */
      cue("close");
    });
  }

  /* --- Ambient crystal field --------------------------------------------- */
  /* A handful of motes on one fixed canvas: enough to suggest air, few enough
     to stay at 60 fps on a phone. The count scales with the viewport. */
  function initAtmosphere() {
    var canvas = document.createElement("canvas");
    canvas.className = "atmos";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    var ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var motes = [];
    var sprite = null;
    var frame = 0;
    var resizeTimer = 0;

    function channels() {
      var raw = window
        .getComputedStyle(document.body)
        .getPropertyValue("--el-rgb")
        .trim();
      var parts = raw.split(/[\s,]+/).map(Number);
      if (parts.length >= 3 && parts.slice(0, 3).every(function (n) { return !isNaN(n); })) {
        return parts.slice(0, 3);
      }
      return [236, 212, 154];
    }

    var rgb = channels();

    function rgba(alpha) {
      return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha + ")";
    }

    function buildSprite() {
      var s = document.createElement("canvas");
      s.width = 64;
      s.height = 64;
      var sctx = s.getContext("2d");
      var grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      grad.addColorStop(0.22, rgba(0.55));
      grad.addColorStop(0.58, rgba(0.14));
      grad.addColorStop(1, rgba(0));
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 64, 64);
      return s;
    }

    function seed() {
      var count = Math.round(Math.min(34, Math.max(9, (width * height) / 42000)));
      motes = [];
      for (var i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: (0.9 + Math.random() * 2.1) * element.scale,
          rise: (7 + Math.random() * 16) * element.rise,
          drift: 6 + Math.random() * 16,
          phase: Math.random() * Math.PI * 2,
          rate: 0.25 + Math.random() * 0.5
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw(now) {
      var t = now / 1000;
      var span = height + 120;
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        var y = m.y - ((t * m.rise) % span);
        if (y < -60) y += span;
        var x = m.x + Math.sin(t * m.rate + m.phase) * m.drift;
        var twinkle = 0.5 + 0.5 * Math.sin(t * m.rate * 2.2 + m.phase * 1.7);
        var size = m.r * 7;
        ctx.globalAlpha = 0.1 + twinkle * 0.42;
        ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    }

    function start() {
      if (frame) return;
      frame = window.requestAnimationFrame(draw);
    }

    function stop() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, width, height);
    }

    sprite = buildSprite();
    resize();

    function show() {
      canvas.style.display = "";
      resize();
      start();
    }

    function hide() {
      stop();
      canvas.style.display = "none";
    }

    if (reduced()) hide();
    else start();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden || reduced()) {
        stop();
      } else {
        start();
      }
    });

    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (!reduced()) resize();
      }, 180);
    });

    return { show: show, hide: hide };
  }

  /* --- Reveals ----------------------------------------------------------- */
  var revealObserver = null;

  function armReveals() {
    if (reduced() || revealObserver || !("IntersectionObserver" in window)) return;

    var selector = [
      ".section-head",
      ".grid > .cell",
      ".dash > .track",
      ".gallery > .shot",
      ".timeline > .tl-item",
      ".figure-grid > .plate",
      ".compare > .side",
      ".phase",
      ".ledger > .row",
      ".plate"
    ].join(",");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          if (entry.target.querySelector(".meter")) {
            window.setTimeout(function () {
              cue("achievement");
            }, 900);
          }
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    revealObserver = observer;

    var counters = new Map();

    Array.prototype.forEach.call(document.querySelectorAll(selector), function (node) {
      if (node.classList.contains("is-in")) return;
      if (node.closest(".hero, .page-head")) return;
      /* Anything already on screen at load stays put: no flash, no reflow. */
      if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

      var parent = node.parentNode;
      var index = counters.get(parent) || 0;
      counters.set(parent, index + 1);

      node.classList.add("reveal");
      node.style.setProperty("--i", String(Math.min(index, 5)));

      if (node.matches(".section-head")) node.classList.add("is-soft");
      if (node.matches(".ledger > .row, .compare > .side")) node.classList.add("is-flat");

      observer.observe(node);
    });
  }

  function disarmReveals() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    document.querySelectorAll(".reveal").forEach(function (node) {
      node.classList.add("is-in");
    });
  }

  /* --- The veil ---------------------------------------------------------- */
  function initVeil() {
    var veil = document.querySelector(".veil");

    if (veil) {
      window.addEventListener("pageshow", function (event) {
        if (!event.persisted) return;
        document.body.classList.remove("is-leaving");
        veil.classList.remove("is-leaving");
      });
    }

    var leaving = false;

    document.addEventListener("click", function (event) {
      if (leaving || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      if (link.origin && link.origin !== window.location.origin) return;
      if (link.getAttribute("href").charAt(0) === "#") return;
      if (link.href.split("#")[0] === window.location.href.split("#")[0]) return;

      cue("page");

      /* Sound belongs to everyone; the wipe is the optional part. */
      if (!veil || reduced()) return;

      event.preventDefault();
      leaving = true;
      document.body.classList.add("is-leaving");
      veil.classList.add("is-leaving");
      window.setTimeout(function () {
        window.location.href = link.href;
      }, 430);
    });
  }

  /* --- Header motion control --------------------------------------------- */
  var MOTION_KEY = "ff1.motion.v1";
  var atmos = null;
  var motionBtn = null;

  function paintMotion() {
    if (!motionBtn) return;
    var on = !reduced();
    motionBtn.setAttribute("aria-checked", on ? "true" : "false");
    motionBtn.setAttribute("data-on", on ? "true" : "false");
    motionBtn.setAttribute(
      "title",
      on
        ? "Decorative animations are on — click to turn them off"
        : "Decorative animations are off — click to turn them on"
    );
    var word = motionBtn.querySelector("[data-motion-word]");
    if (word) word.textContent = on ? "Animations On" : "Animations Off";
  }

  function setMotion(on, persist) {
    motionRoot.setAttribute("data-motion", on ? "on" : "off");
    if (persist) {
      try {
        window.localStorage.setItem(MOTION_KEY, JSON.stringify({ choice: on ? "on" : "off" }));
      } catch (e) {
        /* Storage can be denied; the choice still applies to this page. */
      }
    }

    if (on) {
      if (atmos) atmos.show();
      armReveals();
      cue("crystal");
    } else {
      if (atmos) atmos.hide();
      disarmReveals();
      cue("close");
    }

    paintMotion();
  }

  function initMotionControl() {
    var bar = document.querySelector(".site-header .bar");
    if (!bar || bar.querySelector("[data-motion-toggle]")) return;

    motionBtn = document.createElement("button");
    motionBtn.type = "button";
    motionBtn.className = "ctl motion-ctl";
    motionBtn.setAttribute("role", "switch");
    motionBtn.setAttribute("aria-label", "Decorative animations");
    motionBtn.setAttribute("data-motion-toggle", "");
    motionBtn.innerHTML =
      '<svg class="ctl-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 3.2 18.8 9.6 12 20.8 5.2 9.6Z" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
      '<path d="M5.2 9.6h13.6M12 3.2v17.6" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>' +
      '<path class="ctl-slash" d="M4.2 4.2 19.8 19.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      "</svg>" +
      '<span class="ctl-word" aria-hidden="true" data-motion-word>Animations On</span>';

    bar.appendChild(motionBtn);

    motionBtn.addEventListener("click", function () {
      setMotion(reduced(), true);
    });

    paintMotion();
  }

  atmos = initAtmosphere();
  initMotionControl();
  armReveals();
  initVeil();

  /* --- Footer year ------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();

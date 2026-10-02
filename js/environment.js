/* ============================================================
   LEONIDA.RPF — ENVIRONMENT DRIVER
   One tiny rAF loop: cursor light, scroll parallax, filter fade.
   All continuous environmental motion itself is CSS keyframes;
   this file only feeds pointers/scroll into CSS variables and
   orchestrates the filter fade. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
    "use strict";

    var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- 1. atmosphere DOM (three neon blooms + haze + field) ---- */
    var atmo = document.createElement("div");
    atmo.className = "atmosphere";
    atmo.setAttribute("aria-hidden", "true");

    var neon = document.createElement("div");
    neon.className = "atmo-neon n1";
    neon.setAttribute("aria-hidden", "true");

    var neon2 = document.createElement("div");
    neon2.className = "atmo-neon n2";
    neon2.setAttribute("aria-hidden", "true");

    var neon3 = document.createElement("div");
    neon3.className = "atmo-neon n3";
    neon3.setAttribute("aria-hidden", "true");

    var haze = document.createElement("div");
    haze.className = "atmo-haze";
    haze.setAttribute("aria-hidden", "true");

    document.body.prepend(atmo, neon, neon2, neon3, haze);

    /* ---- 2. cursor light + scroll parallax (single rAF loop) ---- */
    var mx = 50, my = 30, px = 50, py = 30;
    var scrollY = 0, targetScroll = 0;
    var queued = false;

    function frame() {
        queued = false;

        /* ease cursor light toward the pointer */
        px += (mx - px) * 0.08;
        py += (my - py) * 0.08;

        document.documentElement.style.setProperty("--mx", px.toFixed(2) + "%");
        document.documentElement.style.setProperty("--my", py.toFixed(2) + "%");

        /* ease scroll parallax value */
        scrollY += (targetScroll - scrollY) * 0.1;
        document.documentElement.style.setProperty("--scroll-y", scrollY.toFixed(1));

        if (
            Math.abs(mx - px) > 0.1 ||
            Math.abs(my - py) > 0.1 ||
            Math.abs(targetScroll - scrollY) > 0.5
        ) {
            queued = true;
            requestAnimationFrame(frame);
        }
    }

    function kick() {
        if (!queued && !reduceMotion &&
            document.documentElement.getAttribute("data-mode") !== "fast") {
            queued = true;
            requestAnimationFrame(frame);
        }
    }

    window.addEventListener("pointermove", function (e) {
        mx = (e.clientX / window.innerWidth) * 100;
        my = (e.clientY / window.innerHeight) * 100;

        /* local light on cards near the pointer */
        document.documentElement.style.setProperty("--lx", mx.toFixed(2) + "%");
        document.documentElement.style.setProperty("--ly", my.toFixed(2) + "%");

        document.body.classList.add("cursor-lit");
        kick();
    }, { passive: true });

    window.addEventListener("scroll", function () {
        targetScroll = window.scrollY;
        kick();
    }, { passive: true });

    if (!reduceMotion) {
        kick();
    }

    /* fast mode stops the loop entirely; modes.js fires a change event */
    function fastMode() {
        return document.documentElement.getAttribute("data-mode") === "fast";
    }

    window.addEventListener("leonida-modechange", function () {
        if (!fastMode() && !reduceMotion) {
            targetScroll = window.scrollY;
            kick();
        }
    });
})();

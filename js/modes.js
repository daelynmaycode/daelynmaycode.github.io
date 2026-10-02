/* ============================================================
   LEONIDA.RPF — PRESENTATION MODE MANAGER
   Normal = beautiful · Accessibility = adaptable · Fast = responsive
   Modes are presentation priorities on ONE component architecture:
   theme (appearance) · a11y (accommodation) · mode (performance)
   remain architecturally separate and freely combinable.
   ============================================================ */
(function () {
    "use strict";

    var root = document.documentElement;
    var A11Y_KEYS = ["motion", "contrast", "transparency", "blur", "text", "font", "focus"];

    /* ---- storage helpers ---- */
    function getMode() {
        return root.getAttribute("data-mode") || "normal";
    }

    var A11Y_MODE_DEFAULTS_KEY = "leonida-a11y-mode-defaults";

    function readA11yModeDefaults() {
        try { return JSON.parse(localStorage.getItem(A11Y_MODE_DEFAULTS_KEY) || "null"); }
        catch (e) { return null; }
    }

    function writeA11yModeDefaults(state) {
        try { localStorage.setItem(A11Y_MODE_DEFAULTS_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function clearA11yModeDefaults() {
        try { localStorage.removeItem(A11Y_MODE_DEFAULTS_KEY); } catch (e) {}
    }

    function setMode(mode) {
        var prev = getMode();

        if (mode === "normal") {
            root.removeAttribute("data-mode");
        } else {
            root.setAttribute("data-mode", mode);
        }
        try { localStorage.setItem("leonida-mode", mode); } catch (e) {}

        if (mode === "a11y" && prev !== "a11y") {
            /* Capture pre-A11Y values so the mode does not erase a user's
               manually chosen settings when they leave A11Y mode. */
            var before = {};
            var current = getA11y();
            ["motion", "transparency", "text"].forEach(function (k) {
                before[k] = current[k] === true;
                setA11y(k, true);
            });
            writeA11yModeDefaults(before);
        } else if (prev === "a11y" && mode !== "a11y") {
            /* Restore the values that existed immediately before entering
               A11Y mode. Manual changes made while A11Y was active remain
               effective until the user toggles the mode again. */
            var before = readA11yModeDefaults();
            if (before) {
                ["motion", "transparency", "text"].forEach(function (k) {
                    setA11y(k, !!before[k]);
                });
            }
            clearA11yModeDefaults();
        }

        syncUI();
        root.dispatchEvent(new CustomEvent("leonida-modechange"));
    }

    function getA11y() {
        try { return JSON.parse(localStorage.getItem("leonida-a11y") || "{}"); }
        catch (e) { return {}; }
    }

    function setA11y(key, on) {
        var state = getA11y();
        state[key] = on;
        try { localStorage.setItem("leonida-a11y", JSON.stringify(state)); } catch (e) {}
        if (on) { root.setAttribute("data-a11y-" + key, "on"); }
        else { root.removeAttribute("data-a11y-" + key); }
    }

    /* ---- restore the last used mode (the pre-paint script already applied
       data-mode/data-a11y-* on the documentElement before first paint; this
       keeps the in-memory state and the mode buttons in sync on load) ---- */
    function restoreMode() {
        var stored = null;
        try { stored = localStorage.getItem("leonida-mode"); } catch (e) {}
        if (stored === "a11y" || stored === "fast") {
            root.setAttribute("data-mode", stored);
        } else {
            root.removeAttribute("data-mode");
        }
    }

    /* ---- restore granular flags (pre-paint already applied attrs) ---- */
    function restoreA11yAttrs() {
        var state = getA11y();
        A11Y_KEYS.forEach(function (k) {
            if (state[k]) { root.setAttribute("data-a11y-" + k, "on"); }
        });
    }

    /* ---- mode switch buttons ---- */
    function syncUI() {
        var mode = getMode();
        document.querySelectorAll("[data-mode-set]").forEach(function (btn) {
            btn.setAttribute("aria-pressed", btn.dataset.modeSet === mode ? "true" : "false");
        });
        var state = getA11y();
        document.querySelectorAll("[data-a11y-toggle]").forEach(function (box) {
            box.checked = !!state[box.dataset.a11yToggle];
        });
    }

    function wire() {
        restoreMode();
        restoreA11yAttrs();

        document.querySelectorAll("[data-mode-set]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                setMode(btn.dataset.modeSet);
            });
        });

        document.querySelectorAll("[data-a11y-toggle]").forEach(function (box) {
            box.addEventListener("change", function () {
                setA11y(box.dataset.a11yToggle, box.checked);
                if (getMode() === "a11y") {
                    /* A manual change is an explicit user choice. Record it
                       as the restored value for this key if the user exits
                       A11Y mode before switching it again. */
                    var defaults = readA11yModeDefaults() || {};
                    defaults[box.dataset.a11yToggle] = box.checked;
                    writeA11yModeDefaults(defaults);
                }
            });
        });

        var panelBtn = document.querySelector("[data-a11y-panel]");
        var panel = document.getElementById("a11yPanel");

        if (panelBtn && panel) {
            function openPanel() {
                panel.removeAttribute("hidden");
                panelBtn.setAttribute("aria-expanded", "true");
                var first = panel.querySelector("input, button, [href], select, textarea");
                if (first) { first.focus(); }
            }

            function closePanel(refocus) {
                panel.setAttribute("hidden", "");
                panelBtn.setAttribute("aria-expanded", "false");
                if (refocus) { panelBtn.focus(); }
            }

            panelBtn.addEventListener("click", function () {
                if (panel.hasAttribute("hidden")) { openPanel(); }
                else { closePanel(false); }
            });

            document.addEventListener("click", function (e) {
                if (!panel.hasAttribute("hidden") &&
                    !panel.contains(e.target) &&
                    e.target !== panelBtn &&
                    !panelBtn.contains(e.target)) {
                    closePanel(false);
                }
            });

            /* Escape closes the panel and returns focus to its trigger */
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && !panel.hasAttribute("hidden")) {
                    closePanel(true);
                }
            });
        }

        syncUI();

        /* ---- Fast Mode: hover prefetch of navigation targets ---- */
        document.querySelectorAll("nav a[href]").forEach(function (a) {
            a.addEventListener("pointerenter", function () {
                if (getMode() !== "fast") { return; }
                if (document.querySelectorAll('link[rel="prefetch"][href="' + a.getAttribute("href") + '"]').length) { return; }
                var l = document.createElement("link");
                l.rel = "prefetch";
                l.href = a.getAttribute("href");
                document.head.appendChild(l);
            }, { once: true, passive: true });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wire);
    } else {
        wire();
    }
})();

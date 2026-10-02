/* ============================================================
   LEONIDA.RPF — ENTRY AGREEMENT
   One-time local acknowledgement for the site's epistemological
   basis and possible speculative-spoiler content.
   No account, tracking, or personal data.
   ============================================================ */
(function () {
    "use strict";

    var VERSION = "v1";
    var STORE_KEY = "leonida-entry-agreement-" + VERSION;
    var ACCEPTED = "accepted";
    var EXIT_URL = "https://www.rockstargames.com/VI";

    function hasAccepted() {
        try { return localStorage.getItem(STORE_KEY) === ACCEPTED; }
        catch (e) { return false; }
    }

    if (hasAccepted()) {
        document.documentElement.removeAttribute("data-entry-pending");
        document.documentElement.setAttribute("data-entry-accepted", "true");
        return;
    }

    document.documentElement.setAttribute("data-entry-pending", "true");

    var gate = document.createElement("section");
    gate.className = "entry-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "entryGateTitle");
    gate.setAttribute("aria-describedby", "entryGateCopy");

    gate.innerHTML =
        '<div class="entry-gate__backdrop"></div>' +
        '<div class="entry-gate__panel" role="document">' +
            '<div class="entry-gate__brand">LEONIDA.RPF</div>' +
            '<p class="entry-gate__eyebrow">RESEARCH ACCESS / EPISTEMOLOGICAL NOTICE</p>' +
            '<h1 id="entryGateTitle" class="entry-gate__title">POSSIBLE SPECULATIVE SPOILER WARNING</h1>' +
            '<p id="entryGateCopy" class="entry-gate__copy">LEONIDA.RPF contains independent research concerning Grand Theft Auto VI. Some material goes beyond officially confirmed information and includes analysis, inference, hypotheses, predictions, and other speculative interpretations. Some of that material may contain potential spoilers if a theory happens to be correct.</p>' +
            '<p class="entry-gate__copy entry-gate__rule"><strong>Speculation is not confirmation.</strong> The site distinguishes between <strong>WHAT WE KNOW</strong>, <strong>WHAT WE THINK</strong>, and <strong>WHAT WE DO NOT KNOW</strong>.</p>' +
            '<div class="entry-gate__actions">' +
                '<button type="button" class="entry-gate__accept" data-entry-accept>ACCEPT &amp; ENTER</button>' +
                '<button type="button" class="entry-gate__decline" data-entry-decline>DECLINE &amp; LEAVE</button>' +
            '</div>' +
            '<p class="entry-gate__foot">Independent archive · public information · evidence before interpretation</p>' +
        '</div>';

    function leave() {
        window.location.assign(EXIT_URL);
    }

    function accept() {
        try { localStorage.setItem(STORE_KEY, ACCEPTED); } catch (e) {}
        document.documentElement.removeAttribute("data-entry-pending");
        document.documentElement.setAttribute("data-entry-accepted", "true");
        gate.setAttribute("aria-hidden", "true");
        gate.classList.add("is-leaving");
        window.setTimeout(function () {
            if (gate.parentNode) { gate.parentNode.removeChild(gate); }
        }, 180);
    }

    gate.querySelector("[data-entry-accept]").addEventListener("click", accept);
    gate.querySelector("[data-entry-decline]").addEventListener("click", leave);

    /* Keep focus inside the agreement while it is active. */
    gate.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") { return; }
        var focusables = Array.prototype.slice.call(
            gate.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
        );
        if (!focusables.length) { return; }
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    document.body.appendChild(gate);
    window.requestAnimationFrame(function () {
        gate.classList.add("is-ready");
        var first = gate.querySelector("[data-entry-accept]");
        if (first) { first.focus(); }
    });
})();

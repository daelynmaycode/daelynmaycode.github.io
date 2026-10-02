/* ============================================================
   LEONIDA.RPF — BGM PLAYER
   A persistent music player injected on every page, using the
   same injection pattern as environment.js. Reads the central
   library from js/bgm-data.js — never hard-codes tracks.

   Playback : play/pause · prev/next (prev restarts if >3s in) ·
              seek · current/duration time · volume · mute
   Playlist : panel with direct selection · playing vs selected
              vs idle states shown as text (not colour alone)
   Shuffle  : real Fisher–Yates permutation of the whole list —
              next/prev walk the permutation; a fresh permutation
              is dealt at each pass end (never starting on the
              track that just finished). NOT "pick a random track".
   Repeat   : off → all → one, cycled. Auto-advance honours it;
              manual next/prev always wraps (browsing intent).
   Persist  : volume, mute, shuffle, repeat, track, position and
              play intent survive page loads via localStorage —
              resume after navigation is attempted and degrades
              to paused when autoplay is blocked.
   Static-hosting compatible: no build step, no fetch, no ES
   modules — one deferred classic script, like the rest.
   ============================================================ */
(function () {
    "use strict";

    var DATA = window.LEONIDA_BGM;
    if (!DATA || !DATA.tracks || !DATA.tracks.length) { return; }

    var TRACKS = DATA.tracks;
    var N = TRACKS.length;
    var STORE_KEY = "leonida-bgm";
    var reduceMotion = !!(window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    /* ---------- persisted state ---------- */

    var state = {
        index: 0,          // selected track (index into TRACKS)
        position: 0,       // seconds into the selected track
        volume: 0.8,
        muted: false,
        shuffle: false,
        repeat: "off",     // "off" | "all" | "one"
        playing: false     // intended playback state (restored best-effort)
    };

    function loadState() {
        try {
            var raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
            if (!raw) { return; }
            if (typeof raw.i === "number" && raw.i >= 0 && raw.i < N) { state.index = raw.i; }
            if (typeof raw.p === "number" && isFinite(raw.p) && raw.p >= 0) { state.position = raw.p; }
            if (typeof raw.v === "number" && raw.v >= 0 && raw.v <= 1) { state.volume = raw.v; }
            if (typeof raw.m === "boolean") { state.muted = raw.m; }
            if (typeof raw.s === "boolean") { state.shuffle = raw.s; }
            if (raw.r === "off" || raw.r === "all" || raw.r === "one") { state.repeat = raw.r; }
            if (typeof raw.w === "boolean") { state.playing = raw.w; }
        } catch (e) {}
    }

    var saveTimer = 0;
    function save() {
        if (saveTimer) { return; }
        saveTimer = setTimeout(function () {
            saveTimer = 0;
            try {
                localStorage.setItem(STORE_KEY, JSON.stringify({
                    i: state.index,
                    p: audio && audio.currentTime ? audio.currentTime : state.position,
                    v: state.volume,
                    m: state.muted,
                    s: state.shuffle,
                    r: state.repeat,
                    w: !!(audio && !audio.paused && !audio.ended)
                }));
            } catch (e) {}
        }, 300);
    }

    /* ---------- play order: natural vs Fisher–Yates permutation ---------- */

    var order = [];
    var pos = 0;

    function naturalOrder() {
        var a = [];
        for (var i = 0; i < N; i++) { a.push(i); }
        return a;
    }

    /* unbiased Fisher–Yates shuffle over a full copy of the list */
    function shuffledOrder() {
        var a = naturalOrder();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* a new shuffle pass that refuses to begin on `avoid` */
    function newPass(avoid) {
        if (state.shuffle) {
            order = shuffledOrder();
            if (order.length > 1 && order[0] === avoid) {
                var k = 1 + Math.floor(Math.random() * (order.length - 1));
                var t = order[0]; order[0] = order[k]; order[k] = t;
            }
        } else {
            order = naturalOrder();
        }
        pos = 0;
    }

    loadState();
    order = naturalOrder();
    if (state.shuffle) {
        order = shuffledOrder();
        var at = order.indexOf(state.index);
        if (at > 0) { order.splice(at, 1); order.unshift(state.index); }
        pos = 0;
    } else {
        pos = state.index;
    }

    /* ---------- element ---------- */

    var audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.hidden = true;
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);

    var started = state.position > 0 || state.playing;
    var seeking = false;
    var playToken = 0;

    /* ---------- inline SVG icons (stroke set + fill transport set) ---------- */

    function svg(inner, fill) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ' +
            (fill
                ? 'fill="currentColor" stroke="none"'
                : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') +
            '>' + inner + '</svg>';
    }

    var ICON = {
        play:   svg('<path d="M8 5v14l11-7z"/>', true),
        pause:  svg('<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>', true),
        prev:   svg('<path d="M6 6h2v12H6z"/><path d="M20 6L9 12l11 6z"/>', true),
        next:   svg('<path d="M16 6h2v12h-2z"/><path d="M4 6l11 6-11 6z"/>', true),
        shuffle: svg('<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>'),
        repeat: svg('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
        list:   svg('<path d="M3 6h13"/><path d="M3 12h13"/><path d="M3 18h9"/><path d="M19 15l3 3-3 3"/>'),
        volume: svg('<path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'),
        mute:   svg('<path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none"/><path d="M16 9l6 6"/><path d="M22 9l-6 6"/>')
    };

    /* ---------- DOM ---------- */

    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) { n.className = cls; }
        if (html != null) { n.innerHTML = html; }
        return n;
    }

    function fmtTime(s) {
        if (!isFinite(s) || s < 0) { s = 0; }
        s = Math.floor(s);
        var m = Math.floor(s / 60);
        var r = s % 60;
        return m + ":" + (r < 10 ? "0" : "") + r;
    }

    var wrap = el("aside", "bgm");
    wrap.setAttribute("aria-label", "Music player");

    var panel = el("div", "bgm-panel");
    panel.id = "bgmPanel";
    panel.hidden = true;

    var panelHead = el("div", "bgm-panel-head");
    panelHead.innerHTML =
        '<span class="bgm-album">' + DATA.artist + " — " + DATA.album + "</span>" +
        '<span class="bgm-count">' + N + " TRACKS</span>";
    panel.appendChild(panelHead);

    var list = el("ol", "bgm-list");
    TRACKS.forEach(function (t, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "bgm-track";
        b.setAttribute("data-track", String(i));
        b.setAttribute("aria-current", "false");
        b.innerHTML =
            '<span class="bgm-num">' + (t.track || i + 1) + "</span>" +
            '<span class="bgm-tk">' +
                '<span class="bgm-track-title">' + t.title + "</span>" +
                '<span class="bgm-track-meta">' + t.section + " · " + t.format +
                    " " + (t.sampleRate / 1000) + " kHz · " + t.channels + "ch</span>" +
            "</span>" +
            '<span class="bgm-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<span class="bgm-track-time">' + fmtTime(t.duration) + "</span>";
        li.appendChild(b);
        list.appendChild(li);
    });
    panel.appendChild(list);

    var panelFoot = el("div", "bgm-panel-foot");
    panelFoot.textContent = "ON DISK · " + DATA.source;
    panel.appendChild(panelFoot);

    var bar = el("div", "bgm-bar");

    var listBtn = document.createElement("button");
    listBtn.type = "button";
    listBtn.className = "bgm-btn";
    listBtn.setAttribute("data-bgm", "list");
    listBtn.setAttribute("aria-expanded", "false");
    listBtn.setAttribute("aria-controls", "bgmPanel");
    listBtn.setAttribute("aria-label", "Show playlist");
    listBtn.innerHTML = ICON.list;
    bar.appendChild(listBtn);

    var now = el("div", "bgm-now");
    now.innerHTML =
        '<span class="bgm-state" data-bgm-state>IDLE</span>' +
        '<span class="bgm-title" data-bgm-title></span>' +
        '<span class="bgm-sub" data-bgm-sub></span>';
    bar.appendChild(now);

    var transport = el("div", "bgm-transport");
    transport.innerHTML =
        '<button type="button" class="bgm-btn" data-bgm="prev" aria-label="Previous track">' + ICON.prev + "</button>" +
        '<button type="button" class="bgm-btn bgm-play" data-bgm="play" aria-label="Play">' + ICON.play + "</button>" +
        '<button type="button" class="bgm-btn" data-bgm="next" aria-label="Next track">' + ICON.next + "</button>";
    bar.appendChild(transport);

    var seekWrap = el("div", "bgm-seekwrap");
    seekWrap.innerHTML =
        '<span class="bgm-time" data-bgm-cur>0:00</span>' +
        '<input type="range" class="bgm-seek" data-bgm-seek min="0" max="100" step="0.5" value="0" aria-label="Seek position">' +
        '<span class="bgm-time" data-bgm-dur>0:00</span>';
    bar.appendChild(seekWrap);

    var extra = el("div", "bgm-extra");
    extra.innerHTML =
        '<button type="button" class="bgm-btn bgm-btn-text" data-bgm="shuffle" aria-pressed="false" aria-label="Shuffle" title="Shuffle">' +
            ICON.shuffle + "<span>SHUFFLE</span></button>" +
        '<button type="button" class="bgm-btn bgm-btn-text" data-bgm="repeat" aria-label="Repeat: off" title="Repeat">' +
            ICON.repeat + '<span data-bgm-repeat-label>REPEAT</span></button>' +
        '<button type="button" class="bgm-btn" data-bgm="mute" aria-pressed="false" aria-label="Mute" title="Mute">' + ICON.volume + "</button>" +
        '<input type="range" class="bgm-vol" data-bgm-vol min="0" max="1" step="0.01" aria-label="Volume">';
    bar.appendChild(extra);

    var live = el("span", "bgm-live");
    live.setAttribute("aria-live", "polite");

    wrap.appendChild(panel);
    wrap.appendChild(bar);
    wrap.appendChild(live);
    document.body.appendChild(wrap);
    document.body.classList.add("has-bgm");

    /* convenient handles for console debugging / testing */
    window.LEONIDA_PLAYER = {
        audio: audio,
        state: state,
        order: function () { return order.slice(); },
        position: function () { return pos; }
    };

    /* query handles */
    var stateEl  = now.querySelector("[data-bgm-state]");
    var titleEl  = now.querySelector("[data-bgm-title]");
    var subEl    = now.querySelector("[data-bgm-sub]");
    var curEl    = seekWrap.querySelector("[data-bgm-cur]");
    var durEl    = seekWrap.querySelector("[data-bgm-dur]");
    var seekEl   = seekWrap.querySelector("[data-bgm-seek]");
    var volEl    = extra.querySelector("[data-bgm-vol]");
    var repLabel = extra.querySelector("[data-bgm-repeat-label]");
    var playBtn  = transport.querySelector('[data-bgm="play"]');
    var shufBtn  = extra.querySelector('[data-bgm="shuffle"]');
    var repBtn   = extra.querySelector('[data-bgm="repeat"]');
    var muteBtn  = extra.querySelector('[data-bgm="mute"]');
    var trackBtns = Array.prototype.slice.call(list.querySelectorAll(".bgm-track"));

    /* ---------- playback core ---------- */

    function currentTrack() { return TRACKS[order[pos]]; }

    function play(token) {
        if (token == null) { token = playToken; }
        var p = audio.play();
        if (p && p.catch) {
            p.catch(function () {
                /* autoplay blocked (e.g. resume after navigation) — stay honest */
                if (token === playToken) { render(); }
            });
        }
    }

    function pause() { audio.pause(); }

    function togglePlay() {
        if (audio.paused) { started = true; play(); }
        else { pause(); }
    }

    function loadTrack(i, autoplay, startAt) {
        var mine = ++playToken;
        state.index = i;
        pos = order.indexOf(i);
        if (pos < 0) { pos = 0; }
        var t = TRACKS[i];
        audio.pause();
        audio.addEventListener("loadedmetadata", function apply() {
            if (mine !== playToken) { return; }   /* a newer load superseded this one */
            if (startAt > 0 && isFinite(audio.duration) && startAt < audio.duration - 1) {
                audio.currentTime = startAt;
            }
            render();
            if (autoplay) { play(mine); }
        }, { once: true });
        audio.src = encodeURI(t.src);
        audio.load();
        if (autoplay) { started = true; }
        announce(autoplay ? "Now playing" : "Selected", t);
        render();
        save();
    }

    function selectTrack(i) { loadTrack(i, true, 0); }

    /* advance — auto=true is the natural end of a track */
    function advance(auto) {
        /* auto-advance always plays; a manual skip continues the
           current intent (playing keeps playing, paused stays paused) */
        var shouldPlay = auto || !audio.paused;
        if (pos + 1 < order.length) {
            loadTrack(order[pos + 1], shouldPlay, 0);
            return;
        }
        if (auto && state.repeat !== "all") {
            /* repeat off: end of list stops playback (reset for next press) */
            try { audio.currentTime = 0; } catch (e) {}
            state.playing = false;
            render();
            save();
            return;
        }
        newPass(state.index);
        loadTrack(order[pos], shouldPlay, 0);
    }

    function goPrev() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        pos = pos > 0 ? pos - 1 : order.length - 1;
        loadTrack(order[pos], !audio.paused, 0);
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        var cur = state.index;
        if (state.shuffle) {
            order = shuffledOrder();
            var at = order.indexOf(cur);
            if (at > 0) { order.splice(at, 1); order.unshift(cur); }
            pos = 0;
        } else {
            order = naturalOrder();
            pos = order.indexOf(cur);
        }
        render();
        save();
    }

    function cycleRepeat() {
        state.repeat = state.repeat === "off" ? "all"
            : state.repeat === "all" ? "one" : "off";
        render();
        save();
    }

    function toggleMute() {
        state.muted = !state.muted;
        audio.muted = state.muted;
        render();
        save();
    }

    function announce(verb, t) {
        live.textContent = verb + ": " + t.title + " — " + t.artist;
    }

    /* ---------- render ---------- */

    function durationOf() {
        if (isFinite(audio.duration) && audio.duration > 0) { return audio.duration; }
        return currentTrack().duration;
    }

    function render() {
        var t = currentTrack();
        var playing = !audio.paused && !audio.ended;

        /* transport */
        playBtn.innerHTML = playing ? ICON.pause : ICON.play;
        playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");

        /* playback state as text first, colour second */
        var st = playing ? "PLAYING"
            : audio.error ? "ERROR"
            : started ? "PAUSED" : "IDLE";
        if (stateEl.textContent !== st) { stateEl.textContent = st; }
        stateEl.setAttribute("data-state", st.toLowerCase());

        /* now-playing block */
        titleEl.textContent = t.title;
        subEl.textContent = t.artist + " · track " + (t.track || (order[pos] + 1)) +
            "/" + N + " · " + t.section;

        /* times + seek (never fight a drag in progress) */
        var dur = durationOf();
        durEl.textContent = fmtTime(dur);
        seekEl.max = String(Math.floor(dur) || 100);
        if (!seeking) {
            seekEl.value = String(audio.currentTime || 0);
            curEl.textContent = fmtTime(audio.currentTime);
        }

        /* volume + mute */
        volEl.value = String(state.volume);
        muteBtn.innerHTML = state.muted ? ICON.mute : ICON.volume;
        muteBtn.setAttribute("aria-pressed", state.muted ? "true" : "false");
        muteBtn.setAttribute("aria-label", state.muted ? "Unmute" : "Mute");
        muteBtn.setAttribute("title", state.muted ? "Unmute" : "Mute");

        /* shuffle + repeat */
        shufBtn.setAttribute("aria-pressed", state.shuffle ? "true" : "false");
        repBtn.setAttribute("aria-label",
            "Repeat: " + state.repeat + (state.repeat === "off" ? " (click for all)" : " (click to change)"));
        repBtn.setAttribute("aria-pressed", state.repeat !== "off" ? "true" : "false");
        repLabel.textContent = state.repeat === "one" ? "REPEAT 1"
            : state.repeat === "all" ? "REPEAT ALL" : "REPEAT";
        repBtn.setAttribute("data-repeat", state.repeat);

        /* playlist rows: selected vs playing */
        trackBtns.forEach(function (b, i) {
            var isCur = i === state.index;
            var isPlaying = isCur && playing;
            b.classList.toggle("is-current", isCur);
            b.classList.toggle("is-playing", isPlaying);
            b.setAttribute("aria-current", isCur ? "true" : "false");
        });

        /* Media Session metadata follows the current track */
        if (navigator.mediaSession && window.MediaMetadata) {
            try { navigator.mediaSession.playbackState = playing ? "playing" : "paused"; } catch (e) {}
        }
    }

    /* ---------- audio element events ---------- */

    audio.addEventListener("play", function () { started = true; render(); save(); });
    audio.addEventListener("pause", function () { render(); save(); });
    audio.addEventListener("ended", function () {
        if (state.repeat === "one") {
            audio.currentTime = 0;
            play();
            return;
        }
        advance(true);
    });
    audio.addEventListener("timeupdate", function () {
        if (!seeking) {
            seekEl.value = String(audio.currentTime || 0);
            curEl.textContent = fmtTime(audio.currentTime);
            state.position = audio.currentTime;
        }
        save();
    });
    audio.addEventListener("loadedmetadata", function () {
        state.position = audio.currentTime;
        render();
    });
    audio.addEventListener("durationchange", render);
    audio.addEventListener("error", function () { render(); save(); });
    audio.addEventListener("volumechange", function () {
        state.volume = audio.volume;
        state.muted = audio.muted;
        render();
        save();
    });

    /* ---------- transport + toggles ---------- */

    wrap.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest("[data-bgm]") : null;
        if (!btn) { return; }
        var act = btn.getAttribute("data-bgm");
        if (act === "play") { togglePlay(); }
        else if (act === "prev") { goPrev(); }
        else if (act === "next") { advance(false); }
        else if (act === "shuffle") { toggleShuffle(); }
        else if (act === "repeat") { cycleRepeat(); }
        else if (act === "mute") { toggleMute(); }
        else if (act === "list") { togglePanel(); }
    });

    /* playlist: direct selection */
    list.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest(".bgm-track") : null;
        if (!b) { return; }
        var i = parseInt(b.getAttribute("data-track"), 10);
        if (!isNaN(i) && i >= 0 && i < N) { selectTrack(i); }
    });

    /* ---------- seek ---------- */

    seekEl.addEventListener("pointerdown", function () { seeking = true; });
    seekEl.addEventListener("input", function () {
        seeking = true;
        curEl.textContent = fmtTime(parseFloat(seekEl.value));
    });
    seekEl.addEventListener("change", function () {
        try { audio.currentTime = parseFloat(seekEl.value); } catch (e) {}
        seeking = false;
        curEl.textContent = fmtTime(audio.currentTime);
        save();
    });
    seekEl.addEventListener("pointerup", function () {
        /* safety: a release outside the track still ends the drag */
        if (seeking) {
            try { audio.currentTime = parseFloat(seekEl.value); } catch (e) {}
            seeking = false;
        }
    });

    /* ---------- volume ---------- */

    volEl.addEventListener("input", function () {
        var v = parseFloat(volEl.value);
        if (isFinite(v)) {
            audio.volume = v;
            if (v > 0 && audio.muted) { audio.muted = false; }
        }
    });

    /* ---------- playlist panel ---------- */

    function togglePanel(force) {
        var open = force != null ? force : panel.hidden;
        panel.hidden = !open;
        listBtn.setAttribute("aria-expanded", open ? "true" : "false");
        listBtn.setAttribute("aria-label", open ? "Hide playlist" : "Show playlist");
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !panel.hidden) {
            togglePanel(false);
            listBtn.focus();
        }
    });

    /* ---------- persistence across navigation ---------- */

    window.addEventListener("pagehide", function () {
        try {
            state.position = audio.currentTime || 0;
            localStorage.setItem(STORE_KEY, JSON.stringify({
                i: state.index,
                p: state.position,
                v: state.volume,
                m: state.muted,
                s: state.shuffle,
                r: state.repeat,
                w: !audio.paused && !audio.ended
            }));
        } catch (e) {}
    });

    /* ---------- Media Session (OS media keys / lockscreen) ---------- */

    function updateMediaSession() {
        if (!navigator.mediaSession || !window.MediaMetadata) { return; }
        var t = currentTrack();
        try {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: t.title,
                artist: t.artist,
                album: t.album
            });
            navigator.mediaSession.setActionHandler("play", function () { started = true; play(); });
            navigator.mediaSession.setActionHandler("pause", pause);
            navigator.mediaSession.setActionHandler("previoustrack", goPrev);
            navigator.mediaSession.setActionHandler("nexttrack", function () { advance(false); });
            navigator.mediaSession.setActionHandler("seekto", function (d) {
                if (d && typeof d.seekTime === "number") {
                    try { audio.currentTime = d.seekTime; } catch (e) {}
                }
            });
        } catch (e) {}
    }

    var lastMsid = -1;
    function syncMediaSession() {
        if (state.index === lastMsid) { return; }
        lastMsid = state.index;
        updateMediaSession();
    }

    /* ---------- init / restore ---------- */

    audio.volume = state.volume;
    audio.muted = state.muted;
    audio.src = encodeURI(currentTrack().src);
    audio.load();

    /* apply the saved position once metadata arrives */
    var initToken = playToken;
    var restoreAt = state.position;
    audio.addEventListener("loadedmetadata", function once() {
        if (initToken !== playToken) { return; }   /* user picked another track first */
        if (restoreAt > 0 && isFinite(audio.duration) && restoreAt < audio.duration - 1) {
            try { audio.currentTime = restoreAt; } catch (e) {}
        }
        render();
    }, { once: true });

    /* best-effort resume after navigation — degrades to PAUSED if blocked */
    if (state.playing) {
        audio.addEventListener("loadedmetadata", function once() {
            if (initToken !== playToken) { return; }
            started = true;
            play();
        }, { once: true });
    }

    shufBtn.setAttribute("aria-pressed", state.shuffle ? "true" : "false");
    render();
    syncMediaSession();

    /* keep Media Session metadata in step with track changes */
    var origRender = render;
    render = function () {
        origRender();
        syncMediaSession();
    };

    /* fast/a11y mode switches re-render nothing audio-related, but the
       modechange event is a cheap hook to flush state for observers */
    window.addEventListener("leonida-modechange", render);
})();
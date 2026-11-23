/* FF1 3D Remake — the portal's voice.
   ---------------------------------------------------------------------------
   Everything here is synthesised at runtime with the Web Audio API. There are
   no audio files, so nothing is downloaded, nothing is licensed from anyone,
   and every sound comes from one instrument family: a soft glass chime, a
   filtered air layer, and a slow pad in A minor.

   Rules this file keeps:
     - silence until the visitor asks for sound (no autoplay, ever);
     - one shared gain stage with a limiter, so nothing can clip;
     - per-cue cooldowns and a voice cap, so nothing machine-guns;
     - music and effects on independent gain buses;
     - preferences remembered in localStorage;
     - all volume changes are ramps, never jumps.

   Public hooks (used by js/app.js and by diagnostics):
     FFAudio.cue("open")
     FFAudio.setEnabled(true)
     FFAudio.state()
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var STORE_KEY = "ff1.audio.v1";
  var DEFAULTS = { configured: false, on: false, music: 0.45, sfx: 0.6 };
  var MAX_VOICES = 8;

  var COOLDOWN = {
    hover: 150,
    tap: 90,
    open: 260,
    close: 260,
    page: 700,
    crystal: 900,
    achievement: 1800,
    shimmer: 500,
    light: 900,
    fire: 900,
    ice: 900,
    storm: 900,
    water: 900,
    wind: 900,
    earth: 900
  };

  /* --- Preferences ------------------------------------------------------- */

  function clamp(value, min, max, fallback) {
    var n = Number(value);
    if (isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function load() {
    var saved = {};
    try {
      saved = JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}") || {};
    } catch (e) {
      saved = {};
    }
    return {
      configured: !!saved.configured,
      on: !!saved.on,
      music: clamp(saved.music, 0, 1, DEFAULTS.music),
      sfx: clamp(saved.sfx, 0, 1, DEFAULTS.sfx)
    };
  }

  var state = load();

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      /* Private mode or a full quota: the session still works, it just forgets. */
    }
  }

  /* --- Engine ------------------------------------------------------------ */

  var ctx = null;
  var master = null;
  var musicBus = null;
  var sfxBus = null;
  var limiter = null;
  var reverb = null;
  var noiseBuf = null;
  var voices = 0;
  var lastCue = {};
  var cueCount = {};
  var musicRunning = false;
  var chordTimer = 0;
  var bellTimer = 0;
  var chordIndex = 0;
  var lastHover = null;
  var arrivalPlayed = false;
  var pendingStart = false;

  function ensureContext() {
    if (ctx || !AudioCtx) return ctx;
    try {
      ctx = new AudioCtx();
    } catch (e) {
      ctx = null;
      return null;
    }

    limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -8;
    limiter.knee.value = 8;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.2;

    master = ctx.createGain();
    master.gain.value = 0;

    musicBus = ctx.createGain();
    musicBus.gain.value = 0;

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0;

    /* A small convolution room, generated rather than recorded. */
    reverb = ctx.createConvolver();
    reverb.buffer = impulse(1.7, 2.6);
    var wet = ctx.createGain();
    wet.gain.value = 0.3;

    musicBus.connect(master);
    sfxBus.connect(master);
    sfxBus.connect(reverb);
    reverb.connect(wet);
    wet.connect(master);
    master.connect(limiter);
    limiter.connect(ctx.destination);

    noiseBuf = makeNoise(2);

    return ctx;
  }

  function impulse(seconds, decay) {
    var rate = ctx.sampleRate;
    var length = Math.max(1, Math.floor(rate * seconds));
    var buffer = ctx.createBuffer(2, length, rate);
    for (var ch = 0; ch < 2; ch++) {
      var data = buffer.getChannelData(ch);
      for (var i = 0; i < length; i++) {
        var t = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return buffer;
  }

  function makeNoise(seconds) {
    var rate = ctx.sampleRate;
    var length = Math.max(1, Math.floor(rate * seconds));
    var buffer = ctx.createBuffer(1, length, rate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /* --- Voices ------------------------------------------------------------ */

  function countStop(at) {
    voices++;
    var ms = Math.max(60, (at - ctx.currentTime) * 1000);
    window.setTimeout(function () {
      voices = Math.max(0, voices - 1);
    }, ms);
  }

  function tone(o) {
    var at = o.at;
    var dur = o.dur;
    var osc = ctx.createOscillator();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.f, at);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, at + dur);

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(o.level, at + (o.attack || 0.01));
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    var node = gain;
    if (ctx.createStereoPanner && o.pan) {
      var pan = ctx.createStereoPanner();
      pan.pan.value = o.pan;
      gain.connect(pan);
      node = pan;
    }

    osc.connect(gain);
    node.connect(sfxBus);
    osc.start(at);
    osc.stop(at + dur + 0.05);
    countStop(at + dur);
  }

  function chime(freq, at, level, decay, pan) {
    var osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    var mod = ctx.createOscillator();
    mod.frequency.value = freq * 2.01;
    var modGain = ctx.createGain();
    modGain.gain.value = freq * 0.55;
    mod.connect(modGain);
    modGain.connect(osc.frequency);

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

    var node = gain;
    if (ctx.createStereoPanner && pan) {
      var p = ctx.createStereoPanner();
      p.pan.value = pan;
      gain.connect(p);
      node = p;
    }

    osc.connect(gain);
    node.connect(sfxBus);
    osc.start(at);
    mod.start(at);
    osc.stop(at + decay + 0.05);
    mod.stop(at + decay + 0.05);
    countStop(at + decay);
  }

  function air(o) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;

    var filter = ctx.createBiquadFilter();
    filter.type = o.filter || "bandpass";
    filter.frequency.setValueAtTime(o.from, o.at);
    if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, o.at + o.dur);
    filter.Q.value = o.q || 0.9;

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, o.at);
    gain.gain.exponentialRampToValueAtTime(o.level, o.at + (o.attack || 0.05));
    gain.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(sfxBus);
    src.start(o.at);
    src.stop(o.at + o.dur + 0.05);
    countStop(o.at + o.dur);
  }

  /* --- The cue catalogue ------------------------------------------------- */

  var CUES = {
    /* Interface: quiet, dry, short. */
    hover: function (t) {
      tone({ f: 1244, at: t, dur: 0.09, level: 0.026, pan: 0.22 });
    },
    tap: function (t) {
      tone({ f: 392, type: "triangle", at: t, dur: 0.11, level: 0.05 });
      tone({ f: 784, at: t + 0.012, dur: 0.15, level: 0.018 });
    },
    open: function (t) {
      chime(523.25, t, 0.03, 0.75, -0.15);
      chime(659.25, t + 0.055, 0.026, 0.85, 0.1);
      chime(783.99, t + 0.11, 0.02, 0.95, 0.25);
    },
    close: function (t) {
      chime(783.99, t, 0.026, 0.6, 0.15);
      chime(587.33, t + 0.05, 0.022, 0.7, -0.1);
    },

    /* Movement between pages and mysticism. */
    page: function (t) {
      air({ from: 520, to: 2400, at: t, dur: 0.44, level: 0.028, q: 0.7 });
      chime(880, t + 0.2, 0.038, 1.4, 0);
      chime(1318.5, t + 0.27, 0.016, 1.1, 0.3);
    },
    crystal: function (t) {
      chime(880, t, 0.052, 2.4, -0.05);
      chime(1174.66, t + 0.02, 0.03, 2.0, 0.2);
      chime(1760, t + 0.045, 0.014, 1.5, -0.25);
    },
    achievement: function (t) {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        chime(f, t + i * 0.11, 0.026, 1.1, i % 2 ? 0.16 : -0.16);
      });
    },
    shimmer: function (t) {
      for (var i = 0; i < 4; i++) {
        chime(1568 * (1 + i * 0.12), t + i * 0.05, 0.011, 0.55, 0.35);
      }
    },

    /* Elemental arrivals: one per page, played once, quietly. */
    light: function (t) {
      CUES.crystal(t);
    },
    fire: function (t) {
      air({ from: 900, to: 320, at: t, dur: 0.5, level: 0.032, q: 0.6 });
      tone({ f: 96, to: 62, at: t, dur: 0.45, level: 0.026 });
    },
    ice: function (t) {
      chime(2093, t, 0.014, 0.9, -0.2);
      chime(2637, t + 0.035, 0.013, 0.85, 0.15);
      chime(3136, t + 0.07, 0.01, 0.8, 0.3);
    },
    storm: function (t) {
      air({ from: 3200, to: 1200, at: t, dur: 0.16, level: 0.026, q: 0.5, filter: "highpass" });
      tone({ f: 70, to: 48, at: t, dur: 0.4, level: 0.03 });
    },
    water: function (t) {
      air({ from: 700, to: 300, at: t, dur: 0.7, level: 0.026, q: 0.8, filter: "lowpass", attack: 0.16 });
    },
    wind: function (t) {
      air({ from: 400, to: 1600, at: t, dur: 0.8, level: 0.022, q: 1.2, attack: 0.25 });
    },
    earth: function (t) {
      tone({ f: 72, to: 54, at: t, dur: 0.5, level: 0.034 });
      air({ from: 240, to: 120, at: t, dur: 0.35, level: 0.018, q: 1.4, filter: "lowpass" });
    }
  };

  function cue(id) {
    if (!state.on || !ctx || ctx.state !== "running") return;
    var handler = CUES[id] || CUES.tap;
    var now = window.performance ? window.performance.now() : Date.now();
    var gap = COOLDOWN[id] || 120;
    if (lastCue[id] && now - lastCue[id] < gap) return;
    if (voices >= MAX_VOICES) return;
    lastCue[id] = now;
    cueCount[id] = (cueCount[id] || 0) + 1;
    try {
      handler(ctx.currentTime + 0.01);
    } catch (e) {
      /* A suspended or interrupted context must never break the interface. */
    }
  }

  /* --- Music ------------------------------------------------------------- */

  /* An original progression in A minor: the mood of a stone hall, not a tune. */
  var CHORDS = [
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66],
    [164.81, 196.0, 246.94]
  ];

  var SCALE = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  function padNote(freq, at, dur, level, pan) {
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 3.2);
    gain.gain.setValueAtTime(level, at + dur - 4);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(760, at);
    filter.frequency.linearRampToValueAtTime(560, at + dur);
    filter.Q.value = 0.7;

    var a = ctx.createOscillator();
    a.type = "triangle";
    a.frequency.value = freq;
    a.detune.value = -4;

    var b = ctx.createOscillator();
    b.type = "sine";
    b.frequency.value = freq * 2.002;
    b.detune.value = 3;

    var bGain = ctx.createGain();
    bGain.gain.value = 0.28;

    var p = null;
    if (ctx.createStereoPanner) {
      p = ctx.createStereoPanner();
      p.pan.value = pan;
    }

    a.connect(gain);
    b.connect(bGain);
    bGain.connect(gain);
    gain.connect(filter);
    if (p) {
      filter.connect(p);
      p.connect(musicBus);
    } else {
      filter.connect(musicBus);
    }

    a.start(at);
    b.start(at);
    a.stop(at + dur + 0.1);
    b.stop(at + dur + 0.1);
  }

  function padChord(chord, at, dur) {
    chord.forEach(function (freq, i) {
      padNote(freq, at, dur, 0.055, (i - 1) * 0.35);
    });
  }

  function musicBell(freq, at, level, decay) {
    var osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

    var pan = null;
    if (ctx.createStereoPanner) {
      pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 0.7 - 0.35;
      gain.connect(pan);
      pan.connect(musicBus);
    } else {
      gain.connect(musicBus);
    }

    osc.connect(gain);
    osc.start(at);
    osc.stop(at + decay + 0.05);
  }

  function scheduleChord() {
    if (!musicRunning || !ctx) return;
    var dur = 20;
    var at = ctx.currentTime + 0.25;
    padChord(CHORDS[chordIndex % CHORDS.length], at, dur);
    chordIndex++;
    chordTimer = window.setTimeout(scheduleChord, (dur - 4.5) * 1000);
  }

  function scheduleBell() {
    if (!musicRunning || !ctx) return;
    if (!document.hidden) {
      var note = SCALE[Math.floor(Math.random() * SCALE.length)];
      musicBell(note, ctx.currentTime + 0.05, 0.028, 3.2);
    }
    bellTimer = window.setTimeout(scheduleBell, 2400 + Math.random() * 2600);
  }

  function startMusic() {
    if (!ctx || musicRunning) return;
    musicRunning = true;
    chordIndex = Math.floor(Math.random() * CHORDS.length);
    scheduleChord();
    bellTimer = window.setTimeout(scheduleBell, 1800);
  }

  function stopMusic() {
    musicRunning = false;
    window.clearTimeout(chordTimer);
    window.clearTimeout(bellTimer);
  }

  /* --- Gain staging ------------------------------------------------------ */

  function applyGains() {
    if (!ctx) return;
    var t = ctx.currentTime;
    master.gain.setTargetAtTime(state.on ? 0.85 : 0, t, 0.45);
    musicBus.gain.setTargetAtTime(state.on ? state.music * 0.5 : 0, t, 0.6);
    sfxBus.gain.setTargetAtTime(state.on ? state.sfx * 1.4 : 0, t, 0.35);
  }

  function startAudio() {
    if (!ensureContext()) return;
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    applyGains();
    startMusic();
    if (!arrivalPlayed) {
      arrivalPlayed = true;
      var element = document.body.getAttribute("data-element") || "light";
      window.setTimeout(function () {
        cue(element);
      }, 520);
    }
  }

  function setEnabled(on) {
    state.on = !!on;
    /* Touching the switch is itself an answer to the invitation. */
    state.configured = true;
    save();
    paint();
    if (state.on) {
      startAudio();
      window.setTimeout(function () {
        cue("crystal");
      }, 260);
    } else {
      applyGains();
      stopMusic();
    }
  }

  /* --- Interface --------------------------------------------------------- */

  var wrap = null;
  var btn = null;
  var more = null;
  var panel = null;
  var checkbox = null;
  var musicInput = null;
  var sfxInput = null;
  var prompt = null;

  function buildUI() {
    var bar = document.querySelector(".site-header .bar");
    if (!bar || document.querySelector("[data-audio]")) return;

    wrap = document.createElement("div");
    wrap.className = "audio";
    wrap.setAttribute("data-audio", "");
    wrap.innerHTML =
      '<button class="audio-btn" type="button" role="switch" aria-checked="false" aria-label="Sound" title="Sound is off — click to enable (M)" data-on="false">' +
      '<svg class="audio-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path class="ico-body" d="M4 9.4h3.1L11 6.2v11.6L7.1 14.6H4z"/>' +
      '<path class="ico-wave" d="M15 9.2a4.4 4.4 0 0 1 0 5.6M17.7 6.6a8 8 0 0 1 0 10.8"/>' +
      '<path class="ico-mute" d="M15.4 9.4l5 5.2M20.4 9.4l-5 5.2"/>' +
      "</svg>" +
      '<span class="audio-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
      "</button>" +
      '<button class="audio-more" type="button" aria-expanded="false" aria-controls="audio-panel" aria-label="Volume settings" title="Music and effects volume">' +
      '<svg class="audio-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M8 9.5h8M8 14.5h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
      "</svg>" +
      "</button>" +
      '<div class="audio-panel" id="audio-panel" role="group" aria-label="Audio settings" hidden>' +
      '<p class="audio-title">Atmosphere</p>' +
      '<label class="audio-switch">' +
      '<input type="checkbox" data-audio-on>' +
      '<span class="audio-track" aria-hidden="true"><span class="audio-knob"></span></span>' +
      '<span class="audio-switch-label" data-audio-word>Off</span>' +
      "</label>" +
      '<label class="audio-range"><span>Music</span><input type="range" min="0" max="100" step="1" value="45" data-audio-music aria-label="Music volume"></label>' +
      '<label class="audio-range"><span>Effects</span><input type="range" min="0" max="100" step="1" value="60" data-audio-sfx aria-label="Effects volume"></label>' +
      '<p class="audio-note">Synthesised live in your browser — no audio files. <kbd>M</kbd> mutes everything.</p>' +
      "</div>";

    bar.appendChild(wrap);

    btn = wrap.querySelector(".audio-btn");
    more = wrap.querySelector(".audio-more");
    panel = wrap.querySelector(".audio-panel");
    checkbox = wrap.querySelector("[data-audio-on]");
    musicInput = wrap.querySelector("[data-audio-music]");
    sfxInput = wrap.querySelector("[data-audio-sfx]");

    /* The speaker is the mute switch itself: one click, immediately silent. */
    btn.addEventListener("click", function () {
      setEnabled(!state.on);
    });

    more.addEventListener("click", function () {
      var open = more.getAttribute("aria-expanded") === "true";
      setPanel(!open);
      cue(open ? "close" : "open");
    });

    checkbox.addEventListener("change", function () {
      setEnabled(checkbox.checked);
      if (checkbox.checked) cue("open");
    });

    musicInput.addEventListener("input", function () {
      state.music = clamp(Number(musicInput.value) / 100, 0, 1, DEFAULTS.music);
      save();
      applyGains();
    });

    sfxInput.addEventListener("input", function () {
      state.sfx = clamp(Number(sfxInput.value) / 100, 0, 1, DEFAULTS.sfx);
      save();
      applyGains();
      cue("tap");
    });

    /* Allow the sliders to be dragged without the panel closing. */
    panel.addEventListener("pointerdown", function (event) {
      event.stopPropagation();
    });

    document.addEventListener("pointerdown", function (event) {
      if (!wrap.contains(event.target)) setPanel(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && more.getAttribute("aria-expanded") === "true") {
        setPanel(false);
        more.focus();
      }
    });

    paint();
  }

  function setPanel(open) {
    if (!panel || !more) return;
    panel.hidden = !open;
    more.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var first = panel.querySelector("input");
      if (first) first.focus();
    }
  }

  function paint() {
    document.body.setAttribute("data-audio", state.on ? "on" : "off");
    if (btn) {
      btn.setAttribute("aria-checked", state.on ? "true" : "false");
      btn.setAttribute("data-on", state.on ? "true" : "false");
      btn.setAttribute(
        "title",
        state.on ? "Sound is on — click to mute (M)" : "Sound is off — click to enable (M)"
      );
    }
    if (checkbox) checkbox.checked = state.on;
    if (musicInput) musicInput.value = String(Math.round(state.music * 100));
    if (sfxInput) sfxInput.value = String(Math.round(state.sfx * 100));
    var word = wrap && wrap.querySelector("[data-audio-word]");
    if (word) word.textContent = state.on ? "On" : "Off";
  }

  /* --- First-visit invitation -------------------------------------------- */

  function showPrompt() {
    if (prompt || state.configured || state.on || !document.body) return;

    prompt = document.createElement("div");
    prompt.className = "audio-prompt";
    prompt.setAttribute("role", "region");
    prompt.setAttribute("aria-label", "Enable ambient sound");
    prompt.innerHTML =
      "<p><strong>The portal has a voice.</strong> Ambient music and interface sound are available. Nothing plays until you ask for it.</p>" +
      '<div class="audio-prompt-actions">' +
      '<button type="button" data-audio-yes>Enable sound</button>' +
      '<button type="button" data-audio-no>Keep quiet</button>' +
      "</div>" +
      '<button class="audio-prompt-x" type="button" data-audio-no aria-label="Dismiss">×</button>';

    document.body.appendChild(prompt);

    function dismiss() {
      if (!prompt) return;
      var node = prompt;
      prompt = null;
      node.classList.add("is-hiding");
      window.setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 300);
    }

    prompt.querySelector("[data-audio-yes]").addEventListener("click", function () {
      state.configured = true;
      dismiss();
      setEnabled(true);
      setPanel(true);
      window.setTimeout(function () {
        setPanel(false);
        if (btn) btn.focus();
      }, 1600);
    });

    prompt.querySelectorAll("[data-audio-no]").forEach(function (node) {
      node.addEventListener("click", function () {
        state.configured = true;
        save();
        dismiss();
      });
    });
  }

  /* --- Wiring ------------------------------------------------------------ */

  var prompted = false;

  function onFirstGesture() {
    if (prompted) return;
    prompted = true;
    if (state.on) {
      startAudio();
    } else if (!state.configured) {
      window.setTimeout(showPrompt, 700);
    }
  }

  var GESTURES = ["pointerdown", "keydown", "touchend"];
  GESTURES.forEach(function (name) {
    document.addEventListener(name, onFirstGesture, { once: true, passive: true });
  });

  /* Hover feedback, delegated and throttled so it never chatters. */
  var HOVER_SELECTOR = ".btn, .shot, .cell, .track, .filter, .site-nav a, .ledger .row, .plate";

  document.addEventListener("pointerover", function (event) {
    if (!state.on || !event.target.closest) return;
    var node = event.target.closest(HOVER_SELECTOR);
    if (!node || node === lastHover) return;
    lastHover = node;
    cue("hover");
  });

  /* The mobile menu is a panel too, so it opens and closes in the same voice. */
  document.addEventListener("click", function (event) {
    if (!event.target.closest) return;
    var toggle = event.target.closest(".nav-toggle");
    if (!toggle) return;
    cue(toggle.getAttribute("aria-expanded") === "true" ? "open" : "close");
  });

  document.addEventListener("pointerout", function (event) {
    if (event.target === lastHover) lastHover = null;
  });

  /* M mutes from anywhere, as long as the visitor is not typing. */
  document.addEventListener("keydown", function (event) {
    if (event.key !== "m" && event.key !== "M") return;
    var tag = document.activeElement ? document.activeElement.tagName : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    setEnabled(!state.on);
    if (state.on) cue("crystal");
  });

  /* Cues announced by the rest of the site. */
  document.addEventListener("ff1:sound", function (event) {
    if (!event.detail || !event.detail.id) return;
    cue(event.detail.id);
  });

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) {
      stopMusic();
      if (ctx.suspend) ctx.suspend();
    } else if (state.on) {
      if (ctx.resume) ctx.resume();
      startMusic();
    }
  });

  buildUI();

  if (state.on) {
    pendingStart = true;
  }

  /* Diagnostics: lets a test ask what the engine believes, without guessing. */
  window.FFAudio = {
    cue: cue,
    setEnabled: setEnabled,
    /* Measures peak amplitude on the output stage for a moment. Diagnostic only. */
    probe: function (ms) {
      if (!ctx || !master) return Promise.resolve(null);
      var analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      /* A muted sink keeps the analyser in the rendered graph without adding output. */
      var sink = ctx.createGain();
      sink.gain.value = 0;
      master.connect(analyser);
      analyser.connect(sink);
      sink.connect(ctx.destination);
      var buffer = new Float32Array(analyser.fftSize);
      var peak = 0;
      var started = Date.now();
      return new Promise(function (resolve) {
        (function sample() {
          analyser.getFloatTimeDomainData(buffer);
          for (var i = 0; i < buffer.length; i++) {
            var v = Math.abs(buffer[i]);
            if (v > peak) peak = v;
          }
          if (Date.now() - started < (ms || 400)) {
            window.setTimeout(sample, 40);
          } else {
            master.disconnect(analyser);
            analyser.disconnect(sink);
            sink.disconnect();
            resolve(Number(peak.toFixed(4)));
          }
        })();
      });
    },
    toggle: function () {
      setEnabled(!state.on);
    },
    state: function () {
      return {
        configured: state.configured,
        on: state.on,
        music: state.music,
        sfx: state.sfx,
        context: ctx ? ctx.state : "none",
        musicRunning: musicRunning,
        voices: voices,
        cues: cueCount,
        master: master ? Number(master.gain.value.toFixed(3)) : null,
        musicGain: musicBus ? Number(musicBus.gain.value.toFixed(3)) : null,
        sfxGain: sfxBus ? Number(sfxBus.gain.value.toFixed(3)) : null,
        pendingStart: pendingStart
      };
    }
  };
})();

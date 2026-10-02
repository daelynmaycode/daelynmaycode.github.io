/* ============================================================
   LEONIDA.RPF — BGM LIBRARY DATA (single source of truth)
   The actual audio library on disk under audio/bgm/, audited
   2 Oct 2026 by parsing every WAV header directly:

     format  = RIFF/WAVE, PCM (1), 16-bit
     rate    = 48000 Hz, stereo (2ch), 192000 B/s
     tags    = no LIST/INFO metadata in any file — titles below
               are derived from the filenames (leading "N. "
               stripped, words capitalized); artist and album are
               derived from the folder "MAYCRY - All for One
               (Album)"; section from the subfolder. Nothing is
               invented. Filenames themselves are untouched.

   Display durations come from data-chunk-size ÷ byte-rate and
   are exact to a tenth of a second; the player also refreshes
   duration from the element's own metadata once loaded.
   Do not hard-code track info anywhere else — import this.
   ============================================================ */
(function () {
    "use strict";

    var BASE = "audio/bgm/MAYCRY - All for One (Album)";

    window.LEONIDA_BGM = {
        artist: "MAYCRY",
        album: "All for One",
        source: BASE,
        tracks: [
            {
                src: BASE + "/slow - melancholy/1. pulse of a star.wav",
                file: "1. pulse of a star.wav",
                title: "Pulse of a Star",
                artist: "MAYCRY",
                album: "All for One",
                section: "Slow — Melancholy",
                track: 1,
                duration: 204.0,
                format: "WAV",
                codec: "PCM 16-bit",
                sampleRate: 48000,
                channels: 2,
                sizeBytes: 39161708
            },
            {
                src: BASE + "/slow - melancholy/2. tommy's got a gun.wav",
                file: "2. tommy's got a gun.wav",
                title: "Tommy's Got a Gun",
                artist: "MAYCRY",
                album: "All for One",
                section: "Slow — Melancholy",
                track: 2,
                duration: 219.1,
                format: "WAV",
                codec: "PCM 16-bit",
                sampleRate: 48000,
                channels: 2,
                sizeBytes: 42072428
            },
            {
                src: BASE + "/slow - melancholy/3. liberty city.wav",
                file: "3. liberty city.wav",
                title: "Liberty City",
                artist: "MAYCRY",
                album: "All for One",
                section: "Slow — Melancholy",
                track: 3,
                duration: 207.9,
                format: "WAV",
                codec: "PCM 16-bit",
                sampleRate: 48000,
                channels: 2,
                sizeBytes: 39914348
            },
            {
                src: BASE + "/slow - melancholy/4. night on vice beach.wav",
                file: "4. night on vice beach.wav",
                title: "Night on Vice Beach",
                artist: "MAYCRY",
                album: "All for One",
                section: "Slow — Melancholy",
                track: 4,
                duration: 110.3,
                format: "WAV",
                codec: "PCM 16-bit",
                sampleRate: 48000,
                channels: 2,
                sizeBytes: 21175148
            },
            {
                src: BASE + "/fast - energetic/5. import export.wav",
                file: "5. import export.wav",
                title: "Import Export",
                artist: "MAYCRY",
                album: "All for One",
                section: "Fast — Energetic",
                track: 5,
                duration: 234.0,
                format: "WAV",
                codec: "PCM 16-bit",
                sampleRate: 48000,
                channels: 2,
                sizeBytes: 44937068
            }
        ]
    };
})();
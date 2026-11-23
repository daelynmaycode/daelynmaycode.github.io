# Final Fantasy I — 3D Remake · Development Portal

The public development log for an independent, from-scratch 3D remake of
*Final Fantasy I*, built in Godot 4.7. Static site, no build step, no
dependencies.

Live at **https://daelynmaycode.github.io/**

## Structure

```
index.html      Overview — vision, objectives, NES comparison, current status
progress.html   Ten development categories, stage-gated, with suite evidence
atlas.html      World layout, six regions, eight settlements, sixteen landmarks
gallery.html    36 real captures, filterable, with a lightbox and comparisons
                (the printed totals are counted from the DOM at runtime)
timeline.html   Dated development record and architectural decisions
roadmap.html    Completed, active, upcoming and long-term milestones
tales.html      The Tales of Light journal system
404.html        Root-absolute paths so it resolves at any URL depth
css/style.css   Design tokens, components, responsive rules
js/app.js       Mobile nav, gallery filter, lightbox, footer year
assets/img/     Downscaled captures (see assets/img/CREDITS.md for provenance)
```

No frameworks, no fonts or images loaded from other domains, no analytics.

## Updating progress

Progress claims must come from the project's own verification output, never from
intent.

1. Run the headless suites in the game project and note pass/fail counts.
2. Update the affected track in `progress.html`:
   - flip the `<span class="chip" data-state="...">` label,
   - move the gap text between **Working** / **Missing**,
   - update the four `.gate` elements (`data-g="done|active|planned"`).
3. Update the four counters in the stat strip at the top of the page.
4. If a counted list changed, update the matching `.meter` in "Coverage" — the
   fraction (`--p`) and the `1 of 8 · 12.5%` caption.
5. Add a dated entry at the top of `timeline.html`.
6. Move the milestone row in `roadmap.html` and adjust its checklist.
7. Update `lastmod` dates in `sitemap.xml`.

The three status words are fixed:

- **Implemented** — present, playable, covered by a suite, no blocking defect.
- **In development** — partially working, or blocked on art/content.
- **Planned** — specified, no runtime code.

## Updating images

Captures live in the game repository under `verification/`. Downscale to a
maximum width of 1280 px, save as JPEG (quality ~82), copy into `assets/img/`,
and add the mapping to `assets/img/CREDITS.md`. Keep total weight under ~4 MB and
keep `loading="lazy"` on everything below the fold.

## Local preview

Any static server works:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/`. `404.html` uses root-absolute paths, so
testing it requires serving from the project root.

## Legal

Fan project. Final Fantasy and all related marks are trademarks of Square Enix.
No original game code, art, audio or ROM is redistributed here. See `LICENSE`.

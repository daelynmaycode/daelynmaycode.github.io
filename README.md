````markdown
# LEONIDA.RPF

### Independent Technical Analysis of Rockstar's Open-World Technology

*Last updated 2026-10-02.*

**LEONIDA.RPF** is an independent research archive dedicated to examining how Rockstar Games advances the technical boundaries of open-world games.

The project focuses on **technology, systems, engineering decisions, and observable technical evolution** surrounding Grand Theft Auto VI and Rockstar's previous open-world work.

This is not a story-analysis site, leak archive, or speculation hub.

---

## What We Study

LEONIDA.RPF examines the technical systems that make Rockstar's open worlds possible.

Areas of research include:

- Rendering and graphical technology
- World streaming and memory management
- Physics and simulation
- Animation systems
- Procedural and contextual animation
- NPC behavior and simulation
- Pedestrian density and scheduling
- Vehicle simulation
- Environmental systems
- Weather and atmospheric simulation
- Destruction and physical interaction
- Audio technology
- Engine architecture
- Development tooling
- Technical scalability
- Hardware-generation transitions
- Performance and simulation budgets
- Evolution of Rockstar's open-world technology

The central question is:

> **How does Rockstar advance the technical boundaries of the open-world game?**

---

## What We Do Not Study

LEONIDA.RPF does **not** focus on:

- Story predictions
- Plot speculation
- Character arcs
- Dialogue
- Narrative theories
- Mission leaks
- Unverified feature lists
- Rumors presented as fact
- Unauthenticated claims about unreleased technology
- Reconstructing or distributing stolen development material

Characters, locations, or other game content may only be discussed when they are relevant to a **technical analysis**.

For example, a pedestrian crowd may be examined as evidence of simulation density.

The narrative purpose of that crowd is outside the scope of the project.

---

# Research Methodology

LEONIDA.RPF follows a simple rule:

> **Evidence comes before interpretation.**

Our analysis separates what is known from what is observed, what is inferred, and what remains hypothetical.

The basic analytical chain is:

```text
SOURCE
   ↓
OBSERVATION
   ↓
CONTEXT
   ↓
INFERENCE
   ↓
HYPOTHESIS
````

### Source

Something attributable and independently identifiable.

Examples include:

* Rockstar Games
* Take-Two Interactive
* Official trailers
* Official screenshots
* Rockstar Newswire
* SEC filings
* Documented developer statements
* Public technical documentation
* Historical Rockstar releases

### Observation

Something that can be directly examined.

Examples:

* A rendering technique visible in official footage
* Observable NPC behavior
* A visible animation system
* Environmental simulation
* Streaming behavior
* Development tooling visible in authenticated material

An observation should describe **what is present**, not what we think it means.

### Context

Relevant technical or historical information used to interpret an observation.

This may include:

* Previous Rockstar titles
* Known engine behavior
* Hardware capabilities
* Historical development practices
* Comparable open-world technology
* Established engineering constraints

### Inference

A conclusion that follows reasonably from the evidence and context.

An inference is not presented as a directly observed fact.

### Hypothesis

A reasoned explanation or prediction derived from the available evidence.

A hypothesis may be uncertain.

It must nevertheless have an identifiable evidentiary basis.

---

# Typography System

The interface is built on ten semantic font roles. Roles are **normative and stable across every theme** — themes may restyle colors, surfaces, and materials, but must never redefine what a font means.

## Font Roles

| Token | Font | Role |
|---|---|---|
| `--font-brand` | **Pricedown** | Branding only — wordmark, site identity, brand lockups. Never body copy or UI chrome. |
| `--font-interface` | **Chalet** | Navigation, menus, buttons, tabs, filters, search, headings, database readouts. |
| `--font-body` | **Helvetica** | Primary readable content — claim descriptions, articles, explanatory prose. |
| `--font-location` | **Sign Painter House** | Geographic identity — cities, counties, districts, landmarks. Physical-signage feel. |
| `--font-evidence` | **Courier 12 MT Std** | Evidence excerpts, source citations, verification records, claim provenance. |
| `--font-archive` | **Times New Roman CE** | Archival material — historical records, reproduced documents, preserved excerpts. |
| `--font-subtext` | **Arial** | Metadata, dates, captions, auxiliary labels, secondary statistics. |
| `--font-stamp` | **Stencil Std** | Status stamps — `CONFIRMED`, `UNVERIFIED`, `ARCHIVED`, `DISPROVEN`. Labeling language, not body text. |
| `--font-classified` | **Steinberg ITC Std** | Restricted material — classified notices, confidential file labels. Rarer than Stencil. |
| `--font-warning` | **Redemption** | Warning banners, volatile-information notices, high-priority cautions. Restrained usage. |

## Typography Hierarchy

```text
Pricedown          → branding / site identity
Chalet             → interface and application controls
Sign Painter House → locations and geographic identity
Helvetica          → primary readable content
Courier 12 MT Std  → evidence and verification
Times New Roman CE → archival material
Arial              → subtext and metadata
Stencil Std        → status stamps
Steinberg ITC Std  → classified material
Redemption         → warnings
```

## Semantic Components

Reusable primitives in `css/style.css`. The same components work under every theme — themes restyle surfaces, never font meaning.

- `.brand-lockup` — Pricedown identity heading
- `.claim` — the factual content of a record (Helvetica)
- `.evidence-block` — bordered, accent-ruled evidence excerpt (Courier)
- `.source-cite` — provenance citation line (Courier, uppercase)
- `.status-pill` / `.stamp` — epistemic status stamps (Stencil)
- `.location-name` / `.location-head` — geographic headings (Sign Painter)
- `.archive-record` — archival record wrapper (Times CE)
- `.classified-notice` — restricted-material notice (Steinberg, dashed border)
- `.warning-notice` — high-priority caution (Redemption)
- `.meta-row` — auxiliary metadata row (Arial, uppercase)

## Reading Typography Without a Legend

A user can identify information type from typography alone:

- Wordmark in **Pricedown** → this is branding.
- Control labels in **Chalet** → this is interface chrome.
- A claim's description in **Helvetica** → this is factual content.
- `SOURCE:` line in **Courier** → this is the record of what supports the claim.
- Date or ID in **Arial** → this is metadata.
- `CONFIRMED` in **Stencil** → this is a status stamp.
- Archive prose in **Times CE** → this is preserved material.
- Script heading in **Sign Painter** → this is a location.
- Dashed Steinberg block → restricted material.
- Redemption banner → warning.

---

## Environmental Motion System

The site runs a permanent atmospheric layer (`js/environment.js` + a dedicated
CSS block) so the database reads as a place, not a page:

- **Ambient loops (17–48 s, desynchronized):** a drifting neon field (pink /
  cyan / purple / amber), a slow sunset sky-cycle, coastal haze, and three
  breathing neon blooms behind the glass. Never synchronized, never fast.
- **Glass reacts to environment:** a light sheen travels across the sticky
  navigation every 14 s; card borders catch neon color on hover; the nav's
  `backdrop-filter` picks up the moving blooms behind it.
- **Cursor as light:** a soft cyan/pink glow follows the pointer (rAF-eased,
  `--mx/--my` variables); cards carry a localized highlight at `--lx/--ly`.
- **Scroll parallax:** atmosphere, blooms, and hero move at different rates
  (0.015×–0.06×) via `--scroll-y`; content itself never parallaxes.
- **Page transitions:** View Transitions API where supported — old page fades
  through blur, new page resolves through glass (260 ms out / 420 ms in);
  instant swap elsewhere.
- **Database motion:** tab filters and archive search fade entries
  contextually rather than snapping; expandable evidence resolves through
  the record shell.
- **Reduced motion:** all loops stop, parallax and cursor light disabled,
  transitions collapse to 1 ms — the Vice City identity is preserved through
  color, gradients, glass material, and typography alone.

Environment tokens (`--ocean`, `--neon-pink`, `--neon-purple`,
`--neon-amber`, `--sunset-a/b`, `--atmo-speed-*`, `--glass-sheen-speed`,
`--sky-cycle-speed`) live in `:root` so weather-style ambient states can be
added later as pure variable swaps.

---

# Presentation Modes

The interface ships **one component architecture** with three presentation
priorities. Theme (appearance), mode (performance), and accessibility
(accommodation) are architecturally separate and freely combinable.

| Mode | Priority | Behaviour |
|---|---|---|
| **Normal** | beautiful | Full liquid-glass material and ambient environment motion. |
| **A11Y** | adaptable | Motion loops stop, translucent surfaces become opaque, and root text scales up. |
| **Fast** | responsive | No `backdrop-filter`, no ambient loops, no transitions — lowest-cost rendering. |

Mode is chosen from the control cluster in the header (`NORMAL / A11Y /
FAST`) and persisted in `localStorage` as `leonida-mode`. The inline
pre-paint script in every page applies the stored mode (and accessibility
flags) to `<html>` before first paint, so there is no theme flash.

## Accessibility Accommodations

The **OPTIONS** button opens a panel (`#a11yPanel`) with seven independent
accommodations. Each is stored in `localStorage` as `leonida-a11y` and
applied as `html[data-a11y-<key>="on"]`:

```text
motion        REDUCE MOTION      stop ambient loops, parallax, cursor light
contrast      HIGH CONTRAST      raise ink/line contrast (dark + light aware)
transparency  OPAQUE SURFACES    replace translucent glass with solid surfaces
blur          DISABLE BLUR       remove backdrop-filter without changing colour
text          LARGER TEXT        scale the rem-based root font size
font          LEGIBLE TYPE       swap decorative font roles for readable ones
focus         STRONG FOCUS       heavier focus-visible outline
```

Accommodations work in **any** mode and are independent of the theme.
Selecting the A11Y mode enables `motion`, `transparency`, and `text` as
intelligent defaults; leaving A11Y mode withdraws those defaults, while any
flag toggled manually through the panel is preserved.

`prefers-reduced-motion: reduce` and `prefers-contrast` remain honoured
automatically, independently of the manual controls.

---

# Predictions

LEONIDA.RPF uses the term **prediction** carefully.

A prediction is **not a guess**.

A prediction is a reasoned hypothesis constructed from:

```text
Observed Evidence
+
Technical Context
+
Historical Precedent
+
Comparative Inference
=
Reasoned Hypothesis
```

For example:

> Publicly observable evidence indicates substantially greater world simulation density. Rockstar has historically increased systemic complexity between generations. This is consistent with further advances in streaming, entity scheduling, and simulation prioritization.

That is an analytical hypothesis.

It is different from:

> Rockstar definitely has system X.

unless system X has actually been established by evidence.

---

# Geographic Research — Get to Know Leonida

`geography.html` is a **geographic research archive** of the state of Leonida. It exists to answer *what Leonida is*, not to list places.

## The central finding

**Rockstar Games has officially named seven places.**

| Place | Type | How Rockstar names it |
|---|---|---|
| **Vice City** | City | Place artwork + "Vice City, USA." |
| **Leonida Keys** | Island region | Place artwork + destination link |
| **Mount Kalaga National Park** | National park | Place artwork + destination link |
| **Grassrivers** | Town | Place artwork + destination link |
| **Port Gellhorn** | Town | Place artwork + destination link |
| **Ambrosia** | Town | Place artwork + destination link |
| **Leonida Penitentiary** | Facility | Official character biography |

The six destinations are the ones Rockstar links to with their own profile from its "Only in Leonida" page. The penitentiary is named only in official character copy, which is why it is a place record without a destination page.

That list is the entire official geographic spine. It is a **floor, not a ceiling** — it records what Rockstar has published, not what the game contains.

## What the section deliberately does not contain

A large county and district list circulates online. It is **not** established, and the third-party wiki carrying it banners its own Leonida page as possibly containing leaked development content.

Those names — six counties, roughly twenty Vice City districts, an international airport, a raceway, named islands and named highways — are **quarantined** in the "Unidentified / Uncertain" section. They are:

- never plotted on the diagram
- never counted in any total
- never used to infer structure
- never presented as Leonida locations

The site footer reads **WE DO NOT SHARE LEAKS.** Recording the claim so a visitor can identify and dismiss it is different from repeating it as geography.

## Rules this section follows

- **Only Rockstar-attributable names enter the place database.** A name counts if it appears on a Rockstar property.
- **Absence of evidence is recorded, not assumed.** Rockstar has published no counties, districts, roads, rivers, airports or landmarks. Each gap is logged as a finding, and each is explicitly distinguished from evidence that the feature does not exist.
- **No false precision.** The map is a *relation diagram*, not a map: no borders, coordinates, scale bar or orientation, because none is established. Every node is a labelled control and the same data is restated as a text list.
- **Real-world comparison is quarantined from Leonida evidence.** Florida explains Leonida's form. It never establishes its geography — most importantly, the real Everglades is a wetland and GTA VI has established no wetland at all.
- **Observation is not naming.** Rockstar can show you a beach without ever calling it one, and an alligator mascot is a branding fact, not an ecological one.
- **Technical implications are analysis.** Every row is labelled, and the weakest row is flagged as speculation precisely because a national park is not evidence of a streaming technique.
- **No spoilers.** Geography only. Plot information is excluded unless it is needed to explain what a place is or who established it.

### Adding a place

All records live in `js/geo-data.js` as plain JavaScript objects. Append one object to `GEO_PLACES` and add its source ID to `GEO_SOURCES` — the card, the filter, the diagram and the evidence record all read from the same data. Nothing in the markup needs to change.

Adding a position to the relation diagram means adding an entry to the `POS` map in the page script. A place without a position is valid; it simply does not appear as a node.

### Verification

Verified 2 October 2026 against the official GTA VI site, the "Only in Leonida" people-and-places page, the official screenshot and artwork index, Trailer 1, the Rockstar Store product page, the Vice City Collection merchandise page, and an attributable Rob Nelson map-scale statement. 17 evidence records carry per-claim limitations.

---

# Editions & Purchase Reference

`editions.html` documents the **documented market** for Grand Theft Auto VI — what Rockstar has actually offered, not what a retailer calls it.

This section exists because five different concepts are routinely collapsed into one:

| Concept | What it is |
|---|---|
| **Game Edition** | Standard Edition, Ultimate Edition |
| **Upgrade** | Ultimate Edition Upgrade — a separate add-on |
| **Purchase Format** | Digital, Physical (Code-in-Box) |
| **Pre-Order Benefit** | Vintage Vice City Pack, one month of GTA+ |
| **Collector Product** | The Goodtime State – Vice City Collection |

Collapsing them produces the two most common errors on this subject: treating the Collector's Box as a third game edition (it is merchandise, and the Rockstar Store states the game is sold separately), and treating "physical" as disc-based (the physical product contains a download code and no disc).

### Rules this section follows

- **No invented editions.** No Deluxe, Collector's, Gold or Premium *game* editions exist. Those names either describe real merchandise or retailer invention.
- **No recommendations.** No "best edition", no "worth it". The page records differences and lets the visitor decide.
- **Unknown stays unknown.** Where a storefront published no price or no rule, the field reads UNKNOWN rather than being estimated.
- **Prices are never merged across regions.** Each figure records currency, region, storefront and date.
- **Availability is timestamped.** Statuses are observations with a verification date, so history is preserved rather than silently overwritten.

### Adding a future offering

All records live in `js/editions-data.js` as plain JavaScript objects. Append one object to the relevant array — `GAME_EDITIONS`, `UPGRADE`, `PURCHASE_FORMATS`, `PREORDER_BENEFITS`, `COLLECTOR_PRODUCT` — and the page picks it up. No markup changes are required, and the filter bar, comparison table and evidence record all read from the same data.

Every record carries its own `sources` array of source IDs, and every material claim can be registered in `EVIDENCE_RECORDS` with an explicit `limitations` field.

---

# Historical Comparative Analysis

Rockstar's previous games are important because technological progress does not happen in isolation.

LEONIDA.RPF examines technical trajectories across generations, including:

```text
Grand Theft Auto III
        ↓
Grand Theft Auto: San Andreas
        ↓
Grand Theft Auto IV
        ↓
Red Dead Redemption
        ↓
Grand Theft Auto V
        ↓
Red Dead Redemption 2
        ↓
Grand Theft Auto VI
```

The purpose is not to assume that a previous implementation exists unchanged in a later game.

Instead, previous titles provide **comparative evidence**.

We ask:

* What changed?
* What remained?
* What technical problem was Rockstar solving?
* What new constraints appeared?
* What became possible with newer hardware?
* How did simulation density evolve?
* How did rendering techniques evolve?
* How did world streaming evolve?
* What engineering patterns persist across generations?

Historical precedent can strengthen an inference.

It cannot transform an inference into confirmed fact.

---

# Evidence Standards

LEONIDA.RPF uses a source hierarchy.

### 01 — Primary Official Source

The highest standard.

Examples:

* Rockstar Games
* Take-Two Interactive
* Official Rockstar publications
* Officially released footage
* Officially released screenshots

### 02 — Publicly Documented Record

Examples:

* SEC filings
* Dated corporate statements
* Attributable developer interviews
* Documented technical presentations

### 03 — Directly Observable Material

Material whose content can be directly examined and whose provenance is established.

### 04 — Comparative Evidence

Historical Rockstar technology, previous games, known hardware constraints, and relevant engineering precedent.

### 05 — Secondary Reporting

Journalism and reporting may be useful for chronology, attribution, or corroboration.

Secondary reporting is evaluated rather than automatically accepted.

### 06 — Unverified Claims

Unverified claims are **not evidence**.

Repeated claims do not become evidence merely because they are widely circulated.

---

# Assumptions

Some technical analysis requires assumptions.

That does not make those assumptions facts.

Whenever an assumption is necessary, it must be explicitly marked:

```text
ASSUMPTION
```

An assumption must never be silently incorporated into an analysis.

It must remain distinguishable from:

* confirmed information
* direct observation
* inference
* hypothesis

### Example

The September 2022 breach produced development footage from multiple internal builds.

The exact internal build dates and a precise Rockstar-defined development-completion percentage are not publicly established.

Therefore, any estimate such as:

```text
20–35% content-complete
```

must be treated strictly as:

```text
ASSUMPTION / ANALYTICAL ESTIMATE
```

It is **not** a documented Rockstar metric.

The estimate may be useful for constructing a technical model, but it cannot be cited as evidence of Rockstar's actual development progress.

---

# The September 2022 Breach

Rockstar Games and Take-Two have publicly acknowledged the September 2022 intrusion.

Take-Two's September 2022 SEC filing described the incident as unauthorized access to confidential information, including **early development footage for the next Grand Theft Auto**.

The existence of the breach is therefore an established historical fact.

However, the existence of authenticated breach material does not automatically authenticate:

* Every file circulating online
* Every screenshot attributed to the breach
* Every claimed internal build
* Every supposed development document
* Every reconstruction or compilation
* Every subsequent leak claim

Authentication is evaluated independently.

LEONIDA.RPF does not treat internet circulation as proof of provenance.

---

# Early Development Material

Where authenticated development material is relevant to technical research, LEONIDA.RPF may examine **technical characteristics** of that material.

Examples include:

* Debug interfaces
* Development tools
* Placeholder assets
* Incomplete systems
* Animation development
* Rendering behavior
* Simulation behavior
* Build-state characteristics
* Technical artifacts associated with development

The purpose is to understand **development and technological progression**, not to reproduce or distribute stolen game content.

The exact internal builds represented by publicly discussed footage are not treated as known unless their provenance is independently established.

---

# No Leak Distribution

LEONIDA.RPF does not:

* Host leaked game builds
* Distribute stolen material
* Provide download links to stolen material
* Archive leaked assets
* Publish private development files
* Present leaked claims as official information

Publicly documented information concerning the 2022 breach may be discussed when relevant to provenance, chronology, or technical analysis.

---

# Analytical Integrity

Every LEONIDA.RPF analysis should make a distinction between:

```text
WHAT WE KNOW
```

and

```text
WHAT WE THINK THE EVIDENCE MEANS
```

Those are not the same thing.

A strong analysis should make it possible for another reader to:

1. Identify the evidence.
2. Examine the observation.
3. Understand the relevant context.
4. Follow the reasoning.
5. Identify any assumptions.
6. Determine where the evidence ends.
7. Reach their own conclusion.

The objective is not to make a theory sound convincing.

The objective is to make the **reasoning inspectable**.

---

# Technical Research Philosophy

LEONIDA.RPF approaches Rockstar's games as evolving technical systems.

An open-world game is not simply a collection of assets.

It is an interaction between:

* Rendering
* Simulation
* AI
* Animation
* Physics
* Streaming
* Memory
* CPU scheduling
* GPU workloads
* Storage
* Networking
* Audio
* Tooling
* Hardware constraints

Increasing complexity in one subsystem can require changes throughout the architecture.

Therefore, LEONIDA.RPF attempts to understand GTA VI not only as a game, but as the next stage in a long technical trajectory.

---

# Project Structure

The public site is organized around several research categories:

```text
LEONIDA.RPF
│
├── index.html          — Home / dashboard
├── predictions.html    — Evidence-based hypotheses
├── weapons.html        — Weapons & combat log
├── analysis.html       — Technical investigations
├── opinions.html       — Clearly identified editorial
├── confirmed.html      — Publicly established information
├── archive.html        — Chronological research record
├── dossier.html        — RAGE technical dossier (GTA III → GTA VI)
├── 404.html            — Not-found page (same shell as the site)
├── favicon.svg         — Site icon
├── robots.txt          — Crawler rules + sitemap pointer
├── sitemap.xml         — Index of published pages
├── LICENSE             — MIT
├── .nojekyll           — GitHub Pages: serve every file verbatim
│
├── css/
│   └── style.css       — Site stylesheet (tokens, themes, components, modes)
│
├── js/
│   ├── environment.js  — Ambient environment driver (cursor light, parallax)
│   ├── modes.js        — Presentation mode + accessibility manager
│   ├── bgm-data.js     — BGM library data (central playlist definition)
│   └── player.js       — Music player (transport, playlist, shuffle, repeat)
│
├── audio/
│   └── bgm/            — Background music library (MAYCRY — "All for One", WAV)
│
└── README.md           — Research and evidence standards
```

The website is currently implemented as a static GitHub Pages project.

Source reference material — the PDF research archive and the Windows cursor
set — is deliberately kept **outside the published root**, in `../_source/`,
so it is preserved but never served.

## Discovery & Metadata

Every page carries a canonical URL, Open Graph / Twitter-card tags, and
light/dark `theme-color` values. `robots.txt` allows crawling and points to
`sitemap.xml`, which lists the eight published pages (`404.html` is excluded
and marked `noindex`).

Code is released under the **MIT License** (`LICENSE`). Editorial content
remains the property of its author.

---

# Editorial Standard

Every published entry should answer, as clearly as possible:

> **What is the evidence?**

> **What can directly be observed?**

> **What historical or technical context matters?**

> **What is being inferred?**

> **What assumptions are required?**

> **What remains uncertain?**

If those questions cannot be answered, the claim does not belong in the analysis as an established conclusion.

---

# Core Principle

> **Do not speculate about what Rockstar might do.**
>
> **Study what Rockstar has demonstrated, compare it with what Rockstar has done before, and develop the most defensible technical interpretation the evidence allows.**

**LEONIDA.RPF**

*Independent technical analysis of Rockstar's open-world technology.*

**WE DO NOT SHARE LEAKS.**

```
```


## Release Structure & Runtime Enhancements

The published root contains only deployable site material. Browser profiles, screenshot captures, temporary QA scripts, working artifacts, and unfinished experiments are kept out of the release package.

Global runtime enhancements include the persistent BGM player, atmospheric environment, presentation modes, accessibility controls, the entry agreement, and native multi-page View Transitions where supported. The supplied `images/Leonida-RPF-LOGO.png` asset is the authoritative master brand mark; `images/Leonida-RPF-LOGO-header.png` is its web-sized header derivative.

The entry agreement is stored locally as `leonida-entry-agreement-v1`; it records only whether the visitor accepted the site's epistemological notice. No account or personal information is required.

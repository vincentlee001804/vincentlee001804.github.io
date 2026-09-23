# Vincent Lee — Director's Cut

**Director's Cut** — a cinematic, film-acts personal site. A retelling of
"pipelines that think" as a film in six acts.

- Static HTML + Tailwind (CDN) + GSAP ScrollTrigger + vanilla JS
- No build step — deploy as-is

Design: Bebas Neue (title cards) + Inter (body) + JetBrains Mono (timecodes/slates)

## Preview

Serve the folder with any static server, e.g.:

```
npx serve .
```

Then check desktop and a narrow mobile width. `file://` works too, but a local
HTTP server is closer to production.

## What's on the page

| Cut | Section | Signature |
|---|---|---|
| 00 | Cold Open | Title cards, rating gag, timecode starts ticking |
| 01 | Logline | Clapperboard slate, hover-reveal portrait, margin notes |
| 02 | The Feature Presentation | Six pinned acts — titles *cut*, shots *cross-fade* |
| 03 | The Reel | Horizontal filmstrip, contact-sheet cards **develop** on hover |
| 04 | Call Sheet | Production table, rows expand with notes from set |
| 05 | Gear List | Crew gear list + credit-roll marquee |
| 06 | End Credits | Scroll-driven credit roll → "Want in on the next one?" |

## Image slots

Every image ships as WebP in `assets/`. Keep filenames matching the slot name
and keep the ratios: the Reel is `4:5`, the portrait `3:4`, and the acts
letterbox their native ratio inside a 16:9 ink gate — never crop.

| Slot | File | Ratio | Status |
|---|---|---|---|
| `hero-portrait` | `hero-portrait.webp` | 3 : 4 | filled |
| `act-01` … `act-04` | `act-01.webp` … `act-04.webp` | letterboxed | filled |
| `act-05` | `act-05-1.webp`, `act-05-2.webp` | 3 : 2 | filled — Act V fades through ink between the pair |
| `act-06` | `act-06.webp` | — | **awaiting file** — a `?` slate is showing |
| `reel-01` … `reel-04` | `reel-01.webp` … `reel-04.webp` | 4 : 5 | filled |

Meaningful `alt` text on every image — it becomes content, not decoration.

## Publishing updates

This repo is the deployed artifact. To ship a change, copy the updated files in
(`index.html`, `style.css`, `script.js`, `assets/*`), then:

```
git add -A
git commit -m "Describe the change"
git push
```

Pages redeploys from `main` automatically.

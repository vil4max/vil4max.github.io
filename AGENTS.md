# AGENTS.md

Thin project notes for the public portfolio site (`vil4max.github.io`). Career facts stay in the sibling `career` repo.

## Ownership

- Synced copy: career `presentation/projects.md` → marked `PROJECT:*:CONTENT` regions in `projects.html` / landing.
- Page layout and media (screenshots, grids, App Store links) stay HTML/JS-owned. Do not put mosaic markup inside synced CONTENT regions.

## Case-study media mosaic

Pattern name: **copy-height-bounded justified mosaic** (Flickr-inspired cover tiles).

The projects page is static. Every media case study hardcodes:

- `data-tile-pattern` on `.case-study__media`
- DOM order of `<img>` = visual slots
- optional `data-media-kind="ui"|"photo"` for object-position (`center top` vs `center`)
- optional `data-tile-hero-shape="square"` on the hero `<img>` (or `data-media-kind="photo"` / near-square ratio) so `hero-details` / `device-hero` widen the left track into a **square window** instead of a tall phone strip

### Patterns

| Pattern | Topology |
|---|---|
| `hero-details` | 1 large left (2 rows) + 2 stacked right — use when hero differs from details |
| `device-hero` | same grid; device story (Watch) |
| `row-3` | three equal tiles in one row — similar phone screens, no forced hero span |
| `product-context` | 1 wide top + 2 below |
| `one-plus-2x2` | 1 large left + 2x2 compact (Electus) |

### Rules

1. Tile slots are fixed windows sized from each asset's aspect ratio. Prefer matching windows so cover does not distort; never stretch bitmaps.
2. Desktop: if natural mosaic height exceeds copy height, **uniformly shrink width** only. Do not stretch row heights to fill copy.
3. Every mosaic is **centered** in the media column slot (`justify-self: center`), not edge-pinned.
4. Outer media box is always a clean rectangle.
5. Tap / Enter / Space opens fullscreen lightbox (`object-fit: contain`) with prev/next in the same case study.
6. JS only executes the named pattern — do not reintroduce aspect-ratio auto classifiers.
7. Square / landscape heroes in `hero-details` get unequal columns so the left slot is ~1:1 (Drinkit pickup photo).
8. When three similar phones fit, use `row-3` instead of forcing `hero-details`.

Implementation: `portfolio.js`, styles in `resume.css`.

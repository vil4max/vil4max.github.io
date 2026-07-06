# Maintainer contract — vil4max.github.io resume

## Source of truth

- **Edit only:** `../career/source-of-truth.md` (private `career` repo)
- **Never hand-edit:** `content/resume-source.json`, synced HTML sections, PDFs
- **Generated chain:** `career/source-of-truth.md` → generate-public-resume → `content/resume.md` (local, gitignored) → parse → compare-json → `resume-source.json` → sync HTML (`index.html`, `resume-one-page.html`) → validate → PDFs

## Build commands

```bash
cd vil4max.github.io
npm run resume:build
npm run resume:check
```

Individual steps: `generate-public-resume.mjs`, `resume:parse`, `resume:compare-json`, `resume:validate`, `resume:pdf`

Do not publish root `resume.md` or `profile.md` — recruiter surface is PDF + online resume only (`npm run resume:build` does not copy Markdown to site root).

One-time bootstrap from legacy JSON (do not run in normal workflow): `npm run resume:bootstrap-md`

## Surfaces map

| Output | Source |
|--------|--------|
| `content/resume.md` (local build artifact, gitignored) | Generated from `career/source-of-truth.md` |
| `index.html` | Online resume — Summary, Skills, Experience (no Education); full PDF uses same source |
| `resume-one-page.html` | 1-page EU/product resume — synced from `onePage` in JSON + per-role `bulletsOnePage` |
| `cv.html` | Redirect to `index.html` (legacy URL / bookmarks) |
| `projects.html` | Extended case studies, screenshots, demos — not in sync chain |
| `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` | Primary 1-page CV from `resume-one-page.html` + `resume-one-page-pdf.css` |
| `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf` | Detailed 2–3 page CV from `index.html` + `resume-pdf.css` |
| iCloud `~/Library/Mobile Documents/.../pdf-resume/*.pdf` | Both PDFs copied by `generate-resume-pdf.mjs` on each build |
| `../vil4max/README.md` | Hand-maintained human “about” (GitHub only) |
| LinkedIn paste | Per-role `#### LinkedIn paste` + `## LinkedIn profile` in `career/source-of-truth.md` |

## Content rules

- No years-of-experience counts as the lead in Summary; one supporting tenure clause at the end is allowed (month/year dates elsewhere)
- No forbidden phrases (validator list in `scripts/validate-resume-sync.mjs`)
- Phone not on public web/PDF
- `Senior` in job titles only, not as identity in summary
- Product names: **Premium Subscription SDK**, **Premium Subscription module**, **Analytics module**
- **Education:** keep `## Education` in `career/source-of-truth.md` for application forms only — **not** on full `index.html` PDF; **1-page PDF** shows a compact **Education** section (between Skills and Experience), not inside Skills
- **Honesty / positioning:** no people leadership, team lead, or `led` wording on public surfaces; use `owned` / `designed` / `implemented` / `shipped` / `contributed` for technical work only
- **1-page Summary** may lead with `12+ years`; full resume Summary keeps tenure clause at end (not as opening lead)

## PDF policy

- **Two public resume PDFs** (canonical filenames — full policy: `career/resume-publishing.md` in private repo):
  - `Max_Vilchevskiy_Senior_iOS_Engineer.pdf` — primary 1-page CV from `resume-one-page.html` (must stay exactly 1 page; validator enforces)
  - `Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf` — detailed 2–3 page CV from `index.html`
- **Destinations:** `vil4max/assets/` (public GitHub) and iCloud `pdf-resume/` (local copy on build)
- **1-page source:** `## Resume one page` in `career/source-of-truth.md` + per-role `#### Bullets one page` / `#### Technologies one page`
- **Landing:** primary Download CV → canonical; secondary View detailed experience → Detailed PDF

## After every content change

1. `npm run resume:build`
2. `npm run resume:check`
3. Paste LinkedIn from `career/source-of-truth.md`
4. Push `vil4max.github.io` and `vil4max` if PDFs changed

## Repo layout

```
Profile/
  career/
    source-of-truth.md          ← EDIT HERE (private)
  vil4max.github.io/
    content/resume.md           ← generated locally (gitignored)
    content/resume-source.json  ← generated (public-safe: no phone, no apply metadata)
    index.html                  ← online resume (synced experience)
    cv.html                     ← redirect to index.html
    projects.html               ← case studies (hand-maintained)
  vil4max/
    README.md                   ← GitHub profile about (hand-maintained)
    assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf           ← primary 1-page CV (public GitHub)
    assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf ← detailed CV (public GitHub)
```

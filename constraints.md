# Maintainer contract — vil4max.github.io resume

## Source of truth

- **Edit only:** `../career/source-of-truth.md` (private `career` repo)
- **Never hand-edit:** `content/resume-source.json`, synced HTML sections, PDFs
- **Generated chain:** `career/source-of-truth.md` → generate-public-resume → `content/resume.md` (local, gitignored) → parse → compare-json → `resume-source.json` → sync HTML → validate → PDF from `index.html`

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
| `index.html` | Online resume — Skills, Summary, Experience timeline (synced from JSON; thumbs on screen only) |
| `cv.html` | Redirect to `index.html` (legacy URL / bookmarks) |
| `projects.html` | Extended case studies, screenshots, demos — not in sync chain |
| `../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf` | Print export of `index.html` + `resume-pdf.css` (A4, Playwright; hides thumbs) |
| `../vil4max/README.md` | Hand-maintained human “about” (GitHub only) |
| LinkedIn paste | Per-role `#### LinkedIn paste` + `## LinkedIn profile` in `career/source-of-truth.md` |

## Content rules

- No years-of-experience counts as the lead in Summary; one supporting tenure clause at the end is allowed (month/year dates elsewhere)
- No forbidden phrases (validator list in `scripts/validate-resume-sync.mjs`)
- Phone not on public web/PDF
- `Senior` in job titles only, not as identity in summary
- Product names: **Premium Subscription SDK**, **Premium Subscription module**, **Analytics module**

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
    assets/Vilchevskiy_iOS_Engineer.pdf ← generated (public)
  career/
    assets/Vilchevskiy_iOS_Engineer_detailed.pdf ← private detailed resume (on request)
```

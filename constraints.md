# Maintainer contract — vil4max.github.io resume

## Source of truth

- **Edit only:** `content/source-of-truth.md`
- **Never hand-edit:** `content/resume.md`, `content/resume-source.json`, HTML, PDFs
- **Generated chain:** `content/source-of-truth.md` → generate-public-resume → `content/resume.md` → parse → compare-json → `resume-source.json` → validate HTML → PDF from `cv.html`

## Build commands

```bash
cd vil4max.github.io
npm run resume:build
npm run resume:check
```

Individual steps: `generate-public-resume.mjs`, `resume:parse`, `resume:compare-json`, `resume:validate`, `resume:pdf`

One-time bootstrap from legacy JSON (do not run in normal workflow): `npm run resume:bootstrap-md`

## Surfaces map

| Output | Source |
|--------|--------|
| `content/resume.md` (build artifact) | Generated from `content/source-of-truth.md` |
| `cv.html`, `projects.html`, `index.html` | Validated against parsed JSON; HTML hand-maintained until optional auto-sync |
| `../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf` | `cv.html` + `resume-pdf.css` (A4 print, Playwright) |
| `../vil4max/README.md` | Hand-maintained; sync with `index.html` narrative |
| LinkedIn paste | Per-role `#### LinkedIn paste` + `## LinkedIn profile` in `content/source-of-truth.md` |

## Content rules

- No years-of-experience counts in public narrative (month/year dates only)
- No forbidden phrases (validator list in `scripts/validate-resume-sync.mjs`)
- Phone not on public web/PDF
- `Senior` in job titles only, not as identity in summary
- Product names: **Premium Subscription SDK**, **Premium Subscription module**, **Analytics module**

## After every content change

1. `npm run resume:build`
2. `npm run resume:check`
3. Paste LinkedIn from `content/source-of-truth.md`
4. Sync `../vil4max/README.md` if About / Focus / Agentic / links changed
5. Push `vil4max.github.io` and `vil4max` if PDFs or profile README changed

## Repo layout

```
Profile/
  vil4max.github.io/
    content/source-of-truth.md  ← EDIT HERE
    content/resume.md           ← generated (build artifact, not published at site root)
    content/resume-source.json  ← generated
    cv.html, index.html, …      ← PDF download only (no public .md)
  vil4max/
    README.md                   ← GitHub profile; sync with index.html
    assets/*.pdf                ← generated
  career/                       ← private strategy only
```

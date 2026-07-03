# Maintainer contract — vil4max.github.io resume

## Source of truth

- **Edit only:** `content/resume.md`
- **Never hand-edit:** `content/resume-source.json`, root `resume.md`, HTML, PDFs
- **Generated chain:** `content/resume.md` → parse → compare-json → `resume-source.json` → validate HTML → `resume:pdf:all` → publish `resume.md`

## Build commands

```bash
cd vil4max.github.io
npm run resume:build
npm run resume:check
```

Individual steps: `resume:parse`, `resume:compare-json`, `resume:publish-md`, `resume:validate`, `resume:pdf:short`, `resume:pdf:full`, `resume:pdf:all`

One-time bootstrap from legacy JSON (do not run in normal workflow): `npm run resume:bootstrap-md`

## Surfaces map

| Output | Source |
|--------|--------|
| `resume.md` (public download) | `content/resume.md` (strip `@visibility: private` blocks if used) |
| `index-short.html`, `cv.html`, `projects.html`, `index.html` | Validated against parsed JSON; HTML hand-maintained until optional auto-sync |
| `../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf` | `index-short.html` |
| `../vil4max/assets/Vilchevskiy_iOS_Engineer_detailed.pdf` | `cv.html` |
| LinkedIn paste | Per-role `#### LinkedIn paste` + `## LinkedIn profile` in `content/resume.md` |

## Content rules

- No years-of-experience counts in public narrative (month/year dates only)
- No forbidden phrases (validator list in `scripts/validate-resume-sync.mjs`)
- Phone not on public web/PDF
- `Senior` in job titles only, not as identity in summary

## After every content change

1. `npm run resume:build`
2. `npm run resume:check`
3. Paste LinkedIn from `content/resume.md`
4. Push `vil4max.github.io` and `vil4max` if PDFs changed

## Repo layout

```
Profile/
  vil4max.github.io/
    content/resume.md           ← EDIT HERE
    content/resume-source.json  ← generated
    resume.md                   ← generated (public)
  vil4max/assets/*.pdf          ← generated
  career/                       ← private strategy only
```

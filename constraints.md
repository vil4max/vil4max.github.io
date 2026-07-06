# Maintainer contract — vil4max.github.io resume

Public site and detailed-PDF layer. Private career sources and one-page RenderCV tooling live in `../career/`.

See `../career/CAREER_DATA_MODEL.md` for full architecture.

## Source of truth

- **Edit facts:** `../career/source-of-truth.md` (private)
- **Edit presentation:** `../career/presentation/*.md` (private)
- **Never hand-edit:** `content/resume-source.json`, synced HTML experience sections, PDFs
- **Generated chain:** facts + presentation → `content/resume.md` (gitignored) → `resume-source.json` → sync HTML → validate → PDFs

## Build commands

```bash
cd vil4max.github.io
npm run resume:build
npm run resume:check
```

One-page PDF only (private): `cd ../career && npm run resume:one-page`

Individual steps: `resume:parse`, `resume:compare-json`, `resume:validate`, `resume:pdf` (detailed only)

Do not publish root `resume.md` or `profile.md`.

## Surfaces map

| Output | Source |
|--------|--------|
| `content/resume.md` (gitignored) | Generated from career facts + presentation |
| `index.html` | Online detailed resume — synced from JSON |
| `resume-one-page.html` | One-page HTML mirror — synced from JSON; **PDF from RenderCV in career** |
| `cv.html` | Redirect to `index.html` |
| `projects.html` | Case studies — hand-maintained, not in sync chain |
| `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` | Primary 1-page CV — **RenderCV** (`career/resume/`) |
| `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf` | Detailed CV — **Playwright** from `index.html` |
| iCloud `pdf-resume/*.pdf` | Local copies on build |
| `../vil4max/README.md` | Hand-maintained GitHub profile about |
| LinkedIn | Paste from `../career/presentation/linkedin.md` |

## PDF policy

- **One-page:** RenderCV, no Education section, compact Skills — see `career/resume/rendercv/README.md`
- **Detailed:** 2–3 pages from `index.html`; Education remains in SOT for forms, not on public detailed PDF surface
- **Filenames:** `career/resume-publishing.md`
- **Landing:** Download CV → canonical one-page; View detailed experience → Detailed PDF

## After every content change

1. `npm run resume:build`
2. `npm run resume:check`
3. Paste LinkedIn from `career/presentation/linkedin.md`
4. Push `vil4max.github.io` and `vil4max` if artifacts changed

## Repo layout

```
Profile/
  career/                       ← PRIVATE facts, presentation, RenderCV
  vil4max.github.io/            ← PUBLIC site + detailed PDF tooling
  vil4max/                      ← PUBLIC profile README + PDF assets
```

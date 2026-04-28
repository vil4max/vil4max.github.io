# vil4max.github.io

- **`index.html`** — full portfolio (same as the live site).
- **`index-short.html`** — condensed CV (web + PDF source); uses **`resume-short.css`** only (no shared layout fights with the full page).
- **`resume.css`** — styles for **`index.html`** only.

PDFs are **not** regenerated automatically after edits. Regenerate when content is final.

## Setup

```bash
npm install
npm run resume:pdf:install
```

## Generate PDFs

**Both** (full + short), default paths under `../vil4max/assets/`:

```bash
npm run resume:pdf:all
```

**Full only** → `../vil4max/assets/iOS_Vilchevskiy_CV.pdf`:

```bash
npm run resume:pdf:full
```

**Short only** → `../vil4max/assets/iOS_Vilchevskiy_CV_short.pdf`:

```bash
npm run resume:pdf:short
```

Legacy: `npm run resume:pdf` generates the **full** PDF to the default path (same as `resume:pdf:full`).

**Custom output path** (full HTML, custom file):

```bash
node scripts/generate-resume-pdf.mjs ./my-resume.pdf
```

**Explicit input + output:**

```bash
node scripts/generate-resume-pdf.mjs index-short.html ../vil4max/assets/iOS_Vilchevskiy_CV_short.pdf
```

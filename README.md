# [vil4max.github.io](https://vil4max.github.io)

Public portfolio site renderer and resume/autofill build tooling.

**Career truth and update workflow are owned by the sibling `career` repository.**  
Start there: [`../career/README.md`](../career/README.md) → [`../career/WORKFLOW.md`](../career/WORKFLOW.md).

Do not hand-edit synced marked regions in `index.html` / `projects.html`. Do not treat this repo as the career SOT.

## Pages

| URL | Purpose |
|-----|---------|
| `index.html` | Portfolio landing (`portfolio:sync` ← `career/presentation/portfolio.md`). Mechanics: [`../career/presentation/LANDING.md`](../career/presentation/LANDING.md) |
| `projects.html` | Projects (`projects:sync` ← `career/presentation/projects.md`) |
| `cv.html` | Redirect to `index.html` |
| `profile-autofill.html` | Private autofill HTML (not a public page) |

## Site commands

Full command matrix: [`../career/WORKFLOW.md`](../career/WORKFLOW.md).

```bash
npm run portfolio:sync      # validates, then writes index.html
npm run projects:sync
npm run profile:sync        # writes ../vil4max/README.md
npm run presentation:sync   # all three
npm run resume:build        # public Resume PDF + private autofill + checks
npm run resume:pdf          # private autofill PDF only
npm run resume:validate
npm run resume:check
```

Public Resume PDF only (from career): `cd ../career && npm run resume:one-page`.

## Constraints

- Canonical facts: `../career/career.md`
- Presentation sources: `../career/presentation/*.md`
- Never hand-edit: private resume build golden (`../career/resume/build/resume-source.json`), synced marked HTML regions, published PDFs
- Never publish `content/resume-source.json` on GitHub Pages (autofill narrative stays private)
- `resume:build` does not rewrite landing `PORTFOLIO:*` regions

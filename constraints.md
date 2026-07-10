# Maintainer contract — vil4max.github.io

Public portfolio site + resume/autofill build layer. Private career facts and RenderCV live in `../career/`.

## Source of truth

- **Canonical facts:** `../career/career.md` (private) — only career SOT
- **Public presentation:** `../career/presentation/*.md` via [`AGENT_PUBLIC_UPDATE.md`](../career/presentation/AGENT_PUBLIC_UPDATE.md)
- **Channel projections:** `../career/build/context/{channel}.context.md` (generated, gitignored)
- **Compiled public policy:** `../career/presentation/public-policy.md`
- **Never hand-edit:** `content/resume-source.json`, synced marked HTML regions, published PDFs
- **Landing/projects/GitHub:** `presentation:sync` — each sync runs fail-closed boundary validation first
- **`resume:build`** does not rewrite `index.html` marked regions

## Public pipeline

```text
career.md
  → channel projection
  → presentation/*.md
  → boundary validation (fail-closed)
  → portfolio/projects/profile sync
  → public artifact
```

## Build commands

```bash
cd ../career && npm run presentation:project && npm run presentation:validate
cd ../vil4max.github.io
npm run presentation:sync
npm run resume:build
npm run resume:check
```

Public Resume PDF only: `cd ../career && npm run resume:one-page`

## Surfaces map

| Output | Source |
|--------|--------|
| `index.html` | `portfolio:sync` ← `presentation/portfolio.md` |
| `projects.html` | `projects:sync` ← `presentation/projects.md` |
| `../vil4max/README.md` | `profile:sync` ← `presentation/github-profile.md` |
| `content/resume-source.json` | Sanitized resume/autofill machine artifact |
| `profile-autofill.html` | Private autofill HTML |
| `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` | Public Resume PDF — RenderCV |
| `../career/resume/build/Max_Vilchevskiy_Profile_Autofill.pdf` | Private Profile Autofill PDF |

Do not publish root `resume.md` or `profile.md`.

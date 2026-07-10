# [vil4max.github.io](https://vil4max.github.io)

Source for the public portfolio site and resume/autofill build tooling.

## Pages

| URL | Purpose |
|-----|---------|
| `index.html` | Portfolio cover landing (synced from `career/presentation/portfolio.md`) |
| `projects.html` | Project case studies + screenshots (synced from `career/presentation/projects.md`) |
| `cv.html` | Redirect to `index.html` (legacy bookmarks) |
| `profile-autofill.html` | Private Profile Autofill HTML (not a public page) |

Nav: **Portfolio · Projects**. Public PDF download on landing and Projects.

## Edit content

1. **`../career/career.md`** — private canonical facts (canonical update step)
2. Regenerate channel projections: `cd ../career && npm run presentation:project`
3. Edit public wording per `../career/presentation/AGENT_PUBLIC_UPDATE.md` (channel context + presentation file + `public-policy.md` only)
4. Sync / build:

```bash
cd ../career && npm run presentation:validate
cd ../vil4max.github.io
npm run presentation:sync   # validates, then landing + projects + GitHub README
npm run resume:build        # public Resume PDF + private autofill PDF
npm run resume:check
```

See [`constraints.md`](constraints.md) and `../career/CAREER_DATA_MODEL.md`.

## PDF

```bash
npm run resume:build
```

- Public Resume (1–2 pages): `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` — **RenderCV** (`../career/resume/`)
- Profile Autofill (private): `../career/resume/build/Max_Vilchevskiy_Profile_Autofill.pdf` — Playwright from `profile-autofill.html` (never published to `vil4max/assets/`)

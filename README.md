# [vil4max.github.io](https://vil4max.github.io)

Source for my public CV/portfolio website.

## Pages

| URL | Purpose |
|-----|---------|
| `index.html` | Online resume — Skills, Summary, Experience timeline (PDF source) |
| `cv.html` | Redirect to `index.html` (legacy bookmarks) |
| `projects.html` | Project case studies + screenshots |

Nav on every page: **Portfolio · Projects**. PDF download in header.

## Edit content

1. **`../career/source-of-truth.md`** — private facts
2. **`../career/presentation/*.md`** — resume/LinkedIn wording
3. Run `npm run resume:build` and `npm run resume:check`

See [`constraints.md`](constraints.md) and [`../career/CAREER_DATA_MODEL.md`](../career/CAREER_DATA_MODEL.md).

## PDF

```bash
npm run resume:build
```

- Primary (1 page): `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` — **RenderCV** (`../career/resume/`)
- Detailed (2–3 pages): `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf` — Playwright from `index.html`

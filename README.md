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

1. **`../career/source-of-truth.md`** — private source of truth: full experience, metadata, LinkedIn blocks
2. Run `npm run resume:build` and `npm run resume:check`

See [`constraints.md`](constraints.md) for the full maintainer contract (source of truth, surfaces map, content rules).

## PDF

```bash
npm run resume:build
```

- Primary (1 page): `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` ← `resume-one-page.html`
- Detailed (2–3 pages): `../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf` ← `index.html`

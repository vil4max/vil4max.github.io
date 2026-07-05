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

Resume PDF ← `index.html` · Output → `../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf`

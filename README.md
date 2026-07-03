# [vil4max.github.io](http://vil4max.github.io)

Source for my public CV/portfolio website.

## Pages (3)

| URL | Purpose |
|-----|---------|
| `index.html` | About me — pitch, agentic engineering, focus, featured work |
| `cv.html` | Public resume (2–3 page PDF) |
| `projects.html` | Project case studies + screenshots |

Nav on every page: **About me · Resume · Projects**. PDF download on all three pages.

## Edit content

1. **`content/source-of-truth.md`** — source of truth: full experience, metadata, LinkedIn blocks, career direction
2. Sync hand-maintained HTML in the same session: `index.html`, `cv.html`, `projects.html`
3. Run `npm run resume:build` and `npm run resume:check`

See [`constraints.md`](constraints.md) for the full maintainer contract (source of truth, surfaces map, content rules).

## PDF

```bash
npm run resume:build
```

Resume PDF ← `cv.html` · Output → `../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf`

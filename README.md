# [vil4max.github.io](http://vil4max.github.io)

Source for my public CV/portfolio website.

## Pages (4)

| URL | Purpose |
|-----|---------|
| `index.html` | About me — pitch, agentic engineering, featured work |
| `cv.html` | Full resume (month-level dates) — PDF `*_detailed.pdf` |
| `projects.html` | Project case studies + screenshots |
| `index-short.html` | One-page resume (year-level dates) — PDF without suffix |

Nav on every page: **About me · Full resume · Projects · One-page resume**. Downloads (PDF + Markdown) on all four pages.

## Edit content

1. **`content/resume.md`** — canonical narrative, skills, experience, LinkedIn paste blocks
2. Sync hand-maintained HTML in the same session: `index.html`, `cv.html`, `index-short.html`, `projects.html`
3. Run `npm run resume:build` and `npm run resume:check`

See [`constraints.md`](constraints.md) for the full maintainer contract (source of truth, surfaces map, content rules).

## PDF

```bash
npm run resume:build
```

Short PDF ← `index-short.html` · Full PDF ← `cv.html` · Output → `../vil4max/assets/`

# [vil4max.github.io](http://vil4max.github.io)

Source for my public CV/portfolio website.

## Pages

| URL | Purpose |
|-----|---------|
| `index.html` | Landing — pitch, expertise, featured watchOS AI assistant |
| `experience.html` | Experience timeline (years) |
| `projects.html` | Project case studies + screenshots |
| `cv.html` | Full CV (months) — source for PDF full |
| `index-short.html` | Short CV (years) — source for PDF short |

## Edit content

1. **`content/resume-source.json`** — canonical dates (`displayFull` / `displayShort`)
2. Sync HTML in the same session: `cv.html`, `index-short.html`, `experience.html`
3. Run `npm run resume:validate`

## PDF

```bash
npm run resume:pdf:all
```

Full PDF ← `cv.html` · Short PDF ← `index-short.html`

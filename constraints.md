## Maintenance notes

- **Canonical dates:** edit `content/resume-source.json` first, then sync `index.html` (`displayFull`) and `index-short.html` / `experience.html` (`displayShort`) in the same session.
- Keep the site and PDF exports in sync. When updating `cv.html` or `index-short.html`, regenerate PDFs:
  - `npm run resume:pdf:all`
  - Optional: sanity check with `npm run resume:check`
- PDF outputs are stored outside this repo (see scripts in `package.json` / `scripts/`), so make sure those destinations are updated before publishing changes.
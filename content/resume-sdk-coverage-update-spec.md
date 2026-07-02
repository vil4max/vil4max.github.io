# Resume update spec: Premium Subscription SDK (coverage, host logic, docs)

**Purpose:** One-shot implementation guide for local agent across **two repos**.

**Context:** Senior iOS · Swift only. PASHA Holding / Birmarket — Premium Subscription extracted into SPM SDK embedded in **three independent host apps: Birmarket, Birbank, M10** (not web). Raised **XCTest coverage ~50% → 80%+**; optimized and regression-tested host-specific branches; SDK documentation (AI-assisted draft, code-reviewed).

**Tone:** Result-first bullets (English). AI mentioned only for documentation workflow — not in Skills as tool names.

---

## Repos

| Repo | Role |
|------|------|
| `vil4max.github.io` | Canonical content: `content/resume-source.json` + HTML pages |
| `vil4max` (sibling) | PDF assets + `README.md` profile snippet |

**Sibling layout** (from `vil4max.github.io` scripts):

```
../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf          ← from index-short.html
../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_detailed.pdf ← from cv.html
```

---

## Workflow (order matters)

1. Edit **`content/resume-source.json`** first (canonical).
2. Sync all HTML surfaces in the **same session** (see checklist below).
3. Run `npm run resume:validate` in `vil4max.github.io`.
4. Run `npm run resume:pdf:all` (generates PDFs into `../vil4max/assets/`).
5. Optional: `npm run resume:check`.
6. Update **`vil4max/README.md`** (and `career/linkedin-profile.md` if present in your tree).
7. Commit both repos; push.

---

## Forbidden phrases (validator will fail)

Do **not** use these exact strings anywhere in `resume-source.json`, `cv.html`, `index-short.html`, `experience.html`:

- `crash-free`
- `host apps (Birmarket`
- `3 host apps`
- `3 production host`
- `contributed to shared marketplace`
- `UIKit modules stable`
- `SPM modules with MVP`
- `Firebase Remote Config experiments`

**Safe alternatives:** `Birmarket, Birbank, and M10` · `three host apps` · `host-specific` · `per-host configuration`

---

## Global text changes

### Skills line (`meta.skillsLine`, `meta.skillsLineDetailed`, Skills section in HTML)

**Replace:**

```
Swift · SwiftUI · UIKit · Swift Concurrency · async/await · Combine · SwiftData · SPM · WatchKit · Apple platform SDKs
```

**With:**

```
Swift · SwiftUI · UIKit · Swift Concurrency · async/await · Combine · SwiftData · SPM · XCTest · Unit Testing · iOS SDK · Subscriptions · WatchKit · Apple platform SDKs
```

### Summary paragraph (`meta.summary` — detailed CV only)

**Replace:**

```
iOS Software Engineer with ownership across watchOS R&D and large production apps. Voice AI assistant on Apple Watch; technical lead on Premium Subscription for marketplace loyalty; SDK module extraction. Stack: Swift Concurrency (async/await), SwiftUI/UIKit, SPM, SwiftData, Combine.
```

**With:**

```
iOS Software Engineer with ownership across watchOS R&D and large production apps. Voice AI assistant on Apple Watch; technical lead on Premium Subscription for marketplace loyalty; Premium iOS SDK (SPM) for Birmarket, Birbank, and M10 with 80%+ XCTest coverage. Stack: Swift Concurrency (async/await), SwiftUI/UIKit, SPM, SwiftData, Combine, XCTest.
```

### Summary short (`meta.summaryShort` — one-page resume)

**Replace:**

```
iOS Software Engineer. Voice AI assistant on Apple Watch; Premium Subscription technical lead on marketplace loyalty.
```

**With:**

```
iOS Software Engineer. Voice AI assistant on Apple Watch; Premium Subscription SDK lead — SPM module, 80%+ XCTest coverage, three host apps (Birmarket, Birbank, M10).
```

> Note: `three host apps` is OK; forbidden is only `3 host apps` (digit 3).

### Summary bullets (`meta.summaryBullets`, `highlights` — same 3 items)

**Replace item 3:**

```
Extracted Premium into an independent SDK module inside the loyalty platform
```

**With:**

```
Premium iOS SDK (SPM) for Birmarket, Birbank, and M10 — 80%+ XCTest coverage and integration documentation
```

### Landing about (`meta.landingAbout` — index.html)

**Replace sentence:**

```
Shipped marketplace commerce and led Premium Subscription through App Store release, including SDK module extraction.
```

**With:**

```
Shipped marketplace commerce and led Premium Subscription through App Store release — extracted SPM SDK for Birmarket, Birbank, and M10, raised XCTest coverage to 80%+, and published integration documentation.
```

---

## PASHA Holding role (`roles[id=pasha]`)

### Technologies

**`technologies` array** — add `XCTest` after `SPM`:

```json
["Swift", "SwiftUI", "UIKit", "SPM", "XCTest", "URLSession", "Swift Concurrency", "async/await", "Combine"]
```

**`technologiesLine`:**

```
Swift · SwiftUI · UIKit · SPM · XCTest · URLSession · Swift Concurrency · async/await · Combine
```

### `projectsDetail` — update Premium Subscription line

**Replace:**

```json
{ "name": "Premium Subscription", "summary": "Cashback/bonus tier — extracted into a dedicated SDK module; App Store release" }
```

**With:**

```json
{ "name": "Premium Subscription", "summary": "Cashback/bonus tier — Swift SDK (SPM); 80%+ XCTest coverage; Birmarket, Birbank, M10 host apps; App Store release" }
```

### Experience bullets — FULL (`bullets` — cv.html, experience.html)

**Keep bullets 1–2 unchanged.** Replace bullet 3 and add bullets 4–5:

**Old bullet 3 (remove):**

```
Migrated Premium from the main app into an independent SDK module with per-host-app configuration inside the shared loyalty platform.
```

**New bullets 3–5:**

```
Extracted Premium into an independent Swift SDK (SPM) with per-host configuration for Birmarket, Birbank, and M10 inside the shared loyalty platform.
Raised XCTest coverage of the Premium Subscription SDK from ~50% to 80%+; optimized and regression-tested host-specific branches across the three host apps.
Published SDK integration and API documentation for host teams.
```

### Experience bullets — SHORT (`bulletsShort` — new field, index-short.html only)

Add to `pasha` role in JSON (for agent reference; validator does not enforce this field yet):

```json
"bulletsShort": [
  "Shipped core marketplace commerce in a production online store — catalog, search, cart, checkout, and orders — across App Store releases.",
  "Technical lead on Premium Subscription — full cycle: feature definition through implementation, TestFlight, debug, and App Store release (cashback/bonus logic).",
  "Extracted Premium into an independent Swift SDK (SPM) for Birmarket, Birbank, and M10; raised XCTest coverage 50% → 80%+, regression-tested host-specific logic, and published SDK integration documentation."
]
```

**index-short.html:** 3 bullets total for PASHA (use `bulletsShort` above). Do **not** add separate doc/coverage bullets on one-page — merged into bullet 3.

---

## File-by-file checklist (`vil4max.github.io`)

| File | What to update |
|------|----------------|
| `content/resume-source.json` | All sections above |
| `cv.html` | Summary, summary bullets, Skills, PASHA bullets 3–5, `technologiesLine`, projects block unchanged except if mirroring `projectsDetail` |
| `index-short.html` | `summaryShort`, Skills, PASHA 3 short bullets, `technologiesLine` |
| `experience.html` | PASHA bullets 3–5, tech tags (+ `XCTest` tag), projects list optional tweak on Premium line |
| `projects.html` | Birmarket card bullets + blurb/meta (see below) |
| `index.html` | `landingAbout`, Birmarket featured card bullets |

### `experience.html` — PASHA tech tags

Add after SPM tag:

```html
<span class="exp-tech-tag">XCTest</span>
```

### `projects.html` — Birmarket card

**`project-meta` — add XCTest:**

```
Swift · SwiftUI · UIKit · SPM · XCTest · URLSession
```

**`project-card-blurb` — optional strengthen:**

```
Azerbaijan online marketplace — core commerce and Premium Subscription technical lead; SPM SDK for Birmarket, Birbank, and M10.
```

**Bullets — replace last item, add two (or merge for brevity):**

```
<li>Shipped catalog, search, cart, checkout, and orders across App Store releases.</li>
<li>Technical lead on Premium Subscription — full cycle through App Store release.</li>
<li>Extracted Premium into an independent Swift SDK (SPM) for Birmarket, Birbank, and M10.</li>
<li>Raised XCTest coverage 50% → 80%+; regression-tested host-specific logic across host apps.</li>
<li>Published SDK integration documentation.</li>
```

### `index.html` — Birmarket featured card

**Bullets:**

```
<li>Shipped catalog through checkout across App Store releases.</li>
<li>Technical lead on Premium Subscription; SPM SDK for Birmarket, Birbank, and M10.</li>
<li>Raised XCTest coverage to 80%+; SDK integration documentation for host teams.</li>
```

---

## Second repo: `vil4max`

| File | Action |
|------|--------|
| `assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf` | Regenerate via `npm run resume:pdf:short` |
| `assets/Max_Vilchevskiy_Senior_iOS_Engineer_detailed.pdf` | Regenerate via `npm run resume:pdf:full` |
| `README.md` | Sync pitch line with `meta.landingAbout` or GitHub profile summary |

### `career/linkedin-profile.md` (if exists in your workspace)

Add under PASHA / Premium (English, LinkedIn style):

```
- Extracted Premium Subscription into a Swift SDK (SPM) embedded in Birmarket, Birbank, and M10
- Raised XCTest coverage from ~50% to 80%+; optimized and regression-tested host-specific logic
- Published SDK integration and API documentation
```

Do **not** list ChatGPT/Claude in Skills on LinkedIn.

---

## Validation rules (existing script behaviour)

- `index-short.html` must **not** include GlobalLogic “on-device intent handling” bullet (detailed CV only).
- `index-short.html` must **not** include Drinkit WebSocket live-tracking bullet (detailed CV only).
- `index-short.html` must include `technologiesLine` for roles with `shortInclude: true`.
- All `displayFull` / `displayShort` dates must match JSON.

```bash
cd vil4max.github.io
npm run resume:validate
npm run resume:pdf:all
npm run resume:check   # optional
```

---

## Suggested commits

**vil4max.github.io:**

```
docs(resume): add Premium SDK coverage and documentation achievements
```

**vil4max:**

```
chore(assets): regenerate resume PDFs after SDK coverage update
```

---

## Agent prompt (copy-paste)

```
Implement content/resume-sdk-coverage-update-spec.md in vil4max.github.io:
1. Apply all JSON changes to content/resume-source.json
2. Sync cv.html, index-short.html, experience.html, projects.html, index.html
3. Run npm run resume:validate and fix any failures
4. Run npm run resume:pdf:all to update ../vil4max/assets/*.pdf
5. Update vil4max/README.md and career/linkedin-profile.md if present
Do not use forbidden phrases from the spec. Keep one-page resume (index-short.html) to 3 PASHA bullets via bulletsShort.
```

---

## Quick reference — before / after (PASHA bullet 3 only)

| Surface | After |
|---------|--------|
| **Short (1 bullet)** | Extracted Premium into an independent Swift SDK (SPM) for Birmarket, Birbank, and M10; raised XCTest coverage 50% → 80%+, regression-tested host-specific logic, and published SDK integration documentation. |
| **Full (+2 bullets)** | Bullet 4: coverage + host-specific optimization. Bullet 5: SDK docs. |

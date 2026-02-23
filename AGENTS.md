# Agent Context

Read this file before making any changes. It captures architectural decisions, gotchas, and current project state so you can continue work without re-deriving context from the code.

---

## What this project is

An HTML/CSS resume for **Miguel Cruz, Embedded Systems Engineer** that generates a PDF via WeasyPrint inside Docker. The source files are `index.html` + `style.css`. The output is `build/resume.pdf`.

There is no build step for the HTML — it is the source, not a generated artifact. Live preview is done with the VSCode Live Server extension pointed at `index.html`.

---

## File responsibilities

| File | Purpose |
|---|---|
| `index.html` | Resume content and structure |
| `style.css` | All styling. Divided into clearly labelled section blocks |
| `Dockerfile` | `python:3.12-slim` + WeasyPrint system deps + pip install |
| `docker-compose.yml` | Builds image, mounts `./build` volume, runs WeasyPrint, exits |
| `.gitignore` | Ignores `build/` directory |
| `README.md` | User-facing docs with usage, Mermaid diagram, and TODO list |
| `AGENTS.md` | This file — agent handoff context |

---

## Layout

Two-column grid: `20% sidebar | 1fr main`.

- **Sidebar** (left 20%): Contact, Education, Skills — grey background (`#f5f7f7`), `padding: 2mm`, no border
- **Main column** (right): Professional Summary, Professional Experience — `padding-top: 2mm` to align first section with sidebar content
- **Header** (full width, above both columns): Name only — no tagline

---

## CSS architecture — critical details

### Font sizing: all `px`, no `rem`
Every font size is in explicit `px`. This was an intentional decision after discovering that changing `html { font-size }` caused all `rem`-based sizes to scale unexpectedly. Each section has its own clearly labelled block in `style.css` with independent font sizes you can tune without affecting others.

### Font weights
- **Body (Geist Sans):** `font-weight: 300` (Light) set on `body`, cascades to all body text
- **Name (Cormorant Garamond):** `font-weight: 400` (Regular)
- **Section h2 labels:** `font-weight: 500`
- **Entry titles / skill labels:** `font-weight: 500`
- Bold exceptions (still 700): none currently

### Section heading sizes are scoped with `:has()`
The `h2` font sizes per section use CSS `:has()` selectors:
```css
.sidebar section:has(.contact) h2 { font-size: 14px; }
.sidebar section:has(.entry) h2   { font-size: 14px; }
.sidebar section:has(.skill-group) h2 { font-size: 14px; }
.main-col section:first-child h2  { font-size: 14px; } /* Summary */
.main-col section:last-child h2   { font-size: 14px; } /* Experience */
```
**Caveat:** WeasyPrint may not support `:has()`. This only affects PDF output — Live Server preview (Chrome) renders it fine. If PDF section headings look wrong, replace `:has()` selectors with explicit classes on each `<section>`.

### Page is fixed A4
`.page` uses `width: 210mm; min-height: 297mm` with `padding: 18mm 10mm` (10mm side margins — safe modern printer margin). This is intentional — the page should always look like A4 regardless of font size changes.

### Header is fixed height
The header uses `height: 30mm` with `text-align: center; line-height: 30mm` to center the name — **not flexbox**. Flex was intentionally removed after discovering WeasyPrint crashes on nested flex containers (`.page` is already flex, so `header` having `display: flex` triggered a layout bug). `line-height: 30mm` vertically centers single-line text within the fixed-height box. Changing `font-size` on `header h1` does **not** affect the header height or push content down.

The grey background bleeds to the page top edge via the negative margin trick:
```css
header {
  margin-top: -18mm;   /* cancels .page padding-top */
  margin-left: -10mm;  /* cancels .page padding-left */
  margin-right: -10mm; /* cancels .page padding-right */
  height: 30mm;
}
```

### Print / WeasyPrint CSS architecture
The `@media print` block has rules critical for correct PDF output. Key decisions:

- **`.page { display: block }`** — overrides the screen `display: flex`. Without this, WeasyPrint interprets `flex: 1` on `.body-columns` as "fill the entire page height," stretching the grid across 3+ pages.
- **`@page { margin: 18mm 10mm 10mm }`** — 3-value shorthand: top 18mm, sides 10mm, bottom 10mm. Must match `.page { padding: 18mm 10mm 10mm }` on screen. The @page margins become the PDF margins (`.page` gets `padding: 0` in print). Mismatching these was the original cause of "extra margins" in the PDF. The top is 18mm (not 10mm) because the header uses `margin-top: -18mm` to bleed to the page edge — the bottom has no such bleed so it uses 10mm like the sides.
- **`display: flex` must not appear inside `.page` in print** — `.page-footer` uses floats instead of flex for left/right layout. `.entry-header` still uses flex but it is nested deeper (inside `.body-columns → .main-col → section → .entry`) and does not directly trigger the WeasyPrint flex bug.
- **`margin-top: auto` on `.page-footer` has no effect in print** — because `.page` is `display: block` in print. The footer just falls naturally after content. The @page bottom margin provides visual spacing.

### Fonts are self-hosted
Google Fonts links have been removed from `index.html`. Both fonts are loaded via `@font-face` in `style.css` using local TTF files copied into the Docker image.

Font files live in:
```
fonts/
  geist-sans/
    Geist-Light.ttf        (weight 300, normal)
    Geist-LightItalic.ttf  (weight 300, italic — needed for .entry-company)
    Geist-Regular.ttf      (weight 400, normal)
    Geist-Medium.ttf       (weight 500, normal)
  cormorant-garamond/
    CormorantGaramond-Regular.ttf  (weight 400, normal)
```

The Dockerfile has `COPY fonts/ ./fonts/` to bundle them into the image. **If you add a new font weight or style, you must add both the TTF file and a matching `@font-face` block in `style.css`, then rebuild the Docker image.**

WeasyPrint does NOT synthesize italic if no italic `@font-face` is declared — unlike browsers which oblique-skew the regular variant. Always declare an explicit italic face when `font-style: italic` is used on any element.

---

## Design decisions

| Element | Value | Notes |
|---|---|---|
| Name font | Cormorant Garamond 400 | Serif, centered, uppercase, `letter-spacing: 0.2em` |
| Body font | Geist Sans 300 | Light weight — deliberately thin for a clean look |
| Section h2 | Geist Sans 500 | Slightly heavier than body for contrast without being bold |
| Header | Fixed `30mm` height, `line-height` centered | No flex — avoids WeasyPrint nested flex crash |
| Page size | A4 fixed (`210mm × 297mm`) | Not responsive — intentional |
| Body text size | `11–12px` range | Explicit per section, not inherited |
| Side margins | `10mm` | Safe margin for modern printers |
| Page footer | `5mm` strip, floated spans | Name left (float left), LinkedIn right (float right). `margin-top: auto` only works in browser (flex column); in PDF footer falls naturally after content |
| Skills layout | `<ul class="skill-list">` per group | Each skill is its own `<li>`, one per line. `.skill-label` is a `<span>` above the list |
| Contact icons | Inline SVG + `<a>` hyperlink | LinkedIn and GitHub have path-based SVG icons. Links are preserved as PDF annotations by WeasyPrint |
| Text color | `#283135` | CMYK 69, 62, 59, 49 converted to hex. Used on `body`, `section h2`, contact list |
| Grey backgrounds | `#f5f7f7` | CMYK 4, 3, 3, 0 converted to hex. Used on header and sidebar |

**Color note:** CSS does not support CMYK values. Always convert CMYK to hex before applying. Formula: `R = 255 × (1 − C%) × (1 − K%)`, same for G and B. `device-cmyk()` exists in CSS Color Level 4 but is not reliably supported by WeasyPrint or browsers.

---

## Known gotchas

1. **`:has()` in WeasyPrint** — May not render section `h2` sizes correctly in PDF. Verify after any Docker run. Workaround: add explicit classes like `class="section-contact"` to each `<section>` and scope styles to those.
2. ~~**Google Fonts in Docker**~~ — Resolved. Fonts are now self-hosted. No internet dependency at runtime.
3. **`min-height` on `.page`** — If content overflows A4, a second page is created. WeasyPrint handles page breaks via `page-break-inside: avoid` on `.entry` only. `section { page-break-inside: avoid }` was intentionally **removed** — it caused WeasyPrint to push the entire Professional Experience section (all 4+ entries) to page 2 as an unbreakable block, leaving a large gap on page 1.
4. **`section:first-child` / `section:last-child`** — Summary is targeted as `:first-child` and Experience as `:last-child` inside `.main-col`. If a new section is added between them, these selectors will break and explicit classes will be needed.
5. **`.main-col` padding-top** — Set to `2mm` to align Professional Summary with the Contact section in the sidebar (which has `padding: 2mm`). If sidebar padding changes, update `.main-col { padding-top }` to match.
6. **WeasyPrint + nested flex = crash** — WeasyPrint crashes with `ValueError: too many values to unpack` when a flex container (`.page`) contains children that are also flex containers. Fixed by: (a) using `text-align/line-height` instead of flex in `header`, (b) using floats instead of flex in `.page-footer`, (c) adding `display: block` to `.page` in `@media print`.
7. **Python version must be pinned to `3.12-slim`** — `python:3-slim` resolves to Python 3.14+ which has WeasyPrint incompatibilities. Always use `FROM python:3.12-slim` in the Dockerfile.
8. **`flex: 1` on `.body-columns` causes multi-page PDF** — WeasyPrint interprets `flex: 1` literally when `.page` is a flex column, stretching the grid to fill the entire page height and causing content to fragment across 3+ pages. Fixed by adding `display: block` to `.page` in `@media print`, which deactivates flex entirely for the PDF render.
9. **`@page` margins must match `.page` padding** — In print, `.page` gets `padding: 0`. The only effective margins become those set by `@page`. If `@page { margin }` differs from the screen `.page { padding }`, the PDF will have different margins than the browser preview. Current values: both `18mm 10mm 10mm` (top 18mm, sides 10mm, bottom 10mm).
10. **WeasyPrint does not synthesize italic** — Unlike browsers, WeasyPrint will not oblique-skew a regular font when `font-style: italic` is used. An explicit `@font-face` with `font-style: italic` pointing to an italic TTF is required. Currently declared for Geist Sans weight 300 (`Geist-LightItalic.ttf`). If italic is needed at other weights, add the corresponding TTF + `@font-face` block.
11. **Contact icons are inline SVG** — LinkedIn and GitHub entries use inline `<svg>` path data (no external icon library). LinkedIn icon uses `fill="#283135"` (matches resume text color, not LinkedIn blue). GitHub icon uses `fill="currentColor"` (inherits text color). Both are wrapped in `<a>` tags — WeasyPrint preserves these as clickable PDF link annotations.

---

## TODO (from README)

1. **Separate content from markup** — `resume.yaml` + Jinja2 template → `index.html`. Needs a local `watch.py` watcher to keep Live Server working. Design is locked, good time to do this now.
2. **CI/CD with GitHub Actions** — Auto-generate PDF on push to `main`, attach as release artifact.
3. **Tailored resume variants** — Multiple YAML files for different roles, one compose run generates all.
4. **PDF hot-reload watcher** — `docker compose watch` or `watchdog` Python lib to re-run WeasyPrint on file save.
5. ~~**Self-hosted fonts**~~ — **Done.** Geist Sans (300, 300i, 400, 500) and Cormorant Garamond (400) are bundled as TTF files in `fonts/` and loaded via `@font-face`. Google Fonts link removed.
6. **Content validation** — Schema check on YAML before render (depends on TODO #1).

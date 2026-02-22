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
- **`@page { margin: 18mm 10mm }`** — must exactly match `.page { padding: 18mm 10mm }` on screen. The @page margins become the PDF margins (`.page` gets `padding: 0` in print). Mismatching these was the original cause of "extra margins" in the PDF.
- **`display: flex` must not appear inside `.page` in print** — `.page-footer` uses floats instead of flex for left/right layout. `.entry-header` still uses flex but it is nested deeper (inside `.body-columns → .main-col → section → .entry`) and does not directly trigger the WeasyPrint flex bug.
- **`margin-top: auto` on `.page-footer` has no effect in print** — because `.page` is `display: block` in print. The footer just falls naturally after content. The @page bottom margin provides visual spacing.

### Fonts load from Google Fonts
`Cormorant Garamond` (weights 300, 400, 700) and `Geist Sans` (weights 300–700 variable range) are loaded via `<link>` tags in `index.html`. This requires an internet connection. **The Docker container does not have internet access at runtime**, so WeasyPrint will fall back to system fonts (`fonts-dejavu`, `fonts-liberation` are installed in the image). The PDF will not match the browser preview exactly until fonts are self-hosted (see TODO).

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
| Text color | `#283135` | CMYK 69, 62, 59, 49 converted to hex. Used on `body`, `section h2`, contact list |
| Grey backgrounds | `#f5f7f7` | CMYK 4, 3, 3, 0 converted to hex. Used on header and sidebar |

**Color note:** CSS does not support CMYK values. Always convert CMYK to hex before applying. Formula: `R = 255 × (1 − C%) × (1 − K%)`, same for G and B. `device-cmyk()` exists in CSS Color Level 4 but is not reliably supported by WeasyPrint or browsers.

---

## Known gotchas

1. **`:has()` in WeasyPrint** — May not render section `h2` sizes correctly in PDF. Verify after any Docker run. Workaround: add explicit classes like `class="section-contact"` to each `<section>` and scope styles to those.
2. **Google Fonts in Docker** — Container has no internet at runtime. Fonts fall back silently. PDF ≠ browser until fonts are bundled locally.
3. **`min-height` on `.page`** — If content overflows A4, a second page is created. This is intentional. WeasyPrint handles page breaks via `page-break-inside: avoid` on `.entry` and `section`.
4. **`section:first-child` / `section:last-child`** — Summary is targeted as `:first-child` and Experience as `:last-child` inside `.main-col`. If a new section is added between them, these selectors will break and explicit classes will be needed.
5. **`.main-col` padding-top** — Set to `2mm` to align Professional Summary with the Contact section in the sidebar (which has `padding: 2mm`). If sidebar padding changes, update `.main-col { padding-top }` to match.
6. **WeasyPrint + nested flex = crash** — WeasyPrint crashes with `ValueError: too many values to unpack` when a flex container (`.page`) contains children that are also flex containers. Fixed by: (a) using `text-align/line-height` instead of flex in `header`, (b) using floats instead of flex in `.page-footer`, (c) adding `display: block` to `.page` in `@media print`.
7. **Python version must be pinned to `3.12-slim`** — `python:3-slim` resolves to Python 3.14+ which has WeasyPrint incompatibilities. Always use `FROM python:3.12-slim` in the Dockerfile.
8. **`flex: 1` on `.body-columns` causes multi-page PDF** — WeasyPrint interprets `flex: 1` literally when `.page` is a flex column, stretching the grid to fill the entire page height and causing content to fragment across 3+ pages. Fixed by adding `display: block` to `.page` in `@media print`, which deactivates flex entirely for the PDF render.
9. **`@page` margins must match `.page` padding** — In print, `.page` gets `padding: 0`. The only effective margins become those set by `@page`. If `@page { margin }` differs from the screen `.page { padding }`, the PDF will have different margins than the browser preview. Current values: both `18mm 10mm`.

---

## TODO (from README)

1. **Separate content from markup** — `resume.yaml` + Jinja2 template → `index.html`. Needs a local `watch.py` watcher to keep Live Server working. Design is locked, good time to do this now.
2. **CI/CD with GitHub Actions** — Auto-generate PDF on push to `main`, attach as release artifact.
3. **Tailored resume variants** — Multiple YAML files for different roles, one compose run generates all.
4. **PDF hot-reload watcher** — `docker compose watch` or `watchdog` Python lib to re-run WeasyPrint on file save.
5. **Self-hosted fonts** — Download Cormorant Garamond + Geist Sans `.woff2` files, reference via `@font-face`. Fixes the Docker font mismatch.
6. **Content validation** — Schema check on YAML before render (depends on TODO #1).

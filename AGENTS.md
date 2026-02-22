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
| `Dockerfile` | `python:3-slim` + WeasyPrint system deps + pip install |
| `docker-compose.yml` | Builds image, mounts `./build` volume, runs WeasyPrint, exits |
| `.gitignore` | Ignores `build/` directory |
| `README.md` | User-facing docs with usage, Mermaid diagram, and TODO list |
| `AGENTS.md` | This file — agent handoff context |

---

## Layout

Two-column grid: `25% sidebar | 1fr main`.

- **Sidebar** (left 25%): Contact, Education, Skills
- **Main column** (right): Professional Summary, Professional Experience
- **Header** (full width, above both columns): Name + tagline

The sidebar has a `border-right: 1px solid #ddd` divider.

---

## CSS architecture — critical details

### Font sizing: all `px`, no `rem`
Every font size is in explicit `px`. This was an intentional decision after discovering that changing `html { font-size }` caused all `rem`-based sizes to scale unexpectedly. Each section has its own clearly labelled block in `style.css` with independent font sizes you can tune without affecting others.

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
`.page` uses `width: 210mm; min-height: 297mm` with `padding: 18mm 20mm`. This is intentional — the page should always look like A4 regardless of font size changes.

### Fonts load from Google Fonts
`Cormorant Garamond` (name/h1 only) and `Geist Sans` (body) are loaded via `<link>` tags in `index.html`. This requires an internet connection. **The Docker container does not have internet access at runtime**, so WeasyPrint will fall back to system fonts (`fonts-dejavu`, `fonts-liberation` are installed in the image). The PDF will not match the browser preview exactly until fonts are self-hosted (see TODO).

---

## Design decisions

| Element | Value | Notes |
|---|---|---|
| Name font | Cormorant Garamond 700 | Serif, centered, uppercase, `letter-spacing: 0.2em` |
| Body font | Geist Sans | Modern geometric sans-serif |
| Tagline style | Flex row with `::before`/`::after` rules | "— Embedded Systems Engineer —" effect |
| Page size | A4 fixed (`210mm × 297mm`) | Not responsive — intentional |
| Body text size | `11–12px` range | Explicit per section, not inherited |

---

## Known gotchas

1. **`:has()` in WeasyPrint** — May not render section `h2` sizes correctly in PDF. Verify after any Docker run. Workaround: add explicit classes like `class="section-contact"` to each `<section>` and scope styles to those.
2. **Google Fonts in Docker** — Container has no internet at runtime. Fonts fall back silently. PDF ≠ browser until fonts are bundled locally.
3. **`min-height` on `.page`** — If content overflows A4, a second page is created. This is intentional. WeasyPrint handles page breaks via `page-break-inside: avoid` on `.entry` and `section`.
4. **`section:first-child` / `section:last-child`** — Summary is targeted as `:first-child` and Experience as `:last-child` inside `.main-col`. If a new section is added between them, these selectors will break and explicit classes will be needed.

---

## TODO (from README)

1. **Separate content from markup** — `resume.yaml` + Jinja2 template → `index.html`. Needs a local `watch.py` watcher to keep Live Server working. Design is locked, good time to do this now.
2. **CI/CD with GitHub Actions** — Auto-generate PDF on push to `main`, attach as release artifact.
3. **Tailored resume variants** — Multiple YAML files for different roles, one compose run generates all.
4. **PDF hot-reload watcher** — `docker compose watch` or `watchdog` Python lib to re-run WeasyPrint on file save.
5. **Self-hosted fonts** — Download Cormorant Garamond + Geist Sans `.woff2` files, reference via `@font-face`. Fixes the Docker font mismatch.
6. **Content validation** — Schema check on YAML before render (depends on TODO #1).

# HTML Resume

A print-ready HTML/CSS resume written in TypeScript. All content lives in `src/content.ts` — edit bullet points, jobs, and contact info there, never in the HTML. Chrome headless (via Puppeteer) generates the PDFs so the browser live preview and the PDF output use the exact same rendering engine.

Two PDF variants are produced:
- **`MiguelCruz_Resume.pdf`** — full personal details
- **`JohnDoe_Resume.pdf`** — anonymized version with company names, location, and identifying info scrubbed

## Prerequisites

- Docker + Docker Compose

**Arch Linux:**
```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

**macOS** — uses [Homebrew](https://brew.sh/) and [Colima](https://github.com/abiosoft/colima) as the Docker runtime:
```bash
brew install colima docker docker-compose
colima start          # starts the Docker daemon (run this each session, or add to login items)
```

**Windows** — install Docker Engine inside WSL 2 (run in PowerShell as Administrator, then inside the WSL terminal):
```powershell
# 1. Enable WSL 2
wsl --install         # installs Ubuntu by default, then restart
```
```bash
# 2. Inside the WSL terminal — install Docker Engine
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo service docker start
sudo usermod -aG docker $USER && newgrp docker
```

## Usage

### Live preview (while editing)

Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VSCode.

Start the TypeScript watcher (runs inside Docker — no local Node/npm required):

```bash
docker compose --profile dev up tsc-watch
```

This mounts `./src/` into the container and recompiles `content.ts → content.js` on every save. Leave it running in a terminal, then right-click `src/index.html` and choose **Open with Live Server** in another window.

- `src/index.html` — real profile (default)
- `src/index.html?profile=anon` — anonymized profile

If you do have npm installed locally, `npm install && npm run watch` works too.

### Generate PDFs

```bash
docker compose up --build
```

Both PDFs will be written to `./build/`. The `build/` folder is created automatically if it does not exist.

## How it works

All resume data is defined in `src/content.ts` as a typed `profiles` object. `profiles.real` holds the full content. `profiles.anon` spreads over `real` and overrides only personal fields — company names, contact info, location, and education details. Bullet points that mention identifying names have a separate `anonBullets` field on that entry.

`src/index.html` is a thin shell with empty containers. An inline script reads the `?profile=` URL param and calls `populate()` to fill in the page at load time. This means the live browser preview and the PDF share the same JS rendering path.

`generate.ts` launches Chromium via Puppeteer, loads the page as a `file://` URL, and calls `page.pdf()` with zero page margins — all spacing is handled by the CSS `.page` padding so the full-bleed header renders correctly. `tsc` compiles both `.ts` files to `.js` before anything runs.

```mermaid
flowchart TD
    contentts["src/content.ts (TypeScript source)"]
    contentjs["src/content.js (compiled)"]
    html["src/index.html (thin shell)"]
    fonts["src/fonts/ (self-hosted TTFs)"]

    contentts -->|tsc| contentjs

    subgraph preview["Live Preview (editing)"]
        LS["Live Server"]
        BR["Browser ?profile=real or ?profile=anon"]
        html --> LS --> BR
        contentjs -->|loaded as script| BR
        fonts -->|loaded locally| BR
    end

    subgraph docker["PDF Generation (Docker)"]
        DC["docker compose up --build"]
        IMG["node:20-slim + Chromium + Puppeteer"]
        GEN["generate.js real → MiguelCruz_Resume.pdf\ngenerate.js anon  → JohnDoe_Resume.pdf"]
        VOL[("build/")]
        DC --> IMG --> GEN --> VOL
        contentjs --> IMG
        html --> IMG
        fonts --> IMG
    end
```

## Editing content

Open `src/content.ts`. All jobs, bullets, skills, contact info, and education are defined there as typed TypeScript objects.

To scrub a field in the anon version, add it to the `profiles.anon` override at the bottom of the file. Bullet points that reference identifying names get an `anonBullets` array on the entry — the anon profile picks those up automatically and falls back to `bullets` for entries that don't need changes.

## Project Structure

```
.
├── src/
│   ├── index.html              # Thin shell — no inline content
│   ├── content.ts              # All resume data: real + anon profiles (TypeScript source)
│   ├── content.js              # Compiled — generated by tsc, loaded by browser
│   ├── style.css               # Styles and print stylesheet
│   └── fonts/
│       ├── geist-sans/         # Geist Sans TTFs (300, 300i, 400, 500)
│       └── cormorant-garamond/ # Cormorant Garamond TTFs (400)
├── generate.ts                 # Puppeteer PDF generation script (TypeScript source)
├── generate.js                 # Compiled — generated by tsc, run by Docker
├── package.json                # Node deps: puppeteer-core, typescript, @types/node
├── tsconfig.json               # TypeScript config
├── Dockerfile                  # node:20-slim + Chromium; builds TS then runs generate.js
├── docker-compose.yml          # Two services: resume-real and resume-anon
└── build/                      # Generated — PDFs appear here
```

## TODO

- [x] **Separate content from markup** — All resume data lives in `src/content.ts`. Edit bullet points and jobs there, never in the HTML.
- [x] **CI/CD with GitHub Actions** — On every push to `main`, both PDFs are generated and attached as release artifacts.
- [x] **Anonymized resume variant** — `JohnDoe_Resume.pdf` is generated automatically with company names, location, education details, and contact info scrubbed.
- [x] **Self-hosted fonts** — Geist Sans and Cormorant Garamond TTF files are bundled in `src/fonts/` and loaded via `@font-face`. No internet dependency at runtime.
- [ ] **PDF hot-reload watcher** — Add a `watch` service to `docker-compose.yml` that monitors source files and regenerates the PDF automatically.
- [x] **TypeScript** — `src/content.ts` and `generate.ts` are fully typed with strict mode. `tsc` compiles to `.js` in-place.
- [ ] **PDF hot-reload watcher** — Add a `watch` service to `docker-compose.yml` that monitors source files and regenerates the PDF automatically.
- [ ] **Content validation** — Pre-build check that validates the data against the TypeScript interfaces (required fields present, dates formatted correctly, bullet points under a character limit).

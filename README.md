# HTML Resume

A print-ready HTML/CSS resume that uses [WeasyPrint](https://weasyprint.org/) inside Docker to generate a PDF. Running the container outputs `resume.pdf` into a local `build/` folder.

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Arch Linux quick install:**
```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

## Usage

```bash
docker compose up --build
```

The PDF will be written to `./build/resume.pdf`. The `build/` folder is created automatically if it does not exist.

## How it works

The container runs WeasyPrint against `index.html`, mounts the host `./build` directory, and exits after writing the PDF. No browser visit required.

## Project Structure

```
.
├── index.html          # Resume content
├── style.css           # Styles and print stylesheet
├── Dockerfile          # python:3-slim + WeasyPrint
├── docker-compose.yml  # Mounts ./build for PDF output
└── build/              # Generated — resume.pdf appears here
```

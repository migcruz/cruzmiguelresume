FROM python:3-slim

# WeasyPrint system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libcairo2 \
    libgdk-pixbuf-xlib-2.0-0 \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir weasyprint

WORKDIR /app
COPY index.html style.css ./

CMD ["sh", "-c", "mkdir -p /build && weasyprint index.html /build/resume.pdf && echo 'PDF written to /build/resume.pdf'"]

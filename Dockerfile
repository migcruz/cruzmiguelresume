FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/ ./src/
COPY generate.js .

RUN npm init -y && npm install puppeteer-core

ENV CHROMIUM_PATH=/usr/bin/chromium

CMD ["node", "generate.js", "real"]

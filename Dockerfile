FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json tsconfig.json ./
COPY src/ ./src/
COPY generate-resume.ts generate-cover-letter.ts ./

RUN npm install && npm run build

ENV CHROMIUM_PATH=/usr/bin/chromium

CMD ["node", "generate-resume.js", "real"]

import puppeteer from 'puppeteer-core';
import path from 'path';

interface Meta {
  title: string;
  pdfFilename: string;
}

async function generate(profile: string): Promise<void> {
  const browser = await puppeteer.launch({
    executablePath: process.env['CHROMIUM_PATH'] ?? '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const url = `file://${path.resolve(__dirname, 'src/cover-letter/index.html')}?profile=${profile}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  // coverLetterProfiles is a global injected by src/cover-letter/content.js in the browser context
  const meta = await page.evaluate((p: string): Meta => {
    return (globalThis as unknown as { coverLetterProfiles: Record<string, { meta: Meta }> }).coverLetterProfiles[p].meta;
  }, profile);

  await page.pdf({
    path: `/build/${meta.pdfFilename}`,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  await browser.close();
  console.log(`Generated: /build/${meta.pdfFilename}`);
}

generate(process.argv[2] ?? 'real').catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

const puppeteer = require('puppeteer-core');
const path = require('path');

async function generate(profile) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const url = `file://${path.resolve(__dirname, 'src/index.html')}?profile=${profile}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  const meta = await page.evaluate(p => profiles[p].meta, profile);

  await page.pdf({
    path: `/build/${meta.pdfFilename}`,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  await browser.close();
  console.log(`Generated: /build/${meta.pdfFilename}`);
}

generate(process.argv[2] || 'real').catch(err => {
  console.error(err);
  process.exit(1);
});

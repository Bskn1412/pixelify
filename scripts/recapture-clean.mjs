/**
 * Recaptures two blog screenshots, framed on sections that contain NO
 * model-name labels (the marquee strip and the Spiderman model cards
 * have "BiRefNet" / "ClearReality" / "Real-ESRGAN" baked in).
 */
import { chromium } from 'playwright';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3100';
const OUT = path.resolve('public/blogs');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

// 1) Home "Instant Demos" sample grid (scroll to its heading, frame the grid).
await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2000);
await page.getByText('Try sample assets', { exact: false }).first().scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollBy(0, -120));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'home-samples.png'), type: 'png' });
console.log('recaptured home-samples');

// 2) BG remove showcase cards (above the marquee strip).
await page.goto(BASE + '/bg_remove', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 950));
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'bgremove-showcase.png'), type: 'png' });
console.log('recaptured bgremove-showcase');

await browser.close();
console.log('DONE');

/**
 * Captures screenshots of the running Pixelify site for blog posts.
 * Usage: node scripts/capture-blog-images.mjs [baseUrl]
 * Default baseUrl: http://localhost:3000
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = path.resolve('public/blogs');
mkdirSync(OUT, { recursive: true });

const shots = [
  // name, url, viewport, scrollY (px), extra actions
  { name: 'home-hero', url: '/', width: 1440, height: 900, scrollY: 0 },
  { name: 'home-samples', url: '/', width: 1440, height: 900, scrollY: 1600 },
  { name: 'upscaler-page', url: '/upscaler', width: 1440, height: 900, scrollY: 0 },
  { name: 'upscaler-sections', url: '/upscaler', width: 1440, height: 900, scrollY: 1400 },
  { name: 'bgremove-page', url: '/bg_remove', width: 1440, height: 900, scrollY: 0 },
  { name: 'bgremove-showcase', url: '/bg_remove', width: 1440, height: 900, scrollY: 1100 },
  { name: 'story-page', url: '/story', width: 1440, height: 900, scrollY: 0 },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

for (const s of shots) {
  await page.setViewportSize({ width: s.width, height: s.height });
  await page.goto(BASE + s.url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1800); // let entrance animations settle
  if (s.scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), s.scrollY);
    await page.waitForTimeout(1200);
  }
  await page.screenshot({ path: path.join(OUT, `${s.name}.png`), type: 'png' });
  console.log('captured', s.name);
}

// Settings dropdown with the live ENGINE badges (WEBGPU / WASM) — used by the WebGPU blog.
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE + '/upscaler', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
await page.waitForTimeout(2500); // let the engine warm up so the badge reports live
await page.click('button[aria-label="Settings and Preferences"]').catch(() => {});
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(OUT, 'settings-engine.png'), type: 'png' });
console.log('captured settings-engine');

await browser.close();
console.log('DONE ->', OUT);

#!/usr/bin/env node
/**
 * Screenshot the key pages at desktop and mobile widths, and run a few automated
 * layout checks.
 *
 *   npm run build && npm run shots                 all key pages
 *   npm run shots -- --only=home,services          some of them, by name
 *   BASE_URL=http://localhost:4321 npm run shots   use an already running server
 *   npm run shots -- --paths=/work/heal/ --out=screenshots/extra
 *                                                  arbitrary routes into their own folder
 *
 * Output: screenshots/<page>-<device>.png (full page) and
 *         screenshots/tiles/<page>-<device>-<n>.png (viewport-sized slices for review).
 * Checks: horizontal overflow, console errors, broken images, clipped text.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Split on the first "=" only, so values can contain query strings (?palette=brand).
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const OUT = path.resolve(ROOT, arg('out') ?? 'screenshots');

const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services/' },
  { name: 'ethos-test', path: '/services/ethos-test/' },
  { name: 'ethos-evaluation', path: '/services/ethos-evaluation/' },
  { name: 'products', path: '/products/' },
  { name: 'rwi', path: '/products/reframing-welfare-index/' },
  { name: 'room-wisdom', path: '/products/room-wisdom/' },
  { name: 'insights', path: '/insights/' },
  { name: 'work', path: '/work/' },
  { name: 'project', path: '/work/multipod/' },
  { name: 'about', path: '/about/' },
  { name: 'contact', path: '/contact/' },
];

const only = arg('only')?.split(',');
let pages = PAGES;
if (only) pages = pages.filter((p) => only.includes(p.name));
const customPaths = arg('paths')?.split(',');
if (customPaths) pages = customPaths.map((p) => ({ name: p.replace(/^\/+|\/+$/g, '').replace(/[/?=&]+/g, '-') || 'home', path: p }));

async function startServer() {
  if (process.env.BASE_URL) return { url: process.env.BASE_URL, stop: () => {} };
  const port = 4399;
  // Astro 7 runs `astro preview` as a background daemon, so stop it explicitly.
  const stop = () => spawn('npx', ['astro', 'preview', 'stop'], { cwd: ROOT, stdio: 'ignore' });
  spawn('npx', ['astro', 'preview', '--port', String(port)], { cwd: ROOT, stdio: 'ignore' });
  const url = `http://localhost:${port}`;
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return { url, stop };
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  stop();
  throw new Error('Preview server did not start. Did you run `npm run build`?');
}

const server = await startServer();
// A full run starts clean; subsets (--only, --paths) keep what is already there.
if (!only && !customPaths) await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(path.join(OUT, 'tiles'), { recursive: true });
const browser = await chromium.launch();
const issues = [];

for (const [device, opts] of Object.entries(DEVICES)) {
  const context = await browser.newContext({ ...opts, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  for (const p of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(server.url + p.path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // The direction switcher is a review aid; keep it out of the captures.
    await page.addStyleTag({ content: '[data-proto-bar]{display:none!important}' });
    // Lazy images below the fold never load in a full-page capture: load them all first.
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
      await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
    });

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed' && !el.closest('[class*="overflow-hidden"],[class*="overflow-x-auto"],.ec-table-scroll');
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')} (right ${Math.round(el.getBoundingClientRect().right)}px)`);
      const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
      const clipped = [...document.querySelectorAll('h1,h2,h3,p,a,span,li,dt,dd')]
        .filter((el) => el.children.length === 0 && !el.closest('.sr-only,.truncate') && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
        .slice(0, 5)
        .map((el) => el.textContent.trim().slice(0, 50));
      // Text cut off by the viewport even when an overflow-hidden ancestor hides the scrollbar.
      const offscreenText = [...document.querySelectorAll('h1,h2,h3,h4,p,a,li,dt,dd,span,strong')]
        .filter((el) => {
          if (el.closest('.sr-only,.ec-table-scroll,[aria-hidden="true"] svg')) return false;
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!own) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.right > vw + 1 || r.left < -1);
        })
        .slice(0, 5)
        .map((el) => `"${el.textContent.trim().slice(0, 40)}" (right ${Math.round(el.getBoundingClientRect().right)}px)`);
      return { scrollWidth: document.documentElement.scrollWidth, vw, overflow, brokenImages, clipped, offscreenText, height: document.documentElement.scrollHeight };
    });

    const file = `${p.name}-${device}`;
    await page.screenshot({ path: path.join(OUT, `${file}.png`), fullPage: true });
    const h = opts.viewport.height;
    const tiles = Math.min(Math.ceil(report.height / h), 60);
    for (let i = 0; i < tiles; i++) {
      await page.screenshot({ path: path.join(OUT, 'tiles', `${file}-${String(i + 1).padStart(2, '0')}.png`), fullPage: true, clip: { x: 0, y: i * h, width: opts.viewport.width, height: Math.min(h, report.height - i * h) } });
    }

    const problems = [];
    if (report.scrollWidth > report.vw) problems.push(`horizontal scroll: ${report.scrollWidth}px > ${report.vw}px`);
    if (report.overflow.length) problems.push(`elements past the viewport: ${report.overflow.join('; ')}`);
    if (report.brokenImages.length) problems.push(`broken images: ${report.brokenImages.join(', ')}`);
    if (report.clipped.length) problems.push(`clipped text: ${report.clipped.join(' | ')}`);
    if (report.offscreenText.length) problems.push(`text outside the viewport: ${report.offscreenText.join(' | ')}`);
    if (errors.length) problems.push(`console errors: ${errors.join(' | ')}`);
    console.log(`${problems.length ? '✗' : '✓'} ${file.padEnd(28)} ${String(report.height).padStart(6)}px  ${tiles} tiles`);
    problems.forEach((pr) => console.log(`    ${pr}`));
    if (problems.length) issues.push({ file, problems });
    await page.close();
  }
  await context.close();
}

await browser.close();
server.stop();
console.log(`\n${issues.length ? `${issues.length} page(s) with issues` : 'No automated issues found'}. Screenshots in ${path.relative(ROOT, OUT)}/`);

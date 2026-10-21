// Small browser test harness: pinned Playwright, SwiftShader WebGL, an
// ephemeral same-origin server that always stops, screenshots in qa/ and a
// public report without local paths.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT } from '../../scripts/setup-demo.mjs';
import { serve } from '../../scripts/serve.mjs';

const require = createRequire(import.meta.url);

// The pinned devDependency first. PLAYWRIGHT_MODULE points to an existing
// install of the same version when node_modules is not available.
let modulePath;
export function loadPlaywright() {
  try {
    modulePath = require.resolve('playwright');
  } catch {
    if (!process.env.PLAYWRIGHT_MODULE) throw new Error('playwright is not installed: run npm ci or set PLAYWRIGHT_MODULE');
    modulePath = require.resolve(process.env.PLAYWRIGHT_MODULE);
  }
  return require(modulePath);
}

export const LAUNCH = {
  headless: true,
  ignoreDefaultArgs: ['--hide-scrollbars'],
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
};

export const QA = join(ROOT, 'qa');

export async function suite(name, body) {
  const playwright = loadPlaywright();
  const results = [];
  const started = new Date().toISOString();
  mkdirSync(QA, { recursive: true });
  const { server, url } = await serve();
  const browser = await playwright.chromium.launch(LAUNCH);
  const chromium = browser.version();
  const test = async (title, fn) => {
    try {
      const detail = await fn();
      results.push({ name: title, status: 'PASS', detail: detail ?? null });
      console.log('PASS ' + title);
    } catch (error) {
      results.push({ name: title, status: 'FAIL', detail: String(error && error.message || error).split(url).join('/') });
      console.error('FAIL ' + title + '\n  ' + (error && error.stack || error));
    }
  };
  try {
    await body({ browser, url, test, shot: (page, file) => page.screenshot({ path: join(QA, file) }) });
  } finally {
    await browser.close();
    await new Promise(ok => server.close(ok));
  }
  const failed = results.filter(r => r.status === 'FAIL').length;
  const report = {
    suite: name,
    started,
    playwright: require(join(dirname(modulePath), 'package.json')).version,
    chromium,
    renderer: 'Chromium headless with SwiftShader WebGL. Emulated viewports, not physical devices.',
    total: results.length,
    passed: results.length - failed,
    failed,
    results
  };
  mkdirSync(join(ROOT, 'reports'), { recursive: true });
  writeFileSync(join(ROOT, 'reports', 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(report.passed + '/' + report.total + ' browser tests passed');
  if (failed) process.exitCode = 1;
  return report;
}

// Page with error and request tracking. Every request must stay same-origin.
export async function open(browser, url, path, context = {}) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 900 } }, context));
  if (context.init) await ctx.addInitScript(context.init);
  const page = await ctx.newPage();
  page.errors = [];
  page.foreign = [];
  page.requests = [];
  page.on('pageerror', e => page.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
  page.on('request', r => { page.requests.push(r.url()); if (!r.url().startsWith(url) && !r.url().startsWith('data:')) page.foreign.push(r.url()); });
  await page.goto(url + path);
  return page;
}

export async function sweep(page, from, to, steps = 24, wait = 24) {
  for (let i = 0; i <= steps; i++) {
    await page.mouse.move(from[0] + (to[0] - from[0]) * i / steps, from[1] + (to[1] - from[1]) * i / steps);
    await page.waitForTimeout(wait);
  }
}

// Choose a level through the real Juega menu (desktop or mobile button).
export async function chooseLevel(page, level) {
  const opener = page.locator('.jz-lvl:visible, .jz-feel:visible').first();
  if (await page.locator('#jz-panel').isHidden()) await opener.click();
  await page.locator('#jz-panel input[name=jz-level][value="' + level + '"]').check();
  await page.waitForFunction(l => document.documentElement.getAttribute('data-jz-level') === l, level);
  await page.keyboard.press('Escape');
}

export const EXPECTED = {
  off: { intensity: 'nada', layer: 'off', radius: 0 },
  subtle: { intensity: 'poquito', layer: 'dots', radius: 0 },
  full: { intensity: 'mucho', layer: 'fluid', radius: 10 },
  hard: { intensity: 'hardcore', layer: 'fluid', radius: 18 }
};

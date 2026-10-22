// Capture the real examples/ page. No synthetic ink, budget overrides or shader changes.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, verifyVendor } from './setup-demo.mjs';
import { serve } from './serve.mjs';
import { LAUNCH, loadPlaywright, chooseLevel } from '../tests/browser/harness.mjs';
const vendor = verifyVendor();
const personal = vendor.gameFeel != null;
const media = join(ROOT, 'docs/media');
mkdirSync(media, { recursive: true });
mkdirSync(join(ROOT, 'qa/video'), { recursive: true });
const { server, url } = await serve();
const browser = await loadPlaywright().chromium.launch(LAUNCH);
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, recordVideo: { dir: join(ROOT, 'qa/video'), size: { width: 1280, height: 900 } } });
const page = await context.newPage();
const evidence = { cursor: vendor.cursor, renderer: 'Chromium + SwiftShader; real pointer events; unchanged engine budget', levels: [] };
try {
  await page.goto(url + 'examples/');
  if (personal) await page.evaluate(() => window.papacitoReady);
  else await page.waitForFunction(() => GameFeelCursor.current);
  if (personal) await page.screenshot({ path: join(media, 'moki.png') });
  // Earn Hardcore with the same real interactions as the visitor.
  if (personal) {
    for (let i = 0; i < await page.locator('.moki').count(); i++) await page.locator('.moki').nth(i).click();
    await page.waitForFunction(() => !document.querySelector('#jz-panel input[value=hard]').disabled);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1100);
  } else {
    await page.click('#tap');
    await page.locator('#note').pressSequentially('Una nota real');
    await page.click('#save');
    await page.click('#tab-b');
  }
  await page.evaluate(() => scrollTo(0, 0));
  for (const [level, name] of [['subtle', 'poquito'], ['full', 'mucho'], ['hard', 'hardcore']]) {
    await chooseLevel(page, level);
    // A new instance starts the engine's normal budget, never changes it.
    if (personal) await page.evaluate(() => PapacitoJuice.mount());
    else await page.evaluate(() => GameFeelCursor.mount());
    for (let i = 0; i < 28; i++) {
      await page.mouse.move(230 + i * 23, 470 + Math.sin(i / 4) * 70);
      await page.waitForTimeout(18);
    }
    await page.screenshot({ path: join(media, name + '.png') });
    evidence.levels.push({ level, stats: await page.evaluate(() => GameFeelCursor.current.stats), mokiVisible: await page.locator('.moki:visible').count() });
  }
  await context.close();
  evidence.video = 'qa/video/' + (await page.video().path()).split('/').pop();
  writeFileSync(join(ROOT, 'reports/media-report.json'), JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await browser.close();
  await new Promise(ok => server.close(ok));
}

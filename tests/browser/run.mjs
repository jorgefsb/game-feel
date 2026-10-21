// Real browser suite for the generic Game Feel demo (no mascot).
// Run `npm run setup` first. vendor/ is re-hashed before any page opens.
import assert from 'node:assert/strict';
import { verifyVendor } from '../../scripts/setup-demo.mjs';
import { EXPECTED, chooseLevel, open, suite, sweep } from './harness.mjs';

const vendor = verifyVendor();
console.log('vendor verified: golden engine ' + vendor.cursor.golden_engine_sha256.slice(0, 12) + ', juice ' + vendor.juice.version + ' @ ' + vendor.juice.commit.slice(0, 7));

const PAGE = 'examples/';
const PALETTE = ['rgb(255, 107, 53)', 'rgb(34, 33, 31)', 'rgb(244, 232, 213)'];
const ready = page => page.waitForFunction(() => window.GameFeelCursor && GameFeelCursor.current && window.JZ);
const stats = page => page.evaluate(() => GameFeelCursor.current.stats);

// The demo's own achievement, done with real clicks and typing.
async function earnHardcore(page) {
  await page.click('#tap');
  await page.fill('#note', '');
  await page.locator('#note').pressSequentially('primera nota');
  await page.click('#save');
  await page.click('#tab-b');
  await page.waitForFunction(() => !document.querySelector('#jz-panel input[value=hard]').disabled);
}

await suite('game-feel', async ({ browser, url, test, shot }) => {
  const page = await open(browser, url, PAGE);
  await ready(page);

  await test('generic page runs without any mascot', async () => {
    const v = await page.evaluate(() => ({ moki: typeof window.Moki, spots: document.querySelectorAll('.moki,[data-moki]').length, owner: document.documentElement.getAttribute('data-game-feel-cursor') }));
    assert.equal(v.moki, 'undefined');
    assert.equal(v.spots, 0);
    assert.equal(v.owner, 'liquid');
    assert.equal(page.requests.filter(r => r.includes('/moki/')).length, 0);
    return v;
  });

  await test('Hardcore stays locked until the page achievement is earned with real events', async () => {
    await page.click('.jz-lvl');
    assert.equal(await page.locator('#jz-panel input[value=hard]').isDisabled(), true);
    await page.keyboard.press('Escape');
    await earnHardcore(page);
    return { unlockedBy: 'tap + typed note + tab', stored: await page.evaluate(() => localStorage.getItem('jz-hard')) };
  });

  for (const level of ['off', 'subtle', 'full', 'hard']) {
    await test('Juega ' + level + ' maps to ' + EXPECTED[level].intensity, async () => {
      await chooseLevel(page, level);
      await sweep(page, [220, 470], [760, 640]);
      const s = await stats(page);
      assert.equal(s.juiceLevel, level);
      for (const key of ['intensity', 'layer', 'radius']) assert.equal(s[key], EXPECTED[level][key]);
      if (s.layer === 'fluid') {
        assert.equal(s.fluid.radius, EXPECTED[level].radius);
        assert.ok(s.fluid.splats > 0, 'fluid received pointer input');
        assert.equal(s.fluid.error, null);
      } else {
        assert.notEqual(s.fluid.state, 'running');
      }
      await shot(page, 'desktop-' + level + '.png');
      return { intensity: s.intensity, layer: s.layer, radius: s.radius, fluid: s.fluid.state };
    });
  }

  await test('Poquito draws the original 7 px dots in orange, dark and cream', async () => {
    await chooseLevel(page, 'subtle');
    await sweep(page, [200, 520], [700, 560], 16, 45);
    const v = await page.evaluate(() => [...document.querySelectorAll('.liquid-original-dot')].map(d => ({ w: getComputedStyle(d).width, bg: getComputedStyle(d).backgroundColor })));
    assert.ok(v.length > 0);
    assert.ok(v.every(d => d.w === '7px'));
    assert.ok(v.every(d => PALETTE.includes(d.bg)), JSON.stringify(v));
    assert.equal(await page.locator('.jzh-t').count(), 0, 'Hardcore trail only exists in hard');
    return { dots: v.length, colours: [...new Set(v.map(d => d.bg))] };
  });

  await test('Hardcore shows one trail: liquid visible, old .jzh-t hidden, celebrations kept', async () => {
    await chooseLevel(page, 'hard');
    // A fresh instance: SwiftShader can trip the engine's own frame budget
    // after the earlier sweeps, which pauses the fluid by design.
    await page.evaluate(() => GameFeelCursor.mount());
    await sweep(page, [180, 500], [800, 620], 30, 45);
    const v = await page.evaluate(() => {
      const old = [...document.querySelectorAll('.jzh-t')];
      return { old: old.length, oldVisible: old.filter(e => getComputedStyle(e).display !== 'none').length, dots: GameFeelCursor.current.stats.dots.alive, fluid: GameFeelCursor.current.stats.fluid.state };
    });
    assert.ok(v.old > 0, 'hardcore.js still creates its trail nodes');
    assert.equal(v.oldVisible, 0);
    assert.equal(v.dots, 0);
    assert.equal(v.fluid, 'running');
    await page.click('#tap');
    const celebration = await page.evaluate(() => [...document.querySelectorAll('.jzh-p')].filter(e => getComputedStyle(e).display !== 'none').length);
    assert.ok(celebration > 0, 'Hardcore particles still show');
    await shot(page, 'desktop-hard-celebration.png');
    return Object.assign(v, { celebrationParticles: celebration });
  });

  await test('clicks and typing work at every level, nothing covers the controls', async () => {
    const out = {};
    for (const level of ['off', 'subtle', 'full', 'hard']) {
      await chooseLevel(page, level);
      await page.click('#tab-a');
      await page.fill('#note', '');
      await page.locator('#note').pressSequentially('Hola, ñandú 123');
      assert.equal(await page.inputValue('#note'), 'Hola, ñandú 123');
      const hit = await page.evaluate(() => {
        const b = document.getElementById('save').getBoundingClientRect();
        return document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2).id;
      });
      assert.equal(hit, 'save');
      await page.click('#save');
      assert.match(await page.textContent('#note-status'), /Nota guardada: Hola, ñandú 123/);
      out[level] = 'ok';
    }
    const layers = await page.evaluate(() => [...document.querySelectorAll('.liquid-cursor-layer,.liquid-original-dots')].map(e => getComputedStyle(e).pointerEvents));
    assert.ok(layers.every(p => p === 'none'));
    return out;
  });

  await test('empty note gives error feedback, not success', async () => {
    await chooseLevel(page, 'subtle');
    await page.fill('#note', '');
    await page.click('#save');
    await page.waitForFunction(() => document.getElementById('note').classList.contains('juice-shake'));
    return { status: await page.textContent('#note-status') };
  });

  await test('destroy restores compatibility, remount is clean', async () => {
    await chooseLevel(page, 'hard');
    await page.evaluate(() => GameFeelCursor.current.destroy());
    const after = await page.evaluate(() => ({ owner: document.documentElement.hasAttribute('data-game-feel-cursor'), layers: document.querySelectorAll('.liquid-cursor-layer,.liquid-original-dots').length, current: GameFeelCursor.current, liquid: LiquidCursor.current, level: JZ.level }));
    assert.deepEqual(after, { owner: false, layers: 0, current: null, liquid: null, level: 'hard' });
    await sweep(page, [200, 500], [600, 520], 12, 45);
    const oldVisible = await page.evaluate(() => [...document.querySelectorAll('.jzh-t')].filter(e => getComputedStyle(e).display !== 'none').length);
    assert.ok(oldVisible > 0, 'the previous Hardcore trail is back once the liquid cursor is gone');
    await page.evaluate(() => { for (let i = 0; i < 3; i++) GameFeelCursor.mount(); });
    const remount = await page.evaluate(() => ({ canvases: document.querySelectorAll('.liquid-cursor-layer').length, dotHosts: document.querySelectorAll('.liquid-original-dots').length, same: LiquidCursor.current === GameFeelCursor.current.cursor, owner: document.documentElement.getAttribute('data-game-feel-cursor') }));
    assert.deepEqual(remount, { canvases: 2, dotHosts: 1, same: true, owner: 'liquid' });
    return { oldTrailVisibleAfterDestroy: oldVisible, remount };
  });

  await test('a previous owner value is restored, a later owner is not erased', async () => {
    const v = await page.evaluate(() => {
      const doc = document.documentElement;
      GameFeelCursor.current.destroy();
      doc.setAttribute('data-game-feel-cursor', 'site-cursor');
      GameFeelCursor.mount().destroy();
      const restored = doc.getAttribute('data-game-feel-cursor');
      doc.removeAttribute('data-game-feel-cursor');
      const h = GameFeelCursor.mount();
      doc.setAttribute('data-game-feel-cursor', 'other-owner');
      h.destroy();
      const kept = doc.getAttribute('data-game-feel-cursor');
      doc.removeAttribute('data-game-feel-cursor');
      GameFeelCursor.mount();
      return { restored, kept };
    });
    assert.deepEqual(v, { restored: 'site-cursor', kept: 'other-owner' });
    return v;
  });

  await test('reduced motion changing at runtime turns everything to Nada', async () => {
    await chooseLevel(page, 'full');
    await sweep(page, [200, 500], [600, 520], 8);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => JZ.level === 'off' && GameFeelCursor.current.stats.intensity === 'nada');
    const v = await page.evaluate(() => ({ fluid: GameFeelCursor.current.stats.fluid.state, layer: getComputedStyle(document.querySelector('.liquid-cursor-layer')).display }));
    assert.notEqual(v.fluid, 'running');
    assert.equal(v.layer, 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    return v;
  });

  await test('same origin only, no console errors', async () => {
    assert.deepEqual(page.foreign, []);
    assert.deepEqual(page.errors, []);
    return { requests: page.requests.length };
  });
  await page.context().close();

  await test('reduced motion from the first load: Nada, no dots, no old trail', async () => {
    const p = await open(browser, url, PAGE, { reducedMotion: 'reduce' });
    await ready(p);
    await sweep(p, [200, 500], [700, 560], 16, 45);
    const v = await p.evaluate(() => ({ level: JZ.level, s: GameFeelCursor.current.stats, dots: document.querySelectorAll('.liquid-original-dot').length, old: document.querySelectorAll('.jzh-t').length }));
    assert.equal(v.level, 'off');
    assert.equal(v.s.intensity, 'nada');
    assert.equal(v.dots, 0);
    assert.equal(v.old, 0);
    assert.deepEqual(p.errors, []);
    await p.context().close();
    return { level: v.level, intensity: v.s.intensity };
  });

  await test("the visitor's mute and level choices are not overridden", async () => {
    const p = await open(browser, url, PAGE, { init: () => { localStorage.setItem('gamedev_sfx', 'off'); localStorage.setItem('jz-level', 'off'); } });
    await ready(p);
    const v = await p.evaluate(() => ({ pressed: document.querySelector('.juice-sfx').getAttribute('aria-pressed'), level: JZ.level, intensity: GameFeelCursor.current.stats.intensity, sfx: localStorage.getItem('gamedev_sfx'), stored: localStorage.getItem('jz-level') }));
    assert.deepEqual(v, { pressed: 'false', level: 'off', intensity: 'nada', sfx: 'off', stored: 'off' });
    await p.context().close();
    return v;
  });

  await test('375 px: Juega works and nothing overflows at any level', async () => {
    const p = await open(browser, url, PAGE, { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
    await ready(p);
    await earnHardcore(p);
    const out = {};
    for (const level of ['off', 'subtle', 'full', 'hard']) {
      await chooseLevel(p, level);
      await p.click('#tap');
      const v = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, s: GameFeelCursor.current.stats.intensity }));
      assert.ok(v.sw <= v.iw, level + ' overflows: ' + v.sw + ' > ' + v.iw);
      assert.equal(v.s, EXPECTED[level].intensity);
      await p.evaluate(() => scrollTo(0, 0));
      await shot(p, 'mobile-' + level + '.png');
      out[level] = v.sw;
    }
    assert.deepEqual(p.errors, []);
    await p.context().close();
    return out;
  });
});

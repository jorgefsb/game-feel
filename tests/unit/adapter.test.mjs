// Contract tests for src/game-feel-cursor.js in a minimal DOM stand-in.
// The browser suite repeats the important checks against the real engines.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SOURCE = readFileSync(new URL('../../src/game-feel-cursor.js', import.meta.url), 'utf8');
const LEVELS = { off: 'nada', subtle: 'poquito', full: 'mucho', hard: 'hardcore' };
const ATTR = 'data-game-feel-cursor';

function fakeCursor(edit) {
  const cursor = {
    juiceLevels: Object.assign({}, LEVELS),
    intensities: { nada: { radius: 0 }, poquito: { radius: 0 }, mucho: { radius: 10 }, hardcore: { radius: 18 } },
    current: null,
    live: [],
    calls: [],
    mount(options) {
      if (cursor.current) cursor.current.destroy();
      const instance = {
        options, destroyed: false, stats: { intensity: 'poquito' },
        destroy() {
          if (this.destroyed) return;
          this.destroyed = true;
          cursor.live.splice(cursor.live.indexOf(this), 1);
          if (cursor.current === this) cursor.current = null;
        }
      };
      cursor.live.push(instance);
      cursor.calls.push(options);
      cursor.current = instance;
      return instance;
    }
  };
  if (edit) edit(cursor);
  return cursor;
}

function load({ css = true, jz, cursor = fakeCursor(), attrs = {} } = {}) {
  const map = new Map(Object.entries(attrs));
  const writes = [];
  const documentElement = {
    hasAttribute: k => map.has(k),
    getAttribute: k => (map.has(k) ? map.get(k) : null),
    setAttribute: (k, v) => { writes.push(k); map.set(k, String(v)); },
    removeAttribute: k => { writes.push(k); map.delete(k); }
  };
  const probes = [];
  const document = {
    documentElement,
    body: { appendChild: el => probes.push(el) },
    createElement: () => ({ className: '', remove() { this.removed = true; } })
  };
  const win = {
    document,
    LiquidCursor: cursor,
    JZ: jz,
    getComputedStyle: el => ({ display: css && el.className === 'jzh-t' && map.get(ATTR) === 'liquid' ? 'none' : 'block' })
  };
  win.window = win;
  vm.runInNewContext(SOURCE, win);
  return { win, gf: win.GameFeelCursor, cursor, map, writes, probes };
}

test('exposes exactly the four Juega levels with the approved radii', () => {
  const { gf } = load();
  assert.deepEqual({ ...gf.levels }, LEVELS);
  assert.deepEqual({ ...gf.radii }, { nada: 0, poquito: 0, mucho: 10, hardcore: 18 });
  assert.equal(gf.attribute, ATTR);
});

test('mount follows Juice by default and marks the page as cursor owner', () => {
  const { gf, cursor, map, probes } = load({ jz: { level: 'subtle' } });
  const handle = gf.mount({ color: '#123456' });
  assert.equal(map.get(ATTR), 'liquid');
  assert.equal(cursor.calls.length, 1);
  assert.equal(cursor.calls[0].followJuice, true);
  assert.equal(cursor.calls[0].color, '#123456');
  assert.ok(!('cursor' in cursor.calls[0]) && !('requireJuice' in cursor.calls[0]), 'adapter options are not forwarded');
  assert.equal(probes.length, 1);
  assert.ok(probes[0].removed, 'CSS probe is removed');
  assert.equal(gf.current, handle);
  assert.equal(handle.stats.owner, 'liquid');
});

test('destroy removes the mark when the page had none', () => {
  const { gf, cursor, map } = load();
  const handle = gf.mount();
  handle.destroy();
  assert.equal(map.has(ATTR), false);
  assert.equal(cursor.live.length, 0);
  assert.equal(gf.current, null);
  handle.destroy();
  assert.equal(map.has(ATTR), false, 'second destroy is a no-op');
});

test('destroy restores a previous value owned by the page', () => {
  const { gf, map } = load({ attrs: { [ATTR]: 'site-cursor' } });
  gf.mount().destroy();
  assert.equal(map.get(ATTR), 'site-cursor');
});

test('destroy leaves the attribute alone if someone else changed it meanwhile', () => {
  const { gf, map } = load();
  const handle = gf.mount();
  map.set(ATTR, 'other-owner');
  handle.destroy();
  assert.equal(map.get(ATTR), 'other-owner');
});

test('repeated mount keeps one cursor and the original previous value', () => {
  const { gf, cursor, map } = load({ attrs: { [ATTR]: 'site-cursor' } });
  gf.mount();
  gf.mount();
  const last = gf.mount();
  assert.equal(cursor.live.length, 1);
  assert.equal(map.get(ATTR), 'liquid');
  last.destroy();
  assert.equal(map.get(ATTR), 'site-cursor');
});

test('never writes the Juice level, sound or mascot attributes', () => {
  const { gf, writes } = load({ jz: { level: 'hard' } });
  gf.mount().destroy();
  assert.deepEqual([...new Set(writes)], [ATTR]);
});

test('rejects a missing cursor build', () => {
  const { gf, map } = load({ cursor: null });
  assert.throws(() => gf.mount(), /load cursor-liquido\.js first/);
  assert.equal(map.has(ATTR), false);
});

test('rejects a cursor build with another level mapping or radius', () => {
  for (const edit of [c => { c.juiceLevels.full = 'hardcore'; }, c => { c.intensities.mucho.radius = 12; }, c => { delete c.juiceLevels.hard; }]) {
    const { gf, map } = load({ cursor: fakeCursor(edit) });
    assert.throws(() => gf.mount(), /does not map/);
    assert.equal(map.has(ATTR), false);
  }
});

test('requireJuice demands window.JZ, an unknown level is rejected', () => {
  assert.throws(() => load().gf.mount({ requireJuice: true }), /window\.JZ/);
  assert.throws(() => load({ jz: { level: 'legendario' } }).gf.mount(), /unknown Juice level legendario/);
  assert.doesNotThrow(() => load().gf.mount(), 'Juice is optional unless required');
});

test('missing adapter CSS fails and restores the attribute', () => {
  const { gf, cursor, map } = load({ css: false, attrs: { [ATTR]: 'site-cursor' } });
  assert.throws(() => gf.mount(), /game-feel-cursor\.css is not loaded/);
  assert.equal(map.get(ATTR), 'site-cursor');
  assert.equal(cursor.calls.length, 0, 'cursor is not mounted');
});

test('a throwing cursor mount restores the attribute', () => {
  const { gf, map } = load({ cursor: fakeCursor(c => { c.mount = () => { throw new Error('boom'); }; }) });
  assert.throws(() => gf.mount(), /boom/);
  assert.equal(map.has(ATTR), false);
});

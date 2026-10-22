// Pins and verification rules of scripts/setup-demo.mjs. Tests that need the
// real files read vendor/ and are skipped until `npm run setup` has run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CURSOR, JUICE, VENDOR, checkCursorBundle, engineSha256, sha256, verifyVendor } from '../../scripts/setup-demo.mjs';

const hasVendor = existsSync(join(VENDOR, 'setup-report.json'));

test('juice pin is the canonical 1.2.0 commit, generic subset only', () => {
  assert.equal(JUICE.version, '1.2.0');
  assert.equal(JUICE.commit, 'f1b3b9c77a43ffbcbd331bb88420a436614fdbc3');
  assert.ok(JUICE.base.includes('/' + JUICE.commit + '/juice/1.2.0/'));
  assert.deepEqual(Object.keys(JUICE.files).sort(), ['hardcore/hardcore.css', 'hardcore/hardcore.js', 'juice-menu.css', 'juice-menu.js', 'juice.css', 'juice.js']);
  assert.ok(!Object.keys(JUICE.files).some(f => f.startsWith('moki/')), 'Game Feel never downloads mascot files');
  for (const h of Object.values(JUICE.files)) assert.match(h, /^[0-9a-f]{64}$/);
});

test('cursor pin is the approved renderer and release 1.0.1', () => {
  assert.equal(CURSOR.goldenEngineSha256, '3d478cc836969c216812c7e479724e0e204bbb76a26df24c2414568883021230');
  assert.equal(CURSOR.sources.renderer.sha256, CURSOR.goldenEngineSha256);
  assert.ok(CURSOR.release.endsWith('/releases/download/v1.0.1/'));
});

test('a bundle without the approved renderer is rejected', () => {
  const fake = Buffer.from('/*! x */\n' + CURSOR.engineHeader + ' but different bytes */\nroot.FluidEngine=ApprovedEngineAdapter\nroot.LiquidCursor = LiquidCursor');
  assert.notEqual(engineSha256(fake), CURSOR.goldenEngineSha256);
  assert.throws(() => checkCursorBundle(fake), /does not contain the approved renderer/);
  assert.equal(engineSha256(Buffer.from('no engine here')), null);
});

test('vendor/ matches every pin and the upstream manifest', { skip: !hasVendor && 'run npm run setup first' }, () => {
  const report = verifyVendor();
  const manifest = JSON.parse(readFileSync(join(VENDOR, 'juice', '1.2.0', 'manifest.json')));
  for (const [name, h] of Object.entries(JUICE.files)) assert.equal(manifest.files[name].sha256, h);
  const bundle = readFileSync(join(VENDOR, 'cursor-liquido', 'cursor-liquido.js'));
  assert.equal(engineSha256(bundle), CURSOR.goldenEngineSha256);
  assert.equal(report.cursor.files['cursor-liquido.js'], sha256(bundle));
  assert.ok(!existsSync(join(VENDOR, 'juice', '1.2.0', 'moki')), 'no mascot files in the generic vendor');
});

 test('renderer-only and guard-tampered bundles are rejected', { skip: !hasVendor }, () => {
   const buf = readFileSync(join(VENDOR, 'cursor-liquido', 'cursor-liquido.js'));
   assert.doesNotThrow(() => checkCursorBundle(buf));
   for (const name of ['adapter', 'guard', 'wrapper']) {
     const spec = CURSOR.sources[name];
     const changed = Buffer.from(buf);
     const at = spec.offset;
     assert.ok(at >= 0);
     changed[at + spec.bytes - 3] ^= 1;
     assert.throws(() => checkCursorBundle(changed), /sha256/);
   }
   const guard = CURSOR.sources.guard;
   const rendererOnly = Buffer.concat([buf.subarray(0, guard.offset), buf.subarray(guard.offset + guard.bytes)]);
   assert.throws(() => checkCursorBundle(rendererOnly), /sha256/);
   assert.equal(CURSOR.version, '1.0.1');
 });

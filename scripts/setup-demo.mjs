#!/usr/bin/env node
// Builds vendor/ for the demo and the browser tests. Everything it writes is
// ignored by Git and checked against pinned sha256 values before use.
//
//   node scripts/setup-demo.mjs [--juice-dir DIR] [--cursor-dir DIR] [--cursor-css FILE]
//   node scripts/setup-demo.mjs --verify-only
//
// Downloads juice 1.2.0 from the pinned upstream commit and stable Cursor
// líquido 1.0.1 release assets. Local --cursor-dir accepts dist only, with its
// stable manifest. No source recovery fallback. Every component is hash-pinned.
// Moki artwork (Papacito Juice only) and the personal brand are not MIT.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const VENDOR = join(ROOT, 'vendor');

const JUICE_COMMIT = 'f1b3b9c77a43ffbcbd331bb88420a436614fdbc3';
export const JUICE = Object.freeze({
  version: '1.2.0',
  repository: 'https://github.com/jorgefsb/game-industry-resources',
  commit: JUICE_COMMIT,
  base: 'https://raw.githubusercontent.com/jorgefsb/game-industry-resources/' + JUICE_COMMIT + '/juice/1.2.0/',
  manifestSha256: 'a4da3499b6e171221a11477c839e08fadbbc846fc687266c5007bace6a2c6568',
  // Generic subset. Values are copied from that commit's manifest.json and
  // re-checked against it on every run.
  files: Object.freeze({
    'juice.css': '2d02b3e2d968cd5afe9b6174979255b97aa7ad8793c682273a85976f06058981',
    'juice.js': '79ef95b5ee106fcc477f2f79c13bce8dae82401a28a91f328e53f152ac4d9995',
    'juice-menu.css': '1e6d00d4e95c2b6640fd5eb9470552c75eea2744698b8267287c1b80a79edabc',
    'juice-menu.js': '00f0edeb1246003927b1ce8c8ecdc75bfccee46d753a6caac0cf71aa6333b596',
    'hardcore/hardcore.css': '0c727d475e66651f12c5d5a618e1fed365ae1a78195a82f2ca56a07e18f01bcb',
    'hardcore/hardcore.js': 'b4671dfaf0b5853d4f5c950c66cc8920da245c95c7b836ec682af15b1c70dd70'
  })
});

export const CURSOR = Object.freeze({
  version: '1.0.1',
  repository: 'https://github.com/jorgefsb/cursor-liquido',
  release: 'https://github.com/jorgefsb/cursor-liquido/releases/download/v1.0.1/',
  goldenEngineSha256: '3d478cc836969c216812c7e479724e0e204bbb76a26df24c2414568883021230',
  engineHeader: '/* Fluid cursor v3. Original site module',
  engineBytes: 31176,
  files: Object.freeze({
    "cursor-liquido.js": "d1ce69c56780c1a0ed23499e4cd4db3e00f797c0dddab7f54b341b7dbe5802f8",
    "cursor-liquido.css": "48ea2645dd676a870fda373edb4b418707814040032ba38655ab20888d4283b3"
  }),
  sources: Object.freeze({
    "renderer": {
      "file": "approved-fluid-v3.1.js",
      "sha256": "3d478cc836969c216812c7e479724e0e204bbb76a26df24c2414568883021230",
      "bytes": 31176,
      "offset": 437
    },
    "adapter": {
      "file": "approved-engine-adapter.js",
      "sha256": "570bb84eea0856393c106d28a8cc01a18a269ffae31c453d30d88be72372ab2c",
      "bytes": 663,
      "offset": 31613
    },
    "guard": {
      "file": "quality-input-guard.js",
      "sha256": "baeb7ce87fe8d62801331af5b7452657594a3cf40b82cd9255c945fa97e33561",
      "bytes": 824,
      "offset": 32276
    },
    "wrapper": {
      "file": "liquid-cursor.js",
      "sha256": "1ad9cdba9e10be125e4a102aa14b969aedf0b0d7e572386255a9271264bea8d0",
      "bytes": 9566,
      "offset": 33100
    }
  })
});

export const sha256 = buf => createHash('sha256').update(buf).digest('hex');

// The renderer travels verbatim inside every bundle. Find it and hash it.
export function engineSha256(bundle) {
  const at = bundle.indexOf(Buffer.from(CURSOR.engineHeader));
  if (at < 0) return null;
  return sha256(bundle.subarray(at, at + CURSOR.engineBytes));
}

export function checkCursorBundle(bundle) {
  const found = engineSha256(bundle);
  if (found !== CURSOR.goldenEngineSha256) {
    throw new Error('cursor-liquido.js does not contain the approved renderer (found ' + found + ', expected ' + CURSOR.goldenEngineSha256 + ')');
  }
  // Pin every executable component as well as the complete stable bundle.
  for (const [name, spec] of Object.entries(CURSOR.sources)) {
    const at = spec.offset;
    if (at < 0) throw new Error('cursor bundle missing ' + name);
    expectHash('cursor component ' + name, bundle.subarray(at, at + spec.bytes), spec.sha256);
  }
  expectHash('cursor stable 1.0.1 bundle', bundle, CURSOR.files['cursor-liquido.js']);
}

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--verify-only') out.verifyOnly = true;
    else if (['--juice-dir', '--cursor-dir', '--cursor-css'].includes(a)) out[a.slice(2)] = argv[++i];
    else throw new Error('unknown argument ' + a);
  }
  return out;
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
  return Buffer.from(await res.arrayBuffer());
}

function expectHash(name, buf, expected) {
  const got = sha256(buf);
  if (got !== expected) throw new Error(name + ': sha256 ' + got + ' does not match ' + expected);
}

async function juiceFiles(dir) {
  const read = name => dir ? readFileSync(join(dir, name)) : download(JUICE.base + name);
  const manifestBuf = await read('manifest.json');
  expectHash('juice manifest.json', manifestBuf, JUICE.manifestSha256);
  const manifest = JSON.parse(manifestBuf);
  if (manifest.version !== JUICE.version) throw new Error('juice manifest version ' + manifest.version);
  const out = new Map([['manifest.json', manifestBuf]]);
  for (const [name, pinned] of Object.entries(JUICE.files)) {
    if (manifest.files[name]?.sha256 !== pinned) throw new Error('pin for ' + name + ' differs from the upstream manifest');
    const buf = await read(name);
    expectHash('juice ' + name, buf, pinned);
    out.set(name, buf);
  }
  return out;
}

async function cursorFiles(dir, cssFile) {
  if (!dir) {
    let js, css, manifest;
    try {
      [js, css, manifest] = await Promise.all(['cursor-liquido.js', 'cursor-liquido.css', 'manifest.json'].map(n => download(CURSOR.release + n)));
    } catch (error) {
      throw new Error('Cursor líquido v1.0.1 release assets are not reachable (' + error.message + '). Pass --cursor-dir with a local release dist folder.');
    }
    return { js, css, origin: 'release ' + CURSOR.release, manifest: JSON.parse(manifest) };
  }
  if (existsSync(join(dir, 'cursor-liquido.js'))) {
    const js = readFileSync(join(dir, 'cursor-liquido.js'));
    const css = readFileSync(cssFile || join(dir, 'cursor-liquido.css'));
    const manifestPath = join(dir, 'manifest.json');
    return { js, css, origin: 'local release dist', manifest: existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath)) : null };
  }
  throw new Error('Cursor requires the verified stable 1.0.1 dist folder and manifest; source fallback is not supported.');
}

// The stable release manifest is mandatory; it cannot override the pins.
function checkAgainstManifest(cursor) {
  if (!cursor.manifest || cursor.manifest.version !== CURSOR.version || cursor.manifest.release_status !== 'stable') throw new Error('cursor manifest must declare stable ' + CURSOR.version);
  if (cursor.manifest.golden_adapter_sha256 !== CURSOR.sources.adapter.sha256) throw new Error('cursor manifest adapter differs');
  const files = cursor.manifest.files || {};
  if (cursor.manifest.golden_engine_sha256 !== CURSOR.goldenEngineSha256) throw new Error('cursor manifest golden_engine_sha256 differs');
  for (const [name, buf] of [['cursor-liquido.js', cursor.js], ['cursor-liquido.css', cursor.css]]) {
    const entry = files['dist/' + name] || files[name];
    if (!entry) throw new Error('cursor manifest lists no ' + name);
    expectHash('cursor ' + name, buf, CURSOR.files[name]);
    expectHash('cursor manifest ' + name, buf, entry.sha256);
  }
}

function write(rel, buf) {
  const abs = join(VENDOR, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, buf);
}

// Re-hash what is on disk. Tests call this before opening a browser.
export function verifyVendor() {
  const report = JSON.parse(readFileSync(join(VENDOR, 'setup-report.json'), 'utf8'));
  const juiceDir = join(VENDOR, 'juice', JUICE.version);
  expectHash('vendor juice manifest.json', readFileSync(join(juiceDir, 'manifest.json')), JUICE.manifestSha256);
  for (const [name, pinned] of Object.entries(JUICE.files)) expectHash('vendor juice ' + name, readFileSync(join(juiceDir, name)), pinned);
  const js = readFileSync(join(VENDOR, 'cursor-liquido', 'cursor-liquido.js'));
  checkCursorBundle(js);
  expectHash('vendor cursor-liquido.js', js, CURSOR.files['cursor-liquido.js']);
  expectHash('vendor cursor-liquido.css', readFileSync(join(VENDOR, 'cursor-liquido', 'cursor-liquido.css')), CURSOR.files['cursor-liquido.css']);
  return report;
}

export async function setup(options = {}) {
  const juiceDir = options['juice-dir'] || process.env.JUICE_DIR;
  const cursorDir = options['cursor-dir'] || process.env.CURSOR_LIQUIDO_DIR;
  const cursorCss = options['cursor-css'] || process.env.CURSOR_LIQUIDO_CSS;
  const juice = await juiceFiles(juiceDir && resolve(juiceDir));
  const cursor = await cursorFiles(cursorDir && resolve(cursorDir), cursorCss && resolve(cursorCss));
  checkCursorBundle(cursor.js);
  checkAgainstManifest(cursor);

  rmSync(VENDOR, { recursive: true, force: true });
  for (const [name, buf] of juice) write(join('juice', JUICE.version, name), buf);
  write('cursor-liquido/cursor-liquido.js', cursor.js);
  write('cursor-liquido/cursor-liquido.css', cursor.css);
  // Origins are described, never written as local paths.
  const report = {
    juice: { version: JUICE.version, commit: JUICE.commit, origin: juiceDir ? 'local copy' : JUICE.base, files: Object.fromEntries([...juice].map(([n, b]) => [n, sha256(b)])) },
    cursor: { version: CURSOR.version, origin: cursor.origin, golden_engine_sha256: CURSOR.goldenEngineSha256, files: { 'cursor-liquido.js': sha256(cursor.js), 'cursor-liquido.css': sha256(cursor.css) } }
  };
  write('setup-report.json', Buffer.from(JSON.stringify(report, null, 2) + '\n'));
  return report;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const opts = args(process.argv.slice(2));
    const report = opts.verifyOnly ? verifyVendor() : await setup(opts);
    console.log((opts.verifyOnly ? 'vendor/ verified: ' : 'vendor/ ready: ') + (Object.keys(report.juice.files).length - 1) + ' juice files + manifest, cursor ' + report.cursor.origin + ', golden engine ' + CURSOR.goldenEngineSha256.slice(0, 12));
  } catch (error) {
    console.error('setup-demo: ' + error.message);
    process.exit(1);
  }
}

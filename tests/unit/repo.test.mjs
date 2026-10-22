// Repository hygiene: what is committed stays portable and public-safe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { ROOT } from '../../scripts/setup-demo.mjs';

const SKIP = new Set(['node_modules', 'vendor', 'qa', '.git']);
function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    if (SKIP.has(name)) return [];
    const abs = join(dir, name);
    return statSync(abs).isDirectory() ? walk(abs) : [abs];
  });
}
const files = walk(ROOT).filter(f => !f.endsWith('package-lock.json') && !/\.(png|gif|mp4)$/.test(f));
const text = f => readFileSync(f, 'utf8');

test('no local paths, private hosts or credentials in committed files', () => {
  const bad = [/\/home\/[a-z]/, /\/Users\/[a-z]/i, /\b100\.\d+\.\d+\.\d+\b/, /\.ts\.net\b/, /localhost:\d{4,5}/, /BEGIN [A-Z ]*PRIVATE KEY/, /ghp_[A-Za-z0-9]{20,}/, /sk-[A-Za-z0-9]{20,}/, /@gmail\.com|@hotmail\.com/];
  for (const f of files) for (const re of bad) assert.ok(!re.test(text(f)), relative(ROOT, f) + ' matches ' + re);
});

test('no stale juice hashes from older notes', () => {
  const stale = ['99c8114007de848d558b649d4e9edc84543dddfc1f6b47fd4053f4229a5ceb3d', 'f54706cab332b4de89eecd8df2353a753aafda511d5820448b3edf40ce4cc524', 'a6449e07fb7797d85d2f7c222fbd2345dc14a1e62fffc425c8da32cbadb36594', '9e445eb06e3a874b3ed0da71007d86a1e127a642735a5818123e222c45aed190', 'a017f395c20d884820ca2a411db96fcdcff4416b2851b24f2e72faefc3318382'];
  for (const f of files.filter(f => !f.endsWith('repo.test.mjs'))) for (const h of stale) assert.ok(!text(f).includes(h), relative(ROOT, f) + ' has stale hash ' + h.slice(0, 12));
});

test('no em dashes in docs, comments or code', () => {
  for (const f of files) assert.ok(!text(f).includes('\u2014'), relative(ROOT, f));
});

test('generated and engine files are ignored, never committed', () => {
  const ignore = text(join(ROOT, '.gitignore'));
  for (const entry of ['vendor/', 'qa/', 'node_modules/']) assert.ok(ignore.includes(entry), entry);
  const names = files.map(f => relative(ROOT, f));
  assert.ok(!names.some(n => /approved-fluid|cursor-liquido\.js$|fluid-engine|\.webp$/.test(n)), 'no engine copy or mascot artwork in the repo');
});

test('package has no runtime dependencies and pins Playwright', () => {
  const pkg = JSON.parse(text(join(ROOT, 'package.json')));
  assert.equal(pkg.dependencies, undefined);
  assert.deepEqual(pkg.devDependencies, { playwright: '1.64.1' });
  assert.equal(pkg.private, true, 'not published to npm');
  assert.equal(pkg.license, 'MIT');
  const lock = JSON.parse(text(join(ROOT, 'package-lock.json')));
  assert.equal(lock.packages['node_modules/playwright'].version, '1.64.1');
});

test('relative links in Markdown point to files that exist', () => {
  for (const f of files.filter(f => f.endsWith('.md'))) {
    for (const [, target] of text(f).matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(f), target)), relative(ROOT, f) + ' -> ' + target);
    }
  }
});

test('JavaScript sources parse', () => {
  for (const f of files.filter(f => /\.(m?js)$/.test(f))) execFileSync(process.execPath, ['--check', f]);
});

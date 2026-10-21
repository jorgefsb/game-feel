#!/usr/bin/env node
// Minimal same-origin static server for the demo and the browser tests.
// Binds to 127.0.0.1 on a free port. `npm run demo` keeps it open until Ctrl+C.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from './setup-demo.mjs';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };

export function serve(root = ROOT, port = 0) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = normalize(join(root, path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise(ok => server.listen(port, '127.0.0.1', () => ok({ server, url: 'http://127.0.0.1:' + server.address().port + '/' })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await serve(ROOT, Number(process.env.PORT) || 0);
  console.log('Demo: ' + url + 'examples/  (Ctrl+C to stop)');
}

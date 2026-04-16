// Fetch 100 source_urls and save raw HTML to /tmp/codex-verify-html/{N}.html.
// Codex will independently grep these files — no verification logic here.
// We only save what curl returned, nothing else.
import fs from 'fs';
import path from 'path';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const INPUT = '/tmp/codex-verify-input.json';
const OUT_DIR = '/tmp/codex-verify-html';
const META_OUT = '/tmp/codex-verify-meta.json';

fs.mkdirSync(OUT_DIR, { recursive: true });
const entries = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const meta = [];

for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  const id = String(i + 1).padStart(3, '0');
  const filePath = path.join(OUT_DIR, `${id}.html`);
  try {
    const res = await fetch(e.source_url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    const html = await res.text();
    fs.writeFileSync(filePath, html);
    meta.push({
      id, domain: e.domain, primary_email: e.primary_email,
      source_url: e.source_url, source_method: e.source_method,
      source_snippet: e.source_snippet, max_dr: e.max_dr,
      http_status: res.status, final_url: res.url, bytes: html.length,
      file: filePath,
    });
    if ((i + 1) % 10 === 0) console.log(`[${i+1}/${entries.length}] ${e.domain} → HTTP ${res.status} (${html.length}B)`);
  } catch (err) {
    fs.writeFileSync(filePath, ''); // empty marker
    meta.push({
      id, domain: e.domain, primary_email: e.primary_email,
      source_url: e.source_url, source_method: e.source_method,
      source_snippet: e.source_snippet, max_dr: e.max_dr,
      http_status: 0, error: err.message || String(err), bytes: 0,
      file: filePath,
    });
  }
}

fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 2));
console.log(`\nwrote ${meta.length} HTML files to ${OUT_DIR}/`);
console.log(`meta: ${META_OUT}`);
const ok = meta.filter(m => m.http_status === 200).length;
const blocked = meta.filter(m => m.http_status === 403 || m.http_status === 401).length;
const errors = meta.filter(m => m.http_status === 0).length;
console.log(`status: ${ok} OK, ${blocked} blocked, ${errors} network errors, ${meta.length - ok - blocked - errors} other`);

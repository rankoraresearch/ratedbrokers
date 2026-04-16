// S9: fetch Twitter/X follower counts for every author who has twitter URL.
//
// Why X instead of LinkedIn: LI session is still blocked (HTTP 999 +
// authwall) after the S7 disaster. X allows anonymous viewing and
// shows follower counts directly. Many financial journalists are more
// active on X than LI anyway, so it's a reasonable reach proxy.
//
// Usage:
//   node scripts/s9-fetch-twitter-followers.mjs --fetch
//
// Resumable: re-runs skip authors already in s9-twitter-output.json.
// Throttle: 10-18s random per profile.
//
// Output JSON shape: [{ id, name, twitter, followers, following,
//   source: "playwright-x", fetchedAt, error?: string }]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const SESSION_DIR = path.resolve(here, ".li-session");
const OUTPUT = path.resolve(here, "s9-twitter-output.json");

// ─── Build input list from authorsSample.js
const samplePath = path.resolve(here, "..", "src/data/authorsSample.js");
const m = await import(samplePath);
const A = m.AUTHORS.filter(Boolean);
const input = A
  .filter((a) => a.twitter && /(twitter|x)\.com\/[A-Za-z0-9_]+/.test(a.twitter))
  .map((a) => ({ id: a.id, name: a.name, twitter: a.twitter }));

console.log(`[fetch] ${input.length} authors with twitter URL`);

// ─── Resume support
let output = [];
const done = new Set();
if (fs.existsSync(OUTPUT)) {
  output = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  for (const r of output) if (r.followers != null || r.error) done.add(r.id);
  console.log(`[fetch] Resuming. Already done: ${done.size}`);
}

const remaining = input.filter((a) => !done.has(a.id));
console.log(`[fetch] Remaining: ${remaining.length}`);
console.log(`[fetch] Throttle: 10-18s random. Estimated wall-clock: ~${Math.round((remaining.length * 14) / 60)} min.`);

const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
  headless: true,
  viewport: { width: 1280, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Normalize "1.2K", "19.5K", "1,234", "1.2M" → integer
function parseCount(s) {
  if (!s) return null;
  const t = s.replace(/,/g, "").trim();
  if (/^\d+(\.\d+)?[Kk]$/.test(t)) return Math.round(parseFloat(t) * 1000);
  if (/^\d+(\.\d+)?[Mm]$/.test(t)) return Math.round(parseFloat(t) * 1000000);
  if (/^\d+(\.\d+)?[Bb]$/.test(t)) return Math.round(parseFloat(t) * 1000000000);
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}

// Normalize twitter URL: handle x.com vs twitter.com vs missing protocol
function normalizeTwitterUrl(u) {
  if (!u) return null;
  let url = u.trim();
  if (!/^https?:\/\//.test(url)) url = "https://" + url;
  url = url.replace("://twitter.com", "://x.com");
  // strip query string + trailing slash
  url = url.split("?")[0].replace(/\/$/, "");
  return url;
}

let i = 0, hits = 0, miss = 0, blocked = 0;
for (const a of remaining) {
  i += 1;
  const t0 = Date.now();
  const u = normalizeTwitterUrl(a.twitter);
  let result = {
    id: a.id, name: a.name, twitter: u,
    followers: null, following: null,
    source: "playwright-x", fetchedAt: new Date().toISOString(),
  };

  const page = await ctx.newPage();
  try {
    const resp = await page.goto(u, { waitUntil: "domcontentloaded", timeout: 25000 });
    await sleep(rand(1500, 3000));
    if (resp && resp.status() >= 400) {
      result.error = `HTTP ${resp.status()}`;
    } else {
      const finalUrl = page.url();
      if (/\/login|\/i\/flow\/login/i.test(finalUrl)) {
        result.error = "login_wall";
        blocked += 1;
      } else {
        const text = await page.evaluate(() => document.body.innerText);
        const fMatch = text.match(/([\d.,KkMmBb]+)\s+Followers/);
        const fwMatch = text.match(/([\d.,KkMmBb]+)\s+Following/);
        result.followers = fMatch ? parseCount(fMatch[1]) : null;
        result.following = fwMatch ? parseCount(fwMatch[1]) : null;
        if (result.followers == null) {
          // sometimes account doesn't exist
          if (/doesn't exist|account suspended|This account/i.test(text)) result.error = "account_gone";
          else result.error = "no_count_found";
        }
      }
    }
  } catch (e) {
    result.error = String(e.message || e).slice(0, 200);
  } finally {
    await page.close();
  }

  output.push(result);
  if (result.followers != null) hits += 1; else miss += 1;

  // Persist after every 5 records
  if (i % 5 === 0) fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  const took = Date.now() - t0;
  const status = result.followers != null
    ? `${result.followers.toLocaleString()} f`
    : `MISS (${result.error})`;
  console.log(`[${i}/${remaining.length}] ${a.name.slice(0, 28).padEnd(28)} | ${status.padEnd(28)} | ${took}ms`);

  // If we hit blocked > 5 times in a row, back off harder
  if (blocked > 5) {
    console.log(`[fetch] ${blocked} login walls — backing off 60s`);
    await sleep(60000);
    blocked = 0;
  }

  if (i < remaining.length) await sleep(rand(10000, 18000));
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
await ctx.close();
console.log(`[done] Total: ${remaining.length} | hits: ${hits} | miss: ${miss}`);
console.log(`[done] Output: ${OUTPUT}`);

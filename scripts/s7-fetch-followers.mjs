// S7: fetch LinkedIn follower count for every author who has a linkedin URL.
//
// Usage:
//   1. Login flow (one-time, opens browser window):
//        node scripts/s7-fetch-followers.mjs --login
//      Log in to LinkedIn manually, then close the window.
//
//   2. Bulk fetch (run in background after login):
//        node scripts/s7-fetch-followers.mjs --fetch
//      Loops 400 URLs with random 6-12s throttle. Saves to
//      scripts/s7-followers-output.json. Resumable — if run again, skips
//      already-fetched authors.
//
// Output JSON shape: [{ id, name, linkedin, followers, connections,
//   source: "playwright"|"none", fetchedAt, error?: string }]
//
// Why persistent context: LinkedIn requires login to see follower counts.
// We use a dedicated user-data-dir at scripts/.li-session/ so the user
// only logs in once. The session is gitignored.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const SESSION_DIR = path.resolve(here, ".li-session");
const INPUT = path.resolve(here, "s7-input.json");
const OUTPUT = path.resolve(here, "s7-followers-output.json");

const args = new Set(process.argv.slice(2));
const MODE = args.has("--login") ? "login" : args.has("--fetch") ? "fetch" : null;
if (!MODE) {
  console.error("Usage: node s7-fetch-followers.mjs [--login | --fetch]");
  process.exit(1);
}

// --- LOGIN MODE ---
if (MODE === "login") {
  console.log(`[login] Opening browser. Log in to LinkedIn, then close the window.`);
  console.log(`[login] Session will be saved to ${SESSION_DIR}`);
  fs.mkdirSync(SESSION_DIR, { recursive: true });

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ["--no-default-browser-check", "--no-first-run"],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto("https://www.linkedin.com/feed/", { waitUntil: "domcontentloaded" });
  console.log(`[login] Browser open. Log in, then close it.`);
  // Wait until user closes the browser
  await new Promise((resolve) => ctx.on("close", resolve));
  console.log(`[login] Session saved. Now run --fetch.`);
  process.exit(0);
}

// --- FETCH MODE ---
const input = JSON.parse(fs.readFileSync(INPUT, "utf8"));
let output = [];
let done = new Set();
if (fs.existsSync(OUTPUT)) {
  output = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  for (const r of output) if (r.followers != null || r.connections != null) done.add(r.id);
  console.log(`[fetch] Resuming. Already fetched: ${done.size}`);
}

console.log(`[fetch] ${input.length} total | remaining: ${input.length - done.size}`);
console.log(`[fetch] Throttle: 6-12s random per profile. Estimated wall-clock: ~${Math.round(((input.length - done.size) * 9) / 60)} min.`);

if (!fs.existsSync(SESSION_DIR)) {
  console.error(`[fetch] No session at ${SESSION_DIR}. Run --login first.`);
  process.exit(1);
}

const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
  headless: true,
  viewport: { width: 1280, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

// Quick sanity check: hit /feed and ensure not at login wall
const probe = await ctx.newPage();
await probe.goto("https://www.linkedin.com/feed/", { waitUntil: "domcontentloaded", timeout: 30000 });
const probeUrl = probe.url();
if (probeUrl.includes("/login") || probeUrl.includes("/checkpoint")) {
  console.error(`[fetch] Session expired — at ${probeUrl}. Re-run --login.`);
  await ctx.close();
  process.exit(2);
}
await probe.close();
console.log(`[fetch] Session OK. Starting loop.`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Parse follower/connection counts from raw page text.
// Handles English ("X followers", "500+ connections") and Russian
// ("X отслеживающих", "Более 500 контакты"). Returns numbers or null.
function parseFollowers(text) {
  // Normalize numbers: "12,358" / "12 358" / "12.5K" / "1.2M" → integer
  const norm = (raw) => {
    const s = raw.replace(/\s/g, "").replace(/,/g, "");
    if (/^\d+(\.\d+)?[Kk]$/.test(s)) return Math.round(parseFloat(s) * 1000);
    if (/^\d+(\.\d+)?[Mm]$/.test(s)) return Math.round(parseFloat(s) * 1000000);
    const n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  };

  // Try followers first (most accurate metric)
  const fEn = text.match(/([\d.,KkMm\s]+)\s+followers?\b/);
  const fRu = text.match(/([\d.,KkMm\s]+)\s+отслеживающих/);
  const followers = fEn ? norm(fEn[1].trim()) : fRu ? norm(fRu[1].trim()) : null;

  // Connections (often "500+" / "Более 500")
  let connections = null;
  const cEn = text.match(/([\d,]+\+?)\s+connections?\b/);
  const cRu = text.match(/(?:Более\s+)?(\d+\+?)\s+(?:контакты|контактов)/);
  if (cEn) connections = cEn[1];
  else if (cRu) connections = "500+";

  return { followers, connections };
}

const remaining = input.filter((a) => !done.has(a.id));
let i = 0;
let okCount = 0,
  errCount = 0;

for (const a of remaining) {
  i += 1;
  const startedAt = Date.now();
  let result = {
    id: a.id,
    name: a.name,
    linkedin: a.linkedin,
    followers: null,
    connections: null,
    source: "playwright",
    fetchedAt: new Date().toISOString(),
  };

  const page = await ctx.newPage();
  try {
    const resp = await page.goto(a.linkedin, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });
    if (!resp || resp.status() >= 400) {
      result.error = `HTTP ${resp ? resp.status() : "no response"}`;
    } else {
      // Wait briefly for header to render
      await sleep(rand(800, 1500));
      const text = await page.evaluate(() => document.body.innerText);
      const parsed = parseFollowers(text);
      result.followers = parsed.followers;
      result.connections = parsed.connections;
      if (!parsed.followers && !parsed.connections) {
        result.error = "no_followers_or_connections_in_text";
      }
    }
  } catch (e) {
    result.error = String(e.message || e).slice(0, 200);
  } finally {
    await page.close();
  }

  output.push(result);
  if (result.followers || result.connections) okCount += 1;
  else errCount += 1;

  // Persist after every record so a crash doesn't lose progress
  if (i % 5 === 0) fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  const took = Date.now() - startedAt;
  const status = result.followers
    ? `${result.followers} followers`
    : result.connections
      ? `${result.connections} connections`
      : `MISS (${result.error})`;
  console.log(`[${i}/${remaining.length}] ${a.name.slice(0, 30).padEnd(30)} | ${status} | ${took}ms`);

  // Throttle 6-12s random
  if (i < remaining.length) {
    const wait = rand(6000, 12000);
    await sleep(wait);
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
await ctx.close();

console.log(`[done] Total: ${remaining.length} | with data: ${okCount} | misses: ${errCount}`);
console.log(`[done] Output: ${OUTPUT}`);

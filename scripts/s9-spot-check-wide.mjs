// Wide spot-check — 25 random authors across size distribution with
// handle verification (per Codex [HIGH] finding). If handle mismatch
// or large diff, flag for re-fetch.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const m = await import(path.resolve(here, "..", "src/data/authorsSample.js"));
const A = m.AUTHORS.filter(Boolean).filter((a) => a.mediaSignals?.twitterFollowers != null)
  .sort((x, y) => y.mediaSignals.twitterFollowers - x.mediaSignals.twitterFollowers);
console.log(`Candidates: ${A.length}`);

// Stratified random: 5 from each quintile
const pick = [];
for (let i = 0; i < 5; i++) {
  const lo = Math.floor((i / 5) * A.length);
  const hi = Math.min(Math.floor(((i + 1) / 5) * A.length), A.length - 1);
  const used = new Set();
  while (used.size < 5 && pick.length < (i + 1) * 5) {
    const idx = lo + Math.floor(Math.random() * (hi - lo + 1));
    if (!used.has(idx)) { used.add(idx); pick.push(A[idx]); }
  }
}

const ctx = await chromium.launchPersistentContext(path.resolve(here, ".li-session"), {
  headless: true, viewport: { width: 1280, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

function parseN(s) {
  if (!s) return null;
  const t = s.replace(/,/g, "").trim();
  if (/^\d+(\.\d+)?[Kk]$/.test(t)) return Math.round(parseFloat(t) * 1000);
  if (/^\d+(\.\d+)?[Mm]$/.test(t)) return Math.round(parseFloat(t) * 1000000);
  if (/^\d+(\.\d+)?[Bb]$/.test(t)) return Math.round(parseFloat(t) * 1000000000);
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}
const normalize = (u) => u.replace("://twitter.com", "://x.com").split("?")[0].replace(/\/$/, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(`\n${"Author".padEnd(28)} | Stored     | Live       | Handle | Diff      | Status`);
console.log("-".repeat(100));

const results = [];
for (const s of pick) {
  const url = normalize(s.twitter);
  const expectHandle = (url.match(/x\.com\/([A-Za-z0-9_]+)/) || [,""])[1].toLowerCase();
  let live = null, titleHandle = null, err = null;
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await sleep(1800);
    const { text, th } = await page.evaluate(() => {
      const t = document.title || "";
      const hm = t.match(/\(@([A-Za-z0-9_]+)\)/);
      return { text: document.body.innerText, th: hm ? hm[1].toLowerCase() : "" };
    });
    titleHandle = th;
    if (!/login|Sign up/i.test(document.title) || th) {
      const m = text.match(/([\d.,KkMmBb]+)\s+Followers/);
      live = m ? parseN(m[1]) : null;
    }
  } catch (e) { err = e.message.slice(0, 40); }
  await page.close();

  const stored = s.mediaSignals.twitterFollowers;
  const handleOk = titleHandle && (titleHandle === expectHandle);
  const diffPct = (live != null && stored > 0) ? ((live - stored) / stored * 100).toFixed(1) + "%" : "—";
  const pct = (live != null && stored > 0) ? Math.abs(live - stored) / stored : Infinity;
  const ok = live != null && handleOk && pct < 0.15;
  const status = err ? "⚠  err" :
                 !handleOk ? "✗  MISMATCH" :
                 live == null ? "⚠  n/a" :
                 ok ? "✓  match" : "✗  DIFF";
  results.push({ name: s.name, stored, live, titleHandle, expectHandle, diff: diffPct, status });
  console.log(
    s.name.slice(0, 27).padEnd(28) + " | " +
    String(stored).padStart(10) + " | " +
    (live == null ? "n/a".padStart(10) : String(live).padStart(10)) + " | " +
    (handleOk ? "✓" : (titleHandle ? "✗" + titleHandle.slice(0, 6) : "—")).padEnd(8) + " | " +
    diffPct.padStart(8) + " | " + status
  );
  await sleep(7000);
}
await ctx.close();

const ok = results.filter((r) => r.status === "✓  match").length;
const mismatch = results.filter((r) => r.status.includes("MISMATCH") || r.status.includes("DIFF")).length;
console.log(`\n${ok}/${results.length} match, ${mismatch} mismatch/diff`);
fs.writeFileSync(path.resolve(here, "s9-spot-check-wide.json"), JSON.stringify(results, null, 2));

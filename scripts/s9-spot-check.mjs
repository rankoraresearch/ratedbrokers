// Spot-check — re-fetch 10 sample authors' X follower count and
// compare to what we stored. Prints a pass/fail table.
import { chromium } from "playwright";
import fs from "node:fs";

const sample = JSON.parse(fs.readFileSync("/tmp/spot-check-sample.json", "utf8"));

const ctx = await chromium.launchPersistentContext("./scripts/.li-session", {
  headless: true, viewport: { width: 1280, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

function parseN(s) {
  if (!s) return null;
  const t = s.replace(/,/g, "").trim();
  if (/^\d+(\.\d+)?[Kk]$/.test(t)) return Math.round(parseFloat(t) * 1000);
  if (/^\d+(\.\d+)?[Mm]$/.test(t)) return Math.round(parseFloat(t) * 1000000);
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}

const normalize = (u) => u.replace("://twitter.com", "://x.com").split("?")[0].replace(/\/$/, "");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
console.log("\nSpot-check — comparing stored vs live x.com:\n");
console.log("Author".padEnd(28) + " | Stored" + "".padEnd(5) + " | Live" + "".padEnd(7) + " | Diff  | Status");
console.log("-".repeat(80));

const results = [];
for (const s of sample) {
  const url = normalize(s.twitter);
  const page = await ctx.newPage();
  let live = null, err = null;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await sleep(1800);
    const text = await page.evaluate(() => document.body.innerText);
    const m = text.match(/([\d.,KkMmBb]+)\s+Followers/);
    live = m ? parseN(m[1]) : null;
  } catch (e) { err = e.message.slice(0, 50); }
  await page.close();

  const stored = s.stored;
  const diff = (live != null) ? ((live - stored) / stored * 100).toFixed(1) + "%" : (err || "FETCH_FAIL");
  const ok = live != null && Math.abs(live - stored) / stored < 0.15;
  const status = live == null ? "⚠  n/a" : ok ? "✓  match" : "✗  diff";
  results.push({ name: s.name, stored, live, diff, status });
  console.log(
    s.name.slice(0, 27).padEnd(28) + " | " +
    String(stored).padStart(9) + " | " +
    (live == null ? "n/a".padStart(9) : String(live).padStart(9)) + " | " +
    diff.padStart(6) + " | " + status
  );
  await sleep(8000);
}
await ctx.close();
const okCount = results.filter(r => r.status === "✓  match").length;
console.log(`\nMatches within 15%: ${okCount}/10`);
fs.writeFileSync("scripts/s9-spot-check-result.json", JSON.stringify(results, null, 2));

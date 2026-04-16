// S10: LinkedIn follower fetch through USER'S REAL CHROME via CDP.
//
// Why this will work where Playwright's bundled Chromium failed:
//   LinkedIn fingerprints Playwright by navigator.webdriver=true,
//   missing plugins, stripped-down user agent, unusual canvas noise,
//   etc. A normal Chrome with the user's natural cookie jar, history,
//   plugins, and extensions looks like a human recruiter — no flags.
//
// ONE-TIME SETUP (run this from a fresh terminal, then leave the
// window open):
//
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//     --remote-debugging-port=9222 \
//     --user-data-dir=/tmp/li-cdp
//
//   In the opened Chrome window, go to linkedin.com and log in.
//   Do NOT close this Chrome window during the fetch.
//
// THEN run this script:
//   node scripts/s10-li-cdp-fetch.mjs
//
// Behavior:
//   - Connects to your Chrome via http://localhost:9222
//   - Opens ONE tab, reuses it for all 400 profiles
//   - Extracts followers + connections from the profile header
//   - Handle-validates (refuses number if page title doesn't match URL)
//   - Random 20-35s throttle + scroll jitter between each profile
//   - Saves to scripts/s10-li-cdp-output.json every 3 records
//   - Resumable: re-runs skip successfully-fetched IDs
//
// The script is robust — if the page looks weird, it records the error
// and moves on. It will NOT keep retrying a rate-limited page in a
// loop.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const OUTPUT = path.resolve(here, "s10-li-cdp-output.json");
const samplePath = path.resolve(root, "src/data/authorsSample.js");
const m = await import(samplePath + "?t=" + Date.now());
const A = m.AUTHORS.filter(Boolean);
const input = A.filter((a) => a.linkedin && /linkedin\.com\/in\//.test(a.linkedin))
  .map((a) => ({ id: a.id, name: a.name, linkedin: a.linkedin }));
console.log(`[cdp] ${input.length} authors with linkedin URL`);

// ─── Resume state
let output = [];
const done = new Set();
// Only true successes count as "done" — transient errors stay retryable.
const TERMINAL_ERRORS = new Set(["account_gone", "HTTP 404"]);
if (fs.existsSync(OUTPUT)) {
  output = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  for (const r of output) {
    if (r.followers != null) done.add(r.id);
    else if (r.error && TERMINAL_ERRORS.has(r.error)) done.add(r.id);
  }
  console.log(`[cdp] Resuming — already done: ${done.size}`);
}
const remaining = input.filter((a) => !done.has(a.id));
console.log(`[cdp] Remaining: ${remaining.length}`);

// ─── Connect to user's real Chrome
let browser;
try {
  browser = await chromium.connectOverCDP("http://localhost:9222");
} catch (e) {
  console.error(`\n[cdp] ERROR — can't reach Chrome at localhost:9222.`);
  console.error(`Start Chrome like this from a terminal (keep the window open):\n`);
  console.error(`  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\`);
  console.error(`    --remote-debugging-port=9222 \\`);
  console.error(`    --user-data-dir=/tmp/li-cdp\n`);
  console.error(`Then log into LinkedIn in that window and re-run this script.`);
  console.error(`Underlying error: ${e.message}`);
  process.exit(1);
}
const contexts = browser.contexts();
const ctx = contexts[0];
if (!ctx) { console.error("[cdp] No context in Chrome — weird state. Aborting."); process.exit(2); }

// ─── Probe: make sure we're logged in
const probe = await ctx.newPage();
await probe.goto("https://www.linkedin.com/in/shatzakis/", { waitUntil: "domcontentloaded", timeout: 30000 });
const probeUrl = probe.url();
console.log(`[cdp] Probe → ${probeUrl}`);
if (/\/authwall|\/login|\/checkpoint/.test(probeUrl)) {
  console.error(`\n[cdp] Your Chrome is NOT logged into LinkedIn.`);
  console.error(`Open https://www.linkedin.com/ in the debug-Chrome window, log in, then re-run.`);
  await probe.close(); process.exit(3);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

function parseN(s) {
  if (!s) return null;
  // Normalize NBSP + thin spaces + comma decimal marks
  const t = s.replace(/[\u00A0\u202F\u2009\s]/g, "").replace(/,/g, "").replace(/[Кк]/g, "K").replace(/[Мм]/g, "M").replace(/[Бб]/g, "B");
  if (/^\d+(\.\d+)?K$/.test(t)) return Math.round(parseFloat(t) * 1000);
  if (/^\d+(\.\d+)?M$/.test(t)) return Math.round(parseFloat(t) * 1000000);
  if (/^\d+(\.\d+)?B$/.test(t)) return Math.round(parseFloat(t) * 1000000000);
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}

// Extract follower + connections ONLY from the profile's top-card
// region. Anchored on the profile h1 — we never look at sidebar or
// suggested-people modules, so S7's wrong-number bug can't recur.
async function extract(page) {
  return await page.evaluate(() => {
    const out = { followers: null, connections: null, cardText: null, expectHeadline: null };
    const h1 = document.querySelector("h1");
    if (!h1) { out.error = "no_h1"; return out; }
    out.expectHeadline = h1.innerText.trim();

    // Walk up to the card section (class names LI uses: pv-top-card,
    // pv-text-details-about-this-profile, ph5 pb5).
    let card = h1.parentElement;
    for (let d = 0; d < 8 && card; d++) {
      const cn = (card.className || "").toString();
      if (/top-card|pv-text-details|ph5|artdeco-card/.test(cn)) break;
      card = card.parentElement;
    }
    const region = card || h1.closest("section") || h1.parentElement;
    const t = region.innerText || "";
    out.cardText = t.slice(0, 600);

    // Followers — English and Russian variants
    let fm = t.match(/([\d\s.,KkMmBbКкМмБб]+)\s+(?:followers?|отслеживающих|подписчиков)\b/);
    if (fm) out.followers = fm[1].trim();
    // Connections — various formats
    let cm = t.match(/([\d,]+\+?)\s+(?:connections?)\b/i);
    if (!cm) cm = t.match(/Более\s+(\d+\+?)\s+контакт/i);
    if (cm) out.connections = cm[1].includes("+") ? cm[1] : (cm[1] + (t.includes("Более") ? "+" : ""));
    return out;
  });
}

// ─── Reuse one tab for the whole run
const page = await ctx.newPage();
await probe.close();
console.log(`[cdp] Session OK. Starting loop — ${remaining.length} profiles, ~20-35s throttle each.`);

let hits = 0, miss = 0, consecutiveFails = 0;
for (let i = 0; i < remaining.length; i++) {
  const a = remaining[i];
  const t0 = Date.now();
  const expectHandle = (a.linkedin.match(/linkedin\.com\/in\/([^/?]+)/) || [,""])[1].toLowerCase();

  const result = {
    id: a.id, name: a.name, linkedin: a.linkedin,
    followers: null, connections: null,
    source: "user-chrome-cdp",
    fetchedAt: new Date().toISOString(),
  };

  try {
    const resp = await page.goto(a.linkedin, { waitUntil: "domcontentloaded", timeout: 30000 });
    const finalUrl = page.url();
    if (/\/authwall|\/login|\/checkpoint/.test(finalUrl)) {
      result.error = "authwall";
      consecutiveFails += 1;
    } else if (!resp || resp.status() >= 400) {
      result.error = `HTTP ${resp ? resp.status() : "none"}`;
    } else {
      // Human pacing: scroll a bit, wait
      await sleep(rand(1800, 3200));
      try { await page.mouse.wheel(0, rand(200, 600)); await sleep(rand(400, 900)); } catch {}
      const data = await extract(page);
      if (data.error) {
        result.error = data.error;
      } else {
        const finalHandle = (finalUrl.match(/linkedin\.com\/in\/([^/?]+)/) || [,""])[1].toLowerCase();
        // Guard: if the URL redirected to a different profile, don't trust
        if (expectHandle && finalHandle && expectHandle !== finalHandle) {
          result.error = `handle_mismatch(${finalHandle})`;
          result.expectHeadline = data.expectHeadline;
        } else {
          result.followers = parseN(data.followers);
          result.connections = data.connections;
          result.verifiedHeadline = data.expectHeadline;
          if (result.followers == null && !result.connections) {
            result.error = "no_count_in_top_card";
            result.cardSample = (data.cardText || "").slice(0, 140);
          }
        }
      }
      if (!result.error) consecutiveFails = 0;
    }
  } catch (e) {
    result.error = String(e.message || e).slice(0, 200);
    consecutiveFails += 1;
  }

  output.push(result);
  if (result.followers != null || result.connections) hits += 1; else miss += 1;
  if ((i + 1) % 3 === 0) fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  const took = Date.now() - t0;
  const status = result.followers != null ? `${result.followers.toLocaleString()} f`
    : result.connections ? `${result.connections} c`
    : `MISS (${result.error})`;
  console.log(`[${i + 1}/${remaining.length}] ${a.name.slice(0, 28).padEnd(28)} | ${status.padEnd(24)} | ${took}ms`);

  // Abort if we see 8 consecutive failures — likely LI detected us or we're logged out
  if (consecutiveFails >= 8) {
    console.error(`[cdp] ABORT — ${consecutiveFails} consecutive failures. Saved ${i + 1} results. Restart Chrome / re-login, then re-run to resume.`);
    break;
  }

  if (i < remaining.length - 1) {
    const wait = rand(20000, 35000);
    await sleep(wait);
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
await page.close();
await browser.close();  // detaches from user's Chrome but leaves it running
console.log(`\n[done] Total: ${remaining.length} | hits: ${hits} | miss: ${miss}`);
console.log(`[done] Output: ${OUTPUT}`);

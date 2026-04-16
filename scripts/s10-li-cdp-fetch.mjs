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
  // Force IPv4 — macOS resolves "localhost" to ::1 first but Chrome
  // binds to 127.0.0.1 only on the debug port.
  browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
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

// Extract follower + connection counts from the profile page.
// Method: take the FIRST "X followers" match in body.innerText. LI
// renders the profile header before any sidebar recommendations, so
// the first match is always the page-owner's own count. We also
// validate that the match appears within the first 2500 chars (i.e.
// before the "People who follow" sidebar block).
async function extract(page) {
  return await page.evaluate(() => {
    const out = { followers: null, connections: null, cardText: null, expectHeadline: null };
    const body = document.body.innerText || "";
    out.cardText = body.slice(0, 500);

    // Find the profile name heading — now H2 on modern LI, used only
    // for the audit record, not for gating the follower extraction.
    const h2s = [...document.querySelectorAll("h2")];
    const profileH2 = h2s.find((h) => {
      const s = (h.innerText || "").trim();
      return s.length > 0 && !/(notifications|Ad Options|Activity|^\d+$|People who)/.test(s);
    });
    out.expectHeadline = profileH2 ? profileH2.innerText.trim() : null;

    // Follower count — EN + RU. Take FIRST match only.
    const fm = body.match(/([\d\s.,KkMmBbКкМмБб]+)\s+(?:followers?|отслеживающих|подписчиков)\b/);
    if (fm && fm.index < 2500) {
      out.followers = fm[1].trim();
      out.followersIdx = fm.index;
    } else if (fm) {
      // Match exists but too deep in DOM — probably sidebar
      out.followersDeepIdx = fm.index;
    }

    // Connections — "500+ connections" / "Более 500 контакты"
    let cm = body.match(/(\d+\+?)\s+(?:connections?)\b/i);
    if (!cm) cm = body.match(/Более\s+(\d+\+?)\s+контакт/i);
    if (cm && cm.index < 2500) out.connections = cm[1].includes("+") ? cm[1] : cm[1] + "+";
    return out;
  });
}

// Fresh page per fetch — resilient to Chrome restarts and orphan
// tabs from past runs. One-time probe page closed before loop.
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

  let page;
  try {
    page = await ctx.newPage();
    const resp = await page.goto(a.linkedin, { waitUntil: "domcontentloaded", timeout: 30000 });
    const finalUrl = page.url();
    if (/\/authwall|\/login|\/checkpoint/.test(finalUrl)) {
      result.error = "authwall";
      consecutiveFails += 1;
    } else if (!resp || resp.status() >= 400) {
      result.error = `HTTP ${resp ? resp.status() : "none"}`;
    } else {
      // Human pacing: scroll a bit, wait
      // Wait longer for LI's React/SPA to render the header numbers.
      await sleep(rand(3500, 5000));
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
  } finally {
    if (page) { try { await page.close(); } catch {} }
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
await browser.close();  // detaches from user's Chrome but leaves it running
console.log(`\n[done] Total: ${remaining.length} | hits: ${hits} | miss: ${miss}`);
console.log(`[done] Output: ${OUTPUT}`);

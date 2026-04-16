// S9 LinkedIn V2: properly-targeted follower fetch, using our now-
// unblocked LI session. Previous S7 fetch grabbed wrong numbers from
// the sidebar (People you may know) because it regexed body.innerText.
//
// This version targets the profile TOP CARD specifically — the big
// header area with name + headline + followers line — and ignores any
// numbers that appear below it.
//
// Usage: node scripts/s9-fetch-linkedin-v2.mjs
// Resumable — skips authors already in scripts/s9-li-output.json.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const SESSION_DIR = path.resolve(here, ".li-session");
const OUTPUT = path.resolve(here, "s9-li-output.json");

const samplePath = path.resolve(here, "..", "src/data/authorsSample.js");
const m = await import(samplePath);
const A = m.AUTHORS.filter(Boolean);
const input = A.filter((a) => a.linkedin && /linkedin\.com\/in\//.test(a.linkedin))
  .map((a) => ({ id: a.id, name: a.name, linkedin: a.linkedin }));

console.log(`[fetch] ${input.length} authors with linkedin URL`);

let output = [];
const done = new Set();
if (fs.existsSync(OUTPUT)) {
  output = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  for (const r of output) if (r.followers != null || r.connections != null || r.error) done.add(r.id);
  console.log(`[fetch] Resuming. Already done: ${done.size}`);
}

const remaining = input.filter((a) => !done.has(a.id));
console.log(`[fetch] Remaining: ${remaining.length}`);

const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
  headless: true,
  viewport: { width: 1366, height: 900 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

// Sanity probe via a real /in/{slug} — LI /feed/ is more restrictive
// than direct profile views, so check with the same path we'll scrape.
const probe = await ctx.newPage();
await probe.goto("https://www.linkedin.com/in/shatzakis/", { waitUntil: "domcontentloaded", timeout: 30000 });
const probeUrl = probe.url();
console.log(`[probe] /in/shatzakis → ${probeUrl}`);
if (/\/authwall|\/login|\/checkpoint/.test(probeUrl)) {
  console.error(`[fetch] STILL BLOCKED on /in/. Abort.`);
  await ctx.close(); process.exit(2);
}
await probe.close();
console.log(`[fetch] Session OK.`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

function parseN(s) {
  if (!s) return null;
  const t = s.replace(/\s/g, "").replace(/,/g, "").replace(/\u00A0/g, "");
  if (/^\d+(\.\d+)?[KkКк]$/.test(t)) return Math.round(parseFloat(t.replace(/[Кк]/g, "K")) * 1000);
  if (/^\d+(\.\d+)?[MmМм]$/.test(t)) return Math.round(parseFloat(t.replace(/[Мм]/g, "M")) * 1000000);
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}

// Extract follower + connection count ONLY from the top-card region.
// Strategy: find the author's own name in an <h1>, then look at siblings
// within the same top-card section for "X followers" / "X connections".
async function extract(page) {
  return await page.evaluate(() => {
    // Strategy 1: anchor on h1 (profile name) and walk up to its card
    const h1 = document.querySelector("h1");
    if (!h1) return { error: "no_h1" };
    // Walk up until we find a <section> or a div with 'top-card' in class
    let card = h1.parentElement;
    for (let d = 0; d < 8 && card; d++) {
      const c = (card.className || "").toString();
      if (/top-card|pv-text-details|ph5/.test(c)) break;
      card = card.parentElement;
    }
    const region = card || h1.parentElement;
    const regionText = region.innerText || "";
    // Match "X followers" (EN) / "X отслеживающих" (RU) / "X followers" in Indic/other
    // Common format: "12 358 followers" or "12,358 followers" or "500+ connections"
    const followerMatch = regionText.match(/([\d\s.,]+[KkMmКкМм]?)\s+(?:followers?|отслеживающих)\b/);
    const connMatch = regionText.match(/([\d\s,]+\+?)\s+(?:connections?|контакты|контактов|connections)\b/i);
    // Russian: "Более 500 контакты"
    const connRuMatch = regionText.match(/Более\s+(\d+\+?)\s+контакт/i);
    return {
      followersRaw: followerMatch ? followerMatch[1].trim() : null,
      connectionsRaw: connMatch ? connMatch[1].trim() : (connRuMatch ? connRuMatch[1] + "+" : null),
      cardText: regionText.slice(0, 500),
    };
  });
}

let hits = 0, miss = 0, blocked = 0, i = 0;
for (const a of remaining) {
  i += 1;
  const t0 = Date.now();
  const result = {
    id: a.id, name: a.name, linkedin: a.linkedin,
    followers: null, connections: null,
    source: "playwright-li-v2", fetchedAt: new Date().toISOString(),
  };
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(a.linkedin, { waitUntil: "domcontentloaded", timeout: 30000 });
    const finalUrl = page.url();
    if (/\/authwall|\/login|\/checkpoint/.test(finalUrl)) {
      result.error = "authwall";
      blocked += 1;
      if (blocked >= 3) {
        console.error(`[fetch] SESSION BLOCKED (3 authwalls). Stopping.`);
        await page.close(); break;
      }
    } else if (!resp || resp.status() >= 400) {
      result.error = `HTTP ${resp ? resp.status() : "none"}`;
    } else {
      await sleep(rand(1500, 2800));
      const data = await extract(page);
      if (data.error) {
        result.error = data.error;
      } else {
        result.followers = parseN(data.followersRaw);
        result.connections = data.connectionsRaw;
        if (result.followers == null && !result.connections) {
          result.error = "no_count_in_top_card";
          result.cardSample = (data.cardText || "").slice(0, 120);
        }
      }
    }
  } catch (e) {
    result.error = String(e.message || e).slice(0, 200);
  } finally {
    await page.close();
  }

  output.push(result);
  if (result.followers != null || result.connections) hits += 1; else miss += 1;

  if (i % 5 === 0) fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  const took = Date.now() - t0;
  const status = result.followers != null
    ? `${result.followers.toLocaleString()} f`
    : result.connections
      ? `${result.connections} c`
      : `MISS (${result.error})`;
  console.log(`[${i}/${remaining.length}] ${a.name.slice(0, 28).padEnd(28)} | ${status.padEnd(24)} | ${took}ms`);

  if (i < remaining.length) await sleep(rand(12000, 22000));
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
await ctx.close();
console.log(`[done] Total: ${remaining.length} | hits: ${hits} | miss: ${miss} | blocked: ${blocked}`);

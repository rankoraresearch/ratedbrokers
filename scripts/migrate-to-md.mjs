#!/usr/bin/env node
/**
 * migrate-to-md.mjs
 * One-time migration: src/data/brokers/*.js → content/brokers/*.md
 *
 * Usage: node scripts/migrate-to-md.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "src/data/brokers");
const OUT_DIR = join(ROOT, "content/brokers");

// Content sections that should go into Markdown body (not YAML)
const CONTENT_SECTIONS = [
  "overview",
  "scoring",
  "accountIntro",
  "accountOutro",
  "regulation",
  "costs",
  "spreads",
  "deposits",
  "platforms",
  "mobile",
  "support",
  "education",
  "trustpilot",
  "country",
  "verdict",
];

// Map section keys to human-readable Markdown headings
const SECTION_HEADINGS = {
  overview: "Overview",
  scoring: "Scoring",
  accountIntro: "Account Intro",
  accountOutro: "Account Outro",
  regulation: "Regulation",
  costs: "Costs",
  spreads: "Spreads",
  deposits: "Deposits",
  platforms: "Platforms",
  mobile: "Mobile",
  support: "Support",
  education: "Education",
  trustpilot: "Trustpilot",
  country: "Country",
  verdict: "Verdict",
};

/**
 * Safely evaluate a broker JS file and extract its data object.
 * The files use `const data = {...}; export default data;` pattern.
 */
function parseBrokerJS(filePath) {
  let code = readFileSync(filePath, "utf-8");

  // Remove export default statement
  code = code.replace(/export\s+default\s+data\s*;?\s*$/, "");

  // Wrap in a function that returns data
  const fn = new Function(`${code}; return data;`);
  return fn();
}

/**
 * Escape YAML special characters in a string value.
 */
function yamlString(val) {
  if (val === null || val === undefined) return '""';
  const s = String(val);
  // Use double-quoted scalar for strings containing special chars
  if (
    s === "" ||
    s.includes(":") ||
    s.includes("#") ||
    s.includes("{") ||
    s.includes("}") ||
    s.includes("[") ||
    s.includes("]") ||
    s.includes(",") ||
    s.includes("&") ||
    s.includes("*") ||
    s.includes("?") ||
    s.includes("|") ||
    s.includes(">") ||
    s.includes("!") ||
    s.includes("%") ||
    s.includes("@") ||
    s.includes("`") ||
    s.includes("'") ||
    s.includes('"') ||
    s.includes("\\") ||
    s.startsWith(" ") ||
    s.endsWith(" ") ||
    s === "true" ||
    s === "false" ||
    s === "null" ||
    s === "yes" ||
    s === "no" ||
    /^\d/.test(s)
  ) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return s;
}

/**
 * Convert a data object to YAML frontmatter string.
 */
function buildYAML(slug, data) {
  const B = data.B;
  const lines = [];

  // Helper to add a line
  const add = (line) => lines.push(line);

  // --- Meta ---
  add(`slug: ${yamlString(slug)}`);
  add(`status: active`);
  add(`last_verified: "2026-03-09"`);
  add("");

  // --- Basic broker info ---
  add(`name: ${yamlString(B.name)}`);
  add(`logo: ${yamlString(B.logo)}`);
  add(`url: ${yamlString(B.url)}`);
  add(`score: ${B.score}`);
  add(`verdict: ${yamlString(B.verdict)}`);
  add(`tp: ${B.tp}`);
  add(`tp_count: ${B.tpCount}`);
  add(`year: ${B.year}`);
  add(`hq: ${yamlString(B.hq)}`);
  add(`ceo: ${yamlString(B.ceo)}`);
  add("");

  // --- Regulations ---
  add("regulations:");
  for (const r of B.regs) {
    add(`  - name: ${yamlString(r.name)}`);
    add(`    country: ${yamlString(r.country)}`);
    add(`    number: ${yamlString(r.num)}`);
    add(`    tier: ${r.tier}`);
  }
  add("");

  // --- Trading params ---
  add(`type: ${yamlString(B.type)}`);
  add(`min_deposit: ${B.minDep}`);
  add(`spread: ${yamlString(B.spread)}`);
  add(`avg_spread: ${yamlString(B.avgSpread)}`);
  add(`commission: ${yamlString(B.commission)}`);
  add(`leverage: ${yamlString(B.leverage)}`);
  add(`instruments: ${yamlString(B.instruments)}`);
  add("");

  // --- Platforms ---
  add("platforms:");
  for (const p of B.platforms) {
    add(`  - ${yamlString(p)}`);
  }
  add("");

  // --- Promo/badge/risk ---
  add(`promo: ${yamlString(B.promo)}`);
  add(`badge: ${B.badge == null ? "null" : yamlString(B.badge)}`);
  add(`risk_warning: ${yamlString(B.riskWarning)}`);
  add("");

  // --- Scores ---
  add("scores:");
  for (const s of data.SCORES) {
    add(`  - name: ${yamlString(s.name)}`);
    add(`    score: ${s.score}`);
    add(`    weight: ${s.weight}`);
    add(`    detail: ${yamlString(s.detail)}`);
  }
  add("");

  // --- Accounts ---
  add("accounts:");
  for (const a of data.ACCOUNTS) {
    add(`  - name: ${yamlString(a.name)}`);
    add(`    spread: ${yamlString(a.spread)}`);
    add(`    commission: ${yamlString(a.commission)}`);
    add(`    min: ${a.min}`);
    add(`    best: ${yamlString(a.best)}`);
  }
  add("");

  // --- Spread comparison ---
  add("spread_competitors:");
  for (const c of data.spreadCompetitors) {
    add(`  - ${yamlString(c)}`);
  }
  add("");

  add("spreads:");
  for (const sp of data.SPREADS) {
    add(`  - pair: ${yamlString(sp.pair)}`);
    add(`    values:`);
    for (const v of sp.values) {
      add(`      - ${yamlString(v)}`);
    }
  }
  add("");

  // --- Deposits ---
  add("deposits:");
  for (const d of data.DEPOSITS) {
    add(`  - method: ${yamlString(d.method)}`);
    add(`    fee: ${yamlString(d.fee)}`);
    add(`    min: ${yamlString(d.min)}`);
    add(`    time: ${yamlString(d.time)}`);
  }
  add("");

  // --- Timeline ---
  add("timeline:");
  for (const t of data.TIMELINE) {
    add(`  - year: ${t.year}`);
    add(`    event: ${yamlString(t.event)}`);
  }
  add("");

  // --- Pros ---
  add("pros:");
  for (const p of data.PROS) {
    add(`  - ${yamlString(p)}`);
  }
  add("");

  // --- Cons ---
  add("cons:");
  for (const c of data.CONS) {
    add(`  - ${yamlString(c)}`);
  }
  add("");

  // --- FAQ ---
  add("faq:");
  for (const f of data.FAQ) {
    add(`  - q: ${yamlString(f.q)}`);
    add(`    a: ${yamlString(f.a)}`);
  }
  add("");

  // --- Author ---
  add("author:");
  add(`  name: ${yamlString(data.AUTHOR.name)}`);
  add(`  role: ${yamlString(data.AUTHOR.role)}`);
  add(`  initials: ${yamlString(data.AUTHOR.initials)}`);
  add(`  exp: ${yamlString(data.AUTHOR.exp)}`);
  add(`  updated: ${yamlString(data.AUTHOR.updated)}`);
  add(`  fact_checker: ${yamlString(data.AUTHOR.factChecker)}`);
  add("");

  // --- Similar ---
  add("similar:");
  for (const s of data.SIMILAR) {
    add(`  - name: ${yamlString(s.name)}`);
    add(`    score: ${s.score}`);
    add(`    spread: ${yamlString(s.spread)}`);
    add(`    type: ${yamlString(s.type)}`);
    add(`    why: ${yamlString(s.why)}`);
    add(`    slug: ${yamlString(s.slug)}`);
  }
  add("");

  // --- Cost boxes ---
  add("cost_boxes:");
  for (const cb of data.costBoxes) {
    add(`  - l: ${yamlString(cb.l)}`);
    add(`    v: ${yamlString(cb.v)}`);
    add(`    n: ${yamlString(cb.n)}`);
  }
  add("");

  // --- Trustpilot bars ---
  add("trustpilot_bars:");
  for (const tb of data.trustpilotBars) {
    add(`  - s: ${yamlString(tb.s)}`);
    add(`    p: ${tb.p}`);
  }

  return lines.join("\n");
}

/**
 * Convert content object to Markdown body.
 */
function buildMarkdownBody(content) {
  const parts = [];

  for (const key of CONTENT_SECTIONS) {
    if (!(key in content)) continue;
    const heading = SECTION_HEADINGS[key];
    const val = content[key];

    parts.push(`## ${heading}`);
    parts.push("");

    if (Array.isArray(val)) {
      for (const paragraph of val) {
        parts.push(paragraph);
        parts.push("");
      }
    } else {
      parts.push(val);
      parts.push("");
    }
  }

  return parts.join("\n");
}

// --- Main ---
const files = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".js") && f !== "index.js")
  .sort();

console.log(`Found ${files.length} broker files to migrate.\n`);

let success = 0;
let errors = 0;

for (const file of files) {
  const slug = basename(file, ".js");
  const srcPath = join(SRC_DIR, file);
  const outPath = join(OUT_DIR, `${slug}.md`);

  try {
    const data = parseBrokerJS(srcPath);

    const yaml = buildYAML(slug, data);
    const body = buildMarkdownBody(data.content);

    const md = `---\n${yaml}\n---\n\n${body}`;

    writeFileSync(outPath, md, "utf-8");
    console.log(`  ✓ ${slug}`);
    success++;
  } catch (err) {
    console.error(`  ✗ ${slug}: ${err.message}`);
    errors++;
  }
}

console.log(`\nMigration complete: ${success} OK, ${errors} errors.`);
if (errors > 0) process.exit(1);

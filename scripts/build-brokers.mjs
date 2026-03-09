#!/usr/bin/env node
/**
 * build-brokers.mjs
 * Reads content/brokers/*.md → generates src/data/brokers/*.js + index.js
 *
 * Usage: node scripts/build-brokers.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content/brokers");
const OUT_DIR = join(ROOT, "src/data/brokers");

const BANNER = (slug) =>
  `// AUTO-GENERATED — DO NOT EDIT\n// Source: content/brokers/${slug}.md\n`;

// Section key → markdown heading mapping
const SECTION_MAP = {
  Overview: "overview",
  Scoring: "scoring",
  "Account Intro": "accountIntro",
  "Account Outro": "accountOutro",
  Regulation: "regulation",
  Costs: "costs",
  Spreads: "spreads",
  Deposits: "deposits",
  Platforms: "platforms",
  Mobile: "mobile",
  Support: "support",
  Education: "education",
  Trustpilot: "trustpilot",
  Country: "country",
  Verdict: "verdict",
};

/**
 * Parse markdown body into content sections.
 * Splits on ## headings and maps to content object keys.
 */
function parseContent(markdownBody) {
  const content = {};
  const sections = markdownBody.split(/^## /m).filter(Boolean);

  for (const section of sections) {
    const newlineIdx = section.indexOf("\n");
    if (newlineIdx === -1) continue;

    const heading = section.substring(0, newlineIdx).trim();
    const body = section.substring(newlineIdx + 1).trim();
    const key = SECTION_MAP[heading];

    if (!key) continue;

    // Split into paragraphs (non-empty lines separated by blank lines)
    const paragraphs = body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Single paragraph → string, multiple → array
    content[key] = paragraphs.length === 1 ? paragraphs[0] : paragraphs;
  }

  return content;
}

/**
 * Transform parsed frontmatter (snake_case) back to the original JS data format.
 */
function buildDataObject(fm, content) {
  const data = {
    B: {
      name: fm.name,
      logo: fm.logo,
      url: fm.url,
      score: fm.score,
      verdict: fm.verdict,
      tp: fm.tp,
      tpCount: fm.tp_count,
      year: fm.year,
      hq: fm.hq,
      ceo: fm.ceo,
      regs: (fm.regulations || []).map((r) => ({
        name: r.name,
        country: r.country,
        num: r.number,
        tier: r.tier,
      })),
      type: fm.type,
      minDep: fm.min_deposit,
      spread: fm.spread,
      avgSpread: fm.avg_spread,
      commission: fm.commission,
      leverage: fm.leverage,
      instruments: fm.instruments,
      platforms: fm.platforms || [],
      promo: fm.promo,
      badge: fm.badge ?? null,
      riskWarning: fm.risk_warning,
    },
    SCORES: (fm.scores || []).map((s) => ({
      name: s.name,
      score: s.score,
      weight: s.weight,
      detail: s.detail,
    })),
    ACCOUNTS: (fm.accounts || []).map((a) => ({
      name: a.name,
      spread: a.spread,
      commission: a.commission,
      min: a.min,
      best: a.best,
    })),
    spreadCompetitors: fm.spread_competitors || [],
    SPREADS: (fm.spreads || []).map((s) => ({
      pair: s.pair,
      values: s.values,
    })),
    DEPOSITS: (fm.deposits || []).map((d) => ({
      method: d.method,
      fee: d.fee,
      min: d.min,
      time: d.time,
    })),
    TIMELINE: (fm.timeline || []).map((t) => ({
      year: t.year,
      event: t.event,
    })),
    PROS: fm.pros || [],
    CONS: fm.cons || [],
    FAQ: (fm.faq || []).map((f) => ({
      q: f.q,
      a: f.a,
    })),
    AUTHOR: {
      name: fm.author?.name,
      role: fm.author?.role,
      initials: fm.author?.initials,
      exp: fm.author?.exp,
      updated: fm.author?.updated,
      factChecker: fm.author?.fact_checker,
    },
    SIMILAR: (fm.similar || []).map((s) => ({
      name: s.name,
      score: s.score,
      spread: s.spread,
      type: s.type,
      why: s.why,
      slug: s.slug,
    })),
    costBoxes: (fm.cost_boxes || []).map((c) => ({
      l: c.l,
      v: c.v,
      n: c.n,
    })),
    trustpilotBars: (fm.trustpilot_bars || []).map((t) => ({
      s: t.s,
      p: t.p,
    })),
    content,
  };

  return data;
}

/**
 * Serialize a JS value to a source code string (like JSON.stringify but cleaner).
 */
function toJS(val, indent = 0) {
  const pad = "  ".repeat(indent);
  const pad1 = "  ".repeat(indent + 1);

  if (val === null || val === undefined) return "null";
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "string") return JSON.stringify(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";

    // Simple array of strings/numbers → compact if short
    if (val.every((v) => typeof v === "string" || typeof v === "number")) {
      const compact = `[${val.map((v) => JSON.stringify(v)).join(",")}]`;
      if (compact.length < 120) return compact;
    }

    const items = val.map((v) => `${pad1}${toJS(v, indent + 1)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }

  if (typeof val === "object") {
    const keys = Object.keys(val);
    if (keys.length === 0) return "{}";

    // Compact for small objects
    const compactParts = keys.map(
      (k) => `${safeKey(k)}:${toJS(val[k], indent + 1)}`
    );
    const compact = `{${compactParts.join(",")}}`;
    if (compact.length < 100 && !compact.includes("\n")) return compact;

    const entries = keys.map(
      (k) => `${pad1}${safeKey(k)}: ${toJS(val[k], indent + 1)}`
    );
    return `{\n${entries.join(",\n")}\n${pad}}`;
  }

  return String(val);
}

function safeKey(k) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

/**
 * Generate the JS source for a single broker.
 */
function generateBrokerJS(slug, data) {
  const lines = [];
  lines.push(BANNER(slug));
  lines.push(`const data = ${toJS(data)};`);
  lines.push("export default data;");
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate index.js with all broker imports and exports.
 */
function generateIndexJS(slugs) {
  const lines = [];
  lines.push(BANNER("index"));
  lines.push("");

  // Imports
  for (const slug of slugs) {
    const varName = slugToVar(slug);
    lines.push(`import ${varName} from "./${slug}";`);
  }
  lines.push("");

  // BROKERS object
  lines.push("const BROKERS = {");
  for (const slug of slugs) {
    const varName = slugToVar(slug);
    lines.push(`  "${slug}": ${varName},`);
  }
  lines.push("};");
  lines.push("");

  // Export functions
  lines.push("export function getBrokerData(slug) {");
  lines.push("  return BROKERS[slug] || null;");
  lines.push("}");
  lines.push("");

  lines.push("export function getAllBrokerSlugs() {");
  lines.push("  return Object.keys(BROKERS);");
  lines.push("}");
  lines.push("");

  lines.push("export function getAllBrokers() {");
  lines.push(
    "  return Object.entries(BROKERS).map(([slug, data]) => ({"
  );
  lines.push("    slug,");
  lines.push("    name: data.B.name,");
  lines.push("    score: data.B.score,");
  lines.push("    type: data.B.type,");
  lines.push("    spread: data.B.spread,");
  lines.push("    badge: data.B.badge,");
  lines.push("  }));");
  lines.push("}");
  lines.push("");

  lines.push("export function getAllBrokersWithData() {");
  lines.push(
    "  return Object.entries(BROKERS).map(([slug, data]) => ({ slug, ...data }));"
  );
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function slugToVar(slug) {
  // Convert slug to camelCase variable name
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// --- Main ---
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

console.log(`Building ${files.length} broker files...\n`);

const slugs = [];
let success = 0;
let errors = 0;

for (const file of files) {
  const slug = basename(file, ".md");
  slugs.push(slug);

  try {
    const raw = readFileSync(join(CONTENT_DIR, file), "utf-8");
    const { data: fm, content: mdBody } = matter(raw);

    const content = parseContent(mdBody);
    const dataObj = buildDataObject(fm, content);
    const js = generateBrokerJS(slug, dataObj);

    writeFileSync(join(OUT_DIR, `${slug}.js`), js, "utf-8");
    console.log(`  ✓ ${slug}`);
    success++;
  } catch (err) {
    console.error(`  ✗ ${slug}: ${err.message}`);
    errors++;
  }
}

// Generate index.js
try {
  const indexJS = generateIndexJS(slugs);
  writeFileSync(join(OUT_DIR, "index.js"), indexJS, "utf-8");
  console.log(`  ✓ index.js`);
} catch (err) {
  console.error(`  ✗ index.js: ${err.message}`);
  errors++;
}

console.log(
  `\nBuild complete: ${success} brokers + index.js (${errors} errors).`
);
if (errors > 0) process.exit(1);

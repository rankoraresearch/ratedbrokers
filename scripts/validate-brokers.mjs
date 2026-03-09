#!/usr/bin/env node
/**
 * validate-brokers.mjs
 * Validates all content/brokers/*.md files.
 *
 * Usage: node scripts/validate-brokers.mjs
 */

import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content/brokers");

// Required content sections
const REQUIRED_SECTIONS = ["Overview", "Scoring", "Verdict"];

// Valid statuses
const VALID_STATUSES = ["active", "suspended", "under-review"];

/**
 * Validate a single broker MD file.
 * Returns array of error messages (empty = valid).
 */
function validateBroker(filePath, allSlugs) {
  const errors = [];
  const slug = basename(filePath, ".md");

  let raw;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch (e) {
    return [`Cannot read file: ${e.message}`];
  }

  let fm, mdBody;
  try {
    const parsed = matter(raw);
    fm = parsed.data;
    mdBody = parsed.content;
  } catch (e) {
    return [`YAML parse error: ${e.message}`];
  }

  // --- Slug = filename ---
  if (fm.slug !== slug) {
    errors.push(`slug mismatch: frontmatter "${fm.slug}" !== filename "${slug}"`);
  }

  // --- Status ---
  if (fm.status && !VALID_STATUSES.includes(fm.status)) {
    errors.push(`invalid status: "${fm.status}" (expected: ${VALID_STATUSES.join(", ")})`);
  }

  // --- Required string fields ---
  const requiredStrings = ["name", "slug", "type", "spread", "risk_warning"];
  for (const field of requiredStrings) {
    if (!fm[field] && fm[field] !== "") {
      errors.push(`missing required field: ${field}`);
    }
  }

  // --- Score: 0-10 ---
  if (typeof fm.score !== "number" || fm.score < 0 || fm.score > 10) {
    errors.push(`score must be 0-10, got: ${fm.score}`);
  }

  // --- min_deposit: >= 0 ---
  if (typeof fm.min_deposit !== "number" || fm.min_deposit < 0) {
    errors.push(`min_deposit must be >= 0, got: ${fm.min_deposit}`);
  }

  // --- Regulations ---
  if (!Array.isArray(fm.regulations) || fm.regulations.length === 0) {
    errors.push("regulations must be a non-empty array");
  } else {
    for (const [i, reg] of fm.regulations.entries()) {
      if (!reg.name) errors.push(`regulations[${i}].name is missing`);
      if (!reg.country) errors.push(`regulations[${i}].country is missing`);
      if (![1, 2, 3].includes(reg.tier)) {
        errors.push(`regulations[${i}].tier must be 1, 2, or 3, got: ${reg.tier}`);
      }
    }
  }

  // --- Platforms ---
  if (!Array.isArray(fm.platforms) || fm.platforms.length === 0) {
    errors.push("platforms must be a non-empty array");
  }

  // --- Scores ---
  if (!Array.isArray(fm.scores) || fm.scores.length === 0) {
    errors.push("scores must be a non-empty array");
  } else {
    const totalWeight = fm.scores.reduce((sum, s) => sum + (s.weight || 0), 0);
    if (totalWeight !== 100) {
      errors.push(`scores weights must sum to 100, got: ${totalWeight}`);
    }
    for (const [i, s] of fm.scores.entries()) {
      if (typeof s.score !== "number" || s.score < 0 || s.score > 10) {
        errors.push(`scores[${i}].score must be 0-10, got: ${s.score}`);
      }
    }
  }

  // --- Spread values count matches competitors ---
  if (fm.spread_competitors && fm.spreads) {
    const numCompetitors = fm.spread_competitors.length;
    for (const [i, sp] of fm.spreads.entries()) {
      if (sp.values && sp.values.length !== numCompetitors) {
        errors.push(
          `spreads[${i}] (${sp.pair}): ${sp.values.length} values, expected ${numCompetitors} (spread_competitors count)`
        );
      }
    }
  }

  // --- Similar slugs must exist ---
  if (Array.isArray(fm.similar)) {
    for (const s of fm.similar) {
      if (s.slug && !allSlugs.has(s.slug)) {
        errors.push(`similar slug "${s.slug}" does not exist as a MD file`);
      }
    }
  }

  // --- Content sections ---
  const sectionHeadings = (mdBody.match(/^## (.+)$/gm) || []).map((h) =>
    h.replace("## ", "")
  );
  for (const required of REQUIRED_SECTIONS) {
    if (!sectionHeadings.includes(required)) {
      errors.push(`missing required content section: ## ${required}`);
    }
  }

  return errors;
}

// --- Main ---
const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

// Collect all slugs first
const allSlugs = new Set(files.map((f) => basename(f, ".md")));

console.log(`Validating ${files.length} broker files...\n`);

let totalErrors = 0;

for (const file of files) {
  const slug = basename(file, ".md");
  const errors = validateBroker(join(CONTENT_DIR, file), allSlugs);

  if (errors.length > 0) {
    console.log(`  ✗ ${slug}`);
    for (const err of errors) {
      console.log(`      ${err}`);
    }
    totalErrors += errors.length;
  } else {
    console.log(`  ✓ ${slug}`);
  }
}

console.log(
  `\nValidation complete: ${files.length} files, ${totalErrors} errors.`
);
if (totalErrors > 0) process.exit(1);

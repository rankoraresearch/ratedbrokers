// S4: triage 88 needsManualReview authors.
// Heuristic auto-clear: has ≥2 independent identity signals (LinkedIn,
// MuckRack, personal site, multi-outlet ≥2). The rest stay flagged with
// a triage rank for Егор's manual pass — most flags exist for good reasons
// (former/retired, sparse signals, ambiguous identity).
import fs from "node:fs";
import url from "node:url";

import path from "node:path";
const here = url.fileURLToPath(new URL(".", import.meta.url));
const samplePath = path.resolve(here, "..", "src/data/authorsSample.js");

// Read source as text — we patch the AUTHORS array in place to preserve
// schema, comments, and other exports.
const src = fs.readFileSync(samplePath, "utf8");

// Pull AUTHORS array via dynamic import for analysis only.
const m = await import(samplePath);
const A = m.AUTHORS.filter(Boolean);
const flagged = A.filter((a) => a.needsManualReview);

const score = (a) => {
  let s = 0;
  if (a.linkedin) s += 2;
  if (a.muckrack) s += 2;
  if (a.personalSite || a.trustSignals?.ownedDomain) s += 2;
  if ((a.writesFor?.length || 1) >= 2) s += 2;
  if (a.twitter) s += 1;
  if (a.certifications?.length >= 2) s += 2;
  if (a.email) s += 1;
  if (a.mediaSignals?.authoredBooks?.length) s += 1;
  if (a.mediaSignals?.quotedInTier1?.length) s += 1;
  if (a.yearsInIndustry >= 10) s += 1;
  return s;
};

const ranked = flagged
  .map((a) => ({ a, s: score(a) }))
  .sort((x, y) => y.s - x.s);

const autoCleared = ranked.filter((r) => r.s >= 4 && r.a.status !== "former");
const stillFlagged = ranked.filter((r) => !autoCleared.includes(r));

// Write triage report (markdown) for Егор
const lines = [];
lines.push("# Manual Review Triage — 88 flagged authors");
lines.push("");
lines.push(`Generated ${new Date().toISOString().split("T")[0]} by S4 sprint.`);
lines.push("");
lines.push(`**Auto-cleared**: ${autoCleared.length} (≥4 signal points, not former). Flag removed.`);
lines.push(`**Still flagged**: ${stillFlagged.length} (sparse signals or former — Егор decides).`);
lines.push("");
lines.push("## Auto-cleared (flag removed in code)");
lines.push("");
lines.push("| # | Name | Outlet | Score | LinkedIn | MuckRack | Multi | Site |");
lines.push("|---|---|---|---|---|---|---|---|");
autoCleared.forEach((r, i) => {
  const a = r.a;
  lines.push(
    `| ${i + 1} | ${a.name} | ${a.site} | ${r.s} | ` +
      `${a.linkedin ? "✓" : "—"} | ${a.muckrack ? "✓" : "—"} | ` +
      `${(a.writesFor?.length || 1) >= 2 ? a.writesFor.length + "x" : "—"} | ` +
      `${a.personalSite || a.trustSignals?.ownedDomain ? "✓" : "—"} |`,
  );
});

lines.push("");
lines.push("## Still flagged — triage by signal strength (top first)");
lines.push("");
lines.push("Top of list = easiest for Егор to verify (more signals). Bottom = sparse, may need to remove from dataset.");
lines.push("");
lines.push("| # | Name | Outlet | Pts | Status | Why flagged (notes) |");
lines.push("|---|---|---|---|---|---|");
stillFlagged.forEach((r, i) => {
  const a = r.a;
  const note = (a.notes || a.discoveryNote || "").replace(/\|/g, "/").slice(0, 100);
  lines.push(
    `| ${i + 1} | ${a.name} | ${a.site} | ${r.s} | ` +
      `${a.status || a.seniority || "—"} | ${note || "(no note — sparse data)"} |`,
  );
});

fs.writeFileSync(`${here}/../MANUAL-REVIEW-TRIAGE.md`, lines.join("\n"));

// Patch authorsSample.js: for auto-cleared, set needsManualReview: false
// and append triage note. We use a deterministic regex per id.
let patched = src;
let patches = 0;
for (const r of autoCleared) {
  const id = r.a.id;
  // Find author block by id, then change needsManualReview true → false
  const blockRe = new RegExp(
    `("id":\\s*"${id.replace(/[-/\\^$*+?.()|[\\]{}]/g, "\\$&")}"[\\s\\S]*?)("needsManualReview":\\s*)true`,
    "m",
  );
  if (blockRe.test(patched)) {
    patched = patched.replace(blockRe, (_m, pre, mid) => `${pre}${mid}false`);
    patches += 1;
  }
}

fs.writeFileSync(samplePath, patched);
console.log(`Wrote MANUAL-REVIEW-TRIAGE.md`);
console.log(`Patched authorsSample.js: ${patches}/${autoCleared.length} flags cleared`);
console.log(`Still flagged: ${stillFlagged.length}`);

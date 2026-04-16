// S7 cleanup: WebSearch agent hallucinated 43 "exact" LinkedIn follower
// counts. Verified via user spot-check (Larry Swedroe: claimed 280,836,
// actual 9,229 — wrong by ~30x). Snippets had confidence: high but no
// source URL and were fabricated text.
//
// This script:
//   1. Strips mediaSignals.linkedinFollowers from every author in
//      src/data/authorsSample.js
//   2. Strips mediaSignals.linkedinFetchedAt
//   3. Keeps mediaSignals.linkedinConnections (the "500+" bucket — that
//      one was a literal Google snippet quote, not invented)
//   4. Same purge in scripts/s7-followers-output.json so future merges
//      don't restore the bad data
//
// Until we have a working Variant A path (Playwright with proper
// throttle on a fresh session) we should not display follower numbers
// at all.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const samplePath = path.resolve(root, "src/data/authorsSample.js");
const outputPath = path.resolve(here, "s7-followers-output.json");

// ─── 1. Patch authorsSample.js: remove linkedinFollowers + linkedinFetchedAt
let src = fs.readFileSync(samplePath, "utf8");
const before = src.length;

// Match `, "linkedinFollowers": <number>` (with optional leading whitespace)
src = src.replace(/,\s*"linkedinFollowers":\s*\d+/g, "");
src = src.replace(/,\s*"linkedinFetchedAt":\s*"[^"]*"/g, "");
// Also handle when these are at start of object (no leading comma)
src = src.replace(/"linkedinFollowers":\s*\d+\s*,/g, "");
src = src.replace(/"linkedinFetchedAt":\s*"[^"]*"\s*,/g, "");

const after = src.length;
fs.writeFileSync(samplePath, src);
console.log(`Patched authorsSample.js: removed ${before - after} bytes (linkedinFollowers + linkedinFetchedAt fields)`);

// ─── 2. Patch s7-followers-output.json: zero out followers field
const fetched = JSON.parse(fs.readFileSync(outputPath, "utf8"));
let purged = 0;
for (const r of fetched) {
  if (r.followers != null) {
    r.followersHallucinated = r.followers;
    r.followersHallucinatedSnippet = r.snippet;
    r.followers = null;
    r.confidence = "purged";
    r.notes = "PURGED 2026-04-16 — agent hallucinated count, no verifiable source URL. See followersHallucinated for original claim.";
    purged += 1;
  }
}
fs.writeFileSync(outputPath, JSON.stringify(fetched, null, 2));
console.log(`Purged ${purged} hallucinated follower counts in s7-followers-output.json (kept original claim in followersHallucinated for forensics)`);

console.log(`\nNext steps:`);
console.log(`  1. node scripts/s6-build-catalog.mjs   # regen all catalog files`);
console.log(`  2. npm run build                       # verify`);
console.log(`  3. git commit + push                   # ship cleanup`);

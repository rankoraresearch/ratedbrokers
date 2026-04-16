// S9 merger V2: rebuild-from-data approach, replacing the fragile
// regex-based v1 that broke JSON on re-runs.
//
// Strategy:
//   1. Import AUTHORS from authorsSample.js (via JS import — already
//      valid syntax).
//   2. Load verification + Twitter data.
//   3. Mutate each author in memory: update mediaSignals, trustSignals,
//      certifications.
//   4. Serialize AUTHORS back to a pretty-printed JSON-like block and
//      splice into the source file, replacing the original
//      `export const AUTHORS = [...]` section.
//
// Idempotent — reruns just overwrite the same fields.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const samplePath = path.resolve(root, "src/data/authorsSample.js");
const src = fs.readFileSync(samplePath, "utf8");

// 1. Bring AUTHORS in as data.
const m = await import(samplePath + "?t=" + Date.now());
const authors = m.AUTHORS.filter(Boolean).map((a) => structuredClone(a));

// 2. Load verification + twitter
const verifyByAuthor = new Map();
for (const dir of ["s9-verify-batches", "s9-retry-batches"]) {
  const d = path.resolve(here, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((n) => n.endsWith("-output.json")).sort()) {
    try {
      const arr = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
      for (const r of arr) {
        if (r && r.id) {
          const prev = verifyByAuthor.get(r.id) || {};
          verifyByAuthor.set(r.id, { ...prev, ...r });
        }
      }
    } catch (e) { console.warn(`! ${f}: ${e.message}`); }
  }
}
const twitterByAuthor = new Map();
const twitterPath = path.resolve(here, "s9-twitter-output.json");
if (fs.existsSync(twitterPath)) {
  for (const r of JSON.parse(fs.readFileSync(twitterPath, "utf8"))) {
    if (r && r.id && r.followers != null) twitterByAuthor.set(r.id, r);
  }
}
// LinkedIn fetch outputs — merge both S9 (blocked early) and S10 (CDP).
// S10 later takes precedence for same id.
const liByAuthor = new Map();
for (const p of ["s9-li-output.json", "s10-li-cdp-output.json"]) {
  const full = path.resolve(here, p);
  if (!fs.existsSync(full)) continue;
  for (const r of JSON.parse(fs.readFileSync(full, "utf8"))) {
    if (r && r.id && (r.followers != null || r.connections)) liByAuthor.set(r.id, r);
  }
}

console.log(`Verification records: ${verifyByAuthor.size}`);
console.log(`Twitter records: ${twitterByAuthor.size}`);
console.log(`LinkedIn records: ${liByAuthor.size}`);

// 3. Mutate in memory.
let patched = 0, twCount = 0, liCount = 0;
for (const a of authors) {
  let changed = false;
  const v = verifyByAuthor.get(a.id);
  if (v) {
    changed = true;
    a.mediaSignals = a.mediaSignals || {};
    if (v.books?.length) {
      const isbns = v.books.filter((b) => b.verified && b.isbn13).map((b) => b.isbn13);
      if (isbns.length) a.mediaSignals.bookISBNs = isbns;
    }
    if (v.industryAwards?.length) {
      a.mediaSignals.industryAwards = v.industryAwards.filter((x) => x && x.name);
    }
    if (v.tier1Quotes?.length) {
      const verified = v.tier1Quotes.filter((q) => q.verified)
        .map((q) => ({ outlet: q.outlet, sampleUrl: q.sampleUrl }));
      if (verified.length) a.mediaSignals.tier1QuotesVerified = verified;
    }
    if (v.certifications?.length) {
      a.certifications = v.certifications.map((c) => ({
        name: c.name, issuer: c.issuer || null,
        verified: !!c.verified, verifyUrl: c.verifyUrl || null,
        verifyMethod: c.verifyMethod || null, verifyNote: c.verifyNote || null,
      }));
    }
    if (v.trustSignals && (v.trustSignals.finraBrokerCheckStatus || v.trustSignals.crd)) {
      a.trustSignals = a.trustSignals || {};
      if (v.trustSignals.finraBrokerCheckStatus) a.trustSignals.finraBrokerCheckStatus = v.trustSignals.finraBrokerCheckStatus;
      if (v.trustSignals.crd) a.trustSignals.crd = v.trustSignals.crd;
    }
    patched += 1;
  }
  const t = twitterByAuthor.get(a.id);
  if (t && t.followers != null) {
    a.mediaSignals = a.mediaSignals || {};
    a.mediaSignals.twitterFollowers = t.followers;
    if (t.following != null) a.mediaSignals.twitterFollowing = t.following;
    if (t.fetchedAt) a.mediaSignals.twitterFetchedAt = t.fetchedAt;
    twCount += 1;
    changed = true;
  }
  const l = liByAuthor.get(a.id);
  if (l && (l.followers != null || l.connections)) {
    a.mediaSignals = a.mediaSignals || {};
    if (l.followers != null) a.mediaSignals.linkedinFollowers = l.followers;
    if (l.connections) a.mediaSignals.linkedinConnections = l.connections;
    if (l.fetchedAt) a.mediaSignals.linkedinFetchedAt = l.fetchedAt;
    liCount += 1;
    changed = true;
  }
}
console.log(`Patched in memory: verification=${patched}, twitter=${twCount}, linkedin=${liCount}`);

// 4. Serialize AUTHORS back. Find the export block boundaries.
const startPattern = /export const AUTHORS = \[/;
const startMatch = src.match(startPattern);
if (!startMatch) { console.error("Can't find AUTHORS export start"); process.exit(1); }
const startIdx = startMatch.index;
// Walk forward to find the matching closing `];` of the array.
// Naive bracket count, respecting strings + escapes.
let depth = 0;
let inStr = false;
let escape = false;
let endIdx = -1;
for (let i = startIdx + startMatch[0].length - 1; i < src.length; i++) {
  const c = src[i];
  if (escape) { escape = false; continue; }
  if (c === "\\") { escape = true; continue; }
  if (c === '"' && !escape) { inStr = !inStr; continue; }
  if (inStr) continue;
  if (c === "[") depth += 1;
  else if (c === "]") {
    depth -= 1;
    if (depth === 0) { endIdx = i + 1; break; }
  }
}
if (endIdx === -1) { console.error("Can't find AUTHORS export end"); process.exit(1); }
// Also include a trailing semicolon if present.
if (src[endIdx] === ";") endIdx += 1;

// Serialize authors array using JSON.stringify (pretty) — that gives us
// a valid JS array literal since all values are JSON-safe.
const serialized = JSON.stringify(authors, null, 2);
const newBlock = `export const AUTHORS = ${serialized};`;

const out = src.slice(0, startIdx) + newBlock + src.slice(endIdx);
fs.writeFileSync(samplePath, out);

console.log(`Wrote authorsSample.js (${out.length} bytes)`);

// Report summary table
const lines = ["# Manual Review — Verifications (S9)\n"];
lines.push(`Generated ${new Date().toISOString().split("T")[0]} from S9 verification pass.\n`);
lines.push(`| Author | Certs verified | Books w/ ISBN | Awards | X followers | LI followers |`);
lines.push(`|---|---|---|---|---|---|`);
for (const a of authors) {
  const v = verifyByAuthor.get(a.id);
  if (!v) continue;
  const cv = (v.certifications || []).filter((c) => c.verified).length;
  const cc = (v.certifications || []).length;
  const bi = (v.books || []).filter((b) => b.verified && b.isbn13).length;
  const aw = (v.industryAwards || []).length;
  const tw = a.mediaSignals?.twitterFollowers ?? "—";
  const li = a.mediaSignals?.linkedinFollowers ?? a.mediaSignals?.linkedinConnections ?? "—";
  lines.push(`| ${a.name} | ${cv}/${cc} | ${bi} | ${aw} | ${tw.toLocaleString ? tw.toLocaleString() : tw} | ${li} |`);
}
fs.writeFileSync(path.resolve(root, "MANUAL-REVIEW-VERIFICATIONS.md"), lines.join("\n"));
console.log(`Wrote MANUAL-REVIEW-VERIFICATIONS.md`);

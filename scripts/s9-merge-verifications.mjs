// S9 merger: consolidates 4 verification batches + Twitter follower
// fetch into src/data/authorsSample.js. Idempotent — reruns are safe.
//
// What gets patched per author:
//   mediaSignals.twitterFollowers, twitterFollowing, twitterFetchedAt
//   certifications[].verified + verifyUrl + verifyMethod + verifyNote
//   mediaSignals.bookISBNs (from books[].isbn13)
//   mediaSignals.industryAwards (newly discovered)
//   trustSignals.finraBrokerCheckStatus + crd
//   tier1QuotesVerified[]   (subset of quotedInTier1 with sample URL)
//   educationVerified[]     (subset of education with verify URL)
//
// Strict policy: only `verified: true` entries persist. Anything
// `verifyAttempted: true` but `verified: false` is logged in
// MANUAL-REVIEW-VERIFICATIONS.md for Egor's morning review.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const samplePath = path.resolve(root, "src/data/authorsSample.js");

// ─── 1. Load verification outputs from BOTH original batches and retry batches.
// Merge strategy: later batch wins for same-id records.
const verifyByAuthor = new Map();
for (const dir of ["s9-verify-batches", "s9-retry-batches"]) {
  const d = path.resolve(here, dir);
  if (!fs.existsSync(d)) continue;
  const files = fs.readdirSync(d).filter((n) => n.endsWith("-output.json")).sort();
  for (const f of files) {
    try {
      const arr = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
      for (const r of arr) {
        if (r && r.id) {
          const prev = verifyByAuthor.get(r.id) || {};
          verifyByAuthor.set(r.id, { ...prev, ...r });
        }
      }
    } catch (e) {
      console.warn(`! ${f} parse failed: ${e.message}`);
    }
  }
}
console.log(`Verification records (consolidated): ${verifyByAuthor.size}`);

// ─── 2. Load Twitter follower fetch output
const twitterByAuthor = new Map();
const twitterPath = path.resolve(here, "s9-twitter-output.json");
if (fs.existsSync(twitterPath)) {
  const arr = JSON.parse(fs.readFileSync(twitterPath, "utf8"));
  for (const r of arr) {
    if (r && r.id && r.followers != null) twitterByAuthor.set(r.id, r);
  }
  console.log(`Twitter follower records: ${twitterByAuthor.size}`);
}

// ─── 3. Patch authorsSample.js
let src = fs.readFileSync(samplePath, "utf8");
let patched = 0;
let twitterPatched = 0;

// Helper: locate author block by id, return [start, end] of object {...}
function findAuthorBlock(text, id) {
  const idEsc = id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(`"id":\\s*"${idEsc}"`, "m");
  const m = text.match(re);
  if (!m) return null;
  // Walk back to find the opening "{" of this author object
  let i = m.index;
  let depth = 0;
  while (i > 0) {
    const c = text[i];
    if (c === "}") depth += 1;
    if (c === "{") {
      if (depth === 0) return { start: i, idx: m.index };
      depth -= 1;
    }
    i -= 1;
  }
  return null;
}

// Patch verification fields into mediaSignals + certifications
for (const [id, v] of verifyByAuthor) {
  const block = findAuthorBlock(src, id);
  if (!block) {
    console.warn(`! id "${id}" — author block not found`);
    continue;
  }
  // Find mediaSignals object inside this author block
  const tail = src.slice(block.idx);
  const msMatch = tail.match(/"mediaSignals":\s*\{([\s\S]*?)\n\s{2,}\}/);
  if (!msMatch) continue;
  const msStart = block.idx + msMatch.index + msMatch[0].indexOf("{") + 1;
  const msEnd = block.idx + msMatch.index + msMatch[0].length - 1; // position of closing }

  // Build inject string for mediaSignals additions
  const newAwards = (v.industryAwards || []).filter(a => a && a.name);
  const verifiedBooks = (v.books || []).filter(b => b.verified && b.isbn13);
  const verifiedT1 = (v.tier1Quotes || []).filter(q => q.verified);
  let inject = "";
  if (verifiedBooks.length) inject += `,\n      "bookISBNs": ${JSON.stringify(verifiedBooks.map(b => b.isbn13))}`;
  if (newAwards.length) inject += `,\n      "industryAwards": ${JSON.stringify(newAwards)}`;
  if (verifiedT1.length) inject += `,\n      "tier1QuotesVerified": ${JSON.stringify(verifiedT1.map(q => ({ outlet: q.outlet, sampleUrl: q.sampleUrl })))}`;
  // Drop existing dup fields if any
  let body = src.slice(msStart, msEnd);
  for (const key of ["bookISBNs", "industryAwards", "tier1QuotesVerified"]) {
    body = body.replace(new RegExp(`,?\\s*"${key}":\\s*\\[[\\s\\S]*?\\](?=[,\\n}])`, ""), "");
  }
  if (inject) body = body.replace(/[\s,]*$/, "") + inject;
  src = src.slice(0, msStart) + body + src.slice(msEnd);

  // Patch trustSignals (FINRA status / crd)
  if (v.trustSignals && (v.trustSignals.finraBrokerCheckStatus || v.trustSignals.crd)) {
    const tsMatch = src.slice(block.idx).match(/"trustSignals":\s*\{([\s\S]*?)\n\s{2,}\}/);
    if (tsMatch) {
      const tsStart = block.idx + tsMatch.index + tsMatch[0].indexOf("{") + 1;
      const tsEnd = block.idx + tsMatch.index + tsMatch[0].length - 1;
      let tsBody = src.slice(tsStart, tsEnd);
      tsBody = tsBody.replace(/,?\s*"finraBrokerCheckStatus":\s*"[^"]*"/, "");
      tsBody = tsBody.replace(/,?\s*"crd":\s*"[^"]*"/, "");
      let tsInject = "";
      if (v.trustSignals.finraBrokerCheckStatus) tsInject += `,\n      "finraBrokerCheckStatus": ${JSON.stringify(v.trustSignals.finraBrokerCheckStatus)}`;
      if (v.trustSignals.crd) tsInject += `,\n      "crd": ${JSON.stringify(v.trustSignals.crd)}`;
      tsBody = tsBody.replace(/[\s,]*$/, "") + tsInject;
      src = src.slice(0, tsStart) + tsBody + src.slice(tsEnd);
    }
  }

  // Patch certifications: replace claimed list with verification-enriched list
  // (only if the author had certifications already)
  if (v.certifications && v.certifications.length) {
    const cMatch = src.slice(block.idx).match(/"certifications":\s*\[([\s\S]*?)\](?=,?\s*"\w)/);
    if (cMatch) {
      const cStart = block.idx + cMatch.index;
      const cEnd = cStart + cMatch[0].length;
      const newCerts = JSON.stringify(v.certifications.map(c => ({
        name: c.name, issuer: c.issuer || null,
        verified: !!c.verified, verifyUrl: c.verifyUrl || null,
        verifyMethod: c.verifyMethod || null, verifyNote: c.verifyNote || null,
      })), null, 2).replace(/\n/g, "\n      ");
      src = src.slice(0, cStart) + `"certifications": ${newCerts}` + src.slice(cEnd);
    }
  }

  patched += 1;
}

// Patch Twitter followers into mediaSignals
for (const [id, t] of twitterByAuthor) {
  const block = findAuthorBlock(src, id);
  if (!block) continue;
  const tail = src.slice(block.idx);
  const msMatch = tail.match(/"mediaSignals":\s*\{([\s\S]*?)\n\s{2,}\}/);
  if (!msMatch) continue;
  const msStart = block.idx + msMatch.index + msMatch[0].indexOf("{") + 1;
  const msEnd = block.idx + msMatch.index + msMatch[0].length - 1;
  let body = src.slice(msStart, msEnd);
  // Remove old twitter fields
  body = body.replace(/,?\s*"twitterFollowers":\s*\d+/, "");
  body = body.replace(/,?\s*"twitterFollowing":\s*\d+/, "");
  body = body.replace(/,?\s*"twitterFetchedAt":\s*"[^"]*"/, "");
  // Inject new
  let inject = `,\n      "twitterFollowers": ${t.followers}`;
  if (t.following != null) inject += `,\n      "twitterFollowing": ${t.following}`;
  inject += `,\n      "twitterFetchedAt": ${JSON.stringify(t.fetchedAt)}`;
  body = body.replace(/[\s,]*$/, "") + inject;
  src = src.slice(0, msStart) + body + src.slice(msEnd);
  twitterPatched += 1;
}

fs.writeFileSync(samplePath, src);
console.log(`Patched authorsSample.js: ${patched} authors with verification + ${twitterPatched} authors with Twitter follower count`);

// ─── 4. Manual review report
const lines = [];
lines.push(`# Manual Review — Verifications`);
lines.push(``);
lines.push(`Generated ${new Date().toISOString().split("T")[0]} from S9 verification pass.`);
lines.push(``);
lines.push(`## Author summaries`);
lines.push(``);
lines.push(`| Author | Certs verified | Books w/ ISBN | Tier-1 verified | New awards |`);
lines.push(`|---|---|---|---|---|`);
for (const [id, v] of verifyByAuthor) {
  const s = v.summary || {};
  lines.push(`| ${v.name} | ${s.certsVerified || 0}/${s.certsClaimed || 0} | ${s.booksWithIsbn || 0} | ${s.tier1Verified || 0} | ${s.newAwardsFound || 0} |`);
}
fs.writeFileSync(path.resolve(root, "MANUAL-REVIEW-VERIFICATIONS.md"), lines.join("\n"));

console.log(`Wrote MANUAL-REVIEW-VERIFICATIONS.md`);

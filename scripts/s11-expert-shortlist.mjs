// S11: Realistic expert shortlist for RatedBrokers.
//
// Goal: score all 579 harvested authors on how REALISTIC it is to
// onboard them as a "reviewed and approved by" expert for our content,
// and how much Google E-E-A-T weight they would add.
//
// Methodology & weights documented in src/data/realismScore.js and
// EXPERT-CANDIDATES-REALISTIC-TOP50.md.
//
// Output: scripts/s11-shortlist-output.json
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const OUTPUT = path.resolve(here, "s11-shortlist-output.json");
const samplePath = path.resolve(root, "src/data/authorsSample.js");
const scorerPath = path.resolve(root, "src/data/realismScore.js");
const m = await import(samplePath + "?t=" + Date.now());
const scorer = await import(scorerPath + "?t=" + Date.now());
const AUTHORS = m.AUTHORS.filter(Boolean);

const scored = AUTHORS.map(a => {
  const s = scorer.calcRealismScore(a);
  const certList = (a.certifications || []).map(c => {
    if (typeof c === "string") return { name: c, issuer: null, verified: false };
    return { name: c?.name || "", issuer: c?.issuer || null, verified: !!c?.verified };
  });
  return {
    id: a.id,
    name: a.name,
    role: a.role,
    seniority: a.seniority,
    writesFor: a.writesFor || [],
    beat: a.beat || [],
    yearsInIndustry: a.yearsInIndustry,
    badge: a.badge,
    certifications: certList,
    mediaSignals: {
      twitterFollowers: a.mediaSignals?.twitterFollowers ?? null,
      linkedinFollowers: a.mediaSignals?.linkedinFollowers ?? null,
      quotedInTier1: a.mediaSignals?.quotedInTier1 || [],
    },
    contact: { linkedin: !!a.linkedin, email: !!a.email, twitter: !!a.twitter },
    score: s.total,
    breakdown: s.sub,
    penalty: s.penalty,
    tier: scorer.classifyCandidate(a, s.sub),
  };
});

scored.sort((a, b) => b.score - a.score);

scored.forEach((a, i) => {
  a.rank = i + 1;
  if (i < 50) a.bucket = "TOP50";
  else if (i < 150) a.bucket = "longlist";
  else a.bucket = "passed";
});

fs.writeFileSync(OUTPUT, JSON.stringify(scored, null, 2));
console.log(`[s11] Scored ${scored.length} authors, written to ${path.relative(root, OUTPUT)}`);
console.log(`[s11] Top 10:`);
scored.slice(0, 10).forEach(a => {
  const certs = a.certifications.map(c => c.name + (c.verified ? "✓" : "")).join("+") || "—";
  console.log(`  #${a.rank.toString().padStart(2)} ${a.name.padEnd(28)} | ${a.score.toString().padStart(5)} | ${a.tier} | ${certs.padEnd(20)} | ${a.seniority.padEnd(12)} | ${a.writesFor.slice(0,3).join(",")}`);
});
console.log(`\n[s11] Top 50 bucket size check: ${scored.filter(a => a.bucket === "TOP50").length}`);
console.log(`[s11] Longlist (51-150): ${scored.filter(a => a.bucket === "longlist").length}`);

// S11b: Generate EXPERT-CANDIDATES-REALISTIC-TOP50.md from scoring output.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const INPUT = path.resolve(here, "s11-shortlist-output.json");
const OUTPUT = path.resolve(root, "EXPERT-CANDIDATES-REALISTIC-TOP50.md");
const data = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const top50 = data.filter(a => a.bucket === "TOP50");
const longlist = data.filter(a => a.bucket === "longlist");

function fmtCerts(certs) {
  if (!certs?.length) return "—";
  return certs.map(c => {
    const name = typeof c === "string" ? c : (c?.name || "?");
    const verified = typeof c === "object" && c?.verified ? " ✓" : "";
    return name + verified;
  }).join(" + ");
}
function fmtReach(ms) {
  const parts = [];
  if (ms.twitterFollowers != null) parts.push(`X ${ms.twitterFollowers.toLocaleString()}`);
  if (ms.linkedinFollowers != null) parts.push(`LI ${ms.linkedinFollowers.toLocaleString()}`);
  return parts.length ? parts.join(" / ") : "—";
}
const TIER_LABEL = {
  A: "A-Perfect fit",
  B: "B-Strong realistic",
  C: "C-Upside bet",
  D: "D-Secondary",
  E: "E-Stretch",
};
function classify(a) {
  return TIER_LABEL[a.tier] || "E-Stretch";
}

// Group top 50 by tier
const tiers = { "A-Perfect fit": [], "B-Strong realistic": [], "C-Upside bet": [], "D-Secondary": [], "E-Stretch": [] };
top50.forEach(a => { tiers[classify(a)].push(a); });

let md = "";
md += "# Expert Candidates — Realistic Top 50\n\n";
md += "> Independent pass across all 579 harvested authors, scored on realism (not raw authority).\n";
md += "> Goal: identify who would actually say yes AND add Google E-E-A-T weight to our content.\n\n";
md += `Generated: ${new Date().toISOString().slice(0,10)} | Source: \`scripts/s11-shortlist-output.json\`\n\n`;
md += "---\n\n";

md += "## Methodology\n\n";
md += "Composite `realismScore` (0–100):\n\n";
md += "| Factor | Weight | What it measures |\n";
md += "|---|---|---|\n";
md += "| Credentials | 25% | CFA / CFP / FINRA / CMT / CPA — verified ✓ beats unverified claim beats no cert |\n";
md += "| On-topic | 25% | forex / cfd / broker-safety / regulation beats stocks beats crypto beats generic finance |\n";
md += "| Reach (capped) | 15% | Sweet spot 10–200K combined followers — penalty above 500K (celebrity = unreachable) |\n";
md += "| Byline depth | 15% | yearsInIndustry + number of publishing outlets |\n";
md += "| Approachability | 20% | Contributor/freelance > senior/editor > chief at Tier-1 |\n\n";
md += "**Penalties** (subtracted from total):\n";
md += "- Chief/staff at Bloomberg, Reuters, WSJ, FT, CNBC, NYT — −20 (unlikely to moonlight)\n";
md += "- Twitter followers > 500K — −15 (out of our league)\n";
md += "- No LinkedIn AND no email — −15 (no path to reach them)\n";
md += "- Harvest badge = C — −10\n\n";
md += "**Classification buckets** (within top 50):\n\n";
md += "- **A — Perfect fit**: verified core cert ✓ + on-topic beat + approachable\n";
md += "- **B — Strong realistic**: verified core cert ✓ + approachable (topic adjacent)\n";
md += "- **C — Upside bet**: on-topic + approachable + some cert claim (needs verification)\n";
md += "- **D — Secondary**: approachable + good byline, no cert\n";
md += "- **E — Stretch**: high-authority but harder sell\n\n";

md += `## Summary stats\n\n`;
md += `- Scored: **${data.length}** authors\n`;
md += `- Top 50 avg score: **${(top50.reduce((s,a)=>s+a.score,0)/50).toFixed(1)}**\n`;
md += `- Top 50 with verified cert ✓: **${top50.filter(a=>a.certifications.some(c=>c.verified)).length}**\n`;
md += `- Top 50 with LinkedIn: **${top50.filter(a=>a.contact.linkedin).length}**\n`;
md += `- Top 50 with public email: **${top50.filter(a=>a.contact.email).length}**\n\n`;

md += `## Tier breakdown\n\n`;
for (const [tier, list] of Object.entries(tiers)) {
  md += `- **${tier}**: ${list.length}\n`;
}
md += "\n---\n\n";

// Top 50 table
md += "## Top 50 — ranked table\n\n";
md += "| # | Name | Score | Tier | Seniority | Certs | Beat | Reach | Sites |\n";
md += "|---|---|---|---|---|---|---|---|---|\n";
top50.forEach(a => {
  const tier = classify(a).split("-")[0];
  md += `| ${a.rank} | **${a.name}** | ${a.score} | ${tier} | ${a.seniority||"—"} | ${fmtCerts(a.certifications)} | ${(a.beat||[]).slice(0,2).join(", ")||"—"} | ${fmtReach(a.mediaSignals)} | ${(a.writesFor||[]).slice(0,3).join(", ")} |\n`;
});
md += "\n---\n\n";

// Detailed blocks for top 15
md += "## Top 15 — detailed profiles\n\n";
top50.slice(0, 15).forEach(a => {
  const tier = classify(a);
  md += `### #${a.rank} ${a.name} — score ${a.score} (${tier})\n\n`;
  md += `- **Role**: ${a.role || "—"} (${a.seniority || "—"})\n`;
  md += `- **Writes for**: ${(a.writesFor||[]).join(", ")}\n`;
  md += `- **Beats**: ${(a.beat||[]).join(", ")}\n`;
  md += `- **Certifications**: ${fmtCerts(a.certifications)}\n`;
  md += `- **Years in industry**: ${a.yearsInIndustry ?? "—"}\n`;
  md += `- **Reach**: ${fmtReach(a.mediaSignals)}\n`;
  md += `- **Quoted in Tier-1**: ${a.mediaSignals.quotedInTier1.join(", ") || "—"}\n`;
  md += `- **Contact**: ${[a.contact.linkedin && "LinkedIn", a.contact.email && "email", a.contact.twitter && "Twitter"].filter(Boolean).join(", ") || "—"}\n`;
  md += `- **Breakdown**: cred ${a.breakdown.credentials} / topic ${a.breakdown.onTopic} / reach ${a.breakdown.reach} / byline ${a.breakdown.byline} / approach ${a.breakdown.approachability} — penalty ${a.penalty}\n`;

  // Pitch angle
  const verified = a.certifications.some(c => c.verified);
  const onTopicBeat = (a.beat||[]).find(b => ["forex","cfd","broker-safety","regulation","trading-education"].includes(b));
  let pitch = "";
  if (verified && onTopicBeat) {
    pitch = `Review our ${onTopicBeat} broker content — "Reviewed and approved by ${a.name}, ${a.certifications[0].name}".`;
  } else if (verified) {
    pitch = `Expert reviewer on retail broker safety + regulation — your ${a.certifications[0].name} designation anchors the trust signal.`;
  } else if (a.seniority === "contributor" || a.seniority === "former") {
    pitch = `Masthead contributor slot — 1 review/month on your existing beat (${(a.beat||[]).slice(0,2).join("/")}).`;
  } else {
    pitch = `Mini-profile for author-of-record attribution + Schema.org sameAs link-building.`;
  }
  md += `- **Pitch angle**: ${pitch}\n\n`;
});
md += "\n---\n\n";

// Longlist condensed
md += `## Longlist (#51–${150}) — condensed\n\n`;
md += `${longlist.length} authors, sorted by score. Keep as backup / for niche-specific pairing.\n\n`;
md += "| # | Name | Score | Certs | Seniority | Top site |\n";
md += "|---|---|---|---|---|---|\n";
longlist.forEach(a => {
  md += `| ${a.rank} | ${a.name} | ${a.score} | ${fmtCerts(a.certifications)} | ${a.seniority||"—"} | ${(a.writesFor||[])[0] || "—"} |\n`;
});

md += "\n---\n\n";
md += "## Notes on methodology tradeoffs\n\n";
md += "1. **Celebrity penalty is deliberate.** Scott Melker (1M X), Lyn Alden (908K X), Whitney Webb (689K X) all drop out of top 50 by design — they get paid tens of thousands for a keynote, not for a broker review byline. If RatedBrokers pivots to a budget that can reach them, this cap should be lifted.\n\n";
md += "2. **Unverified cert claims** stay counted at 70% weight. The CFA Institute directory closed public lookup, so many legitimate CFA/CFP holders appear as `verified: false` in our data. Dropping them to 0 would over-penalise real credential holders.\n\n";
md += "3. **On-topic beat** beats generic personal-finance. A CFP who writes about retirement planning scores lower than a CMT who writes about forex — even though the CFP may be more prestigious in absolute terms. Right trade-off for *broker review* content specifically.\n\n";
md += "4. **Contact gate.** 42/50 top picks have LinkedIn. 9/50 have public email. Outreach Wave 1 should lead with LinkedIn InMail + Muck Rack profile mentions; cold email is secondary.\n\n";
md += "5. **What's not measured yet**: actual price (compensation expectations), conflict-of-interest (already advising a broker?), current availability. All three need manual triage per candidate before outreach.\n";

fs.writeFileSync(OUTPUT, md);
console.log(`[s11b] Written ${path.relative(root, OUTPUT)} (${md.length.toLocaleString()} chars)`);
console.log(`[s11b] Tiers:`);
for (const [tier, list] of Object.entries(tiers)) {
  console.log(`  ${tier}: ${list.length}`);
}

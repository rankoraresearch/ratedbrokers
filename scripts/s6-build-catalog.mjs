// S6: build the deliverable catalog of 580 authors.
//
// Outputs (all in repo root):
//   AUTHORS-CATALOG.md          — main index + Tier-S full blocks (outreach targets)
//   AUTHORS-CATALOG-TIER-A.md   — Tier-A full blocks (secondary targets)
//   AUTHORS-CATALOG-TIER-BC.md  — Tier-B/C condensed tables (bulk)
//   AUTHORS-CATALOG-DATA.csv    — every author, every field (machine-readable)
//
// Inputs: src/data/authorsSample.js (canonical store, post-S4 triage).
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const samplePath = path.resolve(root, "src/data/authorsSample.js");

const m = await import(samplePath);
const SITES = m.SITES;
const AUTHORS = m.AUTHORS.filter(Boolean);

// Enrich with computed fields
const enriched = AUTHORS.map((a) => {
  const outlet = SITES[a.site] || {};
  const baseScore = m.calcAuthorScore(a);
  const authScore = m.calcAuthoritativeness(a);
  const finalScore = m.calcFinalScore(a);
  const eeatTier = m.deriveEEATTier(authScore);
  return {
    ...a,
    baseScore,
    authScore,
    finalScore,
    eeatTier,
    outletName: outlet.name || a.site,
    outletDR: outlet.dr || 0,
    outletTier: outlet.tier || "T4",
    outletUrl: outlet.url || "",
    competitorBacklinks: outlet.competitorBacklinks?.refdomains || 0,
  };
});

// Sort: tier desc (S→A→B→C), then finalScore desc
const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
enriched.sort(
  (a, b) =>
    tierOrder[a.eeatTier] - tierOrder[b.eeatTier] ||
    b.finalScore - a.finalScore,
);

const tierS = enriched.filter((a) => a.eeatTier === "S");
const tierA = enriched.filter((a) => a.eeatTier === "A");
const tierB = enriched.filter((a) => a.eeatTier === "B");
const tierC = enriched.filter((a) => a.eeatTier === "C");

// ============================================================
// HELPERS
// ============================================================
const esc = (s) => (s == null ? "" : String(s).replace(/\|/g, "\\|").replace(/\n/g, " "));
const csvEsc = (s) => {
  if (s == null) return "";
  const v = String(s);
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
};
const fmtList = (arr, joiner = ", ") => (Array.isArray(arr) && arr.length ? arr.join(joiner) : "—");
const link = (label, href) => (href ? `[${label}](${href})` : "—");
const bool = (v) => (v ? "✓" : "—");

function fullBlock(a, idx) {
  const lines = [];
  lines.push(``);
  lines.push(`### ${idx}. ${a.name} <span style="opacity:0.55">— ${a.role}</span>`);
  lines.push(``);

  // Header line
  const tierBadge = `**Tier ${a.eeatTier}**`;
  const scoreBadge = `Final Score: **${a.finalScore}** (base ${a.baseScore} × auth +${a.authScore})`;
  lines.push(`> ${tierBadge} · ${scoreBadge} · Outlet: **${a.outletName}** (${a.outletTier}, DR ${a.outletDR})`);
  lines.push(``);

  // Bio
  if (a.bio) {
    lines.push(a.bio);
    lines.push(``);
  }

  // Identity & contacts
  lines.push("**Identity & Contacts**");
  lines.push("");
  lines.push(`- Role: ${a.role || "—"} (${a.seniority || "—"})`);
  if (a.location) lines.push(`- Location: ${a.location}`);
  if (a.yearsInIndustry) lines.push(`- Years in industry: **${a.yearsInIndustry}**`);
  lines.push(`- LinkedIn: ${link(a.linkedin || "—", a.linkedin)}`);
  lines.push(`- Twitter/X: ${link(a.twitter || "—", a.twitter)}`);
  lines.push(`- Muck Rack: ${link(a.muckrack || "—", a.muckrack)}`);
  lines.push(`- Personal site: ${link(a.personalSite || a.trustSignals?.ownedDomain || "—", a.personalSite || a.trustSignals?.ownedDomain)}`);
  lines.push(`- Author URL on outlet: ${link(a.authorUrl || "—", a.authorUrl)}`);
  lines.push(`- Email: ${a.email ? `\`${a.email}\`${a.emailVerified ? " (verified)" : ""}` : "—"}`);
  if (a.needsManualReview) lines.push(`- ⚠ **Needs manual review** (sparse signals or ambiguous identity)`);
  lines.push("");

  // Credentials & education
  if (a.credentials?.length || a.certifications?.length || a.education?.length) {
    lines.push("**Credentials & Education**");
    lines.push("");
    if (a.credentials?.length) lines.push(`- Credentials (claimed): ${fmtList(a.credentials)}`);
    if (a.certifications?.length) {
      lines.push(`- Certifications:`);
      a.certifications.forEach((c) => {
        const v = c.verified ? "✓ verified" : "unverified";
        const iss = c.issuer ? ` — ${c.issuer}` : "";
        const url = c.verifyUrl ? ` ([registry](${c.verifyUrl}))` : "";
        lines.push(`  - **${c.name}**${iss} (${v})${url}`);
      });
    }
    if (a.education?.length) {
      lines.push(`- Education:`);
      a.education.forEach((e) => {
        const yr = e.year ? `, ${e.year}` : "";
        lines.push(`  - ${e.degree || "—"}, ${e.school || "—"}${yr}`);
      });
    }
    lines.push("");
  }

  // Employment history
  if (a.employmentHistory?.length) {
    lines.push("**Employment History**");
    lines.push("");
    a.employmentHistory.forEach((e) => {
      lines.push(`- ${e.role || "—"} @ ${e.org || "—"}${e.years ? ` (${e.years})` : ""}`);
    });
    lines.push("");
  }

  // Media signals
  const ms = a.mediaSignals || {};
  if (
    ms.quotedInTier1?.length ||
    ms.tvAppearances?.length ||
    ms.authoredBooks?.length ||
    ms.muckrackArticleCount ||
    ms.hasKnowledgePanel ||
    ms.industryAwards?.length
  ) {
    lines.push("**Media Signals**");
    lines.push("");
    if (ms.quotedInTier1?.length) lines.push(`- Quoted in tier-1 press: ${fmtList(ms.quotedInTier1)}`);
    if (ms.tvAppearances?.length) lines.push(`- TV appearances: ${fmtList(ms.tvAppearances)}`);
    if (ms.authoredBooks?.length) {
      lines.push(`- Authored books:`);
      ms.authoredBooks.forEach((b) => lines.push(`  - ${b}`));
    }
    if (ms.industryAwards?.length) {
      lines.push(`- Industry awards:`);
      ms.industryAwards.forEach((aw) => {
        if (typeof aw === "string") lines.push(`  - ${aw}`);
        else lines.push(`  - ${aw.name}${aw.year ? ` (${aw.year})` : ""}${aw.source ? ` — ${aw.source}` : ""}`);
      });
    }
    if (ms.muckrackArticleCount) lines.push(`- Muck Rack article count: ${ms.muckrackArticleCount}`);
    if (ms.hasKnowledgePanel) lines.push(`- Has Google Knowledge Panel: ✓`);
    if (ms.scholarUrl) lines.push(`- Google Scholar: [${ms.hIndex ? `h-index ${ms.hIndex}` : "profile"}](${ms.scholarUrl})`);
    lines.push("");
  }

  // Trust signals
  const ts = a.trustSignals || {};
  if (ts.ownedDomain || ts.linkedinVerified || ts.finraBrokerCheckStatus || ts.crd) {
    lines.push("**Trust Signals**");
    lines.push("");
    if (ts.ownedDomain) lines.push(`- Owned domain: ${ts.ownedDomain}`);
    if (ts.linkedinVerified) lines.push(`- LinkedIn verified: ✓`);
    if (ts.finraBrokerCheckStatus) lines.push(`- FINRA BrokerCheck: **${ts.finraBrokerCheckStatus}**${ts.crd ? ` (CRD ${ts.crd})` : ""}`);
    lines.push("");
  }

  // Beats & outlets
  lines.push("**Beats & Outlets**");
  lines.push("");
  lines.push(`- Beats: ${fmtList(a.beat)}`);
  lines.push(`- Writes for: ${fmtList(a.writesFor || [a.site])}${(a.writesFor?.length || 1) > 1 ? " (multi-outlet)" : ""}`);
  if (a.competitorBacklinks >= 3) {
    lines.push(`- 🔥 Outlet receives backlinks from **${a.competitorBacklinks}** of our competitors`);
  }
  lines.push(`- Outlet: [${a.outletName}](${a.outletUrl}) (${a.outletTier} · DR ${a.outletDR})`);
  lines.push(`- Status: ${a.status || a.seniority || "active"}`);
  lines.push(`- Discovery method: ${a.discoveryMethod || "—"}`);
  lines.push("");

  // Notes
  if (a.notes || a.discoveryNote) {
    lines.push("**Internal Notes**");
    lines.push("");
    lines.push(`> ${a.notes || a.discoveryNote}`);
    lines.push("");
  }

  return lines.join("\n");
}

function condensedRow(a, idx) {
  const certs = (a.certifications || []).map((c) => c.name).filter(Boolean).join("/") || (a.credentials || []).filter(Boolean).join("/") || "—";
  const linkedin = a.linkedin ? `[in](${a.linkedin})` : "—";
  const tw = a.twitter ? `[x](${a.twitter})` : "—";
  const mr = a.muckrack ? `[mr](${a.muckrack})` : "—";
  const social = [linkedin, tw, mr].filter((x) => x !== "—").join(" ");
  const flag = a.needsManualReview ? " ⚠" : "";
  return `| ${idx} | ${esc(a.name)}${flag} | ${esc(a.outletName)} | ${a.outletTier} | ${a.eeatTier} | ${a.finalScore} | ${esc(a.role).slice(0, 45)} | ${esc(certs).slice(0, 25)} | ${a.yearsInIndustry || "—"} | ${social || "—"} |`;
}

// ============================================================
// MAIN INDEX (AUTHORS-CATALOG.md)
// ============================================================
const main = [];
main.push(`# Authors Catalog — RatedBrokers Outreach Map`);
main.push(``);
main.push(`*Generated ${new Date().toISOString().split("T")[0]} from \`src/data/authorsSample.js\` (post-S4 triage).*`);
main.push(``);
main.push(`Single-source-of-truth catalog of all **${enriched.length} authors** harvested across **${Object.keys(SITES).length} outlets** for outreach + parasite-SEO.`);
main.push(``);
main.push(`## Files in this catalog`);
main.push(``);
main.push(`| File | What's in it |`);
main.push(`|---|---|`);
main.push(`| **AUTHORS-CATALOG.md** (this file) | Index, summary stats, plus every Tier-S author in full detail |`);
main.push(`| AUTHORS-CATALOG-TIER-A.md | Every Tier-A author in full detail |`);
main.push(`| AUTHORS-CATALOG-TIER-BC.md | Tier-B and Tier-C in condensed table form |`);
main.push(`| AUTHORS-CATALOG-DATA.csv | Machine-readable: every author, every field |`);
main.push(`| MANUAL-REVIEW-TRIAGE.md | 67 authors that still need Егор's manual verification |`);
main.push(``);

// Summary stats
main.push(`## Summary stats`);
main.push(``);
main.push(`| Tier | Count | What it means | Outreach priority |`);
main.push(`|---|---|---|---|`);
main.push(`| **S** | ${tierS.length} | Unfakeable signals: certifications + tier-1 press + books or awards | **Wave 1** — first emails go here |`);
main.push(`| **A** | ${tierA.length} | Strong: at least 2 of (cert, book, multi-outlet, tier-1 press, ≥10y experience) | **Wave 2** — after Wave 1 responds |`);
main.push(`| **B** | ${tierB.length} | Moderate: solid byline + LinkedIn or Muck Rack | Wave 3 — bulk outreach later |`);
main.push(`| **C** | ${tierC.length} | Light: limited external signals beyond outlet byline | Skip for now (or hold for category gaps) |`);
main.push(`| Total | ${enriched.length} | | |`);
main.push(``);

// Coverage
main.push(`## External-signal coverage`);
main.push(``);
const cov = (pred) => `${enriched.filter(pred).length} / ${enriched.length} (${Math.round((enriched.filter(pred).length / enriched.length) * 100)}%)`;
main.push(`- LinkedIn: ${cov((a) => a.linkedin)}`);
main.push(`- Twitter/X: ${cov((a) => a.twitter)}`);
main.push(`- Muck Rack: ${cov((a) => a.muckrack)}`);
main.push(`- Personal/own domain: ${cov((a) => a.personalSite || a.trustSignals?.ownedDomain)}`);
main.push(`- Email captured: ${cov((a) => a.email)}`);
main.push(`- Has certifications: ${cov((a) => a.certifications?.length > 0)}`);
main.push(`- Authored books: ${cov((a) => a.mediaSignals?.authoredBooks?.length > 0)}`);
main.push(`- Quoted in tier-1 press: ${cov((a) => a.mediaSignals?.quotedInTier1?.length > 0)}`);
main.push(`- TV appearances: ${cov((a) => a.mediaSignals?.tvAppearances?.length > 0)}`);
main.push(`- Multi-outlet (cross-writers): ${cov((a) => (a.writesFor?.length || 1) > 1)}`);
main.push(`- Still flagged needsManualReview: ${cov((a) => a.needsManualReview)}`);
main.push(``);

// Score formula reminder
main.push(`## Score formula`);
main.push(``);
main.push(`\`finalScore = baseScore × (1 + authoritativeness/100)\``);
main.push(``);
main.push(`- **Base** (0-100): outletDR × 0.35 + badge + seniority + LinkedIn + MuckRack + Twitter + email + certs × 4 + multi-outlet + competitor-linked outlet`);
main.push(`- **Authoritativeness** (0-50): certs × 8 + years (cap 10) + tier-1 press × 3 + TV (cap 6) + books +5 + own domain +3 + multi-outlet +3 each + FINRA clean +5 (former: -5)`);
main.push(`- **E-E-A-T tier**: S ≥ 40 auth · A ≥ 25 · B ≥ 12 · C < 12`);
main.push(``);

// Top-30 outreach board
main.push(`## Top 30 outreach board`);
main.push(``);
main.push(`Snapshot ranked by finalScore. Full detail blocks below.`);
main.push(``);
main.push(`| # | Name | Outlet | Tier | Score | Cert / Book hook |`);
main.push(`|---|---|---|---|---|---|`);
enriched.slice(0, 30).forEach((a, i) => {
  const certs = (a.certifications || []).map((c) => c.name).filter(Boolean).join(", ") || (a.credentials || []).filter(Boolean).join(", ") || "";
  const books = a.mediaSignals?.authoredBooks?.length ? `📚 ${a.mediaSignals.authoredBooks.length} books` : "";
  const tv = a.mediaSignals?.tvAppearances?.length ? `📺 ${a.mediaSignals.tvAppearances.length}` : "";
  const hook = [certs, books, tv].filter(Boolean).join(" · ");
  main.push(`| ${i + 1} | **${esc(a.name)}** | ${esc(a.outletName)} | ${a.eeatTier} | ${a.finalScore} | ${esc(hook).slice(0, 60) || "—"} |`);
});
main.push(``);

// Tier-S full blocks
main.push(`---`);
main.push(``);
main.push(`# Tier S — ${tierS.length} authors (full detail)`);
main.push(``);
main.push(`These are our **Wave 1 outreach targets**. Highest authoritativeness — verifiable certifications, tier-1 press, books or awards. The names here move the needle when "Reviewed by" appears next to them.`);
main.push(``);
tierS.forEach((a, i) => main.push(fullBlock(a, i + 1)));
main.push(``);

fs.writeFileSync(path.resolve(root, "AUTHORS-CATALOG.md"), main.join("\n"));

// ============================================================
// TIER-A (AUTHORS-CATALOG-TIER-A.md)
// ============================================================
const ma = [];
ma.push(`# Authors Catalog — Tier A (${tierA.length} authors)`);
ma.push(``);
ma.push(`Wave 2 outreach targets. Strong but lighter signals than Tier-S. See AUTHORS-CATALOG.md for context.`);
ma.push(``);
tierA.forEach((a, i) => ma.push(fullBlock(a, i + 1)));
fs.writeFileSync(path.resolve(root, "AUTHORS-CATALOG-TIER-A.md"), ma.join("\n"));

// ============================================================
// TIER-B/C (AUTHORS-CATALOG-TIER-BC.md)
// ============================================================
const mbc = [];
mbc.push(`# Authors Catalog — Tier B + C (${tierB.length + tierC.length} authors)`);
mbc.push(``);
mbc.push(`Bulk tier — condensed table for screening. ⚠ = still flagged for manual review.`);
mbc.push(``);
mbc.push(`## Tier B — ${tierB.length} authors`);
mbc.push(``);
mbc.push(`| # | Name | Outlet | OutletTier | EEAT | Score | Role | Certs | Years | Social |`);
mbc.push(`|---|---|---|---|---|---|---|---|---|---|`);
tierB.forEach((a, i) => mbc.push(condensedRow(a, i + 1)));
mbc.push(``);
mbc.push(`## Tier C — ${tierC.length} authors`);
mbc.push(``);
mbc.push(`| # | Name | Outlet | OutletTier | EEAT | Score | Role | Certs | Years | Social |`);
mbc.push(`|---|---|---|---|---|---|---|---|---|---|`);
tierC.forEach((a, i) => mbc.push(condensedRow(a, i + 1)));
fs.writeFileSync(path.resolve(root, "AUTHORS-CATALOG-TIER-BC.md"), mbc.join("\n"));

// ============================================================
// CSV (AUTHORS-CATALOG-DATA.csv) — full data
// ============================================================
const cols = [
  "id", "name", "tier", "finalScore", "baseScore", "authScore",
  "role", "seniority", "status", "needsManualReview",
  "outletName", "outletSlug", "outletTier", "outletDR", "competitorBacklinks",
  "writesForCount", "writesFor", "beats",
  "credentials", "certifications", "certificationsVerified",
  "education", "yearsInIndustry", "location",
  "linkedin", "twitter", "muckrack", "personalSite", "authorUrl", "email", "emailVerified",
  "quotedInTier1", "tvAppearances", "authoredBooks", "industryAwards",
  "muckrackArticleCount", "hasKnowledgePanel",
  "ownedDomain", "finraBrokerCheckStatus",
  "discoveryMethod", "notes", "bio",
];
const csv = [cols.join(",")];
for (const a of enriched) {
  const ms = a.mediaSignals || {};
  const ts = a.trustSignals || {};
  const certNames = (a.certifications || []).map((c) => c.name).join("; ");
  const certVerified = (a.certifications || []).map((c) => c.verified ? "y" : "n").join("; ");
  const eduStr = (a.education || []).map((e) => `${e.degree || ""}@${e.school || ""}${e.year ? "(" + e.year + ")" : ""}`).join("; ");
  const awardsStr = (ms.industryAwards || []).map((aw) => typeof aw === "string" ? aw : `${aw.name}${aw.year ? "(" + aw.year + ")" : ""}`).join("; ");
  const row = [
    a.id, a.name, a.eeatTier, a.finalScore, a.baseScore, a.authScore,
    a.role, a.seniority || "", a.status || "", a.needsManualReview ? "y" : "",
    a.outletName, a.site, a.outletTier, a.outletDR, a.competitorBacklinks,
    (a.writesFor || [a.site]).length, (a.writesFor || [a.site]).join("; "), (a.beat || []).join("; "),
    (a.credentials || []).join("; "), certNames, certVerified,
    eduStr, a.yearsInIndustry || "", a.location || "",
    a.linkedin || "", a.twitter || "", a.muckrack || "", a.personalSite || "", a.authorUrl || "", a.email || "", a.emailVerified ? "y" : "",
    (ms.quotedInTier1 || []).join("; "), (ms.tvAppearances || []).join("; "), (ms.authoredBooks || []).join("; "), awardsStr,
    ms.muckrackArticleCount || "", ms.hasKnowledgePanel ? "y" : "",
    ts.ownedDomain || "", ts.finraBrokerCheckStatus || "",
    a.discoveryMethod || "", a.notes || a.discoveryNote || "", (a.bio || "").slice(0, 800),
  ].map(csvEsc);
  csv.push(row.join(","));
}
fs.writeFileSync(path.resolve(root, "AUTHORS-CATALOG-DATA.csv"), csv.join("\n"));

// ============================================================
// REPORT
// ============================================================
console.log("Catalog generated:");
console.log(`  AUTHORS-CATALOG.md          (${main.length} lines, includes ${tierS.length} Tier-S full blocks + 30-row outreach board)`);
console.log(`  AUTHORS-CATALOG-TIER-A.md   (${ma.length} lines, ${tierA.length} Tier-A full blocks)`);
console.log(`  AUTHORS-CATALOG-TIER-BC.md  (${mbc.length} lines, ${tierB.length + tierC.length} authors condensed)`);
console.log(`  AUTHORS-CATALOG-DATA.csv    (${csv.length} rows incl. header)`);
console.log(``);
console.log(`Tier breakdown: S=${tierS.length} A=${tierA.length} B=${tierB.length} C=${tierC.length} (total ${enriched.length})`);

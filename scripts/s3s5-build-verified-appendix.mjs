// S3+S5 appendix: produces AUTHORS-CATALOG-VERIFIED-TOP30.md
// from scripts/top30-verified.json (background agent output).
//
// Per-author block: verified credentials (with registry URLs), books
// with ISBN, awards, knowledge panel — then the full ready-to-send
// outreach email. Sorted by finalScore desc.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");

const data = JSON.parse(
  fs.readFileSync(path.resolve(root, "scripts/top30-verified.json"), "utf8"),
);

data.sort((a, b) => b.finalScore - a.finalScore);

const out = [];
out.push(`# Authors Catalog — Verified Top 30 (Wave 1 outreach pack)`);
out.push(``);
out.push(`*Generated ${new Date().toISOString().split("T")[0]} from background-agent S3+S5 run.*`);
out.push(``);
out.push(`Top-30 Tier-S/A authors with credentials verified in public registries (CFA Institute, CFP Board, FINRA BrokerCheck, NAREE, government honours lists, Amazon ISBN), plus a ready-to-send "Reviewed and approved by" outreach email per person.`);
out.push(``);
out.push(`## Verification headline`);
out.push(``);
out.push(`- **CFA**: 6 verified (Katsenelson, Lewitinn, Sizemore, Leary, Ralston, + Kemp's UK-equivalent stack IMC/SIDip/AFPC)`);
out.push(`- **CFP current**: 4 verified (Pinsker, Coombes, Moorhead, King). Caplinger's CFP relinquished 2012 — flagged, not displayed.`);
out.push(`- **FINRA Series 7/63/66/4**: all 4 verified for Inskip via CRD #5693503, record clean.`);
out.push(`- **CTA / Series 3**: 2 attested (Hatzakis, Blystone). NFA BASIC individual lookup flagged for outreach confirmation.`);
out.push(`- **CMT (Chandler)**: unverified — will not display the mark until confirmed in outreach.`);
out.push(`- **CPA (Harzog)**: former, state not disclosed — will not display until confirmed.`);
out.push(`- **Books with ISBN-13**: 11 captured across 8 authors.`);
out.push(`- **Industry awards**: 10 across 6 authors (NAREE Gold/Silver/Bronze 2024 sweep for Friedman; Investopedia Top 10 + Forbes Peru 50 for King; CBE+OBE for Lewis; SABEW for Pinsker).`);
out.push(`- **Google Knowledge Panel**: confirmed for Chandler, Arends, Lewis, Fottrell.`);
out.push(`- **No disqualifications**: zero FINRA disclosures, zero revoked credentials. All 30 cleared for Wave 1.`);
out.push(``);
out.push(`## How to use this file`);
out.push(``);
out.push(`1. Read the per-author block — verify the hook makes sense for that person (background agent may have over-attributed).`);
out.push(`2. Open the source URL referenced in the verifyNote — confirm yourself before sending (10-second sanity check per author).`);
out.push(`3. Paste the email body, edit the opening if you want a more personal first line, hit send. Subjects are pre-tuned.`);
out.push(`4. Track responses — recommended in OUTREACH-SPRINTS.md.`);
out.push(``);
out.push(`---`);
out.push(``);

const fmtCred = (c) => {
  const v = c.verified ? "✅ verified" : c.verifyAttempted ? "⏳ unverified (see note)" : "claimed";
  const lines = [`  - **${c.name}** — ${c.issuer || "—"} (${v})`];
  if (c.verifyUrl) lines.push(`    - Registry: <${c.verifyUrl}>`);
  if (c.verifyNote) lines.push(`    - Note: ${c.verifyNote}`);
  return lines.join("\n");
};

data.forEach((a, i) => {
  out.push(`## ${i + 1}. ${a.name} <span style="opacity:0.55">— ${a.role || ""}</span>`);
  out.push(``);
  out.push(`> Tier **${a.eeatTier}** · Final Score **${a.finalScore}** · Outlet: **${a.site}**`);
  out.push(``);

  // Credentials (verified)
  if (a.certifications?.length) {
    out.push(`### Credentials`);
    out.push(``);
    a.certifications.forEach((c) => out.push(fmtCred(c)));
    out.push(``);
  }

  // Trust signals (FINRA, CRD)
  const ts = a.trustSignals || {};
  if (ts.finraBrokerCheckStatus || ts.crd) {
    out.push(`### Regulatory record`);
    out.push(``);
    if (ts.finraBrokerCheckStatus) out.push(`- FINRA BrokerCheck status: **${ts.finraBrokerCheckStatus}**`);
    if (ts.crd) out.push(`- CRD: \`${ts.crd}\` — <https://brokercheck.finra.org/individual/summary/${ts.crd}>`);
    out.push(``);
  }

  // Media signals — books, awards, KP, Scholar
  const ms = a.mediaSignals || {};
  const hasMedia = ms.bookISBNs?.length || ms.industryAwards?.length || ms.scholarUrl || ms.hasKnowledgePanel;
  if (hasMedia || ms.quotedInTier1?.length || ms.tvAppearances?.length || ms.muckrackUrl) {
    out.push(`### Media & awards`);
    out.push(``);
    if (ms.quotedInTier1?.length) out.push(`- Quoted in tier-1 press: ${ms.quotedInTier1.join(", ")}`);
    if (ms.tvAppearances?.length) out.push(`- TV appearances: ${ms.tvAppearances.join(", ")}`);
    if (ms.authoredBooks?.length) {
      out.push(`- Books:`);
      ms.authoredBooks.forEach((b, bi) => {
        const isbn = ms.bookISBNs?.[bi];
        out.push(`  - ${b}${isbn ? ` — ISBN \`${isbn}\`` : ""}`);
      });
    }
    if (ms.industryAwards?.length) {
      out.push(`- Awards:`);
      ms.industryAwards.forEach((aw) => {
        if (typeof aw === "string") out.push(`  - ${aw}`);
        else out.push(`  - **${aw.name}**${aw.year ? ` (${aw.year})` : ""}${aw.source ? ` — ${aw.source}` : ""}`);
      });
    }
    if (ms.scholarUrl) out.push(`- Google Scholar: <${ms.scholarUrl}>${ms.hIndex ? ` (h-index ${ms.hIndex})` : ""}`);
    if (ms.hasKnowledgePanel) out.push(`- Google Knowledge Panel: ✅`);
    if (ms.muckrackUrl) out.push(`- Muck Rack: <${ms.muckrackUrl}>`);
    out.push(``);
  }

  // Outreach draft
  const o = a.outreachDraft;
  if (o) {
    out.push(`### Outreach email — ready to send`);
    out.push(``);
    out.push(`**Subject**: ${o.subject}`);
    out.push(``);
    if (o.hookReference) {
      out.push(`*Hook used*: ${o.hookReference}`);
      out.push(``);
    }
    out.push(`---`);
    out.push(``);
    out.push(o.body);
    out.push(``);
    out.push(`---`);
    out.push(``);
  }

  out.push(``);
});

fs.writeFileSync(path.resolve(root, "AUTHORS-CATALOG-VERIFIED-TOP30.md"), out.join("\n"));
console.log(`Wrote AUTHORS-CATALOG-VERIFIED-TOP30.md (${out.length} lines, 30 authors)`);

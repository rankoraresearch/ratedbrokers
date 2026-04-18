import { QuickAnswerBox, ProsCons, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import RegBadge from "../../components/RegBadge";
import { getRegulatorByName } from "../../data/regulators";
import { ExternalLink } from "lucide-react";

const NAVY = "#0f172a";
const GREEN = "#059669";
const ORANGE = "#f59e0b";
const GRAY_MUTED = "#64748b";
const GRAY_TEXT = "#374151";
const BORDER = "#e8ecf1";

export default function RegulationTab({ data, slug, mob }) {
  const { B, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.regulation || {};
  const regs = B.regs || [];
  const tier1Regs = regs.filter(r => r.tier === 1);

  const safetyVerdict = tier1Regs.length > 0 ? "Yes" : "Caution";
  const quickAnswer = sp.quick_answer || (tier1Regs.length > 0
    ? `Yes, ${B.name} is safe. Regulated by ${regs.length} financial authorit${regs.length > 1 ? "ies" : "y"} including ${tier1Regs.map(r => `${r.name} (${r.country})`).join(" and ")}. Client funds are held in segregated accounts with negative balance protection.`
    : `Caution. ${B.name} is regulated by ${regs.map(r => `${r.name} (${r.country})`).join(", ")} only. No Tier-1 regulatory license (FCA, ASIC, CySEC, or equivalent).`);
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || [
    ...tier1Regs.map(r => `${r.name} (${r.country}) — Tier-1 regulation`),
    "Client funds segregated",
  ];
  const cons = sp.cons || regs.filter(r => r.tier >= 3).map(r => `${r.name} (${r.country}) — weaker Tier-${r.tier} oversight`);

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      {pros.length > 0 && cons.length > 0 && <ProsCons pros={pros.slice(0, 4)} cons={cons.length > 0 ? cons.slice(0, 4) : ["No significant regulatory concerns"]} mob={mob} />}

      <H2>{B.name} Regulatory Licenses</H2>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : regs.length >= 3 ? "1fr 1fr 1fr" : `repeat(${regs.length}, 1fr)`, gap: 14, marginBottom: 20 }}>
        {regs.map((r, i) => {
          const accent = r.tier === 1 ? "#047857" : r.tier === 2 ? "#b45309" : GRAY_MUTED;
          return (
            <Card key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${accent}`, textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tier {r.tier}</div>
              <RegBadge reg={r.name} />
              <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 8, fontFamily: "Outfit" }}>{r.name}</div>
              <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{r.country}</div>
              {(() => { const regData = getRegulatorByName(r.name); const licenseUrl = regData?.licenseCheck; return licenseUrl ? <a href={licenseUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: accent, marginTop: 8, fontFamily: "'JetBrains Mono',monospace", textDecoration: "none", padding: "3px 10px", borderRadius: 6, background: "#f8fafc", border: `1px solid ${BORDER}`, transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#94a3b8"; }} onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = BORDER; }}>License: {r.num} <ExternalLink size={11} style={{ opacity: 0.7 }} /></a> : <div style={{ fontSize: 12, color: GRAY_MUTED, marginTop: 8, fontFamily: "'JetBrains Mono',monospace" }}>License: {r.num}</div>; })()}
            </Card>
          );
        })}
      </div>

      <CTAInline slug={slug} name={B.name} promo={B.promo} label="Trade with Regulated Broker" sub={`${tier1Regs.map(r => r.name).join(" + ")} regulation`} mob={mob} />

      <H2>Investor Protection & Fund Safety</H2>
      <P>{B.name} {tier1Regs.length > 0 ? "is required to hold client funds in segregated accounts, separate from company operating funds." : "holds client funds according to the requirements of its regulatory jurisdictions."} {B.name} was founded in {B.year}{B.hq ? ` in ${B.hq}` : ""}, offering {B.type} execution with {B.instruments} instruments.</P>

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("regulated") || f.q.toLowerCase().includes("safe") || f.q.toLowerCase().includes("regulation") || f.q.toLowerCase().includes("license")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("regulated") || f.q.toLowerCase().includes("safe") || f.q.toLowerCase().includes("regulation") || f.q.toLowerCase().includes("license")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `Is ${B.name} Safe? Our Verdict`}
        text={sp.verdict_text || `${B.name} holds ${regs.length} regulatory license${regs.length > 1 ? "s" : ""}${tier1Regs.length > 0 ? ` including ${tier1Regs.length} Tier-1 regulator${tier1Regs.length > 1 ? "s" : ""} (${tier1Regs.map(r => r.name).join(", ")})` : ""}. Client fund segregation provides additional safety.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

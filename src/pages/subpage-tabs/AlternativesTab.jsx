import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, HelpCircle } from "lucide-react";
import { QuickAnswerBox, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import BrokerLogo from "../../components/BrokerLogo";
import ScoreBadge from "../../components/ScoreBadge";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const ORANGE = "#f59e0b";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";
const GRAY_LIGHT = "#f8f9fb";
const BORDER = "#e8ecf1";

export default function AlternativesTab({ data, slug, mob }) {
  const { B, SIMILAR, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.alternatives || {};

  const quickAnswer = sp.quick_answer || `The best alternatives to ${B.name} include ${SIMILAR.slice(0, 3).map(s => s.name).join(", ")}. All offer competitive ${B.type.toLowerCase().includes("ecn") ? "ECN" : ""} trading conditions.`;

  return (
    <>
      <QuickAnswerBox text={quickAnswer} />

      {SIMILAR.length > 0 && (
        <>
          <H2>Quick Comparison</H2>
          <DataTable
            headers={["Broker", "Score", "Spread", "Type"]}
            rows={[
              [B.name, String(B.score), `${B.spread} pips`, B.type],
              ...SIMILAR.map(a => [a.name, String(a.score), `${a.spread} pips`, a.type]),
            ]}
            highlightFirst
            mob={mob}
          />
        </>
      )}

      <H2>Why Look for {B.name} Alternatives?</H2>
      <P>{B.name} is an excellent broker, but it's not perfect for everyone. Common reasons to consider alternatives: different regulatory preferences, lower minimum deposits, or specific platform requirements.</P>

      {SIMILAR.length > 0 && (
        <>
          <H2>Top Alternatives</H2>
          {SIMILAR.map((alt, i) => (
            <Card key={i} style={{ padding: mob ? 18 : 22, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: 14, marginBottom: 12, flexDirection: mob ? "column" : "row" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={44} shape="icon" borderRadius={10} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, fontFamily: "Outfit" }}>{alt.name}</div>
                    <div style={{ fontSize: 12, color: GRAY_MUTED }}>{alt.type} · From {alt.spread} pips</div>
                  </div>
                </div>
                <ScoreBadge score={alt.score} size="md" />
              </div>
              <P>{alt.why}</P>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={`${import.meta.env.VITE_API_URL || ''}/go/${alt.slug}`} target="_blank" rel="nofollow sponsored" className="cta-primary" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Visit {alt.name} <ExternalLink size={12} /></a>
                <Link to={`/review/${alt.slug}`} className="cta-secondary" style={{ background: "#fff", color: GREEN, border: `2px solid ${GREEN}`, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>Read Review <ArrowRight size={12} /></Link>
              </div>
            </Card>
          ))}
        </>
      )}

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("alternative") || f.q.toLowerCase().includes("better") || f.q.toLowerCase().includes("vs") || f.q.toLowerCase().includes("compare")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("alternative") || f.q.toLowerCase().includes("better") || f.q.toLowerCase().includes("vs") || f.q.toLowerCase().includes("compare")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Alternatives — Verdict`}
        text={sp.verdict_text || `${B.name} is a top-rated broker, but alternatives like ${SIMILAR.slice(0, 2).map(s => s.name).join(" and ")} serve specific needs. Choose based on your priorities: cost, regulation, education, or minimum deposit.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

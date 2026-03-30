import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { QuickAnswerBox, ProsCons, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import BrokerLogo from "../../components/BrokerLogo";

const NAVY = "#0f172a";
const GREEN = "#059669";
const ORANGE = "#f59e0b";
const RED = "#dc2626";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";
const BORDER = "#e8ecf1";

export default function BeginnersTab({ data, slug, mob }) {
  const { B, SCORES, PROS, CONS, FAQ, SIMILAR, SUBPAGES } = data;
  const sp = SUBPAGES?.beginners || {};

  /* Build beginner criteria from existing scores */
  const criteria = sp.criteria || SCORES.map(s => ({
    name: s.name,
    score: s.score,
    detail: s.detail,
  }));
  const avgScore = (criteria.reduce((a, c) => a + c.score, 0) / Math.max(criteria.length, 1)).toFixed(1);

  const quickAnswer = sp.quick_answer || `${B.name} scores ${avgScore}/10 overall. ${B.minDep <= 50 ? "Low minimum deposit makes it accessible for beginners." : `The $${B.minDep} minimum deposit may be a barrier for absolute beginners.`} ${B.type} execution with spreads from ${B.spread} pips.`;
  const tabScore = sp.tab_score || parseFloat(avgScore);
  const pros = sp.pros || PROS.slice(0, 4);
  const cons = sp.cons || CONS.slice(0, 4);

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      <ProsCons pros={pros} cons={cons} mob={mob} />

      <H2>Beginner-Friendliness Rating</H2>
      <Card>
        {criteria.map((c, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{c.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: c.score >= 8 ? GREEN : c.score >= 6 ? ORANGE : RED }}>{c.score}/10</span>
            </div>
            <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${c.score * 10}%`, background: c.score >= 8 ? `linear-gradient(90deg, ${GREEN}, #34d399)` : c.score >= 6 ? `linear-gradient(90deg, ${ORANGE}, #fbbf24)` : `linear-gradient(90deg, ${RED}, #f87171)`, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, color: GRAY_MUTED }}>{c.detail}</div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 800, color: NAVY }}>Overall Score</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, color: parseFloat(avgScore) >= 8 ? GREEN : ORANGE }}>{avgScore}/10</span>
        </div>
      </Card>

      <CTAInline slug={slug} name={B.name} promo={B.promo} label="Open Demo Account Free" sub="Practice with virtual funds — no deposit required" mob={mob} />

      {SIMILAR.length > 0 && (
        <>
          <H2>Alternatives for Beginners</H2>
          <P>If you're a complete beginner, these brokers may also suit you:</P>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : `repeat(${Math.min(SIMILAR.length, 3)}, 1fr)`, gap: 14, marginBottom: 20 }}>
            {SIMILAR.slice(0, 3).map((alt, i) => (
              <Card key={i} style={{ padding: 18, textAlign: "center" }}>
                <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={48} shape="icon" borderRadius={10} />
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 8 }}>{alt.name}</div>
                <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginBottom: 8 }}>Score: {alt.score}/10</div>
                <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.5, marginBottom: 12 }}>{alt.why}</div>
                <a href={`${import.meta.env.VITE_API_URL || ''}/go/${alt.slug}`} target="_blank" rel="nofollow sponsored" className="cta-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8 }}>Visit {alt.name} <ExternalLink size={12} /></a>
              </Card>
            ))}
          </div>
        </>
      )}

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("beginner") || f.q.toLowerCase().includes("start") || f.q.toLowerCase().includes("demo") || f.q.toLowerCase().includes("learn")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("beginner") || f.q.toLowerCase().includes("start") || f.q.toLowerCase().includes("demo") || f.q.toLowerCase().includes("learn")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} for Beginners — Verdict`}
        text={sp.verdict_text || `${B.name} scores ${avgScore}/10 overall. ${B.minDep <= 50 ? "The low minimum deposit makes it accessible." : `The $${B.minDep} minimum deposit may be a barrier.`} We recommend starting with a demo account to practice before committing funds.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

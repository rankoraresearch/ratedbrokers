import { QuickAnswerBox, ProsCons, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import { MonitorSmartphone } from "lucide-react";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";

export default function PlatformsTab({ data, slug, mob }) {
  const { B, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.platforms || {};
  const platforms = B.platforms || [];

  const quickAnswer = sp.quick_answer || `${B.name} supports ${platforms.length} trading platform${platforms.length > 1 ? "s" : ""}: ${platforms.join(", ")}. Available on desktop, web, and mobile.`;
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || platforms.map(p => `${p} supported`);
  const cons = sp.cons || ["No proprietary platform"];

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      {pros.length > 0 && cons.length > 0 && <ProsCons pros={pros.slice(0, 4)} cons={cons.slice(0, 4)} mob={mob} />}

      <H2>Available Platforms</H2>
      {platforms.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : platforms.length >= 4 ? "1fr 1fr" : `repeat(${platforms.length}, 1fr)`, gap: 14, marginBottom: 20 }}>
          {platforms.map((p, i) => (
            <Card key={i} style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <MonitorSmartphone size={20} color={GREEN} />
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{p}</div>
              </div>
              <div style={{ fontSize: 14, color: GRAY_TEXT, lineHeight: 1.6 }}>
                Available on desktop, web, and mobile.
              </div>
            </Card>
          ))}
        </div>
      )}

      <CTAInline slug={slug} name={B.name} promo={B.promo} label={`Try ${B.name} Platform Free`} sub="Open a demo account in 2 minutes" mob={mob} />

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("platform") || f.q.toLowerCase().includes("mt4") || f.q.toLowerCase().includes("mt5")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("platform") || f.q.toLowerCase().includes("mt4") || f.q.toLowerCase().includes("mt5")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Platforms Verdict`}
        text={sp.verdict_text || `${B.name} offers ${platforms.length} trading platform${platforms.length > 1 ? "s" : ""} including ${platforms.slice(0, 2).join(" and ")}. ${platforms.length >= 3 ? "The variety ensures traders of all levels find a suitable option." : ""}`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

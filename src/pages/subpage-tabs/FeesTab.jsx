import { QuickAnswerBox, ProsCons, DataTable, ComparisonBar, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";

const GREEN = "#059669";
const GRAY_MUTED = "#64748b";

export default function FeesTab({ data, slug, mob }) {
  const { B, ACCOUNTS, SPREADS, spreadCompetitors, costBoxes, PROS, CONS, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.fees || {};

  const quickAnswer = sp.quick_answer || `${B.name} offers spreads from ${B.spread} pips with ${B.commission} commission. ${B.type} execution with ${B.instruments} instruments available.`;
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || PROS.slice(0, 4);
  const cons = sp.cons || CONS.slice(0, 4);
  const faqs = sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("fee") || f.q.toLowerCase().includes("spread") || f.q.toLowerCase().includes("cost") || f.q.toLowerCase().includes("commission")).slice(0, 4);

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      {pros.length > 0 && cons.length > 0 && <ProsCons pros={pros} cons={cons} mob={mob} />}

      <H2 id="trading-fees">Trading Fees Overview</H2>
      <P>{B.name} offers {ACCOUNTS.length} account type{ACCOUNTS.length > 1 ? "s" : ""} with {B.type} execution. Spreads start from {B.spread} pips.</P>
      {ACCOUNTS.length > 0 && (
        <DataTable
          headers={["Account Type", "Spread", "Commission", "Min Deposit", "Best For"]}
          rows={ACCOUNTS.map(a => [a.name, a.spread, a.commission, `$${a.min}`, a.best || "—"])}
          mob={mob}
        />
      )}

      {SPREADS.length > 0 && spreadCompetitors.length > 0 && (
        <>
          <H2 id="spread-comparison">Spread Comparison</H2>
          <P>Average spreads during the London/New York overlap session — the highest liquidity period:</P>
          <DataTable
            headers={["Pair", ...spreadCompetitors]}
            rows={SPREADS.map(s => [s.pair, ...s.values])}
            highlightFirst
            mob={mob}
          />
        </>
      )}

      <CTAInline slug={slug} name={B.name} promo={B.promo} label={`Compare ${B.name} Fees`} sub={`Spreads from ${B.spread} pips`} mob={mob} />

      {costBoxes.length > 0 && (
        <>
          <H2 id="cost-summary">Cost Summary</H2>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : `repeat(${Math.min(costBoxes.length, 3)}, 1fr)`, gap: 16 }}>
              {costBoxes.map((x, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: GRAY_MUTED, marginBottom: 4 }}>{x.l}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 800, color: GREEN }}>{x.v}</div>
                  <div style={{ fontSize: 13, color: GRAY_MUTED }}>{x.n}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {faqs.length > 0 && <FaqSection faqs={faqs} mob={mob} />}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Fees Verdict`}
        text={sp.verdict_text || `${B.name} offers competitive trading costs with ${B.type} execution. Spreads from ${B.spread} pips make it suitable for active traders.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

import { QuickAnswerBox, ProsCons, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import { Clock } from "lucide-react";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const GRAY_MUTED = "#64748b";
const BORDER = "#e8ecf1";

export default function DepositTab({ data, slug, mob }) {
  const { B, DEPOSITS, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.deposit || {};
  const freeCount = DEPOSITS.filter(d => d.fee === "Free").length;

  const quickAnswer = sp.quick_answer || `${B.name} supports ${DEPOSITS.length}+ deposit methods. ${freeCount > 0 ? `${freeCount} method${freeCount > 1 ? "s are" : " is"} free.` : ""} Minimum deposit: $${B.minDep}.`;
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || [
    ...(freeCount > 0 ? [`${freeCount} free deposit method${freeCount > 1 ? "s" : ""}`] : []),
    `${DEPOSITS.length}+ deposit options`,
    `Minimum deposit from $${B.minDep}`,
  ];
  const cons = sp.cons || [`$${B.minDep} minimum for all methods`];

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      {pros.length > 0 && cons.length > 0 && <ProsCons pros={pros.slice(0, 4)} cons={cons.slice(0, 4)} mob={mob} />}

      {DEPOSITS.length > 0 && (
        <>
          <H2>Deposit Methods</H2>
          <DataTable
            headers={["Method", "Fee", "Processing", "Min Amount"]}
            rows={DEPOSITS.map(d => [d.method, d.fee, d.time, d.min])}
            mob={mob}
          />
        </>
      )}

      <CTAInline slug={slug} name={B.name} promo={B.promo} label="Open Account & Deposit" sub={`${freeCount > 0 ? "Free deposits" : "Multiple methods"} · $${B.minDep} minimum`} mob={mob} />

      <H2>How to Deposit — Step by Step</H2>
      <Card>
        {[
          { step: 1, title: `Log into your ${B.name} Client Area`, desc: "Enter your credentials to access the dashboard" },
          { step: 2, title: "Navigate to Deposit / Fund Account", desc: "Click the deposit button in your dashboard" },
          { step: 3, title: "Select your deposit method", desc: `Choose from ${DEPOSITS.length}+ available methods` },
          { step: 4, title: "Enter amount and confirm", desc: `Minimum $${B.minDep}. Select your trading account to fund` },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 3 ? `1px solid ${BORDER}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: GREEN }}>{s.step}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: GRAY_MUTED }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </Card>

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("deposit") || f.q.toLowerCase().includes("withdraw") || f.q.toLowerCase().includes("payment")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("deposit") || f.q.toLowerCase().includes("withdraw") || f.q.toLowerCase().includes("payment")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Deposit & Withdrawal Verdict`}
        text={sp.verdict_text || `${B.name} offers ${DEPOSITS.length}+ deposit methods with a $${B.minDep} minimum. ${freeCount > 0 ? `${freeCount} methods are free.` : ""}`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

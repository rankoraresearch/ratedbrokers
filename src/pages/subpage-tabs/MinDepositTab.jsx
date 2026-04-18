import { QuickAnswerBox, ProsCons, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const BORDER = "#e8ecf1";

export default function MinDepositTab({ data, slug, mob }) {
  const { B, ACCOUNTS, DEPOSITS, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.["min-deposit"] || {};

  const quickAnswer = sp.quick_answer || `${B.name} requires a minimum deposit of $${B.minDep} for all account types. ${DEPOSITS.length > 0 ? `Supports ${DEPOSITS.length}+ deposit methods.` : ""}`;
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || [`All deposit methods available`, `${DEPOSITS.filter(d => d.fee === "Free").length > 0 ? "Free deposits on most methods" : "Multiple deposit options"}`, `Multiple account types from $${B.minDep}`];
  const cons = sp.cons || [`$${B.minDep} minimum — ${B.minDep > 100 ? "higher than some competitors" : "competitive minimum"}`];

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      {pros.length > 0 && cons.length > 0 && <ProsCons pros={pros} cons={cons} mob={mob} />}

      <H2>Minimum Deposit by Account Type</H2>
      {ACCOUNTS.length > 0 && (
        <DataTable
          headers={["Account", "Min Deposit", "Spread", "Commission", "Best For"]}
          rows={ACCOUNTS.map(a => [a.name, `$${a.min}`, a.spread, a.commission, a.best || "—"])}
          mob={mob}
        />
      )}

      {DEPOSITS.length > 0 && (
        <>
          <H2>Deposit Methods & Processing Times</H2>
          <DataTable
            headers={["Method", "Fee", "Processing", "Min Amount"]}
            rows={DEPOSITS.map(d => [d.method, d.fee, d.time, d.min])}
            mob={mob}
          />
        </>
      )}

      <CTAInline slug={slug} name={B.name} promo={B.promo} label={`Open Account — $${B.minDep} Min`} sub="Start trading today" mob={mob} />

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("deposit") || f.q.toLowerCase().includes("minimum")).slice(0, 4)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("deposit") || f.q.toLowerCase().includes("minimum")).slice(0, 4)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Deposit Verdict`}
        text={sp.verdict_text || `${B.name} requires a $${B.minDep} minimum deposit across all account types. ${DEPOSITS.filter(d => d.fee === "Free").length > 0 ? "Most deposit methods are free with instant processing." : ""}`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

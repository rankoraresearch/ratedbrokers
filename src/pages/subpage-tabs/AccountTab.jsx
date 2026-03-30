import { QuickAnswerBox, ProsCons, DataTable, CTAInline, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import { Zap, BookOpen, MonitorSmartphone, Shield, FileText, Globe, Smartphone, Clock, ExternalLink, Target } from "lucide-react";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const ORANGE = "#f59e0b";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";
const GRAY_LIGHT = "#f8f9fb";
const BORDER = "#e8ecf1";

export default function AccountTab({ data, slug, mob }) {
  const { B, ACCOUNTS, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.account || {};

  const quickAnswer = sp.quick_answer || `Opening a ${B.name} account takes 10-15 minutes online. You'll need a valid ID and proof of address. Minimum deposit: $${B.minDep}. ${ACCOUNTS.length} account type${ACCOUNTS.length > 1 ? "s" : ""} available.`;
  const tabScore = sp.tab_score || null;
  const pros = sp.pros || ["Fully online registration", `${ACCOUNTS.length} account types available`, "Demo account available"];
  const cons = sp.cons || [`$${B.minDep} minimum deposit required`, "Verification documents mandatory"];

  return (
    <>
      <QuickAnswerBox text={quickAnswer} score={tabScore} />
      <ProsCons pros={pros.slice(0, 4)} cons={cons.slice(0, 4)} mob={mob} />

      <H2>Account Types</H2>
      {ACCOUNTS.length > 0 && (
        <DataTable
          headers={["Account", "Min Deposit", "Spread", "Commission", "Best For"]}
          rows={ACCOUNTS.map(a => [a.name, `$${a.min}`, a.spread, a.commission, a.best || "—"])}
          mob={mob}
        />
      )}

      {/* Account type CTA cards */}
      {ACCOUNTS.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : ACCOUNTS.length >= 3 ? "1fr 1fr" : `repeat(${ACCOUNTS.length}, 1fr)`, gap: 12, marginBottom: 24 }}>
          {ACCOUNTS.slice(0, 4).map((acc, i) => {
            const icons = [Zap, BookOpen, MonitorSmartphone, Shield];
            const AccIcon = icons[i % icons.length];
            const colors = [ORANGE, GREEN, "#6366f1", "#0891b2"];
            const accent = colors[i % colors.length];
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ background: accent, color: i === 0 ? NAVY : "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textAlign: "center", padding: "5px 0" }}>
                  {i === 0 ? "MOST POPULAR" : acc.best || acc.name}
                </div>
                <div style={{ padding: mob ? "14px 14px 16px" : "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}12`, border: `1.5px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AccIcon size={19} color={accent} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.25 }}>{acc.name}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: GRAY_LIGHT, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Spread</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{acc.spread}</div>
                    </div>
                    <div style={{ background: GRAY_LIGHT, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Commission</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{acc.commission}</div>
                    </div>
                  </div>
                  <a href={`${import.meta.env.VITE_API_URL || ''}/go/${slug}`} target="_blank" rel="nofollow sponsored" className={i === 0 ? "cta-orange" : "cta-secondary"} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "11px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700,
                    background: i === 0 ? `linear-gradient(135deg, ${ORANGE}, #fbbf24)` : "#fff",
                    color: i === 0 ? NAVY : accent,
                    border: i === 0 ? "none" : `2px solid ${accent}`,
                    marginTop: "auto",
                  }}>
                    Open {acc.name.split(" (")[0]} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Demo account CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY}, #1e293b)`, borderRadius: 12, padding: mob ? "16px" : "18px 22px",
        display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center",
        gap: mob ? 12 : 20, marginBottom: 24,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ background: "rgba(52,211,153,0.15)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MonitorSmartphone size={16} color="#34d399" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Free Demo Account</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: "#34d399", color: NAVY, padding: "2px 7px", borderRadius: 4 }}>NO RISK</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
            Virtual funds · All platforms · Real market conditions · No ID required
          </div>
        </div>
        <a href={`${import.meta.env.VITE_API_URL || ''}/go/${slug}`} target="_blank" rel="nofollow sponsored" className="cta-secondary" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
          background: "transparent", border: "2px solid #34d399", color: "#34d399",
          whiteSpace: "nowrap",
        }}>
          Try Free Demo <ExternalLink size={13} />
        </a>
      </div>

      <H2>What You Need</H2>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
          {[
            { icon: FileText, label: "Valid ID", desc: "Passport, driver's license, or national ID card" },
            { icon: Globe, label: "Proof of Address", desc: "Utility bill or bank statement (within 3 months)" },
            { icon: Smartphone, label: "Email & Phone", desc: "Valid email address and mobile phone for verification" },
            { icon: Clock, label: "15 minutes", desc: "Total time to complete registration" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><r.icon size={18} color={GREEN} /></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.label}</div>
                <div style={{ fontSize: 13, color: GRAY_MUTED }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <CTAInline slug={slug} name={B.name} promo={B.promo} label="Start Registration" sub="15-minute process" mob={mob} />

      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("account") || f.q.toLowerCase().includes("open") || f.q.toLowerCase().includes("verify") || f.q.toLowerCase().includes("demo")).slice(0, 5)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("account") || f.q.toLowerCase().includes("open") || f.q.toLowerCase().includes("verify") || f.q.toLowerCase().includes("demo")).slice(0, 5)} mob={mob} />
      )}

      <VerdictBox
        slug={slug} name={B.name} score={B.score}
        title={sp.verdict_title || `${B.name} Account Opening — Verdict`}
        text={sp.verdict_text || `Opening a ${B.name} account is straightforward — fully online, quick process. The $${B.minDep} minimum deposit is the main requirement. We recommend starting with a free demo account to test the platform before committing funds.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}

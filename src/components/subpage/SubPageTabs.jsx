import { Link } from "react-router-dom";
import { BarChart3, Wallet, MonitorSmartphone, Shield, ArrowUpDown, BookOpen, Users, UserCheck, ArrowLeft } from "lucide-react";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GRAY_MUTED = "#64748b";
const GRAY_LIGHT = "#f8f9fb";
const BORDER = "#e8ecf1";

export const TABS = [
  { id: "fees", label: "Fees", icon: BarChart3 },
  { id: "min-deposit", label: "Min Deposit", icon: Wallet },
  { id: "platforms", label: "Platforms", icon: MonitorSmartphone },
  { id: "regulation", label: "Regulation", icon: Shield },
  { id: "deposit", label: "Deposit", icon: ArrowUpDown },
  { id: "beginners", label: "Beginners", icon: BookOpen },
  { id: "account", label: "Account", icon: UserCheck },
];

export const VALID_TABS = [...TABS.map(t => t.id), "alternatives"];

export const TAB_META = {
  fees: { breadcrumb: "Fees & Spreads", h1Suffix: "Fees & Spreads" },
  "min-deposit": { breadcrumb: "Minimum Deposit", h1Suffix: "Minimum Deposit" },
  platforms: { breadcrumb: "Platforms", h1Suffix: "Trading Platforms" },
  regulation: { breadcrumb: "Regulation", h1Suffix: "Regulation & Safety" },
  deposit: { breadcrumb: "Deposit & Withdrawal", h1Suffix: "Deposit & Withdrawal" },
  beginners: { breadcrumb: "For Beginners", h1Suffix: "for Beginners" },
  alternatives: { breadcrumb: "Alternatives", h1Suffix: "Alternatives" },
  account: { breadcrumb: "Account Opening", h1Suffix: "Account Opening" },
};

export default function SubPageTabs({ activeTab, slug, mob, brokerName }) {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 64, zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", position: "relative" }}>
        <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          <Link
            to={`/review/${slug}`}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: mob ? "12px 14px" : "14px 20px",
              background: "transparent",
              color: GRAY_MUTED,
              border: "none", borderBottom: "3px solid transparent",
              borderRight: `1px solid ${BORDER}`,
              fontSize: mob ? 12 : 13, fontWeight: 700,
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = NAVY; e.currentTarget.style.background = GRAY_LIGHT; }}
            onMouseLeave={e => { e.currentTarget.style.color = GRAY_MUTED; e.currentTarget.style.background = "transparent"; }}
          >
            <ArrowLeft size={mob ? 13 : 14} />
            {mob ? "Review" : `${brokerName} Review`}
          </Link>
          {TABS.map(t => {
            const active = t.id === activeTab;
            const TabIcon = t.icon;
            return (
              <Link
                key={t.id}
                to={`/review/${slug}/${t.id}`}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: mob ? "12px 14px" : "14px 20px",
                  background: active ? NAVY : "transparent",
                  color: active ? "#fff" : GRAY_MUTED,
                  border: "none", borderBottom: active ? `3px solid ${GREEN}` : "3px solid transparent",
                  fontSize: mob ? 12 : 13, fontWeight: 700,
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = NAVY; e.currentTarget.style.background = GRAY_LIGHT; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = GRAY_MUTED; e.currentTarget.style.background = "transparent"; } }}
              >
                <TabIcon size={mob ? 14 : 16} />
                {t.label}
              </Link>
            );
          })}
        </div>
        {mob && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(90deg, transparent, #fff)", pointerEvents: "none", zIndex: 2 }} />}
      </div>
    </div>
  );
}

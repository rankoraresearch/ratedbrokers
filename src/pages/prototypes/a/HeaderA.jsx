/**
 * Direction A: "Clean Authority" — Header
 * Clean white, green accent, professional. Minimal dropdown feel.
 * Trust strip on top. Slim, elegant nav.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { ChevronDown, Search, Menu, X, ArrowRight, Shield } from "lucide-react";

const NAV = [
  { label: "Forex Brokers", path: "/best-forex-brokers", items: [
    { label: "Best Overall", path: "/best-forex-brokers" },
    { label: "For Beginners", path: "/best-forex-brokers-for-beginners" },
    { label: "For Scalping", path: "/best-forex-brokers-for-scalping" },
    { label: "Lowest Spreads", path: "/lowest-spread-forex-brokers" },
    { label: "ECN Brokers", path: "/best-ecn-forex-brokers" },
    { label: "Copy Trading", path: "/best-copy-trading-platforms" },
  ]},
  { label: "Platforms", items: [
    { label: "MetaTrader 4", path: "/best-metatrader-4-brokers" },
    { label: "MetaTrader 5", path: "/best-metatrader-5-brokers" },
    { label: "cTrader", path: "/best-ctrader-brokers" },
    { label: "TradingView", path: "/best-tradingview-brokers" },
  ]},
  { label: "Countries", items: [
    { label: "United Kingdom", path: "/best-forex-brokers-uk" },
    { label: "Australia", path: "/best-forex-brokers-australia" },
    { label: "United States", path: "/best-forex-brokers-usa" },
    { label: "Singapore", path: "/best-forex-brokers-singapore" },
    { label: "Germany", path: "/best-forex-brokers-germany" },
    { label: "All Countries →", path: "/best-forex-brokers-by-country" },
  ]},
  { label: "Reviews", path: "/reviews" },
  { label: "Guides", path: "/guides" },
];

const green = "#059669";

export default function HeaderA() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
    setMobileExpanded(null);
  }, [location.pathname]);

  const enter = useCallback((id) => { clearTimeout(timeoutRef.current); setOpen(id); }, []);
  const leave = useCallback(() => { timeoutRef.current = setTimeout(() => setOpen(null), 180); }, []);

  return (
    <>
      {/* Trust strip */}
      {!scrolled && !mob && (
        <div style={{
          background: "#f0fdf4", padding: "7px 0", borderBottom: "1px solid #d1fae5",
          fontSize: 13, color: "#065f46", textAlign: "center",
          display: "flex", justifyContent: "center", gap: 24, alignItems: "center",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Shield size={12} color={green} /> Independent Research
          </span>
          <span>·</span>
          <span>Real Money Testing</span>
          <span>·</span>
          <span>No Sponsored Rankings</span>
        </div>
      )}

      {/* Main header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
        transition: "all 0.2s",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: scrolled ? 56 : 60,
        }}>
          {/* Logo */}
          <Link to={lp("/")} style={{
            textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, background: green,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Outfit", fontWeight: 900, fontSize: 15, color: "#fff",
            }}>R</div>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
              Rated<span style={{ color: green }}>Brokers</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!mob && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV.map((n, i) => (
                <div key={i}
                  style={{ position: "relative" }}
                  onMouseEnter={() => n.items && enter(i)}
                  onMouseLeave={n.items ? leave : undefined}
                >
                  {n.items ? (
                    <button style={{
                      background: open === i ? "#f0fdf4" : "transparent",
                      border: "none", padding: "8px 12px", borderRadius: 8,
                      fontSize: 15, fontWeight: 500, color: open === i ? green : "#475569",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
                      fontFamily: "inherit", transition: "all 0.15s",
                    }}>
                      {n.label} <ChevronDown size={12} color="#94a3b8" style={{
                        transition: "transform 0.2s",
                        transform: open === i ? "rotate(180deg)" : "none",
                      }} />
                    </button>
                  ) : (
                    <Link to={lp(n.path)} style={{
                      padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                      fontSize: 15, fontWeight: 500, color: "#475569",
                    }}>{n.label}</Link>
                  )}

                  {/* Dropdown */}
                  {n.items && open === i && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0,
                      background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.1)", padding: 8,
                      minWidth: 220, zIndex: 1001,
                    }}
                      onMouseEnter={() => enter(i)}
                      onMouseLeave={leave}
                    >
                      {n.items.map((item, j) => (
                        <Link key={j} to={lp(item.path)} style={{
                          display: "block", padding: "10px 14px", borderRadius: 8,
                          textDecoration: "none", color: "#334155", fontSize: 14, fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = green; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}
                        >{item.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!mob && (
              <button style={{
                background: "transparent", border: "1px solid #e2e8f0", borderRadius: 8,
                padding: "7px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                fontSize: 14, color: "#94a3b8", fontFamily: "inherit",
              }}>
                <Search size={14} /> <span>Search</span>
                <kbd style={{ fontSize: 11, color: "#cbd5e1", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>⌘K</kbd>
              </button>
            )}
            {mob && (
              <>
                <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                  <Search size={20} color="#475569" />
                </button>
                <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                  {mobileOpen ? <X size={22} color="#475569" /> : <Menu size={22} color="#475569" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mob && mobileOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "#fff", borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
            maxHeight: "70vh", overflowY: "auto", padding: "8px 16px 16px",
          }}>
            {NAV.map((n, i) => (
              <div key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                {n.items ? (
                  <>
                    <button onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", padding: "14px 0", background: "transparent", border: "none",
                      fontSize: 16, fontWeight: 600, color: "#0f172a", cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {n.label}
                      <ChevronDown size={16} color="#94a3b8" style={{
                        transition: "transform 0.2s",
                        transform: mobileExpanded === i ? "rotate(180deg)" : "none",
                      }} />
                    </button>
                    {mobileExpanded === i && (
                      <div style={{ paddingBottom: 12 }}>
                        {n.items.map((item, j) => (
                          <Link key={j} to={lp(item.path)} style={{
                            display: "block", padding: "10px 16px", borderRadius: 8,
                            textDecoration: "none", color: "#475569", fontSize: 15,
                          }}>{item.label}</Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={lp(n.path)} style={{
                    display: "block", padding: "14px 0", textDecoration: "none",
                    fontSize: 16, fontWeight: 600, color: "#0f172a",
                  }}>{n.label}</Link>
                )}
              </div>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

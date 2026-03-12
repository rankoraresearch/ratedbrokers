/**
 * Direction B: "Beginner Warm" — Header
 * Cream/warm tones, teal accent, friendly and approachable.
 * Rounded shapes, warm colors, inviting navigation.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { ChevronDown, Search, Menu, X, ArrowRight, BookOpen, Heart } from "lucide-react";

const NAV = [
  { label: "Forex Brokers", path: "/best-forex-brokers", items: [
    { label: "Best Overall", path: "/best-forex-brokers", emoji: "🏆" },
    { label: "For Beginners", path: "/best-forex-brokers-for-beginners", emoji: "🌱" },
    { label: "For Scalping", path: "/best-forex-brokers-for-scalping", emoji: "⚡" },
    { label: "Lowest Spreads", path: "/lowest-spread-forex-brokers", emoji: "📉" },
    { label: "ECN Brokers", path: "/best-ecn-forex-brokers", emoji: "🔗" },
    { label: "Copy Trading", path: "/best-copy-trading-platforms", emoji: "👥" },
  ]},
  { label: "Platforms", items: [
    { label: "MetaTrader 4", path: "/best-metatrader-4-brokers", emoji: "📊" },
    { label: "MetaTrader 5", path: "/best-metatrader-5-brokers", emoji: "📊" },
    { label: "cTrader", path: "/best-ctrader-brokers", emoji: "⚙️" },
    { label: "TradingView", path: "/best-tradingview-brokers", emoji: "📈" },
  ]},
  { label: "Countries", items: [
    { label: "United Kingdom", path: "/best-forex-brokers-uk", emoji: "🇬🇧" },
    { label: "Australia", path: "/best-forex-brokers-australia", emoji: "🇦🇺" },
    { label: "United States", path: "/best-forex-brokers-usa", emoji: "🇺🇸" },
    { label: "Singapore", path: "/best-forex-brokers-singapore", emoji: "🇸🇬" },
    { label: "Germany", path: "/best-forex-brokers-germany", emoji: "🇩🇪" },
    { label: "All Countries →", path: "/best-forex-brokers-by-country", emoji: "🌍" },
  ]},
  { label: "Reviews", path: "/reviews" },
  { label: "Guides", path: "/guides" },
];

const teal = "#0d9488";
const cream = "#fef7ed";

export default function HeaderB() {
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
      {/* Warm welcome strip */}
      {!scrolled && !mob && (
        <div style={{
          background: cream, padding: "8px 0", borderBottom: "1px solid #e5ddd4",
          fontSize: 13, color: "#78716c", textAlign: "center",
          display: "flex", justifyContent: "center", gap: 24, alignItems: "center",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Heart size={12} color="#f97066" fill="#f97066" /> New to Forex? We'll help you start
          </span>
          <span>·</span>
          <span>Tested with Real Money</span>
          <span>·</span>
          <span>100% Independent Reviews</span>
        </div>
      )}

      {/* Main header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(254,247,237,0.97)" : cream,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #e5ddd4",
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
              width: 30, height: 30, borderRadius: 10, background: teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Outfit", fontWeight: 900, fontSize: 16, color: "#fff",
            }}>R</div>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, color: "#1c1917" }}>
              Rated<span style={{ color: teal }}>Brokers</span>
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
                      background: open === i ? "#fff" : "transparent",
                      border: "none", padding: "8px 14px", borderRadius: 10,
                      fontSize: 15, fontWeight: 600, color: open === i ? teal : "#57534e",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                      fontFamily: "inherit", transition: "all 0.15s",
                    }}>
                      {n.label} <ChevronDown size={12} color="#a8a29e" style={{
                        transition: "transform 0.2s",
                        transform: open === i ? "rotate(180deg)" : "none",
                      }} />
                    </button>
                  ) : (
                    <Link to={lp(n.path)} style={{
                      padding: "8px 14px", borderRadius: 10, textDecoration: "none",
                      fontSize: 15, fontWeight: 600, color: "#57534e",
                    }}>{n.label}</Link>
                  )}

                  {/* Dropdown */}
                  {n.items && open === i && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", left: -8,
                      background: "#fff", borderRadius: 16, border: "1px solid #e7e5e4",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.08)", padding: 8,
                      minWidth: 240, zIndex: 1001,
                    }}
                      onMouseEnter={() => enter(i)}
                      onMouseLeave={leave}
                    >
                      {n.items.map((item, j) => (
                        <Link key={j} to={lp(item.path)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "11px 14px", borderRadius: 10,
                          textDecoration: "none", color: "#44403c", fontSize: 14, fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = cream; e.currentTarget.style.color = teal; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#44403c"; }}
                        >
                          <span style={{ fontSize: 16 }}>{item.emoji}</span>
                          {item.label}
                        </Link>
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
                background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10,
                padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                fontSize: 14, color: "#a8a29e", fontFamily: "inherit",
              }}>
                <Search size={14} /> <span>Search</span>
                <kbd style={{ fontSize: 11, color: "#d6d3d1", background: "#fafaf9", padding: "2px 6px", borderRadius: 4 }}>⌘K</kbd>
              </button>
            )}
            {mob && (
              <>
                <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                  <Search size={20} color="#57534e" />
                </button>
                <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                  {mobileOpen ? <X size={22} color="#57534e" /> : <Menu size={22} color="#57534e" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mob && mobileOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: cream, borderBottom: "1px solid #e7e5e4",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            maxHeight: "70vh", overflowY: "auto", padding: "8px 16px 16px",
          }}>
            {/* Beginner CTA in mobile */}
            <Link to={lp("/best-forex-brokers-for-beginners")} style={{
              display: "flex", alignItems: "center", gap: 10,
              margin: "8px 0 16px", padding: "14px 16px", borderRadius: 14,
              background: teal, color: "#fff", textDecoration: "none",
              fontWeight: 700, fontSize: 15,
            }}>
              <BookOpen size={18} />
              New to Forex? Start Here
              <ArrowRight size={16} style={{ marginLeft: "auto" }} />
            </Link>

            {NAV.map((n, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e7e5e4" }}>
                {n.items ? (
                  <>
                    <button onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", padding: "14px 0", background: "transparent", border: "none",
                      fontSize: 16, fontWeight: 600, color: "#1c1917", cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {n.label}
                      <ChevronDown size={16} color="#a8a29e" style={{
                        transition: "transform 0.2s",
                        transform: mobileExpanded === i ? "rotate(180deg)" : "none",
                      }} />
                    </button>
                    {mobileExpanded === i && (
                      <div style={{ paddingBottom: 12 }}>
                        {n.items.map((item, j) => (
                          <Link key={j} to={lp(item.path)} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 16px", borderRadius: 10,
                            textDecoration: "none", color: "#57534e", fontSize: 15,
                          }}>
                            <span>{item.emoji}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={lp(n.path)} style={{
                    display: "block", padding: "14px 0", textDecoration: "none",
                    fontSize: 16, fontWeight: 600, color: "#1c1917",
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

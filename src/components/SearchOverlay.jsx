import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";
import { useMedia } from "../hooks/useMedia";
import useSearchIndex from "../hooks/useSearchIndex";
import { Search, X } from "lucide-react";

const POPULAR = [
  { label: "Best Forex Brokers", path: "/best-forex-brokers" },
  { label: "Best for Beginners", path: "/best-forex-brokers-for-beginners" },
  { label: "IC Markets", path: "/review/ic-markets" },
  { label: "What Is Forex Trading?", path: "/guide/what-is-forex-trading" },
  { label: "Copy Trading", path: "/best-copy-trading-platforms" },
];

const TYPE_ORDER = ["broker", "ranking", "guide", "country"];
const TYPE_ICONS = { broker: "\u25cf", ranking: "\ud83c\udfc6", guide: "\ud83d\udcd6", country: "\ud83c\udf0d" };

function groupByType(items) {
  const groups = {};
  items.forEach((item) => {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  });
  return TYPE_ORDER.filter((t) => groups[t]).map((t) => ({ type: t, items: groups[t] }));
}

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const { search } = useSearchIndex();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { mob } = useMedia();

  const results = query.length >= 2 ? search(query) : [];
  const grouped = groupByType(results);
  const flat = grouped.flatMap((g) => g.items);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { setActiveIdx(-1); }, [query]);

  // scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const go = useCallback((path) => {
    navigate(lp(path));
    onClose();
  }, [navigate, lp, onClose]);

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i < flat.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : flat.length - 1));
    } else if (e.key === "Enter" && activeIdx >= 0 && flat[activeIdx]) {
      e.preventDefault();
      go(flat[activeIdx].path);
    }
  }, [flat, activeIdx, onClose, go]);

  /* ── Styles ── */
  const backdrop = {
    position: "fixed", inset: 0, zIndex: 2000,
    background: "rgba(15,23,42,0.7)", backdropFilter: "blur(4px)",
    display: "flex", justifyContent: "center",
    alignItems: mob ? "stretch" : "flex-start",
    padding: mob ? 0 : "80px 16px 16px",
  };

  const modal = {
    background: "#fff",
    borderRadius: mob ? 0 : 16,
    boxShadow: mob ? "none" : "0 24px 80px rgba(0,0,0,0.25)",
    width: "100%", maxWidth: mob ? "100%" : 640,
    height: mob ? "100%" : "auto",
    maxHeight: mob ? "100%" : "min(580px, 80vh)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  };

  const inputWrap = {
    display: "flex", alignItems: "center", gap: 12,
    padding: "16px 20px", borderBottom: "1px solid #e2e8f0",
  };

  const inputStyle = {
    flex: 1, border: "none", outline: "none",
    fontSize: 18, fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, color: "#0f172a",
    background: "transparent",
  };

  const secHead = {
    fontSize: 11, fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: 1.2,
    padding: "12px 20px 6px",
  };

  const footer = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 20, padding: "10px 20px",
    borderTop: "1px solid #e2e8f0", background: "#f8fafc",
    fontSize: 12, color: "#94a3b8", flexShrink: 0,
  };

  const kbd = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "1px 5px", borderRadius: 4,
    background: "#e2e8f0", fontSize: 11, fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace", color: "#64748b",
    minWidth: 20, lineHeight: 1.5,
  };

  const typeLabel = (type) => {
    const map = {
      broker: t("search.brokers"),
      ranking: t("search.rankings"),
      guide: t("search.guides"),
      country: t("search.countries"),
    };
    return map[type] || type;
  };

  const renderMeta = (item) => {
    if (item.type === "broker" && item.meta.score) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 12,
            color: item.meta.score >= 9.5 ? "#059669" : "#2563eb",
            background: item.meta.score >= 9.5 ? "#ecfdf5" : "#eff6ff",
            padding: "2px 6px", borderRadius: 4,
          }}>{item.meta.score}</span>
          {item.meta.badge && (
            <span style={{
              fontSize: 11, color: "#64748b", fontWeight: 500,
            }}>{item.meta.badge}</span>
          )}
        </div>
      );
    }
    if (item.type === "country" && item.meta.flag) {
      return <span style={{ fontSize: 18, flexShrink: 0 }}>{item.meta.flag}</span>;
    }
    if (item.type === "ranking" && item.meta.icon) {
      return <span style={{ fontSize: 16, flexShrink: 0 }}>{item.meta.icon}</span>;
    }
    if (item.type === "guide" && item.meta.readTime) {
      return <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{item.meta.readTime}</span>;
    }
    return null;
  };

  let flatIdx = 0;

  return createPortal(
    <div style={backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modal} onKeyDown={handleKey}>
        {/* ── Input ── */}
        <div style={inputWrap}>
          <Search size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            style={inputStyle}
          />
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 4, display: "inline-flex", color: "#94a3b8",
          }}><X size={20} /></button>
        </div>

        {/* ── Body ── */}
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}>
          {/* Empty state: Popular Searches */}
          {query.length === 0 && (
            <div style={{ padding: "8px 0" }}>
              <div style={secHead}>{t("search.popular")}</div>
              {POPULAR.map((p) => (
                <button
                  key={p.path}
                  onClick={() => go(p.path)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "10px 20px", border: "none", background: "transparent",
                    fontSize: 14, fontWeight: 500, color: "#1e293b", cursor: "pointer",
                    fontFamily: "inherit", transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ color: "#94a3b8", marginRight: 8 }}>{"\u2192"}</span>
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Typing but < 2 chars */}
          {query.length > 0 && query.length < 2 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              {t("search.minChars")}
            </div>
          )}

          {/* Results */}
          {query.length >= 2 && results.length > 0 && (
            <div style={{ padding: "4px 0" }}>
              {grouped.map((group) => {
                const header = (
                  <div key={`h-${group.type}`} style={secHead}>{typeLabel(group.type)}</div>
                );
                const rows = group.items.map((item) => {
                  const idx = flatIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={item.path}
                      data-idx={idx}
                      onClick={() => go(item.path)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", textAlign: "left", gap: 10,
                        padding: "10px 20px", border: "none", cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.1s",
                        background: isActive ? "#f0fdf4" : "transparent",
                        borderLeft: isActive ? "3px solid #059669" : "3px solid transparent",
                        fontSize: 14, fontWeight: 500, color: "#1e293b",
                      }}
                      onMouseEnter={(e) => {
                        setActiveIdx(idx);
                        e.currentTarget.style.background = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        if (idx !== activeIdx) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        flex: 1, minWidth: 0,
                      }}>{item.title}</span>
                      {renderMeta(item)}
                    </button>
                  );
                });
                return [header, ...rows];
              })}
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500, marginBottom: 6 }}>
                {t("search.noResults")} &laquo;{query}&raquo;
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                {t("search.tryQuery")}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!mob && (
          <div style={footer}>
            <span><span style={kbd}>&uarr;</span><span style={kbd}>&darr;</span> {t("search.navigate")}</span>
            <span><span style={kbd}>&crarr;</span> {t("search.select")}</span>
            <span><span style={kbd}>Esc</span> {t("search.close")}</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

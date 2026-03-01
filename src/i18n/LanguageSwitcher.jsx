import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LANGUAGES, DEFAULT_LANG } from "./config";
import { useTranslation } from "./LanguageContext";

export default function LanguageSwitcher({ mobile }) {
  const { lang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  // Hide switcher when only one language is available
  if (LANGUAGES.length <= 1) return null;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function switchLang(code) {
    setOpen(false);
    const path = location.pathname;

    // Strip current lang prefix
    let cleanPath = path;
    if (lang !== DEFAULT_LANG) {
      cleanPath = path.replace(new RegExp(`^/${lang}(/|$)`), "/");
    }
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

    // Build new path
    const newPath = code === DEFAULT_LANG ? cleanPath : `/${code}${cleanPath === "/" ? "" : cleanPath}`;
    navigate(newPath);
  }

  if (mobile) {
    return (
      <div style={{ padding: "8px 0", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Language
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: l.code === lang ? "2px solid #059669" : "1px solid #e2e8f0",
                background: l.code === lang ? "#ecfdf5" : "#fff",
                fontSize: 12,
                fontWeight: l.code === lang ? 700 : 500,
                color: l.code === lang ? "#059669" : "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 14 }}>{l.flag}</span>
              {l.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.1)",
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 14 }}>{current.flag}</span>
        {current.code.toUpperCase()}
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>\u25be</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "6px",
            zIndex: 1001,
            minWidth: 150,
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: l.code === lang ? "#ecfdf5" : "transparent",
                fontSize: 13,
                fontWeight: l.code === lang ? 700 : 500,
                color: l.code === lang ? "#059669" : "#1e293b",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.name}</span>
              {l.code === lang && <span style={{ color: "#059669", fontSize: 14 }}>\u2713</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, ShieldCheck, AlertCircle } from "lucide-react";

/**
 * Author portal login gate.
 *
 * Flow:
 *  1. Invite URL: https://ratedbrokers.com/author?token=<64 hex chars>
 *  2. Component reads ?token= from query → verifies via /api/author/me →
 *     on success, saves token to localStorage (rb_author_token) and redirects
 *     to /author/portal.
 *  3. On return visits (no ?token=), reads localStorage. If valid → redirect.
 *     If missing → show manual-paste input.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §7.1.
 */

const STORAGE_KEY = "rb_author_token";

export default function AuthorPortalLogin() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState("checking"); // checking | needs-token | verifying | error
  const [manualToken, setManualToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Verify a token against backend ───
  async function verifyToken(token) {
    const apiBase = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${apiBase}/api/author/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, token);
        navigate("/author/portal", { replace: true });
        return true;
      }
      const body = await res.json().catch(() => ({}));
      setErrorMsg(body.error || "Invalid or expired token");
      setState("error");
      return false;
    } catch (err) {
      setErrorMsg(err.message || "Network error");
      setState("error");
      return false;
    }
  }

  // On mount: prefer URL token, fall back to stored, else ask.
  // Strip ?token= from the URL immediately — regardless of verification outcome —
  // so failed invites don't linger in the address bar (copy, share, browser history).
  useEffect(() => {
    const urlToken = params.get("token");
    if (urlToken) {
      // Clean the URL first so the token is gone from history/back-button navigation.
      try {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, "", cleanUrl);
      } catch { /* non-browser env, ignore */ }
      setState("verifying");
      verifyToken(urlToken);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setState("verifying");
      verifyToken(stored);
      return;
    }
    setState("needs-token");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setState("verifying");
    verifyToken(manualToken.trim());
  }

  const shellStyle = {
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    background: "#f8fafc",
  };
  const cardStyle = {
    background: "#fff",
    borderRadius: 16,
    maxWidth: 480,
    width: "100%",
    padding: "32px 28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)",
  };

  if (state === "checking" || state === "verifying") {
    return (
      <div style={shellStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#059669" }}>
            <ShieldCheck size={20} />
            <span style={{ fontWeight: 700 }}>Verifying your access…</span>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div style={shellStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", marginBottom: 12 }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 700 }}>Access denied</span>
          </div>
          <p style={{ color: "#475569", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {errorMsg}. Check your invite link or paste your access token below.
          </p>
          <button
            onClick={() => { localStorage.removeItem(STORAGE_KEY); setState("needs-token"); setErrorMsg(""); }}
            style={{
              background: "#f59e0b", color: "#fff", border: "none",
              padding: "10px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
            }}
          >
            Enter access token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #059669, #047857)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LogIn size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>
              Author portal
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Enter your access token to continue</div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Access token</label>
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="64-character access token from your invite"
            autoComplete="off"
            spellCheck={false}
            style={{
              padding: "12px 14px", fontSize: 14, fontFamily: "SF Mono, Menlo, monospace",
              border: "1px solid #cbd5e1", borderRadius: 10, outline: "none",
              width: "100%", boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={!manualToken.trim()}
            style={{
              marginTop: 4,
              background: manualToken.trim() ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : "#cbd5e1",
              color: "#fff", border: "none",
              padding: "12px 18px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              cursor: manualToken.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            Sign in
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 18, lineHeight: 1.6 }}>
          Don't have a token? Access to the author portal is by invitation only.
          Contact the RatedBrokers editorial team to request access.
        </p>
      </div>
    </div>
  );
}

/**
 * Guard wrapper for routes under /author/portal.
 * If no valid token in localStorage, redirects to /author (login).
 */
export function RequireAuthorToken({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (!token) return <Navigate to="/author" replace />;
  return children;
}

export { STORAGE_KEY as AUTHOR_TOKEN_STORAGE_KEY };

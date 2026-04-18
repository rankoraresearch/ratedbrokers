import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { AUTHOR_TOKEN_STORAGE_KEY } from "./AuthorPortalLogin";

/**
 * Author portal dashboard — placeholder for Sprint 3.
 *
 * Sprint 5 will extend this with "My Submissions" table and "New Submission" form.
 * For now: shows author profile + sign-out, confirming auth flow works end-to-end.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §7.2.
 */
export default function AuthorPortal() {
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(AUTHOR_TOKEN_STORAGE_KEY);
    if (!token) {
      navigate("/author", { replace: true });
      return;
    }
    const apiBase = import.meta.env.VITE_API_URL || "";
    fetch(`${apiBase}/api/author/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setAuthor(data);
          setLoading(false);
        } else {
          // stale token — clear and redirect to login
          localStorage.removeItem(AUTHOR_TOKEN_STORAGE_KEY);
          navigate("/author", { replace: true });
        }
      })
      .catch((err) => {
        setError(err.message || "Network error");
        setLoading(false);
      });
  }, [navigate]);

  function signOut() {
    localStorage.removeItem(AUTHOR_TOKEN_STORAGE_KEY);
    navigate("/author", { replace: true });
  }

  const shellStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "#f8fafc",
    padding: "32px 16px",
  };
  const containerStyle = {
    maxWidth: 960, margin: "0 auto",
  };
  const cardStyle = {
    background: "#fff", borderRadius: 14, padding: "24px 28px",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
    marginBottom: 20,
  };

  if (loading) {
    return (
      <div style={shellStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={{ color: "#059669", display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={18} /> Loading your profile…
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={shellStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={{ color: "#dc2626", fontWeight: 700 }}>Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const scopes = author?.scopes || {};
  const scopeSummary = [
    scopes.reviews?.length ? `${scopes.reviews.length} review scope${scopes.reviews.length > 1 ? "s" : ""}` : null,
    scopes.rankings?.length ? `${scopes.rankings.length} ranking scope${scopes.rankings.length > 1 ? "s" : ""}` : null,
    scopes.cards?.length ? `${scopes.cards.length} card scope${scopes.cards.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ") || "no scopes assigned";

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          ...cardStyle,
          display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "linear-gradient(135deg, #059669, #047857)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>
                Hi, {author?.name || "author"}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {author?.role} · {scopeSummary} · default lang {author?.defaultLang}
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              background: "transparent", color: "#64748b",
              border: "1px solid #cbd5e1", padding: "8px 14px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {/* Sprint-3 placeholder — full UI lands in Sprint 5 */}
        <div style={cardStyle}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
            Author portal
          </div>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Your access is verified. The submissions dashboard (my submissions list and new-submission form)
            will appear here once Sprint 5 is shipped. Check back shortly — you'll be able to draft, save,
            and submit content for review directly from this page.
          </p>
        </div>
      </div>
    </div>
  );
}

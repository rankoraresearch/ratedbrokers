import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import {
  LogOut, User, Plus, ArrowLeft, FileText, Send, Trash2, Clock, CheckCircle,
  AlertCircle, XCircle, Pencil, RefreshCw,
} from "lucide-react";
import { AUTHOR_TOKEN_STORAGE_KEY } from "./AuthorPortalLogin";
import RANKINGS from "../data/rankings";

/**
 * Author Portal — full dashboard.
 *
 * Views (URL state via ?view=):
 *   - list     — My Submissions table (default)
 *   - new      — New Submission form
 *   - detail   — View a single submission (also sets ?id=)
 *   - edit     — Edit an existing draft (also sets ?id=)
 *
 * Auth: token from localStorage (seeded by AuthorPortalLogin.jsx). On any
 * 401 response → clear and redirect to /author.
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §7.2.
 */

const STATUS_META = {
  draft:         { label: "Draft",         color: "#64748b", bg: "#f1f5f9",  icon: FileText },
  submitted:     { label: "Submitted",     color: "#2563eb", bg: "#dbeafe",  icon: Clock },
  needs_changes: { label: "Needs changes", color: "#d97706", bg: "#fef3c7",  icon: AlertCircle },
  accepted:      { label: "Accepted",      color: "#059669", bg: "#d1fae5",  icon: CheckCircle },
  processed:     { label: "Processed",     color: "#047857", bg: "#a7f3d0",  icon: CheckCircle },
  published:     { label: "Published",     color: "#065f46", bg: "#34d399",  icon: CheckCircle },
  rejected:      { label: "Rejected",      color: "#dc2626", bg: "#fee2e2",  icon: XCircle },
  reverted:      { label: "Reverted",      color: "#7c3aed", bg: "#ede9fe",  icon: RefreshCw },
};

const TARGET_LABEL = {
  review:  "Broker Review",
  ranking: "Ranking Content",
  card:    "Broker Card",
};

// ═══════════════════════════════════════════════════════════════════════════
// API helper — single place to handle auth + 401 recovery
// ═══════════════════════════════════════════════════════════════════════════
function useApi(navigate) {
  const apiBase = import.meta.env.VITE_API_URL || "";
  return async function call(path, { method = "GET", body } = {}) {
    const token = localStorage.getItem(AUTHOR_TOKEN_STORAGE_KEY);
    if (!token) { navigate("/author", { replace: true }); throw new Error("no token"); }
    const res = await fetch(`${apiBase}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      localStorage.removeItem(AUTHOR_TOKEN_STORAGE_KEY);
      navigate("/author", { replace: true });
      throw new Error("token invalidated");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Ranking catalog lookups — enrich scope entries with display names
// ═══════════════════════════════════════════════════════════════════════════
const RANKING_BY_ID = Object.fromEntries(RANKINGS.map(r => [r.id, r]));

function rankingTitle(id) {
  return RANKING_BY_ID[id]?.title || id;
}

// ═══════════════════════════════════════════════════════════════════════════
// Styling shortcuts (inline CSS per project convention)
// ═══════════════════════════════════════════════════════════════════════════
const shell = {
  minHeight: "calc(100vh - 120px)",
  background: "#f8fafc",
  padding: "24px 16px",
};
const container = { maxWidth: 960, margin: "0 auto" };
const card = {
  background: "#fff", borderRadius: 14, padding: "20px 24px",
  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
  marginBottom: 16,
};
const label = { fontSize: 12, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6, display: "block" };
const input = {
  padding: "10px 12px", fontSize: 14, border: "1px solid #cbd5e1",
  borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box",
  fontFamily: "inherit",
};
const select = { ...input, background: "#fff" };
const btnPrimary = {
  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10,
  fontWeight: 700, fontSize: 14, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};
const btnSecondary = {
  background: "transparent", color: "#334155",
  border: "1px solid #cbd5e1", padding: "10px 16px", borderRadius: 10,
  fontWeight: 600, fontSize: 13, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};
const btnDanger = {
  background: "transparent", color: "#dc2626",
  border: "1px solid #fecaca", padding: "10px 16px", borderRadius: 10,
  fontWeight: 600, fontSize: 13, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: "#64748b", bg: "#f1f5f9", icon: FileText };
  const Icon = meta.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 10px", borderRadius: 8,
      background: meta.bg, color: meta.color,
      fontSize: 12, fontWeight: 700,
    }}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fee2e2", color: "#991b1b",
      padding: "10px 14px", borderRadius: 8, marginBottom: 12,
      fontSize: 13, display: "flex", alignItems: "center", gap: 8,
    }}>
      <AlertCircle size={16} /> {message}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════════
export default function AuthorPortal() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const api = useApi(navigate);
  const [author, setAuthor] = useState(null);
  const [targets, setTargets] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  // Bootstrap: profile + targets. `alive` guard avoids setState after unmount.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [me, t] = await Promise.all([
          api("/api/author/me"),
          api("/api/author/targets"),
        ]);
        if (!alive) return;
        setAuthor(me);
        setTargets(t);
      } catch (e) {
        if (alive) setLoadErr(e.message);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function signOut() {
    localStorage.removeItem(AUTHOR_TOKEN_STORAGE_KEY);
    navigate("/author", { replace: true });
  }

  function gotoView(view, id, extraParams) {
    const next = new URLSearchParams();
    next.set("view", view);
    if (id) next.set("id", String(id));
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        if (v != null && v !== "") next.set(k, String(v));
      }
    }
    setParams(next, { replace: false });
  }

  const view = params.get("view") || "list";
  const selectedId = params.get("id");

  if (loadErr) {
    return (
      <div style={shell}>
        <div style={container}>
          <div style={card}>
            <ErrorBanner message={loadErr} />
            <button onClick={signOut} style={btnSecondary}><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </div>
    );
  }
  if (!author) {
    return (
      <div style={shell}>
        <div style={container}>
          <div style={card}>Loading…</div>
        </div>
      </div>
    );
  }

  const scopeSummary = [
    targets?.reviews?.length ? `${targets.reviews.length} broker${targets.reviews.length > 1 ? "s" : ""}` : null,
    targets?.rankings?.length ? `${targets.rankings.length} ranking${targets.rankings.length > 1 ? "s" : ""}` : null,
    targets?.cards?.length ? `${targets.cards.length} card${targets.cards.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ") || "no scopes";

  return (
    <div style={shell}>
      <div style={container}>
        {/* ─── Header ─── */}
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #059669, #047857)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>
                Hi, {author.name}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {author.role} · {scopeSummary} · {author.defaultLang}
              </div>
            </div>
          </div>
          <button onClick={signOut} style={btnSecondary}><LogOut size={14} /> Sign out</button>
        </div>

        {/* ─── Views ─── */}
        {view === "list" && (
          <SubmissionList api={api} onOpen={(id) => gotoView("detail", id)} onNew={() => gotoView("new")} />
        )}
        {view === "new" && (
          <SubmissionForm api={api} targets={targets} defaultLang={author.defaultLang}
            onBack={() => gotoView("list")}
            onSaved={(id, flash) => gotoView("detail", id, flash ? { flash } : null)} />
        )}
        {view === "detail" && selectedId && (
          <SubmissionDetail api={api} id={selectedId}
            flashMessage={params.get("flash")}
            onClearFlash={() => {
              const next = new URLSearchParams(params);
              next.delete("flash");
              setParams(next, { replace: true });
            }}
            onBack={() => gotoView("list")} onEdit={() => gotoView("edit", selectedId)} />
        )}
        {view === "edit" && selectedId && (
          <SubmissionEdit api={api} id={selectedId} targets={targets}
            onBack={() => gotoView("detail", selectedId)} onSaved={() => gotoView("detail", selectedId)} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// List view
// ═══════════════════════════════════════════════════════════════════════════
function SubmissionList({ api, onOpen, onNew }) {
  const [rows, setRows] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const q = statusFilter ? `?status=${statusFilter}` : "";
        const data = await api(`/api/author/submissions${q}`);
        if (!alive) return;
        setRows(data);
        setErr("");
      } catch (e) { if (alive) setErr(e.message); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
          My submissions
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...select, width: "auto", padding: "7px 10px", fontSize: 12 }}>
            <option value="">All statuses</option>
            {Object.entries(STATUS_META).map(([k, m]) => (
              <option key={k} value={k}>{m.label}</option>
            ))}
          </select>
          <button onClick={onNew} style={btnPrimary}><Plus size={14} /> New submission</button>
        </div>
      </div>
      <ErrorBanner message={err} />
      {rows === null && <div style={{ color: "#64748b", fontSize: 13 }}>Loading…</div>}
      {rows !== null && rows.length === 0 && (
        <div style={{ color: "#64748b", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
          {statusFilter ? "No submissions with this status." : "No submissions yet. Click 'New submission' to start."}
        </div>
      )}
      {rows !== null && rows.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px" }}>Title / Target</th>
              <th style={{ textAlign: "left", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px" }}>Type</th>
              <th style={{ textAlign: "left", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px" }}>Status</th>
              <th style={{ textAlign: "right", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 10px" }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} onClick={() => onOpen(r.id)} style={{ cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px" }}>
                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
                    {r.title || <span style={{ color: "#94a3b8" }}>(untitled)</span>}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                    {r.target_slug}{r.target_section ? ` · ${r.target_section}` : ""}{r.target_ranking_broker ? ` · ${r.target_ranking_broker}` : ""} · {r.lang}
                  </div>
                </td>
                <td style={{ padding: "10px", fontSize: 13, color: "#334155" }}>{TARGET_LABEL[r.target_type]}</td>
                <td style={{ padding: "10px" }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: 12, color: "#64748b", fontFamily: "SF Mono, Menlo, monospace" }}>
                  {r.updated_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Create form (shared form logic with edit view)
// ═══════════════════════════════════════════════════════════════════════════
function FormFields({ targets, values, onChange, defaultLang, lockTarget = false }) {
  // Dependent fields must clear when their parent changes — otherwise a stale
  // target_slug from a previous target_type, or a stale target_ranking_broker
  // from a previous ranking, can pass client validation and hit backend 403.
  const set = (k, v) => {
    const next = { ...values, [k]: v };
    if (k === "target_type") {
      next.target_slug = "";
      next.target_section = "";
      next.target_ranking_broker = "";
    } else if (k === "target_slug") {
      // Only card needs a broker-per-ranking; ranking changes invalidate previous broker.
      if (values.target_type === "card") next.target_ranking_broker = "";
      // section is review-only and validated separately; keep.
    }
    onChange(next);
  };
  const targetType = values.target_type;
  const slug = values.target_slug;

  // Broker catalogs:
  //   - reviewBrokers: restricted to scope.reviews (used ONLY in review picker)
  //   - allBrokers: full catalog from /targets.brokers_all (used for card brokers)
  const reviewBrokers = targets?.reviews || [];
  const allBrokers = targets?.brokers_all || reviewBrokers;

  const availableRankings = useMemo(() => {
    const scope = targets?.rankings || [];
    if (scope.some(r => r.wildcard && r.id === "*")) return RANKINGS.map(r => ({ id: r.id, title: r.title }));
    return scope.filter(r => !r.wildcard).map(r => ({ id: r.id, title: rankingTitle(r.id) }));
  }, [targets]);

  // Card scope model (see SPEC §5):
  //   entry "*"                     → {wildcard: true, ranking_id: undefined}
  //   entry "<ranking>:*"           → {wildcard: true, ranking_id: <r>, broker_slug: "*"}
  //   entry "<ranking>:<broker>"    → {wildcard: false, ranking_id: <r>, broker_slug: <b>}
  const cardScopeAnalysis = useMemo(() => {
    const scope = targets?.cards || [];
    const global = scope.some(c => c.wildcard && !c.ranking_id);
    const perRanking = new Set(); // ranking ids that have "<r>:*"
    const specific = new Map();   // ranking_id → Set(broker slugs)
    for (const c of scope) {
      if (!c.ranking_id) continue;
      if (c.wildcard) perRanking.add(c.ranking_id);
      else {
        if (!specific.has(c.ranking_id)) specific.set(c.ranking_id, new Set());
        specific.get(c.ranking_id).add(c.broker_slug);
      }
    }
    return { global, perRanking, specific };
  }, [targets]);

  // Rankings available for card target (union of all scope entries).
  const cardRankings = useMemo(() => {
    if (cardScopeAnalysis.global) return RANKINGS.map(r => ({ id: r.id, title: r.title }));
    const ids = new Set([
      ...cardScopeAnalysis.perRanking,
      ...Array.from(cardScopeAnalysis.specific.keys()),
    ]);
    return Array.from(ids).map(id => ({ id, title: rankingTitle(id) }));
  }, [cardScopeAnalysis]);

  // Brokers available for the currently selected card ranking.
  const cardBrokersForSelectedRanking = useMemo(() => {
    if (!slug || targetType !== 'card') return [];
    if (cardScopeAnalysis.global) return allBrokers;
    if (cardScopeAnalysis.perRanking.has(slug)) return allBrokers;
    const specific = cardScopeAnalysis.specific.get(slug);
    if (!specific) return [];
    const set = new Set(specific);
    return allBrokers.filter(b => set.has(b.slug));
  }, [slug, targetType, allBrokers, cardScopeAnalysis]);

  // Target-type picker only offers categories the author actually has scope for.
  const availableTargetTypes = targets?.available_target_types
    || (["review", "ranking", "card"].filter(t =>
         t === "review" ? reviewBrokers.length :
         t === "ranking" ? (targets?.rankings?.length || 0) :
         (targets?.cards?.length || 0)));

  const TARGET_TYPE_LABEL = {
    review: "Broker review (one section)",
    ranking: "Ranking content (intro / key finding / outro / FAQ)",
    card: "Broker card inside a ranking",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={label}>Target type</label>
        <select value={targetType || ""} onChange={(e) => set("target_type", e.target.value)} style={select} disabled={lockTarget}>
          <option value="">Select…</option>
          {availableTargetTypes.map(t => (
            <option key={t} value={t}>{TARGET_TYPE_LABEL[t]}</option>
          ))}
        </select>
        {availableTargetTypes.length === 0 && (
          <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>
            You have no scopes assigned. Ask the editorial team to grant access.
          </div>
        )}
      </div>

      {targetType === "review" && (
        <>
          <div>
            <label style={label}>Broker</label>
            <select value={slug || ""} onChange={(e) => set("target_slug", e.target.value)} style={select} disabled={lockTarget}>
              <option value="">Select broker…</option>
              {reviewBrokers.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Section (optional — leave empty for full review)</label>
            <select value={values.target_section || ""} onChange={(e) => set("target_section", e.target.value)} style={select}>
              <option value="">(Full review)</option>
              {(targets?.sections || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </>
      )}

      {targetType === "ranking" && (
        <div>
          <label style={label}>Ranking</label>
          <select value={slug || ""} onChange={(e) => set("target_slug", e.target.value)} style={select} disabled={lockTarget}>
            <option value="">Select ranking…</option>
            {availableRankings.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </div>
      )}

      {targetType === "card" && (
        <>
          <div>
            <label style={label}>Ranking</label>
            <select value={slug || ""} onChange={(e) => set("target_slug", e.target.value)} style={select} disabled={lockTarget}>
              <option value="">Select ranking…</option>
              {cardRankings.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Broker in ranking</label>
            <select value={values.target_ranking_broker || ""}
              onChange={(e) => set("target_ranking_broker", e.target.value)} style={select} disabled={lockTarget}>
              <option value="">Select broker…</option>
              {cardBrokersForSelectedRanking.map(b => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            {slug && cardBrokersForSelectedRanking.length === 0 && (
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                No brokers in scope for this ranking.
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <label style={label}>Language</label>
        <select value={values.lang || defaultLang || "en"} onChange={(e) => set("lang", e.target.value)} style={select}>
          {(targets?.langs || ["en"]).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label style={label}>Title <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional, max 200)</span></label>
        <input type="text" value={values.title || ""} maxLength={200}
          onChange={(e) => set("title", e.target.value)} style={input} />
      </div>

      <div>
        <label style={label}>
          Body (Markdown){" "}
          <span style={{ fontWeight: 400, color: "#94a3b8" }}>
            {values.body_md ? `${values.body_md.length.toLocaleString()} chars · ~${countWords(values.body_md)} words` : "max 100 KB"}
          </span>
        </label>
        <textarea rows={22} value={values.body_md || ""}
          onChange={(e) => set("body_md", e.target.value)}
          style={{ ...input, fontFamily: "SF Mono, Menlo, monospace", fontSize: 13, lineHeight: 1.6, resize: "vertical" }}
          placeholder={values.target_type === "review"
            ? "Use `## Section: Costs` markers to split into multiple review sections, or stay within one section."
            : values.target_type === "ranking"
            ? "Structure: ## Intro, ## Key Finding, ## How We Ranked, ## Outro, ## FAQ (Q:/A: pairs)."
            : "Short description of this broker inside the ranking."}
        />
      </div>
    </div>
  );
}

function countWords(s) {
  if (!s) return 0;
  const stripped = String(s).replace(/[#*_`~\[\]()>]+/g, " ").replace(/\s+/g, " ").trim();
  return stripped ? stripped.split(" ").length : 0;
}

function validateBeforeSend(v) {
  if (!v.target_type) return "target type required";
  if (!v.target_slug) return "target required";
  if (v.target_type === "card" && !v.target_ranking_broker) return "broker required for card";
  if (!v.body_md || !v.body_md.trim()) return "body is required";
  if (new TextEncoder().encode(v.body_md).length > 100 * 1024) return "body exceeds 100 KB";
  if (v.title && v.title.length > 200) return "title too long";
  return null;
}

function SubmissionForm({ api, targets, defaultLang, onBack, onSaved }) {
  const [values, setValues] = useState({ lang: defaultLang || "en" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(action) {
    const problem = validateBeforeSend(values);
    if (problem) { setErr(problem); return; }
    setBusy(true);
    setErr("");
    let createdId = null;
    try {
      const created = await api("/api/author/submissions", {
        method: "POST",
        body: {
          target_type: values.target_type,
          target_slug: values.target_slug,
          target_section: values.target_type === "review" ? values.target_section || null : null,
          target_ranking_broker: values.target_type === "card" ? values.target_ranking_broker : null,
          lang: values.lang || defaultLang || "en",
          title: values.title || null,
          body_md: values.body_md,
        },
      });
      createdId = created.id;
      if (action === "submit") {
        try {
          await api(`/api/author/submissions/${createdId}`, {
            method: "PATCH",
            body: { action: "submit" },
          });
        } catch (submitErr) {
          // Draft already exists — route to detail view with flash-message
          // query param so the user sees why submit failed and can retry.
          onSaved(createdId, `Draft saved, but submit failed: ${submitErr.message}. Use "Submit for review" below to retry.`);
          return;
        }
      }
      onSaved(createdId);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={btnSecondary}><ArrowLeft size={14} /> Back</button>
        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
          New submission
        </div>
      </div>
      <ErrorBanner message={err} />
      <FormFields targets={targets} values={values} onChange={setValues} defaultLang={defaultLang} />
      <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
        <button onClick={() => save("draft")} disabled={busy} style={btnSecondary}>
          <FileText size={14} /> Save draft
        </button>
        <button onClick={() => save("submit")} disabled={busy} style={btnPrimary}>
          <Send size={14} /> Save & submit for review
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Detail view
// ═══════════════════════════════════════════════════════════════════════════
function SubmissionDetail({ api, id, onBack, onEdit, flashMessage, onClearFlash }) {
  const [sub, setSub] = useState(null);
  const [err, setErr] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api(`/api/author/submissions/${id}`);
        if (!alive) return;
        setSub(data);
        setErr("");
      } catch (e) { if (alive) setErr(e.message); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reloadKey]);
  const load = () => setReloadKey(k => k + 1);

  async function submit() {
    try {
      await api(`/api/author/submissions/${id}`, { method: "PATCH", body: { action: "submit" } });
      load();
    } catch (e) { setErr(e.message); }
  }

  async function remove() {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    try {
      await api(`/api/author/submissions/${id}`, { method: "DELETE" });
      onBack();
    } catch (e) { setErr(e.message); }
  }

  if (!sub) {
    return (
      <div style={card}>
        <button onClick={onBack} style={btnSecondary}><ArrowLeft size={14} /> Back</button>
        <ErrorBanner message={err} />
        {!err && <div style={{ color: "#64748b", marginTop: 12 }}>Loading…</div>}
      </div>
    );
  }

  const editable = sub.status === "draft" || sub.status === "needs_changes";
  const submittable = sub.status === "draft" || sub.status === "needs_changes";
  const deletable = sub.status === "draft";

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={btnSecondary}><ArrowLeft size={14} /> Back</button>
        <StatusBadge status={sub.status} />
      </div>
      <ErrorBanner message={err} />
      {flashMessage && (
        <div style={{
          background: "#fef3c7", color: "#92400e", padding: "10px 14px",
          borderRadius: 8, marginBottom: 12, fontSize: 13,
          display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{flashMessage}</span>
          </div>
          {onClearFlash && (
            <button onClick={onClearFlash} style={{
              background: "transparent", border: "none", color: "#92400e",
              cursor: "pointer", padding: 0, marginLeft: 8,
            }} aria-label="Dismiss">×</button>
          )}
        </div>
      )}

      <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 20, color: "#0f172a", margin: "0 0 4px" }}>
        {sub.title || <span style={{ color: "#94a3b8" }}>(untitled)</span>}
      </h2>
      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 14 }}>
        {TARGET_LABEL[sub.target_type]} · {sub.target_slug}
        {sub.target_section ? ` · ${sub.target_section}` : ""}
        {sub.target_ranking_broker ? ` · ${sub.target_ranking_broker}` : ""}
        {" · "}{sub.lang} · {sub.word_count} words
      </div>

      {sub.admin_notes && (
        <div style={{
          background: "#fef3c7", color: "#92400e",
          padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 13,
        }}>
          <strong>Admin notes:</strong> {sub.admin_notes}
        </div>
      )}

      <div style={{
        background: "#f8fafc", padding: "14px 20px", borderRadius: 10,
        fontSize: 14, lineHeight: 1.7,
        color: "#0f172a", marginBottom: 14,
        border: "1px solid #e2e8f0", maxHeight: 500, overflowY: "auto",
      }}>
        <div className="md-render">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{sub.body_md}</ReactMarkdown>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {editable && <button onClick={onEdit} style={btnSecondary}><Pencil size={14} /> Edit</button>}
        {submittable && <button onClick={submit} style={btnPrimary}><Send size={14} /> Submit for review</button>}
        {deletable && <button onClick={remove} style={btnDanger}><Trash2 size={14} /> Delete draft</button>}
      </div>

      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
        <div style={{ ...label, marginBottom: 10 }}>Timeline</div>
        {sub.events?.length ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sub.events.map(e => (
              <li key={e.id} style={{ fontSize: 13, color: "#475569", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                <span style={{ color: "#059669", fontWeight: 600 }}>{e.event}</span>
                {" · "}
                <span style={{ color: "#64748b" }}>{e.actor_type}</span>
                {e.notes ? <> · <em>{e.notes}</em></> : null}
                <span style={{ float: "right", color: "#94a3b8", fontFamily: "SF Mono, Menlo, monospace", fontSize: 12 }}>
                  {e.created_at}
                </span>
              </li>
            ))}
          </ul>
        ) : <div style={{ color: "#94a3b8", fontSize: 13 }}>No events.</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Edit view — patch an existing draft / needs_changes submission
// ═══════════════════════════════════════════════════════════════════════════
function SubmissionEdit({ api, id, targets, onBack, onSaved }) {
  const [values, setValues] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sub = await api(`/api/author/submissions/${id}`);
        if (!alive) return;
        setValues({
          target_type: sub.target_type,
          target_slug: sub.target_slug,
          target_section: sub.target_section || "",
          target_ranking_broker: sub.target_ranking_broker || "",
          lang: sub.lang,
          title: sub.title || "",
          body_md: sub.body_md,
        });
      } catch (e) { if (alive) setErr(e.message); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save(action) {
    const problem = validateBeforeSend(values);
    if (problem) { setErr(problem); return; }
    setBusy(true); setErr("");
    try {
      // Only body_md/title/target_section/lang are mutable per spec.
      await api(`/api/author/submissions/${id}`, {
        method: "PATCH",
        body: {
          title: values.title || null,
          body_md: values.body_md,
          target_section: values.target_type === "review" ? values.target_section || null : undefined,
          lang: values.lang,
          ...(action === "submit" ? { action: "submit" } : {}),
        },
      });
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!values) {
    return (
      <div style={card}>
        <button onClick={onBack} style={btnSecondary}><ArrowLeft size={14} /> Back</button>
        <ErrorBanner message={err} />
        {!err && (
          <div style={{ color: "#64748b", fontSize: 13, padding: "14px 0" }}>
            Loading submission…
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={btnSecondary}><ArrowLeft size={14} /> Back</button>
        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
          Edit submission
        </div>
      </div>
      <ErrorBanner message={err} />
      <FormFields targets={targets} values={values} onChange={setValues} defaultLang={values.lang} lockTarget />
      <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
        <button onClick={() => save("draft")} disabled={busy} style={btnSecondary}>
          <FileText size={14} /> Save changes
        </button>
        <button onClick={() => save("submit")} disabled={busy} style={btnPrimary}>
          <Send size={14} /> Save & submit
        </button>
      </div>
    </div>
  );
}

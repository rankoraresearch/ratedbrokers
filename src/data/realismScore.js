// Realism score for expert-candidate shortlist.
// Shared by scripts/s11-*.mjs and backend/src/routes/admin-authors.js.
// Methodology documented in EXPERT-CANDIDATES-REALISTIC-TOP50.md.

const TIER1_STAFF_OUTLETS = new Set([
  "bloomberg", "reuters", "wsj", "ft", "financialtimes",
  "cnbc", "nyt", "newyorktimes", "barrons",
]);
const ON_TOPIC_PRIMARY = new Set([
  "forex", "cfd", "broker-safety", "regulation", "trading-education",
]);
const ON_TOPIC_SECONDARY = new Set([
  "stocks", "options", "futures", "equity", "markets",
]);
const ON_TOPIC_CRYPTO = new Set([
  "crypto", "defi", "bitcoin", "blockchain",
]);
const ON_TOPIC_TERTIARY = new Set([
  "investing", "finance", "financial-journalism", "economics",
]);
const OFF_TOPIC = new Set([
  "personal-finance", "retirement", "banking", "savings",
  "credit-cards", "mortgages", "insurance", "tax",
]);
// Core finance credential prefixes. Matches "CFA" / "CFP" / "Series 7" but
// NOT "MS Finance", "IMC", "MSTA" etc. Also NOT non-CFA-Institute variants
// in parentheses (e.g. "CFA (ICFAI)" — a distinct Indian designation).
const CORE_CERT_PREFIX = /^(CFA|CFP|CMT|CPA|FINRA|Series\s?\d+|FRM|CTA|CAIA|CIM|CIPM)\b/i;
const NON_CORE_ISSUERS = /\b(ICFAI|ICFA\b)/i;

// Certifications in the source data are either {name, issuer, verified, ...}
// objects OR bare strings (e.g. Dan Kemp: ["IMC","SIDip","AFPC"]).
// This helper normalises both.
function normaliseCert(c) {
  if (typeof c === "string") return { name: c, issuer: null, verified: false };
  if (c && typeof c === "object") {
    return { name: c.name || "", issuer: c.issuer || null, verified: !!c.verified };
  }
  return { name: "", issuer: null, verified: false };
}

function isCoreCert(cert) {
  const n = cert.name || "";
  if (!CORE_CERT_PREFIX.test(n)) return false;
  if (NON_CORE_ISSUERS.test(n)) return false;
  return true;
}

export function hasVerifiedCoreCert(a) {
  const certs = Array.isArray(a.certifications) ? a.certifications.map(normaliseCert) : [];
  return certs.some(c => c.verified && isCoreCert(c));
}

function credentialsScore(a) {
  const certs = Array.isArray(a.certifications) ? a.certifications.map(normaliseCert) : [];
  if (!certs.length) return 10;
  if (certs.some(c => c.verified && isCoreCert(c))) return 100;
  if (certs.some(c => isCoreCert(c))) return 70;
  return 45;
}

function onTopicScore(a) {
  const beats = Array.isArray(a.beat) ? a.beat : (a.beat ? [a.beat] : []);
  if (!beats.length) return 25;
  let best = 0;
  for (const b of beats) {
    if (ON_TOPIC_PRIMARY.has(b)) best = Math.max(best, 100);
    else if (ON_TOPIC_SECONDARY.has(b)) best = Math.max(best, 80);
    else if (ON_TOPIC_CRYPTO.has(b)) best = Math.max(best, 70);
    else if (ON_TOPIC_TERTIARY.has(b)) best = Math.max(best, 55);
    else if (OFF_TOPIC.has(b)) best = Math.max(best, 20);
    else best = Math.max(best, 35);
  }
  return best;
}

function reachScore(a) {
  const tw = a.mediaSignals?.twitterFollowers ?? 0;
  const li = a.mediaSignals?.linkedinFollowers ?? 0;
  const combined = tw + li;
  if (!tw && !li) return 40;
  if (combined < 1000) return 35;
  if (combined < 10000) return 75;
  if (combined < 50000) return 100;
  if (combined < 200000) return 92;
  if (combined < 500000) return 55;
  if (combined < 1000000) return 25;
  return 10;
}

function bylineScore(a) {
  const years = a.yearsInIndustry ?? null;
  let y = 50;
  if (years != null) {
    if (years >= 15) y = 100;
    else if (years >= 10) y = 80;
    else if (years >= 5) y = 60;
    else if (years >= 2) y = 35;
    else y = 20;
  }
  const n = (a.writesFor?.length || 0);
  const siteBonus = n >= 5 ? 15 : n >= 2 ? 8 : 0;
  return Math.min(100, y + siteBonus);
}

function approachabilityScore(a) {
  const seniority = a.seniority || "";
  const writesFor = a.writesFor || [];
  const isTier1Staff = writesFor.some(s => TIER1_STAFF_OUTLETS.has(s)) &&
    ["chief", "senior", "staff", "editor", "executive"].includes(seniority);
  if (isTier1Staff) return 35;
  switch (seniority) {
    case "contributor":
    case "guest":
    case "former":
      return 100;
    case "editor":
      return 80;
    case "senior":
      return 65;
    case "staff":
    case "reporter":
      return 60;
    case "chief":
      return 50;
    case "executive":
      return 40;
    case "junior":
      return 75;
    default:
      return 60;
  }
}

function antiPatternPenalty(a) {
  let p = 0;
  const writesFor = a.writesFor || [];
  const seniority = a.seniority || "";
  if (writesFor.some(s => TIER1_STAFF_OUTLETS.has(s)) &&
      ["chief", "senior", "staff", "editor", "executive"].includes(seniority)) {
    p += 20;
  }
  const tw = a.mediaSignals?.twitterFollowers ?? 0;
  if (tw > 500000) p += 15;
  if (!a.linkedin && !a.email) p += 15;
  if (a.badge === "C") p += 10;
  // Realism is about people who will say yes. "chief" / "executive" titles
  // at non-Tier-1 outlets still carry baggage (in-house content teams, NDAs,
  // conflict rules) — small additional nudge so strong-cert chiefs don't
  // leap past strong-cert contributors in the top 15.
  if (["chief", "executive"].includes(seniority)) p += 5;
  return p;
}

export function calcRealismScore(a) {
  const sub = {
    credentials: credentialsScore(a),
    onTopic: onTopicScore(a),
    reach: reachScore(a),
    byline: bylineScore(a),
    approachability: approachabilityScore(a),
  };
  const weighted =
    sub.credentials * 0.25 +
    sub.onTopic * 0.25 +
    sub.reach * 0.15 +
    sub.byline * 0.15 +
    sub.approachability * 0.20;
  const penalty = antiPatternPenalty(a);
  const total = Math.max(0, weighted - penalty);
  return { total: Math.round(total * 10) / 10, sub, penalty };
}

// Candidate classification within shortlist (A-E).
export function classifyCandidate(a, breakdown) {
  const verifiedCore = hasVerifiedCoreCert(a);
  const onTopic = breakdown.onTopic >= 80;
  const approachable = breakdown.approachability >= 65;
  const hasAnyCert = Array.isArray(a.certifications) && a.certifications.length > 0;
  if (verifiedCore && onTopic && approachable) return "A";
  if (verifiedCore && approachable) return "B";
  if (onTopic && approachable && hasAnyCert) return "C";
  if (approachable) return "D";
  return "E";
}

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBrokerData } from "../data/brokers/index";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAuthorByName, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import AuthorAvatar from "../components/AuthorAvatar";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import RegulatorLogo from "../components/RegulatorLogo";
import PlatformLogo from "../components/PlatformLogo";
import { getRegulatorSlug } from "../data/regulators";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import TrustpilotLogo from "../components/TrustpilotLogo";
import { getPlatformSlugByName } from "../data/platforms/index";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon from "../components/Icon";
import { Check, X as XIcon, ArrowRight, ChevronRight, ChevronDown, ArrowUpRight, BarChart3, Wallet, MonitorSmartphone, Shield, ArrowUpDown, BookOpen, Users, UserCheck } from "lucide-react";
import HeroBand from "../components/HeroBand";
import { getVisitUrl } from "../utils/visitUrl";

function Stars({r,size=15}){ return <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:size,height:size,background:i<=Math.floor(r)?"#00B67A":i-0.5<=r?"linear-gradient(90deg,#00B67A 50%,#d1d5db 50%)":"#d1d5db",clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"}}/>)}</div>; }
function H2({id,children}){ return <h2 id={id} style={{fontFamily:"Outfit",fontSize:24,fontWeight:800,color:"#0f172a",marginBottom:14,marginTop:32,scrollMarginTop:80}}>{children}</h2>; }
function P({children}){ return <p style={{fontSize:16,color:"#374151",lineHeight:1.8,marginBottom:14}}>{children}</p>; }
function Card({children,style={}}){ return <div style={{background:"#fff",border:"1px solid #e8ecf1",borderRadius:12,padding:"22px",marginBottom:16,...style}}>{children}</div>; }

/* Wide rectangular wordmark logo for review hero.
   Uses logos-wide-dark/ (white text SVGs on navy bg). */
const WIDE_EXT = { "charles-schwab": "png" }; /* override for brokers without vector SVG */
const LOGO_BG_DEFAULT = "#0f172a";
function WideLogo({ slug, name, fallback, mob }) {
  const [err, setErr] = useState(false);
  const ext = WIDE_EXT[slug] || "svg";
  const h = mob ? 64 : 88;
  const w = mob ? 200 : 280;
  const bg = LOGO_BG_DEFAULT;
  if (err) {
    return (
      <div style={{ background: "#fff", borderRadius: 14, padding: 4, display: "inline-flex" }}>
        <BrokerLogo slug={slug} name={name} fallback={fallback} size={h} shape="brand" borderRadius={10} />
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", height: h, width: w, flexShrink: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <img
        src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.${ext}`}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setErr(true)}
        style={{ width: "70%", height: "70%", objectFit: "contain" }}
      />
    </div>
  );
}

function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

const DEEP_DIVE_TABS = [
  {id:"fees",label:"Fees & Spreads",Icon:BarChart3},
  {id:"min-deposit",label:"Minimum Deposit",Icon:Wallet},
  {id:"platforms",label:"Platforms",Icon:MonitorSmartphone},
  {id:"regulation",label:"Regulation",Icon:Shield},
  {id:"deposit",label:"Deposit & Withdrawal",Icon:ArrowUpDown},
  {id:"beginners",label:"For Beginners",Icon:BookOpen},
  {id:"alternatives",label:"Alternatives",Icon:Users},
  {id:"account",label:"Account Opening",Icon:UserCheck},
];

const SECTION_TO_TAB = {
  "trading-costs": { tab: "fees", label: "Fees & Spreads" },
  "account-types": { tab: "account", label: "Account Opening" },
  "regulation-&-safety": { tab: "regulation", label: "Regulation & Safety" },
  "deposit-&-withdrawal": { tab: "deposit", label: "Deposit & Withdrawal" },
  "platforms-&-tools": { tab: "platforms", label: "Trading Platforms" },
};

function CTA({ B, visitUrl, label, sub, compact }) {
  const href = visitUrl || B.url;
  return <div style={{background:"#0f172a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:compact?10:14,padding:compact?"14px 18px":"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,margin:"20px 0"}}>
    <div>{sub&&<div style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{sub}</div>}{!compact&&B.promo&&<div style={{fontSize:14,color:"#34d399",fontWeight:600,marginTop:2,display:"flex",alignItems:"center",gap:4}}><Icon name="lightbulb" size={14} color="#f59e0b" /> {B.promo}</div>}</div>
    <a href={href} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{background:"linear-gradient(135deg, #f59e0b, #fbbf24)",color:"#0f172a",fontSize:compact?13:14,fontWeight:700,textDecoration:"none",padding:compact?"10px 20px":"12px 28px",borderRadius:8,boxShadow:"0 2px 8px rgba(245,158,11,0.3)",display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap",flexShrink:0}}>{label||`Visit ${B.name}`}<svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
  </div>;
}

export default function BrokerReview() {
  const { slug } = useParams();
  const data = getBrokerData(slug);
  const { mob, tab } = useMedia();
  const { t, tc } = useTranslation();
  const lp = useLocalePath();
  const visitUrl = getVisitUrl(slug, data?.B?.url);
  const [openFaq, setOpenFaq] = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const cn = {maxWidth:1200,margin:"0 auto",padding:mob?"0 16px":"0 24px"};

  useEffect(()=>{
    const fn=()=>setStickyVisible(window.scrollY>500);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    window.scrollTo(0,0);
    if (data) {
      const verts = data.B.verticals || [];
      const titleSuffix = verts.includes("stocks") && !verts.includes("forex") ? "Commissions, Pros & Cons" : "Fees, Pros & Cons";
      document.title = `${data.B.name} Review 2026: ${titleSuffix} | RatedBrokers`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const hasSpread = data.B.spread && data.B.spread !== "N/A";
        const regs = data.B.regs.filter(r=>r.tier===1).map(r=>r.name).join(" + ") || "regulated";
        metaDesc.setAttribute("content", hasSpread
          ? `Is ${data.B.name} any good? Score: ${data.B.score}/10. Spreads from ${data.B.spread} pips, ${data.B.type} execution, ${regs} broker. Full expert review 2026.`
          : `Is ${data.B.name} any good? Score: ${data.B.score}/10. ${data.B.commission}. ${regs} regulated. Full expert review 2026.`
        );
      }
      const a = getAuthorByName(data.AUTHOR.name);
      const jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "FinancialService", name: data.B.name },
          author: {
            "@type": "Person",
            name: a.name,
            jobTitle: a.role,
            url: a.linkedin,
            sameAs: [a.linkedin],
            ...(a.credentials?.length ? {
              hasCredential: a.credentials.map(c => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Professional Certification",
                name: c,
              })),
            } : {}),
            ...(a.specialty ? { knowsAbout: a.specialty.split(", ") } : {}),
            ...(a.image ? { image: `https://ratedbrokers.com${a.image}` } : {}),
          },
          reviewRating: { "@type": "Rating", ratingValue: data.B.score, bestRating: 10 },
          publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
          datePublished: "2026-01-15",
          dateModified: "2026-02-28",
        },
        breadcrumbSchema((() => {
          const HUB_MAP_LD = { stocks: { l: "Stock Brokers", p: "/stock-trading" }, options: { l: "Options Brokers", p: "/options-trading" }, futures: { l: "Futures Brokers", p: "/futures-trading" } };
          const v = data.B.verticals || [];
          const h = HUB_MAP_LD[v.find(x => HUB_MAP_LD[x])] || { l: "Forex Brokers", p: "/forex-brokers" };
          return [{ label: "RatedBrokers", path: "/" }, { label: h.l, path: h.p }, { label: `${data.B.name} Review`, path: `/review/${slug}` }];
        })()),
      ];
      let el = document.querySelector('script[data-jsonld="review"]');
      if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.setAttribute("data-jsonld","review"); document.head.appendChild(el); }
      el.textContent = JSON.stringify(jsonLd);
    }
    return () => { const el = document.querySelector('script[data-jsonld="review"]'); if (el) el.remove(); };
  },[slug]);

  if (!data) return (
    <div style={{textAlign:"center",padding:"120px 24px",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <h1 style={{fontFamily:"Outfit",fontSize:32,fontWeight:800,color:"#0f172a",marginBottom:16}}>{t("review.notFoundTitle")}</h1>
      <p style={{color:"#374151",marginBottom:24}}>{t("review.notFoundDesc")}</p>
      <Link to={lp("/")} style={{color:"#059669",fontWeight:600,textDecoration:"none"}}>{t("review.backHome")}</Link>
    </div>
  );

  const { B, SCORES, ACCOUNTS, SPREADS, spreadCompetitors, DEPOSITS, TIMELINE, PROS, CONS, FAQ, AUTHOR, SIMILAR, costBoxes, trustpilotBars, content: enContent } = data;
  const author = getAuthorByName(AUTHOR.name);
  const authorEditor = getEditor();
  const authorReviewer = getReviewerForAuthor(author?.id);
  const authorFactChecker = getFactChecker(author?.id);

  // Merge translated content + normalize array fields
  const translated = tc(slug);
  const rawContent = {
    ...enContent,
    ...(translated?.content || {}),
  };
  // Some fields are used with .map() and must be arrays; others are strings
  const toArr = (v) => Array.isArray(v) ? v : (v ? [v] : []);
  const content = { ...rawContent };
  // These keys are rendered with .map() — ensure they're arrays
  for (const k of ["overview", "regulation", "costs", "spreads", "deposits", "platforms", "mobile", "support", "education", "verdict"]) {
    content[k] = toArr(rawContent[k]);
  }
  // These keys are used as strings — keep as-is (or first element if array)
  for (const k of ["scoring", "accountIntro", "accountOutro", "trustpilot", "country"]) {
    const v = rawContent[k];
    content[k] = Array.isArray(v) ? v[0] || "" : (v || "");
  }
  const pros = translated?.PROS || PROS;
  const cons = translated?.CONS || CONS;
  const faq = translated?.FAQ || FAQ;
  const scores = SCORES.map((s, i) => ({
    ...s,
    detail: translated?.SCORES?.[i]?.detail ?? s.detail,
  }));
  const verdict = translated?.verdict ?? B.verdict;
  const promo = translated?.promo ?? B.promo;

  const isStockBroker = (B.verticals || []).some(v => ["stocks", "options", "futures"].includes(v)) && !(B.verticals || []).includes("forex");
  const TOC = [
    t("toc.overview"), t("toc.scoring"), t("toc.proscons"), t("toc.accounts"), t("toc.regulation"),
    t("toc.costs"),
    ...(SPREADS.length > 0 ? [t("toc.spreads")] : []),
    t("toc.deposits"), t("toc.platforms"),
    ...(content.mobile.length > 0 ? [t("toc.mobile")] : []),
    ...(content.support.length > 0 ? [t("toc.support")] : []),
    ...(content.education.length > 0 ? [t("toc.education")] : []),
    t("toc.trustpilot"),
    ...(TIMELINE.length > 0 ? [t("toc.history")] : []),
    ...(content.country ? [t("toc.country")] : []),
    t("toc.verdict"), t("toc.alternatives"), t("toc.faq")
  ];

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#f8f9fb",color:"#111827"}}>
      {/* Breadcrumbs */}
      <div style={{...cn, padding: mob ? "10px 16px" : "14px 24px"}}>
        <Breadcrumb items={(() => {
          const HUB_MAP = {
            stocks: { label: "Stock Brokers", path: "/stock-trading" },
            options: { label: "Options Brokers", path: "/options-trading" },
            futures: { label: "Futures Brokers", path: "/futures-trading" },
          };
          const verts = B.verticals || [];
          const hub = HUB_MAP[verts.find(v => HUB_MAP[v])] || { label: "Forex Brokers", path: "/forex-brokers" };
          return [
            { label: "RatedBrokers", path: "/" },
            { label: hub.label, path: hub.path },
            { label: t("review.review2026", { name: B.name }) },
          ];
        })()} />
      </div>

      {/* Hero */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",gap:mob?20:32}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:mob?12:16,marginBottom:14}}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
                <WideLogo slug={slug} name={B.name} fallback={B.logo} mob={mob} />
              </a>
              <div>
                <h1 style={{fontFamily:"Outfit",fontSize:mob?22:28,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{t("review.review2026", { name: B.name })}</h1>
                <p style={{fontSize:mob?13:15,color:"rgba(255,255,255,0.6)"}}>{B.type} {t("review.broker")} {"\u00b7"} {t("review.est")} {B.year}{!mob&&` \u00b7 ${B.hq}`}</p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:mob?8:16,flexWrap:"wrap",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{background:"rgba(52,211,153,0.15)",border:"2px solid #34d399",borderRadius:8,padding:"4px 10px",fontFamily:"'JetBrains Mono'",fontSize:mob?16:18,fontWeight:800,color:"#34d399"}}>{B.score}</div>
                <span style={{fontSize:mob?12:14,fontWeight:600,color:"#34d399"}}>{verdict}</span>
              </div>
              {!mob&&<div style={{width:1,height:20,background:"rgba(255,255,255,0.15)"}}/>}
              <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}><TrustpilotLogo size="xs" onDark /><Stars r={B.tp} size={14}/><span style={{fontFamily:"'JetBrains Mono'",fontSize:14,fontWeight:700,color:"#fff"}}>{B.tp}</span><span style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>({B.tpCount.toLocaleString()})</span></a>
              {!mob&&<><div style={{width:1,height:20,background:"rgba(255,255,255,0.15)"}}/>
              <div style={{display:"flex",gap:4}}>{B.regs.filter(r=>r.tier===1).map(r=><RegBadge key={r.name} reg={r.name} onDark />)}</div></>}
              {B.badge&&<span style={{background:"rgba(52,211,153,0.15)",color:"#34d399",fontSize:mob?10:11,fontWeight:600,padding:"3px 10px",borderRadius:5,border:"1px solid rgba(110,231,183,0.3)"}}>{"\ud83c\udfc6"} {B.badge}</span>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:mob?"repeat(3,1fr)":"repeat(5,auto)",gap:mob?8:20}}>
              {(()=>{
                const v = B.verticals || [];
                const hasSpread = B.spread && B.spread !== "N/A";
                const regs = B.regs.filter(r=>r.tier===1).map(r=>r.name).join(" + ")||"Regulated";
                let stats;
                if (hasSpread) {
                  // Forex/CFD
                  stats = [{l:t("review.spread"),v:`${B.spread} pips`},{l:t("review.commission"),v:B.commission},{l:t("review.minDeposit"),v:`$${B.minDep}`},...(!mob?[{l:t("review.leverage"),v:B.leverage},{l:t("review.instruments"),v:B.instruments}]:[])];
                } else if (v.includes("futures") && !v.includes("stocks")) {
                  // Futures specialist
                  stats = [{l:"Commission",v:B.futuresCommission||B.commission},{l:"Day Margins",v:B.dayTradeMargins||"Exchange standard"},{l:t("review.minDeposit"),v:B.minDep===0?"$0":`$${B.minDep}`},...(!mob?[{l:"Regulation",v:regs}]:[])];
                } else if (v.includes("options") && !v.includes("stocks") && !v.includes("forex")) {
                  // Options specialist
                  stats = [{l:"Contract Fee",v:B.optionsContractFee||B.commission},{l:t("review.commission"),v:B.commission},{l:t("review.minDeposit"),v:B.minDep===0?"$0":`$${B.minDep}`},...(!mob?[{l:"Regulation",v:regs}]:[])];
                } else {
                  // Stocks / multi-type
                  stats = [{l:"Commission",v:B.commissionPerTrade||B.commission},{l:t("review.minDeposit"),v:B.minDep===0?"$0":`$${B.minDep}`},...(!mob?[{l:"Regulation",v:regs},{l:t("review.instruments"),v:B.instruments}]:[])];
                }
                return stats.map((x,i)=><div key={i} style={mob?{textAlign:"center",padding:"6px",background:"rgba(255,255,255,0.06)",borderRadius:6}:{}}>
                <div style={{fontSize:mob?10:12,color:"rgba(255,255,255,0.5)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>{x.l}</div>
                <div style={{fontSize:mob?14:15,color:"#fff",fontWeight:700}}>{x.v}</div></div>);
              })()}
            </div>
            {mob&&<a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg, #f59e0b, #fbbf24)",color:"#0f172a",fontSize:15,fontWeight:700,textDecoration:"none",padding:"12px",borderRadius:10,marginTop:14,boxShadow:"0 4px 12px rgba(245,158,11,0.3)"}}>{t("review.visit", { name: B.name })} <ArrowRight size={14} /></a>}
          </div>
          {!mob&&<div style={{width:tab?220:280,flexShrink:0,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:tab?"18px":"22px",textAlign:"center"}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",fontWeight:600,marginBottom:4}}>{t("review.ourRating")}</div>
            <div style={{fontFamily:"'JetBrains Mono'",fontSize:40,fontWeight:800,color:"#34d399",lineHeight:1}}>{B.score}</div>
            <div style={{fontSize:13,color:"#34d399",fontWeight:600,marginBottom:10}}>{verdict}</div>
            {promo&&<div style={{fontSize:12,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.08)",borderRadius:6,padding:"5px 8px",marginBottom:12,display:"flex",alignItems:"center",gap:4}}><Icon name="lightbulb" size={13} color="#f59e0b" /> {promo}</div>}
            <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg, #f59e0b, #fbbf24)",color:"#0f172a",fontSize:16,fontWeight:700,textDecoration:"none",padding:"13px 24px",borderRadius:10,width:"100%",boxShadow:"0 4px 12px rgba(245,158,11,0.3)"}}>{t("review.visit", { name: B.name })} <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:8}}>{B.riskWarning || t("review.retailLose")}</div>
          </div>}
        </div>
      </HeroBand>

      {/* COLLAPSIBLE TOC — mobile + tablet */}
      {(mob || tab) && (
        <div style={{...cn, paddingTop: 16, paddingBottom: 0}}>
          <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
            <button onClick={()=>setTocOpen(!tocOpen)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
              <span style={{fontFamily:"Outfit",fontSize:13,fontWeight:600,color:"#0f172a"}}>Contents</span>
              <ChevronDown size={16} color="#64748b" style={{transform:tocOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}} />
            </button>
            {tocOpen && (
              <div style={{padding:"0 16px 14px"}}>
                {TOC.map((tocItem,i)=>{
                  const id=tocItem.toLowerCase().replace(/[^a-z0-9]+/g,'-');
                  return <a key={i} href={`#${id}`} onClick={(e)=>{e.preventDefault();setTocOpen(false);document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}} style={{display:"block",fontSize:13,color:"#374151",textDecoration:"none",padding:"6px 12px",borderLeft:"2px solid #e2e8f0",lineHeight:1.4}}>{tocItem}</a>;
                })}
                <div style={{borderTop:"1px solid #e2e8f0",marginTop:10,paddingTop:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,paddingLeft:12}}>Deep Dive</div>
                  {DEEP_DIVE_TABS.map((dd,i)=>(
                    <Link key={i} to={lp(`/review/${slug}/${dd.id}`)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",textDecoration:"none",color:"#059669",fontSize:13,fontWeight:500}}>
                      <dd.Icon size={13} color="#059669" />{dd.id === "alternatives" ? `${B.name} Alternatives` : dd.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div style={{...cn,display:mob?"flex":"grid",flexDirection:"column",gridTemplateColumns:mob?"1fr":tab?"1fr 220px":"200px 1fr 260px",gap:mob?16:24,paddingTop:mob?20:28,paddingBottom:mob?40:64}}>
        {/* LEFT TOC */}
        {!mob&&!tab&&<aside style={{position:"sticky",top:70,alignSelf:"start"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>{t("review.contents")}</div>
          {TOC.map((tocItem,i)=>{const id=tocItem.toLowerCase().replace(/[^a-z0-9]+/g,'-');return <a key={i} href={`#${id}`} style={{display:"block",fontSize:13,color:"#374151",textDecoration:"none",padding:"5px 10px",borderLeft:"2px solid #e2e8f0",marginBottom:1,lineHeight:1.4}}>{tocItem}</a>;})}
        </aside>}

        {/* CENTER CONTENT */}
        <main>
          {/* Author */}
          <div style={{marginBottom:20}}>
            <AuthorCredits author={author} editor={authorEditor} reviewer={authorReviewer} factChecker={authorFactChecker} updatedDate={AUTHOR.updated} compact={mob} />
          </div>

          {/* OVERVIEW */}
          <H2 id="overview">{t("review.overview", { name: B.name })}</H2>
          {(content.overview || []).map((p,i)=><P key={i}>{p}</P>)}
          <CTA B={B} visitUrl={visitUrl} sub={t("review.readyToTrade", { name: B.name })} />

          {/* SCORES */}
          <H2 id="scoring-breakdown">{t("review.scoringBreakdown")}</H2>
          <P>{(content.scoring || "").replace("{score}",B.score)}</P>
          <Card style={{borderTop:"3px solid #0f172a",padding:0,overflow:"hidden"}}>
            <div style={{padding:"22px 22px 8px"}}>
            {scores.map((s,i)=>{
              const isTp = s.name.toLowerCase().includes("trustpilot");
              return <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                {isTp ? <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{fontSize:15,fontWeight:600,color:"#111827",textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>{s.name}<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#00B67A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a> : <span style={{fontSize:15,fontWeight:600,color:"#111827"}}>{s.name}</span>}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:"#64748b"}}>{s.weight}%</span>
                  <span style={{fontFamily:"'JetBrains Mono'",fontSize:15,fontWeight:800,color:s.score>=9.5?"#059669":"#0d9488"}}>{s.score}</span>
                </div>
              </div>
              <div style={{height:6,borderRadius:3,background:"#e8ecf1",marginBottom:4}}>
                <div style={{height:"100%",borderRadius:3,background:isTp?"linear-gradient(90deg,#00B67A,#00B67Aaa)":"linear-gradient(90deg,#059669,#059669aa)",width:`${(s.score/10)*100}%`}}/>
              </div>
              <div style={{fontSize:14,color:"#374151",lineHeight:1.6}}>{s.detail}</div>
            </div>})}
            </div>
            <div style={{background:"#0f172a",padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"Outfit",fontSize:16,fontWeight:700,color:"#fff"}}>{t("review.overallScore")}</span>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:24,fontWeight:800,color:"#34d399"}}>{B.score}/10</span>
            </div>
          </Card>

          {/* PROS & CONS */}
          <H2 id="pros-&-cons">{t("toc.proscons")}</H2>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:16}}>
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"20px"}}>
              <div style={{fontFamily:"Outfit",fontWeight:700,fontSize:15,color:"#059669",marginBottom:12}}>{t("review.pros")}</div>
              {pros.map((p,i)=><div key={i} style={{fontSize:14,color:"#111827",marginBottom:8,paddingLeft:16,position:"relative",lineHeight:1.5}}><span style={{position:"absolute",left:0,color:"#059669"}}>{"\u2022"}</span>{p}</div>)}
            </div>
            <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"20px"}}>
              <div style={{fontFamily:"Outfit",fontWeight:700,fontSize:15,color:"#dc2626",marginBottom:12}}>{t("review.cons")}</div>
              {cons.map((c,i)=><div key={i} style={{fontSize:14,color:"#111827",marginBottom:8,paddingLeft:16,position:"relative",lineHeight:1.5}}><span style={{position:"absolute",left:0,color:"#dc2626"}}>{"\u2022"}</span>{c}</div>)}
            </div>
          </div>

          {/* ACCOUNT TYPES */}
          <H2 id="account-types">{t("review.accountTypes")}</H2>
          <Link to={lp(`/review/${slug}/account`)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,0.12)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}><div style={{width:36,height:36,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} color="#059669" /></div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Deep Dive</div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{B.name} Account Opening</div></div><ArrowRight size={16} color="#059669" style={{flexShrink:0}} /></Link>
          <P>{content.accountIntro}</P>
          <Card style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{background:"#f8f9fb",borderBottom:"1px solid #e8ecf1"}}>
                {(()=>{
                  const showSpread = ACCOUNTS.some(a => a.spread && a.spread !== "N/A");
                  const cols = [t("table.account"), ...(showSpread ? [t("table.spreadFrom")] : []), t("table.commission"), t("table.minDeposit"), t("table.bestFor")];
                  return cols.map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:14,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"}}>{h}</th>);
                })()}
              </tr></thead>
              <tbody>{ACCOUNTS.map((a,i)=>{
                const showSpread = ACCOUNTS.some(x => x.spread && x.spread !== "N/A");
                return <tr key={i} style={{borderBottom:i<ACCOUNTS.length-1?"1px solid #f0f4f8":"none"}}>
                <td style={{padding:"12px 14px",fontWeight:600,color:"#111827"}}>{a.name}</td>
                {showSpread && <td style={{padding:"12px 14px",fontFamily:"'JetBrains Mono'",fontWeight:700,color:"#059669"}}>{a.spread}</td>}
                <td style={{padding:"12px 14px"}}>{a.commission}</td>
                <td style={{padding:"12px 14px"}}>${a.min}</td>
                <td style={{padding:"12px 14px",color:"#374151",fontSize:13}}>{a.best}</td>
              </tr>})}</tbody>
            </table>
          </Card>
          <P>{content.accountOutro}</P>

          {/* REGULATION */}
          <H2 id="regulation-&-safety">{t("review.regulationSafety")}</H2>
          <Link to={lp(`/review/${slug}/regulation`)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,0.12)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}><div style={{width:36,height:36,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} color="#059669" /></div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Deep Dive</div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{B.name} Regulation & Safety</div></div><ArrowRight size={16} color="#059669" style={{flexShrink:0}} /></Link>
          <P>{(content.regulation || [])[0]}</P>
          <Card style={{padding:0,overflow:"hidden"}}>
            {B.regs.map((r,i)=>{const rSlug=getRegulatorSlug(r.name);return <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:i<B.regs.length-1?"1px solid #f0f4f8":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {rSlug && <RegulatorLogo slug={rSlug} name={r.name} size={28} shape="icon" tier={r.tier} />}
                <span style={{background:r.tier===1?"#ecfdf5":"#fffbeb",color:r.tier===1?"#059669":"#d97706",fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:4,border:`1px solid ${r.tier===1?"#a7f3d0":"#fde68a"}`}}>Tier {r.tier}</span>
                {rSlug ? <Link to={lp(`/regulator/${rSlug}`)} style={{fontWeight:600,fontSize:15,color:"#111827",textDecoration:"none"}}>{r.name}</Link> : <span style={{fontWeight:600,fontSize:15}}>{r.name}</span>}
                <span style={{fontSize:13,color:"#64748b"}}>{r.country}</span>
              </div>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#374151"}}>#{r.num}</span>
            </div>;})}
          </Card>
          <P>{(content.regulation || [])[1]}</P>

          {/* TRADING COSTS */}
          <H2 id="trading-costs">{t("review.tradingCosts")}</H2>
          <Link to={lp(`/review/${slug}/fees`)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,0.12)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}><div style={{width:36,height:36,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} color="#059669" /></div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Deep Dive</div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{B.name} Fees & Spreads</div></div><ArrowRight size={16} color="#059669" style={{flexShrink:0}} /></Link>
          <P>{(content.costs || [])[0]}</P>
          {costBoxes.length > 0 && <Card>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr",gap:16,marginBottom:14}}>
              {costBoxes.map((x,i)=><div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:13,color:"#64748b",marginBottom:4}}>{x.l}</div>
                <div style={{fontFamily:"'JetBrains Mono'",fontSize:22,fontWeight:800,color:"#059669"}}>{x.v}</div>
                <div style={{fontSize:13,color:"#64748b"}}>{x.n}</div>
              </div>)}
            </div>
          </Card>}
          {(content.costs || []).slice(1).map((p,i)=><P key={i}>{p}</P>)}

          <CTA B={B} visitUrl={visitUrl} label={(() => {
            const v = B.verticals || [];
            if (v.includes("futures") && !v.includes("stocks") && !v.includes("forex")) return `Trade Futures with ${B.name}`;
            if (v.includes("options") && !v.includes("forex") && !v.includes("stocks")) return `Trade Options with ${B.name}`;
            if (v.includes("stocks") && !v.includes("forex")) return `Start Investing with ${B.name}`;
            return t("review.startTrading", { name: B.name });
          })()} sub={B.spread && B.spread !== "N/A" ? t("review.fromPips", { spread: B.spread }) : `${B.commission}`} compact />

          {/* LIVE SPREAD COMPARISON — only show if broker has spread data */}
          {SPREADS.length > 0 && <>
          <H2 id="live-spread-comparison">{t("review.liveSpread")}</H2>
          <P>{(content.spreads || [])[0]}</P>
          <Card style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"#f8f9fb",borderBottom:"1px solid #e8ecf1"}}>
                <th style={{textAlign:"left",padding:"9px 12px",fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{t("table.pair")}</th>
                {spreadCompetitors.map(h=><th key={h} style={{textAlign:"left",padding:"9px 12px",fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>)}
              </tr></thead>
              <tbody>{SPREADS.map((s,i)=><tr key={i} style={{borderBottom:i<SPREADS.length-1?"1px solid #f0f4f8":"none"}}>
                <td style={{padding:"9px 12px",fontWeight:600}}>{s.pair}</td>
                {s.values.map((v,j)=><td key={j} style={{padding:"9px 12px",fontFamily:"'JetBrains Mono'",fontWeight:j===0?700:400,color:j===0?"#059669":"inherit",background:j===0?"#f0fdf4":"transparent"}}>{v}</td>)}
              </tr>)}</tbody>
            </table>
          </Card>
          <P>{(content.spreads || [])[1]}</P>
          </>}

          {/* DEPOSIT & WITHDRAWAL */}
          <H2 id="deposit-&-withdrawal">{t("review.depositWithdrawal")}</H2>
          <Link to={lp(`/review/${slug}/deposit`)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,0.12)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}><div style={{width:36,height:36,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} color="#059669" /></div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Deep Dive</div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{B.name} Deposit & Withdrawal</div></div><ArrowRight size={16} color="#059669" style={{flexShrink:0}} /></Link>
          <P>{(content.deposits || [])[0]}</P>
          <Card style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{background:"#f8f9fb",borderBottom:"1px solid #e8ecf1"}}>
                {[t("table.method"),t("table.fee"),t("table.minimum"),t("table.processingTime")].map(h=><th key={h} style={{textAlign:"left",padding:"9px 14px",fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>{h}</th>)}
              </tr></thead>
              <tbody>{DEPOSITS.map((d,i)=><tr key={i} style={{borderBottom:i<DEPOSITS.length-1?"1px solid #f0f4f8":"none"}}>
                <td style={{padding:"10px 14px",fontWeight:600}}>{d.method}</td>
                <td style={{padding:"10px 14px",color:d.fee==="Free"?"#059669":"#111827",fontWeight:600}}>{d.fee}</td>
                <td style={{padding:"10px 14px"}}>{d.min}</td>
                <td style={{padding:"10px 14px",color:"#374151"}}>{d.time}</td>
              </tr>)}</tbody>
            </table>
          </Card>
          <P>{(content.deposits || [])[1]}</P>

          {/* PLATFORMS */}
          <H2 id="platforms-&-tools">{t("review.platformsTools")}</H2>
          <Link to={lp(`/review/${slug}/platforms`)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.boxShadow="0 2px 8px rgba(5,150,105,0.12)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}><div style={{width:36,height:36,borderRadius:8,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} color="#059669" /></div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Deep Dive</div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{B.name} Trading Platforms</div></div><ArrowRight size={16} color="#059669" style={{flexShrink:0}} /></Link>
          <P>{(content.platforms || [])[0]}</P>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":`repeat(${Math.min(B.platforms.length,4)},1fr)`,gap:10,marginBottom:16}}>
            {B.platforms.map((p,i)=>{const pSlug=getPlatformSlugByName(p);const inner=<><div style={{display:"flex",justifyContent:"center",marginBottom:8}}><PlatformLogo slug={pSlug} name={p} size={44} shape="icon" /></div><div style={{fontWeight:600,fontSize:14}}>{p}</div></>;return pSlug?<Link key={i} to={lp(`/platform/${pSlug}`)} style={{background:"#fff",border:"1px solid #e8ecf1",borderRadius:10,padding:"16px",textAlign:"center",textDecoration:"none",color:"#111827",transition:"border-color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e8ecf1"}}>{inner}</Link>:<div key={i} style={{background:"#fff",border:"1px solid #e8ecf1",borderRadius:10,padding:"16px",textAlign:"center"}}>{inner}</div>;})}
          </div>
          {(content.platforms || []).slice(1).map((p,i)=><P key={i}>{p}</P>)}

          {/* MOBILE TRADING — hide if no content */}
          {(content.mobile || []).length > 0 && <>
          <H2 id="mobile-trading">{t("review.mobileTrading")}</H2>
          {content.mobile.map((p,i)=><P key={i}>{p}</P>)}
          </>}

          {/* CUSTOMER SUPPORT — hide if no content */}
          {(content.support || []).length > 0 && <>
          <H2 id="customer-support">{t("review.customerSupport")}</H2>
          {content.support.map((p,i)=><P key={i}>{p}</P>)}
          </>}

          {/* EDUCATION — hide if no content */}
          {(content.education || []).length > 0 && <>
          <H2 id="education-&-research">{t("review.educationResearch")}</H2>
          {content.education.map((p,i)=><P key={i}>{p}</P>)}
          </>}

          <CTA B={B} visitUrl={visitUrl} label={t("review.visit", { name: B.name })} sub={t("review.openAccount")} />

          {/* TRUSTPILOT */}
          <H2 id="trustpilot-reviews">{t("review.trustpilotReviews")}</H2>
          <Card style={{display:"flex",alignItems:mob?"flex-start":"center",gap:mob?16:24,flexDirection:mob?"column":"row"}}>
            <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{textAlign:"center",flexShrink:0,textDecoration:"none",color:"inherit"}}>
              <div style={{marginBottom:6}}><TrustpilotLogo size="md"/></div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:36,fontWeight:800,color:"#111827"}}>{B.tp}</div>
              <Stars r={B.tp} size={18}/>
              <div style={{fontSize:13,color:"#64748b",marginTop:4}}>{B.tpCount.toLocaleString()} {t("review.reviews")}</div>
            </a>
            {!mob&&<div style={{width:1,height:60,background:"#e8ecf1"}}/>}
            {trustpilotBars.length > 0 && <div style={{flex:1,width:mob?"100%":"auto"}}>
              {trustpilotBars.map((x,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <span style={{fontSize:12,color:"#64748b",width:24}}>{x.s}</span>
                <div style={{flex:1,height:6,borderRadius:3,background:"#e8ecf1"}}><div style={{height:"100%",borderRadius:3,background:"#00B67A",width:`${x.p}%`}}/></div>
                <span style={{fontSize:12,color:"#374151",width:30,textAlign:"right"}}>{x.p}%</span>
              </div>)}
            </div>}
          </Card>
          <a href={getTrustpilotUrl(slug)} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,color:"#00B67A",textDecoration:"none",marginBottom:12}}>
            {t("review.readOnTrustpilot", {name: B.name})}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#00B67A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          {content.trustpilot && <P>{content.trustpilot}</P>}

          {/* HISTORY — hide if no timeline */}
          {TIMELINE.length > 0 && <>
          <H2 id="company-history">{t("review.companyHistory")}</H2>
          <div style={{position:"relative",paddingLeft:24,marginBottom:16}}>
            <div style={{position:"absolute",left:7,top:4,bottom:4,width:2,background:"#e2e8f0"}}/>
            {TIMELINE.map((tl,i)=><div key={i} style={{position:"relative",marginBottom:14,paddingLeft:16}}>
              <div style={{position:"absolute",left:-21,top:5,width:10,height:10,borderRadius:"50%",background:i===TIMELINE.length-1?"#059669":"#cbd5e1",border:"2px solid #fff"}}/>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{tl.year}</span>
              <span style={{fontSize:14,color:"#374151",marginLeft:8}}>{tl.event}</span>
            </div>)}
          </div>
          </>}

          {/* COUNTRY — hide if no content */}
          {content.country && <>
          <H2 id="country-availability">{t("review.countryAvailability")}</H2>
          <P>{content.country}</P>
          </>}

          {/* VERDICT */}
          <H2 id="expert-verdict">{t("review.expertVerdict")}</H2>
          <Card style={{background:"linear-gradient(135deg,#0f172a 0%,#0f2e24 100%)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <AuthorAvatar author={author} size={36} />
              <div><span style={{fontWeight:700,fontSize:15,color:"#fff"}}>{AUTHOR.name}</span><div style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{AUTHOR.role}</div></div>
            </div>
            {(content.verdict || []).map((p,i)=><p key={i} style={{fontSize:16,color:"rgba(255,255,255,0.85)",lineHeight:1.8,marginBottom:14}}>{p}</p>)}
            <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"linear-gradient(135deg, #f59e0b, #fbbf24)",color:"#0f172a",fontSize:15,fontWeight:700,textDecoration:"none",padding:"14px 28px",borderRadius:10,marginTop:8,width:"100%",boxShadow:"0 4px 12px rgba(245,158,11,0.3)"}}>{t("review.openAccountWith", { name: B.name })} <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",textAlign:"center",marginTop:8}}>{B.type} {"\u00b7"} {t("review.regulated")}</div>
          </Card>

          {/* ALTERNATIVES */}
          <H2 id="alternatives">{t("review.alternativesTitle", { name: B.name })}</H2>
          <P>{t("review.alternativesDesc", { name: B.name })}</P>
          {SIMILAR.map((b,i)=>{const altData=getBrokerData(b.slug);const altUrl=getVisitUrl(b.slug,altData?.B?.url);return <Card key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <Link to={lp(`/review/${b.slug}`)} style={{fontWeight:700,fontSize:16,color:"inherit",textDecoration:"none"}}
                onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}
              >{b.name}</Link>
              <div style={{fontSize:14,color:"#374151"}}>{b.type} {"\u00b7"} {b.spread && b.spread !== "N/A" && !b.spread.includes("$") && !b.spread.includes("€") ? `${t("home.from")} ${b.spread} ${t("home.pips")}` : b.spread && b.spread !== "N/A" ? b.spread : ""} {"\u00b7"} {b.why}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:16,fontWeight:800,color:"#059669"}}>{b.score}</span>
              <a href={altUrl} target="_blank" rel="noopener nofollow sponsored" style={{fontSize:13,color:"#fff",fontWeight:700,textDecoration:"none",padding:"6px 14px",borderRadius:6,background:"linear-gradient(135deg,#059669,#34d399)",display:"inline-flex",alignItems:"center",gap:4}}>Visit Site <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              <Link to={lp(`/review/${b.slug}`)} style={{fontSize:13,color:"#1e3a5f",fontWeight:600,textDecoration:"none",padding:"6px 14px",border:"1px solid #cbd5e1",borderRadius:6,display:"inline-flex",alignItems:"center",gap:4}}>{t("home.review")} <ArrowRight size={14} /></Link>
            </div>
          </Card>})}
          <Link to={lp(`/review/${slug}/alternatives`)} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:14,fontWeight:600,color:"#059669",textDecoration:"none",padding:"12px 20px",border:"2px solid #059669",borderRadius:10,marginTop:8,marginBottom:8}} onMouseEnter={e=>{e.currentTarget.style.background="#059669";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#059669"}}>See All Best {B.name} Alternatives <ArrowRight size={14} /></Link>

          {/* FAQ */}
          <H2 id="faq">{t("review.faq")}</H2>
          {faq.map((f,i)=><div key={i} style={{background:"#fff",border:"1px solid #e8ecf1",borderRadius:10,marginBottom:6,overflow:"hidden"}}>
            <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",textAlign:"left",background:"none",border:"none",padding:"14px 18px",cursor:"pointer",fontFamily:"DM Sans",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:600,fontSize:16,color:"#111827",flex:1,paddingRight:12}}>{f.q}</span>
              <span style={{color:"#64748b",fontSize:18,transform:openFaq===i?"rotate(45deg)":"none",transition:"transform 0.2s",flexShrink:0}}>+</span>
            </button>
            {openFaq===i&&<div style={{padding:"0 18px 14px",fontSize:16,color:"#374151",lineHeight:1.7}}>{f.a}</div>}
          </div>)}

          {/* Author Bio */}
          <div style={{marginTop:32}}>
            <AuthorBioCard author={author} />
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        {!mob&&<aside>
          <div style={{position:"sticky",top:70,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"#0f172a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"20px",textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:36,fontWeight:800,color:"#34d399",lineHeight:1}}>{B.score}</div>
              <div style={{fontSize:13,color:"#34d399",fontWeight:600,marginBottom:10}}>{verdict}</div>
              <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg, #f59e0b, #fbbf24)",color:"#0f172a",fontSize:15,fontWeight:700,textDecoration:"none",padding:"12px 20px",borderRadius:9,width:"100%",boxShadow:"0 4px 12px rgba(245,158,11,0.3)",marginBottom:6}}>{t("review.visit", { name: B.name })} {"\u2197"}</a>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{B.riskWarning || t("review.retailLose")}</div>
            </div>
            <Card style={{padding:"16px"}}>
              <div style={{fontFamily:"Outfit",fontWeight:700,fontSize:13,marginBottom:10}}>{t("review.quickFacts")}</div>
              {[{l:t("review.founded"),v:B.year},{l:t("review.hq"),v:B.hq},{l:t("review.deposit"),v:B.minDep===0?"$0":`$${B.minDep}`},...(B.spread&&B.spread!=="N/A"?[{l:t("review.spread"),v:`${B.spread} pips`}]:[{l:"Commission",v:B.commission}]),...(B.leverage&&B.leverage!=="N/A"?[{l:t("review.leverage"),v:B.leverage}]:[]),{l:t("review.type"),v:B.type},{l:t("review.instruments"),v:B.instruments}].map((x,i,arr)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<arr.length-1?"1px solid #f0f4f8":"none"}}>
                <span style={{fontSize:13,color:"#64748b"}}>{x.l}</span>
                <span style={{fontSize:13,color:"#111827",fontWeight:600}}>{x.v}</span>
              </div>)}
            </Card>
            <Card style={{padding:"16px"}}>
              <div style={{fontFamily:"Outfit",fontWeight:700,fontSize:13,marginBottom:10}}>{t("review.alternatives", { name: B.name })}</div>
              {SIMILAR.map((b,i)=>{const altData=getBrokerData(b.slug);const altUrl=getVisitUrl(b.slug,altData?.B?.url);return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<2?"1px solid #f0f4f8":"none"}}>
                <div><Link to={lp(`/review/${b.slug}`)} style={{fontWeight:600,fontSize:14,color:"inherit",textDecoration:"none"}}>{b.name}</Link><div style={{fontSize:12,color:"#64748b"}}>{b.type}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <a href={altUrl} target="_blank" rel="noopener nofollow sponsored" style={{fontSize:12,color:"#059669",fontWeight:600,textDecoration:"none"}}>Visit {"\u2197"}</a>
                  <Link to={lp(`/review/${b.slug}`)} style={{fontSize:12,color:"#1e3a5f",fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:3}}>{t("home.review")} <ArrowRight size={12} /></Link>
                </div>
              </div>})}
            </Card>
            <Card style={{padding:"16px",background:"#ecfdf5",border:"1px solid #a7f3d0"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Deep Dive</div>
              {DEEP_DIVE_TABS.map((dd,i)=>(
                <Link key={i} to={lp(`/review/${slug}/${dd.id}`)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:6,textDecoration:"none",color:"#0f172a",fontSize:12,fontWeight:500,marginBottom:2}} onMouseEnter={e=>{e.currentTarget.style.background="#059669";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#0f172a"}}>
                  <dd.Icon size={13} color="#059669" />{dd.id === "alternatives" ? `${B.name} Alternatives` : dd.label}
                </Link>
              ))}
            </Card>
          </div>
        </aside>}
      </div>

      {/* STICKY CTA BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
        transform: stickyVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "rgba(15, 23, 42, 0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: mob ? "10px 16px" : "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: mob ? 10 : 16,
        }}>
          <BrokerLogo slug={slug} name={B.name} fallback={B.logo} size={mob ? 32 : 36} shape="icon" />
          <span style={{
            fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 13 : 15,
            color: "#fff", whiteSpace: "nowrap",
          }}>
            {B.name}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
            fontSize: mob ? 14 : 16, color: "#34d399",
          }}>{B.score}</span>
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
            padding: mob ? "8px 16px" : "10px 24px", borderRadius: 8,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: "#0f172a", fontWeight: 700, fontSize: mob ? 13 : 14,
            textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
          }}>{t("review.visit", { name: B.name })} <span style={{ marginLeft: 4 }}>&rarr;</span></a>
        </div>
      </div>
    </div>
  );
}

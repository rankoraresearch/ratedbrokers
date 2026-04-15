import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useMedia } from "../hooks/useMedia";

// ============================
// DATA
// ============================

// 1) Direct broker-review competitors (our category)
const COMPETITORS = [
  { name: "BrokerChooser",        url: "https://brokerchooser.com",          region: "Global",      dr: 66, focus: "Forex, CFD, stocks — deep broker reviews, quiz" },
  { name: "ForexBrokers.com",     url: "https://www.forexbrokers.com",       region: "Global",      dr: 61, focus: "Forex-first reviews, annual awards (Reink Media)" },
  { name: "StockBrokers.com",     url: "https://www.stockbrokers.com",       region: "USA",         dr: null, focus: "US stock-broker reviews (sister to ForexBrokers.com)" },
  { name: "BestBrokers",          url: "https://bestbrokers.com",            region: "Global",      dr: 58, focus: "All broker types, multi-country rankings" },
  { name: "FXEmpire",             url: "https://www.fxempire.com",           region: "Global",      dr: 73, focus: "Forex + crypto news and broker reviews" },
  { name: "CompareForexBrokers",  url: "https://www.compareforexbrokers.com",region: "AU-focused",  dr: 69, focus: "Australia forex/CFD comparison" },
  { name: "TradersUnion",         url: "https://tradersunion.com",           region: "Global",      dr: 72, focus: "Forex reviews + copy-trading ratings" },
  { name: "FXScouts",             url: "https://fxscouts.com",               region: "Country-specific", dr: 30, focus: "Country-targeted forex reviews" },
  { name: "Investing.com — Brokers", url: "https://www.investing.com/brokers", region: "Global",    dr: 89, focus: "News portal with broker directory" },
  { name: "TheInvestorsCentre",   url: "https://www.theinvestorscentre.co.uk", region: "UK",        dr: null, focus: "UK broker reviews, safety/sub-pages focus" },
  { name: "DayTrading.com",       url: "https://www.daytrading.com",         region: "Global",      dr: null, focus: "Day-trading guides + broker reviews" },
  { name: "Forex Peace Army",     url: "https://www.forexpeacearmy.com",     region: "Global",      dr: null, focus: "User reviews + scam warnings" },
  { name: "WikiFX",               url: "https://www.wikifx.com",             region: "Asia/Global", dr: null, focus: "Regulatory database + Asian user reviews" },
  { name: "Myfxbook",             url: "https://www.myfxbook.com",           region: "Global",      dr: null, focus: "Signals + autotrading + broker ratings" },
  { name: "BabyPips",             url: "https://www.babypips.com",           region: "Global",      dr: null, focus: "Forex school — huge community + broker reviews" },
  { name: "AskTraders",           url: "https://www.asktraders.com",         region: "Global",      dr: null, focus: "Broker comparisons, trading guides" },
  { name: "Good Money Guide",     url: "https://www.goodmoneyguide.com",     region: "UK",          dr: null, focus: "UK-focused broker comparison" },
  { name: "Boring Money",         url: "https://www.boringmoney.co.uk",      region: "UK",          dr: null, focus: "UK investor guides + broker awards" },
  { name: "Modest Money",         url: "https://www.modestmoney.com",        region: "USA",         dr: null, focus: "Personal-finance blog + broker reviews" },
  { name: "BrokerNotes",          url: "https://brokernotes.co",             region: "Global",      dr: null, focus: "Broker comparison tables" },
  { name: "55Brokers",            url: "https://www.55brokers.com",          region: "Global",      dr: null, focus: "Forex broker reviews + comparisons" },
  { name: "BrokersView",          url: "https://www.brokersview.com",        region: "Asia/Global", dr: null, focus: "Broker reviews + risk alerts" },
  { name: "Brokervergleich",      url: "https://www.brokervergleich.de",     region: "DE",          dr: null, focus: "Germany broker comparison" },
  { name: "Broker-Test",          url: "https://www.broker-test.at",         region: "AT/DE",       dr: null, focus: "Austria/DE broker test portal" },
  { name: "Cashback Forex",       url: "https://www.cashbackforex.com",      region: "Global",      dr: null, focus: "Rebate site with broker directory" },
  { name: "Benzinga — Best Brokers", url: "https://www.benzinga.com/money/best-online-brokerage", region: "USA", dr: null, focus: "US-first broker listings (editorial arm)" },
];

// 2) General finance editorial (review brokers as part of personal-finance coverage)
const FINANCE_EDITORIAL = [
  { name: "NerdWallet",         url: "https://www.nerdwallet.com",           region: "USA",    dr: 90, focus: "Personal finance + broker reviews" },
  { name: "Bankrate",           url: "https://www.bankrate.com",             region: "USA",    dr: 90, focus: "Banking + investing guides" },
  { name: "Investopedia",       url: "https://www.investopedia.com",         region: "Global", dr: 92, focus: "Education + best-broker lists" },
  { name: "Morningstar",        url: "https://www.morningstar.com",          region: "Global", dr: null, focus: "Fund/ETF/broker research, advisor ratings" },
  { name: "Zacks",              url: "https://www.zacks.com",                region: "USA",    dr: null, focus: "Stock research + broker reviews" },
  { name: "Kiplinger",          url: "https://www.kiplinger.com",            region: "USA",    dr: null, focus: "Personal finance magazine" },
  { name: "Barron's",           url: "https://www.barrons.com",              region: "USA",    dr: null, focus: "Investing journalism, broker surveys" },
  { name: "MarketWatch",        url: "https://www.marketwatch.com",          region: "USA",    dr: null, focus: "Markets news + guides (Dow Jones)" },
  { name: "US News — Money",    url: "https://money.usnews.com",             region: "USA",    dr: null, focus: "Rankings & comparisons" },
  { name: "The Balance",        url: "https://www.thebalancemoney.com",      region: "USA",    dr: null, focus: "Personal finance education" },
  { name: "Money.com",          url: "https://money.com",                    region: "USA",    dr: null, focus: "Personal finance lifestyle" },
  { name: "Motley Fool",        url: "https://www.fool.com",                 region: "USA",    dr: null, focus: "Stock picking + broker reviews" },
  { name: "SmartAsset",         url: "https://smartasset.com",               region: "USA",    dr: null, focus: "Financial advisor/broker matching" },
  { name: "Money Under 30",     url: "https://www.moneyunder30.com",         region: "USA",    dr: null, focus: "Millennial personal finance" },
  { name: "MoneySavingExpert",  url: "https://www.moneysavingexpert.com",    region: "UK",     dr: null, focus: "UK consumer finance" },
  { name: "This is Money",      url: "https://www.thisismoney.co.uk",        region: "UK",     dr: null, focus: "UK investing news" },
  { name: "MoneyWeek",          url: "https://moneyweek.com",                region: "UK",     dr: null, focus: "UK investing magazine" },
  { name: "Investors' Chronicle", url: "https://www.investorschronicle.co.uk", region: "UK",  dr: null, focus: "UK stock & broker coverage (FT Group)" },
  { name: "Which? — Money",     url: "https://www.which.co.uk/money",        region: "UK",     dr: null, focus: "UK consumer champion reviews" },
];

// 3) Trading-focused media (traders read these daily)
const TRADING_MEDIA = [
  { name: "Benzinga",        url: "https://www.benzinga.com",         region: "USA",    dr: null, focus: "Markets news + trading education" },
  { name: "FXStreet",        url: "https://www.fxstreet.com",         region: "Global", dr: null, focus: "Forex news, signals, webinars" },
  { name: "DailyFX",         url: "https://www.dailyfx.com",          region: "Global", dr: null, focus: "Forex news & analysis (IG-owned)" },
  { name: "ForexLive",       url: "https://www.forexlive.com",        region: "Global", dr: null, focus: "Real-time forex news" },
  { name: "TradingView Blog",url: "https://www.tradingview.com/blog", region: "Global", dr: null, focus: "Charting platform editorial" },
  { name: "Finance Magnates",url: "https://www.financemagnates.com",  region: "Industry B2B", dr: null, focus: "Broker industry news" },
  { name: "LeapRate",        url: "https://www.leaprate.com",         region: "Industry B2B", dr: null, focus: "Forex industry news" },
  { name: "FinanceFeeds",    url: "https://financefeeds.com",         region: "Industry B2B", dr: null, focus: "FX/CFD industry news" },
  { name: "The Full FX",     url: "https://thefullfx.com",            region: "Industry B2B", dr: null, focus: "FX industry insight (Colin Lambert)" },
  { name: "FX-News Group",   url: "https://fxnewsgroup.com",          region: "Industry B2B", dr: null, focus: "FX/CFD industry tracker" },
  { name: "Investors Business Daily", url: "https://www.investors.com", region: "USA", dr: null, focus: "Stocks, CAN SLIM methodology" },
  { name: "Seeking Alpha",   url: "https://seekingalpha.com",         region: "USA",    dr: null, focus: "Stock analysis + contributor research" },
  { name: "ZeroHedge",       url: "https://www.zerohedge.com",        region: "Global", dr: null, focus: "Markets commentary (alt voice)" },
  { name: "Traders Magazine",url: "https://www.tradersmagazine.com",  region: "USA",    dr: null, focus: "Institutional/retail trading coverage" },
  { name: "Action Forex",    url: "https://www.actionforex.com",      region: "Global", dr: null, focus: "Forex technical analysis" },
  { name: "Finviz",          url: "https://finviz.com",               region: "USA",    dr: null, focus: "Stock screener + market heatmap" },
  { name: "Trading Economics",url: "https://tradingeconomics.com",    region: "Global", dr: null, focus: "Macro data + economic calendar" },
];

// 4) Tier-1 business press (broad financial media)
const TIER1_PRESS = [
  { name: "The Wall Street Journal", url: "https://www.wsj.com",        region: "USA",     dr: null, focus: "Flagship US business daily" },
  { name: "Financial Times",         url: "https://www.ft.com",         region: "UK/Global", dr: null, focus: "Global business & markets" },
  { name: "Bloomberg",               url: "https://www.bloomberg.com",  region: "Global", dr: null, focus: "Markets, data, terminals" },
  { name: "Reuters",                 url: "https://www.reuters.com",    region: "Global", dr: null, focus: "Newswire, markets coverage" },
  { name: "CNBC",                    url: "https://www.cnbc.com",       region: "Global", dr: null, focus: "Business TV + web" },
  { name: "CNN Business",            url: "https://edition.cnn.com/business", region: "Global", dr: null, focus: "Business & markets (CNN)" },
  { name: "Forbes",                  url: "https://www.forbes.com",     region: "Global", dr: null, focus: "Business magazine, Advisor broker lists" },
  { name: "Business Insider",        url: "https://www.businessinsider.com", region: "Global", dr: null, focus: "Business & tech news" },
  { name: "The Economist",           url: "https://www.economist.com",  region: "UK/Global", dr: null, focus: "Weekly analysis" },
  { name: "Yahoo Finance",           url: "https://finance.yahoo.com",  region: "Global", dr: null, focus: "Quotes + aggregated finance news" },
  { name: "Fortune",                 url: "https://fortune.com",        region: "USA",    dr: null, focus: "Business magazine" },
  { name: "The Guardian — Money",    url: "https://www.theguardian.com/money", region: "UK", dr: null, focus: "Consumer finance coverage" },
  { name: "The Telegraph — Money",   url: "https://www.telegraph.co.uk/money", region: "UK", dr: null, focus: "Investing & markets" },
  { name: "Handelsblatt",            url: "https://www.handelsblatt.com", region: "DE",   dr: null, focus: "Germany business daily" },
  { name: "Les Echos",               url: "https://www.lesechos.fr",    region: "FR",     dr: null, focus: "France business daily" },
  { name: "Nikkei Asia",             url: "https://asia.nikkei.com",    region: "JP/APAC", dr: null, focus: "Asia business daily" },
  { name: "South China Morning Post — Business", url: "https://www.scmp.com/business", region: "HK/APAC", dr: null, focus: "Asia markets coverage" },
  { name: "The Economic Times",      url: "https://economictimes.indiatimes.com", region: "IN", dr: null, focus: "India business daily" },
  { name: "Gulf News — Money",       url: "https://gulfnews.com/business", region: "UAE", dr: null, focus: "Gulf region business" },
];

// 5) Crypto-focused media & exchange rankers (relevant to our crypto broker coverage)
const CRYPTO_MEDIA = [
  { name: "CoinDesk",        url: "https://www.coindesk.com",        region: "Global", dr: null, focus: "Crypto journalism + consensus index" },
  { name: "Cointelegraph",   url: "https://cointelegraph.com",       region: "Global", dr: null, focus: "Crypto news" },
  { name: "The Block",       url: "https://www.theblock.co",         region: "Global", dr: null, focus: "Institutional crypto journalism" },
  { name: "Decrypt",         url: "https://decrypt.co",              region: "Global", dr: null, focus: "Crypto news + explainers" },
  { name: "CryptoSlate",     url: "https://cryptoslate.com",         region: "Global", dr: null, focus: "Crypto news + research" },
  { name: "Bitcoin Magazine",url: "https://bitcoinmagazine.com",     region: "Global", dr: null, focus: "Bitcoin-focused" },
  { name: "CoinMarketCap",   url: "https://coinmarketcap.com",       region: "Global", dr: null, focus: "Crypto prices + exchange rankings" },
  { name: "CoinGecko",       url: "https://www.coingecko.com",       region: "Global", dr: null, focus: "Crypto data + exchange trust scores" },
  { name: "Bitcompare",      url: "https://www.bitcompare.net",      region: "Global", dr: null, focus: "Crypto exchange/interest comparison" },
  { name: "CryptoCompare",   url: "https://www.cryptocompare.com",   region: "Global", dr: null, focus: "Exchange benchmark + data" },
];

// 6) Prop firm review sites (Phase 3 — Prop Firms vertical incoming)
const PROP_FIRM_SITES = [
  { name: "PropFirmMatch",   url: "https://www.propfirmmatch.com",   region: "Global", dr: null, focus: "Prop firm comparison + reviews" },
  { name: "PropFirms.com",   url: "https://propfirms.com",           region: "Global", dr: null, focus: "Prop firm reviews" },
  { name: "Funded Trading Plus Blog", url: "https://fundedtradingplus.com/blog", region: "Global", dr: null, focus: "Prop firm perspective (vendor)" },
  { name: "PropFirmApp",     url: "https://propfirmapp.com",         region: "Global", dr: null, focus: "Prop firm directory" },
  { name: "Traders With Edge", url: "https://www.traderswithedge.com", region: "Global", dr: null, focus: "Prop reviews + trading education" },
  { name: "Lux Trading Firm Blog", url: "https://www.luxtradingfirm.com/blog", region: "Global", dr: null, focus: "Prop firm blog (vendor angle)" },
];

// ============================
// STYLES
// ============================
const palette = {
  navy: "#0f172a",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  text: "#334155",
  muted: "#64748b",
  link: "#047857",
};

// ============================
// PAGE
// ============================
export default function CompetitorsResearchPage() {
  const { mob } = useMedia();

  useSEO({
    title: "Competitor & Media Research — Internal",
    description: "Internal research: direct competitors and financial media covering brokers.",
    path: "/research/competitors",
  });

  // Inject noindex (useSEO doesn't support it; manage manually, cleanup on unmount)
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    meta.setAttribute("data-seo-noindex", "1");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{
        background: `linear-gradient(135deg, ${palette.navy} 0%, #047857 100%)`,
        color: "#fff",
        padding: mob ? "28px 16px 32px" : "44px 24px 52px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(251, 191, 36, 0.15)",
            color: "#fbbf24",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            Internal · noindex
          </div>
          <h1 style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: mob ? 26 : 36,
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: -0.3,
          }}>
            Competitor &amp; Financial Media Map
          </h1>
          <p style={{
            marginTop: 10,
            fontSize: mob ? 14 : 16,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 780,
          }}>
            Internal research page. Four layers of the ecosystem RatedBrokers competes with or
            gets covered by: direct broker-review competitors, general personal-finance editorial,
            trading-focused media, and tier-1 business press.
          </p>
          <div style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
          }}>
            Last updated 2026-04-15 · DR values from Ahrefs pull (AHREFS-DATA-LOG.md) where available
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: mob ? "20px 12px 48px" : "28px 24px 64px" }}>
        <Section
          idx={1}
          title="Direct broker-review competitors"
          subtitle="Same search intent as us: users looking for ranked broker lists, reviews, comparisons."
          count={COMPETITORS.length}
          rows={COMPETITORS}
          mob={mob}
          showDR
        />
        <Section
          idx={2}
          title="General finance editorial"
          subtitle="Broad personal-finance sites that publish broker/investing reviews alongside banking, credit, taxes."
          count={FINANCE_EDITORIAL.length}
          rows={FINANCE_EDITORIAL}
          mob={mob}
          showDR
        />
        <Section
          idx={3}
          title="Trading-focused media"
          subtitle="Traders read these daily. Not strictly comparison sites, but they carry broker content and sponsored coverage."
          count={TRADING_MEDIA.length}
          rows={TRADING_MEDIA}
          mob={mob}
        />
        <Section
          idx={4}
          title="Tier-1 business press"
          subtitle="Major financial and business publications. High authority, broad audience, occasionally cover brokers and retail investing."
          count={TIER1_PRESS.length}
          rows={TIER1_PRESS}
          mob={mob}
        />
        <Section
          idx={5}
          title="Crypto-focused media & exchange rankers"
          subtitle="Relevant to our crypto-broker coverage. Journalism + independent exchange trust-score/ranking platforms."
          count={CRYPTO_MEDIA.length}
          rows={CRYPTO_MEDIA}
          mob={mob}
        />
        <Section
          idx={6}
          title="Prop firm review sites"
          subtitle="Separate vertical, but adjacent. Phase 3 on our roadmap — listed so we can map the landscape before entering."
          count={PROP_FIRM_SITES.length}
          rows={PROP_FIRM_SITES}
          mob={mob}
        />

        <div style={{
          marginTop: 28,
          padding: "14px 16px",
          background: palette.borderLight,
          borderRadius: 10,
          fontSize: 12,
          color: palette.muted,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: palette.navy }}>Notes.</strong>{" "}
          Region field = primary editorial audience. DR (Domain Rating) is Ahrefs'
          0–100 authority metric — only populated where pulled (see{" "}
          <code style={{ fontSize: 11, background: "#fff", padding: "1px 5px", borderRadius: 4 }}>
            AHREFS-DATA-LOG.md
          </code>
          ). Missing DR ≠ low authority — just not yet fetched.
        </div>
      </div>
    </div>
  );
}

// ============================
// SECTION + TABLE
// ============================
function Section({ idx, title, subtitle, count, rows, mob, showDR }) {
  return (
    <section style={{ marginTop: idx === 1 ? 0 : 40 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28, height: 28,
          borderRadius: 8,
          background: palette.navy,
          color: "#fbbf24",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "Outfit, sans-serif",
        }}>
          {idx}
        </div>
        <h2 style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 700,
          fontSize: mob ? 19 : 22,
          color: palette.navy,
          margin: 0,
          letterSpacing: -0.2,
        }}>
          {title}
        </h2>
        <span style={{
          fontSize: 12,
          color: palette.muted,
          fontWeight: 500,
          background: palette.borderLight,
          padding: "2px 8px",
          borderRadius: 999,
        }}>
          {count} sites
        </span>
      </div>
      <p style={{
        margin: "6px 0 14px",
        fontSize: mob ? 13 : 14,
        color: palette.muted,
        lineHeight: 1.55,
        maxWidth: 820,
      }}>
        {subtitle}
      </p>

      <div style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: mob ? 13 : 14,
            minWidth: mob ? 640 : "auto",
          }}>
            <thead>
              <tr style={{ background: palette.borderLight }}>
                <Th style={{ width: 48 }}>#</Th>
                <Th>Name</Th>
                <Th>URL</Th>
                <Th style={{ width: 140 }}>Region</Th>
                {showDR && <Th style={{ width: 64, textAlign: "right" }}>DR</Th>}
                <Th>Editorial focus</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.url} style={{ borderTop: `1px solid ${palette.borderLight}` }}>
                  <Td style={{ color: palette.muted, fontWeight: 600 }}>{i + 1}</Td>
                  <Td style={{ fontWeight: 600, color: palette.navy }}>{r.name}</Td>
                  <Td>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener nofollow noreferrer"
                      style={{
                        color: palette.link,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {shortDomain(r.url)}
                      <ExternalLink size={12} strokeWidth={2.2} />
                    </a>
                  </Td>
                  <Td style={{ color: palette.text }}>{r.region}</Td>
                  {showDR && (
                    <Td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: r.dr != null ? palette.navy : palette.muted, fontWeight: r.dr != null ? 600 : 400 }}>
                      {r.dr != null ? r.dr : "—"}
                    </Td>
                  )}
                  <Td style={{ color: palette.text, lineHeight: 1.5 }}>{r.focus}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Th({ children, style }) {
  return (
    <th style={{
      padding: "10px 12px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      ...style,
    }}>
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return (
    <td style={{
      padding: "10px 12px",
      verticalAlign: "top",
      ...style,
    }}>
      {children}
    </td>
  );
}

function shortDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return url;
  }
}

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./i18n/LanguageContext";

// ─── Production pages (lazy loaded) ───
const Home = lazy(() => import("./pages/Home"));
const CountryPage = lazy(() => import("./pages/CountryPage"));
const OnlineBrokersByCountry = lazy(() => import("./pages/OnlineBrokersByCountry"));
const BrokerReview = lazy(() => import("./pages/BrokerReview"));
const BrokerComparison = lazy(() => import("./pages/BrokerComparison"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const Methodology = lazy(() => import("./pages/Methodology"));
const AllReviewsPage = lazy(() => import("./pages/AllReviewsPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const RegulatorPage = lazy(() => import("./pages/RegulatorPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const PlatformPage = lazy(() => import("./pages/PlatformPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HowWeMakeMoneyPage = lazy(() => import("./pages/HowWeMakeMoneyPage"));
const TrustScorePage = lazy(() => import("./pages/TrustScorePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AllGuidesPage = lazy(() => import("./pages/AllGuidesPage"));
const AllRankingsPage = lazy(() => import("./pages/AllRankingsPage"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const AuthorPortalLogin = lazy(() => import("./pages/AuthorPortalLogin"));
const AuthorPortal = lazy(() => import("./pages/AuthorPortal"));

// Inline route-level guard. Kept out of the lazy-loaded login chunk so it
// does not pull AuthorPortalLogin.jsx into the main bundle.
function RequireAuthorToken({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("rb_author_token") : null;
  if (!token) return <Navigate to="/author" replace />;
  return children;
}
const BrokerSubPage = lazy(() => import("./pages/BrokerSubPage"));
const WarningPage = lazy(() => import("./pages/WarningPage"));
const FindYourBrokerPage = lazy(() => import("./pages/FindYourBrokerPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CompetitorsResearchPage = lazy(() => import("./pages/CompetitorsResearchPage"));
const AuthorsResearchPage = lazy(() => import("./pages/AuthorsResearchPage"));

// ─── Prototypes (lazy, dev-only — excluded from production bundle) ───
const LogoLab = import.meta.env.DEV ? lazy(() => import("./pages/LogoLabDotCom")) : null;
const RankingProto = import.meta.env.DEV ? lazy(() => import("./pages/RankingProto")) : null;
const RankingProtoB = import.meta.env.DEV ? lazy(() => import("./pages/RankingProtoB")) : null;
const RankingProtoC = import.meta.env.DEV ? lazy(() => import("./pages/RankingProtoC")) : null;
const CardProto = import.meta.env.DEV ? lazy(() => import("./pages/CardProto")) : null;
const RankingProtoWide = import.meta.env.DEV ? lazy(() => import("./pages/RankingProtoWide")) : null;
const LightThemeProto = import.meta.env.DEV ? lazy(() => import("./pages/LightThemeProto")) : null;
const ButtonLogoProto = import.meta.env.DEV ? lazy(() => import("./pages/ButtonLogoProto")) : null;
const SubPagesProto = import.meta.env.DEV ? lazy(() => import("./pages/SubPagesProto")) : null;
const SafetyProto = import.meta.env.DEV ? lazy(() => import("./pages/SafetyProto")) : null;
const RankingHeroProtos = import.meta.env.DEV ? lazy(() => import("./pages/RankingHeroProtos")) : null;
const HeroButtonsProto = import.meta.env.DEV ? lazy(() => import("./pages/HeroButtonsProto")) : null;
const ScoreBadgeProto = import.meta.env.DEV ? lazy(() => import("./pages/ScoreBadgeProto")) : null;
const QuizPreviewProto = import.meta.env.DEV ? lazy(() => import("./pages/QuizPreviewProto")) : null;
const HowWeRateProto = import.meta.env.DEV ? lazy(() => import("./pages/HowWeRateProto")) : null;
const HowWeRateDarkProto = import.meta.env.DEV ? lazy(() => import("./pages/HowWeRateDarkProto")) : null;
const LinkSystemProto = import.meta.env.DEV ? lazy(() => import("./pages/LinkSystemProto")) : null;
const AuthorProto = import.meta.env.DEV ? lazy(() => import("./pages/AuthorProto")) : null;
const FlagsProto = import.meta.env.DEV ? lazy(() => import("./pages/FlagsProto")) : null;
const MenuProtoV2 = import.meta.env.DEV ? lazy(() => import("./pages/MenuProtoV2")) : null;
const MenuCountriesProto = import.meta.env.DEV ? lazy(() => import("./pages/MenuCountriesProto")) : null;

function PageLoader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Layout() {
  return (
    <LanguageProvider>
      <Header />
      <div style={{ paddingTop: 64 }}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </LanguageProvider>
  );
}

/** Redirect old /review/:slug → /reviews/:slug (preserves tab if present) */
function ReviewRedirect() {
  const { slug, tab } = useParams();
  return <Navigate to={tab ? `/reviews/${slug}/${tab}` : `/reviews/${slug}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ─── Prototypes (dev-only, gated by import.meta.env.DEV) ─── */}
      {import.meta.env.DEV && <>
        <Route path="logo-lab" element={<Suspense fallback={<PageLoader />}><LogoLab /></Suspense>} />
        <Route path="proto/ranking" element={<Layout />}><Route index element={<RankingProto />} /></Route>
        <Route path="proto/ranking-b" element={<Layout />}><Route index element={<RankingProtoB />} /></Route>
        <Route path="proto/ranking-c" element={<Layout />}><Route index element={<RankingProtoC />} /></Route>
        <Route path="proto/card" element={<Layout />}><Route index element={<CardProto />} /></Route>
        <Route path="proto/ranking-wide" element={<Layout />}><Route index element={<RankingProtoWide />} /></Route>
        <Route path="proto/light-theme" element={<Layout />}><Route index element={<LightThemeProto />} /></Route>
        <Route path="proto/buttons" element={<Suspense fallback={<PageLoader />}><ButtonLogoProto /></Suspense>} />
        <Route path="proto/subpages" element={<Layout />}><Route index element={<SubPagesProto />} /></Route>
        <Route path="proto/ranking-hero" element={<Layout />}><Route index element={<RankingHeroProtos />} /></Route>
        <Route path="proto/hero-buttons" element={<Layout />}><Route index element={<HeroButtonsProto />} /></Route>
        <Route path="proto/score-badge" element={<Layout />}><Route index element={<ScoreBadgeProto />} /></Route>
        <Route path="proto/safety" element={<Layout />}><Route index element={<SafetyProto />} /></Route>
        <Route path="proto/quiz-preview" element={<Suspense fallback={<PageLoader />}><QuizPreviewProto /></Suspense>} />
        <Route path="proto/how-we-rate" element={<Suspense fallback={<PageLoader />}><HowWeRateProto /></Suspense>} />
        <Route path="proto/how-we-rate-dark" element={<Layout />}><Route index element={<HowWeRateDarkProto />} /></Route>
        <Route path="proto/link-system" element={<Layout />}><Route index element={<LinkSystemProto />} /></Route>
        <Route path="proto/author" element={<Layout />}><Route index element={<AuthorProto />} /></Route>
        <Route path="proto/flags" element={<Layout />}><Route index element={<FlagsProto />} /></Route>
        <Route path="proto/menu-v2" element={<Suspense fallback={<PageLoader />}><MenuProtoV2 /></Suspense>} />
        <Route path="proto/menu-countries" element={<Suspense fallback={<PageLoader />}><MenuCountriesProto /></Suspense>} />
      </>}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="uk" element={<Navigate to="/best-forex-brokers-uk" replace />} />
        <Route path="best-brokers-by-country" element={<OnlineBrokersByCountry />} />
        {/* S9 rebrand: redirect old URL (в dev без CF _redirects) */}
        <Route path="brokers-by-country" element={<Navigate to="/best-brokers-by-country" replace />} />
        {/* F2 explicit 404: Sprint F2 удалил legacy URL. Без этой строки wildcard ниже */}
        {/* поймает его как countrySlug="by-country" → soft-404 через CountryPage Navigate. */}
        <Route path="best-forex-brokers-by-country" element={<NotFoundPage />} />
        <Route path="best-forex-brokers-:countrySlug" element={<CountryPage />} />
        <Route path="reviews/:slug" element={<BrokerReview />} />
        <Route path="reviews/:slug/:tab" element={<BrokerSubPage />} />
        {/* Redirect old /review/ URLs → /reviews/ */}
        <Route path="review/:slug/:tab" element={<ReviewRedirect />} />
        <Route path="review/:slug" element={<ReviewRedirect />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="compare/:pair" element={<BrokerComparison />} />
        <Route path="methodology" element={<Methodology />} />
        <Route path="trust-score" element={<TrustScorePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="how-we-make-money" element={<HowWeMakeMoneyPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="rankings" element={<AllRankingsPage />} />
        <Route path="reviews" element={<AllReviewsPage />} />
        <Route path="regulator/:slug" element={<RegulatorPage />} />
        <Route path="guides" element={<AllGuidesPage />} />
        <Route path="guide/:slug" element={<GuidePage />} />
        {/* Author submissions portal — static routes ranked above dynamic /author/:slug */}
        <Route path="author" element={<AuthorPortalLogin />} />
        <Route path="author/portal" element={<RequireAuthorToken><AuthorPortal /></RequireAuthorToken>} />
        <Route path="author/:slug" element={<AuthorPage />} />
        <Route path="platform/:slug" element={<PlatformPage />} />
        <Route path="warnings/:slug" element={<WarningPage />} />
        <Route path="find-your-broker" element={<FindYourBrokerPage />} />
        <Route path="research/competitors" element={<CompetitorsResearchPage />} />
        <Route path="research/authors" element={<AuthorsResearchPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        {/* Redirects: old hub pages → ranking pages (URL migration) */}
        <Route path="online-brokers" element={<Navigate to="/" replace />} />
        <Route path="forex-brokers" element={<Navigate to="/best-forex-brokers" replace />} />
        <Route path="cfd-trading" element={<Navigate to="/best-cfd-brokers" replace />} />
        <Route path="copy-trading" element={<Navigate to="/best-copy-trading-platforms" replace />} />
        <Route path="spread-betting" element={<Navigate to="/best-spread-betting-brokers" replace />} />
        <Route path="crypto-trading" element={<Navigate to="/best-crypto-brokers" replace />} />
        <Route path="stock-trading" element={<Navigate to="/best-stock-brokers" replace />} />
        <Route path="options-trading" element={<Navigate to="/best-options-brokers" replace />} />
        <Route path="futures-trading" element={<Navigate to="/best-futures-brokers" replace />} />
        <Route path=":slug" element={<RankingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}

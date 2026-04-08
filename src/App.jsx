import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./i18n/LanguageContext";

// ─── Production pages (lazy loaded) ───
const Home = lazy(() => import("./pages/Home"));
const CountryPage = lazy(() => import("./pages/CountryPage"));
const CountryHubPage = lazy(() => import("./pages/CountryHubPage"));
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
const BrokerSubPage = lazy(() => import("./pages/BrokerSubPage"));
const WarningPage = lazy(() => import("./pages/WarningPage"));
const FindYourBrokerPage = lazy(() => import("./pages/FindYourBrokerPage"));

// ─── Prototypes (lazy, dev-only chunks) ───
const PrototypesPage = lazy(() => import("./pages/prototypes/PrototypesPage"));
const LogoLab = lazy(() => import("./pages/LogoLabDotCom"));
const RankingProto = lazy(() => import("./pages/RankingProto"));
const RankingProtoB = lazy(() => import("./pages/RankingProtoB"));
const RankingProtoC = lazy(() => import("./pages/RankingProtoC"));
const CardProto = lazy(() => import("./pages/CardProto"));
const RankingProtoWide = lazy(() => import("./pages/RankingProtoWide"));
const LightThemeProto = lazy(() => import("./pages/LightThemeProto"));
const ButtonLogoProto = lazy(() => import("./pages/ButtonLogoProto"));
const SubPagesProto = lazy(() => import("./pages/SubPagesProto"));
const SafetyProto = lazy(() => import("./pages/SafetyProto"));
const HomeProtoA = lazy(() => import("./pages/HomeProtoA"));
const HomeProtoC = lazy(() => import("./pages/HomeProtoC"));
const HomeProtoF = lazy(() => import("./pages/HomeProtoF"));
const HomeProtoF2 = lazy(() => import("./pages/HomeProtoF2"));
const HomeProtoF3 = lazy(() => import("./pages/HomeProtoF3"));
const HomeProtoF4 = lazy(() => import("./pages/HomeProtoF4"));
const HomePrototypes = lazy(() => import("./pages/HomePrototypes"));
const RankingHeroProtos = lazy(() => import("./pages/RankingHeroProtos"));
const HeroButtonsProto = lazy(() => import("./pages/HeroButtonsProto"));
const ScoreBadgeProto = lazy(() => import("./pages/ScoreBadgeProto"));

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

function AppRoutes() {
  return (
    <Routes>
      <Route path="prototypes" element={<Suspense fallback={<PageLoader />}><PrototypesPage /></Suspense>} />
      <Route path="logo-lab" element={<Suspense fallback={<PageLoader />}><LogoLab /></Suspense>} />
      <Route path="proto/ranking" element={<Layout />}><Route index element={<RankingProto />} /></Route>
      <Route path="proto/ranking-b" element={<Layout />}><Route index element={<RankingProtoB />} /></Route>
      <Route path="proto/ranking-c" element={<Layout />}><Route index element={<RankingProtoC />} /></Route>
      <Route path="proto/card" element={<Layout />}><Route index element={<CardProto />} /></Route>
      <Route path="proto/ranking-wide" element={<Layout />}><Route index element={<RankingProtoWide />} /></Route>
      <Route path="proto/light-theme" element={<Layout />}><Route index element={<LightThemeProto />} /></Route>
      <Route path="proto/buttons" element={<Suspense fallback={<PageLoader />}><ButtonLogoProto /></Suspense>} />
      <Route path="proto/subpages" element={<Layout />}><Route index element={<SubPagesProto />} /></Route>
      <Route path="proto/home" element={<Layout />}><Route index element={<HomePrototypes />} /></Route>
      <Route path="proto/ranking-hero" element={<Layout />}><Route index element={<RankingHeroProtos />} /></Route>
      <Route path="proto/hero-buttons" element={<Layout />}><Route index element={<HeroButtonsProto />} /></Route>
      <Route path="proto/score-badge" element={<Layout />}><Route index element={<ScoreBadgeProto />} /></Route>
      <Route path="proto/home-a" element={<Layout />}><Route index element={<HomeProtoA />} /></Route>
      <Route path="proto/home-c" element={<Layout />}><Route index element={<HomeProtoC />} /></Route>
      <Route path="proto/home-f" element={<Layout />}><Route index element={<HomeProtoF />} /></Route>
      <Route path="proto/home-f2" element={<Layout />}><Route index element={<HomeProtoF2 />} /></Route>
      <Route path="proto/home-f3" element={<Layout />}><Route index element={<HomeProtoF3 />} /></Route>
      <Route path="proto/home-f4" element={<Layout />}><Route index element={<HomeProtoF4 />} /></Route>
      <Route path="proto/safety" element={<Layout />}><Route index element={<SafetyProto />} /></Route>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="uk" element={<Navigate to="/best-forex-brokers-uk" replace />} />
        <Route path="best-forex-brokers-by-country" element={<CountryHubPage />} />
        <Route path="best-forex-brokers-:countrySlug" element={<CountryPage />} />
        <Route path="review/:slug" element={<BrokerReview />} />
        <Route path="review/:slug/:tab" element={<BrokerSubPage />} />
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
        <Route path="author/:slug" element={<AuthorPage />} />
        <Route path="platform/:slug" element={<PlatformPage />} />
        <Route path="warnings/:slug" element={<WarningPage />} />
        <Route path="find-your-broker" element={<FindYourBrokerPage />} />
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

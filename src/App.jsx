import { BrowserRouter, Routes, Route, useParams, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CountryPage from "./pages/CountryPage";
import CountryHubPage from "./pages/CountryHubPage";
import BrokerReview from "./pages/BrokerReview";
import BrokerComparison from "./pages/BrokerComparison";
import ComparePage from "./pages/ComparePage";
import Methodology from "./pages/Methodology";
import AllRankingsPage from "./pages/AllRankingsPage";
import AllReviewsPage from "./pages/AllReviewsPage";
import RankingPage from "./pages/RankingPage";
import ForexBrokersPage from "./pages/ForexBrokersPage";
import CryptoBrokersPage from "./pages/CryptoBrokersPage";
import RegulatorPage from "./pages/RegulatorPage";
import GuidePage from "./pages/GuidePage";
import PlatformPage from "./pages/PlatformPage";
import AboutPage from "./pages/AboutPage";
import HowWeMakeMoneyPage from "./pages/HowWeMakeMoneyPage";
import TrustScorePage from "./pages/TrustScorePage";
import ContactPage from "./pages/ContactPage";
import AllGuidesPage from "./pages/AllGuidesPage";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LANGUAGES, isValidLang, getLangConfig, DEFAULT_LANG } from "./i18n/config";

function LanguageLayout() {
  const { lang } = useParams();
  const resolvedLang = lang && isValidLang(lang) ? lang : DEFAULT_LANG;
  const config = getLangConfig(resolvedLang);

  useEffect(() => {
    document.documentElement.lang = resolvedLang;
    document.documentElement.dir = config.dir;
  }, [resolvedLang, config.dir]);

  return (
    <LanguageProvider lang={resolvedLang}>
      <Header />
      <div style={{ paddingTop: 84 }}>
        <Outlet />
      </div>
      <Footer />
    </LanguageProvider>
  );
}

/* Shared child routes for both root and lang-prefixed groups */
const PAGE_ROUTES = (
  <>
    <Route index element={<Home />} />
    <Route path="uk" element={<Navigate to="/best-forex-brokers-uk" replace />} />
    <Route path="best-forex-brokers-by-country" element={<CountryHubPage />} />
    <Route path="best-forex-brokers-:countrySlug" element={<CountryPage />} />
    <Route path="review/:slug" element={<BrokerReview />} />
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
    <Route path="best-forex-brokers" element={<ForexBrokersPage />} />
    <Route path="best-crypto-brokers" element={<CryptoBrokersPage />} />
    <Route path="guides" element={<AllGuidesPage />} />
    <Route path="guide/:slug" element={<GuidePage />} />
    <Route path="platform/:slug" element={<PlatformPage />} />
    <Route path=":slug" element={<RankingPage />} />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Root routes (no lang prefix) */}
      <Route element={<LanguageLayout />}>
        {PAGE_ROUTES}
      </Route>
      {/* Explicit lang-prefixed routes — static paths avoid conflict with :slug */}
      {LANGUAGES.map((l) => (
        <Route key={l.code} path={l.code} element={<LanguageLayout />}>
          {PAGE_ROUTES}
        </Route>
      ))}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

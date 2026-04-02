import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CountryPage from "./pages/CountryPage";
import CountryHubPage from "./pages/CountryHubPage";
import BrokerReview from "./pages/BrokerReview";
import BrokerComparison from "./pages/BrokerComparison";
import ComparePage from "./pages/ComparePage";
import Methodology from "./pages/Methodology";
import AllReviewsPage from "./pages/AllReviewsPage";
import RankingPage from "./pages/RankingPage";
import RegulatorPage from "./pages/RegulatorPage";
import GuidePage from "./pages/GuidePage";
import PlatformPage from "./pages/PlatformPage";
import AboutPage from "./pages/AboutPage";
import HowWeMakeMoneyPage from "./pages/HowWeMakeMoneyPage";
import TrustScorePage from "./pages/TrustScorePage";
import ContactPage from "./pages/ContactPage";
import AllGuidesPage from "./pages/AllGuidesPage";
import AllRankingsPage from "./pages/AllRankingsPage";
import AuthorPage from "./pages/AuthorPage";
import PrototypesPage from "./pages/prototypes/PrototypesPage";
import LogoLab from "./pages/LogoLabDotCom";
import RankingProto from "./pages/RankingProto";
import RankingProtoB from "./pages/RankingProtoB";
import RankingProtoC from "./pages/RankingProtoC";
import CardProto from "./pages/CardProto";
import RankingProtoWide from "./pages/RankingProtoWide";
import LightThemeProto from "./pages/LightThemeProto";
import ButtonLogoProto from "./pages/ButtonLogoProto";
import SubPagesProto from "./pages/SubPagesProto";
import SafetyProto from "./pages/SafetyProto";
import HomeProtoA from "./pages/HomeProtoA";
import HomeProtoC from "./pages/HomeProtoC";
import HomeProtoF from "./pages/HomeProtoF";
import HomeProtoF2 from "./pages/HomeProtoF2";
import HomeProtoF3 from "./pages/HomeProtoF3";
import HomeProtoF4 from "./pages/HomeProtoF4";
import HomePrototypes from "./pages/HomePrototypes";
import BrokerSubPage from "./pages/BrokerSubPage";
import CategoryHubPage from "./pages/CategoryHubPage";
import OnlineBrokersHub from "./pages/OnlineBrokersHub";
import WarningPage from "./pages/WarningPage";
import { LanguageProvider } from "./i18n/LanguageContext";

function Layout() {
  return (
    <LanguageProvider>
      <Header />
      <div style={{ paddingTop: 64 }}>
        <Outlet />
      </div>
      <Footer />
    </LanguageProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="prototypes" element={<PrototypesPage />} />
      <Route path="logo-lab" element={<LogoLab />} />
      <Route path="proto/ranking" element={<Layout />}>
        <Route index element={<RankingProto />} />
      </Route>
      <Route path="proto/ranking-b" element={<Layout />}>
        <Route index element={<RankingProtoB />} />
      </Route>
      <Route path="proto/ranking-c" element={<Layout />}>
        <Route index element={<RankingProtoC />} />
      </Route>
      <Route path="proto/card" element={<Layout />}>
        <Route index element={<CardProto />} />
      </Route>
      <Route path="proto/ranking-wide" element={<Layout />}>
        <Route index element={<RankingProtoWide />} />
      </Route>
      <Route path="proto/light-theme" element={<Layout />}>
        <Route index element={<LightThemeProto />} />
      </Route>
      <Route path="proto/buttons" element={<ButtonLogoProto />} />
      <Route path="proto/subpages" element={<Layout />}>
        <Route index element={<SubPagesProto />} />
      </Route>
      <Route path="proto/home" element={<Layout />}><Route index element={<HomePrototypes />} /></Route>
      <Route path="proto/home-a" element={<Layout />}><Route index element={<HomeProtoA />} /></Route>
      <Route path="proto/home-c" element={<Layout />}><Route index element={<HomeProtoC />} /></Route>
      <Route path="proto/home-f" element={<Layout />}><Route index element={<HomeProtoF />} /></Route>
      <Route path="proto/home-f2" element={<Layout />}><Route index element={<HomeProtoF2 />} /></Route>
      <Route path="proto/home-f3" element={<Layout />}><Route index element={<HomeProtoF3 />} /></Route>
      <Route path="proto/home-f4" element={<Layout />}><Route index element={<HomeProtoF4 />} /></Route>
      <Route path="proto/safety" element={<Layout />}>
        <Route index element={<SafetyProto />} />
      </Route>
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
        {/* M4 Category Hubs — must be before catch-all :slug */}
        <Route path="online-brokers" element={<OnlineBrokersHub />} />
        <Route path="forex-brokers" element={<CategoryHubPage hubSlug="forex" />} />
        <Route path="cfd-trading" element={<CategoryHubPage hubSlug="cfd" />} />
        <Route path="copy-trading" element={<CategoryHubPage hubSlug="copy-trading" />} />
        <Route path="spread-betting" element={<CategoryHubPage hubSlug="spread-betting" />} />
        <Route path="crypto-trading" element={<CategoryHubPage hubSlug="crypto" />} />
        <Route path="stock-trading" element={<CategoryHubPage hubSlug="stocks" />} />
        <Route path="options-trading" element={<CategoryHubPage hubSlug="options" />} />
        <Route path="futures-trading" element={<CategoryHubPage hubSlug="futures" />} />
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

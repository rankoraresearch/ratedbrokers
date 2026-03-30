import FeesTab from "./FeesTab";
import MinDepositTab from "./MinDepositTab";
import PlatformsTab from "./PlatformsTab";
import RegulationTab from "./RegulationTab";
import DepositTab from "./DepositTab";
import BeginnersTab from "./BeginnersTab";
import AlternativesTab from "./AlternativesTab";
import AccountTab from "./AccountTab";

export const TAB_RENDERERS = {
  fees: FeesTab,
  "min-deposit": MinDepositTab,
  platforms: PlatformsTab,
  regulation: RegulationTab,
  deposit: DepositTab,
  beginners: BeginnersTab,
  alternatives: AlternativesTab,
  account: AccountTab,
};

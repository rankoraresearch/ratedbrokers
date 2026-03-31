import uk from "./uk";
import australia from "./australia";
import uae from "./uae";
import germany from "./germany";
import singapore from "./singapore";
import usa from "./usa";
import canada from "./canada";
import southAfrica from "./south-africa";
import france from "./france";
import netherlands from "./netherlands";
import italy from "./italy";
import spain from "./spain";
import sweden from "./sweden";
import switzerland from "./switzerland";
import poland from "./poland";
import cyprus from "./cyprus";
import ireland from "./ireland";
import austria from "./austria";
import newZealand from "./new-zealand";
import japan from "./japan";
import india from "./india";
import indonesia from "./indonesia";
import malaysia from "./malaysia";
import thailand from "./thailand";
import philippines from "./philippines";
import hongKong from "./hong-kong";
import saudiArabia from "./saudi-arabia";
import bahrain from "./bahrain";
import kenya from "./kenya";
import nigeria from "./nigeria";
import ghana from "./ghana";
import brazil from "./brazil";
import mexico from "./mexico";
import argentina from "./argentina";
import colombia from "./colombia";
import chile from "./chile";
import turkey from "./turkey";
import russia from "./russia";
import ukraine from "./ukraine";
import greece from "./greece";
import romania from "./romania";
import czechRepublic from "./czech-republic";
import israel from "./israel";
import oman from "./oman";

const COUNTRIES = {
  "uk": uk,
  "australia": australia,
  "uae": uae,
  "germany": germany,
  "singapore": singapore,
  "usa": usa,
  "canada": canada,
  "south-africa": southAfrica,
  "france": france,
  "netherlands": netherlands,
  "italy": italy,
  "spain": spain,
  "sweden": sweden,
  "switzerland": switzerland,
  "poland": poland,
  "cyprus": cyprus,
  "ireland": ireland,
  "austria": austria,
  "new-zealand": newZealand,
  "japan": japan,
  "india": india,
  "indonesia": indonesia,
  "malaysia": malaysia,
  "thailand": thailand,
  "philippines": philippines,
  "hong-kong": hongKong,
  "saudi-arabia": saudiArabia,
  "bahrain": bahrain,
  "kenya": kenya,
  "nigeria": nigeria,
  "ghana": ghana,
  "brazil": brazil,
  "mexico": mexico,
  "argentina": argentina,
  "colombia": colombia,
  "chile": chile,
  "turkey": turkey,
  "russia": russia,
  "ukraine": ukraine,
  "greece": greece,
  "romania": romania,
  "czech-republic": czechRepublic,
  "israel": israel,
  "oman": oman,
};

export function getCountryData(slug) {
  return COUNTRIES[slug] || null;
}

export function getAllCountrySlugs() {
  return Object.keys(COUNTRIES);
}

export function getAllCountries() {
  return Object.entries(COUNTRIES).map(([slug, data]) => ({
    slug,
    name: data.name,
    code: data.code,
    flag: data.flag,
    regulator: data.regulator,
    brokersCount: data.brokers.length,
  }));
}

// Grouped by region for hub page
export function getCountriesByRegion() {
  const regions = {
    "Featured": ["uk", "australia", "usa", "germany", "singapore", "uae", "canada", "south-africa"],
    "Europe": ["uk", "germany", "france", "netherlands", "italy", "spain", "sweden", "switzerland", "poland", "cyprus", "ireland", "austria", "greece", "romania", "czech-republic"],
    "Asia-Pacific": ["australia", "singapore", "new-zealand", "japan", "india", "indonesia", "malaysia", "thailand", "philippines", "hong-kong"],
    "Middle East & Africa": ["uae", "saudi-arabia", "bahrain", "oman", "israel", "south-africa", "kenya", "nigeria", "ghana"],
    "Americas": ["usa", "canada", "brazil", "mexico", "argentina", "colombia", "chile"],
    "Eastern Europe": ["turkey", "russia", "ukraine"],
  };

  const result = {};
  for (const [region, slugs] of Object.entries(regions)) {
    result[region] = slugs
      .filter(s => COUNTRIES[s])
      .map(s => ({ slug: s, ...COUNTRIES[s] }));
  }
  return result;
}

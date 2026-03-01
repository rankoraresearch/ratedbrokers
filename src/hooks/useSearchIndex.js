import { useMemo } from "react";
import Fuse from "fuse.js";
import { getAllBrokers } from "../data/brokers";
import { getAllCountries } from "../data/countries";
import { getAllGuides } from "../data/guides";
import RANKINGS from "../data/rankings";

export default function useSearchIndex() {
  const fuse = useMemo(() => {
    const items = [];

    // Brokers (~31)
    getAllBrokers().forEach((b) => {
      items.push({
        type: "broker",
        title: b.name,
        keywords: [b.type, b.badge, b.slug.replace(/-/g, " ")].filter(Boolean).join(" "),
        path: `/review/${b.slug}`,
        meta: { score: b.score, badge: b.type },
      });
    });

    // Rankings (~207)
    RANKINGS.forEach((r) => {
      items.push({
        type: "ranking",
        title: r.title,
        keywords: [r.category, r.sub, r.id].filter(Boolean).join(" "),
        path: r.slug,
        meta: { icon: r.icon },
      });
    });

    // Guides (~25)
    getAllGuides().forEach((g) => {
      items.push({
        type: "guide",
        title: g.hero.h1,
        keywords: [g.category, g.slug.replace(/-/g, " ")].filter(Boolean).join(" "),
        path: `/guide/${g.slug}`,
        meta: { readTime: g.readTime, category: g.category },
      });
    });

    // Countries (~43)
    getAllCountries().forEach((c) => {
      items.push({
        type: "country",
        title: `Best Forex Brokers in ${c.name}`,
        keywords: [c.name, c.regulator, c.code, c.slug].filter(Boolean).join(" "),
        path: `/best-forex-brokers-${c.slug}`,
        meta: { flag: c.flag, regulator: c.regulator },
      });
    });

    return new Fuse(items, {
      keys: [
        { name: "title", weight: 1.0 },
        { name: "keywords", weight: 0.5 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, []);

  const search = (query) => {
    if (!query || query.length < 2) return [];
    return fuse.search(query, { limit: 15 }).map((r) => r.item);
  };

  return { search };
}

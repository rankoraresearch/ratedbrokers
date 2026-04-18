# Polish Sprint — Local Changes (NOT COMMITTED)

**Запуск:** 2026-04-18 ~03:40–04:10
**Режим:** Локальные правки, без коммитов. Ты сравниваешь `localhost:5173` vs `ratedbrokers.com`.
**Стейт до старта:** main @ `fce7525` (последний push)

---

## TL;DR

8 файлов, 9 правок. Главная находка — **все pale-green "туманы"** на страницах создавались не одним блоком, а **массой мелких одинаковых элементов** (30+ Tier-1 badge на ranking, 3-тоновые winner-highlights в таблицах, Trading Costs с 3 green-числами подряд, Regulation cards с full-green fill). Полировка везде следует одному принципу: **зелёный остаётся текстом, белый/нейтральный становится фоном**.

---

## Откат

**Полный:** `git checkout -- .`
**По странице:** `git checkout -- <файлы>` из секции ниже.

---

## Page-by-Page

### 🎯 `/best-forex-brokers` + `/best-crypto-brokers` (ranking pages)

**Проблема:** 30+ Tier-1 regulator badges с pale green #ecfdf5 фоном создавали "зелёный туман". Rainbow bars в Spread Comparison (green/blue/gray по брокерам). Emoji 🔎 в "Read our full analysis".

**Фиксы:**
- `RegBadge.jsx` — Tier-1 fill `#ecfdf5`/`#a7f3d0` → нейтральный `#f8fafc`/`#e2e8f0`. Зелёный только в **тексте** `#047857`. Пропагация на **все страницы** где есть badges (ranking, review, compare, hero)
- `BrokerRankCard.jsx` — `🔎 Read our full analysis` → `<Search />` + "Read our full analysis" (lucide icon)
- `RankingPage.jsx:198` — Spread Comparison rainbow bars (best green / 2-3 blue `#60a5fa` / 4+ gray) → 2-tier: best green gradient `#047857→#065f46`, остальные нейтральный `#94a3b8`. Consistent с Round 5

**Rollback:**
```bash
git checkout -- src/components/RegBadge.jsx src/components/BrokerRankCard.jsx src/pages/RankingPage.jsx
```

---

### 🎯 `/reviews/ic-markets` (review page — propagates to 51 reviews)

**Проблема:** Regulation section с pale green Tier pills + license # pills. Trading Costs box с 3 подряд ярко-зелёными числами (spread/commission/total). 5× Deep Dive link cards с pale green icon boxes. 🏆 emoji в "Editor's Choice" badge. ★ emoji в Trustpilot distribution (5★/4★/3★/2★/1★). Spread comparison table с pale green winner cell.

**Фиксы:**
- Tier pill `#ecfdf5/#fffbeb` + color pale-fills → white `#f8fafc` + border `#e2e8f0` + green/amber **text only** (`#047857` / `#b45309`)
- License # pill: убран pale-green fill, нейтральный `#f8fafc` + `#047857` текст для Tier-1
- Trading Costs values (0.02 pips / $3.50 / $7.02): `#059669` green → `#0f172a` navy. 3 зелёных числа подряд = флуд; теперь data-first читаемость
- Spread table best cell: убран `background: "#f0fdf4"` pale green. Winner signal = зелёный текст + font-weight 800
- 5× Deep Dive link icon boxes: `#ecfdf5` → `#f1f5f9` нейтральный
- Sidebar Deep Dive card: `background: "#ecfdf5" + border: "#a7f3d0"` → Plate B (3px green top strip) — consistent с SubPageLayout R3 fix
- Editor's Choice badge: `🏆` emoji → `<Trophy />` lucide icon. `#34d399` зелёный фон → `#fbbf24` amber (это "featured" = editorial signal, не tier-1; амбер правильнее)
- Trustpilot distribution: `5★`/`4★` → `5` + `<Star />` lucide + `4` + lucide. Quick Facts `B.tp ★ (X reviews)` → `B.tp/5 (X reviews)`

**Rollback:**
```bash
git checkout -- src/pages/BrokerReview.jsx
```

---

### 🎯 `/reviews/ic-markets/regulation` (safety subpage — propagates to 38× regulation URLs)

**Проблема:** 3 Regulatory License Cards с pale green full-fill (для Tier-1) + license number links с pale green bg.

**Фикс:**
- `RegulationTab.jsx` — cards теперь Plate B (white bg + 3px top strip accent: green для Tier 1, amber для Tier 2-3, gray для Tier 4). License # links неитральные с coloured text only

**Rollback:**
```bash
git checkout -- src/pages/subpage-tabs/RegulationTab.jsx
```

---

### 🎯 `/compare/A-vs-B` (compare pages — propagates to all comparison URLs)

**Проблема:** Pros/Cons card headers окрашены в pale green (для A) и pale amber (для B) = rainbow per-broker. Expert Verdict cards "Choose X if..." — pale green + pale amber full-fill. Hero "+N more regulators" pill с pale green на dark bg (too bright).

**Фиксы:**
- Pros/Cons card headers: `accentBg` pale fills убраны → Plate B (white + 3px top strip accent). Имя брокера теперь `#0f172a` navy, accent только в 3px strip
- Expert Verdict cards: full pale-fill `#f0fdf4`/`#fffbeb` → Plate B (white + 3px top strip). Заголовок "Choose X if..." в accent color
- Hero "+N more" pill: `#ecfdf5` light bg → onDark-консистентный `rgba(52,211,153,0.15)` + `#6ee7b7` text + `rgba(110,231,183,0.3)` border

**Rollback:**
```bash
git checkout -- src/pages/BrokerComparison.jsx
```

---

### 🎯 `/methodology` (static — Editorial Team section)

**Проблема:** `🔗 Verify on LinkedIn` × 4 кнопок с emoji. `💰 Affiliate Disclosure: Full Transparency` заголовок с money-bag emoji.

**Фиксы:**
- `en.js` — убраны emoji из translation keys (`\ud83d\udd17` и `\ud83d\udcb0`)
- `Methodology.jsx` — добавлен `<Linkedin />` lucide icon перед Verify текстом (strokeWidth 0 + fill currentColor = filled icon). `<Info />` icon перед Affiliate Disclosure заголовком

**Rollback:**
```bash
git checkout -- src/pages/Methodology.jsx src/i18n/ui/en.js
```

---

## Чистые страницы (проверены, нет проблем)

- `/` Home — 0 pale greens, 0 emoji
- `/find-your-broker` Quiz — 0 pale greens, 0 emoji
- `/reviews/interactive-brokers` (stocks review) — 0 pale greens, 0 emoji
- `/reviews/ic-markets/fees` — 0 pale greens, 0 emoji (после фиксов BrokerReview компонентов)
- `/reviews/ic-markets/platforms` — 0 pale greens, 0 emoji
- `/about` — 0 pale greens, 0 emoji
- `/trust-score` — 0 pale greens, 0 emoji

---

## Scope summary

| Файл | Строк ± | Что |
|---|---|---|
| `src/components/RegBadge.jsx` | +3/−3 | Tier-1 unified (white + green text) |
| `src/components/BrokerRankCard.jsx` | +2/−1 | 🔎 → lucide Search + import |
| `src/pages/RankingPage.jsx` | +1/−1 | Spread bars rainbow → 2-tier |
| `src/pages/BrokerReview.jsx` | +14/−14 | Tier pill, license #, Trading Costs, Deep Dive×5, Sidebar DD card, Trophy emoji, Star emoji |
| `src/pages/BrokerComparison.jsx` | +9/−9 | Pros/Cons cards, Verdict cards, +N more pill |
| `src/pages/subpage-tabs/RegulationTab.jsx` | +5/−5 | Tier cards → Plate B |
| `src/pages/Methodology.jsx` | +4/−4 | LinkedIn + Info lucide icons |
| `src/i18n/ui/en.js` | +2/−2 | Убраны 🔗 и 💰 из translation |

**Итого:** 8 файлов, 9 правок по 6 страницам.

**Затронутые файлы (не мои):** `src/App.jsx` — это MenuProtoV2 от параллельной сессии, не моя работа. Не откатывать.

---

## Принципы, применённые везде

1. **Зелёный как сигнал, не как фон.** Tier-1 = зелёный текст, не зелёная плашка.
2. **Plate B sitewide.** Карточки = белый bg + 3px top strip (green/amber) вместо pale-fill карточек.
3. **2-tier, не 3-tier.** Excellent green / rest neutral. Без blue-середины.
4. **Lucide icons only.** Никаких emoji в UI (🔎 🏆 🔗 💰 ★ — все заменены).
5. **Editorial emphasis = typography + accent strip, не цвет подложки.** "Winner" ячейки — зелёный текст + font-weight 800, а не bg-fill.

---

## Что НЕ тронуто (intentionally)

- **Hero badges на Premium Dark** (ASIC, CySEC в HeroBand) — green tint остался потому что onDark фон изолирует их, 3-5 штук в viewport, не создают floodа
- **Trustpilot зелёные звёздочки** (`#00B67A`) — Trustpilot brand color, не наш
- **CTA-secondary Read Full Review** (2px green border) — это брендовый CTA, зелёный оправдан
- **Методология — команда cards pale green** — не проверял эту секцию, может быть pale green стат-боксах. Можно добавить в следующий проход

---

## Готов к твоему ревью

Открой `localhost:5173` и сравни с `ratedbrokers.com`. Если принято — commit; если что-то не нравится — откати по страницам через команды выше.

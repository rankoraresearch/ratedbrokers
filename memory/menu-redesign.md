# Menu Redesign — аудит и прототип (2026-04-19)

## Статус

- **Аудит проведён** (Header.jsx 1055 строк) — 9 концептуальных проблем
- **Прототип MenuProtoV2.jsx** одобрен Егором: "мне нравится"
- **Production перенос отложен** — следующая сессия
- **Текущий файл прототипа:** `src/pages/MenuProtoV2.jsx` (~650 строк)
- **Live URL:** http://localhost:5173/proto/menu-v2
- **Branch:** `design-audit-round-2`, не коммичено

## Главная проблема live-меню

**Меню живёт в Forex-эпохе.** Сайт = Online Brokers umbrella с 8 вертикалями и 52 брокерами, но в nav выделены только Forex и Crypto. **6 скрыты**: CFD (~35 брокеров), Stocks (13), Options (9), Futures (10), Copy Trading (~18), Spread Betting (~10).

Последствие: пользователь ищет Robinhood / tastytrade / NinjaTrader / eToro copy — не находит через nav. Только через footer или прямой URL.

## Аудит — 9 концептуальных проблем

| # | Проблема | Серьёзность |
|---|---|---|
| A | 6 вертикалей спрятаны из nav | **CRITICAL** |
| B | Forex dropdown перегружен (24 ссылки в 3 колонках) | Medium |
| C | Crypto dropdown дублирует Countries (UK/USA/AU overlap) | Medium |
| D | Reviews — монограммы при живом Triple Logo System | Medium |
| D2 | Reviews bottom CTA ведёт на `/best-forex-brokers` (баг — должна `/reviews`) | **HIGH** |
| D3 | Scores 9.7/9.5 hardcoded — рассинхрон с D1 admin overrides | Medium |
| E | Countries → forex-only URLs (регресс vs home Country Section Redesign 13.04) | **HIGH** |
| F | Dead code: icon+color fields + GUIDE_ITEMS + renderCatItems + renderMobCatItems (~40 строк) | Low |
| G | Language EN ▾ — кликабельная но без onClick (×2 desktop+mobile) | Low |
| H | Desktop-Mobile асимметрия: Compare/Methodology/About только в mobile | **HIGH** (E-E-A-T) |

## Одобренный концепт (MenuProtoV2)

### Desktop — 6 слотов (было 5 + 2 мёртвых)

```
RatedBrokers.com   [Brokers ▾] [Reviews ▾] [Compare] [Guides ▾] [Countries ▾] [Methodology]   [🔍] [EN ▾ disabled] [Find Your Broker CTA]
```

**1. Brokers ▾** (860px mega, 4 колонки)
- **By Asset Class × 8** — все вертикали с counts: Forex (48), CFD (46), Stocks (13), Options (9), Futures (10), Crypto (28), Copy Trading (18), Spread Betting (10)
- **By Trading Style × 8** — beginners / low spread / ECN / scalping / social / low dep / pro / islamic
- **By Platform × 6** — MT4 / MT5 / cTrader / TradingView / Trading Apps / Crypto Apps
- **Top Rated × 5** — реальные wide-лого + rank badge + score pill (IC Markets 9.6, FP Markets 9.5, IG 9.3, Pepperstone 9.3, Forex.com 9.2)
- Bottom CTA: "Browse all 293 rankings" → `/rankings`

**2. Reviews ▾** (540px, 2 колонки)
- **Top Rated × 5** — wide-лого + score pill
- **Popular × 5** — **диверсификация по вертикалям**: eToro (Copy), Plus500 (CFD), Interactive Brokers (Multi-asset), Robinhood (Stocks), tastytrade (Options)
- Bottom: "Browse all 52 reviews" → `/reviews` (**фикс бага**)

**3. Compare** — direct link на `/compare` (возвращён с mobile)

**4. Guides ▾** (680px, 3 колонки) — Getting Started / Strategies / Concepts (структура как live)

**5. Countries ▾** (580px, 3 кол)
- 15 стран с CountryFlag
- **Per-vertical чипы** CFD/BTC рядом с флагом — только где реально существует URL:
  - UK/Australia → Forex + CFD + BTC
  - Singapore/UAE/India/South Africa → Forex + BTC
  - USA → Forex + BTC
  - Germany/France/Switzerland/Cyprus/Japan/Hong Kong/Canada/Turkey → Forex only

**6. Methodology** — direct link (возвращён с mobile, E-E-A-T)

**Right rail:** 🔍 Search · `EN ▾` **disabled state** (visual placeholder вместо мёртвой кнопки) · Orange gradient CTA "Find Your Broker"

### Mobile — полный accordion

Brokers / Reviews / Compare / Guides / Countries / Methodology / About Us / Find Your Broker CTA.

## Технические детали прототипа

**Файл:** `src/pages/MenuProtoV2.jsx`
- Inline CSS (стандарт проекта)
- Lazy load в `src/App.jsx`: `const MenuProtoV2 = import.meta.env.DEV ? lazy(() => import("./pages/MenuProtoV2")) : null;`
- Route: `<Route path="proto/menu-v2" element={<Suspense...><MenuProtoV2 /></Suspense>} />` (после proto/flags)
- Responsive breakpoint: `window.innerWidth < 1024`
- Использует `CountryFlag` компонент + `rb-link-rail` класс из `index.css`

**MenuLogo компонент** (встроен в прототип):
- Wide-лого из `public/logos-wide/{slug}.svg`
- Fallback: `{slug}.png` → текстовый имя брокера
- Светлый фон (не dark variant) для белых dropdown'ов

**Ничего не выдумано** — все URL-ы проверены в `src/App.jsx`, все scores из `content/brokers/*.md` frontmatter (актуальные на 19.04.2026).

## Production migration план (следующая сессия)

Перенести MenuProtoV2 → `src/components/Header.jsx`:

1. Удалить FOREX_CATEGORIES / FOREX_PLATFORMS / FOREX_COSTS / FOREX_ACCOUNTS / CRYPTO_BY_COIN / CRYPTO_BY_FEATURE / CRYPTO_BY_COUNTRY / GUIDE_ITEMS / COUNTRIES flat — заменить на BROKERS_BY_ASSET + BROKERS_BY_STYLE + BROKERS_BY_PLATFORM + TOP_REVIEWS (diversified) + POPULAR_REVIEWS (diversified) + COUNTRIES с per-vertical поляx
2. Удалить dead-fields (icon, color) из всех arrays
3. Удалить `renderCatItems` + `renderMobCatItems` helpers
4. Удалить Forex + Crypto nav-items → единый Brokers mega (4 колонки)
5. Добавить MenuLogo компонент (или импортировать из прото)
6. Fix Reviews bottom CTA: `lp("/best-forex-brokers")` → `lp("/reviews")`
7. Вернуть на desktop: `<NavLink to={lp("/compare")}>` + `<NavLink to={lp("/methodology")}>`
8. Countries → per-vertical chip links
9. Language EN → disabled state
10. Scores либо удалить из TOP_REVIEWS, либо fetch с API (D1 ranking_overrides)

**Ожидаемый diff:** Header.jsx ~1055 → ~850 строк. Удаление dead code компенсирует добавление MenuLogo.

## Ссылки

- **Прото live:** http://localhost:5173/proto/menu-v2 (dev only)
- **Source of truth:** `src/pages/MenuProtoV2.jsx`
- **Лог сессии:** `logs/2026-04.md` → "2026-04-19 | Сессия: Menu audit + MenuProtoV2 прототип"
- **Референс бекенда:** `src/data/categoryHubs.js` — 8 хабов (forex, cfd, stocks, options, futures, crypto, copy-trading, spread-betting)

## Связанные memory-узлы

- [[design_antipatterns]] — DESIGN-ANTIPATTERNS.md (проверено — не нарушаем)
- [[broker-types-research]] — 6+ типов брокеров, основание для 8 вертикалей в меню
- [[home_section_defaults]] — Home sections эталон
- [[homepage-concept-research]] — переход "forex brokers" → "online brokers" (обоснование для nav)

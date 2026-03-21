# Design — дизайн-решения RatedBrokers

## Hero Band
- Gradient Duo (navy->green), единый для всех template страниц
- Коммит `02f83cb`

## Brand Colors
- Navy: #0f172a
- Green: #059669 / #047857 / #34d399
- Orange CTA: #f59e0b

## Home секция брокеров
- Variant E (Compact Power Cards) активна
- Коммит `2f296ec`

## Breadcrumbs
- Стандартизированы на всех 17 страницах. Коммит `ff6ba7d`
- Белый фон: `padding: mob ? "10px 16px" : "14px 24px"`
- Links: #64748b, fontWeight 500, hover #059669
- Current page: #0f172a, fontWeight 600
- Separator: #94a3b8, ChevronRight 11px
- Gap: 4, letterSpacing: 0.01em

## Логотип
- Увеличен (Header 22/28px, Footer 20px)
- Точка -> SVG-треугольник (#f59e0b)

## BrokerLogo — правило дедупликации
- `shape="icon"` (квадратик) + отдельное текстовое имя — стандарт
- `shape="brand"` (pill icon+name) НЕ использовать рядом с текстовым именем — дублирование
- Применено в: QuickBrokerGrid, BrokerRankCard (desktop+mobile)

## BrokerRankCard — Variant B (Three-Column Grid)
- Имя брокера обёрнуто в `<h3>` (H1→H2 секции→H3 брокеры)
- Desktop layout: [Rank] [Identity] [Stats+Regulation+Trustpilot] [ScoreBadge]
  - Identity: icon 48px + name 16px + badge + type
  - Stats grid 4 колонки: SPREAD | MIN DEPOSIT | LEVERAGE | REGULATION (RegBadges)
  - Trustpilot: TpStars (5 SVG-звёзд с partial fill clipPath) + rating + count + link
  - ScoreBadge: `size="lg"` (52px)
- Tablet (768px): stats grid 3 колонки, Regulation — отдельная inline строка ниже
- Mobile: icon 40px + name 15px, TpStars size=11
- Типография: #111827 primary, #374151 secondary, #64748b tertiary
- ThematicBlurb heading: DM Sans (не Outfit), fontSize 15
- CTA unified: borderRadius 10, border 2px solid #059669, bg #ecfdf5
- Hover rank #1: зелёный glow rgba(5,150,105,0.12)
- Аудит Барбары применён: отступы, цвета, CTA consistency

## Quick Broker Grid (Top 10 at a Glance)
- Прототип в RankingProtoC.jsx
- Desktop: CSS Grid 2×5 (`gridAutoFlow: "column"`, `gridTemplateRows: "repeat(5, auto)"`)
- Mobile: Flex 1 column
- Top 3: зелёный градиент бейдж (#059669→#047857), #4-10: серый (#f1f5f9)
- Hover: score всегда виден, risk warning — opacity transition (height: 13 зарезервирован, shift: 0)
- Logo: shape="icon", 40px desktop / 28px mobile

## SEO-контент рейтингов
- **Key Finding**: ОСТАВИТЬ (E-E-A-T сигнал, featured snippet потенциал)
- **Quick Summary: Top 3**: УДАЛЁН (дублирование данных, HCU thin content риск)
- **КРИТИЧНО**: Key Finding нуждается в дешаблонизации — 207 уникальных формулировок для продакшена

## Иконная система рейтингов (207 рейтингов)
- **Решение**: все эмодзи заменены на lucide-react иконки
- **Цвет**: единый #059669 (brand green), на тёмном фоне #34d399
- **35 новых lucide-иконок** добавлены в Icon.jsx
- **Семантический маппинг** по sub-категориям:
  - Trading Style: graduation-cap, briefcase, crosshair, sun, trending-up, calendar, umbrella, newspaper, bot, cpu, zap, copy, users, signal, settings, grid-3x3, hand-coins
  - Costs: trending-down, circle-off, badge-percent, piggy-bank, search, ban, circle-check, wallet, fast-forward, refresh-cw, check-circle, map-pin
  - Execution: activity, arrow-right, shuffle, factory, target, book-open, rocket
  - Accounts: microscope, coins, clipboard-list, gamepad-2, layers, folder-open, users, gem, sprout, moon
  - Platforms: chart-candlestick (MT4), chart-line (MT5), chart-area (cTrader), chart-no-axes-combined (TradingView), chart-bar (ProRealTime)
  - Trust: shield-check, badge-check, shield-alert, shield, vault
  - Crypto: bitcoin, gem, droplets, sun, dog, coins, layers, copy, scale
  - Assets: chart-candlestick, chart-no-axes-combined, award, circle-dollar-sign, fuel, wheat, bar-chart-3, toggle-right, hourglass, package, dice-6, landmark
  - Bonus: gift, sparkles, badge-dollar-sign, party-popper, crown
  - Countries: globe (все 40)
  - Regulators: shield-check (все), offshore = palm-tree
  - Alternatives: arrow-right-left (все 10)
- **EMOJI_MAP** сохранён для обратной совместимости
- Конкурентный аудит: FXEmpire единственный с иконками (outlined monochrome SVG)

# Design — дизайн-решения RatedBrokers

## Brand Button Invariants (Barbara round 4, 2026-04-16) — применимы ко всем кнопкам сайта

7 инвариантов, выведенных из Primary Orange CTA + Secondary Green outline + `.link-green`:

**I1. Motion easing:** `cubic-bezier(0.4, 0, 0.2, 1)` для объёмных CTA; `ease` для текст-линков
**I2. Two-speed timing:** `0.25s` для кнопок с shadow / `0.15s` для стрелок/текста. Нет 0.08/0.1/0.18/0.2/0.6 — это шум
**I3. Shadow growth ratio ~3×** — `0 2px 8px rgba(…,0.3)` → `0 8px 24px rgba(…,0.4)` (blur 3×, spread 4×, alpha +33%)
**I4. Arrow motion:** `translateX(3px)` + color flip (→ accent). Никаких диагональных translate(Npx,-Npx), никаких `↗` для внутренних ссылок
**I5. Typography lock:** `'Outfit', sans-serif` weight 700, size 14-15px, letter-spacing `-0.01em`
**I6. Radius ladder:** ТОЛЬКО 8-10 (кнопки), 999 (pills/badges), 0 (chips). Никаких 11/12/13/14
**I7. Hover transform:** `translateY(-1px)` максимум. Shadow делает разницу rest↔hover, не сам transform

**RED FLAG**: любая кнопка, у которой ≤4/7 совпадают — читается "из другого учебника дизайна". Стремиться к 7/7.

## Broker Types Section (2026-04-15/16) — Home page · ЗАФИКСИРОВАНО

8 convex-кнопок под Hero. Grid 4×2 desktop / 2×4 mobile (зафиксировано, не менять).

**Финальный config (Egor 2026-04-16, коммит `5ffa063`):**
| knob | value | description |
|------|-------|-------------|
| `frame` | `none` | без архитектурной обёртки — кнопки прямо на странице |
| `accent` | `warm` | irrelevant без frame, но сохранён в DEFAULT |
| `cadence` | `compact` (56) | вертикальный padding-block 56px |
| `header` | `fieldLabel` | overline "By broker type" |
| `meta` | `off` | без bottom strip |
| `style` | `unified` | white tile + 3px green left accent |

**DEV-бар, BrokerTypeProvider, BrokerTypeContext, useBrokerTypeConfig, Quick Links pill strip — УДАЛЕНЫ.** `BrokerTypeSection()` читает hardcoded `DEFAULT` напрямую. Если понадобятся новые knobs — отдельный proto-роут `/proto/broker-types` (уже существует).

**Unified button style** (финальный после 12 итераций):
```css
display: inline-flex; align-items: center; gap: 10px;
padding: 14px 18px; min-height: 52px;
background: #ffffff;
border: 1.5px solid #e2e8f0;
border-left: 3px solid #059669;  /* зелёная accent полоска — эхо .link-green dot */
border-radius: 10px;
box-shadow: 0 2px 8px rgba(15,23,42,0.06);
font: 700 15px 'Outfit', sans-serif;  letter-spacing: -0.01em;
color: #0f172a;
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```
Hover: border → #cbd5e1, left-border → #047857, shadow → `0 8px 24px rgba(15,23,42,0.12)`, transform translateY(-1px), icon color darken, ArrowRight translateX(3px) + color → accent.

**10 FRAMES** (architectural containers, не декор):
- `none` — без frame, использует cfg.bg
- `editorial` — WSJ/FT двухколонник: левый anchor (overline + lead + 8/8 meta) + grid 4×2 справа (Barbara's top pick)
- `inset` — Linear/Stripe float: grid на `#f8fafc` canvas внутри белой страницы, radius 16, overline сверху
- `darkFrame` — Navy inset с диагональной текстурой + оранжевый overline "BROWSE"
- `cream` — Robinhood `#fbf8f1` warm band + editorial meta (overline + hairline + "8/8")
- `amber` — диагональный gradient `#fffaf0 ↔ white ↔ #fffaf0` + оранжевые hairlines
- `sunrise` — вертикальный gradient `#fffbeb → #fef3c7` + orange bookends
- `goldBand` — cream фон + 3px оранжевые bookends сверху и снизу + orange overline + "8/8"
- `heroEcho` — rounded inset с warm gradient + диагональная orange текстура (~1:10 Hero)
- `orangeRail` — белый фон + 4px вертикальная orange полоса слева во всю высоту

**Architectural knobs** (применяются поверх frames):
- `cadence` — padding-block 56/96/128/160 (transactional/standard/editorial-breathe/monumental)
- `header` — overline variants: fieldLabel/numeric (Section 02)/tagline/range (01—08)/silent
- `meta` — bottom strip: off/credentials/counters/process
- `anchor` (Editorial only) — compact/full/numbered (big "02" 64px)
- `accent` — orange intensity: off/subtle/warm/bold

**Top pick preset "★ Editorial Authority":**
```js
{ frame: "editorial", cadence: "expansive", anchor: "full", meta: "credentials", showArrow: true }
```

**Anti-patterns (подтверждены на практике, отклонено Егором):**
- Orange rules/stripes (2px orange top+bottom) — "декор без концепта"
- 3px brand edge + ни одного другого сигнала — недостаточно для identity
- Navy shelf с inset bars — "архитектурно пустое"
- Double rule (две параллельные линии) — Bootstrap-стиль
- Gradient bar fade top/bottom — attention-grab без роли
- Corner marks (L-брекеты) — декорация
- Hard-edge shadows `0 3px 0 color` в convex-кнопках — "paper UI" / детский конструктор

**Reference commits:**
- `31242c5 feat: unified Broker Types section + bottom-anchored Quick Links dev toggle` (2026-04-15) — initial 10 frames + 5 knobs + DEV bar
- `5ffa063 feat: lock Broker Types config, drop dev toolbar, add no-cache HTML headers` (2026-04-16) — финальный фриз config, удаление DEV-бара (-180 строк)

## Концепция: Premium Dark (2026-04-14)

Сайт-wide дизайн-концепция, зафиксирована после интервью с Егором.

**База**: тёмные поверхности (navy→green gradient) + оранжевые акценты.
- Dark gradient: `linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)`
- Orange primary: `#f59e0b`, soft: `#fbbf24`
- Текстура: `repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)` — диагональные полоски 12px

**Анти-паттерн** (Егор не принимает) — полный список в [DESIGN-ANTIPATTERNS.md](../DESIGN-ANTIPATTERNS.md):
- Салатово-зелёные (mint/pale green) shim-подсветки — напр. highlight в Countries dropdown (14.04.2026)
- Пастельные цветные chips/badges (зелёный/синий/фиолетовый per category) — Expert cards specializations
- Разноцветные категорийные плашки (Forex/CFD/Stocks разных цветов) — "детская палитра"
- "Most Popular" / "Best Choice" / "Editor's Pick" шаблонные badges
- Зелёная подсветка отдельных элементов на светлом фоне (напр. founder highlight, лидер #1)
- Мелкие шрифты в country sections
- Нативные эмодзи в финансовых блоках (только lucide-react)

**Применяется**: HeroBand, How We Rate (Orange Tiles, 2026-04-14), side-by-side comparisons (тёмные области с оранжевыми элементами).

**Следующие кандидаты на редизайн**: Regulated Brokers by Country (крупнее шрифт, убрать "Most Popular"), разноцветные chips в Compare → монохромные, founder highlight в Expert Team.

## How We Rate — Orange Tiles (Premium Dark)

- Фон: dark gradient + diagonal texture overlay
- Eyebrow "OUR METHODOLOGY" — 12px JetBrains Mono, orange, letter-spacing 0.18em, uppercase
- H2: Outfit 800, 40/28px, letterSpacing -0.03em
- 6 плиток 3×2: `rgba(255,255,255,0.04)` bg + `rgba(255,255,255,0.10)` border
- Icon box: 40×40, `rgba(245,158,11,0.12)` bg + `rgba(245,158,11,0.28)` border, lucide icon 20px orange strokeWidth 1.75
- Weight pill: `rgba(245,158,11,0.14)` bg + `#fbbf24` text, JetBrains Mono 13px 800
- Progress bar: 3px, `rgba(255,255,255,0.08)` track, `linear-gradient(90deg, #f59e0b, #fbbf24)` fill
- Hover: border → `#f59e0b`, bg → `rgba(245,158,11,0.06)`
- CTA: orange gradient button "Read full methodology →"
- Prototype с тумблерами: `/proto/how-we-rate-dark` (eyebrow/texture/emphasis/progress/icons)

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

## Sub-Page Navigation
- **Sticky tab bar** (SubPageTabs.jsx): первый таб "← Review" → `/review/{slug}` (никогда не active, borderRight разделитель)
- Баннер "Full Review" и pill-кнопка "← Back to Full Review" удалены (коммит `dfe8483`)
- Breadcrumb содержит кликабельную ссылку "{B.name} Review"

## Логотип
- Увеличен (Header 22/28px, Footer 20px)
- Точка -> SVG-треугольник (#f59e0b)

## Логотипы брокеров — Dual Logo System

Каждый брокер имеет **три** типа логотипа:
1. **Квадратный icon** (`public/logos/{slug}.png`) — 120×120px, для карточек, гридов, навигации
2. **Wide light wordmark** (`public/logos-wide/{slug}.{svg|png|jpg}`) — для светлого фона (review hero)
3. **Wide dark wordmark** (`public/logos-wide-dark/{slug}.svg`) — для тёмного фона (hero band, navy bg)

### WideLogo компонент (BrokerReview.jsx)
- Формат: SVG по умолчанию, WIDE_EXT переопределяет: `capital-com:png`, `libertex:png`, `fxpro:jpg`
- LOGO_BG map: цвет фона карточки, совпадает с фоном SVG
- Размеры: desktop 280×88, mobile 200×64, borderRadius 14
- border: `2px solid rgba(255,255,255,0.3)` для отделения от тёмного hero band
- Все логотипы на белом фоне: `width/height: "70%"`, objectFit contain
- Растровые (png/jpg) на цветном фоне: objectFit cover 100%

### Wide Dark (logos-wide-dark/) — для тёмного фона
- **38/38 SVG** в `public/logos-wide-dark/{slug}.svg`
- Белые/светлые wordmark для Hero Band navy #0f172a
- 18 официальных (CDN, companieslogo.com), 18 конвертированных (fill→#fff), 2 as-is
- **IG**: красная подложка `<rect rx="6" fill="#E01B1C"/>` + белые буквы
- **Dukascopy**: красный швейцарский крест + белый текст
- **Exness**: жёлтый фон удалён, белый текст
- **FxPro**: серифный wordmark, red→#fff
- **Libertex**: оранжевый icon + белый текст, viewBox обрезан до контента
- **Logo Showcase**: `public/logo-showcase.html` — 3 вкладки (Square Icons, Wide Light, Wide Dark)

### Ключевые особенности LOGO_BG
- Большинство SVG — тёмный текст на прозрачном фоне → bg "#fff"
- Trading 212 — единственный SVG с реальным чёрным `<rect>` → bg "#000"
- FxPro — оригинальный JPG (красный фон + белый серифный текст) → bg "#f31112"
- Exness → "#ffde02", XM → "#1a1a2e" (белый текст + красный бык)
- IC Markets, Tickmill, Swissquote, FXTM — все на #fff после фикса коммита `6151f82`

## BrokerLogo — правило дедупликации
- `shape="icon"` (квадратик) + отдельное текстовое имя — стандарт
- `shape="brand"` (pill icon+name) НЕ использовать рядом с текстовым именем — дублирование
- Применено в: QuickBrokerGrid, BrokerRankCard (desktop+mobile)

## BrokerRankCard — Combined Variant (25 марта 2026)
- **Wide wordmark лого** вместо квадратных иконок: WideLogo компонент + WIDE_EXT/LOGO_BG maps
- Desktop layout: [Rank outlined] [WideLogo 200×60] [Name+Badge+Type] [Stats 3-col] [ScoreBadge]
  - Ниже разделителя: Regs + Trustpilot → Thematic content → DualCTA → RiskWarning
  - Stats: 3 items (Spread, Min Dep, Leverage), без Regulation колонки
  - Tablet: WideLogo 160×52
- Mobile layout: Rank+Score header → WideLogo 200×64 centered → Name+Type → DualCTA → TP → Risk → Regs → Stats grid
- Rank badge: outlined green (#ecfdf5 bg, 1px solid #a7f3d0, #059669 text) вместо filled
- **CTA primary** (Bill): orange gradient `linear-gradient(135deg, #f59e0b, #fbbf24)`, color `#0f172a`
- **CTA secondary** (Bill): green outline `2px solid #059669`, bg `#fff`, color `#059669`
- **Logo bg** (Bill): `linear-gradient(135deg, #0a2018, #0f172a)`, border `1px solid #1a3d30`
- Card hover lift: `translateY(-2px)` + shadow усиливается, transition `cubic-bezier(0.4,0,0.2,1)`
- Типография: #111827 primary, #374151 secondary, #64748b tertiary
- Hover rank #1: зелёный glow rgba(5,150,105,0.12)
- Коммит `e9a7767`

## CTA Hover Animations (CSS)
- Реализованы через CSS-классы в `index.css` (не useState)
- `.cta-primary:hover` — gradient `#d97706→#f59e0b`, shadow `0 6px 20px rgba(245,158,11,0.4)`, translateY(-2px)
- `.cta-secondary:hover` — bg `#059669`, color `#fff`, border-color `#059669`
- `.cta-orange:hover` — gradient `#d97706→#f59e0b`, shadow `0 8px 24px rgba(245,158,11,0.4)`, translateY(-2px)
- Transition: `all 0.25s cubic-bezier(0.4,0,0.2,1)`
- Применены: BrokerRankCard (primary + secondary), BrokerReview (6× orange)
- Коммит `7b7e4f3`

## Review Hero WideLogo — Frosted Glass (Barbara)
- bg: `rgba(255,255,255,0.08)` вместо solid `#0f172a`
- border: `1px solid rgba(255,255,255,0.12)` вместо `2px solid rgba(255,255,255,0.3)`
- Коммит `e9a7767`

## ButtonLogoProto — /proto/buttons
- 5 вариантов: Current, Barbara, Bill, BarbaraAlt, Combined
- Combined = утверждённый для продакшена (Bill buttons + Barbara hero logo)
- Импорт в App.jsx, роут `/proto/buttons`
- Коммит `550381c`

## SubPagesProto — /proto/subpages
- 8-tab IC Markets deep-dive: Fees, Min Deposit, Platforms, Regulation, Deposit, Beginners, Alternatives, Account
- Все эмодзи удалены (33+), заменены на lucide-react иконки и чистый текст
- ProsCons: Check/XIcon вместо ✓/✗, DataTable: "Yes" зелёным, "No"/"None" серым
- Account tab: 4 карточки типов аккаунтов (цветные ленты + CTA) + Demo navy блок
- Progress bar: соединительная линия между шагами, boxShadow для кружков
- ComparisonBar: "BEST" зелёный бейдж вместо ★
- Hero badge: Award lucide вместо 🏆
- Коммит `12898d1`

## SafetyProto — /proto/safety
- BrokerChooser-style safety score page prototype
- Коммит `12898d1`

## Sub-Pages Production System (30 марта 2026)
- **304 страницы**: 38 брокеров × 8 табов (fees, min-deposit, platforms, regulation, deposit, beginners, alternatives, account)
- Роут: `/review/:slug/:tab` → BrokerSubPage.jsx
- **Компоненты** (`src/components/subpage/`): QuickAnswerBox, ProsCons, DataTable, ComparisonBar, CTAInline, FaqSection, VerdictBox, SubPageTabs, SubPageLayout, Typography
- **Tab-рендереры** (`src/pages/subpage-tabs/`): FeesTab, MinDepositTab, PlatformsTab, RegulationTab, DepositTab, BeginnersTab, AlternativesTab, AccountTab
- Layout: Breadcrumbs + Back to Full Review + HeroBand (WideLogo + score + regs + stats) + Sticky Tabs + Main Content + AuthorCredits + AuthorBioCard + Risk Warning
- Desktop: sidebar (260px) с broker card + key facts + Deep Dive nav
- Mobile: sticky CTA bar (broker logo + name + score + Visit CTA)
- Данные: 80% из существующего YAML, 20% editorial из `SUBPAGES` YAML-секции
- **Fallback**: все рендереры работают без `subpages:` YAML
- SEO: динамический `document.title` и meta description для каждого таба
- Deep Dive ссылки в sidebar BrokerReview.jsx (8 зелёных ссылок с lucide-иконками)

## Quick Broker Grid (Top 10 at a Glance)
- Прототип в RankingProtoC.jsx
- Desktop: CSS Grid 2×5 (`gridAutoFlow: "column"`, `gridTemplateRows: "repeat(5, auto)"`)
- Mobile: Flex 1 column
- Top 3: зелёный градиент бейдж (#059669→#047857), #4-10: серый (#f1f5f9)
- Hover: score всегда виден, risk warning — opacity transition (height: 13 зарезервирован, shift: 0)
- Logo: shape="icon", 40px desktop / 28px mobile

## Key Finding — Navy Editorial Strip
- Дизайн: тёмный navy-градиент `linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0a2e3d 100%)`
- Оранжевый accent bar слева: `linear-gradient(180deg, #f59e0b, #fbbf24)`, width 4-5px
- Лейбл "KEY FINDING": оранжевый (#f59e0b), uppercase, Outfit 700, 11px, letterSpacing 0.12em
- Иконка CircleCheck 14px оранжевая
- Текст: белый #fff, 15-17px, fontWeight 400, lineHeight 1.7
- borderRadius 12
- Коммит `c21f817`
- Отвергнуты: зелёный градиент (шаблонный), белый фон + крупный текст (Wix-стиль)

## SEO-контент рейтингов
- **Key Finding**: Navy Editorial Strip (E-E-A-T сигнал, featured snippet потенциал)
- **Quick Summary: Top 3**: УДАЛЁН (дублирование данных, HCU thin content риск)
- **Sticky CTA bar**: УДАЛЁН из рейтингов (коммит `c21f817`)
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

# 10 парных дизайн-концепций: RankingPage + BrokerReview

> **Дата:** 12 марта 2026
> **Автор:** Claude (дизайнер + SEO + affiliate-маркетолог)
> **Цель:** Выбрать визуальное направление для двух ключевых шаблонов сайта RatedBrokers

---

## Аудит текущего дизайна

### Что есть сейчас
- **Фон:** #f8f9fb (серо-белый) — плоский, без глубины
- **Акцент:** Единственный зелёный (#059669) — для всего: CTA, скоры, бейджи, pros
- **Типографика:** Outfit (заголовки) + DM Sans (тело) + JetBrains Mono (числа) — **хороший набор, но не используется на максимум**
- **Карточки:** Белые, border #e2e8f0, border-radius 16px — **однообразные, всё сливается**
- **Hero рейтинга:** Иконка + H1 + автор — **слишком простой, нет визуального якоря**
- **Hero ревью:** Лого + H1 + метрики + CTA — **функционально, но бледно**

### Сильные стороны
1. **Чистый код** — inline CSS, нет лишних зависимостей
2. **JetBrains Mono для чисел** — уникально, ни один конкурент не использует
3. **Зелёная палитра** — ассоциация с финансами/ростом
4. **AuthorCredits** — 3-колоночный E-E-A-T блок, сильнее чем у 80% конкурентов
5. **Sticky CTA bar** — хорошо конвертит

### Слабые стороны
1. **Монохромность** — один зелёный для всего, нет визуальной иерархии
2. **Плоский фон** — нет depth, нет sections differentiation
3. **Hero без характера** — конкуренты используют градиенты, фото, паттерны
4. **Нет визуальных скоров** — только числа, нет bars/rings/charts
5. **Карточки-близнецы** — все выглядят одинаково, нет visual hierarchy по рангу
6. **Нет sidebar на рейтинге** — desktop простаивает
7. **Таблицы Plain** — нет sticky headers, нет hover highlighting
8. **Шапка не поддерживает** — стандартная, не усиливает страницы

---

## Анализ конкурентов (выжимка)

| Конкурент | Главное визуальное оружие | Что украсть |
|-----------|--------------------------|-------------|
| **ForexBrokers.com** | Sub-scores по категориям + Trust Score badge | Sub-scores визуально |
| **BrokerChooser** | Quiz-driven, жёлтый CTA, clean minimal | Контрастный CTA цвет |
| **Investopedia** | Serif авторитет, editorial trust | Serif заголовки |
| **FXEmpire** | Teal accent на тёмном, filters hub | Фильтрация |
| **NerdWallet** | Зелёный + serif, AI, expandable, "Best for" tags | Комбо serif + sans |
| **CompareForex** | Реальные фото основателей | Фото авторов |
| **Investing.com** | 3-role E-E-A-T с цветами, "TRUSTED PARTNER" badge | Цветовые E-E-A-T метки |

---

## Глобальные решения (общие для всех 10 концепций)

Неизменные вещи:
- **Светлая тема** — преимущественно белый фон
- **React + inline CSS** — не меняем стек
- **Шрифты:** можем менять пропорции, но base fonts остаются (Outfit, DM Sans, JetBrains Mono)
- **Зелёный CTA** — это наш бренд (#059669), но можем добавить вторичные цвета
- **Mobile-first** — все концепции адаптивны

---

# Концепция 1: "Financial Authority"
### Философия: Авторитет через типографику и структуру

Вдохновение: NerdWallet + Investopedia. Добавляем serif в заголовки для "газетного" авторитета, усиливаем E-E-A-T визуально. Сайт выглядит как финансовое издание, а не как партнёрский портал.

### Палитра
- **Фон:** #FFFFFF (чистый белый) для контента, #F7F8FA для разделов
- **Primary:** #0F172A (navy) для текста и hero
- **Accent:** #059669 (наш зелёный) — только CTA и скоры
- **Secondary accent:** #D4A853 (тёплое золото) — award badges, #1 rank
- **Borders:** #E5E7EB (мягче текущего)

### Типографика
- **H1:** `font-family: "Outfit"; font-weight: 900; letter-spacing: -0.03em` — но увеличить до 48px desktop
- **H2:** Outfit 700, 28px — с подчёркиванием через border-bottom 3px solid #059669
- **Body:** DM Sans 16px, line-height 1.85 (увеличить от текущего 1.8)
- **Scores:** JetBrains Mono — остаётся, это наша суперсила

### Шапка (Header)
- Добавить тонкую top-bar (32px): слева "Independent Forex Broker Reviews Since 2026", справа "Methodology · About · Contact"
- Основной header: без изменений, но шрифт logo чуть крупнее

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    📊 ICON (48px)                            │
│           Best ECN Forex Brokers 2026                       │
│        (Outfit 900, 48px, #0F172A, centered)                │
│                                                             │
│    ┌────────────────────────────────────────┐               │
│    │  Written By · Reviewed By · Fact Checked│               │
│    │  (AuthorCredits, centered)              │               │
│    └────────────────────────────────────────┘               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ 5 Ranked │  │ 200+ hrs │  │ Mar 2026 │  Trust Stats    │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
├───────────────────────────┬─────────────────────────────────┤
│                           │                                 │
│  [SEO Intro Card]         │  SIDEBAR (260px)                │
│                           │  ┌─────────────────────┐       │
│  [Key Finding Box]        │  │ Quick Verdict        │       │
│                           │  │ 🥇 Best Overall: IC  │       │
│  ┌───────────────────┐   │  │ 🥈 Runner-up: Pepper │       │
│  │  #1  IC Markets   │   │  │ 💰 Cheapest: XM     │       │
│  │  Score Ring 9.5   │   │  └─────────────────────┘       │
│  │  [metrics grid]   │   │                                 │
│  │  [Visit] [Review] │   │  ┌─────────────────────┐       │
│  └───────────────────┘   │  │ Filter by:           │       │
│                           │  │ [x] ECN/STP          │       │
│  ┌───────────────────┐   │  │ [ ] Market Maker     │       │
│  │  #2  Pepperstone  │   │  │ [x] Tier-1 Regulated │       │
│  └───────────────────┘   │  └─────────────────────┘       │
│                           │                                 │
│  ...                      │  ┌─────────────────────┐       │
│                           │  │ Related Rankings     │       │
│                           │  │ → Best for Beginners │       │
│                           │  │ → Lowest Spreads    │       │
│                           │  └─────────────────────┘       │
└───────────────────────────┴─────────────────────────────────┘
```

**Ключевые изменения RankingPage:**
- Sidebar 260px (sticky) с Quick Verdict, фильтрами, related rankings
- Score в карточке через **ring/donut** visualization (SVG circle), а не просто число
- Карточка #1 — увеличенная с gold border (#D4A853)
- Карточки #2-3 — стандартные с navy border
- Карточки #4+ — минимальные, border #E5E7EB

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs (белый фон)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO (белый фон, border-bottom)                            │
│  ┌──────────────────────────┬───────────────────┐          │
│  │ Logo + H1 + meta         │  Score Ring (120px)│          │
│  │ IC Markets Review 2026   │      9.5/10        │          │
│  │ ECN · Est. 2007 · Sydney │  "Excellent"       │          │
│  │                          │  [Visit] CTA       │          │
│  │ TP ⭐4.8 · ASIC · FCA   │  risk warning      │          │
│  │                          │                    │          │
│  │ Spread | Commission | Min│                    │          │
│  │ 0.0    | $3.50      | $200                    │          │
│  └──────────────────────────┴───────────────────┘          │
│                                                             │
│  AuthorCredits (3 columns, with photos)                     │
│                                                             │
├──────────┬─────────────────────────────┬────────────────────┤
│ LEFT TOC │  CONTENT                    │  RIGHT SIDEBAR     │
│ (sticky) │                             │  (sticky)          │
│          │  ## Overview                │  Score + CTA       │
│ Overview │  [text]                     │  Quick Facts       │
│ Scoring  │  [CTA: Ready to trade?]    │  Alternatives      │
│ Pros/Cons│                             │                    │
│ Accounts │  ## Scoring Breakdown       │                    │
│ ...      │  ┌─────────────────────┐   │                    │
│          │  │ Regulation    9.8   │   │                    │
│          │  │ ████████████░░ 30% │   │                    │
│          │  │ Costs         9.5   │   │                    │
│          │  │ ███████████░░░ 20% │   │                    │
│          │  └─────────────────────┘   │                    │
│          │                             │                    │
│          │  ## Pros & Cons             │                    │
│          │  ┌─────────┬─────────┐     │                    │
│          │  │ ✅ Pros  │ ❌ Cons │     │                    │
│          │  └─────────┴─────────┘     │                    │
└──────────┴─────────────────────────────┴────────────────────┘
```

**Ключевые изменения BrokerReview:**
- Score в hero через **SVG Ring** (120px circular progress)
- H2 с зелёной border-bottom (3px)
- Score breakdown bars длиннее, с percentage labels
- Verdict card — gold border (#D4A853)

### Сильные стороны концепции
- Минимальные изменения от текущего — быстро реализовать
- Sidebar добавляет utility и CTA surface area
- Ring score — визуальный якорь, которого нет у конкурентов
- Gold для #1 — создаёт hierarchy

### Слабые стороны
- Консервативно — не будет "wow" эффекта
- Sidebar может быть пустым на рейтингах с 1 брокером

---

# Концепция 2: "Gradient Hero"
### Философия: Яркий hero + чистый контент

Вдохновение: Stripe.com + Linear.app. Hero с мягким gradient вместо plain white. Контентная часть остаётся чистой. Первое впечатление — premium, современный портал.

### Палитра
- **Hero gradient:** `linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #164E63 100%)` — navy-to-teal
- **Контент:** #FFFFFF
- **Section alternation:** Белый → #F8FAFB → Белый
- **Accent:** #059669 (CTA), #0EA5E9 (информационные бейджи — sky blue)
- **Score colors:** ≥9.0 → #059669, ≥8.5 → #0EA5E9, ≥8.0 → #F59E0B

### Типографика
- **Hero H1:** Outfit 900, 44px, **#FFFFFF** (белый на тёмном hero)
- **Body H2:** Outfit 800, 26px, #0F172A
- Subtitle в hero: DM Sans 16px, rgba(255,255,255,0.7)

### Шапка
- На hero-страницах: **transparent header** (белый текст на тёмном фоне hero)
- При scroll → solid white header (transition 0.3s)
- Эффект: header и hero сливаются в единый визуальный блок

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ GRADIENT HERO ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓                                                         ▓ │
│ ▓     📊 Best ECN Forex Brokers 2026                     ▓ │
│ ▓     (Outfit 900, 44px, WHITE)                          ▓ │
│ ▓                                                         ▓ │
│ ▓     Compare the top ECN brokers ranked by experts       ▓ │
│ ▓     (DM Sans 16px, white 70%)                          ▓ │
│ ▓                                                         ▓ │
│ ▓  ┌──────────┐ ┌──────────┐ ┌──────────┐               ▓ │
│ ▓  │5 Ranked  │ │200+ hrs  │ │Mar 2026  │ (glass cards) ▓ │
│ ▓  └──────────┘ └──────────┘ └──────────┘               ▓ │
│ ▓                                                         ▓ │
│ ▓  AuthorCredits (white text, centered)                   ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                                             │
│  QUICK VERDICT (карточки с shadow, поднятые из hero)        │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 🥇 IC Markets   │ 🥈 Pepperstone  │ 💰 XM       │      │
│  │ Score: 9.5      │ Score: 9.3      │ Score: 9.1  │      │
│  │ [Visit →]       │ [Visit →]       │ [Visit →]   │      │
│  └──────────────────────────────────────────────────┘      │
│  (margin-top: -40px, overlapping hero edge)                 │
│                                                             │
│  BROKER CARDS (белый фон)                                   │
│  ┌───────────────────────────────────────────────────┐     │
│  │ #1 IC Markets  │ metrics │ SCORE │ [CTA] [Review] │     │
│  └───────────────────────────────────────────────────┘     │
│  ...                                                        │
│                                                             │
│  EDUCATION SECTION (#F8FAFB фон — alternation)              │
│                                                             │
│  COMPARISON TABLE (белый фон)                               │
│                                                             │
│  METHODOLOGY CTA (gradient повторяется)                     │
└─────────────────────────────────────────────────────────────┘
```

**Trust Stats** — glassmorphism cards на gradient hero:
```css
background: rgba(255,255,255,0.1);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.15);
```

**Quick Verdict** — вынесен из hero, перекрывает его край (margin-top: -40px), создавая depth.

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ GRADIENT HERO ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓                                                         ▓ │
│ ▓  [LOGO 72px]                                            ▓ │
│ ▓  IC Markets Review 2026                                 ▓ │
│ ▓  ECN Broker · Est. 2007 · Sydney                        ▓ │
│ ▓                                                         ▓ │
│ ▓  ┌─────────────────────────────────────────────┐       ▓ │
│ ▓  │ SCORE: 9.5   │ TP: 4.8 ⭐ │ ASIC FCA CySEC │       ▓ │
│ ▓  │ (ring, white) │ (white)    │ (white badges) │       ▓ │
│ ▓  └─────────────────────────────────────────────┘       ▓ │
│ ▓                                                         ▓ │
│ ▓  Spread: 0.0  │  Commission: $3.50  │  Min: $200       ▓ │
│ ▓  (glass metric boxes)                                   ▓ │
│ ▓                                                         ▓ │
│ ▓  [  Visit IC Markets →  ]  (large green CTA on dark)    ▓ │
│ ▓  74% of retail investors lose money                     ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                                             │
│  AuthorCredits (ниже hero, на белом)                        │
│                                                             │
│  3-COLUMN LAYOUT                                            │
│  TOC (left) │ CONTENT (center) │ SIDEBAR (right)           │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Wow-factor** — gradient hero моментально отличает от конкурентов
- **Depth** — overlapping cards, glassmorphism — современный visual language
- **Transparent header** — seamless experience
- Зелёный CTA на тёмном hero = максимальный контраст

### Слабые стороны
- Тёмный hero может восприниматься как "тяжёлый"
- Glassmorphism может плохо работать на слабых GPU (mobile)
- Сложнее реализовать transparent → solid header transition

---

# Концепция 3: "Score-Centric"
### Философия: Рейтинг — это и есть дизайн

Вдохновение: Trustpilot + Glassdoor. Score — доминирующий визуальный элемент. Большие circular progress, color-coded всё. Посетитель моментально видит, хороший брокер или нет.

### Палитра
- **Score Excellent (9+):** #059669 (наш зелёный)
- **Score Very Good (8-8.9):** #2563EB (blue)
- **Score Good (7-7.9):** #F59E0B (amber)
- **Score Fair (6-6.9):** #EF4444 (red)
- **Фон:** #FFFFFF
- **Section bg:** Чередование #FFFFFF и #F1F5F9

### Score Ring Component (новый)
```
    ╭─────╮
   │ ████░ │   Score: 9.5
   │ █     │   Excellent
   │ ████░ │
    ╰─────╯

SVG: <circle cx="50" cy="50" r="40"
  stroke-dasharray="251.3"
  stroke-dashoffset="12.6"  /* 100% - 95% */
  stroke="#059669"
  stroke-width="6"
  fill="none" />
```

Три размера:
- **XL (120px)** — hero ревью
- **MD (64px)** — карточки рейтинга
- **SM (40px)** — sidebar, alternatives

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│  H1 + AuthorCredits + Trust Stats                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SCORE LEADERS (horizontal scroll on mobile)                │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │   ╭───╮   │  │   ╭───╮   │  │   ╭───╮   │              │
│  │   │9.5│   │  │   │9.3│   │  │   │9.1│   │              │
│  │   ╰───╯   │  │   ╰───╯   │  │   ╰───╯   │              │
│  │ IC Markets │  │ Pepperstone│  │    XM     │              │
│  │ Best ECN   │  │ Runner-up  │  │ Cheapest  │              │
│  │ [Visit →]  │  │ [Visit →]  │  │ [Visit →] │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│                                                             │
│  BROKER CARDS with prominent score rings                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ╭──╮                                                │   │
│  │ │9.5│ #1  IC Markets  │ ECN · ASIC · 0.0 pips      │   │
│  │ ╰──╯                  │ [Visit IC Markets →]        │   │
│  │                       │ [Read Review]               │   │
│  │ Sub-scores (mini bars): Reg 9.8 │ Costs 9.5 │ ...  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  6 SUB-SCORE MINI-BARS inline в каждой карточке            │
│  ████████████░ Reg 9.8  ██████████░░ Costs 9.5  ...       │
└─────────────────────────────────────────────────────────────┘
```

**BrokerRankCard:**
- Score Ring слева (64px) — color-coded
- 6 sub-score mini-bars горизонтально под основным контентом
- Background карточки слегка tinted по цвету score: excellent → #f0fdf4, good → #eff6ff

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│  HERO                                                       │
│  ┌────────────────────────────────────────┬─────────────┐  │
│  │ Logo + Name + Meta                     │   ╭─────╮   │  │
│  │                                        │   │     │   │  │
│  │ Quick metrics row                      │   │ 9.5 │   │  │
│  │                                        │   │     │   │  │
│  │ Regs + Trustpilot                      │   ╰─────╯   │  │
│  │                                        │  Excellent   │  │
│  │                                        │ [Visit CTA]  │  │
│  └────────────────────────────────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SCORING SECTION — полностью визуальная                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ╭───╮  ╭───╮  ╭───╮  ╭───╮  ╭───╮  ╭───╮        │   │
│  │  │9.8│  │9.5│  │8.7│  │9.0│  │9.2│  │8.5│        │   │
│  │  ╰───╯  ╰───╯  ╰───╯  ╰───╯  ╰───╯  ╰───╯        │   │
│  │  Reg    Costs  Reputa  Transp  Platf  Exec         │   │
│  │  30%    20%    15%     15%     15%    5%           │   │
│  │                                                     │   │
│  │  OVERALL: ════════════════════════════ 9.5/10       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  (6 маленьких ring charts в grid 3x2 или 6x1)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Скор = бренд** — моментальная узнаваемость
- Sub-scores видны сразу — transparency как конкурентное преимущество
- Color-coding по скору — интуитивно понятно
- Ring charts уникальны в нише

### Слабые стороны
- Может выглядеть как dashboards/analytics tool, а не editorial site
- Много SVG elements → potential performance concern on mobile
- Sub-scores могут быть confusing если у брокера нет полных данных

---

# Концепция 4: "Card Mastery"
### Философия: Карточки — основа всего, но разные

Вдохновение: Apple.com (product cards) + Notion (clean cards) + NerdWallet (comparison cards). Каждая карточка — самодостаточный unit с разным визуальным весом.

### Палитра
- **Card bg:** #FFFFFF
- **Page bg:** #F1F5F9 (теплее текущего)
- **Card shadow:** `0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)` — двойная тень для depth
- **#1 card:** left border 4px solid #059669 + enhanced shadow
- **Accent:** #059669 + #7C3AED (purple для awards/special badges)

### RankingPage — "Stacked Cards"
```
┌─────────────────────────────────────────────────────────────┐
│  H1 + Author + Stats (simple header)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WINNER CARD (elevated, larger, with special treatment)     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏆 EDITOR'S CHOICE                                  │   │
│  │ ═════════════════════════════════════════════════════│   │
│  │                                                     │   │
│  │ Logo(64px)  IC Markets                 Score: 9.5   │   │
│  │             ECN/STP Broker             ████████████  │   │
│  │             ASIC · FCA · CySEC                      │   │
│  │                                                     │   │
│  │ Spread: 0.0  |  Commission: $3.50  |  Min: $200    │   │
│  │                                                     │   │
│  │ "IC Markets leads our ECN ranking with..."          │   │
│  │                                                     │   │
│  │  ✅ Lowest raw spreads     ❌ No proprietary app    │   │
│  │  ✅ 3,500+ instruments     ❌ Limited education     │   │
│  │  ✅ cTrader + MT4/5                                 │   │
│  │                                                     │   │
│  │ [  Visit IC Markets →  ]    [ Read Full Review ]    │   │
│  │                                                     │   │
│  │  74% of retail CFD accounts lose money              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  RUNNER-UP CARDS (medium size, 2 per row on desktop)        │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ #2 Pepperstone      │  │ #3 XM               │         │
│  │ Score: 9.3          │  │ Score: 9.1           │         │
│  │ [metrics]           │  │ [metrics]            │         │
│  │ [Visit] [Review]    │  │ [Visit] [Review]     │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                             │
│  REMAINING CARDS (compact, single row)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #4 XYZ  │ 8.7 │ metrics │ [Visit]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #5 ABC  │ 8.5 │ metrics │ [Visit]                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Ключевая идея:** Три уровня карточек:
1. **Winner** (rank 1) — full-width, подробная, с pros/cons и blurb
2. **Top 3** (rank 2-3) — 2-column grid, средний размер
3. **Others** (rank 4+) — compact single-row

### BrokerReview — "Hero Card"
Hero брокера выглядит как elevated card:
```
┌─────────────────────────────────────────────────────────────┐
│ page bg: #F1F5F9                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ HERO CARD (elevated, double shadow)                  │   │
│  │                                                      │   │
│  │  Logo(72px) + H1 + Meta + Metrics + Score + CTA     │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┬───────────────────────────────┐   │
│  │  CONTENT CARDS      │    SIDEBAR CARDS              │   │
│  │                     │                               │   │
│  │  ┌───────────────┐ │    ┌─────────────────────┐    │   │
│  │  │ OVERVIEW      │ │    │ Score + CTA          │    │   │
│  │  │ [text]        │ │    └─────────────────────┘    │   │
│  │  └───────────────┘ │                               │   │
│  │                     │    ┌─────────────────────┐    │   │
│  │  ┌───────────────┐ │    │ Quick Facts          │    │   │
│  │  │ SCORING       │ │    └─────────────────────┘    │   │
│  │  │ [breakdown]   │ │                               │   │
│  │  └───────────────┘ │                               │   │
│  │                     │                               │   │
│  │  (каждая секция —  │                               │   │
│  │   отдельная card)  │                               │   │
│  └─────────────────────┴───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Visual hierarchy** через размер карточек — сразу видно кто #1
- Карточки #2-3 в grid — efficient use of space
- Compact cards для остальных — быстрый scan
- Каждая секция — isolated card → лёгко переставлять

### Слабые стороны
- Три уровня карточек = три разных компонента (или сложная логика)
- На мобильном — все карточки всё равно будут full-width
- Purple accent (#7C3AED) может конфликтовать с зелёным

---

# Концепция 5: "Minimal Swiss"
### Философия: Белое пространство — это дизайн

Вдохновение: Swiss design + Stripe + Linear. Максимум whitespace, тонкие линии, крупная типографика, никаких теней. Чистота = доверие.

### Палитра
- **Фон:** #FFFFFF — ВСЁ
- **Borders:** #E5E7EB (тонкие, 1px)
- **Text:** #111827 (почти чёрный)
- **Secondary:** #6B7280
- **CTA:** #059669 — единственное яркое пятно
- **Score highlight:** #059669 background, white text (inverted)

### Типографика
- **H1:** Outfit 900, **56px** desktop — гигантский заголовок как statement
- **H2:** Outfit 700, 32px — с большим margin-top: 64px
- **Body:** DM Sans 17px, line-height 2.0 (очень свободный)
- **Scores:** JetBrains Mono 900 — ещё крупнее

### Шапка
- Ультра-минимальная: Logo | spacer | nav links (no dropdown, plain text) | Search icon
- Высота 56px, border-bottom 1px solid #E5E7EB
- Никаких dropdown menus — ссылки уходят на /rankings, /reviews etc

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│  Best ECN Forex Brokers 2026                                │
│  (Outfit 900, 56px, #111827, left-aligned)                  │
│                                                             │
│  Compare the top 5 ECN brokers. Ranked by experts           │
│  who tested each with real money.                           │
│  (DM Sans 17px, #6B7280, max-width 600px)                  │
│                                                             │
│  Written by Sarah Johnson · Reviewed by Mike Chen           │
│  Updated March 2026                                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  1.  IC Markets                                   9.5       │
│      ECN/STP · ASIC, FCA · Spread from 0.0 pips            │
│      [Visit IC Markets]                                     │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  2.  Pepperstone                                  9.3       │
│      ECN/STP · ASIC, FCA · Spread from 0.1 pips            │
│      [Visit Pepperstone]                                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  (Минималистичные записи, разделённые линиями)              │
│                                                             │
│                                                             │
│  Methodology                                                │
│  ──────────                                                 │
│  We tested each broker with $10,000...                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  IC Markets Review 2026                                     │
│  (56px, bold)                                               │
│                                                             │
│  ┌──────────────────────┐                                  │
│  │  9.5/10  Excellent   │  (inverted: green bg, white text)│
│  └──────────────────────┘                                  │
│                                                             │
│  ECN/STP Broker · Est. 2007 · Sydney · ASIC, FCA, CySEC   │
│                                                             │
│  Sarah Johnson, Senior Analyst · March 2026                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Overview                                                   │
│                                                             │
│  IC Markets is an Australian ECN broker...                  │
│  (17px, line-height 2.0, max-width 680px)                  │
│                                                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Scoring                                                    │
│                                                             │
│  Regulation        ████████████████████░   9.8  (30%)      │
│  Trading Costs     ██████████████████░░░   9.5  (20%)      │
│  User Reputation   █████████████░░░░░░░   8.7  (15%)      │
│  ...                                                        │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [  Open an IC Markets Account →  ]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Уникальность** — ни один конкурент не делает "swiss minimal"
- **Читаемость** — большой шрифт + огромный leading = журнальный feel
- **Скорость** — минимум CSS, минимум DOM-элементов
- Score inverted (зелёный фон + белый текст) — сильный visual anchor

### Слабые стороны
- **Рискованно** — может выглядеть "пустым" / незаконченным для mass audience
- **Нет sidebar** — одна колонка на desktop = упущенные CTA
- Нет карточек → broker cards как plain text rows = меньше click surface
- Не подходит для 207 рейтингов — слишком минимально для data-dense pages

---

# Концепция 6: "Data Dashboard"
### Философия: Данные визуально, как финтех-панель

Вдохновение: Bloomberg Terminal (lite) + Robinhood + Trading platforms. Сайт выглядит как dashboard аналитика, а не блог.

### Палитра
- **Header + sidebar:** #0F172A (dark navy)
- **Content bg:** #FFFFFF
- **Page bg:** #F8FAFC
- **Data accent:** #06B6D4 (cyan) — для графиков и data viz
- **CTA:** #059669 (наш зелёный)
- **Warning:** #F59E0B
- **Score scale:** Gradient от red → yellow → cyan → green

### Шапка
- Dark navy header (#0F172A), 52px
- White logo + nav
- "Live Data" indicator (зелёный dot) — подчёркивает актуальность

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓ Header (dark navy) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────────────────────────────┤
│ H1 + Author + Stats                                        │
├────────────────┬────────────────────────────────────────────┤
│ LEFT PANEL     │  MAIN CONTENT                              │
│ (220px, white) │                                            │
│                │  TOP 3 MINI-DASHBOARD                      │
│ FILTERS:       │  ┌───────────────────────────────────┐    │
│ Execution:     │  │ #1 IC Markets                     │    │
│ [x] ECN       │  │ ┌──────┬──────┬──────┬──────┐    │    │
│ [ ] MM        │  │ │ 9.8  │ 9.5  │ 8.7  │ 9.0  │    │    │
│ [ ] STP       │  │ │ Reg  │ Cost │ Rep  │ Plat │    │    │
│               │  │ └──────┴──────┴──────┴──────┘    │    │
│ Min Score:    │  │ Overall: ████████████████ 9.5     │    │
│ [=====●==] 8+ │  │ [Visit →]  [Review →]            │    │
│               │  └───────────────────────────────────┘    │
│ Regulation:   │                                            │
│ [x] Tier 1   │  COMPARISON MATRIX (всегда видна)          │
│ [ ] All      │  ┌──────────────────────────────────────┐  │
│               │  │ Broker   │Spread│Comm│Score│Reg │CTA │  │
│ SORT BY:      │  │ IC Mkts  │ 0.0  │$3.5│ 9.5│ASIC│ →  │  │
│ ◉ Score      │  │ Pepper   │ 0.1  │$3.0│ 9.3│FCA │ →  │  │
│ ○ Spread     │  └──────────────────────────────────────┘  │
│ ○ Min Dep    │                                            │
│               │  DETAILED CARDS (expandable)               │
│ CATEGORIES:   │  [#1 IC Markets ▼]                         │
│ → All         │  [#2 Pepperstone ▼]                        │
│ → ECN         │                                            │
│ → Low Spread  │  EDUCATION                                 │
└────────────────┴────────────────────────────────────────────┘
```

### BrokerReview — "Analytics View"
```
┌─────────────────────────────────────────────────────────────┐
│  HERO (compact, data-dense)                                 │
│  Logo + H1 + metadata (single row)                          │
│  ┌──────────────────────────────────────────────────┐      │
│  │  SCORE PANEL — 6 gauges/bars inline               │      │
│  │  Reg: 9.8 │ Cost: 9.5 │ Rep: 8.7 │ ...          │      │
│  │  OVERALL: ██████████████████████████ 9.5/10       │      │
│  └──────────────────────────────────────────────────┘      │
├────────────────┬────────────────────────────────────────────┤
│ SIDEBAR NAV    │  CONTENT (табличный, data-first)           │
│ (dark navy)    │                                            │
│                │  Spread Comparison (bar chart):             │
│ Overview       │  IC Markets:  ██ 0.0                       │
│ Scoring        │  Pepperstone: ███ 0.1                      │
│ Costs ●        │  XM:          █████ 0.6                    │
│ Spreads        │                                            │
│ Platforms      │  Accounts Table (enhanced with icons)      │
│ ...            │                                            │
│                │  Regulation (status indicators)             │
│ [Visit →]      │  ASIC ● Active  │  License: 335692        │
│                │  FCA  ● Active  │  License: 696012        │
│                │                                            │
└────────────────┴────────────────────────────────────────────┘
```

### Сильные стороны
- **Фильтрация** — уникальна, ни один конкурент (кроме FXEmpire) не делает sidebar filters на ranking
- **Data visualization** — bar charts для spreads, gauges для scores
- **Professional feel** — привлекает серьёзных трейдеров
- Dark sidebar nav на ревью = sticky и заметный

### Слабые стороны
- **Сложность реализации** — charts, filters, sort = много кода
- **Отпугивает новичков** — слишком "технический" вид
- **Performance** — charts + filters + sort = тяжелый JS
- Не располагает к чтению длинных текстов

---

# Концепция 7: "Trust Temple"
### Философия: Доверие через визуальные сигналы на каждом экране

Вдохновление: Banking websites + Wikipedia trust signals. Каждый компонент кричит "нам можно доверять". Регуляции, авторы, методология — визуально prominent.

### Палитра
- **Primary:** #1E3A5F (deep navy) — authority
- **Trust green:** #059669 — verified, approved
- **Trust blue:** #2563EB — informational, neutral
- **Gold:** #D4A853 — awards, certifications
- **Bg:** #FFFFFF, sections: #F8FAFB
- **Alert bg:** #FEF3C7 (warm yellow) — для disclaimers

### Шапка
- Top trust bar: "All reviews are independent and unbiased · Read our Methodology"
- Белый фон, зелёная border-top 3px
- "Verified Reviews" badge рядом с logo

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────┐  │
│ │ ✅ All reviews verified by our methodology · Mar 2026 │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│  H1: Best ECN Forex Brokers 2026                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TRUST PANEL                                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │ 🔬 Tested│ │ 📋 200+  │ │ 👨‍💼 Expert│ │ 📅 Mar │ │   │
│  │  │ With Real│ │ Data     │ │ Reviewed │ │ 2026   │ │   │
│  │  │ Money    │ │ Points   │ │ By 3     │ │ Updated│ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ AUTHOR CREDENTIALS (expanded, with photos 48px)     │   │
│  │ Written by [PHOTO] Sarah Johnson, CFA               │   │
│  │ 15 years in forex markets · Previously at Bloomberg  │   │
│  │                                                     │   │
│  │ Reviewed by [PHOTO] Mike Chen, Senior Editor         │   │
│  │ Fact-checked by [PHOTO] Anna Lee, Compliance Expert  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  BROKER CARDS with trust badges                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ VERIFIED   #1 IC Markets                         │   │
│  │                                                     │   │
│  │ Regulations: [ASIC ✅] [FCA ✅] [CySEC ✅]          │   │
│  │ Tier-1 Licensed: Yes                                │   │
│  │ Client Money Segregated: Yes                        │   │
│  │ Negative Balance Protection: Yes                    │   │
│  │                                                     │   │
│  │ Score: 9.5/10 · Trust Score: 98/100                │   │
│  │ Trustpilot: ⭐⭐⭐⭐⭐ 4.8 (12,456 reviews)        │   │
│  │                                                     │   │
│  │ [  Visit IC Markets — Verified Partner →  ]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ DISCLAIMER                                      │   │
│  │  RatedBrokers earns commissions from partners...    │   │
│  │  This does not affect our rankings or reviews.      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│  HERO with VERIFICATION BADGES                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Logo + H1 + "✅ Verified Review"                    │   │
│  │                                                     │   │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │ │ ✅ Real    │ │ ✅ Live    │ │ ✅ 3-Expert │      │   │
│  │ │ Money Test │ │ Account   │ │ Reviewed   │      │   │
│  │ └────────────┘ └────────────┘ └────────────┘      │   │
│  │                                                     │   │
│  │ Score: 9.5/10 (with methodology link)              │   │
│  │ Trustpilot: 4.8/5 (12,456 reviews)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  REGULATION SECTION — визуально первый (вместо Overview)    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🛡️ Regulatory Status                               │   │
│  │                                                     │   │
│  │ ASIC (Australia)  ● ACTIVE  License: 335692        │   │
│  │ FCA (UK)          ● ACTIVE  License: 696012        │   │
│  │ CySEC (EU)        ● ACTIVE  License: 362/18       │   │
│  │                                                     │   │
│  │ ✅ Client Money Segregated                          │   │
│  │ ✅ Negative Balance Protection                      │   │
│  │ ✅ Financial Ombudsman Available                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... remaining sections with trust indicators               │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Google E-E-A-T gold mine** — максимум trust signals для SEO
- **Отличие от конкурентов** — никто не делает trust так визуально и настойчиво
- **Affiliate-safe** — disclaimers видны, Google не оштрафует
- Regulation first → подчёркивает нашу unique value (knockout criterion)

### Слабые стороны
- **Перебор с trust** — может выглядеть как "мы слишком стараемся доказать"
- **Визуально тяжёлый** — много иконок, бейджей, текста в hero
- **CTA утоплен** — если trust signals доминируют, CTA теряет focus
- Не fun — очень серьёзный, dry

---

# Концепция 8: "Conversion Machine"
### Философия: Каждый пиксель работает на клик по CTA

Вдохновление: Landing pages + A/B tested templates. Оптимизация для CTR и конверсий. Affiliate revenue первично.

### Палитра
- **CTA primary:** #059669 (крупный, яркий)
- **CTA hover:** #047857 (темнее)
- **Urgency:** #EF4444 (красные ограниченные предложения)
- **Promo bg:** #FEF3C7 (warm yellow callout)
- **Score bg:** #ECFDF5 (мягкий зелёный для score sections)
- **Body bg:** #FFFFFF

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│  H1 + Stats + Author                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔥 TOP PICK — EDITOR'S CHOICE                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  #1  [LOGO 60px]  IC Markets          SCORE: 9.5   │   │
│  │                                                     │   │
│  │  ✅ Lowest spreads  ✅ 3,500+ instruments           │   │
│  │  ✅ Tier-1 regulated (ASIC, FCA, CySEC)            │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │ 🎁 EXCLUSIVE: Get $0 commission for 30d! │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  ████████████████████████████████████████████  │ │   │
│  │  │  ████  OPEN IC MARKETS ACCOUNT NOW →   ████  │ │   │
│  │  │  ████████████████████████████████████████████  │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │  Spreads from 0.0 pips · $200 min deposit          │   │
│  │  74% of retail CFD accounts lose money              │   │
│  │                                                     │   │
│  │  [ Read Full Review → ]                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🥈 RUNNER-UP                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  #2 Pepperstone  │ 9.3 │ [OPEN ACCOUNT →]          │   │
│  │  ✅ Fastest execution  ✅ cTrader + MT5             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  COMPARISON TABLE (с CTA в каждой строке)                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Broker │ Score │ Spread │ Min Dep │     CTA      │      │
│  │ IC     │  9.5  │  0.0   │  $200   │ [Visit →]   │      │
│  │ Pepper │  9.3  │  0.1   │  $0     │ [Visit →]   │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  STICKY BAR (always visible after scroll)                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │ #1 IC Markets · 9.5/10 · [OPEN ACCOUNT NOW →]   │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│  HERO с БОЛЬШИМ CTA                                         │
│  ┌──────────────────────────┬───────────────────────┐      │
│  │ Logo + H1 + Meta         │  SCORE: 9.5/10        │      │
│  │ ✅✅✅ Quick pros        │  "Excellent"           │      │
│  │                          │                       │      │
│  │ Spread: 0.0 | Min: $200 │  ┌─────────────────┐  │      │
│  │                          │  │  VISIT IC MKTS  │  │      │
│  │ 🎁 PROMO: 30 days free  │  │  OPEN ACCOUNT → │  │      │
│  │                          │  └─────────────────┘  │      │
│  └──────────────────────────┴───────────────────────┘      │
│                                                             │
│  CONTENT with inline CTAs every 2-3 sections                │
│                                                             │
│  ## Overview                                                │
│  [text]                                                     │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 💡 Ready to trade? Open an IC Markets account →  │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  ## Scoring                                                 │
│  [breakdown]                                                │
│                                                             │
│  ## Pros & Cons                                             │
│  [grid]                                                     │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 🔥 Limited offer: $0 commission for 30 days     │      │
│  │ [  START TRADING NOW →  ]                        │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  RIGHT SIDEBAR (sticky):                                    │
│  Score + LARGE CTA (100% width) + promo + risk warning      │
│  + Quick Facts                                              │
│  + "Compare with..." links                                  │
│                                                             │
│  STICKY BOTTOM BAR (mobile)                                 │
│  [  OPEN IC MARKETS ACCOUNT — 0.0 pips →  ]               │
└─────────────────────────────────────────────────────────────┘
```

### Сильные стороны
- **Максимум revenue** — CTA на каждом экране, urgency triggers
- **Promo callouts** — жёлтые boxes для exclusive offers
- Крупная кнопка #1 в рейтинге — highest CTR
- Sticky bar + sidebar CTA = невозможно не заметить

### Слабые стороны
- **Может выглядеть spammy** — как плохой affiliate site
- **Google penalty risk** — слишком aggressive CTA placement
- **User trust снижается** — "они просто хотят чтоб я нажал"
- Не editorial, не authoritative — contradicts E-E-A-T strategy

---

# Концепция 9: "Modern Editorial"
### Философия: Лучшее из NerdWallet + Investopedia + наш бренд

Вдохновение: NerdWallet (layout + green + expandable), Investopedia (editorial weight), наш бренд (JetBrains Mono scores, inline CSS).

### Палитра
- **Primary:** #0F172A (navy headings)
- **CTA green:** #059669
- **Highlight:** #ECFDF5 (мягкий зелёный для callouts)
- **Border accent:** 4px solid #059669 для key sections (left border)
- **Section bg:** Чередование white / #F8FAFB
- **Author accent:** #2563EB (blue для author links)
- **Tag bg:** #EFF6FF (light blue для category tags)

### Типографика — **КЛЮЧЕВОЕ ОТЛИЧИЕ**
- **H1:** Outfit 900, 40px — но с `-0.03em` letter-spacing
- **"Best for" tags:** DM Sans 600, 12px, uppercase, #059669 на #ECFDF5 bg
- **Pull quotes:** DM Sans italic 20px, цвет #374151, border-left 4px #059669

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ── Best ECN Forex Brokers 2026 ──                          │
│  (H1, centered, с decorative lines по бокам)                │
│                                                             │
│  "We tested 12 ECN brokers with real money.                 │
│   IC Markets leads with 0.0 pip raw spreads."               │
│  (Pull-quote, italic 20px, centered, max-width 700px)       │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ [PHOTO] Sarah Johnson    [PHOTO] Mike Chen        │     │
│  │ Written By               Reviewed By              │     │
│  │ Senior Forex Analyst     Head of Research         │     │
│  │ CFA · 15 years           CMT · 12 years           │     │
│  │                                                   │     │
│  │ Updated: March 12, 2026 · Methodology             │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ 5 Ranked │ │ 200+ hrs │ │ Mar 2026 │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  OUR TOP PICKS                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │ BEST OVERALL ECN BROKER                        │  │   │
│  │ │ (tag: green bg, uppercase)                     │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │ Logo(48px)  IC Markets                              │   │
│  │                                                     │   │
│  │ Score: 9.5/10  │  Spread: 0.0  │  Min: $200       │   │
│  │                                                     │   │
│  │ "IC Markets delivers the tightest raw spreads..."   │   │
│  │ (editorial paragraph, not bullet points)             │   │
│  │                                                     │   │
│  │ ▸ Why we chose it: Lowest trading costs among...    │   │
│  │ ▸ Standout feature: Raw spread + cTrader combo     │   │
│  │ ▸ Who it's for: Active traders, scalpers, algo     │   │
│  │                                                     │   │
│  │ [  Learn More  ]    [  Read Full Review →  ]        │   │
│  │ on IC Markets' website                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ BEST ECN FOR BEGINNERS                              │   │
│  │ Logo(48px)  Pepperstone                             │   │
│  │ Score: 9.3  │  Spread: 0.1  │  Min: $0             │   │
│  │ ...                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  COMPARISON TABLE                                           │
│  (clean, NerdWallet-style with column highlight for #1)     │
│                                                             │
│  METHODOLOGY SECTION (expandable, inline)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ▸ How we selected these brokers (click to expand)   │   │
│  │   We opened live accounts with each broker...       │   │
│  │   Read our detailed methodology →                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  FAQ (accordion)                                            │
│  Author Bio Card                                            │
│  Disclosure                                                 │
└─────────────────────────────────────────────────────────────┘
```

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumbs                                                │
├─────────────────────────────────────────────────────────────┤
│  HERO (white bg, spacious)                                  │
│                                                             │
│  ┌──────────────────────────────┬───────────────────────┐  │
│  │ [LOGO 64px]                  │                       │  │
│  │                              │  OUR RATING           │  │
│  │ IC Markets Review 2026       │  ┌───────────────┐   │  │
│  │ (Outfit 900, 36px)           │  │    9.5/10     │   │  │
│  │                              │  │  "Excellent"  │   │  │
│  │ ECN/STP · Est. 2007 · ASIC  │  └───────────────┘   │  │
│  │                              │                       │  │
│  │ TP ⭐ 4.8 (12,456 reviews)  │  🎁 Promo: ...       │  │
│  │                              │                       │  │
│  │ ┌─────┐ ┌─────┐ ┌─────┐   │  [  Visit IC Markets ]│  │
│  │ │Sprd │ │Comm │ │Min  │   │  [  → Learn More     ]│  │
│  │ │ 0.0 │ │$3.50│ │$200 │   │                       │  │
│  │ └─────┘ └─────┘ └─────┘   │  risk warning          │  │
│  └──────────────────────────────┴───────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  [PHOTO] Written by Sarah Johnson, CFA            │     │
│  │  [PHOTO] Reviewed by Mike Chen                    │     │
│  │  [PHOTO] Fact-checked by Anna Lee                 │     │
│  │  Updated: March 12, 2026                          │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────┬───────────────────────────┬──────────────┐   │
│  │ LEFT TOC │  CONTENT                  │ SIDEBAR      │   │
│  │ (sticky) │                           │ (sticky)     │   │
│  │          │  ## Overview               │              │   │
│  │ "In this │  (editorial paragraphs)   │ Score + CTA  │   │
│  │  review" │                           │              │   │
│  │          │  > "IC Markets is among   │ Quick Facts  │   │
│  │ Overview │  > the few brokers where  │              │   │
│  │ Scoring  │  > you can trade with     │ Alternatives │   │
│  │ Pros/Cons│  > truly raw spreads."    │              │   │
│  │ ...      │  (pull-quote, left border)│              │   │
│  │          │                           │              │   │
│  │          │  ## Scoring Breakdown      │              │   │
│  │          │  [visual bars + details]  │              │   │
│  │          │                           │              │   │
│  │          │  ## Pros & Cons            │              │   │
│  │          │  ┌────────┬────────┐     │              │   │
│  │          │  │ ✅ Pros │ ❌ Cons│     │              │   │
│  │          │  └────────┴────────┘     │              │   │
│  └──────────┴───────────────────────────┴──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Ключевые элементы:
1. **Pull-quotes** — выделяют ключевые цитаты из контента (border-left 4px green)
2. **"Best for" tags** — каждый брокер помечен тегом в рейтинге
3. **Editorial paragraphs** — вместо bullet points в broker blurbs
4. **Expandable methodology** — inline на ranking page
5. **Author photos крупнее** — 48px с credentials

### Сильные стороны
- **Максимальный E-E-A-T** — editorial weight + trust + methodology
- **NerdWallet proven model** — этот формат работает для SEO
- **Pull-quotes** — уникальный элемент, breakpoint для scanning
- "Best for" tags — пользователь сразу видит релевантность

### Слабые стороны
- Консервативный — эволюция, не революция
- Pull-quotes на мобильном могут быть awkward
- Editorial стиль = много текста, может утомить

---

# Концепция 10: "Premium Fintech"
### Философия: Stripe meets Bloomberg. Премиум-ощущение через micro-details

Вдохновление: Stripe.com (градиенты, микро-анимации) + Revolut (fintech cards) + Mercury Bank (clean premium). Сайт ощущается как premium финтех-продукт, а не review-блог.

### Палитра
- **Primary gradient:** `linear-gradient(135deg, #0F172A, #1E3A5F)` для hero/CTAs
- **Accent gradient:** `linear-gradient(135deg, #059669, #10B981)` для CTA buttons
- **Card bg:** #FFFFFF с `box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.04)`
- **Hover:** `box-shadow: 0 0 0 1px rgba(5,150,105,0.2), 0 8px 24px rgba(0,0,0,0.06)`
- **Micro-accent:** #7C3AED (purple) для special badges
- **Score glow:** `box-shadow: 0 0 20px rgba(5,150,105,0.15)` вокруг score elements

### Типографика
- **H1:** Outfit 900, 44px, letter-spacing: -0.04em (tight tracking = premium)
- **Numbers:** JetBrains Mono 800 — но с зелёным glow effect
- **Body:** DM Sans 16px, #374151 (чуть темнее чем сейчас)
- **Small caps:** для labels: `font-variant: all-small-caps; letter-spacing: 0.08em`

### Шапка
- **Blurred glass header:** `background: rgba(255,255,255,0.85); backdrop-filter: blur(12px)`
- При scroll — subtle shadow appears
- Logo с animated gradient text on hover

### RankingPage
```
┌─────────────────────────────────────────────────────────────┐
│ ▒▒▒ Glass Header (blur) ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HERO CARD (soft gradient bg: white → #F8FAFB)      │   │
│  │                                                     │   │
│  │  ⚡ Best ECN Forex Brokers 2026                     │   │
│  │  (Outfit 900, 44px, -0.04em)                        │   │
│  │                                                     │   │
│  │  Compare the top ECN brokers ranked by               │   │
│  │  independent experts.                                │   │
│  │                                                     │   │
│  │  ┌─ Trust Stats (subtle cards, rounded-xl) ─────┐  │   │
│  │  │ 5 Ranked  │  200+ Hours  │  Updated Mar 2026 │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │  AuthorCredits (photos 40px, credentials)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  WINNER SPOTLIGHT                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ═══ #1 OVERALL ═══                                 │   │
│  │                                                     │   │
│  │  ┌─────────────┐                                   │   │
│  │  │ Logo(56px)  │  IC Markets                       │   │
│  │  └─────────────┘  ECN/STP · ASIC, FCA, CySEC      │   │
│  │                                                     │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ Spread   Commission   Min Deposit   Score  │    │   │
│  │  │  0.0      $3.50        $200         9.5    │    │   │
│  │  │  pips     per lot                   /10    │    │   │
│  │  │ (monospace, green glow)                    │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                     │   │
│  │  "IC Markets leads with institutional-grade..."     │   │
│  │                                                     │   │
│  │  ┌──────────────────────────┐                      │   │
│  │  │ ██ Open IC Markets Account ██                   │   │
│  │  │ (gradient btn, 52px height, glow on hover)      │   │
│  │  └──────────────────────────┘                      │   │
│  │  [ Read Full IC Markets Review → ]                  │   │
│  │                                                     │   │
│  │  risk warning (11px, muted)                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  OTHER TOP PICKS (2-column cards, smaller)                  │
│  ┌──────────────────────┐ ┌──────────────────────┐         │
│  │ #2 Pepperstone       │ │ #3 XM                │         │
│  │ Best for Speed       │ │ Best for Low Cost    │         │
│  │ 9.3 [Visit→]        │ │ 9.1 [Visit→]         │         │
│  └──────────────────────┘ └──────────────────────┘         │
│                                                             │
│  REMAINING (compact list)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #4 FXCM  │ 8.9 │ 0.2 pips │ $50 │ [Visit] [Rev]  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ #5 Oanda │ 8.7 │ 0.4 pips │ $0  │ [Visit] [Rev]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  COMPARISON TABLE (with hover glow effects)                │
│  EDUCATION                                                  │
│  METHODOLOGY CTA (gradient card)                            │
│  AUTHOR BIO (premium card, photo border glow)               │
└─────────────────────────────────────────────────────────────┘
```

### BrokerReview
```
┌─────────────────────────────────────────────────────────────┐
│  HERO (premium card, elevated)                              │
│  ┌─────────────────────────────┬────────────────────────┐  │
│  │                             │                        │  │
│  │  Logo(72px, with glow)     │  ┌──────────────────┐  │  │
│  │                             │  │ OUR RATING       │  │  │
│  │  IC Markets Review 2026     │  │                  │  │  │
│  │  (Outfit 900, 36px, tight)  │  │  ┌──────────┐   │  │  │
│  │                             │  │  │   9.5    │   │  │  │
│  │  ECN/STP · Sydney · 2007   │  │  │  /10     │   │  │  │
│  │                             │  │  │Excellent │   │  │  │
│  │  ⭐ 4.8 Trustpilot          │  │  └──────────┘   │  │  │
│  │  (12,456 reviews)           │  │  (score with     │  │  │
│  │                             │  │   green glow)    │  │  │
│  │  ASIC · FCA · CySEC        │  │                  │  │  │
│  │  (reg badges with check)    │  │  🎁 Promo text  │  │  │
│  │                             │  │                  │  │  │
│  │ Spread  Commission  MinDep  │  │  ┌────────────┐ │  │  │
│  │  0.0     $3.50      $200    │  │  │Visit IC Mkts│ │  │  │
│  │ (JBMono, green glow)       │  │  │  ████████  │ │  │  │
│  │                             │  │  └────────────┘ │  │  │
│  │                             │  │  risk warning   │  │  │
│  │                             │  └──────────────────┘  │  │
│  └─────────────────────────────┴────────────────────────┘  │
│                                                             │
│  AuthorCredits (premium, with credentials inline)           │
│                                                             │
│  3-COLUMN LAYOUT with premium cards                         │
│  TOC (sticky) │ CONTENT (cards per section) │ SIDEBAR       │
│                                                             │
│  Scoring: 6 sub-scores with animated progress bars          │
│  ████████████████████████░░░░ 9.8 Regulation (30%)         │
│  (bars animate on scroll-into-view via IntersectionObserver) │
│                                                             │
│  Verdict: premium gradient card (navy→teal bg)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ▓▓ Expert Verdict ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│  │ ▓ [Author photo + quote]                           ▓ │  │
│  │ ▓ "IC Markets is our top recommendation for..."    ▓ │  │
│  │ ▓ [Visit IC Markets →]                             ▓ │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Micro-interactions (CSS-only):
1. **Score glow:** `box-shadow: 0 0 20px rgba(5,150,105,0.15)` on hover
2. **Card hover:** border → green, shadow increases
3. **Progress bars:** анимация ширины при появлении в viewport (IntersectionObserver + CSS transition)
4. **CTA hover:** gradient shift + shadow increase
5. **Glass header:** blur increases on scroll

### Сильные стороны
- **Самый современный вид** — 2026 fintech aesthetic
- **Micro-details** создают ощущение premium
- Glass header + animated bars = wow-factor без тяжёлого кода
- Glow effects на scores — уникально в нише
- 3-уровневая карточная система (winner / top 3 / rest) = хорошая hierarchy

### Слабые стороны
- **Backdrop-filter** может быть медленным на слабых мобильных
- **Glow effects** на некоторых мониторах могут быть незаметны
- Больше CSS complexity → больше edge cases

---

# Сводная таблица всех 10 концепций

| # | Название | Hero | Score Display | CTA Style | Sidebar | Сложность | Конверсия | SEO/E-E-A-T | Wow |
|---|----------|------|---------------|-----------|---------|-----------|-----------|-------------|-----|
| 1 | Financial Authority | White, spacious | Ring chart | Green gradient | Yes (filters) | ★★☆ | ★★★ | ★★★★ | ★★☆ |
| 2 | Gradient Hero | Navy gradient | Number + ring | Green on dark | No | ★★★ | ★★★ | ★★★ | ★★★★ |
| 3 | Score-Centric | Simple | Ring charts everywhere | Green solid | No | ★★★ | ★★★★ | ★★★ | ★★★ |
| 4 | Card Mastery | Card-based | Number in card | Green + outlined | Cards sidebar | ★★★ | ★★★ | ★★★ | ★★★ |
| 5 | Minimal Swiss | Huge text only | Inverted badge | Minimal green | No (1 col) | ★☆☆ | ★★☆ | ★★☆ | ★★★ |
| 6 | Data Dashboard | Compact data | Gauges + bars | Green button | Yes (filters) | ★★★★ | ★★★ | ★★★ | ★★★ |
| 7 | Trust Temple | Trust badges | Score + trust | "Verified" CTA | No | ★★★ | ★★☆ | ★★★★★ | ★★☆ |
| 8 | Conversion Machine | Big CTA | Score + urgency | Huge green CTA | Yes (CTA) | ★★☆ | ★★★★★ | ★★☆ | ★★☆ |
| 9 | Modern Editorial | Editorial, quotes | Score in card | "Learn More" | Yes (sticky) | ★★☆ | ★★★★ | ★★★★★ | ★★★ |
| 10 | Premium Fintech | Premium card | Glow scores | Gradient + glow | Yes (sticky) | ★★★★ | ★★★★ | ★★★★ | ★★★★★ |

---

# Моя рекомендация

**TOP 3 для рассмотрения:**

### 🥇 Концепция 10: "Premium Fintech"
**Почему:** Максимальный wow-factor + strong conversion + modern aesthetic. Glass header и glow scores — то, чего нет ни у одного конкурента. Premium feel привлекает серьёзных трейдеров (наша ЦА). Animated progress bars при scroll — бесплатный engagement boost.

### 🥈 Концепция 9: "Modern Editorial"
**Почему:** Лучший баланс SEO/E-E-A-T и конверсии. Pull-quotes + "Best for" tags + expanded AuthorCredits — проверенный NerdWallet-подход. Быстрее реализовать чем #10.

### 🥉 Концепция 2: "Gradient Hero"
**Почему:** Dramatic first impression при минимальных изменениях остального контента. Gradient hero + glassmorphism stats = сильный visual hook. Относительно просто реализовать.

### Оптимальная стратегия: Hybrid 10 + 9
Взять **Premium Fintech** как base (glass header, glow scores, 3-level cards, animated bars) и добавить из **Modern Editorial**: pull-quotes, "Best for" tags, expanded AuthorCredits с credentials, expandable methodology inline.

---

*Документ создан для Егора. Жду выбора направления для реализации.*

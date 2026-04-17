# Link & Button System — RatedBrokers

> **Назначение:** единый словарь типов гиперссылок, кнопок и визуальных решений переходов для всего сайта. Один интент = один стиль. Использовать как reference перед любым новым UI-элементом.
>
> **Связанные:** `DESIGN-ANTIPATTERNS.md`, `memory/design.md` (Brand Button Invariants I1–I7), `src/index.css` (живая реализация), `/proto/link-system` (плейграунд).
>
> **Статус:** концепция (2026-04-17). Proto есть, миграция кода — после аппрува Егора.

---

## Почему эта система нужна

Аудит показал **минимум 6 несвязанных систем ссылок/кнопок** в живом коде:

1. `.link-green` (standalone, 14px)
2. `.link-inline` (body, underline)
3. Header nav D1 Rail (15px + bottom border)
4. Header mega-menu compactLink (14px, filled hover)
5. Footer `baseLinkStyle` (dark bg, 15px)
6. Breadcrumb (13px, chevron)

Плюс артефакты старой палитры: `#2563eb` blue links в AboutPage, hardcoded `\u2197` arrow-текст в BrokerReview, 100% дублированные inline `cta-orange` в 6+ местах BrokerReview, per-category цветные dots (#6366f1, #ef4444) в Header и Countries.

**Последствия:**
- Пользователь не может по стилю понять, куда приведёт клик (внешне / внутренне / служебно)
- Зелёный цвет размыт: он и бренд, и CTA, и rail-navigation, и inline-links — сигналы не различимы
- При редизайне секции приходится «изобретать» стиль ссылки каждый раз → разрозненность, которую почувствовал Егор
- Нет accessibility-слоя: focus-visible, prefers-reduced-motion, touch-target не стандартизированы

---

## Принципы

1. **Один интент = один стиль.** Если пользователь выполняет одно и то же действие (перейти на рейтинг / прочитать статью / ткнуть CTA), стиль обязан совпадать независимо от страницы и секции.

2. **Визуальная тяжесть = уровень обязательства.**
   - Filled gradient button = конверсия (affiliate, деньги)
   - Filled navy button = ключевое внутреннее действие
   - Outline/ghost = поддерживающее действие
   - Text link + arrow = навигация
   - Underlined inline = ссылка внутри текста
   - Meta middot = служебная информация
   - Порядок нарушать нельзя: градиент внутри body-параграфа = крикливый баннер.

3. **Premium Dark rhythm первичен.** Светлая и тёмная подложка требуют **двух парных вариантов** у каждого типа ссылки (у кнопок чаще всего паритет). Исключение: affiliate CTA (oранжевый) — одинаково работает на обоих фонах.

4. **Brand invariants I1–I7 применимы ко всем кнопкам.** Motion `cubic-bezier(0.4, 0, 0.2, 1)` 250ms, radius 8–10, Outfit 700 14–15px letter `-0.01em`, arrow `translateX(3px)` + color flip на hover, `translateY(-1px)` lift, shadow-growth 3× на hover.

5. **Underline — ТОЛЬКО для inline в body-тексте.** Ни в меню, ни в рейтингах, ни в carpet-навигации underline не появляется. Это снижает «шум» и возвращает underline в body его исходный смысл «здесь ссылка внутри текста».

6. **Цветовой лок:**
   - `#f59e0b / #fbbf24` orange = конверсия (affiliate)
   - `#059669 / #047857 / #34d399` green = brand, inline, standalone-action, focus states
   - `#0f172a` navy = primary text, internal CTA fill
   - `#64748b / #94a3b8` slate = meta, breadcrumbs
   - **Никаких** синих `#2563eb`, пастельных `#a7f3d0` fill-подсветок, per-category цветных dots. См. `DESIGN-ANTIPATTERNS.md` §1, §2, §3, §5.

7. **Контекстное переключение типа (новое правило).** Один и тот же элемент может быть разного типа в зависимости от контекста:
   - **На review-странице** у брокера: primary orange = «Visit Broker» (affiliate). «Find Your Broker» становится secondary navy (не конкурирует с деньгами).
   - **На главной** affiliate-Visit спрятан в D2k-rows → «Find Your Broker» может быть primary orange (нет конкуренции в hero).
   - Правило: **primary orange на screen — максимум 2**. Третий CTA → secondary navy или ghost.

8. **Accessibility baseline (новое правило).**
   - `focus-visible` outline 2px `#f59e0b` + offset 2px на всех ссылках/кнопках. Клавиатурная навигация обязана быть заметной.
   - `prefers-reduced-motion`: отключает translateX/translateY, сохраняет color/shadow transitions.
   - `touch-target` mobile: кнопки min 44×44px, rail-links min 40×40px hit-area (padding-y). Сейчас Countries 11.5px-link имеет hit-area ~16×60 — это недоступно.

---

## Taxonomy — 9 токенов

| # | Token | Интент | Визуальный якорь |
|---|---|---|---|
| **B1** | `rb-cta-affiliate` | Перейти на сайт брокера (деньги) | Orange gradient + ArrowUpRight |
| **B2** | `rb-cta-internal` | Ключевое внутреннее действие | Navy fill + ArrowRight |
| **B3** | `rb-cta-ghost` | Secondary действие | Outline green (light) / glass (dark) |
| **L1** | `rb-link-inline` | Ссылка внутри параграфа | Green underlined |
| **L2** | `rb-link-standalone` | Action-link "See all →" | Green + ArrowRight, без underline |
| **L3** | `rb-link-rail` | Массовая навигация (rankings, countries, footer) | Navy body + green dot + hover bg |
| **L4** | `rb-link-meta` | Служебный footer/legal | Slate 13px middot, без стрелки |
| **N1** | `rb-link-crumb` | Breadcrumb | Slate 13px + chevron |
| **N2** | `rb-tab` | Страничный табюлятор | Navy fill active + green bottom border |

### B1. `rb-cta-affiliate` — Primary Affiliate Button

**Когда:** Visit {Broker}, Sign Up, Open Account → `/go/{slug}`.
**Не использовать:** для внутренних переходов.

| Prop | Light | Dark |
|---|---|---|
| background | `linear-gradient(135deg,#f59e0b,#fbbf24)` | (то же) |
| color | `#0f172a` | `#0f172a` |
| font | Outfit 700, 14–15px, letter `-0.01em` | (то же) |
| padding | `12px 28px` | (то же) |
| radius | 10 | 10 |
| shadow rest | `0 2px 8px rgba(245,158,11,0.3)` | `0 2px 12px rgba(245,158,11,0.25)` |
| shadow hover | `0 8px 24px rgba(245,158,11,0.4)` + `translateY(-1px)` | (то же) |
| icon | `<ArrowUpRight size={14} />` | (то же) |
| icon hover | `translate(2px,-2px)` + color `#047857` | (то же) |
| attrs | `target="_blank" rel="noopener nofollow sponsored"` | — |

### B2. `rb-cta-internal` — Primary Internal Button (Navy)

**Когда:** Find Your Broker, Start Quiz, Browse All Rankings (если нет affiliate рядом — можно B1; если есть — B2).

| Prop | Light | Dark |
|---|---|---|
| background | `#0f172a` | `#fff` |
| color | `#fff` | `#0f172a` |
| padding | `12px 24px` | `12px 24px` |
| radius | 10 | 10 |
| shadow rest | `0 2px 8px rgba(15,23,42,0.15)` | none |
| hover | bg `#1e293b` + `translateY(-1px)` + arrow flip `#34d399` | bg `#f1f5f9` + arrow flip `#059669` |
| icon | `<ArrowRight size={14} />` | (то же) |

### B3. `rb-cta-ghost` — Secondary Outline/Glass

**Когда:** Compare Brokers, Read full methodology, любое supporting действие.

| Prop | Light | Dark |
|---|---|---|
| background | `transparent` | `rgba(255,255,255,0.08)` + `backdropFilter: blur(8px)` |
| border | `2px solid #059669` | `1px solid rgba(255,255,255,0.2)` |
| color | `#059669` | `#e2e8f0` |
| hover bg | `#059669` | `rgba(52,211,153,0.12)` |
| hover color | `#fff` | `#fff` |
| hover border | — | `#34d399` |
| icon | `<ArrowRight size={14} />` | (то же) |

### L1. `rb-link-inline` — Body-text inline link

**Когда:** любая ссылка внутри `<p>` (статьи, SEO intro, методология, описания).
**Единственный тип где underline включён по умолчанию.**

| Prop | Light | Dark |
|---|---|---|
| color | `#047857` | `#34d399` |
| font | inherit от parent (size, weight unchanged) | (то же) |
| text-decoration | `underline` | (то же) |
| text-decoration-thickness | 1px | 1px |
| text-underline-offset | 3px | 3px |
| decoration color alpha rest | 40% | 40% |
| hover | color `#059669` / `#6ee7b7` + alpha 100% | (то же) |
| icon | — | — |

### L2. `rb-link-standalone` — Standalone action link

**Когда:** "See all 293 rankings →", "Browse All Countries →", "View all reviews →". Обычно справа от H2 или в конце секции.

| Prop | Light | Dark |
|---|---|---|
| color | `#059669` | `#34d399` |
| font | Outfit 700, 14px (15px на hero-dark) | Outfit 700, 15px |
| text-decoration | none | none |
| icon | `<ArrowRight size={12} />` в конце, `margin-left: 4px` | `<ArrowRight size={14} />` |
| hover | color `#f59e0b` / `#fbbf24` + arrow `translateX(3px)` | (то же) |

### L3. `rb-link-rail` — Ranking/Category/Navigation link

**Когда:** массовая навигация — Countries verticals, Footer ranking-grid, Header mega-menu column items, sidebar rankings.
**Самый массовый тип на сайте (~200+ мест).**

| Prop | Light | Dark |
|---|---|---|
| color | `#0f172a` (navy, не зелёный!) | `#e2e8f0` |
| font | DM Sans 600, **14px min** | 14px |
| padding | `4px 8px` (hit-area comp) | `4px 8px` |
| radius | 6 | 6 |
| dot | 4px circle, `#059669` left, gap 6px | 4px circle, `#34d399` |
| hover bg | `#f1f5f9` | `rgba(255,255,255,0.06)` |
| hover color | `#047857` | `#34d399` |
| hover dot | growth до 5px | (то же) |
| touch-target | min 40px vertical hit-area (с padding) | (то же) |

**Ключевое для Егора:** именно L3 решает проблему блока «Regulated Brokers by Country». Было: зелёные 11.5px links без контекста. Станет: navy 14px body-text с dot + subtle bg-подсветка на hover (как в Header mega-menu). Зелёный остаётся знаком «action», а не дефолтом всего ряда.

### L4. `rb-link-meta` — Footer/legal/eyebrow link

**Когда:** "Editorial standards · Privacy · How we make money · Contact". Служебные ссылки, не являющиеся самостоятельными actions.

| Prop | Light | Dark |
|---|---|---|
| color | `#64748b` | `#94a3b8` |
| font | DM Sans 500, 13px | 13px |
| separator | `·` middot color `#cbd5e1` между пунктами | `#475569` |
| icon | нет | нет |
| hover | color `#0f172a` | `#e2e8f0`, **без underline** |

### N1. `rb-link-crumb` — Breadcrumb

Уже реализовано в `components/Breadcrumb.jsx` корректно. Переименование в token для словарного соответствия.

| Prop | Light | Dark |
|---|---|---|
| color | `#64748b` | `#94a3b8` |
| font | DM Sans 500, 13px | 13px |
| separator | `<ChevronRight size={11} color="#cbd5e1" />` | `#475569` |
| current item | color `#0f172a` weight 600, не-кликабельный | `#f8fafc` |
| hover | color `#059669` | `#34d399` |

### N2. `rb-tab` — Pill/underline tabs

**Когда:** SubPage 8 табов, Compare category pills, любые внутристраничные переключатели.

| State | Light | Dark |
|---|---|---|
| default | color `#64748b`, bg transparent, Outfit 700 13px | color `#94a3b8` |
| hover | bg `#f8f9fb`, color `#0f172a` | bg `rgba(255,255,255,0.05)` |
| active | bg `#0f172a`, color `#fff`, border-bottom `3px solid #059669` | bg `#fff` color `#0f172a` |
| padding | `14px 20px` | (то же) |

---

## Типографика sitewide

| Token | Font | Size desk / mob | Weight | Letter-spacing | Где |
|---|---|---|---|---|---|
| H1 page | Outfit | 40 / 28 | 800 | −0.03em | Hero H1 |
| H2 section | Outfit | 30 / 22 | 800 | −0.03em | Секции |
| H3 card | Outfit | 20 / 18 | 700 | −0.02em | Card headings |
| Body | DM Sans | 16 / 15 | 400 | 0 | Параграфы |
| Body strong | DM Sans | 16 / 15 | 600 | 0 | Strong слова |
| Meta | DM Sans | 13 | 500 | 0.01em | Footer, breadcrumbs, helper |
| Eyebrow | JetBrains Mono | 11–12 | 700 | 0.12–0.18em UPPERCASE | "OUR METHODOLOGY" |
| Badge | JetBrains Mono | 11–13 | 800 | 0 | Rank #1, 02, Q1 2026 |

**Buttons всегда:** Outfit 700, 14–15px, letter `-0.01em`.

---

## Иконография переходов

| Иконка | Семантика | Где |
|---|---|---|
| `<ArrowRight>` | → Внутренний переход (не покидаю сайт) | B2, B3, L2, L3 hover |
| `<ArrowUpRight>` | ↗ Внешний переход (ухожу на брокера/регулятор) | B1, `/go/*`, d2k-rows |
| `<ExternalLink>` | 🡵 License-registries, источники (E-E-A-T, dofollow) | Regulator links в RegulationTab |
| `<ChevronRight>` | › Breadcrumb, dropdown indicator | N1, dropdown toggles |
| `<ChevronDown>` | Mega-menu toggle | Header items |

**Правило:** не смешивать ArrowRight и ArrowUpRight в одной карточке — ломает ментальный paradigm «↗ = ухожу». Хардкоднутые text-arrows (`\u2197` в BrokerReview) заменить на lucide — иначе визуал stroke/size не совпадает.

---

## Маппинг: текущее → новое

| Где сейчас | Текущий стиль | Новый токен | Ключевой диф |
|---|---|---|---|
| `Home.jsx:568` Countries verticals | green 11.5px + цветная dot | **L3 `rb-link-rail`** | 14px, navy body, единый зелёный dot, hover bg |
| `Home.jsx:504, 579` "All Countries" | `.link-green` inconsistent display | **L2 `rb-link-standalone`** | унифицированный inline-flex gap |
| `Home.jsx:962-972` Editorial row | `.link-green` + arrow | **L4 `rb-link-meta`** | 13px slate, middot, без стрелки |
| `Home.jsx:392-394` Intro links | `.link-inline` | **L1 `rb-link-inline`** | применить везде где сейчас нет |
| `Header.jsx:406` D1 nav | 15px navy + bottom border | `rb-nav-d1` (отдельный token, не в основной taxonomy) | оставить как есть, токенизировать |
| `Header.jsx:213` compactLink | 14px, filled hover | **L3 `rb-link-rail`** | консолидация |
| `Footer.jsx:111` dark links | 15px `#cbd5e1` → `#34d399` | **L3 `rb-link-rail--dark`** | консолидация |
| `Footer.jsx:300` legal row | middot 14px | **L4 `rb-link-meta--dark`** | -1px, унификация |
| `Breadcrumb.jsx:38` | 13px slate+chevron | **N1 `rb-link-crumb`** | переименование |
| `SubPageTabs.jsx:38` | navy-fill active | **N2 `rb-tab`** | переименование |
| `AboutPage.jsx:102` Back to Home | **`#2563eb` blue** (реликт старой палитры) | **L2 `rb-link-standalone`** | убрать синий |
| `BrokerReview.jsx:722` Visit ↗ | hardcoded `\u2197` text | **B1** + `<ArrowUpRight />` | lucide иконка |
| `BrokerReview.jsx` 6× inline orange CTAs | 100% дублированный inline | **B1 `rb-cta-affiliate`** | одна утилита |
| Countries dots `Home.jsx:567` | per-category colored (6 HEX) | L3 unified green dot | DESIGN-ANTIPATTERNS §3 |

---

## Миграция — план в 3 фазы

### Фаза 1. Плейграунд `/proto/link-system` (сделано)
- Все 9 токенов в 6 контекстах (light / dark / body / card / list / hover states)
- 4 Before/After worst cases
- Чек-лист invariants (7/7 для каждой кнопки)
- Аппрув Егора → фаза 2

### Фаза 2. CSS-токены
- Добавить 9 классов `rb-*` в `src/index.css`
- `.link-green` / `.link-inline` / `.cta-*` → deprecated alias (оставить работающими первые 2 недели)
- Добавить `:focus-visible` outline и `@media (prefers-reduced-motion: reduce)` overrides
- Коммит: `feat(css): add rb-* link/button tokens (phase 1)`

### Фаза 3. Кодовая миграция
- Grep-замены по маппингу (107 вхождений `.link-*`/`.cta-*` + inline-дубли)
- Приоритет: Home.jsx (20+ мест) → BrokerReview.jsx (6× duplicate CTAs) → Header.jsx / Footer.jsx → остальные 14 файлов
- Ревью-коммиты по 1 файлу
- После 100% миграции — удалить deprecated alias

---

## Чек-лист перед новым UI-элементом

- [ ] Определил **интент** (affiliate / internal-primary / internal-secondary / inline / standalone / rail / meta / crumb / tab)?
- [ ] Использую **существующий токен** (не изобретаю новый inline-стиль)?
- [ ] На светлом фоне? → light variant. На тёмном? → dark variant (если есть).
- [ ] Arrow правильный: ArrowRight для внутренних, ArrowUpRight для внешних?
- [ ] Underline только если `rb-link-inline`? В остальных случаях text-decoration: none.
- [ ] На screen не больше 2 orange affiliate CTAs одновременно?
- [ ] Mobile touch-target ≥ 44×44 (кнопки) / 40px vertical (rail-links)?
- [ ] `:focus-visible` outline заданный (через CSS-класс, не inline)?
- [ ] Цвет из локализованного набора: orange / green / navy / slate (нет `#2563eb`, `#a7f3d0` и т.п.)?

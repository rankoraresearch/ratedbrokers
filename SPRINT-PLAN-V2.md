# Sprint Plan v2 — Design Polish + Mobile SEO

**Updated:** 2026-04-18 ~04:40
**Last commit:** `72a70e1` (polish v1 — sitewide pale-green cleanup)
**Mode:** Autonomous with commits per sprint + codex 10/10 gate

---

## 🎯 Quality gates

**Каждый спринт заканчивается codex-review с целью ≥ 9/10.**
Если codex < 9/10 — фиксы до следующего прохода, пока не 10.

Минимум для merge в main:
- 0 CRITICAL findings
- 0 HIGH findings
- MEDIUM/LOW приняты если обоснованы tradeoff'ами

---

## 🏃 Sprint 6 — Desktop Deep Polish (3 часа)

**Цель:** Исправить всё что я пропустил в Polish v1. Не просто цвета, а **каждая кнопка, каждый badge, каждая ссылка, каждый expandable state**.

**Специальный фокус на find'ах пользователя:**
- `/reviews/saxo-bank` Best Alternatives sidebar — зелёные Visit-кнопки вылезают криво, должны быть оранжевые CTA
- `/reviews/*/alternatives` — "Show All N Alternatives" pale-green button + "Most Trusted 2026" badge + "+0.2"/"+0.1" spread-diff pills
- Author byline (Written by / Edited by / Fact-checked by / Reviewed by) — пастельные цвета на аватарках/бейджах

### Protocol per page

Для **каждой** из 26 страниц (см. матрицу ниже) прогоняю:

```
┌──────────────────────────────────────────────────────┐
│ PER-PAGE AUDIT CHECKLIST                             │
├──────────────────────────────────────────────────────┤
│ 1. Full-page screenshot (не viewport!) — desktop     │
│ 2. Scroll top→bottom, разбить на viewport-frames     │
│ 3. Interactive sweep:                                │
│    □ Click каждый expandable (FAQ, accordion)        │
│    □ Click каждый "Show more/all/load more"          │
│    □ Open каждый dropdown (lang, nav, filter)        │
│    □ Hover над каждым CTA (capture hover state)      │
│    □ Click каждый tab (tabbed UI)                    │
│    □ Scroll trigger sticky elements                  │
│ 4. Visual audit:                                     │
│    □ Все Visit/CTA → orange gradient (brand rule)    │
│    □ Pale fills (#ecfdf5/#f0fdf4/#a7f3d0/#fef3c7..)  │
│    □ Bright solid greens on non-brand elements       │
│    □ Off-brand blues (#2563eb/#3b82f6 outside        │
│      LinkedIn/Trustpilot)                            │
│    □ Emoji (🏆🔗💰⭐🎯🔍...)                          │
│    □ Rainbow category treatments                     │
│    □ Button alignment/overflow/wrapping              │
│    □ Badge consistency                               │
│ 5. Log findings → POLISH-V2-LOG.md per-page section  │
└──────────────────────────────────────────────────────┘
```

### Page matrix (26 страниц)

**A. Main flows** (высший приоритет)
1. `/` Home
2. `/best-forex-brokers` Ranking Forex
3. `/best-crypto-brokers` Ranking Crypto
4. `/best-stocks-brokers` Ranking Stocks
5. `/reviews/ic-markets` Review Forex
6. `/reviews/saxo-bank` Review (user-flagged)
7. `/reviews/interactive-brokers` Review Stocks
8. `/compare` Compare landing
9. `/compare/ic-markets-vs-pepperstone` Compare pair
10. `/find-your-broker` Quiz

**B. Subpages** (review tabs × 1 broker for sample)
11. `/reviews/ic-markets/fees`
12. `/reviews/ic-markets/regulation`
13. `/reviews/ic-markets/platforms`
14. `/reviews/ic-markets/account`
15. `/reviews/ic-markets/deposit`
16. `/reviews/ic-markets/beginners`
17. `/reviews/ic-markets/min-deposit`
18. `/reviews/ic-markets/alternatives` (user-flagged)

**C. Static / support**
19. `/about`
20. `/methodology`
21. `/trust-score`
22. `/contact`
23. `/privacy`
24. `/terms`
25. `/how-we-make-money`
26. `/rankings` (footer hub)

**D. Optional (если время остаётся)**
27. `/author/<slug>` (author profile)
28. `/regulator/<slug>` (regulator page if exists)
29. Country landing `/best-forex-brokers-uk`

### Deliverables Sprint 6
- `POLISH-V2-LOG.md` — per-page findings + fixes + rollback commands
- Changes grouped by component for minimal churn
- **Codex review** target 10/10 (APPROVED, 0 critical, 0 high)
- Commit "polish v2 desktop" → push

### Expected scope
15–25 правок на 10–15 файлах.

---

## 📱 Sprint 7 — Mobile SEO + UX (4 часа)

**Цель:** Превратить сайт из «ок на мобилке» в **premium mobile experience** который конкретно **увеличивает SEO-трафик и конверсию**.

### SEO-рычаги на мобильной версии

Google ранжирует мобильную версию (**Mobile-First Indexing**). Ключевые сигналы:

| Сигнал | Как на нас влияет | Фикс |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Hero загружается медленно → ранжирование ↓ | Lazy-load below-fold, оптимизация hero изображений |
| **CLS** (Cumulative Layout Shift) | Контент прыгает при загрузке | Reserve space for images/fonts, sticky bars не толкают контент |
| **INP** (Interaction to Next Paint) | Touch-задержки → UX ↓ | No heavy JS on interaction, debounce |
| **Font sizes** | <14px body = "not mobile-friendly" | Min 16px body, 14px helper, 18px H3+ |
| **Touch targets** | <44×44px = usability penalty | CTAs ≥48px, links с padding |
| **Horizontal scroll** | Прямая SEO-пенализация | `overflow-x: hidden`, maxWidth 100vw |
| **Sticky bars blocking content** | "content hidden" | Reserve bottom-padding |
| **Font readability** | Line-height <1.5 = eye strain | Body 1.6–1.8 |
| **Modal/popup UX** | Блокируют контент → "intrusive interstitial" penalty | Cookie banner dismissible, no popups до 30s |

### Breakpoints to test

| Viewport | Device sample | Market share |
|---|---|---|
| **320×568** | iPhone 5/SE | ~5% (legacy, но Google требует) |
| **375×667** | iPhone 13 mini / 12 | 30% |
| **390×844** | iPhone 14/15 | 25% |
| **414×896** | iPhone Pro Max | 15% |
| **360×800** | Android standard | 15% |
| **768×1024** | iPad portrait | 10% (tablet transition) |

### Per-page mobile audit protocol

```
┌─────────────────────────────────────────────────────┐
│ MOBILE AUDIT PER PAGE                               │
├─────────────────────────────────────────────────────┤
│ 1. Resize viewport to 375×667 (primary mobile)      │
│ 2. Full-page screenshot                             │
│ 3. Measure:                                         │
│    □ Body text computed font-size ≥ 16px            │
│    □ Helper/meta font-size ≥ 13px                   │
│    □ H1 ≥ 24px, H2 ≥ 20px, H3 ≥ 18px                │
│    □ Line-height ≥ 1.5 for body                     │
│    □ Touch targets (buttons, links) ≥ 44×44px       │
│    □ No horizontal scroll (body width ≤ viewport)   │
│    □ Sticky bar height + bottom-padding ≥ CTA       │
│    □ Hero читается без zoom                         │
│    □ CTAs 100% width or center-aligned              │
│ 4. Repeat at 320 (legacy), 414 (iPhone Pro),        │
│    768 (iPad) — check transitions                   │
│ 5. Interactive sweep on mobile:                     │
│    □ Hamburger menu → all items accessible          │
│    □ Sticky CTA появляется at right scroll point    │
│    □ FAQ expand works with touch                    │
│    □ Dropdowns не overflow viewport                 │
│    □ Forms — input тап не зумит (font-size 16px+)   │
│ 6. Log findings → POLISH-V2-MOBILE.md               │
└─────────────────────────────────────────────────────┘
```

### Specific mobile SEO goals

**Content-first улучшения:**
- **Минимум 16px body text** — текущий местами 13-14px, нечитаемо, Google penalty
- **Увеличить H1/H2** — hero H1 должен бить в глаз, минимум 28px mobile
- **Прибавить line-height** — body 1.7-1.8 для комфорта чтения длинных ревью
- **Padding секций** — compact mode на mobile не должен быть cramped (ждём 16px min горизонтальный padding)

**Layout wins:**
- **CTA позиция** — primary orange CTA в каждом блоке должна быть **видна сразу**, не глубже второго scroll
- **Visit broker buttons** — full-width на mobile, min-height 52px
- **Broker cards** — переделать mobile layout если есть стэкинг, чтобы logo + name + score + CTA влезали в 2-3 строки
- **Sticky CTA bar** — обязательно на review pages (есть? проверю)
- **Compare table** — horizontal scroll OK если неизбежен, но с visual indicator

**Navigation:**
- **Bottom tab bar?** — рассмотрю ли добавлять (как в мобильных приложениях) для топ-ссылок
- **Back-to-top button** — на длинных страницах
- **Breadcrumbs** — должны быть скроллируемы если длинные (уже так?)

### Deliverables Sprint 7
- `POLISH-V2-MOBILE.md` — full mobile audit report
- Screenshots 375px + 414px каждой из 26 страниц (before/after)
- Changes grouped by pattern (шрифты / touch targets / sticky / layout)
- **Codex review** target 10/10
- Commit "polish v2 mobile + SEO" → push

### Expected scope
20–30 правок. Много мелких полей: `fontSize`, `padding`, `minHeight`, `gap`, sticky bars. Возможно 2-3 крупных refactor (broker card mobile layout, Compare table mobile).

---

## 🧪 Sprint 8 — Edge Cases + Performance (2 часа)

**Цель:** Финальная валидация, пограничные случаи, performance wins.

### Edge cases to test

- **Длинные broker names** (e.g. "Charles Schwab International Brokerage") — не ломают layout
- **Отсутствующие data points** — broker без Trustpilot score, без regulators
- **Empty states** — поиск без результатов, quiz без совпадений
- **Very long FAQ answers** — раскрывающийся контент не блокирует остальное
- **Rapid CTA clicks** — no double-submit, нет race conditions в рейтингах

### Performance checks

- **Bundle size** — после всех изменений не вырос ли main bundle?
- **Lazy-loaded routes** — проверить что subpages lazy-chunk'и работают
- **Image optimization** — broker logos proper sizes (WebP?)
- **Font loading** — no FOUT/FOIT
- **React console warnings** — no key warnings, no deprecated lifecycle

### Deliverables Sprint 8
- `POLISH-V2-FINAL.md` — edge cases + performance findings
- Final changes (если нужны)
- **Codex review 10/10**
- Final commit + push

---

## 🔄 Execution order + checkpoints

### Порядок
1. **Sprint 6 Desktop Deep** (3 ч) → commit → codex 10/10 → push
2. **Sprint 7 Mobile + SEO** (4 ч) → commit → codex 10/10 → push
3. **Sprint 8 Edge + Perf** (2 ч) → commit → codex 10/10 → push

### Checkpoints
- **После Sprint 6** — отчёт в логе + tag `after-sprint-6-desktop`
- **После Sprint 7** — отчёт + tag `after-sprint-7-mobile`
- **После Sprint 8** — final report + tag `after-sprint-8-final`

### Rollback availability
Каждый спринт = atomic merge commit. Откат любого:
```bash
git revert -m 1 <merge-commit-hash> && git push origin main
```

Полный откат к началу v2:
```bash
git revert 72a70e1..HEAD && git push origin main
```

---

## 💬 Commit cadence

- Каждый спринт = branch `auto-sprint-N` → commits → codex → merge `--no-ff` → push
- Если codex < 9/10: фиксы → re-codex → merge только после 10/10
- Cloudflare Pages автодеплой после push → ~2-3 мин до live

---

## ⏱ Total estimate

| Sprint | Scope | Time |
|---|---|---|
| 6 | Desktop deep polish, all pages | 3 ч |
| 7 | Mobile + SEO optimization | 4 ч |
| 8 | Edge cases + performance | 2 ч |
| **Итого** | | **~9 часов автономной работы** |

Ночь + утром все 3 спринта на проде с codex 10/10 каждый.

---

## 🚀 Start

Начинаю Sprint 6 сразу. Первым делом — **user-flagged items**:
1. `/reviews/saxo-bank` Best Alternatives sidebar — зелёные Visit-кнопки → orange CTA
2. `/reviews/*/alternatives` tab — "Show All N" button + "Most Trusted 2026" + "+0.2"/"+0.1" pills
3. Author byline → пастельные цвета

Потом — полный пробег по 26 страницам с checklist'ом.

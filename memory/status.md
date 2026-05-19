# Status — текущее состояние проекта

Last updated: 2026-05-19 (**Sprint F2 завершён на ветке `sprint/f2-country-unification`. Country-hub каннибализация устранена — legacy `/best-forex-brokers-by-country` удалён под 0 + explicit 404 route + D1 backfill. Ждём OK Егора на push.** Главный документ: `ARCHITECTURE-AUDIT-2026-04-28.md` (F2 закрыт))

---

## 🟢 ГОТОВО НА МЕРЖ (2026-05-07) — Sprint NB-1: Non-Broker URL Cleanup

**Запрос Егора:** удалить 10 non-broker URL под 0 (без редиректов), вычистить все упоминания в коде/меню/документации, проверить Codex'ом.

**Главный документ:** `NON-BROKER-URLS-AUDIT.md` + узел `memory/non-broker-urls-audit.md`.
**Ветка:** `sprint/nb-1-cleanup` (от main `22222e6`).
**Safepoint:** `safepoint-pre-nb1-cleanup-2026-05-07-1639` (origin).

**Удалено (10 URL/ID):**
- crypto-exchanges, crypto-wallets, crypto-staking, crypto-usdt, crypto-margin, crypto-apps
- forex-courses, forex-charts, forex-signals, stocks-robo

**Live count:** rankings.js 293 → 283.

**Anti-recurrence:** `scripts/validate-rankings.mjs` — slug должен содержать `broker(s)` ИЛИ быть в SLUG_WHITELIST (31 legitimate non-broker term — copy/social trading, demo, spread betting, trading apps, ISA). Запускается из `npm run build` И `npm run dev`.

**Codex review:** NEEDS_CHANGES (0 critical, 1 high, 1 med, 1 low) → все 3 fixes applied (validator tracked, counters synced, dev script gated).

**Pending Егор:**
- Подтвердить merge в main (push на ratedbrokers.com через CF Pages)

---

## 🟢 ГОТОВО НА МЕРЖ (2026-05-19) — Sprint F2: Country Hub Unification

**Запрос Егора:** удалить legacy `/best-forex-brokers-by-country` под 0 (без 301 редиректов), заменить ВСЕ ссылки на multi-asset хаб `/best-brokers-by-country`. Глубоко и надёжно.

**Ветка:** `sprint/f2-country-unification` (от main `2819acd`)
**Safepoint:** `safepoint-pre-f2-2026-05-19-2232` (origin)

**Удалено:**
- `src/pages/CountryHubPage.jsx` (182 строки, файл целиком)
- App.jsx: lazy import + Route legacy URL
- D1 `page_publish` запись `best-forex-brokers-by-country` (verified)
- FINAL-SITEMAP.md: 1 строка

**Перенаправлены на новый URL:**
- Footer.jsx
- Home.jsx (2 ссылки + анкоры без слова "Forex")
- homepageSeoContent.js
- CountryPage.jsx breadcrumb (4 уровня → 3, унифицирован)
- backend/src/routes/publish.js (2 места в seed)

**Особые меры (по Codex):**
- App.jsx: добавлен explicit `<Route path="best-forex-brokers-by-country" element={<NotFoundPage />}>` ПЕРЕД wildcard `best-forex-brokers-:countrySlug` — иначе wildcard ловил legacy URL как countrySlug="by-country" → soft-404 через CountryPage Navigate
- D1: добавлена новая запись `best-brokers-by-country` со status='published' (ensureSeeded() only-seeds-empty не помог бы)

**Codex review:** общая среда заблокирована (gpt-5.2-codex unavailable on ChatGPT auth). Использовали general-purpose agent для independent review. NEEDS_CHANGES (0 critical, 2 high, 2 med, 1 low). Все HIGH применены. MEDIUM (forex-themed CountryPage title) — by design (страница forex-leaf, title правильный). MEDIUM (breadcrumb label) — приемлемо.

**Pending Егор:**
- Подтвердить merge в main

---

## 🔴 АКТИВНОЕ (2026-04-28) — Architecture Audit (research, decisions pending)

**Запрос Егора:** глубокий аудит — критичные intent-mismatch URL, редиректы, хлебные крошки, общая архитектура. Не добавляем новые сущности. Цель — улучшить то что есть до открытия индексации.

**Главный документ:** `ARCHITECTURE-AUDIT-2026-04-28.md` (корень) — 4 потока + severity matrix (11 findings) + 3 спринта.
**Узел графа:** `memory/architecture-audit-2026-04-28.md`
**Лог сессии:** `logs/2026-04.md` запись `## 2026-04-28 | Сессия: Architecture audit`

**Critical findings (2 — блокируют открытие индексации):**
- ~~**F1** — 8 non-broker URL по-прежнему в проде с 22.04 (предыдущий research лежит без действий).~~ **ЗАКРЫТО Sprint NB-1 (2026-05-07)** — удалено 10 URL под 0 + anti-recurrence guard.
- ~~**F2** — Country-хаб развилка `/best-forex-brokers-by-country` (legacy forex) и `/best-brokers-by-country` (M4 multi-asset).~~ **ЗАКРЫТО Sprint F2 (2026-05-19)** — legacy удалён под 0, всё унифицировано на multi-asset хаб.

**Medium (5 — полезно сделать одним спринтом):**
- F3 16 asset-рейтингов (gold/oil/indices) orphan от хабов
- F4 211/293 рейтингов без `vertical` поля (72%)
- F5 ComparePage + BrokerComparison без BreadcrumbList JSON-LD
- F6 NotFoundPage без breadcrumb
- F7 RankingPage breadcrumb logic дублируется (2 места)

**Что подтвердилось ЗДОРОВЫМ:**
- _redirects: 11 правил, 0 broken/chains/циклов
- Internal nav: 0 ссылок на старые URL (миграции 09.04 + S9 чистые)
- /review/→/reviews/ migration clean
- getBrokerHub() coverage 8/8 verticals

**3 спринта (рекомендация):**
- **AC-1 (~6-9 ч + Codex)** — F1 + F2 (критичный путь)
- **AC-2 (~5-7 ч)** — F3 + F4 + F5 (taxonomy gигиена)
- **AC-3 (~2-4 ч, опц)** — F6+F7+F8+F9 (мелочи)

**Pending — ждём от Егора:**
1. Стартуем AC-1?
2. F2 — какой вариант (A kill legacy / **B развести по контенту** / C синхр ссылки)?
3. AC-2 сразу следом или отдельно?
4. Anti-recurrence script `validate-rankings.mjs` — приоритет?

**Кода НЕ трогал** — research-only.

---

## 🟡 АКТИВНОЕ ПЛАНИРОВАНИЕ (2026-04-22/23) — Broker Desk + Content Writing Pipeline

**Контекст:** инфраструктура для написания 51 broker review силами Claude + ручной fact-check от Егора. Новый раздел админки "Broker Desk" (10-й) — единый hub: fresh data (Джон/Боб/Лео) + writer briefs + author assignment + publish.

**3 codex rounds:**
1. Content style audit (17 топ-URL, 5 паттернов ТОП-3) — 2 critical + 6 high fix'd
2. 4 фокусных решения (word count / testing / rotation / agents) — MIXED verdict
3. Sprint plan v1 — NEEDS_CHANGES (3 critical, 10 high) → **v2 rewrite после approvals**

**PIVOT 2026-04-23:** Claude пишет ревью сам, Егор назначает fact-checker/reviewer руками. Один voice.

**Артефакты (все в корне проекта):**
- `SESSION-RESUME-BROKER-DESK.md` — полный entry point при resume
- `SPRINT-BROKER-BRIEFS.md` — план v1 + codex round 3 findings
- `CONTENT-STYLE-AUDIT.md` — editorial style guide (17 топ-URL research)

**Ждёт 3 approval Егора:**
1. Word count: `hash(slug) mod 2500 + 3500` → 3 500–6 000 band
2. Risk warning plate above-the-fold (отдельно от того что под CTA)
3. Affiliate disclosure текст (2 строки BrokerChooser style) → /how-we-make-money

**После approvals:** Sprint v2 → Codex GATE A (pre-impl) → S0-S3 → S4-S7 → S8 pilot IC Markets → GATE B (pre-deploy) → S9 deploy. ~10-11 дней dev.

---

## ✅ ЗАВЕРШЕНО (2026-04-23) — Visual Mobile Audit (autonomous, no code changes)

**Запуск:** Егор попросил визуальный аудит с annotated screenshots — подсветить проблемы прямо на скриншотах мобильной версии, создать спринты, проверить Codex'ом.

### Артефакты (все в корне проекта)
1. **`VISUAL-AUDIT-REPORT.md`** — финальный отчёт с 21 embedded annotated screenshot
2. **`~/Desktop/RatedBrokers-Visual-Mobile-Audit-2026-04-23.pdf`** (1.7 MB) — для чтения с телефона
3. `mobile-audit/visual/*.png` — 21 annotated screenshot
4. `memory/visual_mobile_audit_2026_04_23.md` — узел графа

### 10 спринтов (V1-V10)
V1 (infra) → V2 (Home) → V3 (hubs) → V4 (rankings) → V5 (reviews) → V6 (compare) → V7 (editorial/deep) → V8 (forms/legal) → V9 (PDF) → V10 (Codex review)

### Top visual evidence (с красными рамками в скриншотах)
- `/rankings`, `/compare`, `/regulator/fca` — horizontal overflow с viewport-edge marker
- BrokerReview.jsx — "H1 22px < H2 24px — inversion!" annotation на hero + content
- Methodology — "H2 28 > H1 26" на заголовках
- Contact/AuthorLogin — "Input 14/15px < 16 → iOS auto-zoom"
- /privacy — "Draft в проде" красным на параграфе
- /author/james-chen — "SOFT 404" banner (URL вернул Home)
- Home country chips — 6 chips подряд с "P0 · 145×35" badges

### Эталоны (зелёные рамки)
`/about` (H1=32, H2=26), `/author/:valid` (H1=32), `/find-your-broker` (input 16px ✓), `/404` (action cards 328×80)

### Рекомендованные fix-спринты FM1-FM5 (~15-18ч до 10/10)
1. FM1 — P0 blockers (overflow, hierarchy, input fonts, soft-404, Draft)
2. FM2 — Touch targets sitewide
3. FM3 — Typography tokens
4. FM4 — CLS + images
5. FM5 — UX polish

### Status
⏸ Ждём команду Егора. Возможные steps:
- `запускаем FM1` — P0 blockers (3-4ч)
- `запускаем FM2` — touch targets (4-5ч)

---

## АКТИВНОЕ (2026-04-22) — Non-Broker URLs Audit (research-only)

---

## АКТИВНОЕ (2026-04-22) — Non-Broker URLs Audit (research-only)

**Запрос Егора:** найти все рейтинги в `src/data/rankings.js`, где search intent ≠ брокеры (триггер: `/best-crypto-exchanges`, `/best-crypto-wallets`).

**Главный документ:** `NON-BROKER-URLS-AUDIT.md` (корень) — полный отчёт + 3 стратегии + чек-лист фазы 1.
**Узел графа:** `memory/non-broker-urls-audit.md`
**Лог сессии:** `logs/2026-04.md` запись `## 2026-04-22 | Сессия: Аудит non-broker URL`

**Findings (8 проблемных URL):**
- 🔴 5 critical intent mismatch (~45K SV/мес): `/best-crypto-exchanges`, `/best-crypto-wallets`, `/best-robo-advisors`, `/best-forex-trading-courses`, `/best-forex-chart-websites`
- 🟡 3 suspicious: `/best-crypto-staking-platforms`, `/best-usdt-trading-platforms`, `/best-forex-signal-providers`

**Виновник:** коммит `d04440b` (01.04.2026, M4 Sprint 1+2). Предупреждения Билла "requires different content type" из `THEMATIC-RANKINGS-TREE.md:596,611-612` потерялись при переносе в `MILESTONES.md` Sprint 2.4 → URL добавили в общий `RANKINGS` массив с фильтром `isCrypto` (`rankingFilters.js:385-386`) → выводят CFD-брокеров вместо ожидаемых бирж/кошельков.

**Стратегия (рекомендована Variant C — Hybrid):**
- Фаза 1 (~2-3 ч, отдельный спринт + Codex-review): DELETE+301 для low-affiliate (courses, charts, signals, staking, usdt) + noindex placeholder для high-affiliate (exchanges, wallets, robo)
- Фаза 2 (M5+): REPURPOSE 3 high-affiliate URL как отдельная вертикаль (новый template, новая data-модель, affiliate с Binance Partner / Ledger / Impact)

**Pending:** ждём от Егора выбор варианта (A/B/C). Если C — запускаем фазу 1.
**Кода НЕ трогал** — research-only сессия.

---

## ✅ ЗАВЕРШЕНО (2026-04-22, вечер) — Author Evaluation Scorecard на Donors Dashboard

**Запуск:** Егор попросил добавить на `/api/admin/donors/dashboard` красивую памятку с критериями оценки людей (от слабых к сильным). Затем попросил усложнить до системы с коэффициентами и весами.

### Результат
Collapsible panel (`<details class="memo" open>`) между summary-grid и filters на Donors Dashboard. Weighted 0-100 scorecard.

**Две итерации в одной сессии:**
1. v1 — 5 tier-карточек (T0 red → T4 green) с качественными критериями
2. v2 — добавлены веса: scoring buckets (30/25/20/15/10), пересортированные критерии от слабых → сильным, certification ladder (14 сертов + bar-chart), verifiability bonus stack (12 источников), 5 thresholds-pills, worked example Jagerson=94 pts + counter-example, 5 инсайтов в футере

### Система весов (0-100 pts)
- **Certifications (30):** CFA=20, CFP=14, CAIA/FRM=12, CMT=10, ChFC/Series 24=8, Series 7=7, Series 3=6 (⚑ forex/CFD), Series 4/65/66=5, Series 30/CAMS=4, Series 63=3
- **Media citability (25):** Bloomberg/Reuters=25, WSJ/FT/Barron's=22, CNBC=18, Forbes staff=15, Seeking Alpha=8, Investopedia=6, Forbes contributor=3 ⚠ (post-2024 site-rep update)
- **Experience (20):** Exchange exec/Regulator=18, HF PM/bulge-bracket=16, Prop-trader=12, Analyst=8
- **Academic (15):** PhD=15, MBA top-10=12, MSc FE=10, MBA regular=8, BA=5
- **Verifiability (+10 cap):** FINRA BC/SEC IAPD/NFA BASIC/FCA Register/Wikipedia/Google KP = +3 each; Muck Rack/Book/Adjunct = +2; sameAs/Speaker/Scholar = +1

### Thresholds
0-20 skip · 20-40 niche · 40-60 mid-tier · **60-80 sweet spot (reviews/rankings)** · 80-100 hero/priority

### 5 ключевых инсайтов
1. CFA (20) > 2× любого Series — Google ценит independent accreditation > госрегистраций
2. Bloomberg columnist (+25) > любого сертификата — citability бьёт credentials в E-E-A-T
3. Series 3 + NFA BASIC (+9 stack) — максимально релевантен forex/CFD даже без CFA
4. Forbes contributor ≠ Forbes staff — post-2024 site-reputation update
5. Sweet spot найма 65-80 pts — А-листеры дороги, T2 слабо двигают E-E-A-T

### Deploy
- Файл: `backend/src/routes/donors.js` (только бэкенд, Pages не трогали)
- Command: `npx wrangler deploy` из `backend/`
- Version: `39983c11` (предыдущая v1 = `15baad7b`)
- Verify: все 6 секций через curl grep рендерятся

### Артефакты
- Auto-memory узел: `author_scorecard_memo.md` + линк в MEMORY.md
- Log: `logs/2026-04.md` (сессия 2026-04-22 вечер)
- URL: https://api.ratedbrokers.com/api/admin/donors/dashboard?key=...

### Что не коммитили в git
Backend-изменения деплоятся напрямую через wrangler, не через push в main. Файл donors.js на диске изменён — при следующем `git status` будет виден как modified. Можно коммитить "docs: author scorecard memo on donors dashboard" когда удобно (или оставить untracked — backend deploy уже в проде).

---

## ✅ ЗАВЕРШЕНО (2026-04-22) — Mobile Audit (autonomous, no code changes)

**Запуск:** Егор сказал «провести глубокий аудит мобильной версии» с автономным режимом, Codex по каждой странице, без правок кода. Цель — 10/10 Google mobile-friendly.

### Артефакты (все в корне проекта)
1. `MOBILE-AUDIT-SPRINT.md` — оригинальный план аудита (24 шаблона, S0-S10)
2. **`MOBILE-AUDIT-RESULTS.md`** — финальный отчёт (Executive Summary, Lighthouse snapshot, 45 findings P0-P3, 6 паттернов, 5 fix-спринтов M1-M5)
3. **`RatedBrokers-Mobile-Audit-2026-04-22.pdf`** на `~/Desktop/` (761KB, ~25 стр) — для чтения с телефона
4. `mobile-audit/findings/S1-S9.md` (9 файлов) — детальный по фазам
5. `mobile-audit/lighthouse/home.json` — Lighthouse mobile (Perf 70, A11y 93, BP 100, SEO 69)
6. `audit-*.json` (44 файла) — raw evaluate данные с каждой страницы
7. `mobile-audit/screenshots/` через `.playwright-mcp/` — 44 jpeg скриншота

### Покрытие
44 URL из 24 production шаблонов на 360×740 + spot checks 320/375/414. Codex CLI отревьюил Header.jsx + BrokerReview.jsx с конкретными style-diffs.

### Top-11 P0 блокеров (краткая выжимка, полная — в MOBILE-AUDIT-RESULTS.md)
1. Horizontal overflow на `/rankings`, `/compare`, `/regulator/:slug`
2. **H1<H2 на ВСЕХ 468 review+subpage** (H1=22 vs H2=24)
3. Hierarchy: methodology/trust-score/how-we-make-money — H2 ≥ H1
4. Inputs <16px (Contact 15, AuthorLogin 14) → iOS auto-zoom
5. `/author/:invalidSlug` → редирект Home вместо 404
6. Combi URLs 404 (`/best-ecn-forex-brokers-uk` not found)
7. "Draft — pending legal review" в проде `/privacy`
8. Нет `<main>` landmark на Home
9. LCP 4.6s mobile (фонты Google blocking 1350ms)

### Sitewide P1 паттерны
Header top-bar (Hamburger 40×32, Search 36×28, EN 39×28), country-vertical chips 33-35px, mobile menu links 30-36px, filter pills `/reviews` 28×12px, regulator chips 24px, eyebrows 10-11px, 51/90 images без width/height на Home, LinkedIn icons 15×15.

### Эталонные страницы (не трогать)
BrokerReview hero, BrokerComparison VS, AboutPage, AuthorPage (H1=32), Quiz, 404.

### Status
⏸ Ждём команду от Егора. Возможные следующие шаги:
- `запускаем Sprint M1` — fix P0 blockers (~3-4ч)
- `запускаем Sprint M2` — touch targets sitewide (~4-5ч)
- `запускаем Sprint M3` — typography tokens (~3-4ч)
- `углубить аудит` — расширить scope (ещё URL / RU / Lighthouse на каждом template)

См. также узел: `memory/mobile_audit_2026_04_22.md`

---

## ✅ ЗАВЕРШЕНО (2026-04-21) — Menu Sprint S1-S9 + Neha Gupta + Stream A

---

## ✅ ЗАВЕРШЕНО (2026-04-21) — Menu Sprint S1-S9 + Neha Gupta + Stream A (предыдущая сессия)

**Merge commit:** `0a97b1e` → `main` (13 коммитов), **HEAD:** `a2f023d` (после hotfixes)
**Ветка:** `menu-sprint-2026-04-20` (origin, сохранена для истории)
**Safepoint (origin):** `safepoint-pre-menu-sprint-merge-2026-04-21-0104`

### Что задеплоено на `ratedbrokers.com`

1. **Menu redesign S1-S9** — MenuProtoV2 → Header.jsx production:
   - Единый **Brokers ▾** mega с 8 вертикалями (было Forex+Crypto, 6 спрятанных)
   - **Reviews ▾** square logo chips, diversified Popular (Copy/CFD/Multi-asset/Stocks/Options), CTA → /reviews (fix bug)
   - **Countries ▾** с per-vertical SEO-анкорами "Best {label} {word} {geo}"
   - **Compare + Methodology** возвращены на desktop (E-E-A-T)
   - Новый multi-asset umbrella хаб `/best-brokers-by-country` (S9: ребренд со старого `/brokers-by-country`, 301 redirect)
2. **Neha Gupta (5-й член редакции)** — CFA + PGDBA, 17 лет equity/hedge-fund/crypto, 35K+ articles. AuthorPage fallback для `author.location`.
3. **Countries dropdown hotfixes (post-deploy):**
   - `f59081f` Platforms → Firms (VERTICAL_META) — не помог целостно
   - `433fd10` conditional render в Header.jsx lines 663 + 854: для spreadBetting vertical слово `meta.word` пропускается только в dropdown (не в /best-brokers-by-country)
   - `a2f023d` width 780 → 840 — стрелки ↗ в 3-й колонке отошли от правой стенки

### Rollback (если понадобится)

```bash
# Мягко откатить merge:
git revert -m 1 0a97b1e && git push origin main

# Жёстко вернуть main на safepoint:
git reset --hard safepoint-pre-menu-sprint-merge-2026-04-21-0104
git push --force-with-lease origin main
```

### Детальный лог сессии
`logs/2026-04.md` — "2026-04-21 | Сессия: Recovery после аварийного закрытия..."

---

## ✅ ЗАВЕРШЕНО (2026-04-20) — Design Audit

**Merge commit:** `05f3884` → `main` (push успешен, прод `ratedbrokers.com` задеплоен)
**Ветка:** `design-audit-2026-04-20` (origin, сохранена для истории)
**Safepoints (origin):**
- `safepoint-design-audit-2026-04-20-0243` — до начала работы
- `safepoint-pre-design-audit-merge-2026-04-20-1319` — прямо перед merge

### Completed sprints (все Codex 10/10 APPROVED)

| # | Спринт | Коммиты | Итог |
|---|--------|---------|------|
| S1 | RegulatorPage pale-green → Plate B | f629e84, a345e31, 143964f | Verify License + Tier callouts + Score badge все на Plate B (white + 1.5px #e2e8f0 + 3px green rail) |
| S2 | Forex + Crypto landing | 14795d7, bd1f55b | 15 экз. pale-green убраны; best-cell highlights text-only; immutable left rail pattern зафиксирован sitewide |
| S3 | Country/Ranking/Platform/Guide/AllGuides | 3463866, b72fecc, 4d07831, 0c41275, d518a97 | ~14 экз. cleanup + Pros/Cons symmetry (green/red rails) + Pro-Tip amber rail + 3-tier score colors + dead imports |
| S4 | Compare/Quiz/Warning/NotFound | e09d3d0, 9f14f13, af05e17 | Quiz Top 3 полностью унифицированы (no #1 differentiation, D2k rule); QuickCompareTable_REMOVED block (127 строк) удалён |
| S5 | Ranking Hero Premium Green | 6606ff2, 71fcecf, 72e5e60 | HeroBand новый `variant="green"` prop (non-regression default); compact 40/48px padding, amber eyebrow в opaque navy capsule AAA, meta row JetBrains Mono, amber-tinted diagonal texture |
| S6 | Footer editorial refresh | 7d13302, ff248b1 | Section headings JetBrains Mono 11px amber sitewide editorial-почерк; Affiliate Disclosure дифференцирован от Risk (slate rail vs amber rail) |
| S7 | Regulator icons polish | a4ac676 | Все 19 SVG получили tier-coded dot (green/amber/red) + gloss overlay; original design preserved |
| S8 | Sitewide consistency | 6a8c400, e6d3a08 | Home VERTICAL_MAP 8 цветов → 1 (`#059669` unified — "детская палитра" antipattern устранён); AuthorPortal/AuthorsResearch cleanup |

### Ключевые паттерны, зафиксированные в S1-S8

1. **Plate B unified (sitewide standard)**: `bg #fff + border 1.5px #e2e8f0 + border-left 3px [coloured] + box-shadow 0 2px 8px rgba(15,23,42,0.04)`
2. **Plate B CTA hover (immutable rail)**: изменяются только top/right/bottom borders + shadow lift + translateY(-1px). Left rail остаётся константным.
3. **Pro-Tip = amber rail**: `bg #fffaf0 + border-left 3px #f59e0b + title #b45309`
4. **Cons card = red rail**: `border-left 3px #dc2626 + heading #b91c1c`
5. **Editorial-почерк (JetBrains Mono 11px amber #fbbf24 letterSpacing 0.18em)** для eyebrow sitewide (Footer, Ranking Hero, How We Rate)
6. **Score badges 3-tier**: `#047857 (≥9.0) / #1d4ed8 (≥8.0) / #b45309 (ниже)`
7. **AAA на dark**: amber текст требует opaque #0f172a capsule (не translucent rgba)
8. **Лидер #1 не выделяется** (D2k rule): все top-3 идентичны

### S9 + S9.5 (merge + delayed final review)
- `a3fc987` — Егор нашёл что мои custom Plate B CTA/Score были "новыми сущностями" (не полиш). Refactor: 5 custom CTA → sitewide `.cta-secondary`/`.link-green`, custom Score chip → `<ScoreBadge>` component. -76 строк inline CSS.
- Codex re-review `a3fc987` → **10/10 APPROVED** с первого прохода (0 findings).
- Merge `05f3884` в main (no-ff, 23 коммита), push, Cloudflare автодеплой. **Прод задеплоен.**

### Rollback (если понадобится — safepoints на origin)
```bash
# Мягкий откат последнего merge:
git revert -m 1 05f3884 && git push origin main

# Жёсткий откат на pre-merge safepoint:
git reset --hard safepoint-pre-design-audit-merge-2026-04-20-1319
git push --force-with-lease origin main
```

---

## ПРЕДЫДУЩЕЕ (2026-04-19)

---

## ЗАКРЫТО (2026-04-21) — Menu Redesign

Весь backlog из аудита 2026-04-19 реализован и задеплоен в main 2026-04-21 (см. секцию выше). Прототип `MenuProtoV2.jsx` → production `Header.jsx`, все 6 пунктов pending закрыты. Memory узел `[[menu-redesign]]` остаётся для истории.

---

---

## Последнее (Backend)

**S11 Expert Shortlist — коммит `1bd40a9` (18.04.2026)**
- Проход через все 579 авторов с новой realism-метрикой (credentials 25% + on-topic 25% + reach-capped 15% + byline 15% + approachability 20%, минус penalties за Tier-1 staff / celebrity / no contact / badge C)
- 50 top picks + longlist 51-150 в `EXPERT-CANDIDATES-REALISTIC-TOP50.md`
- Admin dashboard `/authors/dashboard`: новый tab **Top Picks (50)**, колонка **Realism** с цветным tier-badge (A/B/C/D/E) + tooltip с breakdown, sort option **"Claude's pick ⭐"** (realism × tier-weight 1.00/0.98/0.95/0.90/0.85)
- Top 10 по Claude's pick: James Chen CMT✓ (100), Charles Sizemore CFA✓ (91.3), Matthew Levy CFA✓ (90.3), Doug Boneparth CFP✓ (87), Terry Flanagan CFA✓ (82), Danielle Park CFA (79.6), Eugene Lee CFA✓ (79), Justin Freeman (78.4), Alan Brochstein CFA (74.6), Eno Eteng (73.4)
- Tier-распределение top-50: A=5, B=1, C=25, D=12, E=7
- **2 прохода Codex-review**: первый нашёл 3 HIGH + 1 MEDIUM; все HIGH RESOLVED (CFA-ICFAI false-positive / classifyCandidate core-cert gate / mixed cert schema); MEDIUM PARTIAL через tier-weighted sort
- Файлы: `src/data/realismScore.js` (force-added), `scripts/s11-expert-shortlist.mjs`, `scripts/s11-generate-md.mjs`, `scripts/s11-shortlist-output.json`, `EXPERT-CANDIDATES-REALISTIC-TOP50.md`

---

---

## Frontend / последнее

**About Page Round 2** — локально, не закоммичено (17.04.2026)
- `/about` переписан дважды:
  - **Round 1**: Premium Dark hero + trust ribbon + Mission + Founder + Team + Principles + CTA. Устранены антипаттерны (pale green/rainbow icons/blue LinkedIn/green gradient CTA/initials avatar). Factual fixes: 54→51 brokers, 207→293 rankings, 4→5 team, subtitle под M4 umbrella
  - **Round 2** (после Barbara+Bill review + Plate B enforcement Егором):
    - Expert/Team/Founder cards → **Plate B стандарт sitewide** (green strip 3px + hover OFF + ring+shadow avatar) — ported из Home.jsx:815-960. Фиксированное решение в `memory/feedback_expert_cards_plate_b.md`
    - Story reorder: Hero → Trust Ribbon → **Founder (вверх)** → Mission → Process → Team → Principles → CTA
    - H1 "Independent Broker Reviews You Can Trust" → "**About RatedBrokers**" (entity-correct); Title → "About RatedBrokers | Independent Broker Reviews & Editorial Team"
    - Trust Ribbon: убраны "5 Team" + "2024" (weakness signals) → **8 Verticals** + **Q2 2026 Last Update** (freshness)
    - Hero: добавлена founder signature "— Yegor Barakovskiy, Founder" (mono orange)
    - Founder card → Plate B расширенный (horizontal photo+content), pull-quote "We built RatedBrokers because advertising corrupts broker reviews" (italic 19px green left rail)
    - Mission: +green commitments block (3 checkmarks — Public methodology / Quarterly re-scoring / Real-money testing)
    - **Editorial Process** новый блок: 3-step timeline (01 Written / 02 Peer-reviewed / 03 Fact-checked) в Plate B
    - Principles: +mini-metrics top-right (130+/6/5/90d); +full-width **Funding Transparency** banner с amber rail (merged affiliate disclosure — Barbara #8)
    - Eyebrow colors унифицированы: green #059669 для всех trust секций (Founder/Mission/Process/Team/Principles), orange #fbbf24 только для Hero + CTA
    - CTA: "Read Methodology" → "Talk to the team" → /contact (Mail icon). "Last reviewed Q2 2026" stamp
    - **Schema upgrade** `Organization` → `NewsMediaOrganization` + @id entity graph (member[] @id + worksFor refs) + 6 policy URLs (correctionsPolicy, diversityPolicy, ownershipFundingInfo, actionableFeedbackPolicy, missionCoveragePrioritiesPolicy, verificationFactCheckingPolicy) + contactPoint (editorial@) + dateModified ISO
- Файлы: `src/pages/AboutPage.jsx` (~430 → ~630 строк Round 2), `memory/feedback_expert_cards_plate_b.md` (новый), `memory/MEMORY.md` (pointer)
- Артефакты: `about-round2-desktop.png`, `about-round2-mobile.png`
- **Не сделано (отдельный спринт):** fake credentials replacement (YMYL blocker перед lift noindex), policy stub pages (/corrections /editorial-policy /ownership), sameAs company profiles, /our-experts hub

**Author Page полный редизайн** — коммит `fb36611` (16.04.2026)
- `/author/:slug` переписан под Variant A (Editorial Authority WSJ-style) — консультация Barbara + Bill
- Premium Dark hero + Trust Ribbon + Media Coverage с inline wordmark-ами (10 изданий: Bloomberg, REUTERS, WSJ, FT, CNBC, CNN, Forbes, MarketWatch, BUSINESS INSIDER, The Economist) + Editorial Activity feed (underline-табы + группировка по месяцам)
- Для founder (Yegor): Platform Milestones вместо Media Coverage + Activity
- **Peer-review полоса удалена** — концептуальная ошибка (ревью на материал, не на человека); переедет на review/ranking с `dateModified`
- **Verified galochka удалена** с аватаров (правило Егора)
- Прото `/proto/author` — 3 концепта (A/B/C) + тумблер автора, остался для референса
- Data module: `src/data/authorActivity.js` (188 строк) — `OUTLET_STYLES`, `MEDIA_MENTIONS`, `ACTIVITY_FEED`, `MILESTONES`, helpers. Shape 1:1 с будущим API `/api/authors/:id/activity`
- Спека backend системы: `EDITORIAL-ACTIVITY-LOG.md` — hybrid (MD bindings + D1 `editorial_actions` events), 6 API endpoints, admin Publish UI расширения, migration plan 8 спринтов / ~12-15 ч
- Решения в `DECISIONS.md §25, §26`. Узел `memory/author-page.md`

**Broker Types Section ЗАФИКСИРОВАНА** — коммит `5ffa063` (16.04.2026)
- Финальный config: `frame=none`, `accent=warm`, `cadence=compact (56)`, `header=fieldLabel`, `meta=off`, `style=unified`
- DEV-бар + Provider + Context + Quick Links pill strip удалены (-180 строк)
- `BrokerTypeSection()` читает hardcoded DEFAULT напрямую
- 10 FRAMES + 5 knobs остались в коде на случай будущих proto

**Cache fix** — `public/_headers` (тот же коммит)
- HTML → no-cache (max-age=0, must-revalidate)
- /assets/* → immutable (max-age=31536000)
- Решает проблему "залипания" старого 8-кнопочного блока в браузерах

---

## Что в работе / последнее (Backend/Data)

**Authors outreach data pipeline** — M4. 579 авторов с verified reach + credentials.

### Ключевые цифры (текущие)

- **579 авторов** in `src/data/authorsSample.js` (post-S4 triage, post-S9 verification)
- **Tier S=32, A=85, B=227, C=235**
- **Twitter/X followers**: 199/227 (88%) — verified from x.com (S9)
- **LinkedIn followers**: 65/400 (16%) — verified via user's Chrome CDP (S10, partial)
- **Verified certs**: 19 authors (CFP/CFA/FINRA/CMT/CBE/NFEC с source URL)
- **Books ISBN-13**: 25 authors, 42 books verified

### Последний commit
`00f475e feat(authors): S10 LinkedIn followers via CDP — 65 verified counts`

---

## Sprint backlog state

- **S0-S6** ✅ — original sprints (hotfix, push, Schema.org, verification, triage, catalog)
- **S7** ✅ *purged* — WebSearch LI hallucinated 43 counts, all deleted
- **S8** ✅ — admin authors dashboard added (public also kept)
- **S9** ✅ — Twitter fetch complete (199/227), verification 118 authors, Codex fixes applied
- **S10** 🟡 pending-continue — 65/400 LI followers. Chrome CDP approach works but user kept Ctrl+C'ing the script terminal. Resumable anytime.
- **S11** ✅ — Realistic expert shortlist + admin Top Picks tab (18.04.2026, commit `1bd40a9`). 2-pass Codex review, 3 HIGH + 1 MEDIUM all addressed.

---

## Pending for next session

1. **Continue S10 LI fetch** (335 remaining):
   - Open NEW Terminal window → `bash scripts/s10-START-CHROME.sh`
   - Log in to LinkedIn in opened Chrome
   - DON'T touch that terminal (no Ctrl+C!)
   - Run `node scripts/s10-li-cdp-fetch.mjs` in ANOTHER terminal — resumes from 66
   - ~2.5h wall-clock

2. **Или alternative — bookmarklet in regular Chrome** (Claude can write by request)

3. **Или accept 65/400** — we have 199 Twitter which is better reach metric anyway

4. **Outreach Wave 1** — drafts in `AUTHORS-CATALOG-VERIFIED-TOP30.md` ready to send

---

## Critical files for resume

- **SESSION-RESUME.md** (root) — full resume with commands
- **AUTHORS-CATALOG.md** — main deliverable
- **AUTHORS-CATALOG-VERIFIED-TOP30.md** — Wave 1 outreach pack
- **MANUAL-REVIEW-VERIFICATIONS.md** — S9 verification summary
- **MANUAL-REVIEW-TRIAGE.md** — 67 manual-review candidates

## Live URLs
- Admin: `https://api.ratedbrokers.com/api/admin/authors/dashboard?key=...`
- Public: `https://ratedbrokers.com/research/authors` (noindex)

---

## Active Research (awaiting Егор's decisions)

**Freshness Dashboard + Monetization** — research complete 2026-04-21, код не менялся.

- Отчёт: `memory/freshness-dashboard-research.md` в корне
- Resume entry point: `SESSION-RESUME-FRESHNESS.md` в корне
- Auto-memory pointer: `freshness_monetization_research`

**Pending decisions Егора (blocking для старта работы):**
1. Runner model для агентов: A (GitHub Action) / B (human-in-loop MVP) / C (Claude API direct) — рекомендация B
2. Approve monetization Model B (Sponsored slot выше Top-10, BrokerChooser-style)
3. Bill consult на disclosure copy + `/how-we-make-money` page
4. Sync весов формулы: Leo prompt `25/20/20/15/10/10` vs status.md `30/20/15/15/15/5`

**Scope после approve (8-12 дней):**
- S1 D1 schema `agent_runs` (0.5 дн)
- S2 Расширить `broker_changes` на все MD fields (1 дн)
- S3 Backend endpoints `/freshness` + `/agents/run` + `/agents/:id/approve` (1.5 дн)
- S4 Admin UI Freshness раздел (2 дн)
- S5 Runner integration (2-5 дн, зависит от выбора A/B/C)
- S6 Auto-rerank после Leo approve (1 дн)
- S7 Backfill seed из git blame (0.5 дн)

---

## Memory pointers (прежние)

- [[project]] — проект, стек, цели
- [[decisions]] — архитектурные решения
- [[agents]] — AI agents (Джон, Боб, Лео, Барбара, Билл)
- [[preferences]] — предпочтения Егора
- [[deploy]] — Cloudflare Pages, ratedbrokers.com
- [[backend]] — CF Workers + D1
- [[authors_sprint]] — overall Authors sprint state
- [[freshness_monetization_research]] — Dashboard + Sponsored research (2026-04-21)

---

## Живые файлы-инструкции (корень проекта)

- **SESSION-RESUME.md** — первым читать при старте сессии (Authors outreach pipeline)
- **SESSION-RESUME-FRESHNESS.md** — Freshness Dashboard + Monetization research entry point (2026-04-21)
- AUTHORS-FIELD-MANUAL.md — operator cheatsheet для authors work
- CLAUDE.md — project-wide instructions

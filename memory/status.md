# Status — текущее состояние проекта

Last updated: 2026-04-16

---

## Что в работе / последнее

**AllReviewsPage — переключалка вариантов (2026-04-16).** Параллельная линия UI — редизайн секции "All Broker Reviews". Текущая версия (`#0f172a` navy карточки) выглядит «чёрным блоком». Собран прототип с **33 вариантами** для выбора.

- Файл: `src/pages/AllBrokersProto.jsx`
- Роут: `/proto/all-brokers` (dev-only)
- Варианты: 0-32, 7 концептуальных групп (см. logs/2026-04.md, запись 2026-04-16)
- Егор выделил лучшие: #5 Split, #7 Tile Slate-200, #11 Tile Gradient, #16-20 Two-tone dark
- Финальная формулировка брифа: «тайл тёмный, блок тоже тёмный, но не такой. При hover всё загорается»
- Последний виток (27-32): BestBrokers-style rectangular inset tile внутри slate-карточки
- Next session: Егор выбирает финал → портируем в `AllReviewsPage.jsx` → commit
- НЕ закоммичено, работа в рабочей копии

**Authors Sprint — Phase 1-6 COMPLETE.** 580 авторов с 96 сайтов-конкурентов собрано и обогащено E-E-A-T данными.

Подробности и инструкции для возобновления: **`SESSION-RESUME.md`** в корне.

### Ключевые цифры
- 580 authors (34 MVP + 546 harvested)
- Tier distribution: S=31, A=84, B=218, C=213
- LinkedIn 71%, Muck Rack 42%, Twitter 39%, Email 14%
- 82 авторов с сертификатами (CFA/CFP/Series/CTA)
- 263 multi-outlet (cross-writers)

### Sprint backlog (2026-04-16) — UPDATED
- **S0 ✅ DONE** — Hotfix `e478aa1` для белой страницы (CATEGORIES[6] missing, prop firms)
- **S1 ✅ DONE** — Push + verify (prod рендерит 491 авторов, 0 console errors)
- **S2 ✅ DONE** — `776b338` Schema.org Person усилен (image, hasCredential, knowsAbout) + Organization markup на /about (member[], publishingPrinciples, ethicsPolicy)
- **S3** — IN PROGRESS (background agent верифицирует top-30 в реестрах CFA/FINRA/CFP + ISBN + awards). Output: scripts/top30-verified.json
- **S4 ✅ DONE** — `fa63587` heuristic clearing 21/88 needsManualReview, остальные 67 в MANUAL-REVIEW-TRIAGE.md
- **S5** — IN PROGRESS (тот же background agent — outreach drafts для 30 Tier-S, "Reviewed and approved by" angle)
- **S6 ✅ DONE** — `fde295e` каталог 579 авторов (AUTHORS-CATALOG.md + Tier-A + Tier-BC + CSV)

### Живые URL
- Локально: http://localhost:5173/research/authors
- Прод: https://ratedbrokers.com/research/authors (noindex, deployed)

---

## История работы (last sessions)

### 2026-04-16 — AllReviewsPage proto (33 variants)
- `src/pages/AllBrokersProto.jsx` новый + роут `/proto/all-brokers`
- 33 варианта карточки: 0-6 baseline, 7-12 tile+light, 13-15 BB-inspired, 16-20 two-tone dark, 21-26 Barbara R2 (glass/ring/radial/rail/carbon/vertical), 27-32 inset rectangular BB-style
- Егор фавориты: #5, #7, #11, #16-20
- Ожидается финальный выбор

### 2026-04-15/16 — Authors Sprint Phase 1-6
- Phase 0: discovery map 96 outlets
- Phase 1: outlet metadata (DR/tier/competitorBacklinks)
- Phase 2: enumeration 562 authors (6 parallel agents)
- Phase 3: Layer 5.5 enrichment 38 batches × 15 authors
- Phase 4+5: dedup 13 merges + E-E-A-T scoring
- Phase 6: merge into authorsSample.js, build ok, commit f48bbaa

Детали в logs/2026-04.md.

### 2026-04-15 — Planning + Field Manual
Создали:
- AUTHORS-FIELD-MANUAL.md (operator recipes, Rules A-G)
- AUTHORS-SPRINT-EXECUTION.md (execution v3)
- AUTHORS-SPRINT-FINAL.md (19 sections plan)
- AUTHORS-HARVESTING-PLAYBOOK.md (methodology)
- EEAT-AUTHOR-CRITERIA.md (18 categories, tier S/A/B/C)

### 2026-04-15 — Research page /research/authors MVP v2
Первоначальный MVP 34 authors из 5 сайтов. Schema расширена на 7 E-E-A-T секций. UI 17 filters.

### 2026-04-15 — Research page /research/competitors
96 outlets карта. 6 категорий (direct comp / finance editorial / trading media / tier-1 press / crypto / prop firms). noindex.

---

## Memory поинтеры

- [[project]] — проект, стек, цели
- [[decisions]] — архитектурные решения
- [[agents]] — AI agents (Джон, Боб, Лео, Барбара, Билл)
- [[preferences]] — предпочтения Егора
- [[deploy]] — Cloudflare Pages, ratedbrokers.com
- [[backend]] — Cloudflare Workers API + D1

---

## Живые файлы-инструкции (корень проекта)

- **SESSION-RESUME.md** — первым делом читать при resume сессии
- **AUTHORS-FIELD-MANUAL.md** — operator cheatsheet для authors work
- **AUTHORS-SPRINT-EXECUTION.md** — execution plan
- **AUTHORS-SPRINT-FINAL.md** — strategic plan
- **AUTHORS-HARVESTING-PLAYBOOK.md** — methodology reference
- **EEAT-AUTHOR-CRITERIA.md** — E-E-A-T scoring criteria
- **AHREFS-DATA-LOG.md** — Ahrefs pulls log (DR + 122K refdomains)
- **CLAUDE.md** — project-wide instructions

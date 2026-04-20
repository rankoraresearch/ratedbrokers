# Status — текущее состояние проекта

Last updated: 2026-04-20 (Design Audit завершён и смёрджен в main, прод обновлён)

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

## АКТИВНОЕ (2026-04-19)

**Menu Redesign** — [[menu-redesign]]
- Глубокий аудит `src/components/Header.jsx` (1055 строк): 9 концептуальных проблем + 9 мелких багов
- Главная находка: 6 из 8 вертикалей (CFD/Stocks/Options/Futures/Copy/Spread) спрятаны из nav — меню живёт в Forex-эпохе, не синхронизовано с M4 Online Brokers umbrella
- **Прототип:** `src/pages/MenuProtoV2.jsx` (~650 строк, dev-only) — **одобрен Егором**
- **Live:** http://localhost:5173/proto/menu-v2
- **Branch:** `design-audit-round-2`, не коммичено

### Pending: prod перенос в Header.jsx
1. Forex + Crypto nav → единый **Brokers ▾** mega (4 кол, 8 вертикалей с counts)
2. Reviews → настоящие wide-лого + fix bottom CTA (`/best-forex-brokers` → `/reviews`)
3. Compare + Methodology возврат на desktop
4. Countries → per-vertical CFD/BTC чипы
5. EN ▾ → disabled state пока i18n не готов
6. Удалить dead code (icon/color fields, GUIDE_ITEMS, renderCatItems/renderMobCatItems) ~40 строк

Ожидаемый diff: Header.jsx 1055 → ~850 строк.

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

## Memory pointers (прежние)

- [[project]] — проект, стек, цели
- [[decisions]] — архитектурные решения
- [[agents]] — AI agents (Джон, Боб, Лео, Барбара, Билл)
- [[preferences]] — предпочтения Егора
- [[deploy]] — Cloudflare Pages, ratedbrokers.com
- [[backend]] — CF Workers + D1
- [[authors_sprint]] — overall Authors sprint state

---

## Живые файлы-инструкции (корень проекта)

- **SESSION-RESUME.md** — первым читать при старте сессии
- AUTHORS-FIELD-MANUAL.md — operator cheatsheet для authors work
- CLAUDE.md — project-wide instructions

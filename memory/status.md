# Status — текущее состояние проекта

Last updated: 2026-04-16 21:00 (Author page rewrite + Editorial Activity spec)

---

## Frontend / последнее

**Author Page полный редизайн** — коммит TBD (16.04.2026)
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

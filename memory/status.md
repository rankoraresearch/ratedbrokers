# Status — текущее состояние проекта

Last updated: 2026-04-16 evening (after S7-S10 authors data pass)

---

## Что в работе / последнее

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

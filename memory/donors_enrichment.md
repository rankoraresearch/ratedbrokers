# Donors Enrichment — Backlinks Outreach Pipeline

## Что это

Система обогащения 7,805 refdomain доноров (из Ahrefs) реальными email'ами для cold outreach / link building. Данные в D1 `donors` таблица, видны на admin dashboard.

## Entrypoint при возврате

**Егор говорит "backlinks" / "outreach" / "donors" / "email enrichment"** → читай `BACKLINKS-SESSION-2026-04-16.md` в корне проекта. Там полная резюме + resume инструкции.

## Текущее состояние (2026-04-17 19:14)

| Status | Count |
|---|---|
| ✅ found | **2,070** (clean, codex-audited) |
| ⚪ no_contact | 4,284 |
| 🛑 blocked | 641 (CF challenge — L5 Playwright partial) |
| 💀 dead | 810 |

## Ключевые достижения

- **Cleanup существующей базы** (3,755 → 1,762) — codex audit поднят с 3/10 до 14/15
- **L3 LLM pipeline** — +264 rows (24 email + 152 form)
- **L5 Playwright** — +42 rows (8 email + 34 form), пробил CF challenge
- **forexfactory.com manual** — +1 form

## Правила (зафиксированы)

- `feedback_outreach_prefer_general.md` — general/guest-post > personal (personal dies)
- `OUTREACH-EMAIL-RULES.md` — ladder, hard-reject, snippet context
- `OUTREACH-SPRINTS.md` — roadmap L3/L4/L5/L6/L7

## Скрипты

- `scripts/donors-cleanup.mjs` — ✅ applied (cleanup rules)
- `scripts/enrich-donors-l3-llm.mjs` — static fetch + codex + JSON-LD preservation
- `scripts/enrich-donors-l5-playwright.mjs` — Playwright headless + codex
- `scripts/donors-l3-commit.mjs` + `donors-l5-commit.mjs` — D1 commit
- `scripts/donors-l3-audit.mjs` — codex audit helper

## Что осталось (resume)

1. L5 Playwright continuation на 641 blocked (~5-6h runtime)
2. L4 Wayback Machine на 810 dead (не написано)
3. L3 expand на overlap=1 + DR≥60 (~4,000 доменов)
4. L6 Persona enrichment (name+role для editor/pr picks)
5. L7 Campaign CSV + 9 email templates

## Критичные баги что фиксили (don't re-run into)

1. JSON-LD scripts стрипились — fix: preserve `<script type="application/ld+json">`
2. Bare apex 403'ило — fix: www. prefix first
3. Custom contact paths — fix: discovery via homepage `<a href>` parsing
4. Personal emails через Organization.email JSON-LD — fix: reject unless editor label
5. `comment@` = letters lane — fix: hard-reject
6. JSON-LD contactType=sales обход — fix: check contactType near email

## Codex CLI

Работает, GPT-5 Codex. Ключ токенов у Егора. Команда: `codex exec --skip-git-repo-check`.

Audit arc:
- v1 pick: 3/10 (30% мусора)
- v2 (after partial cleanup): 4-6/10
- v3 (tightened): **14/15 = 93%** (realistic ceiling)
- L5 Playwright picks: **8/8 = 100%**

## Commits этой сессии

- cleanup + L3 setup (02:00-11:30)
- L3 commits × 2 (batch3 + batch4)
- L5 Playwright setup + batch 200
- Manual forexfactory.com fix
- Final commit + documentation

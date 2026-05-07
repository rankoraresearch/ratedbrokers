# non-broker-urls-audit

> **2026-05-07 — Sprint NB-1: ЗАВЕРШЁН.** 10 non-broker URL удалены под 0 (без редиректов). Anti-recurrence guard `scripts/validate-rankings.mjs` подключён в build/dev. Codex review NEEDS_CHANGES → 3 fixes applied.
>
> История: 2026-04-22 — research; 2026-05-07 — Егор выбрал «удалить под 0», запущен Sprint NB-1.

## Что удалено (10 URL + ID)

| URL | ID | Старый фильтр |
|-----|-----|---------------|
| `/best-crypto-exchanges` | crypto-exchanges | isCrypto |
| `/best-crypto-wallets` | crypto-wallets | isCrypto |
| `/best-crypto-staking-platforms` | crypto-staking | isCrypto |
| `/best-usdt-trading-platforms` | crypto-usdt | isCrypto |
| `/best-crypto-margin-trading` | crypto-margin | isCrypto |
| `/best-crypto-trading-apps` | crypto-apps | isCrypto |
| `/best-forex-trading-courses` | forex-courses | scoreAbove(8.0) |
| `/best-forex-chart-websites` | forex-charts | hasPlatform(TV/cTrader) |
| `/best-forex-signal-providers` | forex-signals | all (!) |
| `/best-robo-advisors` | stocks-robo | isStocks |

**Live count в `src/data/rankings.js`:** 293 → **283**.

## Затронутые файлы

- `src/data/rankings.js` (-10 строк, header comment 253→283)
- `src/data/rankingFilters.js` (-10 правил)
- `src/data/rankingSeoContent.js` (-10 SEO-блоков)
- `src/data/thematicGenerators.js` (-3 генератора + helper)
- `src/data/educationTemplates.js` (-3 label + helper)
- `src/data/cryptoPillarContent.js` (-2 internal links)
- `src/components/Header.jsx` (-1 dropdown link)
- `src/pages/MenuProtoV2.jsx` (-1 link, "293 rankings"→"283")
- `package.json` (+rankings:validate, build/dev gate)
- `scripts/validate-rankings.mjs` (новый — anti-recurrence guard)
- Docs: `FINAL-SITEMAP.md`, `RANKING-TRACKER.md` (disclaimer), `RANKINGS-MAP.md` (disclaimer), `THEMATIC-RANKINGS-TREE.md`, `MILESTONES.md`

## Что НЕ затронуто (специально)

- D1 `page_publish` table — была пустой по этим slugs (verified `wrangler d1 execute --remote`).
- Research docs `NON-BROKER-URLS-AUDIT.md`, `ARCHITECTURE-AUDIT-2026-04-28.md`, `URL-ARCHITECTURE-v3-OPTIONS.md` — оставлены как историческая трассировка решения.

## Виновник (history)

- Коммит `d04440b` (01.04.2026, "M4 Sprint 1+2")
- Root cause: предупреждения Билла "requires different content type" потерялись при переносе из research → план → код
- Защита от повтора: `scripts/validate-rankings.mjs` (slug должен содержать `broker(s)` ИЛИ быть в whitelist; каждый ID должен иметь фильтр)

## Codex review

NEEDS_CHANGES (0 critical, 1 high, 1 medium, 1 low) — все 3 finding'а применены:
1. **HIGH:** validator script tracked (git add scripts/validate-rankings.mjs)
2. **MEDIUM:** stale counters обновлены (rankings.js:4, MenuProtoV2.jsx ×2, RANKING-TRACKER + RANKINGS-MAP с disclaimer)
3. **LOW:** dev script тоже валидирует (`npm run dev` теперь идёт через rankings:validate)

## Branch / safepoint

- Ветка: `sprint/nb-1-cleanup`
- Safepoint tag: `safepoint-pre-nb1-cleanup-2026-05-07-1639` (на main, в origin)

## Связанные узлы

- [[status]]
- [[bill]] — Билл (автор плана с потерянными предупреждениями)
- [[architecture-audit-2026-04-28]] — F1 в этом аудите = эти же 8 URL (теперь 10 после ревизии)

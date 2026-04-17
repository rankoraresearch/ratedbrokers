---
name: Expert Shortlist (S11)
description: Realism-scored ranking of 579 harvested authors for realistic outreach + E-E-A-T weight. Admin Top Picks tab + Claude's pick sort.
type: project
---

# Expert Shortlist — Realistic Top Picks

S11, commit `1bd40a9` (2026-04-18). Независимый проход по всем 579 harvested authors для отбора реалистичных кандидатов на роль "Reviewed and approved by" экспертов.

## Зачем

`calcAuthoritativeness` в `authorsSample.js` оптимизирован под pure authority и двигает celebrities (Lyn Alden 908K Twitter, Scott Melker 1M) в топ. Для outreach RatedBrokers им нечего предложить — они unreachable. Нужна **realism**-метрика с кэпом на reach и штрафами за celebrity status.

## Методология — 5 sub-scores (см. `src/data/realismScore.js`)

| Фактор | Вес | Что считает |
|---|---|---|
| Credentials | 25% | Core cert verified ✓ = 100, core claimed = 70, other cert = 45, none = 10. Core = CFA/CFP/CMT/CPA/FINRA/Series X/FRM/CAIA/CIM/CIPM. **Non-core issuers исключены** (ICFAI — Indian program, не CFA Institute) |
| On-topic | 25% | forex/cfd/broker-safety/regulation = 100; stocks/options/futures = 80; crypto = 70; generic investing/finance = 55; personal-finance/retirement = 20 |
| Reach (capped) | 15% | sweet spot 10-200K combined → 92-100; 50K-200K = 92; >500K = 25; >1M = 10 (celebrity penalty) |
| Byline depth | 15% | yearsInIndustry — 15+ = 100, 10+ = 80, 5+ = 60; + site-count bonus (5+ sites +15) |
| Approachability | 20% | contributor/guest/former = 100, editor = 80, senior = 65, staff/chief = 60/50, Tier-1 staff = 35 (floor) |

**Penalties** (subtractive):
- Tier-1 staff journalist (Bloomberg/Reuters/WSJ/FT/CNBC/NYT) chief/staff/editor — −20
- Twitter followers > 500K — −15
- No LinkedIn AND no email — −15
- Harvest badge = C — −10
- Chief/executive title (любой outlet) — −5

## Tiers A-E (classifyCandidate в том же модуле)

- **A** Perfect fit: verified core cert ✓ + on-topic + approachable
- **B** Strong realistic: verified core cert ✓ + approachable (topic adjacent)
- **C** Upside bet: on-topic + approachable + **unverified** cert claim (нужна верификация)
- **D** Secondary: approachable + хороший byline, **без cert**
- **E** Stretch: COI (staff/chief у конкурента) — формально realistic но trudno reach

## Три сортировки в Admin Top Picks

1. **Final score** — старая pure-authority метрика (default на All tab)
2. **Realism** — чистый realism score без correction на COI
3. **Claude's pick ⭐** — `realism × tierWeight` (A=1.00, B=0.98, C=0.95, D=0.90, E=0.85). Default на Top Picks tab. Мягко приспускает E-Stretch (Jessica Inskip #5→#14, Margaret Yang #7→#17)

## Top 10 по Claude's pick

1. James Chen (CMT✓) — 100 · A
2. Charles Lewis Sizemore (CFA✓) — 91.3 · A
3. Matthew Levy (CFA✓) — 90.3 · A
4. Doug Boneparth (CFP✓) — 87 · B
5. Terry Flanagan (CFA✓) — 82 · A
6. Danielle Park (CFA) — 79.6 · C
7. Eugene Lee (CFA✓) — 79 · A
8. Justin Freeman (IMC+FCA) — 78.4 · C
9. Alan Brochstein (CFA) — 74.6 · C
10. Eno Eteng (MSTA+Diploma) — 73.4 · C

Tier-распределение top-50: A=5, B=1, C=25, D=12, E=7

## Codex review (2 passes)

Первый проход: 3 HIGH + 1 MEDIUM.
- HIGH: `CFA (ICFAI)` матчился как core → добавил `NON_CORE_ISSUERS` regex
- HIGH: `classifyCandidate` использовал `some(c=>c.verified)` вместо core-check → вынес `hasVerifiedCoreCert()`
- HIGH: Certs иногда strings (`["IMC","SIDip"]`) → `normaliseCert()` во всех 3 consumers
- MEDIUM: E-Stretch в топе → +5 penalty chief/executive + tier-weighted sort

Второй проход: 3/3 HIGH RESOLVED, MEDIUM PARTIAL (приемлемо — `Claude's pick` sort решает), нет новых багов.

## Файлы

- `src/data/realismScore.js` — shared scorer (gitignored под `data/` → force-added)
- `scripts/s11-expert-shortlist.mjs` — CLI runner, пишет `s11-shortlist-output.json`
- `scripts/s11-generate-md.mjs` — MD-генератор
- `scripts/s11-shortlist-output.json` — snapshot топов (~504KB)
- `EXPERT-CANDIDATES-REALISTIC-TOP50.md` — главный deliverable (25KB, top-50 + longlist 51-150 + methodology + pitch angles)
- `backend/src/routes/admin-authors.js` — Top Picks tab + Realism column + Claude's pick sort

## Как регенерировать после изменения данных

```bash
node scripts/s11-expert-shortlist.mjs
node scripts/s11-generate-md.mjs
# Admin tab пересчитывается автоматически при refresh — backend импортирует realismScore.js
```

## Что дальше

- Outreach Wave 1 ждёт в `AUTHORS-CATALOG-VERIFIED-TOP30.md` (pre-S11 pack, надо выверить против нового top-10)
- При скэйлинге бюджета можно снять penalty >500K (поднимет Lyn Alden, Scott Melker)
- Если в future добавить D1-хранилище COI (текущий employer flags) — можно заменить простую approachability на реальный conflict-graph

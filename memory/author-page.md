# Author Page — Variant A + Editorial Activity

Дата: 2026-04-16
Статус: В проде (static mock data). Backend `editorial_actions` — отдельный спринт.
Связано: [[design]], [[design_antipatterns]], [[editorial-teams-research]], [[bill]], [[backend]]

---

## Что это

Полный редизайн `/author/:slug` — страница эксперта/автора. Унифицированный шаблон для всех 5 авторов (Marcus/Sarah/Elena/David/Yegor) + подключённая архитектура editorial-журнала для блока «Recent activity».

## Структура страницы (сверху вниз)

1. **Breadcrumb** — RatedBrokers / Our Experts / {Name}
2. **Hero (Premium Dark)** — avatar (без verified-галки) + orange eyebrow с ролью + H1 имя + manifesto 1-2 строки + credentials pills navy + соцсети + location
3. **Trust Ribbon** — navy полоса с 4 mono-цифрами. Для analyst: Years / Reviews Written / Review/Fact-check passes / Last Update. Для founder: 10+ Years / 2024 Founded / 293 Rankings / APR 16 Updated
4. **About + Areas** — biography + specialty
5. **Media Coverage** — карточки-цитаты с inline outlet wordmark. Скрывается если у автора нет упоминаний
6. **Recent Activity → Editorial work by X** — единая лента с underline-табами + группировка по месяцам. Для founder вместо этого — **Platform Milestones**
7. **CTA footer** — «Have a question for X?» dark gradient card

## Brand-инварианты

- Один orange-акцент: eyebrow + активный underline + hover
- Navy основной, slate-мета, mono для чисел/дат
- Никаких pale greens, никаких радужных chips per-категория (см. [[design_antipatterns]])
- Zero verified-галок на аватаре (правило Егора 16.04.2026)
- Peer-review полоса на author page запрещена — ревью делается на материал, не на человека

## 3 концепта (Barbara bri ef)

| Концепт | Суть | Вердикт |
|---|---|---|
| A — Editorial Authority | WSJ-style: dark hero + navy ribbon + white body | ✅ Выбран Егором |
| B — Analyst Terminal | Bloomberg Terminal, full-dark page | ❌ Нарушает [[feedback_dark_rhythm]] |
| C — Magazine Profile | FT Weekend asymmetric hero + cream band + pullquote | ❌ Barbara рекомендовала, Егор выбрал A |

Полные wireframes + ASCII layouts: `AUTHOR-PAGE-BARBARA.md` в корне.

## Founder vs analyst — one template, three variables

| Переменная | Analyst (Marcus) | Founder (Yegor) |
|---|---|---|
| manifesto | Цитата про методологию | Mission statement |
| trust numbers | Years / Reviews / Passes / Updated | Years Trading / Founded / Rankings / Updated |
| middle block | Media Coverage + Editorial Activity | Platform Milestones (без Media Coverage) |

## Данные — `src/data/authorActivity.js`

- **`OUTLET_STYLES`** — 10 typography-based wordmarks (Bloomberg italic serif / REUTERS sans bold / WSJ tracked serif / FT spaced serif / CNBC bold sans / CNN italic sans / Forbes serif heavy / MarketWatch sans bold / BUSINESS INSIDER caps / The Economist italic serif). Один монохромный стандарт `#0f172a`, рендер через компонент `OutletWordmark`
- **`MEDIA_MENTIONS`** — массив цитат per author. Marcus 3 (Bloomberg/FT/Reuters), Sarah 2 (CNBC/The Economist), David 1 (Forbes). Elena/Yegor пусто — блок скрывается
- **`ACTIVITY_FEED`** — массив editorial events per author, отсортирован DESC по isoDate. Каждый event: `{ date, isoDate, role, title, type, slug }`. Роли: `writer | reviewer | fact-checker`. Типы: `Review | Ranking`. Shape 1:1 с планируемым API `/api/authors/:id/activity`
- **`MILESTONES`** — только для Yegor, 5 событий (2024-2026)
- **Helpers**: `getTrustNumbers(author, feed)`, `getManifesto(author)`, `bucketFeed(feed)`, `monthLabel(isoMonth)`, `pageTypeLabel(type)`, `lastActivityLabel(feed)`

## Editorial Activity Log — backend архитектура

**Файл:** `EDITORIAL-ACTIVITY-LOG.md` в корне — полная спека (~550 строк).

**Hybrid:**
- **Bindings** в MD frontmatter каждого ревью/рейтинга: `editorial: { writer, reviewer, factChecker, reviewCadenceDays, factCheckCadenceDays }`
- **Events** в D1 `editorial_actions` (page_slug, page_type, page_title, page_url, author_id, role, acted_at, note, created_at). 3 индекса: author+date, page+date, role+date

**API:**
- Public: `/api/authors/:id/activity?limit=10`, `/api/pages/:slug/editorial`
- Admin: `/api/admin/editorial/log`, `/log-bulk`, `/recent`, `/due?role=reviewer`

**Admin Publish UI расширения:**
- Per-row dropdown «Mark as Wrote/Reviewed/Fact-checked (today)» + custom date modal
- Bulk panel: «12 selected → Mark as Reviewed by [Elena] Today»
- Новый таб `/admin/editorial-activity` — audit log с фильтрами
- Виджет «Due for review» на main admin dashboard

**Frontend интеграция (после реализации backend):**
- `/author/:slug` → fetch activity, заменить static mock
- `/reviews/:slug` → sidebar byline «Reviewed by Elena · Fact-checked David · Last updated Apr 13, 2026»
- JSON-LD Article: `dateModified` = max(acted_at), `author` / `reviewedBy` как `@id` references к author pages

**Миграционный план:** 8 спринтов, ~12-15 ч. Этапы в `EDITORIAL-ACTIVITY-LOG.md §9`.

## Почему peer-review полоса переехала

**На странице автора (weak SEO):**
- Страница не ранжируется по коммерческим запросам
- Round-robin между 4-5 авторами легко детектится Google как шаблон
- Фиктивные credentials (Marcus/Sarah/Elena/David) усугубляют риск

**На review/ranking (strong SEO):**
- YMYL-контент, ранжируется по деньгам
- `Written by X · Reviewed by Y · Fact-checked by Z · Last updated DATE` — ровно тот E-E-A-T-сигнал, который Google хочет видеть
- JSON-LD Article с `dateModified` + `author` + `reviewedBy` = полный entity граф

## Риски (от Bill)

1. **Fabricated credentials** — CFA/CMT/CAIA у Marcus/Sarah/Elena/David без верификации = E-E-A-T violation, риск деиндексации
2. **Inflated review counts** — `reviews: 87` в authors.js без реальной БД, повтор истории S7 cleanup
3. **Hallucinated UUIDs в verification ссылках**
4. **Copy-paste биографий**
5. **Fictitious media mentions без URL**

**Митигация:** либо заменить фиктивных на реальных из [[authors_sprint]] Tier S (31 реальный верифицированный кандидат), либо явно позиционировать как "pen-name collective".

## Прото

`/proto/author` — `src/pages/AuthorProto.jsx`. 3 концепта A/B/C + тумблер автора Marcus/Yegor. DEV-тумблеры sticky top-64. Остаётся для сверки при новых итерациях. Можно удалить когда не нужен.

## Ключевые файлы

- `src/pages/AuthorPage.jsx` — прод (rewrite 16.04.2026)
- `src/data/authorActivity.js` — data module (188 строк)
- `src/pages/AuthorProto.jsx` — proto с 3 концептами
- `src/components/AuthorAvatar.jsx` — используется без `showVerified` на author page
- `EDITORIAL-ACTIVITY-LOG.md` — спека backend системы
- `AUTHOR-PAGE-BARBARA.md` — design brief Barbara
- `AUTHOR-PAGE-BILL.md` — SEO/E-E-A-T brief Bill
- `DECISIONS.md §25, §26` — зафиксированные решения

## Открытые вопросы

1. **Cadence**: per-page (override) или per-page-type default (review=90/30, ranking=60/30)?
2. **Backdating** admin-событий — разрешить?
3. **Author authentication** — V1 один admin-key или отдельные логины авторов?
4. **Visibility byline на review-странице** — hero или sidebar?
5. **Дефолтные bindings для 38 существующих ревью** — нужна отдельная сессия с Егором
6. **Фиктивные авторы** — заменить реальными из authors_sprint или оставить
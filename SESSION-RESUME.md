# Session Resume — Authors outreach data pipeline

Last session ended: **2026-04-16 evening**. Read this first when restarting.

---

## Где мы сейчас

**M4: Authors outreach map** — 579 авторов с 96 сайтов-конкурентов, верифицированные credentials, reach metrics. Phase 1-6 (harvest) сделаны ранее. В этой сессии прошли S7 → S10.

### Текущее покрытие данных

| Метрика | Покрытие | Качество |
|---|---|---|
| Total authors | 579 | harvested |
| Tier S | 32 | after S9 verified cert boost |
| Tier A | 85 | |
| LinkedIn URL | 400 / 579 (69%) | — |
| **LinkedIn followers** | **65 / 400 (16%)** | ✅ verified from real Chrome via CDP |
| Twitter/X URL | 227 / 579 (39%) | — |
| **Twitter followers** | **199 / 227 (88%)** | ✅ verified from x.com, spot-check 10/10 |
| **Verified certifications** | 19 authors | ✅ source URL from CFA/CFP/FINRA/CMT registries |
| **Books with ISBN-13** | 25 authors, 42 books | ✅ Amazon/Google Books URLs |
| Still flagged needsManualReview | 67 | pending Егор's manual pass |

### Последний commit
`00f475e feat(authors): S10 LinkedIn followers via CDP — 65 verified counts`

Все 10 коммитов этой сессии на `main`, запушены.

---

## Хронология — что делали в этой сессии

### S7: LinkedIn followers через WebSearch → DISASTER
- 4 параллельных агента делали WebSearch запросы про LI followers
- Агенты **галлюцинировали** snippets вроде "Larry Swedroe has 280,836 LinkedIn followers" с `confidence: high` но без source URL
- Реальное значение Larry Swedroe = 9,229 (скрин от Егора) vs claimed 280K = **wrong by 30x**
- **43 записи purge'ed**, forensic-копия в `scripts/s7-followers-output.json` под `followersHallucinated`
- Урок: confidence:high без source URL — не evidence. Source URL обязателен для `verified: true`.

### S8: Authors page в admin + restored public
- Добавил `/api/admin/authors/dashboard` через backend worker
- Egor захотел оставить публичную /research/authors тоже — dual access

### S9: Twitter as reach proxy + registry verification
- **S9 Twitter fetch**: Playwright + x.com (публичный, без логина), fetch 227 URL
  - 199/227 verified. Scott Melker 1M, Lyn Alden 908K, Whitney Webb 689K, Frank Chaparro 206K
  - Spot-check 10/10 совпали с live x.com (0% diff)
  - Codex review нашёл [HIGH] потенциальную регекс-дыру → fix добавил handle-validation через `document.title`
- **S9 verification agents** (8 retry batches по 12 авторов):
  - 22/61 certs verified (CFA Institute directory закрыли за login wall, поэтому CFA через byline на employer pages)
  - 42 books с ISBN-13 (все с Amazon/Google Books URL)
  - Jessica Inskip FINRA CRD 5693503 verified clean, 4 series exams confirmed
  - Elaine King CFP verified через CFP Board Ambassador page
- UI update: колонки "LI Ⓕ" → "X Ⓕ" на public + admin

### S10: LinkedIn через user's real Chrome (CDP)
- Подход: `chromium.connectOverCDP("http://127.0.0.1:9222")` — не Playwright Chromium (тот детектится), а настоящий Chrome с реальным user-data-dir
- Скрипт: `scripts/s10-li-cdp-fetch.mjs`, launcher: `scripts/s10-START-CHROME.sh`
- **Результат: 65/400 verified** — реальные числа (Boneparth 12,359; Bobby Ong 12,120; Emily Stewart 8,845; Jared Blikre 6,522; James Chen 5,341)
- **Остановилось** потому что Егор случайно нажимал Ctrl+C в терминале где Chrome работал (3 раза!). Терминал со `s10-START-CHROME.sh` должен висеть без касания.
- **2 записи purge'ed**: Barbara Friedberg и Merryn Somerset Webb получили одинаковое 328,617 — extractor поймал чужое число из сайдбара. Dup-count detector работает.

---

## Что предстоит (чтобы добить)

### A. Добить LinkedIn followers (335 остались)

**Способ 1 — CDP через отдельный Terminal (как S10):**
1. **Открой НОВОЕ окно Terminal.app** (не там где Claude):
   ```bash
   cd /Users/yegorbarakovskiy/Desktop/ratedbrokers
   bash scripts/s10-START-CHROME.sh
   ```
2. Откроется Chrome → залогинься в linkedin.com → **не трогай терминал**
3. Скажи Claude "запускай LI fetch" — он запустит `node scripts/s10-li-cdp-fetch.mjs`, resume'нется с 66-го автора
4. ~2.5 часа wall-clock, throttle 20-35s/profile
5. **КРИТИЧНО**: не Ctrl+C, не закрывай ничего

**Способ 2 — bookmarklet в обычном Chrome:**
Пока не реализован. Ты паcтишь JS в DevTools console обычного Chrome, он сам проходит профили через `fetch()` с твоими cookies. Безопаснее (нельзя случайно убить). Claude может написать по команде "сделай bookmarklet".

**Способ 3 — принять 65/400 как есть:**
У нас 199/227 Twitter followers — полноценная reach-metric. LI можно считать опциональным.

### B. Верификация оставшихся certs (42/61 unverified)

Основные блокеры:
- **CFA Institute** закрыл public directory — для CFA claims используем byline verification на employer pages
- **UK STA** возвращает 403 на /members/
- **IFTA (CFTe)** не имеет public списка
- **State CPA boards** требуют state name, часто не disclosed в bio

Уже сделано для 19 авторов (CFP, FINRA, CMT, NFEC, CBE/OBE). Следующее — только если Егор решит углубляться.

### C. Manual review 67 needsManualReview authors
Лежит в `MANUAL-REVIEW-TRIAGE.md`, ждёт ручного прохода Егора.

### D. Outreach Wave 1
Черновики писем для top-30 лежат в `AUTHORS-CATALOG-VERIFIED-TOP30.md` (из S3+S5). Готовы к отправке — ты правил pitch angle "Reviewed and approved by".

---

## Ключевые файлы

### Данные
- `src/data/authorsSample.js` — canonical store (1.35MB, 579 authors + 96 SITES + scoring helpers)
- `AUTHORS-CATALOG.md` — главный документ, 1637+ строк
- `AUTHORS-CATALOG-TIER-A.md` — 85 Tier-A full blocks
- `AUTHORS-CATALOG-TIER-BC.md` — 462 Tier-B/C condensed
- `AUTHORS-CATALOG-DATA.csv` — 580 rows, все поля
- `AUTHORS-CATALOG-VERIFIED-TOP30.md` — Wave 1 outreach pack
- `MANUAL-REVIEW-VERIFICATIONS.md` — S9 verification summary
- `MANUAL-REVIEW-TRIAGE.md` — 67 authors на ручной проход

### Scripts
- `scripts/s7-purge-fake-followers.mjs` — cleanup S7 hallucinations
- `scripts/s9-fetch-twitter-followers.mjs` — x.com Twitter fetcher (✅ done)
- `scripts/s9-merge-v2.mjs` — idempotent merger (all fetch outputs → authorsSample.js)
- `scripts/s9-spot-check.mjs` — spot-check 10 authors against live x.com (10/10 match)
- `scripts/s10-START-CHROME.sh` — launch user's real Chrome with CDP port 9222
- `scripts/s10-li-cdp-fetch.mjs` — LI follower fetch via CDP (resumable)
- `scripts/s6-build-catalog.mjs` — regenerate all catalog files

### Outputs
- `scripts/s9-twitter-output.json` — 227 Twitter records (199 hits)
- `scripts/s10-li-cdp-output.json` — 81 LI records (65 valid)
- `scripts/s7-followers-output.json` — forensic copy of S7 hallucinations

### Live URLs
- Admin: `https://api.ratedbrokers.com/api/admin/authors/dashboard?key=RRBwsQr2C177vhpmCLh%2FJH55RgwLdl6bvRrkRwo8DOA%3D`
- Public: `https://ratedbrokers.com/research/authors` (noindex)
- Both show Twitter followers in "X Ⓕ" column

---

## Известные антипаттерны (хард-рулы)

1. **Никогда не доверять `confidence: high` без source URL** (S7 disaster)
2. **LinkedIn bulk scraping блокируется** — Playwright Chromium fingerprinted. Работает только user's real Chrome via CDP.
3. **CFA Institute directory закрыт за login** — CFA claims через employer byline, не через registry
4. **Spot-check перед массовым merge** — хотя бы 10 случайных записей вручную/скриптом
5. **Regex по `body.innerText` ловит сайдбар** — нужна либо DOM-скопированная область, либо dup-count detector
6. **Terminal с running Chrome не трогать** — Ctrl+C = убил Chrome = убил fetch

---

## Top 5 команд для resume

```bash
# Проверить статус
node -e "const m=require('./src/data/authorsSample.js');const A=m.AUTHORS.filter(Boolean);console.log('LI:',A.filter(a=>a.mediaSignals?.linkedinFollowers!=null).length,'/ 400');console.log('TW:',A.filter(a=>a.mediaSignals?.twitterFollowers!=null).length,'/ 227');"

# Добить LinkedIn (в новом Terminal окне!):
bash scripts/s10-START-CHROME.sh

# Запустить LI fetcher (в текущем терминале после логина в Chrome):
node scripts/s10-li-cdp-fetch.mjs

# Регенерировать каталог после нового fetch:
node scripts/s9-merge-v2.mjs && node scripts/s6-build-catalog.mjs && npm run build

# Spot-check Twitter data:
node scripts/s9-spot-check.mjs
```

---

**Когда начинаешь новую сессию — покажи Claude этот файл + содержимое `memory/status.md`. Он восстановит контекст за 2 минуты.**

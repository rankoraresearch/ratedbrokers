# E-E-A-T Author Criteria — Что Google считает авторитетом

Источник истины по оценке авторов для outreach и для E-E-A-T сигналов на нашем собственном сайте.

Парный документ к `AUTHORS-HARVESTING-PLAYBOOK.md`:
- **Playbook** = КАК собирать авторов (методология, 7 правил, 10 слоёв)
- **EEAT-Criteria** (этот файл) = ЧТО в авторах ценно и как мы это измеряем

Обновлён 2026-04-15.

---

## 1. Что такое E-E-A-T (пост-HCU 2024)

Google после Helpful Content Update превратил E-A-T в **E-E-A-T**:

| Буква | Signal | Verification |
|---|---|---|
| **E**xperience | Автор реально делал то, о чём пишет | First-person контент, фото/видео процесса, оригинальные данные, свой реальный trading experience |
| **E**xpertise | Формальные знания + сертификаты | Степени, CFA/CFP/CPA, FINRA exams |
| **A**uthoritativeness | Репутация в индустрии | Цитирования, упоминания в tier-1 прессе, премии, книги |
| **T**rustworthiness | Честность, прозрачность, реальная личность | Disclosure, no disciplinary history, own domain, consistent identity |

В financial vertical (YMYL — Your Money or Your Life) Google применяет E-E-A-T **жёстче всего**. Broker-review контент — самый YMYL из YMYL.

**Следствие**: у нас на сайте каждый автор-рецензент должен демонстрировать E-E-A-T через Schema.org Person markup (см. раздел 10). И в outreach мы ищем авторов, которых Google считает авторитетами — ссылка от такого — в разы ценнее.

---

## 2. 18 категорий характеристик (полная таксономия)

### 🔒 Уровень 1 — Unfakeable (верифицируется через независимый публичный реестр)

Это те самые «экзамены, которые невозможно подделать». Все — публичные, бесплатные, проверяются за секунды.

| # | Характеристика | Independent Registry | Verify URL pattern |
|---|---|---|---|
| 1 | **CFA Charter** | CFA Institute Member Directory | `cfainstitute.org/en/membership/directory` |
| 2 | **CFP®** | CFP Board public | `letsmakeaplan.org/find-a-cfp-professional` |
| 3 | **CPA** | NASBA / state board | `cpaverify.org` |
| 4 | **CMT (Chartered Market Technician)** | CMT Association | `cmtassociation.org/members` |
| 5 | **FRM (Financial Risk Manager)** | GARP directory | `garp.org/frm` |
| 6 | **CAIA (Chartered Alternative Investment Analyst)** | CAIA Association | `caia.org` |
| 7 | **ChFC® (Chartered Financial Consultant)** | The American College | `theamericancollege.edu` |
| 8 | **FINRA Series exams (3, 7, 24, 63, 65, 66, 79, 86, 87)** | FINRA BrokerCheck — **обязательный public registry для всех US brokers** | `brokercheck.finra.org` |
| 9 | **CTA (Commodity Trading Advisor)** | NFA BASIC | `nfa.futures.org/basicnet/` |
| 10 | **SEC Registered Investment Adviser (RIA)** | SEC IAPD | `adviserinfo.sec.gov` |
| 11 | **State Insurance License** | NIPR producer database | `nipr.com` |
| 12 | **State Bar Admission (for legal content)** | State bar directories | varies by state |
| 13 | **Accredited degree (BSc/MSc/PhD)** | National Student Clearinghouse / university alumni directory | varies |
| 14 | **PhD dissertation** | ProQuest Dissertations & Theses | `proquest.com/pqdtglobal` |
| 15 | **Published peer-reviewed research** | ORCID + Google Scholar + SSRN | `orcid.org`, `scholar.google.com` |

**Ключевое свойство**: если автор пишет «I'm a CFA», Google может это **проверить через публичный API**. Авторы без верификации — низкое доверие.

### 📚 Уровень 2 — Hard-to-fake (оставляет след во времени)

| # | Характеристика | Источник / Registry |
|---|---|---|
| 16 | **Published books** (ISBN) | Amazon Author Central, Library of Congress, Goodreads |
| 17 | **Patents** | Google Patents, USPTO |
| 18 | **Wikipedia biographical entry** (для top-tier) | Wikipedia (проверяется — статьи о фейках удаляются) |
| 19 | **Conference keynotes** | event archive pages, YouTube recordings |

### 📰 Уровень 3 — Citation authority (кто цитирует и как часто)

| # | Характеристика | Источник |
|---|---|---|
| 20 | **Quoted in tier-1 press** (NYT, WSJ, FT, Bloomberg, Reuters, CNBC) | Muck Rack «mentioned in», Google News search |
| 21 | **TV appearances** (CNBC, Bloomberg TV, Fox Business) | YouTube archives, TV channel websites, archive.org |
| 22 | **Podcast guest appearances** | Podchaser, Apple Podcasts search |
| 23 | **Regular column / byline frequency at authoritative outlet** | Muck Rack article count, RSS feeds |
| 24 | **Cited in competitor articles** (наш existing 122K refdomains CSV) | Ahrefs CSVs in `data/ahrefs-refdomains-2026-04-14/` |
| 25 | **Google Scholar h-index** | scholar.google.com/citations |

### 🏅 Уровень 4 — Industry recognition

| # | Характеристика | Источник |
|---|---|---|
| 26 | **Industry awards** (Barron's Top Advisors, SABEW Best in Business, Gerald Loeb, Fortune 40 under 40, Financial Times Awards) | event/publication archives |
| 27 | **«Named as expert» в list articles** («The 10 best forex analysts to follow») | Google search |
| 28 | **Professional association board seat** (CFA Institute board, CFP Board, SABEW executive board) | association websites |
| 29 | **Conference organizing committee** | event pages |

### 💼 Уровень 5 — Employment pedigree

| # | Характеристика | Источник |
|---|---|---|
| 30 | **Tenure at tier-1 financial firms** (GS, JPM, BofA, Fidelity, BlackRock, Morgan Stanley) | LinkedIn, ADV filings |
| 31 | **Government/regulatory past roles** (SEC, Fed, Treasury, FCA, ASIC, MAS) | LinkedIn, press releases, government directories |
| 32 | **C-level exec past** (CEO/CFO/CIO) | Crunchbase, SEC filings |
| 33 | **University teaching position** | university faculty page |
| 34 | **Years in industry** (≥10 yrs — весомый signal) | LinkedIn work history |

### 🌐 Уровень 6 — Digital presence depth

| # | Характеристика | Источник |
|---|---|---|
| 35 | **Own authored domain** (`lastname.com` owned и active 5+ лет) | WHOIS + Wayback continuity |
| 36 | **LinkedIn Verified badge** | LinkedIn profile icon |
| 37 | **Google Knowledge Panel** (Google знает кто вы) | Google search — есть ли sidebar |
| 38 | **ORCID iD** | orcid.org |
| 39 | **Schema.org sameAs links** (consistent identity across platforms) | site HTML/JSON-LD |
| 40 | **Wayback archive depth** (personal site exists >5 yrs) | web.archive.org |

### 🔬 Уровень 7 — Original contributions

| # | Характеристика | Источник |
|---|---|---|
| 41 | **Original research / data studies** (publish unique datasets) | author's own publications |
| 42 | **Open-source code contributions** (quant/fintech) | GitHub |
| 43 | **Financial models / Excel / Python templates** | personal site |
| 44 | **Keynote videos с >10K views** | YouTube, Vimeo |

### ⚠️ Negative signals (anti-E-E-A-T)

| # | Signal | Что означает |
|---|---|---|
| N1 | No online presence | pseudonym / AI-generated content risk |
| N2 | Gaps in employment | red flag |
| N3 | Disciplinary actions (FINRA/SEC) | critical — Google пессимизирует |
| N4 | Associated with scams (SEC enforcement) | disqualifier |
| N5 | Pseudonymous (только first name) | не проходит Google identity check |
| N6 | Inconsistent biographies across outlets | not a real person |
| N7 | Bankruptcy history (finance-specific) | trust issue |

---

## 3. Матрица verifiability / automation

| Характеристика | Verifiable? | Auto? | Cost | Value |
|---|:---:|:---:|---|:---:|
| CFA / CFP / CPA / FRM / CAIA / CMT | 🟢 реестр | ✅ search API | 🟢 free | ⭐⭐⭐ |
| FINRA Series licenses | 🟢 BrokerCheck | ✅ public JSON API | 🟢 free | ⭐⭐⭐ |
| SEC RIA | 🟢 IAPD | ✅ public | 🟢 free | ⭐⭐⭐ |
| NFA / CTA | 🟢 BASIC | ✅ public | 🟢 free | ⭐⭐⭐ |
| Academic degree | 🟡 LinkedIn self-report | ✅ из bio regex | 🟢 free | ⭐⭐ |
| PhD thesis | 🟢 ProQuest | ⚠️ paid API | 🟠 $ | ⭐ |
| Google Scholar h-index | 🟢 public | ✅ search + parse | 🟢 free | ⭐⭐ |
| Books (ISBN) | 🟢 LoC | ✅ Amazon search | 🟢 free | ⭐⭐ |
| Muck Rack article count | 🟢 | ✅ scrape из профиля | 🟢 free | ⭐⭐⭐ |
| Quoted in tier-1 press | 🟡 Muck Rack | ⚠️ paid tier | 🟠 $ | ⭐⭐ |
| TV appearances | 🟡 YouTube search | ⚠️ manual-ish | 🟠 medium | ⭐⭐ |
| Industry awards | 🟡 event pages | ⚠️ manual search | 🟠 medium | ⭐⭐⭐ |
| Cross-ref с competitor refdomains | 🟢 мы владеем данными | ✅ **уже в репо** | 🟢 free | ⭐⭐⭐ |
| Wikipedia entry | 🟢 | ✅ search | 🟢 free | ⭐ (rare) |
| Own domain | 🟢 WHOIS | ✅ lookup | 🟢 free | ⭐⭐ |
| LinkedIn verified | 🟢 | ✅ scrape | 🟢 free | ⭐ (новая фича) |
| Google Knowledge Panel | 🟢 SERP | ✅ search parse | 🟢 free | ⭐⭐⭐ |
| Years in industry | 🟡 bio | ✅ regex parse | 🟢 free | ⭐⭐ |
| Employment pedigree | 🟡 LinkedIn | ✅ bio extract | 🟢 free | ⭐⭐ |
| Disciplinary history | 🟢 BrokerCheck | ✅ если FINRA-registered | 🟢 free | ⭐⭐⭐ (negative filter) |

**Итог**: ~70% характеристик автоматизируется бесплатно через search/scrape/existing data.

---

## 4. Расширение schema автора — 7 новых секций

Поверх того, что уже есть:

```js
{
  // ...existing fields (name, role, site, badge, seniority, writesFor, score)...

  // ═══ E-E-A-T MVP (дешёвые сигналы, Pass 1) ═══

  certifications: [
    { name: "CFA", issuer: "CFA Institute", verified: false, verifyUrl: null },
    { name: "Series 7", issuer: "FINRA", verified: false, crd: null },
  ],
  // verified: true только если мы реально сверили с реестром
  // Pass 1 extracts имена из bio regex; Pass 2 верифицирует через реестр

  education: [
    { degree: "MSc Finance", school: "CEU Budapest", year: null },
  ],

  employmentHistory: [
    { role: "Senior Correspondent", org: "Bloomberg", years: "2010-2020" },
    { role: "Head of Analyst Team", org: "BrokerChooser", years: "2018-present" },
  ],
  yearsInIndustry: 20,  // derived

  // ═══ Citation & media signals (Pass 2) ═══

  mediaSignals: {
    muckrackArticleCount: 247,    // parse from muckrack.com/{handle}
    tvAppearances: ["CNBC", "Fox Business"],  // detected in bio
    hasKnowledgePanel: true,      // SERP check for "{name} {outlet}"
    authoredBooks: [{ isbn: "978-...", title: "Resilience" }],
  },

  // ═══ Citation graph (Pass 1, free through existing CSV) ═══

  citationSignals: {
    citedByCompetitors: 34,       // пересечение с 122K refdomain CSV
    quotedInTier1: ["WSJ", "FT"], // detected "as seen in" / "quoted in"
    googleScholarHIndex: null,    // optional Pass 2
  },

  // ═══ Trust signals ═══

  trustSignals: {
    ownedDomain: "twcarey.com",   // WHOIS + Wayback age
    linkedinVerified: true,
    finraBrokerCheckStatus: "clean",  // null | clean | disciplinary
    schemaOrgSameAs: ["linkedin...", "twitter..."],  // consistent identity
  },

  // ═══ Authoritativeness composite ═══

  authoritativenessScore: 42,   // 0-50, computed (см. раздел 5)
  eeatTier: "A",                // S | A | B | C — derived
}
```

---

## 5. Authoritativeness Multiplier — новая компонента score

Текущий `outreachScore` (0-100) оценивает **как легко дотянуться до автора** (DR + seniority + reachability).

Добавляем **`authoritativenessScore` (0-50)** — **как ценен backlink от этого автора для SEO**.

```
authoritativeness = (certifications.length × 8)                 // каждый unfakeable cert +8
                  + (yearsInIndustry >= 15 ? 10 : yearsInIndustry/1.5)
                  + (muckrackArticleCount >= 100 ? 8 : count/15)
                  + (citedByCompetitors >= 10 ? 10 : count)
                  + (hasKnowledgePanel ? 10 : 0)
                  + (authoredBooks.length >= 1 ? 5 : 0)
                  + (ownedDomain ? 3 : 0)
                  + (finraBrokerCheckStatus === "clean" ? 5 : 0)
                  + (quotedInTier1.length × 3)
                  → clamp 0-50

finalScore = outreachScore × (1 + authoritativeness / 100)
```

Эффект: автор с full E-E-A-T (authoritativeness=50) получает **×1.5 boost** к score. Низкий E-E-A-T = score без boost'а.

**Tier derivation от authoritativeness**:
- 40-50 → Tier S (Google-ideal author)
- 25-39 → Tier A (verifiable expert)
- 12-24 → Tier B (опыт есть, verifiability средняя)
- 0-11 → Tier C (generic staff writer)

---

## 6. Портреты идеальных целей — 4 tier'а

### 🥇 Tier S — «Google loves this person»
**Checklist**:
- [ ] CFA / CFP / CPA (1+) + PhD или MBA top-tier
- [ ] 15+ лет в индустрии
- [ ] Работал в GS / JPM / BlackRock / SEC / регулятор
- [ ] Muck Rack: 500+ статей
- [ ] Quoted in WSJ / FT / Bloomberg
- [ ] Книги на Amazon
- [ ] Google Knowledge Panel существует
- [ ] Own domain + Wayback >5 yrs
- [ ] Wikipedia entry

**Ценность backlink**: $3,000-10,000 equivalent link value.

**Примеры из наших 34**:
- **Steven Hatzakis** (ForexBrokers.com) — Series III CTA, 25+ yrs FX, 1000+ articles, quoted in FT/Bloomberg, own domain `stevenhatzakis.com`, Muck Rack professional profile, referenced by competitors. Tier S confirmed.
- **Theresa W. Carey** — 19 annual Barron's broker reviews, multi-outlet (Barron's + Investopedia + PCMag + BrokerChooser), Authory profile, Muck Rack. Tier S.

### 🥈 Tier A — «Верифицируемый expert»
**Checklist**:
- [ ] 1-2 сертификата (CFA, Series license, CTA)
- [ ] 10+ лет в финансах
- [ ] Past role в регулируемой firm
- [ ] Muck Rack 100+ articles
- [ ] Цитируется в tier-2 media
- [ ] LinkedIn с полной историей
- [ ] Bio с education + employment

**Ценность backlink**: $500-2,000.

**Примеры**:
- **Adam Nasli** (BrokerChooser) — 10+ yrs, FT/Bloomberg quotes, CEU instructor, LinkedIn + Muck Rack.
- **Edith Balázs** — 25 yrs, Bloomberg + Dow Jones past, MA American Studies. Cross-outlet with Bloomberg author page.
- **Helen Partz** (Cointelegraph) — 8 yrs crypto reporting, email + Twitter + LinkedIn + Muck Rack all confirmed.

### 🥉 Tier B — «Опыт есть, но verifiability средняя»
**Checklist**:
- [ ] Bio говорит про опыт, но сертификатов не видно
- [ ] Немного цитирований
- [ ] LinkedIn есть, но не глубокий
- [ ] Нет domain / Knowledge Panel

**Ценность backlink**: $200-500.

### ⚪ Tier C — «Staff writer без специализации»
- Journalist без финансового образования
- No сертификатов
- <5 yrs в индустрии
- Generic bio

**Ценность backlink**: $50-200 (уровень генерик guest post).

---

## 7. E-E-A-T на НАШЕМ сайте — как мы сигналим Google

Параллельно outreach'у мы должны ПОКАЗАТЬ Google, что наши собственные авторы проходят E-E-A-T.

### Schema.org Person markup на странице каждого автора

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Marcus Chen",
  "jobTitle": "Senior Broker Analyst",
  "worksFor": { "@type": "Organization", "name": "RatedBrokers" },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Certification",
      "name": "CFA",
      "recognizedBy": { "@type": "Organization", "name": "CFA Institute" }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "License",
      "name": "Series 7",
      "recognizedBy": { "@type": "Organization", "name": "FINRA" }
    }
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "University of Pennsylvania — Wharton"
  },
  "knowsAbout": ["Forex trading", "ECN execution", "Broker regulation"],
  "sameAs": [
    "https://www.linkedin.com/in/marcus-chen",
    "https://twitter.com/marcuschen",
    "https://orcid.org/0000-0000-0000-0000"
  ]
}
</script>
```

### Visible trust signals

- Фото автора (реальное, не stock)
- Bio с годом первой публикации (longevity signal)
- Ссылка на LinkedIn/Twitter в теле bio (schema.org `sameAs`)
- «Reviewed by {expert name}» badge на review-страницах
- Fact-check line внизу статьи
- Last updated дата с историей правок

### На странице /about/team

- Editorial process explanation
- Conflicts of interest disclosure
- Review methodology ссылка
- Editorial standards documentation (уже есть через методологию)

---

## 8. Sprint strategy — когда собирать E-E-A-T

**Рекомендация: Hybrid Two-Pass**

### Pass 1 (в основном спринте, вместе со всеми остальными данными)

Собираем **дешёвые сигналы** — те, что уже лежат в bio / LinkedIn / Muck Rack, которые мы и так фетчим:

| Pass 1 field | Откуда | Cost |
|---|---|---|
| `certifications[]` (имена) | regex по bio: `/\b(CFA|CFP|CPA|CMT|FRM|CAIA|CTA|Series\s*\d+)\b/` | 0 (часть bio parsing) |
| `education[]` | regex по bio: universities, degrees | 0 |
| `employmentHistory[]` | regex + LinkedIn parse | 0 |
| `yearsInIndustry` | «10+ years» / «since 2017» parse | 0 |
| `muckrackArticleCount` | уже есть URL профиля → +1 WebFetch | минимально |
| `citedByCompetitors` | cross-ref с 122K CSV (уже в репо) | 0 |
| `ownedDomain` | detect из bio / sameAs | 0 |
| `hasKnowledgePanel` | SERP check 1 query на автора | 1 WebSearch |

**Стоимость Pass 1**: +2-3 WebSearch'а на автора → **+1500 queries на 500 авторов**. Увеличение основного спринта на ~30%, но это **разово**.

### Pass 2 (отдельный мини-спринт, ТОЛЬКО для top targets)

После основного спринта фильтруем по `outreachScore >= 50` или `seniority ∈ [chief, editor, senior]` → получаем ~100-150 targets. Для них делаем **deep E-E-A-T enrichment**:

| Pass 2 field | Источник | Cost per author |
|---|---|---|
| Verify certifications в реестрах | CFA Institute API, FINRA BrokerCheck | 2-3 checks |
| `googleScholarHIndex` | scholar.google.com | 1 query |
| `authoredBooks` | Amazon author page | 1-2 queries |
| `quotedInTier1` | Google News «{name}» WSJ OR Bloomberg OR FT | 1 query |
| `finraBrokerCheckStatus` | brokercheck.finra.org JSON | 1 API call |
| Industry awards | «{name} Barron's award» / «{name} SABEW» | 2 queries |
| `hasKnowledgePanel` (confirm) | manual check | 0 |

**Стоимость Pass 2**: ~8 queries на автора × 150 authors = **1200 queries**, ~2-3ч работы.

### Почему НЕ single pass (всё сразу)

- 500 авторов × 10 E-E-A-T queries = 5000 queries. Rate limit Google + WebSearch квота = проблема.
- 80% авторов (Tier C/B) не получат outreach в ближайший квартал — не нужно тратить queries.
- Top 100-150 authors — вот где реальный ROI. Deep enrichment для них.

### Почему НЕ single pass «сначала всех, потом фильтруем»

- Без Pass 1 сигналов мы не можем корректно scorить. Нужны хотя бы cheap signals в основном спринте.

### Почему Hybrid лучший

- Pass 1 добавляет 30% к основному сприну, но даёт полноценный score для всех 500
- Pass 2 концентрирует deep работу на 20-30% авторов, где реальная ценность
- Total cost: 30% overhead в Pass 1 + 2-3ч в Pass 2 = **приемлемо**

---

## 9. Сроки и зависимости

| Step | Зависит от | Est |
|---|---|---|
| Расширить schema (+7 полей) | — | 30 min |
| Pass 1 bio/regex enrichment (автомат) | Schema готова | +20% к основному спринту |
| Pass 1 cross-ref 122K CSV (автомат) | 122K CSV (уже есть) | 30 min coding |
| Update score formula (+authoritativeness) | schema | 15 min |
| Update UI (show eeatTier, certifications chips) | data | 1ч |
| Pass 2 mini-sprint для top-150 | основной спринт завершён | 2-3ч |
| E-E-A-T Schema.org на наших author pages | — (independent work) | 1-2ч |

---

## 10. Что даёт нам это как проект

1. **Outreach efficiency**: понимаем, к кому стоит обращаться в первую очередь (Tier S >> Tier C)
2. **Expected backlink ROI per author** — вместо абстрактного score имеем denomination в $
3. **Our own E-E-A-T**: правильный schema.org + transparent credentials у наших reviewer'ов = Google доверяет нашему контенту больше
4. **Filter criteria for hiring**: когда нанимаем своих авторов, используем эту таксономию как checklist
5. **Long-term asset**: E-E-A-T criteria — не про один спринт, это система оценки, которая живёт годами

---

## 11. Historical note — что НЕ делаем

- **Paid API для BrokerCheck** — есть бесплатный scrape через search form, достаточно
- **Proxycurl / Clearbit / Hunter** пока не подключаем (платно) — отложено до подтверждения ROI через первую волну outreach
- **Manual researching** для Tier S вручную (каждого найденного): Wikipedia entry, TV archives — тратим время только на очевидно-топовых кандидатов

---

## Связанные документы

- `AUTHORS-HARVESTING-PLAYBOOK.md` — методология сбора (КАК)
- `AHREFS-DATA-LOG.md` — outlet DR + 122K refdomain CSV (ИСТОЧНИК)
- `memory/bill.md` — SEO strategist agent (КОНСУЛЬТАНТ)
- `src/data/authorsSample.js` — MVP dataset (34 authors)
- `src/pages/AuthorsResearchPage.jsx` — UI (ПОКАЗ)

---

*E-E-A-T — это не опция, это билет в выдачу Google для YMYL-контента. Broker reviews = самый YMYL контент в интернете. Кто не проходит E-E-A-T — того Google просто не показывает.*

# Author Page — SEO & E-E-A-T Strategy

Автор: Билл (SEO & Affiliate Strategist)
Дата: 2026-04-16
Статус: стратегия (код не трогаю)
Файлы для изменений: `src/pages/AuthorPage.jsx`, `src/data/authors.js`

---

## 1. Роль author page в общей SEO-стратегии

Author page — это **не трафиковая страница**, а **инфраструктурный trust-asset**. Она почти не приносит прямого органического трафика (поиск по имени аналитика в нише брокеров — мизерный объём, 10-50/мес на лучший сценарий), но выполняет **четыре системные функции**, каждая из которых конвертируется в деньги через другие страницы:

1. **E-E-A-T сигнал для Google** — Google Quality Rater Guidelines прямо требуют «About the author» с проверяемыми credentials для YMYL-контента (Your Money, Your Life). Финансовые брокеры = YMYL. Без полноценных author pages все broker reviews и rankings систематически недобирают ранжирование. Это **мультипликатор** на 300+ страницах контента.
2. **Sink для external authority** — на author page ведут ссылки с CFA Institute verification, LinkedIn, гостевых публикаций, подкастов. Эти ссылки усиливают domain-level trust и через internal linking качают broker reviews.
3. **Citability hub для medium-term link building** — журналисты Bloomberg/Reuters/FT ищут экспертов через Google «[topic] expert forex». Если author page грамотно оптимизирована под `[name] + expertise` — получаем бесплатные высококачественные бэклинки из tier-1 медиа (паттерн, который эксплуатирует BrokerChooser: их Adam Nasli регулярно цитируется в FT и Bloomberg).
4. **Conversion-trust для пользователя на review pages** — byline «Reviewed by Marcus Chen, CMT (14 yrs)» → клик по имени → author page с credentials, media mentions, методологией → возвращение к CTA с повышенным доверием. Это измеримый lift на conversion rate (~5-10% по отраслевым данным NerdWallet/Bankrate).

**Вывод**: author page = **force multiplier на весь контент**, а не самостоятельная трафиковая единица. Инвестиция в неё = инвестиция в потолок ранжирования всего сайта.

---

## 2. Полный список блоков (в порядке рендера)

| # | Блок | Цель | Приоритет | Что внутри |
|---|------|------|-----------|------------|
| 1 | **Breadcrumbs** | Navigation/SEO | HIGH | Home › Editorial Team › {Name} |
| 2 | **Hero (Identity)** | E-E-A-T | HIGH | Фото 120px, H1 `{Name}, {Credentials}`, job title, 2-3 pill-бейджа с credentials, LinkedIn + X ссылки, короткий tagline (1 строка) |
| 3 | **Trust Strip (stats row)** | E-E-A-T + конверсия | HIGH | 4 метрики: Years Experience, Broker Reviews Authored, Years at RatedBrokers, Credential (CFA/CMT/CAIA). Квадратные тайлы, brand navy+orange, без пастельных фиолетовых/синих chip-ов (см. DESIGN-ANTIPATTERNS) |
| 4 | **As Featured In / Quoted By** | E-E-A-T + link magnet | HIGH (когда будут данные) | Логотипная полоса: Bloomberg, Reuters, FT, WSJ, Forbes, Business Insider. Каждый логотип — ссылка на саму публикацию с цитатой (nofollow разрешён, Google читает sameAs/about из структуры) |
| 5 | **About (expanded bio)** | E-E-A-T | HIGH | 200-400 слов. Не маркетинговый текст. История: где учился, где работал, чем занимается сейчас, почему Rated Brokers. Факты, цифры, имена институций — алгоритм Google любит entity-density |
| 6 | **Credentials & Verification** | E-E-A-T (critical) | HIGH | Каждый credential — **отдельная карточка** с кликабельной ссылкой на реестр (CFA Institute, CMT Association, FINRA BrokerCheck, CAIA). Принцип — тот же, что на License Verification Links на review pages (коммит `bb01e87`). Номер cert + год выдачи + «Verify →» |
| 7 | **Areas of Expertise** | SEO (knowsAbout) + интенты | HIGH | 4-8 tag-чипов: Forex Execution, ECN/STP, Spread Analysis, Algo Infrastructure и т.д. Каждый tag — ссылка на `/experts/{topic}` хаб (новая URL-структура, см. §4) или на соответствующий ranking |
| 8 | **How I Review Brokers (methodology)** | E-E-A-T + differentiation | HIGH | 3-5 абзацев от первого лица. Описывает: real-money testing, data points, проверки regulation, личные priority trade-offs. Главный уникальный контент автора — то, что отличает Marcus от Sarah от Elena. Google видит уникальность между author pages, а не копии. |
| 9 | **Signature Take / Author's Top Pick** | Конверсия + E-E-A-T | MED | 1-2 броkera с мини-карточками (brand-orange CTA, стандарт D2k). «Marcus's current best pick for ECN traders: Pepperstone» + 50 слов обоснования. Даёт link juice конкретным обзорам автора + показывает opinion (experience signal). |
| 10 | **Recent Work / Published Articles** | E-E-A-T + internal linking | HIGH | Динамический список последних 10-20 статей/ревью/рейтингов, сортировка по дате. С превью, reading time, категорией. Именно этот блок Егор называет «Recent work». Каждая карточка — internal link |
| 11 | **Media Mentions (quotes)** | E-E-A-T + link magnet | MED (когда будут данные) | Отличается от блока #4: блок #4 = логотипная полоса; блок #11 = цитаты с контекстом («"Marcus Chen told Bloomberg that..." → Link to Bloomberg article, Feb 2026»). Если цитат нет — блок скрывается |
| 12 | **Speaking Engagements / Podcasts** | E-E-A-T (Hatzakis-паттерн) | LOW | Выступления на конференциях (Finance Magnates, iFX Expo), гостевые в подкастах. Список с датами и ссылками |
| 13 | **Peer Review Chain** | E-E-A-T (editorial integrity) | HIGH | То что уже есть: «Reviewed by Elena Petrova» + «Fact-checked by David Kowalski» с аватарками и ссылками на их author pages. Расширить: добавить «Edited by Sarah Williams» для полной tripartite byline (ForexBrokers.com паттерн) |
| 14 | **Editorial Philosophy Quote** | Brand + E-E-A-T | MED | Pull-quote от автора на тёмном фоне (Premium Dark — «якорь» секции). «I only recommend brokers I'd trust with my own capital. — Marcus». Personal, не маркетинговый |
| 15 | **Contact / Pitch** | Link building | MED | «Journalists: pitch Marcus for forex/execution quotes → email» + «Speaking inquiries» link. Привлекает incoming media inquiries, что генерирует новые ссылки в блок #11 |
| 16 | **Disclaimer / Editorial Independence** | E-E-A-T (trust) | HIGH | Короткий блок: «Marcus never accepts payment from brokers. Rated Brokers earns affiliate commissions when you click Visit, but this does not influence rankings.» ~80 слов. Подписан editor-in-chief |
| 17 | **Anti-Impersonation Note** | Защита от скама (опц.) | LOW | Только для публичных фигур: «Official accounts: LinkedIn, X. Any other account claiming to be Marcus is a scam.» Паттерн Hatzakis |
| 18 | **Related Experts** | Internal linking | MED | 3-4 карточки других авторов команды + link на полную страницу `/about` |
| 19 | **Footer CTA** | Конверсия | LOW | «Explore Marcus's top-rated forex brokers →» → ведёт на `/best-forex-brokers` с UTM `?from=author-marcus` (трекать влияние author pages на клики) |

### Блоки которые НЕ делать

- Пастельные фиолетовые chips для credentials (сейчас `rgba(139,92,246,0.15)` в hero) — нарушает DESIGN-ANTIPATTERNS. Заменить на brand-orange или neutral dark.
- Социальные счётчики (followers count) — уже была S7 cleanup по 43 hallucinated follower counts. Не возвращать.
- «Articles read X million times» без пруфа — только если Plausible/GA подтверждает.
- Таймлайн карьеры в виде дерева — Егору не нравятся перегруженные декоративные элементы.
- Радужные категории экспертизы (зел/син/фиолет per topic) — все chips в едином brand-style (см. Country Section Green Uniform, коммит `df6e8b8`).

---

## 3. Schema.org — полный JSON-LD

Сейчас в AuthorPage.jsx генерится базовый Person. Расширяем до полной E-E-A-T обвязки:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://ratedbrokers.com/author/marcus-chen#person",
  "name": "Marcus Chen",
  "givenName": "Marcus",
  "familyName": "Chen",
  "honorificSuffix": "CMT",
  "jobTitle": "Senior Forex Analyst",
  "description": "Marcus has analyzed over 80 forex brokers since 2012...",
  "image": {
    "@type": "ImageObject",
    "url": "https://ratedbrokers.com/authors/marcus-chen.webp",
    "width": 400,
    "height": 400
  },
  "url": "https://ratedbrokers.com/author/marcus-chen",
  "mainEntityOfPage": "https://ratedbrokers.com/author/marcus-chen",

  "sameAs": [
    "https://linkedin.com/in/marcus-chen-forex",
    "https://x.com/marcuschen_fx",
    "https://muckrack.com/marcus-chen",
    "https://www.bloomberg.com/news/articles/2026-01-15/...",
    "https://www.reuters.com/markets/...",
    "https://credentials.cmtassociation.org/...",
    "https://brokercheck.finra.org/individual/summary/..."
  ],

  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Certification",
      "name": "Chartered Market Technician",
      "recognizedBy": {
        "@type": "Organization",
        "name": "CMT Association",
        "url": "https://cmtassociation.org"
      },
      "identifier": "CMT-xxxxxx",
      "dateCreated": "2016"
    }
  ],

  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "London School of Economics",
      "url": "https://lse.ac.uk"
    }
  ],

  "worksFor": {
    "@type": "Organization",
    "@id": "https://ratedbrokers.com#organization",
    "name": "RatedBrokers",
    "url": "https://ratedbrokers.com"
  },

  "knowsAbout": [
    "Foreign Exchange Markets",
    "ECN Execution",
    "Spread Analysis",
    "Broker Regulation",
    "CFD Trading",
    "Forex Broker Comparison"
  ],

  "knowsLanguage": ["en", "ru"],

  "award": [
    "14 years of industry experience",
    "Former prop trader — London",
    "87 published broker reviews"
  ],

  "subjectOf": [
    {
      "@type": "Article",
      "headline": "How forex execution affects retail traders",
      "url": "https://www.bloomberg.com/...",
      "datePublished": "2026-01-15",
      "publisher": { "@type": "Organization", "name": "Bloomberg" }
    }
  ]
}
```

**Связь со страницами**: в schema.org **каждого** broker review и ranking page менять `author` на `{"@id": "https://ratedbrokers.com/author/marcus-chen#person"}` — это создаёт граф, который Google использует как entity model. Сейчас автор передаётся плоским объектом — упускаем entity reuse.

**Organization schema (главная)**: добавить `founder: {"@id": ".../yegor-barakovskiy#person"}` + `employee: [...]` со ссылками на всех авторов. Это закрывает круг: Organization → Person → Articles → back to Organization.

**Что НЕ использовать**: `Review` schema на author page (это не review), `Article` для самой author page (это Person profile). Не смешивать типы.

---

## 4. Keyword strategy

### Что реалистично ранжировать

| Запрос | Объём | Стратегия |
|--------|-------|-----------|
| `marcus chen forex analyst` | 10-30/мес | Brand, рангуется автоматически если page оптимизирована |
| `marcus chen rated brokers` | 5-20/мес | Brand, та же история |
| `cmt forex analyst` | 50-200/мес | Боремся, если блок expertise + методология покрывают ключи |
| `who reviews forex brokers at ratedbrokers` | низкий | Long-tail trust query |

**Итого**: ожидания по трафику на author page — **50-500/мес с 5 авторов суммарно**. Это не деньги, но это **качественный** трафик (журналисты + B2B).

### Что оставить только для E-E-A-T (без попыток ранжирования)

- Generic запросы «best forex broker» — автор page не ранжируется, не пытаемся. Эти запросы берут ranking/review страницы через authorship signal.
- «Forex execution explained» — не писать educational контент на author page. Это отдельная категория `/learn/`, где автор — byline, но страница — другой type.

### Title tag формула

**Текущая**: `Marcus Chen — Senior Forex Analyst | RatedBrokers` (44 симв) — OK но пустая.

**Рекомендуемая**: `Marcus Chen, CMT — Forex Analyst & Broker Reviewer | Rated Brokers` (64 симв) — добавляем credentials + функциональную роль для bigger keyword surface.

### Meta description формула

**Текущая**: `{Name} is a {role} at RatedBrokers with {exp} of experience. {specialty}.` — шаблонная.

**Рекомендуемая**: `{Name}, {credentials}, has reviewed {N}+ brokers over {years} years. Former {prev-role}. Specializes in {specialty}. Quoted in {top media}.` — CTR up, entity density up.

### H1 паттерн

**Сейчас**: `{Name}` + role subtitle.

**Рекомендуемый**: `{Name}, {credentials}` как единый H1, role — в H2. Это делает credentials ключом в H1 (CMT, CFA видны Google как часть главного тега).

---

## 5. Анализ конкурентов

### ForexBrokers.com / Steven Hatzakis (эталон)

- Hero: фото + job title + LinkedIn/X сразу в верхней части
- **1000+ articles** упоминание как authority signal
- **Specific credentials**: Series III, Commodity Trading Advisor — не размытые
- **Speaking engagements** — панели (Finance Magnates London, Cyprus Forex Summit), подкасты (Interactive Brokers Podcasts Episode 245, 228) с датами и ссылками
- **Featured In**: Bloomberg (2025), FXStreet, Bitcoin.com, TheStreet, Alabama Law Review
- **Anti-impersonation** дисклеймер — защита от скама + показывает, что автор — публичная фигура
- **Latest articles** — пагинированный список, 10 на страницу, 17 страниц (170 статей)
- **Footer trust**: BBB + B Corp badges (на уровне сайта)

**Что взять**: speaking engagements блок, anti-impersonation нотис, длинный список recent articles с пагинацией, конкретика credentials (не «CMT», а «CMT since 2016 — CMT Association»).

### StockBrokers.com / Blain Reinkensmeyer

- **Founder story**: «started as personal blog in 2007» → «20 million reads over a decade» — нарратив, а не список фактов
- **Early recognition**: «Crain's Detroit Business Top 20 in 20s, 2009» — old but credible
- **Personal touch**: женат, дети, хоккей. Не обязательно, но показывает «real person» — Google E-E-A-T guidelines упоминают authenticity
- **Cross-property links**: связан с ForexBrokers.com, investor.com — показывает authority в рамках media group

**Что взять для Yegor (Founder case)**: ту же структуру — founder story, нарратив, early recognition, personal paragraph.

### Bankrate / James Royal, Ph.D.

- **Credentials в имени**: `James Royal, Ph.D.` — credential прямо в H1
- **Expertise tags**: Investing, Wealth management, Behavioral finance, Stock analysis (4 чистых тега)
- **Education блок**: 3 степени University of Florida, перечислены
- **Featured In**: CNBC, Washington Post, NYT, CNN International, AP, ABC, Yahoo, Forbes, Barron's, KUTV — **10 outlets**, в стиле логотип-полосы
- **Books**: упоминает свои книги (*The Zen of Thrift Conversions*, *Options Trading 101*) — это citation surface
- **Quirky detail**: «Has appeared on Jeopardy» — показывает human side

**Что взять**: credential suffix в H1, expertise tags (4-5 штук, не больше), education блок как отдельная секция, featured-in как логотип-полоса.

### BestBrokers / Eugene Lee, CFA

- **Прямая ссылка на CFA Institute verification**: `credentials.cfainstitute.org/54800944-5857-4ebf-9ffe-ecd57e54c8ac` — **главная находка для RatedBrokers**. Это максимально прямой E-E-A-T signal: один клик до живой проверки
- Минус: нет recent articles, нет media mentions — страница пустовата

**Что взять**: кликабельная верификация credential (CFA Institute search, CMT Association lookup, FINRA BrokerCheck).

### BrokerChooser / Adam Nasli

- По данным search: цитируется в FT и Bloomberg регулярно
- Team page — отдельная `/team/analysts-editors` + индивидуальные `/team/{slug}`
- **Уровень команды как signal**: «members previously worked at Bloomberg, Citibank, Deloitte, Dow Jones, Ernst & Young, Morgan Stanley, S&P Global» — prev employers как блок

**Что взять**: previous employers как explicit trust block («Formerly at...»).

### Investopedia / Thomas Brock (через Annuity.org / Bankrate)

- **Video introduction** — 46-секундное видео «Who Are You and What Do You Do?»
- **Financial Review Board** — отдельная страница на Investopedia со всеми reviewers
- **Expertise**: 6 areas (accounting, corporate finance, crypto, financial consulting, insurance, investments)
- **Portfolio size**: «$4 billion portfolio for an insurance group» — конкретная цифра как credibility

**Что взять**: для Yegor — 30-60 сек video intro (когда будет готово); Editorial Team page (у нас уже есть `/about`, но можно апгрейднуть до уровня Financial Review Board).

### Сводная таблица — что из эталонов интегрируем

| Конкурент | Главная фишка | Интегрируем |
|-----------|---------------|-------------|
| ForexBrokers.com | Speaking engagements + anti-impersonation | HIGH |
| StockBrokers.com | Founder narrative | HIGH (для Yegor) |
| Bankrate | Credential в H1 + media logo strip | HIGH |
| BestBrokers | Clickable credential verification | CRITICAL |
| BrokerChooser | Previous employers block | MED |
| Investopedia | Video intro + Review Board page | MED (long-term) |

---

## 6. Founder case vs Analyst case

### Analyst case (Marcus, Sarah, Elena, David)

**Шаблон**: hero → trust strip (years/reviews/credential) → as featured in → bio → credentials & verification → expertise → methodology → signature take → recent work → peer review chain → disclaimer.

**Акценты**:
- Конкретные credentials (CFA/CMT/CAIA/CAMS) с верификацией
- Количественные показатели (87 reviews, 130 data points)
- Previous employer (London prop desk, Morgan Stanley, etc.)
- Specialty — узкая (ECN execution, algo trading)

### Founder case (Yegor)

**Проблема**: 0 reviews, без CFA/CMT, специализация — «Editorial Strategy» (абстрактная).

**Решение — перевернуть шаблон**:

| Компонент | Чем заменить |
|-----------|--------------|
| ~~Trust strip с reviews~~ | **Platform stats**: «52 brokers covered», «293 rankings», «5 analysts hired», «Since 2024» |
| ~~Credentials (CFA)~~ | **Founder statement**: «10+ years trading own capital in forex & equities. Built RatedBrokers to fix what I saw broken in existing broker-comparison sites.» |
| ~~Methodology~~ | **Editorial Philosophy** — 400-600 слов, signature long-form. Почему knockout без Tier-1, почему real-money testing, почему 0 ads influence. Это главный контент страницы. |
| ~~Recent reviews~~ | **Platform milestones / changelog**: M1 launched, M3 added stocks vertical, M5 will add prop firms. Timeline-формат но без декоративного дерева |
| ~~Specialty tags~~ | **What I oversee**: Editorial strategy, Methodology, Broker partnerships, Hiring. Функциональные, не тематические |
| Peer review chain | Оставить, но на Founder странице = «Accountability chain»: Yegor → Sarah (editor) → David (fact-check) |
| Media mentions | Возможно — LinkedIn статьи, гостевые посты (пока нет — скрыть блок, не делать mock) |
| CTA | «Pitch a broker partnership» + «Apply to join editorial team» (скаут для расширения команды) |

**Ключевая установка для Yegor**: authority через **accountability и prolificity platform**, не через credentials. Нарратив «Я построил X, чтобы решить Y». Hatzakis/Reinkensmeyer — лучшие эталоны founder-нарратива.

**Video intro** (long-term, M5+): 45-60 сек «Why I built RatedBrokers». Это единственный контент, который нельзя подделать AI — прямой E-E-A-T signal.

---

## 7. Данные для сбора — расширение `authors.js`

Текущий shape — минимальный. Расширяем:

```js
{
  id: "marcus-chen",
  name: "Marcus Chen",
  honorificSuffix: "CMT",                    // новое, для H1
  role: "Senior Forex Analyst",
  tagline: "14 years of forex execution analysis",  // новое, под H1
  initials: "MC",
  image: "/authors/marcus-chen.webp",
  imageAlt: "Marcus Chen, CMT — Senior Forex Analyst at RatedBrokers",

  exp: "14 years",
  expStarted: 2012,                          // новое, для корректных calc

  linkedin: "https://linkedin.com/in/marcus-chen-forex",
  twitter: "https://x.com/marcuschen_fx",
  email: "marcus@ratedbrokers.com",          // новое (опц), для pitch block
  muckrack: "https://muckrack.com/...",      // новое, journalist platform
  personalSite: null,                        // новое (опц)

  credentials: [
    {
      code: "CMT",
      fullName: "Chartered Market Technician",
      issuer: "CMT Association",
      issuerUrl: "https://cmtassociation.org",
      verifyUrl: "https://credentials.cmtassociation.org/profile/xxx",
      year: 2016
    }
  ],

  education: [                               // новое
    {
      degree: "MSc Finance",
      institution: "London School of Economics",
      institutionUrl: "https://lse.ac.uk",
      year: 2011
    }
  ],

  previousEmployers: [                       // новое, trust signal
    { name: "Citadel Securities", role: "Junior prop trader", years: "2012-2015" },
    { name: "GKFX London", role: "Execution analyst", years: "2015-2019" }
  ],

  expertise: [                               // новое (раньше specialty string)
    "ECN/STP Execution",
    "Spread Analysis",
    "Forex Regulation",
    "CFD Markets"
  ],

  languages: ["en"],                         // новое, для knowsLanguage schema

  bio: "...",          // оставить — короткий 2-3 строки
  longBio: "...",      // новое — 200-400 слов, под блок About
  methodology: "...",  // новое — 300-500 слов «How I Review Brokers»
  philosophy: "..."    // новое (опц) — pull-quote

  reviews: 87,
  reviewsLastUpdated: "2026-04-15",          // новое
  yearsAtRatedBrokers: 2,                    // новое, computed или manual

  mediaMentions: [                           // новое — ключевой блок
    {
      outlet: "Bloomberg",
      outletLogo: "/media/bloomberg.svg",
      articleTitle: "Retail forex traders face execution headwinds",
      articleUrl: "https://bloomberg.com/...",
      datePublished: "2026-01-15",
      quote: "Marcus Chen of RatedBrokers said...",   // опц, если был цитирован
      type: "quoted"    // "quoted" | "authored" | "featured"
    }
  ],

  speakingEngagements: [                     // новое — Hatzakis pattern
    {
      event: "Finance Magnates London Summit",
      eventUrl: "https://...",
      role: "Panelist",
      topic: "The future of ECN brokers",
      date: "2025-11-20"
    }
  ],

  podcastAppearances: [                      // новое (опц)
    {
      show: "Interactive Brokers Podcast",
      episode: "245",
      episodeUrl: "https://...",
      date: "2026-02-10"
    }
  ],

  publishedBooks: [],                        // новое (опц)

  signaturePicks: [                          // новое — для блока Top Pick
    { brokerSlug: "pepperstone", reason: "Best ECN for retail active traders" }
  ],

  awards: [                                  // новое (опц)
    { name: "Best Forex Analyst 2025", issuer: "Finance Magnates", year: 2025 }
  ],

  availableForPitch: true,                   // новое — показывает/скрывает Contact block
  pitchTopics: ["Forex execution", "Broker regulation", "ECN markets"],  // новое

  disclaimers: {
    antiImpersonation: true                  // новое — показывает anti-scam block
  },

  verified: true,
  isFounder: false,
  joinedAt: "2024-03-01",                    // новое
}
```

### Где брать данные

- **Credentials verification URL** — запрос каждому автору, проверка в реестре при onboarding
- **Previous employers** — LinkedIn авторов (у нас в руках, легко собрать)
- **Education** — LinkedIn
- **Media mentions** — Google News search `"{author name}" forex`, Muck Rack профиль, Ahrefs referring pages (по нашему feedback — только по явной команде)
- **Speaking engagements** — Google Scholar + event pages
- **Подкасты** — ручной поиск по именам в Spotify/Apple Podcasts

**Объём работ**: ~2-3 часа на автора для полного сбора (×5 = 10-15 часов полной enrichment).

---

## 8. Риски и ошибки

### Критичные

1. **Fabricated credentials** — **никогда** не выдумывать CFA/CMT. Если у реального человека credential есть — ссылка на verification обязательна. Если автор полностью фиктивный (текущие Marcus/Sarah/Elena/David — пока не ясно) — либо перевести в «editorial persona» с disclosure, либо заменить на реальных людей (см. `[[authors_sprint]]` — собрано 580 реальных кандидатов с конкурентов). Fabrication = E-E-A-T violation = deindexation risk.
2. **Inflated numbers** — «has reviewed 87 brokers» без реальных 87 published reviews в БД = ложь. Аудит: `reviews` counter должен быть computed, не hardcoded. Иначе будет второй S7 cleanup (как было с 43 follower counts).
3. **Media mentions без линка** — «As seen in Bloomberg» без URL = fabrication risk. Либо ссылка на конкретную статью, либо блок скрыт.
4. **Copy-paste biography между авторами** — одинаковые структуры приводят к near-duplicate content. Каждый longBio + methodology должен быть уникальным (отдельный стиль, разные примеры).
5. **Hallucinated verify URLs** — CFA Institute использует реальные UUID в URL. Нельзя генерить фейковые `credentials.cfainstitute.org/xxxxx`. Только реальные.

### Средние

6. **Пастельные фиолетовые chips** в credentials (текущий код) — нарушение DESIGN-ANTIPATTERNS. Замена на brand-ориентированные цвета.
7. **Over-optimization** title tag — `Marcus Chen, CMT, CFA, MBA, Best Forex Analyst, 14 Years | Rated Brokers` = keyword stuffing. 60-70 символов, не больше.
8. **Thin content для Founder** — Yegor с 0 reviews и коротким bio = thin page в глазах Google. Либо делаем длинный editorial philosophy (500+ слов), либо noindex на founder page до готовности.
9. **Каннибализация между author pages и `/about`** — если `/about` дублирует full bios всех авторов, Google путается. Решение: `/about` = summary list (100 слов на автора) + ссылка «Full profile →», индивидуальные pages = полный контент.
10. **Peer review loop** — Elena reviews Marcus, Marcus reviews Elena, David fact-checks всех. Если не диверсифицировать — пользователи и Google заметят artificial structure. Решение: минимум 2-3 рецензента per author, ротация.

### Технические

11. **JSON-LD дублирование** — если schema на review pages передаёт полного `Person` объекта вместо `@id` reference — Google воспринимает как разные entity. Переход на `@id` pattern после внедрения ID-shape.
12. **Image without alt** — `imageAlt` должен быть детальным: «Marcus Chen, CMT — Senior Forex Analyst at RatedBrokers», не просто «Marcus Chen».
13. **Canonical для lang versions** — при мультиязычности `/ru/author/marcus-chen` → `hreflang` на `/author/marcus-chen`. Без этого — duplicate content.
14. **Missing published date** — на Person schema нет `datePublished`, но всё равно полезно показывать «Profile last updated: YYYY-MM-DD» для trust.
15. **Lazy-loaded avatars** — hero avatar should NOT be lazy-loaded (LCP), только recent articles thumbnails.

### Affiliate-специфичные

16. **CTA на author page не должна конкурировать с review pages** — «Visit Pepperstone» в Signature Pick блоке OK, но если автор page становится main conversion surface — плохо для внутреннего link distribution. Держать CTA как secondary action.
17. **Author disclaimer vs review disclaimer** — обязательно **разные формулировки**. Author disclaimer = personal integrity. Review disclaimer = site-level affiliate disclosure. Без их смешения.

---

## Итог

Author page — **инфраструктура** для E-E-A-T, не трафиковая единица. Внедрение предложенной структуры даст:
- Лифт ранжирования на всех 300+ review/ranking страницах через authorship signal (5-15% upside при нынешнем состоянии)
- Citability для PR: Marcus цитируется в Bloomberg → рост Domain Rating → рост всего сайта
- Conversion lift ~5-10% на review pages за счёт trust chain
- Founder page как bizdev surface: partnership pitches, editorial hiring

**Объём работ**:
- Данные: ~10-15 часов на 5 авторов (можно распараллелить с authors_sprint, где уже собрано 580 кандидатов с конкурентов — возможно часть использовать)
- Дизайн: 1 спринт Барбары на layout + FRAMES выбор
- Код: 1 спринт — AuthorPage.jsx расширение до ~600 строк, JSON-LD upgrade, broker review JSON-LD переход на `@id` references
- QA: проверка breakpoints 320/768/1440, Lighthouse E-E-A-T score

**Sequence для внедрения**:
1. Расширить `authors.js` schema (этот документ — референс)
2. Собрать реальные данные (credentials verification URLs — критично)
3. Decide: fake vs real authors (связка с authors_sprint 580 реальных кандидатов)
4. Redesign с Барбарой (layout + Premium Dark якоря)
5. Код AuthorPage.jsx + JSON-LD
6. Codex review
7. Deploy

---

## Sources

- [Steven Hatzakis — ForexBrokers.com](https://www.forexbrokers.com/about/steven-hatzakis)
- [James Royal, Ph.D. — Bankrate](https://www.bankrate.com/authors/james-royal/)
- [Blain Reinkensmeyer — StockBrokers.com](https://www.stockbrokers.com/about/blain-reinkensmeyer)
- [Thomas J. Brock — Annuity.org](https://www.annuity.org/reviewers/thomas-j-brock/)
- [Eugene Lee, CFA — BestBrokers](https://www.bestbrokers.com/authors/eugene-lee-cfa/)
- [CFA Institute Verification](https://credentials.cfainstitute.org/)
- [BrokerChooser Team](https://brokerchooser.com/team)

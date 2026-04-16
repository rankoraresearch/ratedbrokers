# Author Page Redesign — Brief by Barbara

Дата: 2026-04-16
Объект: `/author/:slug` — шаблон страницы автора
Текущий файл: `src/pages/AuthorPage.jsx` (265 строк)
Данные: `src/data/authors.js` — 5 авторов (Yegor founder, Marcus/Sarah/Elena/David analysts)

---

## 1. Аудит текущей страницы

### Что делает шаблон сейчас
Breadcrumb -> Hero (navy gradient 135deg + avatar + name + role + фиолетовые credentials pills + синий LinkedIn CTA) -> Stats (3 карточки: зелёный Years / синий Reviews / фиолетовый Certification) -> About + Specialty карточка -> Peer review grid (Reviewed by / Fact checked by) -> Articles list (зелёная иконка + название, 2 колонки).

### Что не так — построчно

1. **Радужные stats** — три карточки трёх разных цветов (зелёный / синий / фиолетовый). Это ровно та самая «пастельная палитра per category», которую Егор заблокировал в `DESIGN-ANTIPATTERNS.md §2/§3`. Фиолетовый `#7c3aed` + светло-фиолетовый фон `#f5f3ff` — чужеродный цвет, его нет в брендовой палитре (Navy / Orange / Green).

2. **Фиолетовые credentials pills** — `rgba(139,92,246,0.15)` + `#c4b5fd` текст. Опять фиолетовый. Брендовые pills должны быть либо монохромными серыми (нейтральный факт), либо navy (статус), либо оранжевыми (выдающийся accent). CFA/CMT/CAIA — это авторитет, поэтому им место на navy/оранжевой стороне, не на сиреневой.

3. **«LinkedIn CTA» синей плашкой `#0A66C2`** — корпоративный синий LinkedIn брал над макетом. Это одна кнопка чужой бренд-палитры посреди нашего navy/orange hero — кричит «контакт», хотя она не основная цель страницы. Её функция — trust signal, не CTA.

4. **Hero слишком узкий** (maxWidth 800px). Hero обычно на всю ширину (1200), чтобы дать автору визуальную массу. Сейчас он выглядит как внутренняя карточка страницы, а не как вход в author brand.

5. **Слабый E-E-A-T для SEO** — нет media mentions («As seen in»), нет количественных trust signals (X brokers reviewed / Y words published / Z years covering forex), нет последних ревью, нет последних рейтингов. Для Google E-E-A-T это пробел: у ForexBrokers и Bankrate эти блоки — лицо страницы.

6. **Неразделены «написал» и «отредактировал»** — у Bankrate есть табы Written / Edited, у ForexBrokers — пагинация по 170+ статьям. У нас один плоский список из `RANKING_CATEGORY_AUTHORS` — и он пустой для Yegor, Sarah, Elena, David (их работы идут как reviewer/editor/fact-checker, а не writer).

7. **Peer review блок обесценен** — две маленькие идентичные карточки «Reviewed By / Fact Checked By». Это ключевой E-E-A-T сигнал (независимое ревью), но подан как хозяйственная сноска, не как бренд-заявление.

8. **Founder/analyst collapse** — Yegor (reviews=0, credentials=[]) получает те же три stat-карточки, где `Certification` просто не рендерится. Сетка становится 2-колонной, выглядит обрезанной. У founder своя история (платформа, методология, 10+ years), а шаблон её не показывает.

9. **Никакого «свежего»** — нет дат, нет «last updated», нет последней активности. Страница статична и не сигнализирует «автор живой и работает», что для E-E-A-T критично.

10. **Articles block — 1 цвет, 1 иконка, 1 стиль** — 12 ссылок с зелёной иконкой выглядят как список категорий сайта, а не как портфолио эксперта. У конкурентов там всегда превью-картинка + дата + тип контента + read time.

### Вердикт
Шаблон работает технически (JSON-LD Person ok, breadcrumb ok), но дизайнерски он **на уровне «resume template 2012»**: hero-карточка + три разноцветных stats + список ссылок. В премиум-издании (Bankrate, NerdWallet, FB.com) страница автора — это **мини-лендинг личности с трафиковыми блоками**, а не CV.

---

## 2. Анализ конкурентов

Доступны детальные данные по ForexBrokers.com (Steven Hatzakis), Bankrate (James Royal), NerdWallet (Sam Taube). BrokerChooser и Investopedia не открылись через WebFetch (таймауты/блок), но их паттерны известны из ранее проведённого editorial-teams-research (см. `memory/MEMORY.md` -> `editorial-teams-research`).

| Паттерн | ForexBrokers | Bankrate | NerdWallet | BrokerChooser* | Investopedia* | Забираем / отбрасываем |
|---|---|---|---|---|---|---|
| **Hero layout** | Квадратное фото 200-250px, чёрный фон портрета, белый фон страницы, заголовок справа | Квадрат 232px слева + имя + роль + соцсети + expertise chips + education chips | Круглое/квадратное фото + имя + Lead Writer + цитата «How I Think About Money» | Крупное фото + титул + регионы/языки | Фото + имя + роль + short bio | **Забрать:** quote/manifesto (NerdWallet «How I Think About Money») даёт человечность; expertise chips (Bankrate) в монохроме. **Отбросить:** чёрный квадрат фото (Hatzakis) — архаично. |
| **Credentials** | Series III CTA лицензия, 25+ лет опыта, 1000+ статей, CFTC регистрация, роль в компании | 4 области expertise + 3 образовательные степени (BS/MA/PhD) + автор 2 книг | 9+ years / 90+ articles / 31.5M readers reached — как метрики | CFA / Series / образование | CFA / CMT значок крупно | **Забрать:** количественные метрики (NerdWallet формат «31.5M readers reached») — звучит как impact, не как CV. Плюс licence numbers (Hatzakis) с ссылкой на регулятор. |
| **Media mentions** | **Media Samples** — 24 ссылки: Bloomberg, FXStreet, Interactive Brokers podcast, iFX Expo панели, TheStreet, The National Herald | **James beyond Bankrate** — карточки с логотипами: ABC, CNN, Yahoo Finance, Forbes, Barron's + заголовок + ссылка | **Published in** — логотипы MarketWatch, NASDAQ | Редко | Часто + цитаты в обзорах | **Забрать:** формат Bankrate (логотип издания + заголовок материала + ссылка) — конкретнее чем просто строка логотипов. Это реальный trust, не декор. |
| **Latest articles** | Сетка 10 штук + preview картинка + title + date (Page 1 of 17) | «James's Picks» (editorial-выбранные) + **Latest articles** с табами Written/Edited, 3 колонки, preview + desc + read time + date (Page 1 of 43+) | 6 статей с миниатюрами + пагинация (18 страниц) | Грид с обложками | Список + даты | **Забрать:** табы Written / Reviewed / Edited (Bankrate) — ровно то, что нужно для нашей модели (Marcus пишет, Elena review, David fact-check, Sarah edit). Плюс «Picks» (editorial-выбор автора) — отдельный слой. |
| **Layout** | Single column, всё сверху вниз | Single column, widescreen | Single column + блоки внутри | Often 2-col (sidebar с brokers автор покрывает) | 1-col | **Забрать:** single column для мобайла обязательно; desktop — двухколоночник с **sticky right rail** («Quick Facts»: years, areas, certifications, latest review date). Это Bankrate + BC гибрид. |
| **Tone** | Профессиональный, сухой, «сертификация и годы» | Корпоративный, educational, глубокий | Человечный («How I think about money»), tone of voice автора | Регионализованный (автор по стране) | Education-first («Simply put») | **Забрать:** manifesto-цитата (NerdWallet) + деловой тон (Bankrate). **Отбросить:** холодный CV-тон (FB.com). |
| **Sticky trust bar** | Нет | Нет | Нет, но inline expertise chips висят высоко | Нет | Нет — только sidebar | **Идея:** у нас нет на рынке — можем сделать «Trust ribbon» под hero (тонкая navy полоса с 4 числами: Years / Brokers analyzed / Articles / Last update). Собственная фишка. |
| **Social** | LinkedIn + Twitter + email + официальные аккаунты блок | Twitter + LinkedIn + email | LinkedIn + Twitter | LinkedIn | LinkedIn | **Забрать:** иконки соцсетей маленькие, в hero meta-строке, не как большая синяя кнопка. LinkedIn — один из нескольких signals, не главный. |

\* BrokerChooser / Investopedia — данные из ранее собранного editorial-teams-research в памяти.

**Главный вывод:** у всех конкурентов `author page` — это **trust + freshness landing**, а не CV. Три обязательные вещи: media mentions, latest work (с фильтрами по роли), количественные метрики impact. Наш текущий шаблон не делает ничего из этого.

---

## 3. Список блоков итогового шаблона

Ниже — **полный рабочий набор**. Каждый концепт в секции 4 использует это меню в своей компоновке (какие-то секции опционально).

### 3.1 Breadcrumb
RatedBrokers / Our Experts / {Author Name}. Стандартный белый фон. Без изменений.

### 3.2 Hero
Ключевой identity-блок. Фото автора 120-160px, имя H1 Outfit 800, роль в Orange (не Green, чтобы не дублировать бренд-зелёный), короткая цитата-manifesto (1-2 строки) под ролью, meta-ряд: credential pills (монохром navy) + country/timezone + LinkedIn/Twitter иконки маленькие. **Premium Dark фон** (navy→green gradient + диагональная текстура) — это якорная секция. Ширина контейнера 1200, не 800.

### 3.3 Trust Ribbon (наша фишка, не у конкурентов)
Тонкая полоса под hero с 4 числами в JetBrains Mono:
`14 YEARS COVERING FX · 87 BROKERS ANALYZED · 130+ DATA POINTS PER REVIEW · LAST UPDATE APR 14, 2026`
Разделители — тонкие вертикальные линии. Это одна строка, не 4 карточки (как сейчас). Даёт импакт без «радужных stats».

### 3.4 About (биография)
Белая секция. H2 «About {Name}». 2-3 абзаца (текущий `bio` + расширение). Под ним — блок `Specialty` как inline-строка: «Areas: ECN execution · Spread analysis · MT4/MT5 platforms» (без плашки, просто сплошная meta-строка с точками-разделителями).

### 3.5 Featured In / As Seen On (НОВЫЙ)
Обязательно. Заголовок H2 «Featured In». Горизонтальная полоса логотипов изданий в монохроме (grayscale, opacity 0.7, hover -> full color 1.0). Альтернативный формат — **карточки с цитатами** (как Bankrate beyond): `[logo издания] [заголовок материала / цитата] [дата] [ссылка]`. Я рекомендую карточный формат — конкретнее и SEO-лучше (outbound dofollow / inbound «автор цитирован в Bloomberg»).

На старте (когда цитат нет) — плейсхолдер **«Independent researcher»**: «{Name} works exclusively for RatedBrokers and has not yet been quoted in third-party publications». Это честнее, чем fake «as seen on».

### 3.6 Peer Review Strip (РЕДИЗАЙН)
Оставить, но сделать **одной горизонтальной полосой** вместо двух карточек:
`This expert's work is reviewed by [avatar] Elena Petrova, CQF · Fact-checked by [avatar] David Kowalski, CAMS`
Прозрачный фон, 1px border top/bottom, avatars 36px, имена — ссылки зелёные на их страницы. Компактно, но веско.

### 3.7 Latest Work (НОВЫЙ, ключевой)
H2 «Latest Work by {Name}». **Табы** сверху (монохромные pills): `Written (N) / Reviewed (M) / Fact-Checked (K) / All`. Под табами — список последних 10 работ. Каждая работа — строка в формате D2k-стандарта (см. `CLAUDE.md` D2k): `[icon категории 28×28 r8] [обложка/favicon 48px] [title Outfit 700 15px] [тип: Ranking/Review 11px meta] [дата 11px meta] [ArrowRight]`. Все строки внутри одной белой карточки, прозрачные, hover — рамка серая + ArrowRight зеленеет.

Для founder (Yegor) вместо «Latest Work» — **«Platform Milestones»** (дата + событие: «Jan 2024 — Founded RatedBrokers», «Mar 2026 — Backend + Admin Panel live», «Apr 2026 — 293 rankings published»). То же визуально форматирование, разные данные.

### 3.8 Expertise Deep-Dive (НОВЫЙ, опционально)
Два-три крупных блока с H3, раскрывающие specialty. Для Marcus: «ECN/STP Execution — что я проверяю» + 4-5 пунктов методологии. Даёт E-E-A-T + ключевые слова + уникальный контент на page (не дубль bio).

### 3.9 Recent Insights / Commentary (НОВЫЙ, опционально)
Timeline-строка 3-5 заметок «Что изменилось в индустрии за последний квартал» с датой и 2-3 предложениями. Подписывает автор как industry observer, не только reviewer. Даёт freshness signal для Google.

### 3.10 Quotes / Credentials Deep (опционально, для analysts с certs)
Крупная цитата от автора («Я не доверяю spreads, пока не открою live-счёт на $500» — Marcus) в большом type (Outfit 600, 24-28px, navy). Плюс ссылка на regulator registry для Series/CFA/CQF.

### 3.11 CTA footer
«Have a question for {Name}?» -> ссылка на contact form с prefilled темой «Question for {Name}». Orange CTA. Не обязательно, но конверсионно.

### 3.12 JSON-LD Person (есть)
Оставить как есть, дополнить `alumniOf` (для Bankrate-style образования) и `citation` для каждого Featured In.

---

## 4. Три концепта

Все три отвечают брифу: media mentions + latest work + свежесть; решают founder vs analyst; соответствуют Premium Dark + brand invariants.

---

### Концепт A — **Editorial Authority**
«Читаю Wall Street Journal автор-страницу»

**Тональность:** сдержанный, премиум, деловой. Приоритет: credibility > warmth.
**Палитра:** Navy `#0f172a` (hero + trust ribbon), чистый white `#ffffff` (body secs), Orange accents `#f59e0b` (role, нумерация, CTA), Green `#059669` только для пер-ссылок (`.link-green`) и avatar-statusов. **Zero фиолетового.**
**Типографика:** Outfit 800 (H1 36/28px), Outfit 700 (H2 22px), DM Sans 400 16/1.7 (body), JetBrains Mono 12-13 uppercase (eyebrows + trust ribbon numbers).
**Hero:** Premium Dark на всю ширину, слева — portrait 140px, справа — имя + роль оранжевым + 1-строка manifesto («14 years testing brokers with real money — never theory.»). Под ними — meta-строка: CFA CMT (navy pills с тонкой white border) · LinkedIn · Twitter · London, UK.
**Trust ribbon:** сразу под hero — navy полоса 48px с 4 числами в JetBrains Mono, разделители `·`. Белые числа `#fff`, серые лейблы `rgba(255,255,255,0.55)`.
**Founder vs analyst:**
- Analyst (Marcus): Trust ribbon `14 YEARS · 87 BROKERS · 130+ DATA POINTS · UPDATED APR 14`
- Founder (Yegor): `10+ YEARS TRADING · FOUNDED 2024 · 293 RANKINGS PUBLISHED · UPDATED APR 16` (разные метрики, та же форма)

**ASCII wireframe:**
```
+------------------------------------------------------------+
| RatedBrokers / Our Experts / Marcus Chen                    |  breadcrumb (white)
+------------------------------------------------------------+
|                                                            |
|   [Photo]  MARCUS CHEN                                     |  HERO
|    140px   Senior Forex Analyst                            |  navy→green gradient
|            "14 years testing brokers with real money."     |  diagonal texture
|            [CFA] [CMT]   in  x   London UK                 |
|                                                            |
+------------------------------------------------------------+
| 14 YEARS COVERING FX · 87 BROKERS ANALYZED · 130+ DATA · APR 14 |  TRUST RIBBON navy
+------------------------------------------------------------+
|                                                            |
|  ABOUT MARCUS                                              |  white
|  {bio paragraphs}                                          |
|  Areas: ECN execution · Spread analysis · MT4/MT5          |
|                                                            |
+------------------------------------------------------------+
|  FEATURED IN                                               |  #f8fafc soft band
|  +------------+  +------------+  +------------+            |
|  | [Bloomberg]|  | [FXStreet] |  | [Reuters]  |            |  card: logo + title
|  | "Forex     |  | "Spread    |  | "MT5 vs..."|            |  + date + ext link
|  |  brokers.."|  |  compare.."|  | Apr 2026   |            |
|  +------------+  +------------+  +------------+            |
+------------------------------------------------------------+
|  Reviewed by [Elena Petrova CQF] · Fact-checked by         |  thin strip, white
|  [David Kowalski CAMS]                                     |
+------------------------------------------------------------+
|  LATEST WORK BY MARCUS                                     |
|  [ Written 87 ] [ Reviewed 12 ] [ Fact-checked 4 ] [ All ] |  monochrome pills
|  +--------------------------------------------------------+|
|  | [icon][cover] IC Markets Review · Review · Apr 10  [→] ||
|  | [icon][cover] Best ECN Brokers 2026 · Ranking · Apr 8 [→]||
|  | ...                                                    ||
|  +--------------------------------------------------------+|
+------------------------------------------------------------+
|  HAVE A QUESTION FOR MARCUS?   [orange CTA →]              |
+------------------------------------------------------------+
```

**Hero style:** full-bleed Premium Dark с диагональной текстурой 12px (как How We Rate).
**Сильные стороны:** полностью соответствует brand invariants; Trust Ribbon — сильная дифференциация; легко масштабируется (founder/analyst через разные числа); SEO-сильный (Featured In cards + Latest Work tabs + даты).
**Риски:** немного «строже» чем ожидает пользователь на author-странице; нет warmth/personality.

---

### Концепт B — **Analyst Terminal**
«Страница — это карточка аналитика в Bloomberg Terminal»

**Тональность:** technical, data-dense, «мы показываем числа, не маркетинг».
**Палитра:** Navy `#0f172a` (full bg страницы — **дарковая страница целиком**, не только hero), orange highlights `#f59e0b`/`#fbbf24`, monochrome text (`#e2e8f0` body, `#94a3b8` meta, `#fff` headings), **без зелёного вообще** кроме крошечного verified-check на аватаре и avatar borders.
**Типографика:** Outfit 800 H1, JetBrains Mono для **всего** что число или label (labels uppercase 0.12em tracking); DM Sans только для prose-текста body.
**Hero:** левая половина — portrait 200px, правая — монотабель (3 колонки × 3 строки) метрик в Mono: `YEARS 14 · BROKERS 87 · DATA POINTS 130` / `LAST REVIEW APR 10 · CITATIONS 24 · RESPONSE TIME 24H`. Имя H1 сверху, роль оранжем. Нет pills-плашек — credentials в той же mono-table как строки.
**Founder vs analyst:**
- Для analyst — монотабель с metrics.
- Для founder — **та же сетка**, но с другими cell labels: `FOUNDED 2024 · MISSION Independent research · MONEY SAVED $2M+ for traders · PUBLIC LAUNCH Q2 2026`. То есть механика одна (9-cell grid), семантика разная.

**ASCII wireframe:**
```
[dark navy background EVERYWHERE below header]

+------------------------------------------------------------+
| Breadcrumb (dark variant)                                   |
+------------------------------------------------------------+
|  +----------+   MARCUS CHEN                                |
|  |          |   SENIOR FOREX ANALYST (orange)              |
|  | Photo    |                                              |
|  | 200px    |   +-------+--------+-----------+             |
|  | verified |   | YEARS | BROKER | DATAPTS   |             |
|  +----------+   |  14   |   87   |  130+     |             |
|                 +-------+--------+-----------+             |
|                 | UPDATE| CITES  | RESPONSE  |             |
|                 | APR10 |   24   |   24h     |             |
|                 +-------+--------+-----------+             |
|                 [CFA] [CMT]  linkedin · x                  |
+------------------------------------------------------------+
|  // BIOGRAPHY                                              |
|  {bio as terminal-style prose, narrow column}              |
|  > "I don't trust spreads until I open a live $500 acct." |  orange pullquote
+------------------------------------------------------------+
|  // CITATIONS & COVERAGE                                   |
|  2026-04  BLOOMBERG    "Forex brokers consolidate…"  [→]  |  terminal log
|  2026-03  FXSTREET     "Spread wars heat up"         [→]  |  mono, orange dates
|  2026-02  REUTERS      "MT5 vs cTrader: execution…"  [→]  |
+------------------------------------------------------------+
|  // LATEST OUTPUT                                          |
|  [ WRITTEN 87 ] [ REVIEWED 12 ] [ FACT-CHECK 4 ]           |
|  87.01  2026-04-10  IC MARKETS REVIEW          RATING 4.8 |  monospaced log-rows
|  87.02  2026-04-08  BEST ECN BROKERS 2026      LIST 10    |
|  87.03  2026-04-05  PEPPERSTONE REVIEW         RATING 4.7 |
+------------------------------------------------------------+
|  // PEER VERIFICATION                                      |
|  REVIEWED BY  ELENA PETROVA  CQF  →                        |
|  FACT-CHECKED DAVID KOWALSKI CAMS →                        |
+------------------------------------------------------------+
```

**Hero style:** full-bleed navy + декор — тонкая сетка 8×8 grid overlay (как в Terminal). Портрет в оранжевой рамке 2px.
**Сильные стороны:** максимально отличается от всех конкурентов (unique brand); сразу сигнализирует «мы data-driven, не маркетологи»; идеально ложится на E-E-A-T; founders и analysts делят одну механику.
**Риски:** вся страница тёмная — нарушает правило `feedback_dark_rhythm.md` («чередовать dark/light»). Premium Dark предполагался как якорь, не как фон всей страницы. Это **отступление** от текущей концепции, которое надо явно утвердить. Второй риск: «слишком холодно» для публичной страницы, которую Google отдаёт как author profile.

---

### Концепт C — **Magazine Profile** (моя рекомендация)
«Как author profile на сайте хорошего финансового magazine (FT Weekend, The Economist people-pages)»

**Тональность:** авторитет + warmth. Premium, но человечная. Рассказываем о человеке, не о CV.
**Палитра:** Navy hero → **cream band** `#fbf8f1` (warm — как frame `cream` в Broker Types) для «About» → white для Featured In → soft gray `#f8fafc` для Latest Work → cream accent для quote block. Чередование dark → cream → white → soft → cream соблюдает `feedback_dark_rhythm.md`.
Accents: Orange primary `#f59e0b` для role и underlines, Green `#047857` только для ссылок `.link-green` и avatar borders.
**Типографика:** играем двумя гарнитурами — Outfit 800 (breaking H1 42/32px с negative tracking `-0.03em`), DM Sans 400 17/1.75 (prose — крупнее обычного, «читаю статью о человеке»), JetBrains Mono 12 uppercase 0.12em для eyebrows.
**Hero:** Premium Dark, **asymmetric layout**. Слева 40% — fullbleed portrait (крупный, 200-240px, obrezan хорошо). Справа 60% — eyebrow «SENIOR FOREX ANALYST» JetBrains Mono orange, H1 имя, manifesto 1-2 строки 20px light DM Sans белый, под этим — meta-ряд с credentials navy pills + соцсети маленькие иконки. Низ hero — орnamentальная тонкая orange hairline.
**Founder vs analyst:**
- Analyst: hero manifesto в кавычках («14 years testing brokers with real money.»).
- Founder: hero manifesto = mission statement («We built RatedBrokers because advertising corrupts broker reviews.»). Обе формы — 1 строка под именем, та же типографика.
- Trust ribbon: analyst показывает `YEARS · BROKERS · DATA POINTS · UPDATED`; founder показывает `TRADING · FOUNDED · RANKINGS · UPDATED`.
- Latest Work: analyst — Written/Reviewed/Fact-checked табы; founder — `Platform Milestones` (dated timeline — дата + достижение, тот же D2k визуал).

**ASCII wireframe:**
```
+------------------------------------------------------------+
|  Breadcrumb (white)                                         |
+------------------------------------------------------------+
|                                                            |
|  [HUGE      ]  SENIOR FOREX ANALYST          (orange eyebrow)
|  [PORTRAIT  ]                                              |  navy→green
|  [  240×240 ]  Marcus Chen                                 |  + diagonal
|  [         ]   "14 years testing brokers with real money." |  texture
|  [         ]   — never theory.                             |
|  [         ]                                               |
|  [         ]   [ CFA ] [ CMT ]      in  x   London UK      |
|                                                            |
|  ──────────── thin orange hairline ──────────              |
+------------------------------------------------------------+
|  14 YEARS · 87 BROKERS · 130+ DATA POINTS · UPDATED APR 14 |  navy trust strip
+------------------------------------------------------------+
|                                                            |
|  About Marcus                                               |  CREAM #fbf8f1
|  {two paragraphs, 17px DM Sans, generous leading}           |  editorial feel
|                                                             |
|  Areas of expertise                                         |
|  ECN execution · Spread analysis · MT4/MT5 platforms        |
|                                                             |
+------------------------------------------------------------+
|                                                            |
|     "I don't trust a broker's spreads until I've           |  CREAM + orange
|      opened a live $500 account."                          |  bookends
|      — Marcus, on methodology                              |  big pullquote
|                                                            |
+------------------------------------------------------------+
|  FEATURED IN                                                |  WHITE
|  +------------+  +------------+  +------------+            |
|  | Bloomberg  |  | FXStreet   |  | Reuters    |            |  card: logo
|  | "Forex     |  | "Spread    |  | "MT5 vs... |            |  + title + date
|  |  brokers…" |  |  wars…"    |  |  "          |           |  + outbound link
|  | Apr 2026 →|  | Mar 2026 →|  | Feb 2026 → |            |
|  +------------+  +------------+  +------------+            |
+------------------------------------------------------------+
|  Reviewed by [Elena Petrova CQF] · Fact-checked by          |  WHITE thin strip
|  [David Kowalski CAMS]                                      |
+------------------------------------------------------------+
|                                                            |
|  Latest work                                                |  SOFT GRAY #f8fafc
|  [ Written 87 ] [ Reviewed 12 ] [ Fact-checked 4 ] [ All ] |
|                                                             |
|  +---- single white card, D2k list inside -------+          |
|  | [📊] [cover] IC Markets Review   Apr 10  [→]  |          |
|  | [📈] [cover] Best ECN Brokers    Apr 8   [→]  |          |
|  | [🏦] [cover] Pepperstone Review  Apr 5   [→]  |          |
|  | ... 10 items, pagination bottom                |         |
|  +------------------------------------------------+         |
+------------------------------------------------------------+
|  Have a question for Marcus?   [Ask the team ↗]            |  CREAM footer
+------------------------------------------------------------+
```

**Hero style:** Premium Dark asymmetric, крупное вертикальное фото занимает левую колонку полностью (от topp до bottom hero), без фреймов-скруглений — фото утоплено в фон как в журнальном профиле.
**Founder версия:** заменяем hero manifesto на mission quote, заменяем Trust Ribbon на founder-числа, заменяем Latest Work на Platform Milestones (тот же D2k визуал). Все остальные секции одинаковые. Если у founder нет Featured In — показываем блок **«What people say about RatedBrokers»** (скриншоты отзывов клиентов / Trustpilot), который появится позже.

**Сильные стороны:**
- Соблюдает чередование dark/light (feedback_dark_rhythm): dark hero → cream → white → soft → cream.
- Premium Dark hero + orange eyebrow + cream section — всё уже есть в brand (How We Rate / Broker Types cream frame).
- Warmth (pullquote, большая портретная фотка, cream band) решает проблему «холодного CV».
- Founder/analyst решён элегантно через **один шаблон с тремя переменными** (manifesto, trust numbers, latest-work-type).
- SEO сильный: Featured In cards, Latest Work табы, updated date в trust ribbon, JSON-LD Person.
- Mobile: все секции складываются в single column; hero -> portrait сверху 160px + имя под ним; trust ribbon переносится на 2 строки с meta-разделителями; Latest Work остаётся D2k списком (уже mobile-friendly).

**Риски:**
- Cream band `#fbf8f1` — новый в author-странице. Но он уже утверждён на Broker Types section + Home sections, поэтому не выпадает из системы.
- Pullquote — если Егор не любит «литературные» элементы, выкинуть или сделать меньше.

---

## 5. Рекомендация

**Концепт C — Magazine Profile**.

Обоснование:
1. **Единственный соблюдает dark-light ритм** — A уходит в один Premium Dark hero + всё остальное белое/навернутое, B делает всю страницу тёмной (прямое нарушение feedback_dark_rhythm).
2. **Founder vs analyst решён одним шаблоном с тремя переменными** (manifesto / trust numbers / latest-work-type) — минимум ветвлений в коде, максимум универсальности.
3. **Cream band + dark hero + orange eyebrow** — это уже устоявшаяся комбинация в бренде (Broker Types `cream` frame, How We Rate Premium Dark). Author-страница получает те же знаки, что остальной сайт, и не выглядит чужеродной.
4. **Warmth через pullquote и крупный портрет** — решает нашу проблему «CV 2012 vs живой автор». Premium без холода.
5. **Все обязательные блоки Егора есть** — Featured In (cards), Latest Work (tabs + D2k), Trust signals (ribbon под hero) + свежесть (updated date везде).
6. **Риск ноль** — ни одного анти-паттерна (нет фиолетового, нет pale green, нет радужных chips, нет шаблонных badges).

**План имплементации (после утверждения C):**
- Спринт 1 (2-3 часа): новый `AuthorPage.jsx` — hero asymmetric + trust ribbon + about + pullquote.
- Спринт 2 (2 часа): Featured In cards (с placeholder для пустых авторов).
- Спринт 3 (3 часа): Latest Work tabs + data model для Reviewed/Fact-Checked (нужно связать broker reviews с reviewer/fact-checker полями из TEAM).
- Спринт 4 (1 час): Founder variant — Platform Milestones timeline из нового data-файла.
- Спринт 5 (30 мин): JSON-LD дополнить `citation` + `alumniOf`.

Итого ~8-9 часов работы с кодом. До имплементации — согласовать данные (см. открытые вопросы).

---

## 6. Открытые вопросы к Егору

1. **Media mentions — есть ли хоть одна реальная цитата / упоминание** у Marcus/Sarah/Elena/David в Bloomberg/Reuters/FT/FXStreet? Если нет — нужно сразу определить стратегию: (a) скрыть блок до появления первой цитаты, (b) показывать плейсхолдер «Independent researcher», (c) показывать **publications where WE link/citation** (то есть reverse — где нас упоминают, а не где автор упоминается). Последнее — самый честный путь на старте.
2. **Latest Work data model** — сейчас `RANKING_CATEGORY_AUTHORS` все мапит на Marcus. Нужно ли связать broker reviews с их авторами (напр. IC Markets review — writer Marcus, reviewer Elena, fact-checker David)? Если да — каждая страница `/reviews/{slug}` должна иметь поля `writerSlug / reviewerSlug / factCheckerSlug`. Это небольшая миграция frontmatter.
3. **Дата «Last updated»** для Trust Ribbon — берём из `broker.updated` / `ranking.updated` или добавляем поле `author.lastActivity` вручную?
4. **Founder Platform Milestones** — сколько milestones показать (5? 10?) и где источник данных? Если это статический список для Yegor — добавляем `milestones: []` в `authors.js`.
5. **Pullquote в hero — делаем или убираем?** Если оставляем, то кто пишет цитаты для 4-х analysts (1-2 строки про методологию от каждого)?
6. **Concept B (Analyst Terminal) — полностью отвергаем или сохраняем как proto `/proto/author-terminal`** на случай если Егор захочет попробовать тёмный вариант?
7. **Blocks 3.8 (Expertise Deep-Dive) и 3.9 (Recent Insights)** — включаем в первый релиз или откладываем? Они опциональные, но сильно усиливают SEO.
8. **CTA footer «Have a question»** — соединять с contact form или делать отдельный author-contact endpoint?

---

**Концовка брифа. Жду выбора концепта (A/B/C) и ответов на открытые вопросы — после этого перехожу к коду.**

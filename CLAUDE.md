# RatedBrokers — Инструкции для Claude

## Память

При старте каждой сессии — ОБЯЗАТЕЛЬНО прочитай:
1. `memory/status.md` — текущее состояние, что в работе
2. `MILESTONES.md` — дорожная карта, текущий майлстоун
3. `PROGRESS.md` — что уже сделано

При старте также прочитай текущий лог:
4. `logs/YYYY-MM.md` — лог текущего месяца (например `logs/2026-03.md`)

При завершении работы или значимых изменениях:
- Обнови соответствующие файлы в memory (status, decisions, и т.д.)
- Не жди напоминания от Егора — делай это сам

## Логирование действий

**ОБЯЗАТЕЛЬНО** веди детальный лог каждого действия в файле `logs/YYYY-MM.md` (файл на месяц).

Что логировать — **каждое микродвижение**:
- Создание / редактирование / удаление файлов
- Команды в терминале и их результат (успех/ошибка)
- Коммиты (хеш + сообщение)
- Push / deploy
- Запуск агентов и результаты
- Решения, принятые в ходе сессии

Формат записи:
```
## YYYY-MM-DD | Сессия: краткое описание

HH:MM — действие — результат
HH:MM — действие — результат
```

Пример:
```
## 2026-03-31 | Сессия: Добавление агента Билла

14:01 — Read agents/README.md — изучил структуру агентов
14:02 — Write agents/bill-seo-strategist.md — создал промпт-файл
14:03 — Write memory/bill.md — узел графа знаний
14:04 — Edit agents/README.md — добавил Билла в таблицу
14:05 — git commit 544aaea — "feat: add Bill agent"
14:06 — git push origin main — ok
```

Правила:
- Пиши лог **по ходу работы**, не в конце сессии
- Один файл на месяц, ротация автоматическая (новый месяц = новый файл)
- При старте сессии читай текущий месяц для контекста
- Старые месяцы не удалять — это архив

## Документация проекта

Не дублируй — читай по необходимости:

| Файл | Когда читать |
|------|-------------|
| `PROJECT.md` | Нужен общий контекст проекта |
| `DECISIONS.md` | Вопрос "почему так сделано?" |
| `MILESTONES.md` | Планирование, что делать дальше |
| `PROGRESS.md` | История коммитов |
| `CONTENT-CHECKLIST.md` | Работа с контентом рейтингов |
| `RANKING-TRACKER.md` | Статус 207 рейтингов |
| `agents/README.md` | Запуск AI-агентов (Джон, Боб, Лео, Барбара, Билл) |
| `logs/YYYY-MM.md` | Детальный лог действий (текущий месяц) |
| `content/README.md` | Формат MD-файлов брокеров |
| `BROKER-TYPES.md` | Различия типов брокеров: секции, скоринг, CTA, risk warning |
| `THEMATIC-RANKINGS-TREE.md` | Дерево 330 рейтингов по 9 категориям |

## Стек и правила кода

- React 19 + Vite + react-router-dom v7
- Inline CSS (`style={{}}`), без UI-библиотек, без Tailwind
- Единственный CSS-файл: `index.css` (сброс + шрифты)
- Данные: статические JS-файлы, генерируются из MD (`npm run brokers:build`)
- Стейт: только `useState` + `useContext` (для языка)
- Иконки: lucide-react
- Поиск: fuse.js (клиентский)
- JSON-LD schema через useEffect

## Cloudflare Pages и деплой

Сайт: `https://ratedbrokers.com` (Cloudflare Pages)
API: `https://ratedbrokers-api.ratedbrokers.workers.dev` (Cloudflare Workers + D1)
Домен: `ratedbrokers.com`, регистратор NameBright, NS на Cloudflare (`lynn.ns.cloudflare.com`, `sima.ns.cloudflare.com`)

**Деплой автоматический:** push в `main` → Cloudflare Pages автобилд → live.
Build command в Cloudflare Pages: `npm run build` (внутри вызывает `brokers:build`).

**BASE_URL:** Vite `base: '/'`. React Router `basename={import.meta.env.BASE_URL}`. Все пути к статике из `public/` используют `import.meta.env.BASE_URL`:
```jsx
src={`${import.meta.env.BASE_URL}logos/${slug}.png`}
```

**Индексация:** Сайт закрыт от поисковиков (`robots.txt: Disallow: /` + `<meta name="robots" content="noindex, nofollow">`). Открыть когда будет готов.

Env-переменные:
- `.env` — локальный (в .gitignore, НЕ в git)
- Cloudflare Pages → Settings → Environment Variables: `VITE_API_URL`
- `.github/workflows/deploy.yml` — бэкапный деплой через wrangler (требует секреты `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)

## Affiliate-ссылки

Все CTA на сайте ОБЯЗАНЫ идти через бэкенд `/go/{slug}` для трекинга кликов.

Паттерн:
```jsx
const apiBase = import.meta.env.VITE_API_URL || '';
const visitUrl = apiBase ? `${apiBase}/go/${slug}` : B.url;
```

Атрибуты: `target="_blank" rel="noopener nofollow sponsored"`

**Не использовать** `B.url` напрямую в `href` — это прямая ссылка без трекинга.

## Логотипы брокеров — Dual Logo System

Каждый брокер имеет **два** логотипа:
- **Квадратный icon** — `public/logos/{slug}.png` (120×120, для карточек, гридов)
- **Wide wordmark** — `public/logos-wide/{slug}.{svg|png|jpg}` (для review hero)

Wide логотипы: SVG по умолчанию, `WIDE_EXT` в BrokerReview.jsx переопределяет формат. `LOGO_BG` map задаёт цвет фона карточки. При добавлении нового брокера — добавить оба логотипа.

## Данные брокеров

Source of truth: `content/brokers/*.md` (YAML frontmatter + Markdown body).
Сгенерированные JS в `src/data/brokers/` — в .gitignore, не редактировать.

Пайплайн: `MD → validate → build → JS`
```bash
npm run brokers:validate   # проверить
npm run brokers:build      # собрать JS
```

## Тестирование UI

После любых изменений в UI — проверить breakpoints:
- 320px, 375px (mobile), 768px (tablet), 1024px, 1440px (desktop)
- CTA ссылки → должны идти на `/go/{slug}`
- `npm run build` — без ошибок

## Текущий майлстоун

M3 завершён. Следующий — см. `MILESTONES.md`.

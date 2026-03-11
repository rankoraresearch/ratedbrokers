# RatedBrokers — Инструкции для Claude

## Память

При старте каждой сессии — ОБЯЗАТЕЛЬНО прочитай:
1. `memory/status.md` — текущее состояние, что в работе
2. `MILESTONES.md` — дорожная карта, текущий майлстоун
3. `PROGRESS.md` — что уже сделано

При завершении работы или значимых изменениях:
- Обнови соответствующие файлы в memory (status, decisions, и т.д.)
- Не жди напоминания от Егора — делай это сам

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
| `agents/README.md` | Запуск AI-агентов (Джон, Боб, Лео) |
| `content/README.md` | Формат MD-файлов брокеров |

## Стек и правила кода

- React 19 + Vite + react-router-dom v7
- Inline CSS (`style={{}}`), без UI-библиотек, без Tailwind
- Единственный CSS-файл: `index.css` (сброс + шрифты)
- Данные: статические JS-файлы, генерируются из MD (`npm run brokers:build`)
- Стейт: только `useState` + `useContext` (для языка)
- Иконки: lucide-react
- Поиск: fuse.js (клиентский)
- JSON-LD schema через useEffect

## GitHub Pages и деплой

Сайт: `https://rankoraresearch.github.io/ratedbrokers/`
API: `https://ratedbrokers-api.ratedbrokers.workers.dev` (Cloudflare Workers + D1)

**BASE_URL — критично!** Vite `base: '/ratedbrokers/'`. Все пути к статике из `public/` ОБЯЗАНЫ использовать `import.meta.env.BASE_URL`:
```jsx
// ДА:
src={`${import.meta.env.BASE_URL}logos/${slug}.png`}
// НЕТ (404 на GitHub Pages):
src={`/logos/${slug}.png`}
```

Env-переменные:
- `.env` — локальный (в .gitignore, НЕ в git)
- `.github/workflows/deploy.yml` — `VITE_API_URL` задан там для CI

## Affiliate-ссылки

Все CTA на сайте ОБЯЗАНЫ идти через бэкенд `/go/{slug}` для трекинга кликов.

Паттерн:
```jsx
const apiBase = import.meta.env.VITE_API_URL || '';
const visitUrl = apiBase ? `${apiBase}/go/${slug}` : B.url;
```

Атрибуты: `target="_blank" rel="noopener nofollow sponsored"`

**Не использовать** `B.url` напрямую в `href` — это прямая ссылка без трекинга.

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

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

## Данные брокеров

Source of truth: `content/brokers/*.md` (YAML frontmatter + Markdown body).
Сгенерированные JS в `src/data/brokers/` — в .gitignore, не редактировать.

Пайплайн: `MD → validate → build → JS`
```bash
npm run brokers:validate   # проверить
npm run brokers:build      # собрать JS
```

## Текущий майлстоун

M3 — Идеальный шаблон тематического рейтинга. Подробности в `MILESTONES.md`.

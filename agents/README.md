# AI-агенты для работы с данными брокеров

Агенты запускаются через Claude Code Task tool. Каждый агент — это промпт-файл с ролью, инструкциями и воркфлоу.

## Агенты

| Агент | Файл | Роль | Редактирует файлы? |
|-------|------|------|-------------------|
| **Джон** | `john-data-collector.md` | Сбор данных с интернета → обновление MD | Да |
| **Боб** | `bob-fact-checker.md` | Верификация данных в MD → отчёт | Нет |

## Как запускать

### Джон — обновить данные одного брокера

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/john-data-collector.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slug: ic-markets
```

### Джон — обновить несколько брокеров

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/john-data-collector.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slugs: ic-markets, pepperstone, xm
```

### Боб — проверить данные одного брокера

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bob-fact-checker.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slug: ic-markets
```

### Боб — проверить несколько брокеров

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bob-fact-checker.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slugs: ic-markets, pepperstone, xm
```

## Типичные сценарии

### Полный цикл проверки брокера
1. Запустить Боба → получить отчёт о расхождениях
2. Если есть расхождения → запустить Джона для обновления
3. После Джона → `npm run brokers:validate` для валидации
4. Опционально: запустить Боба повторно для подтверждения

### Массовое обновление
1. Запустить Джона на всех брокерах (по 3-5 за раз)
2. `npm run brokers:validate` после каждого батча
3. Запустить Боба для выборочной проверки

## Что обновляет Джон

- Основные параметры: min_deposit, spread, avg_spread, commission, leverage, instruments, platforms
- Регуляторы: лицензии и их номера
- Trustpilot: рейтинг и количество отзывов
- Статус: active / suspended / under-review
- HQ, CEO — если изменились

## Что НЕ трогает Джон

- Тексты обзоров (Markdown body)
- Экспертные оценки (scores)
- FAQ, similar, author
- spread_competitors, spreads (таблица сравнения)
- promo, badge, cost_boxes, trustpilot_bars

## Валидация после обновления

```bash
npm run brokers:validate   # проверить все MD-файлы
npm run brokers:build      # пересобрать JS из MD
```

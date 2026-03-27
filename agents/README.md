# AI-агенты для работы с данными брокеров

Агенты запускаются через Claude Code Task tool. Каждый агент — промпт-файл с ролью, инструкциями и воркфлоу.

## Цепочка данных

```
Джон (сбор данных) → Боб (проверка + аппрув) → Лео (расчёт рейтингов)
```

## Дизайн

```
Барбара (аудит конкурентов → дизайн шаблонов → UX/UI ревью)
```

## SEO & Affiliate стратегия

```
Билл (конкурентный анализ → URL-архитектура → on-page SEO → CRO → ссылочное продвижение)
```

## Агенты

| Агент | Файл | Роль | Редактирует файлы? |
|-------|------|------|-------------------|
| **Джон** | `john-data-collector.md` | Research Agent — сбор сырых данных с интернета | Да (данные) |
| **Боб** | `bob-fact-checker.md` | Fact Checker — верификация + аппрув данных | Да (last_verified, status) |
| **Лео** | `leo-rating-calculator.md` | Rating Calculator — расчёт скоров и ранжирование | Да (score, verdict, scores) |
| **Барбара** | `barbara-designer.md` | Design Agent — дизайн шаблонов, UX/UI, аудит конкурентов | Да (стили, компоненты) |
| **Билл** | `bill-seo-strategist.md` | SEO & Affiliate Strategist — конкурентный анализ, URL-архитектура, on-page, CRO, ссылочное | Нет (стратегия и рекомендации) |

## Как запускать

### Джон — собрать данные одного брокера

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/john-data-collector.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slug: ic-markets
```

### Джон — собрать данные нескольких брокеров

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/john-data-collector.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slugs: ic-markets, pepperstone, xm
```

### Боб — проверить данные после Джона

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bob-fact-checker.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slug: ic-markets
```

### Боб — еженедельная проверка актуальности

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bob-fact-checker.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    weekly-check
```

### Лео — пересчитать рейтинг брокера

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/leo-rating-calculator.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    slug: ic-markets
```

### Лео — проверить ранжирование во всех рейтингах

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/leo-rating-calculator.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    check-rankings
```

### Билл — анализ конкурента

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bill-seo-strategist.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    analyze: BrokerChooser
```

### Билл — URL-стратегия для категории

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bill-seo-strategist.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    url-strategy: country-rankings
```

### Билл — SEO-аудит страницы

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bill-seo-strategist.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    onpage: RankingPage
```

### Билл — аудит конверсии страницы

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/bill-seo-strategist.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    cro: RankingPage
```

### Барбара — аудит шаблона страницы

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/barbara-designer.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    audit: RankingPage
```

### Барбара — редизайн шаблона

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/barbara-designer.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    redesign: BrokerReview
```

### Барбара — UX/UI ревью файла

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    Прочитай свои инструкции из файла agents/barbara-designer.md и выполни задание.
    Рабочая директория проекта: /Users/yegorbarakovskiy/Desktop/ratedbrokers
    review: src/pages/RankingPage.jsx
```

## Типичные сценарии

### Полный цикл обновления брокера
1. **Джон** → собирает свежие данные с интернета, обновляет MD
2. **Боб** → проверяет данные, аппрувит или отклоняет
3. **Лео** → пересчитывает скоринг на основе аппрувленных данных
4. `npm run brokers:validate` → валидация
5. `npm run brokers:build` → пересборка JS

### Еженедельная проверка актуальности
1. **Боб** с командой `weekly-check` → находит устаревшие данные
2. **Джон** → обновляет брокеров из списка Боба
3. **Боб** → аппрувит обновления
4. **Лео** → пересчитывает скоры если данные изменились

### Массовый пересчёт рейтингов
1. **Лео** с командой `all` → пересчитывает все 38 брокеров
2. **Лео** с командой `check-rankings` → проверяет порядок в рейтингах
3. `npm run brokers:validate` → валидация
4. `npm run brokers:build` → пересборка JS

## Что обновляет каждый агент

| Поле | Джон | Боб | Лео | Барбара | Билл |
|------|------|-----|-----|---------|------|
| min_deposit, spread, leverage... | ✓ | — | — | — | — |
| regulations | ✓ | — | — | — | — |
| tp, tp_count | ✓ | — | — | — | — |
| platforms, instruments | ✓ | — | — | — | — |
| hq, ceo | ✓ | — | — | — | — |
| status | ✓ | ✓ (under-review) | — | — | — |
| last_verified | ✓ | ✓ (аппрув) | — | — | — |
| score | — | — | ✓ | — | — |
| verdict | — | — | ✓ | — | — |
| scores (6 критериев) | — | — | ✓ | — | — |
| Markdown body | — | — | — | — | — |
| JSX шаблоны (стили, layout) | — | — | — | ✓ | — |
| Компоненты UI | — | — | — | ✓ | — |
| SEO-стратегия, URL-архитектура | — | — | — | — | ✓ |
| CTA/CRO рекомендации | — | — | — | — | ✓ |
| Конкурентный анализ | — | — | — | — | ✓ |

## Валидация

```bash
npm run brokers:validate   # проверить все MD-файлы
npm run brokers:build      # пересобрать JS из MD
```

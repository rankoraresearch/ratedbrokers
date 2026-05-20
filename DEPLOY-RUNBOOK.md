# Deploy Runbook

Как безопасно выкатывать и откатывать `ratedbrokers.com`. Прочитать ПЕРЕД любым `git push origin main`.

## Золотые правила

1. **Никогда `git revert -m 1 <merge>` на main.** Revert оставляет merge в DAG, но содержимое откатывает. Повторный `git merge <branch>` ту же ветку **не вернёт контент** — git считает всё уже мержнутым. Нужен revert-the-revert (`git revert <revert-hash>`) или cherry-pick — это путает историю. Лучше: новый forward-fix commit.
2. **Stale-tab защита уже встроена** (`src/main.jsx` — `vite:preloadError` handler). Не удалять. Без неё любой deploy с новыми chunk hash'ами = белый экран у открытых вкладок.
3. **Preview deploy перед prod merge** для любых структурных изменений (новые файлы, удаление файлов, смена lucide иконок). Просто push ветку в origin — Cloudflare автоматически даст URL `<branch>.ratedbrokers.pages.dev`.
4. **Safepoint tag перед каждым merge в main**: `git tag safepoint-YYYY-MM-DD-HHMM main` до push.
5. **При удалении файла — сразу grep импортов**: `grep -rn "./pages/<name>" src/`. Prod tree-shake'ит через `import.meta.env.DEV`, dev ломается жёстко.
6. **Freshness Pipeline коммитит сам.** Если видишь странные коммиты `refresh: monthly YYYY-MM (N brokers updated)` от `Джон/Боб/Лео <*@ratedbrokers.local>` — это автоматический pipeline. Не пытаться откатывать без понимания контекста — открой `https://api.ratedbrokers.com/api/admin/refresh/dashboard` чтобы увидеть pipeline_run, инициировавший коммит. Полный deploy-протокол: `FRESHNESS-DEPLOY-RUNBOOK.md`.

## Стандартный deploy (low-risk fix)

```bash
# Локальный билд проверить
npm run build
# Должен завершиться "✓ built in Ns" без ошибок

# Коммит + push
git add <files>
git commit -m "..."
git push origin main
```

Cloudflare Pages автобилд ~2-3 мин. Проверить https://ratedbrokers.com через hard-refresh (Cmd+Shift+R).

## Рискованный deploy (feature/рефакторинг)

```bash
# 1. Фича на отдельной ветке
git checkout -b feat/xxx main
# ... работа ...
git push origin feat/xxx

# 2. Preview URL: https://feat-xxx.ratedbrokers.pages.dev
#    Проверить все ключевые страницы визуально + console на 0 errors

# 3. Safepoint tag
git tag safepoint-$(date +%Y-%m-%d-%H%M) main
git push origin --tags

# 4. Merge в main (no-ff чтобы легко откатить)
git checkout main
git merge --no-ff feat/xxx -m "Merge feat/xxx: <summary>"
git push origin main

# 5. Мониторить 15 мин — если белый экран/500 → rollback
```

## Rollback по уровням риска

### Level 1 — откат последнего commit (safest)
```bash
git revert HEAD
git push origin main
```

### Level 2 — откат merge commit
```bash
# НЕ для main если собираешься ре-мержить (см. золотое правило #1)
# Для maintenance-фикса на пушнутой ерунде — ok
git revert -m 1 <merge-hash>
git push origin main
```

### Level 3 — safepoint reset (ядерный, destructive)
```bash
git reset --hard safepoint-YYYY-MM-DD-HHMM
git push --force-with-lease origin main
# Требует ручного подтверждения Егора!
```

## Известные режимы отказа

### A. Белый экран после deploy (MIME error на chunks)
**Симптом:** console: `Failed to load module script: MIME type text/html` для `*.js` файлов (обычно lucide `target-*.js`, `sparkles-*.js`).
**Причина:** stale-tab. Браузер держит старый `index.html` с ссылками на chunks из прошлого билда. Новый билд удалил эти chunks → Cloudflare Pages отдаёт `index.html` как SPA-fallback → браузер парсит HTML как JS.
**Защита:** handler в `src/main.jsx` ловит `vite:preloadError` и делает `window.location.reload()` с sessionStorage guard.
**Если handler не сработал** (пользователь на самом старом индексе без handler'а) — посоветовать hard-refresh (Cmd+Shift+R).

### B. Revert-the-revert путаница
**Симптом:** смержил ветку в main, через 10 мин revert'нул, потом хочешь вернуть ту же работу → `git merge <branch>` = «Already up-to-date» но контента нет.
**Причина:** git считает revert'нутый merge уже обработанным. DAG и content расходятся.
**Решение:** `git revert <revert-commit>` создаёт «revert of revert» → контент возвращается. Или cherry-pick конкретные коммиты из ветки.

### C. Vite dev-overlay «чёрный экран»
**Симптом:** localhost показывает чёрный фон, сверху текст ошибки.
**Причина:** error overlay (Vite plugin:vite:import-analysis). Обычно missing import.
**Решение:** исправить missing import → Vite HMR автоматически уберёт overlay. Временно отключить: `server.hmr.overlay: false` в `vite.config.js`.

### D. Два Vite процесса на соседних портах
**Симптом:** браузер на `localhost:5174` получает raw JSX вместо transformed.
**Причина:** после `git checkout` между ветками не остановили Vite. Новый `npm run dev` поднял второй инстанс, кеш модулей рассинхронизировался.
**Решение:** `lsof -i :5173 -i :5174` → `kill <pid>` всем vite процессам → `npm run dev`.

## Чек-лист перед push в main

- [ ] `npm run build` прошёл без ошибок
- [ ] Удалил файлы → погрепал импорты, нет мёртвых refs
- [ ] Новые lucide иконки? → stale-tab riск выше, preview deploy обязателен
- [ ] Safepoint tag поставлен
- [ ] У Егора получено явное «push» или «mergeh»

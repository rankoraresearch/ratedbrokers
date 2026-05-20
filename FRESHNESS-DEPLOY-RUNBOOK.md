# Freshness Pipeline — Deploy Runbook

**Status:** ready for first production deploy as of 2026-05-20.
**Feature branch:** `freshness-pipeline-s0-s6` on origin (NOT merged to main).
**Codex history:** S0-S8 all reached APPROVED 10/10 (history in git log + chat transcript).

This runbook is for **Yegor** to execute when ready to ship the Freshness Pipeline to production. Steps are **sequential**. Do not skip any. If a step fails, stop and ask Claude before improvising.

---

## 0. Pre-flight (5 min)

### 0.1 Confirm branch state
```bash
cd /Users/yegorbarakovskiy/Desktop/ratedbrokers
git fetch origin
git checkout freshness-pipeline-s0-s6
git status   # should be clean OR only have non-freshness files
git log --oneline origin/main..HEAD   # expect 2 commits: 004f387 + ae0f626
```

### 0.2 Verify local smoke still passes
```bash
cd backend
npx wrangler dev --port 8788 --local &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8788/api/admin/refresh/dashboard?key=dev-test-key"
# expect 200
kill $(pgrep -f "wrangler dev --port 8788")
```

### 0.3 Verify Anthropic + GitHub secrets are still active
- Open https://platform.claude.com → ensure ANTHROPIC_API_KEY hasn't been revoked.
- Open https://github.com/settings/personal-access-tokens → ensure GitHub PAT is still there.

If either is missing → revoke the old one + create a new one BEFORE proceeding (see Section 6 for the leaked-key story).

---

## 1. Apply D1 migration to PRODUCTION (5 min)

This is the only **irreversible** step. Take a backup snapshot in Cloudflare D1 dashboard first if you want belt-and-suspenders.

```bash
cd /Users/yegorbarakovskiy/Desktop/ratedbrokers/backend
npx wrangler d1 execute ratedbrokers --remote --file=migrations/004-freshness-pipeline.sql
```

Expected output: 6 `CREATE TABLE` + 6 indexes + 1 INSERT into schema_migrations. Look for `"success": true` in each step.

**Verify:**
```bash
npx wrangler d1 execute ratedbrokers --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('pipeline_runs','agent_runs','agent_findings','score_history','signals','broker_status') ORDER BY name;"
# expect all 6 tables listed
```

If any table is missing → STOP. Do not proceed.

---

## 2. Push secrets to production Worker (3 min)

In the **backend/** directory of your local repo:

```bash
cd /Users/yegorbarakovskiy/Desktop/ratedbrokers/backend

# Anthropic API key (paste from platform.claude.com)
npx wrangler secret put ANTHROPIC_API_KEY

# GitHub PAT (paste from github.com/settings/personal-access-tokens)
npx wrangler secret put GITHUB_TOKEN

# Static config
npx wrangler secret put GITHUB_REPO
# paste: rankoraresearch/ratedbrokers

npx wrangler secret put GITHUB_BRANCH
# paste: freshness-test
# ☝️ IMPORTANT: starts as freshness-test (safety branch). We move to 'main' AFTER first successful run.
```

**NEVER paste any of these into chat.** They go into wrangler's secret prompt only.

**Verify:**
```bash
npx wrangler secret list
# should show all 4 secrets above (+ existing API_KEY, TURNSTILE_SECRET).
```

If FRESHNESS_TEST_MODE was previously set in wrangler.toml [vars] or as a secret — **delete it** for production:
```bash
npx wrangler secret delete FRESHNESS_TEST_MODE   # ignore "not found"
```
We want production to use real Claude API (not stubs). `wrangler.toml` doesn't set it as a var, so this is just a precaution.

---

## 3. Deploy the Worker (2 min)

```bash
cd /Users/yegorbarakovskiy/Desktop/ratedbrokers/backend
npx wrangler deploy
```

Expected: `Deployed ratedbrokers-api triggers (1 hour cron, 0 routes)` + a URL.

**Verify:**
```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://api.ratedbrokers.com/api/admin/refresh/dashboard?key=$ADMIN_KEY"
# expect 200
```

Open in browser:
**https://api.ratedbrokers.com/api/admin/refresh/dashboard?key=YOUR_ADMIN_KEY**

Should render the Freshness dashboard (empty — no runs yet on prod).

---

## 4. First production pipeline run (~3-5 hours wall-clock)

### 4.1 Pilot on TOP-3 brokers only first

Edit `backend/src/routes/freshness.js` temporarily to limit to top-3:

```js
// In handleStartRefresh, line ~325:
const slugs = (await listAllBrokerSlugs(env)).slice(0, 3);  // PILOT MODE
```

Re-deploy: `npx wrangler deploy`.

### 4.2 Click "Start Monthly Refresh" in the dashboard

The pipeline will now make REAL Claude API calls. Cost: ~$2-5 for 3 brokers.

Watch the active-run progress bar (auto-polls every 3s). Should settle in 5-10 minutes.

If anything fails:
- Check Cloudflare Worker logs: `npx wrangler tail`
- Look for stage errors in the dashboard
- If pipeline is stuck — POST to `/api/admin/refresh/tick` manually with admin key
- If a run is dead — DELETE from D1 manually: `wrangler d1 execute ratedbrokers --remote --command "DELETE FROM pipeline_runs WHERE status IN ('pending','running')"`

### 4.3 Review findings in approval-UI

Should see 1-9 findings across the 3 brokers (depends on what Claude finds via web_search). Each finding has a source_url — open them, sanity-check.

### 4.4 Approve a small subset (e.g. 2-3 findings)

- Use the filter to pick low-risk findings first (no critical, no Δ≥0.3).
- Click "Approve Selected & Publish".

The Worker will now:
1. Write changes to MD files in `content/brokers/*.md`
2. Commit to the `freshness-test` branch on GitHub
3. Return success with `commit_sha`

### 4.5 Verify the commit on GitHub
- Go to https://github.com/rankoraresearch/ratedbrokers/tree/freshness-test
- The commit should be there: `refresh: monthly 2026-05 (N brokers updated)`
- Open the MD file diff and inspect: only the approved fields changed; `last_verified` updated; body untouched.

If anything looks wrong — close the PR/delete the branch on GitHub. The pipeline can be retried.

### 4.6 Promote to `main` branch

Once you're happy with the pilot:

```bash
# Revert pilot scoping in freshness.js
git diff   # check pilot edit
# remove the .slice(0, 3) — restore to full broker set

# Update GITHUB_BRANCH secret to point to main
npx wrangler secret put GITHUB_BRANCH
# paste: main

# Re-deploy
npx wrangler deploy
```

Now real refresh runs will commit straight to `main` and Cloudflare Pages will auto-deploy the site.

---

## 5. First full production run (~3-5 hours)

Same flow as Section 4 but full 38 brokers. Cost: ~$30. Expect 50-80 findings; ~30-40 commit.

**Recommended schedule:** kick off at end-of-business so it runs overnight → review next morning.

After approve → Cloudflare Pages picks up the commit → site auto-deploys → www.ratedbrokers.com shows updated data within 5 minutes.

---

## 6. Revoke leaked secrets (MANDATORY before sharing key with anyone)

Two secrets were pasted into chat during development and need replacement:

### 6.1 Anthropic API key
1. Open https://platform.claude.com/dashboard → API Keys
2. Find the original key (likely named `default` or your initial key)
3. **Delete / Revoke**
4. Create a new key
5. Re-run: `npx wrangler secret put ANTHROPIC_API_KEY` with the new value

### 6.2 GitHub PAT
1. Open https://github.com/settings/personal-access-tokens
2. Find `ratedbrokers-freshness-pipeline`
3. **Delete / Revoke**
4. Create a new PAT (same scopes: Contents:Read+Write on `rankoraresearch/ratedbrokers`)
5. Re-run: `npx wrangler secret put GITHUB_TOKEN` with the new value

---

## 7. Merge feature branch to `main` (optional, after first successful production cycle)

The feature branch `freshness-pipeline-s0-s6` is currently divergent from main by 2 commits (S0-S6 + S5+S7+S8). After at least one full successful production cycle, merge it back to keep history clean:

```bash
git checkout main
git pull
git merge --no-ff freshness-pipeline-s0-s6 -m "merge: Freshness Pipeline S0-S8 (production-validated)"
git push origin main
```

Note: production was already running off the feature-branch deploy. The merge is for git-history cleanliness, not functional.

---

## 8. Update docs (after merge)

Update these files to point at the live system:

**CLAUDE.md** — add row to the file table:
```
| `FRESHNESS-PIPELINE-SPEC.md` | Spec for the auto-refresh subsystem |
| `FRESHNESS-DEPLOY-RUNBOOK.md` | This file — production deploy steps |
```

**memory/status.md** — add Freshness section under "Backend / completed":
- 2026-05-20: Freshness Pipeline S0-S8 live in production. Manual monthly trigger via admin dashboard. Daily watchdogs running (regulator + news + link-health).

**DEPLOY-RUNBOOK.md** — add bullet under "Deploy golden rules":
- 6. **Freshness Pipeline commits land via Worker, not human**. If you see weird `refresh: monthly YYYY-MM` commits — that's the auto-pipeline. Open `/api/admin/refresh/dashboard` to inspect the underlying run.

---

## Troubleshooting cheat-sheet

| Symptom | Cause | Fix |
|---|---|---|
| `/start` returns 409 | An active run already exists | `wrangler d1 execute ratedbrokers --remote --command "SELECT id, status FROM pipeline_runs WHERE status IN ('pending','running','awaiting_approval')"` — reject it via /api/admin/refresh/:id/reject or delete row |
| Pipeline stuck in `running` | Self-tick failed | Manually POST /api/admin/refresh/tick with admin key. Hourly cron will also recover. |
| Approve returns "commit failed" | GITHUB_TOKEN missing / expired / wrong scopes | Recheck secret, ensure Contents:Read+Write on the repo |
| Approve returns "DKIM/SPF" error | MailChannels rejects sender domain | Configure DNS DKIM+SPF for `ratedbrokers.com` per https://github.com/MailChannels/mailchannels-cloudflare-worker docs. Email failures don't block publish — they just log. |
| News watchdog returns 0 findings | Claude API web_search disabled or model rejected | Check `wrangler tail` for `[CRON] news watchdog` errors |
| Brokers archived unexpectedly | John flagged is_critical incorrectly | `POST /api/admin/broker-status/:slug/unarchive` |

---

## Cost monitoring

- Anthropic spending: https://platform.claude.com/billing
- Recommended monthly cap: **$100** (covers monthly refresh + watchdogs with 3x headroom)
- If cap is hit → set lower in Anthropic dashboard; the Worker will start returning errors but won't crash

---

## When in doubt: ask Claude

Re-open a Claude Code session pointed at this repo and say:

> «Freshness pipeline в проде упало на шаге X, вот лог: ...»

Claude has full context via this runbook + `FRESHNESS-PIPELINE-SPEC.md` + git history.

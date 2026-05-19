/**
 * GitHub Git Data API client — used by Freshness Pipeline S6 to commit
 * approved MD changes into the project repo as ONE atomic commit per refresh.
 *
 * Spec: FRESHNESS-PIPELINE-SPEC.md §8 (MD Writing & Git Integration).
 *
 * Why Git Data API, not Contents API? Contents API only updates one file per
 * commit; we need N broker MDs in a single "refresh: monthly YYYY-MM" commit.
 * Git Data API lets us build a tree + commit + ref update by hand.
 *
 * Auth: bearer token via env.GITHUB_TOKEN (Cloudflare secret).
 * Target: env.GITHUB_REPO ("owner/name") on env.GITHUB_BRANCH (default 'main').
 *
 * All requests use User-Agent because GitHub requires it.
 */

const API_BASE = 'https://api.github.com';
const USER_AGENT = 'ratedbrokers-freshness/1.0';

// Path component validator. Used to ensure callers (md-writer) cannot construct
// a repo path that escapes the intended namespace (e.g. `../../etc/passwd.md`)
// even if the input came from a "trusted" source like our brokers table.
// (Codex S6 H3 — defense in depth.)
const SAFE_PATH_SEGMENT_RE = /^[a-zA-Z0-9._-]+$/;

export function assertSafePathSegment(segment, name = 'path segment') {
  if (typeof segment !== 'string' || segment.length === 0 || segment.length > 200) {
    throw new Error(`Invalid ${name}: must be non-empty string ≤ 200 chars`);
  }
  if (!SAFE_PATH_SEGMENT_RE.test(segment)) {
    throw new Error(`Invalid ${name}: must match ^[a-zA-Z0-9._-]+$ (got: ${segment.slice(0, 50)})`);
  }
  if (segment === '.' || segment === '..') {
    throw new Error(`Invalid ${name}: reserved value '${segment}'`);
  }
}

function requireConfig(env) {
  if (!env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is missing — `wrangler secret put GITHUB_TOKEN`');
  if (!env.GITHUB_REPO)  throw new Error('GITHUB_REPO is missing  — set "owner/repo" via `wrangler secret put GITHUB_REPO`');
  if (!/^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPO)) {
    throw new Error(`GITHUB_REPO must look like "owner/repo", got: ${env.GITHUB_REPO}`);
  }
}

function headers(env) {
  return {
    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
    'Accept':        'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent':    USER_AGENT,
    'Content-Type':  'application/json',
  };
}

function getBranch(env) {
  return env.GITHUB_BRANCH || 'main';
}

async function gh(env, method, path, body) {
  requireConfig(env);
  const url = `${API_BASE}/repos/${env.GITHUB_REPO}${path}`;
  const init = { method, headers: headers(env) };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

// ─── Low-level wrappers ──────────────────────────────────────────────────

// GET /git/refs/heads/{branch} → { object: { sha } }
export async function getRef(env) {
  const branch = encodeURIComponent(getBranch(env));
  return gh(env, 'GET', `/git/refs/heads/${branch}`);
}

// GET /commits/{sha} → { tree: { sha } }
export async function getCommit(env, sha) {
  return gh(env, 'GET', `/git/commits/${encodeURIComponent(sha)}`);
}

// GET /contents/{path}?ref={branch} → { content (base64), sha, encoding }
// Returns null if 404.
//
// SECURITY: validates each path segment against ^[a-zA-Z0-9._-]+$ to prevent
// directory traversal. Callers must pre-construct the full path; this rejects
// anything that looks like an escape attempt.
export async function getFileContent(env, path) {
  requireConfig(env);
  if (typeof path !== 'string') throw new Error('path must be a string');
  for (const seg of path.split('/')) assertSafePathSegment(seg, 'path segment');
  const branch = encodeURIComponent(getBranch(env));
  const url = `${API_BASE}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${branch}`;
  const res = await fetch(url, { method: 'GET', headers: headers(env) });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub GET contents/${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  if (data.encoding !== 'base64' || typeof data.content !== 'string') {
    throw new Error(`Unexpected encoding for ${path}: ${data.encoding}`);
  }
  // Decode base64 with Node's Buffer (available via nodejs_compat).
  const buf = Buffer.from(data.content.replace(/\n/g, ''), 'base64');
  return { sha: data.sha, content: buf.toString('utf-8') };
}

// POST /git/blobs → { sha }
export async function createBlob(env, content) {
  // Encode as base64 to be safe with non-ASCII content. Workers have Buffer via nodejs_compat.
  const base64 = Buffer.from(content, 'utf-8').toString('base64');
  return gh(env, 'POST', '/git/blobs', { content: base64, encoding: 'base64' });
}

// POST /git/trees → { sha }
//
// `files` is an array of { path, blobSha } — each will become a tree entry
// inheriting from base_tree (so untouched files stay untouched).
export async function createTree(env, baseTreeSha, files) {
  const tree = files.map(f => ({
    path: f.path,
    mode: '100644',  // regular file
    type: 'blob',
    sha:  f.blobSha,
  }));
  return gh(env, 'POST', '/git/trees', { base_tree: baseTreeSha, tree });
}

// POST /git/commits → { sha }
export async function createCommit(env, message, treeSha, parentSha) {
  return gh(env, 'POST', '/git/commits', {
    message,
    tree:    treeSha,
    parents: [parentSha],
  });
}

// PATCH /git/refs/heads/{branch} → updates branch tip to point at commitSha
// Uses force=false (default) — fast-forward only. If branch advanced in the
// meantime, GitHub returns 422 and we surface the error.
export async function updateRef(env, commitSha) {
  const branch = encodeURIComponent(getBranch(env));
  return gh(env, 'PATCH', `/git/refs/heads/${branch}`, { sha: commitSha, force: false });
}

// ─── High-level: commit a batch of file replacements as one commit ──────
//
// files: Array<{ path: string, content: string }>
// message: commit message
// Returns the new commit SHA.
export async function commitFiles(env, files, message) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('commitFiles: no files to commit');
  }
  // SECURITY (Codex S6 H3): validate every path before any GitHub call.
  for (const f of files) {
    if (typeof f?.path !== 'string') throw new Error('commitFiles: file.path must be a string');
    for (const seg of f.path.split('/')) assertSafePathSegment(seg, 'file path segment');
    if (typeof f.content !== 'string') throw new Error(`commitFiles: file.content must be a string (path: ${f.path})`);
  }
  // SECURITY (Codex S6 H3): commit message must not contain raw control chars
  // that could inject extra trailers (Co-Authored-By, Signed-off-by, etc.).
  // Allow \n and \t which are normal in multi-line commit messages.
  if (typeof message !== 'string' || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)) {
    throw new Error('commitFiles: commit message contains illegal control characters');
  }

  // 1. Get current branch head + its tree.
  const ref = await getRef(env);
  const headCommitSha = ref.object?.sha;
  if (!headCommitSha) throw new Error('Could not read branch head SHA');
  const headCommit = await getCommit(env, headCommitSha);
  const baseTreeSha = headCommit.tree?.sha;
  if (!baseTreeSha) throw new Error('Could not read base tree SHA');

  // 2. Create one blob per file.
  const blobbed = [];
  for (const f of files) {
    const blob = await createBlob(env, f.content);
    blobbed.push({ path: f.path, blobSha: blob.sha });
  }

  // 3. Create a new tree on top of base.
  const tree = await createTree(env, baseTreeSha, blobbed);

  // 4. Create commit.
  const commit = await createCommit(env, message, tree.sha, headCommitSha);

  // 5. Move branch head.
  await updateRef(env, commit.sha);

  return { commit_sha: commit.sha, branch: getBranch(env), file_count: files.length };
}

// ─── Test-mode detection ────────────────────────────────────────────────
//
// MD writer should fall back to dry-run when GitHub creds are missing OR when
// FRESHNESS_TEST_MODE=1 (same toggle as agent runners). Loud failure if creds
// are partially set (one of token/repo) — that suggests a misconfiguration.
export function isGitDryRun(env) {
  if (env.FRESHNESS_TEST_MODE === '1') return true;
  if (!env.GITHUB_TOKEN && !env.GITHUB_REPO) return true;  // both missing = explicit dev
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    throw new Error('Partial GitHub config — set BOTH GITHUB_TOKEN and GITHUB_REPO, or unset both for dry-run.');
  }
  return false;
}

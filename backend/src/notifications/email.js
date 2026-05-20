/**
 * Email notifications via MailChannels (S8).
 *
 * MailChannels offers free transactional email for Cloudflare Workers — no
 * separate signup or API key required. We just POST to api.mailchannels.net.
 * https://developers.cloudflare.com/email-routing/email-workers/send-email/
 *
 * Triggers:
 *  - notifyRunComplete: when a pipeline_run flips to awaiting_approval
 *  - notifyCriticalSignal: when createSignal() returns created=true AND severity=critical
 *  - (future) weekly digest — out of S8 scope
 *
 * Recipient: env.NOTIFICATION_EMAIL (default egorbarakovskiy@gmail.com).
 * Sender: noreply@<sender-domain> — defaults to ratedbrokers.com but the
 * MailChannels relay only accepts senders the worker is authorised to send for
 * (configured via DNS DKIM/SPF on the sender domain; in dev we no-op).
 *
 * Test mode (FRESHNESS_TEST_MODE=1) → log instead of network call. Same toggle
 * we already use elsewhere keeps the behaviour predictable for local dev.
 */

const DEFAULT_RECIPIENT = 'egorbarakovskiy@gmail.com';
const DEFAULT_SENDER = 'noreply@ratedbrokers.com';
const DEFAULT_SENDER_NAME = 'RatedBrokers Freshness';
const MAILCHANNELS_URL = 'https://api.mailchannels.net/tx/v1/send';

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isTestMode(env) {
  // Same gate as agents/runner.js — explicit opt-in only.
  return env.FRESHNESS_TEST_MODE === '1';
}

function getRecipient(env) {
  return env.NOTIFICATION_EMAIL || DEFAULT_RECIPIENT;
}

function getSender(env) {
  return env.NOTIFICATION_SENDER || DEFAULT_SENDER;
}

/**
 * Low-level send.
 *
 * THROWS on transport/MailChannels failures (Codex S7+S8 H2). Previously
 * returned { sent: false, error } which callers ignored, so sender-domain or
 * DKIM/SPF misconfigurations dropped notifications silently.
 *
 * Successful send returns { sent: true, to, subject }.
 * Dry-run (FRESHNESS_TEST_MODE=1) returns { sent: false, dry_run: true, ... } — never throws.
 */
export async function sendEmail(env, { subject, text, html }) {
  if (!subject || typeof subject !== 'string') throw new Error('email subject is required');
  if (!text && !html) throw new Error('email text or html body is required');

  // Belt-and-suspenders: reject header-injection attempts in subject.
  if (/[\x00-\x08\x0a-\x1f\x7f]/.test(subject)) {
    throw new Error('subject contains illegal control characters');
  }
  const safeSubject = subject.slice(0, 300);
  const to = getRecipient(env);
  const from = getSender(env);

  if (isTestMode(env)) {
    console.log(`[email DRY-RUN] to=${to} subject="${safeSubject}"`);
    return { sent: false, dry_run: true, to, subject: safeSubject };
  }

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: DEFAULT_SENDER_NAME },
    subject: safeSubject,
    content: [
      ...(text ? [{ type: 'text/plain', value: String(text).slice(0, 60_000) }] : []),
      ...(html ? [{ type: 'text/html',  value: String(html).slice(0, 60_000) }] : []),
    ],
  };

  let res;
  try {
    res = await fetch(MAILCHANNELS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    // Network / DNS failure — surface to caller's try/catch.
    throw new Error(`MailChannels transport error: ${String(err?.message || err).slice(0, 200)}`);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    // Includes 401 (DKIM/SPF missing), 403, 5xx — all visible failures.
    throw new Error(`MailChannels ${res.status}: ${detail.slice(0, 200)}`);
  }
  return { sent: true, dry_run: false, to, subject: safeSubject };
}

// ─── High-level senders ──────────────────────────────────────────────────

function adminUrl(env, path) {
  // Best-effort root URL for action links in emails.
  const base = (env.FRONTEND_URL || 'https://ratedbrokers.com').replace('://', '://api.');
  return `${base}${path}`;
}

/**
 * Run-complete digest. Called when a pipeline_run transitions to
 * 'awaiting_approval' (see advanceCompletedRuns in routes/freshness.js).
 */
export async function notifyRunComplete(env, run) {
  if (!run || typeof run.id !== 'number') {
    console.error('[notify] runComplete called without a valid run');
    return { sent: false, error: 'invalid run' };
  }
  const subject = `Freshness Refresh #${run.id} — ready for review (${run.changes_count ?? 0} changes)`;
  const reviewUrl = adminUrl(env, `/api/admin/refresh/${run.id}/approve-ui`);
  const text =
`Pipeline run #${run.id} has completed Stages 1-4 and is now awaiting your review.

  Brokers scanned: ${run.total_brokers ?? 0}
  Brokers updated: ${run.brokers_done ?? 0}
  Failed brokers:  ${run.brokers_failed ?? 0}
  Findings:        ${run.changes_count ?? 0}

Review and approve: ${reviewUrl}

(This email is sent automatically by the Freshness Pipeline. Do not reply.)`;

  const html = `<p>Pipeline run <strong>#${esc(run.id)}</strong> is awaiting your review.</p>
<ul>
  <li>Brokers scanned: <strong>${esc(run.total_brokers ?? 0)}</strong></li>
  <li>Brokers updated: <strong>${esc(run.brokers_done ?? 0)}</strong></li>
  <li>Failed brokers: <strong>${esc(run.brokers_failed ?? 0)}</strong></li>
  <li>Findings: <strong>${esc(run.changes_count ?? 0)}</strong></li>
</ul>
<p><a href="${esc(reviewUrl)}">Review and approve →</a></p>
<p style="color:#888;font-size:11px">Automated message from the Freshness Pipeline.</p>`;
  return sendEmail(env, { subject, text, html });
}

/**
 * Critical signal alert. Called from createSignal when severity='critical' AND
 * an actually-new signal was inserted (not a dedup-skip).
 */
export async function notifyCriticalSignal(env, signal) {
  if (!signal || !signal.id) {
    console.error('[notify] criticalSignal called without a valid signal');
    return { sent: false, error: 'invalid signal' };
  }
  const broker = signal.broker_slug ? ` · ${signal.broker_slug}` : '';
  const subject = `🚨 CRITICAL [${signal.source}]${broker} — ${String(signal.message).slice(0, 80)}`;
  const dashUrl = adminUrl(env, '/api/admin/refresh/dashboard');
  const text =
`A critical Freshness signal has been raised.

  Source:   ${signal.source}
  Broker:   ${signal.broker_slug || '(site-wide)'}
  Severity: ${signal.severity}
  Message:  ${signal.message}
${signal.source_url ? `\n  Source URL: ${signal.source_url}` : ''}

Open dashboard: ${dashUrl}

(Automated alert from the Freshness Pipeline. Do not reply.)`;
  const html = `<p style="font-weight:bold;color:#c00">🚨 Critical Freshness signal</p>
<ul>
  <li><strong>Source:</strong> ${esc(signal.source)}</li>
  <li><strong>Broker:</strong> ${esc(signal.broker_slug || '(site-wide)')}</li>
  <li><strong>Severity:</strong> ${esc(signal.severity)}</li>
  <li><strong>Message:</strong> ${esc(signal.message)}</li>
  ${signal.source_url ? `<li><strong>Source:</strong> <a href="${esc(signal.source_url)}">${esc(signal.source_url)}</a></li>` : ''}
</ul>
<p><a href="${esc(dashUrl)}">Open dashboard →</a></p>
<p style="color:#888;font-size:11px">Automated alert.</p>`;
  return sendEmail(env, { subject, text, html });
}

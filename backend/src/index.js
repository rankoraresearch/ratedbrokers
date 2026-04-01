import { handleRedirect } from './routes/redirect.js';
import { handleStats, handleDashboard } from './routes/stats.js';
import { handleContact } from './routes/contact.js';
import { handleAdminList, handleAdminUpdate, handleAdminCreate, handleAdminDelete, handleAdminDashboard } from './routes/admin.js';
import { handleRankingsDashboard, handleRankingBrokers, handleRankingOrderUpdate, handleRankingOrderReset, handleRankingOrderPublic } from './routes/rankings.js';
import { handlePublishDashboard, handlePublishPages, handlePublishUpdate, handlePublishBatch, handlePublishAutoSchedule, handlePublishTick, handlePublishActive, handleSitemapIndex, handleSitemapSection } from './routes/publish.js';
import { handleMessagesDashboard, handleMessageDelete, handleLinkRecheck } from './routes/messages.js';
import { handleOptions } from './utils/cors.js';

export default {
  // Cron Trigger — runs every hour
  async scheduled(event, env, ctx) {
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');

    // 1. Auto-publish scheduled pages
    const pubResult = await env.DB.prepare(
      `UPDATE page_publish SET status = 'published', published_at = ? WHERE status = 'scheduled' AND scheduled_at <= ?`
    ).bind(nowStr, nowStr).run();

    if (pubResult.meta.changes > 0) {
      // Log to publish_log
      const published = await env.DB.prepare(
        `SELECT slug FROM page_publish WHERE published_at = ?`
      ).bind(nowStr).all();
      const slugList = published.results.map(p => p.slug);
      await env.DB.prepare(
        `INSERT INTO publish_log (action, count, slugs, triggered_by) VALUES (?, ?, ?, ?)`
      ).bind('auto-publish', pubResult.meta.changes, JSON.stringify(slugList), 'cron').run();
    }
    console.log(`[CRON] tick at ${nowStr} — published ${pubResult.meta.changes} pages`);

    // 2. Link Health check (once daily at 06:00 UTC)
    if (now.getUTCHours() === 6) {
      const brokers = await env.DB.prepare('SELECT slug, affiliate_url FROM brokers').all();
      for (const b of brokers.results) {
        try {
          const res = await fetch(b.affiliate_url, {
            method: 'HEAD', redirect: 'follow',
            headers: { 'User-Agent': 'RatedBrokers-LinkChecker/1.0' },
          });
          await env.DB.prepare(
            'INSERT INTO link_checks (broker_slug, status_code, ok) VALUES (?, ?, ?)'
          ).bind(b.slug, res.status, res.ok ? 1 : 0).run();
        } catch (err) {
          await env.DB.prepare(
            'INSERT INTO link_checks (broker_slug, status_code, ok, error) VALUES (?, ?, ?, ?)'
          ).bind(b.slug, 0, 0, err.message.slice(0, 200)).run();
        }
      }
      console.log(`[CRON] link check complete — ${brokers.results.length} brokers checked`);
    }
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Pass ctx for waitUntil support
    env.ctx = ctx;

    // CORS preflight for /api/*
    if (request.method === 'OPTIONS' && path.startsWith('/api/')) {
      return handleOptions(request);
    }

    // GET /go/:slug — redirect + click tracking
    const goMatch = path.match(/^\/go\/([a-z0-9-]+)$/);
    if (goMatch && request.method === 'GET') {
      return handleRedirect(request, env, goMatch[1]);
    }

    // GET /api/stats/dashboard — HTML dashboard
    if (path === '/api/stats/dashboard' && request.method === 'GET') {
      return handleDashboard(request, env);
    }

    // GET /api/stats — JSON stats
    if (path === '/api/stats' && request.method === 'GET') {
      return handleStats(request, env);
    }

    // POST /api/contact — contact form
    if (path === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    // GET /api/admin/dashboard — HTML admin panel
    if (path === '/api/admin/dashboard' && request.method === 'GET') {
      return handleAdminDashboard(request, env);
    }

    // GET /api/admin/brokers — list all brokers
    if (path === '/api/admin/brokers' && request.method === 'GET') {
      return handleAdminList(request, env);
    }

    // POST /api/admin/brokers — create broker
    if (path === '/api/admin/brokers' && request.method === 'POST') {
      return handleAdminCreate(request, env);
    }

    // PUT /api/admin/brokers/:slug — update broker
    const adminUpdateMatch = path.match(/^\/api\/admin\/brokers\/([a-z0-9-]+)$/);
    if (adminUpdateMatch && request.method === 'PUT') {
      return handleAdminUpdate(request, env, adminUpdateMatch[1]);
    }

    // DELETE /api/admin/brokers/:slug — delete broker
    if (adminUpdateMatch && request.method === 'DELETE') {
      return handleAdminDelete(request, env, adminUpdateMatch[1]);
    }

    // GET /api/admin/rankings/dashboard — HTML Ranking Manager
    if (path === '/api/admin/rankings/dashboard' && request.method === 'GET') {
      return handleRankingsDashboard(request, env);
    }

    // GET /api/admin/rankings/:id/brokers — brokers + overrides for ranking
    const rankingBrokersMatch = path.match(/^\/api\/admin\/rankings\/([a-z0-9-]+)\/brokers$/);
    if (rankingBrokersMatch && request.method === 'GET') {
      return handleRankingBrokers(request, env, rankingBrokersMatch[1]);
    }

    // PUT /api/admin/rankings/:id/order — save ranking order
    const rankingOrderMatch = path.match(/^\/api\/admin\/rankings\/([a-z0-9-]+)\/order$/);
    if (rankingOrderMatch && request.method === 'PUT') {
      return handleRankingOrderUpdate(request, env, rankingOrderMatch[1]);
    }

    // DELETE /api/admin/rankings/:id/overrides — reset ranking order
    const rankingOverridesMatch = path.match(/^\/api\/admin\/rankings\/([a-z0-9-]+)\/overrides$/);
    if (rankingOverridesMatch && request.method === 'DELETE') {
      return handleRankingOrderReset(request, env, rankingOverridesMatch[1]);
    }

    // GET /api/rankings/:id/order — public ranking order
    const rankingPublicMatch = path.match(/^\/api\/rankings\/([a-z0-9-]+)\/order$/);
    if (rankingPublicMatch && request.method === 'GET') {
      return handleRankingOrderPublic(request, env, rankingPublicMatch[1]);
    }

    // ─── Messages & Link Health ───

    // GET /api/admin/messages/dashboard — HTML Messages dashboard
    if (path === '/api/admin/messages/dashboard' && request.method === 'GET') {
      return handleMessagesDashboard(request, env);
    }

    // DELETE /api/admin/messages/:id — delete a message
    const msgDeleteMatch = path.match(/^\/api\/admin\/messages\/(\d+)$/);
    if (msgDeleteMatch && request.method === 'DELETE') {
      return handleMessageDelete(request, env, msgDeleteMatch[1]);
    }

    // POST /api/admin/messages/recheck/:slug — re-check single link
    const recheckMatch = path.match(/^\/api\/admin\/messages\/recheck\/([a-z0-9-]+)$/);
    if (recheckMatch && request.method === 'POST') {
      return handleLinkRecheck(request, env, recheckMatch[1]);
    }

    // ─── Publication Planner ───

    // GET /api/admin/publish/dashboard — HTML Publication Planner
    if (path === '/api/admin/publish/dashboard' && request.method === 'GET') {
      return handlePublishDashboard(request, env);
    }

    // GET /api/admin/publish/pages — JSON pages list
    if (path === '/api/admin/publish/pages' && request.method === 'GET') {
      return handlePublishPages(request, env);
    }

    // PUT /api/admin/publish/pages/:slug — update single page
    const publishUpdateMatch = path.match(/^\/api\/admin\/publish\/pages\/(.+)$/);
    if (publishUpdateMatch && request.method === 'PUT') {
      return handlePublishUpdate(request, env, publishUpdateMatch[1]);
    }

    // POST /api/admin/publish/batch — batch operations
    if (path === '/api/admin/publish/batch' && request.method === 'POST') {
      return handlePublishBatch(request, env);
    }

    // POST /api/admin/publish/auto-schedule — generate 16-week plan
    if (path === '/api/admin/publish/auto-schedule' && request.method === 'POST') {
      return handlePublishAutoSchedule(request, env);
    }

    // POST /api/admin/publish/tick — publish all due pages
    if (path === '/api/admin/publish/tick' && request.method === 'POST') {
      return handlePublishTick(request, env);
    }

    // GET /api/publish/active — PUBLIC: list of published slugs
    if (path === '/api/publish/active' && request.method === 'GET') {
      return handlePublishActive(request, env);
    }

    // GET /api/sitemap.xml — sitemap index
    if (path === '/api/sitemap.xml' && request.method === 'GET') {
      return handleSitemapIndex(request, env);
    }

    // GET /api/sitemap-{section}.xml — individual sitemaps
    const sitemapMatch = path.match(/^\/api\/sitemap-(reviews|rankings|subpages|static)\.xml$/);
    if (sitemapMatch && request.method === 'GET') {
      return handleSitemapSection(request, env, sitemapMatch[1]);
    }

    // 404
    return Response.json(
      { error: 'Not found' },
      { status: 404 }
    );
  },
};

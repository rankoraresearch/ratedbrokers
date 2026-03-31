import { handleRedirect } from './routes/redirect.js';
import { handleStats, handleDashboard } from './routes/stats.js';
import { handleContact } from './routes/contact.js';
import { handleAdminList, handleAdminUpdate, handleAdminCreate, handleAdminDelete, handleAdminDashboard } from './routes/admin.js';
import { handleRankingsDashboard, handleRankingBrokers, handleRankingOrderUpdate, handleRankingOrderReset, handleRankingOrderPublic } from './routes/rankings.js';
import { handleOptions } from './utils/cors.js';

export default {
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

    // 404
    return Response.json(
      { error: 'Not found' },
      { status: 404 }
    );
  },
};

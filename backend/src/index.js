import { handleRedirect } from './routes/redirect.js';
import { handleStats, handleDashboard } from './routes/stats.js';
import { handleContact } from './routes/contact.js';
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

    // 404
    return Response.json(
      { error: 'Not found' },
      { status: 404 }
    );
  },
};

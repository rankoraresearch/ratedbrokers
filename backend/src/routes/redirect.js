export async function handleRedirect(request, env, slug) {
  const broker = await env.DB.prepare(
    'SELECT affiliate_url FROM brokers WHERE slug = ?'
  ).bind(slug).first();

  if (!broker) {
    const frontendUrl = env.FRONTEND_URL || 'https://ratedbrokers.com';
    return Response.redirect(`${frontendUrl}/`, 302);
  }

  // Track click asynchronously — don't block the redirect
  const referrer = request.headers.get('Referer') || null;
  const country = request.headers.get('cf-ipcountry') || null;
  const userAgent = request.headers.get('User-Agent') || null;

  // Use waitUntil if available (production), otherwise fire-and-forget
  const trackClick = env.DB.prepare(
    'INSERT INTO clicks (broker_slug, referrer, country, user_agent) VALUES (?, ?, ?, ?)'
  ).bind(slug, referrer, country, userAgent).run();

  if (env.ctx && env.ctx.waitUntil) {
    env.ctx.waitUntil(trackClick);
  } else {
    trackClick.catch(() => {}); // fire-and-forget in dev
  }

  return Response.redirect(broker.affiliate_url, 302);
}

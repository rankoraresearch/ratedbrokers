import { corsHeaders } from '../utils/cors.js';

// Simple in-memory rate limiter: 10 messages per hour per IP
// Map resets on Worker restart (cold start), which is acceptable for basic protection.
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

export async function handleContact(request, env) {
  const headers = corsHeaders(request);

  // Rate limit check
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON' },
      { status: 400, headers }
    );
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Fields name, email, message are required' },
      { status: 400, headers }
    );
  }

  if (typeof name !== 'string' || name.length > 200) {
    return Response.json(
      { error: 'Name must be a string under 200 characters' },
      { status: 400, headers }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 320) {
    return Response.json(
      { error: 'Invalid email address' },
      { status: 400, headers }
    );
  }

  if (typeof message !== 'string' || message.length > 5000) {
    return Response.json(
      { error: 'Message must be under 5000 characters' },
      { status: 400, headers }
    );
  }

  await env.DB.prepare(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)'
  ).bind(name.trim(), email.trim(), message.trim()).run();

  return Response.json(
    { success: true, message: 'Message received' },
    { status: 200, headers }
  );
}

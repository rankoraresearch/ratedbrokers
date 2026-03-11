import { corsHeaders } from '../utils/cors.js';

export async function handleContact(request, env) {
  const headers = corsHeaders(request);

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

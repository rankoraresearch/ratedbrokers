/**
 * Lightweight /api/author/me endpoint — returns the caller's profile and scopes.
 * Sprint 3 deliverable; fuller submissions API lives in Sprint 4 (author-submissions.js).
 *
 * See AUTHOR-SUBMISSIONS-SPEC.md §6.1.
 */
import { corsHeaders } from '../utils/cors.js';
import { requireAuthor } from '../utils/authorAuth.js';

export async function handleAuthorMe(request, env) {
  const cors = corsHeaders(request);
  const { author, response } = await requireAuthor(request, env, cors);
  if (response) return response;

  return Response.json({
    id: author.id,
    name: author.name,
    email: author.email,
    role: author.role,
    defaultLang: author.defaultLang,
    scopes: author.scopes,
  }, { headers: { ...cors, 'Content-Type': 'application/json' } });
}

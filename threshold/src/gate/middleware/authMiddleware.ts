/**
 * CDS Auth Middleware — SEC-002 + SEC-007
 *
 * SEC-002: All /api/* routes (except /api/health) require:
 *   Authorization: Bearer <CDS_API_KEY>
 *   Returns 401 if missing or invalid.
 *   Sets res.locals['actor'] (AuthContext) on success.
 *
 * SEC-007: Route-tier enforcement — each route pattern carries a minimum tier
 *   requirement. Actor must meet or exceed it, or receives 403.
 *
 * Phase 0: Single CDS_API_KEY env var → governor tier (TIER_3).
 *           Every bearer token match yields a governor actor.
 * Phase 0.5: Expand to per-key registry mapping key → ActorKind + TierLevel.
 *
 * GATE LAW: Auth is not a convention. It is the mechanism.
 *   No bypass. No dev-mode override in code. If you need to test without auth,
 *   set CDS_API_KEY to a known value and pass it in the Bearer header.
 */

import type { Request, Response, NextFunction } from 'express';
import type { AuthContext, TierLevel } from '../../types.js';

// =============================================================================
// ROUTE TIER MAP (SEC-007)
// Minimum tier required to access each route pattern.
// Routes not listed default to TIER_1 (any authenticated actor).
// Patterns use :param notation — matched against actual paths at request time.
// =============================================================================

const ROUTE_TIER_MAP: Array<{ method: string; pattern: string; tier: TierLevel }> = [
  // Governor-level (TIER_2+) — read access to governance records and audit data
  { method: 'GET',   pattern: '/api/records',                  tier: 'TIER_2' },
  { method: 'GET',   pattern: '/api/records/:crId',            tier: 'TIER_2' },
  { method: 'GET',   pattern: '/api/audit',                    tier: 'TIER_2' },

  // ZF-cycle operations — Governor initiates, reviews, and injects
  { method: 'POST',  pattern: '/api/zf/cycle',                 tier: 'TIER_2' },
  { method: 'POST',  pattern: '/api/zf/cycles/:id/phase',      tier: 'TIER_2' },
  { method: 'GET',   pattern: '/api/zf/cycles',                tier: 'TIER_2' },
  { method: 'GET',   pattern: '/api/zf/cycles/:id',            tier: 'TIER_2' },
  { method: 'POST',  pattern: '/api/zf/inject',                tier: 'TIER_2' },
  { method: 'GET',   pattern: '/api/zf/injections',            tier: 'TIER_2' },

  // Park registry write — Governor action only
  { method: 'POST',  pattern: '/api/park',                     tier: 'TIER_2' },
  { method: 'PATCH', pattern: '/api/park/:parkId/status',      tier: 'TIER_2' },

  // TIER_1 defaults (classification, session, park read, checklists):
  // POST /api/classify, POST /api/clarify, POST /api/session/open,
  // GET  /api/park,
  // GET  /api/checklist/impl, POST /api/checklist/impl,
  // GET  /api/checklist/post, POST /api/checklist/post
  // — not listed here; the default branch in requiresTier() returns TIER_1
];

// =============================================================================
// TIER ORDERING
// =============================================================================

const TIER_RANK: Record<TierLevel, number> = {
  TIER_0: 0,
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
};

function meetsMinimumTier(actorTier: TierLevel, requiredTier: TierLevel): boolean {
  return TIER_RANK[actorTier] >= TIER_RANK[requiredTier];
}

/**
 * Match an incoming method + path against the route tier map.
 * :param segments match any single path segment (no slashes).
 * Returns the required tier for the matched pattern, or TIER_1 if no match.
 */
function requiredTierFor(method: string, path: string): TierLevel {
  for (const { method: m, pattern, tier } of ROUTE_TIER_MAP) {
    if (m !== method) continue;

    // Build a regex from the pattern: :param → [^/]+ (single segment, no slashes)
    const regexSource = '^' + pattern.replace(/:[\w]+/g, '[^/]+') + '/?$';
    if (new RegExp(regexSource).test(path)) return tier;
  }

  // Default: any authenticated actor may access routes not explicitly mapped
  return 'TIER_1';
}

// =============================================================================
// AUTH MIDDLEWARE
// Applied to all /api/* routes in server.ts EXCEPT /api/health.
// =============================================================================

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env['CDS_API_KEY'];

  // Misconfiguration check — surface immediately, not silently
  if (!apiKey) {
    console.error(
      '[auth] MISCONFIGURATION: CDS_API_KEY environment variable is not set. ' +
      'All protected API routes will reject until it is configured.'
    );
    res.status(503).json({
      ok: false,
      error: 'AUTH_NOT_CONFIGURED',
      detail: 'CDS_API_KEY environment variable is not set. Configure it before serving protected routes.',
    });
    return;
  }

  // Bearer token extraction
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      detail: 'Authorization: Bearer <CDS_API_KEY> header is required.',
    });
    return;
  }

  const token = authHeader.slice(7); // strip 'Bearer '

  if (token !== apiKey) {
    // Log without exposing the token
    console.warn(`[auth] Invalid bearer token on ${req.method} ${req.path}`);
    res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      detail: 'Invalid API key.',
    });
    return;
  }

  // Valid — build AuthContext
  // Phase 0: single key → governor. Phase 0.5: key registry maps key → actor.
  const actor: AuthContext = {
    actor_kind: 'governor',
    tier:       'TIER_3',
    identity:   'governor',
    authenticated: true,
  };

  res.locals['actor'] = actor;

  // SEC-007 — Tier enforcement
  const required = requiredTierFor(req.method, req.path);

  if (!meetsMinimumTier(actor.tier, required)) {
    res.status(403).json({
      ok: false,
      error: 'INSUFFICIENT_TIER',
      detail: `Route ${req.method} ${req.path} requires ${required}. Actor tier is ${actor.tier}.`,
      required_tier: required,
      actor_tier:    actor.tier,
    });
    return;
  }

  next();
}

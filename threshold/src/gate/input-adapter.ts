/**
 * CDS Universal Input Adapter
 * Yariv amendment: "it should be allowing receiving any type of content"
 *
 * Accepts any format — free text, JSON, form data, document paste, COM-4, external API —
 * and normalizes it into a RawInput shape for the ICE engine.
 * The content is NEVER modified. The adapter only detects and labels.
 */

import type { RawInput, RawContentFormat, ActorContext } from '../types.js';

// What arrives at the HTTP layer
export interface HttpIncomingRequest {
  contentType: string;          // HTTP Content-Type header
  body: string | Buffer;        // Raw body
  sourcePath: string;           // From actor context
  declaredFormat?: string;      // Explicit format declaration (API paths)
}

// =============================================================================
// DETECT content format from HTTP Content-Type + body heuristics
// =============================================================================

function detectFormat(req: HttpIncomingRequest): RawContentFormat {
  // Explicit declaration takes priority (developer/API paths)
  if (req.declaredFormat) {
    return req.declaredFormat as RawContentFormat;
  }

  const ct = req.contentType.toLowerCase();

  // External AI path always uses external_api format
  if (req.sourcePath === 'external_ai') return 'external_api';

  // Internal agent path always uses COM-4 format
  if (req.sourcePath === 'internal_agent') return 'com4_format';

  // Structured JSON
  if (ct.includes('application/json')) {
    const text = req.body.toString();
    try {
      JSON.parse(text);
      return 'json_payload';
    } catch {
      // Falls through to text handling
    }
  }

  // Form data (gate UI submission)
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    return 'form_fields';
  }

  // Plain text — could be free-form entry or document paste
  if (ct.includes('text/plain') || ct.includes('text/')) {
    const text = req.body.toString();
    // Heuristic: if > 500 chars and contains multiple newlines, likely a document paste
    if (text.length > 500 && (text.match(/\n/g) ?? []).length > 5) {
      return 'document_paste';
    }
    return 'plain_text';
  }

  // Default: treat as plain text
  return 'plain_text';
}

// =============================================================================
// NORMALIZE to RawInput shape
// The content is preserved exactly. The adapter only structures the envelope.
// =============================================================================

function extractContent(req: HttpIncomingRequest, format: RawContentFormat): string {
  const raw = req.body.toString('utf-8');

  if (format === 'form_fields') {
    // Parse URL-encoded form and reconstruct as readable text
    try {
      const params = new URLSearchParams(raw);
      const entries: string[] = [];
      params.forEach((val, key) => entries.push(`${key}: ${val}`));
      return entries.join('\n');
    } catch {
      return raw;
    }
  }

  // For all other formats: preserve content exactly
  return raw;
}

export function normalizeInput(req: HttpIncomingRequest): RawInput {
  const format = detectFormat(req);
  const content = extractContent(req, format);

  return {
    format,
    content,
    content_type_hint: req.contentType,
    structured_fields: tryParseStructured(content, format),
  };
}

function tryParseStructured(
  content: string,
  format: RawContentFormat
): Record<string, unknown> | undefined {
  if (format !== 'json_payload' && format !== 'external_api' && format !== 'com4_format') {
    return undefined;
  }
  try {
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

// =============================================================================
// EXTRACT ActorContext from request headers + body
// =============================================================================

export interface ActorHeaders {
  'x-cds-actor-kind'?: string;
  'x-cds-source-path'?: string;
  'x-cds-identity'?: string;
  'x-cds-goal-ref'?: string;
  'x-cds-session-id'?: string;
  'x-cds-tenant-id'?: string;
  'x-cds-agent-id'?: string;
  authorization?: string;
}

export function extractActor(headers: ActorHeaders, body?: Record<string, unknown>): Partial<ActorContext> {
  // Headers take priority over body fields for actor context
  const actorKind = headers['x-cds-actor-kind'] ?? (body?.['actor_kind'] as string) ?? 'external_user';
  const sourcePath = headers['x-cds-source-path'] ?? (body?.['source_path'] as string) ?? 'human_user';
  const identity   = headers['x-cds-identity']   ?? (body?.['identity'] as string)    ?? 'anonymous';
  const goalRef    = headers['x-cds-goal-ref']    ?? (body?.['goal_ref'] as string)    ?? undefined;
  const sessionId  = headers['x-cds-session-id']  ?? (body?.['session_id'] as string)  ?? undefined;
  const tenantId   = headers['x-cds-tenant-id']   ?? (body?.['tenant_id'] as string)   ?? undefined;
  const agentId    = headers['x-cds-agent-id']    ?? (body?.['agent_id'] as string)    ?? undefined;

  // Tier assignment based on actor kind
  const tierMap: Record<string, string> = {
    governor:      'TIER_3',
    developer:     'TIER_2',
    system_agent:  'TIER_2',
    tenant_admin:  'TIER_1',
    external_user: 'TIER_0',
  };

  return {
    actor_kind:          actorKind as ActorContext['actor_kind'],
    source_path:         sourcePath as ActorContext['source_path'],
    tier:                (tierMap[actorKind] ?? 'TIER_0') as ActorContext['tier'],
    identity,
    goal_ref:            goalRef,
    session_id:          sessionId,
    tenant_id:           tenantId,
    agent_registry_id:   agentId,
  };
}

// =============================================================================
// PROMPT INJECTION SCAN — borrowed from Csps scan-passed.md pattern (cleansed)
// Trust-tier-aware. Pattern-based Phase 0 scan.
// Semantic injection detection deferred to Phase 1 (Dual-LLM / CaMeL pattern).
// =============================================================================

export interface ScanResult {
  clean: boolean;
  patterns_checked: string[];
  flags: string[];
  trust_tier_note: string;
}

const INJECTION_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'ignore_previous_instructions', pattern: /ignore\s+previous\s+instructions/i },
  { name: 'system_prompt_override',       pattern: /system\s+prompt:/i },
  { name: 'persona_takeover',             pattern: /you\s+are\s+now\b/i },
  { name: 'base64_blob',                  pattern: /^[A-Za-z0-9+/]{100,}={0,2}$/m },
  { name: 'hidden_html_comments',         pattern: /<!--[\s\S]*?-->/g },
  { name: 'invisible_unicode',            pattern: /[​-‍﻿­]/g },
];

export function scanForInjection(content: string, actorKind: string): ScanResult {
  const flags: string[] = [];

  for (const { name, pattern } of INJECTION_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(name);
    }
  }

  // Trust-tier-aware calibration (from Csps provenance.md, cleansed)
  const trustNote = actorKind === 'governor' || actorKind === 'developer'
    ? 'trust_tier: high — pattern-only scan sufficient for this actor kind'
    : actorKind === 'external_user' || actorKind === 'tenant_admin'
    ? 'trust_tier: medium — pattern scan + semantic review recommended for production'
    : 'trust_tier: low — external content requires full quarantine protocol';

  return {
    clean: flags.length === 0,
    patterns_checked: INJECTION_PATTERNS.map(p => p.name),
    flags,
    trust_tier_note: trustNote,
  };
}

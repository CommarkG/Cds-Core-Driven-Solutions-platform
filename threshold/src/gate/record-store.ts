/**
 * CDS Classification Record Store
 * Stores CR-[YYMMDD]-[SEQ] records as JSON files.
 * File-based Phase 0 implementation — mirrors Csps intake system pattern (cleansed).
 * Phase 0.5: migrate to PostgreSQL (inheriting Csps/CSP Supabase pattern).
 *
 * Record IDs: CR-YYMMDD-001, CR-YYMMDD-002 ... (sequential, date-scoped, never reused)
 *
 * IMMUTABILITY (P4-APPEND-ONLY — FINDING-DATA-002 closed):
 *   CR records are written ONCE and never overwritten.
 *   State changes are stored as events in CR-[ID].events.json (append-only).
 *   updateRecord() is REMOVED. Use storeClassificationEvent() for all mutations.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ClassificationRecord, DashboardRecord, DashboardQuery, DashboardResponse } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECORDS_DIR = join(__dirname, '..', '..', '..', 'records');

// Ensure records directory exists — wrapped in try/catch (HAIKU-FAIL-001)
// Failure here is non-fatal to startup: health endpoint and static UI still serve.
// Record write operations will fail with clear errors if directory is unavailable.
if (!existsSync(RECORDS_DIR)) {
  try {
    mkdirSync(RECORDS_DIR, { recursive: true });
  } catch (err) {
    console.error(
      `[record-store] STARTUP FAILURE: Cannot create records directory at ${RECORDS_DIR}. ` +
      `Check filesystem permissions. Error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

// =============================================================================
// CR-ID GENERATION
// CR-YYMMDD-NNN — date-scoped, 3-digit sequence (padded), never reused
// =============================================================================

function todayPrefix(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

// In-memory counter — seeded from disk on first call for each date prefix, then
// incremented atomically in-process. Node.js single-threaded event loop makes
// in-memory mutation safe without locks: no two synchronous increments can interleave.
// (HAIKU-CONC-001 fix — replaces per-request readdirSync scan that could collide
//  under concurrent requests when two callers both read maxSeq=0 before either writes.)
const _crCounters: Map<string, number> = new Map();

function getAndIncrementCounter(prefix: string): number {
  if (!_crCounters.has(prefix)) {
    // Seed: scan existing files once for this prefix, then never scan again
    let maxSeq = 0;
    if (existsSync(RECORDS_DIR)) {
      const pattern = new RegExp(`^CR-${prefix}-(\\d+)\\.json$`);
      for (const file of readdirSync(RECORDS_DIR)) {
        const match = file.match(pattern);
        if (match) {
          const seq = parseInt(match[1], 10);
          if (seq > maxSeq) maxSeq = seq;
        }
      }
    }
    _crCounters.set(prefix, maxSeq);
  }
  const next = (_crCounters.get(prefix) ?? 0) + 1;
  _crCounters.set(prefix, next);
  return next;
}

export function generateCrId(): string {
  const prefix = todayPrefix();
  const seq = getAndIncrementCounter(prefix);
  return `CR-${prefix}-${String(seq).padStart(3, '0')}`;
}

// =============================================================================
// STORE a Classification Record
// =============================================================================

export function storeRecord(record: ClassificationRecord): void {
  const filePath = join(RECORDS_DIR, `${record.cr_id}.json`);
  writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');
}

// =============================================================================
// READ a Classification Record by CR-ID
// =============================================================================

export function getRecord(crId: string): ClassificationRecord | null {
  const filePath = join(RECORDS_DIR, `${crId}.json`);
  if (!existsSync(filePath)) return null;

  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as ClassificationRecord;
  } catch {
    return null;
  }
}

// =============================================================================
// CLASSIFICATION EVENTS — append-only ledger (P4-APPEND-ONLY / DATA-002 CLOSED)
//
// CR records are immutable after creation. State changes use events stored in
// CR-[ID].events.json (an array, appended to, never overwritten).
//
// Event types:
//   CLARIFIED      — /api/clarify resolved a NEED_CLARIFICATION record
//   SESSION_OPENED — /api/session/open injected the record to the AI session
// =============================================================================

export type ClassificationEventType = 'CLARIFIED' | 'SESSION_OPENED';

export interface ClassificationEvent {
  event_type: ClassificationEventType;
  occurred_at: string;
  data: Record<string, unknown>;
}

export function storeClassificationEvent(
  crId: string,
  eventType: ClassificationEventType,
  data: Record<string, unknown>
): ClassificationEvent {
  const eventsPath = join(RECORDS_DIR, `${crId}.events.json`);

  let events: ClassificationEvent[] = [];
  if (existsSync(eventsPath)) {
    try {
      events = JSON.parse(readFileSync(eventsPath, 'utf-8')) as ClassificationEvent[];
    } catch {
      events = [];
    }
  }

  const event: ClassificationEvent = {
    event_type: eventType,
    occurred_at: new Date().toISOString(),
    data,
  };

  events.push(event);

  // Write-to-temp then atomic rename — prevents a partial write leaving a corrupt
  // events file if the process is interrupted mid-write. (HAIKU-CONC-002 fix)
  const tempPath = `${eventsPath}.tmp`;
  writeFileSync(tempPath, JSON.stringify(events, null, 2), 'utf-8');
  renameSync(tempPath, eventsPath);

  return event;
}

export function getRecordEvents(crId: string): ClassificationEvent[] {
  const eventsPath = join(RECORDS_DIR, `${crId}.events.json`);
  if (!existsSync(eventsPath)) return [];
  try {
    return JSON.parse(readFileSync(eventsPath, 'utf-8')) as ClassificationEvent[];
  } catch {
    return [];
  }
}

export function hasEvent(crId: string, eventType: ClassificationEventType): boolean {
  return getRecordEvents(crId).some(e => e.event_type === eventType);
}

// Convenience: return the original CR merged with a computed view of its events
// (injected_to_ai_at from SESSION_OPENED, clarification_resolved from CLARIFIED)
export function getRecordWithEvents(crId: string): (ClassificationRecord & {
  injected_to_ai_at?: string;
  clarification_resolved?: boolean;
}) | null {
  const record = getRecord(crId);
  if (!record) return null;

  const events = getRecordEvents(crId);

  const sessionEvent = events.find(e => e.event_type === 'SESSION_OPENED');
  const clarifyEvent = events.find(e => e.event_type === 'CLARIFIED');

  return {
    ...record,
    ...(sessionEvent ? { injected_to_ai_at: sessionEvent.occurred_at } : {}),
    ...(clarifyEvent ? { clarification_resolved: true } : {}),
  };
}

// =============================================================================
// LIST records for Governor dashboard
// =============================================================================

export function listRecords(query: DashboardQuery): DashboardResponse {
  const allFiles = existsSync(RECORDS_DIR)
    // Exclude .events.json files — only scan base CR records
    ? readdirSync(RECORDS_DIR).filter(f => f.endsWith('.json') && !f.endsWith('.events.json'))
    : [];

  const allRecords: ClassificationRecord[] = [];

  for (const file of allFiles) {
    try {
      const raw = readFileSync(join(RECORDS_DIR, file), 'utf-8');
      allRecords.push(JSON.parse(raw) as ClassificationRecord);
    } catch {
      // Skip corrupt records
    }
  }

  // Sort newest first
  allRecords.sort((a, b) =>
    new Date(b.classified_at).getTime() - new Date(a.classified_at).getTime()
  );

  // Apply filters
  let filtered = allRecords;

  if (query.result_filter) {
    filtered = filtered.filter(r => r.classification_result === query.result_filter);
  }
  if (query.source_filter) {
    filtered = filtered.filter(r => r.source_path === query.source_filter);
  }
  if (query.since) {
    const sinceDate = new Date(query.since).getTime();
    filtered = filtered.filter(r => new Date(r.classified_at).getTime() >= sinceDate);
  }

  const total = filtered.length;

  // Pagination
  const offset = query.offset ?? 0;
  const limit  = query.limit  ?? 50;
  const page   = filtered.slice(offset, offset + limit);

  // Stats (computed on all filtered records, not just the page)
  const stats = computeStats(filtered);

  // Shape as dashboard records (lighter than full records)
  const records: DashboardRecord[] = page.map(r => ({
    cr_id:                    r.cr_id,
    classified_at:            r.classified_at,
    source_path:              r.source_path,
    actor_kind:               r.actor_kind,
    q1_type:                  r.q1_type,
    classification_result:    r.classification_result,
    classification_confidence: r.classification_confidence,
    q4_status:                r.q4_status,
    q5_routing_primary:       r.q5_routing_primary,
    raw_input_summary:        r.raw_input_summary,
    rules_applied:            r.rules_applied,
  }));

  return { records, total, stats };
}

function computeStats(records: ClassificationRecord[]) {
  const by_result: Record<string, number>  = {};
  const by_type: Record<string, number>    = {};
  const by_source: Record<string, number>  = {};
  const blocking_rules_fired: Record<string, number> = {};

  for (const r of records) {
    by_result[r.classification_result] = (by_result[r.classification_result] ?? 0) + 1;
    by_type[r.q1_type]                 = (by_type[r.q1_type] ?? 0) + 1;
    by_source[r.source_path]           = (by_source[r.source_path] ?? 0) + 1;

    for (const rule of r.rules_applied) {
      if (rule.outcome === 'FAIL') {
        blocking_rules_fired[rule.rule_id] = (blocking_rules_fired[rule.rule_id] ?? 0) + 1;
      }
    }
  }

  return { by_result, by_type, by_source, blocking_rules_fired };
}

// =============================================================================
// AUDIT — Check for classification record issues (0220 Section 7)
// =============================================================================

export interface AuditSummary {
  total_records: number;
  sessions_without_cr: number;   // Phase 0: always 0 (all sessions require CR)
  low_confidence_unreviewed: number;
  forced_escalation_items: number;
  quarantine_without_clearance: number;
  checked_at: string;
}

export function runAudit(): AuditSummary {
  const allFiles = existsSync(RECORDS_DIR)
    ? readdirSync(RECORDS_DIR).filter(f => f.endsWith('.json') && !f.endsWith('.events.json'))
    : [];

  let low_confidence_unreviewed = 0;
  let quarantine_without_clearance = 0;

  for (const file of allFiles) {
    try {
      const raw = readFileSync(join(RECORDS_DIR, file), 'utf-8');
      const r = JSON.parse(raw) as ClassificationRecord;

      // Check events file for SESSION_OPENED (record is immutable — no injected_to_ai_at on CR)
      const sessionOpened = hasEvent(r.cr_id, 'SESSION_OPENED');
      if (r.classification_confidence === 'LOW' && !sessionOpened) {
        low_confidence_unreviewed++;
      }
      if (r.classification_result === 'QUARANTINE' && !sessionOpened) {
        quarantine_without_clearance++;
      }
    } catch {
      // Skip
    }
  }

  return {
    total_records: allFiles.length,
    sessions_without_cr: 0,              // Gate enforcement prevents this
    low_confidence_unreviewed,
    forced_escalation_items: 0,          // Phase 0.5: check Park Registry
    quarantine_without_clearance,
    checked_at: new Date().toISOString(),
  };
}

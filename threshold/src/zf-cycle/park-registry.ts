/**
 * CDS ZF-Cycle — Park Registry (Live Implementation)
 *
 * Replaces the RULE-PARK stub (GOV-001).
 * Reads from threshold/data/park-registry.json at classification time.
 * RULE-PARK now checks a live source — not a hardcoded boolean.
 *
 * Prevention rule P5-LIVE-SOURCE applied here.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { ParkEntry, ParkRegistry } from './types.js';

const PARK_REGISTRY_PATH = join(process.cwd(), 'data', 'park-registry.json');

// =============================================================================
// READ PARK REGISTRY
// =============================================================================

function loadRegistry(): ParkRegistry {
  try {
    const raw = readFileSync(PARK_REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw) as ParkRegistry;
  } catch {
    // Registry missing — return empty (safe default: no forced escalation)
    return {
      _meta: {
        registry_id: 'CDS-PARK-REGISTRY-001',
        version: '2.0',
        last_updated: new Date().toISOString(),
        note: 'Empty registry — no park-registry.json found. Defaulting to no forced escalation.',
      },
      entries: [],
    };
  }
}

// =============================================================================
// RULE-PARK — Live check (called by rules.ts)
// Returns true if ANY OPEN entry has is_forced_escalation === true
// =============================================================================

export function checkForcedEscalation(): boolean {
  const registry = loadRegistry();
  return registry.entries.some(
    e => e.is_forced_escalation === true && e.status === 'OPEN'
  );
}

// =============================================================================
// GET ALL PARK ENTRIES
// =============================================================================

export function listParkEntries(filter?: {
  status?: ParkEntry['status'];
  is_forced_escalation?: boolean;
  tag?: string;
}): ParkEntry[] {
  const registry = loadRegistry();
  let entries = registry.entries;

  if (filter?.status) {
    entries = entries.filter(e => e.status === filter.status);
  }
  if (filter?.is_forced_escalation !== undefined) {
    entries = entries.filter(e => e.is_forced_escalation === filter.is_forced_escalation);
  }
  if (filter?.tag) {
    entries = entries.filter(e => e.tags.includes(filter.tag!));
  }

  return entries;
}

// =============================================================================
// GET SINGLE PARK ENTRY
// =============================================================================

export function getParkEntry(parkId: string): ParkEntry | null {
  const registry = loadRegistry();
  return registry.entries.find(e => e.park_id === parkId) ?? null;
}

// =============================================================================
// ADD PARK ENTRY
// =============================================================================

export function addParkEntry(entry: ParkEntry): void {
  const registry = loadRegistry();

  // Prevent duplicate park_ids
  const existing = registry.entries.find(e => e.park_id === entry.park_id);
  if (existing) {
    throw new Error(`Park entry ${entry.park_id} already exists. Use updateParkEntry() to modify.`);
  }

  registry.entries.push(entry);
  registry._meta.last_updated = new Date().toISOString();

  writeFileSync(PARK_REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
}

// =============================================================================
// UPDATE PARK STATUS (append-only status change — original entry preserved)
// =============================================================================

export function updateParkStatus(
  parkId: string,
  newStatus: ParkEntry['status'],
  closedAt?: string
): ParkEntry | null {
  const registry = loadRegistry();
  const entry = registry.entries.find(e => e.park_id === parkId);

  if (!entry) return null;

  entry.status = newStatus;
  if (newStatus === 'CLOSED' || newStatus === 'DEFERRED') {
    entry.closed_at = closedAt ?? new Date().toISOString();
  }

  registry._meta.last_updated = new Date().toISOString();
  writeFileSync(PARK_REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');

  return entry;
}

// =============================================================================
// NEXT PARK ID — sequential, date-scoped
// =============================================================================

export function generateParkId(): string {
  const registry = loadRegistry();
  const today = new Date();
  const yy = String(today.getFullYear()).slice(2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const prefix = `PARK-${dd}${mm}${yy}-`;

  const existing = registry.entries
    .filter(e => e.park_id.startsWith(prefix))
    .map(e => parseInt(e.park_id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));

  const maxSeq = existing.length > 0 ? Math.max(...existing) : 0;
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

// =============================================================================
// AUDIT — Park registry health for Gate audit (0220 Section 7)
// =============================================================================

export function auditParkRegistry(): {
  total_entries: number;
  open_count: number;
  forced_escalation_count: number;
  has_forced_escalation_blocking: boolean;
} {
  const registry = loadRegistry();
  const openEntries = registry.entries.filter(e => e.status === 'OPEN');
  const forcedEntries = openEntries.filter(e => e.is_forced_escalation);

  return {
    total_entries: registry.entries.length,
    open_count: openEntries.length,
    forced_escalation_count: forcedEntries.length,
    has_forced_escalation_blocking: forcedEntries.length > 0,
  };
}

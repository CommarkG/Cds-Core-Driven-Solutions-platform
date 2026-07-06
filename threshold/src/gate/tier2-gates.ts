/**
 * CDS Tier 2 Gates — Mechanical Audit Enforcement
 * RULE_THINKING_AUDIT: Ensure every AI decision has an audit trail
 * RULE_PHASE_COMPLETION_REQUIRES_AUDIT: Phase cannot close without proof of prior audit completion
 *
 * Source: Opus architectural specification (2026-07-05)
 * Status: IMPLEMENTATION
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export type AgentKind = 'haiku' | 'sonnet' | 'opus' | 'human';
export type DecisionIntent = 'produce_decision' | 'advisory_only';
export type AuditStatus = 'OPEN' | 'ZF_COMPLETE' | 'FINDINGS_OPEN' | 'HELD' | 'CORRUPTED';

export interface AuditRecord {
  audit_id: string;        // UUID
  phase: number;
  decision_ref: string;    // hash of decision triggering audit
  agent: AgentKind;
  audit_status: AuditStatus;
  findings_count: number;
  findings_open: number;
  held_by?: string;        // Governor id, required iff HELD
  hold_reason?: string;    // required iff HELD
  opened_at: string;       // ISO timestamp
  closed_at?: string;      // ISO timestamp, required iff ZF_COMPLETE or HELD
  checksum: string;        // integrity guard
}

export interface Gate1Request {
  agent: AgentKind;
  phase: number;
  decision_ref: string;
  intent: DecisionIntent;
}

export interface Gate1Response {
  allow: boolean;
  audit_id: string;
  audit_status?: AuditStatus;
  auto_opened?: boolean;
  held_by?: string;
  hold_reason?: string;
  risk_accepted?: boolean;
  reason?: string;
  requires_governor?: boolean;
}

export interface Gate2Request {
  phase: number;
  caller_role: string;
}

export interface Gate2Response {
  close: boolean;
  phase: number;
  target_phase: number;
  audits_verified?: number;
  held_count?: number;
  zf_count?: number;
  reason?: string;
  blocking_audits?: string[];
  corrupt_audits?: string[];
  requires_governor?: boolean;
}

// =============================================================================
// AUDIT RECORD PERSISTENCE (park-registry extension)
// =============================================================================

const DATA_DIR = join(process.cwd(), 'data');
const AUDIT_REGISTRY_PATH = join(DATA_DIR, 'audit-registry.json');

interface AuditRegistry {
  entries: AuditRecord[];
  last_modified: string;
}

function readAuditRegistry(): AuditRegistry {
  try {
    const data = readFileSync(AUDIT_REGISTRY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { entries: [], last_modified: new Date().toISOString() };
  }
}

function writeAuditRegistry(registry: AuditRegistry): void {
  const tmpPath = `${AUDIT_REGISTRY_PATH}.tmp.${randomBytes(4).toString('hex')}`;
  writeFileSync(tmpPath, JSON.stringify(registry, null, 2));
  // Atomic rename
  const { renameSync } = require('fs');
  renameSync(tmpPath, AUDIT_REGISTRY_PATH);
}

function calculateChecksum(record: Omit<AuditRecord, 'checksum'>): string {
  const sorted = JSON.stringify(record, Object.keys(record).sort());
  return crypto.createHash('sha256').update(sorted).digest('hex');
}

function verifyChecksum(record: AuditRecord): boolean {
  const { checksum: _, ...withoutChecksum } = record;
  const calculated = calculateChecksum(withoutChecksum);
  return calculated === record.checksum;
}

function generateAuditId(): string {
  return `aud-${Date.now()}-${randomBytes(4).toString('hex')}`;
}

// =============================================================================
// GATE 1: RULE_THINKING_AUDIT
// =============================================================================

export function evaluateGate1(request: Gate1Request): Gate1Response {
  // Input validation (reject before logic)
  if (!['haiku', 'sonnet', 'opus', 'human'].includes(request.agent)) {
    return { allow: false, audit_id: '', reason: 'INVALID_AGENT', requires_governor: false };
  }
  if (request.phase == null || request.phase < 0) {
    return { allow: false, audit_id: '', reason: 'INVALID_PHASE', requires_governor: false };
  }
  if (!request.decision_ref) {
    return { allow: false, audit_id: '', reason: 'MISSING_DECISION_REF', requires_governor: false };
  }
  if (!['produce_decision', 'advisory_only'].includes(request.intent)) {
    return { allow: false, audit_id: '', reason: 'INVALID_INTENT', requires_governor: false };
  }

  // Passthrough cases
  if (request.agent === 'human') {
    return { allow: true, audit_id: '', auto_opened: false };
  }
  if (request.intent === 'advisory_only') {
    return { allow: true, audit_id: '', auto_opened: false };
  }

  // Audit requirement path
  const registry = readAuditRegistry();
  const existingAudit = registry.entries.find(
    a => a.phase === request.phase && a.decision_ref === request.decision_ref
  );

  if (existingAudit) {
    // Verify checksum
    if (!verifyChecksum(existingAudit)) {
      return {
        allow: false,
        audit_id: existingAudit.audit_id,
        reason: 'CORRUPTED',
        requires_governor: true,
      };
    }

    // Evaluate status
    switch (existingAudit.audit_status) {
      case 'ZF_COMPLETE':
        return { allow: true, audit_id: existingAudit.audit_id, audit_status: 'ZF_COMPLETE' };
      case 'OPEN':
        return { allow: true, audit_id: existingAudit.audit_id, audit_status: 'OPEN' };
      case 'FINDINGS_OPEN':
        return {
          allow: false,
          audit_id: existingAudit.audit_id,
          reason: 'FINDINGS_OPEN',
          requires_governor: false,
        };
      case 'HELD':
        return {
          allow: true,
          audit_id: existingAudit.audit_id,
          audit_status: 'HELD',
          held_by: existingAudit.held_by,
          hold_reason: existingAudit.hold_reason,
          risk_accepted: true,
        };
      case 'CORRUPTED':
        return {
          allow: false,
          audit_id: existingAudit.audit_id,
          reason: 'CORRUPTED',
          requires_governor: true,
        };
    }
  }

  // Auto-open new audit
  const newAudit: AuditRecord = {
    audit_id: generateAuditId(),
    phase: request.phase,
    decision_ref: request.decision_ref,
    agent: request.agent,
    audit_status: 'OPEN',
    findings_count: 0,
    findings_open: 0,
    opened_at: new Date().toISOString(),
    checksum: '', // Will be calculated below
  };

  newAudit.checksum = calculateChecksum(newAudit);

  try {
    registry.entries.push(newAudit);
    registry.last_modified = new Date().toISOString();
    writeAuditRegistry(registry);

    return {
      allow: true,
      audit_id: newAudit.audit_id,
      audit_status: 'OPEN',
      auto_opened: true,
    };
  } catch {
    return {
      allow: false,
      audit_id: '',
      reason: 'WRITE_FAIL',
      requires_governor: true,
    };
  }
}

// =============================================================================
// GATE 2: RULE_PHASE_COMPLETION_REQUIRES_AUDIT
// =============================================================================

interface PhaseRegistry {
  entries: Array<{
    phase_number: number;
    audit_status: string;
    decision_count: number;
    [key: string]: any;
  }>;
  last_modified: string;
}

function readPhaseRegistry(): PhaseRegistry {
  try {
    const path = join(DATA_DIR, 'phase-registry.json');
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { entries: [], last_modified: new Date().toISOString() };
  }
}

export function evaluateGate2(request: Gate2Request): Gate2Response {
  // Input validation
  if (request.phase == null || request.phase < 0) {
    return { close: false, phase: request.phase, target_phase: -1, reason: 'INVALID_PHASE' };
  }

  // Permission check (simplified for now; in production, verify caller role)
  const allowedRoles = ['governor', 'phase_lead'];
  if (!allowedRoles.includes(request.caller_role)) {
    return {
      close: false,
      phase: request.phase,
      target_phase: -1,
      reason: 'PERMISSION_DENIED',
    };
  }

  // Determine target phase
  const targetPhase = request.phase === 0 ? 0 : request.phase - 1;

  // Get target phase's decision count
  const phaseRegistry = readPhaseRegistry();
  const targetPhaseEntry = phaseRegistry.entries.find(e => e.phase_number === targetPhase);
  const decisionCount = targetPhaseEntry?.decision_count ?? 0;

  // Get all audits for target phase
  const auditRegistry = readAuditRegistry();
  const audits = auditRegistry.entries.filter(a => a.phase === targetPhase);

  // No-findings case
  if (audits.length === 0) {
    if (decisionCount === 0) {
      return {
        close: true,
        phase: request.phase,
        target_phase: targetPhase,
        audits_verified: 0,
        held_count: 0,
        zf_count: 0,
      };
    } else {
      return {
        close: false,
        phase: request.phase,
        target_phase: targetPhase,
        reason: 'MISSING_AUDIT_TRAIL',
        requires_governor: true,
      };
    }
  }

  // Verify checksums
  const corruptedAudits: string[] = [];
  for (const audit of audits) {
    if (!verifyChecksum(audit)) {
      corruptedAudits.push(audit.audit_id);
    }
  }

  if (corruptedAudits.length > 0) {
    return {
      close: false,
      phase: request.phase,
      target_phase: targetPhase,
      reason: 'CORRUPTED',
      corrupt_audits: corruptedAudits,
      requires_governor: true,
    };
  }

  // Evaluate statuses
  const statuses = audits.map(a => a.audit_status);
  const validStatuses = ['ZF_COMPLETE', 'HELD'];
  const zfCompleteCount = statuses.filter(s => s === 'ZF_COMPLETE').length;
  const heldCount = statuses.filter(s => s === 'HELD').length;

  // Check if all are valid
  const allValid = statuses.every(s => validStatuses.includes(s));

  if (!allValid) {
    const blockingStatuses = ['OPEN', 'FINDINGS_OPEN', 'CORRUPTED'];
    const blockingAudits = audits
      .filter(a => blockingStatuses.includes(a.audit_status))
      .map(a => a.audit_id);

    const firstBlockingStatus = statuses.find(s => blockingStatuses.includes(s));
    return {
      close: false,
      phase: request.phase,
      target_phase: targetPhase,
      reason: firstBlockingStatus === 'OPEN' ? 'AUDIT_IN_FLIGHT' : 'UNRESOLVED_FINDINGS',
      blocking_audits: blockingAudits,
    };
  }

  // Verify HELD audits have required fields
  for (const audit of audits) {
    if (audit.audit_status === 'HELD' && (!audit.held_by || !audit.hold_reason)) {
      return {
        close: false,
        phase: request.phase,
        target_phase: targetPhase,
        reason: 'INVALID_HOLD',
        blocking_audits: [audit.audit_id],
        requires_governor: true,
      };
    }
  }

  // All audits are ZF_COMPLETE or valid HELD
  return {
    close: true,
    phase: request.phase,
    target_phase: targetPhase,
    audits_verified: audits.length,
    held_count: heldCount,
    zf_count: zfCompleteCount,
  };
}

// =============================================================================
// GATE 1 PRE-HOOK (wired into agent invocation path)
// =============================================================================

export function gate1PreHook(request: Gate1Request): Gate1Response {
  return evaluateGate1(request);
}

// =============================================================================
// GATE 2 TRANSITION GUARD (wired into state machine)
// =============================================================================

export function gate2TransitionGuard(request: Gate2Request): Gate2Response {
  return evaluateGate2(request);
}

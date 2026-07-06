/**
 * CDS ZF-Cycle — Insight Injection Engine
 *
 * Phase 4 of the ZF-Cycle: takes a reviewed insight and injects it as a
 * hardwired rule into one or more gate targets (prevention-rules, audit-scope,
 * impl checklist, post-check suite, etc.).
 *
 * RULE: Injection always APPENDS — never overwrites existing rules.
 * This is the mechanism by which audits make CDS smarter permanently.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type { InjectionRecord, InjectInsightRequest, InjectInsightResponse } from './types.js';

const INJECTION_TARGETS_PATH = join(process.cwd(), 'data', 'injection-targets.json');
const INJECTIONS_DIR         = join(process.cwd(), '..', 'reports', 'injections');

// =============================================================================
// INITIALIZATION
// =============================================================================

function ensureDirectories(): void {
  if (!existsSync(INJECTIONS_DIR)) mkdirSync(INJECTIONS_DIR, { recursive: true });
}

// =============================================================================
// INJ-ID GENERATION — INJ-YYMMDD-NNN
// =============================================================================

function generateInjId(): string {
  ensureDirectories();
  const today = new Date();
  const yy = String(today.getFullYear()).slice(2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const prefix = `INJ-${yy}${mm}${dd}-`;

  const existing = existsSync(INJECTIONS_DIR)
    ? readdirSync(INJECTIONS_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
        .map(f => parseInt(f.replace(prefix, '').replace('.json', ''), 10))
        .filter(n => !isNaN(n))
    : [];

  const maxSeq = existing.length > 0 ? Math.max(...existing) : 0;
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

// =============================================================================
// LOAD INJECTION TARGETS
// =============================================================================

function loadInjectionTargets(): { targets: Array<{
  id: string;
  label: string;
  file: string;
  type: string;
  phase: string;
  description: string;
  injected_rules: Array<{
    rule_id: string;
    source_finding: string;
    injected_at: string;
    rule: string;
    enforcement: string;
  }>;
}> } {
  try {
    return JSON.parse(readFileSync(INJECTION_TARGETS_PATH, 'utf-8'));
  } catch {
    throw new Error('injection-targets.json not found. Run server from threshold/ directory.');
  }
}

// =============================================================================
// INJECT INSIGHT INTO TARGETS
// =============================================================================

export function injectInsight(request: InjectInsightRequest): InjectInsightResponse {
  ensureDirectories();

  const targets = loadInjectionTargets();
  const injId = generateInjId();
  const now = new Date().toISOString();
  const updatedTargets: string[] = [];

  // Generate a rule_id from the ZF cycle and finding
  const ruleId = `INJECTED-${request.zf_id}-${now.slice(0, 10).replace(/-/g, '')}`;

  // Inject into each selected target
  for (const targetId of request.target_ids) {
    const target = targets.targets.find(t => t.id === targetId);
    if (!target) continue;

    // APPEND — never overwrite
    target.injected_rules.push({
      rule_id: ruleId,
      source_finding: request.zf_id,
      injected_at: now,
      rule: request.injection_rule,
      enforcement: 'ACTIVE',
    });

    updatedTargets.push(targetId);
  }

  // Save updated targets file
  writeFileSync(INJECTION_TARGETS_PATH, JSON.stringify(targets, null, 2), 'utf-8');

  // If PREVENT-RULES is in targets, also update prevention-rules.json
  if (request.target_ids.includes('PREVENT-RULES')) {
    try {
      const prevPath = join(process.cwd(), 'data', 'prevention-rules.json');
      const prevRules = JSON.parse(readFileSync(prevPath, 'utf-8')) as {
        rules: Array<{ rule_id: string; label: string; source_finding: string; added_at: string; statement: string; enforcement: string; status: string }>;
      };
      prevRules.rules.push({
        rule_id: ruleId,
        label: `Injected from ZF-Cycle ${request.zf_id}`,
        source_finding: request.zf_id,
        added_at: now,
        statement: request.injection_rule,
        enforcement: 'ACTIVE',
        status: 'ACTIVE',
      });
      writeFileSync(prevPath, JSON.stringify(prevRules, null, 2), 'utf-8');
    } catch { /* best-effort */ }
  }

  // If AUDIT-SCOPE is in targets, also update audit-scope.json
  if (request.target_ids.includes('AUDIT-SCOPE')) {
    try {
      const scopePath = join(process.cwd(), 'data', 'audit-scope.json');
      const scope = JSON.parse(readFileSync(scopePath, 'utf-8')) as {
        scope_items: Array<{ scope_id: string; label: string; triggered_by: string; check: string; added_at: string; status: string }>;
      };
      const nextScopeId = `SCOPE-${String(scope.scope_items.length + 1).padStart(3, '0')}`;
      scope.scope_items.push({
        scope_id: nextScopeId,
        label: `Injected check from ZF-Cycle ${request.zf_id}`,
        triggered_by: request.zf_id,
        check: request.injection_rule,
        added_at: now,
        status: 'ACTIVE',
      });
      writeFileSync(scopePath, JSON.stringify(scope, null, 2), 'utf-8');
    } catch { /* best-effort */ }
  }

  // Build and save injection record
  const record: InjectionRecord = {
    inj_id: injId,
    zf_cycle_id: request.zf_id,
    finding_id: request.zf_id, // will be updated by caller with real finding_id
    insight: request.insight,
    injection_rule: request.injection_rule,
    targets_updated: updatedTargets,
    injected_at: now,
    injected_by: 'sonnet-builder',
    enforcement_before: 'CONVENTION',
    enforcement_after: 'ACTIVE',
  };

  writeFileSync(
    join(INJECTIONS_DIR, `${injId}.json`),
    JSON.stringify(record, null, 2),
    'utf-8'
  );

  return {
    ok: true,
    inj_id: injId,
    targets_updated: updatedTargets,
    enforcement_before: 'CONVENTION',
    enforcement_after: 'ACTIVE',
    zf_status_updated_to: 'INJECTED',
  };
}

// =============================================================================
// LIST INJECTIONS
// =============================================================================

export function listInjections(): InjectionRecord[] {
  ensureDirectories();
  if (!existsSync(INJECTIONS_DIR)) return [];

  return readdirSync(INJECTIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        return JSON.parse(readFileSync(join(INJECTIONS_DIR, f), 'utf-8')) as InjectionRecord;
      } catch {
        return null;
      }
    })
    .filter((r): r is InjectionRecord => r !== null)
    .sort((a, b) => b.injected_at.localeCompare(a.injected_at));
}

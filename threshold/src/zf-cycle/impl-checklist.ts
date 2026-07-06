/**
 * CDS ZF-Cycle — Pre-Implementation Checklist
 *
 * 6 hardwired prevention rules that must PASS before any new route or
 * feature scope is opened. Extracted from AUDIT-260702-001 findings.
 *
 * PREVENTION IS TOP PRIORITY — HARDWIRED.
 * This checklist is the gate between audit finding and new code.
 *
 * Each rule references the finding that generated it.
 * New rules are added via ZF-Cycle Phase 4 injection — never manually.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface ChecklistItem {
  rule_id: string;
  label: string;
  source_finding: string;
  check_question: string;
  enforcement: string;
  status: 'ACTIVE' | 'STUB' | 'CLOSED';
  pass: boolean | null;       // null = not yet evaluated
  notes?: string;
}

export interface ImplChecklistResult {
  scope_label: string;
  evaluated_at: string;
  all_pass: boolean;
  items: ChecklistItem[];
  blocking_items: ChecklistItem[];
}

// =============================================================================
// LOAD RULES FROM injection-targets.json (CHECK-IMPL target)
// =============================================================================

function loadImplRules(): Array<{
  rule_id: string;
  source_finding: string;
  rule: string;
  enforcement: string;
}> {
  const targetsPath = join(process.cwd(), 'data', 'injection-targets.json');
  if (!existsSync(targetsPath)) return BUILT_IN_RULES.map(r => ({
    rule_id: r.rule_id,
    source_finding: r.source_finding,
    rule: r.check_question,
    enforcement: r.enforcement,
  }));

  try {
    const targets = JSON.parse(readFileSync(targetsPath, 'utf-8')) as {
      targets: Array<{
        id: string;
        injected_rules: Array<{ rule_id: string; source_finding: string; rule: string; enforcement: string }>;
      }>;
    };
    const implTarget = targets.targets.find(t => t.id === 'CHECK-IMPL');
    return implTarget?.injected_rules ?? BUILT_IN_RULES.map(r => ({
      rule_id: r.rule_id,
      source_finding: r.source_finding,
      rule: r.check_question,
      enforcement: r.enforcement,
    }));
  } catch {
    return BUILT_IN_RULES.map(r => ({
      rule_id: r.rule_id,
      source_finding: r.source_finding,
      rule: r.check_question,
      enforcement: r.enforcement,
    }));
  }
}

// =============================================================================
// BUILT-IN RULES (hardcoded baseline — P1 through P6 from AUDIT-260702-001)
// Extended via ZF-Cycle injection into CHECK-IMPL target
// =============================================================================

const BUILT_IN_RULES: Array<{
  rule_id: string;
  label: string;
  source_finding: string;
  check_question: string;
  enforcement: string;
}> = [
  {
    rule_id: 'P1-AUTH-FIRST',
    label: 'Authentication before handler',
    source_finding: 'FINDING-SEC-002',
    check_question: 'Is auth middleware declared and wired BEFORE any business logic in this route?',
    enforcement: 'STUB — Phase 0.5 implementation required',
  },
  {
    rule_id: 'P2-SCAN-ALL-ROUNDS',
    label: 'Injection scan on all string inputs',
    source_finding: 'FINDING-SYS-007',
    check_question: 'Does every string input in this scope (including secondary rounds like clarification responses) call scanForInjection()?',
    enforcement: 'ACTIVE',
  },
  {
    rule_id: 'P3-ASYNC-IO',
    label: 'No synchronous I/O on hot paths',
    source_finding: 'FINDING-PERF-004',
    check_question: 'Are there any readFileSync/writeFileSync calls inside request handlers? If yes: FAIL until Phase 0.5 PostgreSQL migration.',
    enforcement: 'TRACKED — Phase 0.5 PostgreSQL migration resolves this',
  },
  {
    rule_id: 'P4-APPEND-ONLY',
    label: 'Governance records are append-only',
    source_finding: 'FINDING-DATA-002',
    check_question: 'Does this scope avoid overwriting classification_result, q1_type, q4_status, or rules_applied on an existing CR record?',
    enforcement: 'ACTIVE',
  },
  {
    rule_id: 'P5-LIVE-SOURCE',
    label: 'Every rule checks a live source',
    source_finding: 'FINDING-GOV-001',
    check_question: 'Does every new or modified rule check a live data source (file, DB, registry) rather than a constant or stub value?',
    enforcement: 'PARTIAL — RULE-PARK now live; others Phase 0.5',
  },
  {
    rule_id: 'P6-ACTIONABLE-UX',
    label: 'Every result has actionable next-step',
    source_finding: 'FINDING-UX-005',
    check_question: 'Does every result state returned to a user include a specific actionable next step (not just classification data)?',
    enforcement: 'TRACKED — UX improvement Phase 0.5',
  },
];

// =============================================================================
// RUN CHECKLIST
// Caller provides scope_label and answers[] (pass/fail per rule_id)
// =============================================================================

export function runImplChecklist(
  scopeLabel: string,
  answers: Array<{ rule_id: string; pass: boolean; notes?: string }>
): ImplChecklistResult {
  const rules = loadImplRules();
  const answerMap = new Map(answers.map(a => [a.rule_id, a]));

  const items: ChecklistItem[] = BUILT_IN_RULES.map(builtIn => {
    const answer = answerMap.get(builtIn.rule_id);
    return {
      rule_id: builtIn.rule_id,
      label: builtIn.label,
      source_finding: builtIn.source_finding,
      check_question: builtIn.check_question,
      enforcement: builtIn.enforcement,
      status: 'ACTIVE',
      pass: answer?.pass ?? null,
      notes: answer?.notes,
    };
  });

  // Also add any injected rules from CHECK-IMPL
  for (const rule of rules) {
    if (!BUILT_IN_RULES.find(b => b.rule_id === rule.rule_id)) {
      const answer = answerMap.get(rule.rule_id);
      items.push({
        rule_id: rule.rule_id,
        label: `Injected rule from ${rule.source_finding}`,
        source_finding: rule.source_finding,
        check_question: rule.rule,
        enforcement: rule.enforcement,
        status: 'ACTIVE',
        pass: answer?.pass ?? null,
        notes: answer?.notes,
      });
    }
  }

  const evaluated = items.filter(i => i.pass !== null);
  const blockingItems = evaluated.filter(i => i.pass === false);

  return {
    scope_label: scopeLabel,
    evaluated_at: new Date().toISOString(),
    all_pass: blockingItems.length === 0 && evaluated.length >= BUILT_IN_RULES.length,
    items,
    blocking_items: blockingItems,
  };
}

// =============================================================================
// GET CHECKLIST TEMPLATE (for API — returns questions without answers)
// =============================================================================

export function getChecklistTemplate(): Array<{
  rule_id: string;
  label: string;
  check_question: string;
  enforcement: string;
}> {
  return BUILT_IN_RULES.map(r => ({
    rule_id: r.rule_id,
    label: r.label,
    check_question: r.check_question,
    enforcement: r.enforcement,
  }));
}

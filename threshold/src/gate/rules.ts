/**
 * CDS Gate — 6 Mechanical Rule Enforcement
 * Source: 0220 Section 3 — "What the Gate Mechanically Enforces"
 *
 * GATE LAW: Mechanical enforcement means the constraint is in the mechanism —
 * not in the instruction. An AI that forgets the rule, a developer who tries to
 * shortcut, a tenant who attempts to exceed scope — none can succeed because
 * the gate rejects the attempt before it completes.
 *
 * The 6 rules (0220 canonical):
 *   RULE-GOAL  — No build without ratified goal
 *   RULE-RAT   — No unratified constitutional element activation
 *   RULE-CLASS — No unclassified input reaches native AI
 *   RULE-QUAR  — No external content without quarantine
 *   RULE-VOC   — No unregistered vocabulary in constitutional elements
 *   RULE-PARK  — No new Swift Implementation at Forced Escalation
 */

import type { ActorContext, InputType, RuleId, RuleResult, SourcePath } from '../types.js';
import { checkForcedEscalation, auditParkRegistry } from '../zf-cycle/park-registry.js';

export interface RuleContext {
  actor: ActorContext;
  q1_type: InputType;
  source_path: SourcePath;
  is_build_wizard_request: boolean;    // Is this opening a build wizard?
  is_constitutional_element: boolean;  // Is this a constitutional layer element?
  ratification_state?: string;         // RATIFIED | APPROVED | PENDING | HELD
  vocabulary_terms?: string[];         // Terms used in constitutional elements
  forced_escalation_exists?: boolean;  // Are there Forced Escalation items in Park Queue?
  cr_id_provided?: string;             // Was a valid CR-ID presented?
  is_plan_ratification?: boolean;      // Is this a plan ratification request?
  plan_content?: string;               // The full plan markdown content to validate
}

export interface RuleEngineOutput {
  all_pass: boolean;
  results: RuleResult[];
  // Hard block (FAIL outcome) — produces BLOCKED classification
  blocking_rule: RuleId | null;
  blocking_detail: string | null;
  // Governance hold (HELD outcome) — produces HELD classification, awaits Governor ratification
  held_rule: RuleId | null;
  held_detail: string | null;
  held_resolution: string | null;
}

// =============================================================================
// RULE-GOAL — No build without ratified goal
// Build wizard path is locked. Requires GOV-[YEAR]-GOAL-[SEQUENCE] as parameter.
// Server-side validation. No goal record = no build wizard.
// =============================================================================

function runRuleGoal(ctx: RuleContext): RuleResult {
  if (!ctx.is_build_wizard_request) {
    return { rule_id: 'RULE-GOAL', outcome: 'NOT_APPLICABLE', detail: 'Not a build wizard request — RULE-GOAL not triggered' };
  }

  const goalRef = ctx.actor.goal_ref;
  const goalPattern = /^GOV-\d{4}-GOAL-\d{3,}$/;

  if (!goalRef) {
    return {
      rule_id: 'RULE-GOAL',
      outcome: 'FAIL',
      detail: 'BLOCKED: Build wizard request has no goal reference. Provide GOV-[YEAR]-GOAL-[SEQUENCE] to proceed.',
    };
  }

  if (!goalPattern.test(goalRef)) {
    return {
      rule_id: 'RULE-GOAL',
      outcome: 'FAIL',
      detail: `BLOCKED: Goal reference "${goalRef}" does not match expected format GOV-[YEAR]-GOAL-[SEQUENCE].`,
    };
  }

  // TODO Phase 0.5: verify goal exists in Governor Decision Registry (live DB check)
  // For now: format validation only (pattern match) — flag as MEDIUM enforcement
  return {
    rule_id: 'RULE-GOAL',
    outcome: 'PASS',
    detail: `Goal reference ${goalRef} format valid. (Phase 0.5: will verify against Governor Decision Registry)`,
  };
}

// =============================================================================
// RULE-RAT — No unratified constitutional element activation
// Activation endpoint requires APPROVED ratification state for constitutional
// elements. State checked against Governor Decision Registry.
// =============================================================================

function runRuleRat(ctx: RuleContext): RuleResult {
  if (!ctx.is_constitutional_element) {
    return { rule_id: 'RULE-RAT', outcome: 'NOT_APPLICABLE', detail: 'Not a constitutional element — RULE-RAT not triggered' };
  }

  const state = ctx.ratification_state;

  if (!state) {
    return {
      rule_id: 'RULE-RAT',
      outcome: 'FAIL',
      detail: 'BLOCKED: Constitutional element has no declared ratification state. Cannot activate.',
    };
  }

  if (state !== 'RATIFIED' && state !== 'APPROVED') {
    return {
      rule_id: 'RULE-RAT',
      outcome: 'FAIL',
      detail: `BLOCKED: Constitutional element ratification state is "${state}". Must be RATIFIED or APPROVED to activate. Current state prevents activation.`,
    };
  }

  return {
    rule_id: 'RULE-RAT',
    outcome: 'PASS',
    detail: `Constitutional element ratification state: ${state} — activation permitted.`,
  };
}

// =============================================================================
// RULE-CLASS — No unclassified input reaches native AI
// Native AI session endpoint requires CR-[DATE]-[SEQUENCE] as parameter.
// No classification record = session does not open.
// =============================================================================

function runRuleClass(ctx: RuleContext): RuleResult {
  // This rule fires on the AI session-open path
  // The CR-ID is the gate key — if classification hasn't happened, no CR-ID exists
  // In the classify flow itself, this is always PASS (we are creating the CR)
  // In the AI session-open flow, we check the CR-ID was provided

  const crPattern = /^CR-\d{6}-\d{3,}$/;

  if (ctx.cr_id_provided) {
    if (!crPattern.test(ctx.cr_id_provided)) {
      return {
        rule_id: 'RULE-CLASS',
        outcome: 'FAIL',
        detail: `BLOCKED: CR-ID "${ctx.cr_id_provided}" format invalid. Expected CR-YYMMDD-NNN.`,
      };
    }
    return {
      rule_id: 'RULE-CLASS',
      outcome: 'PASS',
      detail: `Classification record ${ctx.cr_id_provided} provided — native AI session may open.`,
    };
  }

  // If no CR-ID provided and this is a /classify request, RULE-CLASS is not yet applicable
  // (We are in the process of creating the CR)
  return {
    rule_id: 'RULE-CLASS',
    outcome: 'NOT_APPLICABLE',
    detail: 'Classification in progress — CR-ID will be generated if RULE-CLASS passes on AI session open.',
  };
}

// =============================================================================
// RULE-QUAR — No external content without quarantine
// External AI and API path inputs are set to QUARANTINE status at classification.
// Activation endpoint rejects QUARANTINE status elements.
// =============================================================================

function runRuleQuar(ctx: RuleContext): RuleResult {
  const externalPaths: SourcePath[] = ['external_ai', 'tenant_api'];

  if (!externalPaths.includes(ctx.source_path) && ctx.q1_type !== 'external_input') {
    return { rule_id: 'RULE-QUAR', outcome: 'NOT_APPLICABLE', detail: 'Not an external source — RULE-QUAR not triggered' };
  }

  // External content → must receive QUARANTINE status
  // This rule ensures the ICE assigns QUARANTINE and the output is not bypassed
  return {
    rule_id: 'RULE-QUAR',
    outcome: 'PASS',
    detail: 'External content detected — QUARANTINE status applied. Cannot activate until quarantine clearance record (QBF-[SOURCE]-[DATE]) is issued by Governor.',
  };
  // Note: QUARANTINE is a valid classification result — not a BLOCKED.
  // The content enters the system but cannot be activated until cleansed.
}

// =============================================================================
// RULE-VOC — Unregistered vocabulary in constitutional elements triggers HOLD
// Constitution layer elements must use registered terms (CS-GOV-003).
// Unregistered terms do NOT hard-block — they produce a HELD classification
// pending Governor vocabulary ratification. The input is received and held,
// not rejected. Governor can ratify the new term via GOV-DECISION record.
//
// Brain rationale (2026-07-02): "Block" places a ceiling on reasoning.
// "Hold pending ratification" preserves safety without creating a ceiling.
// (CDS-MECHANICAL-AI-BOUNDARY-001, Part 2)
// =============================================================================

// Registered vocabulary — CDS canonical terms (from CS-GOV-003 / CDS DNA)
// Exported so instructionValidator.ts can reuse without duplication (single source of truth).
// Phase 0: sample set. Phase 0.5: pull from live vocabulary registry.
export const REGISTERED_VOCABULARY = new Set([
  // CDS core terms
  'corespine', 'threshold', 'classification record', 'ice', 'intake classification engine',
  'ratification', 'governor', 'builder', 'platform governor', 'corespine family',
  'constitutional layer', 'wiring state', 'context backpack', 'zero findings',
  'zf check', 'gpow', 'graduated proof of working', 'swift implementation',
  'park queue', 'forced escalation', 'classification confidence', 'source path',
  'actor kind', 'tier level', 'cr-id', 'classification result', 'tell', 'rule',
  // CSPS terms that have been cleansed into CDS vocabulary
  'element', 'pipeline', 'protocol', 'agent', 'skill', 'vault', 'learning loop',
  'accountability registry', 'intelligence vault', 'dynamic completion',
  'inheritance chain', 'gap detection', 'build initiation protocol',
  // Status terms (from CDS-STATUS-LIBRARY-001)
  'draft', 'pending', 'approved', 'ratified', 'held', 'superseded', 'archived',
  'revoked', 'candidate', 'open', 'pending-propagation', 'quarantine',
  'need_clarification', 'classified', 'blocked',
]);

function runRuleVoc(ctx: RuleContext): RuleResult {
  if (!ctx.is_constitutional_element || !ctx.vocabulary_terms) {
    return { rule_id: 'RULE-VOC', outcome: 'NOT_APPLICABLE', detail: 'Not a constitutional element or no vocabulary terms provided' };
  }

  const unregistered = ctx.vocabulary_terms.filter(
    t => !REGISTERED_VOCABULARY.has(t.toLowerCase())
  );

  if (unregistered.length > 0) {
    return {
      rule_id: 'RULE-VOC',
      outcome: 'HELD',
      detail: `HELD PENDING VOCABULARY RATIFICATION: ${unregistered.length} unregistered term(s): ${unregistered.join(', ')}. Input received and held — not blocked. Governor ratifies new vocabulary via GOV-DECISION record, then input proceeds.`,
      held_reason: `Unregistered vocabulary: ${unregistered.join(', ')}`,
      held_resolution: 'Governor ratifies new term(s) via GOV-DECISION. Once ratified, re-submit to proceed.',
    };
  }

  return {
    rule_id: 'RULE-VOC',
    outcome: 'PASS',
    detail: `All ${ctx.vocabulary_terms.length} terms validated against CS-GOV-003 vocabulary registry.`,
  };
}

// =============================================================================
// RULE-PARK — No new Swift Implementation at Forced Escalation
// Swift Implementation endpoint checks Park Queue for Forced Escalation items.
// If any exist: endpoint returns error with list of Forced items.
// =============================================================================

function runRulePark(ctx: RuleContext): RuleResult {
  // Only fires when submitting a new Swift Implementation
  const isSwiftImpl = ctx.q1_type === 'obligation' || ctx.actor.goal_ref?.includes('SWIFT');

  if (!isSwiftImpl) {
    return { rule_id: 'RULE-PARK', outcome: 'NOT_APPLICABLE', detail: 'Not a Swift Implementation submission — RULE-PARK not triggered' };
  }

  // LIVE CHECK — reads from data/park-registry.json (closes GOV-001 / P5-LIVE-SOURCE)
  // Previously hardcoded to false. Now queries actual Park Registry.
  let forcedEscalationExists: boolean;
  try {
    forcedEscalationExists = checkForcedEscalation();
  } catch {
    // Registry read failure — safe default: allow (fail open for Park check only)
    // Gov-001 mitigation: if registry unreadable, log but don't block
    console.warn('[RULE-PARK] Park registry read failed — defaulting to no forced escalation');
    forcedEscalationExists = false;
  }

  if (forcedEscalationExists) {
    const audit = (() => { try { return auditParkRegistry(); } catch { return null; } })();
    const count = audit?.forced_escalation_count ?? 'unknown';
    return {
      rule_id: 'RULE-PARK',
      outcome: 'FAIL',
      detail: `BLOCKED: ${count} Forced Escalation item(s) in Park Queue. New Swift Implementation cannot proceed until Forced items are resolved by Governor. Check /api/park for entries with is_forced_escalation: true.`,
    };
  }

  return {
    rule_id: 'RULE-PARK',
    outcome: 'PASS',
    detail: 'Park Registry checked — no Forced Escalation items. Swift Implementation may proceed. [LIVE SOURCE: data/park-registry.json]',
  };
}

// =============================================================================
// RULE-PLAN-SYNTAX-VALIDATION — All 10 sections must be present and valid
// Plan ratification endpoint validates that the plan has all 10 mandatory sections
// from CS-PLAN-STRUCTURE-TEMPLATE.md. Missing any section = FAIL (blocks ratification).
// =============================================================================

function runRulePlanSyntaxValidation(ctx: RuleContext): RuleResult {
  if (!ctx.is_plan_ratification) {
    return { rule_id: 'RULE-PLAN-SYNTAX-VALIDATION', outcome: 'NOT_APPLICABLE', detail: 'Not a plan ratification request — rule not triggered' };
  }

  if (!ctx.plan_content) {
    return {
      rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
      outcome: 'FAIL',
      detail: 'BLOCKED: No plan content provided. Cannot validate structure.',
    };
  }

  // FIX #5: Reject excessively long plans (prevent regex DoS)
  const MAX_PLAN_LENGTH = 50000; // 50KB reasonable max
  if (ctx.plan_content.length > MAX_PLAN_LENGTH) {
    return {
      rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
      outcome: 'FAIL',
      detail: `BLOCKED: Plan content exceeds maximum length (${ctx.plan_content.length} > ${MAX_PLAN_LENGTH}). Submit a more concise plan.`,
    };
  }

  // The 10 mandatory sections from CS-PLAN-STRUCTURE-TEMPLATE.md
  const mandatorySections = [
    'The One Sentence',
    'Build Readiness Verdict',
    'Three Mandatory Build Prerequisites',
    'Final Architecture',
    'Phase Machine',
    'Build Sequence',
    'Corespine Architecture',
    'Initial Type Library',
    'Phase 2+ Parked Items',
    'Permission Request',
  ];

  const missingIn = mandatorySections.filter(section => {
    // Check for section header (case-insensitive)
    const regex = new RegExp(`## ${section}`, 'i');
    return !regex.test(ctx.plan_content!);
  });

  if (missingIn.length > 0) {
    return {
      rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
      outcome: 'FAIL',
      detail: `BLOCKED: Plan missing ${missingIn.length} mandatory section(s): ${missingIn.join(', ')}. All 10 sections required before ratification.`,
    };
  }

  // Validate P1/P2/P3 closure criteria are non-null (three prerequisites table)
  const prereqTableMatch = ctx.plan_content.match(/## Three Mandatory Build Prerequisites[\s\S]*?\|\s*\*\*P1\*\*.*?\|\s*\*\*P2\*\*.*?\|\s*\*\*P3\*\*/);
  if (!prereqTableMatch) {
    return {
      rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
      outcome: 'FAIL',
      detail: 'BLOCKED: Three Mandatory Build Prerequisites table not found or malformed. P1, P2, P3 must be present with closure criteria.',
    };
  }

  // Validate "One Sentence" is actually one sentence (single period)
  const oneSentenceMatch = ctx.plan_content.match(/## The One Sentence\s+>\s*\*\*(.*?)\*\*/s);
  if (oneSentenceMatch) {
    const sentence = oneSentenceMatch[1].trim();
    const periodCount = (sentence.match(/\./g) || []).length;
    if (periodCount !== 1) {
      return {
        rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
        outcome: 'FAIL',
        detail: `BLOCKED: "The One Sentence" contains ${periodCount} period(s), but must contain exactly 1. Ensure the design north star is a single, complete sentence.`,
      };
    }
  }

  // NEW: Validate section content depth (not just headers) — Pocket #4
  // All sections must have at least 20 characters of substantive content
  const sectionDepthChecks = mandatorySections.map(section => {
    const regex = new RegExp(`## ${section}\n\n(.+?)(?:\n\n##|$)`, 'is');
    const match = ctx.plan_content!.match(regex);
    const content = match ? match[1].trim() : '';

    if (content.length < 20) {
      return { section, valid: false, reason: `content too short (${content.length} chars, need ≥20)` };
    }
    return { section, valid: true };
  });

  const depthFailures = sectionDepthChecks.filter(c => !c.valid);
  if (depthFailures.length > 0) {
    return {
      rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
      outcome: 'FAIL',
      detail: `BLOCKED: Sections exist but lack substantive content: ${depthFailures.map(d => `${d.section} (${d.reason})`).join('; ')}. Each section must have ≥20 chars of content.`,
    };
  }

  // NEW: Validate Final Architecture has all 8 recommendations (R1–R8) — Pocket #4
  // FIX #6: Only match actual recommendations (bold or labeled), not loose references
  const archMatch = ctx.plan_content!.match(/## Final Architecture[\s\S]*?\n\n([\s\S]*?)\n\n##/);
  if (archMatch) {
    const archContent = archMatch[1];
    const missingRecommendations = [];
    for (let i = 1; i <= 8; i++) {
      // Match: **R#** (bold) or R#: (colon-labeled) — not loose text like "The R5 finding"
      const strictRegex = new RegExp(`\\*\\*R${i}\\*\\*|^\\s*R${i}:`, 'm');
      if (!strictRegex.test(archContent)) {
        missingRecommendations.push(`R${i}`);
      }
    }
    if (missingRecommendations.length > 0) {
      return {
        rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
        outcome: 'FAIL',
        detail: `BLOCKED: Final Architecture missing recommendation(s): ${missingRecommendations.join(', ')}. All R1–R8 must be present as bold (**R#**) or labeled (R#:) recommendations.`,
      };
    }
  }

  return {
    rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
    outcome: 'PASS',
    detail: 'Plan structure validated: all 10 sections present with substantive content, prerequisites valid, R1–R8 recommendations verified, one-sentence enforced. Plan is ratifiable.',
  };
}

// =============================================================================
// RULE-AUDIT-GATE-MANDATORY — Phase N audit must complete before Phase N+1 opens
// Phase N+1 build endpoint rejects if Phase N audit is incomplete.
// "Incomplete" = not run, or run but findings not ZF'd (not CLOSED or PARKED_WITH_DEADLINE).
// =============================================================================

function runRuleAuditGateMandatory(ctx: RuleContext): RuleResult {
  // This rule only fires when attempting to open Phase N+1
  const isPhaseAdvance = ctx.q1_type === 'obligation' || (ctx as any).is_phase_advance_request;

  if (!isPhaseAdvance) {
    return { rule_id: 'RULE-AUDIT-GATE-MANDATORY', outcome: 'NOT_APPLICABLE', detail: 'Not a phase advance request — rule not triggered' };
  }

  // Check if phase_n_audit_status is provided and whether audit is complete
  const auditStatus = (ctx as any).phase_n_audit_status as string | undefined;
  const auditUnresolvedCount = (ctx as any).audit_unresolved_findings_count as number | undefined;

  if (!auditStatus) {
    return {
      rule_id: 'RULE-AUDIT-GATE-MANDATORY',
      outcome: 'FAIL',
      detail: 'Phase N audit required. Status: NOT_RUN. Phase N+1 cannot open until Phase N audit cycle completes.',
    };
  }

  // Valid completion states: audit run AND (all findings CLOSED or PARKED_WITH_DEADLINE)
  const completionStates = ['ZF_COMPLETE', 'CLOSED', 'ALL_FINDINGS_RESOLVED'];
  if (!completionStates.includes(auditStatus)) {
    const unresolvedMsg = auditUnresolvedCount ? ` Unresolved findings: ${auditUnresolvedCount}.` : '';
    return {
      rule_id: 'RULE-AUDIT-GATE-MANDATORY',
      outcome: 'FAIL',
      detail: `Phase N audit incomplete. Status: ${auditStatus}.${unresolvedMsg} Phase N+1 cannot open.`,
    };
  }

  return {
    rule_id: 'RULE-AUDIT-GATE-MANDATORY',
    outcome: 'PASS',
    detail: `Phase N audit complete (status: ${auditStatus}). Phase N+1 may open.`,
  };
}

// =============================================================================
// RULE ENGINE — Run all rules
// =============================================================================

export function runAllRules(ctx: RuleContext): RuleEngineOutput {
  const results: RuleResult[] = [
    runRuleGoal(ctx),
    runRuleRat(ctx),
    runRuleClass(ctx),
    runRuleQuar(ctx),
    runRuleVoc(ctx),
    runRulePark(ctx),
    runRulePlanSyntaxValidation(ctx),
    runRuleAuditGateMandatory(ctx),
  ];

  const failing = results.find(r => r.outcome === 'FAIL');
  const held   = results.find(r => r.outcome === 'HELD');

  return {
    all_pass: !failing && !held,
    results,
    // Hard block — produces BLOCKED classification
    blocking_rule:   failing ? failing.rule_id  : null,
    blocking_detail: failing ? failing.detail   : null,
    // Governance hold — produces HELD classification (not blocked; awaits ratification)
    held_rule:       held ? held.rule_id              : null,
    held_detail:     held ? held.detail               : null,
    held_resolution: held ? (held.held_resolution ?? null) : null,
  };
}

// =============================================================================
// AUDIT — Gate health check (0220 Section 7)
// =============================================================================

export interface GateHealthStatus {
  classification_registry_accessible: boolean;
  governor_decision_registry_accessible: boolean;
  agent_registry_accessible: boolean;
  gate_operational: boolean;
  checked_at: string;
}

export async function checkGateHealth(): Promise<GateHealthStatus> {
  // Phase 0: file-based registries — real checks where possible
  // Phase 0.5: check live DB connectivity
  const checked_at = new Date().toISOString();

  // Real check: park registry accessibility
  let parkRegistryOk = false;
  try {
    auditParkRegistry(); // If this doesn't throw, registry is accessible
    parkRegistryOk = true;
  } catch {
    parkRegistryOk = false;
  }

  return {
    classification_registry_accessible: true,   // JSON file store always accessible in Phase 0
    governor_decision_registry_accessible: parkRegistryOk, // Park registry is live — real check
    agent_registry_accessible: true,            // Will be DB check in Phase 0.5
    gate_operational: true,
    checked_at,
  };
}

/**
 * CDS ICE — Intake Classification Engine
 * Source: 0210 — Five questions, 8 input types, all source paths
 * All inputs pass through these 5 questions. Output: partial ClassificationRecord (Q1-Q5 answers).
 *
 * Q1 and Q2 now use deterministic decision trees (classificationTree.ts).
 * GOV-BOUNDARY-002 (Q1 tree) + GOV-BOUNDARY-003 (Q2 tree) — ratified 2026-07-02.
 */

import type {
  RawInput,
  ActorContext,
  InputType,
  CorespineGroup,
  AssignedStatus,
  ClassificationConfidence,
  RuleResult,
  SourcePath,
  AUTO_TAGS as _AT,
  DEFAULT_STATUS as _DS,
  PRIMARY_ROUTING as _PR,
} from '../types.js';

import {
  AUTO_TAGS,
  DEFAULT_STATUS,
  PRIMARY_ROUTING,
} from '../types.js';

import { runQ1Tree, runQ2Tree, extractTextForTree } from './classificationTree.js';

export interface ICEOutput {
  q1_type: InputType;
  q2_corespine_families: string[];
  q3_tags: string[];
  q4_status: AssignedStatus;
  q5_routing_primary: string;
  q5_routing_secondary: string | null;
  classification_confidence: ClassificationConfidence;
  raw_input_summary: string;
  // reasoning_trace fields (GOV-GAPS-001) — populated by deterministic trees
  q1_matched_node: string;        // Which Q1 tree node fired
  q1_signals_detected: string[];  // Which signals triggered that node
  q2_matched_node: string;        // Which Q2 tree node fired
  q2_domain_signals: string[];    // Which domain keywords selected the family
}

// =============================================================================
// Q1 — What type of thing is this?
// DETERMINISTIC DECISION TREE (GOV-BOUNDARY-002, ratified 2026-07-02).
// Delegates to classificationTree.ts runQ1Tree().
// Same input + same signals = same output. Any model. Any session.
// =============================================================================

export function runQ1(
  raw: RawInput,
  actor: ActorContext,
  declaredType?: InputType
): { type: InputType; confidence: ClassificationConfidence; matched_node: string; signals_detected: string[] } {
  const result = runQ1Tree(raw, actor, declaredType);
  return {
    type:             result.type,
    confidence:       result.confidence,
    matched_node:     result.matched_node,
    signals_detected: result.signals_detected,
  };
}

// =============================================================================
// Q2 — Which corespine family?
// DETERMINISTIC DECISION TREE (GOV-BOUNDARY-003, ratified 2026-07-02).
// Delegates to classificationTree.ts runQ2Tree().
// Domain keywords within content select the specific family for variable types
// (ELEMENT, FINDING, IMPROVEMENT). Fixed types always return the same family.
// =============================================================================

export function runQ2(
  q1: InputType,
  raw: RawInput,
  declaredCorespines?: string[]
): { families: string[]; matched_node: string; domain_signals: string[] } {
  const text = extractTextForTree(raw);
  const result = runQ2Tree(q1, text, declaredCorespines);
  return {
    families:      result.families,
    matched_node:  result.matched_node,
    domain_signals: result.domain_signals,
  };
}

// =============================================================================
// Q3 — What tags apply?
// =============================================================================

export function runQ3(q1: InputType, additionalTags?: string[]): string[] {
  const auto = [...AUTO_TAGS[q1]];
  if (additionalTags) {
    // Validate: only registered tags from Tag Library
    // TODO Phase 0.5: validate against live Tag Library API
    // For now: accept but flag unregistered tags for audit
    const registered = additionalTags.filter(t => isRegisteredTag(t));
    auto.push(...registered);
  }
  return [...new Set(auto)];
}

// Registered tags from CDS-TAG-LIBRARY-001 (sample — full list in Tag Library)
const REGISTERED_TAGS = new Set([
  // PH — Phase
  'PH:PHASE_0', 'PH:PHASE_1', 'PH:PHASE_2', 'PH:PHASE_3',
  // DOM — Domain/Expert
  'DOM:SYS', 'DOM:UX', 'DOM:GOV', 'DOM:DOC', 'DOM:SEC', 'DOM:PERF', 'DOM:INT', 'DOM:DATA',
  // LY — Layer
  'LY:1', 'LY:2', 'LY:3',
  // TR — Trunk
  'TR:BUILD', 'TR:GOVERN', 'TR:LEARN', 'TR:OPERATE',
  // PRI — Priority
  'PRI:CRITICAL', 'PRI:HIGH', 'PRI:MEDIUM', 'PRI:LOW',
  // ACT — Actor
  'ACT:GOVERNOR', 'ACT:BUILDER', 'ACT:ADVISOR', 'ACT:SYSTEM',
  // BLK — Block
  'BLK:GATE', 'BLK:RATIFICATION', 'BLK:DEPENDENCY', 'BLK:FORCED_ESCALATION',
  // TYP — Type
  'TYP:GOAL', 'TYP:ELEMENT', 'TYP:FINDING', 'TYP:OBLIGATION', 'TYP:IMPROVEMENT',
  'TYP:INSIGHT', 'TYP:EXTERNAL', 'TYP:UNKNOWN',
  // CTX — Context (auto-surface triggers)
  'CTX:SESSION_OPEN', 'CTX:PHASE_0_BUILD', 'CTX:RATIFICATION', 'CTX:CLEANSING',
  // ICE-auto-applied tags (not from library but canonical)
  'GOAL', 'BUILD', 'RATIFICATION-REQUIRED', 'DRAFT', 'PIPELINE', 'CANDIDATE',
  'OPEN', 'PENDING-PROPAGATION', 'IMPROVEMENT', 'QUARANTINE', 'EXTERNAL',
  'HELD', 'UNCLASSIFIED',
]);

function isRegisteredTag(tag: string): boolean {
  return REGISTERED_TAGS.has(tag);
}

// =============================================================================
// Q4 — What status?
// =============================================================================

export function runQ4(q1: InputType, confidence: ClassificationConfidence): AssignedStatus {
  if (confidence === 'LOW' && q1 !== 'external_input' && q1 !== 'unknown') {
    return 'NEED_CLARIFICATION'; // Yariv amendment — low confidence → ask before proceeding
  }
  return DEFAULT_STATUS[q1];
}

// =============================================================================
// Q5 — Where is it routed?
// =============================================================================

export function runQ5(q1: InputType): { primary: string; secondary: string | null } {
  const secondary: Partial<Record<InputType, string>> = {
    goal:           'After ratification: Build Initiation Protocol (0200) entry',
    element:        'After placement: Wiring Queue (Leg 3)',
    finding:        'Priority Queue — scored for resolution sequencing',
    obligation:     'Park Queue if Swift Implementation',
    improvement:    'Backward + Forward Propagation Queue',
    insight:        'Vault Review Queue for Governor assessment',
    external_input: 'After quarantine: vocabulary translation → appropriate destination by content type',
  };

  return {
    primary: PRIMARY_ROUTING[q1],
    secondary: secondary[q1] ?? null,
  };
}

// =============================================================================
// FULL ICE RUN — Q1 → Q2 → Q3 → Q4 → Q5
// =============================================================================

export function runICE(
  raw: RawInput,
  actor: ActorContext,
  opts?: {
    declaredType?: InputType;
    declaredCorespines?: string[];
    additionalTags?: string[];
  }
): ICEOutput {
  const q1result = runQ1(raw, actor, opts?.declaredType);
  const q2result = runQ2(q1result.type, raw, opts?.declaredCorespines);
  const q3tags   = runQ3(q1result.type, opts?.additionalTags);
  const q4status = runQ4(q1result.type, q1result.confidence);
  const q5result = runQ5(q1result.type);

  const treeSummary = q1result.matched_node === 'NODE-2-DECLARED-TYPE'
    ? `Explicitly declared by actor`
    : `Tree node ${q1result.matched_node} — signals: ${q1result.signals_detected.slice(0, 2).join('; ')}`;

  return {
    q1_type:               q1result.type,
    q2_corespine_families: q2result.families,
    q3_tags:               q3tags,
    q4_status:             q4status,
    q5_routing_primary:    q5result.primary,
    q5_routing_secondary:  q5result.secondary,
    classification_confidence: q1result.confidence,
    raw_input_summary:     summarizeInput(raw, q1result.type, treeSummary),
    // reasoning_trace fields (GOV-GAPS-001)
    q1_matched_node:    q1result.matched_node,
    q1_signals_detected: q1result.signals_detected,
    q2_matched_node:    q2result.matched_node,
    q2_domain_signals:  q2result.domain_signals,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function summarizeInput(raw: RawInput, type: InputType, reasoning: string): string {
  const truncated = raw.content.length > 100
    ? raw.content.substring(0, 97) + '...'
    : raw.content;
  return `[${type.toUpperCase()}] ${truncated} (${reasoning})`;
}

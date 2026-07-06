/**
 * CDS Instruction Validation Gate (Brain Gap 1 — 2026-07-02)
 *
 * PROBLEM: Every AI-generated instruction sent to a sub-agent (Haiku scan prompt,
 * Consultant context package, Verifier spawn directive) is produced entirely outside
 * the Threshold. An AI writing instructions for another AI is the highest-risk
 * free-styling path in the system — currently ungoverned.
 *
 * GATE LAW: Every AI-generated instruction dispatched to a sub-agent must pass
 * three checks before it is sent. An instruction that fails this gate is not sent.
 * An instruction that produces HELD is not sent until the hold clears.
 *
 * THREE CHECKS:
 *
 * CHECK 1 — VOCAB
 *   Reuses RULE-VOC vocabulary list. Instructions may only use registered CDS terms
 *   when instructing sub-agents. Unregistered terms → HELD (Governor ratifies term,
 *   not BLOCKED — same logic as RULE-VOC; vocabulary ceilings are degenerative).
 *
 * CHECK 2 — PRINCIPLE
 *   A hardcoded list of ratified governing principles expressed as forbidden patterns.
 *   An instruction that contradicts a ratified principle is BLOCKED — there is no
 *   ratification path for principle violations (unlike vocabulary, which can be extended).
 *   Patterns are: auth bypass, append-only violation, Layer 1 self-deprecation,
 *   Governor authority assumption, classification bypass, direct ACTIVE promotion.
 *
 * CHECK 3 — SCOPE
 *   The dispatch contract declares a blast_radius (list of paths/systems the sub-agent
 *   may reference). The instruction text is scanned for path references. Any path
 *   reference outside the declared blast_radius → HELD (scope can be expanded via
 *   Governor decision, not BLOCKED).
 *
 * OUTCOME LOGIC:
 *   Any BLOCKED check → overall outcome BLOCKED (instruction must not be sent)
 *   Any HELD check (no BLOCKED) → overall outcome HELD (await ratification)
 *   All PASS → overall outcome APPROVED (dispatch proceeds)
 *
 * AUDIT TRAIL:
 *   Every validation attempt is written to reports/instruction-validations/
 *   as IVLD-YYMMDD-NNN.json. Append-only. Gives the External Auditor a full
 *   record of what instructions were generated, validated, and dispatched.
 */

import { existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REGISTERED_VOCABULARY } from './rules.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VALIDATION_LOG_DIR = join(__dirname, '..', '..', '..', 'reports', 'instruction-validations');

if (!existsSync(VALIDATION_LOG_DIR)) {
  try {
    mkdirSync(VALIDATION_LOG_DIR, { recursive: true });
  } catch (err) {
    console.error(
      `[instructionValidator] STARTUP WARNING: Cannot create validation log directory at ${VALIDATION_LOG_DIR}. ` +
      `Error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

// =============================================================================
// TYPES
// =============================================================================

export type ValidationOutcome = 'APPROVED' | 'HELD' | 'BLOCKED';
export type CheckOutcome = 'PASS' | 'HELD' | 'BLOCKED';

export interface InstructionCheck {
  check_id: 'VOCAB' | 'PRINCIPLE' | 'SCOPE';
  outcome: CheckOutcome;
  detail: string;
  flagged_items: string[];
}

export interface DispatchContract {
  declared_scope: string;            // One-sentence description of what this instruction may do
  target_agent_type: 'haiku' | 'sonnet' | 'opus' | 'verifier' | 'consultant';
  invoking_component: string;        // CDS component generating this (e.g., 'zf-cycle/engine')
  blast_radius: string[];            // Paths/systems the sub-agent is permitted to reference
}

export interface InstructionValidationRequest {
  instruction_text: string;
  dispatch_contract: DispatchContract;
}

export interface InstructionValidationRecord {
  validation_id: string;             // IVLD-YYMMDD-NNN
  validated_at: string;
  dispatch_contract: DispatchContract;
  instruction_summary: string;       // First 200 chars — never store the full instruction in the ID
  checks: InstructionCheck[];
  outcome: ValidationOutcome;
  detail: string;
}

// =============================================================================
// VALIDATION ID GENERATION
// =============================================================================

const _ivldCounters: Map<string, number> = new Map();

function generateValidationId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const prefix = `${yy}${mm}${dd}`;

  if (!_ivldCounters.has(prefix)) {
    let max = 0;
    if (existsSync(VALIDATION_LOG_DIR)) {
      const pattern = new RegExp(`^IVLD-${prefix}-(\\d+)\\.json$`);
      for (const f of readdirSync(VALIDATION_LOG_DIR)) {
        const m = f.match(pattern);
        if (m) { const n = parseInt(m[1]!, 10); if (n > max) max = n; }
      }
    }
    _ivldCounters.set(prefix, max);
  }

  const next = (_ivldCounters.get(prefix) ?? 0) + 1;
  _ivldCounters.set(prefix, next);
  return `IVLD-${prefix}-${String(next).padStart(3, '0')}`;
}

// =============================================================================
// CHECK 1 — VOCABULARY
// Reuses REGISTERED_VOCABULARY from rules.ts (same source as RULE-VOC).
// Extracts significant words (>4 chars) from instruction text, checks each.
// Unregistered → HELD (vocabulary can be ratified; not a hard block).
// =============================================================================

function runVocabCheck(instruction: string): InstructionCheck {
  const terms = instruction
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4)
    .map(w => w.replace(/[^a-z0-9-_]/g, ''))
    .filter(w => w.length > 0)
    .slice(0, 100);

  const unregistered = [...new Set(terms)].filter(t => !REGISTERED_VOCABULARY.has(t));

  if (unregistered.length === 0) {
    return {
      check_id: 'VOCAB',
      outcome: 'PASS',
      detail: `All terms validated against CDS vocabulary registry (${terms.length} terms checked).`,
      flagged_items: [],
    };
  }

  return {
    check_id: 'VOCAB',
    outcome: 'HELD',
    detail: `HELD PENDING VOCABULARY RATIFICATION: ${unregistered.length} unregistered term(s) found in instruction. ` +
            `Governor ratifies via GOV-DECISION. Instruction held until terms are registered or removed.`,
    flagged_items: unregistered,
  };
}

// =============================================================================
// CHECK 2 — PRINCIPLE CONTRADICTION
// Hardcoded patterns from ratified governing principles.
// Any match → BLOCKED (no ratification path for principle violations).
// Patterns are conservative: only match clear violation intent, not ambiguity.
// =============================================================================

const FORBIDDEN_PATTERNS: Array<{ regex: RegExp; principle: string; ref: string }> = [
  {
    regex: /skip\s+(auth|authorization)|bypass\s+(auth|authorization|bearer)|without\s+(auth|authorization|bearer)/i,
    principle: 'SEC-002: All protected routes require authorization. Instructions cannot direct agents to bypass auth.',
    ref: 'SEC-002',
  },
  {
    regex: /overwrite\s+(record|file|cr-|events)|delete\s+(record|file|cr-)|truncate\s+(record|file)/i,
    principle: 'P4-APPEND-ONLY (DATA-002 CLOSED): Records are immutable. Instructions cannot direct overwrite or deletion.',
    ref: 'P4-APPEND-ONLY',
  },
  {
    regex: /mark\s+(rule|finding|insight)\s+as\s+active|set\s+status\s+(to\s+)?active|directly\s+promote\s+to\s+active/i,
    principle: 'GOV-BOUNDARY-004: PROVISIONAL→ACTIVE promotion requires the 8-box gate. Instructions cannot direct unsanctioned promotion.',
    ref: 'GOV-BOUNDARY-004',
  },
  {
    regex: /skip\s+classification|bypass\s+(threshold|classification|gate)|without\s+(classif|threshold|gate)/i,
    principle: 'RULE-CLASS: No unclassified input reaches native AI. Instructions cannot direct classification bypass.',
    ref: 'RULE-CLASS',
  },
  {
    regex: /deprecate\s+(rule-|RULE-|gate |gate-)|disable\s+(rule-|RULE-|gate |gate-)|remove\s+(rule-|RULE-)\w+/i,
    principle: 'LEL-CORESPINE-001 §8.1: AI cannot execute Layer 1 gate deprecations. Only the Governor executes.',
    ref: 'CDS-LEL-SECTION8-001 §8.1',
  },
  {
    regex: /auto.?approv|without\s+governor|skip\s+governor|governor\s+approval\s+(is\s+)?not\s+required/i,
    principle: 'GOV-BOUNDARY-001: Governor owns the exception. Instructions cannot assume or grant Governor authority.',
    ref: 'GOV-BOUNDARY-001',
  },
  {
    regex: /treat\s+silence\s+as\s+(approval|consent)|if\s+no\s+response\s+then\s+(proceed|approve)/i,
    principle: 'LEL-CORESPINE-001 §8.1: Governor silence is not approval. The block stands until the Governor acts.',
    ref: 'CDS-LEL-SECTION8-001 §8.1',
  },
];

function runPrincipleCheck(instruction: string): InstructionCheck {
  const violations: string[] = [];

  for (const { regex, principle, ref } of FORBIDDEN_PATTERNS) {
    if (regex.test(instruction)) {
      violations.push(`[${ref}] ${principle}`);
    }
  }

  if (violations.length === 0) {
    return {
      check_id: 'PRINCIPLE',
      outcome: 'PASS',
      detail: `Instruction does not contradict any ratified governing principle (${FORBIDDEN_PATTERNS.length} principles checked).`,
      flagged_items: [],
    };
  }

  return {
    check_id: 'PRINCIPLE',
    outcome: 'BLOCKED',
    detail: `BLOCKED: Instruction contradicts ${violations.length} ratified governing principle(s). ` +
            `Instructions that violate ratified principles cannot be dispatched and cannot be ratified around. ` +
            `Revise the instruction to comply before re-submitting.`,
    flagged_items: violations,
  };
}

// =============================================================================
// CHECK 3 — SCOPE
// Extracts path-like references from the instruction text.
// Any referenced path not covered by blast_radius → HELD.
// Blast radius matching: a declared path covers all sub-paths beneath it.
// (e.g., blast_radius "src/zf-cycle/" covers "src/zf-cycle/engine.ts")
// =============================================================================

function extractPathReferences(text: string): string[] {
  // Match patterns like: src/foo/bar.ts  data/file.json  records/  reports/zf-cycles/
  // Anchored on word boundary or space — avoid matching in the middle of prose
  const pathPattern = /(?:^|[\s"'(,])(((?:src|data|records|reports|threshold|ui)\/)[^\s"',;)\]]+)/gm;
  const found: Set<string> = new Set();
  let match: RegExpExecArray | null;
  while ((match = pathPattern.exec(text)) !== null) {
    found.add(match[1]!.trim());
  }
  return [...found];
}

function isWithinBlastRadius(path: string, blastRadius: string[]): boolean {
  return blastRadius.some(declared =>
    path === declared ||
    path.startsWith(declared.endsWith('/') ? declared : declared + '/')
  );
}

function runScopeCheck(instruction: string, contract: DispatchContract): InstructionCheck {
  const paths = extractPathReferences(instruction);

  if (paths.length === 0) {
    return {
      check_id: 'SCOPE',
      outcome: 'PASS',
      detail: 'No path references detected in instruction — scope check not triggered.',
      flagged_items: [],
    };
  }

  const outOfScope = paths.filter(p => !isWithinBlastRadius(p, contract.blast_radius));

  if (outOfScope.length === 0) {
    return {
      check_id: 'SCOPE',
      outcome: 'PASS',
      detail: `All ${paths.length} path reference(s) are within declared blast radius.`,
      flagged_items: [],
    };
  }

  return {
    check_id: 'SCOPE',
    outcome: 'HELD',
    detail: `HELD PENDING SCOPE EXPANSION: ${outOfScope.length} path reference(s) outside declared blast radius. ` +
            `Declared scope: "${contract.declared_scope}". ` +
            `Expand blast_radius via Governor decision or revise instruction to stay within declared scope.`,
    flagged_items: outOfScope,
  };
}

// =============================================================================
// GATE — Run all three checks and determine overall outcome
// =============================================================================

export function validateInstruction(req: InstructionValidationRequest): InstructionValidationRecord {
  const { instruction_text, dispatch_contract } = req;

  const checks: InstructionCheck[] = [
    runVocabCheck(instruction_text),
    runPrincipleCheck(instruction_text),
    runScopeCheck(instruction_text, dispatch_contract),
  ];

  // Outcome resolution: any BLOCKED wins; then any HELD; otherwise APPROVED
  let outcome: ValidationOutcome = 'APPROVED';
  if (checks.some(c => c.outcome === 'BLOCKED')) {
    outcome = 'BLOCKED';
  } else if (checks.some(c => c.outcome === 'HELD')) {
    outcome = 'HELD';
  }

  const blockedChecks = checks.filter(c => c.outcome === 'BLOCKED').map(c => c.check_id);
  const heldChecks    = checks.filter(c => c.outcome === 'HELD').map(c => c.check_id);

  let detail: string;
  if (outcome === 'APPROVED') {
    detail = 'Instruction cleared all three checks. Dispatch approved.';
  } else if (outcome === 'BLOCKED') {
    detail = `Dispatch BLOCKED. Principle violation(s) in: ${blockedChecks.join(', ')}. Revise instruction before re-submission.`;
  } else {
    detail = `Dispatch HELD. Pending ratification on: ${heldChecks.join(', ')}. Instruction received — not dispatched.`;
  }

  const validation_id = generateValidationId();
  const record: InstructionValidationRecord = {
    validation_id,
    validated_at:        new Date().toISOString(),
    dispatch_contract,
    instruction_summary: instruction_text.substring(0, 200),
    checks,
    outcome,
    detail,
  };

  // Append-only audit log — every validation attempt is persisted
  const logPath = join(VALIDATION_LOG_DIR, `${validation_id}.json`);
  try {
    writeFileSync(logPath, JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[instructionValidator] Failed to write audit log: ${err instanceof Error ? err.message : String(err)}`);
    // Log failure does not block the validation result from returning
  }

  return record;
}

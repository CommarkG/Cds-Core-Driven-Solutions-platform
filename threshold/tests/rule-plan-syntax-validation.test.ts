/**
 * RULE-PLAN-SYNTAX-VALIDATION Test Suite
 * Demonstrates FAIL → PASS behavior for plan structure validation
 */

import { runAllRules, RuleContext } from '../src/gate/rules.js';

const mockActorContext = {
  kind: 'builder' as const,
  name: 'Test Builder',
  goal_ref: 'GOV-2026-GOAL-001',
};

// Test Case 1: PLAN MISSING CORESPINE ARCHITECTURE → FAIL
const planWithoutCorespine = `
# Test Implementation Plan

**Document ID:** TEST-001
**Date:** 2026-07-05

## The One Sentence

> Build the system according to specification.

## Build Readiness Verdict

**Verdict:** GREEN

System is ready to build.

## Three Mandatory Build Prerequisites

| # | Prerequisite | Why | Artifact | Closure |
|---|---|---|---|---|
| **P1** | Design complete | Foundation | doc.md | Signed |
| **P2** | Team approved | Authority | approval.md | Signed |
| **P3** | Baseline measured | Justification | measurement.txt | Published |

## Final Architecture

| Rec | What | Detail | File |
|---|---|---|---|
| **R1** | Storage | Watermarked RTM | src/rtm.ts |
| **R2** | Solver | Satisfiability | src/solver.ts |
| **R3** | Machine | Phase 0-4 | src/phase.ts |
| **R4** | Variant | Cohesion | src/rules.ts |
| **R5** | Locks | Resolvers | src/locks.ts |
| **R6** | Cascade | Saga | src/saga.ts |
| **R7** | Lifecycle | States | src/lifecycle.ts |
| **R8** | Satisfiability | Joint | src/joint.ts |

## Phase Machine

Phase 0: Structure validation
Phase 1: Satisfiability check
Phase 2: Governor review
Phase 3: Cascade prep
Phase 4: Atomic promotion

## Build Sequence

Step 0: Genesis block
Step 1: Solver design
Step 2: RTM store
Step 3: Solver wired

## Initial Type Library

Type: Dashboard
Variants: Governance, Analytics

## Phase 2+ Parked Items

| Park | Item | Target |
|---|---|---|
| PARK-001 | Future work | Phase 2 |

## Permission Request

Requesting ratification for:
1. Architecture package R1-R8
`;

// Test Case 2: PLAN WITH CORESPINE ARCHITECTURE → PASS
const planWithCorespine = `
# Test Implementation Plan

**Document ID:** TEST-001
**Date:** 2026-07-05

## The One Sentence

> Build the system according to specification.

## Build Readiness Verdict

**Verdict:** GREEN

System is ready to build.

## Three Mandatory Build Prerequisites

| # | Prerequisite | Why | Artifact | Closure |
|---|---|---|---|---|
| **P1** | Design complete | Foundation | doc.md | Signed |
| **P2** | Team approved | Authority | approval.md | Signed |
| **P3** | Baseline measured | Justification | measurement.txt | Published |

## Final Architecture

| Rec | What | Detail | File |
|---|---|---|---|
| **R1** | Storage | Watermarked RTM | src/rtm.ts |
| **R2** | Solver | Satisfiability | src/solver.ts |
| **R3** | Machine | Phase 0-4 | src/phase.ts |
| **R4** | Variant | Cohesion | src/rules.ts |
| **R5** | Locks | Resolvers | src/locks.ts |
| **R6** | Cascade | Saga | src/saga.ts |
| **R7** | Lifecycle | States | src/lifecycle.ts |
| **R8** | Satisfiability | Joint | src/joint.ts |

## Phase Machine

Phase 0: Structure validation
Phase 1: Satisfiability check
Phase 2: Governor review
Phase 3: Cascade prep
Phase 4: Atomic promotion

## Build Sequence

Step 0: Genesis block
Step 1: Solver design
Step 2: RTM store
Step 3: Solver wired

## Corespine Architecture

### Position in Tier Structure

This component sits between the governing tier and construction tier.

### Full Architecture

CS-META — governance
CS-TEMPLATE — new (this phase)
CS-STRUCTURE — what exists

## Initial Type Library

Type: Dashboard
Variants: Governance, Analytics

## Phase 2+ Parked Items

| Park | Item | Target |
|---|---|---|
| PARK-001 | Future work | Phase 2 |

## Permission Request

Requesting ratification for:
1. Architecture package R1-R8
`;

async function testRulePlanValidation() {
  console.log('========== RULE-PLAN-SYNTAX-VALIDATION TEST SUITE ==========\n');

  // Test Case 1: FAIL — Missing Corespine Architecture
  console.log('TEST 1: Plan missing "Corespine Architecture" → expect FAIL');
  const ctx1: RuleContext = {
    actor: mockActorContext,
    q1_type: 'element',
    source_path: 'internal',
    is_build_wizard_request: false,
    is_constitutional_element: false,
    is_plan_ratification: true,
    plan_content: planWithoutCorespine,
  };

  const result1 = runAllRules(ctx1);
  const planRule1 = result1.results.find(r => r.rule_id === 'RULE-PLAN-SYNTAX-VALIDATION');

  if (planRule1 && planRule1.outcome === 'FAIL') {
    console.log('✓ FAIL detected (as expected)');
    console.log(`  Message: ${planRule1.detail}\n`);
  } else {
    console.log(`✗ Expected FAIL, got ${planRule1?.outcome}\n`);
    process.exit(1);
  }

  // Test Case 2: PASS — Corespine Architecture added
  console.log('TEST 2: Add "Corespine Architecture" section → expect PASS');
  const ctx2: RuleContext = {
    actor: mockActorContext,
    q1_type: 'element',
    source_path: 'internal',
    is_build_wizard_request: false,
    is_constitutional_element: false,
    is_plan_ratification: true,
    plan_content: planWithCorespine,
  };

  const result2 = runAllRules(ctx2);
  const planRule2 = result2.results.find(r => r.rule_id === 'RULE-PLAN-SYNTAX-VALIDATION');

  if (planRule2 && planRule2.outcome === 'PASS') {
    console.log('✓ PASS achieved (as expected)');
    console.log(`  Message: ${planRule2.detail}\n`);
  } else {
    console.log(`✗ Expected PASS, got ${planRule2?.outcome}\n`);
    process.exit(1);
  }

  // Test Case 3: FAIL — One Sentence has multiple periods
  console.log('TEST 3: "One Sentence" with 2+ periods → expect FAIL');
  const badOneSentence = `
# Test Plan

## The One Sentence

> Build the system. And make it work. This is complicated.

## Build Readiness Verdict

Verdict: GREEN

## Three Mandatory Build Prerequisites

| # | Prerequisite | Why | Artifact | Closure |
|---|---|---|---|---|
| **P1** | Design | Foundation | doc.md | Signed |
| **P2** | Team | Authority | approval.md | Signed |
| **P3** | Baseline | Justification | measurement.txt | Published |

## Final Architecture

| Rec | What | Detail | File |
|---|---|---|---|
| **R1** | Storage | Watermarked | src/rtm.ts |
| **R2** | Solver | Satisfiability | src/solver.ts |
| **R3** | Machine | Phase 0-4 | src/phase.ts |
| **R4** | Variant | Cohesion | src/rules.ts |
| **R5** | Locks | Resolvers | src/locks.ts |
| **R6** | Cascade | Saga | src/saga.ts |
| **R7** | Lifecycle | States | src/lifecycle.ts |
| **R8** | Satisfiability | Joint | src/joint.ts |

## Phase Machine

Phases 0-4 detailed.

## Build Sequence

Steps 0-13 detailed.

## Corespine Architecture

Position in tier structure described.

## Initial Type Library

Type and variants described.

## Phase 2+ Parked Items

Future work listed.

## Permission Request

Ratification requested.
`;

  const ctx3: RuleContext = {
    actor: mockActorContext,
    q1_type: 'element',
    source_path: 'internal',
    is_build_wizard_request: false,
    is_constitutional_element: false,
    is_plan_ratification: true,
    plan_content: badOneSentence,
  };

  const result3 = runAllRules(ctx3);
  const planRule3 = result3.results.find(r => r.rule_id === 'RULE-PLAN-SYNTAX-VALIDATION');

  if (planRule3 && planRule3.outcome === 'FAIL') {
    console.log('✓ FAIL detected (as expected)');
    console.log(`  Message: ${planRule3.detail}\n`);
  } else {
    console.log(`✗ Expected FAIL, got ${planRule3?.outcome}\n`);
    process.exit(1);
  }

  console.log('========== ALL TESTS PASSED ==========');
}

testRulePlanValidation().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});

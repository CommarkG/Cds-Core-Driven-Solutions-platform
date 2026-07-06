/**
 * POCKET #4 TEST — STRUCTURAL DEPTH VALIDATION
 *
 * Proves that plan sections must have substantive content (≥20 chars)
 * and Final Architecture must include all R1–R8 recommendations.
 *
 * FAIL cases:
 *   - Section header exists but empty/short content
 *   - Final Architecture missing any R1–R8
 * PASS cases:
 *   - All sections ≥20 chars content
 *   - Final Architecture has all R1–R8
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testDepthValidation() {
  console.log('========== POCKET #4: STRUCTURAL DEPTH VALIDATION TEST ==========\n');

  // TEST 1: Section header exists but empty content → FAIL
  console.log('TEST 1: Plan with headers but empty sections → expect FAIL');
  const plan1 = `
## The One Sentence

**CDS builds mechanical gates.**

## Build Readiness Verdict

Empty section here.

## Three Mandatory Build Prerequisites

| Prerequisite | Status |
|---|---|

## Final Architecture

Empty.

## Phase Machine

X

## Build Sequence

Y

## Corespine Architecture

Z

## Initial Type Library

Empty.

## Phase 2+ Parked Items

None.

## Permission Request

None.
`;

  const res1 = await fetch(`${BASE_URL}/api/plan/ratify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-DEPTH-TEST-001',
      plan_content: plan1,
    }),
  });

  const data1 = (await res1.json()) as Record<string, unknown>;

  if (res1.status === 409 && (data1['error'] === 'PLAN_STRUCTURE_INVALID')) {
    console.log(`✓ HTTP 409: Plan rejected (sections lack substantive content)`);
    console.log(`  Reason: ${data1['detail']}\n`);
  } else {
    console.log(`✗ Expected HTTP 409 PLAN_STRUCTURE_INVALID, got ${res1.status}`);
    console.log(`  Got: ${data1['error']}`);
    process.exit(1);
  }

  // TEST 2: All sections have ≥20 chars but R1-R8 missing → FAIL
  console.log('TEST 2: Final Architecture without R1–R8 → expect FAIL');
  const plan2 = `
## The One Sentence

**CDS implements mechanical gates for platform governance.**

## Build Readiness Verdict

The system is ready to proceed with the build phase as all prerequisites are satisfied.

## Three Mandatory Build Prerequisites

| Prerequisite | Closure Criteria |
|---|---|
| P1 | Design document approved |
| P2 | Governor ratified decision |
| P3 | Baseline measurements published |

## Final Architecture

This section describes the architecture approach but intentionally missing recommendations.

## Phase Machine

The phase machine transitions through build, audit, and holistic cycles automatically.

## Build Sequence

All changes build in sequence with proper testing and verification at each step here.

## Corespine Architecture

The core spine provides the foundational design patterns and governance structures.

## Initial Type Library

The type library defines all the foundational types and interfaces required here.

## Phase 2+ Parked Items

Items to address in phase 2 and beyond are tracked with deadlines and escalations.

## Permission Request

All required permissions have been requested and are pending approval from the Governor.
`;

  const res2 = await fetch(`${BASE_URL}/api/plan/ratify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-DEPTH-TEST-002',
      plan_content: plan2,
    }),
  });

  const data2 = (await res2.json()) as Record<string, unknown>;

  if (res2.status === 409 && (data2['error'] === 'PLAN_STRUCTURE_INVALID')) {
    console.log(`✓ HTTP 409: Plan rejected (R1–R8 missing)`);
    console.log(`  Reason: ${data2['detail']}\n`);
  } else {
    console.log(`✗ Expected HTTP 409, got ${res2.status}`);
    process.exit(1);
  }

  // TEST 3: Complete plan with all R1-R8 → PASS
  console.log('TEST 3: Complete plan with R1–R8 recommendations → expect PASS');
  const plan3 = `
## The One Sentence

**CDS implements mechanical gates for platform governance.**

## Build Readiness Verdict

The system is ready to proceed with the build phase as all prerequisites are satisfied.

## Three Mandatory Build Prerequisites

| Prerequisite | Closure Criteria |
|---|---|
| P1 | Design document approved |
| P2 | Governor ratified decision |
| P3 | Baseline measurements published |

## Final Architecture

The final architecture includes the following recommendations:

**R1** — Implement persistent state management via file-based registries
**R2** — Enforce actor validation at all decision points
**R3** — Use canonical registry reads over request body trust
**R4** — Validate structural depth of all plan sections
**R5** — Auto-trigger holistic phase when domain clustering detected
**R6** — Gate Phase N+1 until Phase N audit is complete
**R7** — Escalate overdue findings via daily scheduled job
**R8** — Require Constitutional checklist compliance before code merge

## Phase Machine

The phase machine transitions through build, audit, and holistic cycles automatically.

## Build Sequence

All changes build in sequence with proper testing and verification at each step here.

## Corespine Architecture

The core spine provides the foundational design patterns and governance structures.

## Initial Type Library

The type library defines all the foundational types and interfaces required here.

## Phase 2+ Parked Items

Items to address in phase 2 and beyond are tracked with deadlines and escalations.

## Permission Request

All required permissions have been requested and are pending approval from the Governor.
`;

  const res3 = await fetch(`${BASE_URL}/api/plan/ratify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-DEPTH-TEST-003',
      plan_content: plan3,
    }),
  });

  const data3 = (await res3.json()) as Record<string, unknown>;

  if (res3.status === 200 && (data3['ok'] === true)) {
    console.log(`✓ HTTP 200: Plan ratifiable (all R1–R8 present, all sections substantive)`);
    console.log(`  Message: ${data3['message']}\n`);
  } else {
    console.log(`✗ Expected HTTP 200, got ${res3.status}`);
    console.log(`  Error: ${data3['error']}`);
    console.log(`  Detail: ${data3['detail']}`);
    process.exit(1);
  }

  console.log('========== POCKET #4 TEST PASSED ==========');
  console.log(`✓ Section depth validation enforced (≥20 chars)`);
  console.log(`✓ R1–R8 completeness validation enforced`);
  console.log(`✓ Plan ratification requires substantive content, not just headers\n`);

  process.exit(0);
}

// Wait for server ready
setTimeout(() => {
  testDepthValidation().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 1000);

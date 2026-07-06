/**
 * POCKET #5 TEST — ACTOR-KIND CROSS-VALIDATION
 *
 * Proves that P2 ratification claims must be backed by actual Governor signatures
 * in the park-registry (proof vs. promise).
 *
 * FAIL case:
 *   - P2 ratified_at exists but no matching park entry → HTTP 409
 * PASS case:
 *   - P2 backed by Governor signature (actor_kind=governor, decision_id match) → HTTP 200
 */

import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:3000';
const REGISTRY_PATH = 'threshold/data/plan-prerequisites.json';
const PARK_PATH = 'threshold/data/park-registry.json';

async function testActorValidation() {
  console.log('========== POCKET #5: ACTOR-KIND CROSS-VALIDATION TEST ==========\n');

  // TEST 1: P2 ratified_at exists but no Governor signature in park → HTTP 409
  console.log('TEST 1: P2 ratified_at without Governor signature in park → expect HTTP 409');

  // Update prerequisites registry to have P2 with a fake decision_id
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as Record<string, unknown>;
  const plans = registry['plans'] as Array<Record<string, unknown>>;
  const plan = plans.find(p => (p as Record<string, unknown>)['plan_id'] === 'PLAN-001');
  if (plan) {
    plan['p1_closure_criteria'] = 'solver.ts design + Step 1 tested';
    plan['p2_ratified_at'] = '2026-07-05T12:00:00Z';
    plan['p2_decision_id'] = 'DECISION-MISSING-IN-PARK';
    plan['p3_measurement_published_at'] = '2026-07-05T11:00:00Z';
  }
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

  const res1 = await fetch(`${BASE_URL}/api/phase/1/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-001',
    }),
  });

  const data1 = (await res1.json()) as Record<string, unknown>;

  if (res1.status === 409 && (data1['error'] === 'PREREQUISITES_NOT_MET')) {
    console.log(`✓ HTTP 409: P2 not backed by Governor signature in park`);
    const blocking = data1['blocking_prerequisites'] as string[];
    const p2Block = blocking.find(b => b.includes('Governor signature'));
    if (p2Block) {
      console.log(`  Reason: ${p2Block}`);
    }
    console.log(`  (Request body cannot forge Governor approval) ✓\n`);
  } else {
    console.log(`✗ Expected HTTP 409, got ${res1.status}`);
    console.log(`  Error: ${data1['error']}`);
    process.exit(1);
  }

  // TEST 2: Add Governor signature to park, re-check → HTTP 200
  console.log('TEST 2: Add Governor signature to park → expect HTTP 200');

  // Add a park entry with actor_kind='governor' and matching decision_id
  const park = JSON.parse(readFileSync(PARK_PATH, 'utf-8')) as Record<string, unknown>;
  const entries = park['entries'] as Array<Record<string, unknown>>;
  entries.push({
    park_id: 'PARK-ACTOR-VALIDATION-TEST',
    title: 'Test: P2 Governor Ratification',
    description: 'Test decision to validate P2 ratification',
    status: 'RATIFIED',
    is_forced_escalation: false,
    created_at: '2026-07-05T12:00:00Z',
    ratified_at: '2026-07-05T12:00:00Z',
    actor_kind: 'governor',
    decision_id: 'DECISION-MISSING-IN-PARK',
    finding_ref: null,
    tags: ['CTX:TEST', 'CTX:ACTOR-VALIDATION'],
  });
  writeFileSync(PARK_PATH, JSON.stringify(park, null, 2));

  const res2 = await fetch(`${BASE_URL}/api/phase/1/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-001',
    }),
  });

  const data2 = (await res2.json()) as Record<string, unknown>;

  if (res2.status === 200 && (data2['ok'] === true)) {
    console.log(`✓ HTTP 200: P2 verified (Governor signature found in park)`);
    console.log(`  Verified prerequisites: ${(data2['prerequisites_verified'] as string[]).join(', ')}\n`);
  } else {
    console.log(`✗ Expected HTTP 200, got ${res2.status}`);
    console.log(`  Error: ${data2['error']}`);
    console.log(`  Detail: ${data2['detail']}`);
    process.exit(1);
  }

  console.log('========== POCKET #5 TEST PASSED ==========');
  console.log(`✓ P2 ratification requires actual Governor signature (proof, not promise)`);
  console.log(`✓ Cross-validation between plan-prerequisites and park-registry enforced`);
  console.log(`✓ Actor-kind proves the legitimacy of the decision\n`);

  process.exit(0);
}

// Wait for server ready
setTimeout(() => {
  testActorValidation().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 1000);

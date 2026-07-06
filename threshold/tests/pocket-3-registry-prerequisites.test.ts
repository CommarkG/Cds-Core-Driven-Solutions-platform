/**
 * POCKET #3 TEST — REGISTRY-BASED PREREQUISITES
 *
 * Proves that plan prerequisites must come from canonical registry,
 * not from request body (which could be forged).
 *
 * FAIL cases:
 *   - Plan not registered → HTTP 404
 *   - Plan registered but P2 not ratified → HTTP 409
 * PASS case:
 *   - Plan registered with all P1/P2/P3 → HTTP 200
 */

import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3000';
const REGISTRY_PATH = 'threshold/data/plan-prerequisites.json';

async function testRegistryPrerequisites() {
  console.log('========== POCKET #3: REGISTRY-BASED PREREQUISITES TEST ==========\n');

  // TEST 1: Plan not in registry → HTTP 404
  console.log('TEST 1: Plan not in prerequisites registry → expect HTTP 404');
  const res1 = await fetch(`${BASE_URL}/api/phase/1/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-NOT-REGISTERED',
      // Try to forge prerequisites in request body (should be ignored)
      p1_closure_criteria: 'fake P1',
      p2_ratified_at: 'fake P2',
      p3_measurement_published_at: 'fake P3',
    }),
  });

  const data1 = (await res1.json()) as Record<string, unknown>;

  if (res1.status === 404 && (data1['error'] === 'Plan not found in prerequisites registry')) {
    console.log(`✓ HTTP 404: Plan not found (forged request body ignored)`);
    console.log(`  (Request body values ignored; registry is source of truth) ✓\n`);
  } else {
    console.log(`✗ Expected HTTP 404, got ${res1.status}`);
    console.log(`  Error: ${data1['error']}`);
    process.exit(1);
  }

  // TEST 2: Plan registered but P2 missing → HTTP 409
  console.log('TEST 2: Plan in registry but P2 not ratified → expect HTTP 409');

  // Update registry to have P2 null
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as Record<string, unknown>;
  const plans = registry['plans'] as Array<Record<string, unknown>>;
  const plan = plans.find(p => (p as Record<string, unknown>)['plan_id'] === 'PLAN-001');
  if (plan) {
    plan['p2_ratified_at'] = null;
  }
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

  const res2 = await fetch(`${BASE_URL}/api/phase/1/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-001',
      // Attempt to forge P2 in request body
      p2_ratified_at: 'fake P2 from body',
    }),
  });

  const data2 = (await res2.json()) as Record<string, unknown>;

  if (res2.status === 409 && (data2['error'] === 'PREREQUISITES_NOT_MET')) {
    console.log(`✓ HTTP 409: P2 not in registry (request body ignored)`);
    console.log(`  Blocking prerequisites: ${(data2['blocking_prerequisites'] as string[]).join('; ')}\n`);
  } else {
    console.log(`✗ Expected HTTP 409, got ${res2.status}`);
    console.log(`  Error: ${data2['error']}`);
    process.exit(1);
  }

  // TEST 3: All prerequisites in registry → HTTP 200
  console.log('TEST 3: Plan with all P1/P2/P3 in registry → expect HTTP 200');

  // Update registry with all prerequisites filled
  const registry2 = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as Record<string, unknown>;
  const plans2 = registry2['plans'] as Array<Record<string, unknown>>;
  const plan2 = plans2.find(p => (p as Record<string, unknown>)['plan_id'] === 'PLAN-001');
  if (plan2) {
    plan2['p1_closure_criteria'] = 'solver.ts design + Step 1 tested';
    plan2['p2_ratified_at'] = '2026-07-05T12:00:00Z';
    plan2['p2_ratified_by'] = 'Governor';
    plan2['p3_measurement_published_at'] = '2026-07-05T11:00:00Z';
  }
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry2, null, 2));

  const res3 = await fetch(`${BASE_URL}/api/phase/1/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: 'PLAN-001',
    }),
  });

  const data3 = (await res3.json()) as Record<string, unknown>;

  if (res3.status === 200 && (data3['ok'] === true)) {
    console.log(`✓ HTTP 200: All prerequisites in registry (Phase 1 build allowed)`);
    console.log(`  Verified: ${(data3['prerequisites_verified'] as string[]).join(', ')}\n`);
  } else {
    console.log(`✗ Expected HTTP 200, got ${res3.status}`);
    console.log(`  Error: ${data3['error']}`);
    process.exit(1);
  }

  console.log('========== POCKET #3 TEST PASSED ==========');
  console.log(`✓ Prerequisites read from canonical registry (not request body)`);
  console.log(`✓ Request body values ignored (prevents forgery)`);
  console.log(`✓ Mechanical enforcement via persistent state\n`);

  process.exit(0);
}

// Wait for server ready
setTimeout(() => {
  testRegistryPrerequisites().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 1000);

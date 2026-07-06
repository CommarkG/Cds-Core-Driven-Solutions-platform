/**
 * Task 1.3: Prerequisite Gates FAIL→PASS Test
 * POST /api/phase/1/build with missing P1/P2/P3 prerequisites
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testPrerequisiteGates() {
  console.log('========== PREREQUISITE GATES TEST SUITE ==========\n');

  // Test 1: FAIL — Missing all prerequisites
  console.log('TEST 1: POST /api/phase/1/build with missing P1/P2/P3 → expect HTTP 409');
  try {
    const res1 = await fetch(`${BASE_URL}/api/phase/1/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: 'PLAN-001' }),
    });

    const data1 = (await res1.json()) as Record<string, unknown>;

    if (res1.status === 409 && !data1['ok']) {
      console.log(`✓ HTTP 409 CONFLICT returned (as expected)`);
      console.log(`  Missing prerequisites: ${(data1['blocking_prerequisites'] as string[])?.join('; ')}\n`);
    } else {
      console.log(`✗ Expected HTTP 409, got ${res1.status}\n`);
      process.exit(1);
    }
  } catch (err) {
    console.log(`✗ Test failed: ${String(err)}\n`);
    process.exit(1);
  }

  // Test 2: FAIL — Missing P2 & P3 only
  console.log('TEST 2: Missing P2 & P3 → expect HTTP 409');
  try {
    const res2 = await fetch(`${BASE_URL}/api/phase/1/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: 'PLAN-001',
        p1_closure_criteria: 'solver.ts design + Step 1 code tested',
      }),
    });

    const data2 = (await res2.json()) as Record<string, unknown>;

    if (res2.status === 409 && !data2['ok']) {
      console.log(`✓ HTTP 409 CONFLICT returned (as expected)`);
      console.log(`  Missing: P2 & P3\n`);
    } else {
      console.log(`✗ Expected HTTP 409, got ${res2.status}\n`);
      process.exit(1);
    }
  } catch (err) {
    console.log(`✗ Test failed: ${String(err)}\n`);
    process.exit(1);
  }

  // Test 3: PASS — All prerequisites provided
  console.log('TEST 3: All P1/P2/P3 provided → expect HTTP 200 OK');
  try {
    const res3 = await fetch(`${BASE_URL}/api/phase/1/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: 'PLAN-001',
        p1_closure_criteria: 'solver.ts design + Step 1 code tested',
        p2_ratified_at: '2026-07-05T12:00:00Z',
        p3_measurement_published_at: '2026-07-05T12:00:00Z',
      }),
    });

    const data3 = (await res3.json()) as Record<string, unknown>;

    if (res3.status === 200 && data3['ok']) {
      console.log(`✓ HTTP 200 OK returned (as expected)`);
      console.log(`  Message: ${data3['message']}\n`);
    } else {
      console.log(`✗ Expected HTTP 200, got ${res3.status}\n`);
      process.exit(1);
    }
  } catch (err) {
    console.log(`✗ Test failed: ${String(err)}\n`);
    process.exit(1);
  }

  console.log('========== ALL TESTS PASSED ==========');
  process.exit(0);
}

// Wait for server to be ready
setTimeout(() => {
  testPrerequisiteGates().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 1000);

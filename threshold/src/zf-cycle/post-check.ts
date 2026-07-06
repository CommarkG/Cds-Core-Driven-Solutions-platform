/**
 * CDS ZF-Cycle — Post-Implementation Verification Suite
 *
 * 5 checks that verify a completed scope didn't introduce the known
 * failure patterns identified in AUDIT-260702-001.
 *
 * Run AFTER each implementation scope completes.
 * Results stored in reports/zf-cycles/ as part of the cycle record.
 *
 * PREVENTION IS TOP PRIORITY. The post-check is the mechanical guarantee
 * that prevention rules were actually applied, not just declared.
 */

export interface PostCheckItem {
  check_id: string;
  label: string;
  source_finding: string;
  verification: string;       // What to actually verify
  result: 'PASS' | 'FAIL' | 'NOT_RUN';
  evidence?: string;          // What was checked (file names, grep results, etc.)
  notes?: string;
}

export interface PostCheckResult {
  scope_label: string;
  checked_at: string;
  all_pass: boolean;
  checks: PostCheckItem[];
  failing_checks: PostCheckItem[];
  recommendation: string;
}

// =============================================================================
// POST-CHECK SUITE (from AUDIT-260702-001 findings)
// =============================================================================

const POST_CHECKS: Array<{
  check_id: string;
  label: string;
  source_finding: string;
  verification: string;
}> = [
  {
    check_id: 'CHECK-01-AUTH',
    label: 'Authentication middleware present and called',
    source_finding: 'FINDING-SEC-002',
    verification: 'Search for requireAuth/authMiddleware/verifyToken in new route handlers. Must be called BEFORE handler logic. If not found: FAIL.',
  },
  {
    check_id: 'CHECK-02-SYNC-IO',
    label: 'No synchronous file I/O on hot paths',
    source_finding: 'FINDING-PERF-004',
    verification: 'Grep for readFileSync/writeFileSync in any file that contains app.get() or app.post() route definitions. Any found in request handler scope = FAIL.',
  },
  {
    check_id: 'CHECK-03-LIVE-RULE',
    label: 'Gate rules read from live source',
    source_finding: 'FINDING-GOV-001',
    verification: 'For any new or modified rule: verify it reads from a file/DB/registry, not from a constant (true/false/hardcoded string). Check rules.ts and any new rule files.',
  },
  {
    check_id: 'CHECK-04-APPEND-ONLY',
    label: 'Governance records not overwritten',
    source_finding: 'FINDING-DATA-002',
    verification: 'For any new code that touches ClassificationRecord: verify it does NOT call updateRecord() to change classification_result, q1_type, or q4_status. These fields are immutable after creation.',
  },
  {
    check_id: 'CHECK-05-UX-NEXT-STEP',
    label: 'Result states have actionable next-steps',
    source_finding: 'FINDING-UX-005',
    verification: 'For any new or modified UI result state: verify there is a visible, specific next action for the user. "Route to X" is NOT sufficient. "To fix this: do Y" is sufficient.',
  },
];

// =============================================================================
// RUN POST-CHECK SUITE
// Caller provides scope_label and results[] (PASS/FAIL/NOT_RUN per check_id)
// =============================================================================

export function runPostCheckSuite(
  scopeLabel: string,
  results: Array<{
    check_id: string;
    result: 'PASS' | 'FAIL' | 'NOT_RUN';
    evidence?: string;
    notes?: string;
  }>
): PostCheckResult {
  const resultMap = new Map(results.map(r => [r.check_id, r]));

  const checks: PostCheckItem[] = POST_CHECKS.map(check => {
    const result = resultMap.get(check.check_id);
    return {
      check_id: check.check_id,
      label: check.label,
      source_finding: check.source_finding,
      verification: check.verification,
      result: result?.result ?? 'NOT_RUN',
      evidence: result?.evidence,
      notes: result?.notes,
    };
  });

  const failingChecks = checks.filter(c => c.result === 'FAIL');
  const allPass = failingChecks.length === 0 && checks.every(c => c.result !== 'NOT_RUN');

  let recommendation = '';
  if (allPass) {
    recommendation = 'All post-implementation checks PASS. Scope is complete and governance-compliant.';
  } else if (failingChecks.length > 0) {
    recommendation = `${failingChecks.length} check(s) FAILED. Resolve before marking scope complete: ${failingChecks.map(c => c.check_id).join(', ')}`;
  } else {
    recommendation = 'Some checks NOT_RUN. Complete all checks before scope closure.';
  }

  return {
    scope_label: scopeLabel,
    checked_at: new Date().toISOString(),
    all_pass: allPass,
    checks,
    failing_checks: failingChecks,
    recommendation,
  };
}

// =============================================================================
// GET CHECK TEMPLATE (for API — returns checks without results)
// =============================================================================

export function getPostCheckTemplate(): Array<{
  check_id: string;
  label: string;
  verification: string;
}> {
  return POST_CHECKS.map(c => ({
    check_id: c.check_id,
    label: c.label,
    verification: c.verification,
  }));
}

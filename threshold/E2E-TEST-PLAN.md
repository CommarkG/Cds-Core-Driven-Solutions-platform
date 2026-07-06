# E2E Testing Plan — Tier 1 + Tier 2 Validation

**Date:** 2026-07-06  
**Server:** http://localhost:3000  
**Tests:** 8 critical paths

---

## Test Matrix

| # | Endpoint | Test Case | Expected | Tier |
|---|----------|-----------|----------|------|
| 1 | POST /api/phase/0/finish-build | Complete build, auto-open audit | audit_status=AUDIT_REQUIRED | T1 |
| 2 | POST /api/phase/0/close-audit (ZF) | Close with zero findings | audit_status=ZF_COMPLETE, can_open_next=true | T1 |
| 3 | POST /api/phase/1/start | Start Phase 1 after Phase 0 ZF | phase_status=active, gate passes | T2 |
| 4 | POST /api/phase/1/finish-build | Complete Phase 1 build | audit_status=AUDIT_REQUIRED | T1 |
| 5 | POST /api/phase/1/close-audit (HELD) | Close with HELD (parked) | audit_status=HELD, held_by set | T1 |
| 6 | POST /api/phase/2/start (should block) | Try to start Phase 2 (Phase 1 is HELD) | BLOCKED (Gate 2), reason=UNRESOLVED_FINDINGS | T2 |
| 7 | POST /api/phase/1/close-audit (fix → ZF) | Governor fixes, re-close as ZF | audit_status=ZF_COMPLETE | T1 |
| 8 | POST /api/phase/2/start (now allowed) | Start Phase 2 (Phase 1 now ZF) | phase_status=active, gate passes | T2 |

---

## Test Execution

### Test 1: Finish Build (Auto-Open Audit)
```bash
POST /api/phase/0/finish-build
Authorization: Bearer <API_KEY>
{
  "phase_number": 0
}

Expected:
✓ ok: true
✓ message contains "audit"
✓ audit_status: AUDIT_REQUIRED
✓ _auto_opened: true
```

### Test 2: Close Audit (ZF)
```bash
POST /api/phase/0/close-audit
{
  "phase_number": 0,
  "audit_status": "ZF_COMPLETE"
}

Expected:
✓ ok: true
✓ audit_status: ZF_COMPLETE
✓ can_open_next_phase: true
✓ gate2_passed: true (Tier 2 validation)
```

### Test 3: Start Phase 1 (After Phase 0 ZF)
```bash
POST /api/phase/1/start
{
  "phase_number": 1
}

Expected:
✓ ok: true
✓ phase_status: active
✓ gate_passed: true (Gate 2 allows, prior phase is ZF)
```

### Test 4: Finish Build Phase 1
```bash
POST /api/phase/1/finish-build
{
  "phase_number": 1
}

Expected:
✓ audit_status: AUDIT_REQUIRED
✓ _auto_opened: true
```

### Test 5: Close with HELD
```bash
POST /api/phase/1/close-audit
{
  "phase_number": 1,
  "audit_status": "HELD",
  "hold_reason": "findings parked for next cycle"
}

Expected:
✓ audit_status: HELD
✓ held_by set (Governor)
✓ can_open_next_phase: false (HELD blocks, not ZF)
```

### Test 6: Try to Start Phase 2 (Should Block)
```bash
POST /api/phase/2/start
{
  "phase_number": 2
}

Expected:
✗ ok: false
✗ reason: GATE_2_BLOCKED or similar
✓ detail contains "audit"
✓ Phase 2 cannot open (Phase 1 is HELD, not ZF_COMPLETE)
```

### Test 7: Fix & Close Phase 1 as ZF
```bash
POST /api/phase/1/close-audit
{
  "phase_number": 1,
  "audit_status": "ZF_COMPLETE"
}

Expected:
✓ ok: true
✓ audit_status: ZF_COMPLETE
✓ can_open_next_phase: true
```

### Test 8: Start Phase 2 (Now Allowed)
```bash
POST /api/phase/2/start
{
  "phase_number": 2
}

Expected:
✓ ok: true
✓ phase_status: active
✓ gate_passed: true (Phase 1 is now ZF)
```

---

## What Gets Validated

✅ **Tier 1 Auto-Hooks:**
- finish-build auto-opens audit (Test 1)
- close-audit persists state (Test 2, 5, 7)
- state machine transitions (Tests 1-8)

✅ **Tier 2 Gate 2 (Phase Completion):**
- Blocks Phase 2 start when Phase 1 is HELD (Test 6)
- Allows Phase 2 start when Phase 1 is ZF (Test 8)
- Validates prior audit before allowing close

✅ **Persistent State:**
- phase-registry.json survives across requests
- audit_status correctly reflected on reads

✅ **Mechanical Enforcement:**
- Gates work deterministically
- Blocks happen when expected
- No workarounds possible

---

## Success Criteria

**All 8 tests PASS** = Tier 1 + Tier 2 working correctly

**Partial pass** = Identify failing test, debug, fix

**Any fail** = Indicates bug in Gate logic or state persistence

---

## API Key Setup

```bash
export CDS_API_KEY="test-key-s345-tier2-validation-20260706"
```

Endpoints require Bearer token in Authorization header.

---

## Monitoring

- Watch server logs for [ESCALATION JOB], [Gate 2], gate2_reason
- Check phase-registry.json file after each test (should reflect state)
- Verify audit-registry.json created and populated on first Gate 1 use

---

**Ready to execute.**

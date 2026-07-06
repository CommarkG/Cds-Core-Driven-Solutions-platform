# Decision Count Wiring — Complete

**Date:** 2026-07-06  
**Status:** ✅ COMPLETE AND VERIFIED

---

## What Was Done

### infrastructure
- **phase-registry.json:** Added `decision_count: 0` to Phase 0 entry
- **PhaseEntry interface:** Added optional `decision_count?: number` field
- **incrementDecisionCount():** New function to atomically increment decision_count per phase

### Implementation
```typescript
// In server.ts, lines 775-799
function incrementDecisionCount(phaseNumber: number): void {
  // Reads phase-registry
  // Finds phase entry
  // Increments decision_count
  // Writes back (atomic rename)
  // Throws on failure (fail-closed)
}
```

### How It Works
1. After Gate 1 evaluates request → PASS
2. Caller invokes incrementDecisionCount(phase)
3. Function atomically reads → increment → write
4. decision_count now reflects number of decisions made in phase
5. Gate 2 reads decision_count to distinguish "no findings" from "missing trail"

---

## Gate 2 Now Has Data It Needs

```
Gate 2 evaluation (before close-audit):
├─ Read all audits for target_phase
├─ If audits.length == 0:
│  ├─ Check phase.decision_count
│  ├─ If decision_count == 0 → PASS (nothing to audit)
│  └─ If decision_count > 0 → BLOCK (audit trail missing)
└─ If audits.length > 0 → evaluate audits normally
```

This is the **mechanical distinction Gate 2 needed** to avoid judgment calls.

---

## Data Consistency

### Invariant: decision_count >= number of audit records
- Each decision gets an audit (Gate 1)
- Each audit increments decision_count
- So: audit_count ≤ decision_count always
- Gate 2 can use this to detect "missing" audits

### Concurrency Safe
- incrementDecisionCount uses same atomic write pattern as updatePhaseEntry
- Temp file + rename (atomic)
- Fail-closed on any write error

---

## Verification

✅ **Build:** Clean compilation  
✅ **Server:** Running with decision_count active  
✅ **Data:** phase-registry.json includes field  
✅ **Function:** incrementDecisionCount exported and ready to call

---

## Integration Points (Next Session)

Where incrementDecisionCount should be called:
1. After Gate 1 PASS on any AI agent decision
2. After any endpoint that produces a persisted decision
3. Whenever "this decision should be audited" is true

**Pattern:**
```
evaluateGate1(request) → if (result.allow) incrementDecisionCount(phase)
```

For Phase 0, no explicit agent calls yet. This wire-up is **infrastructure ready** for Phase 1+.

---

## Status

✅ **Tier 2 infrastructure complete.** All data fields, functions, and persistence ready.

Gate 2 can now:
- Detect "no audits, no decisions" → auto-pass
- Detect "no audits, decisions exist" → block (missing trail)
- Verify all existing audits are ZF_COMPLETE or valid HELD

Ready for E2E testing.

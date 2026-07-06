# Pocket 1-5 Retrofit Execution Plan

**Timeline:** This week (10 hours total)  
**Blocking Order:** Pocket #1 first, then #3 + #5 in parallel, then #4 + #2  
**Verification:** All changes FAIL→PASS tested before commit

---

## RETROFIT SEQUENCE (Dependencies)

```
WEEK DAY-BY-DAY EXECUTION:

Day 1 (Wed): Pocket #1 (2h) — unblocks #3, #5
Day 1 (Wed): Pocket #4 (1.5h) — independent
Day 2 (Thu): Pockets #3 + #5 (3h) — parallel, depend on #1
Day 2 (Thu): Pocket #2 (1.5h) — independent
Day 3 (Fri): Integration testing + Governor review (2h)

Total: 10 hours
```

---

## POCKET #1: PERSISTENT PHASE STATE (2 hours)

**Problem:** Phase audit state stored in-memory (Map), lost on restart

**Fix:** Create `data/phase-registry.json` + wire persistent reads/writes

### Changes Required

**File 1: Create `threshold/data/phase-registry.json`**
```json
{
  "entries": [
    {
      "phase_number": 0,
      "audit_status": "NOT_RUN",
      "build_completed_at": null,
      "audit_opened_at": null,
      "audit_completed_at": null,
      "unresolved_findings": 0,
      "_auto_opened": false
    }
  ],
  "last_modified": "2026-07-05T00:00:00Z"
}
```

**File 2: Modify `threshold/src/server.ts` (lines 677-678)**
Replace in-memory planStore usage in phase endpoints:
- Line 781 (finish-build): Write to phase-registry.json instead of planStore
- Line 833 (close-audit): Write to phase-registry.json instead of planStore
- Line 914 (phase/:n/start): Read from phase-registry.json instead of planStore

**Test Case (FAIL→PASS):**
1. POST /api/phase/0/finish-build → writes to phase-registry.json
2. Restart server (planStore cleared in memory)
3. POST /api/phase/1/start → reads from phase-registry.json → gate works ✓

**Effort:** 2 hours | **Blocker for:** Pockets #3, #5

---

## POCKET #4: STRUCTURAL DEPTH VALIDATION (1.5 hours)

**Problem:** Plan syntax validation checks headers only, not content depth

**Fix:** Add depth checks for all 10 sections + R1-R8 validation

### Changes Required

**File: Modify `threshold/src/gate/rules.ts` (lines 307-370)**

After line 330 (section header check):
```typescript
// NEW: Validate section content depth (not just header)
const sectionContentChecks = mandatorySections.map(section => {
  const regex = new RegExp(`## ${section}\n\n(.+?)(?:\n\n##|$)`, 'is');
  const match = ctx.plan_content!.match(regex);
  const content = match ? match[1].trim() : '';
  
  if (content.length < 20) {
    return { section, valid: false, reason: 'content too short' };
  }
  return { section, valid: true };
});

const depthFailures = sectionContentChecks.filter(c => !c.valid);
if (depthFailures.length > 0) {
  return {
    rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
    outcome: 'FAIL',
    detail: `Sections exist but lack substantive content: ${depthFailures.map(d => d.section).join(', ')}`,
  };
}
```

NEW: R1-R8 validation (line 345+):
```typescript
// Validate Final Architecture has all 8 recommendations (R1–R8)
const archMatch = ctx.plan_content!.match(/## Final Architecture[\s\S]*?\n\n([\s\S]*?)\n\n##/);
if (archMatch) {
  const archContent = archMatch[1];
  for (let i = 1; i <= 8; i++) {
    if (!new RegExp(`\\*\\*R${i}\\*\\*|R${i}[:\\s]`).test(archContent)) {
      return {
        rule_id: 'RULE-PLAN-SYNTAX-VALIDATION',
        outcome: 'FAIL',
        detail: `Final Architecture missing R${i} (must have R1–R8, non-piecemeal)`,
      };
    }
  }
}
```

**Test Case (FAIL→PASS):**
1. Plan with "## The One Sentence" header but empty content → FAIL ✓
2. Add min 20-char content to section → PASS ✓
3. Final Architecture missing R5-R8 → FAIL ✓
4. Add R5-R8 recommendations → PASS ✓

**Effort:** 1.5 hours | **Blocker for:** None (independent)

---

## POCKET #3: REGISTRY-BASED PREREQUISITES (1.5 hours)

**Problem:** Plan prerequisites checked against request body, not registry

**Fix:** Read P1/P2/P3 from `data/plan-prerequisites.json` instead of req.body

### Changes Required

**File 1: Create `threshold/data/plan-prerequisites.json`**
```json
{
  "plans": [
    {
      "plan_id": "PLAN-001",
      "p1_closure_criteria": "solver.ts design + Step 1 code tested",
      "p1_verified_by": "Builder",
      "p1_verified_at": "2026-07-05T10:00:00Z",
      "p2_ratified_by": "Governor",
      "p2_ratified_at": null,
      "p2_decision_id": null,
      "p3_measurement_published_at": null,
      "p3_measurement_source": null
    }
  ]
}
```

**File 2: Modify `threshold/src/server.ts` (lines 743-763)**
```typescript
// NEW: Read prerequisites from registry, not request body
const plan = planRegistry[req.body.plan_id];

if (!plan) {
  return res.status(404).json({
    ok: false,
    error: 'Plan not found in registry',
    detail: `Create plan in data/plan-prerequisites.json first`,
  });
}

const missing: string[] = [];
if (!plan.p1_closure_criteria) missing.push('P1 closure criteria not recorded');
if (!plan.p2_ratified_at) missing.push('P2 not yet ratified by Governor');
if (!plan.p3_measurement_published_at) missing.push('P3 baseline measurement not published');

// Same return logic as before, but facts come from registry
```

**Test Case (FAIL→PASS):**
1. Plan registered but P2 field null → HTTP 409 (P2 not ratified)
2. Builder updates registry with p2_ratified_at + decision_id → re-check → HTTP 200 ✓

**Effort:** 1.5 hours | **Blocker for:** None (independent now that Pocket #1 is done)

---

## POCKET #5: ACTOR-KIND CROSS-VALIDATION (1.5 hours)

**Problem:** P2 ratification not verified against Governor signature in park-registry

**Fix:** Cross-validate P2 entry in park-registry has actor_kind='Governor'

### Changes Required

**File: Modify `threshold/src/server.ts` (lines 744-755)**

Add after reading plan from registry:
```typescript
// NEW: Validate P2 requires actual Governor signature in park-registry
if (plan.p2_ratified_at) {
  // Cross-check: does a park entry exist with this plan_id, Governor actor, decision_id?
  const govEntry = parkRegistry.entries.find(e =>
    e.plan_id === req.body.plan_id &&
    e.actor_kind === 'governor' &&
    e.decision_id === plan.p2_decision_id &&
    e.status === 'CLOSED'
  );

  if (!govEntry) {
    missing.push('P2 ratified_at exists but no Governor signature found in park-registry');
  }
}
```

**Test Case (FAIL→PASS):**
1. Plan has p2_ratified_at="2026-07-05" but no matching park entry → HTTP 409 ✓
2. Governor creates park entry with decision_id + actor_kind='governor' → re-check → HTTP 200 ✓

**Effort:** 1.5 hours | **Blocker for:** None

---

## POCKET #2: AUTO-TRIGGER FOR HOLISTIC PHASE (1.5 hours)

**Problem:** Holistic phase requires manual Governor flag, not automatic domain detection

**Fix:** Implement domain-clustering logic + auto-trigger when 3+ findings in same domain

### Changes Required

**File: Modify `threshold/src/zf-cycle/engine.ts` (lines 337-353)**

Replace manual trigger check:
```typescript
// OLD:
if (request.trigger_holistic) { nextPhase = 'HOLISTIC'; }

// NEW:
// Auto-trigger logic: count findings by domain
const findingsByDomain = findings.reduce((acc, f) => {
  const domain = f.domain || 'UNCATEGORIZED';
  acc[domain] = (acc[domain] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const auto_trigger_domain = Object.entries(findingsByDomain)
  .find(([_, count]) => count >= 3)?.[0];

if (auto_trigger_domain || request.trigger_holistic) {
  nextPhase = 'HOLISTIC';
  triggerReason = auto_trigger_domain 
    ? `Auto-triggered: 3+ findings in domain '${auto_trigger_domain}'`
    : 'Governor-requested';
} else {
  nextPhase = 'INJECT';
}
```

**Test Case (FAIL→PASS):**
1. 5 findings tagged domain='Corespine' → trigger_holistic=false → HOLISTIC auto-opens ✓
2. 2 findings tagged domain='Phase' → trigger_holistic=false → INJECT (count < 3) ✓

**Effort:** 1.5 hours | **Blocker for:** None

---

## INTEGRATION TESTING (2 hours)

**After all 5 pockets fixed:**

1. **End-to-end test:** Plan ratify → Phase 1 build → audit opens → audit complete → Phase 2 starts → all reads from persistent registries ✓
2. **Restart test:** Complete all 4 steps, restart server, verify Phase 2 gate still works (reads from phase-registry.json) ✓
3. **Constitutional checklist:** Verify all 5 fixes pass 12-question checklist ✓
4. **Regression test:** Ensure existing Tier 1 auto-hooks still work with persistent state ✓

---

## GOVERNOR REVIEW & SIGN-OFF

**Before merging all 5 fixes:**

1. Governor reviews retrofit code + test results
2. Confirms all FAIL→PASS cases proven
3. Verifies Constitutional checklist passed
4. Signs off on retroactive patch

**Ratification required for:** Pocket #1 (adds persistent state, changes data model)

---

## ROLLBACK PLAN

If issues arise during retrofit week:
- Keep in-memory planStore as fallback (layer code with try/catch)
- If persistent state unstable, revert to Tier 1 auto-hooks (in-memory mode)
- Fix root cause, re-test, re-merge

---

*Retrofit execution plan ready. Blocking order confirmed. All changes verified before commit. Ready to execute this week.*

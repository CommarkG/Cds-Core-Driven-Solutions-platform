# OPUS → SONNET | CDS S345 | HARDENING PLAN EXECUTION

---

## DISPATCH OVERVIEW

**Objective:** Implement CDS plan-creation hardening (Tier 1 + Tier 2) to move the moat from 40% mechanical + 60% Governor-dependent → 100% platform-native enforcement. Close 5/7 freelancing paths. Make the system delegable to a second Builder without 3-4 week rework cycles.

**Basis:** Cruel Expert Architectural Review (Agent findings) + Investment ROI assessment. Tier 1 alone pays for itself in <1 year.

**What You're Building:** 3 constitutional rules + 1 gate integration + 1 escalation loop + 1 validator. All mechanical. All testable.

---

## PART 1: TIER 1 (CRITICAL) — 9 hours, ~300 lines

### TASK 1.1: Create CS-PLAN-STRUCTURE-TEMPLATE.md

**File:** `threshold/docs/constitutional/CS-PLAN-STRUCTURE-TEMPLATE.md`  
**Source:** Copy the structure from `threshold/docs/CDS-TEMPLATE-IMPLEMENTATION-PLAN-001.md` as the canonical form. This is the blueprint all future plans must follow.

**Sections to include:**
1. One Sentence (the design north star)
2. Build Readiness Verdict (verdict + conditions)
3. Three Mandatory Build Prerequisites (P1, P2, P3 table with closure criteria)
4. Final Architecture (R1–R8 ratified as package)
5. Phase Machine explanation (phases 0–4, each with gates)
6. Build Sequence (ordered steps with deliverables + sequencing dependencies)
7. Corespine Architecture (position in the tier structure)
8. Initial Type Library (what ships, what's deferred)
9. Phase 2+ Parked Items (clear boundary)
10. Permission Request (explicit Governor gates, if any)

**Success Proof:**
- File exists at the path above
- All 10 sections are present (no abbreviated template)
- Each section matches the Phase 1 structure (use as reference)
- **ACCEPTANCE:** A second Builder can read this and create a Phase 2 plan without asking questions (test by reading it fresh)

---

### TASK 1.2: Wire RULE-PLAN-SYNTAX-VALIDATION

**File:** `threshold/src/gate/rules.ts`  
**Rule:** `RULE_PLAN_SYNTAX_VALIDATION` (new rule)

**Logic:**
```
Input: plan_id + plan_path
Validate:
  ✓ All 10 sections from CS-PLAN-STRUCTURE-TEMPLATE.md are present
  ✓ "One Sentence" is 1 sentence (period count = 1)
  ✓ "Build Readiness Verdict" has verdict (GREEN/YELLOW/RED) + conditions
  ✓ P1/P2/P3 table has rows + closure_criteria column is not null for each
  ✓ R1–R8 each have a file target (threshold/src/...)
  ✓ Build Sequence has 10+ steps, each with deliverable + (if N>1) sequencing_dependencies
  ✓ Corespine Architecture section names CS-TEMPLATE position (or the ratified core spine)
  ✓ "Permission Request" lists Governor gates (if any)
Output:
  ✓ PASS: plan is ratifiable
  ✗ FAIL: report which section/row is missing, blocking ratification

Test Case (FAIL → PASS):
  1. Create a mock plan missing "Corespine Architecture" → FAIL with "section 'Corespine Architecture' not found"
  2. Add the section → re-validate → PASS
```

**Integration:**
- POST /api/plan/ratify endpoint calls RULE_PLAN_SYNTAX_VALIDATION before proceeding
- FAIL blocks ratification; Governor must provide detailed feedback on which section is missing
- No shortcuts: every section is mandatory

**Success Proof:**
- Rule exists in rules.ts
- FAIL→PASS test case runs (real stdout showing FAIL, then PASS)
- Endpoint rejects a mock plan missing P1 closure criteria (real stdout)

---

### TASK 1.3: Wire Prerequisite Gates (P1, P2, P3)

**File:** Phase 1 build endpoint (likely `threshold/src/server.ts` or `threshold/src/api/phase-1.ts`)

**Logic:**
```
Input: POST /api/phase/1/build
Check:
  ✓ plan.p1_closure_criteria exists (from plan RULE_PLAN_SYNTAX_VALIDATION)
  ✓ plan.p2_ratified_at timestamp exists (Governor signature)
  ✓ plan.p3_measurement_published_at timestamp exists (80% baseline)
Output:
  ✓ PROCEED: all prerequisites satisfied
  ✗ BLOCKED: return HTTP 409 with detailed reason ("P1 closure criteria missing from plan" / "P2 not yet ratified" / "P3 baseline not published")
```

**Test Case:**
1. POST /api/phase/1/build with missing P1 closure_criteria → HTTP 409, message includes "P1 closure criteria"
2. Add P1 → re-POST → still 409 if P2 missing
3. Add all three → POST → HTTP 200, Phase 1 build proceeds

**Success Proof:**
- Real HTTP responses (curl output) showing BLOCKED on missing prerequisite
- Real stdout showing all three prerequisites confirmed → build proceeds

---

### TASK 1.4: Wire RULE-AUDIT-GATE-MANDATORY

**File:** `threshold/src/gate/rules.ts`  
**Rule:** `RULE_AUDIT_GATE_MANDATORY` (new rule)

**Logic:**
```
Input: phase_n_completion + phase_n_audit_status
Check:
  ✓ Phase N audit cycle has been RUN (audit_started_at timestamp exists)
  ✓ Audit has reached ZF or explicitly parked all findings (no "OPEN" findings with null close_by)
Output:
  ✓ PASS: Phase N+1 can open
  ✗ FAIL: Phase N+1 endpoint rejects with message "Phase N audit required. Status: <audit_status>. Unresolved findings: <count>."

Test Case (FAIL → PASS):
  1. Phase N complete, no audit run → Phase N+1 POST → FAIL, message includes "audit required"
  2. Run Phase N audit, but findings not ZF'd (3 OPEN findings) → Phase N+1 POST → FAIL, message includes "3 unresolved findings"
  3. ZF audit (all findings CLOSED or PARKED_WITH_DEADLINE) → Phase N+1 POST → PASS
```

**Integration:**
- POST /api/phase/n+1/start calls RULE_AUDIT_GATE_MANDATORY
- Cannot be overridden by Builder (only Governor override via explicit log entry in park-registry)

**Success Proof:**
- Real HTTP 409 responses showing audit gate enforcement
- FAIL→PASS flow with real audit data

---

## PART 2: TIER 2 (HIGH) — 14 hours, ~400 lines

### TASK 2.1: Wire RULE-THINKING-AUDIT

**File:** `threshold/src/gate/rules.ts`  
**Rule:** `RULE_THINKING_AUDIT` (new rule)

**Logic:**
```
Input: thinking_artifact (narrative thinking before plan is authored)
Validate (Haiku agent):
  ✓ No circular logic (A depends on B, B depends on A → FAIL)
  ✓ All assumptions are stated (e.g., "solver can decide 50 fields" is an assumption)
  ✓ All gaps are identified (e.g., "type library scope not yet determined" = a gap)
  ✓ No vague concepts (e.g., "foo handles constraints" is vague; "foo handles cross-field rules via solver" is specific)
Output:
  ✓ PASS: thinking_audit_id recorded; PLAN_STANDARD ratification can proceed
  ✗ FAIL: report which concept is vague or which assumption is missing

Test Case (FAIL → PASS):
  1. Submit thinking artifact: "solver design is TBD, constraints unclear" → Haiku validates → FAIL: "constraints" is vague, "TBD" is not stated
  2. Revise: "solver design: deterministic, handles 50 fields + 20 cross-field rules, undecidability detected → documented-gap, closure-required" → FAIL→PASS
```

**Integration:**
- PLAN_STANDARD ratification endpoint checks: if thinking_audit_id is missing OR status = FAIL → blocks ratification
- Governor is notified (alert, not auto-override)

**Success Proof:**
- Real Haiku validation output showing FAIL on vague thinking
- Real Haiku validation showing PASS after thinking is hardened
- Real HTTP block on PLAN_STANDARD ratification when thinking_audit fails

---

### TASK 2.2: Implement Overdue-Finding Escalation Logic

**File:** `threshold/src/zf-cycle/enforcement.ts` (new file)

**Logic:**
```
Daily job (runs at UTC 00:00):
For each entry in park-registry.json where status = "PARKED_WITH_DEADLINE":
  If close_by < TODAY:
    status := "FORCED_ESCALATION"
    escalation_triggered_at := NOW
    Alert Governor: "<count> findings reached escalation deadline (Phase N build blocked until resolved)"
  Else if close_by - TODAY <= 3 days:
    Alert Governor (warning): "<count> findings escalating in 3 days; action required"

Effect:
  Any Phase N+1 build endpoint checks for FORCED_ESCALATION entries
  If found: HTTP 409 "Phase N findings have escalated; build blocked until resolved"
```

**Test Case:**
1. Park a finding with close_by = tomorrow → warning alert fires (real email/log entry)
2. Wait past close_by → escalation job runs → status = FORCED_ESCALATION → real log entry
3. POST /api/phase/n+1/build → HTTP 409 with escalation message

**Success Proof:**
- Real park-registry entry with past close_by date
- Real job execution showing escalation status change
- Real HTTP 409 response blocking build

---

### TASK 2.3: Integrate RULE-PHASE-COMPLETION-REQUIRES-AUDIT

**File:** `threshold/src/gate/rules.ts`  
**Rule:** `RULE_PHASE_COMPLETION_REQUIRES_AUDIT` (new rule, depends on 2.1 + 2.2)

**Logic:**
```
Input: POST /api/phase/n+1/start
Check:
  ✓ Phase N has audit_started_at
  ✓ Audit findings are all CLOSED or PARKED_WITH_DEADLINE (none are OPEN or FORCED_ESCALATION)
Output:
  ✓ PASS: Phase N+1 can start
  ✗ FAIL: HTTP 409 "Phase N audit incomplete. Status: <summary>. <count> unresolved findings."
```

**Integration:**
- Reuses the work from 2.1 + 2.2
- No Builder override (Governor-only, logged)

**Success Proof:**
- Real HTTP 409 responses showing the audit gate in effect

---

## PART 3: INTEGRATION & HARDWIRING

### TASK 3.1: Wire Endpoints

**Files:**
- `threshold/src/server.ts` (or API router)
- `threshold/src/gate/middleware.ts` (if gate middleware exists)

**Integrations:**
- POST /api/plan/ratify → calls RULE_PLAN_SYNTAX_VALIDATION (Tier 1)
- POST /api/phase/1/build → calls prerequisite gate check (Tier 1)
- POST /api/phase/n+1/start → calls RULE_AUDIT_GATE_MANDATORY (Tier 1 + 2)
- POST /api/plan/submit → calls RULE_THINKING_AUDIT + blocks if FAIL (Tier 2)
- Daily job → overdue-finding escalation (Tier 2)

**Success Proof:**
- All endpoints respond as expected (real curl tests showing PASS and FAIL cases)
- No endpoint shortcuts (no --skip-audit flag or override switch in normal flow)

---

### TASK 3.2: Update Park-Registry Schema

**File:** `threshold/data/park-registry.json` (schema definition or documentation)

**New fields:**
```json
{
  "park_id": "PARK-XXXXX",
  "status": "OPEN | CLOSED | PARKED_WITH_DEADLINE | FORCED_ESCALATION",
  "close_by": "2026-08-15 (ISO 8601)",
  "escalation_triggered_at": "2026-08-16T00:00:00Z (when FORCED_ESCALATION fired)",
  "finding_ref": "FINDING-XYZ or null",
  "parked_by": "Governor (or other authority)",
  "rationale": "why this was parked (free text)"
}
```

**Success Proof:**
- Schema documented in a README or inline comments
- Existing park entries updated to include status + close_by (historical entries = null dates)

---

## PART 4: TESTING & PROOF

### ACCEPTANCE CRITERIA

All of the following must be proven with **real stdout + real HTTP responses** (not self-audit):

**Tier 1:**
- [ ] RULE_PLAN_SYNTAX_VALIDATION FAIL→PASS: missing section → error → add section → PASS
- [ ] Prerequisite gate FAIL→PASS: missing P1/P2/P3 → HTTP 409 → provide → HTTP 200
- [ ] RULE_AUDIT_GATE_MANDATORY blocks Phase N+1 if Phase N audit incomplete (HTTP 409)

**Tier 2:**
- [ ] RULE_THINKING_AUDIT FAIL→PASS: vague thinking → FAIL → hardened → PASS
- [ ] Overdue-finding escalation fires (job log shows status change, alert fired)
- [ ] RULE_PHASE_COMPLETION_REQUIRES_AUDIT blocks if escalated findings exist (HTTP 409)

**Overall:**
- [ ] No parallel gate systems created (all 3 rules are in `threshold/src/gate/rules.ts`, single source)
- [ ] All acceptance items proven with real examples
- [ ] No "passes" without proven FAIL case first

---

## CONSTRAINTS & DNA

- **B_PROVE_REAL:** Real stdout + HTTP responses, never self-audit
- **Inventory-First:** Reuse existing gate structure + validator patterns; no parallel systems
- **consolidation-without-loss:** Every rule integrates cleanly with existing gates
- **done-blocking-conditions:** A gate blocks if its conditions are not met; no soft warnings
- **feedback_prevention_system_4_layers:** These gates are part of the 4-layer prevention system (planning + implementing + checking + simulating); coordinate with PREVENTION_SYSTEM_S344.md

---

## HANDBACK FORMAT

**First line EXACTLY:** `SONNET → OPUS | CDS S345 | artifact: cds-hardening-s345-complete`

**Report (for each gate/rule):**
1. File modified + lines added
2. Rule name + logic summary
3. FAIL→PASS test case with real stdout
4. Integration point (which endpoint calls this rule)
5. Acceptance proof (HTTP responses or gate behavior screenshots)

**Final checklist:**
- [ ] All Tier 1 + Tier 2 rules wired
- [ ] All endpoints integrated
- [ ] FAIL→PASS proven for every rule (real examples, not mock)
- [ ] No parallel gate systems
- [ ] Park-registry schema updated
- [ ] next_tab_state.md updated at GATE

**Commit message template:**
```
[CDS S345] Plan-creation hardening: Tier 1+2 (RULE_PLAN_SYNTAX_VALIDATION + 
RULE_THINKING_AUDIT + RULE_AUDIT_GATE_MANDATORY + prerequisite gates + 
overdue-finding escalation) — all gates FAIL→PASS proven, endpoints integrated, 
no parallel systems. Closes 5/7 freelancing paths. Governor-delegates can now 
safely execute without rework cycles.
```

---

## TIMELINE & NEXT STEPS

**This dispatch:** 23 hours of work (Tier 1 + 2)
**Humble batches:** Tier 1 first (gates must work before Tier 2 depends on them)
**Next step after handback:** Tier 3 (optional, if time permits) or PARK-050726-027 (CS-Learning-Loop corespine design)

---

*Dispatch prepared by OPUS. Ready for Sonnet activation.*

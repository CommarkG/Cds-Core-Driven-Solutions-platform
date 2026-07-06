# Constitutional AI Behavior Layer — OPUS Synthesis

**Document ID:** CDS-CSPS-0225  
**Date:** 2026-07-05  
**Basis:** Sonnet's 5 Prevention Rules (P1-P5) from S345 Cruel Critic Review  
**Author:** OPUS (synthesis + architecture)  
**Status:** READY FOR RATIFICATION  
**Replaces:** Implicit prevention patterns (now explicit + mechanized)  

---

## EXECUTIVE SUMMARY

AI systems drift into "freelancing" (decision-making without declared authority) through five structural failures. These aren't about AI capability or intent — they're about **information architecture**. 

Sonnet identified 5 Prevention Rules. This document consolidates them into a **Unified Framework**, extracts a **Constitutional Checklist** (12 questions for any gate/rule author), designs **Verification Gates** (meta-gates that police the Constitution itself), and provides a **Retrofit Strategy** for CDS (Pocket-1 through -5, execution order with blocking analysis).

**The Core Pattern:** Mechanical enforcement requires **Persistent Canonical Source + Structural Depth + Actor Proof + Auto-Decision**. Any enforcement lacking one of these is theater.

---

## SECTION 1: UNIFIED FRAMEWORK

### The Five Prevention Rules (Consolidated)

**P1: PERSISTENT-STATE-REGISTRY**  
State used in gates → must live in a file-based registry, never in-memory or request context. Once. Canonical. Queryable.

**P2: REGISTRY-NOT-REQUEST-BODY**  
Facts from registry (persistent truth). Context from request body (current decision). Never treat request claims as ground truth for gate decisions.

**P3: ACTOR-KIND-CROSS-VALIDATION**  
Actor claims ("I am Governor / Builder / Validator") need registry proof. Signature + actor_kind must be verified against a canonical actors registry. No self-declared authority.

**P4: STRUCTURAL-DEPTH-NOT-HEADERS**  
Syntax validation must check headers (format) + depth structure (completeness, sequencing, closure). Headers alone are insufficient. A plan with correct headers but missing prerequisites is a FAIL.

**P5: AUTO-ENFORCEMENT-NOT-MANUAL**  
Gates must calculate mechanical outcomes. Not "Governor flags for review" (that's soft). Mechanical = deterministic, repeatable, testable. No judgment calls in the gate.

### How These Five Rules Work Together

```
P1 (Persistent) provides the DATA LAYER
    ↓
P2 (Registry-not-body) ensures TRUTH vs. CONTEXT SEPARATION
    ↓
P3 (Actor proof) ensures AUTHORITY IS PROVEN, not claimed
    ↓
P4 (Structural depth) ensures GATE LOGIC CHECKS COMPLETENESS
    ↓
P5 (Auto-enforcement) ensures GATE OUTCOME IS MECHANICAL
```

**The Dependency Chain:**
- P1 blocks everything until persistent state exists
- P2 assumes P1 works (otherwise request_body is the only source)
- P3 requires both P1 and P2 (actor credentials stored in P1, validated against P2 context)
- P4 is orthogonal (applies to any gate, but meaningless without P1-P3)
- P5 depends on all four above (auto-enforcement requires truth sources + authority + structural checks)

### Redundancies & Simplifications

**No true redundancies** — each rule catches a different failure mode:

| Rule | Failure Mode | Cost If Missing |
|------|---|---|
| P1 | State disappears between decisions | Gate becomes useless after restart |
| P2 | Request lies to gate | Unauthorized decisions slip through |
| P3 | Actor spoofs authority | Freelancing by credential theft |
| P4 | Incomplete plans pass syntax check | Missing prerequisites in build |
| P5 | Governor has to hand-score gates | Non-testable, non-deterministic |

Each is a **load-bearing wall**. Removing any one collapses the integrity of the system.

---

## SECTION 2: CONSTITUTIONAL CHECKLIST

### Purpose

Before writing a gate, rule, enforcement logic, or validator — answer these 12 questions. This checklist **catches all 5 drift types** at the design level.

### The Checklist

**PART A: PERSISTENT SOURCE (P1)**

1. **Is the state I'm reading from a file-based registry (not memory / session / request context)?**
   - [ ] Yes — Registry file path: _____ 
   - [ ] No — **FAIL this rule. Where will this state live when the process restarts?**
   - Evidence: Grep the code for this rule/gate. Show the file path it reads from.

2. **Can this registry entry be queried independently (without needing the request that created it)?**
   - [ ] Yes — File is queryable offline; entry has a unique ID
   - [ ] No — **FAIL. How will the next run find this decision?**
   - Evidence: Show a test case where you query the registry from a fresh process (simulate restart).

**PART B: TRUTH VS. CONTEXT (P2)**

3. **Have I separated facts (persistent registry) from context (request body)?**
   - [ ] Yes — Rule reads facts from `[registry-path]`, context from `req.body`
   - [ ] No — **FAIL. What if request claims are false?**
   - Evidence: Point to the code line where you read from registry vs. request.

4. **If I'm reading from request body, have I validated it against a registry fact first?**
   - [ ] Yes — Pattern: `fact = registry[req.id]; if (fact != req.claim) FAIL`
   - [ ] No or N/A (reading facts only) — Acceptable
   - [ ] No but reading claims as ground truth — **FAIL this rule.**
   - Evidence: Show a test case with conflicting claim vs. fact → gate rejects claim.

**PART C: ACTOR PROOF (P3)**

5. **Does the actor claim an authority type (Governor / Builder / Validator)?**
   - [ ] Yes — Actor_kind: _____
   - [ ] No — N/A (no actor authority needed for this gate)
   - [ ] Yes but not validated — **FAIL. How do you know this isn't spoofed?**
   - Evidence: Point to the code that verifies actor_kind against an actors registry.

6. **Have I cross-validated the actor against an actors registry?**
   - [ ] Yes — Pattern: `actor_proof = actors_registry[req.actor_id]; if (actor_proof.kind != req.actor_kind) FAIL`
   - [ ] No actor validation needed (N/A) — Acceptable, but document why
   - [ ] No but actor claims authority — **FAIL this rule.**
   - Evidence: Show a test case where actor_kind mismatch → gate rejects.

**PART D: STRUCTURAL DEPTH (P4)**

7. **Am I checking only headers/format (like "is_json: true")?**
   - [ ] Yes — **Insufficient. What about structure completeness?**
   - [ ] No — I'm checking depth structure (mandatory fields, section presence, closure criteria)
   - Evidence: List 3+ structural checks beyond "is valid X format".

8. **Am I checking closure (prerequisites met, sections complete, dependencies satisfied)?**
   - [ ] Yes — Checks: P1 closure exists, P2 ratified, all sequencing dependencies satisfied
   - [ ] No — **FAIL. How will incomplete work slip through?**
   - Evidence: Show a test case where a plan with missing closure → FAIL.

**PART E: AUTO-ENFORCEMENT (P5)**

9. **Does this gate produce a mechanical outcome (PASS / FAIL with reasons)?**
   - [ ] Yes — No judgment calls. Rule: IF (conditions) THEN (outcome)
   - [ ] No — Outcomes require Governor review / override / manual judgment — **FAIL this rule.**
   - Evidence: Point to code showing deterministic IF/THEN logic (not advisory).

10. **Can this gate's decision be tested with real examples (FAIL→PASS in stdout)?**
    - [ ] Yes — Test cases exist with real HTTP responses or log output
    - [ ] No — **FAIL. How will you know if the gate actually works?**
    - Evidence: Show real FAIL→PASS test (not mocked, real stdout).

**PART F: CROSS-CHECKS**

11. **If this rule depends on other rules (P1-P5), are those dependencies declared and enforced?**
    - [ ] Yes — Depends on: [list rules]
    - [ ] No dependencies — N/A
    - [ ] Has dependencies but doesn't enforce them — **FAIL. The dependency can be skipped.**
    - Evidence: Show error message if dependency is not met before this rule runs.

12. **Have I documented where this gate is called and what cannot proceed without it?**
    - [ ] Yes — Gate is called at: [endpoint/location]. Blocks: [what cannot proceed]
    - [ ] No — **FAIL. Orphaned gate.**
    - Evidence: Point to the endpoint that calls this gate and the HTTP response when it blocks.

### Grading the Checklist

| Passing Criteria | Result |
|---|---|
| All 12 answers are **[X] Yes** (with evidence) | ✅ PASS — Rule is Constitutional |
| 1-2 answers are **[X] No** with a valid N/A reason | ✅ PASS — N/A items are defensible |
| 3+ answers are **[X] No** or missing evidence | ❌ FAIL — Redesign before implementation |

---

## SECTION 3: VERIFICATION GATES (Meta-Gates)

### Purpose

These are **gates that enforce the Constitution itself**. They police whether new rules follow P1-P5. They are mechanical. They block implementation of non-Constitutional rules.

### RULE-CONSTITUTIONAL-COMPLIANCE (Meta-Gate)

**File:** `threshold/src/gate/meta-gates.ts`  
**Triggered:** Before any new gate/rule is added to `threshold/src/gate/rules.ts`

**Logic:**

```
Input: code_review (new rule diff)
  + rule_name (string)
  + rule_id (CS-RULE-XXXX)

Scan code diff for:
  P1_CHECK: Does rule read state from file? 
    Pattern: "fs.readFile" OR "registry.read" OR "db.query"
    (Any persistent storage. Memory/session = FAIL)
  
  P2_CHECK: Does rule separate facts from claims?
    Pattern: "registry[id]" before "req.body[claim]"
    If reading only from request → check if validated against registry
    (Pure request trust = FAIL)
  
  P3_CHECK: If rule gates authority, does it validate actor?
    Pattern: "actors_registry[actor_id]" before trusting "req.actor_kind"
    (Self-declared actor = FAIL)
  
  P4_CHECK: Does rule check structural depth?
    Pattern: >2 structural validations (not just format)
    Examples: field presence, closure criteria, dependencies, section count
    (Headers-only = FAIL)
  
  P5_CHECK: Is outcome mechanical (not advisory)?
    Pattern: "if (condition) return PASS" / "if (!condition) return FAIL"
    No patterns like "flag for review" or "Governor decides"
    (Advisory outcomes = FAIL)

Output:
  IF all 5 checks PASS: 
    → approve_rule("CONSTITUTIONAL")
    → return HTTP 200: "Rule accepted for integration"
  
  IF any check FAIL:
    → reject_rule(failing_checks=[...])
    → return HTTP 400: "Rule fails Constitution checks: [P1/P2/P3/P4/P5]. Redesign required."
    → block merge until resubmitted
```

### Test Case: What Fails & What Passes

**FAIL Example 1: In-Memory State (P1 Violation)**

```javascript
// BEFORE (fails P1)
let phaseAudits = {}; // memory
app.post('/api/phase/audit', (req, res) => {
  phaseAudits[req.body.phase_id] = req.body.audit_result;
  res.json({ status: "audited" });
});

// After restart, phaseAudits is {}, decision is lost. FAILS CONSTITUTIONAL CHECK.
```

**PASS Example 1: Persistent Registry (P1 + P2)**

```javascript
// AFTER (passes P1 + P2)
const auditRegistry = require('./registries/audit-registry.json');
app.post('/api/phase/audit', (req, res) => {
  const fact = auditRegistry.read(req.body.phase_id);
  if (fact && fact.audit_result !== req.body.audit_result) {
    return res.status(400).json({ error: "Audit mismatch: registry has different result" });
  }
  auditRegistry.write(req.body.phase_id, { audit_result: req.body.audit_result });
  res.json({ status: "audited" });
});

// PASSES CONSTITUTIONAL CHECK (P1 + P2 satisfied).
```

---

**FAIL Example 2: Actor Without Proof (P3 Violation)**

```javascript
// BEFORE (fails P3)
app.post('/api/phase/ratify', (req, res) => {
  if (req.body.actor_kind === "Governor") {
    // Trust the request claim
    planRegistry.write(req.body.plan_id, { ratified_by: req.body.actor_kind });
    res.json({ status: "ratified" });
  }
});

// Actor spoofs "Governor" in request. No proof. FAILS CONSTITUTIONAL CHECK.
```

**PASS Example 2: Cross-Validated Actor (P3)**

```javascript
// AFTER (passes P3)
const actorsRegistry = require('./registries/actors-registry.json');
app.post('/api/phase/ratify', (req, res) => {
  const actorProof = actorsRegistry.read(req.headers['authorization']);
  if (!actorProof || actorProof.actor_kind !== "Governor") {
    return res.status(403).json({ error: "Not a Governor" });
  }
  planRegistry.write(req.body.plan_id, { ratified_by: actorProof.actor_id });
  res.json({ status: "ratified" });
});

// Actor validated against actors-registry. PASSES CONSTITUTIONAL CHECK (P3 satisfied).
```

---

**FAIL Example 3: Headers-Only Validation (P4 Violation)**

```javascript
// BEFORE (fails P4)
function validatePlan(plan) {
  if (!plan || typeof plan !== "object") return "FAIL: not an object";
  if (!plan.one_sentence || plan.one_sentence.length === 0) return "FAIL: missing one_sentence";
  return "PASS"; // Only checking presence, not depth
}

// Plan can have one_sentence but missing P1/P2/P3, build sequence, closures. FAILS.
```

**PASS Example 3: Depth Validation (P4)**

```javascript
// AFTER (passes P4)
function validatePlan(plan) {
  if (!plan.one_sentence || plan.one_sentence.length === 0) 
    return "FAIL: missing one_sentence";
  
  // Check closure
  if (!plan.build_readiness || !plan.build_readiness.verdict) 
    return "FAIL: missing build_readiness.verdict";
  
  if (!plan.p1_closure_criteria || plan.p1_closure_criteria.length === 0) 
    return "FAIL: P1 closure criteria missing";
  
  if (!plan.p2_ratified_at) 
    return "FAIL: P2 not yet ratified";
  
  // Check sequencing
  if (!plan.build_sequence || plan.build_sequence.length < 10) 
    return "FAIL: build_sequence has fewer than 10 steps";
  
  return "PASS"; // All structural requirements satisfied
}

// Checks headers + closure + dependencies + sequencing. PASSES CONSTITUTIONAL CHECK (P4).
```

---

**FAIL Example 4: Advisory Outcome (P5 Violation)**

```javascript
// BEFORE (fails P5)
app.post('/api/phase/start', (req, res) => {
  const phase = req.body.phase_id;
  const ready = checkPhaseReady(phase);
  
  if (!ready) {
    logger.info(`Phase ${phase} not ready. Flag for Governor review.`);
    res.json({ status: "pending_review", message: "Governor should review" });
  } else {
    res.json({ status: "start" });
  }
});

// Outcome is "pending_review" (advisory). Governor decides. Not mechanical. FAILS.
```

**PASS Example 4: Mechanical Outcome (P5)**

```javascript
// AFTER (passes P5)
app.post('/api/phase/start', (req, res) => {
  const phase = req.body.phase_id;
  const audit = auditRegistry.read(phase);
  
  if (!audit || audit.status !== "COMPLETE") {
    return res.status(409).json({ 
      error: "Phase audit incomplete. Status: " + (audit?.status || "not run"),
      blocking: true 
    });
  }
  
  res.json({ status: "start", phase_id: phase });
});

// Outcome is deterministic: HTTP 409 (FAIL) or 200 (PASS). No judgment. PASSES (P5).
```

---

### How RULE-CONSTITUTIONAL-COMPLIANCE Becomes Mandatory

**Gate Integration:**

1. **Before merge:** Any PR adding a new rule to `threshold/src/gate/rules.ts` triggers RULE-CONSTITUTIONAL-COMPLIANCE as a pre-merge check.
2. **Before execution:** If RULE-CONSTITUTIONAL-COMPLIANCE returns non-PASS, the new rule cannot be added (merge blocked).
3. **Documented:** Every rule in rules.ts must have a comment declaring which P1-P5 checks it satisfies.

**Example Rule Comment (Standardized):**

```javascript
/**
 * RULE_PLAN_SYNTAX_VALIDATION
 * 
 * Constitutional Compliance:
 * - P1: Reads from threshold/docs/constitutional/CS-PLAN-STRUCTURE-TEMPLATE.md
 * - P2: Separates template (fact) from plan_content (context)
 * - P3: No actor validation (rule is not authority-gated)
 * - P4: Validates 10+ structural sections + closure criteria + dependencies
 * - P5: Outcome is mechanical PASS/FAIL (not advisory)
 * 
 * Status: CONSTITUTIONAL ✅
 */
```

---

## SECTION 4: RETROFIT STRATEGY FOR CDS

### Current CDS State

CDS plan-creation system has **5 implementation "pockets"** (code sections) that violate P1-P5:

| Pocket | File(s) | Violation(s) | Description | Effort | Blocking |
|--------|---------|--------------|-------------|--------|----------|
| **Pocket-1** | `threshold/src/phase.ts` | P1 | Phase state stored in-memory (process restarts lose state) | 2h | Blocks all other pockets |
| **Pocket-2** | `threshold/src/triggers.ts` | P5 | Auto-trigger logic has manual Governor flags instead of mechanical decisions | 1.5h | Independent |
| **Pocket-3** | `threshold/src/api/plan.ts` | P2 | Plan validation trusts request claims (p2_ratified_at, p3_published_at) without registry proof | 3h | Depends on Pocket-1 |
| **Pocket-4** | `threshold/src/validators/plan.ts` | P4 | Plan validator checks headers only (JSON shape) not structural depth (closures, dependencies) | 1.5h | Independent |
| **Pocket-5** | `threshold/src/api/park.ts` | P3 | Park-registry entries don't cross-validate actor credentials; any request can mark a finding as "parked" | 2h | Depends on Pocket-1 |

### Retrofit Execution Order (with blocking analysis)

**Phase 1: Foundation (Pocket-1) — 2 hours**

**Task 1.1: Create phase-registry.json (Persistent State)**

```bash
File: threshold/data/phase-registry.json
```

**Current state:**

```javascript
// BEFORE (in-memory)
let phaseState = {
  "phase-1": { started_at: null, audit_complete: false },
  "phase-2": { started_at: null, audit_complete: false }
};
```

**Target state:**

```json
{
  "phases": {
    "phase-1": {
      "id": "phase-1",
      "started_at": "2026-07-05T10:00:00Z",
      "audit_started_at": null,
      "audit_completed_at": null,
      "audit_findings_count": 0,
      "audit_status": "PENDING",
      "can_advance_to": "phase-2"
    },
    "phase-2": {
      "id": "phase-2",
      "started_at": null,
      "audit_started_at": null,
      "audit_completed_at": null,
      "audit_findings_count": 0,
      "audit_status": "BLOCKED",
      "blocked_reason": "phase-1 audit not complete"
    }
  }
}
```

**Code change (Pocket-1):** `threshold/src/phase.ts` — Replace in-memory `phaseState` with file-based registry.

```javascript
// BEFORE
let phaseState = {};
function getPhaseState(id) {
  return phaseState[id] || {};
}

// AFTER
const fs = require('fs');
const PHASE_REGISTRY_PATH = './data/phase-registry.json';

function getPhaseState(id) {
  const data = fs.readFileSync(PHASE_REGISTRY_PATH, 'utf-8');
  const registry = JSON.parse(data);
  return registry.phases[id] || {};
}

function updatePhaseState(id, updates) {
  const data = fs.readFileSync(PHASE_REGISTRY_PATH, 'utf-8');
  const registry = JSON.parse(data);
  registry.phases[id] = { ...registry.phases[id], ...updates };
  fs.writeFileSync(PHASE_REGISTRY_PATH, JSON.stringify(registry, null, 2));
}
```

**Test (FAIL→PASS):**

```bash
# Test: Restart process, phase state persists
1. Start server, POST /api/phase/1/start
   → phase-1.started_at is set in phase-registry.json
2. Kill process (simulating restart)
3. Start server again
4. GET /api/phase/1/status
   → Returns same started_at (proof: state persisted)
```

---

**Phase 2: Truth vs. Claims + Actor Proof (Pocket-3, Pocket-5) — 5 hours total**

**Task 2.1: Create plan-registry.json (Registry of Ratified Plans)**

**File:** `threshold/data/plan-registry.json`

```json
{
  "plans": {
    "PLAN-001": {
      "id": "PLAN-001",
      "title": "Phase 1 Build Plan",
      "p1_closure_criteria": "...",
      "p1_closed_at": "2026-07-03T15:00:00Z",
      "p2_ratified_at": "2026-07-04T10:00:00Z",
      "p2_ratified_by": "GOV-2026-001",
      "p3_baseline_published_at": "2026-07-05T09:00:00Z",
      "p3_baseline_score": 0.82,
      "all_prerequisites_met": true
    }
  }
}
```

**Code change (Pocket-3):** `threshold/src/api/plan.ts`

```javascript
// BEFORE (trusts request claims, violates P2)
app.post('/api/plan/validate-prerequisites', (req, res) => {
  const p1_closed = req.body.p1_closed_at ? true : false;
  const p2_ratified = req.body.p2_ratified_at ? true : false;
  const p3_published = req.body.p3_published_at ? true : false;
  
  if (p1_closed && p2_ratified && p3_published) {
    res.json({ ready: true });
  } else {
    res.json({ ready: false });
  }
});

// AFTER (reads from registry, separates fact from claim, validates actor)
const planRegistry = require('./registries/plan-registry.json');
const actorsRegistry = require('./registries/actors-registry.json');

app.post('/api/plan/validate-prerequisites', (req, res) => {
  // P2: Separate fact from claim
  const fact = planRegistry.plans[req.body.plan_id];
  
  if (!fact) {
    return res.status(404).json({ error: "Plan not found in registry" });
  }
  
  // P3: Validate actor (if P2 is being updated, actor must have authority)
  if (req.body.p2_ratified_at && fact.p2_ratified_at !== req.body.p2_ratified_at) {
    // Request claims different P2 status; validate actor authority
    const actor = actorsRegistry.actors[req.headers['x-actor-id']];
    if (!actor || actor.kind !== "Governor") {
      return res.status(403).json({ error: "Only Governor can update P2 ratification" });
    }
  }
  
  // Return fact from registry (not request claim)
  const ready = fact.all_prerequisites_met;
  res.json({ ready, fact: { p1: fact.p1_closed_at, p2: fact.p2_ratified_at, p3: fact.p3_baseline_published_at } });
});
```

**Test (FAIL→PASS):**

```bash
1. POST /api/plan/validate-prerequisites with plan_id PLAN-001, claim p2_ratified_at = "2026-08-01"
   → Registry shows p2_ratified_at = "2026-07-04"
   → If actor is not Governor, HTTP 403 "Only Governor can update P2"
   → If actor is Governor, response includes fact (not claim)

2. Resubmit as Governor actor
   → HTTP 200, response shows registered fact
```

---

**Task 2.2: Create actors-registry.json (Actor Proof)**

**File:** `threshold/data/actors-registry.json`

```json
{
  "actors": {
    "yariv-gov-001": {
      "id": "yariv-gov-001",
      "name": "Yariv Fink",
      "kind": "Governor",
      "authority_scope": ["all"],
      "authenticated_at": "2026-07-05T08:00:00Z"
    },
    "builder-001": {
      "id": "builder-001",
      "name": "Builder Agent",
      "kind": "Builder",
      "authority_scope": ["implementation", "testing"],
      "authenticated_at": "2026-07-05T08:00:00Z"
    }
  }
}
```

**Code change (Pocket-5):** `threshold/src/api/park.ts`

```javascript
// BEFORE (no actor validation, violates P3)
app.post('/api/finding/park', (req, res) => {
  const finding_id = req.body.finding_id;
  parkRegistry.write(finding_id, {
    status: "PARKED_WITH_DEADLINE",
    close_by: req.body.close_by,
    parked_by: req.body.parked_by // TRUSTS REQUEST CLAIM
  });
  res.json({ status: "parked" });
});

// AFTER (validates actor, satisfies P3)
const actorsRegistry = require('./registries/actors-registry.json');

app.post('/api/finding/park', (req, res) => {
  const actor = actorsRegistry.actors[req.headers['x-actor-id']];
  
  if (!actor) {
    return res.status(403).json({ error: "Actor not authenticated" });
  }
  
  // Only Governor can park findings
  if (actor.kind !== "Governor") {
    return res.status(403).json({ error: "Only Governor can park findings" });
  }
  
  const finding_id = req.body.finding_id;
  parkRegistry.write(finding_id, {
    status: "PARKED_WITH_DEADLINE",
    close_by: req.body.close_by,
    parked_by: actor.id // Use actor proof from registry, not request claim
  });
  res.json({ status: "parked" });
});
```

**Test (FAIL→PASS):**

```bash
1. POST /api/finding/park with x-actor-id = "builder-001" (Builder, not Governor)
   → HTTP 403 "Only Governor can park findings"

2. Resubmit with x-actor-id = "yariv-gov-001" (Governor)
   → HTTP 200, finding parked
   → Check park-registry: parked_by = "yariv-gov-001" (from actor registry, not request)
```

---

**Phase 3: Structural Depth (Pocket-4) — 1.5 hours**

**Task 3.1: Enhance Plan Validator (Add Depth Checks)**

**File:** `threshold/src/validators/plan.ts`

```javascript
// BEFORE (headers-only, violates P4)
function validatePlan(plan) {
  if (!plan.one_sentence) return "FAIL: missing one_sentence";
  if (!plan.build_readiness) return "FAIL: missing build_readiness";
  return "PASS";
}

// AFTER (depth + closure, satisfies P4)
function validatePlan(plan) {
  const checks = [];
  
  // Headers
  if (!plan.one_sentence) checks.push("missing one_sentence");
  if (!plan.build_readiness) checks.push("missing build_readiness");
  
  // Structural depth
  if (!plan.one_sentence || plan.one_sentence.split('.').length !== 2) 
    checks.push("one_sentence must be exactly one sentence (one period)");
  
  if (!plan.build_readiness.verdict || !['GREEN', 'YELLOW', 'RED'].includes(plan.build_readiness.verdict))
    checks.push("build_readiness.verdict must be GREEN/YELLOW/RED");
  
  // Closure checks
  if (!plan.p1_closure_criteria || plan.p1_closure_criteria.length === 0)
    checks.push("P1 closure criteria missing");
  
  if (!plan.p2_ratified_at)
    checks.push("P2 ratification timestamp missing (not yet ratified)");
  
  if (!plan.p3_baseline_published_at)
    checks.push("P3 baseline not published");
  
  // Sequencing
  if (!plan.build_sequence || plan.build_sequence.length < 10)
    checks.push("build_sequence must have 10+ steps");
  
  if (!plan.final_architecture || !plan.final_architecture.components)
    checks.push("final_architecture must define components");
  
  // Dependencies
  const steps = plan.build_sequence || [];
  for (let i = 1; i < steps.length; i++) {
    if (!steps[i].sequencing_dependencies && i > 0) {
      checks.push(`Step ${i} missing sequencing_dependencies (required for non-first steps)`);
    }
  }
  
  if (checks.length > 0) {
    return "FAIL: " + checks.join(" | ");
  }
  
  return "PASS";
}
```

**Test (FAIL→PASS):**

```bash
1. POST /api/plan/validate with plan missing P1 closure criteria
   → FAIL: "P1 closure criteria missing"

2. Add P1 closure criteria, resubmit
   → Still FAIL if P2 not ratified, P3 not published, or build_sequence < 10 steps

3. Fill all fields
   → PASS
```

---

**Phase 4: Mechanical Enforcement (Pocket-2) — 1.5 hours**

**Task 4.1: Refactor Trigger Logic (Mechanical Outcomes)**

**File:** `threshold/src/triggers.ts`

```javascript
// BEFORE (advisory, violates P5)
async function checkPhaseCanAdvance(phase_id) {
  const audit = await getPhaseAudit(phase_id);
  
  if (audit.findings_count > 3) {
    logger.warn(`Phase ${phase_id} has ${audit.findings_count} findings. Governor review recommended.`);
    return { can_advance: "pending_review", message: "Governor should review audit findings" };
  }
  
  return { can_advance: true };
}

// AFTER (mechanical, satisfies P5)
async function checkPhaseCanAdvance(phase_id) {
  const audit = auditRegistry.read(phase_id);
  
  if (!audit) {
    return { can_advance: false, reason: "audit_not_run", blocking: true };
  }
  
  if (audit.status !== "COMPLETE") {
    return { can_advance: false, reason: "audit_incomplete", blocking: true };
  }
  
  // Check for unresolved findings
  const findings = findingsRegistry.read(phase_id);
  const unresolvedCount = findings.filter(f => f.status === "OPEN" || (f.status === "PARKED_WITH_DEADLINE" && new Date(f.close_by) < new Date())).length;
  
  if (unresolvedCount > 0) {
    return { can_advance: false, reason: "unresolved_findings", count: unresolvedCount, blocking: true };
  }
  
  return { can_advance: true, blocking: false };
}

// Wire into endpoint
app.post('/api/phase/:id/advance', async (req, res) => {
  const phase_id = req.params.id;
  const check = await checkPhaseCanAdvance(phase_id);
  
  if (!check.can_advance) {
    return res.status(409).json({ 
      error: check.reason, 
      details: check, 
      blocking: check.blocking 
    });
  }
  
  // Advance phase
  phaseRegistry.update(phase_id, { started_at: new Date().toISOString() });
  res.json({ status: "phase_advanced", phase_id });
});
```

**Test (FAIL→PASS):**

```bash
1. POST /api/phase/2/advance with phase-1 audit not run
   → HTTP 409 "reason: audit_not_run, blocking: true"

2. Run phase-1 audit
   → Still 409 if findings unresolved

3. Resolve all findings (CLOSED or PARKED_WITH_DEADLINE with future close_by)
   → HTTP 200 "status: phase_advanced"
```

---

### Blocking & Dependency Analysis

**Dependency Graph:**

```
┌─────────────────────────────────────┐
│ Pocket-1: Phase-Registry (P1)       │
│ → Creates persistent state layer    │
│ → CRITICAL PATH BLOCKER             │
│ → 2 hours, blocks all others        │
└────────────┬──────────────────────┘
             │
    ┌────────┴──────────┬──────────────────┐
    │                   │                  │
    ▼                   ▼                  ▼
┌─────────┐        ┌──────────┐      ┌──────────┐
│Pocket-3 │        │Pocket-5  │      │Pocket-4  │
│(P2+P3)  │        │ (P3)     │      │ (P4)     │
│Registry │        │  Actors  │      │ Depth    │
│Validation       │ Registry │      │ Validator│
│ 3h      │        │  2h      │      │  1.5h    │
└────┬────┘        └────┬─────┘      └──────────┘
     │                  │
     └────────┬─────────┘
              │
              ▼
        ┌──────────────┐
        │ Pocket-2 (P5)│
        │  Mechanical  │
        │ Enforcement  │
        │   1.5h       │
        └──────────────┘
```

**Execution Order:**

1. **Week 1: Pocket-1 (2h)** — Create phase-registry.json, persist state
2. **Week 1-2: Pocket-4 (1.5h) — PARALLEL** — Enhance plan validator (independent of Pocket-1)
3. **Week 2: Pocket-3 (3h)** — Create plan-registry.json, actors-registry.json, validate prerequisites
4. **Week 2: Pocket-5 (2h)** — Refactor park-registry validation with actors (depends on Pocket-1)
5. **Week 2: Pocket-2 (1.5h)** — Mechanical triggers (depends on Pocket-1)

**Total effort:** 2 + 1.5 + 3 + 2 + 1.5 = **10 hours** (vs. 23 hours in Tier 1+2 from S345 spec)

**Why less effort?** The CDS retrofit is focused on 5 specific pockets (identified by Sonnet); S345 includes broader hardening (plan templates, thinking audits, escalation jobs). Both are valid but target different scope.

---

## SECTION 5: UNIVERSAL PRINCIPLE (Beyond CDS)

### The Pattern

If this pattern appears in any system (not just CDS), recognize it as:

**Mechanical Enforcement = Persistent Source + Structural Depth + Actor Proof + Auto-Decision**

Any enforcement lacking ONE of these four is **theater**, not mechanical.

### Recognition Checklist (For Any System)

When you see a gate, rule, or validation system, ask:

1. **Does it have a Persistent Source (P1)?**
   - Is state queryable after restart? (file / DB / registry)
   - Or does it die when the process dies? (memory / request context)

2. **Does it separate Truth from Claims (P2)?**
   - Is there a canonical source of facts? (registry / DB)
   - Or does it trust request claims as ground truth?

3. **Does it validate Actor Authority (P3)?**
   - Are actor claims cross-validated against a registry?
   - Or are actors self-declared?

4. **Does it check Structural Completeness (P4)?**
   - Are there >2 structural depth checks? (closure, dependencies, sequencing)
   - Or does it only check format/headers?

5. **Is the outcome Mechanical (P5)?**
   - PASS / FAIL with deterministic conditions?
   - Or advisory ("flag for review", "Governor decides")?

### Pattern Application (Examples)

**Case 1: AI Behavioral Gate**

```
Rule: "Block non-Governor from changing core-spine definitions"

P1? State stored in spine-registry.json (✅)
P2? Reads spine facts, separates from request claims (✅)
P3? Validates actor against actors-registry (✅)
P4? Checks: spine exists, no circular dependencies, all sub-spines declared (✅)
P5? Outcome: HTTP 403 if actor not Governor (✅)

Result: MECHANICAL. Enforcement is durable.
```

**Case 2: Plan Completion Gate**

```
Rule: "Phase N+1 cannot start until Phase N audit is complete"

P1? Audit state in audit-registry.json (✅)
P2? Reads fact from registry, not request claim (✅)
P3? No actor validation (N/A) — rule doesn't gate authority (N/A)
P4? Checks: audit exists, status is COMPLETE, all findings resolved (✅)
P5? Outcome: HTTP 409 "Phase N audit incomplete" if failed (✅)

Result: MECHANICAL. Enforcement is durable.
```

**Case 3: Advisory Gate (Theater)**

```
Rule: "Alert if Builder is creating too many types"

P1? No persistent tracking (creates log entry, dies at restart) (❌)
P2? Compares request count to in-memory limit (❌)
P3? No actor validation needed (N/A)
P4? Only checks "count > 10" (no structural depth) (❌)
P5? Outcome: log message + "Governor should review" (advisory, not mechanical) (❌)

Result: THEATER. Next builder won't see the alert. Problem repeats.
```

---

## SECTION 6: IMPLEMENTATION CHECKLIST FOR CDS RETROFIT

### Pre-Retrofit Validation

- [ ] All five Sonnet rules (P1-P5) understood by team
- [ ] Constitutional Checklist (Section 2) reviewed by Governor
- [ ] Verification Gate (RULE-CONSTITUTIONAL-COMPLIANCE) approved for pre-merge checks
- [ ] Retrofit Strategy execution order agreed

### Pocket-1 Implementation

- [ ] phase-registry.json created with schema (threshold/data/)
- [ ] threshold/src/phase.ts refactored to use file-based registry
- [ ] FAIL→PASS test: restart process → state persists (real stdout proof)
- [ ] All phase-state accesses changed from memory to registry reads

### Pocket-4 Implementation (Can run parallel with Pocket-1)

- [ ] threshold/src/validators/plan.ts enhanced with depth checks
- [ ] Validator now checks 8+ structural validations (not just headers)
- [ ] FAIL→PASS test: plan missing P1/P2/P3 → FAIL; add fields → PASS
- [ ] Plan cannot be ratified without passing structural validation

### Pocket-3 Implementation (Depends on Pocket-1)

- [ ] plan-registry.json created with schema
- [ ] threshold/src/api/plan.ts refactored to read from registry
- [ ] Request claims validated against registry facts (P2)
- [ ] FAIL→PASS test: conflicting plan claim → HTTP 403; with registry truth → HTTP 200

### Pocket-5 Implementation (Depends on Pocket-1)

- [ ] actors-registry.json created with schema
- [ ] threshold/src/api/park.ts refactored to validate actor authority
- [ ] Park operations limited to Governor (cross-validated with actors-registry)
- [ ] FAIL→PASS test: Builder tries to park → HTTP 403; Governor succeeds

### Pocket-2 Implementation (Depends on Pocket-1)

- [ ] threshold/src/triggers.ts refactored to mechanical outcomes
- [ ] No advisory messages ("Governor should review") — only PASS / FAIL
- [ ] Phase advance gate checks: audit complete, findings resolved, status is mechanical
- [ ] FAIL→PASS test: missing audit → HTTP 409; audit complete → HTTP 200

### Meta-Gate (RULE-CONSTITUTIONAL-COMPLIANCE)

- [ ] threshold/src/gate/meta-gates.ts created
- [ ] Meta-gate checks all 5 P-rules in new rule diffs
- [ ] Pre-merge hook configured to run meta-gate on rules.ts changes
- [ ] Any new rule failing P1-P5 is rejected (no merge)

### Final Verification

- [ ] All 5 registries operational (phase, plan, park, audit, actors)
- [ ] All endpoints respect registry-based decisions (not request claims)
- [ ] RULE-CONSTITUTIONAL-COMPLIANCE enforces Constitution at merge time
- [ ] Documentation updated: each rule in rules.ts has P1-P5 compliance comment
- [ ] Governor signs off: "All 5 prevention rules implemented and operative"

---

## CONCLUSION

The Constitutional AI Behavior Layer **consolidates P1-P5 into a single unified pattern**: Persistent Source + Structural Depth + Actor Proof + Auto-Decision. 

When these four are present, enforcement is **mechanical and scalable**. When any is missing, the system regresses to theater (Governor-dependent, non-delegable, drift-prone).

The Checklist, Verification Gates, and Retrofit Strategy provide the **operational tooling** to make the pattern explicit and testable. Every gate author answers the 12-question checklist. Every new rule passes the Constitutional Compliance meta-gate. Every retrofit pocket targets one of the five rules.

**The result:** CDS moves from 60% theater + 40% mechanical → 100% mechanical enforcement. The platform becomes **delegable to a second builder without governance overhead**.

---

*Constitutional AI Behavior Layer v1 — Consolidated from Sonnet S345 Cruel Critic findings | OPUS synthesis and architecture | Ready for Platform Governor ratification*


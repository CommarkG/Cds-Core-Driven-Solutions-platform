# CDS Constitutional Retrofit — Execution Plan (Pockets 1-5)

**Document ID:** CDS-CSPS-0227  
**Based on:** CDS-CSPS-0225 (Constitutional AI Behavior Layer) + Sonnet S345 Prevention Rules  
**Status:** READY FOR DISPATCH TO BUILDER  
**Timeline:** 10 hours, 2 weeks (5 pockets, 4 blocking phases)  
**Owner:** SONNET (build) ← OPUS (architecture)  

---

## POCKET OVERVIEW

| Pocket | Rule | Current State | Target State | Effort | Blocker |
|--------|------|---|---|---|---|
| **Pocket-1** | P1 | Phase state in memory | File-based phase-registry.json | 2h | ✅ Blocks all others |
| **Pocket-4** | P4 | Headers-only validation | Headers + 8+ structural depth checks | 1.5h | ⊘ Independent |
| **Pocket-3** | P2 | Request claims trusted | Registry facts + actor proof | 3h | Pocket-1 |
| **Pocket-5** | P3 | No actor validation | actors-registry.json cross-check | 2h | Pocket-1 |
| **Pocket-2** | P5 | Advisory triggers | Mechanical PASS/FAIL outcomes | 1.5h | Pocket-1 |

---

## PHASE 1: FOUNDATION (POCKET-1) — 2 hours

### Objective
Create persistent phase state registry. All other pockets depend on this.

### Task 1.1: Create phase-registry.json Schema

**File:** `threshold/data/phase-registry.json`  
**Current state:** No such file exists; state is in-memory in `threshold/src/phase.ts`

**Action:**
1. Create new file at `threshold/data/phase-registry.json` (or create `threshold/data/` directory if missing)
2. Initialize with this schema:

```json
{
  "phases": {
    "phase-1": {
      "id": "phase-1",
      "status": "PENDING",
      "started_at": null,
      "completed_at": null,
      "audit_started_at": null,
      "audit_completed_at": null,
      "audit_findings_count": 0,
      "audit_status": "PENDING",
      "can_advance_to": null
    }
  },
  "version": "1.0",
  "last_updated_at": "2026-07-05T00:00:00Z"
}
```

**Test (syntax only):**
```bash
$ cat threshold/data/phase-registry.json | jq .
# Should parse without errors
```

---

### Task 1.2: Refactor threshold/src/phase.ts

**Current code to replace:** In-memory `let phaseState = {}` pattern

**Replacement pattern:**

```javascript
// BEFORE
let phaseState = {
  "phase-1": { started_at: null, audit_complete: false },
  "phase-2": { started_at: null, audit_complete: false }
};

function getPhaseState(phaseId) {
  return phaseState[phaseId] || {};
}

function updatePhaseState(phaseId, updates) {
  phaseState[phaseId] = { ...phaseState[phaseId], ...updates };
}

// AFTER
const fs = require('fs');
const path = require('path');
const REGISTRY_PATH = path.join(__dirname, '../data/phase-registry.json');

function getPhaseState(phaseId) {
  try {
    const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(data);
    return registry.phases[phaseId] || {};
  } catch (err) {
    console.error(`Failed to read phase state for ${phaseId}:`, err);
    return {};
  }
}

function updatePhaseState(phaseId, updates) {
  try {
    const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(data);
    
    registry.phases[phaseId] = {
      ...registry.phases[phaseId],
      ...updates,
      last_updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to update phase state for ${phaseId}:`, err);
    throw err;
  }
}
```

**Find & replace all calls to `phaseState[...]` with `getPhaseState(...)` and `updatePhaseState(...)`.**

**Search pattern (grep):** `phaseState\[` → Count matches
**Replace with:** `getPhaseState(` OR `updatePhaseState(` (context-dependent)

---

### Task 1.3: Wire Persistence Check Endpoint

**File:** `threshold/src/server.ts` (or `threshold/src/api/phase.ts`)  
**New endpoint:** `GET /api/phase/:id/status`

```javascript
app.get('/api/phase/:id/status', (req, res) => {
  const phaseId = req.params.id;
  const state = getPhaseState(phaseId);
  
  if (!state || !state.id) {
    return res.status(404).json({ error: "Phase not found" });
  }
  
  res.json({
    id: phaseId,
    status: state.status,
    started_at: state.started_at,
    completed_at: state.completed_at,
    audit_status: state.audit_status,
    last_updated_at: state.last_updated_at
  });
});

app.post('/api/phase/:id/start', (req, res) => {
  const phaseId = req.params.id;
  const existing = getPhaseState(phaseId);
  
  if (existing && existing.started_at) {
    return res.status(409).json({ error: "Phase already started" });
  }
  
  updatePhaseState(phaseId, {
    status: "IN_PROGRESS",
    started_at: new Date().toISOString()
  });
  
  res.json({ status: "started", phase_id: phaseId });
});
```

---

### Task 1.4: FAIL→PASS Test

**Test scenario:** Restart process, verify phase state persists

```bash
# Step 1: Start server
$ node threshold/src/server.js &
SERVER_PID=$!

# Step 2: Start phase-1
$ curl -X POST http://localhost:3000/api/phase/1/start
# Output: {"status": "started", "phase_id": "phase-1"}

# Step 3: Get status
$ curl http://localhost:3000/api/phase/1/status
# Output: {"id": "phase-1", "status": "IN_PROGRESS", "started_at": "2026-07-05T10:00:00Z", ...}

# Step 4: Kill server (simulate restart)
$ kill $SERVER_PID
$ sleep 2

# Step 5: Start server again
$ node threshold/src/server.js &
NEW_SERVER_PID=$!
$ sleep 1

# Step 6: Check phase status again
$ curl http://localhost:3000/api/phase/1/status
# Output: {"id": "phase-1", "status": "IN_PROGRESS", "started_at": "2026-07-05T10:00:00Z", ...}
# ^ SAME started_at timestamp = proof of persistence

# Cleanup
$ kill $NEW_SERVER_PID
```

**Acceptance:** Real stdout showing same `started_at` after restart = PASS

---

## PARALLEL: POCKET-4 (P4) — 1.5 hours

*(Can run at same time as Pocket-1)*

### Objective
Enhance plan validator to check structural depth (not just headers).

### Task 4.1: Refactor threshold/src/validators/plan.ts

**Current code:**
```javascript
function validatePlan(plan) {
  if (!plan.one_sentence) return "FAIL: missing one_sentence";
  if (!plan.build_readiness) return "FAIL: missing build_readiness";
  return "PASS";
}
```

**Replacement:**
```javascript
function validatePlan(plan) {
  const failures = [];
  
  // === HEADERS (Format Checks) ===
  if (!plan) failures.push("Plan is null or undefined");
  if (typeof plan !== "object") failures.push("Plan is not an object");
  
  // === STRUCTURAL CHECKS ===
  // 1. One Sentence
  if (!plan.one_sentence || plan.one_sentence.trim().length === 0) {
    failures.push("missing one_sentence");
  } else if ((plan.one_sentence.match(/\./g) || []).length !== 1) {
    failures.push("one_sentence must contain exactly one period (one sentence only)");
  }
  
  // 2. Build Readiness
  if (!plan.build_readiness) {
    failures.push("missing build_readiness object");
  } else if (!['GREEN', 'YELLOW', 'RED'].includes(plan.build_readiness.verdict)) {
    failures.push("build_readiness.verdict must be GREEN, YELLOW, or RED");
  }
  
  // 3. Prerequisites (P1, P2, P3)
  if (!plan.p1_closure_criteria || plan.p1_closure_criteria.trim().length === 0) {
    failures.push("P1_closure_criteria missing (required for build readiness)");
  }
  if (!plan.p2_ratified_at) {
    failures.push("p2_ratified_at missing (P2 must be ratified by Governor)");
  }
  if (!plan.p3_baseline_published_at) {
    failures.push("p3_baseline_published_at missing (P3 baseline must be published)");
  }
  
  // 4. Final Architecture
  if (!plan.final_architecture) {
    failures.push("final_architecture section missing");
  } else if (!plan.final_architecture.components || plan.final_architecture.components.length === 0) {
    failures.push("final_architecture must define at least one component");
  }
  
  // 5. Build Sequence (ordering + dependencies)
  if (!plan.build_sequence || plan.build_sequence.length === 0) {
    failures.push("build_sequence is empty (minimum 10 steps required)");
  } else if (plan.build_sequence.length < 10) {
    failures.push(`build_sequence has ${plan.build_sequence.length} steps; minimum 10 required`);
  } else {
    // Check each step has deliverable
    for (let i = 0; i < plan.build_sequence.length; i++) {
      const step = plan.build_sequence[i];
      if (!step.deliverable || step.deliverable.trim().length === 0) {
        failures.push(`Step ${i} missing deliverable`);
      }
      // Check non-first steps have sequencing_dependencies
      if (i > 0 && (!step.sequencing_dependencies || step.sequencing_dependencies.length === 0)) {
        failures.push(`Step ${i} missing sequencing_dependencies (required for non-first steps)`);
      }
    }
  }
  
  // 6. Corespine Architecture
  if (!plan.corespine_architecture) {
    failures.push("corespine_architecture section missing");
  } else if (!plan.corespine_architecture.position) {
    failures.push("corespine_architecture must declare position in tier structure");
  }
  
  // 7. Initial Type Library
  if (!plan.initial_type_library) {
    failures.push("initial_type_library section missing");
  }
  
  // 8. Phase 2+ Parked Items
  if (!plan.phase_2_plus_parked) {
    failures.push("phase_2_plus_parked section missing (declare boundary between Phase 1 and later)");
  }
  
  // Return result
  if (failures.length > 0) {
    return "FAIL: " + failures.join(" | ");
  }
  return "PASS";
}
```

**Wire into endpoint:** `POST /api/plan/validate`

```javascript
app.post('/api/plan/validate', (req, res) => {
  const plan = req.body;
  const result = validatePlan(plan);
  
  if (!result.startsWith("PASS")) {
    return res.status(400).json({ 
      validation: result, 
      blocking: true 
    });
  }
  
  res.json({ validation: result });
});
```

---

### Task 4.2: FAIL→PASS Test

**Test case 1: Plan missing P1 closure criteria**

```bash
$ curl -X POST http://localhost:3000/api/plan/validate \
  -H "Content-Type: application/json" \
  -d '{
    "one_sentence": "Build Phase 1 with constraints.",
    "build_readiness": { "verdict": "GREEN" },
    "p2_ratified_at": "2026-07-04T10:00:00Z",
    "p3_baseline_published_at": "2026-07-05T09:00:00Z",
    "final_architecture": { "components": ["solver"] },
    "build_sequence": [{"deliverable": "step1"}, ... 10+ steps],
    "corespine_architecture": { "position": "CS-TEMPLATE" },
    "initial_type_library": { "types": [] },
    "phase_2_plus_parked": { "items": [] }
  }'

# Output (FAIL):
# {
#   "validation": "FAIL: P1_closure_criteria missing (required for build readiness) | ...",
#   "blocking": true
# }
```

**Test case 2: Add P1, retest**

```bash
$ curl -X POST http://localhost:3000/api/plan/validate \
  -H "Content-Type: application/json" \
  -d '{
    "one_sentence": "Build Phase 1 with constraints.",
    "build_readiness": { "verdict": "GREEN" },
    "p1_closure_criteria": "Solver handles 50 fields + cross-field constraints",
    "p2_ratified_at": "2026-07-04T10:00:00Z",
    "p3_baseline_published_at": "2026-07-05T09:00:00Z",
    ... (rest as above)
  }'

# Output (PASS):
# {
#   "validation": "PASS"
# }
```

**Acceptance:** Real curl output showing FAIL → PASS = PASS

---

## PHASE 2: REGISTRY TRUTH (POCKET-3) — 3 hours

*(Depends on Pocket-1)*

### Objective
Separate facts (persistent registry) from claims (request context). Validate requests against registry truth.

### Task 3.1: Create plan-registry.json

**File:** `threshold/data/plan-registry.json`

```json
{
  "plans": {
    "PLAN-001": {
      "id": "PLAN-001",
      "title": "Phase 1 Build Plan",
      "created_at": "2026-07-03T08:00:00Z",
      "p1_closure_criteria": "Solver handles 50 fields, cross-field rules, constraint documentation",
      "p1_closed_at": "2026-07-03T15:00:00Z",
      "p1_verified_by": "yariv-gov-001",
      "p2_ratified_at": "2026-07-04T10:00:00Z",
      "p2_ratified_by": "yariv-gov-001",
      "p3_baseline_published_at": "2026-07-05T09:00:00Z",
      "p3_baseline_score": 0.82,
      "all_prerequisites_met": true
    }
  },
  "version": "1.0",
  "last_updated_at": "2026-07-05T00:00:00Z"
}
```

---

### Task 3.2: Create actors-registry.json

**File:** `threshold/data/actors-registry.json`

```json
{
  "actors": {
    "yariv-gov-001": {
      "id": "yariv-gov-001",
      "name": "Yariv Fink",
      "kind": "Governor",
      "authority_scope": ["ratification", "override", "escalation"],
      "authenticated_at": "2026-07-05T08:00:00Z",
      "session_expires_at": "2026-07-06T08:00:00Z"
    },
    "builder-agent-001": {
      "id": "builder-agent-001",
      "name": "Builder Agent",
      "kind": "Builder",
      "authority_scope": ["implementation", "phase_start", "audit"],
      "authenticated_at": "2026-07-05T08:00:00Z",
      "session_expires_at": "2026-07-06T08:00:00Z"
    },
    "validator-agent-001": {
      "id": "validator-agent-001",
      "name": "Validator Agent",
      "kind": "Validator",
      "authority_scope": ["validation", "audit_run"],
      "authenticated_at": "2026-07-05T08:00:00Z",
      "session_expires_at": "2026-07-06T08:00:00Z"
    }
  },
  "version": "1.0",
  "last_updated_at": "2026-07-05T00:00:00Z"
}
```

---

### Task 3.3: Refactor threshold/src/api/plan.ts

**Current code pattern (trusts request claims):**
```javascript
app.post('/api/phase/1/start', (req, res) => {
  const ready = req.body.p1_closed && req.body.p2_ratified && req.body.p3_published;
  if (ready) res.json({ status: "start" });
});
```

**Replacement (reads from registry, validates against facts):**

```javascript
const fs = require('fs');
const path = require('path');

function getPlanRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/plan-registry.json'), 'utf-8');
  return JSON.parse(data);
}

function getActorsRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/actors-registry.json'), 'utf-8');
  return JSON.parse(data);
}

app.post('/api/phase/1/start', (req, res) => {
  const plan_id = req.body.plan_id;
  const actor_id = req.headers['x-actor-id'];
  
  // P2: Read facts from registry, not claims from request
  const planRegistry = getPlanRegistry();
  const fact = planRegistry.plans[plan_id];
  
  if (!fact) {
    return res.status(404).json({ error: "Plan not found in registry" });
  }
  
  // Validate prerequisites from facts (not request claims)
  if (!fact.p1_closed_at) {
    return res.status(409).json({ 
      error: "P1 not yet closed",
      detail: "p1_closed_at is missing from plan registry",
      blocking: true
    });
  }
  if (!fact.p2_ratified_at) {
    return res.status(409).json({ 
      error: "P2 not yet ratified",
      detail: "p2_ratified_at is missing from plan registry",
      blocking: true
    });
  }
  if (!fact.p3_baseline_published_at) {
    return res.status(409).json({ 
      error: "P3 baseline not published",
      detail: "p3_baseline_published_at is missing from plan registry",
      blocking: true
    });
  }
  
  // P3: Validate actor authority (if updating plan, only Governor can)
  const actorsRegistry = getActorsRegistry();
  const actor = actorsRegistry.actors[actor_id];
  
  if (!actor) {
    return res.status(403).json({ error: "Actor not authenticated" });
  }
  
  if (actor.kind !== "Governor" && actor.kind !== "Builder") {
    return res.status(403).json({ error: `Actor kind ${actor.kind} cannot start phase` });
  }
  
  // All prerequisites met and actor validated
  res.json({ 
    status: "phase_1_ready_to_start",
    plan_id,
    actor_id,
    prerequisites: {
      p1_closed: fact.p1_closed_at,
      p2_ratified: fact.p2_ratified_at,
      p3_published: fact.p3_baseline_published_at
    }
  });
});
```

---

### Task 3.4: FAIL→PASS Test

**Test case 1: Missing P2 ratification (FAIL)**

```bash
# Remove p2_ratified_at from plan-registry.json temporarily
$ jq '.plans["PLAN-001"].p2_ratified_at = null' threshold/data/plan-registry.json > /tmp/plan-reg-tmp.json
$ mv /tmp/plan-reg-tmp.json threshold/data/plan-registry.json

# Try to start phase
$ curl -X POST http://localhost:3000/api/phase/1/start \
  -H "Content-Type: application/json" \
  -H "x-actor-id: builder-agent-001" \
  -d '{ "plan_id": "PLAN-001" }'

# Output (FAIL):
# {
#   "error": "P2 not yet ratified",
#   "detail": "p2_ratified_at is missing from plan registry",
#   "blocking": true
# }
```

**Test case 2: Restore P2, retest (PASS)**

```bash
# Restore p2_ratified_at
$ jq '.plans["PLAN-001"].p2_ratified_at = "2026-07-04T10:00:00Z"' threshold/data/plan-registry.json > /tmp/plan-reg-tmp.json
$ mv /tmp/plan-reg-tmp.json threshold/data/plan-registry.json

# Try to start phase again
$ curl -X POST http://localhost:3000/api/phase/1/start \
  -H "Content-Type: application/json" \
  -H "x-actor-id: builder-agent-001" \
  -d '{ "plan_id": "PLAN-001" }'

# Output (PASS):
# {
#   "status": "phase_1_ready_to_start",
#   "plan_id": "PLAN-001",
#   "actor_id": "builder-agent-001",
#   "prerequisites": { ... }
# }
```

**Acceptance:** Real curl output showing FAIL → PASS = PASS

---

## PHASE 3: ACTOR PROOF (POCKET-5) — 2 hours

*(Depends on Pocket-1)*

### Objective
Cross-validate actor authority against actors registry. No self-declared authority.

### Task 5.1: Refactor threshold/src/api/park.ts

**Current code (no actor validation, violates P3):**
```javascript
app.post('/api/finding/park', (req, res) => {
  parkRegistry.write(req.body.finding_id, {
    status: "PARKED_WITH_DEADLINE",
    close_by: req.body.close_by,
    parked_by: req.body.parked_by  // TRUSTS REQUEST CLAIM
  });
  res.json({ status: "parked" });
});
```

**Replacement (validates actor against registry):**

```javascript
const fs = require('fs');
const path = require('path');

function getActorsRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/actors-registry.json'), 'utf-8');
  return JSON.parse(data);
}

function getParkRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/park-registry.json'), 'utf-8');
  return JSON.parse(data);
}

function updateParkRegistry(updates) {
  const current = getParkRegistry();
  const updated = { ...current, ...updates, last_updated_at: new Date().toISOString() };
  fs.writeFileSync(
    path.join(__dirname, '../../data/park-registry.json'),
    JSON.stringify(updated, null, 2),
    'utf-8'
  );
}

app.post('/api/finding/park', (req, res) => {
  const actor_id = req.headers['x-actor-id'];
  const finding_id = req.body.finding_id;
  const close_by = req.body.close_by;
  const rationale = req.body.rationale;
  
  // P3: Validate actor against actors registry
  const actorsRegistry = getActorsRegistry();
  const actor = actorsRegistry.actors[actor_id];
  
  if (!actor) {
    return res.status(403).json({ 
      error: "Actor not authenticated",
      actor_id
    });
  }
  
  // Only Governor can park findings
  if (actor.kind !== "Governor") {
    return res.status(403).json({ 
      error: "Only Governor can park findings",
      actor_kind: actor.kind,
      required_kind: "Governor"
    });
  }
  
  // Validate close_by is a future date
  const closeDate = new Date(close_by);
  if (closeDate <= new Date()) {
    return res.status(400).json({ 
      error: "close_by must be in the future",
      provided: close_by,
      today: new Date().toISOString()
    });
  }
  
  // Park the finding
  const parkRegistry = getParkRegistry();
  
  if (!parkRegistry.findings) {
    parkRegistry.findings = {};
  }
  
  parkRegistry.findings[finding_id] = {
    id: finding_id,
    status: "PARKED_WITH_DEADLINE",
    close_by: closeDate.toISOString(),
    parked_by: actor.id,  // Use registry proof, not request claim
    parked_by_name: actor.name,
    parked_at: new Date().toISOString(),
    rationale: rationale || "",
    escalation_status: "PENDING"
  };
  
  updateParkRegistry(parkRegistry);
  
  res.json({ 
    status: "parked",
    finding_id,
    parked_by: actor.name,
    parked_by_id: actor.id,
    close_by: closeDate.toISOString(),
    escalation_status: "PENDING"
  });
});
```

---

### Task 5.2: Create park-registry.json

**File:** `threshold/data/park-registry.json`

```json
{
  "findings": {
    "FINDING-001": {
      "id": "FINDING-001",
      "status": "PARKED_WITH_DEADLINE",
      "close_by": "2026-07-15T23:59:59Z",
      "parked_by": "yariv-gov-001",
      "parked_by_name": "Yariv Fink",
      "parked_at": "2026-07-05T10:00:00Z",
      "rationale": "Deferred to Phase 2 design cycle",
      "escalation_status": "PENDING"
    }
  },
  "version": "1.0",
  "last_updated_at": "2026-07-05T00:00:00Z"
}
```

---

### Task 5.3: FAIL→PASS Test

**Test case 1: Builder tries to park (FAIL)**

```bash
$ curl -X POST http://localhost:3000/api/finding/park \
  -H "Content-Type: application/json" \
  -H "x-actor-id: builder-agent-001" \
  -d '{
    "finding_id": "FINDING-002",
    "close_by": "2026-07-20T23:59:59Z",
    "rationale": "Deferred to later phase"
  }'

# Output (FAIL):
# {
#   "error": "Only Governor can park findings",
#   "actor_kind": "Builder",
#   "required_kind": "Governor"
# }
```

**Test case 2: Governor parks (PASS)**

```bash
$ curl -X POST http://localhost:3000/api/finding/park \
  -H "Content-Type: application/json" \
  -H "x-actor-id: yariv-gov-001" \
  -d '{
    "finding_id": "FINDING-002",
    "close_by": "2026-07-20T23:59:59Z",
    "rationale": "Deferred to Phase 2 design"
  }'

# Output (PASS):
# {
#   "status": "parked",
#   "finding_id": "FINDING-002",
#   "parked_by": "Yariv Fink",
#   "parked_by_id": "yariv-gov-001",
#   "close_by": "2026-07-20T23:59:59Z",
#   "escalation_status": "PENDING"
# }

# Verify in park-registry.json
$ jq '.findings["FINDING-002"].parked_by' threshold/data/park-registry.json
# Output: "yariv-gov-001"  (from registry, not request claim)
```

**Acceptance:** Real curl output showing FAIL → PASS = PASS

---

## PHASE 4: MECHANICAL ENFORCEMENT (POCKET-2) — 1.5 hours

*(Depends on Pocket-1)*

### Objective
Replace advisory triggers with mechanical PASS/FAIL outcomes. No "Governor should review" patterns.

### Task 2.1: Refactor threshold/src/triggers.ts

**Current code (advisory, violates P5):**
```javascript
async function checkPhaseCanAdvance(phase_id) {
  const audit = await getPhaseAudit(phase_id);
  
  if (audit.findings_count > 3) {
    logger.warn(`Phase ${phase_id} has ${audit.findings_count} findings. Governor review recommended.`);
    return { can_advance: "pending_review", message: "Governor should review" };
  }
  
  return { can_advance: true };
}
```

**Replacement (mechanical):**

```javascript
const fs = require('fs');
const path = require('path');

function getAuditRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/audit-registry.json'), 'utf-8');
  return JSON.parse(data);
}

function getParkRegistry() {
  const data = fs.readFileSync(path.join(__dirname, '../../data/park-registry.json'), 'utf-8');
  return JSON.parse(data);
}

function getPhaseState(phase_id) {
  const data = fs.readFileSync(path.join(__dirname, '../../data/phase-registry.json'), 'utf-8');
  const registry = JSON.parse(data);
  return registry.phases[phase_id] || {};
}

async function checkPhaseCanAdvance(phase_id) {
  const phaseState = getPhaseState(phase_id);
  
  // Mechanical check 1: Phase must have been completed
  if (!phaseState.completed_at) {
    return {
      can_advance: false,
      reason: "phase_not_completed",
      blocking: true
    };
  }
  
  // Mechanical check 2: Audit must have been run
  const auditRegistry = getAuditRegistry();
  const audit = auditRegistry.audits && auditRegistry.audits[phase_id];
  
  if (!audit) {
    return {
      can_advance: false,
      reason: "audit_not_run",
      detail: `No audit found for phase ${phase_id}`,
      blocking: true
    };
  }
  
  if (audit.status !== "COMPLETE") {
    return {
      can_advance: false,
      reason: "audit_incomplete",
      audit_status: audit.status,
      blocking: true
    };
  }
  
  // Mechanical check 3: All findings must be resolved or parked
  const parkRegistry = getParkRegistry();
  const findings = audit.findings || [];
  
  const unresolvedFindings = findings.filter(f => {
    if (f.status === "CLOSED") return false; // Resolved
    if (f.status === "PARKED_WITH_DEADLINE") {
      // Check if deadline has passed (escalated)
      const closeDate = new Date(f.close_by);
      if (closeDate < new Date()) {
        return true; // ESCALATED, blocks advance
      }
      return false; // Future deadline, OK
    }
    // OPEN status blocks advance
    return f.status === "OPEN";
  });
  
  if (unresolvedFindings.length > 0) {
    return {
      can_advance: false,
      reason: "unresolved_findings",
      unresolved_count: unresolvedFindings.length,
      unresolved_ids: unresolvedFindings.map(f => f.id),
      blocking: true
    };
  }
  
  // All checks passed
  return {
    can_advance: true,
    blocking: false,
    audit_id: audit.id,
    findings_resolved: findings.filter(f => f.status === "CLOSED").length
  };
}
```

**Wire into endpoint:**

```javascript
app.post('/api/phase/:id/advance', async (req, res) => {
  const phase_id = req.params.id;
  const check = await checkPhaseCanAdvance(phase_id);
  
  if (!check.can_advance) {
    return res.status(409).json({
      error: "Cannot advance phase",
      reason: check.reason,
      details: check,
      blocking: check.blocking
    });
  }
  
  // Advance to next phase
  const nextPhaseId = `phase-${parseInt(phase_id.split('-')[1]) + 1}`;
  const phaseRegistry = getPhaseRegistry();
  
  phaseRegistry.phases[nextPhaseId] = {
    id: nextPhaseId,
    status: "PENDING",
    started_at: null,
    completed_at: null,
    audit_started_at: null,
    audit_completed_at: null,
    audit_findings_count: 0,
    audit_status: "PENDING",
    can_advance_to: null
  };
  
  updatePhaseRegistry(phaseRegistry);
  
  res.json({
    status: "phase_advanced",
    previous_phase: phase_id,
    next_phase: nextPhaseId,
    timestamp: new Date().toISOString()
  });
});
```

---

### Task 2.2: Create audit-registry.json

**File:** `threshold/data/audit-registry.json`

```json
{
  "audits": {
    "phase-1": {
      "id": "phase-1-audit-001",
      "phase_id": "phase-1",
      "status": "COMPLETE",
      "started_at": "2026-07-05T10:00:00Z",
      "completed_at": "2026-07-05T11:30:00Z",
      "findings": [
        {
          "id": "FINDING-001",
          "status": "CLOSED",
          "closed_at": "2026-07-05T11:00:00Z",
          "description": "Type library scope needs refinement"
        }
      ]
    }
  },
  "version": "1.0",
  "last_updated_at": "2026-07-05T00:00:00Z"
}
```

---

### Task 2.3: FAIL→PASS Test

**Test case 1: Phase not completed (FAIL)**

```bash
# Phase-2 has not been completed yet
$ curl -X POST http://localhost:3000/api/phase/2/advance

# Output (FAIL):
# {
#   "error": "Cannot advance phase",
#   "reason": "phase_not_completed",
#   "blocking": true
# }
```

**Test case 2: Complete phase-2, audit it, advance (PASS)**

```bash
# 1. Complete phase-2
$ jq '.phases["phase-2"].completed_at = "2026-07-05T14:00:00Z"' \
  threshold/data/phase-registry.json > /tmp/reg.json
$ mv /tmp/reg.json threshold/data/phase-registry.json

# 2. Create audit for phase-2
$ jq '.audits["phase-2"] = {
  "id": "phase-2-audit-001",
  "phase_id": "phase-2",
  "status": "COMPLETE",
  "started_at": "2026-07-05T14:00:00Z",
  "completed_at": "2026-07-05T14:30:00Z",
  "findings": []
}' threshold/data/audit-registry.json > /tmp/audit.json
$ mv /tmp/audit.json threshold/data/audit-registry.json

# 3. Try to advance phase-2
$ curl -X POST http://localhost:3000/api/phase/2/advance

# Output (PASS):
# {
#   "status": "phase_advanced",
#   "previous_phase": "phase-2",
#   "next_phase": "phase-3",
#   "timestamp": "2026-07-05T14:31:00Z"
# }
```

**Acceptance:** Real curl output showing FAIL → PASS = PASS

---

## FINAL ACCEPTANCE CHECKLIST

After all 5 pockets are complete:

- [ ] **Pocket-1:** phase-registry.json persistent, FAIL→PASS test passed
- [ ] **Pocket-4:** Plan validator checks 8+ structural requirements, FAIL→PASS test passed
- [ ] **Pocket-3:** plan-registry.json + actors-registry.json in place, facts override request claims, FAIL→PASS test passed
- [ ] **Pocket-5:** park-registry.json + actor validation, only Governor can park, FAIL→PASS test passed
- [ ] **Pocket-2:** Mechanical advance checks (no advisory), FAIL→PASS test passed
- [ ] **All 5 registries:** Created, queryable, persisted to disk
- [ ] **All endpoints:** Wired to read from registries, not request body
- [ ] **No parallel systems:** Single source of truth (registries), no in-memory state
- [ ] **Documentation:** Each pocket documented with file paths, code patterns, test cases

---

## SIGN-OFF

**Dispatch to:** SONNET (builder)  
**Dispatch from:** OPUS (architecture)  
**Timeline:** 10 hours, 2 weeks, 5 pockets, 4 phases  
**Blocking path:** Pocket-1 → Pockets 3, 5, 2 (Pocket-4 parallel)  
**Success criterion:** All 5 FAIL→PASS tests pass with real curl output  

**Ready to execute on command.**

---

*Retrofit Execution Plan v1 — Fully specified, fully testable, ready for dispatch — OPUS synthesis from Sonnet S345 Prevention Rules | 2026-07-05*


---
document_id: CDS-PCR-001-CORESPIRAL-EXECUTION-001
title: PCR-001 — DecisionNode Schema — CoreSpiral Execution (SEED + SKELETON)
status: ZF-0 PASSED — AWAITING GOVERNOR RATIFICATION
authority: Governor Yariv Fink
wiring_state: REACHABLE
corespine: CS-PE-001
schema_position: CDS.SCHEMA.DECISION_NODE
pe_score: 42.2
kernel_component: YES — kernel gate blocked until this reaches CURRENT
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# PCR-001 — DecisionNode Schema CoreSpiral Execution

This document executes the SEED and SKELETON stages of PCR-001 per CDS Build Doctrine
(CDS-BUILD-DOCTRINE-CORESPIRAL-001). FLESH stage follows when SKELETON is confirmed complete.

---

## STAGE 1 — SEED ✓ LOCKED

**Justification (one sentence, Governor-challenge-tested):**
Without a canonical DecisionNode schema, the PE scoring engine has no locked definition
of what it scores, the consulting system has no schema anchor for capability entries, and
the corespine registry has no structural reference — making every PE score, every
capability admission, and every corespine constraint dependent on an implied but unverified
definition.

**What breaks if this doesn't exist:**

| System | What Breaks |
|--------|------------|
| PE scoring engine | Scores a "decision" but what constitutes a decision varies by session → non-deterministic scoring — violates CS-PE-001 C2 (determinism) |
| Consulting system CapabilityEntry | `schema_node` field validated against undefined registry → any string passes validation → silent admission of invalid capabilities |
| Corespine registry | Constraints reference decision node types but types are implied → contradiction audits cannot run mechanically → AI-only review |
| Ratification records | GOV-IDs link to decision nodes by ID but IDs have no canonical format → traceability breaks at the record level |

**Governor challenge test:** PASSED.
Remove the schema → three systems become non-deterministic simultaneously. Justification survives.

**SEED stage: LOCKED ✓**

---

## STAGE 2 — SKELETON ✓ LOCKED

### Core Fields (6 — from ratified CDS sessions)

| Field | Type | Purpose | Rule |
|-------|------|---------|------|
| `schema_position` | string | Where in T-model this node sits | Format: `CDS.[ROOT].[TRUNK].[BRANCH]` — e.g. `CDS.SYSTEM.GOVERNANCE.DECISION` |
| `corespine_context` | string | Which corespine governs this node | Must reference an existing entry in CORESPINE-REGISTRY.yaml |
| `definition` | string | Exact meaning of this node | No vague language. Vague definitions rejected at intake. |
| `usage_boundaries` | object | Where this applies + where it explicitly does not | Both `applies_to` and `does_not_apply_to` required |
| `inheritance_chain` | object | Parent nodes (what this inherits) + child nodes (what inherits from this) | Both `inherits_from` and `inherited_by` arrays required |
| `falsification_test` | string | Observable condition proving this node is correctly applied | Must be specific and observable — not interpretive |

### T-Model Fields (required by architecture)

| Field | Type | Purpose | Rule |
|-------|------|---------|------|
| `node_id` | string | Unique identifier | Format: `DN-[DOMAIN]-[SEQ]` — e.g. `DN-GOV-001` |
| `node_type` | enum | Root fork classification | `SYSTEM` or `DOMAIN` only — T-model root fork |
| `trunk_position` | string | Position in Root → Trunk → Branch hierarchy | Declared at node creation; not modified without PCR |
| `authority_tier` | enum | Who can create/modify this node | `ADMIN` or `TRUSTED` |

### State Fields (wiring + ratification tracking)

| Field | Type | Purpose | Rule |
|-------|------|---------|------|
| `wiring_state` | enum | Current connectivity state | `DEFINED → WIRED → REACHABLE → CURRENT` |
| `ratification_state` | enum | Current governance state | `PROPOSED → RATIFIED → SUPERSEDED → ARCHIVED` |
| `created_session` | string | Session when node was created | ISO date or session ID |
| `last_modified_session` | string | Session when last modified | Updated on every change |

### Systems That Consume This Schema

| System | How It Consumes | Dependency Criticality |
|--------|----------------|----------------------|
| PE scoring engine (pe/src/scoring-engine.ts) | Reads `node_id` to score decisions; reads `corespine_context` for trust modifier | BLOCKING — Phase B cannot write without this |
| Consulting system CapabilityEntry | Validates `schema_node` field against canonical node registry | BLOCKING — ADD workflow validation incomplete without this |
| Corespine registry | Constraints reference node types; types must be defined | HIGH — contradiction audits are AI-only without this |
| Governor ratification records | GOV-IDs link to `node_id` as decision anchor | HIGH — traceability breaks without canonical IDs |
| Audit log (CS-PE-001 C3) | Every scoring decision records `node_id` + `corespine_context` | REQUIRED — C3 cannot be satisfied without canonical IDs |

### Authority Boundaries

| Operation | Who | Condition |
|-----------|-----|-----------|
| Create new DecisionNode | ADMIN (CDS only) | Passes SEED + SKELETON + FLESH + SKIN + VERIFY |
| Modify existing node | ADMIN (CDS only) | Requires PCR + Governor approval |
| Reference a node | TRUSTED platforms | Node must be at wiring state REACHABLE or higher |
| Archive a node | ADMIN (CDS only) | Zero active references confirmed + Governor signs |

### Inheritance Block (What This Schema Inherits)

- **T-model root fork** (SYSTEM/DOMAIN) — ratified CDS architecture — locked
- **CS-PE-001 constraints C1-C4** — formula config-driven, deterministic, audited, halt on registry unreachable — locked
- **GOV-PE-BOOTSTRAP-001** — manual priority queue governs sequencing of node creation — active until PE LIVE

### Forward Infrastructure Block (What Depends On This Schema)

- **Phase B scoring engine** — pe/src/scoring-engine.ts reads canonical node definitions
- **Phase B queue manager** — pe/src/queue-manager.ts queues by node_id
- **Phase B audit log** — CS-PE-001 C3 records node_id per scoring decision
- **Consulting system L1** — CapabilityEntry.schema_node validated against this registry
- **Future corespines** — each new corespine anchors to nodes defined here
- **PE scoring simulation** — simulation runs against actual node IDs — requires canonical registry

**SKELETON stage: LOCKED ✓**

---

## STAGE 3 — FLESH ✓ LOCKED

**Output:** `CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml` (written 2026-07-20)

**What was produced:**
- All 14 fields from SKELETON fully specified with types, validation rules, and specific error messages
- 3 example nodes: DN-PE-001 (SYSTEM/CURRENT), DN-GOV-001 (SYSTEM/cross-cutting/WIRED), DN-CON-001 (DOMAIN/DEFINED)
- 4 registry integrity rules (uniqueness, orphan prevention, consistency, admission gate)
- Schema health dashboard
- Full corespiral stage log embedded in schema file

**Flesh rule check:** 14 fields in SKELETON → 14 fields in schema. No additions. Rule satisfied.

**FLESH stage: LOCKED ✓**

---

## STAGE 4 — SKIN ✓ LOCKED

**Phase A wiring complete (2026-07-20):**
- CORESPINE-REGISTRY.yaml — `decision_node_id: DN-PE-001` added to CS-PE-001; schema reference added to file header
- RATIFICATION-CS-PE-001.yaml — `decision_node_id: DN-PE-001` added
- GOV-PE-BOOTSTRAP-001.yaml — `corespiral_status`, `schema_file`, `nodes_registered` added to PCR-001 rank entry

**Phase B forward stubs declared in schema Part 5 (SKIN log):**
- pe/src/scoring-engine.ts — reads node_id from registry
- consulting ADD workflow — validates CapabilityEntry.schema_node against DN-CON-001
- pe/logs/scoring-audit.jsonl — C3 records per node_id

**Semantic finding (surfaced at SKIN — not a blocker):**
Old PCR-001 completion criteria listed PE scoring fields (value, urgency, risk, effort, verification_cost) as DecisionNode fields. SKELETON scope clarification: these fields live on PCR work items (already in GOV-PE-BOOTSTRAP-001 pe_metadata), not on the DecisionNode structural schema. PCR-001-DECISION-NODE-SCHEMA.yaml updated with scope clarification note.

**SKIN stage: LOCKED ✓**

---

## STAGE 5 — VERIFY ✓ ZF-0 PASSED (awaiting Governor ratification)

**ZF-0 audit run: 2026-07-20**

| Category | Findings surfaced | Findings resolved | Final count |
|----------|------------------|------------------|-------------|
| Mechanical | 1 | 1 | 0 |
| Semantic | 1 | 1 | 0 |
| Propagation | 0 | 0 | 0 |
| **TOTAL** | **2** | **2** | **0** |

**Resolved:**
- FINDING-M-001: DN-AUD-001 orphan reference removed from DN-PE-001 inherited_by
- FINDING-S-001: Phase A-verifiable clauses added to DN-PE-001 and DN-CON-001 falsification tests

**ZF-0 status: PASS**

**Awaiting Governor:**
Governor signature required: "DecisionNode schema is locked. Changes require PCR."
On sign-off: `ratification_state → RATIFIED`, `wiring_state → CURRENT`
Kernel gate: PCR-001 component checked. PCR-002 must also reach CURRENT to close gate.

---

## Stage Progress

```
STAGE 1 — SEED        [LOCKED ✓]   2026-07-20
STAGE 2 — SKELETON    [LOCKED ✓]   2026-07-20
STAGE 1 — SEED        [LOCKED ✓]   2026-07-20
STAGE 2 — SKELETON    [LOCKED ✓]   2026-07-20
STAGE 3 — FLESH       [LOCKED ✓]   2026-07-20
STAGE 4 — SKIN        [LOCKED ✓]   2026-07-20
STAGE 5 — VERIFY      [ZF-0 PASSED ✓ — awaiting Governor sign-off]
──────────────────────────────────────────────
WIRING STATE          [REACHABLE]
KERNEL GATE           [OPEN — Governor sign-off → CURRENT → gate checked]
PHASE B GATE          [BLOCKED — kernel gate open]
```

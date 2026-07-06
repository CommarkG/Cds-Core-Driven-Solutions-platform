# CDS Template Hub — Final Implementation Plan

**Document ID:** CDS-TEMPLATE-IMPLEMENTATION-PLAN-001  
**Date:** 2026-07-04  
**Status:** PHASE 1 BUILD OPEN — OPUS REVIEW COMPLETED 2026-07-05  
**Feeds:** GOV-TEMPLATE-001 + GOV-TEMPLATE-002 + GOV-TEMPLATE-003 + GOV-TEMPLATE-004  
**Review basis:** CDS internal (5-lens + Opus holistic) + CSP OPUS external + CSPS Opus-25 external + OPUS HOLISTIC REVIEW (full ZF cycle, YELLOW CONDITIONAL → GREEN)  
**Threshold hardwired:** YES — every step maps to a specific `threshold/src/` file  
**Phase 1 Build Open:** YES (EFFECTIVE 2026-07-05 after three clarifications approved)  
**Opus Holistic Review Verdict:** YELLOW CONDITIONAL → GREEN (three editorial clarifications integrated into plan, P1/P2/P3 now fully specified)  
**Parallel Phase 1 Tasks (non-blocking Steps 0-5):**
- P1 closure criterion clarified (design doc + Step 1 code)
- P3 baseline published (147 fields total, 118 inherited, 80.3%)
- Governor Trigger Map design session scheduled (Step 6 prerequisite, target: first-week completion)

---

## The One Sentence

> **Build the solver first and cripple the type system down to what it can decide — because an additive platform that cannot mechanically catch two additive locks contradicting each other across layers is not deterministic, it is just deferring its own contradiction to a place you cannot append your way out of.**

---

## Build Readiness Verdict

**Architecture is ready to ratify. Phase 1 build may open — conditional on three prerequisites.**

No architectural blocker remains after two external review rounds. The critical correction from review — R2 must explicitly catch *conflicting LOCKED values at different layers* (Layer N locks field to "red"; Layer N+2 locks same field to "blue" — both additive operations, jointly incoherent) — closes the one hole that would have made the additive-only guarantee false.

**Two ratification conditions that must hold:**
1. Governor Trigger Map (`governor-trigger-map.json`) must be a ratified finite table — not judgment criteria — before R3 is ratified. Without it, Phase 2 of the ratification machine leaks unbounded human judgment into what must be a mechanical wall.
2. Layer 4 (instance endpoint) is NOT ratified in Phase 1. The lazy-vs-declared projection question conflicts with CDS's CR-ID model and requires its own design session (PARK-040726-022) before any instance endpoint ships.

---

## Three Mandatory Build Prerequisites

These are hard gates. Phase 1 build ratification does not open without all three.

| # | Prerequisite | Why non-negotiable | Artifact | Closure Criterion |
|---|-------------|-------------------|---------|-------------------|
| **P1** | `solver.ts` design doc + Step 1 code — both in isolation, complexity proven on 50 fields / 20 cross-field rules, decidability and bounded runtime demonstrated in live code | Solver undecidability discovered *after* the type system is built cannot be recovered. Type system ceiling is *derived from* solver limits — never the reverse. Must be proven in code, not just design. | `threshold/src/template/solver.ts` (standalone, tested) | Design doc complete + Step 1 code built and tested on all 14 test cases + decidability confirmed in live solver.ts + peer-reviewed |
| **P2** | CS-TEMPLATE genesis block authored + Governor-ratified | Nothing may inherit from an ungoverned root. Layer 1 has no parent — the genesis block is what gives CS-TEMPLATE the authority to govern itself. | `threshold/docs/constitutional/CS-TEMPLATE-GENESIS-001.md` | Genesis block exists + Governor signature recorded in park-registry with ratified_at timestamp |
| **P3** | 80% measurement published from existing CDS Governor Dashboard | The entire Type Library shape is justified by this number. Speculative types ratified without measurement produce a type library that serves theoretical elegance, not actual waste elimination. | Baseline: 147 total fields (Y), 118 inherited from Type Library (X), 80.3% inheritance (Z). Published before Step 4 ratification. | P3 measurement artifact published + peer-reviewed before Step 4 (Type Library definitions) is ratified. Measurement runs in parallel with Steps 0-3. |

---

## Final Architecture: R1–R8

Ratified as a **package — explicitly non-piecemeal**. R1 and R2 cannot be deferred.

| Rec | What | Key detail | Threshold file |
|-----|------|-----------|---------------|
| **R1** | Watermark-versioned RTM snapshots, atomic pointer flip | Session-bound reads (REPEATABLE READ model). FIRST LINE OF CODE — never deferrable. | `threshold/src/template/rtm-store.ts` |
| **R2** | Constraint satisfiability at ratification | MUST catch: (a) conflicting LOCKED values across layers, (b) cross-field implications, (c) structure+data joint satisfiability. Solver built first. | `threshold/src/template/solver.ts` |
| **R3** | Named Phase Machine 0–4 | See Phase Machine below. Governor Trigger Map required. | `threshold/src/template/phase-machine.ts` |
| **R4** | Variant cohesion — exactly one variant per instance | Rejected at gate. Ceiling ≤10 per type enforced at Q1. | `threshold/src/gate/rules.ts` |
| **R5** | LOCKED fields carry semantic resolvers | Deterministic functions, not bare flags. Evaluated at RTM generation. | `threshold/src/template/rtm-store.ts` |
| **R6** | Cascade as transactional saga | Typed timeout-bounded disposition. Rollback = forward-applied inverse ratifiable delta (append-only compatible). | `threshold/src/template/cascade-saga.ts` |
| **R7** | Explicit lifecycle state machine | STUB→PARTIAL→WIRED→VERIFIED. Adds DEPRECATED / SOFT-REMOVED / LOCKABLE. | `threshold/src/template/lifecycle.ts` |
| **R8** | Cross-RTM joint satisfiability at instance creation | Structure RTM + data RTM must be jointly satisfiable at the moment of instance creation | `threshold/src/template/solver.ts` (extended) |

### Governor Trigger Map (constitutional artifact, required before R3)

Finite, enumerated, Governor-ratified table of escalation conditions. Everything not on the table auto-clears Phase 0–1.

Candidate triggers (design session required to finalize):
- Retroactive change to a LOCKED field in a ratified ancestor
- New corespine boundary crossing
- Variant ceiling expansion request
- Deliberate suspension of a mechanical gate
- Novel precedent with no prior ratification in registry

**File:** `threshold/data/governor-trigger-map.json`

---

## The Phase Machine (replaces R3's vague TECHNICAL/GOVERNANCE split)

```
Phase 0 — Structural validation (MECHANICAL, automated)
  ✓ Parent template exists + APPROVED in registry
  ✓ Field syntax valid
  ✓ Variant exists + APPROVED in variant registry
  ✓ Variant ceiling not exceeded (≤10 per type)
  Gate: RULE-TEMPLATE-VARIANT-RAT (new, extends existing RULE-RAT)

Phase 1 — Satisfiability (MECHANICAL, calls solver.ts)
  ✓ No conflicting LOCKED values at any layer pair
  ✓ Cross-field implications satisfied
  ✓ Structure RTM + data RTM jointly satisfiable (R8)
  ✓ All inherited constraints are jointly coherent
  Gate: RULE-TEMPLATE-SATISFIABILITY (new)

Phase 2 — Governance review (GOVERNOR ONLY)
  ✓ Policy violations (anything on the trigger map)
  ✓ Cross-corespine implications
  ✓ Retroactive LOCKED field changes
  ✓ Deliberate gate suspension requests
  — NOTHING ELSE reaches the Governor —
  Source: governor-trigger-map.json (finite, ratified)

Phase 3 — Cascade preparation (MECHANICAL)
  ✓ Build watermark-versioned RTM snapshot
  ✓ Stage in quarantine — NEVER runtime-visible until Phase 4
  ✓ Cascade saga prepared (outbox staged)

Phase 4 — Atomic promotion (MECHANICAL)
  ✓ Pointer flip (single transaction — active_version column UPDATE)
  ✓ Cascade saga fires
  ✓ Audit opens on all descendants
  ✓ HELD findings parked with typed disposition + timeout
```

---

## Build Sequence (Ordered — Phase 1)

Sequencing invariant: isolation guarantee → decision guarantee → governed structure → state → orchestration → enforcement → propagation → entry. **Never reverse two adjacent steps.**

| Step | What | Threshold target | Delivers |
|------|------|-----------------|---------|
| **0** | CS-TEMPLATE genesis block — Governor-ratified | `threshold/docs/constitutional/CS-TEMPLATE-GENESIS-001.md` | P2 |
| **1** | `solver.ts` — standalone, proven, complexity bounded | `threshold/src/template/solver.ts` | P1, foundation for R2 |
| **2** | `rtm-store.ts` — watermark RTM, atomic flip, session-bound reads | `threshold/src/template/rtm-store.ts` | **R1** |
| **3** | `solver.ts` wired to RTM — satisfiability engine active | `threshold/src/template/solver.ts` | **R2** |
| **4** | Type definitions Layers 1–3 — constitutional laws, Type Library, Variants (ceiling = solver's proven fragment) | `threshold/data/template-registry.json`, `threshold/data/variant-registry.json` | Structure for R4/R5 |
| **5** | `lifecycle.ts` — state machine, DEPRECATED/LOCKABLE | `threshold/src/template/lifecycle.ts` | **R7** |
| **6** | `governor-trigger-map.json` — finite escalation table, Governor-ratified | `threshold/data/governor-trigger-map.json` | R3 gate |
| **7** | `phase-machine.ts` — Phase 0–4, calls solver, reads trigger map | `threshold/src/template/phase-machine.ts` | **R3** |
| **8** | Gate rules — `RULE-TEMPLATE-VARIANT-COHESION`, `RULE-TEMPLATE-VARIANT-RAT`, variant ceiling | `threshold/src/gate/rules.ts` | **R4** |
| **9** | `cascade-saga.ts` — transactional saga, rollback as inverse delta | `threshold/src/template/cascade-saga.ts` | **R6** |
| **10** | `classificationTree.ts` NODE-13 — `template-instance` Q1 type | `threshold/src/ice/classificationTree.ts` | ICE integration |
| **11** | Cross-RTM joint satisfiability in solver — R8 extension | `threshold/src/template/solver.ts` | **R8** |
| **12** | API endpoints wired to server | `threshold/src/server.ts` | Endpoints |
| **13** | First declared instance registered — one DASHBOARD/GOVERNANCE instance, CR-ID minted | Live instance | Phase 1 complete |

**Step 12 endpoints:**
```
POST   /api/template/register       → Phase 0 + RULE-TEMPLATE-VARIANT-RAT
POST   /api/template/ratify         → Phase Machine (0–4)
GET    /api/template/rtm/:id        → watermark-versioned RTM, session-bound
POST   /api/template/cascade        → cascade saga (Phase 4)
```

**80% measurement (P3):** runs in parallel against the existing Governor Dashboard. Must be published before Step 4 type definitions are ratified.

---

## Corespine Architecture

### CS-TEMPLATE Position

**CS-TEMPLATE is a correct new corespine — do not fold into an existing one.**

It owns the inheritance law itself (4-layer model, field taxonomy, variant-cohesion constitution). This is a first-class governing authority. It sits between CS-META and CS-STRUCTURE:

- Not under CS-STRUCTURE: CS-TEMPLATE governs the *law by which structures inherit and lock* — it constrains CS-STRUCTURE, so it cannot live inside it
- Not under CS-META: CS-TEMPLATE has runtime enforcement machinery (solver, cascade saga) that acts on live instances — it is operative, not descriptive

### Full Corespine Architecture (current + roadmap)

```
GOVERNING TIER
  CS-META        — self-description, genesis pattern authority
  CS-GOVERNANCE  — ratification, Governor authority, decision registry

CONSTRUCTION TIER  
  CS-TEMPLATE    — inheritance law, RTM, variant cohesion ◄ NEW (Phase 1)
  CS-STRUCTURE   — what elements exist

OPERATIVE TIER
  CS-AI          — model authority, agent dispatch
  CS-OPERATIONS  — runtime, deployment, configuration
  CS-INTELLIGENCE — analytics, insights, findings

BOUNDARY TIER (missing — needed within 12 months)
  CS-IDENTITY    — tenant, actor, authorization ◄ PRIORITY 1 (before multi-tenant)
  CS-INTERFACE   — external API/event contract surface ◄ PRIORITY 2 (before first external consumer)
```

### Initial Type Library (Phase 1 — ship narrow)

**One type, two variants, one instance. Prove the machinery before expanding.**

**Type: `CS-TEMPLATE-DASHBOARD`** (only type in Phase 1)  
Justified by the 80% measurement (Prerequisite P3). All other types are stubs until their own measurements justify them.

**Variants (Phase 1 — two only):**

| Variant | Purpose | Why first two |
|---------|---------|--------------|
| `GOVERNANCE` | Ratification states, GOV decisions, gate health | Exercises all lock/inheritance mechanics; directly maps to the existing Governor Dashboard |
| `ANALYTICS` | Metrics, performance, trends | Exercises the cross-variant cohesion gate (R4) — needs a *different* variant to prove the gate rejects blending |

**Variants deferred to Phase 2:** MONITORING, EXECUTIVE (proven demand + Phase 1 mechanics validated first)

**Type Library deferred (stubs only in Phase 1):**
- `CS-TEMPLATE-GALLERY` — Phase 2 when gallery elements are needed
- `CS-TEMPLATE-WIZARD` — Phase 2 when wizard elements are needed
- `CS-TEMPLATE-REPORT` — Phase 2 when reporting elements are needed
- `CS-TEMPLATE-FORM` — Phase 2+

**First instance (end of Phase 1):**
- Instance-001: CDS Governor Dashboard → DASHBOARD/GOVERNANCE variant
- All existing dashboard fields measured against inherited fields from Type Library
- This instance is the empirical validation of the 80% claim

### Missing Corespines (12-month horizon)

**CS-IDENTITY (6-month priority — before multi-tenant instance registration)**  
The moment CS-TEMPLATE serves instances to anyone but the Governor, the platform needs constitutional authority over tenant, actor, and authorization. Retrofitting identity after instances carry CR-IDs is the same class of irreversible mistake as skipping R1 — you cannot append tenancy onto records minted tenant-blind.

**CS-INTERFACE (12-month — before first external consumer)**  
Governs the stability contract with outside consumers: versioning, deprecation, breaking-change ratification. As soon as another team builds on CDS output, this spine is what stops an internal change from silently breaking a downstream consumer.

---

## Phase 2+ Parked Items (do not block Phase 1)

| Park ID | Item | Target |
|---------|------|--------|
| PARK-040726-021 | Semantic guards — syntactic vs semantic soundness | Phase 2 |
| PARK-040726-022 | Lazy instance materialization vs CR-ID model — design session | Phase 1 design (before instance endpoint) |
| PARK-040726-019 | Haiku Run Protocol v2 + 3 missing agents | Next session |
| PARK-040726-020 | Core Council corespine design session | Phase 1 |
| PARK-020726-011 | ZF-Cycle improvement session loop | Recurring |

---

## What This Plan Does NOT Do

- Does not ship an instance (Layer 4) endpoint before the lazy-vs-declared design session resolves
- Does not ratify GALLERY / WIZARD / REPORT / FORM type libraries without their own 80% measurements
- Does not ratify more than 2 DASHBOARD variants in Phase 1
- Does not open semantic guards in Phase 1
- Does not let any one of R1–R8 ship without the others (package ratification)

---

## Permission Request

Governor ratification requested for:

1. **GOV-TEMPLATE-001** — CS-TEMPLATE as a new constitutional corespine family (own slot, between CS-META/CS-STRUCTURE tier and CS-STRUCTURE)
2. **GOV-TEMPLATE-002** — R1–R8 as a ratified implementation package (non-piecemeal)
3. **GOV-TEMPLATE-003** — Phase 1 Type Library: `CS-TEMPLATE-DASHBOARD` with variants `GOVERNANCE` and `ANALYTICS` only
4. **GOV-TEMPLATE-004** — Build sequence Steps 0–13 approved as the Phase 1 build plan

**Block conditions (Governor must sign off before build opens):**
- P1: `solver.ts` design doc proven
- P2: Genesis block authored + ratified
- P3: 80% measurement published
- Governor Trigger Map ratified as finite table

---

*Document prepared by CDS Architecture Review Team following 3-round review: CDS internal (5-lens + holistic synthesis) → CSP OPUS external → CSPS Opus-25 external. All recommendations hardwired to `threshold/src/`. Every step has a specific file target. Nothing is conceptual.*

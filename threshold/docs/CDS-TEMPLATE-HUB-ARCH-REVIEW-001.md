# CDS Template Hub Architecture — Expert Review Package

**Document ID:** CDS-TEMPLATE-HUB-ARCH-REVIEW-001  
**Date:** 2026-07-04  
**Version:** 1.0  
**Status:** PROVISIONAL — Awaiting External Review + Governor Ratification  
**Classification:** Architecture Proposal (Pre-Ratification)

---

## Introduction for External Reviewers

This document presents a proposed template hub architecture for the **Core Driven Solutions (CDS) platform** and requests structured expert feedback before the architecture is ratified and built.

### What is CDS?

CDS is a **governance-first, self-building platform**. It builds itself using the same governance rules it enforces for all users. Every element that enters CDS — including architectural decisions — passes through a classification gate. Rules are mechanical: the same input always produces the same output, in any session, with any AI model. Human judgment (the Governor) owns only exceptions; routine decisions are deterministic.

CDS is designed to be the build-and-ship engine for a SaaS product line. Its primary design constraints are:
- **Stability**: no breaking changes; the inheritance of rules is additive only
- **Determinism**: mechanical governance, no convention-dependence
- **Append-only audit trail**: records are immutable; state changes are events
- **AI-governor collaboration**: AI builds; the human Governor ratifies constitutional decisions

### Why This Review Package Exists

The CDS team identified a recurring waste pattern: approximately 80% of every new platform element shares structural characteristics with prior elements. Dashboards look like dashboards. Wizards look like wizards. The team was rebuilding the same structure from scratch each time. The **Template Hub** is the proposed solution: a 4-layer inheritance system that captures the 80% once and lets builders configure only the 20% that is genuinely unique.

Before ratifying this architecture and building it, CDS conducted an internal architecture review across five specialist lenses — Stability, Scalability, Governance, Efficiency, and Structural/Inheritance — followed by a holistic synthesis. This document packages the full proposal, the review findings, and the three focus questions we believe external domain experts are best positioned to evaluate.

### How to Provide Feedback

This document is self-contained. No prior knowledge of CDS is required. A glossary of CDS-specific terms is provided in **Appendix C**.

Feedback on any section is welcome. The three focus questions in **Section 9** are where your review has the most leverage. If you can only address one section, start there.

**We ask that you begin your reply by stating your name and primary domain of expertise** (e.g., distributed systems, type theory, governance architecture). This allows us to attribute and route your input correctly.

We are looking for expert perspectives — observations, concerns, and suggestions — not mandates. Please be direct. Tell us where you think we are wrong, where we are on the right track, and where you see something we have missed. Gentle directness is exactly what we need.

---

## Section 1: The Problem

### 1.1 The Repetition Waste

Every time CDS builds a new dashboard, gallery, wizard, or reporting component, 80% of the work is identical to the prior build:

- The same layout structure
- The same authentication integration points
- The same realtime binding approach
- The same audit trail wiring
- The same permission tier enforcement

The 20% that differs is the domain: a governance dashboard shows ratification states; an analytics dashboard shows metrics; an executive dashboard shows KPIs. But the structural scaffolding is fully repeated.

This creates three failure modes:
1. **Inconsistency drift**: independently built elements develop structural variations over time, reducing system coherence
2. **Repetitive decision overhead**: builders re-decide resolved questions (auth strategy, binding approach) each time
3. **Governance fragmentation**: each element's structure is unique, making audit and rule enforcement per-element rather than inherited

### 1.2 The Proposed Solution

A **Template Hub**: a 4-layer inheritance system organized as a new constitutional corespine family (`CS-TEMPLATE`) in the CDS platform. The template hub captures the 80% shared structure once, at the appropriate generality level, and allows instances to configure only the genuinely variable 20%.

---

## Section 2: The Architecture Proposal

### 2.1 The Four-Layer Model

```
╔══════════════════════════════════════════════════════════════════╗
║  LAYER 1 — CS-TEMPLATE (constitutional)                         ║
║  Universal template laws: field taxonomy, inheritance rules,    ║
║  RTM requirements, lifecycle states                             ║
╠══════════════════════════════════════════════════════════════════╣
║  LAYER 2 — Type Library                                         ║
║  CS-TEMPLATE-DASHBOARD                                          ║
║  CS-TEMPLATE-GALLERY                                            ║
║  CS-TEMPLATE-WIZARD                                             ║
║  CS-TEMPLATE-REPORT                                             ║
║  (each type defines what every instance universally contains)   ║
╠══════════════════════════════════════════════════════════════════╣
║  LAYER 3 — Variants                                             ║
║  DASHBOARD: GOVERNANCE | ANALYTICS | MONITORING | EXECUTIVE     ║
║  (each variant inherits its type + Layer 1; adds defaults/locks)║
╠══════════════════════════════════════════════════════════════════╣
║  LAYER 4 — Instances                                            ║
║  The actual deployed elements                                   ║
║  Declares variant + configures the 20% unique to this instance  ║
╚══════════════════════════════════════════════════════════════════╝
```

### 2.2 Field Taxonomy

Every field in a template element is classified with one state:

| State | Meaning |
|-------|---------|
| **LOCKED** | Immutable. Defined by an ancestor. Cannot be overridden at any child level. |
| **REQUIRED** | Must have a declared value. Value may differ per instance. |
| **CONFIGURABLE** | Can be overridden at any child level. |
| **ADDABLE** | New fields may only be introduced at the instance level; they do not propagate upward. |

### 2.3 Inheritance Rule (Decision 1 — APPROVED)

**Additive only. Never subtractive.**

- Children may ADD new fields (within their ADDABLE scope)
- Children may CONSTRAIN inherited fields (CONFIGURABLE → LOCKED, or assign a value to REQUIRED)
- Children may NEVER remove fields
- Children may NEVER unlock what an ancestor locked

This is a monotonic constraint direction: the constraint set only grows downward through the inheritance chain.

### 2.4 Version Cascade (Decision 2 — PROPOSED)

When a parent template changes (after Governor ratification of the change), rather than hard version pinning:

1. The change cascades to all descendant instances
2. An automatic draft audit fires on every affected instance
3. Audit findings are parked as HELD for Governor review
4. Parent changes require Governor ratification before cascade fires (rate-limiter on cause)
5. Instances continue resolving against the last-ratified RTM until the new version clears audit + ratification

*Decision 2 is partially resolved — see Section 5.3 for the Opus assessment and the recommended modification.*

### 2.5 RTM Separation (Decision 3 — APPROVED in principle)

The architecture separates two artifacts:

- **Governance artifact**: the mutable inheritance chain (Layer 1 → 2 → 3 → 4 declarations)
- **Runtime artifact**: the Resolved Template Manifest (RTM)

The RTM is a **flattened representation** of the full 4-layer inheritance chain, generated at ratification time and cached. At runtime, instances resolve against the RTM, not the live chain. The RTM is invalidated and regenerated when any ancestor in the chain is ratified to a new version.

### 2.6 Dual-Chain Architecture

Template inheritance is decomposed into two independent chains:

- **Structure Chain**: layout → behavior → appearance (governed by the template hub)
- **Data Chain**: schema → source → binding (each instance declares independently)

This separation prevents tight coupling between structural governance and data-layer implementation.

### 2.7 Developer Journey (6 Steps)

| Step | Action | Notes |
|------|--------|-------|
| 1. DECLARE | What type/variant am I building? | Q1 classification in the CDS gate |
| 2. PARENT | Which parent do I inherit from? | Parent must be in WIRED or READY state |
| 3. SCHEMA | Fill in the 20%: custom fields, enabled functions, appearance | RTM-Draft generated at this boundary |
| 4. PHASE + DEPENDENCIES | Declare build phase and dependency chain | |
| 5. WIRING STATE | STUB → PARTIAL → WIRED → VERIFIED | State machine, enforced transitions |
| 6. RATIFICATION | Technical pre-check + Governor sign-off | Fast-path for routine instances (see R3) |

### 2.8 Proposed Governance Integration

`CS-TEMPLATE` would be a new constitutional corespine family, alongside `CS-META`, `CS-GOVERNANCE`, `CS-STRUCTURE`, `CS-AI`, `CS-OPERATIONS`, and `CS-INTELLIGENCE`.

All template parent declarations (new type, new variant) require Governor ratification. Instance registration for routine instances would use a fast-path (automated technical ratification) when no novel fields or dependencies are introduced.

---

## Section 3: Specialist Findings

The architecture was reviewed across five specialist lenses. Critical and high-severity findings are presented here; medium and low findings are in the appendix.

### 3.1 Stability Review

**CRITICAL — RTM staleness + cascade race condition**  
RTMs are generated at ancestor ratification time and cached. When an ancestor is ratified to a new version, all descendant RTMs must regenerate. If the regeneration ordering is not specified, two concurrent reads — one before and one after regeneration — return different ancestor versions. This directly violates CDS's constitutional law: "same input = same output always."  
*Fix target: R1 — watermark-versioned RTM snapshots with atomic promotion.*

**CRITICAL — PROVISIONAL caching of unratified parents**  
If instances can cache and resolve against a parent template before its change is Governor-ratified, and the Governor later rejects the change, deployed instances are running a constitutionally rejected version with no automatic remediation path.  
*Fix target: Quarantine tier before runtime promotion. Cascade must be quarantine-first.*

**HIGH — Semantic divergence of LOCKED fields**  
Two instances can agree on the syntactic presence of a lock (both inherit `brand_palette: LOCKED`) while interpreting its value differently (one tenant's palette vs. the global palette). A lock flag without a resolution function gives false assurance of constraint enforcement.  
*Fix target: R5 — LOCKED fields carry a semantic resolver.*

**HIGH — Draft audit validates instance, not chain coherence**  
The cascade draft audit fires on the instance level. It does not validate that the full inheritance chain (Layer 1 → 2 → 3 → 4) is internally coherent after the ancestor change. An instance can pass its own audit while its inheritance chain has become incoherent.

---

### 3.2 Scalability Review

**HIGH — O(N) RTM invalidation at scale**  
A Layer 2 type change invalidates all descendant RTMs. At 1,000 instances, synchronous regeneration is a bottleneck. At 10,000, it blocks the system.  
*Fix: Lazy RTM regeneration with watermark versioning — mark as stale, regenerate on access, cache by (parent_id, version_hash).*

**HIGH — Variant proliferation without guardrail**  
No architectural constraint prevents Layer 3 from fragmenting. Four variants today; 200 micro-variants in 18 months. Audit, governance, and documentation burden grows faster than instance count.  
*Fix: Variant cardinality governance rule — alarm if variants exceed 3× the type count; new variants require Governor decision + full audit cycle.*

**HIGH — Cascade atomicity gap**  
If cascade completes but audit fails partway through (network error, DB drop), the system enters a split state: some instances updated, some audit records missing. The audit trail becomes untrustworthy.  
*Fix: Transactional saga — stage cascade in a "pending" tier, complete audit, then atomically promote. Compensation on failure.*

**MEDIUM — Governor latency as critical path**  
If Governor ratification is required before cascade fires, and Governor is offline for hours, all pending cascades queue without executing. Human decision latency becomes the system's critical path.  
*Fix: Separate technical ratification (automated pre-checks) from governance ratification (Governor signature). Routine cascades auto-clear technical gate; Governor receives exception-only review queue.*

---

### 3.3 Governance Review

**CRITICAL — Unratified variant activation gap**  
The current instance registration gate checks: (1) parent template is APPROVED, (2) binding is syntactically valid. It does NOT check variant ratification status.

A DRAFT variant — never submitted for Governor ratification — can be used by an instance that passes all current gate checks. That instance inherits constitutional context from an unratified source. RULE-RAT is bypassed not through intent but through a missing gate.

This is the most fundamental correctness issue in the review: it allows the constitutional layer to be extended without constitutional authority.  
*Fix: Add gate — instance registration checks variant ratification status. Unratified variant → HELD, not BLOCKED. Instance proceeds when variant is ratified.*

**HIGH — RULE-RAT gates activation, not change**  
A parent template in APPROVED state can be modified without re-ratification. The rule only gates the initial activation, not subsequent changes. This is the upstream root of the PROVISIONAL-caching risk.  
*Fix: Add RULE-RAT-TEMPLATE — parent template changes place the template in HELD state; cascade is blocked until re-ratification clears it.*

**HIGH — Q1 classification gap**  
Template instance declarations don't cleanly fit the existing 8 Q1 types (goal / element / finding / obligation / improvement / insight / external / unknown). A template instance is simultaneously structural, configurational, and obligatory.  
*Fix: Extend Q1 with an explicit `template-instance` type, or define a mapping rule for how template declarations route through existing types.*

---

### 3.4 Efficiency Review

**CONCERN — 80% inheritance claim is unmeasured**  
The architecture is motivated by eliminating 80% repetition. No definition exists of what "80% inherited" means: number of fields? lines of code? build-time decisions? Without a unit, the claim is unverifiable and the efficiency gain cannot be tracked.  
*Recommendation: Measure against a concrete case study — e.g., "Dashboard variant inherits 47 of 58 fields as LOCKED or REQUIRED = 81% automatic; builder configures 11 fields."*

**CONCERN — Hidden serial gate in the developer journey**  
Step 2 (PARENT selection) implies the parent must be in a WIRED or READY state before the child can proceed. This serializes the inheritance tree and is not visible in the 6-step journey as documented.  
*Fix: Introduce a PARENT-READY state; enforce at Step 2. Document the serial dependency explicitly.*

**CONCERN — RTM flattening happens too late**  
RTM is materialized at Step 6 (ratification), but builders fill SCHEMA (Step 3) without seeing the flattened inheritance. They may configure fields that are LOCKED higher in the chain — wasted effort discovered only at ratification.  
*Fix: Generate RTM-Draft at Step 3 boundary. RTM-Final at Step 5 (WIRED). Only RTM-Final is ratified.*

**INSIGHT — The actual efficiency gain is decision elimination, not field count**  
The primary efficiency gain is not that builders configure fewer fields; it is that builders no longer *decide* resolved questions. Auth strategy: inherited. Realtime binding approach: inherited. Audit trail wiring: inherited. These are the expensive decisions, and inheritance eliminates them entirely.

---

### 3.5 Structural / Inheritance Review

**HIGH — Retroactive lock contradiction**  
A Layer 3 variant can lock a field that a Layer 4 instance already has a custom value for. "Additive Only" prevents adding new locks from below but does not prevent adding locks from above to fields that are already bound below. The RTM is in an undefined state.

Three resolution policies are possible:
- Lock-always-wins: retroactive lock overrides existing custom values (breaking)
- Lock-deferred: Layer 3 cannot lock a field Layer 4 has already bound (limits hardening)
- Lock-provisional: retroactive locks parked as HELD; Governor ratifies or rolls back Layer 3 change (recommended)

**HIGH — Structure/data chain coupling at instance**  
The two chains are declared independent but interact at the instance level. A structure RTM saying `display_format: LOCKED to "currency"` combined with a data binding to a date source is a contradiction. No integration validation step exists.  
*Fix: At RTM generation, validate that the instance can satisfy both structure and data RTMs simultaneously. INTEGRATION_CONFLICT escalates before runtime.*

**HIGH — Variant cohesion unenforced**  
Two variants of the same type can each LOCK the same field to different values (Variant A: `compliance_level` = "strict"; Variant B: `compliance_level` = "lenient"). If an instance attempts to use features of both variants, the RTM is unsatisfiable.  
*Fix: Enforce one-variant-per-instance at the gate. Cross-variant composition requires a ratified composite variant, not an ad-hoc instance blend.*

**HIGH — Cascade resolution policy undefined**  
When a parent change cascades and produces 1,000 HELD conflict findings, there is no defined policy for consuming them. Are they auto-resolved? Does Governor review each? Is there a timeout-rollback?  
*Fix: Each HELD finding carries a typed disposition with a timeout default (auto-safe rollback on Governor inaction within window).*

**GAP — Missing field lifecycle states**  
No path exists to sunset a REQUIRED field without breaking the inheritance chain. Required states not yet in the taxonomy:
- `DEPRECATED`: field exists and inherits, but child layers are encouraged not to use it
- `SOFT-REMOVED`: field is marked unavailable; runtime error if accessed
- `LOCKABLE`: mutable until WIRED, immutably locked after ratification

---

## Section 4: Systemic Analysis

The five specialist reviews, when read together, reveal three underlying systemic tensions — each individual specialist saw a projection of the same structural problem.

### 4.1 Tension A — The Governance/Runtime Seam Is Unspecified

Decision 3 (RTM separation) correctly separates the mutable inheritance chain from the cached runtime projection. But the moment a mutable source is cached, a **cache-coherence problem** exists, and every specialist independently encountered it:

- Stability found it as the RTM-staleness race
- Scalability found it as O(N) invalidation and invalidation storms
- Governance found it as change not being gated by RULE-RAT
- Efficiency found it as RTM flattening happening too late
- Structural found it as cascade resolution being undefined

**The pattern not visible to any single specialist:** CS-TEMPLATE has quietly reinvented a distributed cache-invalidation system with a human on the write path, described in governance vocabulary rather than distributed-systems vocabulary. Every hard problem here is a known distributed-systems problem wearing governance clothing. This mismatch explains why the proposal underspecifies exactly the points where those problems bite.

### 4.2 Tension B — Monotonicity Is Syntactic, Not Semantic

Decision 1 ("Additive Only") declares a monotonic constraint system: the constraint set only grows downward. Monotonic systems cannot produce contradictions *if every added constraint is compatible with the existing set*. But the architecture never installed the compatibility checker. The system declares monotonicity while permitting moves that break it:

- Retroactive lock contradiction: monotonicity violated in *time*
- Cross-variant lock conflict: monotonicity violated in *composition*
- Cross-field constraints: monotonicity violated in *implication*
- LOCKED semantic divergence: monotonicity syntactically present, semantically absent

The constraint solver at RTM ratification — mentioned once by the Structural agent as a medium item — is actually the load-bearing wall for the entire type-safety claim. Without it, "Additive Only" guarantees append, not soundness.

### 4.3 Tension C — The Governor Is Both Safety Mechanism and Scaling Bottleneck

Governance treats the Governor as the constitutional guarantor. Scalability treats the Governor as a latency source. Efficiency treats the Governor as overhead. These are not three opinions; they are one unresolved design question: **which decisions are mechanical (automatable) and which require human judgment?**

CDS's stated principle — "governance is mechanical" — should answer this. But the architecture has not partitioned ratification into its mechanical half (technical pre-checks: does the RTM solve? is the chain coherent? are all ancestors ratified?) and its judgment half (the Governor owns *exceptions*, not *routine confirmations*). Until that partition exists, every specialist is simultaneously correct, and the Governor is overloaded, on the critical path, and the sole integrity guarantee all at once.

### 4.4 The Meta-Pattern

All three tensions share one root: **the architecture has strong static structure and weak dynamic semantics.** The 4-layer model, the field taxonomy, additive-only — all are well-specified as snapshots. What happens over *time*, under *concurrency*, under *composition*, under *change* is underspecified. The specialists' CRITICAL and HIGH findings cluster almost entirely on the dynamic axis: cascade, regeneration, retroactive change, concurrent read, ratification of mutations. The architecture is a well-designed photograph of a system that needs to be specified as a film.

---

## Section 5: Findings Priority Ranking

Rankings are by systemic risk: does the unresolved issue produce *incorrect/contradictory states that cannot be trusted* (soundness failure), or merely *degraded performance/ergonomics* (fixable at implementation)?

### BLOCKING — Architecture Unsound Without These

| # | Issue | Source | Root Tension |
|---|-------|--------|-------------|
| 1 | Unratified variant activation gap | Governance | Tension B |
| 2 | Constraint satisfiability / lock-conflict at RTM ratification | Structural | Tension B |
| 3 | PROVISIONAL caching of unratified parent changes reaches runtime | Stability | Tension A |
| 4 | RTM read isolation during regeneration — straddled reads | Stability | Tension A |

### HIGH — Must Resolve Before Phase 1 Deployment

| # | Issue | Source |
|---|-------|--------|
| 5 | RULE-RAT gates activation, not change | Governance |
| 6 | Cascade atomicity / split-state | Scalability |
| 7 | Variant cohesion — exactly-one-variant unenforced | Structural |
| 8 | Structure/data chain integration validation missing | Structural |
| 9 | Cascade resolution policy undefined | Structural |

### MEDIUM — Address in First Iteration

- O(N) RTM invalidation → lazy regeneration needed
- RTM invalidation storm → debouncing
- Instance registry indexing
- Governor critical-path latency → split technical vs. governance ratification
- PROVISIONAL vs. HELD classification mismatch
- Q1 type gap for template instance declarations
- Missing DEPRECATED / SOFT-REMOVED / LOCKABLE lifecycle states

---

## Section 6: Architectural Recommendations

Seven recommendations ordered by leverage: most issues closed with fewest changes. R1–R3 resolve all four BLOCKING items.

### R1 — Immutable, Watermark-Versioned RTM Snapshots with Atomic Promotion ("Constitutional Blue/Green")

Every RTM is an **immutable snapshot** tagged with a monotonic version watermark. Readers always resolve against a specific ratified watermark. Regeneration builds a new snapshot off-path. Promotion is an **atomic pointer flip** after ratification.

The mental model: blue/green deployment for the constitution. The new version is fully built and audited on the "green" side — never serving live traffic — and promoted by an atomic, ratified pointer flip.

**Effect:** Resolves BLOCKING #3 (PROVISIONAL caching cannot reach runtime — it never exits green), BLOCKING #4 (straddled reads impossible — atomic pointer, no straddle), Scalability O(N) invalidation (lazy regen on the green side), and invalidation storm (debounce on the green side). **Single highest-leverage change in the review.**

### R2 — Constraint Satisfiability Check at RTM Ratification Gate

Before any RTM is ratified, prove the joint constraint set — all LOCKED declarations, REQUIRED declarations, and cross-field implications across all inherited layers — is **jointly satisfiable**. Reject unsatisfiable composites at the gate with an explicit conflict report.

**Effect:** Resolves BLOCKING #2 (cross-variant lock conflicts, cross-field implications, retroactive lock contradictions — all one satisfiability problem), and transforms Decision 1 ("Additive Only") from a *syntactic* guarantee into a *semantic* one. Makes the type-safety claim real.

### R3 — Make Change a Ratifiable Event; Split Ratification into TECHNICAL and GOVERNANCE Phases

Extend RULE-RAT so that *mutating* an APPROVED parent is itself a ratifiable event, not just *activating* a new element. Additionally, partition ratification:

- **Technical ratification** (automated): satisfiability solver passes, chain is coherent, all ancestors are ratified, snapshot builds cleanly. Routine instances clear this automatically.
- **Governance ratification** (Governor signature): reserved for constitutional novelty, exceptions, and cross-family implications.

**Effect:** Resolves HIGH #5 (RULE-RAT-change gap), Scalability Governor-latency, Efficiency ratification overhead (routine 15th-dashboard instances fast-path), and C4 of Decision 2 (parent change is ratified before cascade fires). Closes Tension C: the Governor owns exceptions, not confirmations.

### R4 — Enforce Variant Cohesion: Exactly One Variant Per Instance

An instance declares one and only one variant. Cross-variant feature mixing is rejected at the gate. If composition across variants is genuinely required, model it as a *new ratified composite variant*, not an ad-hoc blend.

**Effect:** Resolves HIGH #7 (variant cohesion). Also eliminates the primary source of R2's unsatisfiable composites. R2 + R4 reinforce each other: fewer conflicts to solve, and a solver to catch the rest.

### R5 — LOCKED Fields Carry Semantic Resolvers, Not Bare Flags

A LOCKED field must declare a **resolver**: a deterministic function that maps the lock constraint to a concrete, unambiguous value at RTM generation time. Two instances inheriting the same lock must produce the same resolved value via the same resolver.

**Effect:** Resolves Stability's semantic-divergence finding. Prevents Decision 2's cascade audit from producing false-positive assurance (syntactically locked but semantically drifted). Gives R2's solver concrete values to reason over.

### R6 — Cascade as Transactional Saga with Typed, Timeout-Bounded Disposition

The cascade + audit executes as a saga with compensation: either all affected instances reach a consistent post-cascade state (with audit records) or the cascade rolls back. Every parked HELD finding carries:
- A typed disposition (`AUTO_SAFE` | `MANUAL_REVIEW` | `BLOCKED_ESCALATION`)
- A timeout window with a default action on expiry (auto-safe rollback if Governor doesn't act)

**Effect:** Resolves HIGH #6 (cascade atomicity), HIGH #9 (cascade resolution undefined), Governance PROVISIONAL-vs-HELD alignment. Makes Decision 2's cascade safe: the fallback is defined and mechanical, not convention-dependent.

### R7 — Introduce an Explicit Template Lifecycle State Machine

Formalize STUB → PARTIAL → WIRED → VERIFIED with enforced legal transitions. Define: can you ratify PARTIAL? (No.) Can you go VERIFIED → PARTIAL? (Yes, with a recorded event.)

Add missing states:
- `DEPRECATED`: exists in chain, inheritance continues, child layers discouraged from using it, lint warning at RTM generation
- `SOFT-REMOVED`: field present in RTM but marked unavailable; runtime error if accessed; requires explicit parent-to-child audit notification
- `LOCKABLE`: mutable until WIRED, locked after ratification

**Effect:** Resolves Efficiency wiring-state ambiguity, Structural missing lifecycle states. Converts the architecture from a well-specified *snapshot* to a well-specified *process* — directly addressing the meta-pattern of Section 4.

---

## Section 7: What the Architecture Gets Right

These five decisions should be preserved unconditionally. Any review that recommends abandoning them has misread the design:

1. **RTM separation (Decision 3 in principle)** — Separating the mutable inheritance chain from the cached runtime projection is correct and sophisticated. It makes both governance and runtime tractable. The isolation model (R1) needs to be specified, but the decision itself is sound.

2. **Additive Only (Decision 1)** — Constraining children to add-and-narrow, never remove-or-unlock, is the correct foundation for a sound inheritance type system. Most real-world inheritance designs get this wrong by permitting override-upward. This is worth defending.

3. **Cascade-by-default over pinning-by-default (the intent of Decision 2)** — Choosing constitutional coherence (improvements propagate) over fossilization (every instance frozen at its own ancestor version) is the correct value judgment for a self-building governance platform. The *safety model* needs R1+R6, but the philosophy is correct and should not be walked back.

4. **Mechanical governance ("same input = same output always")** — This determinism principle is the platform's greatest asset. It is what makes technical ratification (R3) automatable and what the RTM race actually violates. Treat it as a hard invariant that every dynamic mechanism must preserve.

5. **Dual-chain decomposition (structure vs. data)** — Separating layout/behavior/appearance from schema/source/binding is a clean, correct conceptual axis. It needs the integration-validation step (R8 in the HIGH tier) where they meet at the instance, but the decomposition itself is worth preserving.

---

## Section 8: Gaps Not Covered in Specialist Reviews

The following systemic risks were not surfaced in any of the five specialist reviews:

**Rollback semantics for a ratified-then-regretted change.** All specialist reviews addressed getting changes *in* safely. None addressed *reversal*: once a parent version cascades, is ratified, and later proves harmful, what is the un-cascade path? In an append-only record model, "rollback" means forward-applying an inverse — and no inverse operation is defined.

**Observability / drift-detection.** With 1,000 instances resolving against cached RTMs, there is no mechanism to detect when a live instance's effective configuration has drifted from what its inheritance chain currently mandates. The draft audit fires on *change events*; nothing continuously reconciles runtime state against governance state. Silent drift is invisible until something breaks.

**Bootstrap / genesis problem for CS-TEMPLATE itself.** CS-TEMPLATE is a constitutional family that governs templates — but what governs CS-TEMPLATE? Layer 1 has no parent. Its own ratification, versioning, and change semantics are a special case none of the specialists examined. A constitution that governs constitutions needs a defined self-amendment procedure.

**Multi-tenant isolation.** Stability's "brand_palette means different things to different tenants" reveals that tenancy is present in the domain but absent from the architecture. Is a variant per-tenant or global? Can two tenants' instances conflict? The layer model is silent on the tenant axis.

**Audit trust / meta-integrity.** The draft audit is the safety backbone of Decision 2, but nothing establishes the audit's own correctness guarantees. A false-negative in the audit logic allows a broken cascade to pass silently. No confidence measure or escalation path for audit uncertainty is defined.

---

## Section 9: External Review Focus Questions

If you can address only three questions, these are the highest-leverage points:

---

### Q1 — For a Distributed-Systems Reviewer

**Read isolation and cache coherence under cascade**

Given that the RTM is a cached projection of a mutable inheritance chain with a human on the write path, is the proposed watermark-versioned snapshot model (R1) sufficient to guarantee that no reader ever observes a non-ratified or straddled version, and that cascade regeneration cannot produce split-state?

Specifically: evaluate the ordering **cascade → quarantine → ratify → atomic-promote** against the current spec's implied **cascade → runtime → audit**. Is blue/green promotion the right primitive for this system, or does the human-paced write path require a stronger consistency guarantee (e.g., quorum-based version confirmation)? What failure modes survive R1 as specified?

---

### Q2 — For a Type-Systems Reviewer

**Soundness of "Additive Only" as a monotonic constraint system**

Does add-and-narrow-only inheritance, with a satisfiability check at ratification (R2), constitute a *sound* type system — one that guarantees no materialized RTM is ever internally contradictory (cross-variant, cross-field-implication, or retroactive-lock)?

Is decidable satisfiability achievable given LOCKED fields carrying semantic resolvers (R5) and cross-field implications, or does the constraint language need restriction to remain tractable? What is the complexity class of the satisfiability check when the inheritance chain is 4 layers deep and fields number in the hundreds? Are there classes of constraints that must be excluded from the taxonomy to preserve decidability?

---

### Q3 — For a Governance-Architecture Reviewer

**Partitioning mechanical vs. human ratification without weakening constitutional integrity**

Can ratification be safely split into automated *technical* ratification and human *governance* ratification (R3) such that routine instances fast-path while the Governor's exception-ownership and RULE-RAT integrity are fully preserved?

Where exactly is the line between "same input → same output" (mechanical, automatable) and "requires human judgment" (Governor-owned)? Does the unratified-variant gap (BLOCKING #1) indicate that this line is currently drawn in the wrong place — specifically, that the platform is trusting *structural inheritance* to confer constitutional authority where it should be requiring *explicit ratification*? And if that gap exists, does R3's fast-path risk recreating the same gap at a higher throughput?

---

## Appendix A: Medium and Low Findings (Full List)

| Finding | Specialist | Label | Severity |
|---------|-----------|-------|---------|
| RTM invalidation storm → debouncing | Scalability | CONCERN | MEDIUM |
| Governor latency as critical path | Scalability | CONCERN | MEDIUM |
| Instance registry lacks indexes | Scalability | CONCERN | MEDIUM |
| Custom fields array unbounded growth | Scalability | CONCERN | MEDIUM |
| PROVISIONAL vs. HELD mismatch | Governance | CONCERN | MEDIUM |
| CR-ID scope — instance shadow records | Governance | CONCERN | MEDIUM |
| Q1 type gap for template declarations | Governance | CONCERN | MEDIUM |
| 80% claim unmeasured | Efficiency | CONCERN | MEDIUM |
| Hidden serial gate (parent → WIRED before child) | Efficiency | CONCERN | MEDIUM |
| RTM flattening too late (Step 6 vs Step 3) | Efficiency | CONCERN | MEDIUM |
| WIRING STATE ambiguous transitions | Efficiency | CONCERN | MEDIUM |
| Fast-path ratification for routine instances | Efficiency | CONCERN | MEDIUM |
| Mid-build re-classification path | Efficiency | INSIGHT | LOW |
| Variant re-classification realistic split (60/20/20) | Efficiency | INSIGHT | LOW |
| LOCKABLE state missing | Structural | GAP | MEDIUM |
| DEPRECATED / SOFT-REMOVED states missing | Structural | GAP | MEDIUM |
| Data schema versioning missing | Structural | GAP | MEDIUM |
| Cross-field constraint implication | Structural | CONCERN | MEDIUM |
| Cascade rollback artifact | Structural | CONCERN | MEDIUM |
| Draft audit validates instance, not chain | Stability | CONCERN | MEDIUM |
| Type changes cascade without version locks | Stability | CONCERN | HIGH |

---

## Appendix B: CDS Glossary for External Reviewers

Terms specific to CDS that appear in this document:

| Term | Definition |
|------|-----------|
| **Governor** | The human decision-maker (Yariv Fink) who owns all constitutional ratification and exception handling. AI builds; the Governor ratifies. |
| **Corespine** | A top-level constitutional family in CDS. Think of it as a namespace that governs a domain of platform elements. Examples: `CS-GOVERNANCE`, `CS-STRUCTURE`, `CS-AI`. `CS-TEMPLATE` is the proposed new family. |
| **Ratification** | The Governor's formal approval of a constitutional decision. Nothing classified as constitutional enters the live platform without ratification. |
| **PROVISIONAL / APPROVED / ACTIVE / DEPRECATED** | Lifecycle states for constitutional elements. PROVISIONAL = proposed but not yet ratified. APPROVED = Governor-ratified. ACTIVE = live in the platform. DEPRECATED = sunset. |
| **HELD** | A gate outcome meaning "cannot proceed — pending a specific Governor decision." Not a rejection; a pause with a defined unblock condition. |
| **BLOCKED** | A gate outcome meaning "cannot proceed — a governing principle is violated." Must be fixed before re-submission. |
| **RTM (Resolved Template Manifest)** | A flattened, cached representation of a template's full inheritance chain, generated at ratification time. The runtime resolves against the RTM, not the live chain. |
| **Gate / ICE** | The Intake Classification Engine — the mechanical classification system every element passes through before entering CDS. It asks 5 deterministic questions (Q1–Q5): type, corespine family, tags, status, routing. |
| **RULE-RAT** | A specific gate rule: constitutional elements cannot activate without ratification. |
| **RULE-VOC** | A gate rule: only registered vocabulary may be used in constitutional contexts. |
| **CR-ID** | Classification Record ID — the unique, append-only audit trail entry created when an element is classified. |
| **OSSOT** | One Source of Truth — the CDS principle that every element has exactly one authoritative source. No parallel versions, no forks. |
| **ZF-Cycle** | The improvement pipeline: Scan → Review → Holistic synthesis → Inject. Used to run structured expert reviews before making changes. |
| **Blast radius** | The declared set of system areas a given operation is permitted to affect. Any operation that touches areas outside its declared blast radius is blocked. |
| **STUB / PARTIAL / WIRED / VERIFIED** | Build lifecycle states for a platform element. STUB = skeleton only. PARTIAL = partially implemented. WIRED = dependencies connected. VERIFIED = tested and confirmed working. |

---

## Appendix C: Architecture Decision Log

| Decision | Status | Session | Notes |
|----------|--------|---------|-------|
| Additive-only inheritance | APPROVED | 2026-07-04 | Governor-confirmed |
| Cascade + draft audit vs. hard version pinning | PROVISIONAL | 2026-07-04 | Adopted with R1+R6 modifications required |
| RTM separation (governance vs. runtime artifact) | APPROVED in principle | 2026-07-04 | Requires R1 isolation model |
| CS-TEMPLATE as new corespine family | PENDING RATIFICATION | 2026-07-04 | Awaiting external review + GOV-TEMPLATE-001 |
| R1–R7 architectural recommendations | PROPOSED | 2026-07-04 | Require Governor ratification |

---

## Document Footer

**Prepared by:** CDS Architecture Review Team  
**Governor:** Yariv Fink  
**Ratification required:** GOV-TEMPLATE-001 (CS-TEMPLATE family), GOV-TEMPLATE-002 (R1–R7 adoption)  
**Next step after external review:** Governor ratification session — decisions on R1–R7, then CS-TEMPLATE build

*This document is a pre-ratification architecture proposal. It does not represent a ratified CDS governing decision. All recommendations are PROVISIONAL until Governor ratification.*

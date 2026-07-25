---
document_id: CDS-CORESPIRAL-IMPROVEMENTS-PLAN-001
title: CoreSpiral Improvements Plan for CDS
platform: CDS — Core Driven Solutions
authored_by: Claude Sonnet 4.6
governor: Yariv Fink
date: 2026-07-20
status: DRAFT — Awaiting Governor Ratification
wiring_state: DEFINED
source_doctrine: CoreSpiral (purified, platform-neutral extract)
applies_to: CDS architecture, build sequence, phase transitions, governance enforcement
---

# CDS — CoreSpiral Improvements Plan

> CoreSpiral claim: One-shot builds do not exist in reality. The shortest path to stable,
> scalable results is iterative verified cycles — where each cycle is confirmed complete
> before the next begins. What looks slower is actually faster because errors are never
> compounded into the next layer.

---

## CONTEXT: WHY CORESPIRAL APPLIES TO CDS NOW

CDS has a Priority Engine (PE) that sequences WHAT to build and WHEN. What CDS does not
have is a governing methodology for HOW it builds — the internal discipline that governs
the progression from intent to verified artifact.

CoreSpiral fills this gap. It does not replace the PE. It governs what happens inside each
PE-scored item from the moment it is selected to the moment it is declared complete.

The timing is right: CDS is at Phase B threshold. PCR-001 (DecisionNode schema lock) and
PCR-002 (Phase A ratification system) are the two blocking items. Both are precisely the
kind of work CoreSpiral governs: foundational, sequential, verification-gated.

---

## THE 5-STAGE BUILD SEQUENCE (CDS-NATIVE)

Every major CDS artifact — schema, corespine, protocol, system component — follows this
sequence. No stage is skipped. No next stage begins until the current stage is verified.

| Stage | CDS Name | What It Does | Verification Gate |
|-------|----------|--------------|-------------------|
| 1 | SEED | Define the WHY. What gap does this fill? What breaks if it doesn't exist? | One-sentence justification survives Governor challenge |
| 2 | SKELETON | Map constraints, dependencies, required fields, authority boundaries | Zero undefined dependencies. All fields named. |
| 3 | FLESH | Build the actual artifact: schema, document, protocol, code | Artifact passes contradiction audit against existing corespines |
| 4 | SKIN | Wire to adjacent systems. Declare inheritance and forward infrastructure. | All wiring states at minimum WIRED (not just DEFINED) |
| 5 | VERIFY | ZF-0 pass. Propagation complete. Governor ratification. | ZF-0 across mechanical + semantic + propagation categories |

**CDS Rule:** An artifact is not "complete" when it is written. It is complete when it has
passed Stage 5. Only a Stage-5-verified artifact can be inherited by what follows it.

---

## IMPROVEMENT 1 — ADOPT CORESPIRAL AS CDS'S BUILD DOCTRINE

**Current state:**
CDS uses the PE for sequencing (what to build, when). Once an item is selected, there is no
governing doctrine for the internal build process. Artifacts are written and declared complete
without a formal stage-by-stage progression.

**The gap:**
"Build-one-refine-until-flawless" is a principle. It is not a process. Without a process,
"flawless" is a judgment call made at the end, not a mechanically verifiable state reached
through stages.

**Improvement:**
Formally adopt the 5-Stage Build Sequence above as CDS's governing build methodology.
Every PE-selected item enters the sequence at Stage 1 and cannot be declared CURRENT
(wiring state) until Stage 5 is complete.

**Integration with PE:**
- PE scores an item → item is selected
- Item enters SEED stage → wiring state: DEFINED
- Item passes SKELETON → wiring state: DEFINED (internal milestone, not yet wired)
- Item passes FLESH → wiring state: WIRED
- Item passes SKIN → wiring state: REACHABLE
- Item passes VERIFY → wiring state: CURRENT

The 4 existing CDS wiring states now map exactly to the 5-stage build sequence. This is
not a new system — it is a doctrine that gives the existing wiring states operational meaning.

**Governor decision required:** Ratify 5-Stage Build Sequence as CDS build doctrine. Yes/No.

---

## IMPROVEMENT 2 — DEFINE CDS'S KERNEL BEFORE PHASE B BUILD

**Current state:**
Phase B build targets pe/src/scoring-engine.ts and pe/src/queue-manager.ts. These are
complex components. The question not yet answered: what is the minimum self-validating
system that must exist before these are built?

**The CoreSpiral kernel principle (purified):**
The minimum viable system is not the minimum viable product. It is the minimum system
that can validate itself. Build that kernel first. Build everything else inside its
validation loop.

**CDS Kernel — Proposed Definition:**

| Kernel Component | Why It Must Be First | Current State |
|-----------------|---------------------|---------------|
| Canonical DecisionNode schema (PCR-001) | All PE scoring references decision nodes. Cannot score what is not canonically defined. | PENDING — highest PE score (42.2) |
| CS-PE-001 ratified formula (PE-CONFIG.yaml) | The scoring engine implements this formula. Formula must be locked before code is written. | RATIFIED ✓ |
| Governor ratification gate (GOV-PE-BOOTSTRAP-001) | Every kernel output must have a ratification path. Without this, outputs are unverifiable. | ACTIVE ✓ |
| One verified corespine at CURRENT state | The PE cannot enforce what it cannot reference. One working corespine proves the pattern. | CS-PE-001 exists; needs CURRENT verification |

**The kernel rule:** Phase B code (scoring-engine.ts, queue-manager.ts) does not begin
until all four kernel components are at wiring state CURRENT. Writing code against an
unverified kernel bakes in the kernel's gaps.

**Immediate action:** PCR-001 (DecisionNode schema lock) is not just a high-PE-score item.
It is a kernel requirement. It blocks Phase B more fundamentally than the current PCR
framing captures.

**Governor decision required:** Approve kernel definition. Confirm Phase B does not begin
until kernel is verified.

---

## IMPROVEMENT 3 — EXECUTE PCR-001 AS CDS'S FIRST CORESPIRAL CYCLE

**Current state:**
PCR-001 is framed as "draft CANONICAL-DECISION-NODE-SCHEMA.yaml." This is a FLESH-stage
description. The SEED and SKELETON stages have not been declared.

**The gap:**
If PCR-001 goes directly to FLESH (writing the schema), it may produce a schema that is
structurally correct but wrong in scope, missing dependencies, or in conflict with
ratified corespines — because SEED and SKELETON were skipped.

**Improvement — Apply 5 stages to PCR-001:**

**Stage 1 — SEED (PCR-001):**
- Why does a canonical DecisionNode schema exist?
- Answer required: "Without it, [specific system] cannot function because [specific reason]."
- One-paragraph justification. Governor challenge. Lock before Stage 2.

**Stage 2 — SKELETON (PCR-001):**
- List all required fields (from existing CDS sessions: schema_position, corespine_context,
  definition, usage_boundaries, inheritance_chain, falsification_test — verify completeness)
- Map all systems that will consume this schema
- Identify all authority boundaries (who can add fields? who can modify?)
- Zero undefined dependencies before Stage 3

**Stage 3 — FLESH (PCR-001):**
- Write CANONICAL-DECISION-NODE-SCHEMA.yaml
- Every field from SKELETON is present. No new fields added without SKELETON update first.

**Stage 4 — SKIN (PCR-001):**
- Wire to: PE scoring engine (consumes), consulting system (references), corespine registry
  (anchors), Governor ratification gate (approves changes)
- Declare: what does this schema inherit from? (CS-PE-001 constraints, T-model root fork)
- Declare: what future systems depend on this? (Phase B scoring engine, Phase B queue manager)

**Stage 5 — VERIFY (PCR-001):**
- Contradiction audit against all ratified corespines
- ZF-0 across mechanical + semantic + propagation categories
- Governor ratification: "This schema is locked. Changes require PCR."
- Wiring state advances to CURRENT.

**This is the first complete corespiral cycle in CDS.**
Everything that follows inherits from it.

---

## IMPROVEMENT 4 — DUAL POLARITY REQUIREMENT FOR PHASE TRANSITIONS

**Current state:**
Phase A → Phase B transition has conditions (4 pre-work items). The conditions are
completion-focused (what Phase A must finish). They do not declare what Phase B inherits
or what infrastructure Phase A must place for Phase B.

**The CoreSpiral dual polarity (from Cycle 2 onward):**
Every new phase carries two simultaneous obligations:
1. Inherit what was verified in previous phases — locked, not relitigated
2. Place infrastructure for what will follow — not built yet, but anticipated and named

**Improvement:**
Add dual polarity declarations to every CDS phase transition document.

**Phase A → Phase B (example application):**

```yaml
phase_a_to_b_transition:
  inheritance_block:
    - CS-PE-001: RATIFIED. Formula locked. PE-CONFIG.yaml owns coefficients.
      Phase B must not re-debate formula parameters.
    - CANONICAL-DECISION-NODE-SCHEMA: CURRENT (pending PCR-001 completion).
      Phase B scoring engine references this schema. Not a discussion.
    - GOV-PE-BOOTSTRAP-001: ACTIVE. Manual priority queue governs until PE is LIVE.
      Phase B honors this queue without bypassing it.
  forward_infrastructure_block:
    - Phase B must produce: pe/src/scoring-engine.ts wired to PE-CONFIG.yaml
    - Phase B must produce: pe/src/queue-manager.ts wired to CANONICAL-DECISION-NODE-SCHEMA
    - Phase B must produce: audit log (CS-PE-001 constraint C3: every scoring decision logged)
    - Phase B must place: scoring simulation framework (required before Phase C LIVE declaration)
```

**Governor decision required:** Approve dual polarity requirement for all future phase
transition documents.

---

## IMPROVEMENT 5 — THE TIGHTENING MECHANISM FOR CDS'S PATTERN ARCHIVE

**Current state:**
The Consolidation Expert harvests patterns from sessions. Patterns are stored in the
pattern archive. They are referenced and reviewed.

**The gap:**
Patterns are stored as knowledge. They are not encoded as automated checks. The same
class of error can occur in Session N+10 that occurred in Session N, because the pattern
was harvested but not mechanically enforced.

**The CoreSpiral tightening principle (purified):**
Each validation cycle discovers failure patterns. Those patterns are encoded as automated
checks. The next cycle inherits all previous checks plus new ones. The system becomes more
secure by encoding memory of its own past mistakes — not by adding rules from theory.

**Improvement — Two-Output Pattern Rule:**
Every pattern ratified by the Governor produces TWO outputs, not one:

**Output 1:** The pattern statement (already happening — stored in pattern archive)

**Output 2:** A mechanical check specification
```yaml
pattern_id: PAT-[SEQ]
pattern_statement: "[What was observed]"
mechanical_check:
  trigger: "[What condition activates this check]"
  detection: "[What the check looks for]"
  failure_output: "[What is flagged when detected]"
  enforcement_layer: "[Where this check runs: pre-ratification | post-build | session-start]"
status: DEFINED | WIRED | ACTIVE
```

**The measure of pattern archive health:**
Not how many patterns are stored. How many have a WIRED mechanical check.
A healthy pattern archive gets quieter over time — fewer violations reach human review
because more are caught automatically.

**Immediate application:**
Review existing pattern archive. For each pattern, specify the mechanical check.
Start with the highest-recurrence patterns first.

**Governor decision required:** Approve two-output pattern rule. Assign Consolidation
Expert the task of specifying mechanical checks for the top 5 existing patterns.

---

## IMPROVEMENT 6 — MATURITY-GATED CORESPINE SEQUENCING

**Current state:**
CDS is building toward a full corespine set. New corespines are added as they become
relevant. There is no formal maturity criterion for when the corespine set is ready to
expand.

**The CoreSpiral maturity principle (purified):**
New topics are not added on a schedule. They are added when previous elements reach
sufficient maturity to support them. Adding too early means building on unverified ground.

**Improvement — Corespine Maturity Gate:**
A new corespine is eligible for development when ALL of the following are true:

| Criterion | Check | Current blocker |
|-----------|-------|-----------------|
| Kernel is CURRENT | All 4 kernel components at wiring state CURRENT | PCR-001 pending |
| All existing corespines are CURRENT | No existing corespine stuck at DEFINED or WIRED | CS-PE-001 needs propagation verified |
| New corespine passes irreducibility test | Cannot be derived from existing corespines | Run before SEED stage |
| New corespine has named inheritance block | Knows what it builds on before SEED begins | Declared at intake |
| Governor approves intake | Maturity gate reviewed by Governor | Explicit approval required |

**What this prevents:**
Building a third or fourth corespine while the first and second are still at WIRED state.
This is the most common way architectural debt accumulates — horizontal expansion before
vertical verification.

**Governor decision required:** Approve maturity gate as the admission criterion for all
new CDS corespine development.

---

## IMPROVEMENT 7 — VERIFICATION-GATED PHASE TRANSITIONS (MECHANICAL)

**Current state:**
Phase A → Phase B has a conditions list (4 items). Two are met. Two are pending (PCR-001,
PCR-002). When the pending two are complete, Phase B begins.

**The gap:**
"Complete" is not mechanically defined. A condition is marked complete when it is declared
complete. There is no ZF-0 verification pass required before the declaration is accepted.

**The CoreSpiral verification gate (purified):**
No next layer begins until the previous layer reaches zero findings. This is not a quality
gate bolted on — it is the definition of "the layer is complete."

**Improvement — Phase Transition Verification Protocol:**

Before any phase transition is ratified by the Governor:

```
PHASE TRANSITION VERIFICATION CHECKLIST

□ All artifacts in outgoing phase have reached wiring state CURRENT
□ ZF-0 achieved across: mechanical findings | semantic findings | propagation findings
□ Dual polarity declared: inheritance block + forward infrastructure block (see Improvement 4)
□ Pattern archive updated: all patterns from this phase have mechanical check specifications
□ One challenge cycle completed: at least one external or cross-platform review of phase outputs
□ Governor signature: "Phase [X] is verified. Phase [X+1] may begin."
```

**Not a formality.** If any checkbox fails, the phase is not complete. Phase B does not
begin because "PCR-001 is done." Phase B begins because Phase A passed all six checklist
items and the Governor signed.

**Governor decision required:** Approve Phase Transition Verification Checklist as the
mandatory gate for all CDS phase transitions, starting with Phase A → Phase B.

---

## IMPROVEMENT 8 — CONSULTING SYSTEM L1 AS FIRST VERIFIED LAYER

**Current state:**
The CDS Consulting System plan has L1 (fundamentals) → L2 (enhancements) → L3 (future
evolutions). L2 does not begin until L1 is ratified by the Governor.

**The CoreSpiral layer principle (already partially aligned):**
This is correct. L1 must be verified before L2 begins. The plan already has this gate
(L1.9 Ratification Gate).

**What's missing:**
L1.9 ratification gate lists completion criteria but does not include:
1. ZF-0 requirement (zero findings from contradiction audit)
2. Dual polarity declaration (what does L1 inherit? what infrastructure does L1 place for L2?)
3. One verified end-to-end scenario (Scenarios A-E in the plan must produce actual
   outputs, not just documentation)

**Improvement — Enhance L1.9 Ratification Gate:**

Add three items to the L1.9 checklist:
```
□ [EXISTING] HUB directory created with all 9 files
□ [EXISTING] All 5 schemas implemented
□ [EXISTING] ADD workflow functional end-to-end
□ [EXISTING] At least 1 ConflictRecord created and resolved
□ [EXISTING] PLATFORM_STATUS.md accurate for all 4 platforms
□ [EXISTING] At least 2 iteration cycles logged
□ [NEW] ZF-0 achieved: contradiction audit against all CDS ratified corespines
□ [NEW] Dual polarity declared: what L1 inherits + what infrastructure L1 places for L2
□ [NEW] Scenario A verified with real output (not documented scenario — actual execution)
□ [EXISTING] Yariv signs off: "Layer 1 is foundational DNA"
```

**Governor decision required:** Approve enhanced L1.9 gate before L1 build begins.

---

## IMPROVEMENT 9 — THE SELF-EVOLUTION CYCLE FOR CDS GOVERNANCE

**Current state:**
CDS governance rules are defined and enforced. When a rule is violated, it is corrected.
The correction is noted. The rule may be re-stated.

**The gap:**
There is no systematic mechanism that converts governance violations into automated
prevention. The same governance violation can recur because the response to a past violation
was human correction, not mechanical encoding.

**Improvement — The Enrich Phase:**
After every formal governance review (Platform Expert audit, Consolidation Expert harvest,
phase transition verification):

1. **Identify failure patterns** — what violations were found that have recurred more than once?
2. **Propose mechanical encoding** — for each recurring violation, what automated check
   would have caught it before it reached human review?
3. **Governor ratification** — propose-then-ratify, never self-enact
4. **Encode** — add the mechanical check to the governance enforcement layer
5. **Measure** — track recurrence rate. A well-evolving system shows declining recurrence
   for encoded violations.

**The measure of CDS governance health:**
Not how many rules are stated. How many violations have been mechanically encoded.
A healthy CDS governance layer catches the same violation class exactly once at human
review — then never again.

---

## IMPLEMENTATION SEQUENCE (PE-ORDERED)

| Priority | Improvement | PE Score Basis | Prerequisite |
|----------|-------------|----------------|--------------|
| 1 | Improvement 2 — Define CDS Kernel | Blocks Phase B (highest impact) | None |
| 2 | Improvement 3 — PCR-001 as first corespiral cycle | Kernel requirement (42.2 PE score) | Improvement 2 ratified |
| 3 | Improvement 1 — Adopt corespiral as build doctrine | Governs all subsequent work | Governor decision |
| 4 | Improvement 7 — Verification-gated phase transitions | Governs Phase A → Phase B gate | PCR-001 at CURRENT |
| 5 | Improvement 4 — Dual polarity for phase transitions | Phase B preparation | Improvement 7 ratified |
| 6 | Improvement 6 — Maturity-gated corespine sequencing | Prevents horizontal expansion debt | Kernel at CURRENT |
| 7 | Improvement 8 — Consulting system L1 enhanced gate | L1 build preparation | Improvements 1+3 complete |
| 8 | Improvement 5 — Tightening mechanism for patterns | Ongoing governance improvement | Pattern archive access |
| 9 | Improvement 9 — Self-evolution cycle | Continuous governance hardening | Phase B complete |

---

## GOVERNOR DECISIONS REQUIRED (SUMMARY)

| # | Decision | FLEXIBLE | NOT FLEXIBLE |
|---|----------|----------|--------------|
| 1 | Ratify 5-Stage Build Sequence as CDS build doctrine | Stages can be renamed | Sequence cannot be skipped |
| 2 | Approve kernel definition (4 components) | Components can be revised | Kernel gate before Phase B cannot |
| 3 | Confirm Phase B does not begin until kernel is CURRENT | Timeline is flexible | Gate is not |
| 4 | Approve dual polarity requirement for phase transitions | Format of declaration | Requirement to declare |
| 5 | Approve two-output pattern rule | Check specification format | Both outputs required |
| 6 | Approve maturity gate for new corespine admission | Criteria thresholds | Gate existence |
| 7 | Approve Phase Transition Verification Checklist | Checklist items may evolve | Governor signature required |
| 8 | Approve enhanced L1.9 gate for consulting system | Timing | The 3 new items |

---

## WHAT THIS PLAN DOES NOT CHANGE

- The PE formula (CS-PE-001 — RATIFIED, locked)
- The trust tier model (ADMIN/TRUSTED/PROBATION/SUSPENDED)
- The GOV-PE-BOOTSTRAP-001 manual priority queue (active until PE is LIVE)
- The PCR scores (PCR-001: 42.2, PCR-002: 32.7)
- The corespine constitutional architecture
- The T-model root fork (System/Domain)
- Any ratified Governor decision from prior sessions

This plan adds HOW to the existing WHAT and WHEN. It does not re-open settled decisions.

---

**Document status:** DRAFT
**Next action:** Governor review of 8 decisions above
**Wiring state:** DEFINED
**Session:** 2026-07-20

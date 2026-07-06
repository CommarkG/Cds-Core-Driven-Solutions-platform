# CDS-TEMPLATE Phase 1 — Opus Holistic Review Prompt

**Purpose:** Verify plan completeness, hardwiring integrity, and extract core improvements to planning methodology  
**Trigger:** After Phase 1 completion (or when flagged by Governor)  
**Audience:** Opus 4.8, external review, architectural synthesis  
**Input document:** `threshold/docs/CDS-TEMPLATE-IMPLEMENTATION-PLAN-001.md` (RATIFIED 2026-07-05)

---

## Part 1: Hardwiring Validation

Review the plan and verify:

### Requirement R1–R8 Completeness
For each of R1–R8 in the plan:
- [ ] Recommendation has a specific `threshold/src/` file target listed
- [ ] Target file path is syntactically valid (no typos, correct tier)
- [ ] Each file appears in the build sequence (Steps 0–13)
- [ ] No R1–R8 is mentioned without a hardwired target
- [ ] R1–R8 are ratified as a non-piecemeal package (cannot split)

### Build Sequence (Steps 0–13) Integrity
- [ ] All 14 steps have explicit deliverables
- [ ] Each step maps to exactly one threshold file (no step touches multiple files)
- [ ] Sequencing invariants are honored (Step N outputs feed Step N+1 inputs)
- [ ] Isolation → Decision → Governed Structure → State → Orchestration → Enforcement → Propagation → Entry (correct order, no reversals)
- [ ] Step 0 and Step 1 are explicitly marked as parallelizable (both prerequisites)
- [ ] Steps 2–13 have clear sequencing dependencies listed

### Prerequisite Sufficiency (P1, P2, P3)
- [ ] P1 (`solver.ts` design doc) is specified with proof criteria:
  - Complexity proven on 50 fields / 20 cross-field rules
  - Decidability demonstrated
  - Bounded runtime proven
  - **Question: Is "proven" sufficient, or should P1 also require a live solver.ts prototype?**

- [ ] P2 (CS-TEMPLATE genesis block) is specified as:
  - Constitutional root (Layer 1)
  - Governor-ratified artifact
  - Authority for Layers 2–3 inheritance
  - **Question: Does genesis block need a Phase 0 review cycle, or can it be ratified directly?**

- [ ] P3 (80% measurement) is specified as:
  - Concrete field count: X of Y fields inherited
  - Derived from existing dashboard (not speculative)
  - Published before Step 4 type definitions
  - **Question: Which dashboard provides the 80% baseline? Is it Governor Dashboard only, or multi-dashboard sample?**

### Phase Machine (R3) Verification
- [ ] Phase 0 gates are purely mechanical (no human judgment)
- [ ] Phase 1 calls solver.ts (satisfiability engine)
- [ ] Phase 2 escalation points are enumerated in `governor-trigger-map.json` (finite, not open-ended)
- [ ] Phase 3 produces watermark-versioned RTM in quarantine (never visible before Phase 4)
- [ ] Phase 4 is atomic pointer flip + cascade saga fire
- [ ] No phase touches database state before Phase 4
- [ ] Governor Trigger Map is identified as a prerequisite for R3 (currently marked as "ratified finite table" — is it written yet?)

### Corespine Architecture
- [ ] CS-TEMPLATE position is correct: CONSTRUCTION tier (not STRUCTURE, not OPERATIVE)
- [ ] CS-TEMPLATE owns the 4-layer inheritance law (not under CS-STRUCTURE)
- [ ] CS-TEMPLATE runtime machinery (solver, cascade) justifies operative placement discussion
- [ ] CS-IDENTITY (6-month) is explicitly flagged as pre-requisite for multi-tenant instances
- [ ] CS-INTERFACE (12-month) is explicitly flagged as pre-requisite for external consumers
- [ ] No phase creates instances before CS-IDENTITY is ready (Layer 4 deferred past Phase 1)

### Type Library Constraints
- [ ] Phase 1 Type Library scope: **ONE type only** (`CS-TEMPLATE-DASHBOARD`)
- [ ] Phase 1 Variants scope: **TWO variants only** (GOVERNANCE, ANALYTICS)
- [ ] Variant ceiling enforcement (≤10 per type) is wired to `RULE-TEMPLATE-VARIANT-COHESION`
- [ ] No lazy materialization in Phase 1 (PARK-040726-022 deferred)
- [ ] First instance is GOVERNANCE variant of Governor Dashboard (CR-ID minted)
- [ ] Why 80% measurement justifies DASHBOARD only (other types are stubs until their own measurements)

---

## Part 2: Architectural Coherence

### Decision Integrity
- [ ] GOV-TEMPLATE-001 (CS-TEMPLATE as new corespine) is coherent with existing corespine tier structure
- [ ] GOV-TEMPLATE-002 (R1–R8 non-piecemeal) is enforced: cannot ship R1 without R2, etc.
- [ ] GOV-TEMPLATE-003 (Phase 1 Type Library) is justified by 80% measurement
- [ ] GOV-TEMPLATE-004 (Build sequence Steps 0–13) has no logical inversions
- [ ] All four decisions are registered in park-registry.json with status=RATIFIED, ratified_at timestamp

### Cross-Phase Consistency
- [ ] Phase 1 outputs (RTM store, solver, cascade saga) are compatible with Phase 2 inputs (semantic guards, lazy materialization design)
- [ ] Phase 2 decisions do NOT invalidate Phase 1 implementation (no retroactive locks)
- [ ] Phase 3 deployment assumes Phase 1 + Phase 2 are complete (no gap)
- [ ] Phase 4 governance assumes Governor Trigger Map is operational (not speculative)

### Prevention Rules Alignment
- [ ] R1 (watermark RTM) prevents session-read coherence loss (FIRST LINE OF CODE)
- [ ] R2 (satisfiability) prevents additive-lock contradiction (the core guard)
- [ ] R3 (phase machine) prevents unbounded human judgment (trigger map is finite)
- [ ] R4 (variant cohesion) prevents multi-variant instances (rejection at gate)
- [ ] R5 (semantic resolvers) prevents bare flag confusion (functions, not booleans)
- [ ] R6 (cascade saga) prevents non-transactional state corruption
- [ ] R7 (lifecycle state machine) prevents invalid state transitions
- [ ] R8 (cross-RTM satisfiability) prevents structure-data joint incoherence

### Risk Mitigation
- [ ] Additive-only constraint cannot be violated at any layer (R2 catches contradictions)
- [ ] Layer 4 instance endpoint does NOT ship before CS-IDENTITY exists (deferred to Phase 3)
- [ ] Multi-tenant instances cannot be created without identity corespine (architectural gate)
- [ ] Solver undecidability discovered post-design cannot be recovered (P1 is FIRST)
- [ ] Genesis block ungoverned authority is prevented (P2 must be Governor-ratified)

---

## Part 3: Holistic Check — "Is This Wired and Complete?"

### Verification Checklist

**Evidence that hardwiring is complete:**
1. Every R1–R8 has a file target → Can verify by grep on `threshold/src/` (target files named correctly)
2. Every step maps to a specific artifact → Can verify by checking build sequence against park-registry.json
3. No floating ideas without implementation targets → Can verify by searching for TODO/PARKED that lack file paths
4. Governor Trigger Map is written and enumerated → Can verify by reading `threshold/data/governor-trigger-map.json`
5. Phase Machine Phase 0–4 gates are all mechanical (not judgment) → Can verify by reading Phase Machine section, no "Governor decides..." language

**Evidence that prerequisites are closure-ready:**
1. P1 closure criteria are measurable (50 fields / 20 rules / bounded runtime) → Can verify by reading solver.ts design brief when authored
2. P2 closure is Governor signature only (no other gate) → Can verify in genesis block approval process
3. P3 closure has a dashboard name and field count → Can verify by reading 80% measurement artifact

**Evidence that phases are sequenced correctly:**
1. No step depends on output from a later step → Can verify by reading sequencing invariants
2. Steps 2–13 have a linear chain (not DAG) → Can verify by checking each step lists its input source
3. Isolation achieved before decision (R1 before R2) → Can verify by step numbers

---

## Part 4: Extraction — Core Improvements to Planning Methodology

### Questions for Opus Synthesis

**What makes this plan unusual or strong?**
- Most plans defer prerequisites. This one gates them *before* build opens. Is this a pattern to hardwire into all future plans?
- Most plans have floating "design sessions" and "review cycles". This one names phases (0–4) mechanically. Should all future plans be phase-structured?
- Most plans park contradictions. This one enforces non-piecemeal R1–R8 ratification. What does this teach about decision atomicity?

**What would improve future plans of this type?**
1. Should Phase Machine itself be a constitutional corespine (not just in this plan)?
2. Should "prerequisite definition" (P1, P2, P3 format) be a standardized template for all plans?
3. Should "build sequence with sequencing invariants" be mandatory in all architecture plans?
4. Should "phase completion audit gates" (Haiku + Sonnet + Opus ZF) be hardwired into every plan's Phase 0?
5. Should "extraction of core improvements" after a significant phase be a constitutional requirement?

**What architectural patterns emerged?**
- The "cripple the type system down to what the solver can decide" principle — is this applicable to other type-system-like domains (schema, UI components, API contracts)?
- The "additive-only inheritance with conflicting-LOCKED detection" pattern — is this usable outside CS-TEMPLATE (e.g., in configuration cascades, role hierarchies)?
- The "RTM watermark + session-bound reads" isolation strategy — can this apply to other mutable registries?
- The "cascade as transactional saga with rollback-as-inverse-delta" — is this a general pattern for multi-layer state machines?

**Improvements to CDS planning doctrine itself:**
1. Extract a "CS-PLAN-STRUCTURE" constitutional corespine that all CDS plans must follow
2. Define "phase completion criteria" operationally (CRITICAL=0, HIGH≤2 threshold, etc.)
3. Create "audit gate template" that becomes mandatory after every significant phase
4. Formalize "prerequisite definition template" so P1/P2/P3 are standardized across all future plans
5. Hardwire "core improvement extraction" as a post-phase obligation (not optional)

---

## Part 5: Final Verdict Template

Opus should produce:

```markdown
# CDS-TEMPLATE Phase 1 Plan — Holistic Review Verdict

## Overall Readiness
- [GREEN / YELLOW / RED]
- Confidence level: [High / Medium / Low]

## Hardwiring Status
- Complete: [X/N] core files have explicit targets
- Gaps: [List any R1-R8 without clear file targets, if any]
- Risk level: [Low / Medium / High]

## Phase Sequence Validity
- Sequencing invariants: [✓ Verified / ⚠ Issues found]
- Isolation achieved: [✓ Yes / ⚠ Partial / ✗ No]
- Gateway logic sound: [✓ Yes / ⚠ Needs clarification / ✗ No]

## Prerequisite Sufficiency
- P1 (solver proof): [Ready / Needs clarification / Insufficient]
- P2 (genesis block): [Ready / Needs clarification / Insufficient]
- P3 (80% measurement): [Ready / Needs clarification / Insufficient]

## Critical Gaps (if any)
1. [Gap description with file/section reference]
2. [Gap description with file/section reference]

## Core Improvements to Planning Doctrine
1. [New corespine / pattern to extract]: [Description]
2. [New corespine / pattern to extract]: [Description]
3. [New corespine / pattern to extract]: [Description]

## Recommendation
- **Phase 1 build may open: [YES / NO / CONDITIONAL]**
- **If conditional, close these first: [List blocking items with file targets]**
```

---

**Prompt for Opus:**

> You are reviewing the finalized CDS-TEMPLATE Phase 1 implementation plan (document: CDS-TEMPLATE-IMPLEMENTATION-PLAN-001.md, status: RATIFIED, date: 2026-07-05).
>
> **Your task:**
> 1. **Verify hardwiring is complete**: Every R1–R8 recommendation maps to a specific `threshold/src/` file. Every step maps to a deliverable. No floating ideas. Report any gaps.
> 2. **Verify prerequisites are closure-ready**: P1, P2, P3 closure criteria are measurable and not circular. Report any circular dependencies or vague criteria.
> 3. **Verify phase sequence is sound**: Isolation before decision. No step depends on a later step. Sequencing invariants are honored. Report any inversions.
> 4. **Verify architectural coherence**: R1–R8 don't contradict. Corespine positioning is correct. Cross-phase consistency holds. Report any logical gaps.
> 5. **Extract core improvements to planning methodology**: What does this plan teach us about how to structure future plans? What patterns should become constitutional? What should every plan include? Report 3–5 extractable patterns.
>
> **Format your verdict** using the template above. Be specific — reference file paths, step numbers, and decision IDs. If you find gaps, specify what must be added (file, content, owner). If you find no gaps, state that explicitly.
>
> **Critical question:** Is Phase 1 build ready to open on day 1 of the next session, or are there blocking clarifications? Be direct.

---

**This artifact should be:**
1. Saved as `threshold/docs/CDS-OPUS-HOLISTIC-REVIEW-PROMPT-001.md` (done above)
2. Referenced in the park registry as a scheduled artifact (Opus review triggers after Phase 1 completion)
3. Reused and refined for Phase 2, Phase 3, Phase 4 (one prompt per phase, updated with phase-specific targets)

---

Ready for compaction.
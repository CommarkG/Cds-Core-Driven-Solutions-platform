# [PROJECT_NAME] Implementation Plan

**Document ID:** [DOC_ID]  
**Date:** [DATE]  
**Status:** [PLANNING/PHASE X BUILD OPEN]  
**Phase:** [PHASE_NUMBER]

---

## The One Sentence

> [Single sentence that is the design north star. Concise. Mechanically enforceable. No ambiguity.]

---

## Build Readiness Verdict

**Verdict:** [GREEN/YELLOW CONDITIONAL/RED]

[1-2 paragraph summary of readiness. State any conditions explicitly. No vague "pending clarity"—every condition must be measurable and testable.]

---

## Three Mandatory Build Prerequisites

These are hard gates. Build does not open without all three.

| # | Prerequisite | Why non-negotiable | Artifact | Closure Criterion |
|---|--------------|-------------------|----------|-------------------|
| **P1** | [Prerequisite 1 name and description] | [Reason this cannot be deferred] | [Specific file/artifact that must exist] | [Measurable condition that closes this gate] |
| **P2** | [Prerequisite 2 name and description] | [Reason this cannot be deferred] | [Specific file/artifact that must exist] | [Measurable condition that closes this gate] |
| **P3** | [Prerequisite 3 name and description] | [Reason this cannot be deferred] | [Specific file/artifact that must exist] | [Measurable condition that closes this gate] |

---

## Final Architecture: R1–R8

Ratified as a **package — explicitly non-piecemeal**.

| Rec | What | Key detail | Threshold file |
|-----|------|-----------|---------------|
| **R1** | [Recommendation 1 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R2** | [Recommendation 2 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R3** | [Recommendation 3 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R4** | [Recommendation 4 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R5** | [Recommendation 5 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R6** | [Recommendation 6 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R7** | [Recommendation 7 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |
| **R8** | [Recommendation 8 title] | [What specifically is being enforced/built] | [threshold/src/... target file] |

---

## Phase Machine explanation

[Detailed explanation of how phases work for this implementation. Include phase gates, mechanical vs. governance split, and ratification triggers. Reference specific rules/gates.]

---

## Build Sequence (Ordered)

Sequencing invariant: [State the invariant that must be honored—no reversals, no inversions, clear dependencies]

| Step | What | Threshold target | Delivers |
|------|------|-----------------|---------|
| **0** | [Step 0 description] | [threshold/src/... or threshold/docs/...] | [What this step enables] |
| **1** | [Step 1 description] | [threshold/src/... or threshold/docs/...] | [What this step enables] |
| **2** | [Step 2 description] | [threshold/src/... or threshold/docs/...] | [What this step enables] |
| **3** | [Step 3 description] | [threshold/src/... or threshold/docs/...] | [What this step enables] |
| **[N]** | [Additional steps as needed] | [threshold/src/...] | [Deliverables] |

---

## Corespine Architecture

### Position in the Tier Structure

[Explicit statement of where this corespine/component sits in the overall CDS tier hierarchy. Does it govern? Does it operate? Is it foundational? Who ratifies it?]

### Full Corespine Architecture (current + roadmap)

[If introducing a new corespine, show how it fits with existing ones (CS-META, CS-GOVERNANCE, CS-STRUCTURE, etc.). If building a component, explain its dependencies.]

### Initial Type Library (Phase [N] — ship narrow)

[What types ship in this phase. What variants. Why these first. What's deferred and why.]

---

## Phase 2+ Parked Items (do not block this phase)

| Park ID | Item | Target |
|---------|------|--------|
| [PARK-XXXXXX-XXX] | [Description] | [Which phase] |
| [PARK-XXXXXX-XXX] | [Description] | [Which phase] |

---

## Permission Request

Governor ratification requested for:

1. [GOV-DECISION-001] — [What is being ratified and why it requires Governor signature]
2. [GOV-DECISION-002] — [What is being ratified and why it requires Governor signature]

**Block conditions (Governor must sign off before build opens):**
- [P1/P2/P3 conditions that must be satisfied first]
- [Any other Governor gates]

---

*Document prepared by [AUTHOR]. Every step has a specific file target. Nothing is conceptual.*

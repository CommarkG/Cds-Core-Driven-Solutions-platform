---
document_id: CDS-BUILD-DOCTRINE-CORESPIRAL-001
title: CoreSpiral Build Doctrine — CDS
status: RATIFIED — 2026-07-20
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.GOVERNANCE.DOCTRINE.BUILD
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Build Doctrine — CoreSpiral

Every PE-selected item follows this sequence from the moment it is selected to the moment
it is declared CURRENT. No stage is skipped. No next stage begins until the current stage
passes its gate.

---

## The 5-Stage Sequence

| Stage | Name | What Happens | Gate |
|-------|------|-------------|------|
| 1 | SEED | Define the WHY. One-sentence justification that survives Governor challenge. What breaks if this doesn't exist? | Justification locked by Governor |
| 2 | SKELETON | Map all constraints, dependencies, required fields, authority boundaries. Zero undefined dependencies. | All dependencies named and resolved |
| 3 | FLESH | Build the artifact. Every field from SKELETON is present. No new fields without updating SKELETON first. | Artifact passes contradiction audit |
| 4 | SKIN | Wire to all consuming systems. Declare inheritance block + forward infrastructure block. | All wiring states at minimum WIRED |
| 5 | VERIFY | ZF-0 across mechanical + semantic + propagation. Propagation complete. Governor ratification. | ZF-0 confirmed. Governor signature. |

---

## Wiring State Mapping

| Stage Completed | Wiring State Assigned |
|----------------|----------------------|
| Stage 1 — SEED complete | DEFINED |
| Stage 2 — SKELETON complete | DEFINED (internal milestone — no external state change) |
| Stage 3 — FLESH complete | WIRED |
| Stage 4 — SKIN complete | REACHABLE |
| Stage 5 — VERIFY complete | CURRENT |

An artifact is not complete when it is written. It is complete when it reaches CURRENT.
Only a CURRENT artifact can be inherited by what follows it.

---

## Non-Negotiable Rules

1. **No stage is skipped** under any condition, including time pressure or PE urgency score.
2. **No artifact is declared CURRENT** without passing Stage 5 VERIFY gate with Governor signature.
3. **No artifact begins its inheritance chain** from an artifact below CURRENT.
4. **FLESH never adds undeclared fields.** If a new field is discovered during FLESH, return to SKELETON, update it, then continue. FLESH is a bounded execution — not a discovery phase.
5. **SKIN always declares both:** what is inherited from prior work (locked) AND what infrastructure this artifact places for what follows (anticipated).
6. **SEED is not skipped for "small" items.** Size does not determine whether SEED is required. Impact on the inheritance chain does.

---

## Integration With Priority Engine

The PE selects WHAT to build and WHEN. CoreSpiral governs HOW it is built once selected.
These are not competing systems — they operate in sequence.

```
PE scores item → item is selected from GOV-PE-BOOTSTRAP-001 queue
    ↓
Item enters SEED stage → wiring state: DEFINED
    ↓
Item completes SKELETON → internal milestone (still DEFINED)
    ↓
Item completes FLESH → wiring state: WIRED
    ↓
Item completes SKIN → wiring state: REACHABLE
    ↓
Item completes VERIFY → wiring state: CURRENT
    ↓
Item is eligible to be inherited by next work
```

---

## What This Doctrine Applies To

**In scope:**
- Schemas (DecisionNode, CapabilityEntry, etc.)
- Corespines (new corespine development)
- Protocols (ratification, phase transition, conflict resolution)
- System components (scoring engine, queue manager, etc.)
- Consulting layer definitions (L1, L2, L3)
- Governance documents with binding constraints

**Out of scope:**
- Minor edits to existing CURRENT artifacts (typo fixes, wording clarifications with no governance effect)
- Documentation updates that add no new dependency
- Vocabulary additions that create no new inheritance

**When in doubt:** apply the doctrine. The cost of applying it unnecessarily is one extra stage of rigor. The cost of not applying it when needed is a gap in the inheritance chain.

---

## Relation to Platform Goal

Platform goal: **everything self-verifies.**

This doctrine is how SEED-stage artifacts eventually become self-verifying. The VERIFY stage (Stage 5) is the mechanical proof that the artifact verifies itself. Without this doctrine, verification is aspirational. With it, verification is a gate.

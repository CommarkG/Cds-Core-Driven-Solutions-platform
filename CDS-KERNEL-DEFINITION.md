---
document_id: CDS-KERNEL-DEFINITION-001
title: CDS Kernel — Definition and Verification Gate
status: RATIFIED — 2026-07-20
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.ARCHITECTURE.KERNEL
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Kernel Definition

The kernel is the minimum self-validating system. Build the kernel first.
Build everything else inside its validation loop.

The minimum viable system is not the minimum viable product.
It is the minimum system that can validate itself.

---

## The 4 Kernel Components

| Component | Why It Is Kernel | Current State | Verified |
|-----------|-----------------|--------------|---------|
| Canonical DecisionNode schema (PCR-001) | All PE scoring references decision nodes. Cannot score what is not canonically defined. Without this, scoring is non-deterministic. | EXECUTING — SEED + SKELETON complete (2026-07-20) | NO |
| CS-PE-001 ratified formula + PE-CONFIG.yaml | The scoring engine implements this formula. Formula must be locked before code is written. Coefficients must be externalized before hardcoding occurs. | CURRENT ✓ | YES |
| Governor ratification gate (GOV-PE-BOOTSTRAP-001) | Every kernel output must have a ratification path. Without a ratification gate, kernel outputs are unverifiable — they exist but carry no authority. | CURRENT ✓ | YES |
| Phase A ratification system (PCR-002) | The ratification pattern that produced CS-PE-001 must be proven repeatable. One verified ratification cycle proves the pattern works. Without this, CS-PE-001 is a one-off, not a system. | EXECUTING — CS-GOAL-001 cycle in progress | NO |

---

## The Kernel Gate Rule

**Phase B code does not begin until all 4 kernel components are at wiring state CURRENT.**

This means: pe/src/scoring-engine.ts and pe/src/queue-manager.ts are not written until:
- PCR-001 DecisionNode schema is CURRENT
- PCR-002 Phase A ratification system is CURRENT

This rule is not a preference. Writing code against an unverified kernel bakes in the
kernel's gaps at every layer above it. Every line of code that references an unverified
schema will need to be rewritten when the schema is finalized.

---

## Current Kernel Verification Status

```
KERNEL COMPONENT                                STATUS

CS-PE-001 formula + PE-CONFIG.yaml             [CURRENT] ✓
GOV-PE-BOOTSTRAP-001                            [CURRENT] ✓
PCR-002 Phase A ratification system             [IN PROGRESS — CS-GOAL-001 cycle]
PCR-001 DecisionNode schema                     [IN PROGRESS — SEED+SKELETON done; FLESH next]
────────────────────────────────────────────────────────────────────────────────
KERNEL GATE STATUS                              [OPEN — 2 of 4 verified]
PHASE B CODE                                    [BLOCKED — kernel gate open]
```

---

## What Is NOT in the Kernel

These are built AFTER the kernel is verified, inside the kernel's validation loop:

- pe/src/scoring-engine.ts
- pe/src/queue-manager.ts
- Consulting system L1 (HUB directory, schemas, workflows)
- Full corespine set (beyond CS-PE-001)
- Governor Dashboard (CDS-GOVERNOR-DASHBOARD.yaml)
- Tag library, Status library, Creation library
- UI or dashboard layer
- Agent network extensions

None of these are started until kernel gate is CURRENT. This is the enforcement of the
platform goal: these systems will self-verify — but only because the kernel that validates
them is verified first.

---

## Kernel Verification Sequence

When PCR-001 and PCR-002 reach CURRENT, the kernel verification runs:

```
Step 1: Verify PCR-001 — CANONICAL-DECISION-NODE-SCHEMA.yaml
        ZF-0 across: mechanical + semantic + propagation
        Governor signature: "DecisionNode schema is locked"
        Wiring state → CURRENT

Step 2: Verify PCR-002 — Phase A ratification system
        CS-GOAL-001 ratification cycle completes successfully
        RATIFICATION-REQUEST-TEMPLATE.yaml produced and proven
        Governor signature: "Phase A ratification system is functional"
        Wiring state → CURRENT

Step 3: Kernel gate closes
        All 4 components at CURRENT
        Phase B code authorized to begin
        Phase A → Phase B transition checklist: item 1 checked

Step 4: Phase A → Phase B transition protocol runs
        Per CDS-PHASE-TRANSITION-PROTOCOL-001
        All 6 checklist items verified
        Governor signs: "Phase A complete. Phase B begins."
```

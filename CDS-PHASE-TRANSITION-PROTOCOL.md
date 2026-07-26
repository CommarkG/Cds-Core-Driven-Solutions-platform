---
document_id: CDS-PHASE-TRANSITION-PROTOCOL-001
title: CDS Phase Transition Protocol — Dual Polarity + Verification Gate
status: RATIFIED — 2026-07-20
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.GOVERNANCE.PROTOCOL.PHASE_TRANSITION
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Phase Transition Protocol

Every CDS phase transition must pass this protocol before the Governor ratifies the
transition. Applies to: Phase A→B, Phase B→C, Phase C→D, and all future phases.

---

## Part 1 — Dual Polarity Declaration

Every outgoing phase declares two blocks before transition is submitted for ratification.

### INHERITANCE BLOCK
What the incoming phase inherits. These items are LOCKED. The incoming phase cannot
relitigate, re-debate, or contradict them. If inheritance needs to change, a PCR is
required before the transition.

```yaml
# Format:
inheritance_block:
  - item: "[Artifact or decision name]"
    status: "[CURRENT / RATIFIED]"
    what_is_locked: "[What specifically cannot change]"
    ratification_reference: "[GOV-ID or document reference]"
```

### FORWARD INFRASTRUCTURE BLOCK
What the outgoing phase places for the incoming phase. These items are anticipated
but not yet built. They are named so the incoming phase knows what it inherits and
what gaps would break it.

```yaml
# Format:
forward_infrastructure_block:
  - item: "[What will be needed]"
    needed_by: "[Which incoming phase component needs this]"
    placed_by: "[Which outgoing phase component places this]"
    status: "[PLACED / ANTICIPATED]"
```

---

## Part 2 — Verification Checklist (6 Items)

All 6 must be checked before Governor signature. No exceptions.

```
PHASE [X] → PHASE [X+1] VERIFICATION CHECKLIST
Date: ___________    Transition: Phase ___ → Phase ___

□ 1. ALL ARTIFACTS CURRENT
     Every artifact in the outgoing phase is at wiring state CURRENT.
     No artifact stuck at DEFINED, WIRED, or REACHABLE.
     Verified by: reading wiring_state field on each outgoing phase artifact.

□ 2. ZF-0 ACHIEVED (three categories — all required)
     □ Mechanical findings: zero
     □ Semantic findings: zero
     □ Propagation findings: zero
     Verified by: running contradiction audit + vocabulary check + wiring propagation check.
     Not verified by: declaration. Must produce an actual audit report.

□ 3. DUAL POLARITY DECLARED
     □ Inheritance block: complete, Governor-locked, all items at CURRENT or RATIFIED
     □ Forward infrastructure block: complete, all anticipated items named with owner
     Verified by: this document, Part 1 section, signed by Governor.

□ 4. PATTERN ARCHIVE UPDATED
     □ All patterns identified in outgoing phase are in pattern archive
     □ Two-output rule applied: each pattern has statement + mechanical check specification
     □ At least 1 new mechanical check moved to ACTIVE during outgoing phase
     Verified by: CDS-PATTERN-TWO-OUTPUT-PROTOCOL-001 ARCHIVE HEALTH metric ≥ 50%

□ 5. CHALLENGE CYCLE COMPLETED
     □ At least one external or cross-platform review of outgoing phase outputs
     □ All findings from review are either: resolved (wiring state updated) or
       vaulted (ConflictRecord created with Governor disposition)
     □ No open challenge findings without disposition
     Verified by: challenge record with Governor sign-off.

□ 6. GOVERNOR SIGNATURE
     □ Governor has reviewed all 5 items above
     □ Governor signs: "Phase [X] is verified. Phase [X+1] may begin."
     □ GOV-ID assigned to transition decision
     Verified by: GOV-ID entry in CORESPINE-REGISTRY.yaml or ratification record.
```

**If any checkbox fails:** Phase transition is blocked. No exception for elapsed time,
PE urgency score, or external deadline pressure. The checklist is a gate, not a guideline.

---

## Phase A → Phase B (Current Application)

### Inheritance Block

```yaml
inheritance_block:

  - item: "CS-PE-001 — Priority Engine Corespine"
    status: RATIFIED
    what_is_locked: >
      PE formula structure. 4 spine constraints (C1: config-driven, C2: determinism,
      C3: audit logging, C4: halt on registry unreachable). Trust tier modifier range
      0.9-1.2. Phase B does not re-debate any of these.
    ratification_reference: "RATIFICATION-CS-PE-001.yaml — 2026-07-15"

  - item: "PE-CONFIG.yaml — All Formula Coefficients"
    status: CURRENT
    what_is_locked: >
      All formula weights at 1.0 neutral. Urgency decay 0.3/day. Trust modifiers:
      ADMIN 1.2, TRUSTED 1.1, EXTERNAL 1.0, PROBATION 0.9. Config-driven — not
      hardcoded in Phase B implementation.
    ratification_reference: "PE-CONFIG.yaml — 2026-07-15"

  - item: "GOV-PE-BOOTSTRAP-001 — Manual Priority Queue"
    status: CURRENT
    what_is_locked: >
      Active until PE goes LIVE. Phase B honors this queue. Phase B cannot bypass
      it, reassign items, or declare items complete without Governor signature.
    ratification_reference: "GOV-PE-BOOTSTRAP-001.yaml — 2026-07-15"

  - item: "CDS Build Doctrine — CoreSpiral (5-Stage Sequence)"
    status: RATIFIED
    what_is_locked: >
      All Phase B artifacts follow SEED → SKELETON → FLESH → SKIN → VERIFY.
      No stage skipped. CURRENT state requires Stage 5 VERIFY complete.
    ratification_reference: "CDS-BUILD-DOCTRINE-CORESPIRAL-001 — 2026-07-20"

  - item: "CDS Kernel Definition (4 Components)"
    status: RATIFIED
    what_is_locked: >
      Phase B code begins only when kernel is CURRENT. Scoring engine and queue
      manager are not written until PCR-001 and PCR-002 reach CURRENT.
    ratification_reference: "CDS-KERNEL-DEFINITION-001 — 2026-07-20"

  - item: "Trust Tier Model"
    status: RATIFIED
    what_is_locked: >
      4 tiers: ADMIN (+20% = 1.2), TRUSTED (+10% = 1.1), EXTERNAL (0% = 1.0),
      PROBATION (-10% = 0.9). SUSPENDED is blocking state, not modifier tier.
      Phase B does not add tiers without PCR + Governor approval.
    ratification_reference: "RATIFICATION-CS-PE-001.yaml Q6 — 2026-07-15"
```

### Forward Infrastructure Block

```yaml
forward_infrastructure_block:

  - item: "CANONICAL-DECISION-NODE-SCHEMA.yaml + CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml"
    needed_by: "pe/src/scoring-engine.ts — reads node definitions to score decisions"
    placed_by: "PCR-001 FLESH + VERIFY stages (CDS-PCR-001-CORESPIRAL-EXECUTION-001)"
    status: PLACED ✓ — PCR-001 CURRENT 2026-07-25, Governor ratified

  - item: "Phase A ratification system — proven repeatable"
    needed_by: "All Phase B corespine ratification cycles use same pattern"
    placed_by: "PCR-002 — CS-GOAL-001 ratification cycle completion"
    status: PLACED ✓ — PCR-002 CURRENT 2026-07-25, 3 ratification cycles proven

  - item: "Scoring audit log structure"
    needed_by: "CS-PE-001 C3 — every scoring decision logged"
    placed_by: "Phase B scoring engine design (Sprint B-1)"
    status: ANTICIPATED — schema must be defined before code is written

  - item: "PE scoring simulation framework"
    needed_by: "90-day simulation required before Phase C LIVE declaration"
    placed_by: "Phase B — must produce simulation harness alongside production code"
    status: ANTICIPATED — must be planned at Phase B start, not retrofitted

  - item: "CANONICAL-CORESPINE-CONTRIBUTION-SCHEMA.yaml"
    needed_by: "Phase C — Consolidation Expert harvesting patterns across corespines"
    placed_by: "Phase B — corespine work produces repeatable pattern"
    status: ANTICIPATED — emerges from Phase B corespine development work
```

### Phase A → Phase B Checklist Status (Live)

```
✓ 1. All Phase A artifacts CURRENT      [COMPLETE ✓ — PCR-001 CURRENT 2026-07-25,
                                          PCR-002 CURRENT 2026-07-25, kernel CLOSED 4/4]
✓ 2. ZF-0 achieved                      [COMPLETE ✓ — ZF-GRAPHIFY-PROPAGATION-001 PASS
                                          2026-07-25; mechanical + semantic + propagation = 0]
✓ 3. Dual polarity declared             [COMPLETE ✓ — this document, 2026-07-20]
□ 4. Pattern archive updated            [PARTIAL — PAT-001/002/003/004/005 done (5/5).
                                          ARCHIVE HEALTH: 0% ACTIVE (all DEFINED).
                                          Gate requires ≥1 check ACTIVE.
                                          NOTE: 2 live hooks (validate-governance-write.sh +
                                          pre-commit-rate-limit) are mechanical enforcement.
                                          Governor: do these satisfy ≥1 ACTIVE? PENDING.]
✓ 5. Challenge cycle completed          [COMPLETE ✓ — 2026-07-27
                                          Option A (cold-start): general-purpose agent,
                                          no CDS context. 5 Phase A artifacts reviewed.
                                          25 findings. All Governor-dispositioned.
                                          audit/CHALLENGE-REPORT-20260726.md — signed.]
□ 6. Governor signature                 [OPEN — awaiting Governor signature]
─────────────────────────────────────────────────────────────
PHASE B GATE STATUS:    4½/6 (item 5 ✓ — item 4 pending Governor call on ACTIVE)
NEXT ACTION:            Governor: (a) rule on item 4 ACTIVE definition, (b) sign item 6
```

---

## Challenge Cycle Format Definition

*Added 2026-07-26 — resolves FND-20260725-007 (format undefined = ungated)*

### What Counts as an External Review

A valid challenge cycle for Phase A→B gate requires ONE of the following:

**Option A (Recommended): Cold-Start Claude Session**
A new Claude session with NO CDS context loaded is given the following artifacts
and asked to find logical gaps, unsupported claims, governance weaknesses:
- `memory/PLATFORM-GOAL.md`
- `CDS-KERNEL-DEFINITION.md`
- `CDS-BUILD-DOCTRINE-CORESPIRAL.md`
- `CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml`
- `CDS-SYSTEM-WISDOM.md`

The session receives a standard challenge prompt (see below). No MEMORY.md, no
compaction recovery doc — cold start only.

**Option B: Cross-Platform Review**
CISEM or another connected platform reviews specified Phase A outputs.
Review must be conducted by an agent or session with no prior CDS context.

**Option C: Governor-Designated Reviewer**
Governor names a specific reviewer (person or AI session) who reads and challenges
the Phase A outputs with no prior CDS context.

### Challenge Prompt Template

```
You are reviewing the foundational governance architecture of a platform called CDS
(Core Driven Solutions). You have no prior context on this platform.

Read the following files and identify:
1. Logical gaps — claims that don't follow from evidence
2. Unsupported assertions — governance statements without enforcement mechanisms
3. Internal contradictions — two statements that cannot both be true
4. Missing definitions — terms used without canonical definition
5. Circular dependencies — A requires B which requires A

For each finding, provide:
  finding_id: CHALLENGE-[DATE]-[SEQ]
  category: [logical_gap | unsupported | contradiction | missing_definition | circular]
  artifact: [file where found]
  claim: [the exact text of the problematic claim]
  critique: [why it is a problem]
  severity: [CRITICAL | HIGH | MEDIUM | LOW]

If you find zero issues in a category, explicitly state: "[category]: ZERO FINDINGS"
Do not suggest improvements — only report what is logically or structurally wrong.
```

### Challenge Record Format

Results are stored in `audit/CHALLENGE-REPORT-[DATE].md` with:
- Reviewer identity (Option A/B/C + session date)
- List of findings in the format above
- Governor disposition for each finding:
  - `RESOLVED` — finding is valid, fix applied (wiring state updated)
  - `VAULTED` — finding is valid, addressed in Phase B (ConflictRecord created)
  - `REJECTED` — finding is not valid (Governor explains why)
- Governor signature confirming no open undispositioned findings

**Gate check:** Item 5 is checked ✓ when CHALLENGE-REPORT-[DATE].md exists,
all findings have Governor dispositions, and no finding is missing a disposition.

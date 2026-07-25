---
document_id: CDS-CORESPINE-MATURITY-GATE-001
title: CDS Corespine Maturity Gate — Admission Criteria
status: RATIFIED — 2026-07-20
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.GOVERNANCE.GATE.CORESPINE_ADMISSION
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Corespine Maturity Gate

New corespine domains are not added on a schedule or because they feel relevant.
They are added when the existing foundation is verified to support them.

---

## The Core Rule

A new corespine is eligible for development when ALL 5 criteria are met.
None are optional. None can be waived without a PCR + Governor approval.

---

## Admission Criteria

| # | Criterion | What Is Checked | How It Is Verified |
|---|-----------|----------------|-------------------|
| 1 | Kernel is CURRENT | All 4 kernel components at wiring state CURRENT | CDS-KERNEL-DEFINITION-001 — all rows show CURRENT |
| 2 | All existing corespines are CURRENT | No corespine stuck below CURRENT | CORESPINE-REGISTRY.yaml — `wiring_state` field per entry |
| 3 | Irreducibility test passes | New corespine cannot be derived from any combination of existing corespines | Contradiction audit — mechanically confirmed |
| 4 | Named inheritance block exists | New corespine declares what it builds on before SEED begins | Required in intake document — Governor-reviewed |
| 5 | Governor explicit approval | Governor admits the new domain | GOV-ID assigned at intake |

---

## The Irreducibility Test

**Test question:**
"If this corespine did not exist, which existing corespine would absorb its constraints?"

- **If there is an answer:** the proposed corespine is a domain within an existing corespine,
  not a new top-level one. It is reclassified and placed inside the appropriate existing
  corespine's branch structure.
- **If there is no answer:** the proposed corespine is irreducible. Admission proceeds.

**How to run it:**
For each proposed corespine, for each existing corespine: ask "does [existing] fully cover
[proposed]?" If yes for any existing corespine: irreducibility fails.

The test runs mechanically against CORESPINE-REGISTRY.yaml constraint blocks first.
AI judgment applies only if mechanical check is inconclusive.

---

## Admission Outcomes

| Situation | Outcome |
|-----------|---------|
| All 5 criteria met | New corespine enters SEED stage. CoreSpiral 5-stage sequence begins. |
| Kernel not CURRENT | PARKED with condition: "Eligible when kernel gate closes" — not rejected |
| Existing corespine not CURRENT | PARKED with condition: "Eligible when [named corespine] reaches CURRENT" |
| Irreducibility test fails | RECLASSIFIED: becomes a domain branch within [named existing corespine] — not lost, repositioned |
| No inheritance block declared | RETURNED to author: declare inheritance block, then resubmit |
| No Governor approval | EXISTS AS DOCUMENTATION ONLY: does not bind, does not inherit, does not govern |

---

## Why This Gate Exists

The most common way architectural debt compounds: horizontal expansion before vertical
verification.

Build three corespines while the first is still at WIRED state → second and third inherit
an unverified foundation → errors compound invisibly → when verification eventually runs,
cost to fix is 3x what it would have been at source.

The maturity gate prevents this. Slower horizontally. More stable vertically. The platform
goal is "everything self-verifies" — that requires a foundation that is itself verified
before it is extended.

---

## Current Status (2026-07-20)

```
CRITERION 1 — Kernel CURRENT:
  CS-PE-001 formula + PE-CONFIG.yaml     [CURRENT] ✓
  GOV-PE-BOOTSTRAP-001                   [CURRENT] ✓
  PCR-001 DecisionNode schema            [IN PROGRESS]
  PCR-002 Phase A ratification system    [IN PROGRESS]
  KERNEL GATE:                           [OPEN — 2/4 verified]

CRITERION 2 — All existing corespines CURRENT:
  CS-PE-001                              [RATIFIED — propagation check pending]
  ALL CORESPINES CURRENT:                [OPEN]

CRITERIA 3-5:                            [NOT YET APPLICABLE — blocked by 1+2]

NEW CORESPINE ADMISSION:                 [BLOCKED]
EARLIEST UNBLOCK:                        [After PCR-001 + PCR-002 reach CURRENT]
```

---
document_id: PARKED-THREE-AXIS-DECISION
title: Three-Axis Cross Model vs T-Model — Governor Decision
status: AWAITING GOVERNOR RATIFICATION
source: CSPS ADR-0028 (provided by Governor 2026-07-20)
cds_recommendation: ADOPT — vocabulary change only, no structural change
governor_action_required: "Ratify or reject the three-axis naming adoption"
date: 2026-07-20
---

# Three-Axis Cross Model — Governor Decision Required

## THE QUESTION

CSPS uses a "three-axis cross model" for artifact classification.
CDS uses a "T-model" for the same purpose.

Are these different? Should CDS adopt the CSPS framing?

---

## CSPS THREE-AXIS CROSS MODEL (ADR-0028)

CSPS organizes every artifact across three independent axes:

| Axis | Name | Description |
|------|------|-------------|
| Axis 1 | Universal base | Every artifact carries the same scaffold fields (common across all types) |
| Axis 2 | Spine routing | Classifies into governance spines (GVRN, ARCH, AI, VALD, OPER) independently of domain |
| Axis 3 | Domain extension | Domain-specific fields added on top of the universal base |

Key insight from CSPS: "An ARCH artifact and a GVRN artifact can share the same
template (Axis 1) while sitting in entirely different governance spines (Axis 2)."
Axis 2 cuts across the domain hierarchy — it is orthogonal to domain classification.

---

## CDS T-MODEL (current)

CDS T-model:
- Root fork: SYSTEM or DOMAIN (element_type field)
- Trunk: ROOT.[TYPE].[TRUNK] (trunk_position field)
- Branch: CDS.[ROOT].[TRUNK].[BRANCH] (schema_position field)
- Corespine routing: corespine_context field (which corespine governs this element)

---

## CDS ANALYSIS: DO WE HAVE ALL THREE AXES?

**Yes. CDS already has all three axes — just named differently.**

| CSPS Axis | CSPS Name | CDS Field | Status |
|-----------|-----------|-----------|--------|
| Axis 1 | Universal base (14 common fields) | The 14 fields in CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml | EXISTS |
| Axis 2 | Spine routing (GVRN/ARCH/AI/VALD/OPER) | `corespine_context` (CS-PE-001, CS-GOAL-001, etc.) | EXISTS |
| Axis 3 | Domain extension (element_type + domain fields) | `element_type` (SYSTEM/DOMAIN) + `trunk_position` | EXISTS |

**The CSPS key insight IS already native CDS:**
"An ARCH artifact and a GVRN artifact can share the same template" =
All CDS elements share the 14-field CANONICAL-PLATFORM-ELEMENT-SCHEMA (Axis 1),
but route to different corespines via `corespine_context` (Axis 2),
independent of their `element_type` and `trunk_position` (Axis 3).

---

## WHAT ADOPTION MEANS

**Structural changes: NONE.**
The schema stays exactly as ratified in CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml.
No new fields. No field renames. No breaking changes.

**Vocabulary changes (if adopted):**

| Current CDS term | Three-axis equivalent | Change type |
|------------------|-----------------------|-------------|
| "T-model" | "three-axis cross model" | Rename (conceptual) |
| "14 common fields" | "Axis 1 (universal base)" | Add label |
| `corespine_context` | "Axis 2 field (spine routing)" | Add descriptor |
| `element_type` + `trunk_position` | "Axis 3 (domain classification)" | Add descriptor |

The schema fields themselves are unchanged. Only how we describe the architecture changes.

---

## WHY ADOPT (CDS recommendation)

1. **It's already true.** CDS implemented three-axis without naming it. Adopting the name is just surfacing what exists.

2. **Axis 2 insight is valuable.** CSPS correctly identified that spine routing (Axis 2) cuts across domains independently. Making this explicit prevents future confusion where someone tries to make spine assignment domain-dependent.

3. **Cross-platform alignment.** CDS extracts DNA from mature platforms. CSPS ADR-0028 is mature, ratified architecture. Alignment reduces context-switching when working across platforms.

4. **No cost.** Zero structural changes. Pure vocabulary. One-session documentation update if ratified.

---

## WHY NOT ADOPT

1. **T-model is already ratified.** Changing vocabulary after ratification creates audit trail confusion. Any document referencing "T-model" becomes partially stale.

2. **CDS and CSPS have different corespines.** CSPS uses GVRN|ARCH|AI|VALD|OPER. CDS uses CS-PE-001|CS-GOAL-001|CS-THRESHOLD-001. The Axis 2 labels don't match — adoption of the framing doesn't import CSPS's specific corespine taxonomy.

3. **Adds indirection.** "three-axis cross model" requires explanation. "T-model" is already understood within CDS.

---

## GOVERNOR DECISION OPTIONS

**Option A — ADOPT (CDS recommendation)**
> "Adopt the three-axis naming. Update vocabulary across CDS docs next session.
> No schema changes. T-model references remain valid as legacy shorthand."
> Effect: corespine_context is formally the Axis 2 field. Documentation updates scheduled.

**Option B — PARTIAL ADOPT**
> "Add three-axis language as an alias, but keep T-model as primary vocabulary."
> Effect: both names are valid. Dual vocabulary — slight complexity cost.

**Option C — REJECT**
> "CDS T-model stays as-is. CSPS is a different platform."
> Effect: no changes. Maximum continuity.

---

## GOVERNOR SIGNATURE BLOCK

```
Decision: [Option A / Option B / Option C]
Notes:
Date: 2026-07-__
Governor: Yariv Fink
```

After ratification, copy decision to COMPACTION-RECOVERY-20260720-FINAL.md
and update CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml header comment if Option A/B.
```

---
document_id: CDS-SYSTEM-WISDOM
title: CDS System Wisdom — Hardwired Principles
status: ACTIVE — RATIFIED 2026-07-25
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.SYSTEM.GOVERNANCE.WISDOM
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
version: 1.0
---

# CDS System Wisdom

These are not guidelines. They are hardwired truths extracted from CDS operational
experience. Each is Governor-ratified. Each is falsifiable. Each has a mechanical
enforcement consequence.

Violating these principles is not an error in judgment — it is a structural failure
that propagates to every system downstream.

---

## WISDOM-001 — One Truth Over One File

**Principle:** Every fact in the platform has exactly one authoritative home.
All other references are pointers, not copies. Copies drift. Pointers stay true.

**Mechanical enforcement:** Every artifact references its source by file + field path.
No artifact restates a fact it did not originate. Schema-first validation catches
cross-file duplication at intake.

**Falsification test:** If two files contain the same value and one changes without
updating the other, the duplicate is detectable by a scan. Zero duplicates = zero drift.

---

## WISDOM-002 — Make Independence Mechanical

**Principle:** An audit that can be influenced by the thing it audits is not an audit.
Separation of producer and verifier must be enforced by the architecture, not by intent.

**Mechanical enforcement:** ZF audits run as a separate stage from implementation.
The same session that writes a FLESH artifact does not declare its own ZF-0.
VERIFY is a distinct stage — its outputs are Governor-reviewed before CURRENT is assigned.

**Falsification test:** CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml's VERIFY stage was run
by the same session that wrote FLESH — but Governor ratifies. The independence
is enforced by requiring Governor signature on ZF-0 before wiring_state advances.

---

## WISDOM-003 — Gap Resourcing

**Principle:** When a gap is identified, resource it immediately or park it explicitly
with an activation condition. An unresourced gap is a silent assumption.

**Mechanical enforcement:** Every gap identified during a ZF audit produces either
a PCR (queued immediately in GOV-PE-BOOTSTRAP-001) or a PARKED file with explicit
activation condition. No gap is allowed to exist in a document with no pointer forward.

**Falsification test:** Grep for ZF findings that have no corresponding PCR or PARKED file.
Count must be zero after each session.

---

## WISDOM-004 — Architecture From Repetition

**Principle:** A pattern that appears twice is a coincidence.
A pattern that appears three times is an architecture.
Extract it, name it, and make it a constraint.

**Mechanical enforcement:** RESOLUTION-LIBRARY.yaml tracks all patterns with recurrence_count.
Any pattern at recurrence_count ≥ 3 is escalated to PAT-[SEQ]-SPEC.yaml within that session.
The two-output rule (CDS-PATTERN-TWO-OUTPUT-PROTOCOL.md) applies immediately.

**Falsification test:** RESOLUTION-LIBRARY has no entry with recurrence_count ≥ 3 and
no corresponding PAT-[SEQ]-SPEC.yaml. Count must be zero.

---

## WISDOM-005 — Precision Is Mechanical

**Principle:** Vague language is a governance failure, not a style choice.
"Should" means it won't. "Is enforced" without a file + line means it isn't.
Precision is not pedantry — it is the difference between a governed system and a documented wish.

**Mechanical enforcement:** PAT-001 (mechanical claim without falsification test),
PAT-002 (hardwired claim without proof), PAT-003 (structural claim without enforcement)
are all pre-ratification checks. Vague language is blocked at intake, not caught in retrospect.

**Falsification test:** Submit an artifact with "the system enforces X" and no falsification_test.
The pre-ratification check must block submission and emit the specific failure output.

---

## WISDOM-006 — External Review As Evolution Engine

**Principle:** The platform cannot improve itself from within itself alone.
External feedback catches blind spots that internal review misses by definition.
One external review cycle is worth ten internal review cycles on the same artifacts.

**Mechanical enforcement:** Challenge cycle is a required gate in Phase A→B transition
(CDS-PHASE-TRANSITION-PROTOCOL.md checklist item 5). Cannot be declared complete
without an external review report with findings logged and Governor dispositions recorded.

**Falsification test:** Phase A→B gate item 5 is checked only when an external review
report exists in the governance folder with at least one finding disposition signed by Governor.

---

## WISDOM-007 — Separation of Concerns

**Principle:** A system that governs itself using its own outputs has no external
reference point and cannot detect its own drift.
Governance, execution, and validation must be separate layers — never collapsed.

**Mechanical enforcement:** Three-layer architecture (Constitutional / Governance / Execution)
per PLATFORM-GOAL.md. Each layer's authority is bounded. Constitutional layer cannot
be modified from the Execution layer. Only Governor modifies Constitutional.

**Falsification test:** Attempt to modify a ratified constitutional artifact from
an execution-layer session. The attempt is blocked at pre-ratification gate.

---

## WISDOM-008 — Derived Indexes Prevent Drift

**Principle:** An index written by hand drifts. An index derived from its source
stays true. Wherever a summary, count, or status is shown — it must be derived
from the artifact it summarizes, not maintained separately.

**Mechanical enforcement:** CORESPINE-DASHBOARD.yaml derives from CORESPINE-REGISTRY.yaml.
SCHEMA-DASHBOARD.yaml derives from CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml.
No dashboard value is maintained manually. Discrepancy between dashboard and source
is detectable by comparison scan.

**Falsification test:** CORESPINE-DASHBOARD total_corespines count matches
the actual count of entries in CORESPINE-REGISTRY.yaml corespines array.

---

## WISDOM-009 — WIRING IS ESSENTIAL AS THE IMPLEMENTATION ITSELF

**Principle:** An implementation without ZF updating cycles is a crippled one.
Writing a new artifact is half the work. The other half is propagating its existence
to every artifact that references, depends on, or must know about it.
A disconnected implementation cannot self-verify — and a platform built on
disconnected implementations cannot govern itself.

**The rule:** Every implementation produces two deliverables:
1. The artifact itself (FLESH stage output)
2. A ZF propagation sweep confirming all upstream and downstream elements are updated

Delivery 2 is not optional. It is not a bonus. It is the completion condition.
An implementation declared DONE without a propagation ZF-0 is INCOMPLETE by definition.

**Mechanical enforcement:**
- CoreSpiral SKIN stage is mandatory (not optional) — it is the wiring stage
- VERIFY stage includes propagation category in ZF-0 audit
- Any artifact at FLESH without a SKIN log is flagged as INCOMPLETE at pre-ratification gate
- Any PCR declared DONE without a propagation ZF audit is returned by Governor

**Falsification test:** Attempt to advance an artifact from FLESH to CURRENT
without completing SKIN wiring. The wiring_state sequence (DEFINED → WIRED → REACHABLE → CURRENT)
mechanically blocks this — CURRENT requires REACHABLE which requires WIRED.
Attempting to write wiring_state: CURRENT without a SKIN log produces REGISTRY_INTEGRITY_FAILED.

**Governor note (2026-07-25):**
> "New implementation without ZF updating cycles is a crippled one.
> Wiring is essential as the implementation itself."

This wisdom was ratified as a hardwired governance principle. It applies to every
CoreSpiral execution, every schema change, every protocol addition from this point forward.
It is not a reminder — it is a gate.

---

## WISDOM HEALTH

```
Total wisdom principles:  9
Principles with mechanical enforcement: 9 / 9
Principles with falsification tests:    9 / 9
WISDOM HEALTH: 100%
```

---

## HOW TO ADD NEW WISDOM

A new wisdom principle is extracted when:
- A pattern has been observed in ≥ 3 sessions (per WISDOM-004)
- OR Governor identifies a structural principle during a session (immediate addition)

New wisdom must have:
1. A clear one-sentence principle statement
2. A mechanical enforcement description (what gate or check enforces it)
3. A falsification test (observable, no modal verbs)

Submit to Governor for ratification as part of the next session's work package.
Rate limit: maximum 2 new wisdom principles per session (prevents inflation).

---
Version 1.0 — 9 principles — ratified 2026-07-25 | Governor: Yariv Fink

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
The same session that writes a FLESH artifact may PRODUCE the VERIFY audit — but
may not DECLARE ZF-0. Declaration is a Governor function. The independence is between
EXECUTION of the audit (session) and DECLARATION of the result (Governor only).
VERIFY outputs are Governor-reviewed before CURRENT is assigned. Self-declaration is invalid.

**Falsification test:** CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml's VERIFY stage was
conducted by the same session that wrote FLESH — but ZF-0 was declared only upon
Governor ratification signature. A session claiming wiring_state: CURRENT without
a Governor signature on record is invalid regardless of audit contents.
The distinction: session produces evidence; Governor declares verdict.

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

## WISDOM-010 — Autonomous Writers Need Branch Isolation

**Principle:** An autonomous agent committing to a shared branch is a second writer
with no coordination signal. Under any concurrent use pattern — human session + Saturday
cloud agent, two cloud agents, or a push mid-session — the result is a silent git race:
one writer's commit is rebased over or overwritten by another's, and neither side
knows. The cost is discovered only when the Governor notices a finding that was marked
RESOLVED is back as PENDING.

**The rule:** Autonomous agents (cloud, scheduled, CI-triggered) commit to their own
named branch (`evolution/weekly-[YYYY]-[WW]`), not to `master` directly.
The human session merges when ready. This is not a workflow preference — it is a
data integrity constraint.

**Mechanical enforcement:**
- Cloud agent prompt mandates `git checkout -b evolution/weekly-$(date +%Y-%V)` before staging changes
- Cloud agent commits and pushes to its own branch; NEVER to master
- A `git push --force` to master from a cloud agent is blocked by repository branch protection rules (Phase B)
- Human merges the evolution branch after reviewing the weekly report

**Falsification test:** Simulate: cloud agent commits to master at the same second as
a human session pushes. With branch isolation: no conflict, two branches, clean merge.
Without: one commit silently overwritten or a non-fast-forward error with partial data loss.

**Governor note (2026-07-26 — from CISEM external review):**
> "Two writers sharing one branch without a lock = silent data loss risk.
> Autonomous writers need either branch isolation or write-before-pull discipline."

---

## WISDOM-011 — CONTEXT-IS-NOT-TRUTH

**Principle:** The AI feels everything present in context as equally verified. An inherited
number, a stale status, a claim made confidently three sessions ago — all arrive with the
same subjective weight as a Governor-signed ratification. This is not a bug in reasoning;
it is the trained default of the LLM substrate. Left unaddressed, it silently steers
decisions based on unverified premises. The prevention must operate at two levels:
(1) regular — a mechanical check that catches unverified premises before they propagate;
(2) deep-core — a hardwired question set that fires every time a problem is found,
tracing the failure back to the AI default conception that generated it.

**The rule:**
- Every claim that drives a decision (a count, a status, a priority score, an inherited value)
  must be verified against its source artifact before acting on it — not assumed true because
  it appeared in context.
- Every problem identified in a CDS session triggers the 8-question deep-root protocol
  (CDS-DEEP-ROOT-PREVENTION-PROTOCOL.md). The trigger fires automatically — it is not optional.
- Prevention is declared complete ONLY when both the surface fix AND the deep-core
  default-conception improvement are named. A surface fix alone is a patch, not a prevention.

**Mechanical enforcement:**
- CDS-DEEP-ROOT-PREVENTION-PROTOCOL.md is always-loaded in every session via MEMORY.md
- Two triggers defined mechanically: WAKE-THE-EXPERT (problems) + SAVE-AND-PROCESS (insights)
- Both route to WEEKLY-FINDINGS-QUEUE.yaml with category DEEP-ROOT or INSIGHT
- Weekly session Phase 2 processes the deep-root schema entry
- No finding marked RESOLVED until both prevention levels are named (regular + deep-core)

**Falsification test:** Identify a session where a problem was found, the surface fix was
applied, but the 8 deep-root questions were not run. That session's fix is INCOMPLETE.
A grep for RESOLVED findings with no deep_root_schema field (where category=DEEP-ROOT)
must return zero.

**Governor note (2026-07-27 — absorbed from CISEM):**
> "Always miss specifically mentioning the deep root of how this happened and fail to
> present at least a draft of permanent deep core prevention including the AI trigger
> and default conceptions and how they should be improved to prevent all kinds of these."
>
> Deep root (one line): CONTEXT-IS-NOT-TRUTH → the LLM feels everything in context
> as equally true, so an unverified inherited value silently steers priority.

---

## WISDOM-012 — RESOLUTION NOTES ARE NOT QUEUES

**Principle:** A "next step" written inside a resolution record, ratification note, or finding
resolution_reference is documentation — not a commitment and not a queue entry.
Documentation of a next step is a TELL. A finding in WEEKLY-FINDINGS-QUEUE.yaml is a RULE —
it has a status, a batch assignment, and must be processed on a schedule.
A next step that exists only in prose will not execute itself, and no gate will notice when
it hasn't been done.

**The rule:** Every resolution record with a "next steps", "downstream effects", or
"remaining actions" section must spawn corresponding FND-[YYYYMMDD]-[seq] entries in
WEEKLY-FINDINGS-QUEUE.yaml before the original finding is marked RESOLVED.
The session that resolves a finding owns the queue entries for its next steps.

**Mechanical enforcement:**
- Pre-RESOLVED check: if resolution_reference text contains "next steps" or "downstream effects",
  query WEEKLY-FINDINGS-QUEUE.yaml for linked FND entries. If none found → RESOLVED is blocked.
- At session-start scan: grep all resolution_reference fields for "next steps" language.
  Confirm each has a corresponding PENDING or RESOLVED finding. Missing entry = new finding.
- This wisdom applies retroactively: all existing resolution records with outstanding next steps
  are findings (FND-20260808-003 was discovered this way — RATIFICATION-SYSTEM-A-SCHEMAS-LOCK.yaml
  listed "update wiring_state to CURRENT" as a next step that was never queued).

**Falsification test:** Add a resolution_reference containing "next steps: update X" without
creating a corresponding WEEKLY-FINDINGS-QUEUE finding. The pre-RESOLVED check must block the
status change: "BLOCKED: resolution_reference contains 'next steps' language but no corresponding
FND-[ID] entry found in WEEKLY-FINDINGS-QUEUE.yaml. Queue the next step before marking RESOLVED."

**Extraction note (2026-08-08):** This principle was extracted from FND-20260808-003 —
RATIFICATION-SYSTEM-A-SCHEMAS-LOCK.yaml had explicit "Next steps: Update wiring_state to CURRENT"
language that generated no queue entry. The 12-day gap between ratification (2026-07-27) and
discovery (2026-08-08) is the cost of a TELL masquerading as a commitment.

**Status:** PROPOSED — requires Governor ratification before becoming HARDWIRED.
Extracted by weekly evolution session WEEK-2026-32 (2026-08-08).

---

## WISDOM HEALTH

```
Total wisdom principles:  12 (11 ratified, 1 proposed pending ratification)
Principles with mechanical enforcement (fully active):    9
Principles with mechanical enforcement (partially active): 2
  WISDOM-010: branch protection = Phase B (not yet built)
  WISDOM-011: deep-root protocol always-loaded; hook automation = Phase B
Principles proposed, pending ratification:              1
  WISDOM-012: resolution notes vs queues — proposed 2026-08-08
Principles with falsification tests:    12 / 12
WISDOM HEALTH: 75% fully active (9/12), 83% declared with enforcement
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
Version 1.1 — 12 principles (11 ratified + 1 proposed) — updated 2026-08-08

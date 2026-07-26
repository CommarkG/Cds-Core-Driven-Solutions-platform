---
document_id: CDS-SELF-EVOLUTION-PROTOCOL-001
title: CDS Self-Evolution Protocol — Governance Hardening Cycle
status: RATIFIED — 2026-07-20
superseded_note: "The 5-step enrich cycle defined here is ENHANCED (not replaced) by CDS-WEEKLY-EVOLUTION-ENGINE.md. The Weekly Engine implements this protocol mechanically as a Saturday cloud agent (Layer 5). Use CDS-WEEKLY-EVOLUTION-ENGINE.md as the operational reference; use this document for the conceptual foundation of the cycle."
relationship_to_weekly_engine: FOUNDATION_DOCUMENT
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.GOVERNANCE.PROTOCOL.SELF_EVOLUTION
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Self-Evolution Protocol

CDS governance gets harder to violate over time. Not by adding more rules from theory.
By encoding actual violations as mechanical checks. This protocol governs how.

The AI never self-enacts. The AI identifies, proposes, and measures.
The Governor decides what is encoded. Ratified checks are then mechanical — not optional.

---

## When This Protocol Runs

**Triggered after every:**
- Platform Expert governance audit
- Consolidation Expert pattern harvest
- Phase transition verification
- Any session where 2 or more governance violations are identified

**Rate limit:** Maximum once per session. If triggered multiple times in one session,
the most recent trigger runs. Previous triggers in the same session are discarded.

**Minimum frequency:** Once per phase. If no trigger fires during a phase, the protocol
runs at phase-end regardless.

---

## The 5-Step Enrich Cycle

### Step 1 — IDENTIFY FAILURE PATTERNS

Scan the session for governance violations. Apply the recurrence filter:

| Occurrence count | Classification | Action |
|-----------------|----------------|--------|
| 1 | NOISE | Noted in session log. Not encoded. May become CANDIDATE if it recurs. |
| 2 | CANDIDATE | Escalated to encoding proposal in next Enrich cycle. |
| 3+ | PRIORITY | Encoding proposal is a mandatory output of this Enrich cycle. |

Output: list of recurring violation classes with occurrence count and first observed date.

---

### Step 2 — PROPOSE MECHANICAL ENCODING

For each CANDIDATE or PRIORITY violation, write a mechanical check specification
using the template in CDS-PATTERN-TWO-OUTPUT-PROTOCOL-001.

For each proposal, additionally state:
- **Why this violation recurs:** what in the current system allows it to happen again?
- **Why encoding prevents it:** how does the check mechanically block recurrence?
- **Why it won't false-positive:** what distinguishes a real violation from a valid edge case?

Rate limit: Maximum 3 proposals generated per session.
Proposals beyond 3 are queued. Queue is maintained in GOV-PE-BOOTSTRAP-001
as "Pending Enrich Proposals." Processed FIFO in subsequent sessions.

---

### Step 3 — GOVERNOR RATIFICATION (PROPOSE THEN RATIFY — NEVER SELF-ENACT)

Proposals are submitted to the Governor. The Governor decides:

| Decision | What It Means | Next Action |
|----------|---------------|-------------|
| RATIFY | Check is approved as specified | Check moves to WIRED; added to implementation queue |
| MODIFY | Concept correct; specification needs adjustment | AI revises and resubmits next session |
| REJECT | Violation is real; check approach is wrong | Park proposal; try different approach in next Enrich cycle |
| PARK | Violation is real; encoding not yet the right response | Queue for Phase C or later; note the reasoning |

The Governor's decision is final. AI does not appeal. AI records the decision and
moves to the next proposal.

---

### Step 4 — ENCODE

RATIFIED checks move to WIRED status and are added to GOV-PE-BOOTSTRAP-001
implementation queue. Implementation is scheduled per PE score.

**Implementation means the check runs in a real session and produces a real result.**
Not documented. Not described. Running.

Advancement to ACTIVE:
- Check runs in 2 consecutive sessions
- No false positives in either session
- No missed detections (known violation of this type did not slip past)
- Consolidated Expert confirms advancement
- Status → ACTIVE

---

### Step 5 — MEASURE

**Track per session:**

```
EVOLUTION HEALTH = (Violations caught by ACTIVE mechanical check) /
                   (Total violations detected — mechanical + human) × 100%

GREEN:    ≥ 70% — governance is self-hardening at scale
YELLOW:   40-69% — mechanical layer catching its share; growing
RED:      < 40% — too many violations reaching human review
```

**Track the trend, not just the number.**
EVOLUTION HEALTH must rise across phases. A flat metric means new violations
are appearing at the same rate checks are being encoded — no net hardening.
A declining metric means the check backlog is growing or false positives are suppressing
check activation.

---

## Integration With Pattern Archive

```
PATTERN ARCHIVE                     SELF-EVOLUTION PROTOCOL
     ↓                                      ↓
Stores WHAT was observed     ↔    Encodes HOW it is prevented
Output 1 (statement)         ↔    Output 2 (mechanical check)
ARCHIVE HEALTH metric        ↔    EVOLUTION HEALTH metric
```

The two systems are the same loop viewed from two angles.

ARCHIVE HEALTH measures what has been observed and documented.
EVOLUTION HEALTH measures what has been mechanically prevented.

A platform where ARCHIVE HEALTH is high but EVOLUTION HEALTH is low has excellent
memory and poor immunity. It knows its history but keeps repeating it.

Target state: both metrics GREEN and rising. That is the platform goal made measurable:
"everything self-verifies" expressed as a number.

---

## Governor Throughput Constraint

The self-evolution cycle generates at most 3 proposals per session.
The Governor is expected to process proposals within 2 sessions of generation.

If Governor throughput falls behind:
- Proposals do not stack indefinitely
- Oldest proposals are reviewed first (FIFO)
- If a proposal sits unreviewed for 3 sessions: it is automatically escalated
  (flagged in GOV-PE-BOOTSTRAP-001 as STALE_PROPOSAL)
- Stale proposals are reviewed at next available Governor session before new
  proposals are accepted

**Why this constraint exists:**
If proposals accumulate faster than ratification clears them, the proposal queue becomes
a governance backlog. A backlog means violations are documented but not prevented —
which is documentation theater, not self-evolution.

The constraint forces throughput parity: generation rate ≤ ratification rate.

---

## Phase Evolution Targets

| Phase | EVOLUTION HEALTH Target | What Drives It |
|-------|------------------------|----------------|
| Phase A (current) | Establish baseline — measure only | No ACTIVE checks yet; build the measurement system |
| Phase B | ≥ 40% (YELLOW) | First batch of checks reach ACTIVE status |
| Phase C | ≥ 60% (YELLOW→GREEN) | Second and third batches active; pattern from Phase B encoded |
| Phase D | ≥ 70% (GREEN) | Platform is self-hardening; human review catches only novel violations |

Phase D target of ≥ 70% is the operational expression of "everything self-verifies."
Human review at Phase D is the exception, not the primary defense.

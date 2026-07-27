---
document_id: CDS-WEEKLY-EVOLUTION-ENGINE
title: CDS Weekly Evolution Engine — Platform-Wide Permanent Self-Improvement Loop
status: RATIFIED — 2026-07-25
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.SYSTEM.GOVERNANCE.EVOLUTION
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
version: 1.0
trigger: AUTOMATIC — cloud agent every Saturday 07:00 UTC + session-start scan
governor_signature: "Weekly evolution engine is active. It runs forever."
governor_signed_by: Yariv Fink
governor_signed_date: 2026-07-25
---

# CDS Weekly Evolution Engine

## THE PROBLEM THIS SOLVES

Every session, improvements are made. Problems are found. Wisdom is extracted.
But without a permanent accumulation system, each session starts cold.
Improvements applied locally don't propagate. Patterns found in one area don't
prevent the same failure in another. Insights die in session compactions.

The result: the platform improves in isolated patches, not as a whole.

**This engine makes improvement permanent, platform-wide, and automatic.**

---

## THE ARCHITECTURE

```
SESSION-START SCAN ──→ FINDINGS-QUEUE.yaml ──→ WEEKLY SESSION
       ↑                      │                      │
       │              PE-score + batch               │
       │                      ↓                      ↓
       └──── FEEDBACK ←── ZF-0 VERIFY ←── APPLY + PROPAGATE
                                                     │
                              ┌──────────────────────┘
                              ↓
              CDS-SYSTEM-WISDOM + PATTERN ARCHIVE + CORESPINE CONSTRAINTS
                              (permanently hardwired into platform DNA)
```

---

## THE 5 PERMANENT LAYERS

### LAYER 1 — SESSION-START PLATFORM SCAN (hardwired, every session)

**Trigger:** Every CDS session open (before any work begins).
**What it does:** Scans the platform for new findings since last session.

Scan categories (in order):
1. **New violations** — any artifact added since last session missing required fields
   (falsification_test, enforcement_code, corespine_context)
2. **Stale status** — any wiring_state or ratification_state that should have advanced
3. **Orphan references** — IDs referenced that don't exist in registry
4. **Pattern recurrence** — RESOLUTION-LIBRARY entries with recurrence_count ≥ 3
   and no PAT-[SEQ]-SPEC.yaml
5. **Propagation gaps** — new implementations without a ZF propagation audit on record
6. **Wisdom candidates** — session insights not yet extracted to CDS-SYSTEM-WISDOM.md

**Output:** Adds findings to `memory/WEEKLY-FINDINGS-QUEUE.yaml` with PE-score estimate.
**Time cost:** < 5 minutes per session. Does not block session work.

**Falsification test:** `memory/WEEKLY-FINDINGS-QUEUE.yaml` updated_at timestamp matches
today's date after session-start scan. If timestamp is older than 7 days, scan was skipped
→ WARN: evolution engine not running.

---

### LAYER 2 — FINDINGS QUEUE (persistent accumulator)

**File:** `memory/WEEKLY-FINDINGS-QUEUE.yaml`
**What it is:** The permanent registry of all findings pending weekly processing.
**Survives:** Compactions, session boundaries, model changes.

Every finding has:
```yaml
finding_id: FND-[YYYYMMDD]-[SEQ]
category: [VIOLATION | STALE | ORPHAN | PATTERN | PROPAGATION | WISDOM | OPTIMIZATION]
description: "[One specific sentence — what was found]"
affected_artifacts: ["[file1]", "[file2]"]
pe_score: [float — calculated from urgency, impact, effort]
severity: [CRITICAL | HIGH | MEDIUM | LOW]
batch_assignment: [WEEK-[YYYY]-[WW] — assigned during weekly triage]
status: [PENDING | BATCHED | IN_PROGRESS | RESOLVED | DEFERRED]
resolution_reference: "[file created when resolved — or null]"
propagation_required: [true | false]
propagation_verified: [true | false | null]
added_session: "[YYYY-MM-DD]"
```

**Queue health rule:** No finding stays PENDING for more than 3 weekly sessions
without Governor disposition (BATCHED, DEFERRED, or RESOLVED).
If it does → escalate to Governor brief.

---

### LAYER 3 — WEEKLY SESSION PROTOCOL (every Saturday)

**Trigger:** Cloud agent fires every Saturday 07:00 UTC (RemoteTrigger — see Layer 5).
Also manually triggerable: "run weekly evolution session."

**Session structure (batched, calm, PE-ordered):**

```
PHASE 0 — GRAPHIFY MODE B EXTRACT (5 min — runs first, every Saturday session)
  graphify extract . --include "*.md,*.yaml" --backend claude
  Wall check: verify only graphify-out/ changed
  Regenerate dependency-graph.yaml Layer 2 section from governance query results
  Commit updated dependency-graph.yaml if changed
  (This is the weekly run of CDS-GRAPHIFY-MANDATORY-PROTOCOL.md Mode B)

PHASE 1 — TRIAGE (10 min)
  Read WEEKLY-FINDINGS-QUEUE.yaml
  Review all PENDING findings from this week
  Assign to batches: WEEK-[YYYY]-[WW] based on PE score
  Rate limit: max 8 findings processed per weekly session
  (Prevents overwhelm — queue runs down calmly over time)

PHASE 2 — PROCESS BATCH (30-45 min)
  For each finding in this week's batch (highest PE first):
  1. Root cause analysis (1-2 sentences)
  2. Solution design (what changes, where)
  3. ZF-0 check on the solution itself
  4. APPLY the solution to the primary artifact
  5. PROPAGATION SWEEP — identify all artifacts that must also change
  6. Apply changes platform-wide
  7. ZF-0 propagation audit (mandatory per WISDOM-009)
  8. Mark finding RESOLVED + link resolution file

PHASE 3 — EXTRACT PERMANENCE (10 min)
  From this week's resolved findings, extract:
  - New patterns (recurrence_count ≥ 3 → PAT-[SEQ]-SPEC.yaml)
  - New wisdom principles (structural insight → CDS-SYSTEM-WISDOM.md)
  - New corespine constraints (governance gap → CORESPINE-REGISTRY.yaml)
  - New prevention patterns (into RESOLUTION-LIBRARY.yaml)

  Rate limits:
  - Max 3 new pattern specs per session
  - Max 2 new wisdom principles per session
  - Max 1 new corespine constraint per session (prevents registry inflation)

PHASE 4 — METRICS + HEALTH (5 min)
  Update WEEKLY-EVOLUTION-REPORT-[YYYY]-[WW].md:
  - ARCHIVE HEALTH (% patterns with ACTIVE checks)
  - EVOLUTION HEALTH (% of resolved findings with platform-wide propagation)
  - Queue depth (total PENDING findings)
  - Findings added this week vs resolved this week (trend)

PHASE 5 — GOVERNOR BRIEF (if needed)
  If any finding requires a Governor decision → brief in WEEKLY-FINDINGS-QUEUE.yaml
  Governor reviews brief at next available session
  No finding escalated more than twice without resolution
```

---

### LAYER 4 — PLATFORM-WIDE PROPAGATION RULE (hardwired)

Every solution resolved in the weekly session must be evaluated for platform-wide impact.
Local fixes that solve a problem in one place but leave the same problem elsewhere
are INCOMPLETE resolutions.

**The propagation checklist (runs on every RESOLVED finding):**

```
□ Does this solution apply to OTHER artifacts beyond the primary one?
□ Does it change a constraint that other artifacts reference?
□ Does it create a new pattern that prevents recurrence?
□ Does it reveal a gap in a corespine constraint?
□ Does it qualify as system wisdom?

If ANY box is checked → propagation sweep is MANDATORY before RESOLVED status.
```

**Mechanical enforcement:** A finding cannot be marked RESOLVED in the queue
until propagation_verified = true OR propagation_required = false (documented reason).

**Falsification test:** Grep WEEKLY-FINDINGS-QUEUE.yaml for entries where
`status: RESOLVED` AND `propagation_required: true` AND `propagation_verified: false`.
Count must be zero. Any non-zero count = incomplete resolution = EVOLUTION HEALTH penalty.

---

### LAYER 5 — AUTO-TRIGGER (cloud agent, permanent)

**Schedule:** Every Saturday 07:00 UTC (every week, forever).
**Agent:** Cloud CCR — isolated session with full CDS repo access.
**What it does:** Runs WEEKLY SESSION PROTOCOL above autonomously.
**Reports to:** Governor via email summary (finkyariv@gmail.com) — findings processed,
metrics updated, items needing Governor decision flagged.

**Additional trigger:** Session-start scan (Layer 1) fires in EVERY CDS session —
human-run or automated. This ensures findings accumulate even between Saturday sessions.

**The auto-trigger is hardwired.** It does not require manual activation.
Deactivating it requires Governor approval and a PCR.

---

## WHAT EXISTS + WHAT IS ENHANCED

| Existing | Enhancement |
|---------|-------------|
| CDS-SELF-EVOLUTION-PROTOCOL.md (5-step enrich cycle, manual) | Now auto-triggered via cloud agent + session-start scan |
| RESOLUTION-LIBRARY.yaml (pattern templates) | Now feeds WEEKLY-FINDINGS-QUEUE.yaml automatically |
| CDS-PATTERN-TWO-OUTPUT-PROTOCOL.md (two-output rule) | Now produces platform-wide propagation check on every pattern |
| CDS-SYSTEM-WISDOM.md (9 principles) | Now has a permanent input pipeline (weekly extraction) |
| PAT-001/002/003-SPEC.yaml | Now part of a continuous production line, not one-time artifacts |
| ARCHIVE HEALTH metric | Now tracked weekly in WEEKLY-EVOLUTION-REPORT-[YYYY]-[WW].md |
| EVOLUTION HEALTH metric | Now calculated as % resolved findings with propagation verified |
| ZF-0 audit | Now runs on solutions themselves, not just on the artifacts being audited |

---

## METRICS

```
ARCHIVE HEALTH    = (Patterns with ACTIVE check) / (Total patterns) × 100%
EVOLUTION HEALTH  = (Resolved findings with propagation_verified=true) /
                    (Total resolved findings with propagation_required=true) × 100%
QUEUE VELOCITY    = Findings resolved per week / Findings added per week
                    (target > 1.0 — queue shrinking)
WISDOM DENSITY    = Wisdom principles / Total sessions run
                    (rising = platform is learning faster)

GREEN state:  ARCHIVE ≥ 80%, EVOLUTION ≥ 70%, QUEUE VELOCITY ≥ 1.0
YELLOW state: Any metric below target but trending toward target
RED state:    EVOLUTION < 50% OR QUEUE VELOCITY < 0.5 for 3+ consecutive weeks
```

---

## BATCHING STRATEGY (calm, optimal throughput)

Findings are PE-scored. The weekly session takes the top 8 by PE score.
CRITICAL findings (severity) are always in next week's batch regardless of PE score.
MEDIUM/LOW findings may wait 2-3 weeks — that is by design. Calm over speed.

Queue target: 30-40 findings is healthy (full pipeline but not overwhelming).
If queue exceeds 60: Governor review — either rate of finding > rate of resolution
(scan is too aggressive) or session bandwidth is insufficient (add a second weekly slot).

---

## FALSIFICATION TEST FOR THE ENGINE ITSELF

1. `memory/WEEKLY-FINDINGS-QUEUE.yaml` exists and has an `updated_at` field.
2. After any CDS session, `updated_at` matches that session's date.
3. After a weekly session, at least 1 finding moves from PENDING to RESOLVED.
4. After a weekly session, WEEKLY-EVOLUTION-REPORT-[YYYY]-[WW].md exists for that week.
5. Any finding at `status: RESOLVED` with `propagation_required: true` has
   `propagation_verified: true` AND a `resolution_reference` pointing to an existing file.

If any of these 5 tests fails → engine is not running → WARN to Governor.

---
Ratified 2026-07-25 | Governor: Yariv Fink
"The platform improves permanently. Not per session. Permanently."

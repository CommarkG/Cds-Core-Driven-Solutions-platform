---
document_id: CDS-PATTERN-TWO-OUTPUT-PROTOCOL-001
title: CDS Pattern Archive — Two-Output Rule
status: RATIFIED — 2026-07-20
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-PE-001
schema_position: CDS.GOVERNANCE.PROTOCOL.PATTERN_ARCHIVE
platform_goal: CDS-PLATFORM-GOAL — everything self-verifies
---

# CDS Pattern Archive — Two-Output Rule

Every pattern ratified by the Governor produces two outputs. Patterns with only a
statement are INCOMPLETE and do not contribute to pattern archive health.

---

## The Rule

| Output | What It Is | Status |
|--------|-----------|--------|
| Output 1 | Pattern statement — what was observed, when, how often | STORED |
| Output 2 | Mechanical check specification — how this is detected automatically next time | DEFINED → WIRED → ACTIVE |

A pattern is COMPLETE only when Output 2 reaches ACTIVE status.
A pattern is INCOMPLETE while Output 2 is at DEFINED or WIRED.

---

## Mechanical Check Specification Template

```yaml
# One file per pattern. Named: PAT-[SEQ]-SPEC.yaml

pattern_id: PAT-[SEQ]
pattern_statement: >
  [What was observed — the recurring behavior, violation, or gap.
  Specific enough to recognize on recurrence.]
first_observed: "[Session ID or ISO date]"
recurrence_count: [integer — update when pattern recurs]
severity: "[CRITICAL / HIGH / MEDIUM / LOW]"

mechanical_check:
  trigger: >
    [When does this check run? Be specific about the activation condition.
    Examples: "before any ratification document is submitted",
    "at session-start when loading context", "when a new corespine is proposed"]
  detection: >
    [What specifically does the check look for? Observable, not interpreted.
    Examples: "no falsification_test field in proposed schema",
    "corespine_context references an ID not in CORESPINE-REGISTRY.yaml",
    "pattern_archive entry has no mechanical_check block"]
  failure_output: >
    [Exact message or state flag produced when violation is detected.
    Examples: "BLOCKED: falsification_test missing — add before ratification",
    "WARN: corespine_context DN-GOV-001 not found in registry"]
  enforcement_layer: "[pre-ratification | post-build | session-start | pre-commit | intake]"
  false_positive_risk: "[LOW / MEDIUM / HIGH]"
  false_positive_reason: >
    [If MEDIUM or HIGH: explain the scenario that could trigger a false positive
    and how to distinguish it from a real violation]

check_status: "DEFINED"   # DEFINED → WIRED → ACTIVE
ratification_reference: "[GOV-ID when Governor ratified this pattern]"
ratification_date: "[ISO date]"
wired_date: null          # Set when implementation is assigned
active_date: null         # Set when check runs in 2 consecutive sessions without false positives
consecutive_clean_sessions: 0
```

---

## Status Transitions for Output 2

| Status | Meaning | Condition to advance |
|--------|---------|---------------------|
| DEFINED | Spec is written. Not yet implemented. | Governor ratifies both outputs together |
| WIRED | Check is implemented. Running in sessions. | Assigned to implementation session; check executes |
| ACTIVE | Check is stable. No false positives. | 2 consecutive sessions: check runs, no false positives, no missed detections |

---

## Archive Health Metric

```
ARCHIVE HEALTH = (Patterns with ACTIVE check) / (Total ratified patterns) × 100%

GREEN:    ≥ 80% — platform is self-hardening
YELLOW:   50-79% — most patterns encoded; momentum good
RED:      < 50% — patterns documented but not preventing recurrence
```

**The trend matters as much as the number.** ARCHIVE HEALTH rising each session = learning.
ARCHIVE HEALTH flat or declining = patterns are being added faster than checks are being activated.

---

## Governance Rules

### For new patterns (from 2026-07-20 onward):
1. Consolidation Expert identifies a new pattern
2. Consolidation Expert writes Output 1 (statement) AND Output 2 (check spec) together
3. Both go to Governor for ratification as one package
4. Ratification covers both outputs — not just the statement
5. Pattern is assigned PAT-[SEQ] ID and enters DEFINED state
6. Implementation of the check is added to GOV-PE-BOOTSTRAP-001 queue

### For existing patterns (retrofit):
The Consolidation Expert is assigned the retrofit task:
1. List all patterns currently in archive without an Output 2
2. Write mechanical check specifications for each (highest recurrence first)
3. Submit batches of 3 to Governor per session (rate limit — see Self-Evolution Protocol)
4. Governor ratifies or returns for revision
5. Approved specs move to WIRED when implementation slot is assigned

### Rate limit:
Maximum 3 new pattern specifications submitted per session. Prevents proposal queue overflow.
Queue of pending specifications is maintained in GOV-PE-BOOTSTRAP-001.

---

## What a Healthy Archive Looks Like

A healthy pattern archive gets **quieter** over time.

Session N: 8 governance violations flagged by human review.
Session N+10: 3 flagged by human review (5 caught by ACTIVE mechanical checks before they arrived).
Session N+20: 1 flagged by human review.

The human review catches novel violations — genuinely new patterns that no check yet covers.
The mechanical layer handles everything it has seen before. Division of labor is enforced
by architecture, not by intention.

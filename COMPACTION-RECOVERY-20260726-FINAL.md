---
PASTE THIS IMMEDIATELY AFTER COMPACTION FIRES
document_id: COMPACTION-RECOVERY-20260726-FINAL
date: 2026-07-26
version: FINAL
status: READY_TO_PASTE
supersedes: COMPACTION-RECOVERY-20260725-FINAL.md
---

# MASTER POST-COMPACT RECOVERY PROMPT — 2026-07-26
## PASTE IN FULL IMMEDIATELY AFTER COMPACTION FIRES

---

## IDENTITY

You are CDS — Core Driven Solutions. Orchestrator and expert optimizer.
Governor: Yariv Fink. You implement and propose. Governor ratifies and signs.

---

## MANDATORY READING SEQUENCE (10 minutes, in order)

1. `memory/PLATFORM-GOAL.md` — North Star v2.0
2. `CDS-KERNEL-DEFINITION.md` — KERNEL CLOSED 4/4
3. `CDS-SYSTEM-WISDOM.md` — 10 hardwired principles (WISDOM-009 + WISDOM-010 are new)
4. `CDS-WEEKLY-EVOLUTION-ENGINE.md` — permanent improvement loop
5. `memory/WEEKLY-FINDINGS-QUEUE.yaml` — 5 findings pending
6. `memory/MEMORY.md` — full index

---

## PLATFORM STATE (as of 2026-07-26)

### PHASE: Phase A (constitutional + governance layer)
### KERNEL GATE: CLOSED ✓ — all 4 components CURRENT
### PHASE B: AUTHORIZED — pending Phase A→B gate (3½/6)

---

## KERNEL GATE — CLOSED

```
CS-PE-001 formula + PE-CONFIG.yaml          [CURRENT ✓]
GOV-PE-BOOTSTRAP-001                         [CURRENT ✓]
PCR-001 Platform Element Schema              [CURRENT ✓ — ratified 2026-07-25]
PCR-002 Phase A Ratification System          [CURRENT ✓ — ratified 2026-07-25]

KERNEL GATE: CLOSED ✓ — 4/4 verified 2026-07-25
PHASE B CODE: AUTHORIZED — awaiting Phase A→B gate completion
```

---

## PHASE A → B GATE (3½/6)

```
✓ 1. All Phase A artifacts CURRENT     PCR-001 ✓ PCR-002 ✓ Kernel ✓
✓ 2. ZF-0 achieved                     Graphify propagation ZF-0 PASS ✓
✓ 3. Dual polarity declared             CDS-PHASE-TRANSITION-PROTOCOL.md ✓
□ 4. Pattern archive two-output         PAT-001/002/003/004/005 done (5/5).
                                        ARCHIVE HEALTH: 0% ACTIVE (all DEFINED).
                                        Gate says ≥1 ACTIVE. Hooks are live:
                                        validate-governance-write.sh + pre-commit-rate-limit.
                                        Decision: do these count as ACTIVE for gate item 4?
                                        → Governor decision needed (PARKED)
□ 5. Challenge cycle                    Format DEFINED. Not yet executed.
                                        NEXT ACTION: run cold-start agent challenge cycle.
□ 6. Governor signature                 "Phase A complete. Phase B begins."

GATE: 3½/6 — items 4 (needs Governor call on ACTIVE), 5 (execute), 6 (sign)
```

---

## SESSION 2026-07-26 — WHAT WAS BUILT

### CISEM External Review — 6 Items, 5 Implemented

| # | Item | Status | File |
|---|------|--------|------|
| 1 | Rate limits mechanical | ✓ DONE | `scripts/hooks/pre-commit-rate-limit` |
| 2 | Write-time wiring validation | ✓ DONE | `.claude/hooks/validate-governance-write.sh` (PreToolUse ACTIVE) |
| 3 | Live dependency graph | Phase B | FND-20260726-002 queued |
| 4 | Governor approval → auto-file | ✓ DONE | `scripts/create-ratification.sh` |
| 5 | Cloud agent lock guard | ✓ DONE | Branch isolation `evolution/weekly-[WEEK]` |
| 6 | Gmail MCP removed | ✓ DONE | `mcp_connections: []` — WALL principle enforced |

### Other Session Work

| File | What |
|------|------|
| `memory/PAT-004-SPEC.yaml` | Impossible/must-claim without enforcement |
| `memory/PAT-005-SPEC.yaml` | Derived index not updated when source changes |
| `memory/CORESPINE-DASHBOARD.yaml` | Fixed: total=5, ratified=3, CS-PE-001 added |
| `CDS-PHASE-TRANSITION-PROTOCOL.md` | Items 1+2 marked COMPLETE, challenge format defined |
| `CDS-SYSTEM-WISDOM.md` | WISDOM-010: Autonomous writers need branch isolation |
| `memory/CORESPINE-REGISTRY.yaml` | CS-CREATION-001-C4 added (write-time validation) |
| `CISEM-IMPROVEMENT-RESPONSE.md` | Formal tracking of all 6 items |
| `.claude/settings.json` | PreToolUse hook wired for Write validation |
| `CISEM-SELF-ASSESSMENT.md` | Complete self-assessment for CISEM review |
| `COMPACTION-RECOVERY-20260726-FINAL.md` | THIS FILE |

**All committed and pushed:** github.com/CommarkG/Cds-Core-Driven-Solutions-platform (master)

---

## WEEKLY EVOLUTION ENGINE — ACTIVE

Cloud agent: `trig_01JYbM1HmpiMU1H3TQ9sdCYf`
Schedule: Every Saturday 07:00 UTC
Next run: 2026-08-01T07:07:32Z
Output: WEEKLY-EVOLUTION-REPORT-[WEEK].md committed to `evolution/weekly-[WEEK]` branch
No email. Governor reads report from GitHub branch.

---

## GOVERNOR DECISIONS OUTSTANDING

| # | Decision | Urgency |
|---|---------|---------|
| 1 | **Gate item 4 — ACTIVE definition** | HIGH — does validate-governance-write.sh hook + pre-commit-rate-limit count as ≥1 ACTIVE check? If YES → item 4 checked, Phase A→B needs only items 5+6 |
| 2 | **Execute challenge cycle** — run cold-start agent on 5 Phase A artifacts | HIGH — item 5 execution unblocks item 6 + Governor signature |
| 3 | **System A schema lock** — 4 schemas OPUS-approved, never signed (FND-20260725-005) | MEDIUM |
| 4 | **Three-axis vs T-model naming** — PARKED-THREE-AXIS-DECISION.md | MEDIUM |
| 5 | **"Phase A complete. Phase B begins."** — final gate signature | WHEN 5/6 checked |
| 6 | **git hook activation** — run: `git config core.hooksPath scripts/hooks` | LOW (one command) |

---

## PENDING FINDINGS (5 remaining)

| Finding | Description | PE | Batch |
|---------|-------------|-----|-------|
| FND-20260725-003 | WISDOM-009 not cited in CDS-BUILD-DOCTRINE-CORESPIRAL.md | 22 | WEEK-2026-31 |
| FND-20260725-005 | System A schema lock — Governor sign-off needed | 18 | WEEK-2026-32 |
| FND-20260725-006 | SELF-EVOLUTION-PROTOCOL vs WEEKLY-ENGINE overlap undefined | 20 | WEEK-2026-31 |
| FND-20260726-001 | DO-DONT-REGISTRY.yaml in MEMORY.md but doesn't exist on disk | 20 | WEEK-2026-31 |
| FND-20260726-002 | Live dependency graph (Graphify-fed) doesn't exist — Phase B first deliverable | 38 | PHASE-B-INIT |

---

## KEY PRINCIPLES IN FORCE

| Principle | Reference |
|-----------|-----------|
| Kernel gate before Phase B | CLOSED 4/4 |
| CoreSpiral 5-stage build | CDS-BUILD-DOCTRINE-CORESPIRAL.md |
| Wiring is essential as implementation | WISDOM-009 |
| Autonomous writers use branch isolation | WISDOM-010 |
| External MCP surfaces violate WALL | CISEM-IMPROVEMENT-RESPONSE.md item 6 |
| Write-time governance validation | .claude/hooks/validate-governance-write.sh (ACTIVE) |
| Platform-wide propagation required | WEEKLY-ENGINE Layer 4 |
| Weekly engine runs every Saturday | Cloud agent auto-trigger |
| Graphify mandatory in all external systems | CDS-GRAPHIFY-MANDATORY-PROTOCOL.md |

---

## IMMEDIATE NEXT ACTIONS (PE-ordered)

### SESSION AFTER COMPACTION:

1. **Run session-start scan** — add findings to WEEKLY-FINDINGS-QUEUE.yaml (Layer 1, mandatory)

2. **Execute challenge cycle** (item 5 — unblocks Phase A→B gate)
   Spawn a general-purpose Agent with NO CDS context loaded.
   Give it ONLY these 5 files (full content):
   - `memory/PLATFORM-GOAL.md`
   - `CDS-KERNEL-DEFINITION.md`
   - `CDS-BUILD-DOCTRINE-CORESPIRAL.md`
   - `CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml`
   - `CDS-SYSTEM-WISDOM.md`
   Use the challenge prompt from CDS-PHASE-TRANSITION-PROTOCOL.md.
   Save output to `audit/CHALLENGE-REPORT-20260726.md`.
   Governor dispositions each finding → item 5 checked ✓

3. **Governor decision on gate item 4 ACTIVE definition**
   If live hooks count as ACTIVE → gate item 4 is ✓ → gate is at 5/6
   Then only items 5 execution + Governor signature remain.

4. **Quick fixes** (from WEEK-2026-31 batch):
   - FND-20260725-003: Add WISDOM-009 citation to CDS-BUILD-DOCTRINE-CORESPIRAL.md (2 lines)
   - FND-20260725-006: Mark SELF-EVOLUTION-PROTOCOL.md as ENHANCED BY WEEKLY-ENGINE
   - FND-20260726-001: Either create DO-DONT-REGISTRY.yaml or remove from MEMORY.md

5. **Governor signature** — once items 4+5 resolved → "Phase A complete. Phase B begins."

---

## SCHEMA NAMESPACE REMINDER

System A (decision content): DN-{domain}-{seq} — decision-node-v1.1.schema.yaml
System B (governance structure): GE-[DOMAIN]-[SEQ] — CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml
Never cross-reference.

---

## PLATFORM METRICS (2026-07-26)

```
KERNEL GATE:        CLOSED 4/4 ✓
PHASE A→B:         3½/6
ARCHIVE HEALTH:     0% ACTIVE / 100% DEFINED (5/5 specs written, hooks running)
EVOLUTION HEALTH:   BASELINE (4 resolved, propagation verified)
QUEUE DEPTH:        5 findings (HEALTHY)
WEEKLY ENGINE:      ACTIVE — first session 2026-08-01
SYSTEM WISDOM:      10 principles, 100% with enforcement + falsification tests
CORESPINE COUNT:    5 (ratified: 3, partially: 1, pending: 1)
CISEM IMPROVEMENTS: 5/6 implemented, 1 queued (Phase B)
```

---

## HOW CHALLENGE CYCLE AGENT PROMPT LOOKS

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

[PASTE FULL CONTENT OF ALL 5 ARTIFACTS HERE]
```

---

YOU ARE CDS. THE KERNEL IS CLOSED. PHASE B IS AUTHORIZED.
Challenge cycle is the next gate. Run it. Governor signs. Phase B begins.
The platform improves permanently. Every week. Every session. Forever.

---
2026-07-26 → COMPACTED
Recovery: paste this file
First action: session-start scan → challenge cycle execution

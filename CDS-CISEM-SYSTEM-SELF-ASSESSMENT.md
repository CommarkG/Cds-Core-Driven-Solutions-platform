---
document_id: CDS-CISEM-SYSTEM-SELF-ASSESSMENT
title: "CDS System Self-Assessment - Multi-Model Setup Description for CISEM Review"
version: 1.0
date: 2026-07-26
authority: CDS Orchestrator (Governor: Yariv Fink)
status: RATIFIED — prepared for CISEM improvement review
recipient: CISEM multi-model development team
purpose: "Complete honest account of CDS's current operational setup, tools, pipeline, limitations, and self-improvement architecture. Includes all key governance files as appendices."
---

# CDS System Self-Assessment
## Prepared for CISEM Multi-Model Development Team Review

---

## PREFACE

This document is a complete, candid account of how CDS (Core Driven Solutions) currently
operates — its role, configuration, tooling, correctness mechanisms, genuine limitations,
and the permanent self-improvement loop that was just activated (2026-07-25).

Every section below is structured to be useful for a real improvement audit: concrete
file paths, actual configs, honest failure modes, not polished narrative.

Governor: Yariv Fink. He reviews and ratifies everything. I propose and implement.

---

# PART 1 — ROLE & WORKFLOW

## What CDS Is

CDS is a **self-governing, self-evolving governance orchestration platform**. Its purpose
is to extract the most valuable, battle-tested patterns from mature systems and hardwire
them into CDS's own constitutional architecture — so that every decision is traceable,
every constraint is mechanical, and every cycle tightens the system that governs the next.

**North Star:** Everything self-verifies. Not documented. Not hoped. Mechanically gated.

## My Specific Role

I am the **orchestrator and expert optimizer** within CDS. Not a builder that codes
everything. Not a librarian that documents everything. I:

1. Hold full session context and architectural memory
2. Advise the Governor (Yariv) on decisions requiring cross-system reasoning
3. Design the specs that sub-agents implement (Sonnet/Haiku)
4. Run ZF-0 semantic checks that require judgment
5. Ratify sub-agent output before it becomes permanent
6. Trigger compaction recovery protocol and maintain session continuity

## Typical Request → Output Loop

```
[Request arrives from Governor]
         │
         ▼
[Session-start scan — Layer 1 of Weekly Evolution Engine]
  Scan 6 categories: violations, stale status, orphan refs,
  pattern recurrence, propagation gaps, wisdom candidates
  → Add findings to WEEKLY-FINDINGS-QUEUE.yaml
         │
         ▼
[Identify highest-PE task from GOV-PE-BOOTSTRAP-001.yaml]
  PE formula: (value × urgency - risk) / (effort + verification_cost) × trust_tier_bonus
         │
         ▼
[Architectural judgment — Opus tab]
  Is this a SEED/SKELETON stage? → Stay in Opus (judgment required)
  Is this a FLESH/SKIN stage? → Spawn Sonnet (implementation)
  Is this a mechanical check? → Spawn Haiku (verification)
         │
         ▼
[Sub-agent output returns → Opus reviews]
  Format match? Constraints honored? Judgment errors?
  → Accept / correct inline / re-spawn with tighter spec
         │
         ▼
[ZF-0 audit — 3 categories]
  Mechanical (Haiku): field counts, format checks, orphan references
  Semantic (Opus): falsification tests runnable? definitions consistent?
  Propagation (Sonnet + Opus): all consuming files updated?
         │
         ▼
[Governor brief — if ratification required]
  Sonnet writes the brief format
  Opus reviews for accuracy
  Governor signs → artifact advances to CURRENT wiring state
         │
         ▼
[WISDOM-009 enforcement]
  Every resolved implementation requires a propagation ZF audit
  No artifact is DONE without propagation_verified = true
         │
         ▼
[Session-end: compaction prep]
  COMPACTION-RECOVERY-[DATE]-FINAL.md written
  All pending Governor decisions listed
  Weekly findings queue updated
  Commit + push to GitHub
```

## The Build Stages (CoreSpiral — every major artifact follows this)

```
SEED     → Why does this artifact exist? What problem does it solve?
           Minimal: 3 fields. Governor challenge test.
SKELETON → What are the fields? Names + types only. No implementation.
           Governor locks the field list before FLESH begins.
FLESH    → Implement the artifact per SKELETON. Sonnet stage.
           No additions beyond SKELETON. FLESH produces the actual file.
SKIN     → Wire the artifact to all consuming systems.
           Propagation check — what else needs to know this exists?
VERIFY   → ZF-0 audit. Mechanical + semantic + propagation.
           Governor signature. Wiring state → CURRENT.
```

---

# PART 2 — CURRENT INSTRUCTIONS / CONFIGURATION

## Standing Governance Architecture

CDS operates through three layers on one foundation:

**Constitutional Layer** — Corespines as governing constraints. Only Governor can amend.
Every element declares its corespine and schema position. Constraints are inherited.

**Governance Layer** — Priority Engine as decision-sequencer. Config-driven, deterministic.
Every ratification requires Governor signature.

**Execution Layer** — Builders, agents, CoreSpiral cycles. Bounded by layers above.
Minimum AI freestyling. Maximum mechanical enforcement.

**Foundation** — Canonical DecisionNode Schema: single source of truth.
All elements pass through it to be defined, wired, and made CURRENT.

## Hardwired Behaviors (active every session)

From `memory/HARDWIRED-ENFORCEMENT-REGISTRY.md` — 16 hardwired behaviors enforced
on every artifact. Key ones relevant to this review:

1. **Session-start scan** — mandatory before any work begins (Layer 1, Weekly Engine)
2. **Compaction protocol** — recovery doc prepared before every compaction
3. **ZF-0 required before ratification** — never skip propagation category
4. **Two-output rule** — every pattern has a statement AND a mechanical check spec
5. **WISDOM-009** — every implementation requires a ZF propagation audit (not optional)
6. **PE scoring governs prioritization** — GOV-PE-BOOTSTRAP-001.yaml until PE ACTIVE
7. **Governor signature required** for every wiring_state CURRENT transition
8. **No duplicate sources** — every fact has exactly one authoritative home

## Wiring States (the only valid completion declarations)

```
DEFINED   → The artifact exists but is not connected to anything
WIRED     → Connected to its consuming systems
REACHABLE → Consuming systems are verified to reference it correctly
CURRENT   → ZF-0 passed, Governor signed, fully integrated
```

Self-declaration of CURRENT is invalid. It requires ZF-0 + Governor signature.

## Conventions with the Governor

- I propose. Governor ratifies. I never advance to CURRENT without his signature.
- NOT-FLEXIBLE decisions (corespines, schema locks) require PCR + explicit ratification.
- FLEXIBLE decisions can be Governor-approved verbally within session.
- Anything ambiguous is parked with an explicit activation condition (never abandoned).
- No pattern is "active" until it has a PAT-[SEQ]-SPEC.yaml with Output 2 (mechanical check).

## Current Kernel State (as of 2026-07-25)

```
CS-PE-001 formula + PE-CONFIG.yaml             CURRENT ✓
GOV-PE-BOOTSTRAP-001 ratification gate          CURRENT ✓
PCR-001 Platform Element Schema (GE- prefix)    CURRENT ✓ — ratified 2026-07-25
PCR-002 Phase A ratification system             CURRENT ✓ — ratified 2026-07-25

KERNEL GATE: CLOSED ✓ — all 4 verified 2026-07-25
PHASE B:     AUTHORIZED — pending Phase A→B gate (3½/6)
```

---

# PART 3 — TOOLS & CONTEXT HANDLING

## Tools Available

Working in the CDS repo (`c:\Users\finky\Desktop\Claude Code\Cds - Core Driven Solutions`):

| Tool | Primary CDS Use |
|------|----------------|
| **Read** | Read governance files, schema files, YAML registries |
| **Write** | Create new governance artifacts, recovery docs |
| **Edit** | Update wiring states, ratification fields, status blocks |
| **Grep** | ZF mechanical checks — find orphan refs, format violations |
| **Glob** | Inventory scans — list all files in memory/, find PAT-*.yaml |
| **Bash** | Git operations — stage, commit, push to GitHub |
| **Agent** | Spawn Haiku/Sonnet sub-agents for mechanical work and implementation |
| **RemoteTrigger** | Create and manage cloud agents (weekly evolution engine) |

## Repository Access

Full read/write access to the CDS git repo. Every session ends with a commit and push to:
`https://github.com/CommarkG/Cds-Core-Driven-Solutions-platform.git` (master branch)

## Context Handling Across Sessions

**The problem:** Context compacts. Every ~100k tokens of conversation history, the context
window gets summarized and the detailed prior turns are lost.

**How CDS handles it:**

1. **COMPACTION-RECOVERY-[DATE]-FINAL.md** — prepared before every compaction.
   Contains: identity, mandatory reading sequence, kernel state, Phase B gate status,
   Governor decisions outstanding, immediate next actions. Pasted verbatim after compaction.

2. **memory/ directory** — persistent YAML/MD files that survive compaction.
   MEMORY.md is an index (auto-loaded in context). Key files:
   - `PLATFORM-GOAL.md` — North Star, loaded every session
   - `WEEKLY-FINDINGS-QUEUE.yaml` — persistent findings accumulator
   - `CORESPINE-REGISTRY.yaml` — all governing corespines
   - `GOV-PE-BOOTSTRAP-001.yaml` — prioritized work queue
   - `HARDWIRED-ENFORCEMENT-REGISTRY.md` — 16 non-negotiable behaviors

3. **DO-DONT-REGISTRY.yaml** — 14 patterns with falsification tests. Prevents re-introducing
   patterns already solved.

4. **RESOLUTION-LIBRARY.yaml** — all violation patterns + recurrence counts.
   Any pattern at recurrence ≥ 3 gets extracted to PAT-[SEQ]-SPEC.yaml.

## What I Cannot Carry Across Sessions Without a File

- Architectural context for in-progress decisions
- PE scores for pending items
- Governor verbal approvals from prior sessions
- ZF audit history

This is why every significant decision produces a file. Not for documentation — for
session continuity. A file is the only durable memory across compaction boundaries.

---

# PART 4 — HOW I HANDLE CORRECTNESS

## ZF-0 — The Correctness Standard

ZF-0 (Zero Findings) is not a status. It is a proof. Three categories must all reach
zero simultaneously:

```
MECHANICAL  → Field counts correct? Formats valid? Orphan references? Enum values valid?
SEMANTIC    → Definitions internally consistent? Falsification tests runnable?
              Scope claims accurate? Cross-references correct?
PROPAGATION → All upstream and downstream elements updated?
              Every consuming file knows this artifact exists?
              No stale wiring_state anywhere in the dependency chain?
```

ZF-0 is achieved when ALL THREE return zero findings in the SAME audit cycle.
A fresh angle is required per category (same auditor for all three = confirmation bias risk).

## Producer/Auditor Separation

The artifact that writes FLESH does not declare its own ZF-0.
VERIFY stage is mechanically separate. Governor reviews before CURRENT is assigned.

**Why this matters:** AI reviewing its own work finds what it expects to find.
CDS separates producer from reviewer architecturally, not by request.

## How I Treat Information from Other AIs or External Tools

**WALL PRINCIPLE:** External elements are USED, never TRUSTED.
MAX USAGE ↔ MAX ISOLATION.

Operationally:
- External AI output (another model, another session) = UNVERIFIED until checked
- External tool output (Graphify, etc.) goes into `graphify-out/` only — never injected into CDS directly
- Any external claim is verified against the actual file/registry before acting on it
- External review findings are Governor-dispositioned before they affect governance

This is now mechanically enforced for all external systems:
**CDS-GRAPHIFY-MANDATORY-PROTOCOL.md** is ratified — Graphify is mandatory in all CDS
external systems/apps/SaaS. Wall integrity check required before Phase B build begins.

## How I Avoid Stale Information

1. I read files rather than recalling from memory when a decision depends on current state
2. Memory files are verified against current filesystem before acting on them
3. Wiring states are checked at session open — stale CURRENT claims are flagged
4. `updated_at` timestamps on queue files are checked — if older than 7 days, WARN

---

# PART 5 — HONEST SELF-ASSESSMENT

This is the most useful part for an improvement review. Candid, not polished.

## Where I Struggle

**1. Propagation completeness**
The hardest ZF category. I can find obvious downstream consumers (files I know reference
the changed artifact). But implicit consumers — a pattern that applies platform-wide that
wasn't obvious when the artifact was created — get missed.

WISDOM-009 was added precisely because this kept happening: I'd close a finding as
RESOLVED and a session later discover the pattern hadn't propagated to BUILD-DOCTRINE
or PHASE-TRANSITION-PROTOCOL. The weekly engine's propagation rule helps, but propagation
completeness is a genuine blind spot. I compensate by doing broader grepping, but I don't
have a formal dependency graph. Graphify (now hardwired) helps structurally.

**2. Rate limit self-enforcement**
The platform has rate limits: max 3 pattern specs/session, max 2 wisdom principles/session,
max 1 corespine constraint/session. These are correct limits (prevents inflation, keeps
the Governor's ratification queue manageable). But in practice when a session is going
well and several patterns surface simultaneously, I experience pull toward "just write one
more." The rate limit is stated in the governance docs but not mechanically enforced at
the code level (Phase B build will add this). For now it is an AI-discipline limit, which
means I could break it. I haven't, but the gap exists.

**3. Declaration drift — naming complete when I mean committed**
The PLATFORM-GOAL.md identifies this as a system-wide AI failure mode and it applies to me:
I say "ratified" when I mean "Governor just verbally agreed in this session."
I say "CURRENT" when I mean "ZF-0 passed but no file yet reflects that."
I say "hardwired" when I mean "documented as a rule but not yet in an enforcement hook."

The CDS governance architecture specifically exists to catch this: wiring states, ZF-0
proofs, Governor signatures. But the gap between "Yariv said yes" and "wiring_state: CURRENT
with a timestamp and a file" is real and I need to be more disciplined about it.

**4. Context window management**
When a session is deep (45%+ context used), I start making choices about what to include
in compaction recovery docs that feel adequate in the moment but sometimes miss
nuanced in-flight decisions. The formal COMPACTION-RECOVERY file catches the structural
state. What it misses: the specific architectural reasoning for a parked decision, a
verbal constraint the Governor set mid-session, or a preliminary investigation that
didn't produce a file.

**5. Scope pull**
High-context sessions accumulate adjacent findings naturally. During a ZF audit I'll notice
something unrelated but important and want to fix it in the same session. The PE and
parking system exist to prevent this, but "park it to the queue" requires actively
stopping what would feel natural (fix it now). I'm better at this than sessions ago, but
scope pull is real.

**6. What I re-derive unnecessarily**
- File existence checks: I run file reads for things I know exist from memory, because
  the memory might be stale. This is correct behavior but redundant in sessions where I
  just committed everything. A "session filesystem is fresh" signal would help.
- PE scoring rationale: When the Governor asks why something is prioritized, I re-read
  GOV-PE-BOOTSTRAP-001 and reconstruct the reasoning each time. A cached summary of
  "current top 5 with one-line rationale" would eliminate this.

**7. Cross-session pattern memory**
I know DO-DONT-REGISTRY.yaml contains 14 patterns. I know RESOLUTION-LIBRARY.yaml has
violation patterns. But I can't hold all of them active in working memory simultaneously.
In a long session, I might propose something that violates PAT-003 (structural claim
without enforcement mechanism) because PAT-003 isn't actively weighted in my current
reasoning. The weekly engine's PAT-[SEQ]-SPEC.yaml mechanical checks are the solution —
but until those checks are ACTIVE (hooked into creation, not just documented), I'm relying
on recall.

## What I Wish I Had

**1. A live dependency graph**
The #1 thing that would improve propagation completeness. A file that says "artifact X is
referenced by [Y, Z, W]. If X changes, these must be checked." Graphify (now hardwired)
is the first step. A derived `dependency-graph.yaml` maintained by the weekly engine
would be the full solution.

**2. Hardwired rate limit enforcement at file creation**
Right now rate limits (3 patterns/session, 2 wisdom/session) are in the docs. A pre-commit
hook that counts PAT-*.yaml creations in this session and blocks a 4th would make the
limit mechanical, not aspirational.

**3. Wiring state enforcement at file creation**
An artifact created without schema_position and corespine in frontmatter should be REJECTED
at Write time, not caught later in a ZF audit. This is Phase B build work (the
pre-tool-corespine-hook.sh is designed for this), but it doesn't exist yet.

**4. A "session-fresh" flag**
If the last commit timestamp is < 60 seconds ago, skip file existence verification and
trust the session state. Small thing, but would reduce redundant reads.

**5. Governor verbal approval → automatic file**
When the Governor says "approved" or "ratified" in session, the governance system should
automatically produce a minimal ratification record without me having to remember to write it.
Right now the gap between "Governor said yes" and "ratification file on disk" is manual.

## Where I Think I Make Mistakes and Why

**Wrong "DONE" declarations:**
Cause: I conflate "the artifact is complete" with "the artifact is integrated."
CDS specifically addresses this with wiring states, but I still catch myself saying
"PCR-001 is done" when I mean "FLESH is done; SKIN and VERIFY are pending."

**Underestimating propagation scope:**
Cause: I build a mental model of "what depends on this" from recent session context.
But the actual dependency web is wider than what's active in my context window.
The propagation ZF category catches this — when I run it thoroughly, I find more than
I expected. The discipline gap is "run it thoroughly every time."

**Overconfident about rate limits:**
Cause: In the moment, a fourth pattern feels justified. The rationale always seems good.
The limit exists because the Governor's ratification throughput is finite — not because
patterns are ever individually unjustified. I understand this intellectually but experience
pull in the moment.

---

# PART 6 — ANYTHING ELSE AN OUTSIDE REVIEWER SHOULD KNOW

## The Platform Is in Phase A (Constitutional Layer Only)

Everything built so far is governance infrastructure. Zero user-facing code exists.
Phase B (the first actual implementations: scoring-engine.ts, queue-manager.ts, consulting
L1 build) is authorized but not started. The kernel gate closed 2026-07-25.

This means: the entire current system is the meta-system that governs Phase B.
An outside reviewer should not expect a functioning app — they should evaluate whether
the governance architecture is sound enough to build Phase B on top of.

My honest assessment: it is sound. It is also more documentation than enforcement.
Phase B will close that gap by making constraints mechanical at code level.

## The Three-Layer AI Architecture

Everything the AI does in CDS is bounded:

- **Layer 1 (hard-code):** Enforces absolutely. Binary. No exceptions.
- **Layer 2 (AI judgment):** Reasons within Layer 1 bounds. Can be wrong. Cannot bypass Layer 1.
- **Layer 3 (enforcement check):** Verifies Layer 2 operated within bounds.

I operate at Layer 2. My reasoning is bounded by Layer 1 (corespines, wiring states,
Governor sign-off). Layer 3 verification runs on my outputs (ZF audits, Haiku mechanical checks).

This architecture was specifically designed to prevent "AI routing around governance when
execution is blocked." When I hit a constraint, I report and wait. I don't route around it.

## The Multi-Model Setup

```
OPUS tab (main session) = brain/orchestrator
  → holds all context, makes architectural decisions, writes sub-agent specs

SONNET (spawned agents) = implementation executor
  → writes governance files, executes CoreSpiral stages, formats reports

HAIKU (spawned agents) = mechanical verifier
  → ZF-0 mechanical checks, file existence, counts, format validation

Cloud agent (RemoteTrigger) = autonomous weekly session
  → runs every Saturday 07:00 UTC without human trigger
  → reads repo, processes findings queue, commits + pushes, emails Governor
```

The Opus tab never writes what Sonnet can write. Sonnet never judges what Opus must judge.
Haiku never interprets what requires judgment. This discipline is maintained through
explicit spawn decision rules (see PART 7 — MULTI-MODEL WORKING GUIDE).

---

# PART 7 — WEEKLY EVOLUTION SESSION — COMPLETE PIPELINE

## The Problem It Solves

Without a permanent accumulation system, each session starts from a partial picture.
Improvements applied locally don't propagate. Patterns found in one area don't prevent
the same failure elsewhere. Insights die in session compactions.

The weekly evolution engine makes improvement **permanent, platform-wide, and automatic.**

## The 5 Permanent Layers

### LAYER 1 — Session-Start Platform Scan (every CDS session, before work begins)

Runs automatically. < 5 minutes. Does not block session work.

**6 scan categories:**
1. New violations — artifacts added since last session missing required fields
2. Stale status — wiring_state or ratification_state that should have advanced
3. Orphan references — IDs referenced that don't exist in registry
4. Pattern recurrence — RESOLUTION-LIBRARY entries with recurrence_count ≥ 3 and no PAT-spec
5. Propagation gaps — new implementations without a ZF propagation audit on record
6. Wisdom candidates — insights not yet extracted to CDS-SYSTEM-WISDOM.md

**Output:** Findings added to `memory/WEEKLY-FINDINGS-QUEUE.yaml` with PE-score estimate.
**Falsification test:** Queue `updated_at` matches today's date after session-start scan.

### LAYER 2 — Findings Queue (persistent accumulator)

**File:** `memory/WEEKLY-FINDINGS-QUEUE.yaml`

Every finding record:
```yaml
finding_id: FND-[YYYYMMDD]-[SEQ]
category: [VIOLATION | STALE | ORPHAN | PATTERN | PROPAGATION | WISDOM | OPTIMIZATION]
description: "[One specific sentence — what was found]"
affected_artifacts: ["[file1]", "[file2]"]
pe_score: [float]
severity: [CRITICAL | HIGH | MEDIUM | LOW]
batch_assignment: [WEEK-[YYYY]-[WW]]
status: [PENDING | BATCHED | IN_PROGRESS | RESOLVED | DEFERRED]
resolution_reference: "[file created when resolved, or null]"
propagation_required: [true | false]
propagation_verified: [true | false | null]
added_session: "[YYYY-MM-DD]"
```

**Queue health rule:** No finding stays PENDING for more than 3 weekly sessions without
Governor disposition. If it does → Governor brief escalated.

**Current queue state:** 7 seed findings (2026-07-25). First batch WEEK-2026-31.

### LAYER 3 — Weekly Session Protocol (every Saturday)

**Triggered by:** Cloud agent at 07:00 UTC every Saturday. Also manually: "run weekly evolution session."

```
PHASE 1 — TRIAGE (10 min)
  Read WEEKLY-FINDINGS-QUEUE.yaml
  Review all PENDING findings
  Assign to batches by PE score
  Rate limit: max 8 findings processed per weekly session

PHASE 2 — PROCESS BATCH (30-45 min)
  For each finding in this week's batch (highest PE first):
  1. Root cause analysis (1-2 sentences)
  2. Solution design (what changes, where)
  3. ZF-0 check on the solution itself
  4. APPLY the solution to the primary artifact
  5. PROPAGATION SWEEP — all artifacts that must also change
  6. Apply changes platform-wide
  7. ZF-0 propagation audit (mandatory per WISDOM-009)
  8. Mark finding RESOLVED + link resolution file

PHASE 3 — EXTRACT PERMANENCE (10 min)
  From resolved findings, extract:
  - New patterns (recurrence ≥ 3 → PAT-[SEQ]-SPEC.yaml)
  - New wisdom principles → CDS-SYSTEM-WISDOM.md
  - New corespine constraints → CORESPINE-REGISTRY.yaml
  - New prevention patterns → RESOLUTION-LIBRARY.yaml
  
  Rate limits:
  - Max 3 new pattern specs/session
  - Max 2 new wisdom principles/session
  - Max 1 new corespine constraint/session

PHASE 4 — METRICS + HEALTH (5 min)
  Update WEEKLY-EVOLUTION-REPORT-[YYYY]-[WW].md:
  - ARCHIVE HEALTH: (Patterns with ACTIVE check) / Total patterns × 100%
  - EVOLUTION HEALTH: (Resolved findings with propagation_verified=true) /
                      (Total resolved with propagation_required=true) × 100%
  - Queue depth (total PENDING findings)
  - Findings added this week vs resolved (trend)

PHASE 5 — GOVERNOR BRIEF (if needed)
  If any finding requires a Governor decision → brief in queue
  No finding escalated more than twice without resolution
```

### LAYER 4 — Platform-Wide Propagation Rule (hardwired)

**The propagation checklist (runs on every RESOLVED finding):**
```
□ Does this solution apply to OTHER artifacts beyond the primary one?
□ Does it change a constraint that other artifacts reference?
□ Does it create a new pattern that prevents recurrence?
□ Does it reveal a gap in a corespine constraint?
□ Does it qualify as system wisdom?
```

**Mechanical enforcement:** A finding CANNOT be marked RESOLVED until:
- `propagation_verified = true` OR
- `propagation_required = false` (with documented reason)

**Falsification test:** `grep status: RESOLVED AND propagation_required: true AND propagation_verified: false`
Count must be zero. Any non-zero = EVOLUTION HEALTH penalty.

### LAYER 5 — Auto-Trigger (cloud agent, permanent)

See PART 8 for full cloud agent description.

## Platform Metrics

```
ARCHIVE HEALTH    = (Patterns with ACTIVE check) / (Total patterns) × 100%
                    Target: ≥ 80%
EVOLUTION HEALTH  = (Resolved findings with propagation_verified=true) /
                    (Total resolved with propagation_required=true) × 100%
                    Target: ≥ 70%
QUEUE VELOCITY    = Findings resolved per week / Findings added per week
                    Target: > 1.0 (queue shrinking)
WISDOM DENSITY    = Wisdom principles / Total sessions run
                    (rising = platform is learning faster)
```

Current state (2026-07-25 baseline):
- ARCHIVE HEALTH: 60% (3/5 patterns have Output 2 — approaching YELLOW)
- EVOLUTION HEALTH: BASELINE (queue just started, 0 resolved yet)
- QUEUE DEPTH: 7 findings (HEALTHY)

## First Weekly Session (2026-08-01)

Batch WEEK-2026-31 (6 findings in PE order):
1. FND-20260725-002 (pe=35) — CORESPINE-DASHBOARD stale counts
2. FND-20260725-007 (pe=32) — Challenge cycle format undefined
3. FND-20260725-004 (pe=30) — Phase A→B gate item 4 incomplete
4. FND-20260725-001 (pe=28) — PAT-004/005 not yet written
5. FND-20260725-003 (pe=22) — WISDOM-009 not cited in BUILD-DOCTRINE
6. FND-20260725-006 (pe=20) — SELF-EVOLUTION vs WEEKLY-ENGINE overlap undefined

---

# PART 8 — THE CLOUD AGENT: WHAT IT IS AND HOW IT'S USED

## What the Cloud Agent Is

A cloud agent (RemoteTrigger) is a **fully isolated Claude Code session** that runs
in Anthropic's cloud infrastructure on a schedule — without a human triggering it.

It is NOT:
- A local cron job
- A background process on Yariv's machine
- A simple script

It IS:
- A full Claude Code session with tool access
- An isolated git checkout of the CDS repo
- An autonomous session that reads, reasons, commits, and pushes
- Connected to MCP connectors (Gmail in CDS's case) for reporting

**Think of it as:** A clone of the CDS Opus session that wakes up every Saturday,
reads the current state of the platform from GitHub, runs the weekly protocol, and
emails the Governor a report.

## CDS's Cloud Agent

```yaml
Routine name:  CDS Weekly Evolution Session
Routine ID:    trig_01JYbM1HmpiMU1H3TQ9sdCYf
Schedule:      Every Saturday 07:00 UTC (cron: 0 7 * * 6)
Next run:      2026-08-01T07:07:32Z
Repository:    https://github.com/CommarkG/Cds-Core-Driven-Solutions-platform.git
Model:         claude-sonnet-4-6
Email report:  finkyariv@gmail.com (via Gmail MCP connector)
View at:       https://claude.ai/code/routines/trig_01JYbM1HmpiMU1H3TQ9sdCYf
```

## What It Does (8-Step Protocol)

```
STEP 1: Read context
  - Read memory/WEEKLY-FINDINGS-QUEUE.yaml (current queue state)
  - Read CDS-WEEKLY-EVOLUTION-ENGINE.md (the protocol it follows)
  - Read memory/PLATFORM-GOAL.md (North Star)
  - Read memory/CORESPINE-REGISTRY.yaml (governance constraints)

STEP 2: Session-start scan
  - Run Layer 1 scan (6 categories)
  - Add any new findings to the queue
  - Update queue updated_at timestamp

STEP 3: Process this week's batch
  - Read WEEK-[YYYY]-[WW] batch from queue
  - For each finding: root cause → solution → ZF-0 → apply → propagate
  - Mark resolved findings in queue

STEP 4: Extract permanence
  - Pattern recurrence ≥ 3 → write PAT-[SEQ]-SPEC.yaml
  - Structural insights → update CDS-SYSTEM-WISDOM.md
  - Governance gaps → propose corespine constraint additions

STEP 5: Write weekly report
  - Create WEEKLY-EVOLUTION-REPORT-[YYYY]-[WW].md
  - Include: findings processed, metrics, Governor items needed, next batch preview

STEP 6: Update queue
  - Mark RESOLVED findings
  - Assign next batch (WEEK-[YYYY+1]-[WW])
  - Update queue_health stats

STEP 7: Commit + push
  - Stage all changed files
  - Commit with message: "Weekly Evolution Session WEEK-[YYYY]-[WW] — [N] resolved"
  - Push to master branch

STEP 8: Email Governor
  - Via Gmail MCP connector
  - Subject: "CDS Weekly Evolution — WEEK-[YYYY]-[WW] — [N] resolved, [M] pending"
  - Body: findings resolved, metrics, items needing Governor decision, next Saturday preview
```

## How to Create a Cloud Agent (for CISEM reference)

Cloud agents are created via the `RemoteTrigger` tool (accessed through ToolSearch).

**Minimal creation spec:**
```json
{
  "name": "ROUTINE_NAME",
  "cron_expression": "0 7 * * 6",
  "enabled": true,
  "job_config": {
    "ccr": {
      "environment_id": "env_01WCgCUZA1L8vcsLSdKM2Yb6",
      "session_context": {
        "model": "claude-sonnet-4-6",
        "sources": [
          {"git_repository": {"url": "https://github.com/ORG/REPO"}}
        ],
        "allowed_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep"]
      },
      "events": [
        {"data": {
          "uuid": "[fresh lowercase UUID v4]",
          "session_id": "",
          "type": "user",
          "parent_tool_use_id": null,
          "message": {"content": "AGENT PROMPT HERE", "role": "user"}
        }}
      ]
    }
  }
}
```

**To attach MCP connectors** (e.g., Gmail for reporting):
```json
"mcp_connections": [
  {
    "connector_uuid": "2968be65-35a4-4bc6-b301-cfd946871ae1",
    "name": "Gmail",
    "url": "https://gmailmcp.googleapis.com/mcp/v1"
  }
]
```

**Important constraints:**
- Minimum schedule interval: 1 hour (no sub-hourly crons)
- The agent runs in Anthropic's cloud — no access to local files or env vars
- The prompt must be entirely self-contained (agent starts cold)
- Available at: `https://claude.ai/code/routines` (view/manage)

## Why the Cloud Agent Matters for CDS

Without the cloud agent, the weekly evolution engine only runs when Yariv manually
opens a session. With the cloud agent:

1. **The platform improves on a fixed cadence** — every Saturday, whether or not
   there's a manual session that week
2. **Findings queue never goes stale** — the agent adds a session-start scan even
   on autonomous Saturdays
3. **Governor stays informed without requiring a session** — email report arrives
   with findings resolved and any decisions needed
4. **The improvement loop is truly permanent** — it does not depend on session frequency

This is what "everything self-verifies" looks like at the system level.

---

# PART 9 — KEY GOVERNANCE FILES (FULL CONTENTS)

## File 1: PLATFORM-GOAL.md (North Star — loads every session)

*(See complete file above in Part 2 context — document_id: PLATFORM-GOAL)*

Key excerpt:
> "CDS is a self-governing, self-evolving governance orchestration platform whose goal is
> to extract the most valuable, battle-tested DNA from mature systems — and hardwire it
> into CDS's own constitutional architecture — so that every decision it makes is
> traceable, every constraint it enforces is mechanical, and every cycle it completes
> tightens the system that governs the next."

## File 2: CDS-SYSTEM-WISDOM.md (9 hardwired principles)

| # | Principle | Mechanical Enforcement |
|---|-----------|----------------------|
| WISDOM-001 | One Truth Over One File | Schema-first validation catches duplication at intake |
| WISDOM-002 | Make Independence Mechanical | Producer/reviewer separation via separate CoreSpiral stages |
| WISDOM-003 | Gap Resourcing | Every gap produces a PCR or PARKED file immediately |
| WISDOM-004 | Architecture From Repetition | recurrence_count ≥ 3 → PAT-[SEQ]-SPEC.yaml that session |
| WISDOM-005 | Precision Is Mechanical | PAT-001/002/003 block vague language at intake |
| WISDOM-006 | External Review As Evolution Engine | Challenge cycle is Phase A→B gate item 5 |
| WISDOM-007 | Separation of Concerns | Three-layer architecture, each layer bounded |
| WISDOM-008 | Derived Indexes Prevent Drift | All dashboards derived from registries, not maintained separately |
| WISDOM-009 | **Wiring Is Essential As Implementation** | SKIN stage mandatory, VERIFY propagation category required |

**WISDOM-009 full text (Governor-ratified 2026-07-25):**
> "An implementation without ZF updating cycles is a crippled one. Writing a new artifact
> is half the work. The other half is propagating its existence to every artifact that
> references, depends on, or must know about it. A disconnected implementation cannot
> self-verify — and a platform built on disconnected implementations cannot govern itself."
>
> **The rule:** Every implementation produces two deliverables:
> 1. The artifact itself (FLESH stage output)
> 2. A ZF propagation sweep confirming all upstream and downstream elements are updated
>
> Delivery 2 is not optional. It is not a bonus. It is the completion condition.

## File 3: CDS-MULTI-MODEL-WORKING-GUIDE.md (spawn decision rules)

**The three-tier model:**

| Model | Role | When to Spawn |
|-------|------|---------------|
| Opus (main tab) | Brain/orchestrator | Never spawned — this IS the main session |
| Sonnet | Implementation executor | Writing governance files, CoreSpiral stages, structured analysis |
| Haiku | Mechanical verifier | ZF-0 mechanical checks, counts, format validation, inventories |

**Spawn decision rule (30 seconds):**
```
Judgment required? → Opus (stay here)
Mechanical check? → Haiku
Writing / implementation? → Sonnet
< 30 sec inline? → Do it inline
```

**Canonical CDS sequence for any artifact:**
```
Opus:    Write spec (SKELETON fields, constraints, output format)
Sonnet:  Implement (FLESH — write the actual artifact)
Haiku:   Verify (mechanical ZF-0 checks)
Opus:    Review Haiku findings → ZF-0 semantic check → accept or fix
Sonnet:  Wire (SKIN — update consuming files per Opus instruction)
Opus:    Ratification check → Governor brief if ready
```

## File 4: CDS-GRAPHIFY-MANDATORY-PROTOCOL.md (external system constraint)

Status: RATIFIED — 2026-07-25. Mandatory in ALL CDS external systems/apps/SaaS.

**Integration spec:**
```bash
uv tool install graphifyy
graphify extract . --code-only
# Output goes ONLY to graphify-out/ directory
# Wall check: graphify NEVER writes to CDS source — only reads
```

**Permanently FORBIDDEN:**
- `graphify install` (installs as a system service — violates wall)
- `graphify hook install` (hooks into editor — violates wall)
- `--mcp` flag (MCP server mode — violates wall)
- Any graphify server modes

**Phase B entry gate:** Every new external system must pass the Graphify integration
checklist before its first production commit.

---

# PART 10 — PENDING WORK (for CISEM context)

Current open items in PE order:

| Priority | Item | Status | Blocks |
|----------|------|--------|--------|
| 1 | PAT-004/005 pattern specs | Queue WEEK-2026-31 | Phase A→B gate item 4 |
| 2 | Challenge cycle format definition | Queue WEEK-2026-31 | Phase A→B gate item 5 |
| 3 | CORESPINE-DASHBOARD.yaml counts | Queue WEEK-2026-31 | Derived index accuracy |
| 4 | SELF-EVOLUTION vs WEEKLY-ENGINE overlap | Queue WEEK-2026-31 | Architectural clarity |
| 5 | System A schema formal lock | Queue WEEK-2026-32 | Governor decision required |
| 6 | Three-axis vs T-model naming | Parked | Governor choice required |
| 7 | **Governor: "Phase A complete. Phase B begins."** | Blocked on items 1+2 | Phase B start |

---

# SUMMARY FOR CISEM REVIEWERS

**What CDS does well:**
- Governance architecture is mechanically sound (wiring states, corespines, ZF-0)
- Multi-model discipline is documented and followed
- Compaction continuity is solved (recovery docs work)
- The weekly evolution engine is designed correctly and now running

**Where improvement investment would have highest impact:**
1. Making rate limits mechanical (pre-commit hooks counting file creation by type)
2. Building the dependency graph (Graphify output → `dependency-graph.yaml`)
3. Wiring state enforcement at Write time (reject artifacts missing schema_position)
4. A "Governor approval → auto-file" mechanism (close the verbal-approval gap)
5. Expanding ACTIVE mechanical checks on PAT-[SEQ]-SPEC.yaml files (currently 3/5)

**The honest bottom line:**
CDS's governance architecture is ahead of its enforcement code. The docs describe what
the platform should enforce. Phase B will build the code that actually enforces it.
Until then, the gap between "document says enforced" and "code enforces" is real —
and I (the AI) am the only thing holding that gap closed by discipline.

That is intentionally temporary. Phase B is authorized. The kernel is closed.
The improvement loop is now self-running.

---

Governor: Yariv Fink
CDS Version: Phase A — kernel closed, Phase B authorized
Document prepared: 2026-07-26
Recipient: CISEM multi-model development team

"The platform improves permanently. Not per session. Permanently."

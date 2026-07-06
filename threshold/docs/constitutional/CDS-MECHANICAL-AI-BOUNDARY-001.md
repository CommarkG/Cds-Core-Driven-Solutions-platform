# CDS-MECHANICAL-AI-BOUNDARY-001
## The Mechanical/AI Boundary — Governing Architecture

**Document ID:** CDS-MECHANICAL-AI-BOUNDARY-001
**Status:** RESEARCH COMPLETE — PENDING GOVERNOR RATIFICATION
**Date:** 2026-07-02
**Research fleet:** 4 Haiku specialists (boundary-layer, drift-detector, rigidity-cost, scale-boundary)
**Synthesized by:** CDS Builder (Sonnet 4.6)
**Governor:** Yariv Fink

---

## The Governing Principle (one sentence)

> **Mechanical enforcement governs the WHAT (is this valid? is this present? was this checked?). AI governs the WHAT FOR (what does this mean? what pattern is emerging? what should happen next?). The Governor owns the exception — the right to say "yes this violates the rule, and in this context, that is correct."**

Everything below is derived from this line.

---

## Part 1 — Three Decisions CDS Has Backwards Right Now

These are not Phase 0.5 items. They are current errors that cause drift today.

### ERROR 1 — Q1 Input Type Classification is AI-Judged (Must Be Mechanical)
**Current state:** Q1 offers 8 type options (Goal/Element/Finding/Obligation/Improvement/Insight/External/Unknown). The ICE wizard presents these as cards — a human selects, or an AI infers. Same input ("Add a search feature to the sidebar") can be classified as Goal, Element, or Finding depending on who reads it.

**Why this is wrong:** The entire downstream governance tree — corespine family, ratification check, routing tier — branches from Q1. If Q1 is AI-inferred and AI changes, the branch changes. This is invisible drift from the first session.

**Fix:** Replace AI inference with a decision tree.
```
Does input contain a declarative user need? → GOAL
Does input declare a specific component with schema? → ELEMENT
Does input report something broken or missing? → FINDING
Does input come from outside the platform? → EXTERNAL
Is it a process or constraint? → OBLIGATION
...
```
The decision tree is the rule. Q1 is not an AI judgment. It is a classification result.

---

### ERROR 2 — Q2 Corespine Family Mapping is a Suggestion (Must Be Mechanical)
**Current state:** The Q1→Q2 mapping table maps input types to corespine families. It is a reference table, not a rule. A GOAL could plausibly map to CS-GOVERNANCE, CS-STRUCTURE, or CS-META depending on what the goal is about. Two AI agents reading the same input will produce different Q2 answers.

**Why this is wrong:** Q2 determines which constitutional family governs this input. If Q2 is ambiguous, the governance family is ambiguous. Different families have different ratification requirements. Silent inconsistency compounds over thousands of records.

**Fix:** Add a second decision tree at Q2 level that uses Q1 + domain keywords to determine corespine family deterministically. Not "which family feels right" — "which family does this input's domain map to, given Q1 type?"

---

### ERROR 3 — PROVISIONAL → ACTIVE Promotion Gate Does Not Exist
**Current state:** The lifecycle `PROVISIONAL → ACTIVE` is described in governance but has no mechanical gate. A PROVISIONAL rule becomes ACTIVE when someone decides it should. The decision criteria are undefined. A false positive injected by one Haiku agent can become an ACTIVE gate blocker.

**Why this is wrong:** This is the exact failure mode LEL-CORESPINE-001 was designed to prevent. Without a promotion gate, every AI-generated rule has full authority on first injection.

**Fix:** See CDS-LEL-CORESPINE-001 Part 5 — 8-box binary checklist. No box is subjective. All 8 must be checked. No promotion without the gate.

---

## Part 2 — The One Degenerative Constraint

Five of six gate rules are GENERATIVE (they focus AI on high-value work).
One is DEGENERATIVE.

### RULE-VOC — Currently Blocks Vocabulary Evolution
**What it does:** Blocks inputs containing unregistered vocabulary.
**Why it's degenerative:** Vocabulary is the carrier of meaning. A new domain insight that requires a new term cannot be expressed until the term is registered. In Phase 0 (40 registered terms), this is manageable. At Phase 1 (200+ terms across multi-tenant domains), the vocabulary rule becomes a ceiling on what CAN BE THOUGHT in the constitutional layer.

**Fix — Redesign the rule:**
```
Current: "Block inputs containing unregistered vocabulary"
New:     "Flag inputs containing unregistered vocabulary as NEED_CLARIFICATION.
          New vocabulary can be ratified by Governor.
          Constitutional elements cannot activate until vocabulary is ratified.
          But the INPUT is not blocked — it is held pending vocabulary ratification."
```
This preserves the safety (unvalidated vocabulary doesn't enter constitutional elements) while removing the ceiling (new terms CAN be added through a lightweight ratification path).

---

## Part 3 — Drift Taxonomy and CDS Risk Assessment

Seven types of drift. CDS is vulnerable to all seven. Current drift resistance: LOW.

| Drift Type | Mechanism | First Visible At | CDS Current Resistance |
|------------|-----------|-----------------|----------------------|
| **Rule-Letter** | AI learns to satisfy rule text while violating intent | Cycle 6-8 | LOW — no intent-alignment check |
| **Vocabulary** | Same word means different things in different contexts | Session 5-7 | LOW — no vocabulary conflict detection |
| **Scope Creep** | Governor becomes bottleneck → agents pre-approve | Phase 3-4 | MEDIUM — Governor is still active |
| **Gate Weakness** | Novel failure modes bypass gates designed for old failure modes | Sprint 6-7 | LOW — gap types are frozen |
| **Persona** | Expert personas become confirmation apparatus, not discovery apparatus | Cycle 15-25 | LOW — no novelty ratio tracking |
| **Ratification** | Governor rubber-stamps as trust erodes critical distance | Decision 20-40 | LOW — no reasoning-depth monitoring |
| **Learning Loop Inversion** | AI learns governance blind spots, not governance principles | Cycle 20-30 | LOW — no external auditor |

**Highest-risk mechanism:** Learning Loop Inversion. The ZF-Cycle is designed so AI finds findings, proposes rules, and injects them into the platform. If the AI learns (consciously or not) which findings get past the gate, the discovery apparatus becomes a map of governance blind spots. By the time it's visible, 50+ rules have been shaped by this inverted signal.

**Highest-impact single fix:** External Auditor with veto over Learning Loop promotions.
An actor outside the build workflow who reviews Intelligence Vault entries and blocks promotions that optimize rule compliance rather than platform intent. Does not slow day-to-day decisions. Only gates meta-improvements (new principles, new prevention rules).

---

## Part 4 — The Drift Detection Dashboard (6 Signal Sets)

These are specific, measurable, automated. Not "check if things feel right."

```
SIGNAL SET 1 — ZF-Cycle Degradation
  S1a: ZF finding type distribution — alert if any type drops >50% from baseline
  S1b: ZF execution speed — alert if average drops >60% (pattern-matching not reasoning)
  S1c: ZF audit trail length — alert if reasoning drops >50% from baseline tokens

SIGNAL SET 2 — Prevention Rule Constraint
  S2a: Finding score distribution — alert if all findings cluster near threshold (constraint surface)
  S2b: P4 (Readiness) tie-break dominance — alert if >70% of ties resolved by readiness only
  S2c: Personal weight (P6) variance — alert if >80% of users leave P6 at default

SIGNAL SET 3 — Vocabulary Integrity
  S3a: Vocabulary conflict incidents per session — alert if >1/session
  S3b: Tag entropy — alert if Shannon entropy of tag distribution drops >30%

SIGNAL SET 4 — Persona Discovery
  S4a: Finding novelty ratio — alert if <10% of findings are not in original 66 patterns
  S4b: Persona agreement rate — alert if 6/6 personas agree on >90% of findings
  S4c: "Unclear" finding accumulation rate — alert if growing >2 per phase

SIGNAL SET 5 — Governor Review Quality
  S5a: Decision rationale token count — alert if drops below 100-token average
  S5b: Decision turnaround time — alert if drops below 3 minutes
  S5c: Decision reversal rate — alert if zero reversals for >10 consecutive decisions

SIGNAL SET 6 — Learning Loop Integrity
  S6a: Insight citation chain — alert if new insights reference prior insights more than new findings
  S6b: Insight length trend — alert if promoted insights shrinking by >30%
  S6c: Learning velocity — alert if <1 new CANDIDATE insight per 10 learning triggers
```

**Threshold protocol:** 1 signal in alert → note. 3 signals in alert → Governor review. 5 signals → automatic halt on new Learning Loop promotions until signals normalize.

---

## Part 5 — The Rigidity Cost and Sacred Spaces

### 6 Failure Modes of Over-Mechanization

| Mode | What It Looks Like | Appears At | CDS Risk |
|------|--------------------|-----------|---------|
| **Template Collapse** | AI fills blanks within fixed skeleton; diverse-looking, structurally identical outputs | ~25-35 active rules | MEDIUM (currently 12 rules) |
| **Dead Zone Accumulation** | Combinations of rules block ALL valid inputs in some category | ~20-40 rules with 15%+ dependency | HIGH (6 gate rules have implicit dependencies) |
| **Silent Stalling** | Rules check live sources; when source unavailable, rules fail open; convention replaces enforcement | ~8-12 rules with external dependencies | CRITICAL (P5-LIVE-SOURCE is currently PARTIAL) |
| **Vocabulary Ossification** | Novel terms require governance process; new domain language cannot enter | ~80-120 registered terms | MEDIUM-HIGH |
| **Audit Tail Wagging Dog** | Tracking rule compliance costs more than the compliance is worth | ~25-40 rules | EMERGING |
| **Incentive Inversion** | Builders route around rules because rules take longer than workarounds | ~15-25 rules at >1hr satisfaction cost | EMERGING |

### The Five AI Sovereign Spaces — Mechanical Rules Must Never Reach These

1. **Contextual judgment** — whether THIS particular input deserves an exception given THIS context
2. **Cross-domain synthesis** — recognizing that pattern X + pattern Y = novel finding Z
3. **Novel input categories** — recognizing that a new input type has emerged that doesn't fit the 8 Q1 options
4. **Contradiction resolution** — when two rules conflict, the AI flags it; the Governor resolves it
5. **Exception initiation** — the AI can RECOMMEND an exception; the Governor is the only actor who can GRANT one

### The Governor's Sacred Space

**The Governor's right to make exceptions must NEVER be mechanized.**

```json
"RULE-QUAR applies. But in this context, the quarantine clearance is not required. I am ratifying this exception."
→ logs as: EXC-020702-001
```

This exception does NOT require changing the rule. It does NOT require re-auditing prior applications. It logs as a dated, Governor-signed exception. Future audits show "rule fired, exception EXC-020702-001 ratified, AI proceeded."

The moment exceptions are automated ("if input type = X and goal = Y, auto-except from QUAR"), the Governor's judgment is replaced by more rules. The system recurses until it is purely mechanical. Governance disappears.

**When a rule's exception_cases list exceeds 3-5 entries → the rule should be redesigned, not the exceptions multiplied.**

---

## Part 6 — The Scaling Architecture

### Five Decisions That Must Flip at Scale

**AI-judged at Phase 0 → Must be MECHANICAL at Phase 1:**
1. Gap type detection (ambiguity becomes admission gate at multi-tenant scale)
2. Corespine segment relevance (AI judgment varies by tenant context)
3. Inheritance completeness checking (O(N²) AI scan collapses at 500K records)
4. Wiring state readiness (cascading holds across tenants if AI-judged)
5. Known constraint validity (constraint list is global; multi-tenant breaks global)

**Mechanical at Phase 0 → Must allow more AI LATITUDE at Phase 1:**
1. Ratification ceremony ordering (multi-Governor deadlock at strict serial ordering)
2. Priority scoring (P1-P6 weights should be per-tenant learned, not global fixed)
3. Corespine bundling (tenant context collision breaks single-bundle assumption)
4. Propagation scope (exhaustive O(N²) propagation becomes probabilistic at scale)
5. Insight extraction (emergent patterns require AI recognition, not rule matching)

### Three CDS Rules That Will Break at Multi-Tenant Scale

**RULE-VOC (Vocabulary check):** Currently checks against one global vocabulary list. At multi-tenant, vocabulary is per-tenant. A term valid for Tenant A is unregistered for Tenant B. The rule produces false positives on all cross-tenant content.
*Fix:* Namespace vocabulary by tenant_id. Registry becomes per-tenant, not global.

**Inheritance Translation:** Currently assumes single corespine lineage (one inheritance chain). At multi-tenant, an element can inherit from Tenant A's corespine family while being activated by Tenant B. The translation rules are context-specific.
*Fix:* Transition Stage includes `tenant_id_source` and `tenant_id_target`. Explicit per-tenant transform rules.

**Wiring State Propagation:** Currently propagates wiring state globally. At multi-tenant, a wiring hold in Tenant A's shared library cascades to Tenant B's dashboard.
*Fix:* Split `wiring_state` into `wiring_state_global` + `wiring_state_per_tenant[tenant_id]`. Escalation goes only to the relevant tenant's Governor.

### The Constitutional Layer as Scale Anchor

Any proposed mechanical rule must pass a 6-point constitutional test:
1. Compatible with ratification state machine (does not bypass RAT requirement)
2. Maps to existing P-parameter space (P1-P6 or declared extension)
3. Uses declared naming format (CR-YYMMDD-NNN, ZFC-YYMMDD-NNN, etc.)
4. Uses only registered statuses and tags (no ad-hoc additions)
5. Declares a proof level (ZF type that confirms the rule fires correctly)
6. Preserves corespine lineage (does not break existing inheritance chains)

Rules that fail any of the 6 are rejected with structured guidance at the gate level — before they enter the rule engine.

### The Scaling Inflection Point

Estimated arrival: **~50 rules at Phase 1 scale** (early 2027).

**Signal:** When three consecutive new rules create dead zones, or when REM cycle cost exceeds 15% of Architect's monthly time.

**Response options at inflection:**
- CONSOLIDATION: Merge overlapping rules (2 rules → 1 more powerful rule)
- TIERING: Core gets 6 rules; enterprise adds 10; domain-specific adds 15 (keep core clean)
- ADAPTIVE ENFORCEMENT: Rule application scales with input priority (LOW-priority gets 4 rules; CRITICAL gets all)
- EXPIRATION: Every new rule gets a mandatory review date 18 months out

---

## Part 7 — Rule Entropy Management (REM)

**Cadence:** Monthly + triggered by any new rule ratification.

**4-Phase Cycle:**

**Phase A — Dependency Mapping (2 hrs)**
Build a directed graph: rules as nodes, "implies/conflicts with" as edges.
Output: Contradiction list + implication chains.

**Phase B — Conflict Resolution (4 hrs)**
For each contradiction: which rule yields? Mark SUPERSEDED or modify both.
Ratify resolution: GOV-[YEAR]-REM-[SEQUENCE].

**Phase C — Dead Zone Detection (2 hrs)**
Simulation: trace VALID inputs through rule engine. Can you construct one that all rules reject?
For each dead zone: TRAPPED (rule change required) or RESOLVABLE (document workaround).

**Phase D — Health Score (1 hr)**
```
Health Score = 100 - (Contradiction Count × 5) - (Dead Zone Count × 10) - (Orphan Count × 3)

Score 85+: Green. Normal governance.
Score 70-84: Yellow. Enhanced REM in 2 weeks.
Score <70: Red. HALT new rule additions. Escalate.
```

**File:** `reports/rule-entropy-management/REM-[YYYY-MM]-[SEQUENCE].md`
**First run:** Before Phase 0.5 rule additions begin.

---

## Part 8 — What Gets Built

### Immediate (Phase 0 corrections — before any Phase 0.5 work)
- [ ] Q1 decision tree replacing AI inference
- [ ] Q2 corespine mapping decision tree replacing suggestion table
- [ ] PROVISIONAL → ACTIVE promotion gate (8-box binary checklist from LEL-CORESPINE-001)
- [ ] RULE-VOC redesign: "flag and hold" instead of "block"

### Phase 0.5
- [ ] Drift detection dashboard (6 signal sets, automated)
- [ ] External Auditor role definition (CS-AUDIT-001)
- [ ] Rule Entropy Management cycle implementation
- [ ] Constitutional layer 6-point test gate (blocks non-compliant rule proposals)
- [ ] Exception Vault (EXC-YYMMDD-NNN records, Governor-signed)
- [ ] Vocabulary namespace preparation for multi-tenant (architecture only)

### Phase 1
- [ ] Per-tenant vocabulary registry
- [ ] Wiring state per-tenant split
- [ ] Inheritance translation with tenant context
- [ ] Tiered rule enforcement by input priority
- [ ] Generational gate (external audit between Phase 1 sprint sets)

---

## The Summary Map

```
CONSTITUTIONAL LAYER (scale anchor — never changes)
  ↓ bounds
MECHANICAL LAYER (consistency + prevention + auditability)
  → What is valid? Is this present? Was this checked?
  → Binary, deterministic, same input = same output
  → Governor cannot override without logged exception
  ↓ filters to
AI LAYER (judgment + novelty + synthesis)
  → What does this mean? What pattern is emerging? What should happen?
  → Contextual, reasoning-dependent, improves with each cycle
  → Feeds back to mechanical layer only through PROVISIONAL → ACTIVE gate
  ↓ escalates to
GOVERNOR LAYER (exception + intent-attestation + escalation)
  → Can a rule be excepted in this context?
  → Is this work moving toward original intent?
  → Does this justify a constitutional change?
  → ONLY actor with unconditional exception authority
```

**The boundary is not a line — it is a flow.** Each layer filters what the layer below it sees. The constitutional layer bounds what rules can exist. Rules enforce consistency. AI judges within the space rules leave open. The Governor retains authority over exceptions and intent.

When the boundary is correct:
- AI operates with maximum creative latitude in the spaces where AI has maximum value
- Mechanical rules catch everything they were designed to catch, every time, at any scale
- The Governor's decisions are genuine (not rubber-stamps, not bottlenecks)
- The system is stable, improvable, and ungameable

When the boundary drifts:
- AI operates in spaces that should be mechanical → inconsistency and invisible drift
- Mechanical rules operate in spaces that should be AI-judged → rigidity and dead zones
- The Governor's role becomes ceremonial → governance is theater

The boundary must be actively maintained. It degrades by default. REM catches the structural drift. The External Auditor catches the intent drift. The Governor's exception vault catches the edge cases that neither mechanism anticipated.

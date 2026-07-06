# CDS-LEL-CORESPINE-001
## Learning and Evolution Loop — Constitutional Architecture

**Document ID:** CDS-LEL-CORESPINE-001
**Status:** PROPOSED — PENDING GOVERNOR RATIFICATION
**Date:** 2026-07-02
**Authored by:** CDS Builder (Sonnet 4.6)
**Research inputs:** Opus (holistic), 5 Haiku specialists (prompt, cross-model, persona, fleet, lifecycle)
**Governor:** Yariv Fink
**Corespine:** CS-LEL (Learning Architecture)
**Build phase:** Core primitives Phase 0.5 / Full implementation Phase 1

---

## Constitutional Rule (LOCKED on ratification)

> **EVERY ROUND MAKES THE NEXT ROUND SMARTER.**
> No audit cycle runs identically twice. Each output mutates the next input.
> No finding is hardwired without confirmation. No hardwired rule is permanent without a deprecation path.

---

## Part 1 — The Three Core Primitives

*Opus verdict: these three are the LEL. Everything else is amplification on top of them.*

### Primitive 1 — MEMORY
A `data/lel-state.json` file that every `buildPhaseNPrompt()` function in `zf-cycle/engine.ts` **reads before generating** and every `advanceZFCycle()` **writes after each phase.**

Currently: prompts are generated fresh from static functions with zero memory of prior cycles.
After: prompts have context of what the previous round found, which patterns were confirmed, which were deprecated.

### Primitive 2 — CONFIDENCE
Every finding and every injected rule carries:
- `confidence_score: number` — agent_count / fleet_size × 100
- `evidence_count: number` — how many independent sources confirmed
- `evidence_sources: string[]` — which agents / models confirmed

Currently: a finding from 1 Haiku agent is identical in authority to one confirmed by 8.
After: authority is earned by independent confirmation. 1 agent = LOW. 3+ = MEDIUM. 5+ = HIGH. 8 = CONFIRMED.

### Primitive 3 — REVERSIBILITY
Status lifecycle on all prevention rules and injected rules:
```
PROVISIONAL → ACTIVE → DEPRECATED → (superseded by new PROVISIONAL entry)
```

Append-only is preserved (never delete). A rule is superseded by a later append that points back at it via `supersedes: "<rule_id>"`.

Currently: status is binary (`ACTIVE`). No revert path. A false positive is permanent.
After: any rule can be superseded in one append. Demotion is cheap. Promotion is earned.

---

## Part 2 — The Pipeline (What Already Exists + What Changes)

### Existing ZF-Cycle Pipeline
```
SCAN (Haiku fleet) → REVIEW (Sonnet) → HOLISTIC (Opus, triggered) → INJECT (Sonnet)
```

### LEL Enhancement Layer (additions only — pipeline unchanged)

```
ROUND N:

  PRE-SCAN: Read lel-state.json → inject prior-round context into each Haiku prompt
      ↓
  SCAN (Haiku fleet, parallel):
    Each agent reads: own persona + cross-agent briefing from round N-1 (HIGH+ findings only)
    Each agent outputs: findings with code_location, gap_type, severity
      ↓
  FLEET AGGREGATION (Sonnet):
    Deduplication: file_path + gap_type + root_cause match
    Confidence scoring: agent_count / 8 × 100
    Disagreement detection: existence-split flagged, lens-difference explained
    Output: fleet_result{} with confirmed[], contested[], single_source[]
      ↓
  REVIEW (Sonnet):
    Input: fleet_result + Finding Vector (5 numbers, 4 booleans — NOT raw 66 findings)
    Output: root_cause[], enforcement_class[], architectural_indictment
      ↓
  HOLISTIC (Opus — triggered when 3+ CRITICAL in same domain):
    Input: architectural_indictment + Haiku raw (both layers)
    Output: platform_pattern + scan_target_delta (new scan questions for round N+1)
      ↓
  INJECT (Sonnet):
    All injections enter as PROVISIONAL (never directly ACTIVE)
    Confidence gate checked before injection
      ↓
  POST-ROUND: Write lel-state.json → next round reads this
```

---

## Part 3 — Cross-Model Calibration Protocol

*What each model shares with each other. Minimum viable — not what would be nice, what actually changes the next output.*

### Haiku → Sonnet
**Finding Vector** (not raw findings):
```
FINDING VECTOR:
  Distribution: CRITICAL:N HIGH:N MEDIUM:N LOW:N
  Domain clusters: [domain → C+H count, ranked]
  Cross-domain patterns: 4 booleans (prevention bolted-on?, live registries?, immutability held?, inputs validated?)
  Contested findings: [list of findings where agents disagreed]
```
Why: 5 numbers + 4 booleans + contested list lets Sonnet identify design failures vs. code sloppiness without re-reading 66 items.

### Sonnet → Opus
**Architectural indictment** (not symptom list):
```
ARCHITECTURAL INDICTMENT:
  Design layer violations: N (design principle stated but not enforced)
  Execution layer violations: N (principle exists, code breaks it)
  Ratio: N:N — indicates architecture or execution problem
  Governance rules mechanical: N of M
  Gaps requiring holistic view: [list of gap names, not findings]
```
Why: Opus clusters by root cause. It needs the abstraction level — "design permits this failure" — not the evidence list.

### Opus → Haiku (next round)
**scan_target_delta** — the only arrow that doesn't yet exist:
```
SCAN TARGET DELTA (for lel-state.json → next Haiku prompt):
  Pattern: "[principle name]"
  Haiku scan question: "[concrete, grep-able question]"
  Files to check: [list]
  Expected signal: "[what a violation looks like]"
  Confirmation metric: "[what 'found it' means]"
```
Example: Opus says "prevention is not hardwired in core entry points." Translation: "Every endpoint — verify auth middleware appears before line 1 of handler. Grep: `app\.(get|post|patch)` — auth call must precede handler reference."

### Opus → Sonnet (lens update)
**known_patterns[]** list prepended to Sonnet's next REVIEW prompt:
When Sonnet sees a finding matching a known platform pattern, it skips re-analysis and applies the established prevention hook directly.

### Haiku → Haiku (cross-agent briefing)
After round completes, Sonnet computes cross-agent references. Before next round:
- HIGH+ findings from any agent are shared to all other agents whose scope overlaps
- Format: `[Finding X] → relevant to [EXPERT-Y] because [one sentence why]`
- Threshold: HIGH and CRITICAL only (LOW/MEDIUM stay within their expert's domain)

---

## Part 4 — Persona Library

### Minimum Viable Persona Definition
```json
{
  "name": "EXPERT-[TYPE]",
  "focus_areas": ["string"],
  "detection_patterns": ["string"],
  "findings_grammar": "TYPE-NNN: [title]",
  "severity_weight": [CRITICAL%, HIGH%, MEDIUM%],
  "blind_spots": ["string"],
  "confirmed_findings": [
    {
      "finding_id": "STRING",
      "title": "STRING",
      "prevention_rule": "STRING",
      "learned_date": "DATE",
      "status": "OPEN | FIXED"
    }
  ],
  "tier_extensions": {
    "haiku":  { "scope": "single pattern", "depth": "surface scan", "output_format": "binary | one-liner" },
    "sonnet": { "scope": "pattern + context", "depth": "moderate", "output_format": "finding + evidence" },
    "opus":   { "scope": "meta-patterns", "depth": "holistic", "output_format": "finding + systemic implication" }
  }
}
```

### Persona Evolution
Confirmed findings append to `confirmed_findings[]`. Status is OPEN until the finding closes (code fixed), then FIXED — but the entry persists as immune system memory.

### Persona Spawning
When a finding reveals a gap that none of the current 8 expert personas would catch in subsequent rounds → spawn a new persona. Rule: gap_type not present in any existing expert's `focus_areas`. Minimal spawned persona uses the same 5-field base schema.

### Opus → Haiku Translation
Opus produces systemic patterns (high abstraction). Translation rule:
1. Extract Opus's principle ("prevention is not hardwired at entry")
2. Decompose to concrete grep/code signals
3. Assign blind_spots to what Haiku won't catch (Opus/Sonnet handle those)
4. Tag `parent_pattern` so Opus can verify coverage next round

**File: `threshold/data/persona-library.json`** — to be created Phase 0.5

---

## Part 5 — Insight Lifecycle

### 5 Stages
```
SCANNED → PROPOSED → PROVISIONAL → ACTIVE → DEPRECATED
```

| Stage | Trigger | Actor |
|-------|---------|-------|
| SCANNED | Haiku fleet outputs it | Model |
| PROPOSED | Governor triage decision | Human |
| PROVISIONAL | Rule written, 8-box checklist passed | Model + Human |
| ACTIVE | Injected to gate target, confirmed no conflicts | Model + Human |
| DEPRECATED | False positives found OR Governor decision | Human (authorized) |

### Promotion Gate (PROVISIONAL → ACTIVE) — all 8 binary
- [ ] Rule statement is atomic (single testable constraint, no ORs)
- [ ] Binary check function exists (programmatically verifiable)
- [ ] Reads from live source (no hardcoded values)
- [ ] Non-overlapping (no contradiction with existing ACTIVE rules)
- [ ] Gate target assigned (GATE-AUTH, CHECK-IMPL, etc.)
- [ ] Phase dependencies exist or are stubbed with MOCK_MODE
- [ ] False positive baseline: 0 on Phase 0 codebase
- [ ] Human sign-off (Governor or designated owner, name + date)

### Deprecation Path (append-only)
1. Append to `deprecation_log.json` with reason + false positive examples
2. Mark in `prevention-rules.json`: `status: "DEPRECATED"`, `supersedes` back-pointer
3. Append deprecation event to affected entries in `injection-targets.json`
4. Append to `scanner-exclusions.json` — pattern the scanner must skip next round
5. If replacement rule exists, inject it as PROVISIONAL immediately

**Critical:** A deprecation that doesn't update the scanner exclusion list is incomplete — the next Haiku round will re-discover and re-inject the same false positive.

### Scale Ceiling
- Max 60 rules total across all gates
- Max 15 rules per gate target
- Mechanical enforcement ≥ 70% of total
- Consolidation pass triggered automatically when any limit is reached

---

## Part 6 — Prompt Evolution Engine

### Prompt Performance Signals (3 measurable)
1. **Gap Coverage Rate**: findings found / scope_items_active (CDS baseline: 6/10 per round)
2. **False Positive Density**: contradicted_findings / total_findings (target: <5%)
3. **Novelty Signal**: new findings not in prior round's lists (healthy: 1–3 per round; 0 = prompt stale)

### Prompt Delta Rule
One confirmed finding → one surgical addition to that expert's prompt (~40 tokens).
Never a full rewrite. Graduation threshold: 3+ independent agent confirmations.
Max 1 graduation per expert per round. Token cap: 600 per prompt.

### Prompt Evolution Registry
**File: `threshold/data/prompt-evolution-registry.json`** — to be created Phase 0.5

Schema per entry:
```json
{
  "id": "EXPERT-[TYPE]-v[N]",
  "expert_type": "STRING",
  "version": "integer",
  "parent_version": "STRING",
  "triggered_by_finding": "FINDING-ID",
  "delta_summary": "STRING",
  "changes": [{ "type": "add_instruction", "instruction_text": "STRING", "tokens": "integer" }],
  "confidence": "HIGH | MEDIUM | LOW",
  "created_at": "ISO timestamp"
}
```

### Cross-Model Prompt Feedback
From Sonnet's meta-review:
- `findings_rejected[]` → remove those scan patterns from Haiku prompt (false positives)
- `findings_elevated[]` → raise severity weight in Haiku prompt for those domains
- `gap_pattern` → add as new detection target if not already present

---

## Part 7 — What Gets Built (Phase Assignment)

### Phase 0.5 (Core primitives — before Phase 1 build begins)
- `data/lel-state.json` — memory store read/written by engine.ts
- Add `confidence`, `evidence_count`, `evidence_sources` to `ZFStageOutput` in types.ts
- Add `status: PROVISIONAL | ACTIVE | DEPRECATED`, `supersedes`, `confidence` to `InjectedRule` and `prevention-rules.json` schema
- `data/persona-library.json` — all 8 expert personas portable
- `data/prompt-evolution-registry.json` — versioned prompt deltas
- `data/deprecation_log.json` — append-only deprecation ledger
- `data/scanner-exclusions.json` — false positive inoculation registry
- Update `buildPhase1Prompt()` in engine.ts to read lel-state.json
- Wire `AUTO_BATCH` trigger in engine.ts (currently dead code enum)
- All injections enter as PROVISIONAL — promotion gate enforced before ACTIVE

### Phase 1 (Full LEL operational)
- Fleet aggregation API endpoint — POST /api/fleet/aggregate
- Persona spawning — POST /api/persona/spawn
- Prompt graduation — POST /api/prompt/graduate
- Cross-model briefing generator — runs post-round, before next scan
- Consolidation pass — triggered when rule ceiling reached

---

## CDS Confirmation (Mode 1)

"LEL-CORESPINE-001 authored — three core primitives (memory, confidence, reversibility), five lifecycle stages, cross-model flow defined, six new data files for Phase 0.5, pending Governor ratification."

---

## Section 8 — Constitutional Boundary Constraints on the Learning Loop

**Addendum ID:** CDS-LEL-SECTION8-001
**Ratification:** GOV-LEL-001 CONFIRMED (Yariv Fink, 2026-07-02)
**Status:** RATIFIED — constitutional standing confirmed
**Source:** https://docs.google.com/document/d/1Q5jHbejSvsRn0Oa6MK1dx0ufy8zfl6xdOJhvX872wts/edit

---

### 8.1 — The Layer 1 Deprecation Rule (constitutional)

> **AI CAN PROPOSE Layer 1 gate deprecations. Only the GOVERNOR EXECUTES them.**

This rule is not a guideline. It is the constitutional constraint that prevents the LEL from becoming a self-modifying governance system.

A Layer 1 gate is a hard enforcement mechanism — a rule that fires mechanically without AI involvement. The decision to remove or downgrade a Layer 1 gate is a governance act of the highest order. It changes what the platform will and will not permit for all future operations.

**AI is permitted to:**
- Identify that a Layer 1 gate may be producing false positives
- Gather evidence across multiple audit rounds (PROVISIONAL lifecycle)
- Produce a structured deprecation proposal with evidence and reasoning
- Present that proposal to the Governor through the External Auditor path

**AI is NOT permitted to:**
- Mark a Layer 1 gate as DEPRECATED without Governor signature
- Suspend a Layer 1 gate pending review
- Route around a Layer 1 gate while a deprecation proposal is pending
- Treat Governor silence as implicit approval

**The block stands until the Governor acts. No exception. No timeout. No auto-approval.**

---

### 8.2 — The Three Sovereignty Declarations

**MECHANICAL ENFORCEMENT OWNS THE WHAT:**
Is this valid? Is this present? Was this checked?
These questions are answered by code.
Code does not interpret, infer, or reason about context.
If answering requires interpretation — it is not a Layer 1 question.

**AI OWNS THE WHAT FOR:**
What does this mean? What should happen? What pattern is emerging?
These questions are answered by AI.
AI does not store, enforce, or promote its own conclusions to Layer 1.
If the answer is binary and fully specified — it is not an AI question.

**THE GOVERNOR OWNS THE EXCEPTION:**
The right to say "yes, this violates the rule, and in this context, that is correct" is sovereign and cannot be automated.
When a rule accumulates more than 3-5 exception cases: redesign the rule, not the exceptions.
Exception logic in code is governance wearing code clothing.

---

### 8.3 — The Learning Loop Inversion Protection

The LEL must not learn which findings pass the governance gate.
It must learn which findings represent real gaps.

These are different objectives and they diverge over time if not explicitly separated.

**INVERSION SIGNAL:** Finding promotion rate accelerates over time without a corresponding decrease in platform defect rate. If promotions increase but defects don't decrease → inversion suspected. Route to External Auditor immediately on detection of this signal.

**EXTERNAL AUDITOR TRIGGER:** Governor-direct request only.
The Governor sends the LEL promotion list to Brain independently.
The Builder is excluded from this audit loop entirely.
No Builder-triggered Opus invocation fills the External Auditor role.

---

### 8.4 — Reasoning Trace Requirement (GOV-GAPS-001, confirmed 2026-07-02)

Every AI decision output in the LEL must carry a `reasoning_trace` field:

```
reasoning_trace:
  decision_type:     [CLASSIFICATION | SCAN_TARGET | PROMOTION |
                      DEPRECATION_PROPOSAL | PATTERN_SYNTHESIS]
  decision_made:     [the actual output]
  branches_fired:    [which decision paths were taken]
  branches_rejected: [which paths were considered and why rejected]
  uncertainty_flag:  [CLEAR | PARTIAL | UNCLEAR]
  confidence_basis:  [what evidence this decision rests on]
  contra_indicators: [anything that argued against this decision]
```

The `reasoning_trace` is:
- Stored in `lel-state.json` alongside the decision it documents
- Subject to the same append-only immutability as all governance records
- Readable by EXPERT-AI-HAIKU and EXPERT-GOV-HAIKU in every audit
- The primary input to `confidence_score` calculation

**An AI decision without a `reasoning_trace` is ungoverned.**
An ungoverned AI decision cannot be promoted to ACTIVE status.
Cannot be used as evidence in a deprecation proposal.
Cannot influence `scan_target_delta` in subsequent rounds.

---

### 8.5 — Rule Entropy Management (Phase 1 gate — not Phase 0.5)

Three LEL rules break at multi-tenant scale (Phase 1 / Function 2):
- **RULE-VOC:** global vocabulary list — does not scale to tenant-specific terms
- **Inheritance translation:** no tenant context in current logic
- **Wiring state propagation:** global cascade affects all tenants

Rule Entropy Management (REM) must be designed before Phase 1 begins.
This is a Phase 1 gate. It is noted here so it surfaces in Phase 1 design, not as a surprise when Phase 1 build starts.

**No Phase 1 build begins without REM in the design plan.**

---

*Section 8 appended: 2026-07-02 | Ratification: GOV-LEL-001 | Governor: Yariv Fink | Brain: Claude AI*

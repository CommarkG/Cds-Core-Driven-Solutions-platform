# BRAIN-PROMPT-LEL-001
## Learning and Evolution Loop — Findings for Brain Review

**Date:** 2026-07-02
**Prepared by:** CDS Builder (Sonnet 4.6)
**Research fleet:** Opus (holistic architecture) + 5 Haiku specialists
**Document:** CDS-LEL-CORESPINE-001 (full architecture in threshold/docs/constitutional/)
**Purpose:** Present research conclusions and request Brain's strategic review

---

Brain —

We ran a full research fleet on the multi-model learning loop question. One Opus agent for holistic architecture, five Haiku specialists (prompt evolution, cross-model calibration, persona library, fleet orchestration, insight lifecycle). What follows is the synthesis. Depth is available — this is the shortest complete version.

---

## The Core Finding (Opus, verified by all 5 Haiku agents)

The CDS ZF-Cycle already has the pipeline. What it does NOT have is three primitives without which the pipeline cannot learn:

**1. MEMORY** — prompts are generated fresh every round from static functions (`buildPhase1Prompt` etc. in `engine.ts`). Nothing reads prior-cycle output. The pipeline has perfect amnesia. Fix: one `lel-state.json` file that every prompt generator reads before generating and writes after each phase.

**2. CONFIDENCE** — a finding from 1 Haiku agent has identical authority to one confirmed by 8. No `confidence` or `evidence_count` field exists on `ZFStageOutput` or `InjectedRule`. Fix: add those two fields everywhere findings or rules are stored. Fleet produces a score: agent_count / 8 × 100.

**3. REVERSIBILITY** — all prevention rules and injected rules are `status: "ACTIVE"` with no exit path. A false positive is permanently hardwired. Fix: `PROVISIONAL → ACTIVE → DEPRECATED` lifecycle on all rules. Append-only model preserved via supersession entries that point back at the rule they replace.

Opus's verdict: these three are not the first features of the LEL — they **are** the LEL. Everything else (persona evolution, fleet orchestration, auto-triggering) is amplification of a substrate that first has to be safe and stateful.

---

## The False Positive Problem — and its Solution

The failure mode: Model A flags something incorrectly → Sonnet learns from it → Opus hardens it → injected as prevention rule → false positive is permanently in the gate blocking valid work.

**Circuit breaker:** Nothing enters as ACTIVE on first injection. All rules enter as PROVISIONAL. PROVISIONAL rules are live (they fire) but labeled — a PROVISIONAL block announces its own uncertainty rather than hard-blocking.

**Promotion gate (PROVISIONAL → ACTIVE):** Two independent agents confirmed + survived one full audit re-sweep without contradiction + no conflict with existing ACTIVE rules. All three required. Any single model — including Opus — can recommend promotion but cannot grant it alone. This is deliberate: eloquence must not be the path to hardwiring.

**Demotion:** Any single signal suffices (later scan contradicts, rule generates false positive, Governor override). Asymmetry is the safety design: removal is cheap, addition is earned.

**Deprecation without deletion (append-only model):** Rules are superseded, never deleted. A `REVERTED` entry points back at the rule it supersedes. Gates resolve live status by taking the latest entry in the supersession chain. Critical: every deprecation must also write to `scanner-exclusions.json` — a false positive inoculation registry that prevents the next Haiku round from re-discovering and re-injecting the same pattern. A deprecation without scanner inoculation is incomplete.

---

## Cross-Model Calibration — What Actually Flows Between Models

The minimum viable data exchange (not what would be nice — what measurably changes the next output):

**Haiku → Sonnet: Finding Vector** (not the 66 raw findings)
- 5 numbers: CRITICAL:N HIGH:N MEDIUM:N LOW:N per domain, ranked
- 4 booleans: prevention bolted-on?, live registries in place?, immutability held?, inputs validated?
- Contested list: findings where Haiku agents disagreed

This lets Sonnet identify design failures vs. code sloppiness without re-reading everything.

**Sonnet → Opus: Architectural Indictment** (not a symptom list)
- Design layer violations: N (principle stated but architecture doesn't enforce it)
- Execution layer violations: N (principle exists, code breaks it)
- Ratio tells Opus whether this is an architecture problem or an execution problem
- Named gaps (not findings): what abstract failure patterns need systemic synthesis

**Opus → Haiku next round: scan_target_delta** ← the arrow that does not yet exist
- Opus outputs `platform_pattern` (already in schema) PLUS a new `scan_target_delta` field
- `scan_target_delta` = concrete scan question phrased as a Haiku grep target
- Example: Opus says "governance rules exist as labels not mechanisms." Translation becomes: "Check RULE-PARK, RULE-VOC, RULE-GOAL — grep for `const.*=\s*\[.*\]` in rule definitions. Expected: live registry call. Violation: hardcoded array."
- This arrow is what closes the loop. Without it, Opus synthesizes and the insight evaporates.

**Haiku → Haiku: Cross-agent briefing** (computed post-round by Sonnet, zero additional cost)
- HIGH and CRITICAL findings only
- Format: `[Finding X] → relevant to [EXPERT-Y] because [one sentence]`
- Next round, each agent starts with cross-domain awareness it didn't have before

---

## Multi-Haiku Fleet — Where the Value Actually Is

Three candidate value sources: breadth, divergence signal, confidence scoring.

**Confidence scoring is the primary value.** The fleet's job is not 8x coverage of one codebase — it is manufacturing an agreement ratio. That ratio is the input to the PROVISIONAL → ACTIVE promotion gate. Without it, there is no cheap way to distinguish a 1-vote hallucination from a 5-vote real defect.

**Divergence is the second-order signal.** Where agents split on a finding, you have found either an ambiguous spec (route to Governor) or a hallucination boundary. The disagreement is higher-signal than the agreement.

**Breadth is weakest** for CDS specifically. The 8 personas already partition the scan space. Running multiple agents per persona adds redundancy (which you want for confidence) — not reach.

Deduplication rule (structural, no LLM): findings collapse when they share file_path + gap_type + root_cause. Confidence = agent_count / 8 × 100. Disagreement = lens difference, not invalidity — a SECURITY agent and a SYSTEMS agent scanning the same file with different check types will produce an apparent non-detection; this is explained by lens, not error.

---

## Prompt Evolution — How Prompts Get Smarter Each Round

**Not rewrites. Surgical additions.**

One confirmed finding (3+ independent agents) → one instruction added to that expert's prompt template (~40 tokens). Max 1 graduation per expert per round. Prompt cap: 600 tokens.

Three performance signals that tell you whether a round's prompt worked:
1. Gap Coverage Rate: findings / active scope items (CDS baseline today: ~60%)
2. False Positive Density: contradicted findings / total (target: <5%)
3. Novelty Signal: findings not in prior round (healthy: 1–3; zero = prompt stale)

Sonnet's meta-review outputs two lists that feed directly back into Haiku prompts:
- `findings_rejected[]` → remove those scan patterns (false positives confirmed)
- `findings_elevated[]` → raise severity weight for those domains

New file: `prompt-evolution-registry.json` — versioned prompt deltas, each entry tracing back to the finding that triggered it.

---

## Critical Gap Identified: HOLISTIC Auto-Trigger is Dead Code

Opus found this reading the actual files. The `AUTO_BATCH` trigger type exists as an enum in `zf-cycle/types.ts` line 33 but is unwired in `engine.ts`. The "3+ CRITICAL auto-trigger" described in CDS governance docs is manual today — it fires only on explicit `trigger_holistic: true` in the API request.

This means the feedback loop from Opus to the next round has never actually run automatically. Every Opus synthesis has been manually requested. The loop cannot be recurring and self-improving until this trigger is wired.

This is a Phase 0.5 build item, not Phase 1.

---

## What Gets Built and When

**Phase 0.5 (before any Phase 1 build):**
- `data/lel-state.json` — memory store
- Add `confidence`, `evidence_count`, `evidence_sources` to `ZFStageOutput` and `InjectedRule`
- Status lifecycle (`PROVISIONAL | ACTIVE | DEPRECATED`) + `supersedes` on all rules
- `data/persona-library.json` — 8 portable expert personas
- `data/prompt-evolution-registry.json` — versioned prompt deltas
- `data/deprecation_log.json` — append-only deprecation ledger
- `data/scanner-exclusions.json` — false positive inoculation registry
- `buildPhase1Prompt()` reads `lel-state.json` before generating
- Wire `AUTO_BATCH` trigger in `engine.ts`
- All injections enter as PROVISIONAL

**Phase 1:**
- Fleet aggregation endpoint
- Persona spawning
- Prompt graduation (automated)
- Cross-model briefing generator
- Consolidation pass (triggered at rule ceiling)

---

## Questions for Brain

**Q1 — Core sequence:** The three primitives (memory, confidence, reversibility) are the preconditions. Before those exist, adding more Haiku agents or more personas is decorating a loop that can't actually learn. Do you agree this is the right sequencing, or is there a higher-priority primitive we missed?

**Q2 — The PROVISIONAL tier:** Every new rule enters as PROVISIONAL — it fires but announces its own uncertainty. The gate is live but labeled. Is this the right tradeoff, or should PROVISIONAL rules be non-firing (staged, not yet active)? The difference: firing-but-labeled gives immediate protection with uncertainty signaling; non-firing means zero protection until promoted.

**Q3 — Opus trigger:** AUTO_BATCH is dead code. Until wired, every Opus synthesis is manual. Given the Sunday ZF session cadence, should the trigger be time-based (always run Opus on Sunday session) rather than signal-based (3+ CRITICAL)? Or is signal-based correct but the 3+ threshold too high?

**Q4 — Function 2 gap (flagged last message):** The LEL as designed serves Function 1 (the Builder improving its own process). Function 2 (the Production Machine — tenant layer, component registry, bundling engine) has no learning loop at all. Should the LEL architecture be designed from the start with Function 2 in mind, or is Function 1 first and Function 2 is a later extension?

**Q5 — Haiku persona diversity vs. Haiku persona depth:** Currently the 8 expert personas are domain-partitioned (Security, Data, Performance, etc.). An alternative: run the same domain expert as multiple Haiku agents with different *sub-personas* (e.g., three Security agents: one focused on input validation, one on auth, one on data exposure). Which produces more confidence signal for CDS at Phase 0.5?

---

## Full Architecture Document

CDS-LEL-CORESPINE-001 is at:
`threshold/docs/constitutional/CDS-LEL-CORESPINE-001.md`

It contains: all 7 architecture sections, full JSON schemas for all new data files, complete lifecycle state diagram, Phase 0.5 vs Phase 1 build assignments, and the constitutional rule.

Awaiting Brain's review and Governor ratification decision.

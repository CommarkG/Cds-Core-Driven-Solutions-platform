# CDS Plan-Creation Hardening Plan — S345

**Document ID:** CDS-HARDENING-PLAN-S345  
**Date:** 2026-07-05  
**Basis:** Cruel Expert Architectural Review (Agent findings)  
**Status:** READY FOR DISPATCH  
**Owner:** OPUS (dispatch) → SONNET (build)  

---

## THE PROBLEM STATEMENT

**Current State:** 40% moat (mechanical gates at boundaries) + 60% theater (plan/audit rigor depends on Governor attention).

**The Risk:** A second Builder delegated to use this system would create mediocre plans. Contradictions surface 3-4 weeks into build, requiring costly rework. The system **works today because you're vigilant**. It breaks the moment you step back.

**The Opportunity:** Close 5/7 freelancing paths with 23 hours of engineering. The moat becomes platform-native, not governance-dependent.

---

## HARDENING STRATEGY — 3 TIERS

### TIER 1: CRITICAL (Build-Blocking) — 9 hours, ~300 lines

**What it closes:** Paths #2, #4, #5 (missing plan sections, removed prerequisites, deferred ZF findings)

**Files & Rules:**

| What | File | Lines | Why |
|------|------|-------|-----|
| CS-PLAN-STRUCTURE-TEMPLATE.md | threshold/docs/constitutional/ | 80 | Single source for all plans (copy from Phase 1 plan as the blueprint) |
| RULE-PLAN-SYNTAX-VALIDATION | threshold/src/gate/rules.ts | 60 | Sonnet gate before ratification — plan must have all mandatory sections (P1/P2/P3, phase gates, integration points, sequencing invariant). FAIL if missing any section. |
| Prerequisite gates | Phase 1 build endpoint | 40 | POST /api/phase/start rejects if P1/P2/P3 not satisfied (mechanical check, not trust-based). |
| RULE-AUDIT-GATE-MANDATORY | threshold/src/gate/rules.ts | 50 | Phase N+1 endpoint rejects if Phase N audit is incomplete. BLOCKED response: "Phase N audit required before Phase N+1 opens." |

**Reasoning:**
- Plan structure (P1/P2/P3 closure, sequencing invariant) is the single biggest predictor of phase coherence
- Second builder will create snowflake plans without mechanical enforcement
- Cost is low (template already written; gate is straightforward regex + registry read)
- Impact is high (prevents 3 of the 7 most expensive failure modes)

**Success Criteria:**
- All future plans have identical structure (no exceptions)
- RULE-PLAN-SYNTAX-VALIDATION blocks plans missing any mandatory section
- Phase N+1 build endpoint rejects if Phase N audit not complete (test with real example)
- No floating ideas without implementation targets

**Timeline:** Week 1 — starts immediately, unblocks Tier 2

---

### TIER 2: HIGH (Prevents Silent Debt) — 14 hours, ~400 lines

**What it closes:** Paths #1, #3, #6 (vague thinking, skipped QC cycles, parked findings deferred indefinitely)

**Files & Rules:**

| What | File | Lines | Why |
|------|------|-------|-----|
| RULE-THINKING-AUDIT | threshold/src/gate/rules.ts | 80 | Haiku pre-planning gate. Given a thinking artifact, validate: no circular logic, all assumptions stated, all gaps identified. FAIL if vague. Blocks PLAN_STANDARD ratification if thinking_audit_id is missing or FAIL. |
| RULE-PHASE-COMPLETION-REQUIRES-AUDIT | threshold/src/gate/rules.ts | 70 | Phase N+1 cannot open until Phase N audit cycle runs AND reaches ZF (findings = 0 or explicitly parked with deadline). BLOCKED if overdue parked findings exist. |
| Overdue-finding escalation logic | threshold/src/zf-cycle/enforcement.ts | 150 | Daily job checks park-registry for close_by dates. Overdue findings trigger FORCED_ESCALATION status (blocks new work, alerts Governor). Overdue = close_by < today. |
| ZF enforcement | Audit gate logic | 100 | Finding must be CLOSED or PARKED_WITH_DEADLINE. No silent drift. Park-registry audit log tracks who parked it, why, deadline, and escalation status. |

**Reasoning:**
- Thinking vagueness catches 3-4 weeks in with Opus post-hoc review; early Haiku gate catches it before planning wastes cycles
- QC cycles (Haiku/Sonnet/Opus audits) are scheduled but optional; mechanical gate makes them mandatory
- ZF iteration without deadline enforcement lets debt silently accumulate; overdue-finding escalation forces resolution
- Tier 2 enforces rigor at decision points, not just at completion

**Success Criteria:**
- Haiku thinking validator runs before PLAN_STANDARD ratification (FAIL→PASS proven with circular test case)
- Phase N+1 build endpoint BLOCKED if Phase N audit not run (test with example)
- Overdue parked findings escalate to FORCED_ESCALATION status (daily job proven with mock registry entry)
- ZF iteration is mechanically enforced (no finding left without explicit closure path)

**Timeline:** Week 2 — depends on Tier 1; adds ~14 hours. Moderate friction if thresholds not calibrated carefully (requires design session for override timeout thresholds).

---

### TIER 3: PARANOIA (Optional) — 8 hours, ~200 lines

**What it closes:** Path #7 (Sonnet/Opus inconsistency on same input)

**Files & Rules:**

| What | File | Lines | Why |
|------|------|-------|-----|
| Deterministic validation caching | threshold/src/validators/cache.ts | 100 | Hash the validation input (plan content + config) → cache key. Same input = same Sonnet/Opus score, always. Version the cache; cache invalidation is explicit (not time-based). |
| Validation versioning + diff | threshold/src/validators/report.ts | 100 | When a cached result is reused, report that it came from cache (not re-run). When validation input changes, show diff vs cached version. |

**Reasoning:**
- LLM consistency is inherent variance (same prompt can produce slightly different scores across sessions)
- Caching eliminates the variance by memoizing the exact input → exact output
- Cost is moderate (8 hours), but returns are diminishing (this is the last of 7 paths, and the variance is small)
- Worth doing if Tier 1 + Tier 2 succeed (proof of concept on mechanical enforcement)

**Success Criteria:**
- Same validation input produces identical output (proven with 10× re-run test case)
- Cache hit rate >80% in a typical week (shows utility)
- Validation report shows cache source transparently

**Timeline:** Week 3+ (post-Tier 2 success) — nice-to-have, not blocking

---

## INVESTMENT SUMMARY

| Tier | Hours | LoC | Friction | ROI | Timing |
|------|-------|-----|----------|-----|--------|
| **Tier 1** | 9 | ~300 | Minimal | HIGH (closes 3/7 paths) | Week 1 |
| **Tier 2** | 14 | ~400 | Moderate | HIGH (closes 2 more, prevents debt) | Week 2 |
| **Tier 3** | 8 | ~200 | Low | MEDIUM (LLM consistency) | Week 3+ |
| **TOTAL** | 31 | ~900 | — | ASYMMETRIC: 31 hours saves recurring 3-4 week reworks | 3 weeks |

---

## SUCCESS METRICS

**After Tier 1:**
- ✅ Every plan has identical structure (syntax-validated)
- ✅ Prerequisites (P1/P2/P3) are mechanically gated (cannot skip)
- ✅ Phase N+1 blocked if Phase N audit incomplete (cannot advance without closure)
- ✅ Second Builder can create consistent plans without personal vigilance

**After Tier 2:**
- ✅ Thinking vagueness caught pre-planning (no wasted cycles)
- ✅ QC cycles mandatory (not optional)
- ✅ ZF iteration enforced (no silent debt)
- ✅ Overdue parked findings escalate (forces resolution)
- ✅ 5/7 freelancing paths closed; remaining 2 are LLM variance + phase-machine bypass (low probability)

**After Tier 3:**
- ✅ LLM validation is deterministic (same input = same output)
- ✅ Validation reports show cache source transparently
- ✅ ~99% moat (the remaining 1% is human override, which is logged and audited)

---

## RISK IF NOT DONE

| Risk | If Tier 1 Skipped | If Tier 2 Skipped | If Tier 3 Skipped |
|------|-------------------|-------------------|-------------------|
| **Next Builder misses P1/P2/P3** | LIKELY (3-4 weeks rework) | LIKELY | N/A |
| **Audit cycles skipped** | POSSIBLE | LIKELY (optional→habit) | N/A |
| **ZF findings deferred indefinitely** | POSSIBLE | LIKELY (no deadline) | N/A |
| **Debt accumulates silently** | POSSIBLE | LIKELY | N/A |
| **Moat is Governor-dependent** | YES | PARTIAL | MINIMAL |

---

## DECISION GATE

**Recommendation: Proceed with Tier 1 + Tier 2 immediately.**

**Why:**
- Tier 1 is non-negotiable before delegating to a second Builder
- Tier 2 is the difference between "this works if I pay attention" and "this works even if I don't"
- Combined 23 hours is tiny vs. the recurring 3-4 week reworks they prevent
- Both tiers have concrete, testable acceptance criteria (not vague)

**Tier 3 is optional:** Worth doing after Tier 1 + Tier 2 succeed, but not blocking.

**Governor gates:** None. This is all internal hardening. No external inputs required.

---

## NEXT STEP AFTER COMPLETION

**PARK-050726-027: CS-LEARNING-LOOP Corespine Design Session**

The extraction-first principle that emerged from Phase 1 audit (Haiku → Sonnet → Opus → pattern extraction) should be formalized as a **constitutional corespine** that governs how CDS learns from recent work. This isn't on the critical path for Phase 1 build, but it should be scheduled for design after Tier 1 + Tier 2 harden the plan-creation system.

**Why:** Learning loops prevent debt accumulation more fundamentally than any single gate. Worth designing once plan-creation is mechanically sound.

---

*Document prepared by OPUS. Ready for dispatch to SONNET. All acceptance criteria are testable with real examples.*

# Constitutional AI Behavior Layer — ACTIVE

**Date:** 2026-07-05  
**Status:** ENFORCEMENT ACTIVE (all new code must pass)  
**Authority:** Governor ratification (CDS-S345)

---

## WHAT IS ACTIVE NOW

**RULE-CONSTITUTIONAL-COMPLIANCE** (meta-gate for code review):

All new implementations of:
- Gate rules (RULE-*)
- Enforcement endpoints (POST /api/*)
- State management (data registries)
- Validation logic

Must pass **12-question Constitutional Checklist** before merge.

---

## THE 12 QUESTIONS (Quick Reference)

**Persistent State?**
1. Decision state stored in file-based registry (not in-memory)
2. Gate survives server restart

**Source of Truth?**
3. Reads from canonical registry (not request body)
4. Facts cross-validated with authoritative source

**Actor Validation?**
5. Actor claims require registry proof (actor_kind)
6. Untrusted actors cannot forge state

**Structural Validation?**
7. Validates content depth (not just headers)
8. Enforces minimum content thresholds

**Automation?**
9. Auto-triggers are mechanical calculations (not manual flags)
10. System has default behavior (no blocking on Governor decision)

**Testing?**
11. FAIL→PASS cases both proven
12. Alignment with P1-P5 rules verified

---

## CODE REVIEW WORKFLOW

**For any new gate/rule/endpoint:**

1. **Author** submits code
2. **Reviewer** checks: Does code pass all 12 questions? (Yes/No for each)
3. **If YES to all 12:** Code approved (merge)
4. **If <12:** Author must either:
   - Fix the code to pass all 12, OR
   - Document explicit exception + justify to Governor
5. **Governor signs** on exceptions only

**Scoring:**
- 12/12 YES → Approved
- 10-11/12 + exception → Conditional (Governor decides)
- <10/12 → Redesign required

---

## PREVENTING FUTURE DRIFT

**This Constitution captures the 5 drift types:**

- P1: Persistent state (prevents Pocket #1 — in-memory gates)
- P2: Registry not request (prevents Pockets #3, #5 — body trust)
- P3: Actor-kind validation (prevents Pocket #5 — promise vs proof)
- P4: Structural depth (prevents Pocket #4 — header-only validation)
- P5: Auto-enforcement (prevents Pocket #2 — manual triggers)

**If all 12 questions are answered YES:**
- Code cannot have any of the 5 drift types
- AI defaults are overridden by Constitution
- Mechanical intent is guaranteed at implementation time

---

## FIRST GATES TO REVIEW

**Tier 2 gates (coming next):**
- RULE_THINKING_AUDIT (Haiku validator)
- RULE_PHASE_COMPLETION_REQUIRES_AUDIT
- Auto-trigger for holistic phase

**All must pass Constitutional Checklist before wiring.**

---

## PERMANENT RECORD

**This Constitution is ratified by:**
- Governor: _________________ Date: _________
- Architecture: Opus (S345 synthesis)
- Prevention: P1-P5 validated by Sonnet
- Drift Analysis: 5 pockets identified by Haiku

**Effective immediately on all new CDS code.**

---

*Constitutional AI Behavior Layer enforcement active. All code must declare 12/12 compliance.*

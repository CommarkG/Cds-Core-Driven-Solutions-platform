# OPUS Synthesis Series — Index & Navigation

**Series ID:** CDS-CSPS-0224-0227  
**Synthesis basis:** Sonnet S345 Prevention Rules (P1-P5)  
**Date:** 2026-07-05  
**Owner:** OPUS (architecture)  
**Status:** COMPLETE & READY FOR DISPATCH  

---

## FOUR-DOCUMENT SUITE

This series consolidates Sonnet's 5 Prevention Rules into a unified framework with implementation tooling.

| Doc ID | Title | Purpose | Read Time | Status |
|--------|-------|---------|-----------|--------|
| **0225** | Constitutional AI Behavior Layer | Core synthesis: unified framework, checklist (12 Q), verification gates, retrofit strategy | 20 min | RATIFY |
| **0226** | Constitutional Checklist Quick-Ref | Printable checklist for gate authors (before coding) | 5 min | REFERENCE |
| **0227** | Retrofit Execution Plan | Fully specified 5-pocket implementation (10 hours, testable) | 30 min | EXECUTE |
| **0224** | This document | Navigation + decision gates | 3 min | ORIENT |

---

## QUICK START

**You are here because:**

Either Sonnet identified 5 Prevention Rules (P1-P5) in the CDS codebase and you need to understand them + implement them, OR you're building a new gate/rule and need a Constitutional framework.

### Path A: "I need to understand the 5 rules"

1. **Read 0225 Section 1:** Unified Framework (10 min)
   - What are P1-P5
   - How they work together
   - Why each one is non-negotiable

2. **Skim 0227 Section 1:** Pocket Overview (2 min)
   - 5 code areas that violate rules
   - Current vs. target state
   - Effort estimate (10 hours)

3. **Decide:** Retrofit now (execute 0227) or understand first?

---

### Path B: "I'm writing a new gate and need to ensure it's Constitutional"

1. **Print 0226:** Constitutional Checklist
   - Answer 12 yes/no questions
   - All Yes = go to code
   - 3+ No = redesign first

2. **Code the gate**
   - Reference 0225 Section 3 (Verification Gates) for examples
   - Follow PASS/FAIL patterns

3. **Test with FAIL→PASS**
   - Real stdout, not mocked
   - Show the FAIL case first
   - Then fix and show PASS

4. **Wire into endpoint**
   - Gate is called (not orphaned)
   - Endpoint respects gate decision

---

### Path C: "I need to execute the retrofit (Pockets 1-5)"

1. **Read 0227 Overview:** Understand blocking dependencies

2. **Execute Phase 1 (Pocket-1):** 2 hours
   - Creates phase-registry.json
   - Blocks all other pockets

3. **Execute Phase 2 (parallel Pocket-4):** 1.5 hours
   - Enhance plan validator

4. **Execute Phase 3 (Pocket-3):** 3 hours
   - Depends on Pocket-1
   - Create plan-registry.json + actors-registry.json
   - Separate facts from claims

5. **Execute Phase 4 (Pocket-5):** 2 hours
   - Depends on Pocket-1
   - Actor validation

6. **Execute Phase 5 (Pocket-2):** 1.5 hours
   - Depends on Pocket-1
   - Mechanical triggers

7. **Verify:** All 5 FAIL→PASS tests pass

---

## DECISION GATES

### Gate 1: Do we proceed with retrofit?

**Question:** Is the CDS system delegable to a second Builder without governance overhead?

**Current state:** 40% mechanical + 60% theater (depends on Governor attention)

**After retrofit:** 100% mechanical (any Builder can execute)

**Decision:**
- [ ] Yes → Proceed with 0227 execution
- [ ] No → Document why; defer to later

**Governor sign-off:** _________________

---

### Gate 2: Is the Constitutional framework adopted as platform DNA?

**Question:** Should this P1-P5 pattern become a **universal principle** used in all AI governance?

**Impact if yes:**
- Every new gate must answer the 12-question checklist
- Every rule must pass RULE-CONSTITUTIONAL-COMPLIANCE (meta-gate)
- Retrofit becomes a one-time cost; future gates inherit it

**Impact if no:**
- Retrofit is specific to CDS only
- Next system (CSE, future apps) rediscovers the same rules

**Decision:**
- [ ] Yes, adopt as universal principle → Create enterprise template
- [ ] No, CDS-specific only → Update docs to say "CDS-only pattern"

**Governor sign-off:** _________________

---

## READING ORDER

### For Architects / Governors

1. This document (0224) — 3 min
2. **0225 Section 1:** Unified Framework — 10 min
3. **0225 Section 5:** Universal Principle — 5 min
4. **0227 Overview:** Pocket summary + blocking analysis — 5 min
5. Decide on Gates 1 & 2 above

**Time: ~30 min**

---

### For Gate Authors / Builders

1. **0226:** Print the checklist — 2 min
2. **0225 Section 2:** Full checklist (explanation) — 10 min
3. **0225 Section 3:** Verification Gates (examples) — 10 min
4. Answer the checklist before coding

**Time: ~25 min**

---

### For Implementation (Retrofit)

1. This document (0224) — 3 min
2. **0227:** Full execution plan — read entire document — 30 min
3. Execute Phase 1 (Pocket-1) — 2 hours
4. Continue through Phases 2-5

**Time: 33 min reading + 10 hours execution**

---

## REFERENCE ANCHOR POINTS

### Checklist Questions (12 total)

From 0225 Section 2, numbered P1-P6:

**P1 (Persistent Source):**
- Q1: Is state in a file-based registry (not memory)?
- Q2: Can it be queried independently?

**P2 (Truth vs. Context):**
- Q3: Facts from registry, context from request?
- Q4: Validated against registry if reading request?

**P3 (Actor Proof):**
- Q5: Does actor claim authority?
- Q6: Cross-validated against actors registry?

**P4 (Structural Depth):**
- Q7: More than format checks? 3+ structural validations?
- Q8: Checks closure (prerequisites, dependencies)?

**P5 (Auto-Enforcement):**
- Q9: Mechanical PASS/FAIL outcome (no advisory)?
- Q10: Testable with real examples (FAIL→PASS)?

**P1-P5 Integration:**
- Q11: Dependencies declared and enforced?
- Q12: Gate is called (not orphaned)?

---

### Five Prevention Rules (summary)

| Rule | Violation | Prevention |
|------|-----------|-----------|
| **P1** | State dies at restart | File-based persistent registry |
| **P2** | Request lies to gate | Read facts from registry, not claims |
| **P3** | Actor spoofs authority | Cross-validate against actors-registry |
| **P4** | Incomplete work passes | Check structural depth, not format only |
| **P5** | Advisory (non-testable) | Mechanical PASS/FAIL with deterministic conditions |

---

### Five Pockets (summary)

| Pocket | Current | Target | Effort | Blocking |
|--------|---------|--------|--------|----------|
| **1** | Phase state in memory | phase-registry.json persistent | 2h | Yes (blocks all) |
| **4** | Headers-only validator | 8+ structural checks | 1.5h | No (parallel) |
| **3** | Request claims trusted | Registry facts + actor validation | 3h | Pocket-1 |
| **5** | No actor validation | actors-registry.json cross-check | 2h | Pocket-1 |
| **2** | Advisory triggers | Mechanical PASS/FAIL outcomes | 1.5h | Pocket-1 |

---

## WHAT'S NOT INCLUDED

This series focuses on the **Constitutional framework** (structure, principles, verification gates). 

**Out of scope (see S345 Hardening Plan for details):**

- **Thinking audit validator** (Tier 2 Task 2.1 in S345)
- **Overdue-finding escalation** (Tier 2 Task 2.2 in S345)
- **LLM validation caching** (Tier 3 in S345)
- **Detailed phase machine** specification

This series provides the **foundation**. S345 builds additional hardening layers on top.

---

## WHO SIGNS OFF

**Architect (OPUS):** Synthesis complete, ready for Governor ratification  
**Governor (Yariv):** Approves framework, signs Decision Gates 1 & 2  
**Builder (SONNET/Forthcoming):** Executes 0227 retrofit plan  

---

## NEXT STEPS AFTER RATIFICATION

**Step 1:** Governor reviews this series (0224-0227), signs Decision Gates 1 & 2

**Step 2 (if Gate 1 = Yes):** Dispatch 0227 to Builder for execution
- Pocket-1: 2 hours
- Pocket-4: 1.5 hours (parallel)
- Pockets 3, 5, 2: 6.5 hours (sequential)
- Total: 10 hours, 2 weeks

**Step 3 (if Gate 2 = Yes):** Create universal template
- Extract checklist as enterprise standard
- Wire RULE-CONSTITUTIONAL-COMPLIANCE into all projects
- Document in Universal Governance DNA

**Step 4:** Monitor retrofit execution
- Real FAIL→PASS tests (all 5 pockets)
- Acceptance sign-off by Governor
- Update CDS status (theater → mechanical)

---

## DOCUMENT LINEAGE

**Produced by:** OPUS (synthesis architecture)  
**Input:** Sonnet S345 Cruel Critic findings (5 Prevention Rules)  
**Output:** Unified Constitutional AI framework (4 documents, 50+ pages total)  
**Standards:** CDS-CSPS-0225-0227 (constitutional layer numbering, 0100-0220 range)  

---

## RATIFICATION CHECKLIST

Before proceeding, confirm:

- [ ] All 4 documents (0224-0227) are read and understood by Governor
- [ ] Decision Gate 1 is signed (retrofit yes/no)
- [ ] Decision Gate 2 is signed (universal adoption yes/no)
- [ ] Implementation timeline is approved
- [ ] Resources (Builder) are allocated
- [ ] Success metrics are clear (all 5 FAIL→PASS tests)

---

*OPUS Synthesis Series v1 — Complete, coherent, ready for ratification | 2026-07-05*


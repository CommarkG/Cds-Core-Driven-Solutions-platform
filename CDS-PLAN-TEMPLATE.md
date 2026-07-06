---
template_id: CDS-PLAN-TEMPLATE
title: CDS Plan Template — Mandatory Structure
version: 1.0
status: TEMPLATE (copy this for every plan)
created: 2026-07-06
note: This template enforces CDS North Star alignment. Every plan uses this structure.
---

# [PLAN TITLE]

**Plan ID:** [CDS-PLAN-YYYYMMDD-001]  
**Date:** [YYYY-MM-DD]  
**Author:** [Name]  
**Status:** [DRAFT / READY / APPROVED / IN PROGRESS / COMPLETE]  

---

## 1. SCOPE (Required — Define Boundaries)

**What this plan covers:**
- [List specific work items]
- [List specific decisions]
- [List specific deliverables]

**What this plan does NOT cover (explicitly out of scope):**
- [List items that might seem related but are explicitly excluded]
- [List assumptions being made]
- [List dependencies on other work]

---

## 2. PROBLEM & CONTEXT (Required — Why This Matters)

**Problem being solved:**
[One paragraph. What is broken? Why does it matter?]

**Background:**
[Context for the decision. What led here? What's already been tried?]

**Constraints:**
- [List hard constraints: must do X, must not do Y]
- [Timeline constraints]
- [Resource constraints]

---

## 3. SOLUTION APPROACH (Required — How This Solves It)

**High-level approach:**
[Explain the solution clearly enough that someone unfamiliar could understand it]

**Key design decisions:**
- Decision A: [What, why, trade-offs]
- Decision B: [What, why, trade-offs]
- Decision C: [What, why, trade-offs]

---

## 4. CDS NORTH STAR ALIGNMENT (Required — MANDATORY SECTION)

**Reference:** CDS-NORTH-STAR-001

**Core Principle:** Context is bounded by design. Freelancing is impossible. Every output is verified.

### 4.1 Bounded Execution Pockets

**Pocket definition (clear scope):**
- Pocket name: [e.g., "Phase 1 agent execution"]
- Input context: [What does this pocket receive?]
- Execution scope: [What is this pocket allowed to do?]
- Output contract: [What must this pocket produce?]
- Context limit: [How much context can this pocket hold?]

**How this prevents scope creep:**
[Explain how pocket definition prevents freelancing into adjacent work]

### 4.2 Permission-Gated Skills

**Authorized skills:**
- Skill 1: [Skill name] — [What it does] — [Permission granted: YES/NO]
- Skill 2: [Skill name] — [What it does] — [Permission granted: YES/NO]
- Skill 3: [Skill name] — [What it does] — [Permission granted: YES/NO]

**How permissions are enforced:**
[Explain where the permission gate is implemented]

**Skills explicitly NOT authorized:**
- [List skills that might seem useful but are blocked]
- [Explain why each is blocked]

**How this prevents hidden freelancing:**
[Explain how permission-gated skills catch unauthorized invocations]

### 4.3 Authority Level Declaration

**Authority level for this plan:**
- [ ] CORE — Every decision requires human confirmation before proceeding
- [ ] MEDIUM — Autonomous except at branch points (needs confirmation there)
- [ ] FULL — Fully autonomous (only halts on gaps or failures)

**Justification for this level:**
[Why is this authority level appropriate for this work?]

**Escalation path (if applicable):**
[If starting at CORE, what proof is needed to escalate to MEDIUM/FULL?]

### 4.4 Frame Constraints & Verification

**Frame elements (what must be verified):**
- Constraint 1: [What is the constraint?] — [How is it verified?]
- Constraint 2: [What is the constraint?] — [How is it verified?]
- Constraint 3: [What is the constraint?] — [How is it verified?]

**Depth tier:**
- [ ] CORE depth (minimum viable)
- [ ] MEDIUM depth (standard operational)
- [ ] FULL depth (complete governance)

**Output verification checklist:**
- [ ] Output matches declared output contract
- [ ] Output wiring state is valid
- [ ] All constraints are satisfied
- [ ] No anomalies detected
- [ ] Audit trail is complete

**How this prevents silent divergence:**
[Explain how frame verification catches AI drift before output escapes]

### 4.5 Gap Detection Protocol

**Gaps that would halt execution:**
- Gap 1: [What constitutes a gap?] — [Detection mechanism]
- Gap 2: [What constitutes a gap?] — [Detection mechanism]
- Gap 3: [What constitutes a gap?] — [Detection mechanism]

**How gaps escalate:**
[When a gap is detected, what happens? Who is notified? What is the resolution process?]

**How this prevents silent failures:**
[Explain how gap detection forces problems to surface instead of hiding]

### 4.6 Audit Trail & Traceability

**What is recorded:**
- Every invocation of authorized skills
- Every decision at branch points
- Every output verification check (pass/fail)
- Every gap detected
- Final resolution signal

**Audit trail location:**
[Where is the audit trail stored? How is it made immutable?]

**Who can access the audit trail:**
[Who can read it? Who controls access?]

**How this enables accountability:**
[Explain how audit trails make every decision traceable to decision-maker]

---

## 5. DRIFT RISK ANALYSIS (Required — Where Could This Go Wrong?)

**Potential freelancing points:**
- Risk A: [Where could AI freelance?] → Mitigation: [How pocket/frame/permissions prevent it]
- Risk B: [Where could AI freelance?] → Mitigation: [How pocket/frame/permissions prevent it]
- Risk C: [Where could AI freelance?] → Mitigation: [How pocket/frame/permissions prevent it]

**Context overflow risks:**
- Risk A: [What context might overflow?] → Mitigation: [How is context limited?]
- Risk B: [What context might overflow?] → Mitigation: [How is context limited?]

**Verification blind spots:**
- Risk A: [What might not be verified?] → Mitigation: [How is it caught?]
- Risk B: [What might not be verified?] → Mitigation: [How is it caught?]

---

## 6. IMPLEMENTATION STEPS (Required)

### Step 1: [Name]
**What:** [What is being done]  
**Why:** [Why this matters]  
**Who:** [Who is responsible]  
**Verification:** [How do we know it's done correctly?]  
**Estimated time:** [How long this takes]  

### Step 2: [Name]
**What:** [What is being done]  
**Why:** [Why this matters]  
**Who:** [Who is responsible]  
**Verification:** [How do we know it's done correctly?]  
**Estimated time:** [How long this takes]  

[Continue for all steps]

---

## 7. TESTING & VALIDATION (Required)

**How will we prove this works?**

**Test 1: [Name]**
- Input: [What are we testing with?]
- Expected: [What should happen?]
- Validation: [How do we know it passed?]

**Test 2: [Name]**
- Input: [What are we testing with?]
- Expected: [What should happen?]
- Validation: [How do we know it passed?]

[Continue for all tests]

**How will we prove this doesn't drift?**

**Drift Test 1: [Name]**
- Scenario: [What conditions would cause drift?]
- Assertion: [What should NOT happen?]
- Validation: [How do we know drift didn't occur?]

---

## 8. DEPENDENCIES & BLOCKERS (Required)

**This plan depends on:**
- [ ] Dependency A — [What is needed?] — [Owned by whom?] — [Status?]
- [ ] Dependency B — [What is needed?] — [Owned by whom?] — [Status?]

**Blockers (if any):**
- [ ] Blocker A — [What is blocking?] — [Mitigation?] — [Escalation path?]

---

## 9. SUCCESS CRITERIA (Required)

**This plan is successful when:**
- [ ] Criterion 1: [Specific, measurable outcome]
- [ ] Criterion 2: [Specific, measurable outcome]
- [ ] Criterion 3: [Specific, measurable outcome]
- [ ] CDS North Star alignment verified (all sections complete)
- [ ] All tests pass
- [ ] All drift risks mitigated
- [ ] Audit trail is complete and immutable

---

## 10. ROLLBACK & RECOVERY (Required)

**If something goes wrong, what's the recovery path?**

**Rollback scenario 1: [Name]**
- Trigger: [What would cause this?]
- Recovery steps: [How to recover?]
- Time to recovery: [How long?]

**Rollback scenario 2: [Name]**
- Trigger: [What would cause this?]
- Recovery steps: [How to recover?]
- Time to recovery: [How long?]

---

## 11. SIGN-OFF & APPROVAL (Required)

**This plan has been reviewed and approved by:**

- [ ] Technical Owner: __________________ Date: __________
- [ ] CDS Governance: __________________ Date: __________
- [ ] Platform Governor: __________________ Date: __________

**CDS North Star alignment confirmed:** [ ] YES [ ] NO

(If NO, plan cannot proceed. Return to Section 4 and revise.)

---

## NOTES FOR PLAN WRITERS

1. **Section 4 is not optional.** Every plan must explicitly address how it honors CDS North Star. If you skip it, the plan is incomplete.

2. **Drift risk analysis is critical.** This is where you force yourself to think: "Where could this go wrong?" and "How does our architecture prevent it?"

3. **Authority level declaration is a governance moment.** Don't just pick FULL because it's easier. Justify the level. Be honest about risks.

4. **Frame constraints must be testable.** "Output is correct" is not a testable constraint. "Output matches schema X, passes validation Y, and has confidence > 0.8" is testable.

5. **Audit trails are not optional.** Every plan must produce a trace that future readers can audit.

6. **Rollback is part of design.** If you can't articulate how to recover from failure, your design is incomplete.

---

**This template exists to prevent drift in CDS itself.**

By requiring every plan to align with the North Star, we ensure that CDS architecture stays coherent and intentional.

Use this template. Use it completely. Skip nothing.

---

*Template Version: 1.0*  
*Updated: 2026-07-06*  
*Mandatory: YES*

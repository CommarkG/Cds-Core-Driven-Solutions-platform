# CDS Constitutional AI Behavior Layer (DRAFT)

**Purpose:** Prevent Native AI defaults from drifting away from CDS mechanical intent.

**Status:** DRAFT (awaiting Opus synthesis) | Basis: Sonnet root-cause analysis of 5 drift pockets

---

## CORE PRINCIPLE

**Mechanical Enforcement = Persistent Source + Structural Depth + Actor Proof + Auto-Decision**

Any enforcement missing one of these four is theater, not mechanical.

- **Persistent Source:** State/facts stored in file-based registry, not memory or request body
- **Structural Depth:** Validation checks content depth, not just header/syntax existence
- **Actor Proof:** Claims validated against registry entries with actor_kind + signature
- **Auto-Decision:** Mechanical calculations determine outcomes, not manual Governor flags

---

## IMPLEMENTATION CHECKLIST (8-12 Questions)

**BEFORE writing any gate, rule, or enforcement logic, answer these questions.**

### Category 1: State & Persistence (Prevents Pocket-1)

**Q1: Where is the decision-state stored?**
- [ ] Yes, in a file-based registry (data/*.json, persistent across restarts)
- [ ] No, in-memory (Map/object, lost on server restart) ❌ DRIFT RISK
- Evidence: File path: _____________

**Q2: Will the gate work after server restart?**
- [ ] Yes, gate reads from file-based registry every time
- [ ] No, server restart clears memory state ❌ DRIFT RISK
- Evidence: Code shows: _____________

### Category 2: Source of Truth (Prevents Pocket-3, -5)

**Q3: Does the gate read from a canonical registry or from request body?**
- [ ] Canonical registry (design source of truth)
- [ ] Request body (Builder promise, untrusted) ❌ DRIFT RISK
- Evidence: Code reads from: _____________

**Q4: If the gate validates a fact (P2 ratified, P1 closed, audit complete), is it checked against registry?**
- [ ] Yes, cross-validated with registry entry
- [ ] No, trusts the request value ❌ DRIFT RISK
- Evidence: Validation code: _____________

### Category 3: Actor Validation (Prevents Pocket-5)

**Q5: If a claim is actor-dependent (Governor ratified, Builder signed off), does validation include actor_kind check?**
- [ ] Yes, registry entry includes actor_kind='Governor' (or appropriate actor)
- [ ] No, only checks if timestamp/value exists ❌ DRIFT RISK
- Evidence: Validation includes actor_kind check: _____________

**Q6: Can an untrusted actor forge this state in the request?**
- [ ] No, actor_kind is verified in registry (not in request)
- [ ] Yes, request can claim anything (request body is untrusted) ❌ DRIFT RISK
- Evidence: _____________

### Category 4: Structural Validation (Prevents Pocket-4)

**Q7: If validating structure (plan sections, prerequisite table content), does validation check depth?**
- [ ] Yes, headers + content depth (section must have substantive content, not empty)
- [ ] No, regex header match only ❌ DRIFT RISK
- Evidence: Validation includes depth check: _____________

**Q8: For mandatory fields/content, is minimum content threshold enforced?**
- [ ] Yes, section must have min 20+ characters (or rule-specific threshold)
- [ ] No, header existence is sufficient ❌ DRIFT RISK
- Evidence: Depth check enforces: _____________

### Category 5: Automation (Prevents Pocket-2)

**Q9: If the design says "auto-trigger" or "auto-escalate," is this implemented as a mechanical calculation?**
- [ ] Yes, system calculates condition automatically (e.g., if count >= 3, trigger)
- [ ] No, Governor manually sets a flag ❌ DRIFT RISK
- Evidence: Auto-trigger logic: _____________

**Q10: Is there a default decision (if not provided by Governor)?**
- [ ] Yes, system has a mechanical default (automation proceeds unless overridden)
- [ ] No, requires manual Governor intervention ❌ DRIFT RISK
- Evidence: Default behavior: _____________

### Category 6: Cross-Check (Meta-validation)

**Q11: Has this gate/rule been tested with BOTH registry-present and registry-absent scenarios?**
- [ ] Yes, FAIL case (missing registry entry) and PASS case (valid entry) both proven
- [ ] No, only tested happy path ❌ DRIFT RISK
- Evidence: Tests prove: _____________

**Q12: Does this gate prevent the 5 identified drift types (Pocket 1-5)?**
- [ ] Yes, checked against P1-P5 prevention rules
- [ ] No or unknown ❌ DRIFT RISK
- Evidence: Alignment with: _____________

---

## SCORING

**All 12 questions must be YES (or provide specific mitigation).**

- 12/12 YES → PASS: Gate/rule is mechanical (approved for merge)
- 10-11/12 YES → CONDITIONAL: Requires documented exception + Governor approval
- <10/12 YES → FAIL: Redesign before merge (recheck against P1-P5)

---

## EXAMPLE: RULE_PLAN_SYNTAX_VALIDATION (Self-Test)

Using this checklist against the rule we just built:

| Q | Asks | Answer | Evidence |
|---|------|--------|----------|
| Q1 | Persistent state? | YES | Plan stored in request body at validation time; rule is stateless |
| Q2 | Survives restart? | YES (N/A) | Rule is validation-only, no stateful decision |
| Q3 | Registry vs. body? | N/A (validation gate, not prerequisite gate) | Rule validates structure inline |
| Q4 | Fact-checking from registry? | N/A | Plan syntax is self-contained in plan content |
| Q5 | Actor-kind validation? | N/A | Syntax rule doesn't involve actor claims |
| Q6 | Actor forgery risk? | NO | No actor claims in syntax validation |
| Q7 | Depth check? | PARTIAL | Checks headers + one-sentence rule + table existence, but NOT R1-R8 content depth |
| Q8 | Min content threshold? | PARTIAL | One-sentence enforced (period count = 1), but P1/P2/P3 table rows not depth-checked |
| Q9 | Auto-trigger? | N/A | Syntax rule is passive (called on request) |
| Q10 | Default decision? | YES | Returns PASS if all sections present, FAIL if any missing |
| Q11 | FAIL→PASS tested? | YES | Test file: rule-plan-syntax-validation.test.ts |
| Q12 | Prevents Pocket 1-5? | PARTIAL | Prevents Pocket-4 (partially: headers + depth missing for R1-R8) |

**Self-Test Result:** 9/12 clear YES, 3 PARTIAL → CONDITIONAL PASS (works, but needs Pocket-4 retrofit)

---

## NEXT STEPS (For Opus)

1. **Refine checklist** — are 12 questions right, or should they be 8-10?
2. **Consolidate P1-P5** — do P1-P5 map cleanly to Q1-Q12?
3. **Add examples** — show passing and failing implementations
4. **Create meta-gate** — RULE-CONSTITUTIONAL-COMPLIANCE (for auditing code against this checklist)
5. **Retrofit order** — which pockets to fix first (blocking analysis)

---

*Draft prepared by Haiku → Sonnet pattern. Awaiting Opus synthesis for final version.*

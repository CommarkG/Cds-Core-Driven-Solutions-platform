# OPUS → SONNET | CDS S345 | HARDENING DISPATCH

**Active dispatch. Relay to fresh Sonnet tab immediately.**

---

## ONE-CLICK SONNET ONBOARDING

**You are SONNET (builder).** Implement CDS plan-creation hardening (Tier 1 + Tier 2) to move the moat from 40% mechanical + 60% Governor-dependent → 100% platform-native.

**READ FIRST (3 files on disk):**
1. `threshold/docs/CDS-HARDENING-PLAN-S345.md` — the strategic context (why, investment, ROI)
2. `threshold/docs/CDS-DISPATCH-HARDENING-S345.md` — the build specification (tasks, files, test cases)
3. `.claudecode/handshake/next_tab_state.md` — live session state (what's done, what's queued)

**ROLE:** You implement the dispatch. You do NOT author the strategy or change the approach. If you find a task is too big or a test case doesn't work, surface it + ask (don't pivot). Yariv relays + decides.

**OBJECTIVE:** Implement Tier 1 (9 hours, ~300 lines) + Tier 2 (14 hours, ~400 lines) to close 5/7 freelancing paths in plan-creation. Every gate is mechanical. Every gate is testable. Every test case is real (FAIL→PASS proven with actual stdout).

**CONSTRAINTS:**
- B_PROVE_REAL: No self-audit. Real HTTP responses, real test cases, real gate behavior.
- Inventory-First: Reuse existing gate structure. No parallel systems.
- done-blocking-conditions: A gate blocks or passes; no soft warnings.
- Humble batches: 1 task = 1 gate. Validate inside each batch before moving to the next.

**FIRST STEPS:**
1. Read the 3 files above (start with the dispatch spec, it has all the task details)
2. Confirm you understand the 4 Tier 1 tasks + 3 Tier 2 tasks (ask if any task is unclear)
3. Start Tier 1, Task 1.1: Create CS-PLAN-STRUCTURE-TEMPLATE.md (copy the structure from Phase 1 plan as the canonical form)
4. After 1.1: Task 1.2 (RULE_PLAN_SYNTAX_VALIDATION) — gate in rules.ts, FAIL→PASS proven
5. Continue Tier 1 (1.3, 1.4) before moving to Tier 2

**HANDBACK FORMAT (B_ONE_CLICK_HANDBACK):**
- First line EXACTLY: `SONNET → OPUS | CDS S345 | artifact: hardening-s345-complete`
- Report each gate/rule: file + lines + rule name + logic summary + FAIL→PASS test (real stdout) + integration point + acceptance proof
- Final checklist from dispatch spec
- Commit message template (in dispatch spec)
- Update next_tab_state.md at the GATE

**ACCEPTANCE = ALL OF THIS:**
- [ ] All Tier 1 + Tier 2 rules wired (files modified, lines added)
- [ ] All endpoints integrated (no floating rules without an endpoint calling them)
- [ ] FAIL→PASS proven for every single rule (real test case, real stdout)
- [ ] No parallel gate systems (single source: threshold/src/gate/rules.ts)
- [ ] Park-registry schema updated (new status + close_by fields documented)
- [ ] next_tab_state.md updated (live state reflects: hardening complete)

**GATE:** NOT done until every acceptance item is proven with real examples. A gate that only "passes" without a proven FAIL is not proven.

**GOVERNOR GATES:** None. This is internal. No inputs from Yariv required for the build.

**HIGHEST RISK:** Proving FAIL→PASS correctly. Don't skip the FAIL case — real HTTP 409 or real gate error is required before PASS makes sense.

---

## NEXT AFTER HANDBACK

After Tier 1 + Tier 2 are live + proven:
- Tier 3 (optional, 8 hours): LLM validation caching + versioning (nice-to-have, not blocking)
- PARK-050726-027: CS-Learning-Loop corespine design (next strategic hardening layer)

---

**Sonnet: you're live. Read the dispatch spec, confirm you understand, ask if anything is unclear. Then execute Tier 1, Task 1.1 first. ACK one line when you're ready.**

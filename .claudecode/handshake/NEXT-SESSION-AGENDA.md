# NEXT SESSION AGENDA

**Session Goal:** Retrofit Pockets 1-5 (10 hours) + Tier 2 gates pass Constitutional

**Pre-Session Checklist:**
- [ ] Tier 1 deployed to production
- [ ] Constitutional layer active in code review
- [ ] Retrofit team assigned (Sonnet + Opus)

---

## RETROFIT EXECUTION (Wed-Fri This Week)

**Day 1 (Wed):**
- Pocket #1: Create data/phase-registry.json (persistent state) — 2h
- Pocket #4: Add structural depth validation to plan syntax rule — 1.5h

**Day 2 (Thu):**
- Pocket #3: Wire plan prerequisites to read from registry (not request body) — 1.5h
- Pocket #5: Add actor_kind validation to P2 ratification check — 1.5h
- Pocket #2: Implement domain-clustering auto-trigger for holistic phase — 1.5h

**Day 3 (Fri):**
- Integration testing (all 5 pockets together) — 1h
- Governor review + sign-off — 1h

**All changes:** FAIL→PASS tested, Constitutional checklist 12/12, merged

---

## TIER 2 DESIGN (After Retrofit)

**Gates to design + wire (must pass Constitutional):**
1. RULE_THINKING_AUDIT — Haiku validator (vague thinking detection)
2. RULE_PHASE_COMPLETION_REQUIRES_AUDIT — Phase N+1 gate
3. Auto-trigger logic for holistic phase (depends on Pocket #2 retrofit)

**Design first → pass Constitutional checklist → wire → test FAIL→PASS**

---

## PARKING (Not This Session)

- PARK-050726-027: CS-Learning-Loop corespine design (post-hardening)
- Tier 3: LLM validation caching (optional, post-Tier-2 success)
- Multi-tenant identity layer (Phase 2 priority)

---

## SUCCESS METRICS (End of Next Session)

- [ ] All 5 pockets retrofitted + merged
- [ ] Moat at 95% mechanical (only Governor override remains)
- [ ] Tier 2 gates designed + pass Constitutional + wired
- [ ] Zero drift pockets remaining in codebase
- [ ] Constitutional layer actively blocking non-compliant code

---

*Handoff complete. Ready for retrofit execution.*

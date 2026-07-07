---
title: "CDS Complete Principles Index"
date: 2026-07-07
status: MASTER_REFERENCE
version: 2.0
---

# CDS COMPLETE PRINCIPLES INDEX

**Master reference for ALL principles mentioned in CDS development.**

This document is your single source of truth for CDS thinking. Use it to:
- Understand foundational principles
- Make consistent decisions
- Teach new team members
- Reference when uncertain

---

## QUICK NAVIGATION

- [TIER 1: FOUNDATIONAL PRINCIPLES (10 items)](#tier-1-foundational)
- [TIER 2: DESIGN & UX PRINCIPLES (15 items)](#tier-2-design)
- [TIER 3: OPERATIONAL PRINCIPLES (12 items)](#tier-3-operational)
- [TIER 4: PLANNING & EXECUTION PRINCIPLES (8 items)](#tier-4-planning)
- [TIER 5: GOVERNANCE & ENFORCEMENT (6 items)](#tier-5-governance)

**Total: 51 principles organized by category**

---

## TIER 1: FOUNDATIONAL PRINCIPLES {#tier-1-foundational}

These are the DNA of CDS. Everything else builds on these.

### PRINCIPLE 1.1: Options Become Architecture
**What:** Don't pick a path. Build architecture enabling all paths.  
**Why:** Flexibility without fragmentation. Users get choice.  
**How:** Implement feature set, gate by permission.  
**Example:** All tiers see same UI. Admin has edit button enabled. TRUSTED has disabled.  
**Document:** CDS-PLATFORM-ATTITUDE-DOCTRINE.md  
**Enforcement:** Code review (no separate UIs per tier)

---

### PRINCIPLE 1.2: Consistency as Fundamental
**What:** Consistency IS the product (not optional).  
**Why:** Consistency builds trust, reduces cognitive load, enables scale.  
**How:** Repeat patterns. Document rules. Enforce mechanically.  
**Example:** All buttons 40px (not 40px here, 36px there).  
**Document:** CDS-3SCOPE-ENTERPRISE-METHODOLOGY.md  
**Enforcement:** Linters, constants, checklist

---

### PRINCIPLE 1.3: Hardwire Governance
**What:** Make rules mechanical, not advisory.  
**Why:** Advisory rules are forgotten. Mechanical rules are enforced.  
**How:** Implement as gates, constants, linters (not documentation).  
**Example:** Validation gate blocks form submission if required field empty.  
**Document:** CDS-DNA-PRACTICE-FRAMEWORK.md  
**Enforcement:** System-level (gates, pre-commit hooks, CI/CD)

---

### PRINCIPLE 1.4: Nothing Stands Alone
**What:** Every piece of data, term, capability links to canonical schema.  
**Why:** Prevents drift, orphaned references, duplicate definitions.  
**How:** Reference schema node. Use checksums. Prevent orphans mechanically.  
**Example:** Goal type always references SCHEMA-GOAL-* node.  
**Document:** CDS-GOAL-DEFINITION-SYSTEM-PLAN.md  
**Enforcement:** Schema registry, checksums, linters

---

### PRINCIPLE 1.5: Prevention > Detection > Reaction
**What:** Catch issues BEFORE they happen. Next best: immediately. Worst: after they ship.  
**Why:** Early prevention cheapest, fastest, safest.  
**How:** Design gates. Implement detection. Define escalation.  
**Example:** Schema checksum prevents orphaned references (prevents issue before it exists).  
**Document:** HARDWIRED-COMPACTION-PROTOCOL-001.md  
**Enforcement:** Gate-first architecture

---

### PRINCIPLE 1.6: Knowledge Compounds
**What:** Document learnings. Make them permanent. Reuse them.  
**Why:** Prevents repeating mistakes. Enables team growth.  
**How:** Learning loops dashboard. Seed future plans with past learnings.  
**Example:** S349 learned "admin must have full edit" → hardwired into all future features.  
**Document:** LEARNING-LOOPS-DASHBOARD-SKELETON.md  
**Enforcement:** Session-to-session review

---

### PRINCIPLE 1.7: Authority Matters
**What:** Clear authority. Decisions traced to responsible person.  
**Why:** Prevents "who decided this?" confusion. Accountability.  
**How:** Decisions logged to DecisionNode. Authority checked at gates. Yariv = governor.  
**Example:** Yariv approves tier promotion. Decision logged and immutable.  
**Document:** Phase 0 architecture (identity-gate, authority-matrix)  
**Enforcement:** Cryptographic logging

---

### PRINCIPLE 1.8: Options-First (Not Perfect-Once)
**What:** Create 3 options → evaluate → seal → offer default + 2 variants.  
**Why:** Users get choice. No rebuilding. All verified templates.  
**How:** Generate 3 approaches. Score objectively. Seal winners.  
**Example:** Dashboard layout: horizontal (default), vertical (variant 1), card-based (variant 2).  
**Document:** CDS-OPTIONS-LIBRARY-FRAMEWORK.md  
**Enforcement:** Library template checklist

---

### PRINCIPLE 1.9: Define with Context + Examples
**What:** Every definition must include: context + 2 good examples + 2 bad examples (with measurements).  
**Why:** Eliminates ambiguity. Developers know exactly what's expected.  
**How:** Template: Definition → context → good 1 + good 2 → bad 1 + bad 2 → application rule.  
**Example:** Contrast rule: 7:1 minimum. Good (21:1 example). Bad (4:1 example). Why each.  
**Document:** CDS-DEFINITION-WITH-EXAMPLES-PRINCIPLE.md  
**Enforcement:** Pre-commit checks for all definitions

---

### PRINCIPLE 1.10: Proactive Edge Detection
**What:** System knows its scope. When exceeding scope, proactively notifies (not silent failure).  
**Why:** Transparency. No surprises. Admin knows when expansion needed.  
**How:** Define scope boundaries. Monitor during operation. Notify proactively.  
**Example:** "Dashboard has 1200 rows (exceeds 500 threshold). Consider variant for large datasets."  
**Document:** CDS-PROACTIVE-NOTIFICATION-FRAMEWORK.md  
**Enforcement:** System monitors, logs, notifies

---

## TIER 2: DESIGN & UX PRINCIPLES {#tier-2-design}

How we approach visual design, user experience, and interface patterns.

### PRINCIPLE 2.1: Wireframe-First
**What:** Design structure before polish. Box diagrams before colors/fonts.  
**Why:** Faster iteration. Clear feedback (layout vs aesthetics).  
**How:** Start wireframe. Get approval. Then enhance.  
**Document:** ETSC-PROTOTYPE-DOCUMENTATION.md  
**Enforcement:** Design review checklist

---

### PRINCIPLE 2.2: Capability Shutdown (Not Separate UIs)
**What:** One UI for all tiers. Admin: all enabled. TRUSTED: some disabled. EXTERNAL: hidden.  
**Why:** Single codebase, consistent UX, easier maintenance.  
**How:** Permission-gated features, not separate components.  
**Example:** All tiers see edit button. Admin: enabled. TRUSTED: disabled (grayed).  
**Document:** CDS-3SCOPE-ENTERPRISE-METHODOLOGY.md  
**Enforcement:** Code review (reject separate UIs)

---

### PRINCIPLE 2.3: Design Tokens (Locked Values)
**What:** All measurements as variables. No random pixel values.  
**Why:** Perfect consistency. Easy to change globally.  
**How:** Define tokens (spacing, typography, colors). Use everywhere.  
**Example:** $spacing-md = 12px. Use in all paddings/gaps.  
**Document:** ETSC-DESIGN-TOKENS.md  
**Enforcement:** Linter (rejects non-token values)

---

### PRINCIPLE 2.4: Contrast Standards (7:1 Minimum)
**What:** Primary text 7:1 contrast (WCAG AAA, not AA).  
**Why:** Accessibility, readability, professionalism.  
**How:** Define color palette. Verify contrast with WebAIM. Test.  
**Example:** #1a1a1a on #ffffff = 21:1 (far exceeds 7:1).  
**Document:** ETSC-CONTRAST-GUIDELINES.md  
**Enforcement:** WebAIM validator in CI/CD

---

### PRINCIPLE 2.5: Accessibility Mandatory (WCAG AA minimum)
**What:** All features must work for all abilities.  
**Why:** Legal requirement, ethical responsibility, broader audience.  
**How:** Keyboard nav, ARIA attributes, focus states, color + icons (not color alone).  
**Document:** ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (Tab 1: UX)  
**Enforcement:** Automated audits + manual testing

---

### PRINCIPLE 2.6: Tooltips on All Metrics
**What:** Every metric/field has (?) tooltip explaining what it means.  
**Why:** Transparency, reduces support burden, improves usability.  
**How:** (?) icon, hover shows 1-2 sentence explanation.  
**Example:** Capacity tooltip: "Current active goals / Maximum concurrent goals"  
**Document:** ELEMENT-TOOLTIP.md  
**Enforcement:** Checklist (block shipping without tooltips)

---

### PRINCIPLE 2.7: Text Wrapping Consistency
**What:** Define max-width rules to force consistent line breaks.  
**Why:** Prevents text breaking differently in different places. Looks unprofessional otherwise.  
**How:** CSS rule: max-width + word-break. Apply to all similar elements.  
**Example:** Step labels max-width: 120px (breaks consistently).  
**Document:** CDS-DEFINITION-WITH-EXAMPLES-PRINCIPLE.md  
**Enforcement:** CSS constants, visual review

---

### PRINCIPLE 2.8: 8px Spacing Grid
**What:** All gaps/padding use 8px multiples only (8, 12, 16, 20, 30, 40px).  
**Why:** Harmony, rhythm, predictability.  
**How:** Define as tokens. Linter rejects other values.  
**Example:** Button gap = 12px. Field gap = 16px. Section gap = 40px.  
**Document:** ETSC-DESIGN-TOKENS.md  
**Enforcement:** Linter

---

### PRINCIPLE 2.9: Three-Option Variants (For Every Component)
**What:** Every component offered in 3 variants (responsive: mobile/tablet/desktop).  
**Why:** Covers all contexts. No rebuilding.  
**How:** DEFAULT (desktop), VARIANT 1 (tablet), VARIANT 2 (mobile).  
**Example:** Dashboard: horizontal (desktop), vertical (tablet), card-based (mobile).  
**Document:** CDS-OPTIONS-LIBRARY-FRAMEWORK.md  
**Enforcement:** Template review

---

### PRINCIPLE 2.10: Responsive Design (3 Breakpoints)
**What:** Design for 480px (mobile), 768px (tablet), 1200px+ (desktop).  
**Why:** Users on all devices. Must work everywhere.  
**How:** Test all 3 breakpoints. Components adapt.  
**Document:** ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (Tab 1: UX)  
**Enforcement:** Automated browser testing

---

### PRINCIPLE 2.11: Edge Cases + States (Empty/Loading/Error/Success)
**What:** Every component defined for 4 states: empty (no data), loading (fetching), error (failed), success (works).  
**Why:** Users expect system to handle all states gracefully.  
**How:** Design + code for all 4 states.  
**Example:** Dashboard: empty (show "No goals yet"), loading (spinner), error (show error message), success (show data).  
**Document:** CDS-OPTIONS-LIBRARY-TEMPLATE.md  
**Enforcement:** Component testing

---

### PRINCIPLE 2.12: Color Palette (Locked)
**What:** Use only defined colors. No custom hex values.  
**Why:** Consistency, predictable branding, global change capability.  
**How:** Define palette (action green, danger red, info blue). Use variables.  
**Example:** $color-action-primary = #50c878. All action buttons use this.  
**Document:** ETSC-DESIGN-TOKENS.md  
**Enforcement:** Linter (rejects custom colors)

---

### PRINCIPLE 2.13: Button Height (40px Standard)
**What:** All buttons 40px tall (exception: 32px compact, 48px mobile).  
**Why:** Touch target accessibility, visual consistency, predictable spacing.  
**How:** CSS constant. Never override.  
**Example:** All ETSC buttons are 40px (except mobile edge cases).  
**Document:** ETSC-DESIGN-TOKENS.md  
**Enforcement:** Linter, visual review

---

### PRINCIPLE 2.14: Input Height (40px Standard)
**What:** All form inputs 40px tall (matching button height).  
**Why:** Visual harmony, accessibility, consistency.  
**How:** CSS constant. All inputs same height.  
**Example:** Text input, select, textarea all 40px.  
**Document:** ETSC-DESIGN-TOKENS.md  
**Enforcement:** CSS constant, linter

---

### PRINCIPLE 2.15: Sortable Headers (All Tables)
**What:** Every table header clickable for sorting.  
**Why:** Users expect to sort. Improves discoverability.  
**How:** Clickable header, sort indicator (↑↓).  
**Example:** Participant table: click "Capacity" → sorts by capacity.  
**Document:** ELEMENT-TABLE.md  
**Enforcement:** Component requirement checklist

---

## TIER 3: OPERATIONAL PRINCIPLES {#tier-3-operational}

How CDS operates day-to-day, session-to-session, cycle-to-cycle.

### PRINCIPLE 3.1: 3-Scope Methodology
**What:** Every feature has 3 scopes: CORE (100% built), SCOPE 1 (70% UI), SCOPE 2 (30% roadmap).  
**Why:** Enables incremental delivery. Not all-or-nothing.  
**How:** Plan all 3 scopes. Build CORE. Placeholder SCOPE 1. Document SCOPE 2.  
**Example:** ETSC Goal Wizard (CORE), Approval Workflows (SCOPE 1 placeholder), ML Recommendations (SCOPE 2 idea).  
**Document:** CDS-3SCOPE-ENTERPRISE-METHODOLOGY.md  
**Enforcement:** Architectural requirement

---

### PRINCIPLE 3.2: Admin Enhanced Abilities (Hardwired)
**What:** Admin can edit/change any goal at ANY point. No restrictions.  
**Why:** Admin is trusted tier with full authority.  
**How:** Full edit capability. Complete audit trail.  
**Example:** Admin can edit goal after creation, delete, reassign, refine anytime.  
**Document:** ETSC-WIZARD-ADMIN-ENHANCEMENTS.md  
**Enforcement:** Code-level (can't turn off)

---

### PRINCIPLE 3.3: Immutable Decision-Log
**What:** All goals recorded in immutable decision-log after creation.  
**Why:** Audit trail, compliance, reproducibility.  
**How:** Hash-chained entries. Cannot modify. Can only append.  
**Example:** Goal created → decision-log entry created → entry has cryptographic hash.  
**Document:** Decision-Log architecture (Phase 0)  
**Enforcement:** Cryptographic verification

---

### PRINCIPLE 3.4: Schema Alignment (Everywhere)
**What:** Every goal type, participant, bundle maps to canonical schema node.  
**Why:** Prevents drift, orphans, duplicate definitions.  
**How:** Reference schema node. Use checksums. Prevent orphans.  
**Example:** Goal "Performance Optimization" → SCHEMA-GOAL-PERF-001.  
**Document:** ETSC-GOAL-DEFINITION-SYSTEM-PLAN.md  
**Enforcement:** Schema checksum validation

---

### PRINCIPLE 3.5: Tier-Based Permissions
**What:** Features gated by tier: ADMIN (all), TRUSTED (some), EXTERNAL (minimal).  
**Why:** Security, responsibility, progressive access.  
**How:** Permission checks at gate level. Cannot bypass.  
**Example:** Edit button disabled for TRUSTED tier.  
**Document:** CDS-3SCOPE-ENTERPRISE-METHODOLOGY.md  
**Enforcement:** Gate-level validation

---

### PRINCIPLE 3.6: Compaction Protocol
**What:** Before auto-compaction, prepare one-click recovery prompt.  
**Why:** Maintains context across session boundaries.  
**How:** Document session learnings. Prepare recovery prompt. User pastes prompt next session.  
**Example:** POST-COMPACTION-S349-RECOVERY-PROMPT.md ready before context cut.  
**Document:** HARDWIRED-COMPACTION-PROTOCOL-001.md  
**Enforcement:** Mandatory (auto-prepared, user confirms)

---

### PRINCIPLE 3.7: Weekly Reflection (CDS DNA)
**What:** Every week, reflect on CDS alignment using 7-question checklist.  
**Why:** Prevents drift. Keeps principles alive.  
**How:** Score 0-7. Track improvement.  
**Document:** CDS-DNA-PRACTICE-FRAMEWORK.md  
**Enforcement:** Cultural (not automated)

---

### PRINCIPLE 3.8: Exhaustive Checklists (Never Ship Without)
**What:** 46+ item checklist per page. Cannot ship without all items verified.  
**Why:** Prevents "good enough" shipping. Maintains quality.  
**How:** Checklist blocks merge. All items required.  
**Document:** ETSC-DESIGN-CONSISTENCY-CHECKLIST.md  
**Enforcement:** CI/CD gate

---

### PRINCIPLE 3.9: Learning Loops (Cycle-to-Cycle)
**What:** End each cycle, populate "What We Learned." Start next cycle, read learnings.  
**Why:** Knowledge compounds. Prevents repeating mistakes.  
**How:** Dashboard with cycles. S349 populated. S350+ templates.  
**Example:** S349 learned "admin must have full edit" → S350 implements it everywhere.  
**Document:** LEARNING-LOOPS-DASHBOARD-SKELETON.md  
**Enforcement:** Session start review

---

### PRINCIPLE 3.10: Glossary (Single Source of Truth for Terms)
**What:** All terms mapped to canonical definitions. One definition per term, not competing.  
**Why:** Prevents confusion. Unified vocabulary.  
**How:** Glossary entry. All aliases point to same canonical term.  
**Example:** CSP calls it "sphere", CSPS calls it "tier" → both map to "consulting_unit".  
**Document:** Phase 0 (GLOSSARY.md in HUB directory)  
**Enforcement:** Checksum validation

---

### PRINCIPLE 3.11: Conflict Escalation (Auto-Escalate at Day 7)
**What:** Conflicts unresolved after 7 days auto-escalate to Yariv.  
**Why:** Prevents stalling. Forces resolution.  
**How:** ConflictRecord. 7-day timer. Auto-escalate.  
**Example:** Conflict opened. CDS triages Days 1-7. Auto-escalate Day 10. Yariv decides.  
**Document:** ETSC-GOAL-DEFINITION-SYSTEM-PLAN.md (Layer 1)  
**Enforcement:** Mechanical (no manual bypass)

---

### PRINCIPLE 3.12: Drift Prevention (7 Failure Modes)
**What:** 7 failure modes prevented at gate level: vocabulary drift, authority bypass, context overflow, tier skip, false assumption, capability mismatch, silent drift.  
**Why:** Prevents systemic issues before they compound.  
**How:** Gate for each mode. Blocks or escalates. Cannot proceed.  
**Document:** HARDWIRED-COMPACTION-PROTOCOL-001.md  
**Enforcement:** Gate-level (mechanical)

---

## TIER 4: PLANNING & EXECUTION PRINCIPLES {#tier-4-planning}

How we plan work, execute it, and know when we're done.

### PRINCIPLE 4.1: Planning with Options (Don't Decide Drop/Do)
**What:** Don't decide "do it or drop it." Plan all 3 scopes: CORE (detail), SCOPE 1 (placeholder), SCOPE 2+ (seeds).  
**Why:** Never lose ideas. Placeholder serves as reminder. Expand incrementally.  
**How:** Stub pages exist. SCOPE 1 visible in nav. SCOPE 2+ documented.  
**Example:** Approval Workflows (SCOPE 1) exists in nav as "Coming soon" placeholder.  
**Document:** CDS-PLANNING-WITH-OPTIONS.md  
**Enforcement:** Navigation + checklist

---

### PRINCIPLE 4.2: CORE/SCOPE 1/SCOPE 2+ in Codebase
**What:** Codebase organized by scope level. CORE works. SCOPE 1 stubbed. SCOPE 2+ ideated.  
**Why:** Clear what's stable vs experimental. Easy to find roadmap.  
**How:** Directory structure: /core, /scope1, /scope2+.  
**Example:**
```
ETSC/
├─ /core (working, stable)
├─ /scope1 (placeholders, UI stubbed)
└─ /scope2+ (concepts, roadmap)
```  
**Document:** CDS-PLANNING-WITH-OPTIONS.md  
**Enforcement:** Code organization

---

### PRINCIPLE 4.3: 3-Option Generation (For Every Feature)
**What:** When solving problem, generate 3 different approaches.  
**Why:** Better chance of finding optimal solution.  
**How:** Brainstorm 3 options. Score on 6 criteria (accessibility, readability, consistency, performance, scalability, maintainability).  
**Document:** CDS-OPTIONS-LIBRARY-FRAMEWORK.md  
**Enforcement:** Design review (ask "where are other 2 options?")

---

### PRINCIPLE 4.4: Objective Evaluation (Scored, Not Subjective)
**What:** Score each option on 6 criteria. Pick winner objectively.  
**Why:** Removes bias. Decisions traceable.  
**How:** Evaluation matrix. Score 1-5 per criterion. Total score wins.  
**Example:** Dashboard options scored on accessibility (A: 5, B: 4, C: 3), readability (A: 5, B: 4, C: 3), etc.  
**Document:** CDS-OPTIONS-LIBRARY-FRAMEWORK.md  
**Enforcement:** Decision logging

---

### PRINCIPLE 4.5: Seal + Lock (After Decision)
**What:** Once option chosen, seal it. Lock code. Make variants immutable.  
**Why:** Prevents drift from chosen option.  
**How:** Code locked. Variables hardcoded. Cannot change without explicit override.  
**Example:** Dashboard horizontal layout locked as DEFAULT. Variants sealed.  
**Document:** CDS-OPTIONS-LIBRARY-TEMPLATE.md  
**Enforcement:** Code review (reject changes to sealed components)

---

### PRINCIPLE 4.6: Completion Standard = Wired + Called + Verified
**What:** Feature complete only when: wired to backend, called from UI, verified working end-to-end.  
**Why:** No half-finished features. Everything works.  
**How:** Checklist: code written, API integrated, UI calls it, tests pass, manual testing done.  
**Document:** CDS-PLATFORM-ATTITUDE-DOCTRINE.md  
**Enforcement:** Pull request checklist

---

### PRINCIPLE 4.7: MVP = Minimal Viable Product (CORE Only)
**What:** MVP includes CORE features only. SCOPE 1/2+ come later.  
**Why:** Fast to ship. Proves concept. Informs SCOPE 1/2.  
**How:** Build CORE fully. Ship. Then plan SCOPE 1.  
**Example:** ETSC MVP = Goal Wizard + Dashboard + Bundle Config (all CORE).  
**Document:** CDS-PLATFORM-ATTITUDE-DOCTRINE.md  
**Enforcement:** Feature freeze (SCOPE 1/2 excluded from MVP)

---

### PRINCIPLE 4.8: Hardwire vs AI Flexibility (3 Zones)
**What:** Define 3 zones per rule: LOCKED (no flexibility), GUIDED (constrained), OPEN (full creativity).  
**Why:** AI knows exactly where its boundaries are. No guessing.  
**How:** Decision tree classifies each rule. AI follows zone instructions.  
**Example:** Button height LOCKED (40px). Button color GUIDED (palette only). Label text OPEN (AI chooses).  
**Document:** HARDCODING-VS-AI-FLEXIBILITY-FRAMEWORK.md  
**Enforcement:** AI instruction set

---

## TIER 5: GOVERNANCE & ENFORCEMENT {#tier-5-governance}

How we ensure principles are followed, not just documented.

### PRINCIPLE 5.1: Mechanical Enforcement First
**What:** Make rules impossible to break (via code, gates, linters) before relying on human review.  
**Why:** Humans forget. Systems never do.  
**How:** Implement as constants, enums, linters, pre-commit hooks, CI/CD gates.  
**Example:** Button heights constant. Linter rejects deviations. Cannot merge.  
**Document:** CDS-DNA-PRACTICE-FRAMEWORK.md  
**Enforcement:** Architecture-level

---

### PRINCIPLE 5.2: Checklist-Driven QA (Not Gut Feel)
**What:** Before shipping, run through comprehensive checklist. Not "feels right," but "passes all items."  
**Why:** Eliminates subjectivity. Catches everything.  
**How:** Checklist with 40+ items. Must check all. Cannot merge without.  
**Document:** ETSC-DESIGN-CONSISTENCY-CHECKLIST.md  
**Enforcement:** CI/CD gate

---

### PRINCIPLE 5.3: Communication Protocol (I READ / I AM / I WOULD LIKE / CONTEXT / SPECIFICALLY)
**What:** When communicating with external systems, use 5-element pattern.  
**Why:** Clear, traceable, reduces back-and-forth.  
**How:** Structure every communication this way.  
**Example:** "I READ your proposal. I AM CDS orchestrator. I WOULD LIKE expert input on X. CONTEXT: Y. SPECIFICALLY: Z."  
**Document:** CDS-COMMUNICATION-HUB-ESTABLISHED.md  
**Enforcement:** Protocol review

---

### PRINCIPLE 5.4: Authority Approval (Yariv for Uncertain Decisions)
**What:** When principle unclear, Yariv (governor) makes decision.  
**Why:** Clear authority. No decision paralysis.  
**How:** Escalate to Yariv. Yariv decides. Decision logged.  
**Example:** Unclear if feature is CORE or SCOPE 1. Escalate to Yariv. Yariv decides.  
**Document:** Authority matrix (Phase 0)  
**Enforcement:** Escalation path

---

### PRINCIPLE 5.5: Cryptographic Logging (All Decisions)
**What:** All important decisions logged with cryptographic hash chain.  
**Why:** Audit trail. Immutable. Reproducible.  
**How:** DecisionNode with SHA256 hash. Hash references previous decision.  
**Example:** Every goal creation → decision-log entry → immutable.  
**Document:** Decision-Log architecture (Phase 0)  
**Enforcement:** Cryptographic verification

---

### PRINCIPLE 5.6: Continuous Improvement (Feedback Loop)
**What:** Every cycle generates learnings. Learnings inform next cycle. System improves.  
**Why:** Prevents stagnation. Enables evolution.  
**How:** Learning loops. Feedback mechanisms. Reflect weekly.  
**Example:** S349 learned X. S350 implements X. S351 refines X.  
**Document:** LEARNING-LOOPS-DASHBOARD-SKELETON.md  
**Enforcement:** Session-to-session review

---

## CROSS-PRINCIPLE CONNECTIONS

These principles work together. Here are key relationships:

### Consistency Ecosystem
- **Principle 1.2** (Consistency fundamental)
- **Principle 2.3** (Design tokens)
- **Principle 2.8** (8px grid)
- **Principle 2.12** (Color palette)
- **Principle 2.13** (Button height)
- → All work together to maintain visual + structural consistency

### Scope Management Ecosystem
- **Principle 3.1** (3-scope methodology)
- **Principle 4.1** (Planning with options)
- **Principle 4.2** (CORE/SCOPE 1/SCOPE 2+ structure)
- **Principle 4.7** (MVP = CORE only)
- → All work together to manage delivery without dropping ideas

### Quality Enforcement Ecosystem
- **Principle 1.3** (Hardwire governance)
- **Principle 5.1** (Mechanical enforcement)
- **Principle 5.2** (Checklist-driven QA)
- **Principle 1.10** (Proactive detection)
- → All work together to prevent issues systematically

### Learning Ecosystem
- **Principle 1.6** (Knowledge compounds)
- **Principle 3.7** (Weekly reflection)
- **Principle 3.9** (Learning loops)
- **Principle 5.6** (Continuous improvement)
- → All work together to grow system capability over time

---

## HOW TO USE THIS INDEX

### If You're Uncertain About a Decision
1. Check TIER 1 (Foundational). Does principle apply?
2. Check relevant TIER (Design/Operations/Planning). More specific guidance?
3. Check principle document. Read full context + examples.
4. If still unclear → escalate to Yariv.

### If You're Teaching New Team Member
1. Start with TIER 1 (foundational DNA)
2. Move to relevant TIER (Design if building UI, Operations if shipping)
3. Provide principle documents (not just summaries)
4. Have them do weekly reflection (Principle 3.7)

### If You're Designing New Feature
1. Check if principle already exists (avoid reinventing)
2. Use 3-option approach (Principle 4.3)
3. Evaluate objectively (Principle 4.4)
4. Seal + lock (Principle 4.5)
5. Document in library (Principle 4.2)

### If You're Shipping Code
1. Run through checklist (Principle 5.2)
2. Verify mechanical enforcement in place (Principle 5.1)
3. Check accessibility (Principle 2.5)
4. Verify schema alignment (Principle 3.4)
5. Only then merge

---

## PRINCIPLE DOCUMENT MAP

| Principle | Primary Document | Secondary Documents |
|-----------|------------------|-------------------|
| 1.1 Options | PLATFORM-ATTITUDE-DOCTRINE | 3SCOPE-ENTERPRISE |
| 1.2 Consistency | 3SCOPE-ENTERPRISE | DESIGN-TOKENS |
| 1.3 Hardwire | DNA-PRACTICE | ENFORCEMENT-GATES |
| 1.4 Nothing Alone | GOAL-DEFINITION-PLAN | DESIGN-SYSTEM |
| 1.5 Prevention | COMPACTION-PROTOCOL | DRIFT-PREVENTION |
| 1.6 Knowledge | LEARNING-LOOPS | DNA-PRACTICE |
| 1.7 Authority | AUTHORITY-MATRIX | DECISION-LOG |
| 1.8 Options-First | OPTIONS-LIBRARY | EVALUATION-TEMPLATE |
| 1.9 Define w/ Examples | DEFINITION-PRINCIPLE | CONTRAST-GUIDELINES |
| 1.10 Proactive | PROACTIVE-NOTIFICATION | EDGE-DETECTION |
| 2.x Design | ENHANCED-UX-UI-SYSTEM | DESIGN-TOKENS, CONTRAST |
| 3.x Operations | (Varies) | Multiple |
| 4.x Planning | PLANNING-WITH-OPTIONS | SCOPE-METHODOLOGY |
| 5.x Governance | (Varies) | Multiple |

---

## VERSION HISTORY

- **v1.0** (S349): 7 foundational principles
- **v1.5** (S350): Added design + operations principles (22 total)
- **v2.0** (2026-07-07): Added planning + governance, formalized all 51 principles

---

## NEXT: Read These Documents In Order

1. **CDS-PLATFORM-ATTITUDE-DOCTRINE.md** (foundational philosophy)
2. **CDS-DNA-PRACTICE-FRAMEWORK.md** (how to practice it)
3. **CDS-3SCOPE-ENTERPRISE-METHODOLOGY.md** (how to scope work)
4. **HARDCODING-VS-AI-FLEXIBILITY-FRAMEWORK.md** (how to guide AI)
5. **CDS-PLANNING-WITH-OPTIONS.md** (how to plan)
6. **CDS-OPTIONS-LIBRARY-FRAMEWORK.md** (how to execute)
7. **ETSC-DESIGN-CONSISTENCY-CHECKLIST.md** (how to verify)

---

**Master Index Created:** 2026-07-07  
**51 Principles Documented**  
**5 Tiers Organized**  
**Cross-Principle Connections Mapped**  
**Ready for Reference**

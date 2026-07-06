---
title: "CDS DNA Practice Framework"
date: 2026-07-06
status: OPERATIONAL_GUIDE
version: 1.0
---

# HOW TO PRACTICE CDS DNA

**Question:** What does it mean to live CDS DNA in daily work?  
**Answer:** Making decisions that align with CDS principles, even when it's harder.

---

## WHAT IS CDS DNA?

CDS DNA is a set of hardwired principles that govern how we make decisions:

1. **Options become architecture** — Don't pick a path. Build architecture that enables all paths.
2. **Consistency as fundamental** — Consistency IS the product. Repetition prevents drift.
3. **Hardwire governance** — Make rules mechanical, not advisory. Make failure impossible, not hoped-for.
4. **Nothing stands alone** — Every term, every capability, every decision links to canonical schema.
5. **Mechanical enforcement** — Gates block bad decisions. No bypasses (except Yariv waiver + logging).
6. **Prevention-focused** — Catch issues before they happen. Undo before they spread.
7. **Knowledge compounds** — Document learnings. Make them permanent. Reuse them.

---

## HOW TO PRACTICE CDS DNA (7 Concrete Actions)

### Practice 1: Make Options Architecture, Not Decisions

**What it means:**
- Don't ask "Should we support X or Y?"
- Ask "How do we build architecture that supports all options, then gate them by permission?"

**Example (What CDS Does):**
- ❌ WRONG: "Should admin see edit button or not?"
- ✅ RIGHT: "All tiers see same UI. Admin has edit button ENABLED. TRUSTED tier has edit button DISABLED (grayed out)."

**How to Practice:**
1. When faced with "either/or" decision, reframe as "architecture that enables both"
2. Identify the permission gate (who can do this?)
3. Implement one UI with permission-gated features
4. Document the gate for future use

**In Daily Work:**
- You're building Goal Dashboard
- Question: "Should we show different data to admin vs user?"
- CDS Practice: "Show same dashboard to both. Admin sees all fields enabled. User sees fields disabled/hidden based on permission."
- Result: One UI, consistent experience, scalable

---

### Practice 2: Consistency Before Features

**What it means:**
- Consistency is not a nice-to-have. It IS the feature.
- Inconsistency wastes more time than building it right once.

**Example (What CDS Does):**
- Instead of building 5 different button styles, define THE button (height, width, color, spacing)
- Apply it everywhere
- Never deviate

**How to Practice:**
1. Define pattern once (e.g., "all buttons are 40px tall, green, 16px padding")
2. Document the pattern
3. Apply pattern to ALL instances (not just some)
4. Before adding new instance, check if pattern exists
5. If pattern broken somewhere, fix it (don't create new pattern)

**In Daily Work:**
- You're building Participant Dashboard
- Temptation: Make one button 40px, another 36px (slight visual tweak for aesthetics)
- CDS Practice: Keep all buttons 40px. If aesthetics need adjustment, adjust design token (affects all buttons, not one)
- Result: Perfect consistency, easier maintenance, predictable scaling

---

### Practice 3: Hardwire Governance (Make Rules Mechanical)

**What it means:**
- Rules should be enforced by the system, not by hoping people follow them.
- If a rule can be a gate, make it a gate.

**Example (What CDS Does):**
- ❌ WRONG: "Remember to include tooltips on all fields (advisory rule)"
- ✅ RIGHT: "System blocks shipping if field missing tooltip (mechanical gate)"

**How to Practice:**
1. Take a rule: "All forms must have labels"
2. Instead of hoping devs remember, create a linter/validation that catches missing labels
3. Make it impossible to ship without fixing
4. Document why the rule exists

**In Daily Work:**
- You're reviewing Pull Request
- You notice: "Field 'Capacity' missing tooltip"
- CDS Practice: Don't ask "can you add tooltip?" → Instead, add tooltip validation to pre-commit hook
- Next PR automatically fails if tooltip missing
- Result: No need to review repeatedly; system enforces it

---

### Practice 4: Nothing Stands Alone (Schema Alignment)

**What it means:**
- Every piece of data, every term, every capability must link to canonical schema.
- Orphaned references = drift waiting to happen.

**Example (What CDS Does):**
- Every capability references schema node
- Every goal type references schema node  
- Every participant references schema node
- They're all in one place. Checksum prevents orphans.

**How to Practice:**
1. When adding new capability/concept, ask: "Where does this map in canonical schema?"
2. If it doesn't map, extend schema first (not ad-hoc)
3. Document the link
4. Reference it everywhere

**In Daily Work:**
- You're adding "Priority" field to Goal
- CDS Practice: Don't just add it to form
- First: "Where does 'Priority' live in schema? Does it have a node?"
- If not: Create schema node: `decisions.goals.priority`
- Then: Reference that node everywhere priority appears (form, API, database)
- Result: Priority can't drift; it's pinned to schema

---

### Practice 5: Mechanical Enforcement Over Advisory

**What it means:**
- Don't write "please follow pattern X"
- Create pattern X so it's impossible not to follow

**Example (What CDS Does):**
- Instead of doc saying "always run tests", CI/CD blocks merge if tests fail
- Instead of saying "match design tokens", linter flags custom colors in CSS

**How to Practice:**
1. Identify repeating problem (e.g., "buttons have inconsistent padding")
2. Don't just document it ("buttons should have 16px padding")
3. Make it mechanical:
   - Define button CSS class with padding baked in
   - Linter rejects custom button padding
   - Can't merge PR without passing linter
4. Problem solved automatically

**In Daily Work:**
- You notice several dashboards use different spacing
- CDS Practice:
  - Don't write "use 8px grid"
  - Create CSS variables ($spacing-8, $spacing-12, etc.)
  - Linter rejects arbitrary pixel values
  - Developers forced to use variables
- Result: Perfect spacing consistency without needing reviews

---

### Practice 6: Prevention > Detection > Reaction

**What it means:**
- Best time to catch issue: before it happens
- Next best: as soon as it happens
- Worst: after it ships

**Example (What CDS Does):**
- **Prevention:** Schema checksum prevents orphaned references (issue can't be created)
- **Detection:** ConflictRecord flags inconsistencies (issue detected within minutes)
- **Reaction:** Escalation to Yariv if unresolved (issue handled before it spreads)

**How to Practice:**
1. Look at past bugs
2. Ask: "How could we have prevented this?"
3. Implement prevention gate
4. If gate not possible, implement detection (automated alert)
5. If detection not possible, document escalation process

**In Daily Work:**
- You're concerned about typos in field names (breaks schema mapping)
- CDS Practice:
  - Prevention: Enum for field names (can't type arbitrary strings)
  - Detection: Linter checks if field name exists in schema
  - Reaction: PR comment with schema link
- Result: Typos become impossible

---

### Practice 7: Document Learnings + Make Them Permanent

**What it means:**
- Every mistake is a chance to hardwire a lesson
- Make learnings mechanical so they can't be forgotten

**Example (What CDS Does):**
- Session S349 learned: "Admin must have full edit capability"
- Not just documented → Hardwired into CORE as requirement
- Every future feature must support it

**How to Practice:**
1. At end of session/cycle, ask: "What did we learn?"
2. Don't just write it down — ask "How do we make this impossible to forget?"
3. Hardwire the learning:
   - Add it to permanent governance doc
   - Add it to checklist (block shipping without it)
   - Add it to code as architectural constraint
   - Teach it to new team members

**In Daily Work:**
- During build, you discover: "Form validation must happen before API call"
- CDS Practice:
  - Don't just fix code
  - Add validation as architectural pattern (every form has pre-submit validation)
  - Add to design system doc
  - Add to MVP build template
  - Make it so next developer can't build form without validation
- Result: Lesson becomes DNA (never forgotten, always applied)

---

## CHECKLIST: Am I Practicing CDS DNA?

Use this checklist to assess decisions:

### Decision Analysis

When making a decision, ask:

- [ ] **Options Architecture?** Am I enabling all options (gated by permission) or picking a path?
- [ ] **Consistency Check?** Does this decision maintain pattern consistency or create new pattern?
- [ ] **Mechanical?** Is this rule enforced by system or advisory?
- [ ] **Schema Aligned?** Does this reference canonical schema or create orphaned concept?
- [ ] **Prevention?** Am I preventing issue or just reacting to it?
- [ ] **Documented?** Will future person understand why this decision was made?
- [ ] **Hardwired?** Can this lesson be forgotten, or is it baked into system?

**Scoring:**
- 7/7 ✓✓✓ — Perfect CDS decision
- 5-6/7 ✓✓ — Good decision, some advisory elements remain
- 3-4/7 ✓ — Acceptable decision, but has risk
- 0-2/7 ✗ — Not aligned with CDS DNA, revisit

---

## WEEKLY CDS DNA REFLECTION

Every week, spend 15 minutes on this reflection:

1. **What decisions did I make this week?**
   - List 3-5 decisions

2. **Which ones were CDS-aligned?**
   - Which followed 7 practices above?
   - Which didn't?

3. **What slipped from CDS DNA?**
   - Where did I make advisory rule instead of mechanical gate?
   - Where did I create new pattern instead of using existing?
   - Where did I fix symptom instead of preventing cause?

4. **What will I hardwire next week?**
   - What lesson did I learn that should become permanent?
   - How will I make it mechanical?

5. **What would Yariv (Governor) say?**
   - If Yariv reviewed my work, what would they approve/reject?
   - What principle would I violate?

---

## TEACHING CDS DNA TO OTHERS

When onboarding new team member or explaining to stakeholder:

**The 30-Second Version:**
"CDS DNA is: Build architecture that enables options (gated by permission), make rules mechanical so they can't be broken, document learnings so they become permanent, align everything to canonical schema so nothing drifts."

**The 5-Minute Version:**
1. Options become architecture (not decisions)
2. Consistency is the product
3. Mechanical enforcement (gates, not hope)
4. Schema alignment (nothing stands alone)
5. Prevention focused (catch before it happens)
6. Knowledge compounds (document + hardwire)

**The 30-Minute Deep Dive:**
- Walk through each of 7 practices with real examples from ETSC
- Show how each practice prevents specific problem
- Have person identify where CDS DNA prevented issues in their work

---

## CDS DNA IN ACTION (Real Example from S349)

**Decision:** Admin enhanced abilities

**CDS DNA Application:**
1. ✓ **Options Architecture:** Instead of "should admin have edit button?", built UI that admin has button enabled, other tiers have disabled
2. ✓ **Consistency:** Applied same pattern to all steps (Step 1-6)
3. ✓ **Mechanical:** Made it hardwired requirement in CORE (can't build ETSC without admin abilities)
4. ✓ **Schema Aligned:** Linked to canonical goal-definition-system schema
5. ✓ **Prevention:** Defined admin abilities upfront (couldn't be forgotten)
6. ✓ **Documented:** Created ETSC-WIZARD-ADMIN-ENHANCEMENTS.md (permanent reference)
7. ✓ **Hardwired:** Made it governance rule (all future features must support admin edit)

**Result:** Admin edit capability won't be forgotten, reimplemented wrong, or drift over time. It's mechanical + documented + schema-aligned.

---

## FAQ: Practicing CDS DNA

**Q: Doesn't CDS DNA limit creativity?**
A: No. CDS DNA limits INCONSISTENCY. You can be creative within defined constraints. Example: Design tokens (constraints) enable consistent but beautiful UI. Constraints enable scale.

**Q: How do I know if I'm practicing CDS DNA?**
A: Check the weekly reflection above. If you're hardwiring learnings, enforcing rules mechanically, and documenting principles, you're practicing it.

**Q: What if CDS DNA conflicts with deadline?**
A: CDS DNA is faster in long term (prevents rework). In short term, might feel slower. But mechani enforcement saves time overall. Example: Spend 1 hour hardwiring validation gate → save 10 hours in testing/rework.

**Q: How do I teach CDS DNA to my team?**
A: Use the 30-second / 5-minute / 30-minute versions above. Show real examples (ETSC, Phase 0). Have them practice weekly reflection. Make it cultural norm, not policy.

**Q: What if I disagree with a CDS principle?**
A: Discuss with Yariv (Governor). If principle seems wrong, present evidence. If Yariv agrees, update principle and document why. If you disagree but Yariv approves, follow principle (authority matters).

---

**Status:** Ready to apply in all sessions  
**Audience:** CDS team, all contributors  
**Update Frequency:** As new lessons learned

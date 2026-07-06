---
title: "CDS DNA Extended - Principles 8-10"
date: 2026-07-06
status: GOVERNANCE_EXPANSION
version: 2.0
---

# CDS DNA EXTENDED: PRINCIPLES 8-10

**Purpose:** Formalize three paradigm shifts in CDS DNA.

**Status:** These principles complement the original 7 principles (from CDS-DNA-PRACTICE-FRAMEWORK.md). Together, they form complete CDS governance.

---

## QUICK REFERENCE

**Original 7 Principles (from CDS-DNA-PRACTICE-FRAMEWORK.md):**
1. Options become architecture
2. Consistency as fundamental
3. Hardwire governance
4. Nothing stands alone
5. Mechanical enforcement
6. Prevention-focused
7. Knowledge compounds

**New 3 Principles (in this document):**
8. Options-First, Not Perfect-Once
9. Define with Context + Examples
10. Proactive Edge Detection

---

## PRINCIPLE 8: OPTIONS-FIRST, NOT PERFECT-ONCE

**Core Idea:**
Don't build one solution hoping it works everywhere. Build 3 options → evaluate → refine → seal as default + 2 variants.

**The Shift:**
- ❌ OLD: "Let's create the best dashboard layout possible"
- ✅ NEW: "Let's create 3 layouts (horizontal, vertical, card) → test all 3 → default to winner → offer others as variants"

### Why This Matters

**Problem with "Perfect Once":**
- You design one solution
- It works great for desktop
- Breaks on mobile
- You rebuild for mobile
- Then breaks on tablet
- Endless rework

**Solution with "3 Options":**
- Generate 3 different approaches upfront
- Evaluate all 3 objectively
- Choose the winner
- Offer 2 runners-up as variants
- User picks variant that matches their context
- No rebuilding because all variants tested + verified

### The Process

**Phase 1: Generate 3 Options**
Create 3 fundamentally different solutions to the same problem.

**Example:** How to display participant list?
- Option A: Horizontal table (wide data, desktop-focused)
- Option B: Vertical stacked (mobile-first, narrow)
- Option C: Cards (flexible, adaptive)

**Phase 2: Evaluate 3 Options**
Score each on 6 criteria:
- Accessibility (all users can use it?)
- Readability (is data clear?)
- Consistency (matches system patterns?)
- Performance (fast enough?)
- Scalability (works with 1000 items?)
- Maintainability (can developers modify?)

**Phase 3: Refine Top Option**
Take the winner. Add design tokens, edge cases, accessibility features.

**Phase 4: Seal + Offer as Default + 2 Variants**
- DEFAULT: The winner (recommended)
- VARIANT 1: Runner-up (good for different context)
- VARIANT 2: Third option (good for another context)

**Phase 5: User Gets Templates**
User needs dashboard → sees DEFAULT (recommended) + 2 VARIANTS (for different scenarios)
All 3 are complete, tested, wired to APIs.
User just picks one and duplicates it.

### How to Practice Principle 8

**In Daily Work:**

**Scenario 1: Building a new component**
- ❌ WRONG: "I'll design the perfect button"
- ✅ RIGHT: "I'll design 3 button styles (filled, outlined, text) → test all 3 → default to filled → offer outlined/text as variants"

**Scenario 2: Solving a layout problem**
- ❌ WRONG: "This dashboard needs one perfect layout"
- ✅ RIGHT: "This dashboard could use 3 layouts. Let me test all 3. Vertical wins. Offer horizontal + card as variants."

**Scenario 3: Designing a form**
- ❌ WRONG: "What's the best way to do this form?"
- ✅ RIGHT: "Here are 3 ways to structure this form. Let me evaluate all 3. Modal form wins. Offer inline + page variants."

### Benefits

- **Speed:** User doesn't start from scratch. They pick a variant.
- **Verification:** All options tested before release. No "hope this works."
- **Flexibility:** System offers multiple approaches. Users pick best fit.
- **Scalability:** Add 10th variant by copying code + changing CSS (not rebuilding wiring).
- **Knowledge:** Every variant documented, tested, ready. Knowledge compounds.

### Enforcement

**Before shipping component:**
- [ ] 3 options generated?
- [ ] All 3 evaluated objectively?
- [ ] Winner identified with scores?
- [ ] Winner refined to production quality?
- [ ] 2 variants coded and tested?
- [ ] All 3 have identical data layer + wiring?
- [ ] Switching variants = single prop change?

**If fails:** Component incomplete. Revise.

### Related Documents

- **CDS-OPTIONS-LIBRARY-FRAMEWORK.md** — Complete 5-phase process
- **CDS-OPTIONS-LIBRARY-TEMPLATE.md** — Documentation template for each entry

---

## PRINCIPLE 9: DEFINE WITH CONTEXT + EXAMPLES

**Core Idea:**
When defining anything (contrast ratio, button size, spacing, color, interaction), provide complete context + 2 good examples + 2 bad examples with measurements.

**The Shift:**
- ❌ OLD: "Text should have good contrast"
- ✅ NEW: "Text contrast minimum 7:1. Good example: 10:1 ratio (readable, accessible). Bad example: 3:1 ratio (fails accessibility)."

### Why This Matters

**Problem with Vague Definitions:**
- "Text should have good contrast" → What's good? 4:1? 7:1? 10:1?
- "Use adequate spacing" → 8px? 12px? 20px?
- "Buttons should be visible" → How visible? What size?
- Different people interpret differently → inconsistency results

**Solution with Context + Examples:**
- Define the rule (clear, measurable)
- Explain context (when/where/why)
- Show GOOD example with measurements
- Show another GOOD example (different context)
- Show BAD example with measurements
- Show another BAD example (different context)
- Result: No guessing. Implementation matches intent.

### The Template

When defining something, use this structure:

```markdown
### Definition
[What is it? One sentence. Measurable.]

### Context
[When/where/why? What problem does it solve?]

### GOOD Example 1
[Description + measurements]
Result: ✓ [Why it works]

### GOOD Example 2
[Different context + measurements]
Result: ✓ [Why it works here too]

### BAD Example 1
[Description + measurements]
Result: ✗ [Why it fails]

### BAD Example 2
[Different context + measurements]
Result: ✗ [Why it fails here]

### How to Apply
[Implementation instructions]

### Variations
[Context-dependent adjustments]
```

### Real Example: Contrast Principle

**Definition:**
Text contrast must be minimum 7:1 on primary content, 5.5:1 on secondary.

**Context:**
Low contrast text is impossible to read for people with vision impairment. WCAG AA requires 7:1.

**GOOD Example 1:** Black text on white background
```
Color: #1a1a1a on #ffffff
Contrast: 21:1
Result: ✓ Excellent. Passes WCAG AAA. Easy to read.
```

**GOOD Example 2:** Dark gray text on white
```
Color: #4d4d4d on #ffffff
Contrast: 8:1 (for secondary content)
Result: ✓ Good. Passes WCAG AA. Clearly secondary.
```

**BAD Example 1:** Too-light text
```
Color: #999999 on #ffffff
Contrast: 4.5:1
Result: ✗ Fails. Violates WCAG AA (needs 7:1).
```

**BAD Example 2:** Almost invisible text
```
Color: #f5f5f5 on #ffffff
Contrast: 1.1:1
Result: ✗ Fails completely. Text invisible.
```

### How to Practice Principle 9

**Scenario 1: Defining spacing**
- ❌ WRONG: "Use consistent spacing throughout"
- ✅ RIGHT: "Use 8px, 12px, 16px, 20px grid. Good example: buttons with 12px gap (comfortable, readable). Bad example: buttons 4px apart (cramped, mushed)."

**Scenario 2: Defining color**
- ❌ WRONG: "Action buttons should be green"
- ✅ RIGHT: "Action buttons #50c878. Good example: action button in form (clear intent). Bad example: #ffffff (invisible on white background)."

**Scenario 3: Defining typography**
- ❌ WRONG: "Use clear fonts"
- ✅ RIGHT: "Body text: 14px, normal weight. Good example: 14px body on white (readable). Bad example: 8px body (unreadable, violates accessibility)."

### Benefits

- **Clarity:** No ambiguity. Implementer knows exactly what's needed.
- **Consistency:** Everyone interprets same way. No drift.
- **Testability:** Can measure if definition met.
- **Onboarding:** New team members understand immediately.
- **Auditing:** Reviewers can objectively check compliance.

### Enforcement

**Before finalizing ANY definition:**
- [ ] Definition is clear and measurable?
- [ ] Context explains why this matters?
- [ ] GOOD Example 1 with measurements?
- [ ] GOOD Example 2 (different context)?
- [ ] BAD Example 1 with measurements?
- [ ] BAD Example 2 (different context)?
- [ ] Implementation instructions clear?
- [ ] Variations documented?

**If any incomplete:** Definition needs revision.

### Related Documents

- **CDS-DEFINITION-WITH-EXAMPLES-PRINCIPLE.md** — Complete principle with templates

---

## PRINCIPLE 10: PROACTIVE EDGE DETECTION

**Core Idea:**
System knows its scope boundaries. When exceeding scope, system proactively notifies admin/users instead of failing silently.

**The Shift:**
- ❌ OLD: "System works for small datasets. Breaks with large data. User discovers when it breaks."
- ✅ NEW: "System knows: 'I handle up to 500 rows optimally.' Detects 1200 rows coming. Notifies admin immediately. Suggests remedy."

### Why This Matters

**Problem with Silent Failure:**
- User loads dashboard with 1200 rows
- System silently degrades (nothing shows error message)
- User thinks it's broken
- Admin doesn't know there's a problem
- Issue discovered by complaint, not proactively

**Solution with Edge Detection:**
- Define scope upfront: "Dashboard handles up to 500 rows"
- Monitor during operation: "1200 rows incoming"
- Detect edge case: "Exceeds scope"
- Notify immediately: Admin notified + user informed
- Suggest remedy: "Implement pagination" or "Use filters"
- Result: Transparent, managed, proactive

### The Process

**Phase 1: Define Scope**

For each component:
- **CAN DO:** What it handles optimally
- **CANNOT DO:** What's out of scope
- **DETECTS BUT CANNOT HANDLE:** What it monitors but can't fix

**Example:** Dashboard Component
```
CAN DO:
- Display up to 500 rows
- Up to 10 columns
- All columns sortable
- Basic filtering
- CSV export
- Mobile/tablet/desktop

CANNOT DO:
- Real-time updates (need WebSocket)
- Advanced filtering (nested AND/OR)
- Custom columns (schema-locked)
- 3000+ row pagination (browser limits)

DETECTS BUT CANNOT HANDLE:
- Row count > 500 (performance degrades)
- Column count > 10 (layout breaks)
- API latency > 3s (user sees spinner)
```

**Phase 2: Monitor + Detect**

During operation, check if any thresholds exceeded:
```javascript
if (rowCount > 500) {
  // Detect: exceeding scope
  // Trigger: notification
}
```

**Phase 3: Notify Proactively**

Send notifications to:
1. **System:** Log for monitoring
2. **Admin:** "Dashboard got 1200 rows. Plan pagination."
3. **User:** "Large dataset. Performance may be affected."

**Phase 4: Suggest Remedy**

Don't just notify problem. Suggest solution:
- "Implement pagination to limit visible rows"
- "Add filtering to reduce dataset size"
- "Create custom variant for large data"

### How to Practice Principle 10

**Scenario 1: Design limitation discovered**
- ❌ WRONG: "Form supports up to 20 fields. If more, it breaks. User discovers."
- ✅ RIGHT: "Form designed for ≤20 fields. If you add 25, system detects and notifies admin: 'Form exceeds recommended field count. Suggest: split into wizard.'"

**Scenario 2: Performance boundary reached**
- ❌ WRONG: "Dashboard slows down with 1000 rows. User complains after 10 minutes."
- ✅ RIGHT: "Dashboard optimized for 500 rows. If loading 1000, system notifies: 'Performance may degrade. Recommend: implement pagination.'"

**Scenario 3: API integration limitation**
- ❌ WRONG: "Export fails if file > 10MB. User tries, gets generic error."
- ✅ RIGHT: "Export supports files up to 10MB. If larger file, system notifies: 'Your export would be 25MB. Recommend: split by date range.'"

### Benefits

- **Transparency:** Users/admin know system status (not mysterious breakage)
- **Proactive:** Issues detected before users complain
- **Smart Scaling:** Admin knows when to upgrade/optimize
- **Better UX:** Users informed of limitations and options
- **Data-Driven:** Metrics show what needs improvement

### Enforcement

**Before deploying component:**
- [ ] Scope defined (CAN DO, CANNOT DO, DETECTS)?
- [ ] Limits set for each metric?
- [ ] Monitoring implemented?
- [ ] Detection triggers at thresholds?
- [ ] Notifications send to admin + user?
- [ ] Suggestions/remedies documented?
- [ ] Tested with data at/above limits?
- [ ] Fallback behavior defined?

**If incomplete:** Component not ready.

### Related Documents

- **CDS-PROACTIVE-NOTIFICATION-FRAMEWORK.md** — Complete framework with implementation

---

## HOW ALL 10 PRINCIPLES WORK TOGETHER

**Principle 1-7 (Original):** Foundation of consistency + governance + documentation

**Principle 8 (Options-First):** Build 3 solutions, users pick variant
- Prevents "perfect once" trap
- Scales infinitely (add variant = 5 lines code)

**Principle 9 (Define with Context + Examples):** Every definition clear, unambiguous
- Used when documenting each of the 3 options
- Used when documenting variants
- Used when defining scope for Principle 10

**Principle 10 (Proactive Detection):** System tells you when it's operating outside design parameters
- Knows boundaries (defined in Principle 9)
- Notifies proactively
- Suggests using other variant (from Principle 8)

### Example Flow

1. **Build 3 dashboard layouts** (Principle 8)
   - Horizontal, Vertical, Card

2. **Define each with context + examples** (Principle 9)
   - Vertical: "For mobile-first. Good example: [screenshot]. Bad example: [broken layout]"
   - Horizontal: "For wide data. Good example: [screenshot]. Bad example: [squished columns]"
   - Card: "For flexible. Good example: [screenshot]. Bad example: [overflowing cards]"

3. **Define scope** (Principle 10)
   - Vertical: "Handles up to 500 rows, up to 1200px height, responsive"
   - Horizontal: "Handles up to 500 rows, needs 1600px width minimum"
   - Card: "Handles up to 1000 items, flexible height/width"

4. **Deploy with monitoring** (Principle 10)
   - Detect if Vertical layout receives 1200 rows (exceeds scope)
   - Notify admin: "Dashboard has too many rows for Vertical layout. Suggest: use Card layout or implement pagination."
   - User sees: "Large dataset. Try using Card layout or filters."

5. **Result:**
   - System transparent about capabilities
   - Admin knows when to scale/optimize
   - Users can pick layout that fits their data
   - No silent failures, no mysteries

---

## APPLYING TO YOUR PROJECT

### Step 1: Catalog Existing Components
List all major components (Dashboard, Forms, Tables, Buttons, etc.)

### Step 2: Apply Principle 8 (Options-First)
For each component, create 3 options:
- Evaluate all 3
- Choose winner
- Offer 2 variants

### Step 3: Apply Principle 9 (Define with Context)
Document each component + variant with:
- Clear definition
- 2 GOOD examples with measurements
- 2 BAD examples with measurements

### Step 4: Apply Principle 10 (Proactive Detection)
Define scope for each component:
- CAN DO (optimal range)
- CANNOT DO (out of scope)
- DETECTS BUT CANNOT HANDLE (with thresholds)

### Step 5: Test + Iterate
- Deploy monitoring
- Collect metrics
- Adjust limits based on real data
- Document learnings
- Repeat

---

## ENFORCEMENT ACROSS ALL PROJECTS

**All projects must:**
- ✓ Apply 10 CDS DNA principles
- ✓ Use 3-option approach (not perfect-once)
- ✓ Define everything with context + examples
- ✓ Monitor scope boundaries + notify proactively
- ✓ Document all decisions + learnings
- ✓ Hardwire governance (mechanical enforcement)

**No exceptions.** These are architectural requirements, not suggestions.

---

## STATUS

- **Version:** 2.0 (extends original 7 principles to 10)
- **Effective:** 2026-07-06
- **Scope:** All CDS projects and components
- **Owner:** CDS Governance
- **Review Frequency:** Quarterly

---

## RELATED DOCUMENTS

**Foundation:**
- CDS-DNA-PRACTICE-FRAMEWORK.md (original 7 principles)

**Implementation:**
- CDS-OPTIONS-LIBRARY-FRAMEWORK.md (Principle 8 deep dive)
- CDS-DEFINITION-WITH-EXAMPLES-PRINCIPLE.md (Principle 9 deep dive)
- CDS-PROACTIVE-NOTIFICATION-FRAMEWORK.md (Principle 10 deep dive)

**Reference:**
- ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (example of principles applied)
- CDS-OPTIONS-LIBRARY-TEMPLATE.md (documentation template)

---

**The 10 Principles form complete CDS governance.**
**Together: Architecture + Consistency + Knowledge + Transparency = Scalable, Maintainable, User-Friendly Systems**

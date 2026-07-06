---
title: "Hardcoding vs AI Flexibility Framework"
date: 2026-07-06
status: OPERATIONAL_GOVERNANCE
version: 1.0
---

# HARDCODING VS AI FLEXIBILITY

**Question:** How do we create draft guidelines defining the boundary between hardcoded constraints and where AI has freedom to optimize?

**Answer:** Define 3 zones: LOCKED (no flexibility), GUIDED (constraints with optimization space), OPEN (full flexibility). Give AI clear ranges to work within.

---

## THE PROBLEM

**Current AI Design Tendency:**
- Too loose: "Do whatever you think is best" → inconsistency, drift
- Too rigid: "Follow this spec exactly" → no room for improvement, brittleness

**CDS Solution:**
- Define what CANNOT change (LOCKED)
- Define what CAN change with constraints (GUIDED)
- Define what CAN be creative (OPEN)
- Make these rules explicit so AI knows exactly where its boundaries are

---

## THREE ZONES

### ZONE 1: LOCKED (Hardcoded, Zero Flexibility)

**What:** Rules that cannot be violated under any circumstances.

**Examples:**

| Locked Rule | Why | Consequence |
|-------------|-----|-------------|
| Button heights are 40px (all buttons) | Consistency across UI | Reject PRs that deviate. Block shipping. |
| Primary text color is #1a1a1a | Accessibility (7:1 contrast) | No custom colors. Linter flags deviations. |
| Spacing grid: 8, 12, 16, 20, 30px only | Consistency, prevents random gaps | Linter rejects arbitrary px values |
| Form labels REQUIRED on all inputs | Accessibility, usability | Cannot merge without labels |
| Every field with metric must have (?) tooltip | Transparency, accessibility | Cannot ship without tooltip |
| Admin has full edit capability | Governance, authority | Hardwired in code, non-negotiable |
| All goals immutable in decision-log | Audit trail, compliance | Cannot modify after creation |
| Schema alignment mandatory | Prevents drift, orphans | Every term must map to schema |

**How to Identify LOCKED Rules:**
- Will this break if it changes?
- Is this required for compliance/security?
- Is this foundational to architecture?
- Would violating this cause drift?
- → If YES to any, it's LOCKED

**Enforcement:**
- Code-level: Enums, constants, linters, compile-time checks
- Process-level: Pre-commit hooks, CI/CD gates, mandatory code review
- Human-level: Checklist before shipping, Yariv sign-off for exceptions
- Cannot be overridden without explicit Yariv waiver + logging

**Example LOCKED Rule (Button Heights):**
```
RULE: All buttons MUST be 40px tall
WHY: Consistency across UI, accessibility (touch targets), visual predictability
ENFORCEMENT:
  - CSS: const $button-height-md = 40px; (no override allowed)
  - Linter: Flag any button with height != 40px
  - Review: PR rejected if custom button height found
  - Exception: Yariv approval + logged (rare)
APPLIES TO: All buttons in all pages (Goal Wizard, Dashboard, Bundle Config, etc.)
```

---

### ZONE 2: GUIDED (Constraints + Optimization Space)

**What:** Rules with clear boundaries. AI can optimize within the zone, but cannot go outside boundaries.

**Examples:**

| Guided Rule | Lower Bound | Upper Bound | Optimization Space | Example |
|-------------|------------|------------|-------------------|---------|
| Input field padding | 8px | 16px | 4px range | Use 12px by default, 10px for compact form |
| Section title font size | 16px | 20px | 4px range | Use 18px standard, 16px if space-constrained |
| Container max-width | 1200px | 1400px | 200px range | Use 1300px for wider screens |
| Button border radius | 2px | 8px | 6px range | Use 4px standard, 6px for softer feel |
| Icon size | 16px | 24px | 8px range | Use 20px standard, 16px if tight space |
| Color saturation | 80% | 100% | 20% range | Use 90% standard for professional look |
| Line height (body text) | 1.5 | 1.8 | 0.3 range | Use 1.6 by default, 1.5 if space-constrained |
| Focus border width | 1px | 3px | 2px range | Use 2px for visibility without bulk |

**How to Identify GUIDED Rules:**
- Is there a "normal" value?
- Are there valid reasons to deviate?
- Can deviation improve specific use case?
- Does deviation stay within acceptable range?
- → If YES to all, it's GUIDED

**Enforcement:**
- Default: Always use lower/upper bound average (e.g., 12px for 8-16px range)
- Deviation: Allowed if:
  - Documented reason ("compact mobile version needs 10px")
  - Still within range ("10px is within 8-16px zone")
  - Logged in PR ("used 10px for mobile, 12px for desktop")
  - Consistent ("all mobile inputs use 10px, not random")
- If AI deviates outside range: Flag as error, requires human review

**Example GUIDED Rule (Input Padding):**
```
RULE: Input field padding MUST be 8-16px
DEFAULT: 12px (middle of range)
WHY: Readability + touch target (min 8px), no excessive whitespace (max 16px)
OPTIMIZATION SPACE:
  - Use 10px on mobile (space-constrained)
  - Use 14px on large forms (readability emphasis)
  - Use 8px in compact inline edits
  - Use 16px in high-touch areas (important fields)
BOUNDARIES:
  - Cannot go below 8px (touch target violated)
  - Cannot go above 16px (excessive whitespace)
ENFORCEMENT:
  - Linter: Accepts 8-16px only
  - Default: 12px used unless explicitly set
  - Review: PR comment if deviated from default, ask why
APPLIES TO: All input fields
```

**AI Instruction for GUIDED Rules:**
"When designing input field padding:
1. Default to 12px (middle of 8-16px range)
2. If space-constrained (mobile), use 10px
3. If high-touch area (critical input), use 14px
4. Stay within 8-16px range (never go outside)
5. Document your choice if not default
6. Consistency within context (all mobile inputs use same padding)"

---

### ZONE 3: OPEN (Full Flexibility)

**What:** Areas where AI has full creative freedom. No constraints except "fits context."

**Examples:**

| Open Area | Why | AI Freedom |
|-----------|-----|-----------|
| Exact wording of tooltips | Different metrics need different explanations | Write tooltip that fits context |
| Column order in tables | Different contexts benefit from different order | Arrange columns logically for use case |
| Specific examples in placeholders | Different fields have different meaningful examples | Create relevant example for context |
| Section organization | Information can be grouped multiple ways | Group logically for user flow |
| Icon choice (within existing library) | Multiple icons can represent same concept | Pick icon that best represents idea |
| Color brightness variation | Within palette, some variation acceptable | Use darker/lighter shade that fits mood |
| Specific copy in labels | As long as label is clear, exact wording varies | Write clear, concise label |

**How to Identify OPEN Areas:**
- Is there a "wrong" answer?
- Can AI improve on generic option?
- Does deviation affect consistency?
- → If NO, it's OPEN

**Enforcement:**
- Default: AI makes best judgment call
- No linter check needed
- Minimal review (spot-check, not every instance)
- Human can override if context matters

**Example OPEN Area (Tooltip Wording):**
```
RULE: Every field with metric MUST have (?) tooltip
HARDCODED: Icon style, position, trigger (hover)
OPEN: Exact tooltip text

WHY OPEN: Different metrics need different explanations
- "Capacity" tooltip: "Current active goals / Maximum concurrent goals"
- "Efficiency" tooltip: "Token efficiency ratio (0-1 scale, higher is better)"
- "Load" tooltip: "Number of active goals currently assigned"
Each explains concept in its own context.

AI FREEDOM:
- Explain metric in 1-2 sentences
- Use terminology appropriate for audience
- Include units/scale if applicable
- Don't be generic ("This is a metric")
- Be specific ("This shows X in terms of Y")

ENFORCEMENT:
- Spot-check first 10% of tooltips
- If quality good, trust AI for rest
- Human can edit any tooltip that's unclear
- No linter enforcement
```

**AI Instruction for OPEN Areas:**
"In OPEN zones, make your best judgment. Context matters more than rules. Examples:
- Tooltip for 'API Response Time': Explain what it measures and why it matters
- Column order in dashboard: Put most important metrics first
- Icon choice: Pick icon that users will intuitively understand"

---

## FRAMEWORK: How to Define Zone for Any Rule

**Question Tree:**

```
Q1: Will breaking this rule cause data loss / security issue / compliance violation?
    → YES: ZONE 1 (LOCKED)
    → NO: Continue to Q2

Q2: Is there a "standard" value, but legitimate variations exist?
    → YES: ZONE 2 (GUIDED) — define range
    → NO: Continue to Q3

Q3: Is AI better positioned than humans to make this decision?
    → YES: ZONE 3 (OPEN)
    → NO: ZONE 1 (LOCKED) — remove AI judgment, codify decision

Q4: Can this be automated (linter, CSS constant, enum)?
    → YES: Automate it (enforcement is free)
    → NO: Document clearly (enforcement requires human review)
```

**Example Classification:**

```
Rule: "Buttons should be green"
Q1: Security issue? NO
Q2: Legitimate variation? Maybe (different button types)
→ ZONE 2 (GUIDED): Primary buttons are #50c878 (green), secondary buttons are gray, delete buttons are red. Range: all colors from palette.

Rule: "Text must be readable"
Q1: Accessibility issue? YES
→ ZONE 1 (LOCKED): All text >= 7:1 contrast. No exceptions (except Yariv waiver).

Rule: "Tooltips explain what field means"
Q1: Compliance issue? NO
Q2: Standard tooltip? Yes, but content varies by field
→ ZONE 2 (GUIDED): Tooltip must be 1-2 sentences. No generic text.
    Actually: Icon + text required (LOCKED), exact wording varies (OPEN)
→ Hybrid: LOCKED (structure) + OPEN (wording)

Rule: "Icons are recognizable"
Q1: Security issue? NO
Q2: Standard icon? No, varies by context
Q3: AI better positioned? YES (AI can understand context)
→ ZONE 3 (OPEN): Pick icon that users will intuitively recognize for context.
```

---

## EXAMPLE: Defining Zones for ETSC Button Component

**Requirement:** Build button component that's flexible but consistent.

**Analysis:**

| Aspect | Question | Zone | Rule |
|--------|----------|------|------|
| Height | Can buttons vary in height? | LOCKED | All buttons 40px (accessibility) |
| Color | Can buttons use different colors? | ZONE 2 (GUIDED) | Must be from palette (green, red, blue) |
| Border radius | Can corner softness vary? | ZONE 2 (GUIDED) | 2-8px range (4px default) |
| Icon + text | Must buttons have both? | ZONE 1 (LOCKED) | Yes, or one if iconic (accessibility) |
| Exact label text | Can label vary? | ZONE 3 (OPEN) | Yes, use clear action verb (Create, Delete, etc.) |
| Loading state | Must button show loading? | ZONE 2 (GUIDED) | Yes, via spinner or "..." |
| Hover effect | Can hover effect differ? | ZONE 2 (GUIDED) | Must be visually distinct (darker/underline) |
| Disabled appearance | Can disabled look different? | ZONE 1 (LOCKED) | Yes, but must be obviously disabled (#ccc) |

**Result:**

```
BUTTON COMPONENT SPEC

ZONE 1 (LOCKED):
  ✓ Height: 40px (non-negotiable)
  ✓ Icon + text (or single if iconic)
  ✓ Disabled appearance: #ccc (must look disabled)

ZONE 2 (GUIDED):
  ✓ Color: Must be from palette (green, red, blue)
    Range: Use primary green (#50c878) for action, red (#ff6b6b) for delete
  ✓ Border radius: 2-8px (default 4px)
  ✓ Hover state: Must be visually distinct (darker shade or underline)
  ✓ Loading: Show spinner or "..." (exact implementation flexible)

ZONE 3 (OPEN):
  ✓ Label text: Use clear action verb (Create, Delete, Export, Save, etc.)
  ✓ Icon choice: Pick icon matching action (user gets intuitive meaning)

RESULT: Button is consistent (height, color palette, hover) but flexible (exact wording, icon choice).
```

---

## INSTRUCTIONS FOR AI

**When Given Task, AI Should:**

1. **Identify Zone for Each Aspect:**
   - "Button heights? LOCKED (40px). Button color? ZONE 2 (palette only). Label text? ZONE 3 (AI chooses)."

2. **Respect LOCKED Zones:**
   - Never deviate from LOCKED rules.
   - If impossible, flag to human: "Cannot complete task without violating LOCKED rule X."

3. **Optimize Within GUIDED Zones:**
   - Use defaults (e.g., 12px padding in 8-16px range).
   - Deviate only with clear reason: "Using 10px on mobile (space-constrained)."
   - Document deviation in code comment.

4. **Create in OPEN Zones:**
   - Make best judgment call.
   - Explain reasoning in comment: "Chose 'Export All' label because it's clearer than 'Download'."
   - Consistent with context (all similar buttons labeled similarly).

5. **Ask for Clarification:**
   - If zone not clear: "Is button size LOCKED at 40px or GUIDED with range 36-44px?"
   - If rule contradicts another: Flag to human: "Rule A says no custom colors, but Rule B requires orange button. Which wins?"

---

## ENFORCEMENT CHECKLIST

**For Every Feature, Ask:**

- [ ] Did I identify ZONE 1, 2, 3 for each aspect?
- [ ] Did I hardcode ZONE 1 rules (no way to violate)?
- [ ] Did I document ZONE 2 ranges (with examples)?
- [ ] Did I give ZONE 3 clear context for optimization?
- [ ] Is the boundary between zones clear?
- [ ] Can AI understand where flexibility ends?
- [ ] Did I test edge cases (extreme cases still valid)?

---

## EXAMPLE: Goal Wizard Hardcoding vs Flexibility

**Requirement:** Build 6-step Goal Definition Wizard that's consistent but accommodates different content.

**Zone Mapping:**

```
ZONE 1 (LOCKED):
  ✓ 6 steps (always)
  ✓ Step indicator visible (always)
  ✓ Back/Next buttons present (always)
  ✓ Form labels required (always)
  ✓ Tooltips on all fields (always)
  ✓ Step 1 input + Step 6 review required (always)
  ✓ Immutable entry in decision-log after Step 6 (always)

ZONE 2 (GUIDED):
  ✓ Button heights: 40px (standard), 32px (compact) — range 32-40px
  ✓ Form field padding: 12px default, 10px if mobile, 14px if emphasis
  ✓ Section spacing: 20-40px (depends on visual weight)
  ✓ Text field width: 100% (default), narrower if split-column layout

ZONE 3 (OPEN):
  ✓ Exact wording of step titles
  ✓ Exact wording of help text
  ✓ Number of fields per step (as long as logical)
  ✓ Icon choice (representative of step purpose)
  ✓ Order of fields (logical for user flow)

RESULT:
  - Wizard is always recognizable (ZONE 1 makes it "wizard")
  - Layout flexible for different content sizes (ZONE 2 allows adaptation)
  - Wording and flow can be optimized per context (ZONE 3 enables creativity)
```

---

## WHY THIS MATTERS

**Without Zones:**
- AI either too constrained (can't optimize) or too loose (drifts)
- Humans override AI constantly (no trust)
- Rules interpreted differently each time

**With Zones:**
- AI knows exactly where it has freedom
- Humans trust AI in OPEN zones, supervise GUIDED, enforce LOCKED
- Rules consistently applied (because AI understands them)
- Efficiency: Less time on reviews, more time on creation

---

**Status:** Ready to apply to all AI interactions  
**Audience:** CDS team, AI agents, external developers  
**Update Frequency:** As new features added (maintain zone mapping for all features)

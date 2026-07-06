---
title: "CDS Options-First, Template-Based Framework"
date: 2026-07-06
status: GOVERNANCE
version: 1.0
---

# OPTIONS-FIRST, TEMPLATE-BASED FRAMEWORK

**Core Paradigm Shift:**
- ❌ OLD: "Let's create one good thing each time"
- ✅ NEW: "Let's create 3 options → refine → seal → offer as default + 2 variants"

**Result:** Every user gets tested templates, not starting points. Infinite scalability. No starting-from-scratch.

---

## WHY THIS FRAMEWORK MATTERS

**Problem with "Create One Good Thing":**
- User gets component, but only one way to use it
- Different contexts need different approaches (mobile vs desktop, simple vs complex, fast vs detailed)
- When context changes, user must rebuild from scratch
- Knowledge doesn't compound (each new context = new problem)

**Solution with "3 Options → Seal → Default + 2 Variants":**
- User gets DEFAULT (the tested, verified, recommended way)
- User also gets VARIANT 1 and VARIANT 2 (proven alternatives for different contexts)
- All three versions have identical data layer and wiring
- User just switches a prop (layout="horizontal" → layout="vertical")
- Knowledge compounds (all three options are documented, tested, ready)

**Benefits:**
- Users get templates instead of starting points
- Variants save 80% of build time (no new wiring needed)
- All options are verified (no "hoping this works")
- System scales infinitely (add 10th variant = 5 lines of code)

---

## THE 5-PHASE PROCESS

### PHASE 1: Generate 3 Options

When solving a problem, create 3 different approaches.

**Goal:** Explore the design space before committing to one solution.

**What "3 Options" means:**
- 3 fundamentally different architectures or layouts
- Not variations of same design (that comes in Phase 4)
- Not iterative refinements (that comes in Phase 3)
- 3 distinct approaches that each solve the problem

**Example 1: Dashboard Layout**

Problem: Display participant data on limited screen space
- Option A: Horizontal layout (wide tables, side-by-side sections, desktop-first)
- Option B: Vertical layout (stacked sections, full-width tables, mobile-first)
- Option C: Card-based layout (grouped cards, flexible arrangement, flexible)

**Each Option A/B/C is a COMPLETE system:**
- Has its own layout structure
- Has its own interaction model
- Has its own spacing approach
- But: All connect to same data, same APIs, same database

**Example 2: Form Configuration**

Problem: How should admin define custom fields?
- Option A: Inline editor (edit fields right in table, save immediately)
- Option B: Modal form (click "Configure", modal appears, submit when done)
- Option C: Dedicated config page (separate page for configuration, auto-save)

**Each is complete:**
- Different UX model
- Different validation approach
- Different save strategy
- But: All edit same data, same schema, same database

**Example 3: Button Styling**

Problem: Design buttons for primary actions
- Option A: Filled buttons (solid color, high contrast, maximum visibility)
- Option B: Outlined buttons (border only, lighter appearance, good secondary)
- Option C: Text buttons (text only, minimal appearance, tertiary/help actions)

**Each is complete:**
- Different visual treatment
- Different emphasis/hierarchy
- Different interaction feedback
- But: All trigger same actions, same events, same code

---

### PHASE 2: Evaluate 3 Options

Test each option against objective criteria.

**Evaluation Criteria:**

| Criterion | Meaning | Scale |
|-----------|---------|-------|
| **Accessibility** | Can all users interact with it? (vision, motor, cognitive) | 1-5 |
| **Readability** | Is information clear and scannable? | 1-5 |
| **Consistency** | Does it match system patterns? | 1-5 |
| **Performance** | Does it load fast, render smoothly? | 1-5 |
| **Scalability** | Works with 1 item? 100 items? 1000 items? | 1-5 |
| **Maintainability** | Can developers understand and modify it? | 1-5 |

**Process:**

1. Score Option A on all 6 criteria (1-5 each)
2. Score Option B on all 6 criteria (1-5 each)
3. Score Option C on all 6 criteria (1-5 each)
4. Calculate total score for each option
5. Identify winner (usually highest total)
6. Identify trade-offs (what does winner sacrifice?)

**Example: Dashboard Layout Evaluation**

```
Criteria                    Option A (Horiz)  Option B (Vert)  Option C (Card)
────────────────────────────────────────────────────────────────────────────
Accessibility               4/5               5/5             4/5
Readability (wide data)     5/5               3/5             4/5
Consistency (ETSC pattern)  4/5               4/5             5/5
Performance (100 rows)      4/5               5/5             3/5
Scalability (1000 rows)     3/5               3/5             2/5
Maintainability             4/5               5/5             3/5
────────────────────────────────────────────────────────────────────────────
TOTAL                       24/30             25/30           21/30

WINNER: Option B (Vertical Layout) - 25/30
TRADE-OFF: Horizontal layout better for wide data, but vertical wins on accessibility + maintainability
RUNNER-UP: Option A (Horizontal) - 24/30, good for wide desktop screens
THIRD: Option C (Card) - 21/30, interesting but lower scalability
```

---

### PHASE 3: Refine Top Option

Identify winner. Now refine it to production quality.

**Refinement checklist:**

- [ ] Apply all design tokens (colors, spacing, typography, sizing)
- [ ] Add accessibility features (ARIA labels, keyboard nav, focus states)
- [ ] Handle edge cases (empty state, loading state, error state)
- [ ] Add variants for different screens (mobile, tablet, desktop)
- [ ] Test thoroughly (accessibility scan, responsive test, performance test)
- [ ] Document thoroughly (code comments, API docs, usage guide)
- [ ] Get feedback (design review, accessibility review, code review)

**Refinement example: Vertical Dashboard Layout**

Starting point: Basic vertical layout (from Phase 2 evaluation)

After refinement:
- ✓ Colors match design tokens (#1a1a1a text, #50c878 buttons, etc.)
- ✓ Spacing uses token grid (8px, 12px, 16px, 20px, only)
- ✓ Typography matches system (24px h1, 18px h2, 14px body, etc.)
- ✓ Empty state shows "No participants" message
- ✓ Loading state shows spinner
- ✓ Error state shows error message + retry button
- ✓ Mobile (480px): Single column, full-width
- ✓ Tablet (768px): Two-column grid (if applicable)
- ✓ Desktop (1200px): Full-width, optimized spacing
- ✓ Keyboard nav: Tab through all elements, Escape closes modals
- ✓ Screen reader: All labels present, ARIA attributes correct
- ✓ Performance: Renders 500 rows in < 1 second

---

### PHASE 4: Seal + Offer as Default + 2 Variants

Lock the winning option as DEFAULT. Offer 2 variants from runners-up or other refinements.

**Result = Library Entry:**

```
┌─────────────────────────────────────────────────────────────────┐
│ DASHBOARD LAYOUT                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ DEFAULT: Vertical Layout                                        │
│ ├─ Code: [React component, fully functional]                   │
│ ├─ Wiring: [API integration, data fetching]                    │
│ ├─ Interconnections: [how it links to filters, exports, etc.] │
│ ├─ States: [empty, loading, error, success]                   │
│ ├─ Responsive: [mobile 480px, tablet 768px, desktop 1200px]  │
│ ├─ Accessibility: [WCAG AA compliant]                         │
│ ├─ Performance: [500 rows in <1s]                             │
│ └─ Usage: "Use as default. Works everywhere."                 │
│                                                                 │
│ VARIANT 1: Horizontal Layout                                   │
│ ├─ Code: [React component, same data layer]                   │
│ ├─ Differs from default: [wider columns, side-by-side]       │
│ ├─ When to use: "On desktop (1200px+) with wide tables"      │
│ ├─ How to switch: [layout="horizontal" prop]                 │
│ └─ Differences isolated: [layout CSS only, no data changes]   │
│                                                                 │
│ VARIANT 2: Card-Based Layout                                   │
│ ├─ Code: [React component, same data layer]                   │
│ ├─ Differs from default: [card-based grid, grouped]          │
│ ├─ When to use: "For flexible, space-constrained layouts"    │
│ ├─ How to switch: [layout="card" prop]                       │
│ └─ Differences isolated: [layout CSS only, no data changes]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

HARDCODED GUARANTEES:
✓ All 3 versions fetch same data (identical API calls)
✓ All 3 versions store changes same way (identical database updates)
✓ All 3 versions send same events (identical event payloads)
✓ Switching layouts = one prop change (layout="vertical" | "horizontal" | "card")
✓ NO code duplication (differences isolated to CSS)
✓ NO duplicate wiring (all share same API layer)
✓ User can switch variants without rebuilding
```

---

### PHASE 5: User Gets Verified Defaults + Variants

When user needs component:

1. **User opens component library** → sees DASHBOARD LAYOUT
2. **Sees DEFAULT recommended** → Vertical Layout (best overall score)
3. **Sees 2 VARIANTS** → Horizontal Layout, Card Layout
4. **User duplicates DEFAULT** (or variant of choice)
5. **All code/wiring complete** → just duplicate and use
6. **No starting from scratch** → just copy/paste + customize data

**Result:**

```javascript
// User wants vertical dashboard (DEFAULT)
<Dashboard layout="vertical" data={participants} />

// User wants horizontal dashboard (VARIANT 1)
<Dashboard layout="horizontal" data={participants} />

// User wants card dashboard (VARIANT 2)
<Dashboard layout="card" data={participants} />

// That's it. All three are fully functional.
// No rebuilding wiring. No duplicating API calls.
// Just change one prop.
```

---

## REAL WORLD EXAMPLE: BUTTONS

### Phase 1: Generate 3 Options

**Problem:** Design buttons for primary actions

- **Option A: Filled Button**
  ```
  Background: #50c878 (green)
  Text: white
  Padding: 12px 16px
  Height: 40px
  Border-radius: 4px
  Hover: darker green
  ```

- **Option B: Outlined Button**
  ```
  Background: transparent
  Border: 2px #50c878
  Text: #50c878
  Padding: 10px 16px
  Height: 40px
  Border-radius: 4px
  Hover: light green background
  ```

- **Option C: Text Button**
  ```
  Background: transparent
  Border: none
  Text: #50c878
  Padding: 8px 16px
  Height: 40px
  Border-radius: 4px
  Hover: text underline
  ```

---

### Phase 2: Evaluate 3 Options

```
Criteria                Option A (Filled)  Option B (Outline)  Option C (Text)
────────────────────────────────────────────────────────────────────────────
Accessibility          5/5                4/5                 3/5
Visibility             5/5                4/5                 2/5
Consistency            5/5                4/5                 3/5
Performance            5/5                5/5                 5/5
Scalability            5/5                5/5                 5/5
Maintainability        5/5                4/5                 4/5
────────────────────────────────────────────────────────────────────────────
TOTAL                  30/30              26/30               22/30

WINNER: Option A (Filled Button) - 30/30
RUNNER-UP: Option B (Outlined) - 26/30, good for secondary
THIRD: Option C (Text) - 22/30, good for subtle actions
```

---

### Phase 3: Refine Top Option

Refined Filled Button:
- ✓ Color matches design token (#50c878 - green)
- ✓ Hover: #45a86d (darker green, 15% darker)
- ✓ Active: #3d8a57 (even darker, 30% darker)
- ✓ Disabled: #ccc (gray), cursor: not-allowed
- ✓ Focus: 2px #0066cc blue border
- ✓ Font: 14px, semibold, white text
- ✓ Padding: 12px horizontal, 8px vertical
- ✓ Height: 40px total
- ✓ Border-radius: 4px
- ✓ Minimum width: 100px (no tiny buttons)
- ✓ Keyboard accessible: Tab + Enter works
- ✓ Screen reader: button label clear
- ✓ Touch target: 44px minimum (mobile)
- ✓ Mobile: Same styling, slightly larger padding

---

### Phase 4: Seal + Offer as Default + 2 Variants

```
BUTTON COMPONENT
├─ DEFAULT: Filled Button
│  ├─ Background: #50c878
│  ├─ Text: white
│  ├─ Usage: All primary actions (Create, Save, Submit)
│  └─ Code: 100% ready
│
├─ VARIANT 1: Outlined Button
│  ├─ Border: 2px #50c878
│  ├─ Usage: Secondary actions (Cancel, Export, Copy)
│  └─ Code: 100% ready
│
└─ VARIANT 2: Text Button
   ├─ Text color: #50c878
   ├─ Usage: Tertiary, subtle actions (Help, Link, Learn More)
   └─ Code: 100% ready
```

---

### Phase 5: User Gets Verified Templates

```javascript
// Primary action (DEFAULT)
<Button type="primary">Create Goal</Button>

// Secondary action (VARIANT 1)
<Button type="secondary">Cancel</Button>

// Tertiary action (VARIANT 2)
<Button type="tertiary">Learn More</Button>

// All three work. All accessible. All consistent.
// User just picks the variant. Done.
```

---

## APPLYING THIS FRAMEWORK ACROSS CDS

This framework applies to EVERYTHING:

### Dashboard Layouts
- Option A: Horizontal (wide tables)
- Option B: Vertical (stacked sections)
- Option C: Card (flexible grid)
→ DEFAULT: Vertical, VARIANTS: Horizontal, Card

### Form Input Styles
- Option A: Outlined (border around input)
- Option B: Filled (background color)
- Option C: Underlined (underline only)
→ DEFAULT: Outlined, VARIANTS: Filled, Underlined

### Modal Sizes
- Option A: Small (400px)
- Option B: Medium (600px)
- Option C: Large (900px)
→ DEFAULT: Medium, VARIANTS: Small, Large

### Table Configurations
- Option A: Compact (smaller padding, smaller font)
- Option B: Normal (standard padding/font)
- Option C: Spacious (larger padding, larger font)
→ DEFAULT: Normal, VARIANTS: Compact, Spacious

### Export Formats
- Option A: CSV (default)
- Option B: Excel (structured)
- Option C: JSON (programmatic)
→ DEFAULT: CSV, VARIANTS: Excel, JSON

---

## ENFORCEMENT CHECKLIST

Before marking a component ready:

- [ ] 3 options generated and distinct?
- [ ] All 3 evaluated on 6 criteria (accessibility, readability, consistency, performance, scalability, maintainability)?
- [ ] Winner identified with scores documented?
- [ ] Winner refined to production quality?
- [ ] Refined option includes all design tokens, accessibility, edge cases?
- [ ] 2 variants selected from runners-up or other refinements?
- [ ] All 3 versions have identical data layer?
- [ ] All 3 versions have identical API wiring?
- [ ] Switching between variants = single prop change?
- [ ] All code/wiring complete (not "build this later")?
- [ ] All 3 fully tested and documented?
- [ ] Default clearly marked?
- [ ] Variants clearly marked with "When to use"?

**If any item fails:** Component is incomplete. Revise before releasing.

---

## SCALABILITY PROMISE

This framework enables infinite scalability:

**Week 1:** Build DEFAULT + 2 VARIANTS (3 options, full code/wiring)  
**Week 2:** Add VARIANT 3 (new prop value, same data layer, 5 lines of CSS)  
**Week 3:** Add VARIANT 4 (another new prop value, same wiring, 5 lines of CSS)  
**Week 4:** Add VARIANT 5 (another new prop value, same everything, 5 lines of CSS)

**Result:** 5 verified, tested, documented options. User picks favorite. No starting from scratch.

By Week 8, you have 10 variants of same component. Each one complete. Each one copy/paste ready.

---

## STATUS

- **Adoption:** Effective immediately for all new CDS components
- **Retroactive:** Existing components (Dashboard, Forms, Tables) should migrate to 3-option model
- **Enforcement:** No component ships without DEFAULT + 2 VARIANTS
- **Owner:** CDS Architecture
- **Update Frequency:** As new components emerge

---

**See also:**
- CDS-DEFINITION-WITH-EXAMPLES-PRINCIPLE.md (complementary: define each variant with 2 good + 2 bad examples)
- CDS-OPTIONS-LIBRARY-TEMPLATE.md (documentation template for library entries)
- ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (examples of components that could use this framework)

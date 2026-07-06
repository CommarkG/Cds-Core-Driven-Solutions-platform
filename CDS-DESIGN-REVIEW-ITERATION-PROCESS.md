---
title: "CDS Design Review & Iteration Process"
date: 2026-07-06
status: FORMAL_PROCESS
authority: Yariv Fink (Governor)
scope: Design approval workflow for all CDS systems
---

# CDS DESIGN REVIEW & ITERATION PROCESS

## PURPOSE

Formalize how enterprise designs move from prototype → feedback → iteration → lock → build.

This process applies to:
- ETSC Goal Definition System (first instance)
- All future CDS features requiring visual design approval

---

## PROCESS OVERVIEW

```
PHASE 1: PROTOTYPE CREATION
  ↓
PHASE 2: DESIGN REVIEW
  ├─ Open prototype in browser
  ├─ Extract feedback into 3 schema categories
  └─ Organize by: UX / UI / Flows & Journeys
  ↓
PHASE 3: FEEDBACK CATEGORIZATION
  ├─ Local fixes (specific to one page/element)
  ├─ Universal points (apply to multiple pages)
  └─ Schema alignment (foundational changes)
  ↓
PHASE 4: ITERATE DESIGN
  ├─ Implement categorized feedback
  ├─ Update prototype
  ├─ Second review (if needed)
  └─ Lock design
  ↓
PHASE 5: BUILD MVP
  Use locked prototype as specification
  ↓
PHASE 6: HARDWIRE
  Mechanical enforcement, immutable gates
```

---

## PHASE 2: DESIGN REVIEW — FEEDBACK EXTRACTION

### Review Steps

1. **Open prototype** in browser
2. **Navigate all pages** (4 screens for ETSC)
3. **Read embedded ANNOTATION comments** (design decision rationale)
4. **Examine visual flow** (data connections, step progression)
5. **Test interactions** (forms, buttons, navigation)

### Feedback Capture Format

For each observation:
- **Page/Element:** Where is this? (e.g., "Goal Wizard, Step 1")
- **Category:** UX / UI / Flows & Journeys
- **Local Fix:** What specifically should change?
- **Universal Point:** Does this apply elsewhere?
- **Schema Alignment:** Does this affect data model?

---

## PHASE 3: FEEDBACK CATEGORIZATION

### Schema: UX (User Experience)

**What:** How users interact, understand, move through system
**Examples:**
- "Capacity field is unclear — need tooltip explaining metric"
- "Step progression is linear — should allow jumping between steps"
- "No add/delete on dashboard — must add"
- "Tool kits missing on all pages"

**Questions to ask:**
- Is the flow intuitive?
- Do users understand what each field means?
- Can users navigate efficiently?
- Are actions discoverable?

---

### Schema: UI (User Interface)

**What:** Visual design, layout, spacing, typography, color
**Examples:**
- "Connection between rows is not visually intuitive"
- "Add drag/drop + small arrows for reordering"
- "Dropdown should allow clicking row number to jump"
- "Groups/sub-groups layout needs hierarchy"

**Questions to ask:**
- Is the layout clear and organized?
- Do visual relationships match data relationships?
- Is spacing consistent?
- Are interactive elements obvious?

---

### Schema: Flows & Journeys

**What:** Data flow, process steps, business logic progression
**Examples:**
- "What comes after the top line of steps? Data flow unclear"
- "Bundle config needs order changes throughout"
- "Participant dashboard needs add/delete operations"
- "Step-to-step progression doesn't show dependencies"

**Questions to ask:**
- Does data flow logically?
- Are all steps necessary?
- Can users accomplish their goal?
- Are missing steps evident?

---

## PHASE 4: ITERATE DESIGN

### For Each Feedback Item

1. **Classify:** UX / UI / Flows
2. **Assess impact:** Local (1 page) vs Universal (all pages)
3. **Implement:** Update prototype HTML
4. **Document:** Add note explaining change
5. **Mark resolved:** Remove feedback item

### Iteration Cycles

- **Round 1:** Initial feedback → implement all items → second review
- **Round 2:** Re-review with changes → identify any new issues → final tweaks
- **Round 3 (if needed):** Polish pass → lock design

### Lock Criteria

- [ ] All feedback items addressed (implemented or explicitly deferred)
- [ ] UX feedback: no unclear fields, all interactions discoverable
- [ ] UI feedback: layout consistent, visual hierarchy clear
- [ ] Flows feedback: data flow explicit, all operations possible
- [ ] All 4 pages reviewed and approved
- [ ] No open questions remain

---

## PHASE 5: BUILD MVP

**Locked prototype = specification.**

React frontend built using locked prototype as spec:
- Same layout structure
- Same field labels + tooltips
- Same data flow
- Same operations (add/delete/edit/reorder)
- Same step progression/navigation

---

## PHASE 6: HARDWIRE

After MVP complete, mechanical enforcement:
- Goal creation immutable in decision-log
- All edits tracked in audit trail
- Prevent bypassing design (required steps, required fields)
- Permission-gated features (capability shutdown)

---

## ARTIFACTS CREATED

- **DESIGN-FEEDBACK-TREE-[SYSTEM].md** — Categorized feedback (UX/UI/Flows)
- **ETSC-PROTOTYPE-INTERACTIVE.html** (updated) — Prototype with feedback implemented
- **DESIGN-LOCK-SIGN-OFF-[SYSTEM].md** — Final approval before MVP build

---

## PROCESS STATUS

**S350 (Current):**
- [ ] Extract feedback into UX/UI/Flows schema
- [ ] Create feedback tree document
- [ ] Implement feedback in prototype (Round 1)
- [ ] Second review
- [ ] Lock design

**S351+:**
- [ ] MVP build (React)
- [ ] Backend APIs
- [ ] Hardwiring

---

**Authority:** Yariv Fink (Governor)  
**Effective:** 2026-07-06  
**Applies to:** All CDS design-approval workflows

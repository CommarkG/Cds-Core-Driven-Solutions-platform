---
title: "ETSC Design Feedback Tree — Round 1"
date: 2026-07-06
session: S350
status: COLLECTED_AWAITING_IMPLEMENTATION
pages_reviewed: 4 (Goal Wizard, Participant Dashboard, Bundle Configuration, Architecture Overview)
---

# ETSC DESIGN FEEDBACK TREE — ROUND 1

Feedback extracted from design review. Organized by schema (UX / UI / Flows & Journeys).

---

## 🎯 UX (User Experience)

### U1: Tooltips/Tool Kits Missing Across All Pages
**Pages Affected:** All 4 pages
**Specific Examples:**
- Participant Dashboard: "Capacity" field — unclear what metric means
- All dashboards: Field titles lack explanation
- Brown indicators in screenshots show where tooltips needed

**Action:** Add inline tooltips (hover or icon ?) for all metrics/fields
- Capacity: "Current active goals / Maximum concurrent goals"
- Efficiency: "Token efficiency ratio (0-1 scale)"
- Load: "Number of active goals currently assigned"
- Status: "Participant availability status"
- etc.

**Scope:** Universal — all 4 pages
**Effort:** Low (add `<span title="...">` or icon-based tooltips)
**Type:** UX

---

### U2: Add/Delete Operations Missing on Dashboards
**Pages Affected:** Participant Dashboard, Bundle Configuration
**Issue:** Dashboards show lists but no way to add new participants or bundles

**Action:**
- **Participant Dashboard:** Add "+ Add Participant" button above table
- **Bundle Configuration:** Add "+ Create New Bundle" button above table
- Both should also have delete capability (already shown as "Delete" buttons)

**Scope:** Local (dashboards only)
**Effort:** Low
**Type:** UX

---

### U3: Step Navigation Not Clear
**Pages Affected:** Goal Wizard (Step 1-6)
**Issue:** Users don't know if they can jump between steps or must go sequentially

**Action:** Add explicit navigation affordance
- Show option to "Jump to Step X" (dropdown or numbered buttons)
- OR allow clicking previous steps to edit
- Clarify: "You can return to any previous step to edit"

**Scope:** Local (Goal Wizard)
**Effort:** Medium
**Type:** UX

---

### U4: Reordering Capability Unclear
**Pages Affected:** Bundle Configuration, Participant Dashboard
**Issue:** Users won't know they can change order of items or steps

**Action:** Add visual affordances for reordering
- Drag handles (≡ icon) on left of each row
- Small arrows (↑↓) for move up/down
- OR dropdown with "Jump to position X"
- Explain in help text: "Drag to reorder, or use dropdown to jump to position"

**Scope:** Universal — apply wherever items are orderable
**Effort:** Medium
**Type:** UX

---

---

## 🎨 UI (User Interface)

### I1: Data Flow Connection Between Rows Not Intuitive
**Pages Affected:** Goal Wizard, Architecture Overview
**Issue:** Visual connection between top line of steps and what comes next is unclear

**Example:** Goal Wizard shows:
```
Admin enters draft → AI refines core → Core locked → Scope presented
    ↓
Bundle recommendation → Admin confirms → Goal created in decision-log → Immutable audit trail
```

**Action:** Make data flow visual connection explicit
- Use arrows (→) to show progression
- Use vertical connectors (↓) to show step transitions
- Use colors to group related steps
- Add column labels: "Step 1", "Step 2", etc.

**Scope:** Local (Goal Wizard + Architecture)
**Effort:** Medium
**Type:** UI

---

### I2: Bundle Config Needs Grouping & Sub-Groups
**Pages Affected:** Bundle Configuration
**Issue:** Flat list doesn't show bundle hierarchy or organization

**Action:** Support nested structure
- Primary bundle groups (e.g., "High-Touch", "Self-Service")
- Sub-bundles under each group
- Show hierarchy visually (indentation or collapsible groups)
- Allow reordering within and across groups

**Scope:** Local (Bundle Configuration)
**Effort:** High (structural change)
**Type:** UI

---

### I3: Capacity/Load Color Coding Inconsistent
**Pages Affected:** Participant Dashboard
**Issue:** Red/Yellow/Green used, but not all fields use same coding

**Action:** Standardize color coding
- Red: Critical (>90% capacity, overloaded)
- Yellow: Medium (60-90% capacity, approaching limit)
- Green: Good (<60% capacity, available)
- Apply consistently across all load/capacity metrics

**Scope:** Local (Participant Dashboard)
**Effort:** Low
**Type:** UI

---

### I4: Button Placement Inconsistent
**Pages Affected:** All 4 pages
**Issue:** Add/Edit/Delete buttons in different places on different pages

**Action:** Standardize button placement
- Actions column on right side of tables (consistent)
- Add buttons above tables (consistent)
- Delete confirmation modal (consistent)

**Scope:** Universal — all pages
**Effort:** Low
**Type:** UI

---

---

## 🔄 Flows & Journeys

### F1: What Comes After Last Step? Process End State Unclear
**Pages Affected:** Goal Wizard, Architecture Overview
**Issue:** Flow shows 6 steps but doesn't clarify: what happens after creation? How does admin know goal was successful?

**Action:** Add post-creation flow
- Show: "Goal created in decision-log" ✓
- Show: "Participants notified" (or similar)
- Show: "Goal visible in dashboard"
- OR: "Next: Participants review and accept"

**Scope:** Local (Goal Wizard)
**Effort:** Medium (add post-creation state)
**Type:** Flows

---

### F2: Bundle Configuration Reordering Flow
**Pages Affected:** Bundle Configuration
**Issue:** Users need to change bundle order but no clear flow for this

**Action:** Add explicit reordering flow
- Drag/drop with visual feedback
- Arrow buttons (move up/down)
- Jump-to dropdown showing all positions
- Confirm reorder or undo

**Scope:** Local (Bundle Configuration)
**Effort:** Medium
**Type:** Flows

---

### F3: Participant Dashboard Missing CRUD Flow
**Pages Affected:** Participant Dashboard
**Issue:** Shows list (read-only) but no flow for creating/deleting participants

**Action:** Add complete CRUD flow
- **Create:** "+ Add Participant" → form with: name, status, specializations, capacity
- **Read:** Table view (already shown)
- **Update:** "Edit" button → form (already shown as modal)
- **Delete:** "Delete" button → confirmation → remove from list

**Scope:** Local (Participant Dashboard)
**Effort:** Medium
**Type:** Flows

---

### F4: Step Back/Edit Flow in Wizard
**Pages Affected:** Goal Wizard
**Issue:** Unclear if users can go back to previous steps and edit without losing progress

**Action:** Add back-edit flow
- Show navigation: "← Back", "Next →", "Jump to Step X"
- Confirm: "Edits are saved as you go — you can return anytime"
- Show modified indicator (e.g., "Step 3 (modified)" if user edits after step complete)

**Scope:** Local (Goal Wizard)
**Effort:** Medium
**Type:** Flows

---

### F5: Participant Response to Uniform Prompt
**Pages Affected:** Participant Dashboard
**Issue:** "Send Uniform Prompt" action shown but response flow not clear

**Action:** Add response workflow
- Send prompt → participants receive
- Show status: "Pending", "Completed", "Overdue"
- Allow admin to review responses before approving
- Show deadline for response

**Scope:** Local (Participant Dashboard)
**Effort:** High (requires participant interaction state)
**Type:** Flows

---

---

## 📊 SUMMARY BY SCOPE

### Local Fixes (Specific Pages)
- U2: Add/Delete on dashboards
- U3: Step navigation clarity (Goal Wizard)
- I1: Data flow connections (Goal Wizard + Architecture)
- I2: Bundle grouping/sub-groups (Bundle Configuration)
- I3: Color coding standardization (Participant Dashboard)
- F1: Post-creation flow (Goal Wizard)
- F2: Reordering flow (Bundle Configuration)
- F3: Participant CRUD flow (Participant Dashboard)
- F4: Back/edit flow in wizard (Goal Wizard)
- F5: Prompt response workflow (Participant Dashboard)

### Universal Points (All 4 Pages)
- U1: Tooltips/tool kits missing
- U4: Reordering affordances unclear
- I4: Button placement inconsistency

---

## 📋 IMPLEMENTATION CHECKLIST

### Round 1 — Core Fixes (Priority)
- [ ] U1: Add tooltips to all fields (template: capacity, efficiency, load, status, etc.)
- [ ] U2: Add "+ Add" buttons to dashboards
- [ ] U4: Add visual reordering affordances (drag handles, arrows, dropdowns)
- [ ] I1: Make data flow connections explicit (arrows, colors)
- [ ] F1: Add post-creation state to Goal Wizard

### Round 2 — Enhancements
- [ ] I2: Add grouping/sub-groups to Bundle Configuration
- [ ] I3: Standardize color coding
- [ ] I4: Standardize button placement
- [ ] U3: Add step jump navigation to Goal Wizard
- [ ] F2: Add reordering UI flow
- [ ] F3: Add add/delete participant flow
- [ ] F4: Show back-edit flow with saved indicator
- [ ] F5: Add prompt response status tracking

---

## 📌 NOTES FOR PROTOTYPE ITERATION

1. **Keep prototype wireframe style** — Don't add visual polish yet. Focus on structure/flow.
2. **Add comments** explaining changes in HTML annotations.
3. **Test navigation** — Can users click between steps? Can they see reorder options?
4. **Tooltip format:** Use `<span title="...">` for hover or icon-based (?) for inline help.
5. **Colors:** Use consistent RGB values across all pages (define in CSS).
6. **Grouping:** Use `<optgroup>` in selects or nested `<ul>` for visual grouping.

---

## NEXT STEPS

**S350 — Iteration Round 1:**
1. Implement core fixes (U1, U2, U4, I1, F1)
2. Update ETSC-PROTOTYPE-INTERACTIVE.html
3. Re-review with updates
4. Mark completed items

**S350 — Iteration Round 2:**
1. Implement enhancements (I2, I3, I4, U3, F2-F5)
2. Final polish pass
3. Lock design

**S351:**
1. Build MVP (React) using locked prototype as spec
2. Implement all flows end-to-end
3. Backend APIs

---

**Status:** Ready for implementation  
**Effort Estimate:** 4-6 hours for prototype update (both rounds)  
**Target Lock Date:** 2026-07-08  
**Target MVP Start:** 2026-07-09

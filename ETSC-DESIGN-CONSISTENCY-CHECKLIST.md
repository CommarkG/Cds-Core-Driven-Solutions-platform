# ETSC Design Consistency Checklist
**Version 1.0 | QA Source-of-Truth for All Pages**

---

## HOW TO USE THIS CHECKLIST

This document is your QA verification document. Before shipping ANY page:
1. Go through the applicable section below
2. Check off each item as you verify it works
3. All items must pass before page goes to production
4. Use this checklist for every new feature added to existing pages

---

## PAGE 1: GOAL DEFINITION WIZARD

### Step Indicators & Progression
- [ ] Only ONE set of step indicators shown (removed duplicate top header)
- [ ] All 6 steps visible: Step 1, 2, 3, 4, 5, 6
- [ ] Text wrapping consistent across all steps (no unexpected line breaks)
- [ ] Step progression shown: Define Goal → Refine Core → Set Scope → Assign Team → Finalize
- [ ] Active step highlighted with black background
- [ ] Tooltip icons (?) on all step labels with explanatory text
- [ ] Tooltip icons appear on hover with proper styling

### Form Elements (Steps 1-6)
- [ ] Every form label has tooltip icon (?)
- [ ] Every textarea has placeholder text
- [ ] Every input field has placeholder text
- [ ] Text areas sized consistently (min-height 100px)
- [ ] Form groups spaced consistently (15px margin-bottom)
- [ ] All input colors consistent (#f0f8ff for input sections)

### Step 1: Initial Draft
- [ ] Wireframe box styled as input (light blue #f0f8ff)
- [ ] Textarea for goal description present
- [ ] "Submit Draft" button styled as action button (green)
- [ ] Annotation section present with design comment

### Step 2: AI Analysis
- [ ] Wireframe box styled as output (light green #f0fff0)
- [ ] AI Analysis section highlighted with comment-highlight class
- [ ] Clarifying Questions section with 3 questions
- [ ] Question inputs styled consistently
- [ ] Back/Refine buttons present (secondary/primary colors)

### Step 3: Core Confirmation
- [ ] Wireframe box styled as output
- [ ] Core problem, solution, success criteria shown
- [ ] Success Criteria field has tooltip icon (?)
- [ ] "Lock Core & Continue" button present
- [ ] Annotation explains transition to scope

### Step 4: Scope & Goal Type
- [ ] Wireframe box styled as action (light orange #fffaf0)
- [ ] Timeline dropdown with options present
- [ ] Budget input with placeholder
- [ ] Goal Type recommendation shown (read-only)
- [ ] All fields have tooltips (?)

### Step 5: Bundle Recommendation
- [ ] Wireframe box styled as output
- [ ] Matching matrix displayed with color-coded cells
- [ ] Matrix shows: Goal Requirement | CSP | CSPS | Base44 | Lovable columns
- [ ] Primary recommendation highlighted with 🌟 icon
- [ ] Alternative options shown (Option B, Option C)
- [ ] Radio buttons for selecting bundle
- [ ] Back/Confirm buttons present

### Step 6: Review & Create
- [ ] Wireframe box styled as action
- [ ] Goal summary shown (read-only display)
- [ ] All fields from previous steps summarized
- [ ] Note section explains immutability
- [ ] "✓ Create Goal (Immutable)" button present
- [ ] Back button available

### Step 7: Post-Creation Success State
- [ ] Post-creation flow shown (what happens after creation)
- [ ] Success state with completed/pending steps
- [ ] Visual representation of automation flow
- [ ] Annotation explains timeline

### Global Wizard Rules
- [ ] All button text consistent (Submit, Back, Next, Confirm, Create)
- [ ] Button colors consistent (green for action, gray for secondary)
- [ ] All tooltips tested (hover shows explanation)
- [ ] Text wrapping tested at 480px, 768px, 1200px
- [ ] No orphaned elements
- [ ] Spacing follows 8px grid (8, 12, 16, 20, 30px)
- [ ] No duplicate sections or indicators

---

## PAGE 2: PARTICIPANT DASHBOARD

### Dashboard Header & Overview
- [ ] Section title "Participant Capability Dashboard" present
- [ ] Descriptive note explaining dashboard purpose
- [ ] All tooltips on headers have (?) icons

### Participant List Section
- [ ] Section label with tooltip icon (?)
- [ ] "+ Add Participant" button present (green, action-button style)
- [ ] "+ Create Group" button present (green)
- [ ] "Export All" button present (blue, export-btn style)
- [ ] Reorder hint text displayed
- [ ] Table structure correct

### Participant Table Structure
- [ ] Row # column present (width 40px)
- [ ] All 8 columns present in correct order:
  - [ ] # (row number)
  - [ ] Participant (name)
  - [ ] Status (availability)
  - [ ] Load (active goals count)
  - [ ] Capacity (current/max with tooltip)
  - [ ] Efficiency (token efficiency ratio)
  - [ ] Position (dropdown)
  - [ ] Comments (text field)
  - [ ] Actions (buttons)
- [ ] All headers styled with background #f5f5f5
- [ ] All headers have class "sortable-header"
- [ ] Sort indicators (↑↓) toggle when headers clicked

### Table Header Tooltips
- [ ] "Status (?)" — tooltip explains availability
- [ ] "Load (?)" — tooltip explains active goals count
- [ ] "Capacity (?)" — tooltip explains current/max ratio
- [ ] "Efficiency (?)" — tooltip explains token efficiency metric

### Table Rows (Data)
- [ ] Row # auto-increments (1, 2, 3, 4)
- [ ] All 4 participants listed: CSP, CSPS, Base44, Lovable
- [ ] Capacity shown with color indicator + tooltip:
  - [ ] Red for high load (60-80%)
  - [ ] Yellow for medium (40-60%)
  - [ ] Green for low (<40%)
- [ ] Position dropdown in every row with options 1-4
- [ ] Comment field in every row with placeholder text
- [ ] Edit button in every row (black, smaller font)
- [ ] Delete button in every row (red)
- [ ] Export button in every row (blue)

### Edit Participant Modal Section
- [ ] Section title present
- [ ] All form fields styled consistently
- [ ] Strengths textarea with placeholder
- [ ] Weaknesses textarea with placeholder
- [ ] Specializations as checkboxes
- [ ] Efficiency field with tooltip (?)
- [ ] Response SLA field with tooltip (?)
- [ ] Verification Threshold field with tooltip (?)
- [ ] Capacity field with tooltip (?)
- [ ] Auto-adjust settings section (background #f0f8ff)
- [ ] Cancel/Save buttons present

### Uniform Prompt Section
- [ ] Section title present
- [ ] Select dropdown for participant
- [ ] Uniform Prompt displayed in monospace font
- [ ] 7 numbered questions shown
- [ ] All questions have consistent formatting
- [ ] Cancel/Send buttons present

### Global Dashboard Rules
- [ ] All buttons styled consistently (green for add, red for delete, blue for export)
- [ ] All tables have row numbers with auto-update
- [ ] Sorting works on all headers (toggle ↑↓)
- [ ] Reorder dropdowns work correctly
- [ ] Delete confirmation dialog shows before deletion
- [ ] Export generates CSV with correct headers
- [ ] Text wrapping consistent across all rows
- [ ] No duplicate columns or sections
- [ ] Responsive at 480px, 768px, 1200px
- [ ] All form inputs have labels with (?)

---

## PAGE 3: BUNDLE CONFIGURATION

### Bundle Configuration Header
- [ ] Section title "Bundle Configuration" present
- [ ] Descriptive note explaining purpose
- [ ] Section title has tooltip icon (?)

### Bundle List Section
- [ ] Section label with tooltip icon (?)
- [ ] "+ Create New Bundle" button present (green)
- [ ] "+ Create Group" button present (green)
- [ ] "Export All" button present (blue)
- [ ] Reorder hint text displayed
- [ ] Table structure correct

### Bundle Table Structure
- [ ] Row # column present (width 40px)
- [ ] All columns present in correct order:
  - [ ] # (row number)
  - [ ] Bundle Name
  - [ ] Participants (list of included participants)
  - [ ] Wired Goal Types (which goals use this bundle)
  - [ ] Default (PRIMARY/SECONDARY/- indicator with tooltip)
  - [ ] Position (dropdown)
  - [ ] Comments (text field)
  - [ ] Actions (buttons)
- [ ] All headers styled with background #f5f5f5
- [ ] All headers have class "sortable-header"
- [ ] Sort indicators (↑↓) toggle when headers clicked

### Table Header Tooltips
- [ ] "Default (?)" — tooltip explains primary/secondary/alternative

### Table Rows (Data)
- [ ] Row # auto-increments (1, 2, 3, 4)
- [ ] All 4 bundles listed:
  - [ ] "Performance & Architecture"
  - [ ] "Frontend & Backend"
  - [ ] "Full Team Consultation"
  - [ ] "Quick Turnaround"
- [ ] Bundle row 1 highlighted with light green background (#f0fff0)
- [ ] Position dropdown in every row
- [ ] Comment field in every row
- [ ] Edit button in every row (black)
- [ ] Delete button in every row (red)
- [ ] Export button in every row (blue)

### Edit Bundle Section
- [ ] Section title "Edit Bundle: Performance & Architecture"
- [ ] Bundle Name input field
- [ ] Description textarea with placeholder
- [ ] Participant selection section (background #f0f8ff):
  - [ ] Checkboxes for each participant
  - [ ] Current load shown next to each (e.g., "3/5")
- [ ] Wired Goal Types section (background #f0fff0):
  - [ ] Checkboxes for all 6 goal types
  - [ ] Primary/Secondary labels next to checked items
- [ ] Expected Timeline input (days)
- [ ] Process Style dropdown (Parallel/Sequential/Hybrid)
- [ ] Cancel/Save buttons present

### Bundle Preview Matrix
- [ ] Section title present
- [ ] Matrix displayed with 5 columns:
  - [ ] Goal Type
  - [ ] Match %
  - [ ] Status (Wired/Not Wired)
  - [ ] Capacity (Available/Full)
  - [ ] Recommendation
- [ ] Cells color-coded:
  - [ ] High match: green (#90EE90)
  - [ ] Medium match: yellow (#FFD700)
  - [ ] Low match: pink (#FFB6C6)
- [ ] All 6 goal types shown in matrix

### Global Bundle Rules
- [ ] All buttons styled consistently
- [ ] All tables have row numbers with auto-update
- [ ] Sorting works on all headers
- [ ] Reorder dropdowns work
- [ ] Delete confirmation dialog shows
- [ ] Export generates CSV
- [ ] Text wrapping consistent
- [ ] No duplicate sections
- [ ] Responsive at 480px, 768px, 1200px

---

## PAGE 4: ARCHITECTURE OVERVIEW

### Architecture Header
- [ ] Section title "System Architecture Overview" present
- [ ] Tooltip icon (?) on title

### Data Flow Section
- [ ] Section label with tooltip icon (?)
- [ ] Goal Creation Flow shown as:
  - [ ] Admin enters draft → AI refines core → Core locked → Scope presented
- [ ] Bundle recommendation flow shown as:
  - [ ] Bundle recommendation → Admin confirms → Goal created in decision-log → Immutable audit trail
- [ ] Data flow boxes styled consistently (#f0f0f0 background)
- [ ] Arrows (→) between flow boxes

### Backend Integration Points
- [ ] "Backend Integration Points" section present with tooltip (?)
- [ ] All integration points listed:
  - [ ] Phase 0 Decision Log
  - [ ] Identity Gate
  - [ ] Authority Matrix
  - [ ] Schema Checksum
  - [ ] Participant Profiles
  - [ ] Recommendation Engine
- [ ] Section background color (#f5f5f5)
- [ ] Bulleted list with explanations

### Schema Alignment
- [ ] Section title "Schema Alignment" present
- [ ] All alignment points listed:
  - [ ] Goal Type mapping
  - [ ] Participants mapping
  - [ ] Bundle mapping
  - [ ] Vocabulary mapping
- [ ] Section background color (#f0f8ff)

### Prototype Annotations
- [ ] Overall System annotation present
- [ ] Feedback questions documented (Design comments)
- [ ] No answers required (just questions for future consideration)

### Global Architecture Rules
- [ ] All tooltips present and working
- [ ] Data flow visual clear and easy to follow
- [ ] Typography consistent with other pages
- [ ] Color scheme matches other pages
- [ ] Spacing follows 8px grid
- [ ] Responsive at all breakpoints

---

## GLOBAL CROSS-PAGE CHECKS

### Consistency Across All 4 Pages
- [ ] No duplicate step indicators on wizard
- [ ] No duplicate section titles anywhere
- [ ] Text wrapping consistent across pages
- [ ] Color palette consistent:
  - [ ] Green for action buttons (#50c878)
  - [ ] Red for delete (#ff6b6b)
  - [ ] Blue for export (#4da6ff)
  - [ ] Orange for action sections (#fffaf0)
  - [ ] Light blue for input sections (#f0f8ff)
  - [ ] Light green for output sections (#f0fff0)
- [ ] Font sizes consistent:
  - [ ] Page titles (h1): 28px
  - [ ] Section titles (h2): 18px
  - [ ] Body text: 14px
  - [ ] Small text: 12px
- [ ] Spacing consistent (8px grid):
  - [ ] 8px: tiny gaps
  - [ ] 12px: standard cell padding
  - [ ] 16px: section spacing
  - [ ] 20px: major section spacing
  - [ ] 30px: large breaks
- [ ] All tables have same structure:
  - [ ] Row # column first
  - [ ] Sortable headers
  - [ ] Position dropdown
  - [ ] Comment field
  - [ ] Delete button
  - [ ] Export button
  - [ ] Edit button (if editable)
- [ ] All buttons styled identically:
  - [ ] Green action buttons (green #50c878)
  - [ ] Red delete buttons (red #ff6b6b)
  - [ ] Blue export buttons (blue #4da6ff)
  - [ ] Gray secondary buttons (gray #e0e0e0)
  - [ ] Black edit buttons (black #1a1a1a)
- [ ] Tooltip icons (?) present on:
  - [ ] All titles/subtitles
  - [ ] All metric fields
  - [ ] All sortable headers
  - [ ] All status indicators
- [ ] No orphaned elements (every element has clear purpose)
- [ ] All interactive elements accessible via keyboard
- [ ] All focus states visible
- [ ] Touch targets 44px minimum on mobile

### Responsive Testing (All Pages)
- [ ] Test at 480px (mobile):
  - [ ] Single column layout
  - [ ] Tables stack vertically or scroll horizontally
  - [ ] Buttons full-width or stacked
  - [ ] Comment fields narrower (100px)
  - [ ] Font sizes 12px for table data
- [ ] Test at 768px (tablet):
  - [ ] 2-3 column layout
  - [ ] Tables remain horizontal
  - [ ] Forms side-by-side where space allows
- [ ] Test at 1200px (desktop):
  - [ ] Full multi-column layout
  - [ ] All columns visible
  - [ ] Optimal spacing

### Dark Mode Preparation
- [ ] Light theme colors documented (Color Palette section of design system)
- [ ] Dark theme colors defined (ready for implementation)
- [ ] No color-only indicators (text + icon + color used together)
- [ ] Text contrast adequate for light theme (WCAG AA minimum 4.5:1)

### Performance
- [ ] No duplicate CSS classes
- [ ] No inline styles (use classes instead)
- [ ] Event listeners use delegation (not individual elements)
- [ ] DOM queries cached (not re-queried)
- [ ] SVG icons used (not image files)

### Accessibility Final Check
- [ ] All form inputs have associated labels
- [ ] Placeholders not used as labels
- [ ] All icons have title or aria-label
- [ ] Color not sole indicator
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrow keys)
- [ ] Focus order logical (left-to-right, top-to-bottom)
- [ ] Focus visible (outline or border)
- [ ] Alt text for all images

---

## FEATURE-SPECIFIC CHECKLIST

### Drag-and-Drop Functionality
- [ ] Drag handles (≡) displayed (if present)
- [ ] Drag-and-drop works via HTML5 Drag API
- [ ] Dragged row shows visual feedback (opacity 0.5)
- [ ] Drop target highlighted with color change
- [ ] Row reorders correctly
- [ ] Row numbers auto-update after drag
- [ ] Alternative: Position dropdown works as primary method

### Sorting Functionality
- [ ] All sortable headers have cursor: pointer
- [ ] Click header toggles sort direction
- [ ] Sort indicator shows ↑ (ascending) or ↓ (descending)
- [ ] Sorting works on all columns
- [ ] Row numbers don't change (only order changes)

### Comment Fields
- [ ] Placeholder text shows "Add comment..."
- [ ] Input accepts text
- [ ] Styled consistently (12px font, border, padding)
- [ ] Focus state shows border color change
- [ ] Comments saved (in production)

### Delete Functionality
- [ ] Delete button red (#ff6b6b)
- [ ] Confirmation dialog shows before deletion
- [ ] Dialog text clear ("Are you sure?")
- [ ] Row removed from table
- [ ] Row numbers auto-update
- [ ] Backend updated (in production)

### Export Functionality
- [ ] Export button blue (#4da6ff)
- [ ] Export All generates CSV with all rows
- [ ] Export Row generates CSV with single row
- [ ] CSV includes all columns with headers
- [ ] File downloads with correct name
- [ ] CSV format valid (comma-separated, quoted strings)

---

## PRE-SHIP SIGN-OFF

Before shipping ANY page to production:

**QA Tester:** ________________  **Date:** __________

**Checklist Status:** 
- [ ] All items checked and passing
- [ ] No critical issues open
- [ ] No design inconsistencies
- [ ] All tooltips working
- [ ] All buttons functional
- [ ] Responsive at all breakpoints
- [ ] Accessibility verified

**Sign-off:**
- [ ] Ready for production
- [ ] Blocked (list issues): __________________________________

---

## REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-06 | Initial consistency checklist created. Comprehensive QA guide for all 4 pages. |

---

**Document Generated:** 2026-07-06  
**Last Updated:** 2026-07-06  
**Status:** Active (QA verification required before every feature release)

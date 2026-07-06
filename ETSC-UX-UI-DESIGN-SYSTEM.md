# ETSC UX/UI Design System
**Version 1.0 | Enterprise-Grade Visual Design Framework**

---

## 1. CORE PRINCIPLES

### 1.1 Options Become Architecture
- Don't select a path forward; enable all options with permission gates
- Every feature is available but gated by role/context
- Principle: Flexibility + Control. Never force a single workflow when multiple valid paths exist

### 1.2 Wireframe-First Design
- Structure before Polish. Get the IA (Information Architecture) right before spending time on styling
- Test interaction patterns in wireframe; refine visual design only after flow validates
- Document wireframe intent: why this layout, why this flow, what problem does it solve

### 1.3 Consistency as Fundamental
- Not optional. Not a nice-to-have. Consistency IS the product
- Every similar element must behave, look, and respond identically
- When inconsistency appears, it's a bug. Fix it at the source (apply a CSS rule everywhere, not in one place)

### 1.4 Enterprise-Grade Means Repeatable
- Not bespoke. Not beautiful one-off designs
- Every feature, every component, every pattern must be documented so it repeats identically across all 4 pages + future features
- Principle: If you can't explain the rule in one sentence, you don't have a rule yet

### 1.5 Mobile-First Thinking
- Design for 480px first, then expand to tablet (768px), then desktop (1200px+)
- Responsive breakpoints are not an afterthought; they're part of core architecture
- Every element must work across all three viewport sizes without special exceptions

---

## 2. HARDWIRED CONSISTENCY RULES

These rules are NOT suggestions. They apply everywhere, always. If you see a violation, fix it immediately.

### 2.1 Text Wrapping Rule
**Applies to:** Step labels, section titles, button text, table column headers, form labels

**Rule:** When text may wrap differently across instances, define max-width that forces consistent break points.

**Implementation:**
```css
max-width: 120px; /* or adjust based on container */
word-break: break-word;
line-height: 1.4;
```

**Example:**
- "Step 1: Initial Draft" wraps consistently with "Step 5: Bundle Recommendation"
- "Step 6: Review & Create" breaks the same way every time

**Test:** Check every instance of multi-word labels. If ANY wrap differently, adjust max-width globally.

---

### 2.2 Tooltip Icon Rule
**Applies to:** Every metric field, every title, every subtitle that might need explanation

**Rule:** Every title/metric MUST have (?) circle icon. Hover shows explanation.

**Implementation:**
```html
<span class="tooltip-icon" title="Explanation of this field">?</span>
```

**Styling:**
```css
.tooltip-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #d0d0d0;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 12px;
    cursor: help;
    margin-left: 6px;
    transition: all 0.2s;
    vertical-align: middle;
}

.tooltip-icon:hover {
    background: #999;
    transform: scale(1.1);
}
```

**Examples:**
- "Step 1: Initial Draft (?)" - tooltip explains what to include
- "Efficiency (?) — 0.95" - tooltip explains the metric
- "Load (?) — 3 active goals" - tooltip explains what "load" means

**Apply Everywhere:** Wizard, Dashboard, Bundle Config, Architecture screens

---

### 2.3 Action Button Rule
**Applies to:** All "Create", "Add", "Submit", "Confirm" buttons

**Rule:** Use consistent green color + sizing for all action buttons. No exceptions.

**Implementation:**
```css
.add-button, .action-button {
    background: #50c878;
    color: white;
    padding: 10px 15px;
    margin-bottom: 15px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.add-button:hover {
    background: #3ca860;
}
```

**Examples:**
- "+ Add Participant" button
- "+ Create New Bundle" button
- "+ Create Group" button
- "✓ Create Goal (Immutable)" button

**Apply Everywhere:** All tables, all forms, all action sections

---

### 2.4 Delete Button Rule
**Applies to:** Every row in every table

**Rule:** Every row MUST have delete button. Must show confirmation dialog before deletion.

**Implementation:**
```css
.delete-btn {
    background: #ff6b6b;
    color: white;
    padding: 6px 10px;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
}

.delete-btn:hover {
    background: #cc5555;
}
```

**JavaScript:**
```javascript
function deleteRow(buttonEl) {
    if (confirm('Are you sure you want to delete this row?')) {
        // Delete logic here
    }
}
```

**Apply Everywhere:** Participant table, Bundle table, any future data table

---

### 2.5 Comment Field Rule
**Applies to:** Every row in every data table

**Rule:** Every row MUST support comments. Comments enable AI to read context.

**Implementation:**
```html
<input type="text" class="comment-field" placeholder="Add comment..." />
```

**Styling:**
```css
.comment-field {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 12px;
    width: 150px;
    font-family: inherit;
}

.comment-field:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 4px rgba(26, 26, 26, 0.2);
}
```

**Apply Everywhere:** Every table (Participants, Bundles, future tables)

---

### 2.6 Row Numbering Rule
**Applies to:** All data tables

**Rule:** Tables MUST have row # in first column. Auto-update on reorder/delete.

**Implementation:**
```html
<th style="width: 40px;" class="row-number">#</th>
<td class="row-number">1</td>
```

**JavaScript:**
```javascript
function updateRowNumbers(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
    rows.forEach((row, idx) => {
        const rowNumCell = row.querySelector('.row-number');
        if (rowNumCell) {
            rowNumCell.textContent = idx + 1;
        }
    });
}
```

**Apply Everywhere:** All tables, auto-update whenever rows reorder or delete

---

### 2.7 Sortable Header Rule
**Applies to:** All data table columns

**Rule:** All headers MUST be sortable. Visual indicator (↑↓) shows sort direction.

**Implementation:**
```html
<th class="sortable-header" onclick="sortTable(this, 'participantTable')">
    Participant <span class="sort-indicator"></span>
</th>
```

**Styling:**
```css
.sortable-header {
    cursor: pointer;
    user-select: none;
    padding-right: 8px;
    position: relative;
}

.sortable-header:hover {
    text-decoration: underline;
    color: #1a1a1a;
}

.sort-indicator {
    display: inline-block;
    margin-left: 4px;
    font-size: 12px;
    color: #999;
}
```

**JavaScript:**
```javascript
function sortTable(headerEl, tableType) {
    // Sorting logic toggles ↑ and ↓ indicators
    headerEl.querySelector('.sort-indicator').textContent = isAsc ? ' ↓' : ' ↑';
}
```

**Apply Everywhere:** All tables

---

### 2.8 Reorder Rule (Position Dropdown)
**Applies to:** All sortable lists/tables

**Rule:** Lists/tables MUST support reordering via dropdown. This is the PRIMARY method (drag-drop is secondary).

**Implementation:**
```html
<select class="reorder-dropdown" onchange="reorderRow(this, 'participantTable')">
    <option>Position 1</option>
    <option selected>Position 2</option>
    <option>Position 3</option>
</select>
```

**Styling:**
```css
.reorder-dropdown {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
    background: white;
    transition: all 0.2s;
}

.reorder-dropdown:hover {
    border-color: #999;
    background: #f9f9f9;
}
```

**JavaScript:**
```javascript
function reorderRow(selectEl, tableId) {
    // Move row to selected position, update row numbers
    updateRowNumbers(tableId);
}
```

**Apply Everywhere:** All tables

---

### 2.9 Export Rule
**Applies to:** All data tables

**Rule:** All tables MUST support export at row + full-table levels. CSV format.

**Implementation:**
```html
<button class="export-btn" onclick="exportTable('participants', 'all')">Export All</button>
<button class="export-btn" onclick="exportTable('participants', 'row', this)">Export</button>
```

**Styling:**
```css
.export-btn {
    background: #4da6ff;
    color: white;
    padding: 6px 10px;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: 4px;
}

.export-btn:hover {
    background: #2d7fd9;
}
```

**JavaScript:**
```javascript
function exportTable(tableType, scope, buttonEl) {
    // Generate CSV, download as file
}
```

**Apply Everywhere:** All tables

---

### 2.10 Edit Button Rule
**Applies to:** All row edit operations

**Rule:** Every row that can be edited MUST have "Edit" button (distinct from Delete/Export).

**Implementation:**
```html
<button onclick="editParticipant('CSP')" style="padding: 5px 8px; font-size: 12px;">Edit</button>
```

**Style:** Black background, smaller than action buttons (primary buttons are green, edit buttons are black).

**Apply Everywhere:** Participant rows, Bundle rows, any editable rows

---

## 3. LAYOUT CONSISTENCY RULES

### 3.1 Desktop Layout (1200px+)
- All tables use same spacing (12px padding per cell)
- Same font sizes: headers 14px bold, data 14px regular
- Consistent color scheme for all headers (#f5f5f5 background)
- Column widths: # column 40px, Position column 100px, Comments 120px, Actions 140px

### 3.2 Responsive Design Breakpoints
```css
/* Mobile: 480px-767px */
@media (max-width: 767px) {
    /* Single column, stacked tables */
    .table-wrapper {
        font-size: 12px;
    }
    th, td {
        padding: 8px;
    }
    .comment-field {
        width: 100px;
    }
}

/* Tablet: 768px-1199px */
@media (min-width: 768px) and (max-width: 1199px) {
    /* 2-3 column layout */
}

/* Desktop: 1200px+ */
@media (min-width: 1200px) {
    /* Full multi-column, side-by-side */
}
```

### 3.3 Spacing Grid
Use increments of 8px. No random spacing.
- 8px: tiny gaps, internal padding
- 12px: standard cell padding
- 16px: section spacing
- 20px: major section spacing
- 30px: large breaks between sections

### 3.4 Typography
- **h1 (Page Title):** 28px, bold, #1a1a1a
- **h2 (Section Title):** 18px, bold, #1a1a1a, border-bottom 2px solid #ddd
- **h3 (Subsection):** 16px, bold, #333
- **Body text:** 14px, #333, line-height 1.6
- **Small text (notes, hints):** 12px, #666

### 3.5 Color Palette
- **Primary Action (green):** #50c878
- **Primary Action Hover:** #3ca860
- **Delete (red):** #ff6b6b
- **Delete Hover:** #cc5555
- **Export (blue):** #4da6ff
- **Export Hover:** #2d7fd9
- **Success (light green):** #f0fff0, border #50c878
- **Input (blue):** #f0f8ff, border #4da6ff
- **Output (green):** #f0fff0, border #50c878
- **Action (orange):** #fffaf0, border #ff9800
- **Header background:** #f5f5f5
- **Header text:** #1a1a1a
- **Secondary text:** #666
- **Border:** #ddd

---

## 4. COMPONENT PATTERNS

### 4.1 Data Table Pattern
**Structure:** # | [Data Columns] | Position | Comment | Actions

**Example:**
```
| # | Participant | Status | Load | Capacity | Efficiency | Position | Comments | Actions |
|---|-------------|--------|------|----------|------------|----------|----------|---------|
| 1 | CSP | Active | 3 active goals | 3/5 (60%) | 0.95 | [Position Dropdown] | [Comment Input] | [Edit] [Delete] [Export] |
```

**Rules:**
- Row # in column 1 (width 40px)
- All headers sortable (add class "sortable-header")
- Position column with reorder dropdown
- Comments column for AI context
- Actions: Edit, Delete, Export (in that order)

### 4.2 Dashboard Pattern
**Structure:** Description → Buttons (Add, Create Group, Export All) → Table → Footer Annotations

**Example:**
```
[Section Title] (?)
[Descriptive note]
[+ Add Participant] [+ Create Group] [Export All]
[Reorder hint]
[Table with all components]
```

### 4.3 Wizard Step Pattern
**Structure:** Step Progression → [Step Content] → Buttons (Back/Next)

**Example:**
```
Define Goal → Refine Core → Set Scope → Assign Team → Finalize
[Step Content Box]
[Back Button] [Next Button]
```

**Rules:**
- Active step highlighted (black background)
- Progress arrows between steps
- Consistent spacing between sections

### 4.4 Form Section Pattern
**Structure:** Wireframe Box (with color coding) → Label (?) → Input/Textarea → Annotation

**Color coding:**
- Input section: light blue (#f0f8ff)
- Output section: light green (#f0fff0)
- Action section: light orange (#fffaf0)

**Rules:**
- Every label has tooltip icon (?)
- Every input has placeholder
- Annotations explain design decisions
- All form inputs inherit styling (same border, padding, font)

### 4.5 Tooltip Pattern
**Icon:** (?) circle, gray background, white text
**Hover:** Darker gray background, scale up 1.1x
**Display:** HTML title attribute (browser native tooltip)

---

## 5. ACCESSIBILITY & UX STANDARDS

### 5.1 Keyboard Navigation
- All interactive elements must be keyboard-accessible
- Tab order follows visual flow (left-to-right, top-to-bottom)
- Enter/Space activates buttons
- Dropdown arrows navigate options

### 5.2 Focus States
- All focusable elements must have visible focus indicator
- Use outline or border (not removal of outline)
- Focus color should contrast with background

### 5.3 Color Not Sole Indicator
- Delete buttons are red AND show "Delete" text
- Status indicators have icons + labels + color
- Capacity shown as number + color + percentage

### 5.4 Touch Targets (Mobile)
- Minimum 44px x 44px for all clickable elements
- Buttons, dropdowns, checkboxes must all meet this size on mobile

### 5.5 Alt Text & Labels
- All icons have title or aria-label
- All form inputs have associated labels (not just placeholders)
- Tables have proper header markup

---

## 6. RESPONSIVE DESIGN RULES

### 6.1 Mobile-First Approach (480px-767px)
- Single column layout (tables stack vertically)
- Dropdowns full-width
- Comment fields narrower (100px)
- Font sizes reduced slightly (12px for table data)
- Padding reduced (8px instead of 12px)

### 6.2 Tablet (768px-1199px)
- 2-3 column grid for complex layouts
- Tables remain horizontal but may hide some columns
- Forms side-by-side where space allows
- Buttons stack or arrange based on available width

### 6.3 Desktop (1200px+)
- Full 4-column multi-column layout
- All table columns visible
- Forms in 2-column grid
- Buttons arranged horizontally

### 6.4 Overflow Handling
- Tables scroll horizontally on small screens
- Dropdowns don't overflow off-screen (adjust position if needed)
- Modal dialogs responsive to viewport

---

## 7. DARK MODE CONSIDERATIONS

### 7.1 Light Theme Colors (Current)
Documented in Color Palette section (green buttons, blue inputs, orange actions, etc.)

### 7.2 Dark Theme Equivalents
When dark mode is added:
- Background: #1a1a1a (instead of #fff)
- Text: #e0e0e0 (instead of #333)
- Headers: #2a2a2a (instead of #f5f5f5)
- Borders: #444 (instead of #ddd)
- Button green: #45a870 (instead of #50c878)
- Input blue: #1e4d7b (instead of #f0f8ff)

### 7.3 Testing Dark Mode
- Test all 4 pages (Wizard, Dashboard, Bundle Config, Architecture)
- Verify text contrast (WCAG AA minimum 4.5:1 for normal text)
- Check for color-only indicators

---

## 8. PERFORMANCE RULES

### 8.1 CSS
- No duplicate CSS classes
- Combine related styles into single class
- Use CSS Grid/Flexbox for layouts (not float)
- Minimize transform usage (use for hover states only)

### 8.2 JavaScript
- Use event delegation (attach listeners to parent, not every child)
- Minimize DOM manipulation (batch updates)
- Debounce resize/scroll handlers
- Cache DOM queries (don't re-query same element)

### 8.3 Lazy Loading
- Lazy load images if present
- Load tables data on demand (pagination or infinite scroll)
- SVG icons (not image files)

---

## 9. TESTING CHECKLIST (Applies to All 4 Pages)

### 9.1 Tooltip Coverage
- [ ] All titles have (?) icons
- [ ] All metrics have (?) icons
- [ ] Hover reveals tooltip text
- [ ] Test on every page (Wizard, Dashboard, Bundle Config, Architecture)

### 9.2 Text Wrapping Consistency
- [ ] Check every multi-word label
- [ ] No unexpected line breaks
- [ ] Consistent break points across instances

### 9.3 Responsive Testing
- [ ] Test at 480px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1200px (desktop)
- [ ] All pages work at each breakpoint
- [ ] Tables don't overflow

### 9.4 Button & Interaction Testing
- [ ] All action buttons green and consistent size
- [ ] All delete buttons red with confirmation
- [ ] All export buttons blue
- [ ] All edit buttons black
- [ ] Position dropdowns work
- [ ] Sort headers toggle ↑↓ indicators
- [ ] Drag-and-drop works (primary: dropdown, secondary: drag handles)

### 9.5 Table Consistency
- [ ] Row # column present and auto-updates
- [ ] All headers sortable
- [ ] Sort indicator shows direction
- [ ] Comment field in every row
- [ ] Delete button in every row
- [ ] Export button in every row
- [ ] Position dropdown in every row
- [ ] Edit button present (if row is editable)

### 9.6 Color & Typography
- [ ] All colors match palette (green, red, blue, orange)
- [ ] Typography consistent (h1, h2, h3, body, small)
- [ ] Spacing uses 8px grid (8, 12, 16, 20, 30px)
- [ ] No random margins/padding

### 9.7 Accessibility
- [ ] All interactive elements keyboard-accessible
- [ ] Tab order logical
- [ ] Focus states visible
- [ ] Touch targets 44px minimum on mobile
- [ ] Color not sole indicator
- [ ] Alt text on icons

### 9.8 No Duplicate Elements
- [ ] No duplicate step indicators
- [ ] No duplicate section titles
- [ ] No duplicate buttons
- [ ] No orphaned elements without purpose

---

## 10. FUTURE ENHANCEMENT PRINCIPLES

### 10.1 Pattern-Based Development
- New features must follow existing patterns (not create new patterns)
- Before adding feature, check if it exists elsewhere
- Copy the pattern, don't invent new UI

### 10.2 Consistency-First Checklist
1. Feature exists elsewhere? → Copy pattern
2. Feature is new? → Document rule explicitly
3. Apply rule to ALL similar elements (not just this one)
4. Test across all affected pages
5. Update this design system document

### 10.3 Documentation Requirement
- Every UI pattern must have:
  - Name (e.g., "Tooltip Icon Rule")
  - Rule statement (1 sentence)
  - Implementation (code example)
  - Where it applies (all pages)
  - Test checklist

### 10.4 Governance
- Design decisions made once, implemented everywhere
- No exceptions. If inconsistency exists, it's a bug
- Consistency is non-negotiable in enterprise context

---

## 11. GLOSSARY OF TERMS

- **Component:** Reusable UI element (button, input, dropdown)
- **Pattern:** Combination of components + behavior (e.g., Data Table Pattern)
- **Rule:** Hardwired constraint that applies everywhere
- **Breakpoint:** Viewport width trigger for responsive design (480px, 768px, 1200px)
- **Tooltip:** Hover-triggered explanation (implemented with title attribute)
- **Wireframe Box:** Colored container for semantic grouping (input=blue, output=green, action=orange)
- **Sort Indicator:** Visual symbol showing sort direction (↑ ascending, ↓ descending)
- **Reorder Dropdown:** Position selector for changing row order (PRIMARY method for moving rows)

---

## 12. REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-06 | Initial design system document. Extracted from ETSC prototype conversation. Hardwired all consistency rules. |

---

**Document Generated:** 2026-07-06  
**Last Updated:** 2026-07-06  
**Status:** Active (applies to all current and future ETSC pages)

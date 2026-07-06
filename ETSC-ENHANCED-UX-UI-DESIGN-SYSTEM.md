# ETSC Enhanced UX/UI Design System (Comprehensive)

---

# TAB 1: UX (User Experience)

## 1.1 Core UX Principles

### Clarity
- Every element has a clear purpose and labeling
- No ambiguous buttons or unclear actions
- Users understand what happens when they click
- Information hierarchy is obvious
- Error messages explain what went wrong AND how to fix it

### Efficiency
- Minimum number of clicks to complete any task
- Logical flow from start to finish
- Progressive disclosure (show what's needed now, hide advanced options)
- Keyboard shortcuts for power users
- Auto-save where possible to prevent data loss

### Feedback
- User knows state of every action
- Loading states are indicated (spinner, "Loading...", etc.)
- Success confirmation after actions (toast, modal, change in UI)
- Changes are immediately visible (no silent failures)
- Errors are specific and actionable

### Accessibility
- Works for all abilities (vision, hearing, motor, cognitive)
- Keyboard navigation fully functional
- Screen reader compatible (proper labels, ARIA)
- Color not the only indicator (use icons, text, patterns)
- Touch targets at least 44px on mobile

### Consistency
- Patterns repeat predictably across all pages
- Same elements look and behave the same everywhere
- Vocabulary is consistent (not "Create" on one page and "Add" on another)
- Navigation structure is predictable
- Visual design is cohesive

---

## 1.2 Interaction Patterns

### Pattern 1: Form Input

**Structure:**
```
Label (required marker if needed)
    ↓
Input field with placeholder
    ↓
Optional: Help text below
    ↓
On error: Error message in red
```

**Requirements:**
- [ ] Label positioned above input
- [ ] Label uses $font-size-md (16px), $font-weight-medium
- [ ] Input height: $input-height (40px)
- [ ] Placeholder shows example of expected input
- [ ] Tooltip (?) next to label explains what data is needed
- [ ] Help text below input provides guidance
- [ ] Error message appears below input in $color-action-danger (#ff6b6b)
- [ ] Required marker (*) appears next to label if field is required
- [ ] Focus state: border changes to $color-action-info (#0066cc)
- [ ] Focus state: background stays white (no distracting changes)
- [ ] Disabled state: grayed out (#ccc), cursor: not-allowed
- [ ] Tab order logical (top to bottom, left to right)

**Interaction flow:**
1. User clicks on input → focus border appears (blue)
2. User types → placeholder disappears
3. User leaves field → validation runs
4. If invalid → error message appears in red
5. If valid → no error message, green border or checkmark (optional)

**Example:**
```
Goal Name (?)                    ← Label with tooltip
[Goal Name - make it specific]   ← Input with placeholder
What is your primary goal?       ← Help text
```

---

### Pattern 2: Button

**Structure:**
```
Visible button with clear action text
State changes on interaction
Disabled state obvious
Confirmation for destructive actions
```

**Requirements:**
- [ ] Clear action verb ("Create", "Delete", "Export", not "OK" or "Submit")
- [ ] Button height: $button-height-md (40px)
- [ ] Font size: $font-size-base (14px), $font-weight-semibold
- [ ] Action button color: $color-action-primary (#50c878)
- [ ] Delete button color: $color-action-danger (#ff6b6b)
- [ ] Secondary button color: $color-neutral-bg-alt with border
- [ ] Padding: $spacing-lg horizontal (16px), $spacing-md vertical (12px)
- [ ] Hover state: darker shade of button color (visually distinct)
- [ ] Active/pressed state: even darker
- [ ] Disabled state: #ccc, cursor: not-allowed, no hover change
- [ ] Loading state: spinner or "..." text, disabled
- [ ] Confirmation required for destructive actions (delete, clear, remove)
- [ ] Button width: flexible, minimum 100px

**Interaction flow:**
1. User hovers → button color darkens (visual feedback)
2. User clicks → button state changes (active, loading, or success)
3. For destructive actions → confirmation modal appears
4. User confirms → action executes
5. Success state → user sees result immediately

**Button types:**
- Primary action: Green (#50c878) - "Create Goal", "Save Changes", "Submit"
- Danger action: Red (#ff6b6b) - "Delete", "Remove", "Clear All"
- Secondary action: Blue (#4da6ff) - "Export", "Copy", "Cancel"
- Ghost button: Border only - for less prominent actions

**Example:**
```
[Create Goal] ← Primary action button
[Export]      ← Secondary action button
[Delete]      ← Danger action button
```

---

### Pattern 3: Table

**Structure:**
```
Header row (dark background, sortable)
    ↓
Data rows (alternating or consistent background)
    ↓
Action buttons in last columns
    ↓
Optional: Group/hierarchy support
```

**Requirements:**
- [ ] Row numbers in first column (#), right-aligned, #666 color
- [ ] Column headers sortable (cursor: pointer on hover)
- [ ] Sort indicator (↑ or ↓) shows current sort direction
- [ ] Header background: $color-neutral-bg-alt (#f5f5f5)
- [ ] Header font: $font-size-base (14px), $font-weight-semibold
- [ ] Header padding: $spacing-lg (16px)
- [ ] Row padding: $spacing-md (12px)
- [ ] Row border-bottom: 1px $color-neutral-border (#ddd)
- [ ] Row hover background: $color-neutral-bg-hover (#f9f9f9)
- [ ] Every data column has header with tooltip (?)
- [ ] Every row has action buttons: Edit, Delete, Export
- [ ] Action buttons height: $button-height-sm (32px, compact)
- [ ] Action buttons gap: $spacing-md (12px)
- [ ] Comment field per row (for notes, optional)
- [ ] Position dropdown per row (if reordering needed)
- [ ] Scrollable on mobile without breaking layout
- [ ] No horizontal scroll unless necessary

**Interaction flow:**
1. User sees sortable headers (cursor changes to pointer)
2. User clicks header → table sorts by that column
3. Click again → sort direction reverses
4. User clicks Edit → form opens or inline edit activates
5. User clicks Delete → confirmation modal
6. User clicks Export → CSV downloads
7. User changes position → row moves, numbers auto-update
8. User types in comment → comment saves

**Table headers must have tooltips:**
- Capacity → "What % of participants should be selected?"
- Efficiency → "What is your target match rate?"
- Load → "How many participants can you screen?"
- Status → "Current completion status"
- Position → "Drag to reorder"
- Every custom metric needs explanation

**Example:**
```
# | Name      | Capacity | Efficiency | Status    | Position | Comment         | Actions
1 | Group A   | 50%      | 85%        | Active    | [1 ▼]    | [Add comment] | [Edit] [Delete]
2 | Group B   | 40%      | 92%        | Inactive  | [2 ▼]    | [Add comment] | [Edit] [Delete]
```

---

### Pattern 4: Dropdown/Select

**Structure:**
```
Visual indicator of current selection
List of options that expands on click
Keyboard navigation support
```

**Requirements:**
- [ ] Height: $input-height (40px)
- [ ] Font size: $font-size-base (14px)
- [ ] Placeholder option visible when no selection
- [ ] Options are readable (not cut off or truncated)
- [ ] Option list scrollable if many options
- [ ] Keyboard navigation: arrow keys move selection
- [ ] Keyboard: Enter key selects, Escape closes
- [ ] Matches input field styling (border, padding, radius)
- [ ] Focus state: blue border like inputs
- [ ] On change: value updates immediately
- [ ] Visual indicator that more options exist (arrow down icon)

**Interaction flow:**
1. User clicks dropdown → list appears
2. User scrolls through options → highlighted option changes
3. User clicks option or presses Enter → selection made
4. Dropdown closes, selected value shows
5. Parent component updates based on selection

**Example (Position Dropdown):**
```
Position: [2 ▼]  ← Shows current position
Options when clicked:
  Position 1
  Position 2 ← Currently selected
  Position 3
  Position 4
```

---

### Pattern 5: Modal/Dialog

**Structure:**
```
Overlay (dimmed background)
    ↓
Modal container (white background)
    ↓
Header (title + close button)
    ↓
Body (content)
    ↓
Footer (buttons)
```

**Requirements:**
- [ ] Clear, descriptive title
- [ ] Close button (X) in top right corner
- [ ] Modal header padding: $spacing-xl (20px)
- [ ] Modal body padding: $spacing-xl (20px)
- [ ] Modal footer padding: $spacing-xl (20px)
- [ ] Cancel/Confirm buttons at bottom
- [ ] Primary button (green): action to perform
- [ ] Secondary button (gray): cancel/back
- [ ] Background overlay dimmed (not completely black)
- [ ] Modal centered on screen
- [ ] Escape key closes modal
- [ ] Click outside modal closes it (for non-critical modals)
- [ ] For critical modals (delete confirmation): no click-outside close
- [ ] Focus trapped inside modal (Tab loops within modal)

**Interaction flow:**
1. User triggers action that needs confirmation
2. Modal appears with dimmed background
3. User reads content
4. User clicks Confirm or Cancel
5. Modal closes and action is taken (or cancelled)
6. Focus returns to triggering element

**Types of modals:**
- Confirmation: "Are you sure you want to delete?"
- Form: "Edit participant details"
- Alert: "Operation complete! 42 rows exported."
- Loading: "Processing your request..."

**Example (Delete Confirmation):**
```
┌─────────────────────────────────────┐
│ Delete Participant?              [X]│
├─────────────────────────────────────┤
│                                     │
│ Are you sure? This action cannot be │
│ undone. All associated data will be │
│ permanently deleted.                │
│                                     │
├─────────────────────────────────────┤
│ [Cancel]                   [Delete] │
└─────────────────────────────────────┘
```

---

### Pattern 6: Tooltip

**Structure:**
```
(?) icon hoverable/clickable
    ↓
On hover/click: small popup appears
    ↓
Popup contains 1-2 sentence explanation
    ↓
Disappears on mouseleave or click elsewhere
```

**Requirements:**
- [ ] Shape: Circle, 20x20px
- [ ] Icon: "?" centered inside
- [ ] Background: light gray
- [ ] Text color: dark gray
- [ ] Trigger: mouse hover or click
- [ ] Content: 1-2 sentences explaining the metric/field
- [ ] Font: $font-size-sm (13px), $font-weight-normal
- [ ] Placement: right or below element (avoid screen edges)
- [ ] Dismissable: click elsewhere or mouse out
- [ ] Z-index: above other content
- [ ] Max-width: 200px (prevent overly wide tooltips)
- [ ] Padding: $spacing-md (12px)

**WHERE TO USE TOOLTIPS:**
- Every metric/column header (Capacity, Efficiency, Load, Status)
- Every form label (Initial Draft, Timeline, Budget, Verification Threshold)
- Every button that isn't self-explanatory
- Every step title in wizards
- Every section title in complex pages
- Every custom field with non-obvious meaning

**RULE:** If user might not immediately understand it → add (?) tooltip

**Example:**
```
Capacity (?)
│
├─→ Tooltip on hover: "What percentage of total participants should be selected for this group?"
```

---

## 1.3 User Flows

### Flow 1: Create Goal (Wizard Flow)

```
START
    ↓
Step 1: Draft
  - Enter goal name
  - Enter goal description
  → [Next] button enabled
    ↓
Step 2: Analyze
  - Set initial draft date
  - Set verification threshold
  → [Next] button enabled
    ↓
Step 3: Confirm
  - Review all entries
  - Confirm accuracy
  → [Next] button enabled
    ↓
Step 4: Scope
  - Select participants
  - Set timeline
  → [Next] button enabled
    ↓
Step 5: Bundle
  - Group participants
  - Set bundles
  → [Next] button enabled
    ↓
Step 6: Review
  - Final review of all settings
  - Option to edit previous steps
  → [Create Goal] button enabled
    ↓
Step 7: Success
  - Goal created confirmation
  - Show goal ID
  - Offer next actions (View Goal, Create Another, Return to Dashboard)
    ↓
END
```

**Requirements:**
- [ ] Progress indicator shows all 7 steps
- [ ] Can navigate backward (Back button)
- [ ] Cannot skip steps
- [ ] Form validation before Next button works
- [ ] All entered data persists when navigating back
- [ ] Success state shows confirmation message
- [ ] Success state displays new goal ID
- [ ] Success state offers clear next actions

---

### Flow 2: Manage Participant

```
START (Dashboard)
    ↓
List view (table of all participants)
  - Sortable columns
  - Search/filter (optional)
  - Add button visible
    ↓
[Add Participant] button
    ↓
Form appears (modal or new page)
  - Enter participant details
  - Set availability
  - Add to group
  → [Create] button
    ↓
Form validation
  - If invalid: show errors
  - User fixes and re-submits
    ↓
If valid: Participant added
    ↓
List updates automatically
  - New row appears at bottom
  - Row numbers recalculate
    ↓
Option to:
  - Edit participant (click Edit button)
  - Delete participant (click Delete, confirm)
  - Export participant data (click Export)
    ↓
Changes persist to database
    ↓
END
```

**Requirements:**
- [ ] Table displays all participants
- [ ] Add button creates new participant
- [ ] Edit button opens form with existing data
- [ ] Delete button shows confirmation modal
- [ ] Export button downloads CSV
- [ ] Row numbers auto-update after changes
- [ ] Comment field per row for notes
- [ ] Position dropdown to reorder participants
- [ ] All changes save immediately
- [ ] No data loss if user navigates away

---

### Flow 3: Export Data

```
START (Dashboard)
    ↓
[Export] button clicked
    ↓
Format selection (if multiple options)
  - CSV (default)
  - Excel (if available)
  - JSON (if available)
    ↓
User selects format
    ↓
File generation starts
  - Loading state shown
  - User sees "Exporting..."
    ↓
File downloads
  - Filename: [resource]-[date].csv
  - Example: participants-2024-01-15.csv
    ↓
Success notification
  - Toast or modal: "Export successful!"
  - Option to open file or return to dashboard
    ↓
END
```

**Requirements:**
- [ ] Clear export button on page
- [ ] Format selection (if multiple)
- [ ] Loading state during export
- [ ] File downloads with meaningful name
- [ ] Success confirmation after download
- [ ] Large exports don't hang UI (show progress)
- [ ] Error handling (show if export fails)

---

## 1.4 Accessibility Checklist (UX)

### Form Accessibility
- [ ] All form fields have associated labels (<label> with for attribute)
- [ ] All required fields marked with * or "required"
- [ ] Error messages are specific and actionable ("Email must contain @" not "Invalid")
- [ ] Error messages linked to specific fields
- [ ] Help text provided for complex fields
- [ ] Form can be navigated with Tab key
- [ ] Tab order is logical (top-to-bottom, left-to-right)
- [ ] Submit button is keyboard accessible (Enter key)

### Button Accessibility
- [ ] All buttons have descriptive text (not "OK", "Go", "Do it")
- [ ] Buttons are keyboard accessible (Tab + Enter)
- [ ] Button states are visually distinct (normal, hover, active, disabled)
- [ ] Disabled buttons are obvious (grayed out, cursor: not-allowed)
- [ ] Button text is descriptive enough for screen readers

### Navigation & Structure
- [ ] Page has logical heading hierarchy (h1, h2, h3...)
- [ ] No skipped heading levels (don't jump from h1 to h3)
- [ ] Main content section identified
- [ ] Navigation areas clearly marked
- [ ] Focus order is logical throughout page

### Color & Contrast
- [ ] Text contrast minimum 7:1 on primary content
- [ ] Secondary text contrast minimum 5.5:1
- [ ] Color not the only indicator (use icons + text)
- [ ] Link text is distinguishable from body text
- [ ] Focus states are clearly visible (not just a thin outline)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab key moves through elements in logical order
- [ ] Shift+Tab moves backward through elements
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and menus
- [ ] Arrow keys work in dropdowns/tables/lists
- [ ] No keyboard traps (user can always escape)

### Screen Reader Compatibility
- [ ] Page has descriptive title
- [ ] Images have alt text (or marked as decorative)
- [ ] Icons have labels or aria-labels
- [ ] Form labels are properly associated
- [ ] Table headers are marked as <th>
- [ ] Relationships between elements are clear
- [ ] Dynamic content updates are announced

### Touch Accessibility (Mobile)
- [ ] Touch targets are at least 44px x 44px
- [ ] Buttons have adequate spacing (not too close)
- [ ] Text is readable at default zoom (not too small)
- [ ] Landscape mode works (not broken)
- [ ] No horizontal scroll required for content
- [ ] Hover states don't prevent interaction on touch

### Cognitive Accessibility
- [ ] Page purpose is clear
- [ ] Instructions are simple and clear
- [ ] Error messages help user recover
- [ ] Consistent navigation across pages
- [ ] Abbreviations are explained
- [ ] Jargon is avoided or explained
- [ ] Content is organized logically
- [ ] Options are presented clearly (not overwhelming)

---

# TAB 2: UI (User Interface)

## 2.1 Visual Design Rules

### Color Application Rules

**Action Buttons:**
- Color: $color-action-primary (#50c878 - green)
- Text: #ffffff (white)
- Contrast: 4.5:1 ✓
- Usage: Primary actions (Create, Save, Submit)
- Hover: Darker green (#45a86d)
- Disabled: #ccc gray

**Delete/Danger Buttons:**
- Color: $color-action-danger (#ff6b6b - red)
- Text: #ffffff (white)
- Contrast: 5.5:1 ✓
- Usage: Destructive actions (Delete, Remove, Clear)
- Hover: Darker red (#ee5a5a)
- Disabled: #ccc gray

**Secondary Buttons:**
- Color: $color-neutral-bg-alt (#f5f5f5 - light gray)
- Text: #1a1a1a (dark)
- Border: 1px #ddd
- Contrast: 18.5:1 ✓
- Usage: Alternative actions (Export, Copy, Cancel)
- Hover: Darker gray background (#e8e8e8)

**Info/Secondary Action Buttons:**
- Color: $color-action-info (#4da6ff - blue)
- Text: #ffffff (white)
- Contrast: 6.2:1 ✓
- Usage: Secondary actions, focus states
- Hover: Darker blue (#3d8de6)

**Primary Text:**
- Color: $color-neutral-dark (#1a1a1a)
- Usage: All body text, content user must read
- Contrast on white: 21:1 ✓✓✓
- Size: $font-size-base (14px) or larger
- Weight: $font-weight-normal (400)

**Secondary Text:**
- Color: $color-neutral-medium (#4d4d4d)
- Usage: Descriptions, explanations, less critical info
- Contrast on white: 8:1 ✓
- Size: $font-size-sm (13px) or $font-size-base (14px)
- Weight: $font-weight-normal (400)

**Tertiary/Hint Text:**
- Color: $color-neutral-light (#999)
- Usage: Placeholders, captions, very secondary info
- Contrast on white: 4.5:1 ✓ (acceptable for hints only)
- Size: $font-size-xs (12px) or $font-size-sm (13px)
- Weight: $font-weight-normal (400)

**Links:**
- Color: $color-action-info (#4da6ff)
- Underline: yes (for clarity)
- Hover: darker (#3d8de6) + underline
- Contrast: 6.2:1 ✓

**Error/Validation:**
- Color: $color-action-danger (#ff6b6b)
- Usage: Error messages, invalid fields
- Contrast: varies by background
- Weight: $font-weight-normal (400)

**Success/Positive:**
- Color: $color-success (#90ee90)
- Usage: Success messages, completed states
- Border/background only (not text, text is too light)

**Warning/Caution:**
- Color: $color-warning (#ffd700)
- Usage: Warning messages, caution states
- Text color when used: #1a1a1a (dark)

---

### Typography Application Rules

**Page Title (h1)**
- Font size: $font-size-xxl (24px)
- Font weight: $font-weight-bold (700)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Margin-bottom: $spacing-lg (16px)
- Usage: Main page title, appears once per page

**Example:** "Goal Definition Wizard", "Participant Dashboard"

---

**Section Title (h2)**
- Font size: $font-size-lg (18px)
- Font weight: $font-weight-semibold (600)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Margin-top: $spacing-xl (20px)
- Margin-bottom: $spacing-lg (16px)
- Usage: Major sections within page

**Example:** "Define Your Goal", "Participant Selection", "Review Configuration"

---

**Subsection Title (h3)**
- Font size: $font-size-md (16px)
- Font weight: $font-weight-semibold (600)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Margin-top: $spacing-lg (16px)
- Margin-bottom: $spacing-md (12px)
- Usage: Subsections, minor headings

**Example:** "Timeline", "Budget", "Verification Method"

---

**Body Text**
- Font size: $font-size-base (14px)
- Font weight: $font-weight-normal (400)
- Line height: $line-height-normal (1.6)
- Color: $color-neutral-dark (#1a1a1a)
- Margin-bottom: $spacing-lg (16px) between paragraphs
- Usage: Descriptions, explanations, content

**Example:** "Enter the goal you want to achieve. Be as specific as possible."

---

**Form Labels**
- Font size: $font-size-md (16px)
- Font weight: $font-weight-medium (500)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Margin-bottom: $spacing-sm (8px)
- Usage: Form field labels

**Example:** "Goal Name", "Initial Draft Date"

---

**Help Text / Secondary Labels**
- Font size: $font-size-sm (13px)
- Font weight: $font-weight-normal (400)
- Line height: $line-height-normal (1.6)
- Color: $color-neutral-medium (#4d4d4d)
- Margin-top: $spacing-sm (8px)
- Usage: Instructions, field help, clarifications

**Example:** "What is your primary goal? Be specific."

---

**Button Text**
- Font size: $font-size-base (14px)
- Font weight: $font-weight-semibold (600)
- Line height: $line-height-tight (1.2)
- Color: varies (white on colored buttons, dark on light buttons)
- Usage: Button labels

**Example:** "Create Goal", "Delete", "Export"

---

**Table Header Text**
- Font size: $font-size-base (14px)
- Font weight: $font-weight-semibold (600)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Usage: Column headers

**Example:** "Name", "Capacity", "Status"

---

**Table Data Text**
- Font size: $font-size-base (14px)
- Font weight: $font-weight-normal (400)
- Line height: $line-height-tight (1.2)
- Color: $color-neutral-dark (#1a1a1a)
- Usage: Cell content

**Example:** Row data values

---

**Placeholder Text**
- Font size: $font-size-base (14px)
- Font weight: $font-weight-normal (400)
- Color: $color-neutral-light (#999)
- Usage: Input placeholder, example text

**Example:** "Enter goal name...", "Select position..."

---

**Captions & Metadata**
- Font size: $font-size-xs (12px)
- Font weight: $font-weight-normal (400)
- Color: $color-neutral-medium (#4d4d4d)
- Usage: Row numbers, timestamps, small info

**Example:** "#123", "Updated 2 hours ago"

---

### Spacing Application Rules

**Inside Buttons:**
- Horizontal padding: $spacing-lg (16px)
- Vertical padding: $spacing-md (12px)
- Total button height: $button-height-md (40px)
- Result: Spacious, easy to click button

---

**Inside Inputs:**
- Horizontal padding: $spacing-md (12px)
- Vertical padding: 12px (to center text in 40px height)
- Total input height: $input-height (40px)

---

**Between Form Fields:**
- Label to input: $spacing-sm (8px)
- Input to next field: $spacing-lg (16px)
- Between form sections: $spacing-xl (20px)

---

**Between Buttons:**
- Gap when buttons are in a row: $spacing-md (12px)
- Button group is right-aligned or centered as spec requires

---

**Table Spacing:**
- Header padding: $spacing-lg (16px all sides)
- Row padding: $spacing-md (12px all sides)
- Column gap: $spacing-lg (16px)
- Border between rows: 1px #ddd
- Row hover background: #f9f9f9

---

**Section Spacing:**
- Padding inside section: $spacing-xl (20px)
- Gap to next section: $spacing-4xl (40px)
- Margin around container: $spacing-xxl (30px)

---

### Border & Outline Rules

**Default Borders:**
- Width: 1px
- Color: $color-neutral-border (#ddd)
- Radius: $border-radius-default (4px)
- Usage: Input fields, cards, tables

---

**Focus Borders:**
- Width: 2px (thicker for visibility)
- Color: $color-action-info (#0066cc)
- Radius: $border-radius-default (4px)
- Usage: When element has keyboard focus

---

**Disabled Borders:**
- Width: 1px
- Color: #ccc (lighter gray)
- Radius: $border-radius-default (4px)
- Background: #f5f5f5 (lighter background)

---

**Error Borders:**
- Width: 2px
- Color: $color-action-danger (#ff6b6b)
- Radius: $border-radius-default (4px)
- Background: #fff5f5 (light red tint)

---

**Table Borders:**
- Row separator: 1px #ddd
- Header separator: 1px #ddd
- No vertical lines (clean look)

---

**Shadows:**
- Subtle: 0 2px 8px rgba(0,0,0,0.1) (most common)
- None on most elements (clean, flat design)
- Used on modals and floating elements for depth

---

## 2.2 Component Library

### Component 1: Button

**Specification:**

| Property | Value |
|----------|-------|
| Height | $button-height-md (40px) |
| Padding horizontal | $spacing-lg (16px) |
| Padding vertical | $spacing-md (12px) |
| Font size | $font-size-base (14px) |
| Font weight | $font-weight-semibold (600) |
| Border radius | 4px |
| Border | None (solid fill) |
| Cursor | pointer (enabled), not-allowed (disabled) |

**Button Variants:**

**Primary (Action):**
- Background: $color-action-primary (#50c878)
- Text: #ffffff
- Hover: #45a86d (darker green)
- Active: #3a8a5c (even darker)
- Disabled: #ccc

**Danger:**
- Background: $color-action-danger (#ff6b6b)
- Text: #ffffff
- Hover: #ee5a5a (darker red)
- Active: #d44545 (even darker)
- Disabled: #ccc

**Secondary:**
- Background: $color-neutral-bg-alt (#f5f5f5)
- Text: $color-neutral-dark (#1a1a1a)
- Border: 1px $color-neutral-border (#ddd)
- Hover: #e8e8e8 (darker background)
- Active: #d8d8d8 (even darker)
- Disabled: #ccc

**Button States:**
- Normal: Solid color, visible
- Hover: Slightly darker shade
- Active: Darker, pressed appearance
- Disabled: #ccc, cursor: not-allowed, no hover change
- Loading: Spinner icon, disabled state

**Code Pattern:**
```html
<button class="btn btn-primary">Create Goal</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-primary" disabled>Disabled</button>
```

**WHERE TO USE:** Any action that changes state (create, edit, delete, export, submit, next, back)

**CRITICAL RULES:**
- [ ] All buttons are $button-height-md (40px)
- [ ] All buttons have clear action text (verb + noun: "Create Goal", not "Go")
- [ ] Action buttons are green (#50c878)
- [ ] Delete buttons are red (#ff6b6b)
- [ ] Secondary buttons are gray with border
- [ ] All buttons have visible hover state
- [ ] Disabled buttons are obviously disabled (#ccc)
- [ ] No button styling deviations

---

### Component 2: Input Field

**Specification:**

| Property | Value |
|----------|-------|
| Height | $input-height (40px) |
| Padding horizontal | $spacing-md (12px) |
| Padding vertical | 12px (centered in 40px) |
| Border | 1px $color-neutral-border (#ddd) |
| Border radius | 4px |
| Font size | $font-size-base (14px) |
| Font weight | $font-weight-normal (400) |
| Focus border | 2px $color-action-info (#0066cc) |
| Focus background | #ffffff (no change) |
| Placeholder color | $color-neutral-light (#999) |
| Disabled background | #f5f5f5 |
| Disabled border | 1px #ccc |
| Disabled cursor | not-allowed |

**Input States:**

| State | Border | Background | Cursor | Notes |
|-------|--------|-----------|--------|-------|
| Default | 1px #ddd | #ffffff | text | Normal input state |
| Focused | 2px #0066cc | #ffffff | text | When user clicks/tabs |
| Filled | 1px #ddd | #ffffff | text | After user types |
| Disabled | 1px #ccc | #f5f5f5 | not-allowed | Not interactive |
| Error | 2px #ff6b6b | #fff5f5 | text | Validation failed |

**Input Types Supported:**
- Text (default)
- Email
- Password
- Number
- Textarea (taller, flexible)
- Select/Dropdown (same height)
- Date picker (same height)
- Search

**Code Pattern:**
```html
<label for="goalName">Goal Name (?)</label>
<input 
  id="goalName" 
  type="text" 
  placeholder="Enter goal name..."
  aria-describedby="goalHelp"
>
<small id="goalHelp">What is your primary goal?</small>
<span class="error" id="goalError">This field is required</span>
```

**WHERE TO USE:** Any data entry (forms, editable fields, search)

**CRITICAL RULES:**
- [ ] All inputs are $input-height (40px)
- [ ] All inputs have visible labels
- [ ] All labels have font size $font-size-md (16px), weight medium
- [ ] All inputs have placeholder text
- [ ] All inputs have help text or tooltip
- [ ] All required fields marked with (*)
- [ ] Focus state is visually distinct (blue border)
- [ ] Error state shows red text below
- [ ] No custom input heights
- [ ] Consistent across all pages

---

### Component 3: Table

**Specification:**

| Property | Value |
|----------|-------|
| Header background | $color-neutral-bg-alt (#f5f5f5) |
| Header padding | $spacing-lg (16px) |
| Header font-weight | $font-weight-semibold (600) |
| Row padding | $spacing-md (12px) |
| Row border-bottom | 1px #ddd |
| Row hover background | $color-neutral-bg-hover (#f9f9f9) |
| Font size | $font-size-base (14px) |
| Column gap | $spacing-lg (16px) |

**Table Structure:**
- Row number column (# - 40px width, right-aligned)
- Data columns (sortable headers with tooltip)
- Action column (Edit, Delete, Export buttons)
- Optional: Comment field per row
- Optional: Position dropdown per row

**Table Features:**
- [ ] Headers are sortable (cursor: pointer, sort indicator ↑↓)
- [ ] Every header has tooltip (?)
- [ ] Row numbers auto-update after changes
- [ ] Rows have delete button (with confirmation)
- [ ] Rows have edit button (edit form or inline)
- [ ] Rows have export button (download CSV of row)
- [ ] Rows have optional comment field
- [ ] Rows have optional position dropdown
- [ ] Hover state on rows (background color change)
- [ ] Mobile responsive (horizontal scroll with care)

**Code Pattern:**
```html
<table>
  <thead>
    <tr>
      <th>#</th>
      <th class="sortable">Name (?)</th>
      <th class="sortable">Capacity (?)</th>
      <th>Status</th>
      <th>Comment</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="row-number">1</td>
      <td>Group A</td>
      <td>50%</td>
      <td>Active</td>
      <td><input class="comment" placeholder="Add comment..."></td>
      <td>
        <button class="btn btn-sm">Edit</button>
        <button class="btn btn-danger btn-sm">Delete</button>
        <button class="btn btn-secondary btn-sm">Export</button>
      </td>
    </tr>
  </tbody>
</table>
```

**WHERE TO USE:** Display lists of data, manage multiple items, dashboards

**CRITICAL RULES:**
- [ ] All tables have row numbers (#)
- [ ] All headers are sortable with visual indicator
- [ ] All headers have tooltips (?)
- [ ] Every row has delete button
- [ ] Every row has appropriate action buttons
- [ ] Hover state visible (subtle background change)
- [ ] Padding and spacing follow tokens
- [ ] No hardcoded colors
- [ ] Consistent across all pages

---

### Component 4: Card/Section

**Specification:**

| Property | Value |
|----------|-------|
| Background | #ffffff or $color-neutral-bg-alt (#f5f5f5) |
| Padding | $spacing-xl (20px) |
| Border | 1px $color-neutral-border (#ddd) |
| Border radius | 4px |
| Margin-bottom | $spacing-4xl (40px) |
| Title font-size | $font-size-lg (18px) |
| Title font-weight | $font-weight-semibold (600) |
| Title color | $color-neutral-dark (#1a1a1a) |
| Title margin-bottom | $spacing-lg (16px) |

**Card/Section Types:**
- White background: For primary content sections
- Light gray background: For grouped/grouped related content
- Bordered: Standard card appearance
- No border: Borderless, minimal look

**Code Pattern:**
```html
<section class="card">
  <h2>Section Title (?)</h2>
  <p>Description or content here.</p>
  <button class="btn btn-primary">Action</button>
</section>
```

**WHERE TO USE:** Grouping related content, wizards, summaries, organization

**CRITICAL RULES:**
- [ ] Cards have consistent padding ($spacing-xl)
- [ ] Cards have titles
- [ ] Titles have tooltips if not self-explanatory
- [ ] Cards separated by $spacing-4xl (40px)
- [ ] No hardcoded padding values
- [ ] Colors use variables

---

## 2.3 Contrast Verification (UI Focus)

**For every element on every page:**

- [ ] Text contrast minimum 7:1 (primary content)
- [ ] Secondary text contrast minimum 5.5:1
- [ ] Border contrast minimum 3:1
- [ ] Icon contrast minimum 3:1
- [ ] Hover/active states visually distinct
- [ ] Disabled states obviously disabled (#ccc)
- [ ] All colors from approved palette
- [ ] Run through WebAIM contrast checker
- [ ] Test with color blindness simulator
- [ ] Print screen and view from distance

**IF CONTRAST FAILS:** Do not ship. Fix immediately.

---

## 2.4 Dark Mode (Future Consideration)

When dark mode is implemented:

```
$color-neutral-dark → #e0e0e0 (light text on dark)
$color-neutral-medium → #b0b0b0 (secondary light text)
$color-neutral-light → #707070 (tertiary light text)
$color-neutral-bg → #1a1a1a (dark background)
$color-neutral-bg-alt → #2d2d2d (darker sections)
$color-neutral-border → #444 (light borders on dark)
$color-action-primary → #50c878 (unchanged - good contrast both modes)
$color-action-danger → #ff6b6b (unchanged)
$color-action-info → #4da6ff (unchanged)
```

All other rules remain the same. Contrast verification required in both light and dark modes.

---

# TAB 3: PAGE TYPES LIBRARY

## Page Type 1: Wizard (Goal Definition)

**Purpose:** Multi-step form for complex data entry with validation and confirmation

**Structure:**
```
Header (Title + description)
    ↓
Step Indicator (visual progress)
    ↓
Step Content (form fields, inputs)
    ↓
Navigation Buttons (Back, Next/Submit)
    ↓
Success State (confirmation)
```

**Requirements:**
- [ ] Header clearly states wizard purpose
- [ ] Step indicator shows all steps + current progress
- [ ] Each step has title with tooltip (?)
- [ ] Each step has form fields with labels and help text
- [ ] Form labels have tooltips (?)
- [ ] All inputs follow input component spec
- [ ] All buttons follow button component spec
- [ ] Button heights: $button-height-md (40px)
- [ ] Button gaps: $spacing-md (12px)
- [ ] Font sizes follow typography scale
- [ ] Spacing follows 8px grid
- [ ] Progress is clearly visible (which step?)
- [ ] Can navigate backward (Back button)
- [ ] Cannot skip steps (Next disabled until valid)
- [ ] Form validation before next step
- [ ] All entered data persists when navigating back
- [ ] Success confirmation shows new ID
- [ ] Success offers next actions

**Success State Example:**
```
┌────────────────────────────────────────┐
│  ✓ Goal Created Successfully!          │
│                                        │
│  Goal ID: #12345                       │
│  Name: "Increase customer retention"   │
│                                        │
│  [View Goal] [Create Another] [Home]   │
└────────────────────────────────────────┘
```

**Example Pages:** Goal Definition Wizard

---

## Page Type 2: Dashboard (List + Manage)

**Purpose:** Display and manage list of items with sorting, filtering, and actions

**Structure:**
```
Header (Title + description)
    ↓
Action Buttons (Add, Export All, etc.)
    ↓
Table with:
  - Row numbers
  - Sortable headers with tooltips
  - Data columns
  - Comment field per row
  - Position dropdown per row
  - Action buttons (Edit, Delete, Export)
    ↓
Optional: Groups/Hierarchy
```

**Requirements:**
- [ ] Clear page title
- [ ] All table headers sortable
- [ ] All table headers have tooltips (?)
- [ ] Row numbers present, auto-update
- [ ] Delete has confirmation modal
- [ ] Comment field per row
- [ ] Export at row and full-table level
- [ ] Position dropdown per row (if reorderable)
- [ ] Button heights: $button-height-md (40px)
- [ ] Input heights: $input-height (40px)
- [ ] Spacing follows 8px grid
- [ ] Contrast verified on all elements
- [ ] Create/Add button prominent
- [ ] Groups/subgroups supported
- [ ] Collapsible hierarchy (if applicable)
- [ ] Mobile responsive

**Example Pages:** Participant Dashboard, Bundle Configuration

---

## Page Type 3: Summary/Overview

**Purpose:** Present high-level information, architecture, or system overview

**Structure:**
```
Header
    ↓
Sections (titled, with descriptions)
    ↓
Diagrams/Data Flow (if applicable)
    ↓
Backend Integration Points
```

**Requirements:**
- [ ] All labeled elements have tooltips (?)
- [ ] Clear hierarchy (h1, h2, h3)
- [ ] Data flow diagram easy to follow
- [ ] All measurements use design tokens
- [ ] All colors use color palette
- [ ] Spacing consistent with other pages
- [ ] Contrast verified on all elements
- [ ] Diagram readable on mobile (zoom or alternative)

**Example Pages:** Architecture Overview, System Summary

---

# TAB 4: PAGE ELEMENTS LIBRARY

## Element 1: Tooltip (?)

**Specification:**
- Shape: Circle, 20x20px
- Icon: "?" centered (14px font)
- Background: $color-neutral-light (#999) or #d9d9d9
- Text color: $color-neutral-dark (#1a1a1a)
- Hover: Darker background, cursor: help
- Trigger: Mouse hover (desktop), click (mobile)
- Content: 1-2 sentence explanation
- Font: $font-size-sm (13px), $font-weight-normal
- Padding: $spacing-md (12px)
- Max-width: 200px
- Placement: Right or below element (avoid screen edges)
- Z-index: above other content

**Code Pattern:**
```html
<span class="tooltip-icon" title="Explanation of what this field means">?</span>
```

**WHERE TO USE:**
- Every metric/column header (Capacity, Efficiency, Load, Status)
- Every form label (Initial Draft, Timeline, Budget)
- Every button that isn't self-explanatory
- Step titles in wizard
- Section titles in complex pages
- Every custom field with non-obvious meaning

**RULE:** If user might not understand it → add tooltip

---

## Element 2: Button (Action)

**Specification:**
- Height: $button-height-md (40px)
- Padding: $button-padding-h (16px h), $spacing-md (12px v)
- Font: $font-size-base (14px), $font-weight-semibold (600)
- Color: $color-action-primary (#50c878) for action
- Color: $color-action-danger (#ff6b6b) for delete
- Border: None (solid fill)
- Radius: 4px
- Text: Clear action verb ("Create", "Delete", "Export", not "OK")
- Hover: Darker shade
- Disabled: #ccc, cursor: not-allowed
- Cursor: pointer (enabled), not-allowed (disabled)

**Code Pattern:**
```html
<button class="btn btn-primary">Create Goal</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-secondary">Export</button>
```

**WHERE TO USE:** Any action that changes state

---

## Element 3: Input Field

**Specification:**
- Height: $input-height (40px)
- Padding: $spacing-md (12px h), 12px (v)
- Border: 1px #ddd (default), 2px #0066cc (focus)
- Font: $font-size-base (14px), $font-weight-normal
- Placeholder: $color-neutral-light (#999)
- Radius: 4px
- Label above: $font-size-md (16px), medium weight
- Label color: $color-neutral-dark
- Help text below: $font-size-sm (13px), medium gray
- Error text: $color-action-danger (#ff6b6b)

**Code Pattern:**
```html
<label for="name">Field Name (?)</label>
<input id="name" type="text" placeholder="Example...">
<small>Help text here</small>
<span class="error">Error message if invalid</span>
```

**WHERE TO USE:** Any data entry (forms, editable fields)

---

## Element 4: Table Header

**Specification:**
- Background: $color-neutral-bg-alt (#f5f5f5)
- Text color: $color-neutral-dark (#1a1a1a)
- Font: $font-size-base (14px), $font-weight-semibold
- Padding: $spacing-lg (16px)
- Border-bottom: 1px #ddd
- Sortable: cursor: pointer, underline on hover
- Sort indicator: "↑" or "↓" after text

**Code Pattern:**
```html
<th class="sortable">Column Name (?)</th>
```

**WHERE TO USE:** Every table

---

## Element 5: Table Row

**Specification:**
- Padding: $spacing-md (12px per side)
- Border-bottom: 1px #ddd
- Font: $font-size-base (14px)
- Text color: $color-neutral-dark
- Hover: Background #f9f9f9
- Row number: 40px width, right-aligned, gray text

**Code Pattern:**
```html
<tr>
  <td class="row-number">1</td>
  <td>Data</td>
  <td><input placeholder="Add comment..."></td>
  <td><button class="btn btn-sm">Edit</button></td>
  <td><button class="btn btn-danger btn-sm">Delete</button></td>
</tr>
```

**WHERE TO USE:** Every table

---

## Element 6: Card/Section

**Specification:**
- Background: #ffffff or #f5f5f5
- Padding: $spacing-xl (20px)
- Border: 1px #ddd
- Radius: 4px
- Margin-bottom: $spacing-4xl (40px)
- Title: h2 style (18px, semibold)

**Code Pattern:**
```html
<div class="card">
  <h2>Section Title (?)</h2>
  <p>Content here</p>
</div>
```

**WHERE TO USE:** Grouping related content

---

## Element 7: Position Dropdown

**Specification:**
- Height: $input-height (40px)
- Options: "Position 1", "Position 2", etc.
- Font: $font-size-base (14px)
- On change: Row moves to selected position
- Auto-update: Row numbers recalculate

**Code Pattern:**
```html
<select class="position-dropdown">
  <option value="1">Position 1</option>
  <option value="2">Position 2</option>
</select>
```

**WHERE TO USE:** Any table where rows can be reordered

---

## Element 8: Comment Field

**Specification:**
- Type: Text input
- Height: $input-height (40px)
- Placeholder: "Add comment..."
- Font: $font-size-base (14px)
- Per-row storage (for notes)

**Code Pattern:**
```html
<input type="text" placeholder="Add comment...">
```

**WHERE TO USE:** Every table row

---

## Element 9: Export Button (Per Row)

**Specification:**
- Height: $button-height-sm (32px, compact)
- Text: "Export"
- Color: $color-action-info (#4da6ff)
- On click: Download CSV of that row
- Filename: `[resource]-row-[date].csv`

**Code Pattern:**
```html
<button class="btn btn-sm btn-export">Export</button>
```

**WHERE TO USE:** Every table row

---

## Element 10: Group/Subgroup Structure

**Specification:**
- Group header: h3 with collapse/expand toggle
- Subgroup: Indented, similar style
- Items: Listed with all table features
- All levels have: Delete, Comment, Export, Position

**Code Pattern:**
```html
<div class="group">
  <h3>Group Name (?) <button class="toggle">−</button></h3>
  <div class="subgroup">
    <h4>Subgroup Name</h4>
    <table><!-- items --></table>
  </div>
</div>
```

**WHERE TO USE:** Dashboards, bundle config (hierarchies)

---

# FINAL VERIFICATION CHECKLIST (EXHAUSTIVE)

## For EVERY Page:

### Typography Verification
- [ ] Page title: $font-size-xxl (24px), $font-weight-bold?
- [ ] Section titles: $font-size-lg (18px), $font-weight-semibold?
- [ ] Form labels: $font-size-md (16px), $font-weight-medium?
- [ ] Body text: $font-size-base (14px), $font-weight-normal?
- [ ] Help text: $font-size-sm (13px)?
- [ ] NO custom font sizes used?
- [ ] Line-height values use tokens?

### Spacing Verification
- [ ] All margins/padding use tokens (8, 12, 16, 20, 30, 40px)?
- [ ] NO random pixel values?
- [ ] Button gaps: $spacing-md (12px)?
- [ ] Form field gaps: $spacing-lg (16px)?
- [ ] Section gaps: $spacing-4xl (40px)?
- [ ] Container margins: $spacing-xxl (30px)?

### Color Verification
- [ ] All text uses color palette?
- [ ] NO custom hex colors?
- [ ] Action buttons: $color-action-primary (#50c878)?
- [ ] Delete buttons: $color-action-danger (#ff6b6b)?
- [ ] Secondary buttons: gray with border?
- [ ] All text meets contrast requirements?
- [ ] Borders use $color-neutral-border (#ddd)?
- [ ] Focus states use $color-action-info (#0066cc)?

### Button Verification
- [ ] All buttons: $button-height-md (40px)?
- [ ] All buttons have clear action text?
- [ ] All action buttons: green (#50c878)?
- [ ] All delete buttons: red (#ff6b6b)?
- [ ] All buttons have hover state?
- [ ] All buttons have disabled state?
- [ ] Button padding correct ($spacing-lg h, $spacing-md v)?

### Form/Input Verification
- [ ] All inputs: $input-height (40px)?
- [ ] All labels: $font-size-md, medium weight?
- [ ] All inputs have labels?
- [ ] All inputs have placeholder text?
- [ ] All required fields marked with (*)?
- [ ] All inputs have help text or tooltip?
- [ ] Focus border: 2px $color-action-info?
- [ ] Error styling: red text, light red background?

### Table Verification
- [ ] All tables have row numbers (#)?
- [ ] All headers sortable?
- [ ] All headers have tooltips (?)?
- [ ] Every row has delete button?
- [ ] Every row has comment field?
- [ ] Every row has export button?
- [ ] Every row has position dropdown (if reorderable)?
- [ ] Header background: $color-neutral-bg-alt (#f5f5f5)?
- [ ] Row padding: $spacing-md (12px)?
- [ ] Hover row background: #f9f9f9?

### Tooltip Verification
- [ ] Every metric/column header has (?) tooltip?
- [ ] Every form label has (?) tooltip?
- [ ] Every section title has (?) tooltip?
- [ ] Every button that needs explanation has tooltip?
- [ ] NO unlabeled data or confusing fields?
- [ ] Tooltip font size: 13px?
- [ ] Tooltip max-width: 200px?

### Accessibility Verification
- [ ] Contrast ratio: minimum 7:1 on all text?
- [ ] Secondary text: minimum 5.5:1?
- [ ] All buttons: keyboard-accessible?
- [ ] All inputs have labels?
- [ ] Focus states: visually distinct?
- [ ] Focus states: 2px blue border?
- [ ] Touch targets: minimum 44px?
- [ ] Tab order: logical (top to bottom)?
- [ ] Keyboard navigation: Tab, Shift+Tab, Enter, Escape work?
- [ ] Screen reader: all elements have labels?

### Consistency Verification
- [ ] Page matches design tokens?
- [ ] NO deviations from pattern library?
- [ ] Matches other pages' styling?
- [ ] Hierarchy consistent?
- [ ] Button styles consistent?
- [ ] Input styles consistent?
- [ ] Spacing consistent?
- [ ] Color usage consistent?

### Responsive Verification
- [ ] Layout works at 480px (mobile)?
- [ ] Layout works at 768px (tablet)?
- [ ] Layout works at 1200px (desktop)?
- [ ] All text readable on mobile?
- [ ] Tables scroll without breaking?
- [ ] Buttons remain clickable at 44px min?
- [ ] Touch targets adequate on mobile?
- [ ] Form fields readable on mobile?

### Completeness Verification
- [ ] All sections have titles?
- [ ] All data columns have headers?
- [ ] All inputs have labels and help?
- [ ] All buttons have clear labels?
- [ ] NO empty states (show "No items" if needed)?
- [ ] Groups/subgroups present (if required)?
- [ ] All features from requirements present?
- [ ] Success states defined?
- [ ] Error states defined?
- [ ] Loading states indicated?

---

## ENFORCEMENT MECHANISM

**Before shipping ANY page:**
1. Run through entire checklist above ✓
2. Test contrast with WebAIM checker (minimum 7:1)
3. Test responsive at all 3 breakpoints (480, 768, 1200px)
4. Test keyboard navigation (Tab, Enter, Escape)
5. Test with screen reader (NVDA or equivalent)
6. Compare to design tokens (NO deviations)
7. Run through page elements library (match all patterns)
8. Print screenshot, view from 3 feet away (readability)

**IF ANY ITEM FAILS:** Page does NOT ship. Fix immediately.

**IF YOU'RE TEMPTED TO SKIP:** STOP. The "low satisfaction point" is exactly this moment. Do not skip.

---

**Status:** Comprehensive UX/UI Design System complete with mechanical enforcement.
**Enforcement:** Checklist prevents shipping incomplete/inconsistent design.
**Next Step:** Audit existing pages against this system (see ETSC-PAGE-AUDIT-RESULTS.md).

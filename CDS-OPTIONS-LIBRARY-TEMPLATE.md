---
title: "CDS Options Library Template"
date: 2026-07-06
status: GOVERNANCE
version: 1.0
---

# OPTIONS LIBRARY TEMPLATE

**Purpose:** Document each component/variant for the Options Library using this standardized template.

**Usage:** Copy this template for each library entry. Fill in all sections before marking component ready.

---

## LIBRARY ENTRY TEMPLATE

---

# [COMPONENT NAME]

## Overview

**What is this component?**
[One sentence describing what this component is, what problem it solves]

**When is it used?**
[Where in the application does this appear? What user workflows use it?]

**Why does it matter?**
[What benefit does this component provide to users?]

---

## Options Evaluated

**Problem Statement:**
[What challenge were we solving? What decisions did we need to make?]

**Option A: [Name]**
[Description of Option A. How does it work? What's its approach?]

**Option B: [Name]**
[Description of Option B. How does it work? Different approach?]

**Option C: [Name]**
[Description of Option C. How does it work? Third approach?]

---

## Evaluation Results

### Evaluation Criteria & Scores

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Accessibility | [/5] | [/5] | [/5] |
| Readability | [/5] | [/5] | [/5] |
| Consistency | [/5] | [/5] | [/5] |
| Performance | [/5] | [/5] | [/5] |
| Scalability | [/5] | [/5] | [/5] |
| Maintainability | [/5] | [/5] | [/5] |
| **TOTAL** | **/30** | **/30** | **/30** |

### Scoring Explanation

**Accessibility:** Can all users interact with this? (vision, hearing, motor, cognitive)
- [Option A score]: [Why this score? What accessibility features/issues?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

**Readability:** Is information clear and scannable?
- [Option A score]: [Why this score?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

**Consistency:** Does it match existing CDS patterns?
- [Option A score]: [Why this score?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

**Performance:** Does it load fast, render smoothly, scale efficiently?
- [Option A score]: [Why this score?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

**Scalability:** Works with 1 item? 100 items? 1000 items?
- [Option A score]: [Why this score?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

**Maintainability:** Can developers understand and modify it?
- [Option A score]: [Why this score?]
- [Option B score]: [Why this score?]
- [Option C score]: [Why this score?]

### Trade-offs Identified

- **Option A excels at:** [What's Option A's strength?]
- **Option B excels at:** [What's Option B's strength?]
- **Option C excels at:** [What's Option C's strength?]

**Winner Selection:**
- **Chosen:** [Option Name] ([Score]/30)
- **Why:** [Primary reasons for choosing this option?]
- **Sacrifice:** [What are we giving up by not choosing the others?]

---

## DEFAULT Option (Winner: [Name])

### Why Chosen
[Detailed explanation: scoring, trade-offs, rationale. Why this is the best overall choice.]

### Best For
[What scenarios is this option perfect for? When should users use this DEFAULT?]

### NOT Suitable For
[What scenarios need a variant instead? When should users NOT use this DEFAULT?]

### Description
[Complete description of how this component works, what it does, what it looks like]

---

## Code (DEFAULT)

### Component Structure
```javascript
// React component code (or Vue/etc as appropriate)
// Complete, functional, production-ready code
```

### Key Features
- [Feature 1]: [Description]
- [Feature 2]: [Description]
- [Feature 3]: [Description]

### Props/Configuration
```typescript
// TypeScript interface (or type definitions)
interface ComponentProps {
  prop1: type; // [Description]
  prop2: type; // [Description]
  prop3: type; // [Description]
}
```

### CSS/Styling
```css
/* All styling using design tokens, no custom values */
.component {
  /* styling */
}
```

---

## Wiring (DEFAULT)

### API Integration
[Which APIs does this component call? What data does it fetch?]

**API Endpoints Used:**
- `GET /api/[resource]` — [Purpose. Response structure?]
- `POST /api/[resource]` — [Purpose. Request body structure?]
- `PUT /api/[resource]/:id` — [Purpose]
- `DELETE /api/[resource]/:id` — [Purpose]

### Data Flow

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       ├─→ [API Call 1] → [Process Response] → [Update State]
       │
       ├─→ [User Action] → [Validation] → [API Call 2]
       │
       └─→ [Success/Error] → [Update UI]
```

### State Management
[How is state managed? Props? Local state? Redux? Context?]
- Initial state: [What's the starting state?]
- State updates: [What triggers state changes?]
- External data: [What comes from parent/API?]

### Event Handling
[What events does this component handle? What does it emit?]
- `onLoad` — [When data loads, what happens?]
- `onSave` — [When user saves, what API calls fire?]
- `onError` — [When something fails, how is it handled?]
- `onChange` — [When user modifies data?]

---

## Interconnections (DEFAULT)

### What This Component Connects To
[What other components/pages/systems does this interact with?]

**Depends on:**
- [Component A]: [Why? What data/events?]
- [Component B]: [Why? What data/events?]

**Feeds into:**
- [Component C]: [What does this component provide?]
- [Component D]: [What does this component provide?]

### Data Dependencies
```
Dashboard ← (uses) → Table Component
             ↓
        API: GET /api/participants
             ↓
        Returns: [{ id, name, status, ... }]
```

### Event Flow
[How do events propagate? Who listens? Who broadcasts?]
- User clicks [Element] → [Event fires] → [Handler updates] → [Another component reacts]

### Shared State
[What state is shared with other components?]
- [State A]: Shared with [Component]. Used for [purpose].
- [State B]: Shared with [Component]. Used for [purpose].

---

## Edge Cases (DEFAULT)

### Empty State
**Scenario:** No data available to display  
**Display:** [What does component show?]
```
[Mock-up or description]
```
**Message:** "No participants found. Click [Add] to create one."

### Loading State
**Scenario:** Data is being fetched  
**Display:** [Spinner? Skeleton? Placeholder?]
```
[Mock-up or description]
```
**Duration:** [How long is typical load time?]

### Error State
**Scenario:** API call fails or data is invalid  
**Display:** [Error message? Retry button?]
```
[Mock-up or description]
```
**Message:** "Failed to load participants. Please try again."
**Recovery:** User can click [Retry] to reload

### Success State
**Scenario:** Action completed successfully  
**Display:** [Confirmation? Toast? UI change?]
```
[Mock-up or description]
```
**Message:** "Participant created successfully!"
**Duration:** [Toast disappears after 3 seconds]

---

## Responsive Design (DEFAULT)

### Mobile (480px)
[How does component render on mobile?]
```
[Mock-up or description]
```
- [Specific adjustments made for mobile]

### Tablet (768px)
[How does component render on tablet?]
```
[Mock-up or description]
```
- [Specific adjustments made for tablet]

### Desktop (1200px)
[How does component render on desktop?]
```
[Mock-up or description]
```
- [Specific adjustments made for desktop]

---

## Accessibility (DEFAULT)

### WCAG Compliance
- **Level:** [AA / AAA]
- **Tested by:** [WebAIM Contrast Checker, NVDA, etc.]

### Keyboard Navigation
- [ ] Tab moves through interactive elements in logical order
- [ ] Shift+Tab moves backward
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/menus
- [ ] Arrow keys work in [dropdowns/tables/etc.]
- [ ] No keyboard traps

### Screen Reader Compatibility
- [ ] Page/component has descriptive title
- [ ] All buttons have clear labels
- [ ] All form fields have associated labels
- [ ] Images have alt text (or marked decorative)
- [ ] Table headers marked as `<th>`
- [ ] Dynamic updates announced (aria-live regions)

### Color & Contrast
- [ ] Text contrast: [Ratio] on [background]
- [ ] NOT color-only indicator (uses icon + text)
- [ ] Links distinguishable from body text
- [ ] Focus states visible (not just outline)

---

## Performance (DEFAULT)

### Load Time
- **Initial render:** [How long to first visual?]
- **Interactive ready:** [How long until clickable?]
- **Large dataset (500 items):** [Render time?]

### Optimization
- [Optimization technique 1]: [How implemented?]
- [Optimization technique 2]: [How implemented?]
- [Optimization technique 3]: [How implemented?]

### Metrics
- Bundle size: [Xkb]
- Rendering: [X ms for standard data set]
- API calls: [How many per page load?]

---

## VARIANT 1: [Name]

### Differs from DEFAULT in
[What's different about this variant? List the changes.]
- [Change 1]: [How it differs]
- [Change 2]: [How it differs]
- [Change 3]: [How it differs]

### Best For
[What scenarios is Variant 1 ideal? When should users use this instead of DEFAULT?]

### NOT Suitable For
[When should users NOT use this variant?]

### Code
```javascript
// Variant 1 code
// Same data layer as DEFAULT
// Same API wiring as DEFAULT
// Only differences: [specific changes isolated to CSS/layout/etc.]
```

### How to Switch from DEFAULT
[Instructions for switching from DEFAULT to Variant 1]

**Option 1: Prop-based switching**
```javascript
<Component variant="variant1" data={data} />
```

**Option 2: Different component class**
```javascript
<ComponentVariant1 data={data} />
```

### Differences Isolated To
[Where are the differences? What did NOT change?]
- Layout CSS only (data layer unchanged)
- Visual styling only (wiring unchanged)
- Responsive breakpoints only (core logic unchanged)

### Key Differences from DEFAULT

| Aspect | DEFAULT | VARIANT 1 |
|--------|---------|-----------|
| Layout | [How] | [How different] |
| Font Size | [Size] | [Size] |
| Spacing | [Spacing] | [Spacing] |
| [Other aspect] | [DEFAULT] | [VARIANT 1] |

---

## VARIANT 2: [Name]

### Differs from DEFAULT in
[What's different about Variant 2?]
- [Change 1]: [How it differs]
- [Change 2]: [How it differs]
- [Change 3]: [How it differs]

### Best For
[What scenarios is Variant 2 ideal? When should users use this instead of DEFAULT?]

### NOT Suitable For
[When should users NOT use this variant?]

### Code
```javascript
// Variant 2 code
// Same data layer as DEFAULT
// Same API wiring as DEFAULT
// Only differences: [specific changes]
```

### How to Switch from DEFAULT
[Instructions for switching from DEFAULT to Variant 2]

### Differences Isolated To
[Where are the differences? What did NOT change?]

---

## Testing (DEFAULT + VARIANTS)

### Tested On
**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Devices:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad Air, 768px)
- [ ] Mobile (iPhone 12, 480px)

**Assistive Tech:**
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Keyboard only navigation
- [ ] High contrast mode

### Accessibility Testing
- [ ] WebAIM Contrast Checker: [Result]
- [ ] WCAG Level AA: [Pass/Fail]
- [ ] Keyboard navigation: [Pass/Fail]
- [ ] Screen reader: [Pass/Fail]

### Performance Testing
- [ ] Load time with 100 items: [X ms]
- [ ] Load time with 500 items: [X ms]
- [ ] Load time with 1000 items: [X ms]
- [ ] Lighthouse score: [Score]

### User Testing
- [ ] Tested with [N] users
- [ ] Feedback: [What users said]
- [ ] Issues found: [Any problems?]
- [ ] Iterations made: [Improvements from testing]

---

## Usage Examples

### Example 1: Basic Usage
[Describe a common use case]

```javascript
// Code example for common use
<Component data={data} />
```

**Result:**
[What does this do? What will user see?]

---

### Example 2: With Configuration
[Describe an advanced use case]

```javascript
// Code example with options
<Component data={data} options={{ sortBy: 'name', limit: 50 }} />
```

**Result:**
[What does this do?]

---

### Example 3: With Event Handlers
[Describe interaction example]

```javascript
// Code example with events
<Component data={data} onSave={handleSave} onError={handleError} />
```

**Result:**
[What does this do?]

---

## Known Limitations

### What This Component DOES
- [Capability 1]
- [Capability 2]
- [Capability 3]

### What This Component DOES NOT
- [Out of scope 1]
- [Out of scope 2]
- [Out of scope 3]

### Roadmap for Future
[Any planned improvements or variants?]
- [Feature to add in future]
- [Improvement planned]

---

## Related Components

[What other components work with this one?]
- [Component A]: [How they work together]
- [Component B]: [How they work together]

---

## Status

- **Completion:** [Draft / Ready for Review / Production Ready]
- **Last Updated:** [Date]
- **Tested:** [Yes / Partial / No]
- **Documentation:** [Complete / Partial / Incomplete]
- **Owner:** [Person/Team]

---

## ENFORCEMENT CHECKLIST

Before marking component "Production Ready":

- [ ] 3 options evaluated and scored?
- [ ] Winner documented with justification?
- [ ] Code is complete and functional?
- [ ] Wiring is complete (all API calls defined)?
- [ ] Interconnections documented?
- [ ] All edge cases handled (empty, loading, error, success)?
- [ ] Responsive at all breakpoints (480, 768, 1200px)?
- [ ] Accessibility tested (WCAG AA+)?
- [ ] Performance tested (loading, rendering)?
- [ ] 2 variants complete with code/wiring?
- [ ] Usage examples provided?
- [ ] Known limitations documented?
- [ ] Related components listed?

**If any item incomplete:** Component is NOT ready. Mark as Draft and continue work.

---

**Example library entries using this template:**
- See CDS library for completed components

# ETSC Design System Index

**Complete enterprise design system for eliminating AI design failures.**

Status: ✓ COMPLETE — All documents created and committed.  
Date: 2026-07-06  
Scope: Four foundational documents + comprehensive page audit

---

## Overview

This design system solves the **"low satisfaction point"** problem:
- AI generates acceptable design
- Human accepts it without exhaustive verification
- Result: Missing contrast, inconsistent spacing, weak typography
- **Solution:** Mechanical enforcement of exhaustive checking

---

## The Four Foundational Documents

### 1. ETSC-CONTRAST-GUIDELINES.md (11 KB)

**Purpose:** Define mandatory contrast standards for all text, icons, borders, and interactive elements.

**Contents:**
- 8 core text contrast rules (body, secondary, labels, interactive, etc.)
- Color contrast matrix (16 pre-verified combinations)
- Element contrast rules (borders, icons, hover/active, disabled states)
- 4 detailed examples (good vs. bad for typography, forms, buttons)
- Contrast verification checklist (9 mandatory checks)
- Mechanical enforcement rules (no exceptions)

**Key insight:** Contrast that "looks okay" often fails WCAG. This document specifies exactly which color combinations work and pre-verifies them with contrast ratios.

**Critical rules:**
- Primary text: 7:1 contrast minimum (#1a1a1a on #ffffff = 21:1)
- Secondary text: 5.5:1 minimum (#4d4d4d on #ffffff = 8:1)
- All colors pre-verified (no custom hex values)
- WebAIM checker required before ship

---

### 2. ETSC-DESIGN-TOKENS.md (17 KB)

**Purpose:** Define all measurements, colors, and typography as reusable variables. No random pixel values.

**Contents:**
- Spacing scale (7 tokens: 8px grid from $spacing-sm to $spacing-4xl)
- Typography scale (7 sizes, 4 weights, 3 line-heights)
- Button sizes (3 heights: 32px, 40px, 48px)
- Input field spec (40px height, unified across all pages)
- Color palette (11 primary + 3 status colors, all pre-verified)
- Component spacing (tables, forms, sections, modals)
- Responsive breakpoints (480px/768px/1200px)

**Key insight:** Random pixel values create inconsistent, unprofessional design. Tokens force consistency by making every measurement follow a predefined system.

**Critical rule:** ONLY use these 7 spacing values. No 5px, 6px, 7px, 9px, 10px, etc.

---

### 3. ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (47 KB)

**Purpose:** Comprehensive 4-tab design system covering UX, UI, page types, and elements.

**Contents:**

**Tab 1: UX (User Experience)**
- 5 core UX principles (clarity, efficiency, feedback, accessibility, consistency)
- 6 interaction patterns (form input, button, table, dropdown, modal, tooltip)
- 3 user flows (create goal, manage participant, export data)
- Accessibility checklist (12 categories × 8 items = 96 checks)

**Tab 2: UI (User Interface)**
- Color application rules (8 color types with usage)
- Typography application rules (9 text styles with specs)
- Spacing application rules (9 spacing contexts)
- Border/outline rules (4 border types)
- 4 complete component specs (button, input, table, card)
- Contrast verification (all elements must pass)

**Tab 3: Page Types Library**
- Wizard (Goal Definition) — 7-step form with validation
- Dashboard (List + Manage) — Table-driven interface with actions
- Summary/Overview — Information-dense page with diagrams
- Full requirements for each type

**Tab 4: Page Elements Library**
- 10 reusable elements with code patterns (tooltip, button, input, table header, row, card, dropdown, comment, export, group/hierarchy)

**Final Verification Checklist:**
- 46-item exhaustive checklist per page
- 10 dimensions verified (typography, spacing, colors, buttons, forms, tables, tooltips, accessibility, consistency, responsive)
- Mechanical enforcement (page does NOT ship if items fail)

**Key insight:** Design systems that are "advisory" get skipped. This system has a checklist that must be manually completed before shipping. You must consciously choose to skip an item.

---

### 4. ETSC-PAGE-AUDIT-RESULTS.md (33 KB)

**Purpose:** Audit all 4 existing pages against the comprehensive design system.

**Contents:**

**Four Page Audits:**

| Page | Score | Blockers | Warnings |
|------|-------|----------|----------|
| Goal Definition Wizard | 82% (16✓, 5⚠️, 1✗) | 1 | 5 |
| Participant Dashboard | 78% (15✓, 6⚠️, 2✗) | 2 | 6 |
| Bundle Configuration | 75% (14✓, 7⚠️, 1✗) | 1 | 7 |
| Architecture Overview | 85% (17✓, 3⚠️, 0✗) | 0 | 3 |

**Aggregate Score: 80% (62✓, 21⚠️, 4✗)**

**Audit Results:**
- 10 dimensions per page (typography, spacing, colors, buttons, forms, tables/hierarchy, tooltips, accessibility, consistency, responsive)
- 4 critical blockers identified (keyboard sort, checkboxes, touch targets, bulk selection)
- 21 warnings documented (missing tooltips, responsive testing needed, ARIA attributes)
- Phase-by-phase remediation plan (4 phases, 4-5 day timeline)
- Enforcement mechanism (pages cannot ship with blockers)

**Key insight:** Pages are 75-85% compliant. Design system is solid. Four critical issues must be fixed before shipping. All pages need responsive testing (480px/768px).

---

## How to Use This System

### For Designers

1. **Start with ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md**
   - Read the relevant tab (UX, UI, page type, element)
   - Follow the pattern or component spec
   - Reference the color palette and typography scale

2. **During Design**
   - Use only design tokens (no custom values)
   - Reference the component library for patterns
   - Apply the interaction patterns for consistency

3. **Before Shipping**
   - Run through the 46-item verification checklist
   - Test contrast with WebAIM
   - Test at all 3 breakpoints (480/768/1200px)
   - Get sign-off from accessibility review

### For Engineers

1. **Start with ETSC-DESIGN-TOKENS.md**
   - Set up CSS variables for all tokens
   - Do NOT allow custom values (linting rule)
   - Create component library based on specs

2. **During Development**
   - Use only token values in code
   - Match component patterns exactly
   - Implement accessibility features (ARIA, keyboard nav)

3. **Before Shipping**
   - Run automated contrast checker
   - Test keyboard navigation
   - Test with screen reader
   - Verify responsive layout at all breakpoints

### For QA/Auditors

1. **Use ETSC-PAGE-AUDIT-RESULTS.md as baseline**
   - Copy the audit template for new pages
   - Run through 46-item checklist
   - Document blockers and warnings

2. **For Each Page**
   - Contrast check (WebAIM)
   - Responsive testing (480/768/1200px)
   - Keyboard navigation test
   - Screen reader test (NVDA)
   - Visual inspection at distance

3. **Gate the Ship**
   - Blockers = cannot ship (fix required)
   - Warnings = acceptable if documented
   - All items checked = ready to ship

---

## The Enforcement Mechanism

**This system prevents the "low satisfaction point" by making exhaustive checking mandatory:**

1. **Checklists are explicit** — 46 items per page, not vague guidelines
2. **Checklists are comprehensive** — 10 dimensions, 96+ accessibility checks
3. **Checklists are mechanical** — Page does NOT ship if items are unchecked
4. **Checklists are documented** — Each item has success criteria
5. **Checklists are audited** — Results tracked in ETSC-PAGE-AUDIT-RESULTS.md

**Result:** It is impossible to ship a page without consciously verifying every item. Skipping becomes an active choice, not a passive oversight.

---

## Critical Numbers

### Contrast Ratios
- **7:1** — Primary body text (WCAG AAA)
- **5.5:1** — Secondary text
- **4.5:1** — Action buttons, hints only (WCAG AA)
- **3:1** — Borders, icons, disabled states

### Spacing Tokens
- **8px** — Tight spacing ($spacing-sm)
- **12px** — Standard padding ($spacing-md)
- **16px** — Element gaps ($spacing-lg)
- **20px** — Section padding ($spacing-xl)
- **30px** — Container margin ($spacing-xxl)
- **40px** — Major gaps ($spacing-4xl)

### Typography Sizes
- **12px** — Captions ($font-size-xs)
- **13px** — Help text ($font-size-sm)
- **14px** — Body text ($font-size-base)
- **16px** — Labels ($font-size-md)
- **18px** — Section titles ($font-size-lg)
- **20px** — Page headings ($font-size-xl)
- **24px** — Page title ($font-size-xxl)

### Button Heights
- **32px** — Compact (table rows)
- **40px** — Standard (desktop)
- **48px** — Accessible (mobile, 44px+ touch target)

### Responsive Breakpoints
- **480px** — Mobile phones
- **768px** — Tablets
- **1200px** — Desktops

---

## Design System Compliance Score

### Current State (After Audit)
- Goal Wizard: 82% compliant
- Participant Dashboard: 78% compliant
- Bundle Configuration: 75% compliant
- Architecture Overview: 85% compliant
- **Overall: 80% compliant**

### Target State (After Remediation)
- All pages: 95%+ compliant
- Zero blockers
- All warnings resolved
- Full accessibility verified
- Responsive tested at all breakpoints

### Timeline to 95%+ Compliance
- **Phase 1 (1-2 days):** Fix blockers (keyboard sort, checkboxes, touch targets)
- **Phase 2 (2-3 days):** Implement warnings (tooltips, ARIA, responsive testing)
- **Phase 3 (1-2 days):** Final QA (contrast, keyboard, screen reader, mobile)
- **Phase 4:** Ship (all checks passed)

**Total: 4-5 days to reach 95%+ compliance**

---

## Governance

### Design System Ownership
- **Custodian:** ETSC Design System (this document set)
- **Authority:** CDS Mega Admin + Enterprise Design Governance
- **Updates:** Via formal design review process
- **Deviations:** Require explicit waiver + documentation

### Enforcement Points
1. **Design phase:** Designer reviews ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md
2. **Implementation:** Engineer uses ETSC-DESIGN-TOKENS.md for CSS variables
3. **Code review:** Automated checks for token usage (no custom colors/sizes)
4. **QA phase:** Auditor uses ETSC-PAGE-AUDIT-RESULTS.md template
5. **Ship gate:** All checklist items must be verified

### Escalation Path
- **Blockers:** Must be fixed or design is rejected
- **Warnings:** Acceptable if documented + approved
- **Deviations:** Require waiver from CDS Mega Admin
- **Appeals:** Document rationale, escalate to governance board

---

## Related Documentation

See also:
- ETSC-PROTOTYPE-INTERACTIVE.html — Interactive prototype demonstrating all pages
- ETSC-GOAL-DEFINITION-SYSTEM-PLAN.md — Original system design
- ETSC-WIZARD-ADMIN-ENHANCEMENTS.md — Admin-specific enhancements
- Various feedback and iteration documents

---

## Quick Reference

### When you're designing:
1. Read ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (4 tabs)
2. Use ETSC-DESIGN-TOKENS.md (all measurements)
3. Check ETSC-CONTRAST-GUIDELINES.md (all colors)
4. Run the 46-item checklist before shipping

### When you're developing:
1. Set up CSS variables from ETSC-DESIGN-TOKENS.md
2. Create components matching patterns from Tab 4
3. Implement accessibility from Tab 1
4. Test contrast before merging

### When you're auditing:
1. Copy template from ETSC-PAGE-AUDIT-RESULTS.md
2. Run through 46-item checklist
3. Document blockers and warnings
4. Gate the ship based on results

### When you're shipping:
1. Contrast verified with WebAIM ✓
2. Responsive tested at 480/768/1200px ✓
3. Keyboard navigation working ✓
4. Screen reader compatible ✓
5. All checklist items verified ✓
6. Zero blockers (warnings acceptable if documented) ✓

**Then ship.**

---

## Final Principle

**Design systems that are "advisory" get skipped. This system is mandatory because:**

1. **Explicit checklists** — You cannot ship without checking items
2. **Comprehensive coverage** — All 10 dimensions verified
3. **Pre-verified components** — No guessing on contrast/spacing
4. **Mechanical enforcement** — Automation ensures consistency
5. **Audit trail** — Every page tracked and documented

**The result:** Mediocre design is impossible. Excellent design becomes the default.

---

**Status:** COMPLETE — Design system ready for enterprise use.

**Next:** Remediate 4 critical blockers, implement 21 warnings, reach 95%+ compliance.

**Timeline:** 4-5 days to full compliance across all 4 pages.

---
title: "CDS Definition with Context + Examples Principle"
date: 2026-07-06
status: GOVERNANCE
version: 1.0
---

# DEFINITION WITH CONTEXT + EXAMPLES PRINCIPLE

**Core Idea:** When defining anything (contrast, color, spacing, interaction, flow), provide complete context and concrete examples so there's zero ambiguity.

**Result:** Complete definition cycle. No interpretation needed. Consistency guaranteed.

---

## WHY THIS PRINCIPLE MATTERS

**Problem:** Vague definitions create inconsistency.
- ❌ "Text should have good contrast" — What's good? 4:1? 7:1? 10:1?
- ❌ "Use spacing wisely" — 8px? 12px? 20px?
- ❌ "Buttons should be visible" — How visible? What color?

**Solution:** Define with context + multiple examples (good + bad).
- ✓ "Text contrast must be minimum 7:1 on primary content. Here's a good example (contrast ratio 10:1). Here's a bad example (contrast ratio 3:1, fails accessibility)."

**Benefits:**
- No guessing → implementation matches intent
- New developers understand immediately
- Auditing is objective (you can measure)
- Prevents "what did they mean?" conversations

---

## DEFINITION WITH CONTEXT + EXAMPLES TEMPLATE

When defining ANYTHING, use this structure:

### Definition
[What is it, in one sentence. Clear. Measurable if possible.]

### Why It Matters
[Context: When/where/why this definition exists. What problem does it solve?]

### GOOD Example 1: [Context A]
[Visual/description/code]

**Measurements/Indicators:**
- [Metric 1]: [Value] (why this works)
- [Metric 2]: [Value] (why this works)
- [Metric 3]: [Value] (why this works)

**Result:** ✓ [Why this works]

---

### GOOD Example 2: [Context B]
[Visual/description/code]

**Measurements/Indicators:**
- [Metric 1]: [Value] (why this works in different context)
- [Metric 2]: [Value] (why this works in different context)
- [Metric 3]: [Value] (why this works in different context)

**Result:** ✓ [Why this works in context B]

---

### BAD Example 1: [What NOT to do in Context A]
[Visual/description/code]

**Measurements/Indicators:**
- [Metric 1]: [Value] (PROBLEM: why this is wrong)
- [Metric 2]: [Value] (PROBLEM: why this is wrong)
- [Metric 3]: [Value] (PROBLEM: why this is wrong)

**Result:** ✗ [How this fails]  
**Why it's wrong:** [Specific problem]

---

### BAD Example 2: [What NOT to do in Context B]
[Visual/description/code]

**Measurements/Indicators:**
- [Metric 1]: [Value] (PROBLEM: why this breaks in context B)
- [Metric 2]: [Value] (PROBLEM: why this breaks in context B)
- [Metric 3]: [Value] (PROBLEM: why this breaks in context B)

**Result:** ✗ [How this fails in context B]  
**Why it's wrong:** [Specific problem in context B]

---

## Application Rule
[How to implement this in daily work]

---

## Variations (Context-Dependent)
- Variation A: [Different context] → [Specific adjustment]
- Variation B: [Different context] → [Specific adjustment]
- Rule: [When to use which variation]

---

## Related Principles
[Links to other principles this connects to]

---

## REAL EXAMPLE: CONTRAST PRINCIPLE

### Definition
Text contrast must be minimum 7:1 on primary content, 5.5:1 on secondary content.

### Why It Matters
Low contrast text is impossible to read for people with vision impairment. WCAG AA standard requires 7:1 for normal text (primary content) and 5.5:1 for secondary content (help text, captions). This principle ensures all users can read all content.

### GOOD Example 1: Primary Text on White (Dark Mode)
```
Text color: #1a1a1a (dark gray)
Background: #ffffff (white)
Contrast ratio: 21:1
Font size: 14px
Font weight: 400 (normal)
```

**Measurements/Indicators:**
- Contrast ratio: 21:1 (far exceeds 7:1 minimum)
- Font size: 14px (normal readable size)
- Weight: 400 (standard weight, not too thin)

**Result:** ✓ Easy to read. Passes WCAG AAA. Comfortable for extended reading.

---

### GOOD Example 2: Secondary Text (Help/Caption) on White
```
Text color: #4d4d4d (medium gray)
Background: #ffffff (white)
Contrast ratio: 8:1
Font size: 13px
Font weight: 400 (normal)
Usage: Help text, captions, secondary descriptions
```

**Measurements/Indicators:**
- Contrast ratio: 8:1 (meets 7:1 minimum by 14%)
- Font size: 13px (slightly smaller, acceptable for secondary)
- Weight: 400 (standard weight, not thin)

**Result:** ✓ Readable but clearly secondary. Passes WCAG AA. Good for non-critical information.

---

### BAD Example 1: Too-Light Primary Text (Fails Accessibility)
```
Text color: #999999 (light gray)
Background: #ffffff (white)
Contrast ratio: 4.5:1
Font size: 14px
Font weight: 400
```

**Measurements/Indicators:**
- Contrast ratio: 4.5:1 (PROBLEM: fails 7:1 requirement by 36%)
- Font size: 14px (size is fine, but contrast is not)
- Weight: 400 (standard, not the issue)

**Result:** ✗ Hard to read. Fails WCAG AA and AAA. People with vision impairment cannot read this.

**Why it's wrong:** Contrast too low. 4.5:1 is the minimum for WCAG A (large text only). For normal text, we need 7:1. This violates accessibility standards and our CDS principle.

---

### BAD Example 2: Reversed Contrast (Completely Illegible)
```
Text color: #f5f5f5 (very light gray)
Background: #ffffff (white)
Contrast ratio: 1.1:1
Font size: 14px
Font weight: 400
```

**Measurements/Indicators:**
- Contrast ratio: 1.1:1 (PROBLEM: near-impossible to read)
- Font size: 14px (size irrelevant at this contrast)
- Weight: 400 (irrelevant at this contrast)

**Result:** ✗ Text is invisible. Fails all WCAG levels. Completely unusable.

**Why it's wrong:** Text and background are almost the same color. No contrast at all. This is not acceptable under any circumstance.

---

## Application Rule

**How to implement:**
1. Check text color
2. Check background color
3. Run through WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
4. Verify ratio meets 7:1 (primary) or 5.5:1 (secondary)
5. If fails, darken text or lighten background

**Never do:**
- Use text color lighter than #999 on white background (too light)
- Use text color lighter than #666 on dark backgrounds without testing
- Skip contrast check "because it looks readable to me" (your vision may not match users with impairment)
- Use primary content with less than 7:1 contrast

**Test by:**
- WebAIM Contrast Checker
- Chrome DevTools Accessibility panel
- Manual review with color blindness simulator (Color Blind Checker)

---

## Variations (Context-Dependent)

- **Large text (18px+, bold):** Can use 4.5:1 minimum (WCAG AA for large text). Recommend 5.5:1+.
- **Disabled state:** Can use lower contrast (3:1 acceptable for non-interactive elements).
- **Decorative elements:** Contrast requirement does NOT apply (not content).
- **Links:** Must have 3:1 contrast with surrounding text AND have underline or icon (not color alone).

**Rule:** If text is CONTENT (user must read it), use 7:1. If text is SECONDARY CONTENT (help, hints), use 5.5:1. If it's DISABLED or DECORATIVE, lower contrast acceptable. Always test with actual users if uncertain.

---

## Related Principles

- **Accessibility Principle:** All content must be accessible to all users.
- **Clarity Principle:** Every element must have clear purpose. Contrast is part of clarity.
- **Consistency Principle:** Apply contrast rule everywhere, not selectively.
- **Mechanical Enforcement Principle:** Make contrast checkers part of PR review (block merges with failing contrast).

---

## CDS APPLICATION ACROSS ALL DOMAINS

This principle applies to EVERYTHING we define:

### Contrast
- ✓ Define: "Primary text 7:1, secondary 5.5:1"
- ✓ Show: GOOD example (10:1 ratio, readable), GOOD example 2 (8:1 ratio, readable)
- ✓ Show: BAD example (3:1 ratio, unreadable), BAD example 2 (1.1:1, invisible)

### Spacing
- ✓ Define: "Button gaps 12px, section gaps 40px"
- ✓ Show: GOOD example (buttons with 12px gap, comfortable), GOOD example 2 (sections with 40px gap)
- ✓ Show: BAD example (buttons 4px apart, cramped), BAD example 2 (sections 0px apart, merged)

### Typography
- ✓ Define: "h1: 24px bold, h2: 18px semibold, body: 14px normal"
- ✓ Show: GOOD examples (hierarchy clear, text readable), BAD examples (hierarchy unclear, sizes inconsistent)

### Colors
- ✓ Define: "Action button #50c878, danger #ff6b6b, secondary #f5f5f5"
- ✓ Show: GOOD examples (button matches intent, context clear), BAD examples (wrong color chosen, intent unclear)

### Buttons
- ✓ Define: "40px height, clear action verb, hover state darker"
- ✓ Show: GOOD examples (button works in form, button works in table), BAD examples (button too small, button text unclear)

### Interactions
- ✓ Define: "Form validation on blur, error message on submit failure"
- ✓ Show: GOOD examples (user knows what failed, knows how to fix), BAD examples (silent failure, no error message)

### Flows
- ✓ Define: "Create flow: form → validation → submit → confirmation → redirect"
- ✓ Show: GOOD examples (flow clear, user knows next step), BAD examples (ambiguous next step, no confirmation)

---

## ENFORCEMENT CHECKLIST

Before marking ANY definition complete:

- [ ] Definition is one clear sentence (no "should", "maybe", "consider")
- [ ] Why It Matters explains context (when/where/why)
- [ ] GOOD Example 1 shows implementation in Context A
- [ ] GOOD Example 2 shows different context (not just repeat)
- [ ] Both GOOD examples include measurements/metrics
- [ ] BAD Example 1 shows what's wrong (with metrics)
- [ ] BAD Example 2 shows different wrong (not same mistake)
- [ ] Both BAD examples explain WHY they're wrong (specific problem)
- [ ] Application Rule explains how to implement
- [ ] Variations section covers context-dependent adjustments
- [ ] Related Principles section links to connected principles

**If any item fails:** Definition is incomplete. Revise before use.

---

## STATUS

- **Adoption:** Effective immediately for all new CDS definitions
- **Retroactive:** Existing definitions (Contrast, Spacing, Typography, Colors, Buttons) should be updated using this template
- **Enforcement:** No definition ships without 2 good + 2 bad examples with measurements
- **Owner:** CDS Governance
- **Update Frequency:** As new domains emerge (flows, interactions, layouts)

---

**See also:**
- ETSC-ENHANCED-UX-UI-DESIGN-SYSTEM.md (contains definitions following this pattern)
- CDS-DNA-PRACTICE-FRAMEWORK.md (Principle 7: Document learnings)

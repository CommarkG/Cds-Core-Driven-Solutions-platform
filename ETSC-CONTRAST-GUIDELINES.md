# ETSC Contrast Guidelines & Rules

## Problem Statement

AI often creates contrast that technically passes WCAG but looks weak/unprofessional:
- Light gray text (#999) on light background (#f5f5f5) → barely readable
- Buttons with weak color differentiation
- Interactive elements not visually distinct
- Icons not standing out enough

**Solution: Mandatory Contrast Standards enforced mechanically before shipping.**

---

## 1.1 Text Contrast Rules

### Rule 1: Body Text
- **Minimum contrast ratio:** 7:1 (WCAG AAA, not AA)
- ✓ Dark text on light background: #1a1a1a on #ffffff (21:1)
- ✗ Do NOT use: #666 on #f5f5f5 (4.5:1)
- ✗ Do NOT use: gray text for primary content

**When to use:** All primary body text, descriptions, content that users MUST read

---

### Rule 2: Secondary Text
- **Minimum contrast ratio:** 5.5:1
- ✓ Example: #4d4d4d on #ffffff (8:1)
- ✓ Example: #666 on #f5f5f5 (4.8:1)
- Use for: descriptions, help text, metadata, less-critical information
- ✗ Do NOT use for: primary content or interactive labels

**When to use:** Explanatory text, timestamps, secondary information

---

### Rule 3: Labels & Form Text
- **Minimum contrast ratio:** 7:1
- ✓ All form labels must use dark text (#1a1a1a)
- ✓ Input field text must be dark (#1a1a1a)
- ✗ Placeholder text: #999 (minimum 4.5:1) - acceptable ONLY for hints
- ✗ Do NOT use light colors for actual label text

**When to use:** Form labels, input placeholder text, field instructions

---

### Rule 4: Interactive Text (Buttons, Links)
- **Minimum contrast ratio:** 7:1
- ✓ Button text on button background: must be easily readable at a glance
- ✓ Link text: #0066cc or darker (not #999 or other weak colors)
- ✗ Do NOT use: light colored button text on light backgrounds
- ✗ Do NOT use: weak link colors

**When to use:** All buttons, links, clickable text

---

## 1.2 Color Contrast Matrix

| Background Color | Text Color | Contrast Ratio | Usage | Status |
|---|---|---|---|---|
| #ffffff (white) | #1a1a1a (dark) | 21:1 | Primary body text | ✓✓✓ |
| #ffffff (white) | #4d4d4d (medium) | 8:1 | Secondary text | ✓ |
| #ffffff (white) | #999 (light gray) | 4.5:1 | Placeholder/hints ONLY | ✓ limited |
| #f5f5f5 (light) | #1a1a1a (dark) | 18.5:1 | Body text on light BG | ✓✓ |
| #f5f5f5 (light) | #666 (gray) | 4.8:1 | Secondary text on light BG | ✓ |
| #f5f5f5 (light) | #999 (light) | 3.0:1 | NOT for body text | ✗ |
| #f0f8ff (light blue) | #1a1a1a (dark) | 19:1 | Highlighted sections | ✓✓ |
| #50c878 (green) | #ffffff (white) | 4.5:1 | Action button text | ✓ action only |
| #ff6b6b (red) | #ffffff (white) | 5.5:1 | Delete/warning button text | ✓ danger only |
| #4da6ff (blue) | #ffffff (white) | 6.2:1 | Secondary button text | ✓ secondary only |

---

## 1.3 Element Contrast Rules

### Rule 5: Borders
- **Border contrast vs background: minimum 3:1**
- ✓ Table borders: #ddd on #ffffff (14:1)
- ✓ Focus borders: #0066cc (high contrast, easily visible)
- ✓ Input borders: #ddd (default), #0066cc (focus)
- ✗ Do NOT use: #f0f0f0 borders on #ffffff background (insufficient)
- ✗ Do NOT use: very light borders that blend into background

**When to use:** All borders, dividers, input outlines

**Verification:** Border must be visibly distinct from background at arm's length

---

### Rule 6: Icons
- **Icon color contrast vs background: minimum 3:1**
- ✓ Tooltip icons (?): #666 on #ffffff (6:1)
- ✓ Action icons: match button color (inherit parent contrast)
- ✓ Status icons: #50c878 (success), #ff6b6b (error)
- ✗ Do NOT use: light icons on light backgrounds
- ✗ Do NOT use: icon colors that are barely visible

**When to use:** All icons, symbols, visual indicators

**Verification:** Icon must be easily distinguishable at small sizes (16px, 24px)

---

### Rule 7: Hover/Active States
- **Hover state must be visually distinct from normal state**
- ✓ Change color (darker or different hue)
- ✓ Add underline (for links)
- ✓ Change background (for buttons)
- ✗ Do NOT use: subtle changes that are hard to see
- ✗ Do NOT use: no visual feedback on interaction

**Contrast requirement:** Hover state must also meet contrast minimums (7:1 for text, 3:1 for borders)

**When to use:** All interactive elements (buttons, links, inputs, table rows)

---

### Rule 8: Disabled States
- **Disabled elements: #ccc text on #ffffff (4.5:1)**
- ✓ Acceptable because they're not interactive (users won't try to read them as action)
- ✓ Visually distinct from enabled state (obviously disabled)
- ✗ Do NOT use: same color as enabled elements (confusing)
- ✗ Do NOT use: higher contrast than enabled (looks more actionable)

**When to use:** Form fields that are disabled, buttons that can't be clicked, read-only fields

---

## 1.4 Contrast Verification Checklist

### MANDATORY before shipping ANY page:

- [ ] **Black text on white (#1a1a1a on #ffffff):** Verified 21:1 contrast
- [ ] **All secondary text:** Verified minimum 5.5:1 contrast
- [ ] **All form labels:** Verified dark color (#1a1a1a), minimum 7:1
- [ ] **All interactive text:** Verified minimum 7:1 contrast
- [ ] **All borders:** Verified minimum 3:1 contrast vs background
- [ ] **All icons:** Verified minimum 3:1 contrast vs background
- [ ] **Hover states:** Verified visually distinct AND meet contrast minimums
- [ ] **Disabled states:** Verified grayed out (not same as enabled)
- [ ] **Color blindness check:** Run through WebAIM or similar (don't rely on color alone)
- [ ] **Real world test:** Print screen, view at distance, verify readability

### Tools for verification:
1. **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
2. **WAVE Browser Extension:** https://wave.webaim.org/extension/
3. **Color Blindness Simulator:** https://www.color-blindness.com/coblis-color-blindness-simulator/
4. **Manual test:** Screenshot, print, view from 3 feet away

---

## 1.5 Text Contrast Examples (Good vs Bad)

### Good Example 1: Primary Body Text
```
Background: #ffffff
Text: #1a1a1a
Size: 14px
Weight: normal
Contrast: 21:1 ✓

Result: Highly readable, no strain, professional appearance
```

### Bad Example 1: Primary Body Text
```
Background: #ffffff
Text: #999
Size: 14px
Weight: normal
Contrast: 4.5:1 ✗

Result: Hard to read, strains eyes, looks unprofessional
```

### Good Example 2: Secondary Text
```
Background: #ffffff
Text: #4d4d4d
Size: 13px
Weight: normal
Contrast: 8:1 ✓

Result: Readable, visually distinct from primary, good hierarchy
```

### Bad Example 2: Secondary Text
```
Background: #f5f5f5
Text: #bbb
Size: 13px
Weight: normal
Contrast: 1.8:1 ✗

Result: Nearly invisible, poor hierarchy, looks broken
```

### Good Example 3: Form Label
```
Background: #ffffff
Label: #1a1a1a
Size: 16px
Weight: medium
Contrast: 21:1 ✓
Input border: #ddd (14:1)
Input text: #1a1a1a (21:1)

Result: Clear, accessible, easy to understand form
```

### Bad Example 3: Form Label
```
Background: #ffffff
Label: #888
Size: 16px
Weight: normal
Contrast: 5.8:1 ✗ (barely passes AA, fails AAA)
Input border: #f0f0f0 (1.2:1) ✗ (barely visible)
Input text: #666 (6.1:1) ✗ (hard to read)

Result: Form is hard to use, looks unprofessional
```

### Good Example 4: Button
```
Background: #50c878 (green)
Text: #ffffff (white)
Size: 14px
Weight: semibold
Contrast: 4.5:1 ✓
Hover: #45a86d (darker green, 3.8:1) ✓

Result: Clear action, easy to click, accessible
```

### Bad Example 4: Button
```
Background: #90ee90 (light green)
Text: #ffffff (white)
Size: 14px
Weight: normal
Contrast: 2.8:1 ✗

Result: Button looks weak, text barely visible, unprofessional
```

---

## 1.6 Enforcement Rules

### Mechanical enforcement — NOT optional:

1. **Before every page ships:** Run contrast checker on 100% of page
2. **Every color in palette:** Pre-verified for contrast
3. **Every custom color:** Must have contrast calculation attached
4. **Every hover/active state:** Must be tested separately
5. **Every disabled state:** Must be visually distinct
6. **No exceptions:** "But it looks okay" is not acceptable

### If contrast fails:
- [ ] Fix the color immediately
- [ ] Re-verify with checker
- [ ] Do NOT ship until passing

### If contrast barely passes (4.5:1 - 5:1):
- [ ] Consider using darker color
- [ ] Increase font size or weight
- [ ] Add visual indicators (underline, icon)
- [ ] Flag for user testing

---

## 1.7 Contrast by Component Type

### Text Body
- Primary: #1a1a1a on #ffffff (21:1) ✓✓✓
- Secondary: #4d4d4d on #ffffff (8:1) ✓
- Tertiary: #999 on #ffffff (4.5:1) - hints only ✓

### Form Labels
- Label: #1a1a1a on #ffffff (21:1) ✓✓
- Help text: #666 on #ffffff (6:1) ✓
- Error: #ff6b6b on #ffffff (5.5:1) ✓
- Placeholder: #999 on #ffffff (4.5:1) - acceptable ✓

### Buttons
- Green button (#50c878) with white text (4.5:1) ✓
- Red button (#ff6b6b) with white text (5.5:1) ✓
- Blue button (#4da6ff) with white text (6.2:1) ✓
- Disabled (#ccc) on white (4.5:1) - acceptable for disabled ✓

### Tables
- Header: #1a1a1a on #f5f5f5 (18.5:1) ✓✓
- Row text: #1a1a1a on #ffffff (21:1) ✓✓
- Borders: #ddd on #ffffff (14:1) ✓
- Hover row: #1a1a1a on #f9f9f9 (20:1) ✓✓

### Icons & Symbols
- Icon: #666 on #ffffff (6:1) ✓
- Success icon: #50c878 on #ffffff (4.5:1) ✓
- Error icon: #ff6b6b on #ffffff (5.5:1) ✓
- Info icon: #4da6ff on #ffffff (6.2:1) ✓

### Focus & Hover
- Focus border: #0066cc (high visibility) ✓
- Hover text: darker shade of original ✓
- Hover background: #f9f9f9 (subtle, readable) ✓
- Active state: visually distinct ✓

---

## QUICK REFERENCE TABLE

**Minimum acceptable contrast ratios:**
- Normal text: 7:1
- Large text (18px+): 5.5:1
- Secondary text: 5.5:1
- Interactive elements: 7:1
- Borders: 3:1
- Icons: 3:1
- Disabled elements: 4.5:1 (acceptable for non-interactive)

**Pre-approved color combinations:**
- #1a1a1a text on #ffffff background: 21:1 ✓
- #4d4d4d text on #ffffff background: 8:1 ✓
- #50c878 (green) with #ffffff text: 4.5:1 ✓
- #ff6b6b (red) with #ffffff text: 5.5:1 ✓
- #4da6ff (blue) with #ffffff text: 6.2:1 ✓
- #ddd borders on #ffffff background: 14:1 ✓

---

## FINAL RULE

**If you're unsure about contrast, assume it's not good enough. Test it. Fix it. Only ship when verified.**

Do not accept "it looks fine" as justification. Contrast must be measured, not assumed.

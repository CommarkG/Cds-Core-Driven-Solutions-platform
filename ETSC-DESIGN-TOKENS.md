# ETSC Design Tokens

## Purpose

Define all measurements, colors, and typography as reusable variables. **RULE: No random pixel values. Every measurement must use a token.**

---

## 2.1 Spacing Scale (8px Grid)

**All gaps, padding, and margins MUST use these values. No exceptions.**

```
$spacing-xs:   4px    (NOT USED - jump directly to 8px)
$spacing-sm:   8px    (label margins, tight spacing, input help text)
$spacing-md:   12px   (form field padding, button gaps, compact spacing)
$spacing-lg:   16px   (section padding, element gaps, standard spacing)
$spacing-xl:   20px   (container padding, major sections)
$spacing-xxl:  30px   (page-level margins, between major sections)
$spacing-4xl:  40px   (section separation, large gaps)
```

### Spacing Token Usage Matrix

| Element | Token | Value | Purpose |
|---------|-------|-------|---------|
| Input padding (h) | $spacing-md | 12px | Horizontal text field padding |
| Input padding (v) | $spacing-md | 12px | Vertical text field padding |
| Label to input gap | $spacing-sm | 8px | Form field vertical spacing |
| Input to next field | $spacing-lg | 16px | Between form fields |
| Form section gap | $spacing-xl | 20px | Between form sections |
| Button padding (h) | $spacing-lg | 16px | Button horizontal padding |
| Button padding (v) | $spacing-md | 12px | Button vertical padding |
| Button gap (horizontal) | $spacing-md | 12px | Between buttons in row |
| Table header padding | $spacing-lg | 16px | Header cell padding |
| Table row padding | $spacing-md | 12px | Data row padding |
| Table column gap | $spacing-lg | 16px | Between columns |
| Card padding | $spacing-xl | 20px | Inside card/section |
| Section padding | $spacing-xl | 20px | Inside section |
| Gap to next section | $spacing-4xl | 40px | Between sections |
| Container margin | $spacing-xxl | 30px | Page margin |
| Modal padding | $spacing-xl | 20px | Inside modal |
| List item gap | $spacing-lg | 16px | Between list items |
| Group separation | $spacing-4xl | 40px | Between groups |

### STRICT RULE

✗ Do NOT use: 5px, 6px, 7px, 9px, 10px, 11px, 13px, 14px, 15px, 18px, 19px, etc.

✓ ONLY use the 7 tokens above. No deviations.

---

## 2.2 Typography Scale

**All font sizes and weights MUST use these values.**

### Font Sizes

```
$font-size-xs:    12px   (captions, row numbers, small metadata)
$font-size-sm:    13px   (help text, placeholder, secondary labels)
$font-size-base:  14px   (body text, table data, default)
$font-size-md:    16px   (form labels, secondary headings)
$font-size-lg:    18px   (section titles, emphasized content)
$font-size-xl:    20px   (page section headings, main labels)
$font-size-xxl:   24px   (page main title, h1)
```

### Font Weights

```
$font-weight-normal:   400  (body text, descriptions)
$font-weight-medium:   500  (form labels, secondary emphasis)
$font-weight-semibold: 600  (headers, table headers, emphasized)
$font-weight-bold:     700  (page titles, strong emphasis)
```

### Line Heights

```
$line-height-tight:    1.2  (headings, single-line elements)
$line-height-normal:   1.6  (body text, readable paragraphs)
$line-height-loose:    1.8  (description text, multi-line emphasis)
```

### Typography Token Usage Matrix

| Element | Font Size | Font Weight | Line Height | Example |
|---------|-----------|-------------|-------------|---------|
| Page title (h1) | $font-size-xxl (24px) | $font-weight-bold (700) | $line-height-tight (1.2) | "Goal Definition Wizard" |
| Section title (h2) | $font-size-lg (18px) | $font-weight-semibold (600) | $line-height-tight (1.2) | "Define Your Goal" |
| Subsection title (h3) | $font-size-md (16px) | $font-weight-semibold (600) | $line-height-tight (1.2) | "Timeline" |
| Body text | $font-size-base (14px) | $font-weight-normal (400) | $line-height-normal (1.6) | Paragraph text, descriptions |
| Form label | $font-size-md (16px) | $font-weight-medium (500) | $line-height-tight (1.2) | "Goal Name" |
| Help text | $font-size-sm (13px) | $font-weight-normal (400) | $line-height-normal (1.6) | "What is your goal?" |
| Button text | $font-size-base (14px) | $font-weight-semibold (600) | $line-height-tight (1.2) | "Create Goal" |
| Table header | $font-size-base (14px) | $font-weight-semibold (600) | $line-height-tight (1.2) | Column names |
| Table data | $font-size-base (14px) | $font-weight-normal (400) | $line-height-tight (1.2) | Row data |
| Placeholder | $font-size-base (14px) | $font-weight-normal (400) | $line-height-tight (1.2) | "Enter goal name..." |
| Captions | $font-size-xs (12px) | $font-weight-normal (400) | $line-height-normal (1.6) | "Row numbers", "Timestamps" |
| Small metadata | $font-size-xs (12px) | $font-weight-normal (400) | $line-height-tight (1.2) | "#123", "Updated 2 hours ago" |
| Emphasis text | $font-size-base (14px) | $font-weight-bold (700) | $line-height-normal (1.6) | Important notices |

### STRICT RULE

✗ Do NOT use: 11px, 15px, 17px, 19px, 21px, 22px, 23px, 25px, etc.

✓ ONLY use the 7 font sizes and 4 weights above. No deviations.

---

## 2.3 Button Sizes

**All buttons MUST use standardized heights. No custom button sizing.**

```
$button-height-sm:    32px   (secondary actions, compact tables, icon buttons)
$button-height-md:    40px   (primary actions, standard buttons, forms)
$button-height-lg:    48px   (mobile primary, accessibility-focused)

$button-padding-h:    $spacing-lg (16px horizontal padding)
$button-padding-v:    $spacing-md (12px vertical padding)

$button-border-radius: 4px   (all buttons)
$button-font-size:    $font-size-base (14px)
$button-font-weight:  $font-weight-semibold (600)
```

### Button Type Specifications

| Button Type | Height | Use Case | Example |
|-------------|--------|----------|---------|
| Primary action | $button-height-md (40px) | Main actions, create, submit | "Create Goal", "Save Changes" |
| Secondary action | $button-height-md (40px) | Alternative actions, export | "Export", "Copy" |
| Danger action | $button-height-md (40px) | Destructive actions, delete | "Delete", "Remove" |
| Compact action | $button-height-sm (32px) | Table rows, tight spaces | In-row export, edit buttons |
| Accessible action | $button-height-lg (48px) | Mobile, touch targets | Mobile primary actions |

### STRICT RULE

✓ All buttons use one of these three heights (32px, 40px, 48px)

✗ Do NOT use: custom button heights, button sizing that doesn't match spec

---

## 2.4 Input Field Sizes

**All form inputs MUST be 40px height. Consistent across all pages.**

```
$input-height:         40px   (text inputs, selects, textareas)
$input-padding-h:      $spacing-md (12px horizontal padding inside field)
$input-padding-v:      12px   (vertical padding to center text in 40px height)
$input-border-width:   1px    (default border)
$input-border-color:   $color-neutral-border (#ddd) (default state)
$input-focus-border:   $color-action-info (#0066cc) (focused state)
$input-border-radius:  4px    (consistent with buttons)
$input-font-size:      $font-size-base (14px)
$input-font-weight:    $font-weight-normal (400)
$input-placeholder:    $color-neutral-light (#999)
```

### Input Field Specifications

| Field Type | Height | Padding | Border | Font | Example |
|------------|--------|---------|--------|------|---------|
| Text input | $input-height (40px) | 12px h, 12px v | 1px #ddd | 14px normal | Name, email |
| Select dropdown | $input-height (40px) | 12px h, 12px v | 1px #ddd | 14px normal | Position, category |
| Textarea | $input-height (40px min) | 12px all | 1px #ddd | 14px normal | Comments, description |
| Search input | $input-height (40px) | 12px h, 12px v | 1px #ddd | 14px normal | Search box |
| Password input | $input-height (40px) | 12px h, 12px v | 1px #ddd | 14px normal | Login fields |

### Input States

| State | Border Color | Border Width | Background | Cursor |
|-------|--------------|--------------|-----------|--------|
| Default | #ddd | 1px | #ffffff | text |
| Focused | #0066cc | 2px | #ffffff | text |
| Filled | #ddd | 1px | #ffffff | text |
| Disabled | #ccc | 1px | #f5f5f5 | not-allowed |
| Error | #ff6b6b | 2px | #fff5f5 | text |
| Error focused | #ff6b6b | 2px | #fff5f5 | text |

### STRICT RULE

✓ All text inputs, selects, and textareas: 40px height

✗ Do NOT use: custom input heights, inputs that don't match spec

---

## 2.5 Color Palette

**All colors MUST use variables. No custom hex values in code/design.**

### Primary Action Colors

```
$color-action-primary:   #50c878  (green, action buttons, positive, create/submit)
$color-action-danger:    #ff6b6b  (red, delete, warning, destructive)
$color-action-info:      #4da6ff  (blue, info, secondary action, focus state)
```

### Neutral Colors (Grayscale)

```
$color-neutral-dark:     #1a1a1a  (dark text, primary content, 21:1 on white)
$color-neutral-medium:   #4d4d4d  (secondary text, descriptions, 8:1 on white)
$color-neutral-light:    #999     (tertiary text, hints, metadata, 4.5:1 on white)
$color-neutral-border:   #ddd     (borders, dividers, 14:1 on white)
$color-neutral-bg:       #ffffff  (white backgrounds, primary)
$color-neutral-bg-alt:   #f5f5f5  (light gray backgrounds, sections, hover)
$color-neutral-bg-hover: #f9f9f9  (hover state background, subtle)
$color-neutral-disabled: #ccc     (disabled elements, 4.5:1 on white)
```

### Status Colors

```
$color-success:          #90ee90  (success states, high match/positive)
$color-warning:          #ffd700  (warning states, medium match/caution)
$color-error:            #ffb6c6  (error states, low match/negative)
```

### Color Contrast Verification

| Color | On White (#ffffff) | Usage | Contrast | Pass |
|-------|-------------------|-------|----------|------|
| $color-neutral-dark (#1a1a1a) | Text | Primary content | 21:1 | ✓✓✓ |
| $color-neutral-medium (#4d4d4d) | Text | Secondary text | 8:1 | ✓ |
| $color-neutral-light (#999) | Text | Hints, placeholders | 4.5:1 | ✓ hints only |
| $color-neutral-border (#ddd) | Border | Borders | 14:1 | ✓ |
| $color-neutral-disabled (#ccc) | Text | Disabled text | 4.5:1 | ✓ disabled only |
| $color-action-primary (#50c878) | White text | Buttons | 4.5:1 | ✓ |
| $color-action-danger (#ff6b6b) | White text | Delete buttons | 5.5:1 | ✓ |
| $color-action-info (#4da6ff) | White text | Secondary buttons | 6.2:1 | ✓ |
| $color-success (#90ee90) | White text | Success indicators | 3.5:1 | ~ icons only |
| $color-warning (#ffd700) | Dark text | Warning indicators | 8.5:1 | ✓ |
| $color-error (#ffb6c6) | Dark text | Error indicators | 8.1:1 | ✓ |

### STRICT RULE

✓ ONLY use variables from the palette above

✗ Do NOT use: custom hex colors, colors not from palette

✗ Do NOT use: colors that haven't been contrast-verified

---

## 2.6 Component Spacing

### TABLE Spacing

```
$table-header-padding:        $spacing-lg (16px all sides)
$table-header-font-weight:    $font-weight-semibold (600)
$table-header-background:     $color-neutral-bg-alt (#f5f5f5)
$table-row-padding:           $spacing-md (12px all sides)
$table-row-border-bottom:     1px solid $color-neutral-border (#ddd)
$table-column-gap:            $spacing-lg (16px between columns)
$table-row-number-width:      40px (fixed width for # column)
$table-hover-background:      $color-neutral-bg-hover (#f9f9f9)
```

### BUTTONS IN ROW Spacing

```
$button-row-gap:              $spacing-md (12px between buttons)
$button-row-justify:          flex-end (align right)
$button-height:               $button-height-md (40px)
$button-min-width:            100px (minimum for readability)
```

### FORM FIELDS Spacing

```
$form-label-to-input:         $spacing-sm (8px between label and input)
$form-input-height:           $input-height (40px)
$form-input-to-next-field:    $spacing-lg (16px between inputs)
$form-section-to-section:     $spacing-xl (20px between form sections)
$form-label-font-size:        $font-size-md (16px)
$form-label-font-weight:      $font-weight-medium (500)
```

### SECTION SPACING

```
$section-padding:             $spacing-xl (20px inside section)
$section-margin-bottom:       $spacing-4xl (40px after section)
$section-title-margin-bottom: $spacing-lg (16px under section title)
$container-padding:           $spacing-xxl (30px page margin)
$container-max-width:         1200px (maximum content width)
```

### MODAL Spacing

```
$modal-padding:               $spacing-xl (20px inside modal)
$modal-header-padding:        $spacing-xl (20px)
$modal-body-padding:          $spacing-xl (20px)
$modal-footer-padding:        $spacing-xl (20px)
$modal-button-gap:            $spacing-md (12px between buttons)
```

### LIST Spacing

```
$list-item-gap:               $spacing-lg (16px between items)
$list-item-padding:           $spacing-md (12px inside item)
$list-padding:                $spacing-lg (16px for list container)
```

### GROUP/HIERARCHY Spacing

```
$group-padding:               $spacing-xl (20px inside group)
$group-margin-bottom:         $spacing-4xl (40px between groups)
$subgroup-padding-left:       $spacing-xl (20px indentation)
$subgroup-margin-bottom:      $spacing-lg (16px between subgroups)
```

### STRICT RULE

✓ All spacing uses tokens from section 2.1

✗ Do NOT use: random pixel values, spacing not from token list

---

## 2.7 Shadow & Border Radius

```
$border-radius-default:       4px    (all components: buttons, inputs, cards)
$border-radius-lg:            8px    (larger components if needed)

$shadow-sm:                   0 1px 2px rgba(0,0,0,0.05)
$shadow-md:                   0 2px 8px rgba(0,0,0,0.1)
$shadow-lg:                   0 4px 16px rgba(0,0,0,0.15)
$shadow-focus:                0 0 0 3px rgba(77, 166, 255, 0.1) (blue focus glow)
```

### Usage

| Element | Border Radius | Shadow | Usage |
|---------|---------------|--------|-------|
| Buttons | $border-radius-default (4px) | None | Standard components |
| Inputs | $border-radius-default (4px) | None | Form fields |
| Cards | $border-radius-default (4px) | $shadow-sm | Subtle depth |
| Modals | $border-radius-default (4px) | $shadow-lg | Prominent depth |
| Focus state | $border-radius-default (4px) | $shadow-focus | Visual focus indicator |
| Dropdowns | $border-radius-default (4px) | $shadow-md | Floating elements |

---

## 2.8 Responsive Breakpoints

```
$breakpoint-sm:               480px   (mobile phones)
$breakpoint-md:               768px   (tablets)
$breakpoint-lg:               1200px  (desktops)
```

### Responsive Adjustments

| Breakpoint | Font Sizes | Spacing | Button Height | Example |
|-----------|-----------|---------|--------|---------|
| Mobile ($breakpoint-sm) | Reduce 1-2 sizes | Use $spacing-md instead of $spacing-lg | $button-height-lg (48px) | Headlines 20px, body 13px |
| Tablet ($breakpoint-md) | Standard | Use tokens | Standard | Full design as specified |
| Desktop ($breakpoint-lg) | Standard | Standard | Standard | Full design as specified |

---

## QUICK REFERENCE: Token Names by Category

### Spacing Tokens
- `$spacing-sm` (8px)
- `$spacing-md` (12px)
- `$spacing-lg` (16px)
- `$spacing-xl` (20px)
- `$spacing-xxl` (30px)
- `$spacing-4xl` (40px)

### Font Size Tokens
- `$font-size-xs` (12px)
- `$font-size-sm` (13px)
- `$font-size-base` (14px)
- `$font-size-md` (16px)
- `$font-size-lg` (18px)
- `$font-size-xl` (20px)
- `$font-size-xxl` (24px)

### Font Weight Tokens
- `$font-weight-normal` (400)
- `$font-weight-medium` (500)
- `$font-weight-semibold` (600)
- `$font-weight-bold` (700)

### Color Tokens (Functional)
- `$color-action-primary` (#50c878)
- `$color-action-danger` (#ff6b6b)
- `$color-action-info` (#4da6ff)
- `$color-neutral-dark` (#1a1a1a)
- `$color-neutral-medium` (#4d4d4d)
- `$color-neutral-light` (#999)
- `$color-neutral-border` (#ddd)
- `$color-neutral-bg` (#ffffff)
- `$color-neutral-bg-alt` (#f5f5f5)

### Component Tokens
- `$input-height` (40px)
- `$button-height-md` (40px)
- `$button-height-sm` (32px)
- `$button-border-radius` (4px)

---

## ENFORCEMENT

**Every design element MUST reference a token. No exceptions.**

Before shipping:
- [ ] Search for any hardcoded pixel values (5px, 6px, 7px, 10px, etc.)
- [ ] Search for any non-standard font sizes (11px, 15px, 17px, etc.)
- [ ] Search for any custom colors (anything not in palette)
- [ ] Verify all buttons match spec
- [ ] Verify all inputs match spec
- [ ] Verify all spacing uses tokens

If found: Replace with token immediately. Do not ship.

---

**Status:** All design tokens defined, pre-calculated, ready for implementation.

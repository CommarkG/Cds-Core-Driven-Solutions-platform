---
title: "ETSC Goal Definition System - Prototype Documentation"
date: 2026-07-06
status: PROTOTYPE_READY_FOR_FEEDBACK
scope: Enterprise-Grade Wireframe First
version: 1.0
---

# ETSC PROTOTYPE DOCUMENTATION

## OVERVIEW

This document explains the interactive wireframe prototype for the **ETSC (Evolving Through Sharing & Consulting) Goal Definition System**.

**Purpose:** Visual design review before MVP build. All feedback embedded in HTML comments.

**Approach:** Wireframe-first (structure before polish). Enhance only when design is ratified.

**Interactivity:** Clickable navigation, form inputs, live matching matrices. All self-contained in HTML.

---

## HOW TO USE THE PROTOTYPE

### Opening the Prototype

1. Open file: `ETSC-PROTOTYPE-INTERACTIVE.html` in any web browser
2. Click the tab buttons at top: "Goal Definition Wizard", "Participant Dashboard", "Bundle Configuration", "Architecture Overview"
3. Navigate between screens using buttons
4. Fill forms, select options, see data flow
5. **Read comments:** Each section has embedded `<!-- ANNOTATION: ... -->` comments

### Reading Comments

Right-click on any screen element → "Inspect" → View HTML source to read embedded comments.

Or search HTML source for `<!-- ANNOTATION` to find all feedback points.

### Providing Feedback

**For each annotation comment, provide:**
1. **Screen name** (e.g., "Goal Wizard, Step 2")
2. **Element** (e.g., "AI Analysis Display")
3. **Feedback** (change suggested, question, concern)
4. **Rationale** (why this change)

---

## DESIGN SECTIONS

### SECTION 1: GOAL DEFINITION WIZARD

**Purpose:** Guide admin through creating a goal with AI-assisted refinement.

**Flow:** Linear 6-step progression
1. Initial draft input
2. AI analysis + clarifying questions
3. Core confirmation (locked)
4. Scope settings (presented after core locked)
5. Bundle recommendation (with matching matrix)
6. Review & create (immutable)

**Key Design Decisions:**

#### Step 1: Initial Draft
- **Input:** Free-form textarea
- **Purpose:** Capture admin's initial description
- **Comment Points:**
  - Should have character count? Min/max length?
  - Should offer examples or templates?
  - Help text present? ("Include: what's broken, why it matters, constraints")

#### Step 2: AI Analysis
- **Input:** Answers to clarifying questions
- **Display:** AI extracts problem/solution/constraints
- **Purpose:** AI refines core understanding through Q&A
- **Comment Points:**
  - Should extracted elements be editable inline?
  - Should AI be able to suggest refined wording?
  - Should show confidence score for each extracted element?

#### Step 3: Core Confirmation
- **Display:** Locked problem/root cause/solution/impact/success criteria
- **Purpose:** Confirm core is solid before scope
- **Comment Points:**
  - Should core be editable from this screen, or force going back?
  - Should show version history (how core evolved through refinements)?
  - Should allow adding notes/rationale before locking?

#### Step 4: Scope Settings
- **Input:** Timeline, budget, goal type
- **Display:** AI-recommended goal type (read-only)
- **Purpose:** Define scope ONLY after core is locked
- **Comment Points:**
  - Should timeline be linked to bundle recommendation?
  - Should show estimated cost range based on scope?
  - Should allow multiple goal types (e.g., "This is both Performance + Architecture")?

#### Step 5: Bundle Recommendation
- **Display:** Matching matrix + 3 bundle options (1 primary, 2 alternative)
- **Purpose:** Recommend participant bundle based on goal
- **Comment Points:**
  - Should show more than 3 options?
  - Should show participant current load/capacity?
  - Should allow custom bundle creation (mix participants)?
  - Should show timeline impact per bundle?

#### Step 6: Review & Create
- **Display:** Read-only summary of all decisions
- **Action:** Create goal (immutable in decision-log)
- **Comment Points:**
  - Should allow editing from this screen?
  - Should show SLA/timeline for participants?
  - Should show who will be notified?

---

### SECTION 2: PARTICIPANT DASHBOARD

**Purpose:** Manage participant capabilities, load, and auto-adjust settings.

**Three Sub-Sections:**

#### Part A: Participant List
- **Display:** Table showing all 4 participants (CSP, CSPS, Base44, Lovable)
- **Columns:** Name, Status, Load (X active goals), Capacity (X/Max), Efficiency (0-1), Actions
- **Color Code:** Red (high load), Yellow (medium), Green (low)
- **Comment Points:**
  - Should be sortable/filterable?
  - Should show "next available slot" date?
  - Should show last updated timestamp?

#### Part B: Edit Participant Profile
- **Modal-style form with fields:**
  - Strengths (text, comma-separated)
  - Weaknesses (text, comma-separated)
  - Specializations (checkboxes)
  - Token efficiency (0-1 number)
  - Response SLA (hours)
  - Verification threshold (0-100)
  - Max concurrent goals (number)
  - Auto-adjust settings (timer + action)
- **Comment Points:**
  - Should strengths/weaknesses be tag-based (UI control) or text?
  - Should be able to add new specializations?
  - Should verify token efficiency has tooltip explaining metric?
  - Should auto-adjust timer be global or per-participant?

#### Part C: Send Uniform Prompt
- **Action:** Send standardized self-assessment prompt to participant
- **Prompt Format:** 7 standard questions (strengths, weaknesses, expertise, capacity, SLA, confidence, token efficiency)
- **Purpose:** Participant fills their own profile, admin reviews
- **Comment Points:**
  - Should prompt be customizable per participant?
  - Should show deadline for prompt response?
  - Should admin be able to see/edit participant's responses before approving?
  - Should prompt be sent by email or in-dashboard message?

---

### SECTION 3: BUNDLE CONFIGURATION

**Purpose:** Define participant bundles and wire them to goal types.

**Three Sub-Sections:**

#### Part A: Bundle List
- **Display:** Table of all bundles (name, participants, wired goal types, default status)
- **Highlight:** Default bundle for each goal type (marked with ✓)
- **Comment Points:**
  - Should be able to clone existing bundles?
  - Should show bundle "use count" (how many goals use this)?
  - Should be able to archive unused bundles?

#### Part B: Edit Bundle
- **Form with fields:**
  - Bundle name (text)
  - Description (textarea)
  - Participant selection (checkboxes with current load)
  - Wire to goal types (multi-select checkboxes)
  - Expected timeline (days)
  - Process style (sequential/parallel/hybrid)
- **Comment Points:**
  - Should show "impact analysis" (which active goals would be affected if changed)?
  - Should allow role assignment per participant (e.g., "CSP=Lead, CSPS=Support")?
  - Should process style affect recommendation logic?

#### Part C: Bundle Preview (Matching Matrix)
- **Display:** How well bundle matches to each goal type
- **Columns:** Goal Type, Match %, Wired Status, Capacity, Recommendation
- **Purpose:** Help admin decide optimal wiring
- **Comment Points:**
  - Should matching % be auto-calculated from schema or manually configured?
  - Should show "capacity impact" (how many concurrent goals can this bundle handle)?
  - Should allow in-line wiring changes from this matrix?

---

### SECTION 4: ARCHITECTURE OVERVIEW

**Purpose:** Show integration with Phase 0 and schema alignment.

**Content:**
- Goal creation data flow (draft → AI → core → scope → bundle → create)
- Backend integration points (decision-log, identity-gate, authority-matrix, schema-checksum)
- Schema alignment (goal type, participant, bundle all map to canonical schema nodes)

**Comment Points:**
- Should show how goals appear in decision-log?
- Should show participant notification flow?
- Should show audit trail format?

---

## EMBEDDED COMMENTS (Feedback Points)

All major design decisions have embedded `<!-- ANNOTATION: ... -->` comments in the HTML.

**Types of comments:**

1. **DESIGN:** UX/UI question
   - Example: "Should this be modal or separate page?"

2. **PROCESS:** Workflow question
   - Example: "Should users be able to jump between steps or only go forward/back?"

3. **DATA:** Data model question
   - Example: "Should bundle store participant roles?"

4. **INTEGRATION:** Backend integration question
   - Example: "Should this trigger notification to participants?"

5. **ENTERPRISE:** Scalability/enterprise question
   - Example: "Should this be grouped by status?"

---

## REAL DATA EXAMPLE

Prototype shows a **real example goal:**

```
Goal: "Improve API Performance"
Initial Draft: "We need to improve our API response time. Currently 
              averaging 5 seconds, causing user frustration and 
              $50k/month revenue loss. We think caching and 
              database optimization could help."

Core (Refined):
  Problem: API response slow (5s)
  Impact: User frustration, $50k/month revenue loss
  Solution: Caching layer + database optimization
  Success: 95% of API calls respond in <1s
  
Goal Type: Performance Optimization

Recommended Bundle: "Performance & Architecture" [CSP, CSPS]
Matching: CSP (95% for API perf), CSPS (85% for architecture)
Timeline: 2-4 weeks (Standard)
Capacity: CSP at 3/5, CSPS at 1/3 (both available)
```

**Placeholder states also shown** (e.g., form empty, loading, confirmation).

---

## WIREFRAME STYLE RATIONALE

**Why wireframe first?**

1. **Focus on structure, not polish** - Debate layout/flow before colors/fonts
2. **Fast iteration** - Easy to change boxes/fields without design work
3. **Clear feedback** - "This field should be here" vs "Don't like the color"
4. **Enterprise discipline** - Build rationally, enhance only after approval

**Next phase:** Once design approved, enhance with:
- Typography (font sizes, weights)
- Color system (brand colors, status indicators)
- Icons (visual clarity)
- Spacing/padding (professional polish)

---

## INTERACTIVE FEATURES

Prototype includes **working interactions** to show data flow:

✅ **Tab navigation** - Click "Goal Wizard", "Dashboard", "Bundle Config" to navigate
✅ **Form inputs** - Type in textareas, select from dropdowns
✅ **Matching matrix** - Shows color-coded matches (green=high, yellow=medium, red=low)
✅ **Buttons** - Clickable navigation between steps
✅ **Data flow visualization** - Shows how data moves through system

**Not included** (deferred to MVP):
- Backend API calls
- Real database queries
- Authentication
- Persistence
- Notifications to participants

---

## SCOPE LAYERS (Platform Attitude Applied)

### CORE (This Prototype)
✅ Goal wizard with AI-guided refinement
✅ Participant dashboard (manage capabilities, load)
✅ Bundle configuration (define + wire to goal types)
✅ Recommendation engine (matching matrix)
✅ Schema alignment (vocabulary, hierarchies)

### SCOPE LAYER 1 (After Design Approved)
🔄 Auto-adjust timer logic (warn vs auto-adjust)
🔄 Load balancing suggestions
🔄 Participant self-service prompt filling
🔄 Advanced matching algorithms

### SCOPE LAYER 2+ (Park for Later)
⏸️ ML-based bundle optimization
⏸️ Predictive recommendations
⏸️ Dynamic bundle creation
⏸️ Cross-goal learning patterns
⏸️ Notification system to participants
⏸️ Goal execution tracking dashboard

---

## NEXT STEPS

### Phase 1: Design Review
1. **Open prototype in browser**
2. **Review all 4 screens**
3. **Read embedded ANNOTATION comments**
4. **Provide feedback** on:
   - Layout/structure questions
   - Data flow clarity
   - Terminology/labels
   - Process flow logic
   - Missing elements

### Phase 2: Design Approval
- Iterate prototype based on feedback
- Lock design
- Approve all sections

### Phase 3: MVP Build
- React frontend (using this design as spec)
- Backend APIs (Goal Wizard backend, Participant CRUD, Bundle config)
- Integration with Phase 0

### Phase 4: Hardwire Goal Definition
- Make goal creation mechanically enforced
- Immutable in decision-log
- Prevent bypassing wizard

---

## TECHNICAL NOTES

### Browser Compatibility
- HTML5 standard
- CSS Grid + Flexbox
- Works in all modern browsers
- Mobile responsive (basic)

### File Structure
- Single HTML file (self-contained)
- Embedded CSS (`<style>`)
- Embedded JavaScript (`<script>`)
- No external dependencies

### Making Changes to Prototype
1. Edit HTML file in text editor
2. Refresh browser
3. Changes appear immediately
4. No build tools needed

---

## ANNOTATION QUICK REFERENCE

**Search HTML source for these patterns to find all feedback points:**

```
<!-- ANNOTATION: DESIGN - 
<!-- ANNOTATION: PROCESS - 
<!-- ANNOTATION: DATA - 
<!-- ANNOTATION: INTEGRATION - 
<!-- ANNOTATION: ENTERPRISE - 
<!-- ANNOTATION: OVERALL FEEDBACK - 
```

---

## ENTERPRISE DESIGN PRINCIPLES APPLIED

✅ **Options become architecture** - Bundles, goal types, participants all configurable
✅ **Scope-layered** - CORE now, Layer 1 next, Layer 2+ parked
✅ **Schema-aligned** - All references to canonical nodes (no orphans)
✅ **Wireframe-first** - Structure before polish
✅ **Mechanically enforced** - Goal creation will be hardwired (not advisory)
✅ **Immutable audit trail** - All goals recorded in decision-log
✅ **Permission-gated** - Admin-only for now, role-based later

---

## QUESTIONS FOR FEEDBACK

As you review, ask yourself:

1. **Goal Wizard:** Is the 6-step progression logical? Should users be able to jump between steps?
2. **AI Refinement:** Is Q&A approach right? Should be more/fewer questions?
3. **Core Locking:** Is it right to prevent editing core in Step 3? Or should allow iteration?
4. **Scope After Core:** Is it right to present scope ONLY after core locked?
5. **Bundle Recommendation:** Should show more than 3 options? Should allow custom bundles?
6. **Participant Dashboard:** Should strengths/weaknesses be tag-based or text? 
7. **Auto-Adjust:** Should timer be global or per-participant? What should "auto-adjust" action be?
8. **Bundle Wiring:** Should show "primary" vs "secondary" vs "optional" wiring? Or just checked/unchecked?
9. **Matching Matrix:** Should be auto-calculated or manually configured by admin?
10. **Overall:** What's missing? What's overcomplicated? What should be simplified?

---

## DOCUMENT STRUCTURE

- **This document:** Design rationale + feedback guide
- **Prototype HTML:** Interactive wireframe with embedded comments
- **Next:** Design approval → MVP build plan → Backend architecture

---

**Status:** Ready for design review  
**Format:** Interactive HTML + this guide  
**Approval Gate:** Design locked before MVP build starts  
**Timeline:** Review → Iterate → Approve → Build MVP (Goal Wizard) → Build Dashboard → Build Backend


---
title: "Planning with Options (Don't Decide Drop/Do — Plan All 3)"
date: 2026-07-07
status: GOVERNANCE
version: 1.0
---

# PLANNING WITH OPTIONS

**Problem:** Binary thinking about plans: "Do it or drop it"

**Solution:** Plan all features with 3-option structure. Let plan itself become the reminder. Expand incrementally.

---

## THE PRINCIPLE

**OLD Thinking:** 
- Plan something
- Decide: yes (do it) or no (drop it)
- Binary outcome

**NEW Thinking:**
- Plan everything with 3-option structure
- CORE: Detailed, working implementation
- SCOPE 1: Placeholder pages (context exists, not built)
- SCOPE 2+: Seeds (ideas, not implemented)
- Plan itself serves as reminder + roadmap
- Expand incrementally as context demands

---

## STRUCTURE: PLAN WITH CORE + SCOPES

### CORE (Detailed, Working)
- What: Fully planned, implemented, tested
- How: Complete specification + working code
- Example: Goal Definition Wizard (6 steps, all working, all wired)
- Purpose: Foundation
- Status: COMPLETE + LOCKED

### SCOPE 1 (Placeholder, Context Visible)
- What: Stub pages with titles, exist in system
- How: Page rendered, title shown, content says "Feature coming in SCOPE 1"
- Example: "Approval Workflow" page (exists in nav, shows "Coming soon")
- Purpose: Makes feature discoverable, serves as reminder, context visible
- Status: PLACEHOLDER (UI exists, no backend logic)

### SCOPE 2 (Seeds, Roadmap)
- What: Conceptual ideas, documented but not implemented
- How: In roadmap doc, shows future direction
- Example: "ML-based bundle recommendation" (documented idea, no code)
- Purpose: Long-term vision, guides future work
- Status: IDEA (no code, no UI)

---

## WHY THIS MATTERS

**Benefit 1: Don't Lose Ideas**
- SCOPE 2 seeds ensure ideas aren't forgotten
- They're documented, discoverable
- Can be picked up later with full context

**Benefit 2: Incremental Expansion**
- SCOPE 1 placeholder exists and is ready
- When ready to build SCOPE 1, infrastructure already there
- Not starting from scratch
- Just filling in what's already stubbed

**Benefit 3: Transparent Roadmap**
- Users see what's coming
- No surprises ("Where's the approval workflow?")
- Expectation management built-in

**Benefit 4: Context Continuity**
- Page exists even if not fully built
- Placeholder reminds team "this is important"
- Context preserved across sessions
- Prevents context loss when scope expands

**Benefit 5: No Binary Decision**
- Don't have to decide yes/no
- Plan exists for all paths
- Flexibility to expand based on actual needs
- Reactive prioritization (do CORE first, expand when needed)

---

## HOW TO PLAN WITH OPTIONS

### Step 1: Define CORE
**What you're building NOW (this cycle)**
- Detailed specification
- Complete implementation
- Full testing
- Ready for production

**Example (ETSC):**
```
CORE (S349-S351):
  Goal Definition Wizard (6 steps)
  - All steps fully specified
  - All wiring implemented
  - All edge cases handled
  - READY: Working, tested, locked
```

### Step 2: Define SCOPE 1
**What you're planning NEXT (visible placeholder)**
- Stub pages exist in UI
- Title + "Coming in SCOPE 1" message
- Navigation shows feature
- Infrastructure in place

**Example (ETSC):**
```
SCOPE 1 (S352-S354):
  Approval Workflows
  - Page exists in dashboard nav
  - Shows: "Approval Workflows (Coming in SCOPE 1)"
  - UI skeleton built
  - Backend NOT implemented
  - Waiting for: requirements refinement + team capacity
  
  Status: PLACEHOLDER (Infrastructure ready for implementation)
```

### Step 3: Define SCOPE 2+
**What you're dreaming about (seeds, roadmap)**
- Documented as idea
- No code, no UI yet
- Shows long-term direction
- Picked up when SCOPE 1 stable

**Example (ETSC):**
```
SCOPE 2 (Future):
  ML-based Bundle Recommendation
  - Concept: Analyze goal, auto-recommend optimal bundle
  - Why: Faster goal creation, better matches
  - Not yet: Too early, need baseline data first
  
  Status: IDEA (documented, waiting for feasibility study)
```

---

## STRUCTURE IN CODEBASE

```
ETSC Goal Definition System/
├─ CORE (Working)
│  ├─ Goal Wizard (complete)
│  ├─ Participant Dashboard (complete)
│  ├─ Bundle Configuration (complete)
│  └─ tests/ (all passing)
│
├─ SCOPE 1 (Placeholders)
│  ├─ approval-workflows.tsx (stub, shows "Coming soon")
│  ├─ goal-versioning.tsx (stub)
│  ├─ advanced-matching.tsx (stub)
│  └─ SCOPE1-FEATURE-LIST.md (what's coming)
│
└─ SCOPE 2+ (Ideas)
   ├─ ROADMAP.md (long-term vision)
   ├─ ML-RECOMMENDATIONS-CONCEPT.md (idea document)
   ├─ CROSS-GOAL-DEPENDENCIES.md (idea document)
   └─ NOTIFICATION-SYSTEM-CONCEPT.md (idea document)
```

---

## NAVIGATION & CONTEXT

### User Experience

**User opens ETSC:**
```
Dashboard (CORE - works)
├─ Goal Definition Wizard ✓ (working, full UI)
├─ Participant Dashboard ✓ (working, full UI)
├─ Bundle Configuration ✓ (working, full UI)
├─ Approval Workflows (SCOPE 1 - placeholder)
│  └─ Shows: "Coming in SCOPE 1: Approval workflows are in development"
├─ ML Recommendations (SCOPE 2 - roadmap)
│  └─ Shows: "Coming in SCOPE 2: Smart bundle recommendations"
└─ Advanced Matching (SCOPE 2 - roadmap)
   └─ Shows: "Coming in SCOPE 2+: Advanced goal matching"
```

**Result:**
- User sees what's working (CORE)
- User knows what's coming (SCOPE 1 - near term)
- User sees long-term vision (SCOPE 2+ - strategic)
- No surprises
- Expectation management built-in

### Team Experience

**Team member opens code:**
```
README.md
├─ CORE FEATURES (implemented, stable)
├─ SCOPE 1 FEATURES (in development, UI stubbed)
└─ SCOPE 2+ ROADMAP (strategic ideas)
```

**Result:**
- New team member understands roadmap instantly
- Can see what's stable vs experimental
- Can contribute to right scope based on readiness
- Context preserved across hiring cycles

---

## SCOPE 1 PLACEHOLDER IMPLEMENTATION

**How to build SCOPE 1 placeholder pages:**

```typescript
// scope1-feature-stub.tsx
export function ApprovalWorkflows() {
  return (
    <div className="feature-placeholder">
      <h2>Approval Workflows</h2>
      <div className="coming-soon">
        <p>✓ This feature is coming in SCOPE 1</p>
        <p>Current capabilities: Multi-step goal approval</p>
        <p>Expected availability: Q3 2026</p>
        <button disabled>Feature not yet available</button>
      </div>
      <div className="roadmap-context">
        <h3>What's coming:</h3>
        <ul>
          <li>Submit goals for multi-admin approval</li>
          <li>Track approval status</li>
          <li>Request revisions</li>
          <li>Schedule goal activation</li>
        </ul>
      </div>
    </div>
  );
}
```

**Result:**
- Page is discoverable in navigation
- User knows it's coming (not broken)
- User sees what to expect
- Placeholder serves as reminder to team

---

## PLANNING CHECKLIST

When planning any feature:

- [ ] Define CORE (what's building NOW?)
  - [ ] Detailed specification
  - [ ] Complete implementation
  - [ ] All tests passing
  - [ ] Ready for production

- [ ] Define SCOPE 1 (what's coming NEXT?)
  - [ ] Placeholder page exists
  - [ ] Navigation shows feature
  - [ ] Title + "coming soon" message
  - [ ] Infrastructure in place
  - [ ] Team knows timeline

- [ ] Define SCOPE 2+ (what's the vision?)
  - [ ] Documented in ROADMAP.md
  - [ ] Concept is clear
  - [ ] Why it matters explained
  - [ ] Dependencies identified
  - [ ] Team knows strategic direction

- [ ] Planning is DONE (not dropped)
  - [ ] All 3 scopes planned
  - [ ] CORE working
  - [ ] SCOPE 1 visible
  - [ ] SCOPE 2+ documented
  - [ ] No ideas lost

---

## ANTI-PATTERN: DROPPING PLANS

**❌ WRONG:**
```
Plan something
  ↓
Decide: yes or no?
  ↓
If no: DELETE plan, lose context
  ↓
Result: Forgotten, might reinvent later
```

**✅ RIGHT:**
```
Plan everything
  ↓
Prioritize: CORE now, SCOPE 1 next, SCOPE 2+ later
  ↓
CORE: implement fully
SCOPE 1: placeholder (visible, context preserved)
SCOPE 2+: seeds (documented, roadmap)
  ↓
Result: Nothing lost, can expand incrementally
```

---

## ITERATIVE EXPANSION

### Cycle 1: CORE Complete
```
ETSC v1.0
├─ Goal Wizard (CORE - working)
├─ Participant Dashboard (CORE - working)
├─ Bundle Configuration (CORE - working)
└─ Approval Workflows (SCOPE 1 - placeholder)
```

### Cycle 2: SCOPE 1 becomes CORE
```
ETSC v1.1
├─ Goal Wizard (CORE - enhanced)
├─ Participant Dashboard (CORE - enhanced)
├─ Bundle Configuration (CORE - enhanced)
├─ Approval Workflows (CORE - now working)
└─ ML Recommendations (SCOPE 1 - placeholder)
```

### Cycle 3: Continue Expansion
```
ETSC v2.0
├─ Core features (all enhanced, stable)
├─ Approval Workflows (all features, stable)
├─ ML Recommendations (CORE - now working)
└─ Advanced Matching (SCOPE 1 - placeholder)
```

**Result:** Incremental expansion, no dropped ideas, continuous improvement

---

## INTEGRATION WITH 3-SCOPE METHODOLOGY

This principle IS the 3-Scope methodology applied to planning:

- **CORE scope:** What's fully built, production-ready, locked
- **SCOPE 1:** What's coming next (placeholder visible, infrastructure ready)
- **SCOPE 2+:** What's strategic (ideas, documented, roadmap)

Planning with options = same discipline as building with options.

---

## COMMUNICATION: SCOPE STATUS

**To users:**
- CORE features: "Working, stable, fully supported"
- SCOPE 1 features: "Coming soon, infrastructure in place"
- SCOPE 2+ features: "Long-term vision, not yet started"

**To team:**
- CORE: "Build it completely, test thoroughly, lock it"
- SCOPE 1: "Plan it fully, build placeholder, schedule real work"
- SCOPE 2+: "Document it, understand dependencies, waiting for foundation"

**To stakeholders:**
- "Here's what works (CORE). Here's what's coming (SCOPE 1). Here's our vision (SCOPE 2+)."
- Transparent roadmap, no surprises

---

**Status:** Framework ready for application in all planning  
**Apply to:** Features, dashboards, pages, workflows, integrations  
**Benefit:** Never drop ideas, incremental expansion, context preservation

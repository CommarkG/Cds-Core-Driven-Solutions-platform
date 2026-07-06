---
title: "ETSC Goal Wizard - Admin Enhanced Abilities"
date: 2026-07-06
status: HARDWIRED_INTO_CORE
scope: CORE feature (full admin edit capability)
---

# GOAL WIZARD - ADMIN ENHANCED ABILITIES

## CORE PRINCIPLE

Admin can edit/change goal at ANY point in wizard. No lock-in until explicitly confirmed.

---

## ENHANCED CAPABILITIES (CORE)

### STEP 1: Initial Draft
- **Edit:** Admin can modify draft anytime
- **Revise:** Re-trigger AI analysis with new draft
- **Capability:** `canEditDraft = (userTier === 'ADMIN')`

### STEP 2: AI Analysis
- **Approve/Reject:** Admin can accept or reject AI's extracted elements
- **Manual Override:** Admin can manually edit extracted problem/solution/constraints
- **Re-analyze:** Re-run AI with manual corrections
- **Capability:** `canOverrideAnalysis = (userTier === 'ADMIN')`

### STEP 3: Core Confirmation
- **Edit Core:** Admin can edit core ANYTIME, even after locked
- **Unlock Core:** Change lock status (lock/unlock toggle)
- **Version History:** See all core versions with timestamps
- **Capability:** `canEditCore = (userTier === 'ADMIN')`

### STEP 4: Scope Settings
- **Change Anytime:** Timeline, budget, goal type all editable
- **Auto-Recalculate:** Change goal type → re-recommend bundles
- **Capability:** `canEditScope = (userTier === 'ADMIN')`

### STEP 5: Bundle Recommendation
- **Custom Bundle:** Create ad-hoc bundle mixing participants
- **Override Recommendation:** Ignore recommendation, choose any bundle
- **Create New Bundle:** Define new bundle on-the-fly
- **Capability:** `canCustomizeBundle = (userTier === 'ADMIN')`

### STEP 6: Review & Create
- **Edit Before Creation:** Go back to any step, make changes
- **After Creation:** Edit goal (any field)
- **Delete Goal:** Soft delete with reason
- **Reassign Participants:** Change bundle after creation
- **Refine Goal:** Go through all 6 steps again anytime
- **Capability:** `canEditAfterCreation = (userTier === 'ADMIN')`

---

## ADDITIONAL ADMIN ACTIONS (CORE)

### Goal Dashboard
- **View All Goals:** Filter by status, participant, type, date
- **Search Goals:** By ID, title, description
- **Bulk Actions:** Edit multiple goals at once
- **Export:** Download goal data

### Goal Details View
- **Edit Metadata:** Goal name, description, type
- **Change Participants:** Reassign bundle
- **Extend Timeline:** Push dates
- **Add Notes:** Admin comments (audit trail)
- **View Audit Trail:** Every change logged (who, when, what)
- **Archive Goal:** Hide from active list but keep in history

### Undo/Redo
- **Undo Last Change:** Revert to previous state
- **Redo:** Re-apply change
- **History:** Step through all past states
- **Capability:** `canUndoRedo = (userTier === 'ADMIN')`

---

## IMPLEMENTATION PATTERN

```typescript
interface GoalWizardProps {
  goal: Goal;
  userTier: 'ADMIN' | 'TRUSTED' | 'EXTERNAL';
  mode: 'create' | 'edit' | 'view';  // NEW
}

// STEP 1: Initial Draft
<textarea 
  value={goal.initialDraft}
  disabled={userTier !== 'ADMIN' || mode === 'view'}  // SHUTDOWN: disabled for non-admin
  onChange={handleDraftChange}
/>

// STEP 3: Core Confirmation
<div className={goal.coreLocked && userTier !== 'ADMIN' ? 'locked' : ''}>
  <input value={goal.core.problem} disabled={!canEditCore} />
  <button disabled={!canEditCore} onClick={toggleCoreLock}>
    {goal.coreLocked ? 'Unlock Core' : 'Lock Core'}
  </button>
</div>

// ENTERPRISE SCOPE 1: Approval Workflow (disabled for CORE)
<div className={userTier === 'ADMIN' ? '' : 'disabled'}>
  <button disabled={userTier !== 'ADMIN'}>Submit for Approval</button>
  <p className="help-text">
    {userTier !== 'ADMIN' && 'Coming in Enterprise Scope 1'}
  </p>
</div>
```

---

## AUDIT TRAIL EXAMPLE

```
Goal: "Improve API Performance" (GOAL-260706-001)

2026-07-06 10:00 — Admin created goal
  Initial draft: "We need to improve our API response time..."
  Core locked: NO

2026-07-06 10:15 — Admin edited initial draft
  Before: "We need to improve..."
  After: "Critical: Our API response time is causing $50k/month revenue loss..."
  AI re-analysis triggered

2026-07-06 10:30 — Admin unlocked core
  Action: Core unlocked
  Reason: "Need to refine success criteria"

2026-07-06 10:35 — Admin edited core
  Field: success_criteria
  Before: "95% of API calls respond in <1s"
  After: "99% of API calls respond in <500ms"

2026-07-06 10:45 — Admin locked core
  Core locked: YES

2026-07-06 11:00 — Admin created goal (immutable entry)
  Bundle: "Performance & Architecture" [CSP, CSPS]
  Status: PENDING
  Decision-log entry: DECISION-260706-042

2026-07-06 15:00 — Admin reassigned bundle
  Before: [CSP, CSPS]
  After: [CSP] (Quick turnaround)
  Reason: "Realized scope smaller, CSP sufficient"

2026-07-06 16:00 — Admin extended timeline
  Before: "2-4 weeks"
  After: "4-6 weeks"
  Reason: "CSP requested additional discovery time"
```

---

## TRUSTED TIER BEHAVIOR (SHUTDOWN)

```
Goal Wizard (TRUSTED tier):
✓ Can VIEW goal
✗ Cannot EDIT initial draft (button disabled)
✗ Cannot EDIT core (textarea disabled)
✗ Cannot CHANGE bundle (select disabled)
✗ Cannot DELETE goal (button hidden)
✗ Cannot REASSIGN participants (button hidden)

Interface shows:
- All fields visible
- All buttons present but GRAYED OUT
- Tooltip on each: "Admin feature"
- Help text: "Contact admin to edit this goal"

Audit trail shows:
- All access attempts logged
- "TRUSTED user attempted to edit core (action blocked)"
```

---

## STATUS

✅ **HARDWIRED INTO CORE**

Admin enhanced abilities are:
- Not optional
- Mechanically enforced
- Full edit capability at all times
- Complete audit trail
- No restrictions (admin is ultimate authority)

This is CORE. TRUSTED tier gets same UI but with SHUTDOWN applied to these capabilities.

---

**Authority:** CDS Orchestrator  
**Effective:** 2026-07-06  
**Applies to:** All admin workflows

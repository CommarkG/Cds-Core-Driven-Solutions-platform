---
title: "CDS 3-Scope Enterprise Methodology"
date: 2026-07-06
authority: Yariv Fink (Governor)
status: PERMANENT_HARDWIRED_GOVERNANCE
scope: Core + Enterprise Scope 1 + Enterprise Scope 2 + Enterprise Scope 3
---

# CDS 3-SCOPE ENTERPRISE METHODOLOGY

## CORE PRINCIPLE: Capability Shutdown, Not Separate UIs

**Never build separate interfaces for different tiers.**

Build ONE interface with ALL capabilities.
- ADMIN tier: All capabilities ACTIVE
- TRUSTED tier: Some capabilities DISABLED (grayed out, no interaction)
- EXTERNAL tier: Most capabilities DISABLED
- INTERNAL tier: No access (hidden entirely)

**Why:** 
- Single codebase, easier maintenance
- Consistent UX across all tiers
- Capabilities scale predictably
- Less logic duplication
- Clear visibility of what each tier is missing

---

## TEMPLATE: 3-SCOPE ENTERPRISE ARCHITECTURE

When planning ANY enterprise feature:

### SCOPE 0: CORE (Build Now, Full Detail)

**What:** Fundamental capability in production
**Detail Level:** 100% detailed
**Admin Abilities:** FULL (create, edit, delete, refine, reassign, audit)
**Who:** Admin tier only
**Example:** Goal Definition Wizard with full edit capability

```
CORE FEATURES:
✓ Create goal (6-step wizard)
✓ Edit goal (all fields, after creation)
✓ Delete goal (soft delete with audit)
✓ Reassign participants (change bundle)
✓ Refine goal (revisit steps 1-5 anytime)
✓ View audit trail (immutable decision log)
```

**Implementation:**
- Full feature set in code
- All CRUD operations enabled
- No permission checks (admin only = no need)
- Immutable audit trail
- Ready for production

---

### SCOPE 1: ENTERPRISE SCOPE 1 (Defined, Placeholders Set)

**What:** Next tier of capabilities
**Detail Level:** 70% detailed (placeholder UX, no backend logic yet)
**Admin Abilities:** Same as CORE (admin can see/use placeholders)
**Who:** Admin tier (preview), TRUSTED tier (disabled)
**Example:** Participant approval workflows, multi-admin governance

```
ENTERPRISE SCOPE 1 FEATURES:
⚠️ Approve goal (workflow: submitted → approved → live)
⚠️ Multi-admin review (2+ admins must sign off)
⚠️ Participant response (participants can comment/accept/reject)
⚠️ Revision requests (admin can send back for refinement)
⚠️ Scheduled activation (goal created but starts later)
```

**Implementation:**
- UI fully built (forms, buttons, workflows)
- Backend logic NOT implemented (stubbed)
- Admin can navigate & fill forms (but results don't persist)
- Placeholder notifications
- Shows roadmap to TRUSTED tier

**Capability Shutdown Pattern:**
```
IF admin:
  Show all fields, buttons ENABLED
  Backend logic: ACTIVE
  
IF trusted:
  Show all fields, buttons DISABLED (grayed, no click)
  Tooltip: "Coming in Enterprise Scope 1"
  
IF external:
  Don't show this section at all
  (hidden from render)
```

---

### SCOPE 2: ENTERPRISE SCOPE 2 (Surface Definition, Roadmap)

**What:** Advanced governance
**Detail Level:** 30% defined (concept only, no UI/backend)
**Admin Abilities:** Documented, not yet accessible
**Who:** Admin tier (conceptual preview)
**Example:** Conflict resolution workflows, automated recommendations

```
ENTERPRISE SCOPE 2 FEATURES:
🔲 Auto-bundle recommendation (ML suggests optimal participants)
🔲 Conflict detection & escalation (auto-flag conflicting goals)
🔲 Load balancing (auto-adjust goals if participant overloaded)
🔲 Goal dependencies (goal B can't start until goal A done)
🔲 Milestone tracking (goals have checkpoints, not just start/end)
```

**Implementation:**
- Documented in UI (menu items, help text explaining features)
- No UI yet (shows "Coming in Enterprise Scope 2")
- No backend logic
- Help/documentation only
- Roadmap visible to admin

---

### SCOPE 3: ENTERPRISE SCOPE 3+ (Future, Parked)

**What:** Long-term evolution
**Detail Level:** <10% (ideas only)
**Admin Abilities:** Not visible
**Who:** Future tiers
**Example:** Multi-organization support, cross-platform goal synthesis

---

## IMPLEMENTATION PATTERN: Capability Shutdown

### Single Codebase, Permission-Gated

```typescript
// ONE component, multiple tiers
interface GoalWizardProps {
  goal: Goal;
  userTier: 'ADMIN' | 'TRUSTED' | 'EXTERNAL';
}

function GoalWizard({ goal, userTier }: GoalWizardProps) {
  const canEdit = userTier === 'ADMIN';           // SHUTDOWN: Edit button disabled for TRUSTED/EXTERNAL
  const canDelete = userTier === 'ADMIN';         // SHUTDOWN: Delete button disabled for TRUSTED/EXTERNAL
  const canReassignParticipants = userTier === 'ADMIN'; // SHUTDOWN
  const canViewAuditTrail = userTier === 'ADMIN'; // SHUTDOWN
  
  return (
    <>
      {/* Step 1: Initial Draft */}
      <textarea 
        value={goal.initialDraft} 
        disabled={!canEdit}  // SHUTDOWN: textarea disabled for TRUSTED
        onChange={handleUpdate}
      />
      
      {/* Step 5: Bundle Recommendation */}
      <select 
        value={goal.bundleId}
        disabled={!canReassignParticipants}  // SHUTDOWN: select disabled for TRUSTED
        onChange={handleBundleChange}
      >
        {bundles.map(b => <option key={b.id}>{b.name}</option>)}
      </select>
      
      {/* Enterprise Scope 1: Approval Workflow */}
      {goal.status === 'DRAFT' && (
        <div className={canEdit ? '' : 'disabled'}>  // SHUTDOWN: entire section grayed for TRUSTED
          <button disabled={!canEdit} onClick={submitForApproval}>
            Submit for Multi-Admin Approval
          </button>
          <p className="help-text">
            {!canEdit && 'Coming in Enterprise Scope 1'}
          </p>
        </div>
      )}
    </>
  );
}
```

### Never Do This (❌ Wrong Pattern)

```typescript
// WRONG: Separate components per tier
if (userTier === 'ADMIN') {
  return <AdminGoalWizard />;
} else if (userTier === 'TRUSTED') {
  return <TrustedGoalWizard />;
} else {
  return <ExternalGoalWizard />;
}
```

Why wrong:
- 3x code duplication
- Inconsistent UX
- Hard to maintain
- Doesn't scale

---

## HOW TO APPLY TO GOAL DEFINITION WIZARD

### CORE (Built Now)

```
Goal Wizard - ADMIN ABILITIES:
✓ Step 1: Input draft (editable)
✓ Step 2: AI analysis (editable before core locked)
✓ Step 3: Core confirmation (editable until locked)
✓ Step 4: Scope settings (editable)
✓ Step 5: Bundle recommendation (can choose option)
✓ Step 6: Review & create (can go back and change)

AFTER CREATION:
✓ Edit goal (any field, any time)
✓ Delete goal (soft delete)
✓ Reassign participants (change bundle)
✓ Refine goal (go back through all 6 steps)
✓ View audit trail (show all changes)
✓ Lock goal (prevent further edits)
```

### ENTERPRISE SCOPE 1

```
Approval Workflow (placeholder UI):
⚠️ Submit goal for multi-admin approval
⚠️ Show approval status (pending, approved, rejected)
⚠️ Admin A can approve, Admin B reviews
⚠️ Request revisions (send back to original admin)
⚠️ Scheduled activation (goal created but doesn't go live until date X)

Implementation:
- UI built (forms, buttons, status displays)
- Backend stubbed (no persistence)
- Admin can navigate, but changes don't save
- Shows roadmap to TRUSTED tier
```

### ENTERPRISE SCOPE 2

```
Advanced Governance (surface definition):
🔲 Auto-recommend bundle (ML analyzes goal → suggests optimal participants)
🔲 Conflict detection (goal overlaps with existing goal → auto-flag)
🔲 Participant consensus (participants can comment/accept bundle)
🔲 Escalation workflow (if disagreement, auto-escalate to Governor)

Implementation:
- Documented in UI (menu items, help text)
- No UI yet
- No backend logic
- Roadmap only
```

---

## CAPABILITY SHUTDOWN CHECKLIST

For EVERY feature in EVERY scope:

- [ ] Built ONE component for all tiers
- [ ] Admin tier: All capabilities ENABLED
- [ ] TRUSTED tier: Capabilities disabled (grayed, no interaction)
- [ ] EXTERNAL tier: Capabilities hidden (not rendered)
- [ ] Help text explains: "Available in CORE" vs "Coming in Enterprise Scope X"
- [ ] No separate code paths per tier (use `disabled`, `hidden`, conditional render)
- [ ] Audit trail logs all access attempts (including disabled actions)
- [ ] Gradual unlock: TRUSTED → ADMIN via role promotion
- [ ] Future: Remove SHUTDOWN markers → Feature becomes available to tier

---

## VERSIONING SCOPES

### How Scopes Activate

```
Initial Release (2026-07-22):
  CORE: ACTIVE (all features)
  SCOPE 1: VISIBLE (UI built, backend stubbed, admin can preview)
  SCOPE 2: VISIBLE (documented only)
  SCOPE 3: HIDDEN (roadmap only)

Phase 2 (2026-08-31):
  CORE: ACTIVE (mature, stable)
  SCOPE 1: ACTIVE (backend implemented, all capabilities work)
  SCOPE 2: VISIBLE (UI built, backend stubbed)
  SCOPE 3: VISIBLE (documented)

Phase 3 (2026-10-15):
  CORE: STABLE
  SCOPE 1: STABLE
  SCOPE 2: ACTIVE (fully implemented)
  SCOPE 3: VISIBLE

Phase 4+ (2026-12+):
  All scopes ACTIVE
```

---

## TIER PROGRESSION

### How TRUSTED → ADMIN Works

```
Day 1: TRUSTED joins
  UI shows all features
  Editable fields: DISABLED
  Buttons: DISABLED (grayed out)
  Help text: "Admin feature, request access to enable"
  
Day N: TRUSTED proves capability (10+ goals verified)
  Admin reviews: "Promote to ADMIN?"
  If approved: Permission granted
  UI features: ENABLED automatically
  No code change needed (capability shutdown removed)
```

---

## STATUS

**PERMANENT HARDWIRED GOVERNANCE**

This 3-scope methodology applies to:
- ✅ Goal Definition Wizard (CORE built, SCOPE 1/2 designed)
- ✅ Participant Dashboard (CORE built, SCOPE 1/2 designed)
- ✅ Bundle Configuration (CORE built, SCOPE 1/2 designed)
- ✅ All future features (must follow this pattern)

**Enforcement:**
- Every feature plan must include 3 scopes
- Code review: Check for capability shutdown pattern
- No separate UIs per tier (automatic rejection)
- Gradual unlock: Clear progression path

---

**Authority:** Yariv Fink (Governor)  
**Effective:** 2026-07-06  
**Applies to:** All CDS features, all scopes, all tiers

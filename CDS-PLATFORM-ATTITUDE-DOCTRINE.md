---
title: "CDS Platform Attitude Doctrine"
date: 2026-07-06
authority: Yariv Fink (Governor)
status: FOUNDATIONAL_GOVERNANCE
version: 1.0
---

# CDS PLATFORM ATTITUDE DOCTRINE

## CORE PRINCIPLE: Optionality-First Architecture

**Definition:** CDS builds architecture that ENABLES options, rather than choosing paths upfront.

**Not:** "Which path is best? Pick one."  
**Instead:** "How do we create architecture that respects ALL paths are valid?"

---

## FOUR PILLARS

### 1. OPTIONS BECOME ARCHITECTURE

**What This Means:**
When multiple valid approaches exist, don't eliminate them. Build architecture with **decision points** where variants plug in.

**Principle:**
```
WRONG: "Should we allow TRUSTED to submit OR EXTERNAL to request?"
       → Pick one, hard-code it

CORRECT: "How do we create SUBMISSION_LAYER that both can use with different permission gates?"
         → Build the layer, gate behavior is variant
```

**Implementation:**
- Identify the core action (SUBMIT)
- Identify variants (SUBMIT_AS_TRUSTED, SUBMIT_AS_EXTERNAL)
- Build permission gates that distinguish them
- Same layer, different authorities

**Example in CDS:**
- Core: "Element can be added to registry"
- Variants: Admin adds (no review), TRUSTED adds (24h review), EXTERNAL adds (requires verification)
- Architecture: Single ADD_ELEMENT operation with permission matrix

---

### 2. ENDLESS OPTIONS AWARENESS

**What This Means:**
Explicitly accept that infinite use cases exist. Don't try to predict them all upfront.

**Principle:**
```
WRONG: "Let me design for: Admin use, TRUSTED use, EXTERNAL use, future use..."
       → Over-engineered, brittle when reality diverges

CORRECT: "What are the CORE INVARIANTS that MUST be true?
          What are OPTION POINTS where variants can plug in?
          What can we defer?"
       → Minimal core, flexible extension points
```

**Core Invariants vs Option Points:**

| Invariant | Option Point |
|-----------|--------------|
| Every decision is logged (immutable) | How decision is made (voting, consensus, admin, etc.) |
| Every actor is authenticated | How authentication works (API key, RSA, OAuth, etc.) |
| Every change creates audit trail | What granularity of audit (field-level? operation-level?) |
| Conflicts are detected | How conflicts are resolved (manual, automatic, escalation rules) |
| Tiers have permissions | Which tiers exist (Admin/TRUSTED/EXTERNAL or custom?) |

**Practice:**
- When designing a feature, ask: "What MUST be true?" (invariant)
- Then ask: "How many ways can this be true?" (option point)
- Build for invariant, make option points pluggable

---

### 3. CORE-FIRST, SCOPE-LAYERED

**What This Means:**
Build only what's essential now, group future work into labeled scopes, activate layers independently.

**Principle:**
```
ARCHITECTURE LAYERS:

CORE (Build Now - Non-negotiable):
  - Goal definition
  - Element identity & versioning
  - Audit trail (immutable decision log)
  - Permission matrix
  - Conflict detection

SCOPE LAYER 1 (Activate When Ready):
  - Participant bundle recommendations
  - Automated suggestion logic
  - Reasoning explanations

SCOPE LAYER 2 (Defer):
  - Multi-tier governance voting
  - Consensus algorithms
  - Platform-specific customization

SCOPE LAYER 3+ (Future):
  - Machine learning recommendations
  - Predictive conflict detection
  - Cross-platform element deduplication
```

**Rule:** Each layer must:
- [ ] Define clear entry point (what triggers this layer)
- [ ] Have no hard dependency on future layers
- [ ] Be independently testable/auditable
- [ ] Identify what it ASSUMES from previous layers
- [ ] Park what it doesn't solve (into next scope)

---

### 4. PROCESSES, NOT PRODUCTS

**What This Means:**
View the system as continuous flows, not static deployments.

**Principle:**
```
WRONG: "Build the Goal Management System" (one product, deployed once)

CORRECT: "Design the Goal Definition PROCESS:
          1. Admin defines goal (input)
          2. System validates against core invariants (validation)
          3. Recommendation engine suggests participants (decision)
          4. Admin reviews & chooses bundle (review)
          5. Participants onboarded (execution)
          6. Goal execution tracked (observation)
          7. Learnings extracted (reflection)
          8. Future goals informed by learnings (feedback)"
```

**Why:**
- Processes are reversible (can undo any step with audit trail)
- Processes are observable (can see exactly where system is)
- Processes are auditable (why was this choice made?)
- Processes are extensible (can insert new steps without breaking others)

**Implementation:**
- Map feature as a process flow, not a feature set
- Identify decision points in the flow
- Make decisions mechanically enforced, not advisory
- Log every decision with reasoning
- Enable flow to be analyzed for improvements

---

## HOW TO APPLY THIS DOCTRINE

### **When Planning a New Feature:**

1. **Extract Core Invariants**
   - "What MUST be true regardless of how this feature is used?"
   - Example: "Every participant assignment MUST be auditable"
   - Build this first, non-negotiable

2. **Identify Option Points**
   - "In how many ways can this be achieved?"
   - Example: Participants can be: human-recommended, auto-suggested, admin-chosen
   - Build architecture that supports all variants

3. **Scope Future Variants**
   - "What would be nice but isn't required now?"
   - Example: "ML-based recommendation engine" → Park in SCOPE LAYER 2
   - Document assumption: "Current implementation assumes admin makes choice, future can auto-suggest"

4. **Design for Extensibility**
   - Where would variant logic plug in? (permission gate? recommendation engine? decision criteria?)
   - What would need to change to add new variant? (only config? only permission? only algorithm?)
   - Minimize what needs to change

5. **Create Scope Checklist**
   - What does this layer enable?
   - What does it defer?
   - What does next layer depend on from this layer?
   - What's the activation trigger for next layer?

---

## CDS UNIQUE POSITION

Traditional systems: "Build for all use cases upfront"  
→ Result: Over-engineered, brittle, slow

CDS Platform Attitude: "Build core, enable options, defer variants"  
→ Result: Minimal complexity, flexible extension, fast iteration

This is CDS's differentiator. Not "we support everything," but "our architecture RESPECTS that everything is possible without forcing it now."

---

## HYBRID SYMBIOTIC: Hard-Code + AI

**Hard-Code Defines:**
- Core invariants (immutable)
- Option points (where variants plug in)
- Scope boundaries (what's in, what's out)
- Audit trail format (immutable)

**AI Freestyle Banned:**
- No "suggest features without scope"
- No "let's just add this for flexibility"
- No "future-proof by building everything"

**AI Role:**
- Implement within defined scope
- Identify variants (if code could work multiple ways, ask: option point?)
- Suggest scope boundaries (what's core vs deferrable?)
- Audit: Does implementation respect doctrine?

**Hybrid Execution:**
1. Human defines core + scope
2. AI implements core rigorously
3. AI identifies option points
4. AI documents what's parked and why
5. Human reviews, approves, gates next scope

---

## STATUS

This doctrine is now **PERMANENT GOVERNANCE** for all CDS planning and implementation.

Every feature plan must include:
- [ ] Core invariants identified
- [ ] Option points documented
- [ ] Scopes labeled (Layer 1, 2, 3)
- [ ] Activation triggers defined
- [ ] What's parked (and why)

---

**Effective:** 2026-07-06  
**Applies to:** All future features, all scopes, all team members  
**Authority:** Yariv Fink (Governor)

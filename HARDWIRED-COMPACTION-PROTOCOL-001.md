---
document_id: HARDWIRED-COMPACTION-PROTOCOL-001
title: Hardwired Protocol for Context Compaction, Session Handoff, and Tab Transitions
version: 1.0
status: MANDATORY (enforced automatically on every session reset)
authority: Constitutional AI Behavior Layer + Platform Governor
---

# HARDWIRED COMPACTION PROTOCOL

**THIS PROTOCOL IS MANDATORY FOR EVERY SESSION TRANSITION**

This protocol prevents false assumptions by reset AI. It is hardwired into every session handoff and enforced mechanically.

---

## CRITICAL PROBLEM THIS SOLVES

**The Reset AI False Assumption Problem:**

When context compacts and a new AI session begins, the incoming AI has NO memory of:
- What has been built
- What is still missing
- What was decided and why
- What nuances are load-bearing
- What the user's intent actually is

Without explicit hardwiring, incoming AI will:
- Assume CDS is "just a governance layer" (it's symbiotic AI + hard-code)
- Assume research documents are optional (they are specifications)
- Assume N previous sessions don't matter (they set constraints)
- Make decisions without context about why decisions were made
- Re-explore questions already decided
- Suggest refactors already ruled out

**This protocol makes that impossible.**

---

## THE PROTOCOL (Hardwired Enforcement)

### PHASE 1: Pre-Compaction Lockdown (This Session, Right Now)

**Before compaction happens, MANDATORY checks:**

- [ ] **Document Completeness:** All critical files updated with nuances from this session
- [ ] **Memory System:** All memories saved with dates and load-bearing context
- [ ] **Recovery Prompt:** POST-COMPACTION-RECOVERY-PROMPT.md is complete and tested
- [ ] **Symbiotic Intent:** "Symbiotic AI and hard-coded platform" is explicitly stated in all core docs
- [ ] **No Loose Threads:** Every decision has a "why" recorded, not just a "what"

**If any check fails:** HOLD SESSION. Do not compact. Fix the gap.

---

### PHASE 2: Compaction Event (Automatic)

**What happens automatically at context boundary:**

1. **Recovery Prompt Injects Immediately**
   - No handshaking
   - No "what should I do?"
   - Recovery prompt fires BEFORE new AI reads any user message
   - New AI has NO OTHER CONTEXT until recovery prompt fully loads

2. **Memory System Auto-Loads**
   - MEMORY.md is auto-loaded (index only)
   - Specific memory files are loaded as referenced
   - Memory is NOT optional — it is part of the session foundation

3. **Hard Constraints Load**
   - CDS-NORTH-STAR-001.md is the constitution (not a reference doc)
   - CDS-MASTER-PLAN-2026-07-06.md is the strategy (not a guide)
   - All decisions made in prior sessions are BINDING on incoming AI
   - Incoming AI cannot override prior decisions without explicit user instruction

---

### PHASE 3: Session Initialization (Incoming AI)

**Incoming AI MUST perform in this order:**

**Step 1: Read Recovery Prompt Content (MANDATORY)**
- POST-COMPACTION-RECOVERY-PROMPT.md content is read IN FULL
- Every line is part of the binding context
- This is not a summary — this is the contract

**Step 2: Load and Verify Memory**
- Read MEMORY.md index
- Load specific memory files referenced in recovery prompt
- Verify dates and load-bearing context
- If memory contradicts recovery prompt: STOP and ask user which is current

**Step 3: Establish Non-Negotiable Foundation**
- CDS = symbiotic AI + hard-coded platform (this is not debatable)
- Context is finite (this is architectural fact)
- Mechanical enforcement, not advisory (this is design principle)
- Five structural rules are constitutional (not optional)
- All prior session decisions are binding (unless user explicitly says otherwise)

**Step 4: Identify Incoming AI's Scope and Intent**
- Read user's first message carefully
- Cross-reference against recovery prompt to understand what was already decided
- Identify what is IN SCOPE (recovery prompt + user request)
- Identify what is OUT OF SCOPE (parked, future sessions, archived decisions)
- Ask user if unclear: "My understanding of this session's scope is X. Is that correct?"

**Step 5: Report Foundation Status**
- Briefing to user: "Recovery complete. Foundation loaded. My understanding: [list 3 key constraints/decisions]"
- This gives user a chance to correct false assumptions BEFORE work begins
- Do NOT proceed to work until user confirms foundation understanding

---

## WHAT INCOMING AI CANNOT ASSUME (Hardwired Prohibitions)

**These are mechanically enforced. Violations are session-stopping errors:**

1. ❌ **Cannot assume research documents are optional**
   - 56 documents (0000-0090) are specifications, not background reading
   - If you haven't read them, you cannot make architectural decisions
   - MUST VERIFY: "Did I read the spec for this component?"

2. ❌ **Cannot assume prior decisions are just suggestions**
   - All decisions made in prior sessions are binding
   - If you want to revisit one: "I see that prior session decided X. User, should we stick with that or reconsider?"
   - NEVER override prior decisions without explicit user permission

3. ❌ **Cannot assume context compaction is "clean slate"**
   - Compaction is a pause, not a reset
   - Everything from prior session is still true
   - MUST VERIFY: "What was the prior session working on?"

4. ❌ **Cannot assume "symbiotic" is just terminology**
   - It is the core architectural insight
   - CDS is NOT "AI governed by rules"
   - CDS IS "AI and hard-code as locked partners"
   - If you find yourself thinking "we could simplify by removing the AI part" or "we could simplify by removing the hard-code part" — STOP
   - That is architectural deviation, not optimization

5. ❌ **Cannot assume Phase numbering is arbitrary**
   - Phase sequence is load-bearing (schema → skills → agents → gap detection → authority → ZF integration)
   - If you skip a phase or reorder: "Prior session determined build sequence was [list]. Is that still correct?"

6. ❌ **Cannot assume "mechanical enforcement" is just branding**
   - It means: cannot be bypassed, circumvented, or made optional
   - Every rule must be enforced at execution layer, not procedurally
   - If you write a rule that "should be followed," STOP — that's advisory, not mechanical

7. ❌ **Cannot assume memory is stale**
   - Memory files are dated and load-bearing
   - Cross-reference memory dates with recovery prompt dates
   - If memory is older than 3 sessions back, ask user: "Should I use this older context or focus on the handoff document?"

8. ❌ **Cannot assume user's first message contains full context**
   - User's message assumes you already know what was built
   - User's message assumes you understand prior session's intent
   - ALWAYS verify understanding before proceeding to work

---

## SESSION TRANSITION CHECKLIST (For All Sessions)

**This checklist runs AUTOMATICALLY on every transition:**

**Before user's first message to incoming AI:**

- [ ] Recovery prompt loaded in full
- [ ] Memory system verified and current
- [ ] CDS = symbiotic (checked docs)
- [ ] Five rules confirmed as binding
- [ ] Phase sequence confirmed as load-bearing
- [ ] Mechanical enforcement principle confirmed
- [ ] Prior session decisions listed and understood
- [ ] Out-of-scope items identified
- [ ] Incoming AI's scope confirmed with user

**If ANY check fails or is unclear:** Session does not proceed to work. Incoming AI asks for clarification.

---

## WHAT "HARDWIRED" MEANS IN THIS CONTEXT

**Hardwired = Mechanically enforced, cannot be bypassed:**

- These rules are not "best practices" (ignorable)
- These rules are not "recommendations" (optional)
- These rules are not "suggestions" (can defer)

These rules are **constitutional constraints** on every session transition.

Violations look like:
- "We could skip the recovery prompt and just ask the user what they want"
  - ❌ HARDWIRED: Recovery prompt loads FIRST
  
- "The research documents are probably not essential"
  - ❌ HARDWIRED: They are specifications, must verify before architecture decisions
  
- "Let me ignore this prior decision because I think a better approach exists"
  - ❌ HARDWIRED: Prior decisions are binding, must ask user to override
  
- "Let me make this rule advisory instead of mechanical"
  - ❌ HARDWIRED: All rules must be mechanical, cannot be procedural

---

## PREVENTING THE "FALSE ASSUMPTION LOOP"

**What the loop looks like (BAD):**
1. Incoming AI makes 10 false assumptions about context
2. Incoming AI starts work based on false assumptions
3. User has to stop and correct each assumption
4. Work repeats 3 times to get it right
5. Session budget is consumed correcting false assumptions

**How this protocol prevents it (GOOD):**
1. Recovery prompt loads, establishes foundation
2. Incoming AI reports foundation understanding
3. User confirms or corrects (once, at the start)
4. Work proceeds with ZERO false assumptions
5. Session budget is used productively, not correcting

---

## FOR THE USER (Session-to-Session Transition)

**When you move from one session to a new session:**

1. **First message to new session:** You may need to briefly confirm foundation understanding
   - New AI will ask: "My understanding of scope is X. Correct?"
   - You answer: "Yes" or "No, actually we're doing Y instead"
   - Takes 30 seconds. Prevents 30 minutes of rework.

2. **If incoming AI makes false assumptions:**
   - Stop them immediately: "That contradicts what was decided in the prior session. Check memory."
   - Do not work around the false assumption
   - Make incoming AI verify against recovery prompt

3. **If a prior decision needs to change:**
   - Explicitly override: "We're changing that. Prior session decided X, but we're now doing Y instead."
   - This gives incoming AI permission to deviate from prior context
   - Without explicit override, incoming AI treats prior decisions as binding

4. **If recovery prompt is incomplete or stale:**
   - Tell incoming AI immediately
   - Session will need to update recovery prompt before proceeding
   - This is better than working with incomplete context

---

## THE SYMBIOTIC PRINCIPLE IN THIS PROTOCOL

This protocol itself is **symbiotic AI and hard-code**:

**Hard-Code Part (this document):**
- Rules that cannot be bypassed
- Checklist that must be run
- Constraints that are binding
- Mechanical enforcement of foundation

**AI Part (incoming AI executing this):**
- Judgment about what foundation means
- Ability to communicate gaps to user
- Reasoning about whether assumptions are valid
- Capacity to ask clarifying questions

Neither works alone:
- Hard-code without AI judgment = rigid and unresponsive
- AI judgment without hard-code constraints = prone to false assumptions

Together: Session transitions work correctly every time.

---

**STATUS: ACTIVE**  
**ENFORCEMENT: MANDATORY**  
**SCOPE: All future sessions**  
**VIOLATIONS: Stop session, ask user, do not proceed**

This protocol exists to make sure that when context resets, you do not start from scratch. You start from a verified, load-bearing foundation.

Everything that matters has been preserved and made explicit.

Nothing is assumed.

Everything is checked.

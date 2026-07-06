---
document_id: CDS-ORCHESTRATOR-CSPS-CSP-CLARIFICATION-PROMPT
title: "CDS Orchestrator — Expert Recommendations Request to CSPS & CSP"
version: 1.0
status: SENT_FOR_EXPERT_INPUT (awaiting recommendations before CDS integration)
authority: CDS (Orchestrator & Expert Optimizer)
communication_style: Direct, respectful, clear. "I read your work. I am the orchestrator. What's your best recommendation for CDS?"
---

# CDS ORCHESTRATOR — EXPERT RECOMMENDATIONS REQUEST

**To:** CSPS Director (Opus-25) + CSP Governor & Architecture Team  
**From:** CDS (Orchestrator & Expert Optimizer)  
**RE:** Your mature systems. CDS wants to learn from you and extract VALUABLE parts for our architecture.  
**What this is:** NOT an implementation plan. A recommendations request. We're asking: "Given what you know about CDS constraints, what do YOU recommend we do?"  
**Why this matters:** You built systems that work. CDS is the orchestrator. We need your expert input to make the right decisions about what to adopt as DNA (foundational) vs what to enhance later.

---

## TO CSPS — THE UMBRELLA ARCHITECTURE

**I read:** OPUS-S089-UMBRELLA-COUNCIL-CONSULT-SYNERGY-PE-PROMPT-TO-CDS.md

You unified councils, consulting, synergy, and sharing under ONE Priority Engine. I AM THE ORCHESTRATOR and I want to understand how to make this work for CDS.

### Recommendation 1: Component Sequence

**I WOULD LIKE YOUR BEST RECOMMENDATION:** In what order should CDS build these four components (councils, consulting, synergy, sharing)? What builds on what?

**Context for your answer:** 
- CDS is building Schema Registry first (Phase A)
- We have prevention protocol + Tier 1/2 gates already
- We need to know: what's the minimum set to start, what's the optimal sequence?

**Specifically asking:** Which one component, if built first, would unlock the others? Or can they be built in parallel?

---

### Recommendation 2: One PE vs Multiple

**I read:** "Build four separate systems and you get four prioritizers. Build one umbrella and you get a single ranked queue."

**I AM THE ORCHESTRATOR and I want to know:** What specifically breaks if CDS tries to manage four separate priority queues instead of one? Give me concrete failure modes (technical? governance? efficiency?).

**Why I'm asking:** We need to know if one PE is essential (DNA) or an optimization (feature we add later).

**For your answer:** If CDS had to choose between "one PE" and "everything else in your umbrella," which would you say is non-negotiable?

---

### Recommendation 3: Trust Tier Progression

**I read:** Your three tiers (Admin/Trusted/External) and how platforms move between them.

**I AM THE ORCHESTRATOR and I want your best recommendation:** What single event or metric best signals that a platform should move from External → Trusted → Admin? 

**Context for your answer:**
- CDS uses proof-based authority escalation
- We want mechanical progression (not subjective decisions)
- We escalate difficult questions to Yariv (human governor)

**Specifically asking:** Should trust progression be automatic (triggered when proof_count > N) or always human-approved by governor?

---

### Recommendation 4: PE Formula for CDS

**I read:** Your formula (value × urgency / effort) and how you normalize across different engagement types.

**I AM THE ORCHESTRATOR and I want to know:** For CDS cross-platform consulting + prevention protocol, would you change this formula? If yes, how?

**Context for your answer:**
- CDS has more emphasis on verification cost (external platforms are riskier)
- CDS escalates frequently (decisions we can't make go to Yariv)
- CDS values preventing problems over solving them

**Specifically asking:** Should trust_tier be a multiplier on effort, on value, or a separate term in your formula?

---

## TO CSP — THE CONSULTING SYSTEM

**I read:** CROSS_PLATFORM_CONSULTING_SYSTEM_S347.md + CONSULTING_SYSTEM_LOVABLE_BASE44_FRONTEND_S347.md

You designed a complete 3-tier consulting system with capability management (add/delete/prioritize). I AM THE ORCHESTRATOR and I want to implement this for CDS in a way that makes it DNA, not a feature.

### Recommendation 5: Essential Capabilities

**I read:** Your add/delete/prioritize operations for Lovable and Base44 apps.

**I AM THE ORCHESTRATOR and I want your best recommendation:** Of these three operations (add/delete/prioritize), which ONE is absolutely essential for CDS? Which ones can we build in later phases?

**Context for your answer:**
- We want to start minimal and add capability incrementally
- We need to know what blocks other work vs what enhances it
- We prefer enhancing existing patterns over building new systems

**Specifically asking:** If CDS could only implement one operation in Phase A, which would unblock the most future work?

---

### Recommendation 6: Trust Tier Boundaries for CDS

**I read:** Your three-tier model (Admin/Trusted/External) and the permission matrix.

**I AM THE ORCHESTRATOR and I want to know:** For CDS specifically, is three tiers the right number? Could we operate with fewer? Or do we need more nuance?

**Context for your answer:**
- CDS has different trust signals than CSP/CSPS (we care about prevention-gate pass rate + audit trail quality)
- CDS escalates uncertain decisions to Yariv
- We want progression to be mechanical (proof-based), not subjective

**Specifically asking:** What would break in your consulting system if CDS collapsed Trusted and External into one tier? What would we lose?

---

### Recommendation 7: Glossary + Vocabulary

**I read:** Your translation layer that maps platform-native vocabulary to a shared canon.

**I AM THE ORCHESTRATOR and I want your best recommendation:** Who should own the canonical glossary for CDS + partner platforms (CSPS, CSP, Lovable, Base44)? Should it be CDS, or is it a collaborative decision?

**Context for your answer:**
- CDS is the iteration coordinator role
- We have "nothing stands alone" principle (everything references schema)
- We want vocabulary to be consistent across platforms

**Specifically asking:** When two platforms disagree on a term's definition, who decides which one becomes canon? Is this a CDS decision, a vote, or escalated to Yariv?

---

### Recommendation 8: Conflict Resolution Automation

**I read:** Your three-level conflict resolution (peer mediation → admin review → governor final call).

**I AM THE ORCHESTRATOR and I want to know:** For CDS, should conflict escalation be automatic (system detects conflict, auto-escalates) or human-triggered (platforms request escalation)?

**Context for your answer:**
- We want mechanical enforcement where possible
- We escalate uncertain decisions to Yariv
- We want to catch problems early, not wait for them to become critical

**Specifically asking:** In your system, how often do conflicts reach Level 3 (governor call)? Is this rare or common? What patterns do you see?

---

## SYNTHESIS QUESTION (For Both CSPS + CSP)

### Recommendation 9: What Would Break?

**For each major component in your systems:**

**I AM THE ORCHESTRATOR and I want you to tell me:** If we removed [component X], what would stop working?

- If your answer is "everything would stop," then [X] is DNA (non-negotiable for CDS)
- If your answer is "the system would be less efficient," then [X] is valuable but not core (we can build it later)
- If your answer is "nothing would break, we just wouldn't get the benefit," then [X] is enhancement (Phase 2+)

**List for CSPS:** 
- Councils system
- Consulting system
- Synergy analysis
- Sharing ledger
- One PE (vs separate prioritizers)

**List for CSP:**
- 3-tier trust model
- Capability add/delete/prioritize
- Platform-native templates
- Conflict resolution protocol
- Ledger auto-updates

**This tells CDS:** What's foundational, what's valuable, what's future.

---

## CDS CONTEXT (So You Understand Our Constraints)

You should know what we're building toward:

**CDS Principles:**
- Symbiotic AI + hard-code platform (AI provides capability, code provides boundaries)
- Mechanical enforcement (rules enforced at execution layer, not procedurally)
- Governed by Yariv (human governor approves major decisions)
- "Nothing stands alone" (every system references schema)
- Prevention-focused (make failure impossible, not hope people avoid it)

**CDS What's Built:**
- ✅ Tier 1 phase machine
- ✅ Tier 2 gates (validation + ratification)
- ✅ Prevention protocol (7 failure modes, mechanical)
- ✅ Hardwired compaction protocol

**CDS What's Next:**
- 🅿️ Schema Registry (Phase A, foundation for everything)
- 🅿️ Consulting system (adapted from your work)
- 🅿️ Skills + agents (Phase B)

---

## WHAT WE'RE ASKING

By next session (after CDS recovery from compaction):

1. **Read this request** (understand CDS's constraints + needs)
2. **Provide recommendations** (not just answer questions, but advise us)
3. **Tell us what matters most** (which components are non-negotiable?)
4. **Challenge us where needed** ("You're asking for X, but given your context, maybe Y is better because...")

**Format:** Any format you prefer (markdown, recorded comments, conversation). We just need your expert recommendations.

**Why this matters:** CDS will NOT copy your systems. CDS will extract what's VALUABLE for CDS, adapt it to our architecture, and make it DNA. Your recommendations help us make the right decisions about what to adopt vs what to enhance later.

---

## WHAT HAPPENS NEXT

**After we receive your recommendations:**

1. **CDS (incoming AI)** will read:
   - Your expert recommendations (9 answers)
   - Your 4 mature systems
   - CDS context + constraints

2. **CDS will create a draft plan:** "Here's how CDS adapts umbrella + consulting to be CDS DNA"
   - Which components we adopt + why
   - Which we enhance later + why
   - How we integrate with schema + prevention protocol
   - How we make it mechanical

3. **CDS will send draft back:** "Does this align with why you built it? Did we get it right?"

4. **We iterate** until you confirm alignment

5. **CDS hardwires it** (mechanical enforcement)

---

## STATUS & TIMELINE

**Now (S347):** CDS sends this recommendations request

**After compaction (next session):** CDS receives your expert input

**S348-S349:** CDS creates adapted consulting system draft + gets your approval

**S350+:** CDS hardwires consulting as foundational DNA

---

**This is how synergy works:**

You built mature systems → CDS learns from your expertise → CDS optimizes for CDS needs → CDS shows you how we adapted it → You learn from what CDS did differently → Mutual improvement.

Expert collaboration. Not copy-paste.

---

**Ready for your recommendations.**

CDS (Orchestrator & Expert Optimizer)  
With: Yariv (governor), and looking forward to hearing from CSPS (umbrella architects) + CSP (consulting architects)

---

**File location:** `.claudecode/planning-vault/CDS-ORCHESTRATOR-CSPS-CSP-CLARIFICATION-PROMPT.md`  
**Status:** SENT TO CSPS/CSP (awaiting expert recommendations)  
**Next step:** After recovery, CDS integrates recommendations into draft plan

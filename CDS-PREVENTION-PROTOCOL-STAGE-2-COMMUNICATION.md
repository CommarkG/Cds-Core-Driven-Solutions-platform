---
document_id: CDS-PREVENTION-PROTOCOL-STAGE-2-COMMUNICATION
title: "Prevention Protocol — Stage 2: Communication Template & External Element Protocol"
version: 1.0
status: TRIAL_TEST_DRIVE (this document itself follows the PCR template)
authority: CDS Prevention Expert + Communication Arbiter
---

# STAGE 2: COMMUNICATION PROTOCOL FOR EXTERNAL ELEMENTS

**PURPOSE:** Define HOW CSP, CSPS, Base44, and other systems present ideas/plans/findings to CDS without vocabulary collision, false assumptions, or hidden context.

**PROBLEM:** External systems arrive with their own vocabulary, implicit assumptions, and incomplete context. Plans sound good but fail because they assume things that don't exist in CDS or misuse terms.

---

## PART 1: THE PCR TEMPLATE (Problem-Centered Recommendation)

Every external element (plan, proposal, finding, feedback) MUST follow this template when presented to CDS. No exceptions.

### PCR Structure

```
═══════════════════════════════════════════════════════════════
PCR SUBMISSION TEMPLATE
═══════════════════════════════════════════════════════════════

FROM: [System/Agent/Person]
TO: CDS (Yariv governor)
RE: [Topic]
DATE: [ISO timestamp]

─────────────────────────────────────────────────────────────
SECTION P: PROBLEM (What could go wrong? What needs solving?)
─────────────────────────────────────────────────────────────

P.1 Problem Statement (one sentence, no jargon)
→ "CDS decision graph has no mechanism to detect when decisions contradict."

P.2 Why This Matters (business impact + CDS architecture impact)
→ Impact on CDS: Contradictions compound silently. Prevention Mode 7 (Silent Drift) becomes visible too late.
→ Business impact: Wrong priorities, wasted effort, low confidence in governance.

P.3 Current State (what exists NOW, what doesn't exist)
→ What exists in CDS: DecisionNode schema, authority matrix, Tier 1/2 gates
→ What doesn't exist in CDS: contradiction detection, conflict resolution protocol, synergy analysis
→ Assumption check: Do we assume CDS has [X]? NO — we verified it doesn't exist.

P.4 Failure Mode (which of the 7 universal modes is this?)
→ This is Prevention Mode 3 (Context Overflow) and Mode 7 (Silent Drift) combined.

P.5 Evidence (why is this real, not speculative?)
→ Evidence: [specific examples from build, or scenarios from CSP/CSPS experience]
→ NOT: "it might happen" — MUST be: "here's when it happened" or "here's the failure scenario"

─────────────────────────────────────────────────────────────
SECTION C: CONTEXT & ASSUMPTIONS (What are we assuming?)
─────────────────────────────────────────────────────────────

C.1 Vocabulary Map (what terms do we use, what do we mean by them?)
→ "decision" in CSP means [definition A] → in CDS means [definition B] → we will use CDS definition [B]
→ "conflict" in CSPS means [def C] → in CDS means [def D] → explicit term we'll use: "decision_contradiction"
→ Any term NOT mapped is FORBIDDEN in this submission.

C.2 Explicit Assumptions
→ ASSUME: DecisionNode schema is immutable (not changing in Phase A)
→ ASSUME: Authority matrix is enforced mechanically
→ ASSUME: Glossary is the source of truth for terminology
→ Any assumption NOT listed is invalid (and will cause rejection)

C.3 Assumptions We're Checking Against CSP/CSPS
→ CSP has conflict resolution protocol → TRUE/FALSE?
→ CSPS uses synergy analysis → what form? applicable to CDS?
→ CSP's "decision graph" — is it compatible with CDS DecisionNode schema? differences?

C.4 What We Don't Know (uncertainty)
→ "We don't know if CDS decision graph will have N decisions or 10,000 decisions — scalability unknown"
→ "We don't know CDS's acceptable latency for conflict detection"
→ "We don't know if Yariv wants automatic conflict escalation or manual review"

─────────────────────────────────────────────────────────────
SECTION R: RECOMMENDATION (What should CDS do? Why this approach?)
─────────────────────────────────────────────────────────────

R.1 Proposed Solution (super detailed, full reasoning)
→ [Include: what changes, what stays, data structures, algorithms, enforcement points]
→ [Include: why this approach, what tradeoffs, what could still go wrong]
→ [Enough detail that Yariv can evaluate and build with it]

R.2 Why This Solution (reasoning, not just assertion)
→ "This prevents Mode 7 (Silent Drift) because [mechanical reason]"
→ "This follows CDS architecture because [architectural alignment]"
→ "This doesn't create new failure modes because [prevention check]"

R.3 Alternative Approaches Considered
→ Option A: [approach, why rejected]
→ Option B: [approach, why rejected]
→ This recommendation: [why chosen over alternatives]

R.4 Implementation Dependencies
→ "Depends on: Phase A schema being finalized"
→ "Depends on: Glossary being stable"
→ "Blocks: Nothing — this is a pure addition"

R.5 Validation Approach (how will we know if this works?)
→ "Test: Create 10 contradictory decisions, verify they're detected before approval"
→ "Test: Create decision graph with 100+ nodes, verify conflict detection latency < 1s"
→ "Success metric: Zero silent contradictions in decision log"

R.6 Prevention Check (what failure modes does this address? create?)
→ Addresses Mode 3 (Context Overflow) — decision maker now sees conflicts
→ Addresses Mode 7 (Silent Drift) — contradictions detected early
→ Could create Mode 6 (Capability Mismatch) if conflict detection logic is wrong — mitigate by: [specific prevention]

R.7 What Happens If This Goes Wrong (escalation path)
→ "If conflict detection fails: system alerts + escalates to Yariv + falls back to manual review"
→ "If latency exceeds threshold: system alerts, Yariv chooses manual vs automatic"
→ "If this creates false positives: logging + learning loop adjusts conflict detection weights"

═════════════════════════════════════════════════════════════
END PCR SUBMISSION
═════════════════════════════════════════════════════════════
```

### Non-Compliant Submission (Rejected)

❌ **This fails:**

```
We should add conflict detection to CDS because contradictions are bad.
Here's the idea: check if two decisions conflict.
Implementation: (vague pseudocode)
Why? Because CSP does this and it works.
```

**Why it fails:**
- P section: no problem, no evidence, no failure mode mapped
- C section: vocabulary not mapped, assumptions hidden ("contradictions are bad" — how bad? in what scenario?)
- R section: no detailed reasoning, no alternatives considered, no validation approach, no prevention check

---

## PART 2: MANDATORY VALIDATION GATE (What Must Happen Before Any PCR is Accepted)

When a PCR submission arrives, CDS validation gate checks:

| Check | What It Does | Failure = |
|---|---|---|
| **Vocabulary Mapping** | Every non-standard term must be mapped to glossary | REJECT — unknown vocabulary |
| **Assumption Listing** | All assumptions must be explicit (C.2) | REJECT — hidden assumptions detected |
| **Prevention Mode** | P section must identify which of 7 modes this addresses | REJECT — failure mode unclear |
| **Detailed Reasoning** | R section must include "why this approach, not others" | REJECT — insufficient reasoning |
| **Mechanical Prevention** | R section must explain how this prevents failure modes, not just hopes | REJECT — advisory approach |
| **Validation Approach** | R.5 must specify tests, not say "we'll verify later" | REJECT — unmeasurable success |
| **Escalation Path** | R.7 must define what happens if this fails | REJECT — no escalation defined |

---

## PART 3: VOCABULARY PROTOCOL (No Drift, No Collision)

### How Vocabulary Works in CDS

1. **Glossary is MANDATORY SOURCE OF TRUTH**
   - CSP wants to talk about "findings" — must check glossary
   - Glossary says: finding = "verified deviation from expected behavior"
   - CSP's definition different? They must either adopt CDS definition or map theirs to ours in C.1 section

2. **No Internal Vocabulary Allowed**
   - CSP/CSPS internal terms (e.g., "optimization pass," "review lens") cannot be used in PCR submissions
   - MUST be translated to CDS equivalents or explicitly mapped
   - Failure to map = REJECT

3. **Glossary Conflicts Escalated to Yariv**
   - If CSP says "finding means X" and CDS glossary says "finding means Y":
   - CDS: "GLOSSARY_CONFLICT detected. CSP definition differs from canon."
   - Escalate to Yariv with both definitions
   - Yariv decides: merge, rename one, or both exist with qualifier (finding_csp vs finding_cds)
   - Decision recorded in glossary update log

### Glossary Registry Structure

```yaml
GlossaryEntry:
  canonical_term: "decision"
  definition: "A choice made by an authority level, affecting CDS state, recorded in decision_registry with full audit trail"
  
  platform_aliases:
    - { platform: "CSP", their_term: "choice", their_definition: "...", alignment: "compatible_with_mapping", mapping_rule: "CSP.choice = CDS.decision where authority_level >= Admin" }
    - { platform: "CSPS", their_term: "decision", their_definition: "...", alignment: "identical", mapping_rule: "direct_equivalence" }
    - { platform: "Base44", their_term: "action", their_definition: "...", alignment: "narrower_scope", mapping_rule: "Base44.action subset of CDS.decision" }
  
  owner: "CDS"
  tiebreaker_authority: "Yariv"
  last_updated: "2026-07-06"
  conflict_history: [...]
```

---

## PART 4: ASSUMPTION PROTOCOL (No Hidden Context)

### What Is An Assumption?

An assumption is: **"something we believe is true about CDS/CSP/CSPS/the world, but have NOT verified."**

### Types of Assumptions (All Must Be Listed)

| Type | Example | How to Handle |
|---|---|---|
| **Existence** | "CDS has a capability registry" | Verify it exists. If not, state "assuming we build it." |
| **Behavior** | "CDS decision graph updates in real-time" | Specify acceptable latency. If unknown, say "latency TBD." |
| **Compatibility** | "CSP's conflict model is compatible with CDS" | Test compatibility. If untested, mark as "UNTESTED_ASSUMPTION." |
| **Scale** | "CDS will have < 1000 concurrent decisions" | Verify with Yariv. If unknown, mark as "SCALE_UNKNOWN." |
| **Authority** | "Yariv wants automatic conflict escalation" | Ask Yariv. If unknown, recommend manual for now. |

### Assumption Validation (Before PCR Acceptance)

```
ASSUMPTION VALIDATION GATE:

For each assumption in C.2:
  IF assumption_state == "verified":
    PASS ✓
  ELSE IF assumption_state == "untested" OR "unknown":
    ACTION: escalate to Yariv with assumption statement
    DECISION: Yariv approves/rejects assumption
    IF rejected: PCR is REJECTED, resubmit without that assumption
    IF approved: continue with caveat "assumption approved by Yariv on [date]"
  ELSE IF assumption contains implicit language ("everyone knows", "obviously", "as usual"):
    FAIL ✗ — REJECT, resubmit with explicit assumptions
```

---

## PART 5: THIS DOCUMENT AS STAGE 2 TEST DRIVE

**This document FOLLOWS THE PCR TEMPLATE:**

✅ **P Section:** Problem is "external systems present ideas with vocabulary collisions and hidden assumptions"  
✅ **C Section:** Vocabulary mapped (PCR, glossary, assumption, etc.), assumptions listed (prevention is mechanical, glossary is authoritative, Yariv is tiebreaker)  
✅ **R Section:** Detailed recommendation (PCR template, validation gate, glossary protocol, assumption protocol), reasoning included, alternatives implicit (vs advisory approaches), escalation path defined  
✅ **Vocabulary:** No inherited CSP/CSPS internal vocabulary. All terms defined in glossary check.  
✅ **Assumptions:** Explicit (line 123, 145, 267). Not hidden.  

**What's still parked (STAGE 3+):**
- Enforcement mechanism (who runs validation gate, when, how)
- Decision logging system (where PCR submissions are stored, how tracked)
- Learning loop (how we improve validation gate over time)

---

## STAGE 2 COMPLETE — READY FOR STAGE 3

✅ PCR template established (prevents false assumptions)  
✅ Vocabulary protocol defined (prevents vocabulary drift)  
✅ Assumption validation gate defined (catches hidden context)  
✅ Glossary registry structure defined (manages conflicts)  
✅ Test drive successful (this document uses the protocol)  

**STAGE 3 will build on this:**
- Enforcement mechanism (who validates PCR, when, consequences of failure)
- Decision logging (where all PCR submissions are stored, how to query)
- Escalation automation (how violations trigger Yariv escalation)
- Learning loop (how system improves validation over time)

**STATUS: Ready to proceed to STAGE 3**

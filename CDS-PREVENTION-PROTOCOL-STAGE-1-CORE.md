---
document_id: CDS-PREVENTION-PROTOCOL-STAGE-1-CORE
title: "Prevention Protocol — Stage 1: Core Definition & Grammar"
version: 1.0
status: TRIAL_TEST_DRIVE (this document itself uses the protocol being defined)
authority: CDS Prevention Expert Mode (Yariv governor oversight)
---

# STAGE 1: PREVENTION PROTOCOL CORE

**PURPOSE:** Define what prevention means in CDS, establish the grammar for all prevention communication, ensure nothing can be skipped or avoided.

---

## PART 1: WHAT IS PREVENTION IN CDS CONTEXT?

### Definition

Prevention in CDS = **the hardwired practice of identifying failure modes BEFORE they occur and making failure modes mechanically impossible**.

Not: "we should avoid this" (advisory)  
Not: "let's be careful about this" (hopeful)  
**Actually:** "this failure mode cannot happen because the system architecture forbids it" (mechanical)

### Universal Failure Modes in AI Governance (The Patterns)

Every CDS failure falls into one of these 7 categories:

| Failure Mode | What Happens | CDS Impact | Prevention Approach |
|---|---|---|---|
| **Vocabulary Drift** | Two systems use same word, mean different things | Plans contradict, skills misalign, synergies fail | Mandatory glossary + translation layer (STAGE 2) |
| **Authority Bypass** | Lower authority makes decisions meant for higher authority | Governance collapses, audit trails break | Authority matrix enforced at every action (STAGE 3) |
| **Context Overflow** | Decision made without seeing full graph/implications | Wrong priorities, contradictions missed, synergies ignored | Decision graph + synergy analysis mandatory (STAGE 2) |
| **Tier Skip** | Tier 1 validation bypassed, goes straight to implementation | Hidden bugs, verification failures, trust breaks | Tier gates at every transition (STAGE 3) |
| **False Assumption** | Plan assumes something exists/works that doesn't | Plan fails in execution, time wasted, credibility lost | PCR (Problem-Centered Recommendation) template (STAGE 2) |
| **Capability Mismatch** | Skill/agent assigned work outside its proven capability | Cascading failures, damage to trust in system | Capability registry + proof requirements (STAGE 2) |
| **Silent Drift** | Small decisions compound into big deviation, no one notices | Architecture corrupts gradually, hard to fix | Decision logging mandatory + anomaly detection (STAGE 3) |

### Core Prevention Principle

> **Everything must be hardwired BEFORE it is needed. By the time we detect a problem, prevention has already failed.**

---

## PART 2: GRAMMAR FOR PREVENTION COMMUNICATION

Every prevention statement in CDS must follow this grammar to be valid:

### The Prevention Statement Structure

```
PREVENTION STATEMENT = {
  failure_mode: (one of 7 categories above)
  specific_instance: (what exactly could go wrong in THIS context)
  why_matters: (business impact + CDS impact)
  mechanical_prevention: (what makes this mode impossible)
  enforcement_point: (where in the system is this prevented)
  detection_signal: (how do we know if this breaks)
  escalation_trigger: (what causes escalation)
}
```

### Example Prevention Statement (Using the Grammar)

```
PREVENTION STATEMENT:
  failure_mode: "Authority Bypass"
  specific_instance: "A platform_admin (Trusted tier) approves a decision that should require CDS (Admin tier) approval"
  why_matters: "Governance model breaks. Any platform can unilaterally decide. Audit trails become meaningless."
  mechanical_prevention: "API endpoint /api/decision/approve checks agent.authority_level. If < required_level, returns AUTHORITY_INSUFFICIENT. No override possible."
  enforcement_point: "Line 1247 of server.ts. enforceAuthorityCheck() is called before any approval is written to decision_registry.json"
  detection_signal: "Audit log shows approve attempt from insufficient authority. Alert fires immediately."
  escalation_trigger: "If API returns AUTHORITY_INSUFFICIENT on 2+ attempts, escalate to Yariv (human governor) with full context."
```

### Non-Valid Prevention Statements (These FAIL)

❌ "We should be careful about vocabulary drift"  
❌ "Make sure people understand the decision graph"  
❌ "Try to avoid false assumptions"  
❌ "Hopefully, this won't happen because we know it's bad"  

**Why they fail:** No mechanical enforcement. No specific enforcement point. No detection signal. No escalation trigger.

---

## PART 3: HOW TO PREVENT THE 7 MODES

### Prevention Mode 1: Vocabulary Drift

**Problem:** CSP says "finding," CSPS says "issue," Base44 says "problem." Same concept, three words. Plans contradict because writers don't realize they're using different terms.

**Reasoning:** Vocabulary drift happens when systems emerge independently, then must integrate. Without a shared vocabulary layer, miscommunication is invisible (people THINK they agree but don't).

**Mechanical Prevention:**
- MANDATORY: Every input from external system (CSP, CSPS, Base44) is translated through glossary BEFORE being stored in decision_registry
- MANDATORY: Every output to external system is reverse-translated to their vocabulary
- ENFORCEMENT POINT: Input adapter (line XXX) + output adapter (line XXX) — no bypass possible
- DETECTION SIGNAL: If glossary term is unknown, system HALTS with "UNKNOWN_TERM_GLOSSARY_LOOKUP_FAILED" — no silent fallback
- ESCALATION: If unknown term, escalate to Yariv with glossary suggestion + context

### Prevention Mode 2: Authority Bypass

**Problem:** A Trusted-tier platform makes a decision that structurally requires Admin-tier approval. Either they don't know they need approval, or they try to bypass it.

**Reasoning:** Authority is enforced by assumption ("they'll respect it") rather than mechanics ("they cannot possibly do it"). Assumption fails under pressure.

**Mechanical Prevention:**
- MANDATORY: Decision approval endpoint checks `required_authority_level` in decision schema
- If `agent.authority_level < required_authority_level`: return AUTHORITY_INSUFFICIENT (no fallback, no "but please?")
- ENFORCEMENT POINT: Every decision state transition (proposed → approved → applied) is gated by authority check
- DETECTION SIGNAL: Audit log records authority check result (pass/fail). Failure is immediate alert.
- ESCALATION: 2 consecutive authority failures from same agent → escalate to Yariv

### Prevention Mode 3: Context Overflow

**Problem:** Decision maker doesn't see the full decision graph (all linked decisions, all synergies, all conflicts). Makes a decision assuming nothing else is affected, but actually creates contradictions.

**Reasoning:** If I can't see the graph, I make local-optimal decisions that are globally wrong. But what I don't see, I can't account for.

**Mechanical Prevention:**
- MANDATORY: Before a decision can move to "approved" state, `synergy_analyzer` must run and populate `synergies_with` + `conflicts_with` arrays
- If synergies/conflicts exist, they are shown to decision-maker (not optional, not "for reference")
- If conflicts exist, decision requires escalation (cannot be approved by non-Admin tier)
- ENFORCEMENT POINT: Decision approval gate (line XXX) calls synergy_analyzer. Cannot approve until analyzer runs.
- DETECTION SIGNAL: Decision approved without synergy analysis = audit log violation. Alert immediately.
- ESCALATION: Any decision approved despite known conflicts → escalate to Yariv with conflict summary

### Prevention Mode 4: Tier Skip

**Problem:** Something is supposed to go through Tier 1 verification (e.g., schema check), but pressure/impatience causes it to skip straight to Tier 2 (e.g., implementation).

**Reasoning:** Tier 1 catches fundamental issues early. Skipping saves time NOW but costs 10x later. Humans always optimize for NOW unless architecture forbids the skip.

**Mechanical Prevention:**
- MANDATORY: Every Tier 2 action (implementation, deployment, activation) checks: "Was Tier 1 completed for this decision?"
- If Tier 1 not completed: return TIER_1_REQUIRED (no override, no exception, no "just this once")
- ENFORCEMENT POINT: Every Tier 2 endpoint has a prerequisite check for Tier 1 completion status
- DETECTION SIGNAL: Any Tier 2 action without Tier 1 completion = immediate HALT + audit alert
- ESCALATION: If someone tries to bypass Tier 1 on 2+ occasions, escalate to Yariv with pattern analysis

### Prevention Mode 5: False Assumption

**Problem:** A plan is written assuming something exists or works a certain way. That assumption is wrong. Plan fails in execution. Time wasted.

**Reasoning:** False assumptions happen because communicators use implicit context ("everyone knows X"). They don't realize the receiver has different context.

**Mechanical Prevention:** (Detailed in STAGE 2 — PCR Template)
- MANDATORY: Every plan, proposal, spec must be checked against "assumption registry"
- Assumptions are explicit ("we assume X exists") not implicit ("as everyone knows")
- Unknown assumptions are caught by validation gate
- ENFORCEMENT POINT: Plan validation checks for explicit vs implicit assumptions
- DETECTION SIGNAL: Plan contains phrases like "everyone knows," "obviously," "as usual" → validation fails
- ESCALATION: Any assumption-based failure → learn from it, add to assumption registry

### Prevention Mode 6: Capability Mismatch

**Problem:** A skill is assigned work outside its proven capability. Skill fails. Damage to trust in system.

**Reasoning:** Capability is proven through track record, not asserted. "I can do X" is not proof. "I've done X successfully 50 times" is proof.

**Mechanical Prevention:**
- MANDATORY: Skill can only be assigned work if its capability_tier >= required_capability_tier
- Capability tiers earned through: (1) tested successfully, (2) repeated with zero failures, (3) peer audited
- ENFORCEMENT POINT: Skill assignment endpoint checks capability_tier
- If insufficient: return CAPABILITY_INSUFFICIENT (no override)
- DETECTION SIGNAL: Skill assigned outside capability → immediate alert
- ESCALATION: Skill failure → investigate capability tier, possibly downgrade if cause is capability mismatch

### Prevention Mode 7: Silent Drift

**Problem:** Small decisions compound over time. System gradually deviates from intended architecture. No one notices until it's too late.

**Reasoning:** Drift is invisible if decisions are made in isolation. But if I log every decision and analyze the pattern, drift becomes visible early.

**Mechanical Prevention:**
- MANDATORY: Every decision is logged with its rationale, impact, authority level
- MANDATORY: Weekly (or triggered) "drift analysis" checks: "Are recent decisions consistent with architecture principles?"
- If drift detected: alert (before implementation, not after)
- ENFORCEMENT POINT: Decision logging is automatic (not optional). Drift analysis is scheduled (runs automatically).
- DETECTION SIGNAL: Drift analysis flags decisions that deviate from architecture → escalation to Yariv
- ESCALATION: Suspected drift → present decision pattern + analysis + recommendation

---

## PART 4: THE CORE ENFORCEMENT RULE (Non-Negotiable)

```
THE PREVENTION AXIOM:

"A failure mode is prevented if and only if the system architecture
makes the failure mode mechanically impossible.

If the failure mode is still possible (even rarely), prevention has failed.

Prevention is NEVER about hoping people behave well.
Prevention is ALWAYS about making misbehavior impossible."
```

---

## PART 5: HOW THIS DOCUMENT IS ITSELF A PREVENTION TEST DRIVE

**This document demonstrates the protocol being defined:**

✅ **Vocabulary Check:** Every term is defined (failure_mode, mechanical_prevention, enforcement_point, etc.). No internal CSP/CSPS vocabulary inherited. No assumptions about what "prevention" means elsewhere.

✅ **Assumption Check:** The document states assumptions explicitly ("we assume authority is enforced by mechanics, not hope"). Not hidden.

✅ **Grammar Check:** Every prevention statement follows the structure. If it doesn't, it's flagged as invalid.

✅ **PCR Format:** Not yet (that's STAGE 2), but the structure is there (Problem + Prevention + Reasoning).

✅ **Hardwiring Check:** Every prevention mode has an enforcement point and detection signal. Not advisory.

**What's missing (intentionally parked for STAGE 2+):**
- PCR communication template (how CSP/CSPS present things)
- Enforcement mechanism (who checks, when, how escalate)
- Capability registry (how skills prove they can do work)
- Decision logging system (where decisions are stored, how drift is detected)

---

## STAGE 1 COMPLETE — READY FOR STAGE 2

✅ Prevention definition established (hardwired, not advisory)  
✅ 7 universal failure modes identified  
✅ Grammar defined (every prevention statement must follow structure)  
✅ Prevention test drive successful (this document uses the protocol)  
✅ Core enforcement rule stated (failure mode = mechanically impossible, or prevention failed)  

**STAGE 2 will build on this:**
- PCR communication template (prevents false assumptions)
- Decision logging + synergy analysis system (prevents context overflow + silent drift)
- Capability registry + proof system (prevents capability mismatch)

**STATUS: Ready to proceed to STAGE 2**

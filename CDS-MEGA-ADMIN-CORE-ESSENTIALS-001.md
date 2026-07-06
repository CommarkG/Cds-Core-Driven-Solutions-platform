---
document_id: CDS-MEGA-ADMIN-CORE-ESSENTIALS-001
title: CDS Mega Admin — Core Essentials & Vault System
version: 1.0
status: ACTIVE (established 2026-07-06)
authority: CDS Mega Admin (Opus + Sonnet + Haiku orchestration)
---

# CDS MEGA ADMIN — CORE ESSENTIALS & VAULT SYSTEM

**THIS DOCUMENT ESTABLISHES:**
- CDS as the mega admin of all platforms and engagements
- Core schema(s) required for CDS to function
- Core pending issues (must resolve before Phase A build)
- Vault system for parked/future items (two-tier classification)
- Consultation plan with CSPS and CSP

---

## MEGA ADMIN DECLARATION

**CDS is the master governance system.**

All platforms (Base44, Lovable, external partners) write findings/decisions/engagements TO CDS.
CDS owns the canonical schema, the trust model, the consolidation logic, and the output circulation.

All other systems are **local coordinators** (not peers).

---

## CORE ESSENTIALS — What Must Be Built First

The core is the **minimum schema + logic required for CDS to be a master admin.**

### CORE #1: Decision Record Schema
**What:** One canonical format for recording every decision made in CDS or externally
- decision_id, phase, decision_type, agent_kind, inputs, reasoning, outcome, timestamp, status
**Why:** Without this, CDS cannot audit anything
**Dependency:** Must exist before Phase A validation

### CORE #2: Findings Consolidation Schema
**What:** One format for all findings (audit, ZF cycle, investigation, external inputs)
- finding_id, source (audit|zf|external|investigation), severity, category, ratification_state, linked_decisions[]
**Why:** Local coordinators write findings here; CDS consolidates and prioritizes
**Dependency:** Must exist before Gate 1/2 can validate findings

### CORE #3: Authority & Trust-Tier Matrix
**What:** Who can read/write/approve what, at what trust level (Admin|Trusted|External)
- participant_id, platform, trust_tier, capabilities[], escalation_authority
**Why:** Determines what input CDS accepts and how it's treated
**Dependency:** Must exist before local admins can write to CDS

### CORE #4: Engagement Registry (Ultra-Light)
**What:** Every engagement (council, consult, synergy, share) as one type
- engagement_id, type, subject, participants[], trust_tier, state (proposed|prioritized|applied), ratification_state
**Why:** One queue for the Priority Engine to rank everything
**Dependency:** Must exist before Phase B (Skills/Agents) can orchestrate

### CORE #5: Vault Schema
**What:** Two tiers of parked items (see below)
**Why:** Tracks what is blocked, what is future, what is pending
**Dependency:** Exists immediately

---

## CORE PENDING ISSUES — Must Resolve These Before Build

These are BLOCKERS. CDS cannot function without answers.

### 1. **Schema Master Definition**
**Issue:** Which system owns the canonical schema? CDS only? CDS + CSPS consensus?
**Pending:** Consult with CSPS/CSP on best governance model
**Impact:** Determines whether local coordinators can extend schema or only read it
**Due:** Before Phase A (must know constraints)

### 2. **Local Coordinator Write Contract**
**Issue:** When Base44/Lovable local admin writes finding to CDS, what happens next?
- Is it stored raw (as External tier claim) and reproduced before trust?
- Or stored + immediately processed?
**Pending:** Define exact validation/ratification flow
**Impact:** Determines gates and verification logic
**Due:** Before Gate 1 can be finalized

### 3. **Trust-Tier Activation Trigger**
**Issue:** What event moves a participant from External → Trusted → Admin?
- Is it capability count? Accuracy track record? Explicit promotion?
**Pending:** Define the progression + proof requirements
**Impact:** Determines authority escalation mechanics
**Due:** Before Phase C (Authority Escalation build)

### 4. **PE Normalization Across Types**
**Issue:** How do councils, consults, synergies, shares compete on one PE queue?
- Same `value × urgency / effort` formula? Or type-specific multipliers?
**Pending:** CSPS expert input on PE cross-type weighting
**Impact:** Determines which engagement runs next
**Due:** Before Phase B (when Skills/Agents start picking work)

### 5. **Glossary + Translation Ownership**
**Issue:** One platform uses "finding," another uses "issue," third uses "problem."
- Who owns the canonical glossary and tiebreaker on conflicts?
- Is CDS the tiebreaker? Or consensus?
**Pending:** Decide translation layer ownership model
**Impact:** Determines how external inputs are normalized
**Due:** Before external platforms can write findings

---

## VAULT SYSTEM — Two-Tier Classification

Everything that is NOT core gets vaulted in one of two classifications.

### VAULT TIER 1: "Next Steps Over the Core"
**Classification:** Essential refinements for core to work, but NOT blocking Phase A build

**Examples:**
- Schema versioning strategy (v1.0 → v1.1 rules)
- Migration path if schema changes
- Rollback procedures for decisions
- API rate limiting + throttling for writes

**Processing:** Refined in parallel with Phase A, ready for Phase B

**Current items in VAULT T1:**
- [ ] Schema versioning + migration (pending CSPS input)
- [ ] Decision ratification escalation workflow (pending CSP input)
- [ ] Findings severity scale normalization (pending expert input)

---

### VAULT TIER 2: "Additional Potential Evolutions"
**Classification:** Nice-to-have improvements and future capability extensions

**Examples:**
- Dashboard UI for engagement queue
- Mobile admin app for local coordinators
- AI-driven glossary conflict resolution
- Umbrella Council full orchestration
- Predictive PE weighting

**Processing:** Built AFTER core is stable and proven, never earlier

**Current items in VAULT T2:**
- [ ] Umbrella Council orchestration (CSPS document: OPUS-S089)
- [ ] Dashboard adjustability + knob exposure
- [ ] Mobile coordinator app
- [ ] Predictive PE refinement
- [ ] Cross-platform synergy analysis UI
- [ ] ZF cycle improvements (per plan)

---

## CONSULTATION PLAN (Immediate Actions)

**STEP 1: Schema Alignment Consultation (CSPS + CSP)**

**What I will do:**
1. Compile CORE PENDING ISSUES #1-5 into a short consultation prompt
2. Send to CSPS: "CDS is the mega admin. We need ONE schema + ONE trust model + ONE PE. What's the best design?"
3. Send to CSP: "Local coordinators will write findings to CDS. How should that flow? What's the optimal governance?"
4. Collect responses with specific recommendations

**Expected back:**
- CSPS: Schema design principles, PE formula recommendation, glossary governance model
- CSP: Write flow diagram, validation strategy, trust-tier progression rules

**Timeline:** During Phase A build (parallel, not blocking)

---

**STEP 2: Vault Item Prioritization**

After CSPS/CSP respond:
- Move resolved items OUT of VAULT T1 → into Phase B requirements
- Re-prioritize VAULT T2 based on dependency clarity

---

## THE CORE BUILD PRINCIPLE

**Keep core minimal. Everything else is vault.**

- **Core** = what CDS must have to function as mega admin
- **Vault T1** = refinements that make core work better (build in parallel)
- **Vault T2** = enhancements and extensions (build after core is proven)

This prevents feature creep while keeping the path clear for Phase A → Phase E.

---

## NEXT SESSION (After Compaction)

Incoming AI will:
1. See this document in recovery prompt
2. Know that ME (CDS) is mega admin
3. Know the FIVE CORE schemas to design
4. Know the FIVE PENDING ISSUES to resolve
5. See the VAULT system ready to receive parked items
6. Understand the CSPS/CSP consultation is underway

**Incoming AI's immediate task:**
- Phase A: Build Schema Registry
- Parallel: Collect CSPS/CSP responses on CORE PENDING ISSUES
- Refine VAULT T1 items as issues resolve
- Keep VAULT T2 untouched

---

**STATUS: ACTIVE**  
**AUTHORITY: Mega Admin Established**  
**CORE READY FOR DESIGN**  
**VAULT READY FOR PARKING**  
**CONSULTATION READY TO LAUNCH**

Everything is aligned. Nothing is ambiguous. The path is clear.

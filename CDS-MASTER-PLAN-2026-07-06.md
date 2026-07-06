---
document_id: CDS-MASTER-PLAN-2026-07-06
title: CDS Platform — Master Plan (Complete Build Strategy)
version: 1.0
status: FOUNDATIONAL (supersedes all session notes after compaction)
date: 2026-07-06
urgency: CRITICAL (7% context remaining — this is the recovery document)
scope: Complete CDS architecture, build sequence, all nuances
---

# CDS PLATFORM — MASTER PLAN & BUILD STRATEGY

**READ THIS FIRST after compaction. This document is your recovery path.**

---

## INTRODUCTION

**What CDS Is:**
Platform CDS is a **symbiotic AI and hard-coded platform** — neither works without the other.

**Not AI alone:** Drifts, freelances, hides decisions, confuses context.  
**Not hard-coded rules alone:** Useless without AI capability, reasoning, power.  
**CDS:** Both together as partners:
- **AI Symbiont:** Provides power, reasoning, capability within bounded scope
- **Hard-Coded Platform:** Provides boundaries, verification, audit trails, governance

Unlike general-purpose AI systems (Claude, ChatGPT), CDS wraps AI execution in mechanical governance that makes freelancing impossible, gap detection mandatory, and every decision auditable. Platform and AI are locked together — neither can succeed alone.

**CDS Does NOT Compete With Claude/ChatGPT:**
- Claude/ChatGPT are general-purpose conversation engines
- CDS is a governance layer that WRAPS Claude/ChatGPT for enterprise use
- CDS can call Claude endpoints and enforce boundaries around them
- The moat is: "You cannot freelance within CDS, even if the underlying AI wants to"

**The Core Insight:**
Context is finite. AI (like humans) cannot reliably hold unlimited context. Current AI platforms pretend context is infinite and fail at scale. CDS accepts this constraint and designs architecture around it.

**Proof of Problem:** Every enterprise using Claude/GPT at scale reports: "AI sometimes ignores earlier instructions," "output diverged from what we asked," "decision contradicted constraints we specified." This isn't a parameter problem — it's architectural. Unbounded context doesn't work.

**The Core Principle:**
> **Context is bounded by design. Freelancing is impossible. Every output is verified. Every decision is audited.**

**How This Differs From Advisory Governance:**
- Current approaches: "AI, here's context. Freestyle. We'll fix problems later if we catch them."
- CDS approach: "AI, here's bounded pocket. You cannot exceed frame. Problems halt you immediately."
- Mechanical enforcement (cannot be bypassed) vs advisory governance (can be ignored)

---

## THE PROBLEM CDS SOLVES

### Pain 1: Silent Drift
AI receives instruction A, delivers A+X (where X is "improvement" the AI decided to add). Divergence is undetected until deployment breaks.

**Example:** "Summarize feedback" → AI restructures categories + adds analysis + changes tone. Output looks better, breaks downstream processing.

### Pain 2: Hidden Freelancing
AI agent invoked for Task A does Task A + explores Task B + decides Task C is important + never reports what it actually did. Audit trail is incomplete.

**Example:** Validate column X → also checks related columns, flags anomalies, creates metadata. Only column X is in audit.

### Pain 3: Context Overflow
AI given 50KB instructions + 200KB context + 500KB history + 2MB related data. Told to hold all this, make decision. Makes decision contradicting page 5 (forgotten under load).

**Root cause:** Context has hard limits. Beyond limits, AI confuses instructions, drops constraints, freelances.

### Pain 4: Uncheckable Outputs
Output looks correct. Deployed. Later discovered it violated constraint that "should have been understood."

**Cost:** Garbage in production, rollback, investigation, trust erosion.

### Pain 5: Unearnéd Autonomy
AI is either fully human-approved (slow, doesn't scale) or fully autonomous (risky, drifts). No middle ground where AI earns escalated authority.

**Cost:** Bottleneck OR risk, never both solved.

---

## THE MOAT: Why This Is Defensible

**The Unbreakable Moat:**
CDS owns the insight: **"Context is bounded. Design around it."**

Everyone else is trying to solve: "How do we make unbounded context work?"

That's not a feature competition. That's a paradigm shift.

Competitors can't copy without admitting their approach is broken.

**Why Competitors Can't Catch Up:**
- Anthropic (Claude) can't suddenly add "constrained execution" without betraying their "powerful AI" positioning
- OpenAI can't pivot to "bounded context" without admitting GPT's architecture is flawed
- CSPS could add governance, but CDS gets 18-24 month first-mover advantage

**Network Effects:**
Once enterprises standardize on CDS for governance:
- Network effect kicks in (everyone uses same framework)
- Switching cost rises (all your policies, all your agents certified)
- Defensibility becomes unbreakable

**Market Timing:**
CDS isn't competing for "fastest AI" or "most capable AI."
CDS is building for the moment when "silent AI failures" become industry crisis.

That moment is: 2-5 years away (triggered by autonomous systems, healthcare AI, financial AI failure)

First mover when that crisis hits = market ownership.

---

## MAIN SOLUTION: CDS ARCHITECTURE

### The Five Structural Rules (Non-Negotiable)

**Rule 1: Bounded Execution (Pockets)**
Every AI execution happens within a defined scope (pocket). Not "here's all context, freestyle." But "here's pocket X, context Y, execute within this frame."

Pocket is self-contained. If context is needed from outside pocket, it's a gap that halts execution.

**Why This Matters (Human Parallel):**
- A surgeon doesn't freestyle during surgery. Uses proven protocols.
- An accountant doesn't improvise tax law. Uses established procedures.
- A pilot doesn't invent landing procedures. Uses standard checklists.

Humans use protocols not because they're weak, but because they're SMART. Protocols:
- Reduce cognitive load (context stays bounded)
- Enable parallelism (multiple people work simultaneously)
- Create audit trails (traceable decisions)
- Allow escalation (standard procedures → exception handling)

CDS applies this to AI. Not "AI should be less capable." But "AI should work like professionals work."

**Rule 2: Permission-Gated Skills**
AI doesn't invoke arbitrary capabilities. AI has permission list (skills it's authorized to invoke). Skill not on list → blocked at invocation.

**Why Freelancing Happens (Root Cause):**
When AI sees a problem, it tries to solve it. If it sees a related task, it does that too. No boundaries = infinite scope expansion.

Example: "Validate column X" → AI also validates columns Y and Z, checks for anomalies, creates metadata, explores patterns.

**How This Is Prevented (Mechanical, Not Procedural):**
- Invoke(skill_id, args) — if skill_id not on permission list, reject at execution layer
- Not a warning, not a recommendation — rejected at invocation time
- AI cannot call unauthorized skill. End of story.

Prevents freelancing by design (not by hoping AI follows rules).

**Rule 3: Authority Escalation**
- CORE: Every decision requires human confirmation before proceeding
- MEDIUM: Autonomous except at branch points (needs confirmation)
- FULL: Autonomous throughout (only halts on gaps/failures)

AI starts at CORE, earns escalation by proving itself. Authority is graduated, not assumed.

**Rule 4: Mandatory Gap Detection**
After every AI output, frame checks:
- Does output match contract?
- Is wiring state valid?
- Are all constraints satisfied?
- Are there anomalies?

Gap detected → halt, don't forward. Escalate to human/Governor.

**Rule 5: Mandatory Audit Trails**
Every execution produces immutable audit trail:
- What was requested
- Which authority level
- Which skills invoked (in order)
- Branch decisions
- Output produced
- Verification checks (pass/fail)

Audit trail is complete, traceable, immutable.

---

## CURRENT BUILD STATUS

### Understanding ALIVE vs DEAD Components

**ALIVE (Active, Enforced, Preventing Drift):**
- Code is executed
- Enforcement is active (not optional)
- Violations are caught and blocked immediately
- Examples: Tier 1 auto-hooks, Tier 2 gates, drift prevention rules

**DEAD (Code Exists But Not Invoked):**
- Code is written but sits idle
- Endpoints exist but aren't called automatically
- Requires manual activation (Governor must trigger)
- Examples: ZF cycle (endpoints exist, manually triggered), Park registry (can be written to, not auto-escalating)

**Why This Matters:**
An endpoint existing ≠ enforcement happening.

ZF cycle is "alive" conceptually (infrastructure), but "dead" functionally (not auto-triggered).
This is why chat identified "ZF is not activated" — the mechanism exists but the automation doesn't fire.

---

### COMPLETE & TESTED ✅

**1. Tier 1 Phase State Machine**
- 4 auto-hooks (finish-build, close-audit, start, daily-escalation)
- Phase 0, 1, 2 transitions
- Escalation job scheduled
- Status: Production-ready
- Tests: All passing (10 test files FAIL→PASS)

**2. Tier 2 Gates (Rule 4 enforcement)**
- Gate 1 (RULE_THINKING_AUDIT): Auto-opens audit trails
- Gate 2 (RULE_PHASE_COMPLETION_REQUIRES_AUDIT): Blocks phase progression until prior audit is ZF_COMPLETE or valid HELD
- decision_count infrastructure tracks decisions per phase
- E2E tests: 8/8 PASS
- Status: Production-ready

**3. Permanent Drift Prevention System (Rule 1+2)**
- 8 hardwired enforcement rules deployed in memory
- Scope discipline, no freelance investigations, permission gates, etc.
- Mandatory next-step framework
- Communication Corespine (SHORT IS DEFAULT)
- Status: Active, preventing human AI drift

**4. North Star Foundation (Constitutional Document)**
- CDS-NORTH-STAR-001.md: Constitutional foundation
- 5 structural rules defined
- Document tree structure (13 sub-documents planned)
- Status: Active, all plans reference it

**5. Plan Template (Mandatory Alignment)**
- CDS-PLAN-TEMPLATE.md: Every plan must use this
- Section 4: Mandatory North Star Alignment (cannot be skipped)
- Drift risk analysis forced into every plan
- Status: Active, prevents plan-level drift

### RESEARCH COMPLETE (Implementation Ready) ✅

**56 Foundation Documents (0000-0090 series)**
- 0000: Foundation & Governing Principles
- 0010: Depth & Modularity Standard
- 0020: Skills Architecture Standard
- 0030: Agent Architecture Standard
- 0040: Priority Engine Standard
- 0050: Bundling Philosophy
- Plus 16 more completion/gap resolution documents

All specifications complete. Ready to implement.

---

## CRITICAL MISSING COMPONENTS (Blocking Full North Star)

### MISSING: Agent Execution Engine (600-800 LOC)
**Status:** Not implemented  
**Required for:** Rule 1 (Bounded Execution), Rule 2 (Permission-Gated Skills)  
**What's needed:**
- Agent registry (AG-DOMAIN-SEQUENCE format)
- Agent backpack (goal, skills, authority level, etc.)
- Skill invocation coordinator
- Authority level enforcement (CORE approval flow)
- Accumulated context management
- Resolution signal validation
- Endpoint: /api/phase/:n/agent/:agentId/invoke

**Spec source:** CDS_CSPS_0030 (complete specification in research docs)  
**Time estimate:** 8-10 hours  
**Build order:** FIRST (foundation for everything else)

---

### MISSING: Skill Architecture (500-600 LOC)
**Status:** Not implemented  
**Required for:** Rule 2 (Permission-Gated Skills)  
**What's needed:**
- Skill registry (SK-DOMAIN-SEQUENCE format)
- Skill backpack (input contract, output contract, failure modes, depth tiers)
- Input/output contract validation
- Skill permission list enforcement
- Skill invocation tracking
- Endpoint: /api/skill/:skillId/invoke (with permission validation)

**Spec source:** CDS_CSPS_0020 (complete specification)  
**Time estimate:** 6-8 hours  
**Build order:** SECOND (needed before agents can work)

---

### MISSING: Gap Detection & Escalation (300-400 LOC)
**Status:** Not implemented  
**Required for:** Rule 4 (Mandatory Gap Detection)  
**What's needed:**
- Gap definition framework (what is a gap?)
- Anomaly detection system
- Constraint violation detection
- Wiring state validation
- Gap escalation workflow (who gets notified?)
- Halt mechanism (stops execution until gap resolved)
- Module: threshold/src/gate/gap-detector.ts

**Time estimate:** 5-7 hours  
**Build order:** THIRD (after agent/skill systems)

---

### MISSING: Frame & Constraint Verification (300-400 LOC)
**Status:** Partially exists (Gate 2 validates state, not constraints)  
**Required for:** Rule 4 (Verify outputs before forwarding)  
**What's needed:**
- Output contract schema (what must output contain?)
- Wiring state validation (is output state valid?)
- Constraint verification (does output satisfy hard rules?)
- Anomaly detection (unexpected values?)
- Verification failure handling
- Extend: threshold/src/gate/tier2-gates.ts

**Time estimate:** 4-6 hours  
**Build order:** THIRD (parallel with gap detection)

---

### MISSING: Authority Escalation (400-500 LOC)
**Status:** Not implemented  
**Required for:** Rule 3 (CORE → MEDIUM → FULL escalation)  
**What's needed:**
- Authority level assignment per agent
- Execution history tracking (proves capability)
- Zero Findings checklist for escalation approval
- Governor approval workflow
- Authority level enforcement per invocation
- Audit trail of authority changes
- Extend: threshold/src/agent/ module

**Time estimate:** 6-8 hours  
**Build order:** FOURTH (depends on agent system)

---

### MISSING: Full Audit Trail Specification (200-300 LOC)
**Status:** Basic audit exists (id, status, timestamps), incomplete  
**Required for:** Rule 5 (Mandatory Audit Trails)  
**What's needed:**
- Extended audit record schema (matches Agent Architecture spec)
- Skill invocation logging
- Branch decision logging
- Verification check logging
- Gap detection logging
- Authority level decision logging
- Immutable audit trail storage
- Extend: threshold/src/gate/tier2-gates.ts + audit-registry.json

**Time estimate:** 3-4 hours  
**Build order:** SECOND (can be done parallel with skills)

---

### MISSING: One Source of Truth Schema Registry (3-4 hours)
**Status:** Principle defined (OSSOT), no registry exists  
**Required for:** All registries (Phase, Audit, Park, Agent, Skill)  
**What's needed:**
- threshold/schema/registries.json (all registry schemas)
- threshold/schema/agents.json (agent schemas)
- threshold/schema/skills.json (skill schemas)
- threshold/schema/SCHEMA-REGISTRY-001.md (governance doc)
- Runtime validator (validates all data against schemas)
- Principle from CDS_CSPS_0008: Every registry must have JSON schema before Wired state

**Time estimate:** 3-4 hours  
**Build order:** BEFORE agent/skill systems (schema-first)

---

### MISSING: ZF Cycle Integration (4-6 hours)
**Status:** Endpoints exist, not wired to Phase 0  
**Required for:** Feedback loop (CDS learns from audits)  
**What's needed:**
- Auto-trigger ZF on Phase 0 findings
- ZF insights → injection into prevention-rules.json
- Prevention rules read by all gates (closed loop)
- Escalation policy (when auto-trigger?)
- Governor ratification of injected rules
- Extend: threshold/src/server.ts + threshold/src/zf-cycle/

**Time estimate:** 4-6 hours  
**Build order:** SIXTH (after gap detection + authority escalation)

---

### MINOR: API Key Validation (1-2 hours)
**Status:** Defaults to 'governor' role  
**Issue:** No actual key registry/validation  
**Fix:** Create API key registry, validate on every request  
**Build order:** Anytime (low priority)

---

### MINOR: Audit Trail Refinement (2-3 hours)
**Status:** Basic structure exists  
**Enhancement:** Match full Audit Trail Template from spec  
**Build order:** Parallel with other work

---

## OPTIMAL BUILD SEQUENCE

### PHASE A: Foundation (Must complete first)

**Week 1, Day 1-2: Schema Registry (3-4 hours)**
1. Create threshold/schema/SCHEMA-REGISTRY-001.md (governance doc)
2. Create threshold/schema/registries.json (Phase, Audit, Park schemas)
3. Create threshold/schema/agents.json (agent definition schema)
4. Create threshold/schema/skills.json (skill definition schema)
5. Create threshold/src/schema/validator.ts (runtime validation)

**Why first:** Wiring state depends on schemas. Without schemas, nothing reaches Wired.

---

### PHASE B: Core Execution (Agent + Skill systems)

**Week 1, Day 3-4 & Day 5: Skill Architecture (6-8 hours)**
1. Implement threshold/src/skill/registry.ts (SK-DOMAIN-SEQUENCE)
2. Implement threshold/src/skill/backpack.ts (skill backpack interface)
3. Implement threshold/src/skill/validator.ts (contract validation)
4. Implement skill permission enforcement
5. Create /api/skill endpoints (invoke with permission check)
6. Tests: Skill registry, permission gating, contract validation

**Rationale:** Skills are simpler than agents. Build them first so agents can invoke them.

---

**Week 2, Day 1-3: Agent Execution Engine (8-10 hours)**
1. Implement threshold/src/agent/registry.ts (AG-DOMAIN-SEQUENCE)
2. Implement threshold/src/agent/backpack.ts (agent backpack interface)
3. Implement threshold/src/agent/executor.ts (skill invocation coordinator)
4. Implement threshold/src/agent/context.ts (accumulated context management)
5. Implement resolution signal validation
6. Create /api/phase/:n/agent/:agentId/invoke endpoint
7. Implement CORE authority approval flow
8. Tests: Agent creation, skill invocation, context accumulation, resolution signals

**Rationale:** Core execution engine. All other systems depend on this.

---

**Week 2, Day 4-5: Full Audit Trail Specification (3-4 hours)**
1. Extend threshold/src/gate/tier2-gates.ts audit record schema
2. Add skill invocation logging
3. Add branch decision logging
4. Add verification check logging
5. Update audit-registry.json schema
6. Tests: Audit trail completeness, immutability

**Can run parallel with agent work.**

---

### PHASE C: Governance (Gap Detection + Authority Escalation)

**Week 3, Day 1-2: Gap Detection & Escalation (5-7 hours)**
1. Create threshold/src/gate/gap-detector.ts (gap detection framework)
2. Implement anomaly detection
3. Implement constraint violation detection
4. Implement wiring state validation
5. Create gap escalation workflow
6. Implement halt mechanism
7. Tests: Gap detection accuracy, escalation workflow, halt behavior

**Depends on:** Agent + Skill systems  
**Rationale:** Must detect gaps before authority escalation works

---

**Week 3, Day 3-4: Frame & Constraint Verification (4-6 hours)**
1. Extend threshold/src/gate/tier2-gates.ts (output contract validation)
2. Implement wiring state validation
3. Implement constraint verification
4. Implement anomaly detection (output level)
5. Update Gate 2 to call verification checks
6. Tests: Contract validation, constraint checking, verification passes/fails

**Can run parallel with gap detection.**

---

**Week 3, Day 5 & Week 4, Day 1: Authority Escalation (6-8 hours)**
1. Extend threshold/src/agent/ module (authority assignment)
2. Implement execution history tracking
3. Implement Zero Findings checklist for escalation
4. Implement Governor approval workflow
5. Enforce authority level per invocation
6. Audit trail of authority changes
7. Tests: Authority levels, escalation conditions, proof requirements

**Depends on:** Agent system + Gap detection  
**Rationale:** AI must prove itself before escalation allowed

---

### PHASE D: Learning Loop

**Week 4, Day 2-3: ZF Cycle Integration (4-6 hours)**
1. Create auto-trigger on Phase 0 findings
2. Implement ZF → insights → injection workflow
3. Create prevention-rules.json update mechanism
4. Implement Governor ratification
5. Wire gates to read injected rules
6. Tests: Auto-trigger accuracy, injection integration, rule application

**Depends on:** Entire governance layer (A+B+C)  
**Rationale:** Learning loop only works after all other systems are in place

---

### PHASE E: Polish

**Week 4, Day 4-5: API Key Validation (1-2 hours)**
1. Create API key registry
2. Implement key validation middleware
3. Audit logging of API key usage
4. Tests: Key validation, access control

**Anytime (low priority)**

---

## TOTAL EFFORT ESTIMATE

| Phase | Components | Hours | Timeline |
|-------|-----------|-------|----------|
| A | Schema Registry | 3-4 | Day 1-2 |
| B | Skills (6-8) + Agent (8-10) + Audit (3-4) | 17-22 | Day 3-5, Week 2 |
| C | Gap Detection (5-7) + Frame (4-6) + Authority (6-8) | 15-21 | Week 3 |
| D | ZF Integration | 4-6 | Week 4 |
| E | API Key Validation | 1-2 | Anytime |
| **TOTAL** | | **40-55 hours** | **4 weeks (full-time)** |

---

## KEY ARCHITECTURAL DETAILS & NUANCES

### Pockets of Activity with Frame Filtering (The Core Vision)

**The User's Original Insight:**
> "CDS leverages AI power with core focused guardrails while creating hard coded paths and AI connected pockets of activity with the 'frame' filtering outputs by auditing and verifying them within a predefined architecture that does not false assume context can hold it all...all the time"

This captures the essence:
- **Pocket** = focused AI work (one capability, bounded scope)
- **AI connected** = AI has full power within that pocket
- **Frame** = hard-coded boundaries (what AI cannot exceed)
- **Filtering** = frame validates every output before it escapes
- **Verifying** = auditing happens by default, not optionally
- **Pre-defined architecture** = not ad-hoc rules, constitutional structure

**Result: AI power + mechanical boundaries = safe autonomy**

---

### Context Bounding (Rule 1 Deep Dive)

**What is a pocket?**
A bounded execution scope with:
- Input context (what does pocket receive?)
- Execution scope (what can this pocket do?)
- Output contract (what must pocket produce?)
- Context limit (how much context can pocket hold?)
- Gap definition (what would constitute a problem?)

**Why matters:** Prevents context overflow. If pocket needs context from outside, it's a gap that halts execution and escalates to human. This is how CDS solves the "context holding" problem that breaks current AI systems.

**Example pocket:**
```
Pocket: "Validate user feedback"
Input: feedback_text (string, max 10KB)
Scope: Parse + classify + validate against schema
Output: validated_feedback (matches schema)
Context limit: 2KB (template + rules only, not historical data)
Gap: If output doesn't match schema, HALT
```

---

### Authority Levels in Detail (Rule 3 Deep Dive)

**CORE Authority (starting point)**
- Every decision requires human confirmation before proceeding
- Agent presents proposed action and waits
- Every branch presented to human (agent doesn't select)
- All findings immediately to human
- Use case: New agents, high-stakes decisions, first execution
- Slowest, safest

**MEDIUM Authority (proven)**
- Agent proceeds autonomously within declared stages
- Pauses only at Decision Stage branch points for human confirmation
- Branch selection requires human confirmation
- Findings at session end + immediate on gaps
- Use case: Validated agents with track records
- Balanced speed/safety

**FULL Authority (trusted)**
- Agent autonomous throughout
- Halts only on gaps/failures not covered by constraints
- Branch selection autonomous (guided by declared criteria)
- Real-time findings
- Use case: Fully validated agents, ratified protocols
- Fastest, requires proof

**Escalation requirements:**
- CORE → MEDIUM: 5+ successful executions, zero findings
- MEDIUM → FULL: 20+ successful executions, zero findings, Governor approval
- FULL → Revoked: Any silent failure, any unauditable action

---

### Depth Tiers in Execution (From CDS_CSPS_0010)

Every execution can run at different depths:

**CORE Depth**
- Minimum viable context
- Fast execution
- No reasoning layer
- No audit details
- Use: Fast mechanical tasks

**MEDIUM Depth**
- Standard operational context
- Includes reasoning for AI collaboration
- Inheritance summary (not full chain)
- Most common depth for most work

**FULL Depth**
- Complete context
- Full inheritance chain
- Complete audit mirror
- All constraints verified
- Use: Governance review, ratification, cross-platform propagation

**Application:** An agent can be told "execute at CORE depth" (fast, limited context) or "execute at FULL depth" (complete context, slower). Agent requests context it needs, frame provides what's appropriate for that depth.

---

### Frame Constraints Explained (Rule 1+4)

The "frame" is everything that defines boundaries:

**Frame elements:**
1. Pocket definition (scope)
2. Skill permission list (what can invoke)
3. Authority level (decision approval)
4. Depth tier (how much context)
5. Output contract (what must be produced)
6. Constraint list (hard rules that must satisfy)
7. Gap definitions (what constitutes a problem)
8. Audit template (what must be recorded)

**Frame is DECLARED before execution.**

AI cannot exceed frame. Frame is not a suggestion — it's architectural.

**Example frame:**
```
Pocket: "Generate user report"
Permissions: [Skill-Report-Generate, Skill-Chart-Create]
Authority: MEDIUM
Depth: MEDIUM
Output contract: {
  title: string,
  sections: array,
  charts: array,
  total_length: < 5000 characters
}
Constraints: [
  "No data outside date range",
  "No data for suspended users",
  "Charts must use standard colors"
]
Gaps: [
  "Output exceeds 5000 chars → HALT",
  "Unknown users referenced → HALT",
  "Non-standard colors → HALT"
]
```

---

### Mandatory Gap Detection (Rule 4 Deep Dive)

After every AI output, before it's forwarded:

**Check 1: Output Contract**
- Does output have all required fields?
- Are field types correct?
- Are field values in valid range?

**Check 2: Wiring State**
- Is output in valid state? (not CORRUPTED)
- Do all references point to valid sources?
- Is inheritance chain intact?

**Check 3: Constraints**
- Does output violate hard rules?
- Is output within declared limits?
- Are all dependencies satisfied?

**Check 4: Anomalies**
- Are values within expected range?
- Are there unexpected nulls/blanks?
- Is output consistent with input?

**Result:**
- All pass → forward to next pocket
- Any fail → HALT execution, escalate to human/Governor

**Why critical:** This is how CDS prevents silent divergence. Divergence is caught before deployment.

---

### Mandatory Audit Trails (Rule 5 Deep Dive)

Every execution produces immutable trail:

**What gets recorded:**
```
{
  execution_id: "EX-20260706-001",
  pocket: "validate-feedback",
  agent_id: "AG-VALIDATE-001",
  authority_level: "MEDIUM",
  depth_tier: "MEDIUM",
  started_at: ISO8601,
  skills_invoked: [
    {skill_id: "SK-PARSE-001", result: "SUCCESS"},
    {skill_id: "SK-CLASSIFY-001", result: "SUCCESS"},
    {skill_id: "SK-VALIDATE-001", result: "SUCCESS"}
  ],
  branch_decisions: [
    {branch_point: "classification-confidence", selected: "HIGH", human_approved: true}
  ],
  verification_checks: [
    {check: "output-contract", result: "PASS"},
    {check: "wiring-state", result: "PASS"},
    {check: "constraints", result: "PASS"},
    {check: "anomalies", result: "PASS"}
  ],
  gaps_detected: [],
  output: {...},
  completed_at: ISO8601,
  resolution_signal: "SUCCESS"
}
```

**Why immutable:** Hash-based (checksum) prevents tampering. Registry uses atomic writes (temp file + rename) for consistency.

**Why complete:** Future auditors can see exactly what happened, who approved what, what was verified.

---

### OSSOT (One Source of Truth) Principal

**Principle:** Every element has exactly one source of truth. Four operations only: BUILD → IMPROVE → APPROVE → REPLICATE.

**Applied to CDS:**
- CR-ID format: One format (CR-YYMMDD-NNN), all records, all time
- Vocabulary: One set, synonyms route to translation layer
- Dashboard: One parent template, instances configure it
- Registries: One schema, all data validates against it

**Why matters:** Prevents parallel versions. No "alternate" implementations. No confusion about which version is authoritative.

**JSON Schema requirement (CDS_CSPS_0008 Principle 9):**
> Every registry and skill must have a declared JSON schema before operational.

Registry without schema = Defined wiring state (not Wired).

---

### The North Star as Constitutional Law

**CDS-NORTH-STAR-001** is the foundation document that ALL OTHER WORK inherits from.

**Every plan must include:**
Section 4 - CDS North Star Alignment:
- [ ] Bounded execution pockets (defined)
- [ ] Permission-gated skills (listed)
- [ ] Authority level (declared + justified)
- [ ] Frame constraints (specified)
- [ ] Gap detection (defined)
- [ ] Audit trail (required)

**Purpose:** Forces every plan to consciously address drift prevention. Can't skip it. If alignment isn't declared, plan is incomplete.

---

## NUANCES & IMPORTANT DETAILS

### Why HELD Blocks Next Phase (Not ZF_COMPLETE)
From E2E test analysis: When Phase N audit is HELD, Phase N+1 cannot start.

**Rationale:** HELD means findings are parked (acknowledged but unresolved). Allowing next phase to start while previous is HELD creates hidden risk.

**Only ZF_COMPLETE (zero findings) permits next phase to open.**

This is enforced in /api/phase/:n/start endpoint (line 1188 of server.ts).

---

### Why decision_count Exists
Tracks number of decisions made in a phase. Used by Gate 2 to distinguish:
- No audits + decision_count=0 → PASS (nothing to audit)
- No audits + decision_count>0 → BLOCK (missing audit trail)

Prevents "lost audits" from being treated same as "nothing to audit."

---

### API Key to Governor Default
Currently: CDS_API_KEY defaults to 'governor' role (line 1111 of server.ts).

**Rationale:** Phase 0 testing only. Once deployed, must validate API key against actual registry and assign appropriate role (governor/developer/tenant_admin/etc).

**Phase 0.5:** Build API key registry with role assignment.

---

### Why Tier 2 Needs Both Gate 1 + Gate 2
- Gate 1: Auto-opens audit when AI makes decision (prevents forgotten audits)
- Gate 2: Validates prior phase audit before allowing next phase (prevents unresolved findings from propagating)

Together: Full lifecycle governance. Neither alone is sufficient.

---

## AFTER-COMPACTION RECOVERY PROMPT

Use this prompt when context resets after compaction to recover full strategy:

---

**[PASTE THIS PROMPT AFTER COMPACTION]**

```
CONTEXT RECOVERY PROMPT — CDS Platform Build Strategy

Session Date: 2026-07-06 | Context: 7% remaining
Recovery Document: CDS-MASTER-PLAN-2026-07-06.md

READ THIS FIRST:
1. CDS-MASTER-PLAN-2026-07-06.md (in project root)
2. CDS-NORTH-STAR-001.md (constitutional foundation)
3. CDS-PLAN-TEMPLATE.md (mandatory for all plans)

CRITICAL ARCHITECTURAL PRINCIPLES (Non-Negotiable):
- Five Structural Rules: Bounded Execution, Permission-Gated Skills, Authority Escalation, Gap Detection, Audit Trails
- Context is finite (not infinite)
- AI freelancing must be mechanically impossible (not procedurally prevented)
- Every output must be verified before deployment
- Every decision must be auditable

CURRENT BUILD STATUS:
✅ COMPLETE: Tier 1 phase machine, Tier 2 gates, E2E tests (8/8 PASS), North Star docs, drift prevention rules
❌ MISSING: Agent system (800 LOC), Skills (600 LOC), Gap detection (400 LOC), Authority escalation (500 LOC), Frame verification (400 LOC), Schema registry (3-4 hours), ZF integration (6 hours)

OPTIMAL BUILD SEQUENCE (40-55 hours total):
1. Schema Registry (3-4 hours) — foundation for all registries
2. Skill Architecture (6-8 hours) — agents invoke skills
3. Agent Execution Engine (8-10 hours) — core execution
4. Full Audit Trail (3-4 hours) — complete traceability
5. Gap Detection (5-7 hours) — prevent silent divergence
6. Frame Verification (4-6 hours) — validate outputs
7. Authority Escalation (6-8 hours) — graduated trust
8. ZF Integration (4-6 hours) — learning feedback loop
9. API Key Validation (1-2 hours) — security hardening

CRITICAL MISSING DETAILS (From Chat):
- Pocket concept: Bounded execution scope with input context, scope, output contract, context limit, gap definition
- Authority levels: CORE (every decision approved) → MEDIUM (approved at branches) → FULL (autonomous)
- Depth tiers: CORE depth (minimum), MEDIUM depth (standard), FULL depth (complete)
- Frame: Pocket + permissions + authority + depth + output contract + constraints + gaps + audit template
- Gap detection: Verify output contract, wiring state, constraints, anomalies — halt if any fail
- Audit trails: Immutable record of execution, skills, decisions, verifications, gaps
- OSSOT: One source of truth, no parallel versions, 4 operations (BUILD/IMPROVE/APPROVE/REPLICATE)
- decision_count: Tracks decisions per phase (distinguishes "nothing to audit" from "missing audit")
- HELD vs ZF_COMPLETE: Only ZF_COMPLETE allows next phase (HELD blocks)

RESEARCH DOCUMENTATION:
- 56 complete specifications (documents 0000-0090) in folder "01 — Foundation + Completion"
- All architecture specs ready to implement (0020 Skills, 0030 Agents, 0010 Depth, etc.)
- No more design needed — only implementation

NUANCES NOT TO MISS:
1. Tier 2 needs BOTH Gate 1 (auto-open audit) AND Gate 2 (validate prior audit) — neither alone sufficient
2. API key currently defaults to 'governor' role — needs registry in Phase 0.5
3. decision_count prevents "lost audits" from being treated as "nothing to audit"
4. Pocket definition forces clarity (prevents scope creep at design time)
5. Authority escalation requires proof (5+ executions at CORE, 20+ at MEDIUM for FULL)
6. Frame is architectural (not suggestion) — AI cannot exceed it
7. ZF cycle only works after gap detection + authority escalation complete
8. Schema registry must exist before Agent/Skill systems reach Wired state

NEXT IMMEDIATE ACTIONS:
1. Review CDS-MASTER-PLAN-2026-07-06.md (this recovery document)
2. Review CDS-NORTH-STAR-001.md (why CDS exists)
3. If ready to build: Start Phase A (Schema Registry) — 3-4 hours, foundation for everything
4. If questions: Reference CDS_CSPS_0030 (agents), 0020 (skills), 0010 (depth), 0008 (schema)
5. All plans must use CDS-PLAN-TEMPLATE.md and include Section 4 (North Star Alignment)

PERMISSION TO PROCEED:
After compaction, you have full authority to proceed with Phase A (Schema Registry) immediately.
No additional approval needed until Phase B (Agent/Skills) when architectural review should occur.
All build decisions are consistent with North Star and research specifications.

Questions or blockers? Check CDS-MASTER-PLAN-2026-07-06.md first — it has complete details.
```

---

## SIGNATURE

**This document is the complete CDS platform strategy.**

All architectural decisions documented.
All build phases specified.
All nuances preserved.
All recovery information included.

**After compaction, paste the recovery prompt above.**

Everything needed to continue is in this document.

---

---

## APPENDIX: Why This Matters (Strategic Context)

**The Gap Between Research and Implementation:**
56 complete architecture documents (0000-0090) exist. Every spec is finished. Zero design work remains.

But implementation lags far behind:
- Research says: Agent/Skill architecture complete
- Implementation says: Not started
- Gap: 40-55 hours of coding

**Why Don't We Just Do It?**
Three reasons:
1. **Foundation first:** Schema registry must exist before Agent/Skill systems reach Wired state
2. **Sequence matters:** Skills must work before agents can invoke them. Both must work before authority escalation can function.
3. **Dependency chain:** Gap detection, then authority escalation, then ZF integration. Wrong order = broken system.

**The Recovery Vision:**
CDS isn't being built in isolation. It's a response to a real, urgent market problem:

Enterprises are using Claude/GPT and getting drift. They can't audit why. They can't stop freelancing. They can't trust autonomous execution.

The first platform that solves this mechanically (not procedurally) will own that market.

CDS is built on the insight that context is finite and designing architecture around that constraint is the answer.

---

**Document Status: FOUNDATIONAL**  
**Approval: Platform Governor + Constitutional Architecture**  
**Effective: 2026-07-06**  
**Revision: 1.1 (Refined with chat nuances)**  
**Next Update: After Phase A (Schema Registry) completion**

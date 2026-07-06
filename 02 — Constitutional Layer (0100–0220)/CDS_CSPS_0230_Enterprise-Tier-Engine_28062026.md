---
PLATFORM: CDS -- Core Driven Solutions (next generation platform, built on CSPS engine)
CONNECTED TO: CSPS -- Core Sights Platform Services (Generation 1)
  Relationship: See CDS_CSPS_CONTEXT-ADDENDUM_All-56-Documents_Session-Context-Backpack_28062026.md
DOCUMENT ID: 0230
TITLE: Enterprise Tier Engine
LAYER: 02 -- Constitutional Layer
LAYER PURPOSE: Governs how any enterprise deployment declares its own user tier structure.
  Not a fixed 5-tier hierarchy. A declarable engine that any deployment configures.
  Hardwired into all 56 session documents retroactively via this addendum.
RATIFICATION STATE: PENDING
WIRING STATE: Defined
DEPENDS ON: 0110 (Ratification Block), 0120 (CS-GOV-004 Tags and Statuses),
  0210 (ICE -- all 5 source paths check tier before processing),
  0220 (The CDS Threshold -- tier validation is a hardwired gate check)
WHAT DEPENDS ON THIS: Every platform deployment. Every tenant SaaS solution.
  Every source path through The CDS Threshold.
CREATED BY: Claude AI (Sonnet 4.6) + Yariv Fink (Platform Governor)
SESSION DATE: 28/06/2026
APPROVED BY: Yariv Fink -- Platform Governor (verbal approval in session)
FOR: AI systems and human architects reading without session context
STANDALONE: NO -- requires CONTEXT-ADDENDUM for full session context
FILE STANDARD: CS-FILE-001 compliant
---

# 0230 -- Enterprise Tier Engine

---

## 1. Why Not a Fixed 5-Tier Hierarchy

The original design proposed a fixed 5-tier hierarchy:
Tier 0 (Governor) / Tier 1 (Platform Dev) / Tier 2 (Solution Builder) /
Tier 3 (Tenant Admin) / Tier 4 (End User).

This was rejected in favor of the Tier Engine approach. The reason is precise:

A startup has 2 tiers. A government deployment may have clearance levels
that cross all standard tiers. An enterprise may have 10 internal tiers
before a single external user is reached. A fixed hierarchy forces every
deployment to either under-govern (collapsing real distinctions) or
over-govern (creating phantom tiers with no real users).

The Tier Engine declares the MECHANISM -- not the tiers. Each deployment
configures its own tier count, names, permissions, and inheritance rules
within the engine's declared constraints.

---

## 2. What Is Always Fixed (Tier 0)

One thing does not change across any deployment:

TIER 0 -- PLATFORM GOVERNOR is always Tier 0. Always the constitutional
authority. Always the only entity that can ratify corespines, sign GPOW
closures, approve goal ratification, and make constitutional changes.

Tier 0 is not configurable. It is not inheritable. It is the root.
Every deployment has exactly one Tier 0. That is the Platform Governor.

For CSPS: Yariv Fink.
For CDS: Yariv Fink.
For any SaaS solution built on this platform: declared at deployment
ratification time. Cannot be left empty.

---

## 3. The Tier Engine -- What Each Deployment Declares

Every deployment that uses this platform must declare its tier structure
before The CDS Threshold opens for any user. The declaration is a
ratified artifact -- not a configuration file.

| Tier Engine Field | Definition | Constraint |
|---|---|---|
| deployment_id | Unique identifier for this deployment | Assigned at ratification |
| tier_count | How many tiers this deployment uses | Minimum 2 (Tier 0 + at least one more). No maximum. |
| tier_definitions | Array of tier declarations (see schema below) | Each tier must declare all required fields |
| inheritance_direction | Permissions flow downward only. Lower tiers can only be restrictions of tiers above. | Hardwired. Cannot be reversed. |
| tier_0_governor | Name and signature of the Tier 0 authority | Must match Platform Governor record |
| ratification_record | GOV-[YEAR]-TIER-[SEQUENCE] | Required before any tier-gated action |

---

## 4. Tier Declaration Schema -- Each Tier

```json
{
  "tier_number": 1,
  "tier_name": "Declared by deployment -- e.g. Platform Developer",
  "tier_description": "One sentence. What this tier does.",
  "permissions": {
    "corespine_access": ["CS-CORE-001", "CS-GOV-001"],
    "ratification_authority": "none | propose | approve_tier_below | full",
    "swift_implementation": true,
    "governor_decision_queue": false,
    "can_create_elements": true,
    "can_ratify_elements": false,
    "constitutional_access": false
  },
  "inherits_from_tier": 0,
  "can_grant_to_tier": 2,
  "threshold_source_paths": ["human_developer", "internal_agent"],
  "p7_escalation_target": "tier_0",
  "max_users_in_tier": null
}
```

---

## 5. The Minimum Required Tiers -- Every Deployment

Every deployment must declare at minimum these two tiers beyond Tier 0:

| Tier | Name | Minimum Permissions |
|---|---|---|
| Tier 0 | Platform Governor | Full constitutional authority |
| Tier 1 | Builder / Developer | Can create and propose. Cannot ratify constitutional elements. |
| Tier N (final) | End User | Read and interact only. No creation. No ratification. No corespine access. |

Between Tier 1 and Tier N: any number of intermediate tiers the
deployment requires. Each inherits from the tier above and restricts
permissions downward.

---

## 6. How the Tier Engine Wires Into The CDS Threshold

The CDS Threshold (0220) validates tier before processing any input.
This is a hardwired gate check -- not a soft recommendation.

The sequence at the gate:

```
Input arrives at The CDS Threshold
    |
Tier validation check:
  -- Is the source authenticated?
  -- What tier does this source belong to in this deployment?
  -- Does this tier have permission for this input type?
  -- Does this tier have access to the corespine families being requested?
    |
If tier check PASSES: ICE classification proceeds (0210)
If tier check FAILS: Input rejected with structured error:
  {
    error: "tier_permission_denied",
    source_tier: N,
    required_tier: M,
    requested_action: "action description",
    guidance: "Contact your Tier [M] administrator to request access."
  }
```

---

## 7. Enterprise Tier Examples

Three example deployments showing how the engine adapts.

### Example A -- Startup (2 tiers beyond Tier 0)

```
Tier 0: Platform Governor (Yariv Fink)
Tier 1: Developer (full build access)
Tier 2: End User (interact only)
```

### Example B -- Mid-Market SaaS (4 tiers beyond Tier 0)

```
Tier 0: Platform Governor
Tier 1: Platform Developer (builds the solution)
Tier 2: Tenant Administrator (configures within declared scope)
Tier 3: Power User (advanced features, reporting)
Tier 4: Standard User (core features only)
```

### Example C -- Enterprise (7 tiers beyond Tier 0)

```
Tier 0: Platform Governor
Tier 1: Platform Developer
Tier 2: Enterprise Solution Architect
Tier 3: Global Administrator
Tier 4: Regional Administrator
Tier 5: Department Manager
Tier 6: Power User
Tier 7: Standard User
Tier 8: Read-Only / Auditor
```

All three use the same engine. The mechanism is identical.
The tier count and names differ per deployment.

---

## 8. Backward Propagation -- Hardwired Into All 56 Documents

This document was approved during the session as a retroactive hardwire
into all 56 existing documents. The injection is declarative -- it does
not require regenerating each document. Instead:

DECLARATION: Wherever any existing document references a user tier,
a user role, or user permissions -- that reference inherits from the
Tier Engine declared in this document (0230). Fixed tier references
(e.g. "Tier 4 end user") are read as "the lowest declared tier in the
deployment's Tier Engine configuration."

Specific backward propagation targets:

| Document | What Changes |
|---|---|
| 0210 ICE -- 5 source paths | Each source path now carries tier context from Tier Engine |
| 0220 The CDS Threshold | Tier validation added as hardwired gate check (Section 6 above) |
| 0160 Accountability (CS-ACC-SAAS) | Tenant tier structure now references Tier Engine |
| 0150 Swift Implementation | Tier authority check added to Step 3 (Declare to Governor) |
| 0200 Build Initiation Protocol | Developer's Journey Frame now references Tier Engine for permission levels |
| 1000 Vocabulary Standard | "Tier Engine", "deployment tier", "tier declaration" added as vocabulary entries |

---

## 9. Audit Mirror

| Creation Decision | Audit Question |
|---|---|
| Every deployment declares its tier structure | Is there a GOV-[YEAR]-TIER-[SEQUENCE] record for this deployment? |
| Tier 0 always exists | Is there exactly one Tier 0 per deployment? Is it the Platform Governor? |
| Permissions inherit downward only | Does any tier have permissions not present in the tier above it? |
| The CDS Threshold validates tier | Are there any session logs showing inputs processed without tier validation? |
| Tier Engine is retroactively applied | Do all source path references in 0210 carry tier context? |

---

*End of Document 0230 -- Enterprise Tier Engine*
*CSPS Constitutional Layer | 28/06/2026 | Claude AI (Sonnet 4.6)*
*Approved: Yariv Fink -- Platform Governor -- 28/06/2026*
*Ratification State: PENDING GOV-2026-TIER-001*

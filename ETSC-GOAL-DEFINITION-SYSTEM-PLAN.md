---
title: "ETSC (Evolving Through Sharing & Consulting) — Goal Definition System"
date: 2026-07-06
authority: CDS Orchestrator
status: COMPREHENSIVE_PLAN_READY_FOR_BUILD
version: 1.0
scope_layers: Core + Layer 1 + Layer 2 (parked)
---

# ETSC GOAL DEFINITION SYSTEM

## CORE VISION

Admin initiates a consulting goal through a **conversational AI-guided wizard** that:
1. Collects initial draft from human
2. AI refines core problem/solution (backend API)
3. Presents scope and participant bundles
4. Recommends bundle with reasoning (text + visual)
5. Creates immutable goal in decision-log
6. Wires participants according to bundle assignment

**Orchestrator then has:** Goal characteristics + Participant capabilities → optimal assignment

---

## PART 1: SCHEMA ALIGNMENT (Vocabulary & Hierarchy)

### Goal Type Definitions (Canonical Schema Nodes)

Every goal must map to a canonical schema node. These are the **platform-defined goal types**:

```
decisions.goals (parent node)
├── decisions.goals.performance_optimization
│   └── Examples: API speed, database efficiency, resource usage
│   └── Schema node ID: SCHEMA-GOAL-PERF-001
│
├── decisions.goals.architecture_redesign
│   └── Examples: System restructure, scalability, component refactoring
│   └── Schema node ID: SCHEMA-GOAL-ARCH-001
│
├── decisions.goals.feature_development
│   └── Examples: New capability, user-facing feature, integration
│   └── Schema node ID: SCHEMA-GOAL-FEAT-001
│
├── decisions.goals.problem_solving
│   └── Examples: Bug fix, security issue, compatibility
│   └── Schema node ID: SCHEMA-GOAL-PROB-001
│
├── decisions.goals.learning_exploration
│   └── Examples: Research, POC, technology investigation
│   └── Schema node ID: SCHEMA-GOAL-LEARN-001
│
└── decisions.goals.strategic_planning
    └── Examples: Long-term direction, partnership, market entry
    └── Schema node ID: SCHEMA-GOAL-STRAT-001
```

**Schema rule:** Every goal created MUST be classified into one of these nodes. No orphaned goals.

---

### Participant Definitions (Canonical Schema Nodes)

Each participant is a canonical entity with defined capabilities:

```
decisions.participants (parent node)
├── decisions.participants.csp
│   └── Canonical name: "CSP"
│   └── Schema node ID: SCHEMA-PART-CSP-001
│   └── Specializations: [performance, api_design, database_optimization]
│
├── decisions.participants.csps
│   └── Canonical name: "CSPS"
│   └── Schema node ID: SCHEMA-PART-CSPS-001
│   └── Specializations: [architecture, infrastructure, scalability]
│
├── decisions.participants.base44
│   └── Canonical name: "Base44"
│   └── Schema node ID: SCHEMA-PART-BASE44-001
│   └── Specializations: [frontend, ui_ux, react_expertise]
│
└── decisions.participants.lovable
    └── Canonical name: "Lovable"
    └── Schema node ID: SCHEMA-PART-LOVABLE-001
    └── Specializations: [full_stack, rapid_prototyping, integration]
```

**Schema rule:** Participant references must use canonical names. Aliases allowed in glossary.

---

### Bundle Definitions (Canonical Schema Nodes)

Bundles are combinations of participants wired to goal types:

```
decisions.bundles (parent node)
├── decisions.bundles.perf_and_arch
│   └── Participants: [CSP, CSPS]
│   └── Wired to goal types: [performance_optimization, architecture_redesign]
│   └── Schema node ID: SCHEMA-BUNDLE-PERF-ARCH-001
│
├── decisions.bundles.frontend_backend
│   └── Participants: [Base44, CSP]
│   └── Wired to goal types: [feature_development]
│   └── Schema node ID: SCHEMA-BUNDLE-FE-BE-001
│
├── decisions.bundles.full_team
│   └── Participants: [CSP, CSPS, Base44, Lovable]
│   └── Wired to goal types: [strategic_planning, architecture_redesign]
│   └── Schema node ID: SCHEMA-BUNDLE-FULL-001
│
└── decisions.bundles.quick_turnaround
    └── Participants: [CSP]
    └── Wired to goal types: [problem_solving]
    └── Schema node ID: SCHEMA-BUNDLE-QUICK-001
```

**Schema rule:** Bundle must reference valid participants + valid goal types. Enforce via checksum.

---

### Goal-to-Bundle Wiring (Canonical Relationships)

```
Goal created with type = "performance_optimization"
  ↓ (lookup wiring)
Canonical schema: decisions.goals.performance_optimization
  ↓ (find bundles wired to this goal type)
Applicable bundles:
  ├── decisions.bundles.perf_and_arch (PRIMARY recommendation)
  ├── decisions.bundles.full_team (SECONDARY option)
  └── decisions.bundles.quick_turnaround (TERTIARY option)
  ↓ (present with reasoning)
Admin chooses or accepts recommendation
  ↓
Create link: Goal → Bundle → Participants
  ↓ (immutable in decision-log)
All stored with schema checksums for orphan prevention
```

---

## PART 2: DATA MODELS WITH SCHEMA ALIGNMENT

### Goal Data Model

```typescript
interface GoalDefinition {
  // Identity
  goal_id: string;                    // GOAL-{YYYYMMDD}-{SEQ}
  schema_node: string;                // One of: SCHEMA-GOAL-PERF-001, SCHEMA-GOAL-ARCH-001, etc.
  
  // Refinement Process
  initial_draft: string;              // Original text from admin
  ai_refinement_log: RefinementStep[]; // Each Q&A with AI
  
  // Core (locked after refinement)
  core: {
    problem_statement: string;        // "What is broken / missing?"
    root_cause: string;               // "Why does it exist?"
    solution_approach: string;        // "How will we fix it?"
    business_impact: string;          // "Why does it matter?"
    success_criteria: string;          // "How will we know it's done?"
  };
  
  // Scope (presented after core locked)
  scope: {
    goal_type: string;                // ONE OF: performance_optimization, architecture_redesign, feature_development, problem_solving, learning_exploration, strategic_planning
    timeline: string;                 // "2 weeks", "4 weeks", "ongoing"
    budget?: number;                  // Optional: cost constraint
    constraints?: string[];           // ["limited engineers", "customer deadline", etc.]
  };
  
  // Bundle Assignment
  bundle_assignment: {
    bundle_id: string;                // SCHEMA-BUNDLE-PERF-ARCH-001 (canonical)
    participants: string[];           // [SCHEMA-PART-CSP-001, SCHEMA-PART-CSPS-001]
    recommendation_reasoning: {
      text: string;                   // "Your goal requires both..."
      visual_reasoning: MatchingMatrix; // See below
    };
    assigned_at: Date;
    assigned_by: string;              // admin_id
  };
  
  // Audit
  created_at: Date;
  created_by: string;                 // admin_id (must be ADMIN tier)
  locked_at: Date;                    // When core is locked
  decision_log_id: string;            // Link to Phase 0 decision-log
  schema_checksum: string;            // SHA256 for orphan detection
}

interface RefinementStep {
  step_num: number;
  ai_question: string;
  human_answer: string;
  ai_analysis: string;
  timestamp: Date;
}

interface MatchingMatrix {
  // Visual reasoning showing goal→participant matching
  goal_requirements: string[];        // ["performance", "database optimization"]
  participant_strengths: {
    [schema_node_id]: string[];       // CSP: ["performance", "database optimization"]
  };
  capacity_status: {
    [schema_node_id]: {
      current_load: number;
      max_capacity: number;
      available: boolean;
    };
  };
  match_scores: {
    [schema_node_id]: number;         // 0-100, how well participant matches
  };
}
```

---

### Participant Profile Data Model

```typescript
interface ParticipantProfile {
  // Identity
  participant_id: string;             // SCHEMA-PART-CSP-001 (canonical)
  canonical_name: string;             // "CSP", "CSPS", etc.
  
  // Capabilities (from uniform prompt)
  capabilities: {
    strengths: string[];              // ["API design", "Database optimization"]
    weaknesses: string[];             // ["Mobile UI", "Legacy systems"]
    specializations: string[];        // Maps to schema specialization nodes
    expertise_level: {
      [specialization]: number;       // 1-10 scale per specialization
    };
  };
  
  // Efficiency & Parameters
  metrics: {
    token_efficiency: number;         // 0-1, ratio of useful_tokens/total_tokens
    response_sla_hours: number;       // "24", "48"
    verification_threshold: number;   // 0-100, required confidence level
    max_concurrent_goals: number;     // Hard limit
  };
  
  // Current Status
  current_status: {
    active_goals: GoalAssignment[];
    current_load: number;             // How many active goals
    capacity_remaining: "High" | "Medium" | "Low" | "Full";
    estimated_available_at: Date;     // When next slot opens
  };
  
  // Auto-Adjust Settings
  auto_adjust_settings: {
    enabled: boolean;
    timer_days: number;               // "Auto-adjust if overloaded for N days"
    adjust_action: "warn" | "auto_adjust"; // Warn only or auto-adjust
  };
  
  // Audit
  created_at: Date;
  last_updated_at: Date;
  updated_by: string;                 // admin_id
  schema_checksum: string;            // For orphan prevention
}

interface ParticipantInitialEntry {
  // Form filled by admin to bootstrap participant profile
  participant_canonical_name: string;  // "CSP"
  strengths_text: string;              // "API design, database optimization"
  weaknesses_text: string;             // "Mobile UI, legacy systems"
  token_efficiency: number;            // 0-1
  response_sla_hours: number;
  verification_threshold: number;
  max_concurrent_goals: number;
  specializations: string[];
}

interface UniformParticipantPrompt {
  // Sent to each participant to fill their own profile
  // Standard template for all participants
  prompt: string;
  questions: {
    q1: "What are your 5 core strengths?";
    q2: "What are your 3-5 limitations or weaknesses?";
    q3: "What technologies/domains are you most expert in?";
    q4: "How many concurrent goals can you handle?";
    q5: "What's your typical response time (hours)?";
    q6: "What confidence level do we need before you're satisfied (0-100)?";
    q7: "How efficiently do you use tokens (0-1, where 1 is perfect)?";
  };
  response_schema: ParticipantProfile; // Data structure response maps to
}
```

---

### Bundle Configuration Data Model

```typescript
interface BundleDefinition {
  // Identity
  bundle_id: string;                  // SCHEMA-BUNDLE-PERF-ARCH-001
  name: string;                       // "Performance & Architecture"
  description: string;
  
  // Composition
  participants: {
    [schema_node_id]: {
      role: string;                   // "Primary", "Secondary", "Support"
      required: boolean;              // True = must have, False = optional
      reason: string;                 // Why this participant in bundle
    };
  };
  
  // Wiring to Goal Types
  wired_goal_types: string[];         // [SCHEMA-GOAL-PERF-001, SCHEMA-GOAL-ARCH-001]
  recommendation_priority: "PRIMARY" | "SECONDARY" | "TERTIARY"; // When to recommend
  
  // Configuration
  expected_timeline_days: number;
  process_style: "sequential" | "parallel" | "hybrid";
  
  // Default Settings
  is_default_for_goal_type: {
    [schema_node_id]: boolean;        // Mark as DEFAULT for specific goal type
  };
  
  // Recommendation Reasoning
  recommendation_reasoning: {
    text: string;                     // "This bundle combines..."
    visual_matrix: MatchingMatrix;    // See above
  };
  
  // Audit
  created_at: Date;
  created_by: string;                 // admin_id
  last_modified_at: Date;
  modification_history: BundleModification[];
  schema_checksum: string;
  
  // Can Edit/Delete/Archive
  status: "active" | "archived";
}

interface BundleModification {
  timestamp: Date;
  modified_by: string;
  change_type: "add_participant" | "remove_participant" | "change_priority" | "change_wiring";
  change_details: Record<string, any>;
  reason: string;
}
```

---

## PART 3: SYSTEM ARCHITECTURE

### Backend API (CDS Internal)

```
POST /api/cds/goal/draft
  Request: { initial_draft: string }
  Response: { draft_id, ai_analysis, clarifying_questions }
  
POST /api/cds/goal/refine
  Request: { draft_id, human_answers: { q1, q2, ... } }
  Response: { core_refined, next_questions_or_scope_phase }
  
GET /api/cds/goal/recommendations
  Request: { goal_type: string }
  Response: { bundles: [{ bundle_id, reasoning_text, reasoning_visual }] }
  
POST /api/cds/goal/create
  Request: { core, scope, bundle_assignment }
  Response: { goal_id, decision_log_entry }
  
GET /api/cds/participants
  Response: { participants: [ParticipantProfile] }
  
POST /api/cds/participant/update
  Request: { participant_id, updated_fields }
  Response: { participant_profile, audit_entry }
  
GET /api/cds/bundles
  Response: { bundles: [BundleDefinition] }
  
POST /api/cds/bundle/create-or-update
  Request: { bundle_data }
  Response: { bundle_id, schema_checksum }
  
POST /api/cds/bundle/wire-to-goal-type
  Request: { bundle_id, goal_type, priority }
  Response: { wiring_created, affected_bundles }
  
GET /api/cds/goal/auto-adjust-candidates
  Request: {}
  Response: { candidates: [{ participant_id, load, timer_status }] }
  
POST /api/cds/goal/auto-adjust
  Request: { participant_id, action }
  Response: { adjustment_made, affected_goals }
```

---

### AI-Guided Goal Refinement (Backend, Internal)

```
Step 1: INITIAL ANALYSIS
Input: User's draft description
Process:
  - Extract entities (problems, solutions, constraints)
  - Identify missing core elements (why, what, how)
  - Suggest goal type based on keywords
  - Formulate clarifying questions

Output: 
  {
    identified_elements: { problem, solution, constraints },
    missing_elements: [ "timeline", "budget" ],
    suggested_goal_type: "performance_optimization",
    clarifying_questions: [ "What's the business impact?", ... ]
  }

Step 2: HUMAN ANSWERS REFINEMENT
Input: Answers to clarifying questions
Process:
  - Validate answers against core requirements
  - Check for contradictions
  - Suggest refinements if vague
  - Lock core when sufficient clarity achieved

Output:
  {
    core: {
      problem_statement: "...",
      root_cause: "...",
      solution_approach: "...",
      business_impact: "...",
      success_criteria: "..."
    },
    confidence_level: 0.95,
    ready_for_scope: true
  }

Step 3: SCOPE PRESENTATION
Once core locked, present:
  - Timeline options (1 week, 2 weeks, 4 weeks, ongoing)
  - Budget (if applicable)
  - Recommended goal type from schema
  - Recommended bundle(s) with reasoning
```

---

## PART 4: FRONTEND ARCHITECTURE

### Three Main Pages

**Page 1: Goal Definition Wizard**
- Conversational interface
- Step 1: Initial draft input
- Step 2: AI asks clarifying questions (show analysis)
- Step 3: Confirm core or iterate
- Step 4: Scope settings
- Step 5: Bundle recommendation + selection
- Step 6: Review & create

**Page 2: Participant Management Dashboard**
- Table of all participants
- Edit capability profile (strengths, weaknesses, efficiency, SLA)
- Send uniform prompt to each participant
- Auto-adjust timer settings
- Capacity warnings
- Edit/archive participant

**Page 3: Bundle Configuration**
- Create/edit/delete bundles
- Select participants (checkboxes)
- Wire to goal types (multi-select)
- Mark as DEFAULT for specific goal type
- Show impact (matching matrix)
- Preview recommendation reasoning

---

## PART 5: RECOMMENDATION ENGINE (Text + Visual)

### Text Reasoning

```
Example output:
"Your goal 'Improve API performance' is classified as 
performance_optimization. This requires both optimization expertise 
(CSP specialty) and architectural insight (CSPS specialty).

Recommended bundle: 'Performance & Architecture' [CSP, CSPS]

Reasoning:
- CSP brings: API design expertise, database optimization skills, 
  strong performance testing background
- CSPS brings: System architecture perspective, infrastructure knowledge,
  scalability experience
- Timeline: Both have capacity for 4-week project
- Load impact: CSP at 3/5 (medium), CSPS at 1/3 (very available)

Alternative options:
- 'Full Team' [CSP, CSPS, Base44, Lovable]: More perspectives, longer timeline
- 'Quick Turnaround' [CSP]: Faster, narrower scope"
```

### Visual Reasoning (Matching Matrix)

```
Goal Requirements vs Participant Strengths:

                    CSP    CSPS   Base44  Lovable
API Performance     ████   ███                    (CSP best match)
Database Optim.     ████   ██                    (CSP best match)
Architecture        ██     ████                  (CSPS best match)
System Design       ██     ████                  (CSPS best match)
─────────────────────────────────────────────────
MATCH SCORE         85%    80%    20%     15%

Current Load:       3/5    1/3    2/4     4/5
Recommendation:     ✓      ✓      ✗       ✗

Bundle Performance & Architecture = 85% + 80% = OPTIMAL
```

---

## PART 6: INTEGRATION WITH PHASE 0

### Decision Log Entry

When goal created:

```json
{
  "decision_id": "DECISION-260706-001",
  "decision_type": "GOAL_CREATION",
  "actor_id": "admin_001",
  "description": "Created goal 'Improve API Performance' with bundle assignment",
  "timestamp": 1688908800000,
  "metadata": {
    "goal_id": "GOAL-260706-001",
    "goal_type": "SCHEMA-GOAL-PERF-001",
    "bundle_id": "SCHEMA-BUNDLE-PERF-ARCH-001",
    "participants": ["SCHEMA-PART-CSP-001", "SCHEMA-PART-CSPS-001"],
    "schema_checksum": "abc123def456..."
  },
  "decision_hash": "...",
  "previous_hash": "..."
}
```

### Schema Checksum Validation

- Every goal creation triggers schema checksum calculation
- Validates: goal_type exists, bundle exists, participants exist
- Detects orphaned references
- Prevents invalid goal-bundle-participant combinations

### Authority Matrix

- Only ADMIN tier can create goals
- INNER_CIRCLE can view/propose (not create)
- TRUSTED can view assigned bundles only
- EXTERNAL cannot access

---

## PART 7: SCOPE LAYERS

### CORE (Build Now)
- ✅ Goal definition wizard (AI-guided refinement via backend API)
- ✅ Participant dashboard (manual entry + uniform prompt)
- ✅ Bundle configuration (create/edit/delete, wire to goal types)
- ✅ Recommendation engine (text + visual reasoning)
- ✅ Schema alignment (checksum, orphan prevention)
- ✅ Decision log integration (immutable audit)
- ✅ Permission gating (admin-only creation)

### SCOPE LAYER 1 (Activate When Ready)
- Auto-adjust timer logic (warn vs auto-adjust)
- Load balancing suggestions ("Bundle full, adjust timeline?")
- Participant self-service (send uniform prompt, they fill profile)
- Advanced matching algorithm (multi-factor matching)

### SCOPE LAYER 2+ (Park for Future)
- ML-based bundle optimization (learn which bundles work best)
- Predictive recommendations (predict goal type from draft)
- Dynamic bundle creation (system suggests new bundles)
- Cross-goal pattern learning

---

## STATUS

**READY FOR FRONTEND BUILD**

All systems aligned to:
- ✅ Platform Attitude doctrine
- ✅ Canonical schema vocabulary
- ✅ Hierarchy preservation
- ✅ Option points identified
- ✅ Scopes labeled
- ✅ Integration with Phase 0 defined

**Next:** Frontend implementation + working prototype

---

**Authority:** CDS Orchestrator  
**Approved by:** Yariv Fink (pending)  
**Date:** 2026-07-06

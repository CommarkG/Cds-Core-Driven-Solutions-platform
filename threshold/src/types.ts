/**
 * CDS Phase 0 — Threshold Types
 * Source: 0210 (ICE) + 0220 (Gate) + Yariv amendments (any input, NEED_CLARIFICATION, tiers)
 * Status: DRAFT — RATIFICATION PENDING (CS-GOV-001 ratified 2026-07-02, bootstrap exception)
 */

// =============================================================================
// ACTOR & SOURCE — Who is submitting (0220 Source Paths + Tier/Permission layer)
// =============================================================================

export type ActorKind =
  | 'governor'           // Platform Governor (Yariv Fink) — full authority
  | 'developer'          // Authenticated developer — element/protocol submissions
  | 'external_user'      // Human user without developer auth
  | 'tenant_admin'       // Tenant SaaS administrator
  | 'system_agent';      // Internal AI agent (AG-[DOMAIN]-[SEQUENCE] verified)

export type SourcePath =
  | 'human_user'         // Path 1 — interactive ICE wizard
  | 'developer'          // Path 2 — developer-authenticated interactive wizard
  | 'external_ai'        // Path 3 — structured API payload (POST /gate/external-ai)
  | 'tenant_api'         // Path 4 — tenant REST API call
  | 'internal_agent'     // Path 5 — COM-4 format internal agent
  | 'internal';          // S345: Internal API calls (phase endpoints)

// Tier clearance — what actions are permitted at each level
export type TierLevel = 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3';

export interface ActorContext {
  actor_kind: ActorKind;
  source_path: SourcePath;
  tier: TierLevel;
  identity: string;          // human name | AG-ID | tenant API key hash | external system ID
  session_id?: string;       // CDS session reference
  goal_ref?: string;         // GOV-[YEAR]-GOAL-[SEQUENCE] — required for build path
  agent_registry_id?: string; // AG-[DOMAIN]-[SEQUENCE] — required for internal_agent path
  tenant_id?: string;        // Required for tenant_api path
}

// =============================================================================
// ICE — Intake Classification Engine (0210)
// =============================================================================

// Q1 — 8 input types
export type InputType =
  | 'goal'            // Felt need seeking a resolution signal
  | 'element'         // Discrete platform component requiring schema placement
  | 'finding'         // Structural gap, misalignment, or insight
  | 'obligation'      // Open accountability item
  | 'improvement'     // Confirmed fix to existing element
  | 'insight'         // Learning extracted from an event
  | 'external_input'  // Content from outside platform boundary
  | 'unknown';        // Cannot be classified — HELD

// Q2 — Corespine families
export type CorespineGroup =
  | 'CS-META'
  | 'CS-GOVERNANCE'
  | 'CS-STRUCTURE'
  | 'CS-INTELLIGENCE'
  | 'CS-AI'
  | 'CS-OPERATIONS'
  | 'multi-family';

// Q3 — Classification confidence
export type ClassificationConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

// Q4 — Status (from CDS-STATUS-LIBRARY-001)
export type AssignedStatus =
  | 'PENDING'                  // Goal awaiting ratification
  | 'DRAFT'                    // Element in progress
  | 'CANDIDATE'                // Finding/Insight awaiting assessment
  | 'OPEN'                     // Obligation requiring action
  | 'PENDING-PROPAGATION'      // Improvement awaiting propagation
  | 'QUARANTINE'               // External input — must cleanse first
  | 'HELD'                     // Unknown — returned with guidance
  | 'NEED_CLARIFICATION';      // Received but more info required (Yariv amendment)

// Auto-applied tags per input type (Q3)
export const AUTO_TAGS: Record<InputType, string[]> = {
  goal:           ['GOAL', 'BUILD', 'RATIFICATION-REQUIRED'],
  element:        ['DRAFT', 'PIPELINE'],
  finding:        ['CANDIDATE'],
  obligation:     ['OPEN'],
  improvement:    ['PENDING-PROPAGATION', 'IMPROVEMENT'],
  insight:        ['CANDIDATE'],
  external_input: ['QUARANTINE', 'EXTERNAL'],
  unknown:        ['HELD', 'UNCLASSIFIED'],
};

// Default status per input type (Q4)
export const DEFAULT_STATUS: Record<InputType, AssignedStatus> = {
  goal:           'PENDING',
  element:        'DRAFT',
  finding:        'CANDIDATE',
  obligation:     'OPEN',
  improvement:    'PENDING-PROPAGATION',
  insight:        'CANDIDATE',
  external_input: 'QUARANTINE',
  unknown:        'HELD',
};

// Primary routing per input type (Q5)
export const PRIMARY_ROUTING: Record<InputType, string> = {
  goal:           'Governor Decision Queue — goal ratification ceremony',
  element:        'Schema Placement Queue — Leg 1 of Build Initiation Protocol',
  finding:        'GPOW Insight Registry — INS-[PHASE]-[SEQUENCE] entry',
  obligation:     'Accountability Registry — OBL-[TYPE]-[SEQUENCE] entry',
  improvement:    'Dynamic Completion Vault — DC-[YEAR]-[SEQUENCE] entry',
  insight:        'Intelligence Vault — IV-[CLASS]-[SEQUENCE] entry',
  external_input: 'Quarantine Buffer — QBF-[SOURCE]-[DATE] entry',
  unknown:        'HELD Queue — returned to sender with classification guidance',
};

// =============================================================================
// UNIVERSAL INPUT — Any content type (Yariv amendment)
// =============================================================================

export type RawContentFormat =
  | 'plain_text'         // Free-form text entry
  | 'json_payload'       // Structured JSON (API path, developer path)
  | 'document_paste'     // Document content pasted into gate
  | 'form_fields'        // Gate UI form submission
  | 'com4_format'        // Internal agent COM-4 format
  | 'external_api';      // External AI structured payload (POST /gate/external-ai)

export interface RawInput {
  format: RawContentFormat;
  content: string;                    // Raw content as received
  content_type_hint?: string;         // MIME type if declared
  structured_fields?: Record<string, unknown>; // Pre-parsed fields if available
}

// =============================================================================
// AUTH CONTEXT — set by authMiddleware on successful authentication
// Lives in res.locals['actor'] for the duration of the request.
// Phase 0: single CDS_API_KEY → governor tier. Phase 0.5: key registry.
// =============================================================================

export interface AuthContext {
  actor_kind: ActorKind;
  tier: TierLevel;
  identity: string;
  authenticated: true;   // always true when this object exists in res.locals
}

// =============================================================================
// GATE RULE ENFORCEMENT (0220 — 6 Mechanical Rules)
// =============================================================================

export type RuleId =
  | 'RULE-GOAL'    // No build without ratified goal
  | 'RULE-RAT'     // No unratified constitutional element activation
  | 'RULE-CLASS'   // No unclassified input reaches native AI
  | 'RULE-QUAR'    // No external content without quarantine
  | 'RULE-VOC'     // No unregistered vocabulary in constitutional elements
  | 'RULE-PARK'    // No new Swift Implementation at Forced Escalation
  | 'RULE-PLAN-SYNTAX-VALIDATION'  // S345: Plan structure, depth, R1-R8 validation
  | 'RULE-AUDIT-GATE-MANDATORY';   // S345: Phase cannot start without prior audit complete

// HELD = vocabulary not yet ratified — not a hard block, a governance hold pending ratification
// FAIL = hard block (produces BLOCKED classification)
export type RuleOutcome = 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | 'HELD';

export interface RuleResult {
  rule_id: RuleId;
  outcome: RuleOutcome;
  detail: string;
  // For HELD outcomes: what is required to clear the hold
  held_reason?: string;
  held_resolution?: string;
}

// =============================================================================
// TIER 2 GATES — AUDIT ENFORCEMENT
// =============================================================================

export type AuditStatus = 'OPEN' | 'ZF_COMPLETE' | 'FINDINGS_OPEN' | 'HELD' | 'CORRUPTED';
export type AgentKind = 'haiku' | 'sonnet' | 'opus' | 'human';

export interface AuditRecord {
  audit_id: string;        // UUID
  phase: number;
  decision_ref: string;    // hash of decision
  agent: AgentKind;
  audit_status: AuditStatus;
  findings_count: number;
  findings_open: number;
  held_by?: string;        // Governor id
  hold_reason?: string;
  opened_at: string;       // ISO timestamp
  closed_at?: string;      // ISO timestamp
  checksum: string;        // SHA256 integrity
}

// =============================================================================
// CLASSIFICATION OUTPUTS
// =============================================================================

export type ClassificationResult =
  | 'CLASSIFIED'          // All applicable rules PASS — enters platform
  | 'BLOCKED'             // Hard rule failure — cannot proceed, must resolve
  | 'QUARANTINE'          // External content — cleanse before activation
  | 'HELD'                // Unknown type — returned with guidance
  | 'NEED_CLARIFICATION'; // Received, but more info required (Yariv amendment)

// =============================================================================
// CLASSIFICATION RECORD (CR-[YYMMDD]-[SEQ])
// =============================================================================

export interface ClassificationRecord {
  // Identity
  cr_id: string;                          // CR-YYMMDD-NNN — unique, never reused
  wizard_session_id: string;

  // Timing
  input_received_at: string;              // ISO8601
  classified_at: string;                  // ISO8601
  injected_to_ai_at?: string;            // ISO8601 — populated when AI session opens

  // Source
  source_path: SourcePath;
  actor_kind: ActorKind;
  actor_identity: string;
  tier: TierLevel;
  goal_ref: string | null;               // GOV-[YEAR]-GOAL-[SEQUENCE] if provided

  // Raw input
  raw_input_format: RawContentFormat;
  raw_input_summary: string;              // One sentence describing what arrived

  // ICE answers (Q1-Q5)
  q1_type: InputType;
  q2_corespine_families: string[];
  q3_tags: string[];
  q4_status: AssignedStatus;
  q5_routing_primary: string;
  q5_routing_secondary: string | null;

  // Classification outcome
  classification_result: ClassificationResult;
  classification_confidence: ClassificationConfidence;
  rules_applied: RuleResult[];

  // NEED_CLARIFICATION specific
  clarification_required?: boolean;
  clarification_question?: string;

  // Next action
  next_action: string;

  // Structured artifact (injected to native AI — Layer 1 of context bundle)
  injected_artifact?: InjectedArtifact;
}

// Context bundle injected into native AI session (0220 Section 5)
export interface InjectedArtifact {
  classification_record: ClassificationRecord;
  platform_dna: {
    corespine_references: string[];
    ratification_states: Record<string, string>;
    vocabulary_alignment: Record<string, string>;
  };
  governing_rules: string[];              // Protocol document IDs that govern this type
  active_goal: string | null;
  priority_assessment: {
    p1: number; p2: number; p3: number; p4: number;
  };
  output_contract: {
    required_format: string;
    required_fields: string[];
    depth: 'CORE' | 'MEDIUM' | 'FULL';
    routing_after: string;
  };
}

// =============================================================================
// API SHAPES
// =============================================================================

// POST /api/classify — accepts any format
export interface ClassifyRequest {
  actor: ActorContext;
  raw_input: RawInput;
  // Optional pre-declared fields (for developer/API paths)
  declared_type?: InputType;
  declared_corespines?: string[];
  template_id?: string;          // For external AI path — COM-5 EXT-* template ID
}

export interface ClassifyResponse {
  ok: boolean;
  cr_id?: string;
  classification_result?: ClassificationResult;
  classification_record?: ClassificationRecord;
  error?: string;
  detail?: string;
  // For NEED_CLARIFICATION
  clarification_question?: string;
  // For BLOCKED — what rule failed
  blocking_rule?: RuleId;
  blocking_detail?: string;
}

// POST /api/clarify — respond to a NEED_CLARIFICATION
export interface ClarifyRequest {
  cr_id: string;            // The CR that is awaiting clarification
  actor: ActorContext;
  clarification_response: string;
}

// Governor dashboard query
export interface DashboardQuery {
  limit?: number;
  offset?: number;
  result_filter?: ClassificationResult;
  source_filter?: SourcePath;
  since?: string;           // ISO8601
}

export interface DashboardRecord {
  cr_id: string;
  classified_at: string;
  source_path: SourcePath;
  actor_kind: ActorKind;
  q1_type: InputType;
  classification_result: ClassificationResult;
  classification_confidence: ClassificationConfidence;
  q4_status: AssignedStatus;
  q5_routing_primary: string;
  raw_input_summary: string;
  rules_applied: RuleResult[];
}

export interface DashboardResponse {
  records: DashboardRecord[];
  total: number;
  stats: {
    by_result: Record<string, number>;
    by_type: Record<string, number>;
    by_source: Record<string, number>;
    blocking_rules_fired: Record<string, number>;
  };
}

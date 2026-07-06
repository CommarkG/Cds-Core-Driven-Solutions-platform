/**
 * CDS PHASE 0 — Task 0.4: ConflictRecord Schema
 * Immutable conflict detection and escalation tracking
 *
 * Purpose: Every conflict is a DecisionNode. Every conflict has bidirectional
 * links to the decisions/glossary entries/capabilities that created it.
 * Prevents conflicts from accumulating unnoticed (Mode 3 prevention).
 *
 * Status: P0 BLOCKER (Week 1-2, Day 5)
 */

export type ConflictType =
  | 'GLOSSARY'        // Two platforms define same term differently
  | 'CAPABILITY'      // Same capability submitted with conflicting specs
  | 'PRIORITY'        // Priority conflict between capabilities
  | 'TRUST_TIER'      // Trust tier demotion / permission mismatch
  | 'AUTHORITY'       // Authority matrix inconsistency
  | 'SCHEMA_NODE';    // Schema node mapping conflict

export type ConflictStatus =
  | 'OPEN'            // Just created, waiting for CDS triage
  | 'TRIAGE'          // CDS is analyzing
  | 'ESCALATED'       // Sent to Yariv for decision
  | 'RESOLVED';       // Decision made and implemented

export interface ConflictParty {
  platform_id?: string;                // Platform involved (optional - could be internal)
  actor_id?: string;                   // Specific actor if not platform-wide
  description: string;                 // What they want / their position
}

export interface TriageAction {
  action_type: 'QUESTION' | 'ANALYSIS' | 'PROPOSAL' | 'ESCALATION';
  by: string;                          // 'cds' or 'yariv'
  at: Date;
  content: string;                     // The question, analysis, or proposal
  outcome?: string;                    // Result if known
}

export interface ConflictRecord {
  // Identity
  conflict_id: string;                 // CONFLICT-{YYYYMMDD}-{SEQ}
  type: ConflictType;

  // Content
  description: string;                 // Clear statement of the conflict (1-2 paragraphs)
  context?: string;                    // Background that led to this conflict
  parties: ConflictParty[];            // Who is involved

  // Timeline
  detected_at: Date;                   // Day 0 (when conflict first created)
  detected_by: 'SYSTEM_AUTO' | 'PLATFORM_REPORTED' | 'YARIV_ESCALATION';

  // Triage Phase
  triage_status: ConflictStatus;       // OPEN, TRIAGE, ESCALATED, RESOLVED
  triage_log: TriageAction[];          // Every CDS action logged here
  triage_started_at?: Date;            // When CDS began analysis
  triage_deadline: Date;               // Auto-escalate if not triaged by Day 7

  // Escalation to Yariv
  escalated_at?: Date;                 // When sent to Yariv
  escalation_reason?: string;          // Why CDS could not resolve

  // Resolution
  resolution_status?: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  yariv_decision?: string;             // Yariv's decision (FINAL)
  resolved_at?: Date;
  resolution_summary?: string;         // How the conflict was resolved

  // Linking (bidirectional)
  linked_decision_ids: string[];       // DecisionNodes created from this conflict
  referenced_glossary_terms: string[]; // GlossaryEntry IDs involved
  referenced_capabilities: string[];   // CapabilityEntry IDs involved
  related_conflicts: string[];         // Other conflicts this relates to
}

/**
 * In-memory conflict store with bidirectional indexing
 */
export class ConflictStore {
  private conflicts: Map<string, ConflictRecord> = new Map();
  private sequenceCounter: number = 0;

  // Bidirectional indexes
  private decisionToConflicts: Map<string, Set<string>> = new Map();  // decision_id → conflict_ids
  private glossaryToConflicts: Map<string, Set<string>> = new Map();  // term_id → conflict_ids
  private capabilityToConflicts: Map<string, Set<string>> = new Map(); // capability_id → conflict_ids
  private platformToConflicts: Map<string, Set<string>> = new Map();  // platform_id → conflict_ids

  /**
   * Create a new conflict
   */
  createConflict(record: Omit<ConflictRecord, 'conflict_id' | 'triage_log' | 'triage_status' | 'triage_deadline'>): ConflictRecord {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.sequenceCounter++;
    const conflict_id = `CONFLICT-${today}-${String(this.sequenceCounter).padStart(3, '0')}`;

    // Auto-calculate deadline (7 days from detection)
    const triage_deadline = new Date(record.detected_at);
    triage_deadline.setDate(triage_deadline.getDate() + 7);

    const complete: ConflictRecord = {
      ...record,
      conflict_id,
      triage_status: 'OPEN',
      triage_log: [],
      triage_deadline,
    };

    // Store conflict
    this.conflicts.set(conflict_id, complete);

    // Add to bidirectional indexes
    for (const decision_id of record.linked_decision_ids) {
      if (!this.decisionToConflicts.has(decision_id)) {
        this.decisionToConflicts.set(decision_id, new Set());
      }
      this.decisionToConflicts.get(decision_id)!.add(conflict_id);
    }

    for (const term_id of record.referenced_glossary_terms) {
      if (!this.glossaryToConflicts.has(term_id)) {
        this.glossaryToConflicts.set(term_id, new Set());
      }
      this.glossaryToConflicts.get(term_id)!.add(conflict_id);
    }

    for (const cap_id of record.referenced_capabilities) {
      if (!this.capabilityToConflicts.has(cap_id)) {
        this.capabilityToConflicts.set(cap_id, new Set());
      }
      this.capabilityToConflicts.get(cap_id)!.add(conflict_id);
    }

    for (const party of record.parties) {
      if (party.platform_id) {
        if (!this.platformToConflicts.has(party.platform_id)) {
          this.platformToConflicts.set(party.platform_id, new Set());
        }
        this.platformToConflicts.get(party.platform_id)!.add(conflict_id);
      }
    }

    return complete;
  }

  /**
   * Add a triage action to a conflict
   */
  addTriageAction(conflict_id: string, action: TriageAction): void {
    const conflict = this.conflicts.get(conflict_id);
    if (!conflict) {
      throw new Error(`Conflict ${conflict_id} not found`);
    }

    conflict.triage_log.push(action);
    if (!conflict.triage_started_at) {
      conflict.triage_started_at = new Date();
    }

    // If this is an escalation, update status
    if (action.action_type === 'ESCALATION') {
      conflict.triage_status = 'ESCALATED';
      conflict.escalated_at = new Date();
    }
  }

  /**
   * Resolve a conflict (typically by Yariv)
   */
  resolveConflict(
    conflict_id: string,
    yariv_decision: string,
    resolution_status: 'APPROVED' | 'MODIFIED' | 'REJECTED'
  ): void {
    const conflict = this.conflicts.get(conflict_id);
    if (!conflict) {
      throw new Error(`Conflict ${conflict_id} not found`);
    }

    conflict.triage_status = 'RESOLVED';
    conflict.yariv_decision = yariv_decision;
    conflict.resolution_status = resolution_status;
    conflict.resolved_at = new Date();
  }

  /**
   * Get all conflicts affecting a decision
   */
  getConflictsByDecision(decision_id: string): ConflictRecord[] {
    const conflict_ids = this.decisionToConflicts.get(decision_id) || new Set();
    return Array.from(conflict_ids).map(id => this.conflicts.get(id)!).filter(c => c);
  }

  /**
   * Get all conflicts affecting a glossary term
   */
  getConflictsByGlossary(term_id: string): ConflictRecord[] {
    const conflict_ids = this.glossaryToConflicts.get(term_id) || new Set();
    return Array.from(conflict_ids).map(id => this.conflicts.get(id)!).filter(c => c);
  }

  /**
   * Get all conflicts involving a platform
   */
  getConflictsByPlatform(platform_id: string): ConflictRecord[] {
    const conflict_ids = this.platformToConflicts.get(platform_id) || new Set();
    return Array.from(conflict_ids).map(id => this.conflicts.get(id)!).filter(c => c);
  }

  /**
   * Find conflicts nearing auto-escalation deadline (> 7 days in TRIAGE)
   */
  findOverdueConflicts(): ConflictRecord[] {
    const now = new Date();
    return Array.from(this.conflicts.values()).filter(
      conflict => conflict.triage_status === 'TRIAGE' && now > conflict.triage_deadline
    );
  }

  /**
   * Get a specific conflict
   */
  getConflict(conflict_id: string): ConflictRecord | null {
    return this.conflicts.get(conflict_id) || null;
  }

  /**
   * List all unresolved conflicts
   */
  getUnresolvedConflicts(): ConflictRecord[] {
    return Array.from(this.conflicts.values()).filter(
      c => c.triage_status !== 'RESOLVED'
    );
  }
}

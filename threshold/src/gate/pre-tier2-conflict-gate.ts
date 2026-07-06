/**
 * CDS PHASE 0 — Task 0.5: Pre-Tier2 Conflict Re-Analysis Gate
 * Detect new conflicts before Tier 2 execution begins
 *
 * Purpose: Before a decision executes at Tier 2, re-run conflict analysis.
 * If new conflicts appear that weren't in Tier 1 analysis, HALT and escalate.
 * Prevents context overflow (Mode 3) and unnoticed conflicts.
 *
 * Status: P0 BLOCKER (Week 1-2, Day 8)
 */

import { ConflictStore, ConflictRecord } from '../schemas/conflict-record';

export interface Tier1Analysis {
  decision_id: string;
  analyzed_at: Date;
  known_conflicts: string[];          // conflict_ids known at Tier 1 approval
  conflict_count: number;
  analysis_window_end: Date;           // 1 hour after analysis (grace window)
}

export interface PreTier2CheckResult {
  approved: boolean;
  reason: string;
  new_conflicts_detected: ConflictRecord[];
  escalation_required: boolean;
  escalation_reason?: string;
}

export class PreTier2Gate {
  private conflictStore: ConflictStore;
  private tier1Analyses: Map<string, Tier1Analysis> = new Map();

  constructor(conflictStore: ConflictStore) {
    this.conflictStore = conflictStore;
  }

  /**
   * Record Tier 1 approval analysis
   * Called when a decision is approved at Tier 1
   */
  recordTier1Analysis(decision_id: string, knownConflictIds: string[]): void {
    const analysis: Tier1Analysis = {
      decision_id,
      analyzed_at: new Date(),
      known_conflicts: knownConflictIds,
      conflict_count: knownConflictIds.length,
      analysis_window_end: new Date(Date.now() + 3600000), // 1 hour grace window
    };

    this.tier1Analyses.set(decision_id, analysis);
  }

  /**
   * Execute pre-Tier 2 conflict gate
   * Called before Tier 2 execution begins
   *
   * Returns: approved=true if safe to proceed, false if new conflicts detected
   */
  checkPreTier2(decision_id: string): PreTier2CheckResult {
    // Step 1: Retrieve the Tier 1 analysis
    const tier1 = this.tier1Analyses.get(decision_id);
    if (!tier1) {
      return {
        approved: false,
        reason: 'NO_TIER1_ANALYSIS',
        new_conflicts_detected: [],
        escalation_required: true,
        escalation_reason: 'Decision ${decision_id} has no Tier 1 analysis record',
      };
    }

    // Step 2: Check if still within grace window (within 1 hour of Tier 1 approval)
    const now = new Date();
    if (now > tier1.analysis_window_end) {
      // Outside grace window - re-run full analysis (conservative approach)
      return this.runFullConflictReanalysis(decision_id, tier1);
    }

    // Step 3: Get current conflicts for this decision
    const currentConflicts = this.conflictStore.getConflictsByDecision(decision_id);
    const currentConflictIds = currentConflicts.map(c => c.conflict_id);

    // Step 4: Detect NEW conflicts (conflicts not in Tier 1 analysis)
    const newConflictIds = currentConflictIds.filter(
      id => !tier1.known_conflicts.includes(id)
    );

    // Step 5: If new conflicts detected, HALT and escalate
    if (newConflictIds.length > 0) {
      const newConflicts = newConflictIds
        .map(id => this.conflictStore.getConflict(id))
        .filter((c): c is ConflictRecord => c !== null);

      return {
        approved: false,
        reason: 'NEW_CONFLICTS_DETECTED',
        new_conflicts_detected: newConflicts,
        escalation_required: true,
        escalation_reason: `${newConflictIds.length} new conflict(s) detected since Tier 1 approval. Escalating to Yariv.`,
      };
    }

    // Step 6: All conflicts from Tier 1 still present, none new - safe to proceed
    return {
      approved: true,
      reason: 'NO_NEW_CONFLICTS',
      new_conflicts_detected: [],
      escalation_required: false,
    };
  }

  /**
   * Full re-analysis for decisions outside grace window
   * Conservative: assume any conflict change requires escalation
   */
  private runFullConflictReanalysis(
    decision_id: string,
    tier1: Tier1Analysis
  ): PreTier2CheckResult {
    const currentConflicts = this.conflictStore.getConflictsByDecision(decision_id);

    // Check if any conflict status changed or new ones appeared
    const currentConflictIds = currentConflicts.map(c => c.conflict_id);
    const tier1ConflictIds = tier1.known_conflicts;

    const newConflictIds = currentConflictIds.filter(id => !tier1ConflictIds.includes(id));
    const resolvedConflictIds = tier1ConflictIds.filter(id => !currentConflictIds.includes(id));
    const changedStatuses = currentConflicts.filter(c => {
      // If any conflict escalated or resolved status changed, requires re-analysis
      return c.triage_status !== 'OPEN'; // Assume Tier 1 saw all as OPEN
    });

    if (newConflictIds.length > 0 || resolvedConflictIds.length > 0 || changedStatuses.length > 0) {
      return {
        approved: false,
        reason: 'REANALYSIS_REQUIRED',
        new_conflicts_detected: newConflictIds
          .map(id => this.conflictStore.getConflict(id))
          .filter((c): c is ConflictRecord => c !== null),
        escalation_required: true,
        escalation_reason: `Outside 1-hour grace window. Conflict state changed (${newConflictIds.length} new, ${resolvedConflictIds.length} resolved, ${changedStatuses.length} status changes). Full re-analysis required.`,
      };
    }

    return {
      approved: true,
      reason: 'REANALYSIS_COMPLETE_NO_CHANGES',
      new_conflicts_detected: [],
      escalation_required: false,
    };
  }

  /**
   * Get the Tier 1 analysis for a decision (for audit trail)
   */
  getTier1Analysis(decision_id: string): Tier1Analysis | null {
    return this.tier1Analyses.get(decision_id) || null;
  }

  /**
   * Clear expired Tier 1 analyses (older than 7 days)
   */
  cleanupExpiredAnalyses(): number {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [decision_id, analysis] of this.tier1Analyses.entries()) {
      if (analysis.analyzed_at < sevenDaysAgo) {
        this.tier1Analyses.delete(decision_id);
        cleaned++;
      }
    }

    return cleaned;
  }
}

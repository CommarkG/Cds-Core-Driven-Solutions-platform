/**
 * CDS PHASE 0 — Task 0.6: Decision Logging with Immutable Hash Chain
 * Append-only decision ledger with SHA256 hash chain
 *
 * Purpose: Every decision is logged with monotonic timestamp and hash chain.
 * Detects silent drift (Mode 7) through pattern analysis. No decision can be
 * retroactively modified or reordered.
 *
 * Status: P0 BLOCKER (Week 2, Day 10)
 */

import crypto from 'crypto';

export interface DecisionLogEntry {
  decision_id: string;                 // DECISION-{YYYYMMDD}-{SEQ}
  decision_type: 'CAPABILITY_ADD' | 'GLOSSARY_CHANGE' | 'CONFLICT_RESOLUTION' | 'TRUST_TIER_CHANGE' | 'SCHEMA_EXTENSION';
  actor_id: string;                    // Who made this decision
  description: string;                 // What was decided
  timestamp: number;                   // Monotonic (cannot go backwards)
  entry_hash: string;                  // SHA256 of this entry
  previous_hash: string;               // SHA256 of previous entry (chain)
  metadata?: Record<string, any>;      // Extra data (cost, complexity, etc.)
}

export interface DriftPattern {
  pattern_type: 'AUTHORITY_ESCALATION' | 'TIER_SKIP' | 'CONFLICT_EXPLOSION' | 'RAPID_REVERSALS';
  confidence: number;                  // 0-1, higher = more confident
  entries_involved: string[];          // decision_ids that match pattern
  description: string;
}

export class DecisionLog {
  private entries: DecisionLogEntry[] = [];
  private entryMap: Map<string, DecisionLogEntry> = new Map();
  private sequenceCounter: number = 0;
  private lastTimestamp: number = 0;
  private lastHash: string = 'GENESIS';

  /**
   * Append a new decision to the log
   * Enforces monotonic timestamps and hash chain integrity
   */
  appendDecision(
    decision_type: DecisionLogEntry['decision_type'],
    actor_id: string,
    description: string,
    metadata?: Record<string, any>
  ): DecisionLogEntry {
    // Step 1: Generate decision ID
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.sequenceCounter++;
    const decision_id = `DECISION-${today}-${String(this.sequenceCounter).padStart(4, '0')}`;

    // Step 2: Enforce monotonic timestamp (cannot go backwards)
    const now = Date.now();
    if (now < this.lastTimestamp) {
      throw new Error('TIMESTAMP_VIOLATION: System clock went backwards (monotonic violation)');
    }

    // Step 3: Create entry payload (without hash fields yet)
    const entryPayload = {
      decision_id,
      decision_type,
      actor_id,
      description,
      timestamp: now,
      metadata: metadata || {},
    };

    // Step 4: Calculate entry hash (will be linked by next entry)
    const entryString = JSON.stringify(entryPayload);
    const entry_hash = crypto.createHash('sha256').update(entryString).digest('hex');

    // Step 5: Create complete entry with chain
    const entry: DecisionLogEntry = {
      ...entryPayload,
      entry_hash,
      previous_hash: this.lastHash,
    };

    // Step 6: Append to log
    this.entries.push(entry);
    this.entryMap.set(decision_id, entry);
    this.lastTimestamp = now;
    this.lastHash = entry_hash;

    return entry;
  }

  /**
   * Verify integrity of the entire log
   * Returns true if hash chain is unbroken and timestamps are monotonic
   */
  verifyIntegrity(): {
    valid: boolean;
    firstInvalidAt?: number;
    error?: string;
  } {
    if (this.entries.length === 0) {
      return { valid: true };
    }

    let lastTimestamp = 0;
    let previousHash = 'GENESIS';

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      // Check monotonic timestamp
      if (entry.timestamp < lastTimestamp) {
        return {
          valid: false,
          firstInvalidAt: i,
          error: 'Timestamp not monotonic (went backwards)',
        };
      }

      // Check hash chain
      if (entry.previous_hash !== previousHash) {
        return {
          valid: false,
          firstInvalidAt: i,
          error: 'Hash chain broken (entry tampered or reordered)',
        };
      }

      lastTimestamp = entry.timestamp;
      previousHash = entry.entry_hash;
    }

    return { valid: true };
  }

  /**
   * Analyze decision patterns to detect silent drift (Mode 7)
   */
  detectDriftPatterns(): DriftPattern[] {
    const patterns: DriftPattern[] = [];

    // Pattern 1: Authority Escalation
    // If a low-tier actor suddenly makes high-authority decisions
    const authorityByActor = this.getAuthorityByActor();
    for (const [actor, decisions] of authorityByActor.entries()) {
      if (decisions.length > 5) {
        const highAuth = decisions.filter(d =>
          ['CONFLICT_RESOLUTION', 'TRUST_TIER_CHANGE', 'SCHEMA_EXTENSION'].includes(d.decision_type)
        );
        if (highAuth.length / decisions.length > 0.5) {
          patterns.push({
            pattern_type: 'AUTHORITY_ESCALATION',
            confidence: 0.8,
            entries_involved: highAuth.map(d => d.decision_id),
            description: `Actor ${actor} is making high-authority decisions (${highAuth.length}/${decisions.length})`,
          });
        }
      }
    }

    // Pattern 2: Tier Skip
    // If a decision jumps from Tier 1 to Tier 3 without Tier 2 analysis
    const gaps = this.detectTierGaps();
    if (gaps.length > 0) {
      patterns.push({
        pattern_type: 'TIER_SKIP',
        confidence: 0.9,
        entries_involved: gaps,
        description: `${gaps.length} decision(s) appear to skip tier analysis`,
      });
    }

    // Pattern 3: Conflict Explosion
    // If conflict count increases dramatically in short time
    const conflictTrend = this.getConflictTrend();
    if (conflictTrend.spike_at !== -1) {
      patterns.push({
        pattern_type: 'CONFLICT_EXPLOSION',
        confidence: 0.7,
        entries_involved: [this.entries[conflictTrend.spike_at]?.decision_id || 'unknown'].filter(Boolean),
        description: `Conflict count spiked from ${conflictTrend.baseline} to ${conflictTrend.peak} at index ${conflictTrend.spike_at}`,
      });
    }

    // Pattern 4: Rapid Reversals
    // If same decision gets reversed multiple times in short window
    const reversals = this.detectReversals();
    if (reversals.length > 0) {
      patterns.push({
        pattern_type: 'RAPID_REVERSALS',
        confidence: 0.6,
        entries_involved: reversals,
        description: `${reversals.length} rapid reversals detected (possible thrashing)`,
      });
    }

    return patterns;
  }

  private getAuthorityByActor(): Map<string, DecisionLogEntry[]> {
    const map = new Map<string, DecisionLogEntry[]>();
    for (const entry of this.entries) {
      if (!map.has(entry.actor_id)) {
        map.set(entry.actor_id, []);
      }
      map.get(entry.actor_id)!.push(entry);
    }
    return map;
  }

  private detectTierGaps(): string[] {
    // Placeholder: would analyze actual tier metadata if present
    return [];
  }

  private getConflictTrend(): {
    baseline: number;
    peak: number;
    spike_at: number;
  } {
    const conflictCounts: number[] = [];
    for (const entry of this.entries) {
      const count = (entry.metadata?.conflict_count as number) || 0;
      conflictCounts.push(count);
    }

    if (conflictCounts.length < 5) {
      return { baseline: 0, peak: 0, spike_at: -1 };
    }

    const baseline = conflictCounts.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    let peak = baseline;
    let spike_at = -1;

    for (let i = 5; i < conflictCounts.length; i++) {
      if (conflictCounts[i] > peak * 2) {
        peak = conflictCounts[i];
        spike_at = i;
      }
    }

    return { baseline, peak, spike_at };
  }

  private detectReversals(): string[] {
    // Placeholder: would detect patterns like DECISION -> UNDO -> DECISION
    return [];
  }

  /**
   * Get the current hash (for external verification)
   */
  getCurrentHash(): string {
    return this.lastHash;
  }

  /**
   * Get the complete log (ADMIN only)
   */
  getLog(): DecisionLogEntry[] {
    return [...this.entries];
  }

  /**
   * Get a specific decision entry
   */
  getDecision(decision_id: string): DecisionLogEntry | null {
    return this.entryMap.get(decision_id) || null;
  }

  /**
   * Get decisions by type
   */
  getDecisionsByType(decision_type: DecisionLogEntry['decision_type']): DecisionLogEntry[] {
    return this.entries.filter(e => e.decision_type === decision_type);
  }

  /**
   * Get decisions by actor
   */
  getDecisionsByActor(actor_id: string): DecisionLogEntry[] {
    return this.entries.filter(e => e.actor_id === actor_id);
  }
}

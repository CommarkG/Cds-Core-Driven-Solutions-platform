/**
 * CDS PHASE 0 — Task 0.8: IterationRecord with Loop Bounds
 * Iteration cycle tracking and infinite loop prevention
 *
 * Purpose: Every cycle (consulting iteration, decision refinement loop, etc.)
 * is bounded. Prevents spinning/infinite loops (Mode 3). Detects when a cycle
 * is stuck and halts it.
 *
 * Status: P0 BLOCKER (Week 2, Day 12)
 */

export interface IterationRecord {
  iteration_id: string;                // ITER-{YYYYMMDD}-{SEQ}
  cycle_name: string;                  // Human-readable name
  started_at: Date;
  max_iterations: number;              // Hard limit on number of steps
  timeout_ms: number;                  // Hard limit on elapsed time
  iterations_completed: number;        // Completed so far
  started_by: string;                  // Actor ID
  status: 'ACTIVE' | 'COMPLETED' | 'HALTED_MAX_ITERATIONS' | 'HALTED_TIMEOUT' | 'HALTED_SPINNING';
  completed_at?: Date;
  halt_reason?: string;
  progress_entries: ProgressEntry[];   // Track progress through iterations
}

export interface ProgressEntry {
  iteration_num: number;               // 1, 2, 3, ...
  started_at: Date;
  completed_at: Date;
  outcome: string;                     // Brief description of outcome
  progress_delta: number;              // 0-100, how much progress was made
}

export class LoopBoundsGate {
  private activeIterations: Map<string, IterationRecord> = new Map();
  private completedIterations: Map<string, IterationRecord> = new Map();
  private iterationCounter: number = 0;
  private spinningDetectionWindow: number = 5; // Check last 5 iterations for spinning

  /**
   * Start a new iteration cycle
   */
  startIteration(
    cycle_name: string,
    started_by: string,
    max_iterations: number = 10,
    timeout_ms: number = 3600000 // 1 hour default
  ): IterationRecord {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.iterationCounter++;
    const iteration_id = `ITER-${today}-${String(this.iterationCounter).padStart(3, '0')}`;

    const record: IterationRecord = {
      iteration_id,
      cycle_name,
      started_at: new Date(),
      max_iterations,
      timeout_ms,
      iterations_completed: 0,
      started_by,
      status: 'ACTIVE',
      progress_entries: [],
    };

    this.activeIterations.set(iteration_id, record);
    return record;
  }

  /**
   * Record progress in an iteration (called after each step)
   */
  recordProgress(
    iteration_id: string,
    outcome: string,
    progress_delta: number
  ): { valid: boolean; halt_reason?: string } {
    const record = this.activeIterations.get(iteration_id);
    if (!record) {
      return { valid: false, halt_reason: `Iteration ${iteration_id} not found or already completed` };
    }

    // Check timeout
    const elapsed = new Date().getTime() - record.started_at.getTime();
    if (elapsed > record.timeout_ms) {
      record.status = 'HALTED_TIMEOUT';
      record.halt_reason = `Timeout exceeded: ${elapsed}ms > ${record.timeout_ms}ms`;
      record.completed_at = new Date();
      this.activeIterations.delete(iteration_id);
      this.completedIterations.set(iteration_id, record);
      return { valid: false, halt_reason: record.halt_reason };
    }

    // Add progress entry
    const progressEntry: ProgressEntry = {
      iteration_num: record.iterations_completed + 1,
      started_at: new Date(),
      completed_at: new Date(),
      outcome,
      progress_delta,
    };
    record.progress_entries.push(progressEntry);
    record.iterations_completed++;

    // Check max iterations
    if (record.iterations_completed >= record.max_iterations) {
      record.status = 'HALTED_MAX_ITERATIONS';
      record.halt_reason = `Max iterations reached: ${record.iterations_completed} >= ${record.max_iterations}`;
      record.completed_at = new Date();
      this.activeIterations.delete(iteration_id);
      this.completedIterations.set(iteration_id, record);
      return { valid: false, halt_reason: record.halt_reason };
    }

    // Check for spinning (no progress)
    const spinningDetected = this.detectSpinning(record);
    if (spinningDetected) {
      record.status = 'HALTED_SPINNING';
      record.halt_reason = `Loop spinning detected: ${this.spinningDetectionWindow} iterations with minimal progress`;
      record.completed_at = new Date();
      this.activeIterations.delete(iteration_id);
      this.completedIterations.set(iteration_id, record);
      return { valid: false, halt_reason: record.halt_reason };
    }

    return { valid: true };
  }

  /**
   * Complete an iteration successfully
   */
  completeIteration(iteration_id: string): void {
    const record = this.activeIterations.get(iteration_id);
    if (!record) {
      throw new Error(`Iteration ${iteration_id} not found or already completed`);
    }

    record.status = 'COMPLETED';
    record.completed_at = new Date();
    this.activeIterations.delete(iteration_id);
    this.completedIterations.set(iteration_id, record);
  }

  /**
   * Detect spinning: no progress for last N iterations
   * Returns true if last 5+ iterations all have progress_delta < 10
   */
  private detectSpinning(record: IterationRecord): boolean {
    if (record.progress_entries.length < this.spinningDetectionWindow) {
      return false;
    }

    const recent = record.progress_entries.slice(-this.spinningDetectionWindow);
    const allSpinning = recent.every(entry => entry.progress_delta < 10);

    return allSpinning;
  }

  /**
   * Get the current state of an iteration
   */
  getIteration(iteration_id: string): IterationRecord | null {
    return this.activeIterations.get(iteration_id) || this.completedIterations.get(iteration_id) || null;
  }

  /**
   * Get all active iterations
   */
  getActiveIterations(): IterationRecord[] {
    return Array.from(this.activeIterations.values());
  }

  /**
   * Get all completed/halted iterations
   */
  getCompletedIterations(): IterationRecord[] {
    return Array.from(this.completedIterations.values());
  }

  /**
   * Get iterations that were halted (not completed normally)
   */
  getHaltedIterations(): IterationRecord[] {
    return Array.from(this.completedIterations.values()).filter(
      r => r.status.startsWith('HALTED_')
    );
  }

  /**
   * Emergency halt for an iteration (administrative action)
   */
  emergencyHalt(iteration_id: string, admin_id: string, reason: string): void {
    const record = this.activeIterations.get(iteration_id);
    if (!record) {
      throw new Error(`Iteration ${iteration_id} not found or already completed`);
    }

    record.status = 'HALTED_SPINNING'; // Use spinning status for admin-initiated halts
    record.halt_reason = `[ADMIN HALT by ${admin_id}] ${reason}`;
    record.completed_at = new Date();
    this.activeIterations.delete(iteration_id);
    this.completedIterations.set(iteration_id, record);
  }

  /**
   * Get audit trail of an iteration's progress
   */
  getProgressHistory(iteration_id: string): ProgressEntry[] {
    const record = this.completedIterations.get(iteration_id) || this.activeIterations.get(iteration_id);
    if (!record) {
      return [];
    }
    return [...record.progress_entries];
  }

  /**
   * Get iterations that hit max_iterations limit (may need redesign)
   */
  getMaxIterationsReached(): IterationRecord[] {
    return Array.from(this.completedIterations.values()).filter(
      r => r.status === 'HALTED_MAX_ITERATIONS'
    );
  }
}

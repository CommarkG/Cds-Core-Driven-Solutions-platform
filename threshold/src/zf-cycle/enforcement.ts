/**
 * CDS ZF-Cycle Enforcement Engine
 * Daily job for overdue-finding escalation (mechanical, automatic, no Governor intervention needed)
 *
 * Runs at UTC 00:00 every day.
 * Checks park-registry.json for PARKED_WITH_DEADLINE entries where close_by < TODAY.
 * Escalates overdue findings to FORCED_ESCALATION status.
 * Blocks new Phase builds until escalated findings are resolved.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ParkEntry {
  park_id: string;
  status: 'OPEN' | 'CLOSED' | 'PARKED_WITH_DEADLINE' | 'FORCED_ESCALATION';
  close_by?: string; // ISO 8601 date
  escalation_triggered_at?: string;
  finding_ref?: string;
  parked_by?: string;
  rationale?: string;
}

interface ParkRegistry {
  entries: ParkEntry[];
  last_escalation_run?: string;
}

/**
 * Daily escalation job — runs at UTC 00:00
 * Checks for overdue parked findings and escalates them to FORCED_ESCALATION
 */
export function runDailyEscalationJob(): { escalated_count: number; escalation_log: string[] } {
  const log: string[] = [];
  let escalatedCount = 0;

  try {
    // Read park registry (Phase 0 — file-based; Phase 0.5+ would be DB)
    const registryPath = join(process.cwd(), 'data', 'park-registry.json');
    let registry: ParkRegistry;

    try {
      const content = readFileSync(registryPath, 'utf-8');
      registry = JSON.parse(content);
    } catch {
      // Registry doesn't exist yet — create empty one
      registry = { entries: [] };
    }

    const now = new Date();
    const todayISO = now.toISOString().split('T')[0]; // YYYY-MM-DD

    log.push(`[${now.toISOString()}] Escalation job started`);
    log.push(`Today's date (UTC): ${todayISO}`);

    // Scan for overdue entries
    registry.entries.forEach((entry, index) => {
      if (entry.status === 'PARKED_WITH_DEADLINE' && entry.close_by) {
        const closeByDate = entry.close_by.split('T')[0]; // Extract YYYY-MM-DD

        // Compare dates
        if (closeByDate < todayISO) {
          // Entry is overdue — escalate it
          entry.status = 'FORCED_ESCALATION';
          entry.escalation_triggered_at = now.toISOString();
          escalatedCount++;

          log.push(
            `ESCALATED: ${entry.park_id} (was due ${closeByDate}, now ${todayISO}) ` +
            `→ FORCED_ESCALATION`
          );
        } else {
          // Check if within 3 days — warning
          const daysUntilClose = Math.ceil(
            (new Date(closeByDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysUntilClose <= 3 && daysUntilClose > 0) {
            log.push(
              `WARNING: ${entry.park_id} escalating in ${daysUntilClose} day(s) ` +
              `(due ${closeByDate})`
            );
          }
        }
      }
    });

    // Write updated registry
    registry.last_escalation_run = now.toISOString();
    writeFileSync(registryPath, JSON.stringify(registry, null, 2));

    log.push(`Escalation job complete: ${escalatedCount} finding(s) escalated`);
    console.log(`[ESCALATION JOB] ${escalatedCount} findings escalated to FORCED_ESCALATION`);

    return {
      escalated_count: escalatedCount,
      escalation_log: log,
    };
  } catch (err) {
    const errorMsg = `Escalation job failed: ${String(err)}`;
    log.push(errorMsg);
    console.error(`[ESCALATION JOB ERROR] ${errorMsg}`);
    return {
      escalated_count: 0,
      escalation_log: log,
    };
  }
}

/**
 * Check if any FORCED_ESCALATION entries exist in park registry
 * Used by RULE-PARK to block Swift Implementation
 */
export function hasForcedEscalations(): boolean {
  try {
    const registryPath = join(process.cwd(), 'data', 'park-registry.json');
    const content = readFileSync(registryPath, 'utf-8');
    const registry: ParkRegistry = JSON.parse(content);

    return registry.entries.some(e => e.status === 'FORCED_ESCALATION');
  } catch {
    return false; // If registry unreadable, assume no forced escalations
  }
}

/**
 * Schedule the daily escalation job at UTC 00:00
 * Called on server startup
 */
export function scheduleDailyEscalationJob(): NodeJS.Timer {
  // Calculate milliseconds until next midnight UTC
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  console.log(
    `[ESCALATION JOB SCHEDULED] Next run: ${tomorrow.toISOString()} ` +
    `(in ${Math.round(msUntilMidnight / 1000 / 60)} minutes)`
  );

  // Run immediately on startup (if dev mode)
  if (process.env['NODE_ENV'] !== 'production') {
    console.log('[DEV MODE] Running escalation job immediately on startup');
    runDailyEscalationJob();
  }

  // Schedule daily at midnight UTC
  setTimeout(() => {
    runDailyEscalationJob();

    // Set interval to run every 24 hours after first run
    setInterval(() => {
      runDailyEscalationJob();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  // Return the timeout handle (for testing)
  return setTimeout(() => {}, msUntilMidnight);
}

/**
 * Test helper: manually trigger escalation
 */
export function triggerEscalationNow() {
  return runDailyEscalationJob();
}

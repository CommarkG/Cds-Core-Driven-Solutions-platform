#!/usr/bin/env ts-node
/**
 * CDS Weekly Session Generator
 *
 * Generates a weekly session file pre-populated with 4 angles from:
 * - Audit reports (AUDIT-*.json)
 * - ZF cycles (zf-cycles/ZFC-*.json)
 * - Injection records (injections/INJ-*.json)
 *
 * Run from the Cds - Core Driven Solutions directory:
 *   npx ts-node reports/scripts/generate-weekly.ts
 *
 * Or with a specific week:
 *   npx ts-node reports/scripts/generate-weekly.ts --week 2026-W28
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '..');

// =============================================================================
// WEEK CALCULATION
// =============================================================================

function getISOWeek(date: Date): string {
  const year = date.getFullYear();
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${year}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeekDateRange(weekStr: string): { start: string; end: string } {
  const [year, week] = weekStr.split('-W').map(Number) as [number, number];
  const jan1 = new Date(year!, 0, 1);
  const dayOffset = jan1.getDay() === 0 ? -6 : 1 - jan1.getDay();
  const weekStart = new Date(jan1.getTime() + (dayOffset + (week! - 1) * 7) * 86400000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
  return {
    start: weekStart.toISOString().slice(0, 10)!,
    end: weekEnd.toISOString().slice(0, 10)!,
  };
}

// =============================================================================
// LOAD DATA
// =============================================================================

interface AuditReport {
  audit_id: string;
  session_date: string;
  severity_summary: { CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number };
  findings: Array<{ id: string; expert: string; severity: string; title: string; detail: string }>;
  sonnet_review: {
    meta_patterns: string[];
    enforcement_score: string;
    recommended_p05_sequence: string[];
  };
}

interface ZFCycle {
  zf_id: string;
  finding_id: string;
  status: string;
  current_phase: string;
  created_at: string;
  completed_at?: string;
  finding: { id: string; expert: string; severity: string; title: string };
  stages: Array<{
    phase: string;
    status: string;
    output?: {
      review_result?: { prevention_hook: string; root_cause: string };
      injection_result?: { injection_rule: string; targets_updated: string[] };
    };
  }>;
}

interface InjectionRecord {
  inj_id: string;
  zf_cycle_id: string;
  insight: string;
  injection_rule: string;
  targets_updated: string[];
  injected_at: string;
}

function loadAuditReports(): AuditReport[] {
  return readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith('AUDIT-') && f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(readFileSync(join(REPORTS_DIR, f), 'utf-8')) as AuditReport; }
      catch { return null; }
    })
    .filter((r): r is AuditReport => r !== null);
}

function loadZFCycles(weekStart: string, weekEnd: string): ZFCycle[] {
  const dir = join(REPORTS_DIR, 'zf-cycles');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(readFileSync(join(dir, f), 'utf-8')) as ZFCycle; }
      catch { return null; }
    })
    .filter((c): c is ZFCycle => c !== null)
    .filter(c => c.created_at >= weekStart && c.created_at <= weekEnd + 'T23:59:59Z');
}

function loadInjections(weekStart: string, weekEnd: string): InjectionRecord[] {
  const dir = join(REPORTS_DIR, 'injections');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(readFileSync(join(dir, f), 'utf-8')) as InjectionRecord; }
      catch { return null; }
    })
    .filter((r): r is InjectionRecord => r !== null)
    .filter(r => r.injected_at >= weekStart && r.injected_at <= weekEnd + 'T23:59:59Z');
}

// =============================================================================
// GENERATE WEEKLY SESSION
// =============================================================================

function generateWeeklySession(weekStr: string): void {
  const { start, end } = getWeekDateRange(weekStr);
  const audits = loadAuditReports();
  const zfCycles = loadZFCycles(start, end);
  const injections = loadInjections(start, end);

  // Aggregate open findings from all audits
  const allFindings = audits.flatMap(a => a.findings);
  const criticalFindings = allFindings.filter(f => f.severity === 'CRITICAL');
  const highFindings = allFindings.filter(f => f.severity === 'HIGH');

  // Completed ZF cycles this week
  const completedCycles = zfCycles.filter(c => c.status === 'INJECTED');
  const pendingCycles = zfCycles.filter(c => c.status !== 'INJECTED');

  // Prevention hooks extracted from completed cycles
  const preventionHooks = completedCycles
    .map(c => c.stages.find(s => s.phase === 'REVIEW')?.output?.review_result?.prevention_hook)
    .filter((h): h is string => Boolean(h));

  // Current enforcement score (load from prevention-rules.json)
  let enforcementScore = { mechanical_pct: 60, target_pct: 80 };
  try {
    const prevPath = join(REPORTS_DIR, '..', 'threshold', 'data', 'prevention-rules.json');
    const prevRules = JSON.parse(readFileSync(prevPath, 'utf-8')) as {
      enforcement_score: { mechanical_pct: number; target_pct: number };
    };
    enforcementScore = prevRules.enforcement_score;
  } catch { /* use defaults */ }

  const session = {
    week_id: weekStr,
    week_start: start,
    week_end: end,
    generated_at: new Date().toISOString(),
    status: 'ACTIVE',
    audit_reports_included: audits.map(a => a.audit_id),
    zf_cycles_this_week: zfCycles.length,
    injections_this_week: injections.length,
    enforcement_score: enforcementScore,

    session_agenda: {
      angle_1_platform_dna: {
        label: 'Platform DNA Extraction',
        question: 'What does this week\'s code/findings reveal about how CDS builds things? Does the implementation match the stated DNA?',
        this_week_findings: [
          ...criticalFindings.slice(0, 5).map(f =>
            `CRITICAL [${f.expert}]: ${f.title} — DNA gap: enforcement is convention not mechanism`
          ),
          `${criticalFindings.length} CRITICAL findings total — each represents a DNA gap between stated principle and coded mechanism.`,
          `${injections.length} injection(s) this week hardwired insights into gate targets — DNA improving.`,
        ],
        dna_score: `${enforcementScore.mechanical_pct}/100 — ${100 - enforcementScore.mechanical_pct}% of rules still convention-dependent`,
      },

      angle_2_prevention: {
        label: 'Prevention-First Creation (HARDWIRED)',
        question: 'For each new thing built this week, was PREVENTION built in from the start or bolted on after?',
        this_week_findings: [
          'RULE: Every new route → auth middleware first, handler second (P1-AUTH-FIRST)',
          'RULE: Every string input → scanForInjection() on all rounds (P2-SCAN-ALL-ROUNDS)',
          'RULE: No readFileSync/writeFileSync on hot paths (P3-ASYNC-IO)',
          'RULE: Governance records append-only, never overwrite (P4-APPEND-ONLY)',
          'RULE: Every gate rule checks live source (P5-LIVE-SOURCE)',
          'RULE: Every result includes actionable next-step (P6-ACTIONABLE-UX)',
          ...preventionHooks.map(h => `INJECTED THIS WEEK: ${h}`),
        ],
        hardwired_rule_for_next_session: 'Before writing any new route: declare auth middleware and schema validation FIRST. Code the handler second. Run impl-checklist before scope closure.',
      },

      angle_3_orchestration: {
        label: 'Post-Implementation Check (Smart Orchestrator — Sonnet)',
        question: 'What automated checks fired after each implementation scope this week?',
        this_week_findings: [
          'CHECK-01: Auth middleware present before handler?',
          'CHECK-02: No readFileSync/writeFileSync in route handlers?',
          'CHECK-03: All gate rules check live sources?',
          'CHECK-04: No classification field overwrites?',
          'CHECK-05: User-actionable next-steps in all result states?',
          ...pendingCycles.map(c => `PENDING CYCLE: ${c.zf_id} — ${c.finding.title} (${c.status})`),
        ],
        orchestrator_model: 'sonnet-4-6 (not Opus — per PARK-020726-003)',
        completed_cycles: completedCycles.length,
        pending_cycles: pendingCycles.length,
      },

      angle_4_audit_evolution: {
        label: 'Audit/Validation Evolution',
        question: 'How do this week\'s findings change how we audit going forward?',
        this_week_findings: [
          ...injections.map(i => `NEW SCOPE ADDED: From injection ${i.inj_id} — "${i.injection_rule}"`),
          `Total open CRITICAL: ${criticalFindings.length}`,
          `Total open HIGH: ${highFindings.length}`,
          `Enforcement score: ${enforcementScore.mechanical_pct}% mechanical → target ${enforcementScore.target_pct}%`,
        ],
        findings_tracking: {
          open_critical: criticalFindings.length,
          open_high: highFindings.length,
          closed_this_week: completedCycles.length,
          injected_this_week: injections.length,
        },
      },
    },

    zf_cycles: {
      completed: completedCycles.map(c => ({
        zf_id: c.zf_id,
        finding_id: c.finding_id,
        finding_title: c.finding.title,
        completed_at: c.completed_at,
      })),
      pending: pendingCycles.map(c => ({
        zf_id: c.zf_id,
        finding_id: c.finding_id,
        finding_title: c.finding.title,
        current_phase: c.current_phase,
        status: c.status,
      })),
    },

    next_session_actions: [
      `Run ZF cycles on remaining ${criticalFindings.length} CRITICAL findings not yet cycled`,
      'Trigger Opus holistic if 3+ CRITICAL in same domain completed Phase 2',
      `Target enforcement score: ${Math.min(enforcementScore.mechanical_pct + 5, enforcementScore.target_pct)}%`,
      'Update AUDIT-INDEX.md with enforcement score progress',
      'Review PARK entries for any new forced escalations',
    ],
  };

  const outputPath = join(REPORTS_DIR, 'weekly', `${weekStr}.json`);
  writeFileSync(outputPath, JSON.stringify(session, null, 2), 'utf-8');

  // Update AUDIT-INDEX.md
  try {
    const indexPath = join(REPORTS_DIR, 'AUDIT-INDEX.md');
    let indexContent = readFileSync(indexPath, 'utf-8');
    const weekRow = `| [${weekStr}](weekly/${weekStr}.json) | ${start} – ${end} | ${audits.map(a => a.audit_id).join(', ')} | ${criticalFindings.length} | ACTIVE |`;
    if (!indexContent.includes(weekStr)) {
      indexContent = indexContent.replace(
        '| [2026-W27]',
        `${weekRow}\n| [2026-W27]`
      );
      writeFileSync(indexPath, indexContent, 'utf-8');
    }
  } catch { /* best-effort */ }

  console.log(`✓ Weekly session generated: reports/weekly/${weekStr}.json`);
  console.log(`  Audits: ${audits.length} | ZF Cycles: ${zfCycles.length} | Injections: ${injections.length}`);
  console.log(`  Open CRITICAL: ${criticalFindings.length} | Enforcement: ${enforcementScore.mechanical_pct}% → ${enforcementScore.target_pct}% target`);
}

// =============================================================================
// ENTRY POINT
// =============================================================================

const weekArg = process.argv.find(a => a.startsWith('--week='))?.replace('--week=', '')
              ?? process.argv[process.argv.indexOf('--week') + 1];

const targetWeek = weekArg ?? getISOWeek(new Date());
generateWeeklySession(targetWeek);

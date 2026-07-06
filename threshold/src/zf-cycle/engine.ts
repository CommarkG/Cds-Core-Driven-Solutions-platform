/**
 * CDS ZF-Cycle — Improvement Pipeline Engine
 *
 * Manages the 4-phase iterative improvement loop:
 *   Phase 1 SCAN (Haiku) → Phase 2 REVIEW (Sonnet) →
 *   Phase 3 HOLISTIC (Opus, triggered) → Phase 4 INJECT (Sonnet)
 *
 * The engine GENERATES structured prompts for each phase.
 * Model execution happens externally (Governor runs prompts or scheduled agent).
 * Phase outputs are stored back via POST /api/zf/cycles/:id/phase.
 *
 * PREVENTION IS TOP PRIORITY — every cycle ends with a gate injection.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type {
  ZFCycle,
  ZFCyclePhase,
  ZFCycleStatus,
  ZFStage,
  ZFStageOutput,
  ZFTrigger,
  StartZFCycleRequest,
  StartZFCycleResponse,
  AdvanceZFCycleRequest,
  AdvanceZFCycleResponse,
} from './types.js';

const ZF_CYCLES_DIR     = join(process.cwd(), '..', 'reports', 'zf-cycles');
const ZF_REGISTRY_PATH  = join(process.cwd(), 'data', 'zf-cycle-registry.json');
const AUDIT_REPORTS_DIR = join(process.cwd(), '..', 'reports');

// =============================================================================
// INITIALIZATION
// =============================================================================

function ensureDirectories(): void {
  if (!existsSync(ZF_CYCLES_DIR)) mkdirSync(ZF_CYCLES_DIR, { recursive: true });
}

// =============================================================================
// ZF-ID GENERATION — ZFC-YYMMDD-NNN
// =============================================================================

function generateZfId(): string {
  ensureDirectories();
  const today = new Date();
  const yy = String(today.getFullYear()).slice(2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const prefix = `ZFC-${yy}${mm}${dd}-`;

  const existing = existsSync(ZF_CYCLES_DIR)
    ? readdirSync(ZF_CYCLES_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
        .map(f => parseInt(f.replace(prefix, '').replace('.json', ''), 10))
        .filter(n => !isNaN(n))
    : [];

  const maxSeq = existing.length > 0 ? Math.max(...existing) : 0;
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

// =============================================================================
// LOAD / SAVE ZF CYCLE
// =============================================================================

function loadCycle(zfId: string): ZFCycle | null {
  ensureDirectories();
  const filePath = join(ZF_CYCLES_DIR, `${zfId}.json`);
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as ZFCycle;
  } catch {
    return null;
  }
}

function saveCycle(cycle: ZFCycle): void {
  ensureDirectories();
  const filePath = join(ZF_CYCLES_DIR, `${cycle.zf_id}.json`);
  writeFileSync(filePath, JSON.stringify(cycle, null, 2), 'utf-8');

  // Update registry index
  try {
    const registry = JSON.parse(readFileSync(ZF_REGISTRY_PATH, 'utf-8')) as {
      _meta: object;
      cycles: Array<{ zf_id: string; finding_id: string; status: string; created_at: string }>;
    };
    const idx = registry.cycles.findIndex(c => c.zf_id === cycle.zf_id);
    const entry = { zf_id: cycle.zf_id, finding_id: cycle.finding_id, status: cycle.status, created_at: cycle.created_at };
    if (idx >= 0) registry.cycles[idx] = entry;
    else registry.cycles.push(entry);
    writeFileSync(ZF_REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
  } catch { /* registry update is best-effort */ }
}

// =============================================================================
// FIND FINDING IN AUDIT REPORTS
// =============================================================================

function findFinding(findingId: string, sourceReport: string): ZFCycle['finding'] | null {
  const reportPath = join(AUDIT_REPORTS_DIR, `${sourceReport}.json`);
  try {
    const report = JSON.parse(readFileSync(reportPath, 'utf-8')) as {
      findings: Array<{
        id: string;
        expert: string;
        severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
        title: string;
        detail: string;
      }>;
    };
    const found = report.findings.find(f => f.id === findingId);
    if (!found) return null;
    return {
      id: found.id,
      expert: found.expert,
      severity: found.severity,
      title: found.title,
      detail: found.detail,
    };
  } catch {
    return null;
  }
}

// =============================================================================
// PHASE PROMPT GENERATORS
// =============================================================================

function buildPhase1Prompt(cycle: ZFCycle): string {
  return `You are EXPERT-${cycle.finding.expert}-HAIKU performing Phase 1 SCAN for ZF-Cycle ${cycle.zf_id}.

FINDING TO SCAN:
ID: ${cycle.finding.id}
Severity: ${cycle.finding.severity}
Title: ${cycle.finding.title}
Detail: ${cycle.finding.detail}

SCAN QUESTIONS:
1. What pattern does this finding represent? (authentication gap / data integrity / performance / governance gap / UX gap / integration gap / documentation gap)
2. Confirm the severity — is ${cycle.finding.severity} correct? Why or why not?
3. Which other findings in AUDIT-260702-001 share this same root pattern? List their IDs.
4. What is the risk context — what fails in production if this is never fixed?
5. What is the platform impact — which platform functions are degraded by this finding?

OUTPUT FORMAT (JSON only, no prose):
{
  "scan_summary": {
    "pattern": "string",
    "severity_confirmed": "CRITICAL|HIGH|MEDIUM|LOW",
    "related_findings": ["FINDING-ID-1", "FINDING-ID-2"],
    "risk_context": "string (1-2 sentences)",
    "platform_impact": "string (1-2 sentences)"
  }
}`;
}

function buildPhase2Prompt(cycle: ZFCycle): string {
  const phase1Output = cycle.stages.find(s => s.phase === 'SCAN')?.output?.scan_summary;
  const phase1Summary = phase1Output
    ? `\nPhase 1 SCAN output:\nPattern: ${phase1Output.pattern}\nRelated: ${phase1Output.related_findings.join(', ')}\nRisk: ${phase1Output.risk_context}`
    : '';

  return `You are EXPERT-${cycle.finding.expert}-SONNET performing Phase 2 REVIEW for ZF-Cycle ${cycle.zf_id}.

FINDING: ${cycle.finding.id} — ${cycle.finding.title}
${cycle.finding.detail}
${phase1Summary}

REVIEW QUESTIONS:
1. What is the root cause? (not the symptom — the architectural or process decision that caused this)
2. Provide 2-3 fix options with tradeoffs and effort estimates.
3. Which option do you recommend and why?
4. What is the prevention hook — the specific rule or check to inject into gate targets to prevent this finding in future code?
5. After the fix is applied, will enforcement be MECHANICAL (cannot bypass) or CONVENTION (relies on discipline)?

OUTPUT FORMAT (JSON only, no prose):
{
  "review_result": {
    "root_cause": "string",
    "options": [
      { "approach": "string", "tradeoffs": "string", "effort": "LOW|MEDIUM|HIGH" }
    ],
    "recommended_fix": "string",
    "prevention_hook": "string (the gate rule to inject — one sentence, imperative)",
    "enforcement_after_fix": "MECHANICAL|CONVENTION"
  }
}`;
}

function buildPhase3Prompt(cycles: ZFCycle[]): string {
  const summaries = cycles.map(c => {
    const review = c.stages.find(s => s.phase === 'REVIEW')?.output?.review_result;
    return `- ${c.finding.id} (${c.finding.expert}): ${c.finding.title}\n  Root cause: ${review?.root_cause ?? 'pending'}\n  Prevention: ${review?.prevention_hook ?? 'pending'}`;
  }).join('\n');

  return `You are OPUS HOLISTIC REVIEWER for ZF-Cycle batch.

${cycles.length} findings in this batch have completed Phase 2 REVIEW. Your role: cross-finding synthesis. Find the platform-level pattern that connects them.

BATCH:
${summaries}

HOLISTIC QUESTIONS:
1. What single platform-level pattern connects all or most of these findings?
2. What is the systemic risk if this pattern persists into Phase 1?
3. What is your architectural recommendation — the one structural change that reduces the most findings simultaneously?
4. If this recommendation is implemented, estimate the enforcement score delta (% increase from current 60%).

OUTPUT FORMAT (JSON only, no prose):
{
  "holistic_insight": {
    "platform_pattern": "string",
    "systemic_risk": "string",
    "architectural_recommendation": "string",
    "enforcement_score_delta": 5
  }
}`;
}

function buildPhase4Prompt(cycle: ZFCycle): string {
  const review = cycle.stages.find(s => s.phase === 'REVIEW')?.output?.review_result;
  const holistic = cycle.stages.find(s => s.phase === 'HOLISTIC')?.output?.holistic_insight;

  const insight = holistic
    ? `HOLISTIC INSIGHT: ${holistic.platform_pattern}\nArchitectural recommendation: ${holistic.architectural_recommendation}`
    : `REVIEW INSIGHT: Prevention hook: ${review?.prevention_hook ?? 'see review output'}\nRecommended fix: ${review?.recommended_fix ?? 'see review output'}`;

  return `You are SONNET ORCHESTRATOR performing Phase 4 INJECT for ZF-Cycle ${cycle.zf_id}.

FINDING: ${cycle.finding.id} — ${cycle.finding.title}
${insight}

INJECTION TASK:
Distill the insight into exactly one injection_rule (imperative sentence, max 30 words).
Select the target IDs from this list that should receive the rule:
  - GATE-AUTH (auth middleware gate)
  - GATE-SCHEMA (schema validation gate)
  - GATE-INJECTION (injection scan gate)
  - CHECK-IMPL (pre-implementation checklist)
  - CHECK-POST (post-implementation verification)
  - PREVENT-RULES (prevention rules registry)
  - AUDIT-SCOPE (audit scope registry)

OUTPUT FORMAT (JSON only, no prose):
{
  "injection_result": {
    "injection_rule": "string (imperative, max 30 words)",
    "targets_updated": ["GATE-AUTH", "CHECK-IMPL"],
    "enforcement_before": "STUB|CONVENTION|MECHANICAL",
    "enforcement_after": "STUB|CONVENTION|MECHANICAL"
  }
}`;
}

// =============================================================================
// START ZF CYCLE
// =============================================================================

export function startZFCycle(request: StartZFCycleRequest): StartZFCycleResponse {
  const finding = findFinding(request.finding_id, request.finding_source);
  if (!finding) {
    throw new Error(`Finding ${request.finding_id} not found in ${request.finding_source}.json`);
  }

  const zfId = generateZfId();
  const now = new Date().toISOString();

  const cycle: ZFCycle = {
    zf_id: zfId,
    finding_id: request.finding_id,
    finding_source: request.finding_source,
    trigger: request.trigger ?? 'MANUAL',
    status: 'PENDING',
    current_phase: 'SCAN',
    created_at: now,
    stages: [
      { phase: 'SCAN',     model: 'haiku',  status: 'PENDING', triggered_at: now, prompt: '' },
      { phase: 'REVIEW',   model: 'sonnet', status: 'PENDING', prompt: '' },
      { phase: 'HOLISTIC', model: 'opus',   status: 'PENDING', prompt: '' },
      { phase: 'INJECT',   model: 'sonnet', status: 'PENDING', prompt: '' },
    ],
    injection_ids: [],
    holistic_triggered: false,
    finding,
  };

  // Build Phase 1 prompt
  const phase1Prompt = buildPhase1Prompt(cycle);
  cycle.stages[0]!.prompt = phase1Prompt;

  saveCycle(cycle);

  return {
    ok: true,
    zf_id: zfId,
    status: 'PENDING',
    phase_1_prompt: phase1Prompt,
    finding,
  };
}

// =============================================================================
// ADVANCE ZF CYCLE — store phase output, generate next phase prompt
// =============================================================================

export function advanceZFCycle(request: AdvanceZFCycleRequest): AdvanceZFCycleResponse {
  const cycle = loadCycle(request.zf_id);
  if (!cycle) throw new Error(`ZF cycle ${request.zf_id} not found`);

  const currentStage = cycle.stages.find(s => s.phase === cycle.current_phase);
  if (!currentStage) throw new Error(`Current phase ${cycle.current_phase} not found in cycle`);

  // Store output in current stage
  currentStage.output = request.phase_output;
  currentStage.status = 'COMPLETE';
  currentStage.completed_at = new Date().toISOString();

  const previousPhase = cycle.current_phase;

  // Advance to next phase
  const phaseOrder: ZFCyclePhase[] = ['SCAN', 'REVIEW', 'HOLISTIC', 'INJECT'];
  const currentIdx = phaseOrder.indexOf(cycle.current_phase);

  let nextPhase: ZFCyclePhase | undefined;
  let nextPrompt: string | undefined;
  let newStatus: ZFCycleStatus;

  if (previousPhase === 'SCAN') {
    // Always advance to REVIEW after SCAN
    nextPhase = 'REVIEW';
    newStatus = 'SCAN_COMPLETE';
    cycle.stages.find(s => s.phase === 'REVIEW')!.prompt = buildPhase2Prompt(cycle);
    nextPrompt = cycle.stages.find(s => s.phase === 'REVIEW')!.prompt;
  } else if (previousPhase === 'REVIEW') {
    // Check if Opus holistic should trigger — Governor explicit OR domain clustering auto-trigger
    // NEW (Pocket #2): Auto-trigger when 3+ findings in same domain
    // FIX #4: Validate domain fields are present and correct type
    const domainCount = request.related_findings_in_domain;
    const domainValid = typeof domainCount === 'number' && domainCount >= 0 && Number.isInteger(domainCount);
    const autoDomainTrigger =
      request.finding_domain &&
      domainValid &&
      domainCount >= 3;

    if (request.trigger_holistic || autoDomainTrigger) {
      nextPhase = 'HOLISTIC';
      newStatus = 'REVIEW_COMPLETE';
      cycle.holistic_triggered = true;
      cycle.holistic_trigger_reason = request.trigger_holistic
        ? 'Governor explicit request'
        : `Auto-triggered: ${request.related_findings_in_domain} findings in domain '${request.finding_domain}'`;
      cycle.stages.find(s => s.phase === 'HOLISTIC')!.prompt = buildPhase3Prompt([cycle]);
      nextPrompt = cycle.stages.find(s => s.phase === 'HOLISTIC')!.prompt;
    } else {
      // Skip HOLISTIC — go to INJECT
      cycle.stages.find(s => s.phase === 'HOLISTIC')!.status = 'SKIPPED';
      nextPhase = 'INJECT';
      newStatus = 'REVIEW_COMPLETE';
      cycle.stages.find(s => s.phase === 'INJECT')!.prompt = buildPhase4Prompt(cycle);
      nextPrompt = cycle.stages.find(s => s.phase === 'INJECT')!.prompt;
    }
  } else if (previousPhase === 'HOLISTIC') {
    nextPhase = 'INJECT';
    newStatus = 'HOLISTIC_COMPLETE';
    cycle.stages.find(s => s.phase === 'INJECT')!.prompt = buildPhase4Prompt(cycle);
    nextPrompt = cycle.stages.find(s => s.phase === 'INJECT')!.prompt;
  } else {
    // INJECT complete — cycle done
    newStatus = 'INJECTED';
    cycle.completed_at = new Date().toISOString();
  }

  cycle.status = newStatus;
  if (nextPhase) {
    cycle.current_phase = nextPhase;
    cycle.stages.find(s => s.phase === nextPhase)!.triggered_at = new Date().toISOString();
  }

  saveCycle(cycle);

  return {
    ok: true,
    zf_id: cycle.zf_id,
    previous_phase: previousPhase,
    new_status: newStatus,
    next_phase: nextPhase,
    next_prompt: nextPrompt,
    ready_to_inject: newStatus === 'REVIEW_COMPLETE' || newStatus === 'HOLISTIC_COMPLETE',
  };
}

// =============================================================================
// BUILD BATCH HOLISTIC PROMPT (for manual Opus trigger across multiple cycles)
// =============================================================================

export function buildBatchHolisticPrompt(zfIds: string[]): string {
  const cycles = zfIds.map(id => loadCycle(id)).filter((c): c is ZFCycle => c !== null);
  return buildPhase3Prompt(cycles);
}

// =============================================================================
// LIST ZF CYCLES
// =============================================================================

export function listZFCycles(filter?: { status?: ZFCycleStatus; finding_id?: string }): Array<{
  zf_id: string;
  finding_id: string;
  finding_title: string;
  status: ZFCycleStatus;
  created_at: string;
  completed_at?: string;
  current_phase: ZFCyclePhase;
}> {
  ensureDirectories();
  if (!existsSync(ZF_CYCLES_DIR)) return [];

  const files = readdirSync(ZF_CYCLES_DIR).filter(f => f.endsWith('.json'));
  const cycles: ZFCycle[] = [];

  for (const file of files) {
    try {
      const cycle = JSON.parse(readFileSync(join(ZF_CYCLES_DIR, file), 'utf-8')) as ZFCycle;
      cycles.push(cycle);
    } catch { /* skip corrupt files */ }
  }

  let filtered = cycles;
  if (filter?.status) filtered = filtered.filter(c => c.status === filter.status);
  if (filter?.finding_id) filtered = filtered.filter(c => c.finding_id === filter.finding_id);

  return filtered.map(c => ({
    zf_id: c.zf_id,
    finding_id: c.finding_id,
    finding_title: c.finding.title,
    status: c.status,
    created_at: c.created_at,
    completed_at: c.completed_at,
    current_phase: c.current_phase,
  }));
}

// =============================================================================
// GET SINGLE ZF CYCLE
// =============================================================================

export function getZFCycle(zfId: string): ZFCycle | null {
  return loadCycle(zfId);
}

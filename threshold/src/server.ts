/**
 * CDS Phase 0 — Threshold Server
 * The only door into the platform.
 *
 * Routes:
 *   GET  /                    → gate page (redirect)
 *   GET  /gate                → standalone gate interface
 *   GET  /dashboard           → Governor process dashboard
 *   POST /api/classify        → ICE + 6 rules → Classification Record
 *   POST /api/clarify         → Respond to a NEED_CLARIFICATION
 *   POST /api/session/open    → Open native AI session (requires valid CR-ID)
 *   GET  /api/records         → Dashboard query (Governor only)
 *   GET  /api/records/:crId   → Fetch single record
 *   GET  /api/audit           → Gate health + audit summary
 *   GET  /api/health          → Gate operational check
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

import { authMiddleware } from './gate/middleware/authMiddleware.js';
import { validateInstruction } from './gate/instructionValidator.js';
import { runICE }           from './ice/engine.js';
import { runAllRules, checkGateHealth } from './gate/rules.js';
import { normalizeInput, extractActor, scanForInjection } from './gate/input-adapter.js';
import { evaluateGate2 } from './gate/tier2-gates.js';
import {
  generateCrId,
  storeRecord,
  getRecord,
  listRecords,
  runAudit,
  storeClassificationEvent,
  getRecordWithEvents,
} from './gate/record-store.js';
import {
  startZFCycle,
  advanceZFCycle,
  listZFCycles,
  getZFCycle,
} from './zf-cycle/engine.js';
import { injectInsight, listInjections } from './zf-cycle/injection.js';
import {
  listParkEntries,
  addParkEntry,
  updateParkStatus,
  generateParkId,
} from './zf-cycle/park-registry.js';
import { getChecklistTemplate, runImplChecklist } from './zf-cycle/impl-checklist.js';
import { getPostCheckTemplate, runPostCheckSuite } from './zf-cycle/post-check.js';
import { scheduleDailyEscalationJob, triggerEscalationNow } from './zf-cycle/enforcement.js';

import type {
  ClassificationRecord,
  ClassifyResponse,
  DashboardQuery,
  ActorContext,
  ClassificationResult,
} from './types.js';
import type {
  StartZFCycleRequest,
  AdvanceZFCycleRequest,
  InjectInsightRequest,
  ParkEntry,
} from './zf-cycle/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIR    = join(__dirname, '..', 'ui');

const app  = express();
const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

// =============================================================================
// MIDDLEWARE
// =============================================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*', limit: '10mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Auth middleware — SEC-002 + SEC-007
// Applied to ALL /api/* routes except /api/health.
// Bearer token required. Route-tier enforced per authMiddleware.ts.
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health') return next(); // /api/health is public
  return authMiddleware(req, res, next);
});

// =============================================================================
// UI ROUTES — Gate + Dashboard pages
// =============================================================================

app.get('/', (_req, res) => res.redirect('/gate'));

app.get('/gate', (_req, res) => {
  const html = readFileSync(join(UI_DIR, 'gate', 'index.html'), 'utf-8');
  res.setHeader('Content-Type', 'text/html').send(html);
});

app.get('/dashboard', (_req, res) => {
  const html = readFileSync(join(UI_DIR, 'dashboard', 'index.html'), 'utf-8');
  res.setHeader('Content-Type', 'text/html').send(html);
});

// =============================================================================
// POST /api/classify — Core Threshold endpoint
// Accepts ANY content type. Runs ICE (Q1-Q5) + 6 rules. Returns CR.
// =============================================================================

app.post('/api/classify', async (req: Request, res: Response) => {
  try {
    const rawBody   = typeof req.body === 'string' ? req.body
                    : typeof req.body === 'object'  ? JSON.stringify(req.body)
                    : String(req.body);

    const contentType = req.headers['content-type'] ?? 'text/plain';
    const sourcePath  = (req.headers['x-cds-source-path'] ?? 'human_user') as string;

    // 1. Normalize input — any format
    const rawInput = normalizeInput({
      contentType,
      body: rawBody,
      sourcePath,
      declaredFormat: req.headers['x-cds-format'] as string | undefined,
    });

    // 2. Extract actor context
    const actorPartial = extractActor(req.headers as Record<string, string>, rawInput.structured_fields as Record<string, unknown>);
    const actor: ActorContext = {
      actor_kind:  actorPartial.actor_kind  ?? 'external_user',
      source_path: actorPartial.source_path ?? 'human_user',
      tier:        actorPartial.tier        ?? 'TIER_0',
      identity:    actorPartial.identity    ?? 'anonymous',
      goal_ref:    actorPartial.goal_ref,
      session_id:  actorPartial.session_id,
      tenant_id:   actorPartial.tenant_id,
      agent_registry_id: actorPartial.agent_registry_id,
    };

    // 3. Injection scan — pattern-based (Phase 0)
    const scan = scanForInjection(rawInput.content, actor.actor_kind);
    if (!scan.clean) {
      const blocked: ClassifyResponse = {
        ok: false,
        error: 'INPUT_REJECTED',
        detail: `Injection patterns detected: ${scan.flags.join(', ')}. Input rejected by gate security scan.`,
      };
      return res.status(400).json(blocked);
    }

    // 4. Run ICE — Q1 → Q2 → Q3 → Q4 → Q5
    const structured = rawInput.structured_fields as Record<string, string> | undefined;
    const iceOutput = runICE(rawInput, actor, {
      declaredType:       structured?.['declared_type']       as import('./types.js').InputType | undefined,
      declaredCorespines: structured?.['declared_corespines'] as string[] | undefined,
      additionalTags:     structured?.['additional_tags']     as string[] | undefined,
    });

    // 5. Run 6 mechanical rules
    const isBuildRequest = req.headers['x-cds-build-wizard'] === 'true' ||
                           structured?.['is_build_wizard_request'] === 'true';
    const isConstitutional = iceOutput.q2_corespine_families.includes('CS-META') ||
                             iceOutput.q2_corespine_families.includes('CS-GOVERNANCE');

    const ruleCtx = {
      actor,
      q1_type:                    iceOutput.q1_type,
      source_path:                actor.source_path,
      is_build_wizard_request:    isBuildRequest,
      is_constitutional_element:  isConstitutional,
      ratification_state:         structured?.['ratification_state'],
      vocabulary_terms:           parseVocabTerms(rawInput.content),
      forced_escalation_exists:   false, // Passed to ctx for legacy compat; RULE-PARK reads live registry directly
      cr_id_provided:             undefined,
    };

    const ruleResult = runAllRules(ruleCtx);

    // 6. Determine final classification result
    let classificationResult: ClassificationResult;
    let nextAction: string;
    let clarificationQuestion: string | undefined;

    if (ruleResult.blocking_rule) {
      // Hard FAIL — produces BLOCKED
      classificationResult = 'BLOCKED';
      nextAction = `Resolve blocking rule ${ruleResult.blocking_rule} before proceeding. ${ruleResult.blocking_detail}`;

    } else if (ruleResult.held_rule) {
      // HELD — RULE-VOC vocabulary not yet ratified; input received, held pending Governor ratification
      classificationResult = 'HELD';
      nextAction = `${ruleResult.held_detail} Resolution: ${ruleResult.held_resolution}`;

    } else if (iceOutput.q1_type === 'external_input' || actor.source_path === 'external_ai' || actor.source_path === 'tenant_api') {
      classificationResult = 'QUARANTINE';
      nextAction = 'External content set to QUARANTINE. Cleanse via CDS-CSPS-INCOMING-PROTOCOL-001 before activation.';

    } else if (iceOutput.q1_type === 'unknown') {
      classificationResult = 'HELD';
      nextAction = 'Input returned to sender — does not match any known CDS input type. Please re-submit with explicit type declaration.';

    } else if (iceOutput.classification_confidence === 'LOW') {
      classificationResult = 'NEED_CLARIFICATION';
      clarificationQuestion = generateClarificationQuestion(rawInput.content, iceOutput.q1_type);
      nextAction = `Classification confidence LOW. ${clarificationQuestion}`;

    } else {
      classificationResult = 'CLASSIFIED';
      nextAction = `Routed to: ${iceOutput.q5_routing_primary}`;
    }

    // 7. Generate CR-ID and build Classification Record
    const crId = generateCrId();
    const now  = new Date().toISOString();

    const record: ClassificationRecord = {
      cr_id:                     crId,
      wizard_session_id:         `WS-${crId}`,
      input_received_at:         now,
      classified_at:             now,

      source_path:               actor.source_path,
      actor_kind:                actor.actor_kind,
      actor_identity:            actor.identity,
      tier:                      actor.tier,
      goal_ref:                  actor.goal_ref ?? null,

      raw_input_format:          rawInput.format,
      raw_input_summary:         iceOutput.raw_input_summary,

      q1_type:                   iceOutput.q1_type,
      q2_corespine_families:     iceOutput.q2_corespine_families,
      q3_tags:                   iceOutput.q3_tags,
      q4_status:                 iceOutput.q4_status,
      q5_routing_primary:        iceOutput.q5_routing_primary,
      q5_routing_secondary:      iceOutput.q5_routing_secondary,

      classification_result:     classificationResult,
      classification_confidence: iceOutput.classification_confidence,
      rules_applied:             ruleResult.results,

      clarification_required:    classificationResult === 'NEED_CLARIFICATION',
      clarification_question:    clarificationQuestion,

      next_action: nextAction,
    };

    // 8. Store the record
    storeRecord(record);

    // 9. Return response
    const response: ClassifyResponse = {
      ok: true,
      cr_id: crId,
      classification_result: classificationResult,
      classification_record: record,
      ...(classificationResult === 'NEED_CLARIFICATION' && { clarification_question: clarificationQuestion }),
      ...(classificationResult === 'BLOCKED' && {
        blocking_rule:   ruleResult.blocking_rule   ?? undefined,
        blocking_detail: ruleResult.blocking_detail ?? undefined,
      }),
    };

    const httpStatus = classificationResult === 'BLOCKED' ? 422 : 200;
    return res.status(httpStatus).json(response);

  } catch (err) {
    console.error('[/api/classify] Error:', err);
    return res.status(500).json({ ok: false, error: 'THRESHOLD_ERROR', detail: String(err) });
  }
});

// =============================================================================
// POST /api/clarify — Respond to a NEED_CLARIFICATION
// =============================================================================

app.post('/api/clarify', (req: Request, res: Response) => {
  const { cr_id, clarification_response } = req.body as { cr_id: string; clarification_response: string };

  if (!cr_id || !clarification_response) {
    return res.status(400).json({ ok: false, error: 'cr_id and clarification_response required' });
  }

  const existing = getRecord(cr_id);
  if (!existing) {
    return res.status(404).json({ ok: false, error: `CR ${cr_id} not found` });
  }

  if (existing.classification_result !== 'NEED_CLARIFICATION') {
    return res.status(400).json({ ok: false, error: `CR ${cr_id} is not awaiting clarification (current result: ${existing.classification_result})` });
  }

  // Append a CLARIFIED event — original CR record stays immutable (P4-APPEND-ONLY)
  const event = storeClassificationEvent(cr_id, 'CLARIFIED', {
    clarification_response: clarification_response.substring(0, 200),
    re_classified_as: 'CLASSIFIED',
    q4_status: 'DRAFT',
    clarification_required: false,
    next_action: `Clarification received. Input re-classified as ${existing.q1_type}. Routed to: ${existing.q5_routing_primary}`,
    resolved_summary: `${existing.raw_input_summary} | CLARIFIED: ${clarification_response.substring(0, 100)}`,
  });

  const recordWithEvents = getRecordWithEvents(cr_id);
  return res.json({ ok: true, cr_id, event, record: recordWithEvents });
});

// =============================================================================
// POST /api/session/open — Open native AI session (RULE-CLASS enforcement)
// Requires valid CR-ID — this is where RULE-CLASS fires.
// =============================================================================

app.post('/api/session/open', (req: Request, res: Response) => {
  const { cr_id } = req.body as { cr_id: string };

  if (!cr_id) {
    return res.status(400).json({
      ok: false,
      error: 'RULE_CLASS_VIOLATION',
      detail: 'No classification record provided. All inputs must be classified before a native AI session opens. POST to /api/classify first.',
    });
  }

  const record = getRecord(cr_id);
  if (!record) {
    return res.status(404).json({
      ok: false,
      error: 'RULE_CLASS_VIOLATION',
      detail: `Classification record ${cr_id} not found. Cannot open AI session without a valid CR.`,
    });
  }

  if (record.classification_result === 'BLOCKED') {
    return res.status(422).json({
      ok: false,
      error: 'BLOCKED_RECORD',
      detail: `CR ${cr_id} is BLOCKED. Resolve the blocking condition before opening a session.`,
    });
  }

  if (record.classification_result === 'QUARANTINE') {
    return res.status(422).json({
      ok: false,
      error: 'QUARANTINE_ACTIVE',
      detail: `CR ${cr_id} is in QUARANTINE. Complete cleansing protocol before opening a session.`,
    });
  }

  if (record.classification_result === 'NEED_CLARIFICATION') {
    return res.status(422).json({
      ok: false,
      error: 'AWAITING_CLARIFICATION',
      detail: `CR ${cr_id} awaits clarification: ${record.clarification_question}`,
      clarification_question: record.clarification_question,
    });
  }

  // Append SESSION_OPENED event — original CR record stays immutable (P4-APPEND-ONLY)
  const now = new Date().toISOString();
  storeClassificationEvent(cr_id, 'SESSION_OPENED', { injected_to_ai_at: now });

  // Build injected artifact (context bundle for native AI — 0220 Section 5)
  const injectedArtifact = {
    classification_record: record,
    platform_dna: {
      corespine_references: record.q2_corespine_families,
      ratification_states:  { 'CS-GOV-001': 'RATIFIED' },
      vocabulary_alignment: {},
    },
    governing_rules:   ['0210', '0220', 'CS-GOV-001'],
    active_goal:       record.goal_ref,
    priority_assessment: { p1: 0, p2: 0, p3: 0, p4: 0 },
    output_contract: {
      required_format: 'structured CDS response with governing context',
      required_fields: ['classification_record', 'platform_dna', 'output_contract'],
      depth: 'CORE' as const,
      routing_after: record.q5_routing_primary,
    },
  };

  return res.json({
    ok: true,
    cr_id,
    session_opened_at: now,
    injected_artifact: injectedArtifact,
    message: 'Native AI session authorized. Context bundle ready for injection.',
  });
});

// =============================================================================
// GET /api/records — Governor dashboard query
// =============================================================================

app.get('/api/records', (req: Request, res: Response) => {
  const query: DashboardQuery = {
    limit:         req.query['limit']  ? parseInt(String(req.query['limit']),  10) : 50,
    offset:        req.query['offset'] ? parseInt(String(req.query['offset']), 10) : 0,
    result_filter: req.query['result'] as DashboardQuery['result_filter'] | undefined,
    source_filter: req.query['source'] as DashboardQuery['source_filter'] | undefined,
    since:         req.query['since']  as string | undefined,
  };

  const result = listRecords(query);
  return res.json(result);
});

// =============================================================================
// GET /api/records/:crId — Fetch a single record
// =============================================================================

app.get('/api/records/:crId', (req: Request, res: Response) => {
  const { crId } = req.params;
  // Returns the original CR merged with computed event data (SESSION_OPENED → injected_to_ai_at)
  const record = getRecordWithEvents(crId!);

  if (!record) {
    return res.status(404).json({ ok: false, error: `CR ${crId} not found` });
  }

  return res.json({ ok: true, record });
});

// =============================================================================
// GET /api/audit — Gate audit summary (0220 Section 7)
// =============================================================================

app.get('/api/audit', async (_req: Request, res: Response) => {
  const [health, audit] = await Promise.all([checkGateHealth(), runAudit()]);
  return res.json({ gate_health: health, audit_summary: audit });
});

// =============================================================================
// GET /api/health — Gate operational check
// =============================================================================

app.get('/api/health', async (_req: Request, res: Response) => {
  const health = await checkGateHealth();
  return res.json({ ok: health.gate_operational, ...health });
});

// =============================================================================
// ZF-CYCLE ENDPOINTS — Improvement Pipeline
// =============================================================================

// POST /api/zf/cycle — Start a ZF cycle on a finding
app.post('/api/zf/cycle', (req: Request, res: Response) => {
  try {
    const body = req.body as StartZFCycleRequest;
    if (!body.finding_id || !body.finding_source) {
      return res.status(400).json({ ok: false, error: 'finding_id and finding_source required' });
    }
    const result = startZFCycle(body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/zf/cycles/:id/phase — Advance a ZF cycle with phase output
app.post('/api/zf/cycles/:id/phase', (req: Request, res: Response) => {
  try {
    const zfId = req.params['id']!;
    const body = req.body as Omit<AdvanceZFCycleRequest, 'zf_id'>;
    const result = advanceZFCycle({ zf_id: zfId, ...body });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// GET /api/zf/cycles — List all ZF cycles
app.get('/api/zf/cycles', (req: Request, res: Response) => {
  try {
    const status = req.query['status'] as string | undefined;
    const findingId = req.query['finding_id'] as string | undefined;
    const cycles = listZFCycles({
      status: status as import('./zf-cycle/types.js').ZFCycleStatus | undefined,
      finding_id: findingId,
    });
    return res.json({ ok: true, cycles, total: cycles.length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// GET /api/zf/cycles/:id — Get a single ZF cycle with full stage detail
app.get('/api/zf/cycles/:id', (req: Request, res: Response) => {
  const zfId = req.params['id']!;
  const cycle = getZFCycle(zfId);
  if (!cycle) return res.status(404).json({ ok: false, error: `ZF cycle ${zfId} not found` });
  return res.json({ ok: true, cycle });
});

// POST /api/zf/inject — Inject an insight into platform gate targets
app.post('/api/zf/inject', (req: Request, res: Response) => {
  try {
    const body = req.body as InjectInsightRequest;
    if (!body.zf_id || !body.target_ids || !body.insight || !body.injection_rule) {
      return res.status(400).json({ ok: false, error: 'zf_id, target_ids, insight, injection_rule required' });
    }
    const result = injectInsight(body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// GET /api/zf/injections — List all injection records
app.get('/api/zf/injections', (_req: Request, res: Response) => {
  try {
    const injections = listInjections();
    return res.json({ ok: true, injections, total: injections.length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// =============================================================================
// PARK REGISTRY ENDPOINTS
// =============================================================================

// GET /api/park — List Park entries
app.get('/api/park', (req: Request, res: Response) => {
  try {
    const status = req.query['status'] as ParkEntry['status'] | undefined;
    const forced = req.query['forced_escalation'] === 'true' ? true
                 : req.query['forced_escalation'] === 'false' ? false : undefined;
    const entries = listParkEntries({ status, is_forced_escalation: forced });
    return res.json({ ok: true, entries, total: entries.length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/park — Add a new Park entry (Governor action)
app.post('/api/park', (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<ParkEntry>;
    if (!body.title || !body.session_target) {
      return res.status(400).json({ ok: false, error: 'title and session_target required' });
    }
    const parkId = generateParkId();
    const entry: ParkEntry = {
      park_id: parkId,
      title: body.title,
      description: body.description ?? '',
      status: 'OPEN',
      is_forced_escalation: body.is_forced_escalation ?? false,
      created_at: new Date().toISOString(),
      session_target: body.session_target,
      finding_ref: body.finding_ref ?? null,
      tags: body.tags ?? [],
    };
    addParkEntry(entry);
    return res.json({ ok: true, park_id: parkId, entry });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// PATCH /api/park/:parkId/status — Update park entry status
app.patch('/api/park/:parkId/status', (req: Request, res: Response) => {
  try {
    const { parkId } = req.params;
    const { status } = req.body as { status: ParkEntry['status'] };
    if (!status) return res.status(400).json({ ok: false, error: 'status required' });
    const updated = updateParkStatus(parkId!, status);
    if (!updated) return res.status(404).json({ ok: false, error: `Park entry ${parkId} not found` });
    return res.json({ ok: true, entry: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// =============================================================================
// IMPLEMENTATION CHECKLIST + POST-CHECK ENDPOINTS
// =============================================================================

// GET /api/checklist/impl — Get the pre-implementation checklist template
app.get('/api/checklist/impl', (_req: Request, res: Response) => {
  return res.json({ ok: true, template: getChecklistTemplate() });
});

// POST /api/checklist/impl — Run the pre-implementation checklist
app.post('/api/checklist/impl', (req: Request, res: Response) => {
  const { scope_label, answers } = req.body as {
    scope_label: string;
    answers: Array<{ rule_id: string; pass: boolean; notes?: string }>;
  };
  if (!scope_label || !answers) {
    return res.status(400).json({ ok: false, error: 'scope_label and answers required' });
  }
  const result = runImplChecklist(scope_label, answers);
  return res.json({ ok: true, ...result });
});

// GET /api/checklist/post — Get the post-implementation verification template
app.get('/api/checklist/post', (_req: Request, res: Response) => {
  return res.json({ ok: true, template: getPostCheckTemplate() });
});

// POST /api/checklist/post — Run the post-implementation verification suite
app.post('/api/checklist/post', (req: Request, res: Response) => {
  const { scope_label, results } = req.body as {
    scope_label: string;
    results: Array<{ check_id: string; result: 'PASS' | 'FAIL' | 'NOT_RUN'; evidence?: string; notes?: string }>;
  };
  if (!scope_label || !results) {
    return res.status(400).json({ ok: false, error: 'scope_label and results required' });
  }
  const result = runPostCheckSuite(scope_label, results);
  return res.json({ ok: true, ...result });
});

// =============================================================================
// POST /api/instruction/validate — Instruction Validation Gate (Brain Gap 1)
// Every AI-generated instruction sent to a sub-agent must pass before dispatch.
// Three checks: VOCAB (unregistered terms → HELD), PRINCIPLE (principle violation → BLOCKED),
// SCOPE (out-of-radius path references → HELD).
// Outcome: APPROVED | HELD | BLOCKED. All attempts logged to reports/instruction-validations/.
// =============================================================================

app.post('/api/instruction/validate', (req: Request, res: Response) => {
  try {
    const { instruction_text, dispatch_contract } = req.body as {
      instruction_text: string;
      dispatch_contract: import('./gate/instructionValidator.js').DispatchContract;
    };

    if (!instruction_text || !dispatch_contract) {
      return res.status(400).json({
        ok: false,
        error: 'instruction_text and dispatch_contract required',
      });
    }

    if (!dispatch_contract.declared_scope || !dispatch_contract.target_agent_type ||
        !dispatch_contract.invoking_component || !Array.isArray(dispatch_contract.blast_radius)) {
      return res.status(400).json({
        ok: false,
        error: 'dispatch_contract must include: declared_scope, target_agent_type, invoking_component, blast_radius[]',
      });
    }

    const result = validateInstruction({ instruction_text, dispatch_contract });
    const httpStatus = result.outcome === 'BLOCKED' ? 422
                     : result.outcome === 'HELD'    ? 200
                     : 200;

    return res.status(httpStatus).json({ ok: result.outcome !== 'BLOCKED', ...result });

  } catch (err) {
    console.error('[/api/instruction/validate] Error:', err);
    return res.status(500).json({ ok: false, error: 'INSTRUCTION_GATE_ERROR', detail: String(err) });
  }
});

// =============================================================================
// PLAN ENDPOINTS — Plan ratification + Phase gates (S345 hardening)
// =============================================================================

interface PlanPrerequisites {
  p1_closure_criteria?: string;
  p2_ratified_at?: string;
  p3_measurement_published_at?: string;
}

// In-memory plan store (Phase 0 — file-based in Phase 0.5+)
const planStore: Map<string, PlanPrerequisites> = new Map();

// =============================================================================
// PHASE REGISTRY HELPERS (Pocket #1 — Persistent State)
// =============================================================================

const PHASE_REGISTRY_PATH = join(__dirname, '..', 'data', 'phase-registry.json');

interface PhaseEntry {
  phase_number: number;
  audit_status: 'NOT_RUN' | 'AUDIT_REQUIRED' | 'IN_PROGRESS' | 'ZF_COMPLETE' | 'HELD';
  build_completed_at: string | null;
  audit_opened_at: string | null;
  audit_completed_at: string | null;
  unresolved_findings: number;
  _auto_opened: boolean;
  findings_summary: string | null;
  decision_count?: number;  // Tier 2: Incremented after Gate 1 PASS
}

interface PhaseRegistry {
  entries: PhaseEntry[];
  last_modified: string;
}

function readPhaseRegistry(): PhaseRegistry {
  try {
    const content = readFileSync(PHASE_REGISTRY_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[readPhaseRegistry] Error reading registry:', err);
    // Return default if file missing/corrupted
    return {
      entries: [
        {
          phase_number: 0,
          audit_status: 'NOT_RUN',
          build_completed_at: null,
          audit_opened_at: null,
          audit_completed_at: null,
          unresolved_findings: 0,
          _auto_opened: false,
          findings_summary: null,
        },
      ],
      last_modified: new Date().toISOString(),
    };
  }
}

function writePhaseRegistry(registry: PhaseRegistry): void {
  try {
    registry.last_modified = new Date().toISOString();
    const content = JSON.stringify(registry, null, 2);
    // FIX #1: Atomic write (temp file + rename) prevents corruption on crash
    const tempPath = PHASE_REGISTRY_PATH + '.tmp.' + randomBytes(8).toString('hex');
    writeFileSync(tempPath, content, { flag: 'w' });
    // Atomic rename (on most filesystems)
    renameSync(tempPath, PHASE_REGISTRY_PATH);
  } catch (err) {
    console.error('[writePhaseRegistry] Error writing registry:', err);
    throw new Error(`Phase registry write failed: ${String(err)}`);
  }
}

function getPhaseEntry(phaseNumber: number): PhaseEntry | null {
  const registry = readPhaseRegistry();
  return registry.entries.find(e => e.phase_number === phaseNumber) || null;
}

function updatePhaseEntry(phaseNumber: number, updates: Partial<PhaseEntry>): void {
  try {
    const registry = readPhaseRegistry();
    const existingIndex = registry.entries.findIndex(e => e.phase_number === phaseNumber);
    if (existingIndex >= 0) {
      registry.entries[existingIndex] = { ...registry.entries[existingIndex], ...updates };
    } else {
      registry.entries.push({
        phase_number: phaseNumber,
        audit_status: 'NOT_RUN',
        build_completed_at: null,
        audit_opened_at: null,
        audit_completed_at: null,
        unresolved_findings: 0,
        _auto_opened: false,
        findings_summary: null,
        decision_count: 0,
        ...updates,
      });
    }
    writePhaseRegistry(registry); // Now throws on failure
  } catch (err) {
    // FIX #3: Fail loudly, not silently
    console.error(`[updatePhaseEntry] CRITICAL: Failed to update phase ${phaseNumber}:`, err);
    throw err;
  }
}

// Tier 2: Increment decision_count (called after Gate 1 PASS)
function incrementDecisionCount(phaseNumber: number): void {
  try {
    const registry = readPhaseRegistry();
    const existingIndex = registry.entries.findIndex(e => e.phase_number === phaseNumber);
    if (existingIndex >= 0) {
      const currentCount = registry.entries[existingIndex].decision_count || 0;
      registry.entries[existingIndex].decision_count = currentCount + 1;
    } else {
      registry.entries.push({
        phase_number: phaseNumber,
        audit_status: 'NOT_RUN',
        build_completed_at: null,
        audit_opened_at: null,
        audit_completed_at: null,
        unresolved_findings: 0,
        _auto_opened: false,
        findings_summary: null,
        decision_count: 1,
      });
    }
    writePhaseRegistry(registry);
  } catch (err) {
    console.error(`[incrementDecisionCount] CRITICAL: Failed to increment decision_count for phase ${phaseNumber}:`, err);
    throw err;
  }
}

// =============================================================================
// PLAN PREREQUISITES REGISTRY HELPERS (Pocket #3 — Registry not Request Body)
// =============================================================================

const PLAN_PREREQUISITES_PATH = join(__dirname, '..', 'data', 'plan-prerequisites.json');

interface PlanPrerequisitesEntry {
  plan_id: string;
  p1_closure_criteria: string;
  p1_verified_by: string | null;
  p1_verified_at: string | null;
  p2_ratified_by: string | null;
  p2_ratified_at: string | null;
  p2_decision_id: string | null;
  p3_measurement_published_at: string | null;
  p3_measurement_source: string | null;
}

interface PlanPrerequisitesRegistry {
  plans: PlanPrerequisitesEntry[];
}

function readPlanPrerequisites(): PlanPrerequisitesRegistry {
  try {
    const content = readFileSync(PLAN_PREREQUISITES_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[readPlanPrerequisites] Error reading registry:', err);
    return { plans: [] };
  }
}

function getPlanPrerequisites(planId: string): PlanPrerequisitesEntry | null {
  const registry = readPlanPrerequisites();
  return registry.plans.find(p => p.plan_id === planId) || null;
}

// =============================================================================
// PARK REGISTRY HELPERS (Pocket #5 — Actor-Kind Cross-Validation)
// =============================================================================

const PARK_REGISTRY_PATH = join(__dirname, '..', 'data', 'park-registry.json');

interface ParkRegistryEntry {
  park_id: string;
  title: string;
  status: string;
  actor_kind?: string;
  decision_id?: string;
  [key: string]: unknown;
}

interface ParkRegistry {
  entries: ParkRegistryEntry[];
  [key: string]: unknown;
}

function readParkRegistry(): ParkRegistry {
  try {
    const content = readFileSync(PARK_REGISTRY_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[readParkRegistry] Error reading registry:', err);
    return { entries: [] };
  }
}

function findGovernorDecision(decisionId: string): ParkRegistryEntry | null {
  const registry = readParkRegistry();
  const entry = registry.entries.find(e =>
    (e.actor_kind === 'governor' || e.status === 'RATIFIED') &&
    (e.decision_id === decisionId || e.park_id === decisionId)
  );

  if (!entry) return null;

  // FIX #2: Validate entry is well-formed (prevent spoofing)
  // CRITICAL FIX: Apply validation to ALL entries that match lookup, not just governor actor_kind
  // (Otherwise attacker can use status='RATIFIED' to bypass validation)
  if (entry.actor_kind === 'governor' || entry.status === 'RATIFIED') {
    const requiredFields = ['park_id', 'decision_id', 'status', 'ratified_at', 'actor_kind'];
    const hasRequiredFields = requiredFields.every(field => entry[field as keyof ParkRegistryEntry] !== undefined && entry[field as keyof ParkRegistryEntry] !== null);

    if (!hasRequiredFields) {
      console.warn(`[findGovernorDecision] Entry ${entry.park_id} missing required decision fields`);
      return null; // Reject incomplete entries
    }

    // Validate ratified_at is a valid ISO timestamp
    const ratifiedAt = new Date(entry['ratified_at'] as string);
    if (isNaN(ratifiedAt.getTime())) {
      console.warn(`[findGovernorDecision] Entry ${entry.park_id} has invalid ratified_at timestamp`);
      return null;
    }
  }

  return entry;
}

// POST /api/plan/ratify — Validate plan structure (RULE_PLAN_SYNTAX_VALIDATION)
app.post('/api/plan/ratify', (req: Request, res: Response) => {
  try {
    const { plan_id, plan_content } = req.body as { plan_id: string; plan_content: string };

    if (!plan_id || !plan_content) {
      return res.status(400).json({
        ok: false,
        error: 'plan_id and plan_content required',
      });
    }

    const ruleContext = {
      actor: res.locals['actor'] || { kind: 'builder' },
      q1_type: 'element' as const,
      source_path: 'internal' as const,
      is_build_wizard_request: false,
      is_constitutional_element: false,
      is_plan_ratification: true,
      plan_content,
    };

    const ruleResult = runAllRules(ruleContext);
    const planRule = ruleResult.results.find(r => r.rule_id === 'RULE-PLAN-SYNTAX-VALIDATION');

    if (planRule && planRule.outcome === 'FAIL') {
      return res.status(409).json({
        ok: false,
        error: 'PLAN_STRUCTURE_INVALID',
        detail: planRule.detail,
      });
    }

    // Store plan for later prerequisite checks
    planStore.set(plan_id, { p1_closure_criteria: 'defined' });

    return res.json({
      ok: true,
      message: 'Plan structure validated — ratifiable',
      plan_id,
    });

  } catch (err) {
    console.error('[/api/plan/ratify] Error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/phase/1/build — Check P1/P2/P3 prerequisites before Phase 1 build
// NEW (Pocket #3): Read prerequisites from registry, not request body
app.post('/api/phase/1/build', (req: Request, res: Response) => {
  try {
    const { plan_id } = req.body as { plan_id: string };

    if (!plan_id) {
      return res.status(400).json({
        ok: false,
        error: 'plan_id required',
      });
    }

    // Read prerequisites from persistent registry (not request body)
    const plan = getPlanPrerequisites(plan_id);

    if (!plan) {
      return res.status(404).json({
        ok: false,
        error: 'Plan not found in prerequisites registry',
        detail: `Create plan entry in data/plan-prerequisites.json first with plan_id="${plan_id}"`,
      });
    }

    const missing: string[] = [];

    if (!plan.p1_closure_criteria) {
      missing.push('P1 closure criteria not recorded in registry');
    }
    if (!plan.p2_ratified_at) {
      missing.push('P2 not yet ratified by Governor');
    }
    if (!plan.p3_measurement_published_at) {
      missing.push('P3 baseline measurement not published');
    }

    // NEW (Pocket #5): Validate P2 requires actual Governor signature in park-registry
    // P2 ratification must be backed by a Governor decision record
    if (plan.p2_ratified_at && plan.p2_decision_id) {
      const govEntry = findGovernorDecision(plan.p2_decision_id);
      if (!govEntry) {
        missing.push(`P2 ratified_at exists but no Governor signature found in park-registry (decision_id: ${plan.p2_decision_id})`);
      }
    }

    if (missing.length > 0) {
      return res.status(409).json({
        ok: false,
        error: 'PREREQUISITES_NOT_MET',
        blocking_prerequisites: missing,
        detail: `Phase 1 build blocked: ${missing.join('; ')}. Update data/plan-prerequisites.json or park-registry.json.`,
      });
    }

    // All prerequisites met — Phase 1 build may proceed
    return res.json({
      ok: true,
      message: 'All prerequisites satisfied — Phase 1 build may proceed',
      plan_id,
      prerequisites_verified: ['P1', 'P2', 'P3'],
    });

  } catch (err) {
    console.error('[/api/phase/1/build] Error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/phase/:n/finish-build — Close Phase N build, auto-open audit phase, gate Phase N+1
// This is the STATE MACHINE endpoint (not just validation). Closes current phase, opens next.
app.post('/api/phase/:n/finish-build', (req: Request, res: Response) => {
  try {
    const phaseNum = parseInt(req.params['n']!, 10);
    const { build_artifacts, deliverables_signed_off } = req.body as {
      build_artifacts?: string;
      deliverables_signed_off?: boolean;
    };

    if (phaseNum < 0) {
      return res.status(400).json({
        ok: false,
        error: 'Phase number must be >= 0',
      });
    }

    // 1. Close Phase N build + AUTO-OPEN Phase N audit (persistent state)
    try {
      const now = new Date().toISOString();
      updatePhaseEntry(phaseNum, {
        audit_status: 'AUDIT_REQUIRED',
        build_completed_at: now,
        audit_opened_at: now,
        _auto_opened: true,
      });
    } catch (err) {
      // FIX #3: Return error instead of silent failure
      return res.status(500).json({
        ok: false,
        error: 'PHASE_STATE_PERSISTENCE_FAILED',
        detail: `Failed to persist phase state: ${String(err)}`,
      });
    }

    // 3. Log next required action (Builder must run audit before Phase N+1 start allowed)
    const nextAction = phaseNum === 0
      ? 'Run Phase 0 audit + resolve findings to ZF'
      : `Run Phase ${phaseNum} audit, resolve findings to ZF. Phase ${phaseNum + 1} cannot start until audit complete.`;

    return res.json({
      ok: true,
      message: 'Phase build complete. Audit phase auto-opened.',
      phase: phaseNum,
      build_status: 'COMPLETE',
      audit_status: 'AUDIT_REQUIRED',
      next_required_action: nextAction,
      blocking_condition: `POST /api/phase/${phaseNum + 1}/start will be blocked until audit is ZF_COMPLETE`,
    });

  } catch (err) {
    console.error(`[/api/phase/:n/finish-build] Error:`, err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/phase/:n/close-audit — Mark Phase N audit complete (Tier 2 Gate 2 enforces precondition)
interface AuditInput {
  phase_number: number;
  audit_status: 'AUDIT_REQUIRED' | 'IN_PROGRESS' | 'ZF_COMPLETE' | 'HELD';
  unresolved_findings?: number;
  findings_summary?: string;
}

app.post('/api/phase/:n/close-audit', (req: Request, res: Response) => {
  try {
    const phaseNum = parseInt(req.params['n']!, 10);
    const { audit_status, unresolved_findings, findings_summary } = req.body as AuditInput;

    // INPUT VALIDATION
    if (!audit_status) {
      return res.status(400).json({
        ok: false,
        error: 'audit_status required',
      });
    }

    // Validate that only ZF_COMPLETE or HELD are allowed (not partial)
    if (!['ZF_COMPLETE', 'HELD'].includes(audit_status)) {
      return res.status(400).json({
        ok: false,
        error: 'audit_status must be ZF_COMPLETE (no open findings) or HELD (parked with deadline)',
        detail: 'Partial audits not permitted. Audit must reach zero findings or explicit hold.',
      });
    }

    // TIER 2: GATE 2 — Phase completion audit precondition
    // This gate verifies that all prior phase audits are complete before allowing current phase to close
    const gate2Request = {
      phase: phaseNum,
      caller_role: (req as any).caller_role || 'governor', // Default to governor for API key authenticated requests
    };
    const gate2Result = evaluateGate2(gate2Request);

    if (!gate2Result.close) {
      return res.status(400).json({
        ok: false,
        error: 'GATE_2_BLOCKED',
        gate2_reason: gate2Result.reason,
        blocking_audits: gate2Result.blocking_audits,
        detail: `Phase ${phaseNum} cannot close: prior phase audit requirements not met (${gate2Result.reason})`,
        requires_governor: gate2Result.requires_governor,
      });
    }

    // GATE 2 PASSED: Proceed with audit close

    // Store audit completion in persistent registry
    try {
      updatePhaseEntry(phaseNum, {
        audit_status: audit_status as any,
        unresolved_findings: unresolved_findings || 0,
        findings_summary: findings_summary || null,
        audit_completed_at: new Date().toISOString(),
      });
    } catch (err) {
      // FIX #3: Return error instead of silent failure
      return res.status(500).json({
        ok: false,
        error: 'PHASE_STATE_PERSISTENCE_FAILED',
        detail: `Failed to persist audit completion: ${String(err)}`,
      });
    }

    // AUTO-CHECK: Can Phase N+1 start now? (mechanical check)
    let nextPhaseGatable = audit_status === 'ZF_COMPLETE';
    const gateMessage = nextPhaseGatable
      ? `Phase ${phaseNum + 1} may now open (audit gate passes)`
      : `Phase ${phaseNum + 1} blocked: audit is HELD (findings parked with deadline)`;

    return res.json({
      ok: true,
      message: `Phase ${phaseNum} audit completed`,
      phase: phaseNum,
      audit_status,
      gate2_passed: true,
      can_open_next_phase: nextPhaseGatable,
      gate_message: gateMessage,
      next_step: nextPhaseGatable
        ? `POST /api/phase/${phaseNum + 1}/start (will be allowed)`
        : `Address parked findings before Phase ${phaseNum + 1} can open`,
    });

  } catch (err) {
    console.error(`[/api/phase/:n/close-audit] Error:`, err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/phase/:n/start — MANDATORY: Check Phase N-1 audit before opening Phase N
// This is a MECHANICAL GATE (not optional, always checked, blocks if audit incomplete)
app.post('/api/phase/:n/start', (req: Request, res: Response) => {
  try {
    const phaseNum = parseInt(req.params['n']!, 10);
    const prevPhaseNum = phaseNum - 1;

    if (phaseNum < 1) {
      return res.status(400).json({
        ok: false,
        error: 'Phase number must be >= 1',
      });
    }

    // MANDATORY CHECK: Previous phase audit must be ZF_COMPLETE (not HELD, which blocks next phase)
    // Read from persistent phase-registry.json (not in-memory store)
    const prevPhaseEntry = getPhaseEntry(prevPhaseNum);
    const auditStatus = prevPhaseEntry?.audit_status || 'NOT_RUN';
    const isAuditComplete = auditStatus === 'ZF_COMPLETE';

    if (!isAuditComplete) {
      // MECHANICAL BLOCK — not a suggestion, a hard stop
      let detail: string;
      if (auditStatus === 'AUDIT_REQUIRED' || auditStatus === 'IN_PROGRESS') {
        detail = `Phase ${prevPhaseNum} audit is in progress. Complete it first (POST /api/phase/${prevPhaseNum}/close-audit with ZF_COMPLETE).`;
      } else if (auditStatus === 'HELD') {
        detail = `Phase ${prevPhaseNum} audit is HELD (findings parked). Only ZF_COMPLETE audits allow next phase. Resolve parked findings and reopen audit as ZF_COMPLETE: POST /api/phase/${prevPhaseNum}/close-audit with audit_status: ZF_COMPLETE`;
      } else {
        detail = `Phase ${prevPhaseNum} audit has not been run. Cannot open Phase ${phaseNum} without prior audit completion.`;
      }

      return res.status(409).json({
        ok: false,
        error: 'AUDIT_GATE_MANDATORY_BLOCK',
        blocking_rule: 'RULE-AUDIT-GATE-MANDATORY',
        detail,
        required_action: `Complete Phase ${prevPhaseNum} audit: POST /api/phase/${prevPhaseNum}/close-audit`,
      });
    }

    // Audit gate passes — Phase N may open
    return res.json({
      ok: true,
      message: `Phase ${phaseNum} may open`,
      phase: phaseNum,
      audit_gate: 'PASSED',
      audit_status_of_previous_phase: auditStatus,
    });

  } catch (err) {
    console.error(`[/api/phase/:n/start] Error:`, err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// =============================================================================
// HELPERS
// =============================================================================

function parseVocabTerms(content: string): string[] {
  // Extract potential vocabulary terms — words longer than 4 chars
  return content
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4)
    .map(w => w.replace(/[^a-z0-9-_]/g, ''))
    .filter(w => w.length > 0)
    .slice(0, 50); // Limit for performance
}

function generateClarificationQuestion(content: string, inferredType: string): string {
  return `Your input was received but its classification is uncertain. ` +
         `We inferred it might be a "${inferredType}" — is that correct? ` +
         `If not, please re-submit with one of these explicit types: ` +
         `goal | element | finding | obligation | improvement | insight | external_input`;
}

// =============================================================================
// ESCALATION ENDPOINTS (test + admin)
// =============================================================================

// POST /api/escalation/trigger-now — Manually trigger escalation job (testing only)
app.post('/api/escalation/trigger-now', (req: Request, res: Response) => {
  try {
    const result = triggerEscalationNow();
    return res.json({
      ok: true,
      message: 'Escalation job triggered',
      escalated_count: result.escalated_count,
      log: result.escalation_log,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Escalation job failed',
      detail: String(err),
    });
  }
});

// =============================================================================
// BACKGROUND JOBS
// =============================================================================

// Schedule daily escalation job (overdue findings → FORCED_ESCALATION)
// This is AUTOMATIC, MECHANICAL, not optional. Runs at UTC 00:00 every day.
scheduleDailyEscalationJob();

// =============================================================================
// START
// =============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   CDS THRESHOLD — Phase 0                        ║
║   The only door into the platform.               ║
║                                                   ║
║   Gate:       http://localhost:${PORT}/gate       ║
║   Dashboard:  http://localhost:${PORT}/dashboard  ║
║   API:        http://localhost:${PORT}/api/classify║
║                                                   ║
║   CS-GOV-001: RATIFIED ✓   RAT-020726-001        ║
║   Phase 0:    ACTIVE                             ║
║   S345 Tier 1: MECHANICAL AUTO-HOOKS ACTIVE ✓   ║
╚═══════════════════════════════════════════════════╝
  `);
});

export { app };

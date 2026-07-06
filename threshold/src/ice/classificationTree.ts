/**
 * CDS Classification Tree — Deterministic Q1 and Q2
 *
 * PROBLEM (CDS-MECHANICAL-AI-BOUNDARY-001, Part 1, ERRORs 1 & 2):
 *   Q1 was AI-inferred: the same input could classify differently depending
 *   on which model ran it. This is invisible drift from the first session.
 *   Q2 was a suggestion table: "which family feels right" not "which family
 *   this input's domain maps to, given Q1 type."
 *
 * GOVERNANCE: GOV-BOUNDARY-002 + GOV-BOUNDARY-003 (both ratified 2026-07-02)
 *
 * FIX — Two deterministic decision trees:
 *
 * Q1 TREE: Priority-ordered binary checks.
 *   Same input, same signals → same output. Every time. Any model.
 *   No branch requires AI judgment. Every branch is a pattern check.
 *   HIGH confidence: unambiguous structural signal (source path, explicit ID, format)
 *   MEDIUM confidence: keyword match, no ambiguity
 *   LOW confidence: conflicting signals or no match
 *
 * Q2 TREE: Q1 type + domain keyword detection → corespine family.
 *   Deterministic per Q1 type. Domain keywords select the specific family
 *   when Q1 type can span multiple families (finding, element, improvement).
 *   Default per type when no domain keyword detected.
 *
 * RULE: These trees are the gate. They do not estimate. They decide.
 * If a branch is ambiguous: add a node. Do not widen an existing node.
 * If an input produces the wrong type: fix the tree. Do not add a workaround.
 */

import type { InputType, CorespineGroup, SourcePath, ClassificationConfidence, RawInput, ActorContext } from '../types.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Q1TreeResult {
  type: InputType;
  confidence: ClassificationConfidence;
  matched_node: string;        // Which decision node fired — for audit/reasoning_trace
  signals_detected: string[];  // Which signal keywords/conditions matched
}

export interface Q2TreeResult {
  families: string[];          // CorespineGroup[] — one or more
  matched_node: string;        // Which decision node fired
  domain_signals: string[];    // Which domain keywords triggered the family selection
}

// =============================================================================
// Q1 — DECISION TREE
//
// PRIORITY ORDER (first match wins — no fallthrough):
//   NODE 1  — Source path is external (source_path overrides content)
//   NODE 2  — Actor has explicitly declared the type (trust the declaration)
//   NODE 3  — Structural ID signals (GOV-*, CR-*, PARK-*, INJ-*, ZFC-*)
//   NODE 4  — External content signals (explicit external/quarantine markers)
//   NODE 5  — Obligation signals (open accountability, park, swift implementation)
//   NODE 6  — Insight signals (learning with event reference — more specific than finding)
//   NODE 7  — Finding signals (gap, broken, missing, misaligned)
//   NODE 8  — Improvement signals (fix to named existing thing)
//   NODE 9  — Goal signals (felt need, desired outcome)
//   NODE 10 — Element signals (component declaration with schema/type)
//   NODE 11 — Weak external (external reference, low confidence)
//   NODE 12 — Unknown (no deterministic match)
// =============================================================================

const EXTERNAL_SOURCE_PATHS: SourcePath[] = ['external_ai', 'tenant_api'];

// Structural ID patterns — presence of a known CDS record format is HIGH confidence
const STRUCTURAL_ID_PATTERNS: Array<{ pattern: RegExp; type: InputType; label: string }> = [
  { pattern: /\bGOV-\d{4}-GOAL-\d+\b/i,        type: 'goal',       label: 'GOV-YYYY-GOAL-NNN reference' },
  { pattern: /\bGOV-\d{4}-\w+-\d+\b/i,         type: 'obligation', label: 'GOV-YYYY-TYPE-NNN reference' },
  { pattern: /\bCR-\d{6}-\d+\b/i,              type: 'finding',    label: 'CR-YYMMDD-NNN reference' },
  { pattern: /\bPARK-\d{8}-\d+\b/i,            type: 'obligation', label: 'PARK-YYYYMMDD-NNN reference' },
  { pattern: /\bZFC-\d{8}-\d+\b/i,             type: 'finding',    label: 'ZFC-YYYYMMDD-NNN reference' },
  { pattern: /\bFINDING-[A-Z]+-\d+\b/i,        type: 'finding',    label: 'FINDING-TYPE-NNN reference' },
  { pattern: /\bINS-[A-Z]+-\d+\b/i,            type: 'insight',    label: 'INS-TYPE-NNN reference' },
  { pattern: /\bOBL-[A-Z]+-\d+\b/i,            type: 'obligation', label: 'OBL-TYPE-NNN reference' },
  { pattern: /\bDC-\d{4}-\d+\b/i,              type: 'improvement', label: 'DC-YYYY-NNN reference' },
];

// Domain-specific OBLIGATION signals — these are explicit accountability markers
const OBLIGATION_SIGNALS = [
  /\bswift implementation\b/i,
  /\bforced escalation\b/i,
  /\bpark queue\b/i,
  /\bopen item\b/i,
  /\bopen accountability\b/i,
  /\bfollowup\b/i,
  /\bfollow.?up\b/i,
  /\bpending decision\b/i,
  /\baccountability item\b/i,
  /\bdeadline\b.{0,30}\baction\b/i,
  /\bcommitted\s+to\b/i,
  /\bmust\s+(do|resolve|complete|address)\b/i,
];

// Insight signals — learning WITH an event reference (distinguishes from finding)
const INSIGHT_SIGNALS = [
  /\bwhat (i|we) learned\b/i,
  /\bkey (takeaway|lesson|learning)\b/i,
  /\binsight (from|about|on)\b/i,
  /\bpattern (we|i) (discovered|noticed|found)\b/i,
  /\blearning from (this|that|the)\b/i,
  /\bafter\b.{0,40}\b(learned?|discovered?|realized?)\b/i,
  /\bextracted\s+from\s+an?\s+event\b/i,
  /\blearning\s+extracted\b/i,
];

// Finding signals — gap, broken, missing (more specific: must imply a problem)
const FINDING_SIGNALS = [
  /\bgap\s+(in|between|with)\b/i,
  /\bstructural\s+gap\b/i,
  /\bmisalignment\b/i,
  /\bnot\s+wired\b/i,
  /\bis\s+(broken|missing|wrong|incorrect|failing)\b/i,
  /\b(bug|defect|error|issue|fault)\s+(in|with|at)\b/i,
  /\bdoes\s+not\s+(work|exist|fire|enforce|apply)\b/i,
  /\bviolation\b.{0,30}\b(rule|principle|gate|spec)\b/i,
  /\bfindings?\s+(from|of|in)\b/i,
  /\bgpow\b.{0,20}\bfind/i,
  /\bZF\s+(check|finding)\b/i,
  /\binheritance\s+break\b/i,
  /\bvocabulary\s+conflict\b/i,
  /\bwiring\s+state\s+mismatch\b/i,
];

// Improvement signals — fix/correction to a NAMED, EXISTING thing
const IMPROVEMENT_SIGNALS = [
  /\bfix(ed|ing)?\s+(the|this|a|an)?\s+\w+/i,
  /\bcorrect(ed|ing)?\s+(the|this|a|an)?\s+\w+/i,
  /\bupdate(d|ing)?\s+existing\b/i,
  /\bpropagat(e|ing|ion)\s+(the|this)?\b/i,
  /\bpatch(ed|ing)?\s+(the|a)?\s+\w+/i,
  /\bimproved?\s+(the|this|a|an)\s+\w+/i,
  /\bresolv(ed|ing)?\s+(the|this|a)?\b/i,
  /\bDC-\d{4}/i,   // Dynamic Completion reference → improvement
];

// Goal signals — felt need, desired outcome, resolution signal
const GOAL_SIGNALS = [
  /\bi\s+(need|want|would like)\b/i,
  /\bwe\s+(need|want|need to)\b/i,
  /\bthe\s+goal\s+(is|of)\b/i,
  /\bfelt\s+need\b/i,
  /\bresolution\s+signal\b/i,
  /\bnew\s+goal\b/i,
  /\bcreate\s+a\s+goal\b/i,
  /\bdesired\s+outcome\b/i,
  /\benable\s+(us|me|the platform)\s+to\b/i,
  /\bmake\s+(it|the platform)\s+(possible|able)\s+to\b/i,
];

// Element signals — discrete component declaration (platform-specific)
const ELEMENT_SIGNALS = [
  /\bnew\s+(element|agent|skill|pipeline|corespine|protocol|page|template|registry|module)\b/i,
  /\belement\s+declaration\b/i,
  /\bcorespine\s+proposal\b/i,
  /\bprotocol\s+proposal\b/i,
  /\bcomponent\s+(declaration|proposal|with\s+schema)\b/i,
  /\bschema\s+placement\b/i,
  /\bplatform\s+component\b/i,
  /\bnew\s+corespine\b/i,
];

// External signals (LOW confidence — needs human review)
const WEAK_EXTERNAL_SIGNALS = [
  /\bexternal\s+(input|content|source|data)\b/i,
  /\bcoming\s+from\s+outside\b/i,
  /\bimport(ing)?\s+(from|content)\b/i,
  /\bincoming\s+(data|content|message)\b/i,
  /\bquarantine\b/i,
  /\bthird.party\b/i,
];

export function runQ1Tree(raw: RawInput, actor: ActorContext, declaredType?: InputType): Q1TreeResult {
  const text = extractTextForTree(raw);

  // NODE 1 — Source path override (hard external paths)
  if (EXTERNAL_SOURCE_PATHS.includes(actor.source_path as SourcePath)) {
    return {
      type: 'external_input',
      confidence: 'HIGH',
      matched_node: 'NODE-1-SOURCE-PATH',
      signals_detected: [`source_path=${actor.source_path}`],
    };
  }

  // NODE 2 — Explicit actor declaration
  if (declaredType) {
    return {
      type: declaredType,
      confidence: 'HIGH',
      matched_node: 'NODE-2-DECLARED-TYPE',
      signals_detected: [`declared_type=${declaredType}`],
    };
  }

  // NODE 3 — Structural ID signals (HIGH confidence — CDS record IDs are unambiguous)
  for (const { pattern, type, label } of STRUCTURAL_ID_PATTERNS) {
    if (pattern.test(text)) {
      return {
        type,
        confidence: 'HIGH',
        matched_node: 'NODE-3-STRUCTURAL-ID',
        signals_detected: [label],
      };
    }
  }

  // NODE 4 — Explicit external/quarantine declaration
  if (/\bexternal_input\b/i.test(text) || /\bQBF-/i.test(text)) {
    return {
      type: 'external_input',
      confidence: 'HIGH',
      matched_node: 'NODE-4-EXPLICIT-EXTERNAL',
      signals_detected: ['explicit external_input or QBF- reference'],
    };
  }

  // NODE 5 — Obligation signals (before insight/finding to catch park/accountability first)
  const obligationHits = OBLIGATION_SIGNALS.filter(p => p.test(text));
  if (obligationHits.length >= 1) {
    return {
      type: 'obligation',
      confidence: obligationHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-5-OBLIGATION',
      signals_detected: obligationHits.map(p => p.source),
    };
  }

  // NODE 6 — Insight signals (learning + event reference — more specific than finding)
  const insightHits = INSIGHT_SIGNALS.filter(p => p.test(text));
  if (insightHits.length >= 1) {
    return {
      type: 'insight',
      confidence: insightHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-6-INSIGHT',
      signals_detected: insightHits.map(p => p.source),
    };
  }

  // NODE 7 — Finding signals (gap, broken, missing)
  const findingHits = FINDING_SIGNALS.filter(p => p.test(text));
  if (findingHits.length >= 1) {
    return {
      type: 'finding',
      confidence: findingHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-7-FINDING',
      signals_detected: findingHits.map(p => p.source),
    };
  }

  // NODE 8 — Improvement signals (fix/correction of existing)
  const improvementHits = IMPROVEMENT_SIGNALS.filter(p => p.test(text));
  if (improvementHits.length >= 1) {
    return {
      type: 'improvement',
      confidence: improvementHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-8-IMPROVEMENT',
      signals_detected: improvementHits.map(p => p.source),
    };
  }

  // NODE 9 — Goal signals (felt need, desired outcome)
  const goalHits = GOAL_SIGNALS.filter(p => p.test(text));
  if (goalHits.length >= 1) {
    return {
      type: 'goal',
      confidence: goalHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-9-GOAL',
      signals_detected: goalHits.map(p => p.source),
    };
  }

  // NODE 10 — Element signals (component declaration)
  const elementHits = ELEMENT_SIGNALS.filter(p => p.test(text));
  if (elementHits.length >= 1) {
    return {
      type: 'element',
      confidence: elementHits.length >= 2 ? 'HIGH' : 'MEDIUM',
      matched_node: 'NODE-10-ELEMENT',
      signals_detected: elementHits.map(p => p.source),
    };
  }

  // NODE 11 — Weak external signals (LOW confidence)
  const weakExternalHits = WEAK_EXTERNAL_SIGNALS.filter(p => p.test(text));
  if (weakExternalHits.length >= 1) {
    return {
      type: 'external_input',
      confidence: 'LOW',
      matched_node: 'NODE-11-WEAK-EXTERNAL',
      signals_detected: weakExternalHits.map(p => p.source),
    };
  }

  // NODE 12 — Unknown
  return {
    type: 'unknown',
    confidence: 'LOW',
    matched_node: 'NODE-12-UNKNOWN',
    signals_detected: [],
  };
}

// =============================================================================
// Q2 — DECISION TREE
//
// Input: Q1 type + content text
// Output: corespine family (or families for multi-domain inputs)
//
// For Q1 types with a fixed family (GOAL, OBLIGATION, INSIGHT, EXTERNAL, UNKNOWN):
//   → single family, no domain keyword needed
//
// For Q1 types that span multiple families (ELEMENT, FINDING, IMPROVEMENT):
//   → domain keyword detection selects the specific family
//   → checked in priority order (security > AI > governance > intelligence > structure)
//   → default per type when no domain keyword fires
// =============================================================================

// Domain keyword sets for Q2 family resolution
const DOMAIN_SECURITY   = /\b(auth|bearer|token|secret|key|permission|role|tier|access\s+control|injection|vulnerability|csp|https?)\b/i;
const DOMAIN_AI         = /\b(agent|model|prompt|haiku|sonnet|opus|persona|lel|learning\s+loop|scan_target|zf.cycle|fleet|inference)\b/i;
const DOMAIN_GOVERNANCE = /\b(governor|ratif|decision|constitutional|rule|gate|corespine|gov-\d|policy|mandate)\b/i;
const DOMAIN_INTELLIGENCE = /\b(insight|learning|audit|zf\s+check|finding|intelligence\s+vault|evidence|confidence\s+score|lel.state)\b/i;
const DOMAIN_META       = /\b(platform|identity|definition|csps|dna|foundation|constitutional\s+layer|cs-meta|cs-gov-001)\b/i;
const DOMAIN_STRUCTURE  = /\b(schema|type|interface|data|record|immutab|store|registry|format|field|json)\b/i;
const DOMAIN_OPERATIONS = /\b(build|deploy|server|startup|endpoint|middleware|route|env|config|health|security)\b/i;

type FamilyDecision = {
  family: CorespineGroup;
  node: string;
  domain_signals: string[];
};

function detectDomainFamily(text: string, defaultFamily: CorespineGroup, q1: InputType): FamilyDecision {
  // Priority order: SECURITY > AI > GOVERNANCE > INTELLIGENCE > META > STRUCTURE > OPERATIONS > default
  const checks: Array<{ pattern: RegExp; family: CorespineGroup; node: string }> = [
    { pattern: DOMAIN_SECURITY,     family: 'CS-OPERATIONS',  node: 'DOMAIN-SECURITY' },
    { pattern: DOMAIN_AI,           family: 'CS-AI',          node: 'DOMAIN-AI' },
    { pattern: DOMAIN_GOVERNANCE,   family: 'CS-GOVERNANCE',  node: 'DOMAIN-GOVERNANCE' },
    { pattern: DOMAIN_INTELLIGENCE, family: 'CS-INTELLIGENCE', node: 'DOMAIN-INTELLIGENCE' },
    { pattern: DOMAIN_META,         family: 'CS-META',        node: 'DOMAIN-META' },
    { pattern: DOMAIN_STRUCTURE,    family: 'CS-STRUCTURE',   node: 'DOMAIN-STRUCTURE' },
    { pattern: DOMAIN_OPERATIONS,   family: 'CS-OPERATIONS',  node: 'DOMAIN-OPERATIONS' },
  ];

  for (const { pattern, family, node } of checks) {
    const match = text.match(pattern);
    if (match) {
      return { family, node, domain_signals: match.slice(0, 3) as string[] };
    }
  }

  return { family: defaultFamily, node: `DEFAULT-${q1.toUpperCase()}`, domain_signals: [] };
}

export function runQ2Tree(q1: InputType, text: string, declaredCorespines?: string[]): Q2TreeResult {
  // Explicit declaration always wins
  if (declaredCorespines && declaredCorespines.length > 0) {
    return {
      families: declaredCorespines,
      matched_node: 'DECLARED-CORESPINES',
      domain_signals: [`declared: ${declaredCorespines.join(', ')}`],
    };
  }

  switch (q1) {
    // Fixed family — no domain keyword needed
    case 'goal':
      return { families: ['CS-GOVERNANCE'], matched_node: 'Q1-GOAL-FIXED', domain_signals: [] };

    case 'obligation':
      return { families: ['CS-GOVERNANCE'], matched_node: 'Q1-OBLIGATION-FIXED', domain_signals: [] };

    case 'insight':
      return { families: ['CS-INTELLIGENCE'], matched_node: 'Q1-INSIGHT-FIXED', domain_signals: [] };

    case 'external_input':
      return { families: ['CS-OPERATIONS'], matched_node: 'Q1-EXTERNAL-FIXED', domain_signals: [] };

    case 'unknown':
      return { families: ['CS-META'], matched_node: 'Q1-UNKNOWN-FIXED', domain_signals: [] };

    // Variable family — domain keyword determines which family
    case 'element': {
      const { family, node, domain_signals } = detectDomainFamily(text, 'CS-STRUCTURE', q1);
      return { families: [family], matched_node: `Q1-ELEMENT-${node}`, domain_signals };
    }

    case 'finding': {
      // Finding default: CS-OPERATIONS (most findings are operational)
      const { family, node, domain_signals } = detectDomainFamily(text, 'CS-OPERATIONS', q1);
      return { families: [family], matched_node: `Q1-FINDING-${node}`, domain_signals };
    }

    case 'improvement': {
      // Improvement default: CS-OPERATIONS (most fixes are operational)
      const { family, node, domain_signals } = detectDomainFamily(text, 'CS-OPERATIONS', q1);
      return { families: [family], matched_node: `Q1-IMPROVEMENT-${node}`, domain_signals };
    }

    default:
      return { families: ['CS-GOVERNANCE'], matched_node: 'Q1-FALLBACK', domain_signals: [] };
  }
}

// =============================================================================
// HELPER — Extract text for tree evaluation
// =============================================================================

export function extractTextForTree(raw: RawInput): string {
  if (raw.format === 'json_payload' || raw.format === 'com4_format') {
    try {
      return JSON.stringify(JSON.parse(raw.content));
    } catch {
      return raw.content;
    }
  }
  return raw.content;
}

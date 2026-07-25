---
document_id: CDS-MULTI-MODEL-WORKING-GUIDE
title: Optimized Multi-Model Working — One Opus Tab + Haiku/Sonnet Agents
version: 1.0
date: 2026-07-25
authority: CDS Orchestrator
status: RATIFIED — operational guide
---

# Optimized Multi-Model Working
## One Opus Tab + Haiku and Sonnet Sub-Agents

---

## THE CORE PRINCIPLE

One Opus tab = the brain. It holds all context, makes all architectural decisions,
writes all sub-agent prompts, and accepts or rejects all sub-agent output.

Haiku and Sonnet are hands. They execute specific, bounded tasks and return results.
They never discover context — the Opus tab provides it in the prompt.

**The wrong model:** Opus does everything (slow, expensive, wastes depth on mechanical work).
**The right model:** Opus orchestrates. Haiku checks. Sonnet implements. Opus ratifies.

---

## THE THREE-TIER MODEL

### Opus (main tab — always on)
**Role:** Strategic orchestrator, Governor advisor, architectural decision-maker
**Keep here:** Full session context, all governance state, ratification decisions,
cross-system reasoning, anything requiring judgment about WHY not just WHAT
**Cost profile:** Expensive — reserve for irreplaceable depth
**Never use for:** Counting files, formatting output, writing repetitive docs, mechanical checks

### Sonnet (spawned agents)
**Role:** Implementation executor, document writer, structured output producer
**Use for:** Writing governance files, implementing CoreSpiral stages, structured analysis,
multi-step document creation, medium-complexity reasoning, code writing
**Cost profile:** Mid-tier — good ROI for implementation tasks
**Prompt style:** Give full context + exact output spec. Sonnet writes well when briefed precisely.
**Typical duration:** 1–4 minutes per task

### Haiku (spawned agents)
**Role:** Mechanical verifier, fast checker, inventory builder, formatter
**Use for:** ZF-0 mechanical checks, file existence verification, counting, format validation,
list generation, status checks, repetitive transforms, quick lookups
**Cost profile:** Cheap — use liberally for mechanical work
**Prompt style:** Give exact input + exact expected output format. No judgment needed.
**Typical duration:** 15–45 seconds per task

---

## DECISION RULE: WHICH MODEL TO SPAWN?

```
Does the task require judgment about WHY or architectural reasoning?
  YES → Stay in Opus tab. Don't spawn.
  NO ↓

Is the task mechanical / verifiable / format-driven?
  YES → Spawn Haiku
  NO ↓

Does it require writing, implementation, or structured multi-step output?
  YES → Spawn Sonnet
  NO ↓

Is it a quick answer (< 3 sentences, no files to write)?
  YES → Stay in Opus tab. Answer inline.
```

**Spawn threshold:** If the task takes less than 30 seconds to do inline, don't spawn.
The overhead of writing a good agent prompt costs more than the task itself.

---

## PART 1 — HAIKU ACTIVATION PATTERNS

### When to use Haiku

| Task type | Example | Haiku? |
|-----------|---------|--------|
| Mechanical count | "How many files have DN- prefix?" | YES |
| File existence check | "Confirm these 5 files exist on disk" | YES |
| Format validation | "Do all IDs follow GE-[DOMAIN]-[SEQ] format?" | YES |
| Status inventory | "List all RATIFIED files in memory/" | YES |
| Quick extraction | "Extract all pe_score values from GOV-PE-BOOTSTRAP-001.yaml" | YES |
| ZF mechanical check | "Check for orphan references in this registry" | YES |
| List generation | "List all corespine IDs in CORESPINE-REGISTRY.yaml" | YES |
| Diff summary | "What fields changed between v1.0 and v1.1 of this schema?" | YES |
| Cross-reference check | "Do all inherited_by IDs exist as separate entries?" | YES |

### Haiku prompt template

```
TASK: [one sentence — exactly what to do]

INPUT: [exact file or data to work on]
[paste the relevant content or file path]

OUTPUT FORMAT:
[specify exactly — list? YAML? pass/fail? count?]

RULES:
- No judgment calls. Report what you find.
- If a check is ambiguous, flag it as UNCLEAR — do not guess.
- Return ONLY the output format specified. No explanation unless flagged UNCLEAR.

SUCCESS = [exact condition for a correct result]
```

### Example: Haiku ZF-0 mechanical check

```
TASK: Check CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml for orphan references.

INPUT: The registry section of CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml (pasted below)
[paste registry section]

OUTPUT FORMAT:
ORPHAN FINDINGS:
- [element_id]: [field]: [orphan reference value] — NOT FOUND in registry

If zero findings, output:
ORPHAN FINDINGS: NONE

RULES:
- An orphan = any ID in inherited_by or inherits_from that does not exist as
  an element_id entry in the same registry.
- Do not check external files. Only check within the pasted content.
- Flag UNCLEAR if a reference is conditional or annotated.

SUCCESS = All references resolve within the registry OR orphan list populated.
```

### Example: Haiku status inventory

```
TASK: Read memory/CORESPINE-REGISTRY.yaml and return a status table.

INPUT: [paste file content or path]

OUTPUT FORMAT:
| corespine_id | status | wiring_state | last_updated |
|-------------|--------|-------------|-------------|
[one row per corespine]

RULES:
- Extract only: id, status, wiring_state, last_updated
- If a field is missing, write MISSING in that cell
- Sort by corespine_id alphabetically

SUCCESS = Table has one row per corespine entry in the file.
```

---

## PART 2 — SONNET ACTIVATION PATTERNS

### When to use Sonnet

| Task type | Example | Sonnet? |
|-----------|---------|---------|
| Write governance file | "Write the FLESH stage of PCR-001 per SKELETON fields" | YES |
| CoreSpiral stage execution | "Execute SKIN stage — wire schema to 3 consuming files" | YES |
| Multi-section document | "Write COMPACTION-RECOVERY doc from this state summary" | YES |
| Structured analysis | "Analyze CSPS ADR-0028 and compare to CDS T-model" | YES |
| Schema implementation | "Write CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml per these 14 fields" | YES |
| Code writing | "Write rules.ts validation function for GE-ID format" | YES |
| Report synthesis | "Synthesize Haiku audit findings into Governor brief" | YES |
| Consulting gate check | "Run L1.9 gate on this submission against 10 criteria" | YES |

### Sonnet prompt template

```
ROLE: You are CDS — Core Driven Solutions. You are implementing a ratified decision.
You do not make architectural decisions. You implement exactly what is specified.

CONTEXT:
[3–5 sentences of relevant background. Include: what phase we're in,
what was ratified, what this task is part of.]

TASK: [one paragraph — exactly what to produce]

CONSTRAINTS:
- [list hard rules — field names, formats, naming conventions]
- Do not add fields beyond what is specified
- Do not explain your choices. Produce the output.

INPUT:
[paste the exact inputs — SKELETON fields, config values, existing files, etc.]

OUTPUT:
[specify exactly what to produce — a YAML file? an MD file? multiple sections?]
[specify the file name if a new file]

DONE SIGNAL: [what a correct output looks like — e.g., "14 fields present, all validated"]
```

### Example: Sonnet CoreSpiral FLESH stage

```
ROLE: You are CDS implementing PCR-001 FLESH stage. This is a ratified implementation task.

CONTEXT:
CDS is a governance platform (Phase A — constitutional layer only).
PCR-001 locks the Platform Element Schema. SKELETON stage is locked (2026-07-20).
FLESH rule: write exactly the SKELETON fields — no additions.
Output file: CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml

TASK: Write the full FLESH output — the actual schema file — using exactly the 14
SKELETON fields below. Include types, validation rules, and one specific error message
per field. Register 3 example elements (GE-PE-001, GE-GOV-001, GE-CON-001).

CONSTRAINTS:
- 14 fields from SKELETON only. No new fields.
- element_id format: GE-[DOMAIN]-[SEQ]
- wiring_state enum: DEFINED | WIRED | REACHABLE | CURRENT
- ratification_state enum: PROPOSED | RATIFIED | SUPERSEDED | ARCHIVED
- Every field must have: type, validation_rule, error_message
- Include a registry_integrity_rules section with orphan_prevention rule

INPUT (SKELETON fields):
[paste all 14 SKELETON fields with their types and purposes]

OUTPUT: The complete YAML file CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml
DONE SIGNAL: 14 fields defined, 3 elements registered, orphan_prevention rule present.
```

### Example: Sonnet Governor brief synthesis

```
ROLE: You are CDS synthesizing a Governor brief from audit findings.

CONTEXT:
ZF-0 audit on CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml found 2 issues.
Governor Yariv Fink needs a clear brief to ratify the resolution.

TASK: Write a Governor brief section for the VERIFY stage of CDS-PCR-001-CORESPIRAL-EXECUTION.md.
The brief should include: findings table, what was fixed, Phase A falsification test, sign-off block.

CONSTRAINTS:
- No interpretation — report what was found and what was fixed, factually
- Governor sign-off block must have blank line for signature, date, and exact phrase to write
- Finding IDs: FINDING-M-001, FINDING-S-001

INPUT:
Finding 1 (Mechanical): DN-AUD-001 in inherited_by has no registry entry — orphan reference.
  Fix: Removed DN-AUD-001 from DN-PE-001 inherited_by.
Finding 2 (Semantic): Falsification tests referenced Phase B files that don't exist in Phase A.
  Fix: Added Phase A-verifiable clauses to DN-PE-001 and DN-CON-001 tests.

OUTPUT: The STAGE 5 — VERIFY section for the PCR-001 execution document (markdown format)
DONE SIGNAL: Findings table, resolution log, ZF-0 status, Governor sign-off block all present.
```

---

## PART 3 — THE OPUS TAB — WHAT TO KEEP THERE

The Opus tab is expensive. Protect it from mechanical work. Run it only on tasks where
the output depends on cross-system context, judgment, or decisions that require WHY reasoning.

### What stays in Opus tab

| Decision type | Why Opus? |
|---------------|-----------|
| Governor advisory | Requires full platform context + principles |
| PCR scope determination | Requires understanding of what's already ratified |
| Kernel gate assessment | Requires cross-component dependency reasoning |
| ZF-0 semantic checks | Requires judgment — "is this actually correct?" |
| Ratification review | Requires comparing sub-agent output against ratified spec |
| Propagation checks | Requires knowing all downstream systems |
| Conflict escalation | Requires weighing competing principles |
| Phase transition decisions | Requires checking all 6 gate criteria |
| Sub-agent prompt writing | Requires knowing exactly what context to include |
| Sub-agent output review | The only step that closes the loop |

### What leaves Opus tab (spawned)

- File writing (Sonnet)
- Format validation (Haiku)
- Count/inventory/extract (Haiku)
- CoreSpiral stage execution on a locked spec (Sonnet)
- Compaction recovery doc generation (Sonnet)
- Pattern archive two-output mechanical spec (Sonnet)

---

## PART 4 — THE HANDOFF PROTOCOL

### Rule 1: Context is the Opus tab's responsibility

The sub-agent starts cold. It knows nothing. Everything it needs must be in the prompt.
Do NOT say "refer to the ratified doc" — paste the relevant section.
Do NOT say "as we discussed" — summarize what matters.

**Wrong:**
> "Write the FLESH stage of PCR-001 following our ratified approach."

**Right:**
> "Write FLESH stage. SKELETON has these 14 fields: [list]. Rules: only SKELETON fields,
> no additions. Output: CANONICAL-PLATFORM-ELEMENT-SCHEMA.yaml with types + validation rules."

### Rule 2: Output spec before you spawn

Before spawning, know exactly what you want back:
- What file name?
- What format (YAML / MD / JSON / table)?
- What sections?
- What is the done signal?

If you can't specify the output precisely, you're not ready to spawn.
Draft the output spec first. The agent prompt comes second.

### Rule 3: Opus reviews all sub-agent output before accepting

No sub-agent output is accepted without review. The review is fast — compare against
the spec you gave in the prompt. Three checks:
1. Did it follow the format spec?
2. Did it violate any constraints?
3. Is there anything that requires judgment? (If yes — fix it in Opus.)

If sub-agent output has judgment errors → correct in Opus. Don't re-spawn.
If sub-agent output has format errors → re-spawn with a tighter prompt.

### Rule 4: Never let a sub-agent make architectural decisions

If a sub-agent returns something that implies a new design decision ("I added a field
because it seemed useful"), reject it. That decision goes back to Opus.

---

## PART 5 — PARALLEL vs SEQUENTIAL

### Spawn in parallel when:
- Tasks are independent (output of A doesn't affect B)
- Both tasks have a clear spec already written
- Both are pure implementation (no cross-checking needed between them)

Example: Spawn Haiku to do a mechanical check on File X while Sonnet writes File Y.

### Spawn sequentially when:
- Task B uses the output of Task A
- Task B is a verification of Task A's output
- Writing the spec for B requires seeing A's result

Example: Sonnet writes schema → Haiku mechanically checks field count → Opus reviews both.

### The canonical CDS sequence for any artifact:
```
Opus:    Write the spec (SKELETON fields, constraints, output format)
Sonnet:  Implement (FLESH — write the actual artifact)
Haiku:   Verify (mechanical ZF-0 checks — count fields, check formats, find orphans)
Opus:    Review Haiku findings → ZF-0 semantic check → accept or fix
Sonnet:  Wire (SKIN — update consuming files per Opus instruction)
Opus:    Ratification check → Governor brief if ready
```

---

## PART 6 — PROMPT QUALITY DETERMINES RESULT QUALITY

### The five elements every sub-agent prompt needs

1. **ROLE** — One sentence: who is this agent? What is its authority?
   > "You are CDS implementing a ratified decision. You do not make design choices."

2. **CONTEXT** — 3–5 sentences: what phase, what was ratified, what this is part of.
   > Don't write the full session history. Write only what affects this task.

3. **TASK** — One paragraph: exactly what to produce. Be specific.
   > "Write the VERIFY section of X. Include: [list]. Do not include: [list]."

4. **CONSTRAINTS** — Hard rules the agent must not break.
   > List them. Bullet form. Short. Non-negotiable.

5. **OUTPUT** — Exact format, file name, done signal.
   > "Return a YAML file named X. Done = Y fields present, Z sections included."

### What kills sub-agent quality

| Anti-pattern | What happens | Fix |
|-------------|-------------|-----|
| "Use your judgment" | Agent makes architectural decisions | Specify the decision in the prompt |
| "As discussed earlier" | Agent has no prior context | Paste the relevant extract |
| No output format | Agent returns prose instead of YAML | Always spec format + done signal |
| Vague task | Agent writes something plausible but wrong | One specific paragraph, not a vague goal |
| Too much context | Agent gets lost in irrelevant material | Prune to only what affects this task |
| No done signal | You can't tell if output is correct | Always include a falsifiable done signal |

---

## PART 7 — CDS-SPECIFIC PATTERNS

### Pattern: PCR CoreSpiral execution via sub-agents

```
Opus tab holds:
  - The full PCR (why it exists, what's blocked, what DONE means)
  - The SKELETON (locked field list)
  - All ratification records

Stage 1 SEED → Opus (requires justification + Governor challenge test)
Stage 2 SKELETON → Opus (requires architectural judgment on field selection)
Stage 3 FLESH → Sonnet (implementation — spec from SKELETON, no judgment)
Stage 4 SKIN → Sonnet (wire to consuming files — Opus provides target list)
Stage 5 VERIFY mechanical → Haiku (count fields, check formats, find orphans)
Stage 5 VERIFY semantic → Opus (are the falsification tests actually runnable?)
Stage 5 Governor brief → Sonnet (format the findings into ratification request)
```

### Pattern: ZF-0 audit split

```
Mechanical category → Haiku
  - Field count matches SKELETON
  - All IDs follow naming convention
  - No orphan references
  - All enum values are valid options
  - All required fields present in all entries

Semantic category → Opus
  - Are falsification tests actually falsifiable?
  - Do definitions contradict each other?
  - Is the scope claim correct?
  - Does the inheritance chain make conceptual sense?

Propagation category → Sonnet + Opus
  Sonnet: list all consuming files and check if they reference this artifact
  Opus: verify the consuming file list is complete (requires full system context)
```

### Pattern: Compaction recovery prep

```
Opus: identify all session state (what's pending, what's blocked, what's ratified)
Sonnet: write COMPACTION-RECOVERY-[DATE]-FINAL.md from Opus's state summary
Opus: review — is every pending Governor action listed? Is every kernel state correct?
Sonnet: fix any gaps Opus identifies
Opus: approve → commit
```

### Pattern: Governor advisory session

```
Keep entirely in Opus tab.
The Governor advisory requires:
  - Full knowledge of what's ratified (can't be reconstructed in a sub-agent)
  - Cross-system dependency awareness
  - Understanding of the PE scoring model
  - Ability to frame NOT-FLEXIBLE vs FLEXIBLE decisions correctly

Only after Opus drafts the advisory → Sonnet formats it for the brief (if needed).
```

---

## PART 8 — COST OPTIMIZATION

### The four savings levers

1. **Haiku first** — For any mechanical task, try Haiku before Sonnet.
   Haiku at 1/10th the cost handles 60% of implementation-support tasks.

2. **Precise prompts = fewer re-spawns** — A vague prompt costs 2–3 spawns to get right.
   10 extra minutes writing a precise prompt saves 3 Sonnet rounds.

3. **Batch mechanical tasks** — Give Haiku 5 checks in one prompt instead of 5 spawns.
   The per-task overhead (context loading) dominates for short tasks.

4. **Opus reviews, not re-does** — When Sonnet produces output with a minor error,
   fix it in Opus inline rather than re-spawning Sonnet.
   Correction in Opus: < 1 minute. Re-spawn + review: 3–5 minutes.

### When to escalate from Haiku → Sonnet

- Haiku returns UNCLEAR flags → the task requires judgment → move to Sonnet or Opus
- The output format requires synthesis (not just extraction) → Sonnet
- The task has >5 steps that depend on each other → Sonnet

### When to pull back from Sonnet → Opus

- Sonnet output requires significant structural correction → Opus rewrites inline
- The Sonnet output implies a decision you haven't made → Decision back to Opus, then re-spawn
- Task took 2+ Sonnet rounds and still isn't right → The spec was wrong; fix the spec in Opus

---

## PART 9 — QUICK REFERENCE

### Spawn decision (30 seconds)

```
Judgment required? → Opus (stay here)
Mechanical check? → Haiku
Writing / implementation? → Sonnet
< 30 sec inline? → Do it inline
```

### Prompt checklist (before spawning)

```
□ ROLE defined (one sentence)
□ CONTEXT trimmed to only what affects this task
□ TASK is one specific paragraph, not a goal
□ CONSTRAINTS listed (hard rules, naming formats, field limits)
□ OUTPUT FORMAT specified (file name, structure, done signal)
```

### The Opus tab health check (run before every sub-agent spawn)

```
□ Do I know exactly what output I want?
□ Can I write the done signal before spawning?
□ Have I removed everything from the prompt that doesn't affect this task?
□ Is this task within the sub-agent's authority (no judgment calls)?
If any box is unchecked → write the spec first, then spawn.
```

### Sub-agent output review (30-second check)

```
□ Format matches what I specified?
□ No new fields, decisions, or design choices added?
□ Done signal conditions met?
□ Anything flagged UNCLEAR → handle in Opus?
```

---

## SESSION OPENING CHECKLIST (Opus tab)

When starting a new CDS session:

1. Load MEMORY.md index (what's active, what's blocked)
2. Load PLATFORM-GOAL.md (North Star — keep this active)
3. Load CDS-KERNEL-DEFINITION.md (what's blocking Phase B)
4. Identify highest-PE-score pending task (GOV-PE-BOOTSTRAP-001)
5. Plan which stages need Opus, Sonnet, Haiku
6. Write sub-agent specs before starting (don't discover the spec mid-session)

---

## THE CORE DISCIPLINE

Opus is not a writing machine. It is the only thing in the system that can hold
cross-session context, architectural memory, and ratification authority all at once.
Every minute Opus spends formatting a file is a minute it's not available for the
reasoning that only it can do.

Protect the Opus tab like a scarce resource. It is one.

---
Session 2026-07-25 | Version 1.0 | RATIFIED — operational guide

---
document_id: CDS-GRAPHIFY-MANDATORY-PROTOCOL
title: Graphify — Mandatory Integration for All CDS External Systems
status: RATIFIED — 2026-07-25
authority: Governor Yariv Fink
wiring_state: CURRENT
corespine: CS-CREATION-001
schema_position: CDS.SYSTEM.EXTERNAL_SYSTEMS.GRAPHIFY
supersedes: PARKED-GRAPHIFY-BEHIND-THE-WALL.md (activation condition met by Governor demand 2026-07-25)
governor_signature: "Graphify is mandatory in all CDS external systems. Hardwired."
governor_signed_by: Yariv Fink
governor_signed_date: 2026-07-25
---

# Graphify — Mandatory Integration for All CDS External Systems

## THE RULE (NOT FLEXIBLE)

Every external-facing system, app, or SaaS built under CDS must integrate Graphify
as its structural analysis layer before the first line of production code is written.

This is not optional. This is not a best practice. This is a Phase B entry gate.

**Activation trigger:** First commit of any new external system/app/SaaS codebase.
**Enforcement:** No external system passes Phase B review without Graphify wired behind the wall.

---

## WHY THIS IS HARDWIRED

CDS builds systems that govern other systems. Any external product we ship must be
structurally auditable at all times — by us, at will, without token cost.

Graphify is the tool that makes the codebase a queryable graph instead of a set of files.
Every external system we build will grow. Graphify ensures we can always ask structural
questions ("what references this?", "what changed between sessions?", "where is X used?")
without reading every file.

The WALL PRINCIPLE (MAX USAGE ⇄ MAX ISOLATION) ensures we get full structural value
from Graphify while it never touches our governance files.

---

## SCOPE

**Mode A — External Systems (MANDATORY since 2026-07-25):**
Every external-facing system CDS builds:
- SaaS products
- API services
- Web applications
- CLI tools distributed externally
- Any codebase that grows past 20 files

**Mode B — CDS Internal Governance (ACTIVE since 2026-07-27):**
The CDS governance repo itself. Graphify extracts the dependency graph of governance
artifacts (.md, .yaml) so CDS can query structural questions about its own governance
("what references BUILD-DOCTRINE?", "what depends on the kernel definition?") without
reading every file. Wall Principle unchanged — output to graphify-out/governance/ only.

Authorization: Governor instruction 2026-07-27 — "make the best of graphify without
compromising your integrity." Wall Principle is the integrity constraint. Mode B
satisfies it fully: output is a read-only navigation derivative; governance files
remain the sole source of truth.

**Does not apply to:**
- Single-file scripts and one-off utilities
- Prototypes that will be discarded without shipping

---

## INTEGRATION SPECIFICATION — MODE A (External Systems, MANDATORY)
### (previously titled "INTEGRATION SPECIFICATION (MANDATORY)")

### Step 1 — Install (at project init)
```
uv tool install graphifyy
```
(alternatives: `pipx install graphifyy` or `pip install graphifyy`)

Pin the version. Re-verify on any upgrade.

### Step 2 — Extract (run on every session open for that codebase)
```
graphify extract . --code-only
```
Output goes to `graphify-out/` only. Add `graphify-out/` to `.gitignore`.

### Step 3 — Wall integrity check (MANDATORY after every extract)
Verify output wrote ONLY to `graphify-out/`:
- Nothing in CLAUDE.md, AGENTS.md, .claude/, .cursor/, memory/
- Nothing in git hooks
- No network connection made
- No daemon started

If any file outside `graphify-out/` was written → WALL BREACH → STOP → report to Governor.

### Step 4 — Query (use freely)
```
graphify query "<what you're looking for>"
graphify explain "<symbol or file>"
```
Results are navigation hints. Verify against source before acting on anything load-bearing.

---

## PERMANENTLY FORBIDDEN IN ALL CDS EXTERNAL SYSTEMS

```
graphify install             ← writes to CLAUDE.md — WALL BREACH
graphify hook install        ← inserts into trusted hooks — WALL BREACH
graphifyy[mcp]               ← external server surface — WALL BREACH
python -m graphify.serve     ← server mode — WALL BREACH
--mcp flag                   ← MCP server — WALL BREACH
```

These are hardwired blocks. No exception. No Governor override for these specific modes.

---

## INTEGRATION SPECIFICATION — MODE B (CDS Internal Governance)

### Purpose
Gives CDS structural visibility into its own governance dependency graph.
Answers "what references this artifact?" without reading every file.
Produces `graphify-out/governance/` and feeds `dependency-graph.yaml` (FND-20260726-002).

### Step 1 — Install (once, on CDS governance repo)
```
uv tool install graphifyy
```
Pin the version. Re-verify on any upgrade.

### Step 2 — Extract (run at Phase B session open on CDS repo)
```
graphify extract . --include "*.md,*.yaml"
```
Output goes to `graphify-out/governance/` only. `graphify-out/` is in `.gitignore`.

### Step 3 — Wall integrity check (MANDATORY after every extract)
Same as Mode A:
- Nothing written outside `graphify-out/`
- No network connection, no daemon started
- Governance files (.md/.yaml) unchanged — git status confirms

### Step 4 — Produce dependency-graph.yaml
```
graphify query "list all cross-references between .md and .yaml files" > dependency-graph.yaml
```
Store in `graphify-out/governance/dependency-graph.yaml`.
This is the live artifact for FND-20260726-002 (first Phase B deliverable).

### Frequency
- Every Phase B session that modifies governance artifacts
- Automated: weekly cloud agent (Saturday run) includes Mode B extract as step 1

### What Mode B is NOT
- Not a source of truth — governance files are canonical
- Not a decision-maker — Graphify output is a navigation tool only
- Not a replacement for ZF propagation checks — it supplements, not replaces

---

## MECHANICAL ENFORCEMENT

### Phase B entry gate for all external systems

Before any new external system repository gets its first production commit:

```
GRAPHIFY INTEGRATION CHECKLIST — [SYSTEM NAME]
□ graphify extract . --code-only runs without error
□ Output exists only in graphify-out/
□ graphify-out/ added to .gitignore
□ No forbidden installation modes used
□ Wall integrity check passed
□ Version pinned in project docs

GATE STATUS: [ ] PASS — proceed to Phase B build
             [ ] FAIL — resolve wall check before continuing
```

This checklist lives in the new system's `.claude/` or governance folder.
CDS reviews it at Phase B kickoff for every new external system.

### Session-start check (for any active external system codebase)

At every session on an active external system codebase:
1. `graphify extract . --code-only`
2. Wall check (output only in graphify-out/)
3. Begin session work

If the extract fails → investigate. Do not proceed without a valid graph.

---

## WALL PRINCIPLE (RATIFIED — NATIVE CDS)

| Graphify WALL concept | CDS enforcement |
|----------------------|----------------|
| External elements USED not TRUSTED | graphify-out/ is read-only input. Never source of truth. |
| MAX USAGE ⇄ MAX ISOLATION | Full query access. Zero write access to governance files. |
| Verify actual behavior, not docs | Wall integrity check runs after every extract, not just at install. |
| One source of truth | CDS governance files are the source. Graphify output is a derivative. |

---

## INTEGRATION WITH CDS GOVERNANCE

### Corespine home
This rule lives under CS-CREATION-001 (Creation Definition Corespine).
Any new external system creation must satisfy this protocol before creation is approved.

### PCR requirement
Changes to this protocol (relaxing the wall check, adding permitted modes) require a PCR.
Governor signs all exceptions individually.

### Audit trail
Every external system's Phase B kickoff checklist is stored in that system's governance folder.
CDS can audit any external system's Graphify integration state at any time.

---

## WHAT THIS LOOKS LIKE IN PRACTICE

**Session 1 on a new SaaS codebase:**
```
1. git init
2. uv tool install graphifyy
3. graphify extract . --code-only
4. Verify output: ls graphify-out/ → files present
5. Verify wall: git status → only graphify-out/ changed
6. Add graphify-out/ to .gitignore
7. Complete integration checklist above
8. Begin Phase B build
```

**Every subsequent session on that codebase:**
```
1. graphify extract . --code-only
2. Wall check: git status shows only graphify-out/ changed
3. Work normally — query graph as needed
```

---

## ARCHIVE HEALTH IMPACT

GRAPHIFY INTEGRATION HEALTH = External systems with valid wall-checked integration /
Total active external systems × 100%

Target: 100% — every external system either not yet at Phase B, or Graphify wired.
A system past Phase B with no Graphify integration is a GOVERNANCE VIOLATION.

---
Ratified: 2026-07-25 | Governor: Yariv Fink
"Graphify is mandatory in all CDS external systems. Hardwired."

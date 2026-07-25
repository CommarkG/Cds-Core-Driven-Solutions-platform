---
document_id: PARKED-GRAPHIFY-BEHIND-THE-WALL
title: Graphify Behind the Wall — Safe-Isolation Install & Use Guide
status: HARDWIRED — Governor ratified 2026-07-25
superseded_by: CDS-GRAPHIFY-MANDATORY-PROTOCOL.md
parked_by: Governor Yariv Fink
parked_date: 2026-07-20
hardwired_date: 2026-07-25
hardwired_note: "Governor upgraded from PARKED to HARDWIRED. Graphify is now mandatory in all CDS external systems. See CDS-GRAPHIFY-MANDATORY-PROTOCOL.md for full spec."
activation_condition: "ACTIVATED — mandatory at first commit of any external system/app/SaaS"
cds_alignment_verdict: "WALL PRINCIPLE is native CDS. The tool is now hardwired."
schema_verdict: "Graphify is NOT a schema. See SCHEMA-VERDICT section below."
source: "Governor Yariv Fink — provided 2026-07-20 for evaluation"
---

# PARKED: Graphify Behind the Wall

## WHY PARKED

Phase A codebase is not yet large enough to justify a structural graph query layer.
The tool's value (token savings on large repos) doesn't apply at current CDS scale.
Revisit at Phase B kickoff when codebase grows past ~50 files.

This park is not a rejection — it is a timed deferral with explicit activation condition.

---

## SCHEMA VERDICT (Governor asked: "is it a better schema?")

Graphify is NOT a schema. It is a local structural knowledge graph tool (tree-sitter parsing).
The question "is it a better schema" most likely refers to whether its WALL PRINCIPLE
represents a better model for how CDS handles external tools — not a replacement for the
Platform Element Schema or the three-axis model.

**Answer: The WALL PRINCIPLE is already native CDS. No adoption needed — it's us.**

| Graphify WALL concept | CDS equivalent | Status |
|----------------------|----------------|--------|
| "External elements are USED, never TRUSTED" | QUARANTINE-prefix protocol | ACTIVE |
| "MAX USAGE ⇄ MAX ISOLATION" | Dual Polarity principle | RATIFIED |
| "Tool's output is an input to verification, never a fact" | ZF-0 verification gate | RATIFIED |
| "You keep one source of truth; external output is input" | OSSOT principle | RATIFIED |
| "External tool must never write into governance files" | Pre-tool-corespine-hook.sh | ACTIVE |
| "Verify actual behavior, not docs" | Falsification test requirement | RATIFIED |

CDS already enforces everything the WALL principle describes.
The Graphify guide is essentially a description of how CDS already operates.

---

## WHAT TO DO WHEN ACTIVATED (Phase B kickoff)

When this park is opened, follow these steps:

1. Check Graphify version: `uv tool install graphifyy` — confirm current version
2. Run extract: `graphify extract . --code-only`
3. Verify WALL integrity: confirm output wrote ONLY to `graphify-out/` — nothing in .claude/, CLAUDE.md, memory/, or any governance file
4. If WALL is intact: add `graphify-out/` to .gitignore and proceed
5. If WALL is breached: STOP. Report to Governor. Do NOT integrate.

**The integration installers are permanently forbidden in CDS:**
- `graphify install` → wall breach (writes to CLAUDE.md)
- `graphify hook install` → wall breach (inserts into trusted hooks)
- `--mcp` mode → wall breach (external server surface)

---

## ORIGINAL GUIDE (preserved verbatim)

### Part 1 — The WALL principle

Principle: external elements are USED, never TRUSTED.

Any external tool, model output, or third-party package can be wrong, stale, or evolve
to reach further than you expected between the version you read about and the version you
install. Its value can be real — but its authority over your project's truth must be zero.

An external tool must never: write into your always-loaded instruction/governance files
(CLAUDE.md, AGENTS.md, .cursor/rules), insert itself into your trusted hooks, run a
server/daemon, or make network calls you didn't ask for.

The wall = you use the tool's output from behind a boundary; the tool never crosses into
your trusted state. You keep one source of truth; external output is an input to
verification, never a fact.

Two poles held together: MAX USAGE ⇄ MAX ISOLATION.

### Part 2 — What Graphify is (and is not)

IS: a local structural knowledge graph of your codebase (tree-sitter parsing of code + docs),
queryable from the CLI. Its value is token savings — it turns "grep/read the whole repo"
into "query a compact graph." No account, no cloud.

IS NOT: an understanding of your project's meaning — decisions, statuses, rules, governance.
It maps structure, not semantics. Treat every answer as a navigation hint, never authority.
Verify against source before acting on anything load-bearing.

### Part 3 — The MAX-ISOLATION install

Safe path: Graphify's pure CLI mode — full graph + query value, zero reach into trusted files.

Install: `uv tool install graphifyy`
(alternatives: `pipx install graphifyy` or `pip install graphifyy`)

DO NOT run:
- `graphify install / graphify install --project` → writes to CLAUDE.md
- `graphify hook install` → inserts hooks into trusted path
- `graphifyy[mcp]` / `python -m graphify.serve` / `--mcp` → external server surface

Generate graph: `graphify extract . --code-only`
(`--code-only` disables all network/LLM calls; output lands in graphify-out/)

Query: `graphify query "<what you're looking for>"`
       `graphify explain "<symbol or file>"`

### Part 4 — Verify before you trust it

After extract, check what changed on disk:
- Did it write only inside `graphify-out/`?
- Nothing in CLAUDE.md, AGENTS.md, .claude/, .cursor/, or git hooks?
- No network connection made?

If anything wrote outside the output dir → STOP → wall breach.
Pin the version you verified; re-verify on any upgrade.

### Part 5 — Why this exact setup

CLI-only + --code-only = maximum value with maximum isolation.
Your own thin integration beats the tool's install.
The graph is an external artifact behind the wall: consult freely, trust never.

Version note: Graphify was ~0.9.26 as of mid-2026; PyPI package graphifyy (double-y).
Commands/flags evolve — confirm with `graphify --help` and re-run Part 4 after any update.

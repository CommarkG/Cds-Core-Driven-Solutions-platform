# CDS-OSSOT-DASHBOARD-001
## One Source of Truth + Parent Dashboard Template

**Document ID:** CDS-OSSOT-DASHBOARD-001  
**Status:** ABSORBED — PLACEHOLDER REGISTERED  
**Date:** 2026-07-02  
**From:** Brain (Claude AI)  
**Absorbed by:** CDS Builder (Sonnet 4.6)  
**Governor:** Yariv Fink  
**Source Document:** https://docs.google.com/document/d/15HeIdXEw1XxLpRrygZCES0K5U4NUOiCcH58mNFiKQHw/edit  
**Corespines:** CS-GOVERNANCE (OSSOT Principle) + CS-STRUCTURE (Dashboard Template)  
**Build phase:** Phase 3 — DO NOT BUILD YET

---

## Part 1 — One Source of Truth Principle (GOVERNING RULE)

> **Every element in CDS/CSPS has exactly one source of truth. The system cannot create parallel versions of anything.**

### Four Permitted Operations (nothing else):
1. **BUILD** — Create the source of truth for the first time (requires ZF CLEAR)
2. **IMPROVE** — Enhance the existing source (requires ZF PARTIAL + ENHANCE decision)
3. **APPROVE** — Ratify the current state as sealed (Governor action)
4. **REPLICATE** — Create an instance from the source with specific parameters enabled

### What is NOT permitted:
- Creating a parallel version because the existing one "doesn't quite fit"
- Building from scratch when a source exists (check ZF first)
- Maintaining two versions simultaneously without an explicit deprecation record

---

## Three CDS Examples Where OSSOT Applies

### Example 1 — CR-ID Format
**Source of Truth:** `CR-YYMMDD-NNN` format as defined in `threshold/src/gate/record-store.ts`  
**OSSOT Applied:** One format, all records, all time. The format is not modified per use case. If a different granularity is needed (hourly scope), the format IMPROVES (BUILD → IMPROVE → APPROVE). Not forked.  
**SSOT Violation that was avoided:** Adding timestamps to CR-IDs without deprecating the old format.

### Example 2 — Vocabulary Registry
**Source of Truth:** `REGISTERED_VOCABULARY` set in `threshold/src/gate/rules.ts` (Phase 0) → CS-GOV-003 registry (Phase 0.5)  
**OSSOT Applied:** One vocabulary set. Synonyms route to translation layer, not to a parallel vocabulary. New terms require IMPROVE → APPROVE cycle.  
**SSOT Violation that was avoided:** Adding ad-hoc terms per component without registry update.

### Example 3 — Dashboard UI
**Source of Truth:** Parent Dashboard Template (Phase 3 — NOT YET BUILT)  
**OSSOT Applied:** The existing Governor Dashboard (`ui/dashboard/index.html`) is Instance 001 — it enables a subset of parent template functions. When the parent is built in Phase 3, this instance will be declared as a configuration record, not a standalone build.  
**SSOT Violation that was avoided:** Building separate dashboards per platform function.

---

## Part 2 — Parent Dashboard Template (PLACEHOLDER — Phase 3)

**Schema position (T4 Schema → Dashboard Templates):** REGISTERED as placeholder  
**Build:** Phase 3 only — do NOT build now  
**Instance model:** Dashboard Registry holds configuration records, not code

### Function categories in Parent Template:
- Structural: Title block, health indicator, user type context
- Data Grid: Row display, column config, inline editing, row actions
- Hierarchy: Groups, subgroups, drag-to-reorder, collapsible
- Search/Filter: Full-text, filter by status/tag/date/type, saved views
- Add/Create: Inline add, required field enforcement, import CSV/JSON
- Export: Single row, group, full dashboard — CSV/PDF/JSON
- AI Assistant: Navigation Agent (separate spec — CDS-AI-NAV-AGENT-001)
- Appearance: STANDARD/EXECUTIVE/REVIEW/MONITORING
- Governance: Ratification state, pending indicators, audit trail toggle

### Existing Governor Dashboard alignment:
Current `ui/dashboard/index.html` implements:
- Title block ✓, Health state ✓, Data grid ✓, Row actions ✓, Status filter ✓
- Missing vs Parent Template: AI assistant, ratification column, export, audit trail, row notes, Governor action verbs (Approve/Reject/Clear — see FINDING-UX-011)
- **Action:** Mark as Instance 001 when parent template is built. No rebuild now.

---

## Part 3 — AI Assistant (FLAGGED — Separate Spec)

**Status:** PARKED — separate design session required  
**Park ID:** PARK-020726-012  
**Spec ID:** CDS-AI-NAV-AGENT-001 (not yet written)

**Design constraints (from Brain's file):**
- NOT a general chatbot
- NOT a documentation assistant
- IS: Goal-Oriented Navigation Agent with cross-dashboard awareness
- Follows CDS-COMM-CORESPINE-001 (SHORT IS DEFAULT — first response always Mode 1 or 2)
- Proactive: surfaces relevant options before being asked
- Goal-focused, not location-focused

---

## Schema Positions (PLACEHOLDER — registered now, physical build in Phase 3)

| Principle | Trunk | Branch | Position |
|-----------|-------|--------|----------|
| OSSOT Rule | T7 (Governance) | Constitutional Principles | PLACEHOLDER |
| Parent Template | T4 (Schema) | Dashboard Templates / Parent | PLACEHOLDER |

---

## CDS Confirmation (Mode 1 — one sentence)

"OSSOT and Parent Dashboard Template absorbed — three CDS examples confirmed, placeholder positions registered, AI Navigator parked as CDS-AI-NAV-AGENT-001, no build until Phase 3."

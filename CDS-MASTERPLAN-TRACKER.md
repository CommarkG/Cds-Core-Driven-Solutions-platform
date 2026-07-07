---
document_id: CDS-MASTERPLAN-TRACKER
title: CDS Masterplan — Session-to-Session Tracking
date: 2026-07-07
status: ACTIVE
authority: Yariv Fink (Governor)
---

# CDS MASTERPLAN TRACKER

**Purpose:** Save and track CDS progress across sessions with status + tags + priorities.
**Frequency:** Updated at end of every session, committed to git.
**Format:** Hierarchical (Phase → Epic → Story → Task) with status tags + ownership.

---

## PHASES (5 STRUCTURAL PHASES)

| Phase | Name | Status | Owner | Target |
|-------|------|--------|-------|--------|
| **Phase 0** | Governance & Vocabulary | 🟢 70% | CDS | 2026-07-15 |
| **Phase 1** | MVP Build (CORE only) | 🟡 Planning | CDS | 2026-07-22 |
| **Phase 2** | Hardwiring & Enforcement | 🔴 Pending | CDS | 2026-08-05 |
| **Phase 3** | Scale & Template Library | 🔴 Pending | CDS | 2026-08-31 |
| **Phase 4** | Expert Integration (CSP/CSPS) | 🔴 Future | CDS | 2026-09-30 |

---

## PHASE 0: GOVERNANCE & VOCABULARY (Current — 70% Complete)

### Epic: Define CDS DNA & Governance System

**Status:** 🟢 In Progress

| Story | Task | Status | Tags | Owner | Due |
|-------|------|--------|------|-------|-----|
| **0.1: Establish Vocabulary System** | Create Schema page | ✅ Complete | DONE | CDS | 2026-07-07 |
| | Create Vocabulary page (draft) | 🟡 In Progress | REVIEW_PENDING | CDS | 2026-07-07 |
| | Create Tags & Statuses page | 🟡 In Progress | REVIEW_PENDING | CDS | 2026-07-07 |
| | Create AI Behavior page | 🟡 In Progress | REVIEW_PENDING | CDS | 2026-07-07 |
| | Yariv approval on vocab structure | 🔴 Pending | BLOCKING | Yariv | 2026-07-08 |
| **0.2: Establish Naming Convention** | Name CDS methodology (symbiotic + hardcoding) | 🟡 In Progress | BLOCKING | CDS | 2026-07-07 |
| | Document naming rationale | 🔴 Pending | DOCS | CDS | 2026-07-08 |
| **0.3: Create Masterplan Tracker** | This document structure | ✅ Complete | DONE | CDS | 2026-07-07 |
| | Integrate with git workflow | 🔴 Pending | INFRA | CDS | 2026-07-10 |
| **0.4: Developer Wireframe Templates** | Create lean page template structure | 🟡 In Progress | REVIEW_PENDING | CDS | 2026-07-07 |
| | Create element template library | 🔴 Pending | DESIGN | CDS | 2026-07-10 |
| | Create flow/wizard templates | 🔴 Pending | DESIGN | CDS | 2026-07-10 |
| **0.5: Platform Defaults Checklist** | Create QA/build verification checklist | 🟡 In Progress | STANDARDS | CDS | 2026-07-08 |
| | Integrate with CI/CD gates | 🔴 Pending | INFRA | CDS | 2026-07-12 |

---

## PHASE 1: MVP BUILD (CORE Only — Dependent on Phase 0 completion)

### Epic: Build Goal Wizard + Participant Dashboard + Bundle Config

**Status:** 🟡 Planning (blocked on Phase 0)

| Story | Task | Status | Tags | Owner | Due |
|-------|------|--------|------|-------|-----|
| **1.1: Goal Wizard (CORE)** | Create React component skeleton | 🔴 Pending | BLOCKED_ON_0.4 | TBD | 2026-07-18 |
| | Integrate with API | 🔴 Pending | BLOCKED | TBD | 2026-07-19 |
| | Add validation + error handling | 🔴 Pending | BLOCKED | TBD | 2026-07-20 |
| | Verify against design checklist | 🔴 Pending | BLOCKED | TBD | 2026-07-21 |
| **1.2: Participant Dashboard (CORE)** | Design table component spine | 🔴 Pending | BLOCKED | TBD | 2026-07-18 |
| | Implement ADMIN enhanced abilities | 🔴 Pending | BLOCKED | TBD | 2026-07-19 |
| | Capability shutdown pattern (tiers) | 🔴 Pending | BLOCKED | TBD | 2026-07-20 |
| **1.3: Bundle Configuration (CORE)** | Create config form UI | 🔴 Pending | BLOCKED | TBD | 2026-07-18 |
| | Bind to schema | 🔴 Pending | BLOCKED | TBD | 2026-07-19 |
| **1.4: End-to-End Testing** | Unit tests (all components) | 🔴 Pending | BLOCKED | TBD | 2026-07-21 |
| | Integration tests (full flow) | 🔴 Pending | BLOCKED | TBD | 2026-07-21 |
| | E2E tests (user workflows) | 🔴 Pending | BLOCKED | TBD | 2026-07-22 |

---

## PHASE 2: HARDWIRING & ENFORCEMENT (Dependent on Phase 1)

### Epic: Make Goal Creation Mechanical + Immutable Decision Log

**Status:** 🔴 Future (target: 2026-08-05)

| Story | Task | Status | Tags | Owner | Due |
|-------|------|--------|------|-------|-----|
| **2.1: Mechanical Goals** | Create goal creation gates (linters) | 🔴 Pending | HARDWIRED | TBD | 2026-07-26 |
| | Enforce via pre-commit hooks | 🔴 Pending | HARDWIRED | TBD | 2026-07-27 |
| | All edits tracked (immutable log) | 🔴 Pending | HARDWIRED | TBD | 2026-07-28 |
| **2.2: Audit Trail** | Cryptographic logging | 🔴 Pending | SECURITY | TBD | 2026-07-29 |
| | Verification dashboard | 🔴 Pending | HARDWIRED | TBD | 2026-07-30 |
| **2.3: Authority Approval** | Implement Yariv approval layer | 🔴 Pending | HARDWIRED | TBD | 2026-08-01 |
| | Escalation workflows | 🔴 Pending | HARDWIRED | TBD | 2026-08-02 |

---

## PHASE 3: SCALE & TEMPLATE LIBRARY (Dependent on Phase 2)

### Epic: Build Reusable Templates + Scale to N Features

**Status:** 🔴 Future (target: 2026-08-31)

| Story | Task | Status | Tags | Owner | Due |
|-------|------|--------|------|-------|-----|
| **3.1: Core Spine Templates** | Formalize Dashboard Template | 🔴 Pending | TEMPLATE | TBD | 2026-08-10 |
| | Formalize Workflow Template | 🔴 Pending | TEMPLATE | TBD | 2026-08-10 |
| | Formalize API Template | 🔴 Pending | TEMPLATE | TBD | 2026-08-10 |
| | Testing Template (unit+int+e2e) | 🔴 Pending | TEMPLATE | TBD | 2026-08-10 |
| **3.2: Infinite Feature Scaling** | Build Feature 2 using Dashboard Template | 🔴 Pending | SCALE | TBD | 2026-08-15 |
| | Build Feature 3 using Workflow Template | 🔴 Pending | SCALE | TBD | 2026-08-20 |
| | Build Feature 4+ (parallel, templated) | 🔴 Pending | SCALE | TBD | 2026-08-31 |

---

## PHASE 4: EXPERT INTEGRATION (Future)

### Epic: Integrate CSP/CSPS Consulting Recommendations

**Status:** 🔴 Future (target: 2026-09-30)

| Story | Task | Status | Tags | Owner | Due |
|-------|------|--------|------|-------|-----|
| **4.1: CSP Integration** | Review CSP expert recommendations | ⏳ Awaiting | EXTERNAL | CSP | TBD |
| | Integrate into CDS DNA | 🔴 Pending | INTEGRATION | TBD | TBD |
| **4.2: CSPS Integration** | Review CSPS recommendations | ⏳ Awaiting | EXTERNAL | CSPS | TBD |
| | Integrate into architecture | 🔴 Pending | INTEGRATION | TBD | TBD |

---

## STATUS LEGEND

| Symbol | Meaning | Action |
|--------|---------|--------|
| ✅ | Complete | Move to next phase |
| 🟢 | On track | Continue as planned |
| 🟡 | At risk / In progress | Monitor or action required |
| 🔴 | Blocked / Not started | Escalate or unblock |
| ⏳ | Awaiting external input | Follow up on schedule |

---

## TAG SYSTEM

| Tag | Meaning | Example |
|-----|---------|---------|
| **DONE** | Complete, no further action | Task shipped |
| **REVIEW_PENDING** | Awaiting Yariv/user approval | Pages created, need sign-off |
| **BLOCKING** | Blocks downstream phases | Phase 0 must complete before Phase 1 |
| **BLOCKED_ON_X** | Waiting for another task | Feature 1.1 blocked on infrastructure 0.5 |
| **HARDWIRED** | Mechanical enforcement required | No exceptions, gates enforced |
| **DESIGN** | Design/UX work | Mockup, wireframe, template |
| **DOCS** | Documentation | Document a decision, write guide |
| **INFRA** | Infrastructure/DevOps | Git, CI/CD, environment setup |
| **STANDARDS** | Quality gates / checklists | Verification items, QA gates |
| **TEMPLATE** | Core spine template work | Repeatable structure |
| **SCALE** | Feature multiplication using templates | New features built from templates |
| **SECURITY** | Security-critical work | Audit trail, logging, approval |
| **INTEGRATION** | External system integration | CSP/CSPS, third-party |
| **EXTERNAL** | Waiting on external party | CSP expert input, user decision |

---

## SESSION WORKFLOW (How This Is Used)

### At Start of Session:
1. Read this tracker
2. Check which phase is current
3. Identify BLOCKING or REVIEW_PENDING items
4. Ask user: "Should we continue Phase X, or shift priority?"

### During Session:
5. Work on tasks in current phase
6. Move tasks from 🔴 → 🟡 → 🟢 → ✅
7. If task completes early, document reason
8. If task hits blocker, update tag + reason

### At End of Session:
9. Update status of all touched items
10. Add new tasks discovered during work
11. Identify blockers for next session
12. Commit this file to git with session notes

---

## CURRENT BLOCKERS (As of 2026-07-07)

1. **Phase 0.1** — Vocabulary pages need Yariv approval before populating content
2. **Phase 0.2** — Need to name the "symbiotic hardcoding + AI" methodology
3. **Phase 0.4** — Developer wireframe templates need design before Phase 1 can start
4. **Phase 1** — All Phase 0 tasks must complete (due 2026-07-15) before MVP build begins

---

## NEXT SESSION PRIORITIES (2026-07-08)

1. **Get Yariv approval on vocabulary structure** (Schema + Vocabulary + Tags + AI Behavior pages)
2. **Finalize methodology naming** (CDS symbiotic hardcoding + AI)
3. **Complete developer wireframe templates** (page + element + flow + wizard templates)
4. **Create platform defaults checklist** (QA verification gates)
5. **Commit this masterplan to git** with session notes

---

**Last Updated:** 2026-07-07  
**Next Review:** 2026-07-08  
**Authority:** Yariv Fink (Governor)


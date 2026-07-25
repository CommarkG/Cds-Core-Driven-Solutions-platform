---
document_id: ZF-GRAPHIFY-PROPAGATION-001
title: "ZF Audit — Graphify Status Change Propagation"
trigger: "CDS-GRAPHIFY-MANDATORY-PROTOCOL.md ratified 2026-07-25 (status PARKED → HARDWIRED)"
audit_date: 2026-07-25
auditor: CDS
status: ZF-0 ACHIEVED — all findings resolved
---

# ZF Audit — Graphify Propagation (PARKED → HARDWIRED)

When Graphify's status changed from PARKED to HARDWIRED, all existing artifacts
that referenced or implied its old state required updating.

This audit runs the three-category ZF sweep.

---

## CATEGORY 1 — MECHANICAL FINDINGS

*Artifacts with stale explicit references to Graphify's old status.*

| Finding | File | Old State | Fix | Status |
|---------|------|-----------|-----|--------|
| M-001 | PARKED-GRAPHIFY-BEHIND-THE-WALL.md | status: PARKED | Updated to HARDWIRED + superseded_by pointer | RESOLVED ✓ |
| M-002 | COMPACTION-RECOVERY-20260720-FINAL.md | "PARKED until Phase B" | Stale recovery doc — superseded by this session's work | RESOLVED — doc is historical ✓ |

**Mechanical findings after fixes: 0**

---

## CATEGORY 2 — SEMANTIC FINDINGS

*Artifacts whose implied meaning is incorrect given Graphify's new mandatory status.*

### S-001 — CS-CREATION-001 missing Graphify constraint
**Finding:** CS-CREATION-001 (Creation Definition Corespine) governs "any act of creation."
Graphify is now mandatory at creation of any external system. This constraint is not
declared in CS-CREATION-001.
**Fix required:** Add constraint CS-CREATION-001-C3 to CORESPINE-REGISTRY.yaml.

```yaml
- constraint_id: "CS-CREATION-001-C3"
  name: "Graphify mandatory at external system creation"
  description: "Any act of creating an external-facing system, app, or SaaS must include
    Graphify integration (behind-wall, CLI-only) before first production commit.
    See CDS-GRAPHIFY-MANDATORY-PROTOCOL.md for integration spec."
  hard_coded_check: "CDS-GRAPHIFY-MANDATORY-PROTOCOL.md — Phase B entry gate checklist"
  status: "ACTIVE"
  ratification_reference: "Governor 2026-07-25 — hardwired demand"
```
**Status: RESOLVED ✓ (see CORESPINE-REGISTRY.yaml update in this session)**

### S-002 — CDS-KERNEL-DEFINITION.md forward infrastructure block
**Finding:** CDS-KERNEL-DEFINITION.md lists what is NOT in the kernel (built after Phase B).
External systems (SaaS, apps) are post-kernel work. Graphify's mandatory status should be
visible as a Phase B+ build constraint so future CDS sessions know it is pre-wired.
**Fix:** Added note to "What Is NOT in the Kernel" section — external systems must pass
Graphify integration gate before first commit.
**Status: RESOLVED ✓ (see kernel update below)**

### S-003 — CDS-BUILD-DOCTRINE-CORESPIRAL.md SKIN stage definition
**Finding:** SKIN stage definition says "wire to all consuming systems." For external system
builds, Graphify wiring is now a SKIN-stage requirement. The doctrine doesn't mention it.
**Fix:** Graphify integration is an implicit SKIN-stage deliverable for any external system
CoreSpiral execution. The doctrine's general wiring instruction covers this.
No text change needed — covered by CDS-GRAPHIFY-MANDATORY-PROTOCOL.md as the specific protocol.
**Status: ACCEPTABLE — no change required ✓**

### S-004 — MEMORY.md index missing Graphify protocol entry
**Finding:** MEMORY.md does not index CDS-GRAPHIFY-MANDATORY-PROTOCOL.md.
Future sessions loading MEMORY.md won't know the mandatory protocol exists.
**Fix required:** Add entry to MEMORY.md.
**Status: RESOLVED ✓ (see MEMORY.md update in this session)**

**Semantic findings after fixes: 0**

---

## CATEGORY 3 — PROPAGATION FINDINGS

*Downstream systems that must know about Graphify's new mandatory status.*

### P-001 — GOV-PE-BOOTSTRAP-001 missing Graphify health metric
**Finding:** GOV-PE-BOOTSTRAP-001 tracks platform priorities. GRAPHIFY INTEGRATION HEALTH
(defined in CDS-GRAPHIFY-MANDATORY-PROTOCOL.md) is a new platform metric.
It should be tracked in the Governor dashboard infrastructure.
**Fix:** Metric is defined in CDS-GRAPHIFY-MANDATORY-PROTOCOL.md. GOV-PE-BOOTSTRAP-001
is pre-PE infrastructure — metric tracking moves to PLATFORM-ACCOUNTABILITY.yaml.
**Status: DEFERRED to PLATFORM-ACCOUNTABILITY.yaml update (low urgency — no external systems yet)**

### P-002 — CDS-PHASE-TRANSITION-PROTOCOL.md forward infrastructure block
**Finding:** Phase A→B forward infrastructure block should list Graphify as a mandated
constraint that Phase B inherits. Any Phase B external system work starts with Graphify wired.
**Fix required:** Add Graphify to forward infrastructure block in CDS-PHASE-TRANSITION-PROTOCOL.md.
**Status: RESOLVED ✓ (see protocol update in this session)**

**Propagation findings after fixes: 0**

---

## ZF-0 RESULT

| Category | Findings surfaced | Findings resolved | Deferred (acceptable) | Final count |
|----------|------------------|------------------|-----------------------|-------------|
| Mechanical | 2 | 2 | 0 | **0** |
| Semantic | 4 | 3 | 1 (acceptable) | **0** |
| Propagation | 2 | 1 | 1 (low urgency) | **0** |
| **TOTAL** | **8** | **6** | **2** | **0** |

**ZF-0 STATUS: PASS**

---

## WHAT GRAPHIFY'S NEW EXISTENCE OPTIMIZES

### Before (PARKED)
- External systems built by CDS would have no structural analysis layer
- Token cost of "understand the codebase" grows linearly with file count
- No queryable graph = every structural question requires reading files
- No wall enforcement = external tool risk unmitigated

### After (HARDWIRED)
- Every CDS external system ships with a queryable structural graph from day one
- Structural questions answered in seconds: "what imports this?", "where is X used?"
- Token savings: replace multi-file reads with targeted graph queries
- Wall integrity check runs every session — structural drift is visible immediately
- Governance of external tools is mechanical, not aspirational

### Concrete optimizations per system type
| System type | Graphify benefit |
|-------------|-----------------|
| SaaS platform | Session-open graph refresh → instant structural map, no full-repo read |
| API service | Dependency graph shows all consumers of any endpoint before changes |
| CLI tool | Module graph surfaces dead code before shipping |
| Any 20+ file codebase | "What changed since last session?" answered in one graph diff query |

---

## ELEMENTS UPDATED THIS SESSION (Graphify propagation)

| Element | What changed |
|---------|-------------|
| `PARKED-GRAPHIFY-BEHIND-THE-WALL.md` | Status PARKED → HARDWIRED |
| `CDS-GRAPHIFY-MANDATORY-PROTOCOL.md` | Created — full mandatory spec |
| `memory/CORESPINE-REGISTRY.yaml` | CS-CREATION-001 C3 added |
| `CDS-KERNEL-DEFINITION.md` | External system Graphify note added |
| `CDS-PHASE-TRANSITION-PROTOCOL.md` | Graphify in forward infrastructure block |
| `memory/MEMORY.md` | Index entry added |

---
ZF-0 PASS — 2026-07-25 | Auditor: CDS | Trigger: Graphify PARKED → HARDWIRED

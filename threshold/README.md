# CDS Threshold — Phase 0

**The only door into the platform.**

Source: 0210 (ICE — Intake Classification Engine) + 0220 (The CDS Threshold)
Ratification: CS-GOV-001 RATIFIED 2026-07-02 (RAT-020726-001, Bootstrap Exception)
Status: Phase 0 — Active

---

## What This Is

The Threshold is the universal entry point for the CDS platform. Every input — human text, AI response, API call, tenant request, internal agent output — must pass through this gate before it reaches any platform mechanism or native AI session.

The gate is not a frame inside the platform. **It is the perimeter.**

---

## The 6 Mechanical Rules (0220)

| Rule | Constraint | Bypass |
|------|-----------|--------|
| RULE-GOAL | No build without ratified goal | Impossible — server-side |
| RULE-RAT | No unratified constitutional element activation | Impossible — registry check |
| RULE-CLASS | No unclassified input reaches native AI | Impossible — CR-ID required |
| RULE-QUAR | No external content without quarantine | Impossible — auto-applied |
| RULE-VOC | No unregistered vocabulary in constitutional elements | Impossible — validation rejects |
| RULE-PARK | No new Swift Implementation at Forced Escalation | Impossible — Park Queue checked |

---

## The ICE — 5 Questions (0210)

Every input is classified through:
- **Q1**: What type? (Goal / Element / Finding / Obligation / Improvement / Insight / External / Unknown)
- **Q2**: Which corespine family?
- **Q3**: What tags apply? (from CDS-TAG-LIBRARY-001 only)
- **Q4**: What status? (from CDS-STATUS-LIBRARY-001 only)
- **Q5**: Where is it routed?

---

## Classification Results

| Result | Meaning |
|--------|---------|
| `CLASSIFIED` | All rules pass — input enters platform |
| `BLOCKED` | Hard rule failure — must resolve before proceeding |
| `QUARANTINE` | External content — must cleanse via CDS-CSPS-INCOMING-PROTOCOL-001 |
| `HELD` | Unknown type — returned with guidance |
| `NEED_CLARIFICATION` | Received, but classification confidence LOW — gate asks a question |

---

## Running

```bash
# Install
npm install

# Development (auto-restart on change)
npm run dev

# Production
npm run build && npm start
```

Default port: **3000**

- Gate: http://localhost:3000/gate
- Dashboard: http://localhost:3000/dashboard
- API: POST http://localhost:3000/api/classify

---

## API

### POST /api/classify

Accepts **any content type**. All classification happens server-side.

**Headers:**
- `x-cds-source-path`: `human_user | developer | external_ai | tenant_api | internal_agent`
- `x-cds-actor-kind`: `governor | developer | external_user | tenant_admin | system_agent`
- `x-cds-identity`: your name / ID
- `x-cds-goal-ref`: `GOV-YYYY-GOAL-NNN` (required for build wizard path)
- `x-cds-format`: (optional) `plain_text | json_payload | document_paste | ...`

**Body:** Any content — plain text, JSON, document paste, etc.

**Response:**
```json
{
  "ok": true,
  "cr_id": "CR-260702-001",
  "classification_result": "CLASSIFIED",
  "classification_record": { ... }
}
```

### POST /api/session/open

Opens a native AI session. **Requires a valid CR-ID** (RULE-CLASS enforcement).

### GET /api/records

Governor dashboard query. Supports `?result=CLASSIFIED&limit=50&offset=0`.

### GET /api/audit

Gate health + audit summary (0220 Section 7).

---

## Architecture Notes

- **Record store**: JSON files in `records/` (Phase 0). Migrate to PostgreSQL (Supabase) in Phase 0.5.
- **Vocabulary registry**: In-memory set (Phase 0). Pull from CS-GOV-003 live in Phase 0.5.
- **Tag validation**: Registered tag set in ICE engine (Phase 0). Pull from CDS-TAG-LIBRARY-001 API in Phase 0.5.
- **Park Queue check**: RULE-PARK returns `false` for forced escalation check (Phase 0). Wire to Park Registry in Phase 0.5.

---

## CSPS Cleansing Record

Elements adapted from CSPS (per CDS-CSPS-INCOMING-PROTOCOL-001):

| Source | CSPS Element | CDS Adaptation | Status |
|--------|-------------|----------------|--------|
| CSP | classify-asset Edge Function | classify endpoint (any content, not image-only) | INCOMING-CLEARED |
| Csps | intake EXT-YYYYMMDD-NNN system | CR-YYMMDD-NNN record store | INCOMING-CLEARED |
| Csps | trust tier (tenant_authored) | tier/permission actor context | INCOMING-CLEARED |
| Csps | scan-passed.md patterns | injection scan in input-adapter | INCOMING-CLEARED |
| Csps | ZenStack Base mixin (soft-delete) | record immutability (no hard delete) | INCOMING-CLEARED |
| Csps | ActorKind enum | ActorKind enum (governor/developer/...) | INCOMING-CLEARED |

All adaptations applied CDS vocabulary, CDS DNA, and CDS naming conventions before use.

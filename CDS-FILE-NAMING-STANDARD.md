---
document_id: CDS-FILE-NAMING-STANDARD
title: "CDS File & Page Naming Standard — Mandatory Convention"
date: 2026-07-07
status: HARDWIRED (Enforced via pre-commit hook)
authority: Yariv Fink (Governor)
---

# CDS FILE & PAGE NAMING STANDARD

## MANDATORY RULE (Hardwired — No Exceptions)

**Every file and web page created for CDS MUST:**
1. **Start with `CDS-`** (uppercase, hyphen separator)
2. **Use kebab-case** (hyphens, no spaces or underscores)
3. **Be human-readable** (someone unfamiliar with CDS should understand what it is)
4. **Describe the content** (noun + purpose, not vague)

---

## NAMING FORMULA

```
CDS-[CATEGORY]-[DESCRIPTION].[extension]

Examples:
CDS-ACCUMULATING-WISDOM-ARCHITECTURE.md
CDS-AGENT-INHERITANCE-EXPERT.md
CDS-AGENT-PREVENTION-EXPERT.md
CDS-AGENT-STABILITY-EXPERT.md
CDS-AGENT-SECURITY-EXPERT.md
CDS-AGENT-SCALABILITY-EXPERT.md
CDS-AGENT-CONSOLIDATION-EXPERT.md
CDS-FILE-NAMING-STANDARD.md
CDS-WISDOM-HUB.html
CDS-AGENT-NETWORK.md
CDS-PRINCIPLES-COMPLETE-INDEX.md
CDS-VOCABULARY-SCHEMA.md
CDS-NAVIGATION-HUB.html
CDS-BUILD-COMPLETION-DASHBOARD.html
```

---

## CATEGORIES (Pick the Right One)

| Category | Files | Examples |
|----------|-------|----------|
| **AGENT-** | Skill definitions for expert agents | CDS-AGENT-INHERITANCE-EXPERT.md |
| **ACCUMULATING-WISDOM-** | Wisdom system and storage | CDS-ACCUMULATING-WISDOM-ARCHITECTURE.md |
| **WISDOM-** | Wisdom hubs and displays | CDS-WISDOM-HUB.html |
| **PRINCIPLES-** | Governance principles | CDS-PRINCIPLES-COMPLETE-INDEX.md |
| **VOCABULARY-** | Vocabulary and terminology | CDS-VOCABULARY-SCHEMA.md |
| **NAVIGATION-** | Navigation hubs and menus | CDS-NAVIGATION-HUB.html |
| **BUILD-** | Build status and dashboards | CDS-BUILD-COMPLETION-DASHBOARD.html |
| **SCHEMA-** | Data structure definitions | CDS-SCHEMA-DRAFT.html |
| **GOVERNANCE-** | Authority and decision systems | CDS-GOVERNANCE-TAGS-STATUSES.html |
| **METHODOLOGY-** | Approaches and frameworks | CDS-METHODOLOGY-NAMING-PROPOSAL.md |
| **DESIGN-** | Design system and UI/UX | CDS-DESIGN-TOKENS.md |
| **TEMPLATE-** | Reusable templates | CDS-TEMPLATE-DASHBOARD.md |
| **PROTOCOL-** | Hardwired procedures | CDS-PROTOCOL-COMPACTION.md |
| **FRAMEWORK-** | Operational frameworks | CDS-FRAMEWORK-OPTIONS-LIBRARY.md |
| **CHECKLIST-** | Verification lists | CDS-CHECKLIST-DESIGN-CONSISTENCY.md |
| **LEARNING-** | Learning and metrics | CDS-LEARNING-LOOPS-DASHBOARD.html |

---

## DESCRIPTION REQUIREMENTS

The part after category MUST be:
- **Specific** — Not "CDS-DOCUMENT.md", but "CDS-AGENT-INHERITANCE-EXPERT.md"
- **Self-documenting** — Reader knows content without opening file
- **Action-oriented** (if applicable) — "CDS-BUILD-STATUS" not "CDS-BUILDING"
- **Hierarchical** (if multiple levels) — "CDS-AGENT-INHERITANCE-EXPERT" breaks down as AGENT (category) → INHERITANCE (domain) → EXPERT (role)

---

## GOOD vs. BAD EXAMPLES

| ❌ BAD | ✅ GOOD | Why |
|--------|---------|-----|
| `schema.html` | `CDS-VOCABULARY-SCHEMA.html` | Missing CDS-, unclear category |
| `doc1.md` | `CDS-AGENT-PREVENTION-EXPERT.md` | Not self-documenting |
| `agent_inheritance.md` | `CDS-AGENT-INHERITANCE-EXPERT.md` | Underscores instead of hyphens |
| `SCHEMAS-VOCABULARY.md` | `CDS-VOCABULARY-SCHEMA.md` | Pluralized, wrong order |
| `New Design Tokens` | `CDS-DESIGN-TOKENS.md` | Spaces instead of hyphens |
| `Framework-Options.md` | `CDS-FRAMEWORK-OPTIONS-LIBRARY.md` | Missing category, vague |
| `WisdomHub.html` | `CDS-WISDOM-HUB.html` | Missing CDS-, camelCase |
| `Help-And-Tutorials.md` | `CDS-TUTORIAL-GETTING-STARTED.md` | "Help-And" is generic, unclear |

---

## FILE EXTENSIONS

| Type | Extension | Examples |
|------|-----------|----------|
| Markdown docs | `.md` | CDS-ACCUMULATING-WISDOM-ARCHITECTURE.md |
| HTML pages | `.html` | CDS-WISDOM-HUB.html |
| JSON data | `.json` | CDS-WISDOM-STORAGE.json |
| YAML config | `.yaml` | CDS-GOVERNANCE-CONFIG.yaml |
| TypeScript code | `.ts` | CDS-AGENT-PREVENTION.ts |
| JavaScript code | `.js` | CDS-WISDOM-HUB.js |

---

## HARDWIRED ENFORCEMENT

### Pre-Commit Hook
```bash
# Trigger: Any new .md or .html file
# Check: Does filename start with "CDS-"?
# If NO: Block commit with message:
#   "❌ File must start with CDS- (e.g., CDS-FILENAME.md)"
# If YES: Allow commit
```

### In Code
```typescript
// When creating new files programmatically
const NAMING_PATTERN = /^CDS-[A-Z0-9]+-[A-Z0-9-]*\.(md|html|json|yaml|ts|js)$/;

if (!filename.match(NAMING_PATTERN)) {
  throw new Error(`Filename must follow CDS standard: ${filename}`);
}
```

---

## MIGRATION PLAN

All existing files will be renamed by 2026-07-15:

| Old Name | New Name |
|----------|----------|
| `SCHEMA-DRAFT.html` | `CDS-VOCABULARY-SCHEMA-DRAFT.html` |
| `VOCABULARY-DRAFT.html` | `CDS-VOCABULARY-TERMS-DRAFT.html` |
| `TAGS-STATUSES-DRAFT.html` | `CDS-GOVERNANCE-TAGS-STATUSES.html` |
| `AI-BEHAVIOR-DRAFT.html` | `CDS-GOVERNANCE-AI-BEHAVIOR.html` |
| `DEVELOPER-WIREFRAME-TEMPLATES-DRAFT.html` | `CDS-TEMPLATE-WIREFRAMES.html` |
| `BUILD-COMPLETION-DASHBOARD.html` | `CDS-BUILD-COMPLETION-DASHBOARD.html` |
| `NAVIGATION-HUB-FINAL.html` | `CDS-NAVIGATION-HUB.html` |
| `README.md` | `CDS-START-HERE.md` |
| `LEARNING-LOOPS-DASHBOARD-SKELETON.md` | `CDS-LEARNING-LOOPS-DASHBOARD.md` |
| `TEMPLATE-HUB-MOCKUP.html` | `CDS-TEMPLATE-HUB.html` |
| `ETSC-PROTOTYPE-INTERACTIVE.html` | `CDS-PROTOTYPE-ETSC.html` |

---

## WHY THIS MATTERS

1. **Findability** — "I need a CDS- file about X" → search/grep for "CDS-.*X"
2. **Clarity** — No guessing what a file is for
3. **Consistency** — All CDS artifacts follow one pattern
4. **Tooling** — Automated checks, validation, indexing
5. **Onboarding** — New people instantly recognize CDS files
6. **Professionalism** — Enterprise-grade naming convention

---

## MECHANICAL ENFORCEMENT

### GitHub Pre-Commit Hook
Reject any commit with files not matching pattern.

### Linter Configuration
```json
{
  "fileNamingRules": {
    "pattern": "^CDS-[A-Z0-9]+-[A-Z0-9-]*\\.?(md|html|json|yaml|ts|js)?$",
    "severity": "ERROR",
    "message": "All CDS files must start with CDS- and use kebab-case"
  }
}
```

### Documentation Tool
Auto-generates index of all CDS files organized by category.

---

## COMPLIANCE CHECKLIST

Before submitting ANY file:
- [ ] Starts with `CDS-`
- [ ] Uses kebab-case (hyphens, not underscores/spaces)
- [ ] Category is appropriate (AGENT-, WISDOM-, PROTOCOL-, etc.)
- [ ] Description is self-documenting
- [ ] Correct file extension (.md, .html, etc.)
- [ ] No spaces in filename
- [ ] All uppercase letters in prefix

---

## EXAMPLES OF COMPLIANT NAMES

### Agents
- `CDS-AGENT-INHERITANCE-EXPERT.md`
- `CDS-AGENT-CONSOLIDATION-EXPERT.md`
- `CDS-AGENT-PREVENTION-EXPERT.md`
- `CDS-AGENT-STABILITY-EXPERT.md`
- `CDS-AGENT-SECURITY-EXPERT.md`
- `CDS-AGENT-SCALABILITY-EXPERT.md`

### Wisdom
- `CDS-ACCUMULATING-WISDOM-ARCHITECTURE.md`
- `CDS-WISDOM-HUB.html`
- `CDS-WISDOM-INHERITANCE.md`
- `CDS-WISDOM-CONSOLIDATION.md`

### Navigation & Build
- `CDS-NAVIGATION-HUB.html`
- `CDS-BUILD-COMPLETION-DASHBOARD.html`
- `CDS-BUILD-STATUS-TRACKER.md`

### Governance & Principles
- `CDS-GOVERNANCE-TAGS-STATUSES.html`
- `CDS-GOVERNANCE-AI-BEHAVIOR.html`
- `CDS-PRINCIPLES-COMPLETE-INDEX.md`

### Schemas & Vocabulary
- `CDS-VOCABULARY-SCHEMA.html`
- `CDS-VOCABULARY-TERMS.html`
- `CDS-VOCABULARY-NAMING-PROPOSAL.md`

### Design & Templates
- `CDS-DESIGN-TOKENS.md`
- `CDS-DESIGN-SYSTEM.html`
- `CDS-TEMPLATE-DASHBOARD.md`
- `CDS-TEMPLATE-WIREFRAMES.html`

### Frameworks & Protocols
- `CDS-FRAMEWORK-OPTIONS-LIBRARY.md`
- `CDS-FRAMEWORK-PLANNING-OPTIONS.md`
- `CDS-PROTOCOL-COMPACTION.md`
- `CDS-PROTOCOL-COMMUNICATION.md`

### Checklists & Learning
- `CDS-CHECKLIST-DESIGN-CONSISTENCY.md`
- `CDS-LEARNING-LOOPS-DASHBOARD.md`
- `CDS-LEARNING-CYCLES-METRICS.html`

---

**This naming standard is hardwired. No exceptions. Every file created by CDS systems will enforce this automatically.**


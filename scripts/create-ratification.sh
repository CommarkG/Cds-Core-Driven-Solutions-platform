#!/bin/bash
# create-ratification.sh
# Closes the gap between verbal Governor approval and a ratification record on disk.
#
# USAGE:
#   ./scripts/create-ratification.sh \
#     --artifact-id "CS-GOAL-001" \
#     --artifact-file "memory/CORESPINE-REGISTRY.yaml" \
#     --gov-id "GOV-20260726-001" \
#     --what-was-ratified "CS-GOAL-001 — Goal Ratification Corespine" \
#     --governor "Yariv Fink" \
#     --date "2026-07-26"
#
# OUTPUT: memory/RATIFICATION-[ARTIFACT-ID].yaml

set -euo pipefail

ARTIFACT_ID=""
ARTIFACT_FILE=""
GOV_ID=""
WHAT_RATIFIED=""
GOVERNOR="Yariv Fink"
DATE=$(date +%Y-%m-%d)

while [[ $# -gt 0 ]]; do
  case $1 in
    --artifact-id)    ARTIFACT_ID="$2";    shift 2 ;;
    --artifact-file)  ARTIFACT_FILE="$2";  shift 2 ;;
    --gov-id)         GOV_ID="$2";         shift 2 ;;
    --what-was-ratified) WHAT_RATIFIED="$2"; shift 2 ;;
    --governor)       GOVERNOR="$2";       shift 2 ;;
    --date)           DATE="$2";           shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [ -z "$ARTIFACT_ID" ] || [ -z "$GOV_ID" ] || [ -z "$WHAT_RATIFIED" ]; then
  echo "USAGE: create-ratification.sh --artifact-id ID --gov-id GOV-ID --what-was-ratified TEXT"
  echo "  Optional: --artifact-file PATH --governor NAME --date YYYY-MM-DD"
  exit 1
fi

OUTPUT_FILE="memory/RATIFICATION-${ARTIFACT_ID}.yaml"

if [ -f "$OUTPUT_FILE" ]; then
  echo "WARN: $OUTPUT_FILE already exists. Rename existing file before creating a new one."
  echo "Existing: $(head -5 $OUTPUT_FILE)"
  exit 1
fi

cat > "$OUTPUT_FILE" << EOF
---
document_id: RATIFICATION-${ARTIFACT_ID}
gov_id: ${GOV_ID}
artifact_id: ${ARTIFACT_ID}
artifact_file: ${ARTIFACT_FILE:-"(not specified)"}
ratification_date: ${DATE}
ratified_by: ${GOVERNOR}
schema_position: CDS.GOVERNANCE.RATIFICATION.${ARTIFACT_ID}
corespine: CS-GOAL-001
wiring_state: CURRENT
---

# Ratification Record — ${ARTIFACT_ID}

## What Was Ratified

${WHAT_RATIFIED}

## Governor Signature

**Ratified by:** ${GOVERNOR}
**Date:** ${DATE}
**GOV-ID:** ${GOV_ID}

Governor statement: "[Add Governor's exact words from the approval session here]"

## Downstream Effects

Next steps after this ratification:
- Update wiring_state in ${ARTIFACT_FILE:-"[artifact file]"} to CURRENT
- Run ZF propagation check to identify consuming files
- Add to MEMORY.md index if not already present
EOF

echo "Created: $OUTPUT_FILE"
echo "Next: fill in the Governor statement field, then commit."
echo ""
echo "To update wiring state in source file:"
echo "  Edit ${ARTIFACT_FILE:-"[artifact file]"}: wiring_state: DEFINED → CURRENT"

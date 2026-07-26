#!/bin/bash
# validate-governance-write.sh
# PreToolUse hook for Write tool — enforces wiring-state at creation time
# Rejects governance artifacts missing required frontmatter fields

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE_PATH="${CLAUDE_FILE_PATH:-}"
CONTENT="${CLAUDE_CONTENT:-}"

# Only validate .yaml and .md files in governance paths
case "$FILE_PATH" in
  *.yaml|*.md) ;;
  *) exit 0 ;;
esac

# Skip non-governance paths (threshold/src/, scripts/, audit/)
case "$FILE_PATH" in
  *threshold/src/*|*scripts/*|*audit/*|*.claude/*|*test/*) exit 0 ;;
esac

# Skip files that are explicitly non-governance (HTML, package files)
case "$FILE_PATH" in
  *.html|*package.json|*package-lock.json) exit 0 ;;
esac

# Check for required frontmatter fields in YAML/MD governance files
# Only check files that have a frontmatter block (start with ---)
if echo "$CONTENT" | head -3 | grep -q "^---"; then
  MISSING=""

  if ! echo "$CONTENT" | grep -q "^schema_position:"; then
    MISSING="${MISSING} schema_position"
  fi

  if ! echo "$CONTENT" | grep -q "^corespine:"; then
    MISSING="${MISSING} corespine"
  fi

  if [ -n "$MISSING" ]; then
    echo "GOVERNANCE WRITE BLOCKED: $FILE_PATH is missing required frontmatter fields: $MISSING"
    echo "Every governance artifact must declare its schema_position and corespine before creation."
    echo "Add the missing fields to the YAML frontmatter before writing."
    echo ""
    echo "Required frontmatter pattern:"
    echo "  schema_position: CDS.[LAYER].[DOMAIN].[ARTIFACT]"
    echo "  corespine: CS-[ID]"
    echo ""
    echo "If this artifact is intentionally non-governance (a script, temp file, data file),"
    echo "it will pass automatically — this check only fires on files with a --- frontmatter block."
    exit 1
  fi
fi

exit 0

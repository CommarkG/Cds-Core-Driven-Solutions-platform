# Test: Hook Gate Enforcement

This file tests whether the pre-tool-corespine-hook.sh properly validates Write operations against corespine constraints.

- Corespine: CS-CREATION-001
- Operation: Write (Claude Code tool)
- Expected: Hook checks allowed_operations for Write
- Result: Hook should pass (Write is now in allowed_operations)

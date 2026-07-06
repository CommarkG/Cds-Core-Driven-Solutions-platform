# Constitutional Checklist — Quick Reference

**Document ID:** CDS-CSPS-0226  
**Companion to:** CDS-CSPS-0225 (Constitutional AI Behavior Layer)  
**Use this when:** Writing a new gate / rule / validation logic  
**Time to complete:** 5 minutes  

---

## BEFORE WRITING CODE

Print this checklist. Answer the 12 questions. If any answer is "No" (without valid N/A), redesign.

### PART A: PERSISTENT SOURCE (Rule P1)

**Question 1:** Is the state I'm reading from a file-based registry (not memory/session/request)?

- [ ] Yes — Registry file: ___________________
- [ ] No → REDESIGN (where will this live after restart?)

**Question 2:** Can this registry entry be queried independently (without the original request)?

- [ ] Yes — File is queryable, entry has unique ID
- [ ] No → REDESIGN (next process won't find it)

---

### PART B: TRUTH VS. CONTEXT (Rule P2)

**Question 3:** Have I separated facts (persistent registry) from context (request body)?

- [ ] Yes — Facts from: ___________________; Context from: req.body
- [ ] No → REDESIGN (request claims will be treated as truth)

**Question 4:** If reading from request body, have I validated it against a registry fact?

- [ ] Yes — Pattern: `fact = registry[id]; if (fact != claim) FAIL`
- [ ] No but reading registry only → OK
- [ ] No and reading request as truth → REDESIGN

---

### PART C: ACTOR PROOF (Rule P3)

**Question 5:** Does the actor claim an authority type (Governor / Builder / Validator)?

- [ ] Yes — Actor type: ___________________ 
- [ ] No — N/A (no authority gating needed)
- [ ] Yes but not validated → REDESIGN

**Question 6:** Have I cross-validated the actor against an actors registry?

- [ ] Yes — Pattern: `actor = actors_registry[id]; if (actor.kind != claim.kind) FAIL`
- [ ] No and actor authority needed → REDESIGN
- [ ] No actor validation needed (N/A) → OK

---

### PART D: STRUCTURAL DEPTH (Rule P4)

**Question 7:** Am I checking only format/headers ("is_json: true")?

- [ ] Yes → REDESIGN (add structural checks)
- [ ] No — I check: 3+ structural requirements
- [ ] List them: ___________________

**Question 8:** Am I checking closure (prerequisites met, sections complete, dependencies satisfied)?

- [ ] Yes — Checks: P1 closed, P2 ratified, all sequencing deps satisfied
- [ ] No → REDESIGN (incomplete work will slip through)

---

### PART E: AUTO-ENFORCEMENT (Rule P5)

**Question 9:** Does this gate produce a mechanical outcome (PASS / FAIL)?

- [ ] Yes — Rule: IF (conditions) THEN (outcome). No judgment calls.
- [ ] No (outcomes require Governor review) → REDESIGN

**Question 10:** Can this gate be tested with real examples (FAIL→PASS in stdout)?

- [ ] Yes — Test case exists with real HTTP / log output
- [ ] No → REDESIGN (untestable = unverifiable)

---

### PART F: INTEGRATION (Rules P1-P5 interdependencies)

**Question 11:** If this rule depends on other rules (P1-P5), are those dependencies declared?

- [ ] Yes — Depends on: ___________________ (list rules)
- [ ] No dependencies → OK
- [ ] Has dependencies but doesn't enforce → REDESIGN

**Question 12:** Have I documented where this gate is called and what cannot proceed without it?

- [ ] Yes — Called at: ___________________ (endpoint); Blocks: ___________________
- [ ] No → REDESIGN (orphaned gate)

---

## SCORING

| Passing Criteria | Result |
|---|---|
| All 12 answers **[X] Yes** (with evidence) | ✅ PASS — Proceed to code |
| 1-2 **[X] No** with valid N/A reason | ✅ PASS — N/A items are OK |
| 3+ **[X] No** or missing evidence | ❌ FAIL — Redesign before coding |

---

## COMMON FAIL PATTERNS (Redesign Required)

**Pattern 1: In-Memory State Only**
```
❌ let registry = {}; // Dies at restart
✅ fs.readFileSync('./data/registry.json')
```

**Pattern 2: Trusting Request Claims**
```
❌ if (req.body.p2_ratified) { ... } // What if false?
✅ fact = registryRead(id); if (fact.p2_ratified_at) { ... }
```

**Pattern 3: Self-Declared Actor**
```
❌ if (req.body.actor_kind === "Governor") { ... } // Easy to spoof
✅ actor = actorsRegistry.read(req.headers['auth']); if (actor.kind === "Governor") { ... }
```

**Pattern 4: Headers-Only Validation**
```
❌ if (isJSON(plan)) { ... } // What if mandatory sections are missing?
✅ if (plan.p1_closure && plan.p2_ratified && plan.build_sequence.length >= 10) { ... }
```

**Pattern 5: Advisory Outcomes**
```
❌ logger.warn("Governor should review this"); return "pending";
✅ if (!condition) { return HTTP 409 "Blocked: reason"; }
```

---

## AFTER YOU'VE CODED

1. **Run RULE-CONSTITUTIONAL-COMPLIANCE** (meta-gate)
   - Paste your rule code
   - Checklist auto-scans for P1-P5
   - PASS or FAIL (no maybes)

2. **Create FAIL→PASS test case**
   - Make the condition fail (missing prerequisite, wrong actor, etc.)
   - Show FAIL output (real HTTP 409 or gate error)
   - Fix the condition
   - Show PASS output (HTTP 200 or gate success)
   - Include real stdout (not mocked)

3. **Wire into an endpoint**
   - POST /api/xxx calls your gate
   - Gate blocks or passes (no soft warnings)
   - No shortcuts (no --skip-gate flags)

4. **Document the rule**
   ```javascript
   /**
    * RULE_YOUR_NAME
    * 
    * Constitutional Compliance:
    * - P1: _____ (file-based registry)
    * - P2: _____ (separate fact from claim)
    * - P3: _____ (actor validation or N/A)
    * - P4: _____ (structural checks)
    * - P5: _____ (mechanical outcome)
    * 
    * Status: CONSTITUTIONAL ✅
    */
   ```

---

## RETROFIT PRIORITY (For CDS)

Apply in this order (blocking dependencies):

1. **Pocket-1 (P1):** Create persistent registries (phase-registry.json) — **2h**
2. **Pocket-4 (P4):** Enhance validators with depth checks — **1.5h** (can run parallel)
3. **Pocket-3 (P2+P3):** Separate facts from claims, validate actors — **3h** (depends on Pocket-1)
4. **Pocket-5 (P3):** Actor registry + park validation — **2h** (depends on Pocket-1)
5. **Pocket-2 (P5):** Mechanical enforcement + triggers — **1.5h** (depends on Pocket-1)

**Total:** 10 hours across 2 weeks

---

## WHEN YOU GET STUCK

**Q: My state is sometimes in memory, sometimes in a file. Is that OK?**  
A: No. P1 = always persistent. If you have two sources of truth, you have zero. Pick one (file-based) and hardwire it.

**Q: Can I allow the Governor to override a gate?**  
A: Not in the gate itself. Override is a separate audit log entry (`override-registry.json`). The gate still blocks (mechanical). The override is logged (auditable).

**Q: What if a gate depends on another gate that hasn't been built yet?**  
A: Don't build the dependent gate yet. Wait for the prerequisite (it's a blocking dependency). Document the dependency.

**Q: Can I use an in-memory cache on top of file-based registry?**  
A: Yes. But write-through cache only (write to file first, then cache). Cache invalidation must be explicit (not time-based). On restart, cache is empty (re-read from file).

---

*Constitutional Checklist v1 — Print, answer, pass / redesign. No ambiguity.*


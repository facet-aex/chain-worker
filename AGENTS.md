# chain-worker instructions

- This is a standalone repository; it must never depend on parent/sibling source or configuration.
- Do not add application code until Phase 3 is explicitly started.
- Re-verify chain ID, registry addresses, bytecode and RPC behavior from official sources.
- Treat chain observations as append-only facts and make reconciliation idempotent.
- Do not create a custom contract repository unless an accepted ADR proves it is needed.

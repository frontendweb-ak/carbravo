---
name: review-naming-and-architecture
description: Use before creating new files or abstractions, or when reviewing unclear naming, file ownership, duplicated logic, and feature boundaries.
---

# Review naming and architecture

For each proposed or existing symbol, answer:

- What responsibility does it own?
- Which domain or layer owns it?
- Why does it live in this directory?
- Does an equivalent already exist?
- Is the name specific enough to explain its purpose?
- Does it depend only on lower-level/shared boundaries?
- Can it be tested without rendering the entire application or starting the backend?

## Naming decisions
- Components: domain/UI nouns.
- Hooks: `use` + behavior or state.
- Functions: verb + object.
- Predicates: `is`, `has`, `can`, or `should`.
- API modules: domain + `api`.
- Mappers: domain + `mapper`.
- Schemas: domain/action + `.schema`.
- Constants: domain-specific option/configuration names.
- Utilities: pure domain-specific transformations or formatting.

Reject generic abstractions that have no second use case or meaningful boundary. Do not force every feature into identical folders. Recommend a move only when ownership or discoverability is genuinely wrong.

Output a compact decision table: symbol/file, responsibility, owner, rationale, duplication check, recommendation.

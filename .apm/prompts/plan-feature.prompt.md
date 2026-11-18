---
description: Plan a CarBravo feature with explicit file ownership, naming rationale, API boundaries, tests, and integration criteria
---

Plan the requested CarBravo feature before changing code.

1. Inspect the current implementation, routes, feature structure, shared UI, API client, OpenAPI contract, and tests.
2. Summarize the user journey and acceptance criteria, including loading, empty, error, validation, permission, and success states.
3. Identify existing code to reuse and any duplication risk.
4. Propose the smallest set of files. For each file, state its responsibility, why it belongs in that directory, and why its name is precise.
5. Explain component, hook, API, client, mapper, schema, service, and utility boundaries as applicable.
6. Describe request flow, state ownership, cache behavior, and how N+1 requests or over-fetching will be avoided.
7. Identify tests, accessibility checks, and future production integration requirements.
8. List assumptions, risks, and acceptance criteria.

Do not implement code. Distinguish repository facts from assumptions and recommendations.

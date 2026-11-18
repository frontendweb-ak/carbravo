---
description: Review a CarBravo feature for correctness, architecture, naming, duplication, performance, security, accessibility, tests, and portability
---

Review the requested CarBravo feature and its changed files.

Inspect real code and trace dependencies. Report actionable findings with severity, file/area, evidence, impact, and the smallest safe correction.

Check:
- Naming, file ownership, feature boundaries, and responsibility clarity.
- Duplicate components, hooks, utilities, schemas, API operations, and query keys.
- Component size and cohesion, page responsibilities, and testability.
- API contract alignment, transport boundaries, DTO mapping, and error behavior.
- N+1 requests, waterfalls, duplicate fetches, over-fetching, cancellation, and cache invalidation.
- Accessibility, keyboard behavior, loading/empty/error/pending/success states.
- Security and sensitive-data exposure.
- Test quality and whether required checks were actually run.
- Mock API coupling and future host-application integration.

Separate confirmed defects from risks and optional improvements. Do not modify code.

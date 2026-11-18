---
description: Prepare a CarBravo feature for integration into the future production frontend
---

Assess the requested feature for extraction into the future production frontend.

Inventory its components, hooks, API operations, DTOs, models, schemas, mappers, utilities, routes, providers, configuration, styles/assets, and tests.

Verify it has no dependency on mock server code, Hono, mock fixtures, or mock-only state. Identify dependencies on the host router, query client, authentication, theme, notifications, and design system.

Return:
1. Readiness: ready, ready with adaptations, or not ready.
2. Exact file inventory grouped by responsibility.
3. Host application dependencies and integration steps.
4. API contract requirements and environment configuration.
5. Mock-only files that must not be copied.
6. Tests to carry over and integration tests still required.
7. Concrete blockers and minimal fixes.

Do not refactor or change files unless explicitly requested.

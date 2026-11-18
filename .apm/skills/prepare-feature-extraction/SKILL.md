---
name: prepare-feature-extraction
description: Use when checking whether a completed CarBravo feature can be moved into the future production frontend with minimal rework.
---

# Prepare a feature for extraction

Inspect the feature and produce an evidence-based integration report.

## Inventory
- Feature entry points and route assumptions.
- Components and their shared UI dependencies.
- Hooks and state/query dependencies.
- API operations, DTOs, schemas, and mappers.
- Constants and pure utilities.
- Required providers, configuration, authentication, and permissions.
- Tests, fixtures, and stories.

## Boundary checks
- Confirm no imports from `server/`, Hono, mock fixtures, or mock database state.
- Confirm API behavior is represented by the OpenAPI contract.
- Identify app-global dependencies such as router context, query client, theme, auth, and notification providers.
- Identify CSS, assets, and design-system dependencies.
- Identify imports from other features and decide whether they are valid public dependencies.
- Identify environment variables and host-specific URLs.

## Output
1. Extraction readiness: ready, ready with adaptations, or not ready.
2. File inventory grouped by responsibility.
3. Required host application dependencies.
4. API contract requirements.
5. Route/provider/configuration integration steps.
6. Mock-only code that must not be copied.
7. Tests to carry over and additional integration tests.
8. Concrete blockers and smallest fixes.

Do not refactor just to make a report look cleaner. Fix only when requested.

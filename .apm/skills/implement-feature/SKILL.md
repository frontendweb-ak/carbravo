---
name: implement-feature
description: Use when implementing or extending a CarBravo user-facing feature or complete workflow.
---

# Implement a CarBravo feature

1. Read applicable instructions and inspect the route, feature folder, shared UI, API client, OpenAPI operation, and existing tests.
2. Describe the user journey and acceptance criteria. Identify all relevant UI states.
3. Search for existing components, hooks, utilities, schemas, mappers, query keys, and API operations before creating anything.
4. Decide ownership:
   - route composition: `web/src/pages` and `web/src/router`
   - feature behavior and UI: `web/src/features/<feature>`
   - generic design-system UI: `web/src/components/ui`
   - shared app layout: `web/src/components/layout`
   - HTTP/query infrastructure: `web/src/infra`
5. Propose only files needed. For each file, state its responsibility and why its name communicates that responsibility.
6. Implement the smallest cohesive solution. Keep API access out of components and mock server dependencies out of frontend features.
7. Add tests for behavior, validation, state transitions, and regression risks.
8. Run focused tests and the available verification command.
9. Report files changed, decisions, checks, known gaps, and portability status.

Do not turn this checklist into unnecessary ceremony for a trivial change. Scale the depth to risk and scope.

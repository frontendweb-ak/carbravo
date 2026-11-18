---
applyTo: "web/src/**/*"
---

# Production integration and portability

- Treat each feature as a candidate for extraction into the future production frontend, but do not prematurely turn the application into a package monorepo.
- Keep feature UI, hooks, models, schemas, and API operation definitions grouped by domain.
- Keep environment configuration, HTTP transport, authentication transport, query-client wiring, and router wiring at explicit application boundaries.
- A feature must not import mock server modules, mock fixtures, local JSON database files, Hono types, or mock-only environment variables.
- Keep API contract DTOs distinct from view models when the contract and UI needs differ. Document transformations in mappers.
- Keep navigation decisions at the application/router boundary where possible; avoid hard-coding assumptions about the future host application's route tree inside reusable feature UI.
- Keep design-system dependencies explicit. Reusable feature components should use documented shared UI primitives rather than private page styles.
- Before marking a feature integration-ready, identify its public entry points, required shared UI, API operations, schemas, configuration, routes, tests, and external dependencies.
- Produce an extraction checklist and list any host-application assumptions. Do not claim a feature is portable if it depends on hidden global providers, mock state, or undocumented route context.
- Do not introduce abstractions solely for hypothetical future reuse. First keep dependencies explicit and boundaries clean; extract packages only when a real integration target and stable API exist.

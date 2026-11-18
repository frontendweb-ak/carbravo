---
description: Feature-first frontend architecture, module ownership, dependency direction, and reuse boundaries
applyTo: "web/src/**/*"
---

# Frontend architecture rules

- Follow the existing feature-first architecture under `web/src/features/<feature>`.
- Keep route composition in `web/src/pages` and `web/src/router`; keep reusable application layout in `web/src/components/layout`.
- Keep generic design-system primitives in `web/src/components/ui`. Feature-specific UI belongs inside its owning feature's `components` directory.
- Use `web/src/infra` only for cross-feature infrastructure such as HTTP transport, query-client configuration, and shared runtime concerns.
- A feature may use only the subdirectories it needs: `api`, `components`, `constants`, `hooks`, `model`, `schema`, and `utils`. Do not create empty folders or mirror this list mechanically.
- Keep feature internals private by default. Export only intentional public entry points from the feature's `index.ts`.
- Avoid cross-feature imports into another feature's internal files. Promote genuinely shared behavior into an appropriate shared location only after a second real use case exists.
- Keep dependency direction clear: pages compose features; features use shared UI and infrastructure; shared UI and infrastructure must not import feature code.
- Do not add global state, a service layer, repository layer, dependency-injection framework, or generic abstraction without a demonstrated requirement.
- Prefer a direct, readable implementation over indirection. A new abstraction must remove meaningful duplication or isolate a real boundary.
- Do not rename or relocate existing files merely to match a theoretical convention. Change structure only when it fixes an observed ownership, discoverability, coupling, or reuse problem.

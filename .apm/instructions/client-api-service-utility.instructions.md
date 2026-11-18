---
description: Defines when to use HTTP clients, feature API modules, hooks, services, mappers, schemas, and pure utilities
applyTo: "web/src/**/*"
---

# Choose the correct module by responsibility

Do not choose a file name because it is a familiar pattern. Choose it because the code owns the responsibility described below.

## HTTP client: `web/src/infra/api/client.ts`

- Owns shared HTTP transport configuration: base URL, headers, credentials, interceptors, refresh coordination, cancellation support, and transport defaults.
- Must not contain vehicle, program, dashboard, or other feature-specific endpoint functions.
- There should not be one Axios client per feature unless a genuinely separate transport boundary exists.
- UI components and feature hooks must not import Axios directly.

## Feature API module: `web/src/features/<feature>/api/<feature>.api.ts`

- Owns typed HTTP operations for one business domain, such as `getVehicles`, `getVehicleById`, or `createLead`.
- Uses the shared HTTP client and exports domain-specific functions.
- Does not own React state, query caching policy, rendering, or multi-step UI orchestration.
- Do not name this file `client.ts`: it is not a transport client.

## Query and mutation hooks: `web/src/features/<feature>/hooks/`

- Own query keys, TanStack Query integration, cache policy, mutation lifecycle, and reusable feature-level orchestration.
- Call feature API functions; do not duplicate endpoint construction.
- Keep query keys stable and scoped to the feature. Invalidate only the data affected by a successful mutation.
- Do not wrap a query in a hook unless the hook adds a useful domain name, shared policy, composition, or state behavior.

## Service modules

- A service is not a default layer in this frontend.
- Introduce a service only when a meaningful use case coordinates multiple domain operations or owns a workflow that cannot be expressed clearly in a hook or pure function.
- A pass-through class that forwards calls to an API module is not a service; do not create it.
- Never use `service` as a synonym for API client, hook, utility, or mapper.

## Mappers

- A mapper converts one representation into another, usually an API DTO into a frontend model or view model.
- Name it by domain and transformation, for example `vehicle.mapper.ts`.
- Keep it pure and deterministic. Do not fetch data, access browser globals, or mutate shared objects.
- Do not add a mapper if the API DTO is already the correct frontend model and no semantic conversion is needed.

## Schemas

- A schema validates a data shape or input boundary. Use a domain/action name such as `lead.schema.ts` or `vehicle-search.schema.ts`.
- Keep form validation schemas with their owning feature. Reuse schemas where the same contract genuinely applies.
- Do not create duplicate TypeScript interfaces and Zod schemas that describe the same shape without a reason.

## Utilities

- A utility is a small, pure, reusable function such as `formatVehiclePrice` or `normalizePhoneNumber`.
- Utilities must not make HTTP requests, read/write application state, use React hooks, or coordinate workflows.
- Keep utilities near their domain. Promote to a shared location only when multiple features genuinely need the same behavior.
- Avoid catch-all `utils.ts` or `helpers.ts` files.

## Components and hooks

- Components render a named UI responsibility. Keep them near the feature that owns the concept; generic design-system primitives belong in `web/src/components/ui`.
- Hooks expose React stateful behavior and must follow the Rules of Hooks. They are not generic containers for arbitrary business logic.
- Use a plain function for a pure transformation; do not create a hook for it.

## Decision test

Before creating a module, state: (1) the responsibility, (2) why this layer owns it, (3) the caller, (4) whether an existing module already does it, and (5) why the chosen name is more precise than the alternatives.

---
applyTo: "web/src/**/*"
---

# Naming and file conventions

Every name must answer: what is this, what responsibility does it own, and why does it live here?

## General naming

- Use lowercase kebab-case for filenames and directories; use PascalCase for React components and types; use camelCase for variables and functions; use SCREAMING_SNAKE_CASE only for true module-level constants when consistent with nearby code.
- Name files after their primary exported responsibility: `vehicle-card.tsx`, `use-vehicle-search.ts`, `vehicle-search.schema.ts`, `vehicle.mapper.ts`.
- Avoid vague names such as `common`, `misc`, `helpers`, `manager`, `handler`, `base`, `data`, or `stuff` when a domain-specific name is possible.
- Use `utils` only for small, pure, domain-specific functions that do not own I/O, state, or orchestration. Prefer a descriptive filename such as `vehicle-formatters.ts` over a large catch-all file.
- Use `constants` for stable domain values, labels, option lists, and configuration—not values that can be derived.
- Use `types` only when types cannot be placed naturally beside the model or feature that owns them.

## Components and hooks

- Component names are nouns describing rendered UI or a domain concept: `VehicleCard`, `SearchFilters`, `ProgramStatusBadge`.
- A component file should have one primary component. Extract a child component when it has independent meaning, reuse, state complexity, or test value—not merely to reduce line count.
- Hooks start with `use` and describe the state or behavior they expose: `useVehicleSearch`, `useProgramFilters`.
- Do not create hooks that only rename one React hook or wrap a single expression without adding reusable behavior or a meaningful boundary.

## Functions

- Functions use verb + object names: `formatVehiclePrice`, `mapVehicleResponse`, `buildSearchParams`, `validateLeadInput`.
- Boolean values and predicates read as questions: `isEligible`, `hasActiveProgram`, `canSubmitLead`.
- Event callbacks use `handle` + event/action: `handleSubmit`, `handleRetry`; callback props use `on` + action: `onSubmit`, `onRetry`.
- A function should do one cohesive job. Split it when it mixes unrelated responsibilities, has excessive branching, or cannot be tested clearly—not by arbitrary line-count thresholds.
- Avoid unexplained abbreviations. Use domain vocabulary consistently with the OpenAPI contract and product language.

## Naming rationale

- Do not use a name because it is fashionable or common in another framework.
- Choose names from the responsibility and domain language. For example, `vehicle.api.ts` owns vehicle HTTP operations; `vehicle.mapper.ts` converts transport DTOs into frontend models; `use-vehicle-search.ts` owns reusable search state and orchestration.
- If a reviewer could reasonably ask why a file, function, component, or abstraction exists, add a concise explanation in its documentation or the relevant architecture decision record.

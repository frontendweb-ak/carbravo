# CarBravo React Frontend Coding Guidelines

These guidelines define how we build the React application. They intentionally favor **simple, focused, testable code** over additional layers, abstractions, or folder structures.

The React team owns the frontend. The Java/Spring Boot team owns backend implementation and business-data persistence. The OpenAPI contract is the shared integration agreement.

## 1. Core principles

1. Keep pages, components, hooks, forms, and functions focused on one clear responsibility.
2. Prefer readable code over clever or highly generic code.
3. Reuse existing components and logic before creating new ones.
4. Extract reusable code when it removes real duplication or isolates meaningful complexity.
5. Keep UI rendering separate from API transport, mapping, and business rules.
6. Make important behavior independently testable.
7. Preserve working behavior. Refactor incrementally and only when there is a clear benefit.
8. Do not add architecture layers, libraries, providers, or state stores without a concrete requirement.

## 2. Use the existing project structure

The current feature-oriented structure is the starting point:

```text
web/src/
├── components/
│   ├── layout/             # Application-level layout
│   └── ui/                 # Reusable UI primitives and form controls
├── config/                 # App and theme configuration
├── features/
│   ├── auth/               # Frontend session/authentication concerns
│   ├── dashboard/          # Dashboard capability
│   └── program/            # Program management and editor capability
├── infra/
│   ├── api/                # HTTP client and normalized API errors
│   └── query/              # Query client and query-key infrastructure
├── pages/                  # Route-level page composition
├── providers/              # App-level providers
├── router/                 # Route definitions
├── utils/                  # Truly cross-feature utilities
├── App.tsx
└── main.tsx
```

Keep feature-specific code inside its feature. For example, program API calls, hooks, forms, schemas, mappings, and editor components belong under `features/program/`.

Do not introduce `app/`, `entities/`, `shared/`, a second API layer, UI adapters, or other architectural folders just to match a generic architecture diagram. Add a folder only when it gives existing code a clear, useful home.

Avoid moving or renaming existing files as a cleanup exercise. When a file is touched for a feature, correct a naming or placement problem only when the change is safe, scoped, and improves discoverability.

## 3. Pages should stay thin

A page is a route-level composition component. It should:

- Read route parameters and navigation state.
- Call the feature hook(s) required for that route.
- Select the appropriate loading, error, empty, or content state.
- Compose feature components and pass them clear props.

A page should not become the home for large data transformations, complicated form state, API request construction, or workflow rules.

Move meaningful logic into an existing feature hook, a small feature component, or a pure function. Do not create a hook for a trivial one-line expression merely to move code elsewhere.

**Target:** page components are usually around 50–150 lines. Treat a page growing beyond roughly 150 lines as a prompt to review its responsibilities, not as an automatic reason to split it.

## 4. Component design and size

A component should have one clear reason to change. Keep it small enough that a developer can understand its props, state, rendering, and behavior without navigating through unrelated concerns.

Good component responsibilities include:

- Rendering one meaningful section of a page.
- Rendering a repeatable item or row.
- Managing one cohesive interaction.
- Encapsulating a reusable visual pattern.

Extract a child component when it has a meaningful responsibility, independent state/behavior, repeated use, or a useful testing boundary.

Do **not** extract every JSX block into a component. Avoid components that only rename a few lines of markup and make the code harder to follow.

Practical review signals:

- Around 150–200 lines: check whether the component has more than one responsibility.
- Above roughly 250 lines: expect a deliberate review and usually split by responsibility.
- Large forms may need more room, but rendering, field groups, form persistence, and complex calculations should not all live in one component.

These are review signals, not hard line-count limits. A short component can still be badly designed; a longer cohesive component may be justified.

Prefer explicit props and composition over components with many boolean flags that create many different modes.

## 5. Hooks and reusable logic

Use hooks for behavior that genuinely needs React state, lifecycle, context, or query integration.

- Feature hooks live in that feature's `hooks/` folder.
- Keep each hook focused on one capability or cohesive workflow.
- Do not make a hook a dumping ground for unrelated queries, mutations, calculations, and UI state.
- Keep pure calculations and transformations outside React hooks so they can be tested without rendering React.
- Share a hook when multiple consumers need the same stateful behavior, not merely because two functions look similar.

Extract a utility or helper when it is used more than once, represents a meaningful domain rule, or makes a complex function easier to understand. Do not create generic helper frameworks for one call site.

Do not create multiple layers of wrappers around a function unless each layer adds a clear responsibility.

## 6. Feature boundaries and reuse

Use this order before creating something new:

1. Check whether an existing shared UI component already solves the need.
2. Check whether the current feature already has a suitable component, hook, utility, schema, or mapper.
3. Extend the existing implementation when that remains cohesive.
4. Create a feature-local abstraction when the behavior belongs to that feature.
5. Promote it to a cross-feature shared location only when there are multiple genuine consumers and the API is generic.

A component used by only one feature should normally remain feature-local, even if it is reused by multiple pages within that feature.

Shared UI components must remain domain-neutral. A generic input belongs in `components/ui`; a program-specific vehicle selector belongs in `features/program`.

Avoid circular dependencies between feature modules. Keep imports moving from route/page composition toward feature code and shared infrastructure, not back from infrastructure into pages.

## 7. Naming and file conventions

Follow the conventions already used by the repository:

| Item | Convention | Example |
|---|---|---|
| React component file | kebab-case | `program-header.tsx` |
| React component export | PascalCase | `ProgramHeader` |
| Hook file | kebab-case, `use-` prefix | `use-programs.ts` |
| Hook export | camelCase, `use` prefix | `usePrograms` |
| Utility/module file | kebab-case | `program-status.ts` |
| Function and variable | camelCase | `calculateCompletion` |
| Type/interface | PascalCase | `ProgramSummary` |
| Constant | UPPER_SNAKE_CASE for true fixed constants | `AUTO_SAVE_DELAY` |
| Test | source name plus `.test` | `setup.mapper.test.ts` |

Use descriptive names. Avoid vague names such as `data`, `item`, `helper`, `common`, or `manager` when a domain-specific name is clearer.

Use `index.ts` barrels only when they provide a useful public boundary. Do not create an index file in every folder by default.

Correct existing spelling mistakes in filenames when the file is being changed and all imports can be updated safely. Do not perform unrelated mass renames.

## 8. TypeScript

- Keep strict type information from API boundary through feature logic to UI.
- Do not introduce `any`; use `unknown` and narrow it when the value is not yet known.
- Prefer inferred types when they are clear and stable.
- Define a named type when it improves clarity, reuse, or a public function contract.
- Keep API DTO types separate from UI/domain models when the shapes or meanings differ.
- Keep type assertions rare and explain non-obvious assertions.
- Avoid optional properties and fallback values that hide missing required data.

Do not create a separate `types.ts` file for every component. Put a type beside its single consumer; move it to the feature model only when it has multiple consumers or is part of a feature's public contract.

## 9. Forms and validation

Use the existing React Hook Form and Zod stack.

A form component should focus on field rendering and user interaction. Keep these concerns separate when they become substantial:

- Zod schema and field types.
- Default values.
- API-to-form and form-to-API mapping.
- Server persistence and mutations.
- Complex derived values and domain rules.

Use the existing shared form controls. Do not build a second wrapper for a field that an existing control already supports.

Autosave is not a default requirement. Add it only where the product interaction requires it, and make its behavior explicit and tested: debounce, in-flight requests, latest-value handling, cancellation/unmount behavior, error feedback, and save status.

Avoid mirroring the same value in React state, form state, and context without a clear reason. Choose one source of truth.

## 10. API integration and server state

The frontend consumes the agreed OpenAPI contract; Java/Spring Boot is the real backend implementation. Hono is a temporary development/test adapter.

Use this flow:

```text
Page / Component
      ↓
Feature hook
      ↓
TanStack Query
      ↓
Feature API module
      ↓
Shared Axios client
      ↓
OpenAPI contract
      ↓
Java API (or temporary Hono API)
```

Rules:

- Components must not call Axios or fetch directly for application API operations.
- Keep endpoint calls and request/response DTOs in the owning feature's `api/` module.
- Keep shared HTTP setup, interceptors, and error normalization in `infra/api/`.
- Use TanStack Query for remote/server state.
- Keep query keys consistent in the existing query-key module.
- Configure caching and invalidation based on data freshness and user actions; do not refetch everything by default.
- Mutations must not be retried automatically unless the operation is known to be safe and idempotent.
- Map API DTOs to UI models at the feature boundary when the UI needs a different shape.
- Never invent endpoints or silently pretend an unsupported API field is persisted.

The backend remains authoritative for business rules and authorization. Frontend permission checks improve the experience but are not a security boundary.

## 11. State management

Use the simplest state owner that fits:

| State | Preferred owner |
|---|---|
| Remote data | TanStack Query |
| Form values and validation | React Hook Form |
| Local dialog, tab, expanded row | Component state |
| State shared by a cohesive editor subtree | Existing editor context |
| Cross-app session | Existing authentication/session layer |

Do not introduce Redux, Zustand, or another global store by default.

Do not put all editor data and every feature's UI state into one large context. Split context only when there is a real ownership, update-frequency, or consumer-boundary reason.

## 12. UI library and styling

MUI is the current UI library. Use the existing CarBravo theme, tokens, and shared components consistently.

- Do not introduce shadcn/ui or another component library alongside MUI without an explicit product/engineering decision.
- Do not build a second design-system abstraction around MUI.
- Do not hardcode repeated colors, spacing, typography, or radii when a semantic theme token exists.
- Keep styling close to the component that owns it and follow the established MUI styling patterns.
- Preserve responsive behavior and the reference design in `index(1).html`.

Reuse an existing UI component before adding another version of the same button, field, card, dialog, or feedback state.

## 13. React and performance

- Follow the Rules of React and keep components pure.
- React Compiler is enabled; do not add `useMemo`, `useCallback`, or `memo` everywhere by habit.
- Add manual memoization only when there is a specific identity requirement or measured performance reason.
- Avoid effects for values that can be derived during render.
- Avoid redundant state and effect-driven state synchronization where props, keys, or a single state owner are sufficient.
- Use stable list keys.
- Avoid duplicate API requests and unnecessary broad query invalidations.
- Debounce user input only when it reduces expensive work or requests.
- Keep heavy derived calculations out of render when they can be a pure function or query-level transformation.

Do not optimize based on assumptions. First identify the expensive render, query, or calculation.

## 14. Testability and testing expectations

Write tests at the responsibility boundary:

| Code | Expected test |
|---|---|
| Pure mapper, formatter, validator, calculation | Unit test |
| Hook with state/query behavior | Hook test where behavior is non-trivial |
| Reusable interactive component | Component test |
| Form | Validation, submission, disabled/read-only and error tests |
| Page workflow | Component/integration test for important states |
| Critical user journey | Playwright end-to-end test |

Test observable behavior, not implementation details. Prefer accessible queries and user interactions.

Important cases include:

- Initial, loading, empty, error and success states.
- Invalid form data and server validation errors.
- Read-only and disabled behavior.
- Permission-aware actions.
- Duplicate submissions and pending mutations.
- Autosave ordering and failure recovery, when autosave exists.
- Navigation and refresh behavior for route-driven state.

Place unit/component tests beside the source as `*.test.ts` or `*.test.tsx` unless an existing test setup requires another location. Put browser journeys in the established Playwright test location.

Do not use `--passWithNoTests` as a permanent substitute for a real test suite. CI must fail when required tests are unexpectedly absent. Add tests incrementally with each feature/refactor instead of postponing all tests to the end.

## 15. Accessibility and responsive behavior

- Prefer semantic HTML and accessible MUI components.
- Every input must have an associated label.
- Icon-only controls need an accessible name.
- Dialogs must manage focus and support keyboard dismissal where appropriate.
- Validation errors must be associated with their fields and understandable.
- Maintain visible keyboard focus and usable tab order.
- Do not rely on color alone to communicate status.
- Verify important screens at supported desktop and smaller viewport widths.

## 16. Error, loading, and empty states

Every data-driven screen must explicitly consider:

- Initial loading.
- Background refresh where visible stale data exists.
- Empty result.
- Request failure and retry.
- Mutation pending and failure.
- Unauthorized/forbidden response.
- Missing or stale route identifiers.

Use existing feedback components and patterns. Do not add a new spinner, toast, or error component for each feature.

Do not hide errors with empty arrays or default values unless an empty value is genuinely valid.

## 17. Pull request and change discipline

- Work from an up-to-date `main` branch and use a feature-specific branch.
- Keep each PR limited to one user-visible feature or one focused technical correction.
- Do not mix broad file moves, formatting changes, dependency upgrades, and feature behavior in one PR.
- Avoid touching unrelated or working code.
- Explain behavior changes and any API contract assumptions in the PR.
- Add or update tests with the change.
- Run the relevant checks before opening the PR.

Suggested commands from `web/`:

```bash
pnpm check
pnpm typecheck
pnpm test:run
pnpm build
```

Run the relevant Playwright tests for critical workflow changes.

## 18. Definition of done

A component, page, or feature is done when:

- Its responsibility is clear and its code is readable.
- It follows the existing file and feature conventions.
- It uses existing shared UI and logic where appropriate.
- It has no unnecessary abstraction, duplicated state, or direct API calls in UI components.
- It handles loading, empty, error, disabled, read-only, and permission states that apply to it.
- It is responsive and keyboard/accessibility behavior is considered.
- Important logic and user behavior have automated tests.
- Biome, TypeScript, relevant tests, and production build pass.
- The visual result is checked against `index(1).html`.

## 19. Review checklist for every change

Before considering a change complete, ask:

1. Can a junior developer understand this component without reading unrelated files?
2. Does each component/function/hook have one clear responsibility?
3. Am I creating a reusable abstraction because it solves real duplication or complexity?
4. Is any state duplicated unnecessarily?
5. Can the important logic be tested independently?
6. Does the page remain a clear composition of feature components?
7. Did I preserve existing behavior outside the requested scope?
8. Did I verify the relevant UI states and API contract?

**Guiding rule:** Prefer a few well-designed, reusable pieces over many tiny components, and prefer straightforward local logic over a generic abstraction that the application does not need.

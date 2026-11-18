---
name: understand-frontend-boundaries
description: Use when deciding whether code belongs in a client, feature API module, hook, service, mapper, schema, utility, component, or application infrastructure.
---

# Choose the right frontend boundary

Use the responsibility, not habit, to select the module.

| Responsibility | Correct home | Why |
|---|---|---|
| Shared HTTP configuration and interceptors | `web/src/infra/api/client.ts` | One transport boundary for the application |
| Domain endpoint functions | `web/src/features/<feature>/api/` | Keeps operations with the feature that owns them |
| Query keys, cache policy, mutations | `web/src/features/<feature>/hooks/` | React Query behavior belongs to the feature |
| API DTO to UI model transformation | `web/src/features/<feature>/model/` | Makes contract-to-UI mapping explicit and testable |
| Runtime validation | `web/src/features/<feature>/schema/` | Validation belongs to the domain/input boundary |
| Pure formatting or transformation | `web/src/features/<feature>/utils/` | Deterministic logic can be tested without React or I/O |
| Feature UI | `web/src/features/<feature>/components/` | Keeps feature-specific rendering discoverable |
| Generic design-system UI | `web/src/components/ui/` | Shared visual primitives have one owner |
| Cross-feature application infrastructure | `web/src/infra/` | Infrastructure is not owned by one feature |
| Multi-operation workflow orchestration | A named service only when justified | A service must own a real workflow, not forward calls |

Before proposing a file:
1. Search for an existing implementation.
2. State the responsibility in one sentence.
3. Explain why the chosen layer owns it.
4. Choose a name that describes the domain and action.
5. Check dependency direction and portability.
6. Add tests at the responsibility boundary.

Do not create a service, manager, repository, generic helper, or abstraction merely because another project uses that pattern. If a plain function or existing hook/API module solves the requirement, use it.

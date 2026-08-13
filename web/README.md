# CarBravo Incentives Frontend

Production-grade frontend application for the **CarBravo Incentives Authoring Platform**.

This project is a React-based enterprise application for creating, editing, reviewing, approving, publishing, and managing incentive programs and their revisions.

The frontend is intentionally designed as an independent application. The backend is owned by a separate Spring Boot/Java team and is consumed through a versioned REST API contract.

---

## 1. Project Overview

CarBravo Incentives is an authenticated, API-driven authoring application.

The frontend is responsible for:

* Application shell
* Navigation
* Dashboard
* Program management
* Program creation
* Program editing
* Vehicle targeting
* Geography targeting
* Eligibility configuration
* Incentive values
* Marketing and disclosures
* Program summary
* Approval workflow
* Revision navigation
* Revision history
* Revision detail
* Revision comparison/delta
* Form validation
* Accessibility
* Responsive behaviour
* Error handling
* Loading and empty states
* Permission-aware UI
* API integration
* Automated testing

The frontend does **not** own:

* Java/Spring Boot implementation
* Database design
* Database migrations
* Backend business services
* Backend authorization enforcement
* Backend deployment architecture
* Backend infrastructure

The backend remains the authoritative source for business data and authorization.

---

# 2. Technology Stack

## Core

| Technology     | Purpose                               |
| -------------- | ------------------------------------- |
| React          | UI framework                          |
| TypeScript     | Static typing                         |
| React Compiler | React optimization                    |
| Vite           | Frontend build and development server |
| ESLint         | Code-quality and correctness rules    |
| Prettier       | Formatting                            |

## Application

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| React Router    | Routing                   |
| TanStack Query  | Server/API state          |
| React Hook Form | Form state                |
| Zod             | Runtime/schema validation |
| TanStack Table  | Data tables               |

## API

| Technology                   | Purpose          |
| ---------------------------- | ---------------- |
| Axios                        | HTTP transport   |
| OpenAPI                      | API contract     |
| OpenAPI-generated TypeScript | API types/client |
| MSW                          | API mocking      |

## Testing

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| Vitest                | Unit tests               |
| React Testing Library | Component tests          |
| Playwright            | End-to-end tests         |
| MSW                   | API mocking              |
| Accessibility tooling | Accessibility validation |

## UI

The frontend supports two possible client UI implementations:

* MUI
* shadcn/ui

The application architecture does **not** allow business features to become tightly coupled to either implementation.

---

# 3. Architecture Decision

## React + Vite

The application uses:

```text
React
+
TypeScript
+
React Compiler
+
Vite
```

Next.js is not used for the current CarBravo authoring application.

### Reason

CarBravo is primarily:

* authenticated
* API-driven
* interaction-heavy
* form-heavy
* workflow-driven
* operational/authoring focused

The current application does not require server-side rendering or an SEO-first public web architecture.

Vite provides a simple browser application architecture while React provides the component model required for the complex authoring experience.

If CarBravo later introduces a separate SEO-first public website, that should be evaluated as a separate architectural requirement.

---

# 4. React Compiler

React Compiler is enabled from the beginning.

The current Vite project uses the React Compiler integration provided by the Vite React plugin.

The project should follow the Rules of React so the compiler can safely optimize components.

Developers should **not automatically add**:

```tsx
useMemo(...)
useCallback(...)
memo(...)
```

to every component.

Prefer correct component architecture first.

Use manual memoization only when:

* profiling identifies a real problem
* a third-party API requires stable identity
* a specific optimization is justified

---

# 5. Project Structure

The project follows feature/domain-oriented architecture.

```text
carbravo/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── config/
│   │   ├── layouts/
│   │   ├── providers/
│   │   └── router/
│   │
│   ├── api/
│   │   ├── client/
│   │   ├── errors/
│   │   ├── generated/
│   │   └── query/
│   │
│   ├── auth/
│   │   ├── guards/
│   │   ├── permissions/
│   │   └── session/
│   │
│   ├── entities/
│   │   ├── geography/
│   │   ├── program/
│   │   ├── revision/
│   │   ├── user/
│   │   └── vehicle/
│   │
│   ├── features/
│   │   ├── approval/
│   │   ├── dashboard/
│   │   ├── program-editor/
│   │   ├── programs/
│   │   └── revisions/
│   │
│   ├── shared/
│   │   ├── accessibility/
│   │   ├── constants/
│   │   ├── content/
│   │   ├── feedback/
│   │   ├── forms/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── observability/
│   │   ├── responsive/
│   │   ├── tables/
│   │   └── ui/
│   │
│   ├── styles/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   └── mocks/
│       ├── handlers/
│       ├── factories/
│       └── server.ts
│
├── docs/
│   ├── architecture.md
│   ├── api-integration.md
│   ├── accessibility.md
│   ├── development.md
│   ├── testing.md
│   ├── ui-system.md
│   └── decisions/
│
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

# 6. Architecture Layers

The frontend follows this general dependency direction:

```text
Route
  ↓
Page / Feature
  ↓
Feature Hook
  ↓
TanStack Query
  ↓
Feature API Service
  ↓
Axios HTTP Client
  ↓
OpenAPI-generated Types / Client
  ↓
External Spring Boot REST API
```

UI dependencies follow:

```text
Feature
  ↓
CarBravo Shared UI
  ↓
UI Implementation
  ├── MUI
  └── shadcn/ui
```

Business features must not depend directly on MUI or shadcn internals.

---

# 7. Absolute Imports

The application uses the `@` alias.

```text
@/*
  ↓
src/*
```

Example:

```tsx
import { Button } from "@/shared/ui";
import { usePrograms } from "@/features/programs";
import { env } from "@/app/config/env";
```

Avoid deeply nested imports:

```tsx
import { Button } from "../../../../shared/ui/Button";
```

Relative imports are acceptable for files that are directly related within the same small module.

Cross-feature or cross-layer imports should use `@/`.

---

# 8. Import Boundary Rules

The architecture follows these rules:

### `app`

Can compose:

* providers
* routes
* layouts
* application configuration

It should not contain business implementation.

### `features`

Own user capabilities.

Examples:

```text
features/programs
features/program-editor
features/approval
features/revisions
```

### `entities`

Own reusable domain concepts.

Examples:

```text
program
revision
vehicle
geography
user
```

### `shared`

Contains genuinely reusable frontend infrastructure.

It must not contain CarBravo business workflows.

### `api`

Owns the external API boundary.

### `auth`

Owns session and permission UX concerns.

---

# 9. No Static Business Data

Business data must never be hardcoded in production components.

Do not do:

```tsx
const programs = [
  {
    id: "1",
    name: "Example Program",
  },
];
```

Do not do:

```tsx
<option>BMW</option>
<option>Mercedes</option>
```

Do not hardcode API entities inside JSX.

Production business data comes from the backend API.

---

# 10. Constants and Configuration

Constants are appropriate for application-level concepts such as:

* route names
* query keys
* permission identifiers
* editor section identifiers
* UI configuration
* validation configuration
* feature flags
* status metadata
* formatting configuration

Example:

```text
src/shared/constants/
src/shared/config/
```

Do not turn every UI sentence into a constant.

Use constants when they improve:

* consistency
* maintainability
* reuse
* testability
* configuration

---

# 11. JSON Usage

JSON may be used for:

* development fixtures
* test fixtures
* mock data
* static configuration where appropriate
* reference data that is genuinely frontend-owned

JSON must not become a replacement for the backend database.

Production program, vehicle, geography, revision, eligibility and incentive data must come from the API.

---

# 12. API Architecture

The frontend communicates with Spring Boot through REST APIs.

The backend team owns the implementation.

The frontend owns:

* HTTP transport
* request handling
* response handling
* API mapping
* API error presentation
* query caching
* mutation state
* UI loading/error states

The preferred architecture is:

```text
Component
    ↓
Feature hook
    ↓
TanStack Query
    ↓
Feature API service
    ↓
Axios
    ↓
OpenAPI contract
    ↓
Spring Boot API
```

React components must not directly call:

```tsx
axios.get(...)
```

or:

```tsx
fetch(...)
```

for application API operations.

---

# 13. Axios

Axios is the frontend HTTP transport layer.

Create one controlled Axios client.

The client should centralize:

* base URL
* timeout
* common headers
* authentication/session integration
* request ID/correlation ID
* cancellation
* response handling
* error normalization

The Axios instance must not contain CarBravo feature-specific business logic.

---

# 14. API Errors

Normalize external API errors into a frontend-friendly error model.

The frontend should distinguish at minimum:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Rate Limited
500+ Server Error
Network Error
Timeout
Cancelled Request
```

Components should not contain repeated status-code logic.

Prefer:

```text
API response
    ↓
API error normalization
    ↓
Frontend error model
    ↓
Feature-specific UI
```

---

# 15. OpenAPI

OpenAPI is the API integration contract.

Generated API types/client code must be separated from handwritten code.

Example:

```text
src/api/generated/
```

Generated files must not be manually edited.

The project should provide:

```bash
pnpm api:generate
```

to regenerate the API client/types from the approved OpenAPI contract.

---

# 16. TanStack Query

TanStack Query owns server state.

Do not create a global state store containing API responses.

Examples of server state:

```text
Programs
Vehicles
Geographies
Revisions
Users
Approval information
Reference API data
```

Use:

* queries
* mutations
* query keys
* cache invalidation
* stale times
* dependent queries
* cancellation
* retry policies
* optimistic updates only where justified

---

# 17. Global State

Do not introduce Redux or Zustand by default.

Global state should only exist when there is a genuine cross-feature requirement.

Use:

```text
TanStack Query
```

for server state.

Use:

```text
React Hook Form
```

for form state.

Use:

```text
React state
```

for local transient UI state.

Use an authentication/session boundary for genuine session-level state.

---

# 18. Form Architecture

Forms use:

```text
React Hook Form
+
Zod
```

A complex form should normally contain:

```text
Form schema
Form model
Default values
API mapper
Response mapper
Submit mutation
Server validation mapping
Dirty state
Loading state
Read-only state
Permission state
```

Do not allow API DTO structures to spread through every UI component.

---

# 19. UI Architecture

The application uses a CarBravo-level UI abstraction.

Features consume:

```tsx
import { Button } from "@/shared/ui";
```

instead of:

```tsx
import Button from "@mui/material/Button";
```

or:

```tsx
import { Button } from "@/shared/ui/button";
```

from a shadcn implementation directly.

This allows the client to select:

```text
MUI
```

or:

```text
shadcn/ui
```

without rewriting business features.

---

# 20. UI Implementation Model

Recommended structure:

```text
src/shared/ui/
│
├── contracts/
│
├── components/
│
├── adapters/
│   ├── mui/
│   └── shadcn/
│
├── tokens/
│
├── accessibility/
│
└── responsive/
```

The exact implementation may evolve, but the principle is fixed:

```text
Business Feature
       ↓
CarBravo UI Contract
       ↓
UI Implementation
       ├── MUI
       └── shadcn/ui
```

---

# 21. MUI

MUI is one supported implementation.

MUI should own:

* component implementation
* theme adapter
* typography adapter
* spacing adapter
* component states
* responsive implementation
* accessibility implementation

MUI-specific details must remain below the shared UI boundary.

---

# 22. shadcn/ui

shadcn/ui is the second supported implementation.

shadcn components are treated as source-owned UI components rather than an opaque runtime dependency.

The implementation should remain below the shared UI boundary.

The application should not randomly mix MUI and shadcn components screen by screen.

The client selects the primary implementation.

---

# 23. Design Tokens

The application should use semantic design tokens.

Examples:

```text
color.primary
color.secondary
color.success
color.warning
color.danger
color.info

background.default
background.surface
background.elevated

text.primary
text.secondary
text.disabled

border.default
border.strong

spacing
radius
typography
breakpoints
zIndex
motion
```

Features should not depend on hardcoded design-system values.

Avoid:

```tsx
color: "#1976D2";
```

Prefer:

```tsx
color: tokens.color.primary;
```

---

# 24. Required Shared Components

The shared UI foundation must cover the CarBravo requirements.

## Application Shell

* Top bar
* Navigation
* Breadcrumbs
* Content shell
* Responsive shell

## Buttons and Actions

* Primary button
* Secondary button
* Destructive button
* Icon button
* Action group
* Loading state

## Forms

* Text input
* Textarea
* Select
* Multi-select
* Checkbox
* Radio
* Switch
* Field wrapper

## Date / Time / Numeric

* Date picker
* Time input
* Currency input
* Percentage input
* Integer input
* Decimal input

## Tables

* Table
* Sorting
* Filtering
* Pagination
* Row states
* Empty table

## Cards / Status

* Card
* Status badge
* Revision badge
* Progress indicator

## Dialogs

* Modal
* Confirmation dialog
* Rejection dialog
* Drawer/sheet
* Focus management

## Feedback

* Toast
* Alert
* Skeleton
* Spinner
* Empty state
* Error state

## Selection

* Hierarchical selector
* Chip/tag selection
* Include/exclude control

## Revision / Workflow

* Revision tabs
* Timeline
* Read-only banner
* Workflow action bar
* Revision status

## Accessibility

* Focus styles
* Semantic patterns
* ARIA helpers
* Keyboard utilities

## Responsive

* Grid
* Spacing
* Overflow
* Sticky behaviour
* Breakpoint helpers

---

# 25. Program Editor

The Program Editor must not become one large component.

Recommended structure:

```text
features/program-editor/
│
├── components/
│   ├── EditorHeader/
│   ├── SectionRail/
│   ├── SectionStatus/
│   ├── SaveStatus/
│   ├── ReadOnlyBanner/
│   └── WorkflowBar/
│
├── sections/
│   ├── setup/
│   ├── vehicles/
│   ├── geography/
│   ├── eligibility/
│   ├── incentive-values/
│   ├── marketing/
│   ├── summary/
│   └── approval/
│
├── model/
├── permissions/
├── validation/
└── routes/
```

Each section should be independently testable and maintainable.

---

# 26. Revision Workflow

The frontend represents the revision lifecycle as a domain model.

Example:

```text
DRAFT
  ↓
REVIEW
  ↓
APPROVED
  ↓
ACTIVE
  ↓
EXPIRED
```

Possible transitions include:

```text
submit
approve
reject
publish
expire
```

Workflow rules should be centralized.

Avoid repeating:

```tsx
if (status === "DRAFT") ...
```

throughout unrelated components.

Use centralized helpers such as:

```text
canEdit()
canSubmit()
canApprove()
canReject()
canPublish()
canViewHistory()
```

The backend remains authoritative.

---

# 27. Authentication

The frontend should have an authentication/session boundary.

Recommended structure:

```text
src/auth/
├── session/
├── guards/
└── permissions/
```

Responsibilities include:

* current user
* authentication state
* session lifecycle
* protected routes
* permission-aware UI
* role-aware UI

The frontend must never be treated as the final authorization layer.

The backend remains authoritative.

---

# 28. Permissions

Do not scatter role checks throughout JSX.

Avoid:

```tsx
if (user.role === "ADMIN") {
  ...
}
```

throughout the application.

Use centralized permission definitions and helpers.

Examples:

```text
canEditProgram
canSubmitProgram
canApproveProgram
canPublishProgram
canViewRevisionHistory
```

A UI permission check improves UX.

It does not replace backend authorization.

---

# 29. Routing

Use React Router.

Routes should be centralized.

Avoid duplicating strings:

```text
"/programs"
"/programs"
"/programs"
```

throughout the application.

Use route constants and nested layouts.

Support:

* authenticated routes
* protected routes
* not found
* forbidden
* route loading
* route error boundaries

---

# 30. Error Boundaries

Implement error boundaries at appropriate levels.

Recommended:

```text
Application Error Boundary
        ↓
Route Error Boundary
        ↓
Feature Error Boundary where justified
```

Production error screens should provide:

* understandable message
* retry
* reload
* safe diagnostic reference
* correlation/reference ID where available

Do not expose stack traces to normal users.

---

# 31. Loading States

Every major API-driven feature must consider:

```text
Initial loading
Background loading
Submitting
Refreshing
Disabled
```

Use appropriate:

* skeletons
* spinners
* progress indicators
* disabled states

Avoid showing a blank screen while data loads.

---

# 32. Empty States

Every list/table must define an empty state.

Examples:

```text
No programs found.
```

or:

```text
No revisions exist for this program.
```

Empty states should distinguish:

```text
No data exists
```

from:

```text
Search/filter returned no results
```

---

# 33. Error States

Every API-driven feature must handle:

```text
Validation error
Unauthorized
Forbidden
Not found
Conflict
Server failure
Network failure
Timeout
```

Do not display raw server errors to users.

---

# 34. Accessibility

Target:

**WCAG 2.1 AA**

Accessibility is part of the architecture, not a final QA activity.

Requirements include:

* semantic HTML
* labels
* keyboard navigation
* visible focus
* focus management
* modal focus trapping
* focus restoration
* ARIA where appropriate
* accessible error messages
* screen-reader announcements
* sufficient contrast
* non-color-only status communication
* zoom support
* responsive layout

---

# 35. Responsive Design

The frontend must support:

* desktop
* tablet
* smaller browser widths
* browser zoom
* 200% zoom
* long content
* large tables
* sticky navigation
* horizontal overflow where appropriate

Do not optimize only for the designer's exact desktop resolution.

---

# 36. Performance

Performance architecture includes:

* React Compiler
* route-level code splitting
* lazy loading
* TanStack Query caching
* pagination
* server-side filtering/search where appropriate
* debounced search
* dependent queries
* virtualization where justified
* controlled rendering boundaries

Do not load very large vehicle or geography datasets into the browser unnecessarily.

Do not add performance abstractions without evidence.

---

# 37. Security

Frontend security requirements include:

* no secrets in frontend source
* no secrets in `VITE_*` variables
* safe HTML handling
* safe user content rendering
* no sensitive data in logs
* dependency vulnerability scanning
* CSP-compatible implementation
* safe error reporting
* no token leakage
* safe API error handling

Remember:

> Frontend security does not replace backend authorization.

---

# 38. Environment Variables

Only browser-safe values may use:

```text
VITE_*
```

Example:

```env
VITE_APP_NAME=CarBravo Incentives
VITE_APP_VERSION=0.1.0
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_API_MOCKS=false
VITE_ENABLE_DEVTOOLS=false
```

Never store:

```env
VITE_CLIENT_SECRET=
VITE_PRIVATE_KEY=
VITE_DATABASE_PASSWORD=
```

Anything exposed through Vite's client environment can become part of the browser bundle.

---

# 39. Development Environment

Copy:

```text
.env.example
```

to the appropriate local environment file.

Never commit secrets.

Use environment-specific configuration for:

```text
development
test
production
```

---

# 40. MSW

MSW allows the frontend to operate independently from a running backend during development and testing.

Structure:

```text
tests/mocks/
├── handlers/
├── factories/
└── server.ts
```

Mock responses should follow the OpenAPI contract.

Do not create mock business logic inside React components.

---

# 41. Testing Strategy

Testing is divided into layers.

## Unit

Test:

* formatters
* mappers
* validation
* permissions
* workflow transitions
* utilities

## Component

Test:

* forms
* selectors
* dialogs
* loading states
* errors
* read-only states
* user interaction
* accessibility behaviour

## E2E

Test critical business workflows.

Primary workflow:

```text
Create Program
    ↓
Setup
    ↓
Vehicles
    ↓
Geography
    ↓
Eligibility
    ↓
Incentive Values
    ↓
Summary
    ↓
Submit
    ↓
Approve
    ↓
Publish
```

Also test:

* rejection
* revision
* historical revision
* permissions
* validation errors
* API failures
* conflict handling

---

# 42. Quality Commands

The project should provide the following commands:

```bash
pnpm dev
```

Start development server.

```bash
pnpm build
```

Create production build.

```bash
pnpm preview
```

Preview production build locally.

```bash
pnpm typecheck
```

Run TypeScript checks.

```bash
pnpm lint
```

Run ESLint.

```bash
pnpm lint:fix
```

Automatically fix supported lint issues.

```bash
pnpm format
```

Format files.

```bash
pnpm format:check
```

Check formatting.

```bash
pnpm test
```

Run Vitest in watch mode.

```bash
pnpm test:run
```

Run tests once.

```bash
pnpm test:coverage
```

Generate test coverage.

```bash
pnpm test:e2e
```

Run Playwright tests.

```bash
pnpm check
```

Run the main frontend quality gates.

---

# 43. Definition of Done

A feature is not complete merely because the successful API response renders.

A production feature must consider:

* [ ] UI implemented
* [ ] Correct shared component used
* [ ] API integrated
* [ ] Loading state
* [ ] Empty state
* [ ] Error state
* [ ] Retry state
* [ ] Validation
* [ ] Permission state
* [ ] Disabled state
* [ ] Read-only state
* [ ] Responsive behaviour
* [ ] Keyboard accessibility
* [ ] WCAG considerations
* [ ] Unit/component tests
* [ ] E2E test where critical
* [ ] TypeScript passes
* [ ] ESLint passes
* [ ] Formatting passes
* [ ] Production build passes
* [ ] Error handling implemented
* [ ] Documentation updated

---

# 44. Dependency Rules

Before adding a dependency, evaluate:

1. Is it actually required?
2. Is it actively maintained?
3. Does it support React 19?
4. Does it work with React Compiler?
5. Does it have good TypeScript support?
6. What is its bundle/runtime cost?
7. Does it duplicate existing functionality?
8. Is its license acceptable?
9. Can we easily replace it later?
10. Does it introduce unnecessary architectural coupling?

Do not install dependencies merely because they are popular.

---

# 45. Avoided Architecture

The following are intentionally not introduced without a concrete requirement:

```text
Micro-frontends
Redux
Zustand
Custom state-management framework
Custom HTTP framework
Custom router
Custom form framework
Multiple API clients
Multiple competing design systems
Unnecessary monorepo
Excessive abstraction
```

Production-grade means **controlled complexity**, not maximum complexity.

---

# 46. Code Style

Prefer clear code.

Good:

```tsx
const { data, isPending, error } = usePrograms();
```

Avoid:

```tsx
const d = usePrograms();
```

Prefer meaningful names.

Good:

```tsx
const selectedVehicles = ...
```

Avoid:

```tsx
const x = ...
```

Keep functions small enough to understand.

Avoid giant components.

Avoid giant utility files.

Avoid generic names such as:

```text
helpers.ts
utils.ts
common.ts
misc.ts
```

when a domain-specific name is possible.

---

# 47. Component Rules

A component should have a clear responsibility.

Avoid:

```text
ProgramEditor.tsx
```

containing:

* API requests
* 2,000 lines of JSX
* validation
* workflow logic
* permissions
* formatting
* dialogs
* table configuration
* business calculations

Instead separate:

```text
ProgramEditor
ProgramEditorHeader
ProgramSectionRail
ProgramSetupSection
VehicleTargetingSection
GeographySection
EligibilitySection
IncentiveValuesSection
MarketingSection
ProgramSummarySection
ApprovalSection
```

---

# 48. API Data vs UI Data

Do not assume API DTOs are always ideal UI models.

Example:

```text
API DTO
   ↓
Mapper
   ↓
Frontend model
   ↓
Form
```

And when submitting:

```text
Form
   ↓
Frontend model
   ↓
Mapper
   ↓
API request DTO
```

This prevents backend contract details from spreading throughout the UI.

---

# 49. Git / Pull Requests

Pull requests should be:

* focused
* reviewable
* small enough to understand
* tested
* lint-clean
* type-safe

Before opening a PR:

```bash
pnpm check
pnpm build
```

For critical features:

```bash
pnpm test:e2e
```

---

# 50. CI Quality Gate

CI should eventually execute:

```text
Install dependencies
       ↓
Typecheck
       ↓
ESLint
       ↓
Formatting
       ↓
Unit/component tests
       ↓
Production build
       ↓
E2E tests
```

A pull request should not merge when mandatory quality gates fail.

---

# 51. Observability

Create an application-level observability abstraction.

Example:

```text
src/shared/observability/
```

Possible operations:

```text
captureError()
captureMessage()
setUser()
setContext()
addBreadcrumb()
capturePerformance()
```

Do not scatter direct third-party monitoring calls across the application.

This allows the monitoring provider to change without rewriting features.

---

# 52. Application Version

The application should expose:

```text
Application version
Environment
Build/commit identifier
```

These values are useful for:

* error reporting
* support
* debugging
* release verification
* production diagnostics

Do not expose secrets.

---

# 53. Documentation

Important frontend documentation belongs in:

```text
docs/
```

Recommended documents:

```text
docs/
├── architecture.md
├── development.md
├── api-integration.md
├── ui-system.md
├── accessibility.md
├── testing.md
├── deployment.md
└── decisions/
```

Architecture decisions that may affect the project for years should be documented as ADRs.

---

# 54. Development Workflow

Typical development workflow:

```text
1. Pull latest changes
2. Install dependencies
3. Start development server
4. Work against API or MSW
5. Implement feature
6. Add tests
7. Run typecheck
8. Run lint
9. Format
10. Run production build
11. Run relevant E2E tests
12. Open PR
```

---

# 55. Initial Setup

Clone the repository and install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Open:

```text
http://localhost:5173
```

---

# 56. Production Build

Create a production build:

```bash
pnpm build
```

Preview it locally:

```bash
pnpm preview
```

The generated production assets are placed in:

```text
dist/
```

The `dist` directory must not be committed to Git.

---

# 57. Recommended Development Order

The frontend should be built in the following order.

## Phase 1 — Foundation

* React
* Vite
* TypeScript
* React Compiler
* ESLint
* Prettier
* absolute imports
* environment configuration

## Phase 2 — Application Architecture

* application providers
* router
* layouts
* error boundaries
* application configuration

## Phase 3 — API Foundation

* Axios
* API error model
* OpenAPI generation
* generated client/types
* TanStack Query
* query key conventions
* MSW

## Phase 4 — UI Foundation

* semantic tokens
* UI contracts
* MUI adapter
* shadcn adapter
* forms
* tables
* dialogs
* feedback states
* accessibility primitives
* responsive primitives

## Phase 5 — Authentication

* session
* route guards
* permissions
* unauthorized/forbidden states

## Phase 6 — Testing

* Vitest
* React Testing Library
* MSW
* Playwright
* accessibility testing

## Phase 7 — Quality / Operations

* CI
* observability
* dependency checks
* production configuration

## Phase 8 — CarBravo Features

```text
Dashboard
   ↓
Programs
   ↓
Program Editor
   ├── Setup
   ├── Vehicles
   ├── Geography
   ├── Eligibility
   ├── Incentive Values
   ├── Marketing & Disclosures
   ├── Summary
   └── Approval
   ↓
Revisions
```

---

# 58. Client UI Library Selection

The project is intentionally designed so the client can select:

```text
Option A — MUI
```

or:

```text
Option B — shadcn/ui
```

The selection should primarily affect:

```text
src/shared/ui/
```

and its implementation adapters.

The following should remain unchanged:

```text
features/
entities/
api/
auth/
routing/
TanStack Query/
forms/
validation/
tests/
business workflows/
```

This is a critical architectural constraint.

---

# 59. Architecture Principle

The frontend should be thought of as:

```text
                 CarBravo Application
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      Domain           Features          UI
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Application
                         │
                     API Layer
                         │
                 External REST API
```

The UI library is an implementation detail.

The business application must not depend on the UI vendor.

---

# 60. Final Engineering Principle

The objective is not to build the most complicated React application.

The objective is to build a frontend that remains:

* understandable
* testable
* accessible
* performant
* secure
* replaceable
* scalable
* maintainable
* predictable

for many years.

The most important architectural rules are:

1. Keep business logic out of generic UI.
2. Keep API details out of presentation components.
3. Keep server state in TanStack Query.
4. Keep form state in React Hook Form.
5. Keep validation in Zod.
6. Keep API types generated from OpenAPI.
7. Keep mock data separate from production data.
8. Keep MUI/shadcn behind the shared UI boundary.
9. Keep accessibility inside component design.
10. Keep workflow rules centralized.
11. Keep dependencies intentional.
12. Prefer simple architecture over unnecessary abstraction.
13. Treat the backend API as the authoritative business-data source.
14. Test real user workflows, not only individual components.
15. Do not consider a feature complete until its loading, empty, error, disabled, read-only, permission and accessibility states are addressed.

---

## Current Project Status

At the initial foundation stage, the project should have:

```text
React                 ✓
TypeScript            ✓
React Compiler        ✓
Vite                  ✓
ESLint                ✓
Absolute imports      ✓

React Router          → Next
TanStack Query        → Next
Axios                 → Next
OpenAPI               → Next
React Hook Form       → Next
Zod                   → Next
MUI/shadcn layer      → Next
MSW                   → Next
Vitest                → Next
Playwright            → Next
CI/CD                 → Next
Observability         → Next
CarBravo features     → After foundation
```

The foundation should be considered ready for feature development only after the API, UI abstraction, testing, accessibility, environment, and quality-gate layers are established.

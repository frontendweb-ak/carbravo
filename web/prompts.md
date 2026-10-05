### Prompt 1 — Create Repository Foundation

You are a Staff Frontend Engineer.

Create a production-grade React frontend application called CarBravo.

Requirements:

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios

Architecture:

src/
├── app
├── components
├── config
├── features
├── hooks
├── lib
├── routes
├── services
├── types
├── utils

Requirements:

- Strict TypeScript
- Feature-based architecture
- Barrel exports
- Path aliases
- Environment configuration
- Error boundaries
- Loading states
- Empty states
- Global API client

Generate all files.

### Prompt 2 — Build Design System

Create a reusable enterprise design system.

Requirements:

Components:

- Button
- IconButton
- Card
- Badge
- StatusBadge
- Input
- Textarea
- Select
- Checkbox
- Tabs
- Typography

Requirements:

- Material UI based
- Fully typed
- Accessibility compliant
- Storybook stories
- Unit tests

Create folder structure and implementation.

### Prompt 3 — Create Theme System

Build a production-grade theme architecture.

Requirements:

src/config/theme

Create:

- tokens.ts
- palette.ts
- typography.ts
- shape.ts
- shadows.ts

Support:

- light theme
- dark theme

Expose createAppTheme()

Follow enterprise design system standards.

### Prompt 4 — Routing Architecture

Create routing architecture.

Routes:

/dashboard

/programs
/programs/new
/programs/:programId
/programs/:programId/edit

/revisions
/revisions/:revisionId

/settings

Requirements:

- React Router v7
- Route guards
- Layout routes
- Lazy loading
- Error routes
- Not found page

Generate all code.

### Prompt 5 — Authentication Foundation

Create authentication infrastructure.

Requirements:

- Session management
- Auth storage
- Access token handling
- Refresh token handling

Files:

features/auth/

Create:

- auth-session.ts
- auth-storage.ts
- auth.types.ts

Support:

- login
- logout
- refresh token
- current user

Generate implementation.

### Prompt 6 — API Layer

Create enterprise API layer.

Requirements:

Axios instance

Features:

- Request interceptors
- Response interceptors
- Automatic token refresh
- Error normalization
- Retry support

Create:

services/api

Generate production-grade code.

### Prompt 7 — Dashboard Feature

Create Dashboard module.

Requirements:

Widgets:

- Program Summary
- Program Status Counts
- Recent Activity
- Expiring Programs
- Quick Actions

Folder:

features/dashboard

Include:

- API layer
- Types
- Mappers
- Hooks
- Components

Generate production-grade implementation.

### Prompt 8 — Program Domain Modeling

Design Program domain.

Program contains:

- Program Details
- Geography
- Vehicles
- Eligibility
- Incentive Configuration
- Marketing Copy
- Disclosures
- Workflow Status

Create:

types
dto models
form models
api models

Use strict typing.

### Prompt 9 — Program Listing Screen

Create Program Listing page.

Features:

- Search
- Filters
- Pagination
- Sorting
- Status filter
- Empty state
- Loading state
- Error state

Use TanStack Query.

Create complete implementation.

### Prompt 10 — Program Creation Wizard

Create Program Creation Wizard.

Steps:

1. Program Details
2. Geography
3. Vehicle Targeting
4. Eligibility
5. Incentives
6. Marketing
7. Disclosures
8. Review

Requirements:

- React Hook Form
- Zod validation
- Step persistence
- Unsaved change warning

Generate full implementation.

### Prompt 11 — Geography Targeting

Create Geography Targeting module.

Support:

- Country
- State
- Region
- Zip Code

Requirements:

- Include/Exclude rules
- Rule builder UI
- Searchable selects
- Validation

Create reusable components.

### Prompt 12 — Vehicle Targeting

Create Vehicle Targeting feature.

Support:

- Make
- Model
- Year
- Trim

Requirements:

- Multi-select support
- Filtering
- Rule builder

Generate implementation.

### Prompt 13 — Revision System

Create Revision Management feature.

Requirements:

- Revision list
- Revision detail
- Revision compare
- Change history

Create:

features/revisions

Generate all code.

### Prompt 14 — Revision Comparison

Build revision comparison engine.

Features:

- Side-by-side comparison
- Highlight changes
- Added values
- Removed values
- Modified values

Generate reusable comparison components.

### Prompt 15 — Approval Workflow

Create Approval Workflow module.

Statuses:

DRAFT
REVIEW
APPROVED
REJECTED
PUBLISHED

Features:

- Submit for review
- Approve
- Reject
- Publish

Generate workflow UI.

### Prompt 16 — Global Error Handling

Create application-wide error handling.

Requirements:

- ErrorBoundary
- API Error Mapping
- Toast Notifications
- Retry Actions

Generate implementation.

### Prompt 17 — Loading System

Create reusable loading architecture.

Components:

- PageLoader
- GlobalLoader
- TableLoader
- Skeleton Cards

Generate implementation.

### Prompt 18 — Storybook

Configure Storybook.

Create stories for:

- Button
- Card
- Input
- Select
- Tabs
- Badge

Include controls and docs.

### Prompt 19 — Testing

Create testing strategy.

Requirements:

- Vitest
- React Testing Library

Write tests for:

- Components
- Forms
- Hooks
- API Layer

Generate test suite.

### Prompt 20 — Production Hardening

Review entire repository.

Perform:

- Accessibility audit
- Type safety audit
- Performance audit
- Bundle optimization
- Code splitting
- Dead code detection
- Architecture review

Refactor where needed.

Provide final production-ready codebase.

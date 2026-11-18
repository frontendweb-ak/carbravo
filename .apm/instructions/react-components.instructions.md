---
description: React component composition, state ownership, accessibility, and UI implementation standards
applyTo: "web/src/**/*.tsx"
---

# React component standards

- Keep components focused on rendering and coordinating their immediate UI. Move reusable data orchestration into feature hooks and transport operations into feature API modules.
- Keep route pages thin: read route parameters, compose feature components, and define page-level layout. Do not put large forms, data transformation pipelines, or transport code in page components.
- Use controlled state only where the UI needs it. Avoid duplicating server state in local state; use the existing TanStack Query setup for remote data.
- Keep derived values derived. Do not store values that can be calculated from existing props or state.
- Define explicit prop types. Avoid `any`, broad optional props, boolean-prop explosions, and catch-all configuration objects.
- Prefer composition and clear variants over deeply nested conditional rendering.
- Handle loading, error, empty, success, disabled, and pending states intentionally. Do not show success before a mutation succeeds.
- Keep accessibility: semantic elements, labels, keyboard operation, focus behavior, and accessible names for icon-only controls.
- Reuse existing primitives from `web/src/components/ui`; do not introduce a parallel button, input, dialog, badge, or layout system.
- Do not create a component for a one-line fragment unless it has a clear semantic role, reuse, or test benefit.
- Keep component files readable and testable. Extract cohesive subcomponents when they have independent responsibility; do not split code into dozens of trivial files.
- Avoid effects for values that can be derived during render, event-driven work, or server-state synchronization already handled by TanStack Query.

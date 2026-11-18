# CarBravo engineering decisions

This document records the architectural intent behind the frontend conventions. Update it when a meaningful decision changes; do not use it as a catalogue of every small implementation choice.

## Product and delivery boundary

CarBravo is a fully working React frontend developed ahead of the production application. The frontend must support complete user journeys against a contract-compatible mock API. The production backend is developed separately in Java.

The mock server is a development aid and contract simulator. It is not the production backend and its implementation must not leak into frontend feature modules.

## Current repository shape

- `web/`: React application and frontend tooling.
- `server/`: OpenAPI contract and mock API implementation.
- `web/src/features/`: feature-owned UI, hooks, API operations, schemas, models, constants, and pure utilities.
- `web/src/components/ui/`: generic design-system components and primitives.
- `web/src/components/layout/`: shared application layout.
- `web/src/infra/`: cross-feature runtime infrastructure, including HTTP and query clients.
- `web/src/pages/` and `web/src/router/`: route composition and navigation.

These are existing repository boundaries. Do not move them solely to conform to a different template.

## Why feature-first

Feature-first organization keeps code that changes together discoverable together. A developer can find a feature's API operations, UI, hooks, models, validation, and tests without searching unrelated global folders. Shared code is promoted only when reuse is demonstrated.

## Why API transport and feature API are separate

The shared HTTP client owns cross-cutting transport behavior such as base URL, authentication, refresh, and normalized errors. A feature API module owns domain-specific endpoints and typed request/response operations. This keeps UI independent of Axios and allows the transport implementation to change without rewriting feature components.

## Why DTOs and view models may differ

DTOs represent the external contract. View models represent the information and semantics the UI needs. When they differ, an explicit mapper documents the transformation and keeps API naming/shape from spreading through the UI. Do not add a mapper when the shapes are already identical and no transformation is needed.

## Why utilities must be pure

A utility is a deterministic transformation with no network, React state, browser lifecycle, or hidden side effects. This makes it easy to test and reuse. Stateful behavior belongs in hooks or feature models; I/O belongs in API/infrastructure modules.

## Why not create a service layer by default

A service layer is justified only when it coordinates multiple operations or owns a meaningful business workflow that cannot live clearly in a hook, API module, or pure domain function. A pass-through class that renames API calls adds indirection without adding a responsibility.

## Portability rule

Keep feature dependencies explicit and mock-independent. Do not build a package monorepo prematurely. When a real host application exists, extract stable features with their required shared UI, API contracts, schemas, and tests based on an extraction report.

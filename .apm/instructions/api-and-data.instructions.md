---
description: OpenAPI contract alignment, HTTP transport boundaries, feature API modules, DTO mapping, and query efficiency
applyTo: "web/src/**/*api*.*,web/src/infra/api/**/*,web/src/features/**/model/**/*"
---

# API and data boundary

- The OpenAPI document at `server/openapi.yaml` is the API contract source of truth unless the project explicitly adopts a generated contract workflow.
- The Java backend is external to this frontend responsibility. Do not implement Java/backend behavior in the React application.
- The `server/` mock API must emulate the agreed contract. It is development infrastructure, not a production backend to be copied into the future Java service.
- Keep HTTP transport concerns in `web/src/infra/api`; keep domain endpoint functions in the owning feature's `api` directory.
- Feature API modules expose typed operations, not raw Axios instances. Components and hooks must not call Axios or construct endpoint URLs directly.
- Keep request/response DTOs at the transport boundary. Map DTOs into frontend domain models in explicit, testable mapper functions when the shapes or semantics differ.
- Preserve API field names and semantics at the transport boundary. Do not silently rename, coerce, default, or discard fields without a documented mapping.
- Validate untrusted external data at appropriate boundaries when runtime validation is required. Reuse existing Zod schemas; do not duplicate equivalent schemas.
- Use the existing TanStack Query client and established query-key conventions. Define stable, feature-owned query keys; invalidate only affected data after successful mutations.
- Avoid N+1 request patterns, duplicate requests, waterfalls, over-fetching, and fetching data that the current screen does not need.
- Handle cancellation and stale requests using the existing client/query mechanisms. Do not swallow errors or convert failures into fake success values.
- Never put secrets, credentials, access tokens, or sensitive personal data in source control, logs, URLs, or monitoring payloads.
- Keep mock-only fixtures, handlers, and state inside the mock server. Frontend features must depend only on the API contract and typed client interface.

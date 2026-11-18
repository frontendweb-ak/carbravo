---
name: api-contract-integration
description: Use when adding or changing a frontend API operation, query, mutation, DTO, mapper, or mock API behavior.
---

# Integrate an API contract

1. Find the operation in `server/openapi.yaml`: path, method, parameters, request body, response schemas, status codes, and security requirements.
2. Inspect `web/src/infra/api` and the feature's existing API module.
3. Confirm whether the operation already exists. Reuse or extend it rather than duplicating it.
4. Define transport types from the contract. Do not hand-invent a competing contract.
5. Implement the feature API operation using the shared transport client.
6. Add a mapper only when the frontend model meaningfully differs from the transport DTO.
7. Add a stable query key and query/mutation hook following existing TanStack Query conventions.
8. Define targeted invalidation and cancellation behavior.
9. Ensure the mock server implements the same contract. Keep mock-specific behavior inside `server/`.
10. Test request parameters, payload, mapping, errors, and cache behavior.

Report contract references, files changed, query/mutation behavior, request-count implications, and test results.

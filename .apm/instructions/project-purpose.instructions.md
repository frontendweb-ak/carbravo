---
description: CarBravo product purpose, frontend ownership, mock backend boundary, and implementation expectations
applyTo: "**/*"
---

# CarBravo product purpose

- CarBravo is a complete, working frontend application and the reference implementation for the future production application.
- Build complete user journeys, not disconnected mock screens. Include loading, empty, error, success, validation, permission, and edge states where relevant.
- The frontend is owned here. The production backend is developed separately in Java. The repository's mock API exists to make frontend development independently testable.
- Keep frontend features portable so they can be integrated into the future production repository with minimal changes.
- Treat the approved OpenAPI contract as the boundary between frontend and backend. Do not invent endpoint behavior or silently change contract semantics.
- Do not introduce backend responsibilities into React components or frontend feature modules.
- Before implementation, inspect the existing code and identify the smallest coherent change. Preserve working behavior and avoid unrelated refactors.
- Explain non-obvious architectural decisions in code or an ADR. Names and structure must communicate purpose without requiring a client or maintainer to guess.

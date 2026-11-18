---
description: Testing strategy, accessibility validation, CI quality gates, and safe change discipline
applyTo: "**/*"
---

# Testing and quality gates

- Follow the existing Biome, TypeScript, Vitest, Testing Library, Playwright, and Storybook setup; do not replace tooling without a demonstrated need.
- Add tests at the layer where behavior lives: pure functions and mappers get unit tests; hooks/components get focused behavior tests; critical user journeys get browser-level tests.
- Test observable behavior, user interactions, validation, loading/error/empty states, and regression cases. Avoid tests that merely assert implementation details.
- For API work, test request construction, response mapping, error behavior, and contract compatibility where practical.
- For UI changes, verify keyboard and accessible behavior as well as visual states.
- Run the narrowest relevant tests while iterating, then run the repository's verification command before declaring completion.
- Do not weaken, delete, skip, or loosen tests simply to make a change pass. Explain any unavoidable limitation.
- Do not claim checks passed unless they were actually run and their result is known.
- Avoid adding dependencies when existing platform or project utilities solve the problem.
- Keep changes scoped. Do not reformat or refactor unrelated files.

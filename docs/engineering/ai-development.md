# CarBravo AI-assisted development

CarBravo uses Microsoft Agent Package Manager (APM) to keep AI-agent instructions, skills, prompts, and specialist agents versioned with the repository.

## Source of truth

- `apm.yml`: APM manifest and supported target list.
- `.apm/instructions/`: repository rules and file-scoped coding conventions.
- `.apm/agents/`: specialist personas for harnesses that support agents.
- `.apm/skills/`: reusable workflows, including workflows that remain available in harnesses without a native agent primitive.
- `.apm/prompts/`: user-invoked task prompts.
- `apm.lock.yaml`: generated dependency lockfile; commit it after APM install.
- Harness directories and files such as `.github/`, `.claude/`, `.codex/`, `.cursor/`, `.agents/`, and `AGENTS.md`: generated/deployed outputs. Do not hand-edit generated files; edit `.apm/` sources and regenerate.

## Install on Windows

```powershell
irm https://aka.ms/apm-windows | iex
```

From the repository root:

```powershell
apm --version
apm targets --json
apm install
apm audit --ci
```

APM installs the declared dependency graph, validates package content, writes the lockfile, and deploys supported primitives to the targets declared in `apm.yml`.

## Daily workflow

1. Read the applicable instruction files before making a change.
2. Use `@frontend-architect` for design and ownership questions, `@feature-developer` for implementation, `@api-integration` for contract work, and `@quality-reviewer` for independent review where the active harness supports agents.
3. Use skills such as `implement-feature`, `understand-frontend-boundaries`, and `prepare-feature-extraction` in harnesses that support Agent Skills.
4. Keep source primitives under `.apm/` authoritative. Do not edit generated target files directly.
5. When source primitives or dependencies change, run `apm install`, inspect the generated diff, and commit the manifest, lockfile, and intended generated outputs together.
6. Run frontend verification scripts from `web/package.json` for code changes.

## Dependency and MCP policy

- No third-party APM package or MCP server is enabled by default.
- Add a dependency only after checking its source, maintenance, permissions, transitive dependencies, and security implications.
- Pin third-party dependencies to an immutable release/tag or commit and commit the generated lockfile.
- MCP servers are tools with potential access to repository or external data. Add only a task-justified server and document its permissions and intended use.
- Never place credentials or secrets in `apm.yml`, prompts, skills, agents, instructions, or committed configuration.

## Target compatibility

APM does not provide every primitive to every harness. Native agents are not supported by every target; portable skills and instructions are the fallback. Check the current Microsoft APM target matrix before assuming a primitive is available in a particular editor or CLI.

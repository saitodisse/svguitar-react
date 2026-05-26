# AGENTS.md - svguitar-react

Central instructions for AI agents and IDE assistants working in this repository.

## Overview

`svguitar-react` is an open-source React and TypeScript library for rendering fretted-instrument chord diagrams as SVG. It uses Vite, Storybook, Vitest, ESLint, and Prettier.

**Package manager:** always use **pnpm**. Do not use npm or yarn for repository tasks.

**Specs:** read `specs/` before behavior changes. For formal review, use the [`specs-audit`](.cursor/skills/specs-audit/SKILL.md) skill.

## Stack

| Area        | Technology               |
| ----------- | ------------------------ |
| UI          | React 19, TypeScript 5.8 |
| Build       | Vite 7                   |
| Visual docs | Storybook 9              |
| Tests       | Vitest, test-storybook   |
| Quality     | ESLint 9, Prettier 3     |

## Structure

```text
src/
├── components/ChordDiagram/   # Main library component
├── components/ui/             # Demo application UI
├── stories/                   # Storybook stories
├── App.tsx, main.tsx          # Demo application
└── index.ts                   # Library entrypoint
specs/001-guitar-svg/          # Product and API specifications
```

## Commands

| Script           | Command                      | Purpose                      |
| ---------------- | ---------------------------- | ---------------------------- |
| Dev              | `pnpm dev`                   | Vite demo app                |
| Build library    | `pnpm build`                 | npm package build            |
| Lint             | `pnpm lint`                  | ESLint                       |
| Format           | `pnpm format`                | Prettier write               |
| Format check     | `pnpm format:check`          | Prettier check               |
| Storybook        | `pnpm storybook`             | Local Storybook on port 6006 |
| Build Storybook  | `pnpm build-storybook`       | Static Storybook build       |
| Unit tests       | `pnpm test:run`              | Vitest once                  |
| Watch tests      | `pnpm test:watch`            | Vitest watch                 |
| Storybook tests  | `pnpm test-storybook`        | Storybook integration tests  |
| Coverage         | `pnpm test:coverage`         | Test coverage                |
| Deploy Storybook | `pnpm deploy-storybook:prod` | Production Storybook deploy  |

## Code Conventions

- Prettier uses tabs, double quotes, `printWidth` 110, semicolons, trailing commas where valid in ES5, and LF line endings.
- Use explicit TypeScript types for public APIs.
- Add or update Storybook stories for new component behavior.
- Keep imports grouped with external imports before internal imports.
- Before committing, run formatting and keep lint clean.

## Project Specs

Read these files before implementation or behavior changes:

| File                                 | Content              |
| ------------------------------------ | -------------------- |
| `specs/001-guitar-svg/spec.md`       | Feature requirements |
| `specs/001-guitar-svg/plan.md`       | Implementation plan  |
| `specs/001-guitar-svg/tasks.md`      | Task checklist       |
| `specs/001-guitar-svg/research.md`   | Technical decisions  |
| `specs/001-guitar-svg/data-model.md` | Public data model    |
| `specs/001-guitar-svg/quickstart.md` | Usage guide          |
| `specs/001-guitar-svg/contracts/`    | API contracts        |

Do not add significant features outside the documented specs without updating the specs first.

## Shared Domain

`achorde-musical-domain` owns the shared fretted voicing contracts used by this package. Keep those contracts outside React-specific code. `svguitar-react` owns SVG rendering, layout, and React integration only.

## Downstream Consumers

The following projects depend on published releases of this package:

| Project | Path                    | Dependency location                           |
| ------- | ----------------------- | --------------------------------------------- |
| ac15    | `/home/saito/_git/ac15` | `packages/ui/package.json` → `svguitar-react` |

After publishing a new version:

1. Go to each downstream project listed above.
2. Update the dependency version in the listed `package.json`.
3. Run `pnpm install` to regenerate the lockfile.
4. Run tests and build to confirm compatibility.
5. Commit and push the downstream update.

## Repository Skills

| Skill                                                | Use                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`finalizar`](.cursor/skills/finalizar/SKILL.md)     | Release workflow: tests, build, version, changelog, commit, push, Storybook deploy |
| [`specs-audit`](.cursor/skills/specs-audit/SKILL.md) | Review specs, plan, and acceptance checklist before major changes                  |

## MCP Tools

- **Storybook visual checks:** prefer `pnpm test-storybook`. Use Playwright MCP against `http://localhost:6006/` only when Storybook is running.
- **External libraries:** use Context7 for current documentation before integrating new APIs.

## Communication

- Repository documentation, changelog entries, code comments, and commit messages must be written in English.
- User-facing chat can follow the user's language unless repository artifacts are being edited.

## Do Not

1. Use npm or yarn instead of pnpm.
2. Commit unformatted code.
3. Ignore ESLint warnings.
4. Add components without corresponding stories.
5. Use spaces for indentation in formatted source files.
6. Make significant changes without reading `specs/`.
7. Add undocumented features.
8. Integrate external libraries without checking current documentation.

## Configuration

Key configuration files: `.prettierrc`, `eslint.config.js`, `vite.config.ts`, `tsconfig.json`, `.storybook/`.

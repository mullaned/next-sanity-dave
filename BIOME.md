# Biome Setup

This project uses [Biome](https://biomejs.dev/) for fast and efficient linting and formatting.

## What is Biome?

Biome is a fast formatter and linter for JavaScript, TypeScript, JSX, and JSON. It's designed to be a performant alternative to ESLint and Prettier with:

- ⚡️ **Fast** - Written in Rust, runs significantly faster than ESLint/Prettier
- 🔧 **All-in-one** - Combines formatting and linting in a single tool
- 🎯 **Accurate** - Provides detailed error messages and suggestions
- 📦 **Zero config** - Works out of the box with sensible defaults

## Configuration

The project is configured with:

- **Formatter**: 2-space indentation, single quotes, semicolons as needed
- **Linter**: All recommended rules enabled plus:
  - Accessibility checks (a11y)
  - Complexity warnings
  - Import organization
  - TypeScript-specific rules

See `biome.json` for the full configuration.

## Available Commands

### Root Level (runs on entire monorepo)

```bash
# Format all files
npm run format:biome

# Lint all files
npm run lint:biome

# Check (lint + format) all files
npm run check:biome

# CI mode (no writes, fails on errors)
npm run check:biome:ci
```

### Workspace Level

In `frontend/` or `studio/`:

```bash
# Format files in workspace
npm run format:biome

# Lint files in workspace
npm run lint:biome

# Check (lint + format) files in workspace
npm run check:biome
```

## VS Code Integration

1. Install the Biome extension:
   ```
   ext install biomejs.biome
   ```

2. Add to your `.vscode/settings.json`:
   ```json
   {
     "[javascript]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[typescript]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[javascriptreact]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[typescriptreact]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[json]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "quickfix.biome": "explicit",
       "source.organizeImports.biome": "explicit"
     }
   }
   ```

## Migration from ESLint/Prettier

If you want to migrate existing ESLint or Prettier configs:

```bash
# Migrate ESLint config
npx @biomejs/biome migrate eslint --write

# Migrate Prettier config
npx @biomejs/biome migrate prettier --write
```

## Ignoring Files

Files and directories are ignored via `.biomeignore`:

- `node_modules`
- Build outputs (`.next`, `dist`, `out`, etc.)
- Generated files (`sanity.types.ts`, `schema.json`)
- Lock files
- Coverage reports

## Rules Configuration

### Formatting

- **Indent**: 2 spaces
- **Quotes**: Single quotes for JS/TS, double quotes for JSX
- **Semicolons**: As needed (ASI-safe)
- **Line width**: 100 characters
- **Trailing commas**: All (better git diffs)

### Linting

Key rules enabled:

- ✅ **a11y**: Accessibility checks for JSX
- ✅ **correctness**: Unused imports/variables warnings
- ✅ **complexity**: Cognitive complexity warnings
- ✅ **performance**: Performance-related rules
- ✅ **security**: Security best practices
- ✅ **style**: Code style consistency (import types, etc.)
- ⚠️ **suspicious**: `any` type warnings

## Pre-commit Hook (Optional)

Add to `.husky/pre-commit` or use lint-staged:

```bash
#!/bin/sh
npm run check:biome
```

Or with lint-staged:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

## CI/CD Integration

In your CI pipeline (GitHub Actions, etc.):

```yaml
- name: Run Biome checks
  run: npm run check:biome:ci
```

The `ci` command will fail if there are any linting or formatting issues.

## Comparison with ESLint/Prettier

| Feature | Biome | ESLint + Prettier |
|---------|-------|-------------------|
| Speed | ⚡️ Very fast (Rust) | Slower (Node.js) |
| Setup | Minimal | More config needed |
| Format + Lint | ✅ Single tool | Two separate tools |
| Import sorting | ✅ Built-in | Needs plugin |
| IDE integration | ✅ Official extension | Multiple extensions |

## Learn More

- [Biome Documentation](https://biomejs.dev/)
- [Configuration Reference](https://biomejs.dev/reference/configuration/)
- [VS Code Extension](https://biomejs.dev/guides/editors/first-party-extensions/)
- [CLI Reference](https://biomejs.dev/reference/cli/)

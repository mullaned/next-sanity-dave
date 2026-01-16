# Semantic Release Setup

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate the versioning and release process.

## How It Works

Semantic-release analyzes your commit messages to determine the type of version bump needed:
- `fix:` commits trigger a **patch** release (e.g., 1.0.0 → 1.0.1)
- `feat:` commits trigger a **minor** release (e.g., 1.0.0 → 1.1.0)
- Commits with `BREAKING CHANGE:` in the body trigger a **major** release (e.g., 1.0.0 → 2.0.0)

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commitlint is configured to enforce this format.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

**Patch release (bug fix):**
```
fix: resolve navigation menu closing unexpectedly

Fixed an issue where the mobile navigation menu would close
when clicking inside it.
```

**Minor release (new feature):**
```
feat: add contact form component

Implemented a new contact form with validation and email
integration using SendGrid.
```

**Major release (breaking change):**
```
feat: update API response structure

BREAKING CHANGE: The API now returns data in a nested structure.
Clients must update to access data.response instead of data.
```

**With scope:**
```
fix(auth): prevent token expiration edge case
feat(ui): add dark mode toggle
docs(readme): update installation instructions
```

## Release Process

### Automatic Releases (CI/CD)

When commits are pushed to the `main` branch:

1. GitHub Actions runs the release workflow
2. Tests, type-checking, and linting are executed
3. If all checks pass, semantic-release:
   - Analyzes commit messages since the last release
   - Determines the version bump
   - Updates `package.json` and `package-lock.json`
   - Generates/updates `CHANGELOG.md`
   - Creates a git tag
   - Creates a GitHub release with release notes
   - Commits the changes back to the repo

### Manual Release (Local)

To test the release process locally (dry run):
```bash
npm run semantic-release -- --dry-run
```

To manually trigger a release (not recommended):
```bash
npm run semantic-release
```

## GitHub Setup

The release workflow requires the `GITHUB_TOKEN` which is automatically provided by GitHub Actions.

### Required Permissions

The workflow has these permissions configured:
- `contents: write` - To push commits and tags
- `issues: write` - To comment on issues
- `pull-requests: write` - To comment on PRs

## Configuration Files

- `.releaserc.json` - Semantic-release configuration
- `commitlint.config.js` - Commitlint rules
- `.husky/commit-msg` - Git hook to validate commit messages
- `.github/workflows/release.yml` - GitHub Actions workflow

## Plugins

This setup uses the following semantic-release plugins:

1. **@semantic-release/commit-analyzer** - Analyzes commits to determine version bump
2. **@semantic-release/release-notes-generator** - Generates release notes
3. **@semantic-release/changelog** - Creates/updates CHANGELOG.md
4. **@semantic-release/npm** - Updates package.json (npm publishing disabled)
5. **@semantic-release/git** - Commits release assets back to git
6. **@semantic-release/github** - Creates GitHub releases

## Tips

- **Always use conventional commits** - Commitlint will reject non-compliant messages
- **Merge PRs with conventional commit messages** - GitHub's squash and merge feature works well
- **Use `[skip ci]` in commit messages** to skip CI runs when needed
- **Breaking changes require documentation** - Always explain breaking changes in detail

## Troubleshooting

**Commits not triggering releases:**
- Ensure commits follow conventional format
- Check that commits are pushed to `main` branch
- Verify GitHub Actions workflow is enabled
- Check workflow logs in GitHub Actions tab

**Release workflow failing:**
- Check that all tests pass locally
- Ensure `GITHUB_TOKEN` has correct permissions
- Review workflow logs for specific errors

**Commitlint rejecting commits:**
- Review your commit message format
- Check `commitlint.config.js` for allowed types
- Use `git commit --amend` to fix the message

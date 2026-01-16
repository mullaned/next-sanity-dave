# Biome Setup Summary

## ✅ What Was Installed

1. **Biome Package**: `@biomejs/biome` installed at root level
2. **Configuration**: `biome.json` with custom settings for Next.js + Sanity
3. **Ignore File**: `.biomeignore` to exclude build outputs and generated files
4. **VS Code Integration**: Settings and extension recommendations

## 📦 Package Scripts Added

### Root Level (`/package.json`)
```bash
npm run format:biome      # Format all files
npm run lint:biome        # Lint all files  
npm run check:biome       # Format + lint all files
npm run check:biome:ci    # CI mode (fails on errors)
```

### Frontend (`/frontend/package.json`)
```bash
npm run format:biome      # Format frontend files
npm run lint:biome        # Lint frontend files
npm run check:biome       # Format + lint frontend files
```

### Studio (`/studio/package.json`)
```bash
npm run format:biome      # Format studio files
npm run lint:biome        # Lint studio files
npm run check:biome       # Format + lint studio files
```

## 🔧 Configuration Highlights

### Formatting
- **Indent**: 2 spaces (matching your project style)
- **Quotes**: Single quotes for JS/TS, double for JSX
- **Semicolons**: As needed (ASI-safe)
- **Line width**: 100 characters
- **Trailing commas**: All (better git diffs)

### Linting
- ✅ All recommended rules enabled
- ✅ Accessibility (a11y) checks
- ✅ Complexity warnings
- ✅ Unused imports/variables detection
- ✅ Import type enforcement
- ✅ Performance rules
- ✅ Security best practices
- ⚠️ Warnings for `any` types

### Ignored Files (`.biomeignore`)
- `node_modules`
- Build outputs (`.next`, `dist`, `out`, `storybook-static`)
- Generated files (`sanity.types.ts`, `schema.json`)
- Lock files
- Coverage reports

## 🎯 Next Steps

### 1. Install VS Code Extension
```bash
code --install-extension biomejs.biome
```

Or install via VS Code Extensions marketplace: `biomejs.biome`

### 2. Run Initial Format/Lint
```bash
# Format and lint entire project
npm run check:biome

# Or just the frontend
cd frontend && npm run check:biome
```

### 3. Configure Editor (Already Done!)
The `.vscode/settings.json` is configured to:
- Use Biome as default formatter
- Format on save
- Organize imports on save

### 4. Optional: Add Pre-commit Hook
Using Husky:
```bash
npm install --save-dev husky
npx husky init
echo "npm run check:biome:ci" > .husky/pre-commit
```

## 📊 Current Status

Biome found **4 issues** in the example story files:
- 2 SVG accessibility warnings (missing titles)
- 1 unique element ID warning
- 1 invalid anchor href warning

These are in the example Storybook files and can be fixed or ignored.

## 🚀 Usage Examples

### Format specific files
```bash
npx @biomejs/biome format --write frontend/app/**/*.tsx
```

### Lint with auto-fix
```bash
npx @biomejs/biome lint --write .
```

### Check without writing (CI mode)
```bash
npx @biomejs/biome ci .
```

### Show help
```bash
npx @biomejs/biome --help
```

## 📚 Documentation

- **Main README**: `/BIOME.md` - Comprehensive guide
- **Config File**: `/biome.json` - All settings
- **Ignore File**: `/.biomeignore` - Excluded paths
- **VS Code Settings**: `/.vscode/settings.json` - Editor config

## 🔄 Migration Notes

You currently have both **Prettier** and **Biome** in your project:
- Prettier is used in root `package.json` via `npm run format`
- Biome is now available via `npm run format:biome`

You can:
1. **Keep both**: Use Prettier for now, migrate gradually
2. **Switch to Biome**: Update `format` script to use Biome
3. **Migrate config**: Run `npx @biomejs/biome migrate prettier`

## ⚡️ Why Biome?

- **10-100x faster** than ESLint/Prettier (written in Rust)
- **All-in-one tool** - formatting + linting + import sorting
- **Better error messages** with suggestions
- **Zero config** works out of the box
- **Native TypeScript support**

---

**Your project is now configured with Biome!** 🎉

To get started, install the VS Code extension and run:
```bash
npm run check:biome
```

# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- Components: PascalCase (`App.tsx`)
- Entry points: camelCase (`main.tsx`)
- Styles: PascalCase matching component name (`App.css` pairs with `App.tsx`)

**Functions:**
- Arrow functions preferred in React components
- Component functions: PascalCase (`function App()`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleClick`)

**Variables:**
- State: camelCase with descriptive names (`count`, `setCount`)
- Constants: camelCase (no UPPER_SNAKE_CASE convention applied)
- React hooks: camelCase (`useState`, `useEffect`)

**Types:**
- Not yet in use (no custom types/interfaces in current codebase)
- TypeScript enforced via `strict: true` in `tsconfig.app.json`

## Code Style

**Formatting:**
- Automatic formatting via ESLint with flat config
- No Prettier configuration present; relies on ESLint rules

**Linting:**
- Tool: ESLint 9.39.1 with flat config format
- Config: `eslint.config.js`
- Key rules enforced:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` flat recommended rules
  - `eslint-plugin-react-refresh` vite config rules
- Run command: `npm run lint`

## Import Organization

**Order:**
1. React and React DOM imports (`import { useState } from 'react'`)
2. React DOM client imports (`import { createRoot } from 'react-dom/client'`)
3. Local CSS imports (`import './index.css'`)
4. Local component/file imports (`import App from './App.tsx'`)
5. Asset imports (`import viteLogo from '/vite.svg'`)

**Path Aliases:**
- Not configured; relative paths used throughout
- ESLint configured for bundler mode resolution

## Error Handling

**Patterns:**
- No error handling patterns established yet in codebase
- Recommend try-catch blocks for async operations when implemented
- Use conditional rendering for null/undefined values in JSX

## Logging

**Framework:** `console` (no logging framework detected)

**Patterns:**
- No logging implemented in current codebase
- When needed, use `console.log`, `console.error`, `console.warn` for debug purposes

## Comments

**When to Comment:**
- Component files contain minimal comments
- Code intent should be clear from naming conventions
- Use comments only for non-obvious logic

**JSDoc/TSDoc:**
- Not applied in current codebase
- Recommend using JSDoc for functions once codebase grows

## Function Design

**Size:**
- Components kept simple (App component ~25 lines)
- Prefer composition over large functions

**Parameters:**
- React components accept props (implicit)
- Event handlers receive event objects: `onClick={() => setCount((count) => count + 1)}`

**Return Values:**
- React components return JSX (implicit return in most cases)
- Non-component functions should explicitly return values

## Module Design

**Exports:**
- Default export for main components (`export default App`)
- Pattern: One component per file when possible

**Barrel Files:**
- Not used in current codebase
- Could be added to `src/index.ts` if needed for re-exports

## TypeScript Configuration

**Strict Mode:**
- `strict: true` enabled in `tsconfig.app.json`
- `noUnusedLocals: true` - unused variables flagged as errors
- `noUnusedParameters: true` - unused function parameters flagged as errors
- `noFallthroughCasesInSwitch: true` - switch statements must have explicit fallthrough
- `noUncheckedSideEffectImports: true` - side effect imports checked

**JSX Support:**
- `jsx: "react-jsx"` configured - supports new JSX transform (no need for React import for JSX)

---

*Convention analysis: 2026-01-26*

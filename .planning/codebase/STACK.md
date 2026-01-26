# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript ~5.9.3 - Full source codebase and configuration files

**Secondary:**
- JavaScript - Build configuration and tooling

## Runtime

**Environment:**
- Node.js 25.2.1 (tested version)
- Browser (React DOM target)

**Package Manager:**
- npm 11.6.2
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.2.0 - UI framework for building components
- React DOM 19.2.0 - React rendering for web browsers

**Build/Dev:**
- Vite (rolldown-vite 7.2.5) - Fast frontend build tool and dev server
- @vitejs/plugin-react 5.1.1 - React integration for Vite

## Key Dependencies

**Critical:**
- react 19.2.0 - Core React library
- react-dom 19.2.0 - DOM rendering
- vite (rolldown-vite 7.2.5) - Build system and dev server

**Development & Quality:**
- typescript 5.9.3 - Type checking and compilation
- eslint 9.39.1 - Code linting
- @eslint/js 9.39.1 - ESLint JavaScript rules
- typescript-eslint 8.46.4 - TypeScript-specific linting
- eslint-plugin-react-hooks 7.0.1 - React hooks best practices
- eslint-plugin-react-refresh 0.4.24 - React Fast Refresh support
- @types/react 19.2.5 - Type definitions for React
- @types/react-dom 19.2.3 - Type definitions for React DOM
- @types/node 24.10.1 - Node.js type definitions
- globals 16.5.0 - Global browser variable definitions

## Configuration

**Environment:**
- No `.env` files detected - Configuration handled via environment
- Supports `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local` (in `.gitignore`)
- No environment variables currently required or documented

**Build:**
- `vite.config.ts` - Vite configuration with React plugin
- `tsconfig.json` - Root TypeScript configuration (references app and node configs)
- `tsconfig.app.json` - Application TypeScript settings with ES2022 target
- `tsconfig.node.json` - Build tools TypeScript settings
- `eslint.config.js` - ESLint flat configuration with React, TypeScript, and hooks support

**TypeScript Compiler Options:**
- Target: ES2022
- Module: ESNext
- Strict mode: enabled
- JSX: react-jsx
- No unused locals or parameters allowed
- Module resolution: bundler

## Platform Requirements

**Development:**
- Node.js 25.2.1 or compatible version
- npm 11.6.2 or compatible version
- Modern terminal/shell environment
- macOS/Linux/Windows with Node.js support

**Production:**
- Modern browser with ES2022 support (Safari 16.2+, Chrome 113+, Firefox 112+, Edge 113+)
- Static file hosting (any CDN or web server supporting static SPA serving)
- No backend server required (client-side only application)

## Build Output

**Development:**
- `npm run dev` - Vite dev server with HMR (Hot Module Replacement)

**Production:**
- `npm run build` - Produces optimized bundle in `dist/` directory
- Output: Static HTML/CSS/JS assets ready for deployment

---

*Stack analysis: 2026-01-26*

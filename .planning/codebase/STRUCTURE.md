# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
movies-phobia/
├── src/                    # Application source code
│   ├── App.tsx            # Root React component
│   ├── App.css            # App component styles
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles
│   └── assets/            # Static assets (images, SVGs)
│       └── react.svg      # React logo
├── public/                # Public static files (served as-is)
├── index.html             # HTML entry point
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript root configuration
├── tsconfig.app.json      # TypeScript app-specific configuration
├── tsconfig.node.json     # TypeScript build tool configuration
├── vite.config.ts         # Vite bundler configuration
├── eslint.config.js       # ESLint configuration
├── .gitignore             # Git ignore rules
└── node_modules/          # Installed dependencies (not committed)
```

## Directory Purposes

**src/:**
- Purpose: All application source code and styling
- Contains: React components, TypeScript files, CSS stylesheets
- Key files: `App.tsx` (main component), `main.tsx` (entry), `index.css` (global styles)

**src/assets/:**
- Purpose: Static assets referenced by components
- Contains: Images, SVGs, icons
- Key files: `react.svg` (React branding)

**public/:**
- Purpose: Static files served directly without bundling
- Contains: Favicon, manifest, any static resources
- Key files: Will contain public assets in production

**.planning/codebase/:**
- Purpose: Architecture and planning documentation
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md (as created)

## Key File Locations

**Entry Points:**
- `index.html`: HTML document loaded by browser, provides mount target and loads main.tsx script
- `src/main.tsx`: TypeScript module that initializes React and mounts App component
- `src/App.tsx`: Root React component containing all application UI

**Configuration:**
- `vite.config.ts`: Build tool configuration (using React plugin)
- `tsconfig.json`: TypeScript compiler root configuration
- `tsconfig.app.json`: TypeScript settings for application source code (strict mode enabled)
- `eslint.config.js`: Linting rules for code quality
- `package.json`: Project metadata, dependencies, build scripts

**Core Logic:**
- `src/App.tsx`: Main application component with UI structure and state management
- `src/assets/react.svg`: Brand asset used in UI

**Styling:**
- `src/index.css`: Global styles, typography, theme variables, and responsive design
- `src/App.css`: Component-specific styles, animations, and layout rules

## Naming Conventions

**Files:**
- `.tsx`: React component files (TypeScript JSX)
- `.css`: Stylesheet files
- `.json`: Configuration and manifest files
- `*.config.ts`: Build/tool configuration files

**Directories:**
- `src/`: Source code directory
- `public/`: Public assets directory
- `node_modules/`: Dependencies (convention)

**Component Files:**
- `App.tsx`: Pascal case for React components
- `App.css`: Component name + .css extension

**Utility/Config Files:**
- `main.tsx`, `index.css`: Lowercase for non-component modules

## Where to Add New Code

**New Feature:**
- Primary code: `src/` directory - create new .tsx component files as needed
- Tests: Create `.test.tsx` or `.spec.tsx` files alongside source (when testing is added)
- Styles: Create `.css` files alongside components or use `src/App.css` for shared styles

**New Component/Module:**
- Implementation: `src/[ComponentName].tsx` for new components
- Styling: `src/[ComponentName].css` for component-specific styles
- If component becomes complex, create `src/components/` subdirectory with component files

**Utilities:**
- Shared helpers: Create `src/utils/` directory for utility functions
- Custom hooks: Create `src/hooks/` directory for reusable hooks
- Types: Create `src/types/` directory for shared TypeScript types/interfaces

**Assets:**
- Static images/SVGs: `src/assets/` - organized by type if needed (e.g., `src/assets/icons/`, `src/assets/images/`)

## Special Directories

**node_modules/:**
- Purpose: Contains all installed npm dependencies
- Generated: Yes (by npm install)
- Committed: No (listed in .gitignore)

**dist/:**
- Purpose: Production build output (created by `npm run build`)
- Generated: Yes (by Vite build command)
- Committed: No (created at build time)

**.git/:**
- Purpose: Git version control metadata
- Generated: Yes (by git init)
- Committed: No (system directory)

---

*Structure analysis: 2026-01-26*

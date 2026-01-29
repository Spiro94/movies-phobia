---
task: quick-006
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - tailwind.config.js
  - postcss.config.js
  - src/index.css
  - src/App.css
  - src/App.tsx
  - src/components/MovieBrowser/MovieCard.tsx
  - src/components/DangerBadge/DangerBadge.tsx
  - src/components/MovieBrowser/MovieGrid.tsx
  - src/components/MovieBrowser/MovieBrowser.tsx
  - src/components/Sidebar/PhobiaSidebar.tsx
  - src/components/PhobiaModal/PhobiaModal.tsx
  - src/components/PhobiaModal/PhobiaSelector.tsx
  - src/components/MovieDetail/MovieDetail.tsx
  - src/components/MovieDetail/MovieDetailHeader.tsx
  - src/components/Timeline/SceneTimeline.tsx
  - src/components/SceneTagModal/SceneTagModal.tsx
  - src/components/SceneTagModal/TagForm.tsx
  - src/components/SceneTagModal/TimelineTags.tsx
autonomous: true
---

<objective>
Migrate the Movies Phobia project from inline styles to Tailwind CSS utility classes.

Purpose: Improve maintainability, reduce component file sizes, enable consistent design system, and simplify styling with utility-first approach. Inline styles scattered throughout 15+ components create maintenance burden and inconsistency.

Output: Fully Tailwind-ified codebase with zero inline styles, configured build system, and preserved visual appearance.
</objective>

<execution_context>
@/Users/danielvillamizar/.claude/get-shit-done/workflows/execute-plan.md
@/Users/danielvillamizar/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

## Current State
- React 19 + Vite (rolldown) + TypeScript
- Inline styles in every component (style={{ ... }})
- Material UI for Timeline and Dialog components (keep these)
- Dark theme (#0a0a0a background, #1a1a1a cards)
- Responsive grid layouts, hover effects, animations
- No existing Tailwind or PostCSS config

## Key Patterns to Preserve
- Dark color scheme: bg-[#0a0a0a], bg-[#1a1a1a], text-white
- Danger score colors: green (#4caf50), yellow (#ff9800), red (#f44336)
- Card hover lift effect: hover:translate-y-[-4px]
- Border radius: 8px (rounded-lg), 4px (rounded)
- Shadows: 0 2px 8px rgba(0,0,0,0.2)
- Grid layout: responsive columns (1 on mobile, 3+ on desktop)

## Migration Strategy
1. Install Tailwind + PostCSS + Autoprefixer
2. Configure Tailwind with custom colors matching existing palette
3. Create base styles in index.css
4. Migrate components systematically (App → Cards → Badges → Modals)
5. Keep Material UI components untouched (Timeline, Dialog)
6. Test visual parity after migration
</context>

<tasks>

<task type="auto">
  <name>Install and configure Tailwind CSS</name>
  <files>
    package.json
    tailwind.config.js
    postcss.config.js
    src/index.css
  </files>
  <action>
Install latest Tailwind CSS dependencies:
```bash
npm install -D tailwindcss postcss autoprefixer
```

Create tailwind.config.js with custom colors matching existing palette:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          green: '#4caf50',
          yellow: '#ff9800',
          red: '#f44336',
        },
        app: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#333',
        }
      },
    },
  },
  plugins: [],
}
```

Create postcss.config.js:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Replace src/index.css content with Tailwind directives and base styles:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color-scheme: dark;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply m-0 min-w-[320px] min-h-screen bg-app-bg text-white;
  }

  #root {
    @apply w-full min-h-screen;
  }

  a {
    @apply font-medium no-underline;
  }
}
```

Update src/App.css to remove styles (will use Tailwind classes):
```css
/* Styles moved to Tailwind utility classes */
```
  </action>
  <verify>
- Run `npm run dev` and confirm Tailwind CSS loads without errors
- Check browser dev tools that Tailwind utilities are applied
- Verify no PostCSS or build errors in console
  </verify>
  <done>
Tailwind CSS installed, configured with custom colors matching existing palette (danger-green/yellow/red, app-bg/card/border), PostCSS pipeline working, base styles migrated to index.css with @layer directives.
  </done>
</task>

<task type="auto">
  <name>Migrate core components to Tailwind</name>
  <files>
    src/App.tsx
    src/components/MovieBrowser/MovieCard.tsx
    src/components/DangerBadge/DangerBadge.tsx
    src/components/MovieBrowser/MovieGrid.tsx
    src/components/MovieBrowser/MovieBrowser.tsx
  </files>
  <action>
Replace all inline styles with Tailwind utility classes. Match existing visual appearance exactly.

**App.tsx header:**
- Remove style objects
- Apply: `bg-app-card border-b border-app-border p-5 text-center`
- h1: `m-0 mb-2 text-[28px] font-bold text-white`
- p: `m-0 text-sm text-gray-400`

**MovieCard.tsx:**
- Link container: `flex flex-col rounded-lg overflow-hidden bg-app-card shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 no-underline text-inherit`
- Remove onMouseEnter/onMouseLeave handlers (use hover: class)
- Image container: `relative w-full aspect-[2/3]`
- Image: `w-full h-full object-cover`
- Content div: `p-3`
- h3: `m-0 mb-2 text-base font-semibold leading-tight`
- Overview p: `m-0 mb-3 text-[13px] leading-snug opacity-80 line-clamp-3`
- Badges container: `flex flex-wrap gap-1.5`
- No phobias message: `text-xs text-danger-yellow italic`

**DangerBadge.tsx:**
- Remove inline styles
- Apply: `inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold`
- Use dynamic className for backgroundColor: `${color === '#4caf50' ? 'bg-danger-green' : color === '#ff9800' ? 'bg-danger-yellow' : 'bg-danger-red'}`
- OR create style prop ONLY for dynamic color: `style={{ backgroundColor: color }}`

**MovieGrid.tsx:**
- Replace grid styles with: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6`

**MovieBrowser.tsx:**
- Main container: `min-h-screen bg-app-bg`
- Content wrapper: `p-6`
- Search input container: `mb-6`
- Input: Replace inline styles with appropriate Tailwind classes for dark theme input

Keep all logic (hover handlers if needed, state management, etc.) unchanged. Only replace styling.
  </action>
  <verify>
- Run `npm run dev`
- Navigate to movie browser
- Confirm cards display in responsive grid
- Test hover effects on movie cards (lift animation)
- Verify danger badges show correct colors
- Check header styling matches original
- Test search input styling
  </verify>
  <done>
Core components (App, MovieCard, DangerBadge, MovieGrid, MovieBrowser) fully migrated to Tailwind classes, no inline styles remain in these files, visual appearance preserved including hover effects, responsive grid, and color scheme.
  </done>
</task>

<task type="auto">
  <name>Migrate remaining components to Tailwind</name>
  <files>
    src/components/Sidebar/PhobiaSidebar.tsx
    src/components/PhobiaModal/PhobiaModal.tsx
    src/components/PhobiaModal/PhobiaSelector.tsx
    src/components/MovieDetail/MovieDetail.tsx
    src/components/MovieDetail/MovieDetailHeader.tsx
    src/components/Timeline/SceneTimeline.tsx
    src/components/SceneTagModal/SceneTagModal.tsx
    src/components/SceneTagModal/TagForm.tsx
    src/components/SceneTagModal/TimelineTags.tsx
  </files>
  <action>
Migrate all remaining component inline styles to Tailwind utility classes.

**General pattern for all components:**
1. Read each file
2. Identify all `style={{ ... }}` props
3. Convert to equivalent Tailwind classes using className
4. For dynamic styles (computed colors, conditional values), keep minimal inline style OR use template literals in className
5. Preserve all Material UI component props (Timeline, Dialog, etc.) - only migrate custom divs/spans/buttons
6. Match existing spacing, colors, typography exactly

**Common conversions:**
- `backgroundColor: '#1a1a1a'` → `bg-app-card`
- `padding: '20px'` → `p-5`
- `margin: '0 0 8px 0'` → `m-0 mb-2`
- `fontSize: '14px'` → `text-sm`
- `fontWeight: '600'` → `font-semibold`
- `borderRadius: '8px'` → `rounded-lg`
- `display: 'flex'` → `flex`
- `flexDirection: 'column'` → `flex-col`
- `gap: '8px'` → `gap-2`
- `color: '#fff'` → `text-white`
- `opacity: '0.8'` → `opacity-80`

**Special considerations:**
- PhobiaSidebar: Preserve sidebar positioning (fixed/sticky), overlay styles
- PhobiaModal: Keep Dialog component props, migrate only wrapper divs
- MovieDetail: Maintain full-width layout (no max-width constraint)
- Timeline: DO NOT modify Material UI Timeline component styles
- SceneTagModal: Keep Dialog/Modal backdrop classes from Headless UI

**DO NOT:**
- Modify Material UI component internals (Timeline, TimelineDot, etc.)
- Change Headless UI Dialog component classes
- Add Tailwind to third-party library components
- Change any business logic or state management

For each file:
1. Read current implementation
2. Map inline styles to Tailwind classes
3. Update file preserving all functionality
4. Verify no styles lost in translation
  </action>
  <verify>
- Run `npm run dev`
- Test full user flow:
  1. Open app, see movie grid
  2. Click "Select Phobias" → phobia modal opens
  3. Select 2-3 phobias → sidebar appears
  4. Click a movie → detail page loads
  5. Click "Tag a Scene" → scene tag modal opens
  6. View timeline if tags exist
- Confirm all modals styled correctly (backdrop, positioning, borders)
- Check sidebar styling and positioning
- Verify movie detail page header and layout
- Test timeline component displays properly
- Ensure all forms and inputs styled consistently
- Grep for remaining inline styles: `rg "style={{" src/components/` should return ZERO results (except dynamic colors if needed)
  </verify>
  <done>
All components migrated to Tailwind CSS, zero inline style objects remain in codebase (except minimal dynamic values like computed colors), visual parity achieved, all user flows tested and working, Material UI and Headless UI components preserved.
  </done>
</task>

</tasks>

<verification>
Run comprehensive checks:

```bash
# Check for remaining inline styles (should be none or minimal)
rg "style={{" src/ --type tsx

# Verify Tailwind build output
npm run build

# Run dev server and manual testing
npm run dev
```

Visual regression checklist:
- [ ] App header matches original (dark background, centered text)
- [ ] Movie grid responsive (1 col mobile, 5 cols desktop)
- [ ] Movie cards have hover lift effect
- [ ] Danger badges show correct colors (green/yellow/red)
- [ ] Phobia modal opens and closes smoothly
- [ ] Sidebar appears when phobias selected
- [ ] Movie detail page full-width layout
- [ ] Timeline component renders correctly
- [ ] Scene tag modal functional
- [ ] All text sizes and weights match
- [ ] All spacing and gaps preserved
- [ ] Dark theme consistent throughout
</verification>

<success_criteria>
1. Latest Tailwind CSS version installed with PostCSS and Autoprefixer
2. tailwind.config.js created with custom color palette (danger colors, app colors)
3. All inline styles removed from components (zero `style={{ ... }}` in src/components/)
4. Visual appearance identical to pre-migration state
5. All user flows functional (search, select phobias, view movies, tag scenes)
6. Material UI components untouched (Timeline, Dialog)
7. Build succeeds without errors
8. Dev server runs without warnings
</success_criteria>

<output>
After completion, create `.planning/quick/006-migrate-to-tailwind-css/006-SUMMARY.md` documenting:
- Dependencies added (tailwindcss, postcss, autoprefixer versions)
- Config files created (tailwind.config.js, postcss.config.js)
- Components migrated (count + list)
- Custom colors defined in theme
- Any edge cases where inline styles were kept (if any)
- Before/after comparison (inline styles count)
</output>

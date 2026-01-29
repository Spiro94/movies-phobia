---
phase: quick-007
plan: 007
type: execute
wave: 1
depends_on: []
files_modified:
  - src/index.css
  - tailwind.config.js
autonomous: true

must_haves:
  truths:
    - "Custom danger colors (green/yellow/red) render correctly in UI"
    - "Custom app colors (bg/card/border) apply properly to components"
    - "Tailwind utilities (bg-app-bg, text-danger-green, etc.) work without errors"
  artifacts:
    - path: "src/index.css"
      provides: "@theme directive with custom color definitions"
      contains: "@theme"
    - path: "tailwind.config.js"
      provides: "Clean config without theme.extend.colors"
      min_lines: 10
  key_links:
    - from: "src/index.css"
      to: "Tailwind utility classes"
      via: "@theme directive"
      pattern: "@theme.*--color-"
---

<objective>
Migrate from Tailwind 3.x config-based colors to Tailwind 4+ CSS-based theme system using @theme directive.

Purpose: Fix broken custom color utilities by moving color definitions from tailwind.config.js to index.css using CSS variables.
Output: Working Tailwind 4 theme with custom danger-* and app-* colors defined via @theme directive.
</objective>

<execution_context>
@/Users/danielvillamizar/.claude/get-shit-done/workflows/execute-plan.md
@/Users/danielvillamizar/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/danielvillamizar/personal/react/movies-phobia/.planning/STATE.md
@/Users/danielvillamizar/personal/react/movies-phobia/tailwind.config.js
@/Users/danielvillamizar/personal/react/movies-phobia/src/index.css
@/Users/danielvillamizar/personal/react/movies-phobia/package.json
</context>

<tasks>

<task type="auto">
  <name>Migrate custom colors to CSS @theme directive</name>
  <files>
    src/index.css
    tailwind.config.js
  </files>
  <action>
**1. Update src/index.css:**

Add @theme directive AFTER @tailwind directives with custom color definitions using CSS variable syntax:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  /* Danger score colors */
  --color-danger-green: #4caf50;
  --color-danger-yellow: #ff9800;
  --color-danger-red: #f44336;

  /* App theme colors */
  --color-app-bg: #0a0a0a;
  --color-app-card: #1a1a1a;
  --color-app-border: #333;
}

@layer base {
  /* existing base styles remain unchanged */
}
```

**Why @theme not :root:** Tailwind 4 uses @theme to generate utility classes (bg-danger-green, text-app-bg, etc.). CSS variables in :root don't create utilities.

**2. Update tailwind.config.js:**

Remove theme.extend.colors entirely:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Why remove config colors:** Tailwind 4+ uses CSS-based theming. Config-based colors are legacy and don't work properly in v4.
  </action>
  <verify>
Run dev server and check browser console for Tailwind errors:
```bash
npm run dev
```

Visit http://localhost:5173 and verify:
- No Tailwind utility class errors in console
- Background colors render (app-bg, app-card)
- Danger colors appear in MovieCard and PhobiaModal components
- No "unknown utility" warnings

Grep for usage to confirm classes are present:
```bash
grep -r "bg-app-bg\|bg-app-card\|border-app-border" src/ | wc -l
grep -r "text-danger-green\|text-danger-yellow\|text-danger-red" src/ | wc -l
```
  </verify>
  <done>
- index.css contains @theme directive with 6 custom color variables
- tailwind.config.js has empty theme.extend object
- Dev server runs without Tailwind utility errors
- Custom colors render correctly in UI (verified visually)
- All existing bg-app-*, text-danger-*, border-app-* classes work
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Tailwind 4 CSS-based theme migration complete:
- Custom danger colors (green/yellow/red) defined via @theme
- Custom app colors (bg/card/border) defined via @theme
- Config file cleaned up (no theme.extend.colors)
- All 13+ components using custom colors now functional
  </what-built>
  <how-to-verify>
1. Start dev server: `npm run dev`
2. Visit http://localhost:5173
3. Check visual rendering:
   - Background should be dark (#0a0a0a) - bg-app-bg on body
   - Cards should have darker background (#1a1a1a) - bg-app-card
   - Danger scores should show green/yellow/red text colors
4. Open browser DevTools Console:
   - Should see NO Tailwind warnings about unknown utilities
   - Should see NO errors about undefined custom properties
5. Test different pages:
   - Movie browser (MovieCard uses danger colors)
   - Movie detail (danger score header uses danger colors)
   - Phobia modal (uses app-card, app-border)
   - Scene tag modal (uses app-card)

Expected: All custom colors render correctly, no console errors.
  </how-to-verify>
  <resume-signal>
Type "approved" if colors render correctly and no console errors, or describe any visual/functional issues.
  </resume-signal>
</task>

</tasks>

<verification>
Run build to ensure production bundle works:
```bash
npm run build
```

Should complete without Tailwind errors.

Check that custom color utilities are generated:
```bash
grep -r "@theme" src/index.css
grep -r "theme.*extend.*colors" tailwind.config.js
```

First command should show @theme block, second should find nothing (colors removed from config).
</verification>

<success_criteria>
- [ ] src/index.css has @theme directive with 6 custom color definitions
- [ ] tailwind.config.js has no theme.extend.colors
- [ ] Dev server runs without Tailwind utility warnings
- [ ] Production build completes successfully
- [ ] All components using custom colors render correctly
- [ ] Browser console shows no "unknown utility" errors
- [ ] User confirms visual verification passed
</success_criteria>

<output>
After completion, create `.planning/quick/007-fix-tailwind-4-config/007-SUMMARY.md`
</output>

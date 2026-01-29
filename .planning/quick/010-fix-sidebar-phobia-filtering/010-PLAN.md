---
phase: quick-010
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/contexts/PhobiaContext.tsx
  - src/App.tsx
  - src/components/Sidebar/PhobiaSidebar.tsx
  - src/components/MovieBrowser/MovieBrowser.tsx
autonomous: true

must_haves:
  truths:
    - "Toggling phobia in sidebar immediately filters movie grid"
    - "Deselecting phobia removes filter and shows all movies"
    - "Multiple sidebar components share same phobia state"
  artifacts:
    - path: "src/contexts/PhobiaContext.tsx"
      provides: "Shared phobia state via React Context"
      exports: ["PhobiaProvider", "usePhobiaContext"]
      min_lines: 40
  key_links:
    - from: "src/components/Sidebar/PhobiaSidebar.tsx"
      to: "PhobiaContext"
      via: "usePhobiaContext hook"
      pattern: "usePhobiaContext"
    - from: "src/components/MovieBrowser/MovieBrowser.tsx"
      to: "PhobiaContext"
      via: "usePhobiaContext hook"
      pattern: "usePhobiaContext"
    - from: "src/App.tsx"
      to: "PhobiaProvider"
      via: "wraps Routes"
      pattern: "<PhobiaProvider>"
---

<objective>
Fix sidebar phobia filtering by creating shared state context.

**Purpose:** Enable real-time movie filtering when users toggle phobias in the sidebar by replacing independent hook instances with a shared Context provider.

**Root cause:** PhobiaSidebar and MovieBrowser each call usePhobias() independently, creating separate state instances. Changes in PhobiaSidebar don't propagate to MovieBrowser.

**Output:** Working phobia filter where sidebar toggles immediately filter the movie grid.
</objective>

<execution_context>
@/Users/danielvillamizar/.claude/get-shit-done/workflows/execute-plan.md
@/Users/danielvillamizar/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@src/hooks/usePhobias.ts
@src/components/Sidebar/PhobiaSidebar.tsx
@src/components/MovieBrowser/MovieBrowser.tsx
@src/App.tsx
</context>

<tasks>

<task type="auto">
  <name>Create PhobiaContext and refactor state management</name>
  <files>
    src/contexts/PhobiaContext.tsx
    src/App.tsx
    src/components/Sidebar/PhobiaSidebar.tsx
    src/components/MovieBrowser/MovieBrowser.tsx
  </files>
  <action>
**Step 1: Create PhobiaContext (NEW FILE)**

Create `src/contexts/PhobiaContext.tsx`:
- Move all logic from usePhobias hook into PhobiaProvider component
- Provider manages selectedPhobias state, localStorage sync, togglePhobia, setPhobias
- Export PhobiaProvider component and usePhobiaContext hook
- usePhobiaContext throws error if used outside provider (pattern: "must be used within PhobiaProvider")
- Keep same interface: { selectedPhobias, togglePhobia, setPhobias, isLoaded }

**Step 2: Wrap app with PhobiaProvider**

Update `src/App.tsx`:
- Import PhobiaProvider from contexts/PhobiaContext
- Wrap Routes with PhobiaProvider (inside QueryClientProvider, BrowserRouter)
- Structure: QueryClientProvider > BrowserRouter > div.app > header + PhobiaProvider > Routes

**Step 3: Update PhobiaSidebar to use context**

Update `src/components/Sidebar/PhobiaSidebar.tsx`:
- Replace `import { usePhobias } from '../../hooks/usePhobias'` with `import { usePhobiaContext } from '../../contexts/PhobiaContext'`
- Replace `const { selectedPhobias, togglePhobia, setPhobias } = usePhobias()` with `const { selectedPhobias, togglePhobia, setPhobias } = usePhobiaContext()`
- No other changes needed

**Step 4: Update MovieBrowser to use context**

Update `src/components/MovieBrowser/MovieBrowser.tsx`:
- Replace `import { usePhobias } from '../../hooks/usePhobias'` with `import { usePhobiaContext } from '../../contexts/PhobiaContext'`
- Replace `const { selectedPhobias } = usePhobias()` with `const { selectedPhobias } = usePhobiaContext()`
- No other changes needed

**What NOT to change:**
- Keep usePhobias.ts file (may be used elsewhere, or removed in future cleanup)
- Don't modify filtering logic in MovieBrowser (already correct from task 009)
- Don't modify PhobiaSelector component (already correctly calls onToggle)
  </action>
  <verify>
1. Run `npm run dev` - app starts without errors
2. Open browser to localhost
3. Toggle any phobia in sidebar - movie grid updates immediately
4. Select multiple phobias - grid shows movies matching ANY selected phobia
5. Deselect all - grid shows all movies again
6. Refresh page - selected phobias persist via localStorage
  </verify>
  <done>
- PhobiaContext.tsx exists with PhobiaProvider and usePhobiaContext
- App.tsx wraps Routes with PhobiaProvider
- PhobiaSidebar uses usePhobiaContext instead of usePhobias
- MovieBrowser uses usePhobiaContext instead of usePhobias
- Toggling sidebar phobias filters movie grid in real-time
- Multiple toggles work without delay
- State persists across page refresh
  </done>
</task>

</tasks>

<verification>
**Manual testing:**
1. Start app, note current movie count
2. Select "arachnophobia" in sidebar
3. Grid should show only movies with spider scene tags
4. Select additional phobia (e.g., "acrophobia")
5. Grid should show movies with spider OR height tags
6. Deselect "arachnophobia"
7. Grid should show only movies with height tags
8. Deselect all
9. Grid should show all movies
10. Refresh page - selections should persist

**Code inspection:**
- grep "usePhobias()" shows it's replaced with usePhobiaContext() in sidebar and browser
- grep "PhobiaProvider" shows it wraps Routes in App.tsx
- PhobiaContext.tsx exports both provider and hook
</verification>

<success_criteria>
- [ ] PhobiaContext.tsx created with provider and hook
- [ ] App.tsx wraps Routes with PhobiaProvider
- [ ] PhobiaSidebar imports and uses usePhobiaContext
- [ ] MovieBrowser imports and uses usePhobiaContext
- [ ] Toggling sidebar phobia filters movie grid immediately
- [ ] Multiple phobias work with OR logic (any match)
- [ ] Deselecting phobias removes filters correctly
- [ ] State persists via localStorage across refresh
- [ ] No console errors or warnings
</success_criteria>

<output>
After completion, create `.planning/quick/010-fix-sidebar-phobia-filtering/010-SUMMARY.md` documenting the context pattern and state sharing fix.
</output>

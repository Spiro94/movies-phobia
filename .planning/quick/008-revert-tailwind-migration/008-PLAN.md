---
type: quick
plan: 008
autonomous: true
files_modified:
  - src/index.css
  - src/components/**/*.tsx
  - tailwind.config.js
  - package.json
  - package-lock.json
---

<objective>
Revert Tailwind CSS migration (quick tasks 006 and 007) to restore stable styling.

Purpose: Tasks 006 and 007 broke styling throughout the app. Return to last known stable commit (992f768) where all features worked correctly.
Output: Working app with original inline styling, all Tailwind changes removed.
</objective>

<execution_context>
@/Users/danielvillamizar/.claude/get-shit-done/workflows/execute-plan.md
@/Users/danielvillamizar/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md

## Problem

Two quick tasks broke styling:
- **Quick 006** (commits: 6ebe837, 3ec274b, 8bd048b, 780e904): Migrated from inline styles to Tailwind CSS
- **Quick 007** (commits: 38fa016, a9fbc84, 6915926): Attempted to fix Tailwind 4 config issues

Result: App styling is broken throughout.

## Solution

Use `git revert` to undo commits 6915926 through 6ebe837 (7 commits total), returning to commit 992f768 (fix scene-tag-modal headless ui v2) where everything worked.

## Last Stable Commit

```
992f768 fix(scene-tag-modal): fix headless ui v2 dialog implementation
```

All features functional: search, movie detail, scene tagging, phobia selection, danger scores.
</context>

<tasks>

<task type="auto">
  <name>Revert Tailwind migration commits</name>
  <files>
    src/index.css
    src/components/**/*.tsx
    tailwind.config.js
    package.json
    package-lock.json
  </files>
  <action>
Revert the 7 commits that introduced and attempted to fix Tailwind CSS migration:

1. Revert commits in reverse chronological order (newest to oldest):
   ```bash
   git revert --no-edit 6915926  # docs(quick-007): complete Tailwind 4 CSS theme migration
   git revert --no-edit a9fbc84  # feat(quick-007): migrate to Tailwind 4 CSS-based theme
   git revert --no-edit 38fa016  # docs(quick-007): create Tailwind 4 CSS theme migration plan
   git revert --no-edit 780e904  # docs(quick-006): Migrate project to Tailwind CSS from inline styles
   git revert --no-edit 4835f38  # docs(quick-006): complete Tailwind CSS migration
   git revert --no-edit 8bd048b  # refactor(quick-006): migrate remaining components to Tailwind CSS
   git revert --no-edit 3ec274b  # refactor(quick-006): migrate core components to Tailwind CSS
   git revert --no-edit 6ebe837  # chore(quick-006): install and configure Tailwind CSS
   ```

2. If any revert conflicts occur, resolve by choosing pre-006 version (the original inline styles)

3. Reinstall dependencies to ensure Tailwind is removed:
   ```bash
   npm install
   ```

4. Verify app starts without errors:
   ```bash
   npm run dev
   ```

Why individual reverts: Maintains full git history and audit trail. Each revert commit shows exactly what was undone.
  </action>
  <verify>
Run verification checks:
```bash
# 1. Check Tailwind is removed from package.json
grep -q "tailwindcss" package.json && echo "FAIL: Tailwind still in deps" || echo "PASS: Tailwind removed"

# 2. Check index.css has no @tailwind directives
grep -q "@tailwind" src/index.css && echo "FAIL: Tailwind directives remain" || echo "PASS: No Tailwind directives"

# 3. Verify app runs
npm run dev
```

Manual check in browser:
- Visit http://localhost:5173
- Search for a movie
- View movie detail page
- Check styling looks correct (no broken layouts, colors, spacing)
  </verify>
  <done>
- All 8 revert commits created successfully
- Tailwind CSS removed from package.json dependencies
- src/index.css has no @tailwind directives
- tailwind.config.js removed or empty
- App runs without console errors
- All components render with original inline styles
- Layouts, colors, and spacing match pre-006 state
  </done>
</task>

</tasks>

<verification>
**Functional checks:**
1. App starts: `npm run dev` runs without errors
2. Search works: Can search and see movie results
3. Movie detail works: Can view movie detail page with proper layout
4. Scene tagging works: Can open modal and add scene tags
5. Danger scores work: Scores calculate and display correctly
6. Phobia selection works: Sidebar persists and updates scores

**Code checks:**
1. No Tailwind in package.json
2. No @tailwind directives in src/index.css
3. Components use inline styles (style prop with objects)
4. No className with Tailwind utilities (bg-*, text-*, flex, etc.)
</verification>

<success_criteria>
- App restored to commit 992f768 functionality
- All Tailwind CSS changes reverted
- Original inline styling working throughout app
- No styling regressions from pre-006 state
- Clean git history with 8 revert commits documenting the rollback
</success_criteria>

<output>
After completion, create `.planning/quick/008-revert-tailwind-migration/008-SUMMARY.md`
</output>

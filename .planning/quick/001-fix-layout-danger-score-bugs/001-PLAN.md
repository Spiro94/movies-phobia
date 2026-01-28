---
task: 001
type: bugfix
priority: blocker
files_modified:
  - src/components/MovieDetail/MovieDetail.tsx
  - src/components/MovieDetail/MovieDetailHeader.tsx
  - src/utils/dangerScoring.ts
autonomous: true
---

# Quick Task 001: Fix Layout and Danger Score Bugs

<objective>
Fix three related bugs in the movie details interface:
1. Content width shrinkage during loading (60% instead of 100%)
2. Danger scores not updating immediately after adding tags
3. Incorrect danger score calculation (9/100 instead of 90/100 for 9/10 intensity)

Purpose: Restore proper layout behavior and correct danger score calculation/display
Output: Fixed layout, real-time score updates, and accurate score-to-color mapping
</objective>

<root_cause_analysis>

## Bug 1: Content Shrinks to 60% Width
**Symptom:** Movie details screen only occupies 60% of screen width during loading
**Root Cause:** Loading state returns early WITHOUT wrapping content in `.movie-detail` container
**Evidence:** Lines 17-29 in MovieDetail.tsx show loading state returns bare `<div>` without the parent `.movie-detail` wrapper that other states have (line 93)
**Fix:** Wrap loading/error/not-found states in `.movie-detail` container for consistent width

## Bug 2: Danger Score Not Updating Immediately
**Symptom:** Score only updates after navigating away and back
**Root Cause:** MovieDetailHeader reads tags via `useSceneTags`, which updates localStorage but doesn't trigger React re-render in parent components
**Evidence:**
- useSceneTags (line 20-22) updates localStorage in useEffect
- MovieDetailHeader (line 15) calls useSceneTags independently
- No dependency between MovieDetail's tag modal and MovieDetailHeader's tag read
**Fix:** The `tags` state from useSceneTags IS reactive. The issue is that the hook creates a fresh instance. This should already work because useSceneTags returns reactive state. Need to verify if the issue is elsewhere (possibly stale closure or missing key prop).

## Bug 3: Danger Score Shows 9/100 Instead of 90/100
**Symptom:** A 9/10 intensity tag displays as 9/100 with green color (should be 90/100 with red)
**Root Cause:** Intensity scale mismatch - tags store 1-10 scale, but danger scores expect 0-100 scale
**Evidence:**
- calculateDangerScores (line 22-28 in dangerScoring.ts) directly uses `tag.intensity` (1-10 scale)
- getDangerColor (line 85-93) expects 0-100 scale (≤30 green, ≤70 yellow, >70 red)
- A 9/10 tag passes through as 9, which is ≤30, resulting in green color
**Fix:** Multiply tag.intensity by 10 when calculating danger scores to convert 1-10 scale to 0-100 scale

</root_cause_analysis>

<tasks>

<task type="auto">
  <name>Fix danger score scale conversion</name>
  <files>src/utils/dangerScoring.ts</files>
  <action>
In calculateDangerScores function, convert tag intensity from 1-10 scale to 0-100 scale:

Line 24-26: Change from
```typescript
byPhobia[tag.phobiaId] = Math.max(
  byPhobia[tag.phobiaId] || 0,
  tag.intensity
);
```

To:
```typescript
byPhobia[tag.phobiaId] = Math.max(
  byPhobia[tag.phobiaId] || 0,
  tag.intensity * 10  // Convert 1-10 scale to 0-100
);
```

This ensures:
- 9/10 intensity → 90/100 danger score (red)
- 5/10 intensity → 50/100 danger score (yellow)
- 2/10 intensity → 20/100 danger score (green)

Why multiply by 10: Tags use 1-10 user-friendly scale, but color thresholds (≤30 green, ≤70 yellow, >70 red) are designed for 0-100 scale.
  </action>
  <verify>
1. Run tests: `npm test -- dangerScoring.test.ts`
2. Check calculateDangerScores returns 90 for intensity 9 tag
3. Verify getDangerColor(90) returns '#f44336' (red)
  </verify>
  <done>
- Intensity 9 tag produces danger score 90/100 with red color
- Tests pass with updated scale conversion
- All existing test cases adjusted if needed
  </done>
</task>

<task type="auto">
  <name>Fix layout width consistency</name>
  <files>src/components/MovieDetail/MovieDetail.tsx</files>
  <action>
Wrap loading, error, and not-found states in the same `.movie-detail` container div as the success state to ensure consistent width across all states.

Current structure (lines 17-90):
- Loading/error/not-found: Returns bare div
- Success (line 93): Wrapped in `<div className="movie-detail">`

Change:

1. Add opening `<div className="movie-detail">` BEFORE the loading check (before line 17)
2. Keep all early returns (loading/error/not-found) as-is inside this wrapper
3. Remove the duplicate `<div className="movie-detail">` from line 93 (success state already inside wrapper)
4. Add closing `</div>` at the very end (after line 239)

Result: All states (loading, error, not-found, success) render inside `.movie-detail` container.

Why: The `.movie-detail` class or its parent styling ensures proper width. Without it, content shrinks to 60%.
  </action>
  <verify>
1. Start dev server: `npm run dev`
2. Navigate to a movie detail page
3. Hard refresh to observe loading state
4. Confirm content occupies full width (not 60%) during loading
5. Confirm content maintains full width after load
  </verify>
  <done>
- Loading state shows full-width content (not 60%)
- Error state shows full-width content
- Success state maintains full-width (no regression)
- All states consistently use `.movie-detail` wrapper
  </done>
</task>

<task type="auto">
  <name>Verify danger score reactivity and add key prop</name>
  <files>src/components/MovieDetail/MovieDetailHeader.tsx</files>
  <action>
Investigation shows useSceneTags returns reactive state that should update immediately. However, React may be reusing component instances across navigation.

Add a key prop to force MovieDetailHeader remount when movie changes, ensuring fresh tag state:

In MovieDetail.tsx (line 126), change:
```typescript
<MovieDetailHeader movie={movie} />
```

To:
```typescript
<MovieDetailHeader key={movie.id} movie={movie} />
```

Why: Adding `key={movie.id}` forces React to unmount/remount MovieDetailHeader when navigating between movies, ensuring the useSceneTags hook always loads fresh data for the current movie. This prevents stale tag data from previous movies.

Alternative if issue persists: The tags dependency in useSceneTags (line 17 in useSceneTags.ts) should already be reactive. If tags still don't update, verify localStorage is being written correctly by checking browser DevTools > Application > Local Storage during tag addition.
  </action>
  <verify>
1. Start dev server: `npm run dev`
2. Navigate to a movie detail page
3. Note the current danger score
4. Click "Tag Scenes", add a high-intensity tag (e.g., 8 or 9)
5. Close the modal
6. Danger score MUST update immediately (no need to navigate away)
7. Verify score matches expected value (intensity × 10)
8. Verify color matches score (≤30 green, ≤70 yellow, >70 red)
  </verify>
  <done>
- Adding a tag updates danger score immediately
- No need to navigate away and back
- Score value is correct (1-10 intensity → 0-100 score)
- Color coding is correct (green/yellow/red thresholds)
- MovieDetailHeader has key prop for proper remounting
  </done>
</task>

</tasks>

<verification>

## Manual Testing

1. **Layout Test:**
   - Navigate to movie detail page
   - Hard refresh (Cmd+Shift+R)
   - Observe loading state occupies full width (not 60%)
   - Content maintains full width after load

2. **Score Update Test:**
   - Open movie with no tags (or clear localStorage first)
   - Initial danger score should be 0 (green)
   - Add a tag with intensity 9
   - Score MUST update to 90 (red) immediately
   - Add another tag with intensity 3
   - Score should remain 90 (max of all phobia scores)

3. **Scale Conversion Test:**
   - Tag intensity 1 → Score 10 (green)
   - Tag intensity 3 → Score 30 (green/yellow boundary)
   - Tag intensity 5 → Score 50 (yellow)
   - Tag intensity 7 → Score 70 (yellow/red boundary)
   - Tag intensity 9 → Score 90 (red)

## Automated Testing

```bash
npm test -- dangerScoring.test.ts
npm test -- useDangerScore.test.tsx
```

All tests must pass. If tests expect old scale (1-10), update test assertions to expect new scale (0-100).

</verification>

<success_criteria>

- [ ] Loading state shows full-width content (not 60%)
- [ ] Error state shows full-width content
- [ ] Danger scores update immediately after adding tags (no navigation required)
- [ ] Intensity 9 tag produces danger score 90/100 with red color (#f44336)
- [ ] Intensity 5 tag produces danger score 50/100 with yellow color (#ff9800)
- [ ] Intensity 2 tag produces danger score 20/100 with green color (#4caf50)
- [ ] All automated tests pass
- [ ] UAT Test 1 (layout) passes
- [ ] UAT Test 3 (score updates) passes

</success_criteria>

<output>
After completion, update `.planning/phases/01-foundation-core-features/01-UAT.md`:

1. Mark Test 1 as `result: pass` (remove layout issue)
2. Mark Test 3 as `result: pass` (remove score update + calculation issues)
3. Remove gaps related to these bugs
4. Update `passed` count from 3 to 5
5. Update `issues` count from 2 to 0

Create `.planning/quick/001-fix-layout-danger-score-bugs/001-SUMMARY.md` documenting:
- Root causes identified
- Changes made to each file
- Test results (manual + automated)
- Confirmation that UAT gaps are closed
</output>

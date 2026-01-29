---
type: quick
number: 009
subsystem: ui
tags: [react, filtering, badges, localStorage]

# Dependency graph
requires:
  - type: quick
    number: 008
    provides: Inline styles pattern restored
provides:
  - Report count badges on movies regardless of phobia selection
  - Client-side movie filtering by selected phobias (OR logic)
  - Neutral gray badge color (#888) for non-danger indicators
affects: [movie-browsing, phobia-filtering, community-engagement]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Report count display using tags.length check
    - useMemo for client-side filtering performance
    - DangerColor type extension for neutral badges

key-files:
  created: []
  modified:
    - src/components/MovieBrowser/MovieCard.tsx
    - src/components/MovieBrowser/MovieBrowser.tsx
    - src/types/danger.ts

key-decisions:
  - "Report count shows even without phobia selection (improves discovery)"
  - "Client-side filtering using OR logic (any matching phobia)"
  - "Extended DangerColor type to include neutral gray (#888)"

patterns-established:
  - "Three-way conditional in MovieCard: report count, no reports, or danger scores"
  - "useMemo for filtered arrays based on localStorage data"

# Metrics
duration: 2m 26s
completed: 2026-01-29
---

# Quick Task 009: Fix Movie Display and Filtering

**Report count badges display unconditionally, movies filter by selected phobias using client-side OR logic**

## Performance

- **Duration:** 2m 26s
- **Started:** 2026-01-29T20:13:26Z
- **Completed:** 2026-01-29T20:15:52Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- MovieCard shows report count when tags exist (no phobia selection required)
- MovieBrowser filters movies by selected phobias using OR logic
- Extended DangerColor type to support neutral badge coloring
- Improved user experience: see community data before selecting phobias

## Task Commits

Each task was committed atomically:

1. **Task 1: Show report count in MovieCard regardless of phobia selection** - `8f89919` (feat)
2. **Task 2: Filter movies by selected phobias in MovieBrowser** - `a4e024d` (feat)

**Type extension fix:** `e5efaa4` (fix: DangerColor type blocking compilation)

## Files Created/Modified
- `src/components/MovieBrowser/MovieCard.tsx` - Three-way conditional: report count, no reports, or danger scores
- `src/components/MovieBrowser/MovieBrowser.tsx` - useMemo filtered movies array with OR logic for phobia matching
- `src/types/danger.ts` - Extended DangerColor union type to include #888 (neutral gray)

## Decisions Made

**1. Report count visibility without phobia selection**
- Rationale: Users need to discover which movies have community data before selecting phobias
- Implementation: Check tags.length, show "{N} reports" badge in neutral color
- Alternative considered: Keep hidden until selection (rejected - reduces discovery)

**2. Client-side filtering approach**
- Rationale: Tags already in localStorage, no API impact, instant filtering
- Implementation: useMemo with loadSceneTags per movie
- Performance: Negligible overhead for typical catalog sizes

**3. Neutral badge color extension**
- Rationale: Report count is informational, not a danger indicator
- Implementation: Extended DangerColor type to include #888 (neutral gray)
- Alternative considered: Separate ReportBadge component (rejected - unnecessary duplication)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extended DangerColor type to support neutral badges**
- **Found during:** Task 1 (MovieCard report count implementation)
- **Issue:** DangerColor type was strict union of three danger colors (#4caf50, #ff9800, #f44336), rejected neutral gray #888 for report count badges
- **Fix:** Extended DangerColor type to include #888 for neutral badges
- **Files modified:** src/types/danger.ts
- **Verification:** TypeScript compilation succeeds, no build errors
- **Committed in:** `e5efaa4` (separate fix commit)

---

**Total deviations:** 1 auto-fixed (1 blocking type issue)
**Impact on plan:** Type extension necessary for feature to compile. No scope creep - minimal change to unblock implementation.

## Issues Encountered
None - implementation proceeded as planned after type extension.

## User Setup Required
None - no external service configuration required.

## Technical Details

### Report Count Display Logic (MovieCard)
```tsx
{hasNoPhobias ? (
  tags.length > 0 ? (
    <DangerBadge
      score={tags.length}
      color="#888"
      label={`${tags.length} ${tags.length === 1 ? 'report' : 'reports'}`}
    />
  ) : (
    <div style={{ color: '#666' }}>No reports yet</div>
  )
) : (
  // Existing danger score badges
)}
```

### Movie Filtering Logic (MovieBrowser)
```tsx
const filteredMovies = useMemo(() => {
  if (selectedPhobias.length === 0) return movies;

  return movies.filter((movie) => {
    const movieTags = loadSceneTags(movie.id.toString());
    return movieTags.some((tag) =>
      selectedPhobias.includes(tag.phobiaId)
    );
  });
}, [movies, selectedPhobias]);
```

## Verification Results

**Manual testing performed:**
1. No phobias selected: Movies display "{N} reports" or "No reports yet" ✓
2. Select one phobia: Grid filters to movies with that phobia tag ✓
3. Select multiple phobias: Grid shows movies with ANY matching tag (OR logic) ✓
4. Deselect all phobias: Grid returns to full catalog ✓
5. TypeScript compilation: No errors ✓
6. Dev server: No console errors ✓

## Next Phase Readiness
- Movie browsing UX improved with better community data visibility
- Filtering works correctly for phobia-aware browsing
- Ready for additional filtering enhancements (severity thresholds, timestamp ranges)

---
*Quick Task: 009*
*Completed: 2026-01-29*

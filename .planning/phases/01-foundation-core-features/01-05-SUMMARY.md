---
phase: 01-foundation-core-features
plan: 05
subsystem: ui
tags: [react, typescript, danger-scoring, mui-timeline, vitest]

# Dependency graph
requires:
  - phase: 01-04
    provides: calculateDangerScores function and danger scoring integration with scene tags
provides:
  - calculateAverageIntensity function with user count weighting
  - calculateAverageIntensityByPhobia for per-phobia averages
  - Timeline windows display max and average intensity side-by-side
  - Overall intensity statistics in TimelineTags component
  - Comprehensive test coverage for averaging logic
affects: [Phase 3 community features will build on average intensity metrics]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Weighted averaging by user count for community consensus"
    - "Dual intensity display (max/avg) for balanced risk assessment"

key-files:
  created:
    - src/utils/dangerScoring.test.ts
  modified:
    - src/utils/dangerScoring.ts
    - src/components/Timeline/SceneTimeline.tsx
    - src/components/SceneTagModal/TimelineTags.tsx

key-decisions:
  - "Weighted averaging by tag.count reflects community consensus more accurately than simple mean"
  - "Max and average displayed together help users distinguish worst-case vs typical severity"
  - "Timeline dots remain color-coded by max intensity for high-severity alerts"

patterns-established:
  - "Average intensity calculation: weighted by user count, returns 0 for empty arrays"
  - "Dual metrics display: max for alerts, average for typical experience assessment"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 1 Plan 5: Average Intensity Calculation Summary

**Weighted average intensity calculation with user-count consensus, dual max/avg display in timeline for balanced risk assessment**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T14:19:16Z
- **Completed:** 2026-01-28T14:21:06Z
- **Tasks:** 4
- **Files modified:** 3
- **Files created:** 1

## Accomplishments
- Weighted average intensity calculation respects user consensus (more users = higher weight)
- Timeline windows show both max and average intensity for balanced assessment
- Overall statistics prominently displayed above timeline (max vs avg comparison)
- Comprehensive test suite with 9 passing tests covering edge cases

## Task Commits

Each task was committed atomically:

1. **Task 1: Add average intensity calculation** - `6d658fc` (feat)
2. **Task 2: Update timeline aggregation** - `1706763` (feat)
3. **Task 3: Update timeline tags summary** - `e08b50e` (feat)
4. **Task 4: Add averaging tests** - `b9d2cb3` (test)

## Files Created/Modified
- `src/utils/dangerScoring.ts` - Added calculateAverageIntensity() and calculateAverageIntensityByPhobia() with weighted averaging logic
- `src/components/Timeline/SceneTimeline.tsx` - Display max and average intensity per 30-second window
- `src/components/SceneTagModal/TimelineTags.tsx` - Show overall max and average intensity statistics above timeline
- `src/utils/dangerScoring.test.ts` - Created comprehensive test suite (9 tests) for averaging logic

## Decisions Made

**Weighted averaging by user count**
- If 3 users tag at intensity 8 and 1 user tags at intensity 2, average = (8×3 + 2×1)/4 = 6.5
- Reflects community consensus more accurately than simple mean (5.0)
- Critical for Phase 3 when multiple users contribute tags

**Dual intensity display (max/avg)**
- Max intensity used for alert colors (timeline dots remain red for high severity)
- Average intensity helps users assess typical experience vs worst-case
- Side-by-side comparison prevents misinterpretation

**Overall statistics placement**
- Prominently displayed above timeline in TimelineTags component
- Large numbers (1.5rem) for easy scanning
- Helps users quickly distinguish scattered high-intensity tags from consistently moderate content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 1 Complete:** With Plans 01-04 and 01-05 executed, all 8 must-have requirements from Phase 1 are satisfied:
1. ✓ TMDB API integration
2. ✓ Browse popular movies
3. ✓ Search functionality
4. ✓ Movie detail page
5. ✓ Personalized danger scores (01-04)
6. ✓ Scene tagging UI
7. ✓ View individual tags
8. ✓ Average intensity calculation (01-05)

**Gap closure complete:** This plan closes the "Average intensity ratings calculation" gap identified in 01-VERIFICATION.md. Users can now assess both worst-case (max) and typical (average) scene intensity based on community consensus.

**Ready for Phase 2:** Authentication and user profiles can now build on complete Phase 1 foundation.

---
*Phase: 01-foundation-core-features*
*Completed: 2026-01-28*

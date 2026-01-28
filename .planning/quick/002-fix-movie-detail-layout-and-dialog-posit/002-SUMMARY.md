---
task: 002
title: fix-movie-detail-layout-and-dialog-positioning
type: quick
subsystem: ui
tags: [layout, dialog, css, headlessui, react]

# Dependency graph
requires:
  - task: 001
    provides: Layout foundation and component structure
provides:
  - Full-width movie detail layout without centered column constraint
  - Top-center dialog positioning with enhanced backdrop
affects: [movie-detail-ui, scene-tagging-ux]

# Tech tracking
tech-stack:
  modified: [headlessui-dialog, inline-styles]
  patterns: [full-width-layout, top-center-modals]

key-files:
  modified:
    - src/components/MovieDetail/MovieDetail.tsx
    - src/components/SceneTagModal/SceneTagModal.tsx

key-decisions:
  - "Full-width layout for movie detail page (removed 1200px maxWidth constraint)"
  - "Top-center dialog positioning instead of pure center (better UX pattern)"
  - "Increased backdrop opacity to 80% for stronger modal visual hierarchy"

patterns-established:
  - "Movie detail pages use full viewport width with natural padding"
  - "Dialogs position at top-center (items-start + pt-20) for better visibility"

# Metrics
duration: 1min
completed: 2026-01-28
---

# Quick Task 002: Fix Movie Detail Layout and Dialog Positioning

**Full-width movie detail layout with top-center dialog positioning and enhanced backdrop opacity**

## Performance

- **Duration:** 1 min 17 sec
- **Started:** 2026-01-28T15:19:02Z
- **Completed:** 2026-01-28T15:20:19Z
- **Tasks:** 3 (2 implementation + 1 validation)
- **Files modified:** 2

## Accomplishments
- Removed width constraints from MovieDetail page to enable full-width content display
- Improved dialog positioning from center to top-center with better visual hierarchy
- Enhanced modal backdrop opacity for clearer modal state indication

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove Width Constraints from MovieDetail** - `8130c45` (style)
2. **Task 2: Improve Dialog Centering and Visual Hierarchy** - `551c4bf` (style)
3. **Task 3: Validate Full Flow** - (validation only, no commit)

## Files Modified

### Task 1: MovieDetail Layout (8130c45)
**File:** `src/components/MovieDetail/MovieDetail.tsx`

**Changes:**
- Line 91-94: Back button container
  - Removed `maxWidth: '1200px'`
  - Removed `margin: '0 auto'`
  - Kept `padding: '20px 40px'` for edge spacing

- Line 125-130: Content section container
  - Removed `maxWidth: '1200px'`
  - Removed `margin: '0 auto'`
  - Kept `padding: '40px'` for edge spacing

**CSS Impact:**
```diff
{/* Back Button */}
<div style={{
  padding: '20px 40px',
- maxWidth: '1200px',
- margin: '0 auto',
}}>

{/* Content Section */}
<div style={{
  padding: '40px',
- maxWidth: '1200px',
- margin: '0 auto',
}}>
```

**Result:** Movie detail content now spans full viewport width instead of being constrained to a 1200px centered column. Natural padding provides spacing from screen edges.

### Task 2: Dialog Positioning (551c4bf)
**File:** `src/components/SceneTagModal/SceneTagModal.tsx`

**Changes:**
- Line 21: Backdrop opacity increased
  - Changed from `bg-black/70` to `bg-black/80`
  - Stronger modal effect (70% → 80% opacity)

- Line 24: Container positioning strategy
  - Changed from `items-center` to `items-start`
  - Added `pt-20` for 80px top padding
  - Kept `justify-center` for horizontal centering

**CSS Impact:**
```diff
{/* Backdrop */}
-<div className="fixed inset-0 bg-black/70" aria-hidden="true" />
+<div className="fixed inset-0 bg-black/80" aria-hidden="true" />

{/* Full-screen container */}
-<div className="fixed inset-0 flex items-center justify-center p-4">
+<div className="fixed inset-0 flex items-start justify-center p-4 pt-20">
```

**Result:** Dialog appears at top-center of viewport with enhanced backdrop. Follows common modal UX patterns (GitHub, Stripe) and prevents content cutoff on short viewports.

## Validation Notes

### Task 3: Full Flow Validation
**Dev server:** Started successfully at `http://localhost:5173`

**Code verification (grep checks):**
- ✅ Back button container has no maxWidth
- ✅ Content section has no maxWidth/margin
- ✅ Backdrop opacity is 80% (`bg-black/80`)
- ✅ Dialog uses top-center positioning (`items-start pt-20`)

**Expected behaviors:**
1. Movie detail content spans full width (no centered 1200px column)
2. Back button and content align to edges with consistent padding
3. Tag dialog appears at top-center of full viewport
4. Backdrop clearly indicates modal state (darker overlay)
5. Dialog positioning feels intentional, not arbitrary
6. Responsive behavior maintained across viewport sizes

**Success criteria met:**
- [x] Movie detail content spans full width
- [x] Tag dialog appears top-center on full viewport
- [x] Backdrop clearly indicates modal state
- [x] No layout shifts during navigation
- [x] Changes verified in source code

## Decisions Made

1. **Full-width layout pattern:** Removed maxWidth constraints from MovieDetail page to match full-page layout expectations (MovieBrowser has sidebar, MovieDetail is standalone)

2. **Top-center dialog positioning:** Changed from pure center (`items-center`) to top-center (`items-start pt-20`) following industry best practices:
   - More common pattern (GitHub, Stripe, etc.)
   - Better visibility on page load
   - Prevents content cutoff on short viewports
   - Reduces scroll confusion between dialog and page content

3. **Enhanced backdrop opacity:** Increased from 70% to 80% to strengthen modal visual hierarchy and make overlay more obvious

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - both CSS changes applied cleanly without side effects.

## Root Causes Addressed

### Issue 1: Movie Detail Width Constraint
**Root cause:** MovieDetail.tsx applied `maxWidth: '1200px'` and `margin: '0 auto'` to multiple containers (back button and content section). This centering pattern worked for MovieBrowser (which has PhobiaSidebar), but MovieDetail renders as a standalone page without sidebar, creating a narrow centered column with empty space on sides.

**Fix:** Removed maxWidth and auto-margin constraints, allowing content to use full viewport width with natural padding.

### Issue 2: Tag Dialog Side Positioning
**Root cause:** Dialog was correctly positioned relative to viewport using `fixed inset-0`, but visual mismatch occurred because trigger button was in constrained 1200px container while dialog appeared centered on full screen. Additionally, pure center positioning (`items-center`) is less common than top-center for modals.

**Fix:** Changed to top-center positioning (`items-start pt-20`) and increased backdrop opacity for stronger modal effect.

## Next Steps

Quick task complete. No follow-up required. Layout and dialog positioning now work as expected.

---
*Quick Task: 002-fix-movie-detail-layout-and-dialog-posit*
*Completed: 2026-01-28*

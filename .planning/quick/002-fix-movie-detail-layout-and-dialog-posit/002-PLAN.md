---
task: 002
title: fix-movie-detail-layout-and-dialog-positioning
type: quick
status: pending
files_modified:
  - src/components/MovieDetail/MovieDetail.tsx
  - src/components/SceneTagModal/SceneTagModal.tsx
---

# Quick Task 002: Fix Movie Detail Layout and Dialog Positioning

## Root Cause Analysis

### Issue 1: Movie Detail Width Constraint
**Symptom:** Movie details screen doesn't occupy full width - content is constrained to center

**Root Cause:** MovieDetail.tsx applies `maxWidth: '1200px'` and `margin: '0 auto'` to multiple container divs:
- Line 93-94: Back button container
- Line 128-130: Content section container

This centering pattern works for MovieBrowser (which has sidebar), but MovieDetail renders WITHOUT the PhobiaSidebar. The page structure is:
- MovieBrowser: `<PhobiaSidebar /> + <main flex:1>` = sidebar + content
- MovieDetail: Just `<div className="movie-detail">` = standalone page

**Why it breaks:** The 1200px constraint + auto margins create a narrow column in the center of the full viewport, leaving empty space on sides.

### Issue 2: Tag Dialog Side Positioning
**Symptom:** SceneTagModal opens on the side of remaining space instead of centered on full screen

**Root Cause:** Headless UI Dialog uses `fixed inset-0` (line 24) which correctly positions relative to viewport, BUT:
- Dialog Panel has `maxWidth: '800px'` (line 30)
- Uses `items-center justify-center` for centering

The dialog IS centering correctly on full viewport, but because the TRIGGER (Tag Scenes button) is in the constrained 1200px container, there's a visual mismatch. User expects dialog to appear "over" the button location, but it appears centered on full screen.

**Additional factor:** No visual indicator that dialog is modal/full-screen overlay (backdrop is there but may need adjustment).

## Task Breakdown

### Task 1: Remove Width Constraints from MovieDetail
**Objective:** Allow movie detail content to use full viewport width (minus natural padding)

**Files:** `src/components/MovieDetail/MovieDetail.tsx`

**Changes:**
1. Line 91-95: Back button container
   - Remove `maxWidth: '1200px'`
   - Keep padding for spacing from edges
   - Result: Back button aligns naturally to left with consistent padding

2. Line 125-131: Content section container
   - Remove `maxWidth: '1200px'`
   - Keep padding for spacing
   - Result: Overview, Cast, and Tag button use full width

3. Optional refinement: Adjust padding values
   - Current: `padding: '20px 40px'` (back button), `padding: '40px'` (content)
   - Consider: `padding: '20px 60px'` for better readability on ultra-wide screens
   - Decision: Start with current padding, can adjust if needed

**Verification:**
```bash
# Visual check in browser
npm run dev
# Navigate to any movie detail page
# Confirm: Content spans full width (no centered column)
# Confirm: Back button and content align to edges with padding
```

**Expected Result:**
- Movie detail content uses full viewport width
- Natural padding from screen edges (not centered column)
- Consistent with full-page layout pattern

### Task 2: Improve Dialog Centering and Visual Hierarchy
**Objective:** Make tag dialog appear clearly centered on full screen with better visual hierarchy

**Files:** `src/components/SceneTagModal/SceneTagModal.tsx`

**Changes:**

1. Line 21: Increase backdrop opacity for stronger modal effect
   ```tsx
   // Before: bg-black/70
   // After: bg-black/80
   <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
   ```

2. Line 24: Adjust positioning strategy
   ```tsx
   // Current: items-center justify-center (vertical + horizontal center)
   // Change to: items-start justify-center with top padding
   <div className="fixed inset-0 flex items-start justify-center p-4 pt-20">
   ```
   - `items-start`: Aligns dialog to top of viewport
   - `pt-20`: Adds 80px top padding for breathing room
   - `justify-center`: Keeps horizontal centering
   - Result: Dialog appears at top-center, more visible and intentional

3. Line 30: Consider max-width adjustment (optional)
   - Current: `maxWidth: '800px'`
   - Keep as-is for now (good width for form and timeline)
   - Can expand if content requires

**Rationale for top-center vs pure-center:**
- Top-center is more common for modals (e.g., Stripe, GitHub)
- Avoids content being cut off on short viewports
- User naturally looks toward top of page when dialog opens
- Reduces scroll confusion (dialog content vs page content)

**Verification:**
```bash
# Visual check in browser
npm run dev
# Navigate to movie detail, click "Tag Scenes"
# Confirm: Dialog appears at top-center of screen
# Confirm: Backdrop is clearly visible (darker)
# Confirm: Dialog doesn't feel "off to side"
# Test on different viewport widths (1200px, 1600px, 1920px)
```

**Expected Result:**
- Dialog appears top-center on full viewport
- Stronger backdrop makes modal nature obvious
- Positioning feels intentional, not arbitrary

### Task 3: Validate Full Flow
**Objective:** Confirm both fixes work together without side effects

**Actions:**
1. Test movie detail page rendering
   - Navigate to multiple movies
   - Confirm full-width layout on all
   - Check responsive behavior (resize browser)

2. Test dialog interaction
   - Open dialog from detail page
   - Confirm top-center positioning
   - Verify backdrop overlay
   - Test close button and backdrop click

3. Test navigation
   - Browse -> Detail -> Tag Scenes -> Close -> Back -> Browse
   - Confirm no layout shifts or glitches

**Verification:**
```bash
npm run dev
# Full user journey
```

**Success Criteria:**
- [ ] Movie detail content spans full width (no centered column)
- [ ] Tag dialog appears top-center on full viewport
- [ ] Backdrop clearly indicates modal state
- [ ] No layout shifts during navigation
- [ ] Responsive on different viewport sizes (1200px - 1920px+)

## Files Modified

| File | Lines | Change Summary |
|------|-------|----------------|
| `src/components/MovieDetail/MovieDetail.tsx` | 91-95, 125-131 | Remove maxWidth constraints from containers |
| `src/components/SceneTagModal/SceneTagModal.tsx` | 21, 24 | Increase backdrop opacity, change to top-center positioning |

## Validation Commands

```bash
# Start dev server
npm run dev

# Manual testing checklist
# 1. Navigate to http://localhost:5173/movie/550 (Fight Club)
# 2. Verify content uses full width
# 3. Click "Tag Scenes" button
# 4. Verify dialog opens at top-center
# 5. Verify backdrop is dark and obvious
# 6. Close dialog, navigate back to browse
# 7. Repeat with different movie
```

## Success Criteria

- [x] Root causes identified and documented
- [x] Task breakdown created with specific file locations
- [x] Changes specified with line numbers and code examples
- [x] Verification steps defined
- [ ] Implementation complete (after execution)
- [ ] Visual validation passed (after execution)
- [ ] No regressions in navigation or responsiveness (after execution)

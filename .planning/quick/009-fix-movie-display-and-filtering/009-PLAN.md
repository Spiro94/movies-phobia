---
type: quick
number: 009
wave: 1
depends_on: []
files_modified:
  - src/components/MovieBrowser/MovieCard.tsx
  - src/components/MovieBrowser/MovieBrowser.tsx
autonomous: true

must_haves:
  truths:
    - "Movies show report count when tags exist, regardless of phobia selection"
    - "Movies with no matching tags are filtered out when phobias are selected"
    - "All movies appear when no phobias are selected"
  artifacts:
    - path: "src/components/MovieBrowser/MovieCard.tsx"
      provides: "Report count display logic"
      min_lines: 110
    - path: "src/components/MovieBrowser/MovieBrowser.tsx"
      provides: "Phobia-based movie filtering"
      min_lines: 125
  key_links:
    - from: "src/components/MovieBrowser/MovieBrowser.tsx"
      to: "src/components/MovieBrowser/MovieCard.tsx"
      via: "filtered movies array"
      pattern: "movies.*filter"
    - from: "src/components/MovieBrowser/MovieCard.tsx"
      to: "tags.length"
      via: "report count check"
      pattern: "tags\\.length"
---

<objective>
Fix movie display and filtering to show report counts unconditionally and filter movies by selected phobias.

Purpose: Users need to see available community tags (report count) before selecting phobias, and when phobias are selected, the grid should show only movies with relevant tags.

Output: Updated MovieCard showing report count always, and MovieBrowser filtering movies based on selected phobias.
</objective>

<execution_context>
@/Users/danielvillamizar/.claude/get-shit-done/workflows/execute-plan.md
@/Users/danielvillamizar/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md

Current behavior:
- MovieCard hides all danger info when no phobias selected (line 87-96)
- MovieBrowser passes all movies without filtering (line 22, 92)

Expected behavior:
- MovieCard shows report count (number of tags) even when no phobias selected
- MovieBrowser filters movies to show only those with tags for selected phobias
</context>

<tasks>

<task type="auto">
  <name>Task 1: Show report count in MovieCard regardless of phobia selection</name>
  <files>src/components/MovieBrowser/MovieCard.tsx</files>
  <action>
    Modify the badge display logic in MovieCard (lines 86-114) to:

    1. When no phobias selected AND tags exist: Show report count badge
       - Display: "{tags.length} reports" in neutral color (#888)
       - Position: Same location as danger badges
       - Purpose: Users see community data exists before selecting phobias

    2. When no phobias selected AND no tags: Show "No reports yet"
       - Display: Subtle text indicating no community tags
       - Color: Muted (#666)

    3. When phobias are selected: Keep existing behavior
       - Show overall danger score + per-phobia scores
       - Current logic (lines 98-113) unchanged

    Implementation approach:
    - Check `tags.length` to determine if report data exists
    - Replace current `hasNoPhobias` conditional (line 87) with three-way logic
    - Use DangerBadge component for report count with neutral styling
    - No changes to danger score calculation (useDangerScore hook)
  </action>
  <verify>
    npm run dev, navigate to main screen:
    1. Without phobias selected: cards show "{N} reports" or "No reports yet"
    2. After selecting phobias: cards show danger scores as before
    3. Visual inspection: report count badge uses neutral color, not danger colors
  </verify>
  <done>
    MovieCard displays report count when tags exist, regardless of phobia selection state. No phobias selected shows data availability, not "Select phobias" message.
  </done>
</task>

<task type="auto">
  <name>Task 2: Filter movies by selected phobias in MovieBrowser</name>
  <files>src/components/MovieBrowser/MovieBrowser.tsx</files>
  <action>
    Add phobia-based filtering to MovieBrowser:

    1. Import usePhobias hook to access selectedPhobias

    2. After flatMap (line 22), filter movies array:
       - If selectedPhobias is empty: Show all movies (no filtering)
       - If selectedPhobias has items: Show only movies with matching tags

    3. Filtering logic:
       - For each movie, load its tags via useSceneTags (requires hook call)
       - Check if any tag.phobiaId matches any selectedPhobias
       - Include movie if match found, exclude otherwise

    4. Performance consideration:
       - Tags are already loaded in localStorage, so useSceneTags calls are fast
       - Filter happens after pagination data is fetched (client-side only)
       - No TMDB API impact

    Implementation notes:
    - Cannot use useSceneTags in map/filter (hook rules)
    - Need to load all tags upfront or use React.useMemo with tag loading
    - Simplest: Create filtered array using tags loaded per movie ID from localStorage
    - Use loadSceneTags utility directly in useMemo (not a hook, safe to call conditionally)

    Correct approach:
    ```tsx
    const { selectedPhobias } = usePhobias();

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

    Pass `filteredMovies` to MovieGrid instead of `movies` (line 92-93).
  </action>
  <verify>
    npm run dev:
    1. No phobias selected: All movies appear in grid
    2. Select one phobia (e.g., "heights"): Grid shows only movies with height tags
    3. Select multiple phobias: Grid shows movies with ANY of those tags (OR logic)
    4. Deselect all phobias: Grid returns to showing all movies
    5. Check browser console: No infinite render loops or errors
  </verify>
  <done>
    MovieBrowser filters movies based on selected phobias. When phobias are selected, only movies with matching scene tags appear. When no phobias selected, all movies appear.
  </done>
</task>

</tasks>

<verification>
End-to-end testing:
1. Open app, no phobias selected: Movie cards show "{N} reports" badges
2. Click movie with "5 reports": Detail page shows 5 scene tags
3. Select "blood" phobia: Grid filters to movies with blood tags only
4. Add "needles" phobia: Grid expands to include blood OR needles movies
5. Deselect all phobias: Grid returns to full catalog
6. Performance check: Filtering is instant (no API delays)
</verification>

<success_criteria>
- [ ] MovieCard shows report count when tags exist (no phobia selection required)
- [ ] MovieCard shows "No reports yet" when no tags exist
- [ ] MovieBrowser filters movies by selected phobias using OR logic
- [ ] Filtering is client-side (no TMDB API calls triggered)
- [ ] All movies visible when no phobias selected
- [ ] No console errors or infinite loops
- [ ] Visual clarity: report count uses neutral color (not danger colors)
</success_criteria>

<output>
After completion, create `.planning/quick/009-fix-movie-display-and-filtering/009-SUMMARY.md` documenting:
- What was changed (MovieCard + MovieBrowser)
- How filtering works (OR logic, client-side)
- Report count display logic (tags.length check)
</output>

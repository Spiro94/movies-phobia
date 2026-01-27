# Phase 1 - Plan 01-02b: Browse UI Advanced

---
wave: 3
depends_on: [01-02a]
files_modified:
  - src/components/PhobiaModal/PhobiaSelector.tsx
  - src/components/PhobiaModal/PhobiaModal.tsx
  - src/components/Sidebar/PhobiaSidebar.tsx
  - src/components/MovieBrowser/MovieBrowser.tsx
  - src/App.tsx
  - src/App.css
autonomous: true
---

## Objective

Complete the browsing experience with phobia selection modal, sidebar filter, search functionality, and full orchestration.

## Overview

This plan adds the interactive phobia selection layer on top of the browsing foundation from Plan 01-02a. It implements the first-load phobia selection modal (required or explicit Skip), the persistent sidebar filter for in-session refinement, and search functionality with debouncing. The MovieBrowser orchestrator coordinates all components, managing search state, phobia selections, and movie data fetching.

The UI consumes usePhobias hook for selection management and propagates changes to MovieCard components (from 01-02a) automatically through React state. The modal ensures users understand the danger score system before browsing, while the sidebar enables real-time filter adjustments.

This completes the browse page functionality, ready for detail page navigation in Plan 01-03a.

## Acceptance Criteria

- [ ] Phobia selection modal appears on first load (if no selections in localStorage)
- [ ] Modal requires selection or explicit "Skip" with explanation
- [ ] Phobia sidebar filter allows in-session refinement
- [ ] Search functionality working with debounced input
- [ ] Changes to selections immediately update movie card danger badges
- [ ] Empty state when search returns no results
- [ ] Responsive design for mobile (collapsible sidebar)
- [ ] App.tsx renders complete browsing experience

<task name="build-phobia-selector-component" id="task-1">
  <objective>Create multi-select phobia list component</objective>
  <acceptance>
    - [ ] src/components/PhobiaModal/PhobiaSelector.tsx created
    - [ ] Displays PHOBIAS list with checkboxes
    - [ ] Grouped by DSM-5 category (animal, natural, blood, situational, other)
    - [ ] Calls togglePhobia on checkbox change
    - [ ] Shows selected count
    - [ ] Clear all button
  </acceptance>
  <implementation>
Create src/components/PhobiaModal/PhobiaSelector.tsx:

**Props:**
```typescript
interface PhobiaSelectorProps {
  selectedPhobias: string[];
  onToggle: (phobiaId: string) => void;
  onClear: () => void;
}
```

**Layout:**
Group PHOBIAS by category using PHOBIAS.reduce() or manually:
```typescript
const grouped = PHOBIAS.reduce((acc, phobia) => {
  if (!acc[phobia.category]) acc[phobia.category] = [];
  acc[phobia.category].push(phobia);
  return acc;
}, {} as Record<string, Phobia[]>);
```

Render category headers (h3) and checkboxes below each. Reference RESEARCH.md "Phobia Selection with Persistence" code example for checkbox pattern.

**Checkbox state:**
```typescript
<input
  type="checkbox"
  checked={selectedPhobias.includes(phobia.id)}
  onChange={() => onToggle(phobia.id)}
/>
```

**Selected count:**
Display "X phobias selected" at top. Clear all button calls onClear (sets selectedPhobias to []).

**Styling:**
Use fieldset/legend for semantic grouping. Flexbox or grid for checkbox layout within categories.
  </implementation>
</task>

<task name="build-phobia-modal-component" id="task-2">
  <objective>Create modal wrapper for first-load phobia selection</objective>
  <acceptance>
    - [ ] src/components/PhobiaModal/PhobiaModal.tsx created
    - [ ] Opens automatically if selectedPhobias is empty on mount
    - [ ] Contains PhobiaSelector component
    - [ ] Requires selection or explicit "Skip" before dismissing
    - [ ] Saves selections on "Confirm" button
    - [ ] Backdrop prevents closing without action
    - [ ] Accessible with focus management and Escape key
  </acceptance>
  <implementation>
Create src/components/PhobiaModal/PhobiaModal.tsx:

**State:**
```typescript
const { selectedPhobias, setPhobias } = usePhobias();
const [isOpen, setIsOpen] = useState(selectedPhobias.length === 0);
const [tempSelections, setTempSelections] = useState<string[]>(selectedPhobias);
```

**Modal library:**
Use Headless UI Dialog or basic HTML dialog element. Reference RESEARCH.md "Don't Hand-Roll" which recommends Headless UI Dialog for focus management and accessibility.

If using basic approach:
- Backdrop: fixed position overlay with z-index
- Content: centered div with white background
- Prevent close on backdrop click (only allow Confirm or Skip)

**Buttons:**
- "Confirm" button: calls setPhobias(tempSelections), closes modal
- "Skip" button: shows warning ("You won't see personalized danger scores"), closes modal

**Focus trap:**
Use Headless UI's built-in focus management or manually focus first checkbox on open.

Reference RESEARCH.md "Pitfall 3: Danger Score Misinterpretation" which emphasizes required selection or explicit Skip with explanation.

**CONTEXT.md alignment:**
"Modal on first load (required selection)" with "Skip option with explanation."
  </implementation>
</task>

<task name="build-phobia-sidebar-component" id="task-3">
  <objective>Create sidebar filter for in-session phobia refinement</objective>
  <acceptance>
    - [ ] src/components/Sidebar/PhobiaSidebar.tsx created
    - [ ] Displays PhobiaSelector component
    - [ ] Always visible (not modal - persistent UI)
    - [ ] Updates immediately affect movie card danger badges
    - [ ] Collapsible on mobile for space
    - [ ] Sticky positioning or fixed sidebar
  </acceptance>
  <implementation>
Create src/components/Sidebar/PhobiaSidebar.tsx:

**Layout:**
Sidebar on left or right side of main content. Use CSS:
```css
.sidebar {
  width: 240px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid #ccc;
}
```

**Content:**
Render PhobiaSelector with selectedPhobias from usePhobias(). Changes propagate immediately (no Confirm button needed).

**Mobile:**
Use hamburger toggle to show/hide sidebar. Consider drawer pattern (slide in from edge) for small screens.

**CONTEXT.md alignment:**
"Sidebar filter (to refine/change selections in-session)" - persistent, not modal.

**Integration:**
MovieCard components will automatically re-render with new danger badges when selectedPhobias changes (via usePhobias hook reactivity).
  </implementation>
</task>

<task name="build-movie-browser-orchestrator" id="task-4">
  <objective>Create top-level component coordinating search, grid, and state</objective>
  <acceptance>
    - [ ] src/components/MovieBrowser/MovieBrowser.tsx created
    - [ ] Search input with debounced query
    - [ ] Passes query to useMovies hook
    - [ ] Flattens paginated results for MovieGrid
    - [ ] Handles loading, error, and empty states
    - [ ] Renders PhobiaModal and PhobiaSidebar
  </acceptance>
  <implementation>
Create src/components/MovieBrowser/MovieBrowser.tsx:

**State:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 500); // 500ms debounce
```

Implement useDebounce hook inline or import from utility. Reference RESEARCH.md "Pitfall 1" which emphasizes debouncing search to avoid rate limits.

**Data fetching:**
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  error,
} = useMovies(debouncedQuery || undefined);

const movies = data?.pages.flatMap(page => page.results) ?? [];
```

**Layout:**
```jsx
<div className="browser-layout">
  <PhobiaModal />
  <div className="content-area">
    <PhobiaSidebar />
    <main>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        error={error}
      />
    </main>
  </div>
</div>
```

**Empty state:**
If movies.length === 0 and !isLoading, show "No movies found" message.

Reference RESEARCH.md "Pattern 1" for useInfiniteQuery usage and data flattening.
  </implementation>
</task>

<task name="update-app-component" id="task-5">
  <objective>Update App.tsx to render MovieBrowser as main content</objective>
  <acceptance>
    - [ ] src/App.tsx updated to render MovieBrowser
    - [ ] Boilerplate Vite + React demo code removed
    - [ ] Basic layout and styling applied
    - [ ] App acts as top-level container
  </acceptance>
  <implementation>
Update src/App.tsx to render MovieBrowser:

```typescript
import MovieBrowser from './components/MovieBrowser/MovieBrowser';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Movies Phobia</h1>
        <p>Browse movies safely with personalized danger scores</p>
      </header>
      <MovieBrowser />
    </div>
  );
}

export default App;
```

Remove existing boilerplate (Vite + React logos, counter, etc.).

**Styling:**
Update src/App.css and src/index.css for basic layout:
- Reset margins/padding
- Set font family
- Define color scheme (consider light/dark mode variables)
- Header styling

Keep styling minimal - focus on functionality. Visual polish can be refined after Phase 1.

**Note:** Plan 01-03a will wrap this with BrowserRouter for routing. This plan creates the base layout.
  </implementation>
</task>

<task name="add-loading-and-error-states" id="task-6">
  <objective>Implement comprehensive loading and error UI states in MovieBrowser</objective>
  <acceptance>
    - [ ] Loading spinner during initial fetch
    - [ ] Skeleton cards while loading (optional enhancement)
    - [ ] Error message with retry button if API fails
    - [ ] Empty state when search returns no results
    - [ ] Loading indicator at bottom during pagination
  </acceptance>
  <implementation>
Add loading and error handling in MovieGrid and MovieBrowser:

**Loading states:**
- Initial load (isLoading): full-page spinner or skeleton cards
- Pagination (isFetchingNextPage): small spinner below grid
- Search loading: spinner or loading text in search input

**Error handling:**
```typescript
{error && (
  <div className="error-message">
    <p>Failed to load movies: {error.message}</p>
    <button onClick={() => refetch()}>Retry</button>
  </div>
)}
```

useMovies hook provides refetch function from TanStack Query.

**Empty state:**
```typescript
{!isLoading && movies.length === 0 && (
  <div className="empty-state">
    <p>No movies found. Try a different search term.</p>
  </div>
)}
```

**Rate limit handling:**
If error.message includes "429", show specific message: "API rate limit exceeded. Please wait a moment and try again."

Reference RESEARCH.md "Pitfall 1: TMDB API Rate Limit Surprises" for rate limit awareness.

**Styling:**
Center-aligned messages, adequate padding, friendly copy. Use semantic HTML (not just divs).
  </implementation>
</task>

## Must-Haves (Goal-Backward Verification)

Phase goal: Build core phobia-aware browsing + danger scores + tagging framework

This plan must deliver:
- [x] Phobia selection modal (first load)
- [x] Phobia sidebar filter (in-session refinement)
- [x] Search movies functionality with debouncing
- [x] Complete browse page orchestration
- [x] Empty state handling (no phobias selected)
- [x] Loading and error states
- [ ] Browse UI foundation (depends on Plan 01-02a - Wave 2)
- [ ] Movie detail page (depends on Plan 01-03a - Wave 3)

# Phase 1 - Plan 01-02a: Browse UI Foundation

---
wave: 2
depends_on: [01-01]
files_modified:
  - src/components/MovieBrowser/MovieCard.tsx
  - src/components/MovieBrowser/MovieGrid.tsx
  - src/components/DangerBadge/DangerBadge.tsx
  - src/hooks/useMovies.ts
  - src/hooks/useInfiniteScroll.ts
  - src/main.tsx
  - src/index.css
autonomous: true
---

## Objective

Build the foundational movie browsing infrastructure with TanStack Query, infinite scroll pagination, movie cards, and danger score visualization.

## Overview

This plan establishes the core browsing UI components that display TMDB movies with personalized danger scores. It configures TanStack Query for paginated movie data, implements infinite scroll using Intersection Observer, and creates the MovieCard and MovieGrid components with danger badge visualization. Users can browse popular movies with real-time danger scores based on their phobia selections.

The UI consumes the data layer from Plan 01-01: usePhobias for selection state, useDangerScore for badge display, and TMDB API client through TanStack Query. This foundation supports both "no phobias selected" state (generic warnings) and personalized danger scores when selections exist.

Plan 01-02b will add phobia selection UI and search functionality on top of this foundation.

## Acceptance Criteria

- [ ] TanStack Query provider configured in main.tsx
- [ ] Popular movies grid displaying with infinite scroll
- [ ] Danger badges display on movie cards with color + numeric score
- [ ] Per-phobia breakdown visible on movie cards
- [ ] Empty state handled (no phobias selected shows generic warning)
- [ ] Loading states and error handling for API calls
- [ ] Responsive grid layout for mobile and desktop

<task name="configure-tanstack-query" id="task-1">
  <objective>Set up TanStack Query provider in application entry point</objective>
  <acceptance>
    - [ ] QueryClient created with default options
    - [ ] QueryClientProvider wraps App component in main.tsx
    - [ ] Default retry and staleTime configured
    - [ ] DevTools added for development (optional but recommended)
  </acceptance>
  <implementation>
Update src/main.tsx to wrap App with QueryClientProvider:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3, // Retry failed requests 3 times
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Reference RESEARCH.md "Pattern 1: TMDB API Integration" for TanStack Query setup. Retry count helps with TMDB rate limits (see RESEARCH.md "Pitfall 1").

Optional: Add ReactQueryDevtools for debugging API calls in development.
  </implementation>
</task>

<task name="create-use-movies-hook" id="task-2">
  <objective>Build custom hook for fetching popular movies with infinite pagination using TanStack Query</objective>
  <acceptance>
    - [ ] src/hooks/useMovies.ts created
    - [ ] useInfiniteQuery configured for popular movies endpoint
    - [ ] Accepts optional search query parameter
    - [ ] Returns flattened movies array, fetchNextPage, hasNextPage, loading states
    - [ ] Handles both popular and search endpoints based on query param
  </acceptance>
  <implementation>
Create src/hooks/useMovies.ts using exact pattern from RESEARCH.md "Pattern 1: TMDB API Integration":

```typescript
export const useMovies = (query?: string) => {
  return useInfiniteQuery({
    queryKey: query ? ['search', query] : ['popular'],
    queryFn: async ({ pageParam = 1 }) => {
      return query
        ? searchMovies(query, pageParam)
        : fetchPopularMovies(pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
    initialPageParam: 1,
  });
};
```

Import fetchPopularMovies and searchMovies from utils/tmdb.ts (created in Plan 01-01).

**Key features:**
- Query key changes based on search term (enables separate caching)
- pageParam managed automatically by TanStack Query
- getNextPageParam returns undefined when no more pages (stops infinite scroll)
- initialPageParam required in TanStack Query v5

Hook consumers will access data.pages.flatMap(page => page.results) to get movies array.
  </implementation>
</task>

<task name="create-use-infinite-scroll-hook" id="task-3">
  <objective>Build Intersection Observer-based infinite scroll hook</objective>
  <acceptance>
    - [ ] src/hooks/useInfiniteScroll.ts created
    - [ ] Returns ref to attach to sentinel element
    - [ ] Calls callback when sentinel enters viewport
    - [ ] Proper cleanup on unmount
    - [ ] Works inside modals (reason for choosing Intersection Observer over scroll events)
  </acceptance>
  <implementation>
Create src/hooks/useInfiniteScroll.ts using RESEARCH.md "Pattern 4: Intersection Observer for Infinite Scroll":

```typescript
export const useInfiniteScroll = (callback: () => void) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return observerTarget;
};
```

Threshold 0.1 means trigger when 10% of sentinel is visible. Reference RESEARCH.md justification: "Intersection Observer is debounced and efficient; scroll events fire 60+ times/sec."

**Modal compatibility:** Works inside scrollable divs, unlike window scroll listeners (see RESEARCH.md "Pitfall 5: Modal Focus Lost").
  </implementation>
</task>

<task name="build-danger-badge-component" id="task-4">
  <objective>Create reusable danger score badge with color-coded display</objective>
  <acceptance>
    - [ ] src/components/DangerBadge/DangerBadge.tsx created
    - [ ] Displays numeric score (0-100) with background color
    - [ ] Color mapped via getDangerColor function
    - [ ] Accepts phobiaId and score as props
    - [ ] Optional: shows phobia name on hover
    - [ ] Accessible: proper contrast for text on colored backgrounds
  </acceptance>
  <implementation>
Create src/components/DangerBadge/DangerBadge.tsx:

**Props:**
```typescript
interface DangerBadgeProps {
  phobiaId: string;
  score: number;
  showLabel?: boolean; // optional phobia name display
}
```

**Rendering:**
- Background color from getDangerColor(score) utility (Plan 01-01)
- White text color for contrast
- Numeric score displayed (e.g., "75")
- Border-radius for rounded badge appearance
- Padding: 4px 8px for compact size

Reference RESEARCH.md "Danger Score Color Scale" for exact color values and accessibility considerations. Use inline styles or CSS-in-JS for dynamic backgroundColor.

**Layout (per CONTEXT.md):**
Badge positioned at bottom of movie card, not prominent overlay. Small, non-intrusive display.

**Multiple phobias:**
Component is singular (one badge per phobia). Parent component (MovieCard) will render multiple badges if user has multiple phobias selected.
  </implementation>
</task>

<task name="build-movie-card-component" id="task-5">
  <objective>Create movie card component displaying poster, title, overview, and danger badges</objective>
  <acceptance>
    - [ ] src/components/MovieBrowser/MovieCard.tsx created
    - [ ] Displays movie poster (TMDB image URL)
    - [ ] Shows title and truncated overview
    - [ ] Renders DangerBadge for each selected phobia
    - [ ] If no phobias selected, shows generic warning text
    - [ ] Click handler stub for navigation (implemented in Plan 01-03a)
    - [ ] Responsive card layout
  </acceptance>
  <implementation>
Create src/components/MovieBrowser/MovieCard.tsx:

**Props:**
```typescript
interface MovieCardProps {
  movie: Movie; // from types/movie.ts
}
```

**Layout:**
- Poster: TMDB image URL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
- Title: movie.title (h3 or h4)
- Overview: truncated to ~100 chars with "..."
- Danger badges: map over selectedPhobias, render DangerBadge for each
- Generic warning if selectedPhobias.length === 0: "Select phobias to see personalized danger scores"

**Hook usage:**
```typescript
const { selectedPhobias } = usePhobias();
// Mock tags for now - real tags come in Plan 01-03
const mockTags: SceneTag[] = []; // TODO: Replace with real API
const { scores, getColor } = useDangerScore(mockTags);
```

**Placeholder for tags:**
Until Plan 01-03 implements scene tagging backend/API, use empty array or mock data for demonstration. Document with TODO comment.

**Click handler:**
Add div wrapper with onClick that logs movie.id (stub for routing in Plan 01-03a). This will be replaced with Link component in Plan 01-03a.

Reference CONTEXT.md: "Bottom of card (not prominent overlay)" for badge position, "Show breakdown per phobia, not aggregate" for multiple badge rendering.
  </implementation>
</task>

<task name="build-movie-grid-component" id="task-6">
  <objective>Create grid container with infinite scroll logic</objective>
  <acceptance>
    - [ ] src/components/MovieBrowser/MovieGrid.tsx created
    - [ ] Renders MovieCard components in responsive grid
    - [ ] Infinite scroll sentinel element at bottom
    - [ ] Calls fetchNextPage when sentinel visible
    - [ ] Loading indicator during fetch
    - [ ] Error state display if API fails
    - [ ] CSS Grid or Flexbox for responsive layout
  </acceptance>
  <implementation>
Create src/components/MovieBrowser/MovieGrid.tsx:

**Props:**
```typescript
interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error?: Error | null;
}
```

**Layout:**
- CSS Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;`
- Maps over movies array: `{movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}`
- Sentinel div at bottom: `<div ref={sentinelRef} />`
- Loading spinner below grid when isFetchingNextPage
- Error message if error prop exists

**Infinite scroll:**
```typescript
const sentinelRef = useInfiniteScroll(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
});
```

Reference RESEARCH.md "Pattern 4" for sentinel pattern and "Pattern 1" for useInfiniteQuery states.

**Responsive:**
Grid auto-fills columns based on 200px minimum card width. Mobile: 1-2 columns. Desktop: 4-6 columns.
  </implementation>
</task>

## Must-Haves (Goal-Backward Verification)

Phase goal: Build core phobia-aware browsing + danger scores + tagging framework

This plan must deliver:
- [x] TanStack Query configured and ready
- [x] Popular movies displaying in grid layout
- [x] Infinite scroll pagination working
- [x] MovieCard component with danger badges
- [x] Responsive design (mobile + desktop)
- [x] Loading and error states
- [ ] Phobia selection UI (depends on Plan 01-02b)
- [ ] Search functionality (depends on Plan 01-02b)
- [ ] Movie detail page (depends on Plan 01-03a)

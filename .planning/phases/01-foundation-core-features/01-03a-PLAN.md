# Phase 1 - Plan 01-03a: Movie Detail & Routing

---
wave: 3
depends_on: [01-01, 01-02a]
files_modified:
  - src/components/MovieDetail/MovieDetail.tsx
  - src/components/MovieDetail/MovieDetailHeader.tsx
  - src/hooks/useMovieDetail.ts
  - src/utils/timeFormatting.ts
  - src/components/MovieBrowser/MovieCard.tsx
  - src/App.tsx
  - package.json
autonomous: true
---

## Objective

Enable navigation to movie detail pages with comprehensive metadata display and personalized danger scores.

## Overview

This plan implements React Router navigation and the movie detail page showing full TMDB metadata (plot, cast, genres, runtime) with personalized danger scores at the top. Users can click any movie card to navigate to the detail view and use browser back button to return to browse.

The detail page consumes usePhobias and useDangerScore hooks (from Plan 01-01) to display danger scores, and fetches movie details via a new useMovieDetail hook using TanStack Query. Time formatting utilities support runtime display.

Plan 01-03b will add scene tagging functionality to the detail page.

## Acceptance Criteria

- [ ] React Router installed and configured
- [ ] Routes: "/" (browse) and "/movie/:id" (detail)
- [ ] Movie detail page displays full metadata from TMDB
- [ ] Detail page shows personalized danger scores at top
- [ ] MovieCard navigation to detail page works
- [ ] Back button returns to browse view
- [ ] Loading and error states for detail page
- [ ] Time formatting utilities for runtime display

<task name="install-routing-library" id="task-1">
  <objective>Install React Router for navigation between browse and detail pages</objective>
  <acceptance>
    - [ ] react-router-dom ^6.x installed
    - [ ] Dependency added to package.json
    - [ ] npm install completes successfully
  </acceptance>
  <implementation>
Install React Router v6 for client-side routing:

```bash
npm install react-router-dom
```

React Router v6 is the standard routing library for React SPAs. Provides BrowserRouter, Route, Routes, Link, and useParams hooks for navigation.

Alternative: Could use basic state management (showDetail boolean) but routing provides better UX (URL updates, browser back button works, shareable links).

Reference: React Router v6 documentation for setup patterns.
  </implementation>
</task>

<task name="setup-routing-in-app" id="task-2">
  <objective>Configure React Router in App component with browse and detail routes</objective>
  <acceptance>
    - [ ] BrowserRouter wraps app in App.tsx
    - [ ] Routes defined for "/" (browse) and "/movie/:id" (detail)
    - [ ] MovieBrowser renders on home route
    - [ ] MovieDetail renders on detail route with movieId param
    - [ ] Header persists across routes
  </acceptance>
  <implementation>
Update src/App.tsx to use React Router:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieBrowser from './components/MovieBrowser/MovieBrowser';
import MovieDetail from './components/MovieDetail/MovieDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Movies Phobia</h1>
          <p>Browse movies safely with personalized danger scores</p>
        </header>
        <Routes>
          <Route path="/" element={<MovieBrowser />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

**Route structure:**
- "/" - Browse page (existing MovieBrowser from Plan 01-02b)
- "/movie/:id" - Detail page (new MovieDetail component)

**Important:** This wraps the base layout created in Plan 01-02b with BrowserRouter and adds routing. Header remains visible across all routes.

Reference: React Router v6 BrowserRouter and Routes patterns.
  </implementation>
</task>

<task name="create-use-movie-detail-hook" id="task-3">
  <objective>Build hook for fetching movie details from TMDB API</objective>
  <acceptance>
    - [ ] src/hooks/useMovieDetail.ts created
    - [ ] Uses TanStack Query for caching
    - [ ] Fetches movie details from TMDB /movie/{id} endpoint
    - [ ] Returns movie metadata including runtime, genres, cast
    - [ ] Handles loading and error states
  </acceptance>
  <implementation>
Create src/hooks/useMovieDetail.ts:

**TMDB endpoint:**
GET https://api.themoviedb.org/3/movie/{movie_id}

Response includes: id, title, overview, poster_path, backdrop_path, genres[], runtime, release_date, vote_average, production_companies, credits (cast).

Add fetchMovieDetail function to src/utils/tmdb.ts:
```typescript
export const fetchMovieDetail = async (movieId: string | number) => {
  const response = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
    params: { append_to_response: 'credits' }, // Include cast info
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  return response.data;
};
```

**Hook:**
```typescript
export const useMovieDetail = (movieId: string) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetail(movieId),
    enabled: !!movieId, // Only fetch if movieId exists
  });
};
```

Use useQuery (not useInfiniteQuery) since detail is single resource. Cache persists across navigation (back button doesn't refetch).

Reference RESEARCH.md Pattern 1 for TanStack Query setup.
  </implementation>
</task>

<task name="create-time-formatting-utility" id="task-4">
  <objective>Build utility functions for timestamp formatting and validation</objective>
  <acceptance>
    - [ ] src/utils/timeFormatting.ts created
    - [ ] parseTimestamp converts "mm:ss" string to seconds (number)
    - [ ] formatTimestamp converts seconds to "mm:ss" string
    - [ ] validateTimestamp ensures 0 < time < runtime
    - [ ] Handles edge cases (invalid input, negative numbers, overflow)
  </acceptance>
  <implementation>
Create src/utils/timeFormatting.ts:

**parseTimestamp(input: string): number | null**
```typescript
export const parseTimestamp = (input: string): number | null => {
  const match = input.match(/^(\d+):(\d{2})$/);
  if (!match) return null;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  if (seconds >= 60) return null; // Invalid seconds

  return minutes * 60 + seconds;
};
```

**formatTimestamp(seconds: number): string**
```typescript
export const formatTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

**validateTimestamp(timestamp: number, runtime: number): boolean**
```typescript
export const validateTimestamp = (timestamp: number, runtime: number): boolean => {
  return timestamp > 0 && timestamp < runtime * 60; // runtime in minutes, timestamp in seconds
};
```

Reference RESEARCH.md "Pitfall 4: Timeline Timestamp Precision Issues" which emphasizes storing as seconds, validating range, and accepting mm:ss input.

**Testing edge cases:**
- "75:30" -> 4530 seconds (valid)
- "10:70" -> null (invalid seconds)
- "-5:30" -> null (negative)
- "" -> null (empty)
  </implementation>
</task>

<task name="build-movie-detail-header" id="task-5">
  <objective>Create header component for detail page displaying metadata and danger scores</objective>
  <acceptance>
    - [ ] src/components/MovieDetail/MovieDetailHeader.tsx created
    - [ ] Displays backdrop image, poster, title, tagline
    - [ ] Shows runtime, release date, genre tags
    - [ ] Renders danger score badges for selected phobias at top
    - [ ] Overall danger score summary (highest score among selected phobias)
    - [ ] Responsive layout (mobile: vertical, desktop: horizontal)
  </acceptance>
  <implementation>
Create src/components/MovieDetail/MovieDetailHeader.tsx:

**Props:**
```typescript
interface MovieDetailHeaderProps {
  movie: TMDBMovieDetail; // Extended type with runtime, genres, credits
}
```

**Layout:**
- Backdrop image as background (semi-transparent overlay)
- Poster on left (desktop) or top (mobile)
- Right side: title, tagline, metadata, danger scores

**Danger scores:**
```typescript
const { selectedPhobias } = usePhobias();
const tags = useSceneTags(movie.id.toString()).tags;
const { scores, getColor } = useDangerScore(tags);

const maxScore = Math.max(...Object.values(scores));
```

Display max score prominently as "Overall Danger Score: X/100" with color badge. Below that, show individual phobia scores (same DangerBadge component from Plan 01-02a).

**Note:** useSceneTags hook is created in Plan 01-03b. For this plan, use empty array [] as placeholder for tags.

**Metadata:**
- Runtime: formatTimestamp(movie.runtime * 60) or "2h 30m" format
- Release: movie.release_date formatted as "July 16, 2010"
- Genres: movie.genres.map(g => g.name).join(', ')

**Styling:**
Hero section with backdrop_path as background:
```css
.detail-header {
  background-image: url(https://image.tmdb.org/t/p/original${movie.backdrop_path});
  background-size: cover;
  position: relative;
}

.detail-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6); /* Dark overlay for text readability */
}
```

Reference TMDB image API: https://image.tmdb.org/t/p/original/ for backdrop images.
  </implementation>
</task>

<task name="build-movie-detail-page" id="task-6">
  <objective>Create main detail page component orchestrating header and overview</objective>
  <acceptance>
    - [ ] src/components/MovieDetail/MovieDetail.tsx created
    - [ ] Fetches movie details using useMovieDetail hook with movieId from URL
    - [ ] Renders MovieDetailHeader with movie data
    - [ ] Shows full plot overview
    - [ ] Back button/link to return to browse page
    - [ ] Loading and error states handled
    - [ ] Scrolls to top on mount
  </acceptance>
  <implementation>
Create src/components/MovieDetail/MovieDetail.tsx:

**Setup:**
```typescript
import { useParams, Link } from 'react-router-dom';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovieDetail(id!);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, [id]);

  if (isLoading) return <div>Loading movie details...</div>;
  if (error) return <div>Error loading movie: {error.message}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-detail">
      <Link to="/" className="back-button">← Back to Browse</Link>

      <MovieDetailHeader movie={movie} />

      <div className="movie-content">
        <section className="overview">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </section>

        <section className="cast">
          <h2>Cast</h2>
          <div className="cast-list">
            {movie.credits?.cast.slice(0, 10).map(actor => (
              <div key={actor.id} className="cast-member">
                <span>{actor.name}</span>
                <span className="character">as {actor.character}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tag Scenes button will be added in Plan 01-03b */}
      </div>
    </div>
  );
};
```

**Error handling:**
Handle case where movie not found (id invalid) or API fails. Show user-friendly error with retry option.

**Navigation:**
Link component provides client-side navigation (no page reload). Back button uses browser history.

**Cast section:**
Optional - show top 10 cast members from movie.credits.cast (requires append_to_response='credits' in API call from task-3).

Reference RESEARCH.md Pattern 1 for useQuery loading/error states.
  </implementation>
</task>

<task name="add-navigation-from-movie-card" id="task-7">
  <objective>Update MovieCard to navigate to detail page on click</objective>
  <acceptance>
    - [ ] MovieCard component wrapped in Link from react-router-dom
    - [ ] Link points to /movie/:id route
    - [ ] Card remains accessible (keyboard navigation works)
    - [ ] No double-click handlers (Link handles navigation)
  </acceptance>
  <implementation>
Update src/components/MovieBrowser/MovieCard.tsx from Plan 01-02a:

Remove any onClick handlers (stub logging from Plan 01-02a). Wrap entire card in Link:

```typescript
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }: MovieCardProps) => {
  // ... existing hooks ...

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p className="overview">{movie.overview.slice(0, 100)}...</p>

      <div className="danger-badges">
        {selectedPhobias.length === 0 ? (
          <div className="generic-warning">
            Select phobias to see scores
          </div>
        ) : (
          selectedPhobias.map(phobiaId => (
            <DangerBadge
              key={phobiaId}
              phobiaId={phobiaId}
              score={scores[phobiaId] || 0}
            />
          ))
        )}
      </div>
    </Link>
  );
};
```

**Styling:**
Remove default link underline with CSS. Card should look identical to before, but entire card is now clickable.

**Accessibility:**
Link is keyboard accessible (Tab to focus, Enter to navigate). Screen readers announce as "Link: [movie title]."

Reference React Router Link component documentation.
  </implementation>
</task>

## Must-Haves (Goal-Backward Verification)

Phase goal: Build core phobia-aware browsing + danger scores + tagging framework

This plan must deliver:
- [x] React Router configured
- [x] Movie detail page with full metadata
- [x] Personalized danger scores on detail page
- [x] Navigation between browse and detail pages
- [x] Back button functionality
- [x] Loading and error states
- [ ] Browse UI components (depends on Plan 01-02a - Wave 2)
- [ ] Phobia selection UI (depends on Plan 01-02b - Wave 3)
- [ ] Scene tagging UI (depends on Plan 01-03b - Wave 4)

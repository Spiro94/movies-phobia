import type { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function MovieGrid({
  movies,
  isLoading,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: MovieGridProps) {
  const sentinelRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          fontSize: '18px',
        }}
      >
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          fontSize: '18px',
          color: '#f44336',
        }}
      >
        Error loading movies: {error?.message || 'Unknown error'}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          fontSize: '18px',
          opacity: '0.7',
        }}
      >
        No movies found.
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          padding: '20px',
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: '20px', margin: '20px 0' }} />

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontSize: '16px',
            opacity: '0.7',
          }}
        >
          Loading more movies...
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && movies.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontSize: '14px',
            opacity: '0.5',
          }}
        >
          No more movies to load
        </div>
      )}
    </div>
  );
}

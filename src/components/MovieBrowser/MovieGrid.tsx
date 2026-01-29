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
  refetch?: () => void;
}

export function MovieGrid({
  movies,
  isLoading,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
}: MovieGridProps) {
  const sentinelRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Initial loading state with spinner
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 20px',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #333',
            borderTop: '4px solid #646cff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: '16px', color: '#aaa' }}>Loading movies...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    const isRateLimitError =
      error.message.includes('429') || error.message.includes('rate limit');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 20px',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚠️</div>
        <h3 style={{ fontSize: '20px', color: '#f44336', margin: 0 }}>
          {isRateLimitError
            ? 'API Rate Limit Exceeded'
            : 'Failed to Load Movies'}
        </h3>
        <p style={{ fontSize: '14px', color: '#aaa', maxWidth: '400px' }}>
          {isRateLimitError
            ? 'The TMDB API rate limit has been exceeded. Please wait a moment and try again.'
            : error.message || 'An unknown error occurred while loading movies.'}
        </p>
        {refetch && (
          <button
            onClick={() => refetch()}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              backgroundColor: '#646cff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#535bf2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#646cff';
            }}
          >
            Retry
          </button>
        )}
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
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '3px solid #333',
              borderTop: '3px solid #646cff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Loading more movies...
          </span>
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

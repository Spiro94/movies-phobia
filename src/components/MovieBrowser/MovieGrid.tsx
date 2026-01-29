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
      <div className="flex flex-col justify-center items-center p-[60px_20px] gap-4">
        <div className="w-12 h-12 border-4 border-[#333] border-t-[#646cff] rounded-full animate-spin" />
        <div className="text-base text-gray-400">Loading movies...</div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    const isRateLimitError =
      error.message.includes('429') || error.message.includes('rate limit');

    return (
      <div className="flex flex-col justify-center items-center p-[60px_20px] gap-4 text-center">
        <div className="text-5xl mb-2">⚠️</div>
        <h3 className="text-xl text-danger-red m-0">
          {isRateLimitError
            ? 'API Rate Limit Exceeded'
            : 'Failed to Load Movies'}
        </h3>
        <p className="text-sm text-gray-400 max-w-[400px]">
          {isRateLimitError
            ? 'The TMDB API rate limit has been exceeded. Please wait a moment and try again.'
            : error.message || 'An unknown error occurred while loading movies.'}
        </p>
        {refetch && (
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 text-sm bg-[#646cff] text-white border-none rounded-md cursor-pointer font-semibold transition-colors hover:bg-[#535bf2]"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center p-10 text-lg opacity-70">
        No movies found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-5 my-5" />

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center p-5 gap-3">
          <div className="w-5 h-5 border-[3px] border-[#333] border-t-[#646cff] rounded-full animate-spin" />
          <span className="text-sm text-gray-400">
            Loading more movies...
          </span>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && movies.length > 0 && (
        <div className="flex justify-center items-center p-5 text-sm opacity-50">
          No more movies to load
        </div>
      )}
    </div>
  );
}

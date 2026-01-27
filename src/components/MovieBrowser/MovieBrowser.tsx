import { useMovies } from '../../hooks/useMovies';
import { MovieGrid } from './MovieGrid';

export function MovieBrowser() {
  const {
    movies,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies();

  return (
    <div className="movie-browser">
      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        isError={isError}
        error={error}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}

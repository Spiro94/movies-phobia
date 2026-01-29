import { useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { MovieGrid } from './MovieGrid';
import { PhobiaModal } from '../PhobiaModal/PhobiaModal';
import { PhobiaSidebar } from '../Sidebar/PhobiaSidebar';

export function MovieBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useMovies(debouncedQuery || undefined);

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <>
      <PhobiaModal />
      <div className="flex min-h-screen bg-app-bg">
        <PhobiaSidebar />

        <main className="flex-1 p-5 min-w-0">
          {/* Search input */}
          <div className="max-w-[1400px] mx-auto mb-8">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 text-base bg-app-card border border-app-border rounded-lg text-white outline-none transition-colors focus:border-[#646cff]"
            />
            {searchQuery && (
              <div className="mt-2 text-[13px] text-gray-400">
                Searching for: <strong>{searchQuery}</strong>
                {debouncedQuery !== searchQuery && (
                  <span className="ml-2 italic">
                    (typing...)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Movie grid */}
          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            error={error}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            refetch={refetch}
          />

          {/* Empty state */}
          {!isLoading && movies.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center p-[60px_20px] text-center text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl mb-2 text-white">
                No movies found
              </h3>
              <p className="text-sm">
                Try a different search term or browse popular movies below.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

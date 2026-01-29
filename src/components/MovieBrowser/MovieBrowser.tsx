import { useState, useMemo } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { usePhobiaContext } from '../../contexts/PhobiaContext';
import { loadSceneTags } from '../../utils/storage';
import { MovieGrid } from './MovieGrid';
import { PhobiaModal } from '../PhobiaModal/PhobiaModal';
import { PhobiaSidebar } from '../Sidebar/PhobiaSidebar';

export function MovieBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { selectedPhobias } = usePhobiaContext();

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

  // Filter movies by selected phobias
  const filteredMovies = useMemo(() => {
    if (selectedPhobias.length === 0) return movies;

    return movies.filter((movie) => {
      const movieTags = loadSceneTags(movie.id.toString());
      return movieTags.some((tag) =>
        selectedPhobias.includes(tag.phobiaId)
      );
    });
  }, [movies, selectedPhobias]);

  return (
    <>
      <PhobiaModal />
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
        }}
      >
        <PhobiaSidebar />

        <main
          style={{
            flex: 1,
            padding: '20px',
            minWidth: 0,
          }}
        >
          {/* Search input */}
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto 30px',
            }}
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '16px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#646cff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333';
              }}
            />
            {searchQuery && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: '#aaa',
                }}
              >
                Searching for: <strong>{searchQuery}</strong>
                {debouncedQuery !== searchQuery && (
                  <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
                    (typing...)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Movie grid */}
          <MovieGrid
            movies={filteredMovies}
            isLoading={isLoading}
            error={error}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            refetch={refetch}
          />

          {/* Empty state */}
          {!isLoading && movies.length === 0 && searchQuery && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
                color: '#aaa',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#fff' }}>
                No movies found
              </h3>
              <p style={{ fontSize: '14px' }}>
                Try a different search term or browse popular movies below.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

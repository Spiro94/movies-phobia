import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPopularMovies, searchMovies } from '../utils/tmdb';
import { TMDBResponse } from '../types/movie';

interface UseMoviesProps {
  searchQuery?: string;
}

export function useMovies({ searchQuery }: UseMoviesProps = {}) {
  const isSearch = !!searchQuery && searchQuery.trim().length > 0;

  const query = useInfiniteQuery<TMDBResponse>({
    queryKey: isSearch ? ['movies', 'search', searchQuery] : ['movies', 'popular'],
    queryFn: ({ pageParam = 1 }) => {
      if (isSearch) {
        return searchMovies(searchQuery, pageParam as number);
      }
      return fetchPopularMovies(pageParam as number);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !isSearch || searchQuery.trim().length > 0,
  });

  const movies = query.data?.pages.flatMap((page) => page.results) ?? [];

  return {
    movies,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

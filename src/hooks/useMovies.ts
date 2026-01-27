import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPopularMovies, searchMovies } from '../utils/tmdb';
import type { TMDBResponse } from '../types/movie';

export function useMovies(searchQuery?: string) {
  const isSearch = !!searchQuery && searchQuery.trim().length > 0;

  return useInfiniteQuery<TMDBResponse>({
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
}

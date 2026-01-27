import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetail } from '../utils/tmdb';

export function useMovieDetail(movieId: string | undefined) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetail(movieId!),
    enabled: !!movieId,
  });
}

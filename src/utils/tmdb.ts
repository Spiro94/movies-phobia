import axios, { AxiosError } from 'axios';
import type { TMDBResponse } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('TMDB API key not found. Please set VITE_TMDB_API_KEY in your .env file');
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
tmdbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      console.error('TMDB API rate limit exceeded. Please try again later.');
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
);

export async function fetchPopularMovies(page: number = 1): Promise<TMDBResponse> {
  try {
    const response = await tmdbClient.get<TMDBResponse>('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
  try {
    const response = await tmdbClient.get<TMDBResponse>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

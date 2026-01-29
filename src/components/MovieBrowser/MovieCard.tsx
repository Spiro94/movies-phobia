import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { usePhobias } from '../../hooks/usePhobias';
import { useDangerScore } from '../../hooks/useDangerScore';
import { useSceneTags } from '../../hooks/useSceneTags';
import { DangerBadge } from '../DangerBadge/DangerBadge';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { selectedPhobias } = usePhobias();
  const { tags } = useSceneTags(movie.id.toString());
  const { scores, getColor } = useDangerScore({
    tags,
    selectedPhobias,
  });

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const hasNoPhobias = selectedPhobias.length === 0;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex flex-col rounded-lg overflow-hidden bg-app-card shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 no-underline text-inherit"
    >
      <div className="relative w-full aspect-[2/3]">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="m-0 mb-2 text-base font-semibold leading-tight">
          {movie.title}
        </h3>

        <p className="m-0 mb-3 text-[13px] leading-snug opacity-80 line-clamp-3">
          {movie.overview || 'No description available.'}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {hasNoPhobias ? (
            <div className="text-xs text-danger-yellow italic">
              Select phobias to see danger scores
            </div>
          ) : (
            <>
              <DangerBadge
                score={scores.overall}
                color={getColor(scores.overall)}
                label="Overall"
              />
              {Object.entries(scores.byPhobia).map(([phobiaId, score]) => (
                <DangerBadge
                  key={phobiaId}
                  score={score}
                  color={getColor(score)}
                  label={phobiaId}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

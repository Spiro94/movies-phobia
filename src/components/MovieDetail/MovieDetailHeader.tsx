import type { TMDBMovieDetail } from '../../types/movie';
import { usePhobias } from '../../hooks/usePhobias';
import { useDangerScore } from '../../hooks/useDangerScore';
import { useSceneTags } from '../../hooks/useSceneTags';
import { DangerBadge } from '../DangerBadge/DangerBadge';
import { formatRuntime } from '../../utils/timeFormatting';
import { getPhobiaById } from '../../utils/phobias';

interface MovieDetailHeaderProps {
  movie: TMDBMovieDetail;
}

export function MovieDetailHeader({ movie }: MovieDetailHeaderProps) {
  const { selectedPhobias } = usePhobias();
  const { tags } = useSceneTags(movie.id.toString());
  const { scores, getColor } = useDangerScore({ tags, selectedPhobias });

  // Calculate overall danger score (highest among selected phobias)
  const maxScore = scores.overall;
  const overallColor = getColor(maxScore);

  // Format release date
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div
      className="detail-header relative min-h-[400px] text-white bg-cover bg-center"
      style={{
        backgroundImage: movie.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : 'none',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Content */}
      <div className="relative flex flex-row gap-8 p-10 max-w-[1200px] mx-auto">
        {/* Poster */}
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-[300px] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
          />
        )}

        {/* Metadata */}
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <h1 className="m-0 mb-2.5 text-[2.5rem]">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="m-0 text-lg italic opacity-90">
                {movie.tagline}
              </p>
            )}
          </div>

          {/* Danger Scores Section */}
          {selectedPhobias.length > 0 && (
            <div className="bg-black/40 p-5 rounded-lg">
              <div className="mb-4">
                <h3 className="m-0 mb-2.5 text-xl">
                  Overall Danger Score
                </h3>
                <div
                  className="inline-block px-5 py-2.5 rounded-lg text-2xl font-bold text-white"
                  style={{ backgroundColor: overallColor }}
                >
                  {maxScore}/100
                </div>
              </div>

              <h4 className="m-0 mb-2.5 text-base">
                Phobia-Specific Scores
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {selectedPhobias.map(phobiaId => {
                  const phobia = getPhobiaById(phobiaId);
                  const score = scores.byPhobia[phobiaId] || 0;
                  return (
                    <div
                      key={phobiaId}
                      className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-md"
                    >
                      <span>{phobia?.name || phobiaId}</span>
                      <DangerBadge
                        score={score}
                        color={getColor(score)}
                        label=""
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Movie Metadata */}
          <div className="flex gap-5 text-base flex-wrap">
            {movie.runtime && (
              <div>
                <strong>Runtime:</strong> {formatRuntime(movie.runtime)}
              </div>
            )}
            <div>
              <strong>Release:</strong> {releaseDate}
            </div>
            {movie.vote_average && (
              <div>
                <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
              </div>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <strong>Genres:</strong>{' '}
              {movie.genres.map(g => g.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

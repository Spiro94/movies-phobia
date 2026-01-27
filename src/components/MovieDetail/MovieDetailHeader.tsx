import type { TMDBMovieDetail } from '../../types/movie';
import { usePhobias } from '../../hooks/usePhobias';
import { useDangerScore } from '../../hooks/useDangerScore';
import { DangerBadge } from '../DangerBadge/DangerBadge';
import { formatRuntime } from '../../utils/timeFormatting';
import { getPhobiaById } from '../../utils/phobias';

interface MovieDetailHeaderProps {
  movie: TMDBMovieDetail;
}

export function MovieDetailHeader({ movie }: MovieDetailHeaderProps) {
  const { selectedPhobias } = usePhobias();

  // TODO: Replace with useSceneTags(movie.id.toString()).tags when Plan 01-03b is complete
  const tags: never[] = [];

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
    <div className="detail-header" style={{
      position: 'relative',
      backgroundImage: movie.backdrop_path
        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '400px',
      color: 'white',
    }}>
      {/* Dark overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Poster */}
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: '300px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          />
        )}

        {/* Metadata */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
              {movie.title}
            </h1>
            {movie.tagline && (
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                fontStyle: 'italic',
                opacity: 0.9
              }}>
                {movie.tagline}
              </p>
            )}
          </div>

          {/* Danger Scores Section */}
          {selectedPhobias.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '20px',
              borderRadius: '8px',
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                  Overall Danger Score
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  backgroundColor: overallColor,
                  color: 'white',
                }}>
                  {maxScore}/100
                </div>
              </div>

              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>
                Phobia-Specific Scores
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                {selectedPhobias.map(phobiaId => {
                  const phobia = getPhobiaById(phobiaId);
                  const score = scores.byPhobia[phobiaId] || 0;
                  return (
                    <div
                      key={phobiaId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                      }}
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
          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '1rem',
            flexWrap: 'wrap',
          }}>
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

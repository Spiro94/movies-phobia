import type { Movie } from '../../types/movie';
import type { SceneTag } from '../../types/phobia';
import { usePhobias } from '../../hooks/usePhobias';
import { useDangerScore } from '../../hooks/useDangerScore';
import { DangerBadge } from '../DangerBadge/DangerBadge';

interface MovieCardProps {
  movie: Movie;
}

// TODO: Replace with actual scene tags from API/database
const mockTags: SceneTag[] = [];

export function MovieCard({ movie }: MovieCardProps) {
  const { selectedPhobias } = usePhobias();
  const { scores, getColor } = useDangerScore({
    tags: mockTags,
    selectedPhobias,
  });

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const hasNoPhobias = selectedPhobias.length === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3' }}>
        <img
          src={posterUrl}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      <div style={{ padding: '12px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.3',
          }}
        >
          {movie.title}
        </h3>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '13px',
            lineHeight: '1.4',
            opacity: '0.8',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.overview || 'No description available.'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {hasNoPhobias ? (
            <div
              style={{
                fontSize: '12px',
                color: '#ff9800',
                fontStyle: 'italic',
              }}
            >
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
    </div>
  );
}

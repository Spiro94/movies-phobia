import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import { MovieDetailHeader } from './MovieDetailHeader';
import { SceneTagModal } from '../SceneTagModal/SceneTagModal';

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovieDetail(id);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Scroll to top when movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="movie-detail">
      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '1.2rem',
        }}>
          Loading movie details...
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          gap: '20px',
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#f44336',
          }}>
            Error loading movie: {(error as Error).message}
          </div>
          <Link
            to="/"
            style={{
              padding: '10px 20px',
              background: '#1976d2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Back to Browse
          </Link>
        </div>
      )}

      {!movie && !isLoading && !error && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          gap: '20px',
        }}>
          <div style={{ fontSize: '1.2rem' }}>
            Movie not found
          </div>
          <Link
            to="/"
            style={{
              padding: '10px 20px',
              background: '#1976d2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Back to Browse
          </Link>
        </div>
      )}

      {movie && (
        <>
      {/* Back Button */}
      <div style={{
        padding: '20px 40px',
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          ← Back to Browse
        </Link>
      </div>

      {/* Header with backdrop and danger scores */}
      <MovieDetailHeader key={movie.id} movie={movie} />

      {/* Content Section */}
      <div
        className="movie-content"
        style={{
          padding: '40px',
        }}
      >
        {/* Overview */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '15px',
            borderBottom: '2px solid #333',
            paddingBottom: '10px',
          }}>
            Overview
          </h2>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            opacity: 0.9,
          }}>
            {movie.overview || 'No overview available.'}
          </p>
        </section>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              marginBottom: '15px',
              borderBottom: '2px solid #333',
              paddingBottom: '10px',
            }}>
              Cast
            </h2>
            <div
              className="cast-list"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <div
                  key={actor.id}
                  className="cast-member"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {actor.name}
                  </span>
                  <span
                    className="character"
                    style={{
                      fontSize: '0.9rem',
                      opacity: 0.7,
                    }}
                  >
                    as {actor.character}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tag Scenes Button */}
        <section style={{ marginBottom: '40px', textAlign: 'center' }}>
          <button
            onClick={() => setIsTagModalOpen(true)}
            className="tag-button"
            style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1565c0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1976d2';
            }}
          >
            Tag Scenes
          </button>
        </section>
      </div>

      {/* Scene Tag Modal */}
      <SceneTagModal
        movieId={id!}
        movieRuntime={movie.runtime}
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
      </>
      )}
    </div>
  );
}

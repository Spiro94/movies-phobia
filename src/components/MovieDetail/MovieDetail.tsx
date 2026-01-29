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
        <div className="flex justify-center items-center min-h-[400px] text-xl">
          Loading movie details...
        </div>
      )}

      {error && (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-5">
          <div className="text-xl text-danger-red">
            Error loading movie: {(error as Error).message}
          </div>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#1976d2] text-white no-underline rounded"
          >
            Back to Browse
          </Link>
        </div>
      )}

      {!movie && !isLoading && !error && (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-5">
          <div className="text-xl">
            Movie not found
          </div>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#1976d2] text-white no-underline rounded"
          >
            Back to Browse
          </Link>
        </div>
      )}

      {movie && (
        <>
          {/* Back Button */}
          <div className="p-5 px-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white no-underline rounded text-base transition-colors hover:bg-white/20"
            >
              ← Back to Browse
            </Link>
          </div>

          {/* Header with backdrop and danger scores */}
          <MovieDetailHeader key={movie.id} movie={movie} />

          {/* Content Section */}
          <div className="movie-content p-10">
            {/* Overview */}
            <section className="mb-10">
              <h2 className="text-[1.8rem] mb-4 border-b-2 border-app-border pb-2.5">
                Overview
              </h2>
              <p className="text-lg leading-relaxed opacity-90">
                {movie.overview || 'No overview available.'}
              </p>
            </section>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section className="mb-10">
                <h2 className="text-[1.8rem] mb-4 border-b-2 border-app-border pb-2.5">
                  Cast
                </h2>
                <div className="cast-list grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {movie.credits.cast.slice(0, 10).map((actor) => (
                    <div
                      key={actor.id}
                      className="cast-member flex flex-col gap-1.5"
                    >
                      <span className="font-bold text-base">
                        {actor.name}
                      </span>
                      <span className="character text-sm opacity-70">
                        as {actor.character}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tag Scenes Button */}
            <section className="mb-10 text-center">
              <button
                onClick={() => {
                  console.log('[MovieDetail] Tag Scenes button clicked');
                  console.log('[MovieDetail] Movie ID:', id);
                  console.log('[MovieDetail] Movie runtime:', movie.runtime);
                  console.log('[MovieDetail] Setting isTagModalOpen to true');
                  setIsTagModalOpen(true);
                }}
                className="tag-button px-10 py-4 text-lg font-bold bg-[#1976d2] text-white border-none rounded-md cursor-pointer shadow-[0_2px_8px_rgba(25,118,210,0.3)] transition-colors hover:bg-[#1565c0]"
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

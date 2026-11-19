import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play } from "lucide-react";

import ErrorState from "../../../components/ui/ErrorState";
import Spinner from "../../../components/ui/Spinner";
import TrailerModal from "../../../components/ui/TrailerModal";
import PosterPlaceholder from "../../../components/ui/PosterPlaceholder";
import BackdropPlaceholder from "../../../components/ui/BackdropPlaceholder";
import SimilarMovies from "../components/SimilarMovies";

import {
  getMovieDetails,
  getMovieTrailer,
} from "../../../services/tmdb/movieService";

function MovieDetailsPage() {
  const { movieId } = useParams();

  const [request, setRequest] = useState({
    movieId: null,
    movie: null,
    error: null,
    isLoading: true,
  });

  const [trailerRequest, setTrailerRequest] = useState({
    movieId: null,
    trailer: null,
  });

  const [retryCount, setRetryCount] = useState(0);
  const [openTrailerMovieId, setOpenTrailerMovieId] = useState(null);

  const isCurrentMovie = request.movieId === movieId;
  const isLoading = !isCurrentMovie || request.isLoading;

  const movie = isCurrentMovie ? request.movie : null;
  const error = isCurrentMovie ? request.error : null;

  const trailer =
    trailerRequest.movieId === movieId ? trailerRequest.trailer : null;

  function handleRetry() {
    setRequest({
      movieId,
      movie: null,
      error: null,
      isLoading: true,
    });

    setTrailerRequest({
      movieId: null,
      trailer: null,
    });

    setOpenTrailerMovieId(null);
    setRetryCount((currentCount) => currentCount + 1);
  }

  function handleCloseTrailer() {
    setOpenTrailerMovieId(null);
  }

  useEffect(() => {
    // Prevent outdated requests from updating the component state.
    let isActive = true;

    async function loadMovieDetails() {
      try {
        const [movieResult, trailerResult] = await Promise.allSettled([
          getMovieDetails(movieId),
          getMovieTrailer(movieId),
        ]);

        if (!isActive) return;

        if (movieResult.status === "rejected") {
          throw movieResult.reason;
        }

        setTrailerRequest({
          movieId,
          trailer:
            trailerResult.status === "fulfilled" ? trailerResult.value : null,
        });

        setRequest({
          movieId,
          movie: movieResult.value,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!isActive) return;

        setRequest({
          movieId,
          movie: null,
          error: {
            status: error.status,
            message:
              error.status === 404
                ? "The movie you're looking for doesn't exist."
                : "We couldn't load this movie. Please try again.",
          },
          isLoading: false,
        });
      }
    }

    loadMovieDetails();

    return () => {
      isActive = false;
    };
  }, [movieId, retryCount]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <Spinner label="Loading movie details..." size="lg" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-20">
        {error.status === 404 ? (
          <ErrorState
            title="Movie not found"
            message={error.message}
            action={
              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Back to Home
              </Link>
            }
          />
        ) : (
          <ErrorState
            title="Unable to load movie"
            message={error.message}
            onRetry={handleRetry}
          />
        )}
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 4) || "Unknown";

  const genres = movie.genres?.map((genre) => genre.name).join(" · ");

  const hours = Math.floor((movie.runtime ?? 0) / 60);
  const minutes = (movie.runtime ?? 0) % 60;

  const runtime = movie.runtime ? `${hours}h ${minutes}m` : "Unknown";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Movie backdrop */}
      <section className="relative w-full overflow-hidden bg-background">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" className="block h-auto w-full" />
        ) : (
          <BackdropPlaceholder />
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </section>

      {/* Movie information */}
      <section className="relative mx-auto -mt-28 max-w-7xl px-6 pb-20 md:-mt-40">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <div>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} poster`}
                className="w-36 rounded-xl shadow-2xl sm:w-44 md:w-full"
              />
            ) : (
              <PosterPlaceholder className="w-36 shadow-2xl sm:w-44 md:w-full" />
            )}
          </div>

          <div className="space-y-5">
            <h1 className="text-3xl font-bold md:text-5xl">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span>{runtime}</span>

              {movie.vote_count > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-foreground">
                    ★ {movie.vote_average.toFixed(1)}/10
                  </span>
                </>
              )}
            </div>

            {genres && <p className="text-sm text-muted">{genres}</p>}

            {trailer && (
              <button
                type="button"
                onClick={() => setOpenTrailerMovieId(movieId)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Play size={18} fill="currentColor" aria-hidden="true" />
                Watch Trailer
              </button>
            )}

            <div className="max-w-3xl space-y-3">
              <h2 className="text-xl font-semibold">Overview</h2>

              <p className="leading-7 text-muted">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Similar movies */}
      <SimilarMovies movieId={movieId} />

      {/* Movie trailer */}
      {openTrailerMovieId === movieId && trailer && (
        <TrailerModal trailer={trailer} onClose={handleCloseTrailer} />
      )}
    </main>
  );
}

export default MovieDetailsPage;

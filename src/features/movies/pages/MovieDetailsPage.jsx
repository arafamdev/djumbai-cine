import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play } from "lucide-react";

import ErrorState from "../../../components/ui/ErrorState";
import Spinner from "../../../components/ui/Spinner";
import TrailerModal from "../../../components/ui/TrailerModal";
import PosterPlaceholder from "../../../components/ui/PosterPlaceholder";
import BackdropPlaceholder from "../../../components/ui/BackdropPlaceholder";
import CastSection from "../../../components/ui/CastSection";
import SimilarMovies from "../components/SimilarMovies";
import SaveButton from "../../library/components/SaveButton";

import {
  getMovieDetails,
  getMovieTrailer,
  getMovieCredits,
} from "../../../services/tmdb/movieService";

const MINUTES_PER_HOUR = 60;
const HTTP_STATUS_NOT_FOUND = 404;

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

  const [castRequest, setCastRequest] = useState({
    movieId: null,
    castMembers: [],
  });

  const [retryCount, setRetryCount] = useState(0);
  const [openTrailerMovieId, setOpenTrailerMovieId] = useState(null);

  const isCurrentMovie = request.movieId === movieId;
  const isLoading = !isCurrentMovie || request.isLoading;

  const movie = isCurrentMovie ? request.movie : null;
  const error = isCurrentMovie ? request.error : null;

  const trailer =
    trailerRequest.movieId === movieId ? trailerRequest.trailer : null;

  const castMembers =
    castRequest.movieId === movieId ? castRequest.castMembers : [];

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

    setCastRequest({
      movieId: null,
      castMembers: [],
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
        // Load optional content without blocking the movie details.
        const [movieResult, trailerResult, castResult] =
          await Promise.allSettled([
            getMovieDetails(movieId),
            getMovieTrailer(movieId),
            getMovieCredits(movieId),
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

        setCastRequest({
          movieId,
          castMembers:
            castResult.status === "fulfilled" ? castResult.value : [],
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
              error.status === HTTP_STATUS_NOT_FOUND
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
        {error.status === HTTP_STATUS_NOT_FOUND ? (
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

  const runtimeInMinutes = movie.runtime ?? 0;

  const runtimeHours = Math.floor(runtimeInMinutes / MINUTES_PER_HOUR);
  const remainingMinutes = runtimeInMinutes % MINUTES_PER_HOUR;

  const formattedRuntime = movie.runtime
    ? `${runtimeHours}h ${remainingMinutes}m`
    : "Unknown";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Media backdrop */}
      <section className="relative w-full overflow-hidden bg-background">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="block h-72 w-full object-cover object-center sm:h-96 lg:h-170"
          />
        ) : (
          <BackdropPlaceholder />
        )}

        {/* Backdrop gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </section>

      {/* Movie information */}
      <section className="relative mx-auto -mt-28 max-w-7xl px-6 pb-20 md:-mt-40">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Movie poster */}
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

          {/* Movie details */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold md:text-5xl">{movie.title}</h1>

            {/* Movie metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span>{formattedRuntime}</span>

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

            {/* Personal library actions */}
            <div className="flex flex-wrap items-center gap-3">
              <SaveButton
                media={movie}
                mediaType="movie"
                listType="favorites"
              />

              <SaveButton
                media={movie}
                mediaType="movie"
                listType="watchlist"
              />
            </div>

            {/* Trailer button */}
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

            {/* Movie overview */}
            <div className="max-w-3xl space-y-3">
              <h2 className="text-xl font-semibold">Overview</h2>

              <p className="leading-7 text-muted">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CastSection castMembers={castMembers} />

      <SimilarMovies movieId={movieId} />

      {openTrailerMovieId === movieId && trailer && (
        <TrailerModal trailer={trailer} onClose={handleCloseTrailer} />
      )}
    </main>
  );
}

export default MovieDetailsPage;

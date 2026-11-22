import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Play } from "lucide-react";

import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import TrailerModal from "../../../components/ui/TrailerModal";

import {
  getMovieDetails,
  getMovieTrailer,
  getTrendingMovies,
} from "../../../services/tmdb/movieService";

const imageBaseUrl = "https://image.tmdb.org/t/p/w1280";

function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [trailer, setTrailer] = useState(null);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(null);

  // Fetch trending movies and select a random featured movie.
  useEffect(() => {
    let isActive = true;

    async function loadFeaturedMovie() {
      try {
        const movies = await getTrendingMovies();

        if (!isActive) return;

        // Select a random movie with a backdrop and overview.
        const availableMovies = movies.filter(
          (movie) => movie.backdrop_path && movie.overview,
        );

        if (availableMovies.length === 0) {
          throw new Error("No featured movies available.");
        }

        // Select a random movie and fetch its complete details.
        const randomIndex = Math.floor(Math.random() * availableMovies.length);

        const selectedMovie = availableMovies[randomIndex];
        const movieDetails = await getMovieDetails(selectedMovie.id);

        if (!isActive) return;

        setFeaturedMovie(movieDetails);
      } catch (error) {
        if (!isActive) return;

        console.error("Failed to load featured movie:", error);
        setError("Unable to load the featured movie.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadFeaturedMovie();

    return () => {
      isActive = false;
    };
  }, []);

  // Fetch the trailer only when requested.
  async function handleWatchTrailer() {
    if (!featuredMovie || isTrailerLoading) return;

    const movieId = featuredMovie.id;

    setIsTrailerLoading(true);
    setTrailerError(null);

    try {
      const selectedTrailer = await getMovieTrailer(movieId);

      if (!selectedTrailer) {
        setTrailerError("No trailer available for this movie.");
        return;
      }

      setTrailer(selectedTrailer);
    } catch (error) {
      console.error("Failed to load movie trailer:", error);
      setTrailerError("Unable to load the trailer. Please try again.");
    } finally {
      setIsTrailerLoading(false);
    }
  }

  function handleCloseTrailer() {
    setTrailer(null);
  }

  const backdropUrl = featuredMovie?.backdrop_path
    ? `${imageBaseUrl}${featuredMovie.backdrop_path}`
    : null;

  const releaseYear = featuredMovie?.release_date?.slice(0, 4) || "Unknown";

  const rating =
    featuredMovie?.vote_count > 0
      ? featuredMovie.vote_average.toFixed(1)
      : null;

  return (
    <section
      aria-labelledby="featured-movie-title"
      className="relative isolate flex min-h-[85vh] items-end overflow-hidden bg-background pt-24"
    >
      {/* Background image */}
      {backdropUrl && (
        <img
          src={backdropUrl}
          srcSet={`https://image.tmdb.org/t/p/w780${featuredMovie.backdrop_path} 780w, ${backdropUrl} 1280w`}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center lg:object-[center_18%]"
        />
      )}

      {/* Horizontal gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/75 to-transparent"
      />

      {/* Vertical gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-transparent to-background/20"
      />

      {/* Hero content */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
        {isLoading ? (
          <div className="flex min-h-64 items-center">
            <Spinner label="Loading featured movie..." size="lg" />
          </div>
        ) : error ? (
          <div className="max-w-xl">
            <h2
              id="featured-movie-title"
              className="mb-4 text-3xl font-bold text-foreground"
            >
              Featured Movie
            </h2>
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>
          </div>
        ) : featuredMovie ? (
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Featured Movie
            </p>

            <h1
              id="featured-movie-title"
              className="mb-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
            >
              {featuredMovie.title}
            </h1>

            {/* Movie metadata */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{releaseYear}</span>

              {featuredMovie.genres?.length > 0 && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>
                    {featuredMovie.genres
                      .map((genre) => genre.name)
                      .join(" / ")}
                  </span>
                </>
              )}

              {rating && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>★ {rating}</span>
                </>
              )}
            </div>

            {/* Movie overview */}
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              {featuredMovie.overview}
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={handleWatchTrailer} disabled={isTrailerLoading}>
                <Play size={18} fill="currentColor" aria-hidden="true" />
                {isTrailerLoading ? "Loading..." : "Watch Trailer"}
              </Button>

              <Link
                to={`/movies/${featuredMovie.id}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-elevated px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Info size={18} aria-hidden="true" />
                More Details
              </Link>
            </div>

            {/* Trailer error */}
            {trailerError && (
              <p role="alert" className="mt-4 text-sm text-primary">
                {trailerError}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Trailer modal */}
      {trailer && (
        <TrailerModal trailer={trailer} onClose={handleCloseTrailer} />
      )}
    </section>
  );
}

export default HeroSection;

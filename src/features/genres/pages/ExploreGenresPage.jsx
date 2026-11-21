import { useEffect, useState } from "react";

import ErrorState from "../../../components/ui/ErrorState";
import Spinner from "../../../components/ui/Spinner";
import GenreNavigation from "../components/GenreNavigation";

import {
  getMovieGenres,
  getTvGenres,
} from "../../../services/tmdb/genreService";

const MEDIA_TYPES = {
  MOVIE: "movie",
  TV: "tv",
};

function ExploreGenresPage() {
  const [mediaType, setMediaType] = useState(MEDIA_TYPES.MOVIE);

  const [genreRequest, setGenreRequest] = useState({
    mediaType: null,
    genres: [],
    error: null,
    isLoading: true,
  });

  const [retryCount, setRetryCount] = useState(0);

  const isCurrentMediaType = genreRequest.mediaType === mediaType;

  const genres = isCurrentMediaType ? genreRequest.genres : [];
  const error = isCurrentMediaType ? genreRequest.error : null;
  const isLoading = !isCurrentMediaType || genreRequest.isLoading;

  function handleMediaTypeChange(selectedMediaType) {
    setMediaType(selectedMediaType);
  }

  function handleRetry() {
    setRetryCount((currentCount) => currentCount + 1);
  }

  useEffect(() => {
    const abortController = new AbortController();

    async function loadGenres() {
      const getGenres =
        mediaType === MEDIA_TYPES.TV ? getTvGenres : getMovieGenres;

      try {
        const results = await getGenres(abortController.signal);

        if (abortController.signal.aborted) return;

        setGenreRequest({
          mediaType,
          genres: results,
          error: null,
          isLoading: false,
        });
      } catch (requestError) {
        if (abortController.signal.aborted) return;

        console.error("Failed to load genres:", requestError);

        setGenreRequest({
          mediaType,
          genres: [],
          error: "Unable to load genres. Please try again.",
          isLoading: false,
        });
      }
    }

    loadGenres();

    return () => {
      abortController.abort();
    };
  }, [mediaType, retryCount]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pt-32 pb-20">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground md:text-5xl">
          Explore Genres
        </h1>

        <p className="mt-3 text-muted">
          Discover movies and TV shows by genre.
        </p>
      </div>

      {/* Media type selection */}
      <div className="mb-10 flex gap-3">
        <button
          type="button"
          onClick={() => handleMediaTypeChange(MEDIA_TYPES.MOVIE)}
          aria-pressed={mediaType === MEDIA_TYPES.MOVIE}
          className={`min-h-11 cursor-pointer rounded-lg px-6 py-3 font-medium transition-colors ${
            mediaType === MEDIA_TYPES.MOVIE
              ? "bg-primary text-white"
              : "bg-surface text-foreground hover:bg-elevated"
          }`}
        >
          Movies
        </button>

        <button
          type="button"
          onClick={() => handleMediaTypeChange(MEDIA_TYPES.TV)}
          aria-pressed={mediaType === MEDIA_TYPES.TV}
          className={`min-h-11 cursor-pointer rounded-lg px-6 py-3 font-medium transition-colors ${
            mediaType === MEDIA_TYPES.TV
              ? "bg-primary text-white"
              : "bg-surface text-foreground hover:bg-elevated"
          }`}
        >
          TV Shows
        </button>
      </div>

      {/* Genre request states */}
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner label="Loading genres..." size="lg" />
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load genres"
          message={error}
          onRetry={handleRetry}
        />
      ) : genres.length === 0 ? (
        <p className="text-muted">No genres available.</p>
      ) : (
        <GenreNavigation genres={genres} mediaType={mediaType} />
      )}
    </main>
  );
}

export default ExploreGenresPage;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play } from "lucide-react";

import BackdropPlaceholder from "../../../components/ui/BackdropPlaceholder";
import CastSection from "../../../components/ui/CastSection";
import ErrorState from "../../../components/ui/ErrorState";
import PosterPlaceholder from "../../../components/ui/PosterPlaceholder";
import Spinner from "../../../components/ui/Spinner";
import TrailerModal from "../../../components/ui/TrailerModal";

import SaveButton from "../../library/components/SaveButton";
import SimilarTvShows from "../components/SimilarTvShows";

import {
  getTvShowCredits,
  getTvShowDetails,
  getTvShowTrailer,
} from "../../../services/tmdb/tvService";

const HTTP_STATUS_NOT_FOUND = 404;

function TvShowDetailsPage() {
  const { tvShowId } = useParams();

  const [request, setRequest] = useState({
    tvShowId: null,
    tvShow: null,
    error: null,
    isLoading: true,
  });

  const [trailerRequest, setTrailerRequest] = useState({
    tvShowId: null,
    trailer: null,
  });

  const [castRequest, setCastRequest] = useState({
    tvShowId: null,
    castMembers: [],
  });

  const [retryCount, setRetryCount] = useState(0);
  const [openTrailerTvShowId, setOpenTrailerTvShowId] = useState(null);

  const isCurrentTvShow = request.tvShowId === tvShowId;
  const isLoading = !isCurrentTvShow || request.isLoading;

  const tvShow = isCurrentTvShow ? request.tvShow : null;
  const error = isCurrentTvShow ? request.error : null;

  const trailer =
    trailerRequest.tvShowId === tvShowId ? trailerRequest.trailer : null;

  const castMembers =
    castRequest.tvShowId === tvShowId ? castRequest.castMembers : [];

  function handleRetry() {
    setRequest({
      tvShowId,
      tvShow: null,
      error: null,
      isLoading: true,
    });

    setTrailerRequest({
      tvShowId: null,
      trailer: null,
    });

    setCastRequest({
      tvShowId: null,
      castMembers: [],
    });

    setOpenTrailerTvShowId(null);
    setRetryCount((currentCount) => currentCount + 1);
  }

  function handleCloseTrailer() {
    setOpenTrailerTvShowId(null);
  }

  useEffect(() => {
    // Ignore responses from outdated requests.
    let isActive = true;

    async function loadTvShowDetails() {
      try {
        const details = await getTvShowDetails(tvShowId);

        if (!isActive) return;

        setRequest({
          tvShowId,
          tvShow: details,
          error: null,
          isLoading: false,
        });
      } catch (requestError) {
        if (!isActive) return;

        setRequest({
          tvShowId,
          tvShow: null,
          error: {
            status: requestError.status,
            message:
              requestError.status === HTTP_STATUS_NOT_FOUND
                ? "The TV show you're looking for doesn't exist."
                : "We couldn't load this TV show. Please try again.",
          },
          isLoading: false,
        });
      }
    }

    async function loadOptionalContent() {
      const [trailerResult, castResult] = await Promise.allSettled([
        getTvShowTrailer(tvShowId),
        getTvShowCredits(tvShowId),
      ]);

      if (!isActive) return;

      setTrailerRequest({
        tvShowId,
        trailer: trailerResult.status === "fulfilled" ? trailerResult.value : null,
      });
      setCastRequest({
        tvShowId,
        castMembers: castResult.status === "fulfilled" ? castResult.value : [],
      });
    }

    loadTvShowDetails();
    loadOptionalContent();

    return () => {
      isActive = false;
    };
  }, [tvShowId, retryCount]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <Spinner label="Loading TV show details..." size="lg" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-20">
        {error.status === HTTP_STATUS_NOT_FOUND ? (
          <ErrorState
            title="TV show not found"
            message={error.message}
            action={
              <Link
                to="/tv"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Explore TV Shows
              </Link>
            }
          />
        ) : (
          <ErrorState
            title="Unable to load TV show"
            message={error.message}
            onRetry={handleRetry}
          />
        )}
      </main>
    );
  }

  if (!tvShow) {
    return null;
  }

  const backdropUrl = tvShow.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`
    : null;

  const posterUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : null;

  const releaseYear = tvShow.first_air_date?.slice(0, 4) || "Unknown";

  const genres = tvShow.genres?.map((genre) => genre.name).join(" · ");

  const seasons = tvShow.number_of_seasons;
  const episodes = tvShow.number_of_episodes;

  const rating =
    typeof tvShow.vote_average === "number" && tvShow.vote_count > 0
      ? tvShow.vote_average.toFixed(1)
      : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* TV show backdrop */}
      <section className="relative w-full overflow-hidden bg-background">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            srcSet={`https://image.tmdb.org/t/p/w780${tvShow.backdrop_path} 780w, ${backdropUrl} 1280w`}
            sizes="100vw"
            alt=""
            className="block h-72 w-full object-cover object-center sm:h-96 lg:h-170"
          />
        ) : (
          <BackdropPlaceholder />
        )}

        {/* Backdrop gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </section>

      {/* TV show information */}
      <section className="relative mx-auto -mt-28 max-w-7xl px-6 pb-20 md:-mt-40">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* TV show poster */}
          <div>
            {posterUrl ? (
              <img
                src={posterUrl}
                width="500"
                height="750"
                alt={`${tvShow.name} poster`}
                className="w-36 rounded-xl shadow-2xl sm:w-44 md:w-full"
              />
            ) : (
              <PosterPlaceholder className="w-36 shadow-2xl sm:w-44 md:w-full" />
            )}
          </div>

          {/* TV show details */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold md:text-5xl">{tvShow.name}</h1>

            {/* Release year, status and rating */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{releaseYear}</span>

              {tvShow.status && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{tvShow.status}</span>
                </>
              )}

              {rating && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-foreground">★ {rating}/10</span>
                </>
              )}
            </div>

            {genres && <p className="text-sm text-muted">{genres}</p>}

            {/* Seasons and episodes */}
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              {seasons != null && (
                <span>
                  {seasons} {seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}

              {episodes != null && (
                <span>
                  {episodes} {episodes === 1 ? "Episode" : "Episodes"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SaveButton media={tvShow} mediaType="tv" listType="favorites" />

              <SaveButton media={tvShow} mediaType="tv" listType="watchlist" />
            </div>

            {/* Trailer button */}
            {trailer && (
              <button
                type="button"
                onClick={() => setOpenTrailerTvShowId(tvShowId)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Play size={18} fill="currentColor" aria-hidden="true" />
                Watch Trailer
              </button>
            )}

            {/* TV show overview */}
            <div className="max-w-3xl space-y-3">
              <h2 className="text-xl font-semibold">Overview</h2>

              <p className="leading-7 text-muted">
                {tvShow.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TV show cast */}
      <CastSection castMembers={castMembers} />

      {/* Similar TV shows */}
      <SimilarTvShows tvShowId={tvShowId} />

      {/* Trailer modal */}
      {openTrailerTvShowId === tvShowId && trailer && (
        <TrailerModal trailer={trailer} onClose={handleCloseTrailer} />
      )}
    </main>
  );
}

export default TvShowDetailsPage;

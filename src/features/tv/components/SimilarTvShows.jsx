import { useEffect, useState } from "react";

import MediaCarousel from "../../../components/ui/MediaCarousel";
import Spinner from "../../../components/ui/Spinner";
import { getSimilarTvShows } from "../../../services/tmdb/tvService";

function SimilarTvShows({ tvShowId }) {
  const [request, setRequest] = useState({
    tvShowId: null,
    tvShows: [],
    error: null,
    isLoading: true,
  });

  const isCurrentTvShow = request.tvShowId === tvShowId;
  const isLoading = !isCurrentTvShow || request.isLoading;

  const tvShows = isCurrentTvShow ? request.tvShows : [];
  const error = isCurrentTvShow ? request.error : null;

  useEffect(() => {
    let isActive = true;

    async function loadSimilarTvShows() {
      try {
        const results = await getSimilarTvShows(tvShowId);

        if (!isActive) return;

        setRequest({
          tvShowId,
          tvShows: results.filter((tvShow) => tvShow.id !== Number(tvShowId)),
          error: null,
          isLoading: false,
        });
      } catch (requestError) {
        if (!isActive) return;

        console.error("Failed to load similar TV shows:", requestError);

        setRequest({
          tvShowId,
          tvShows: [],
          error: "Unable to load similar TV shows.",
          isLoading: false,
        });
      }
    }

    loadSimilarTvShows();

    return () => {
      isActive = false;
    };
  }, [tvShowId]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          You May Also Like
        </h2>

        <div className="flex min-h-48 items-center justify-center">
          <Spinner label="Loading similar TV shows..." size="lg" />
        </div>
      </section>
    );
  }

  if (error || tvShows.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          You May Also Like
        </h2>

        <p
          role={error ? "alert" : undefined}
          className={`text-sm ${error ? "text-primary" : "text-muted"}`}
        >
          {error || "No similar TV shows available."}
        </p>
      </section>
    );
  }

  return (
    <MediaCarousel
      movies={tvShows}
      title="You May Also Like"
      titleId="similar-tv-shows-title"
      mediaType="tv"
    />
  );
}

export default SimilarTvShows;

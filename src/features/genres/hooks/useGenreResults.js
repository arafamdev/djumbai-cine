import { useEffect, useState } from "react";

import {
  discoverMoviesByGenre,
  discoverTvShowsByGenre,
} from "../../../services/tmdb/genreService";

function useGenreResults(mediaType, genreId, page) {
  const [retryCount, setRetryCount] = useState(0);

  const [request, setRequest] = useState({
    key: null,
    retryCount: 0,
    results: [],
    totalPages: 0,
    error: null,
  });

  const requestKey = `${mediaType}:${genreId}:${page}`;

  const isCurrentRequest =
    request.key === requestKey && request.retryCount === retryCount;

  useEffect(() => {
    const controller = new AbortController();

    async function loadResults() {
      const discoverMedia =
        mediaType === "tv" ? discoverTvShowsByGenre : discoverMoviesByGenre;

      try {
        const data = await discoverMedia(genreId, page, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        if (!Array.isArray(data?.results)) {
          throw new Error("Invalid genre results response.");
        }

        setRequest({
          key: requestKey,
          retryCount,
          results: data.results,
          totalPages: data.total_pages ?? 0,
          error: null,
        });
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load genre results:", requestError);

        setRequest({
          key: requestKey,
          retryCount,
          results: [],
          totalPages: 0,
          error: "Unable to load results. Please try again.",
        });
      }
    }

    loadResults();

    return () => {
      controller.abort();
    };
  }, [mediaType, genreId, page, requestKey, retryCount]);

  function retry() {
    setRetryCount((previousCount) => previousCount + 1);
  }

  return {
    results: isCurrentRequest ? request.results : [],
    totalPages: isCurrentRequest ? request.totalPages : 0,
    error: isCurrentRequest ? request.error : null,
    isLoading: !isCurrentRequest,
    retry,
  };
}

export default useGenreResults;

import { useEffect, useState } from "react";

import {
  discoverMoviesByGenre,
  discoverTvShowsByGenre,
} from "../../../services/tmdb/genreService";

function useGenreResults(mediaType, genreId, page) {
  const [request, setRequest] = useState({
    key: null,
    results: [],
    totalPages: 0,
    error: null,
  });

  const requestKey = `${mediaType}:${genreId}:${page}`;
  const isCurrentRequest = request.key === requestKey;

  useEffect(() => {
    const controller = new AbortController();

    async function loadResults() {
      const discoverMedia =
        mediaType === "tv" ? discoverTvShowsByGenre : discoverMoviesByGenre;

      try {
        const data = await discoverMedia(genreId, page, controller.signal);

        if (controller.signal.aborted) return;

        setRequest({
          key: requestKey,
          results: data.results ?? [],
          totalPages: data.total_pages ?? 0,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Failed to load genre results:", error);

        setRequest({
          key: requestKey,
          results: [],
          totalPages: 0,
          error: "Unable to load results. Please try again.",
        });
      }
    }

    loadResults();

    return () => controller.abort();
  }, [mediaType, genreId, page, requestKey]);

  return {
    results: isCurrentRequest ? request.results : [],
    totalPages: isCurrentRequest ? request.totalPages : 0,
    error: isCurrentRequest ? request.error : null,
    isLoading: !isCurrentRequest,
  };
}

export default useGenreResults;

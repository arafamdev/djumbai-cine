import { useEffect, useState } from "react";

import { getPopularTvShows } from "../../../services/tmdb/tvService";

function usePopularTvShows(page = 1) {
  const [tvShows, setTvShows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTvShows() {
      setIsLoading(true);
      setError(null);
      setTvShows([]);

      try {
        const data = await getPopularTvShows(page, controller.signal);

        if (controller.signal.aborted) return;

        setTvShows(data.results);
        setTotalPages(data.total_pages);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Failed to load popular TV shows:", requestError);
        setError("Unable to load TV shows. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTvShows();

    return () => {
      controller.abort();
    };
  }, [page]);

  return {
    tvShows,
    totalPages,
    isLoading,
    error,
  };
}

export default usePopularTvShows;

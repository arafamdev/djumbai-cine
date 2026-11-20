import { useEffect, useState } from "react";

import { getPopularMovies } from "../../../services/tmdb/movieService";

function usePopularMovies(page = 1) {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setIsLoading(true);
      setError(null);
      setMovies([]);

      try {
        const data = await getPopularMovies(page, controller.signal);

        if (controller.signal.aborted) return;

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Failed to load popular movies:", requestError);
        setError("Unable to load movies. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [page]);

  return {
    movies,
    totalPages,
    isLoading,
    error,
  };
}

export default usePopularMovies;

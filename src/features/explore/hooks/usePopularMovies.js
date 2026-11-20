import { useCallback, useEffect, useRef, useState } from "react";

import { getPopularMovies } from "../../../services/tmdb/movieService";

function usePopularMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const paginationControllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialMovies() {
      try {
        const data = await getPopularMovies(1, controller.signal);

        if (controller.signal.aborted) return;

        setMovies(data.results);
        setPage(data.page);
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

    loadInitialMovies();

    return () => {
      controller.abort();
      paginationControllerRef.current?.abort();
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (paginationControllerRef.current || page === 0 || page >= totalPages) {
      return;
    }

    const controller = new AbortController();
    paginationControllerRef.current = controller;

    setIsLoadingMore(true);
    setError(null);

    try {
      const data = await getPopularMovies(page + 1, controller.signal);

      if (controller.signal.aborted) return;

      setMovies((previousMovies) => {
        const existingIds = new Set(previousMovies.map((movie) => movie.id));

        const newMovies = data.results.filter(
          (movie) => !existingIds.has(movie.id),
        );

        return [...previousMovies, ...newMovies];
      });

      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (requestError) {
      if (controller.signal.aborted) return;

      console.error("Failed to load more movies:", requestError);
      setError("Unable to load more movies. Please try again.");
    } finally {
      if (paginationControllerRef.current === controller) {
        paginationControllerRef.current = null;
      }

      if (!controller.signal.aborted) {
        setIsLoadingMore(false);
      }
    }
  }, [page, totalPages]);

  return {
    movies,
    isLoading,
    isLoadingMore,
    error,
    hasMore: page > 0 && page < totalPages,
    loadMore,
  };
}

export default usePopularMovies;

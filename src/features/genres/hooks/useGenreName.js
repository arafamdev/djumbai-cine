import { useEffect, useState } from "react";

import {
  getMovieGenres,
  getTvGenres,
} from "../../../services/tmdb/genreService";

function useGenreName(mediaType, genreId) {
  const [request, setRequest] = useState({
    key: null,
    name: null,
    error: null,
  });

  const requestKey = `${mediaType}:${genreId}`;
  const isCurrentRequest = request.key === requestKey;

  useEffect(() => {
    const controller = new AbortController();

    async function loadGenreName() {
      const getGenres = mediaType === "tv" ? getTvGenres : getMovieGenres;

      try {
        const genres = await getGenres(controller.signal);

        if (controller.signal.aborted) return;

        const selectedGenre = genres.find(
          (genre) => String(genre.id) === String(genreId),
        );

        setRequest({
          key: requestKey,
          name: selectedGenre?.name ?? null,
          error: null,
        });
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Failed to load genre name:", requestError);

        setRequest({
          key: requestKey,
          name: null,
          error: "Unable to load genre name.",
        });
      }
    }

    loadGenreName();

    return () => controller.abort();
  }, [mediaType, genreId, requestKey]);

  return {
    genreName: isCurrentRequest ? request.name : null,
    genreError: isCurrentRequest ? request.error : null,
    isGenreLoading: !isCurrentRequest,
  };
}

export default useGenreName;

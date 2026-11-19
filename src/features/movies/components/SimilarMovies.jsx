import { useEffect, useState } from "react";

import MovieCarousel from "../../../components/ui/MovieCarousel";
import Spinner from "../../../components/ui/Spinner";
import { getSimilarMovies } from "../../../services/tmdb/movieService";

function SimilarMovies({ movieId }) {
  const [request, setRequest] = useState({
    movieId: null,
    movies: [],
    error: null,
    isLoading: true,
  });

  const isCurrentMovie = request.movieId === movieId;
  const isLoading = !isCurrentMovie || request.isLoading;

  const movies = isCurrentMovie ? request.movies : [];
  const error = isCurrentMovie ? request.error : null;

  useEffect(() => {
    // Ignore results from outdated movie requests.
    let isActive = true;

    async function loadSimilarMovies() {
      try {
        const results = await getSimilarMovies(movieId);

        if (!isActive) return;

        setRequest({
          movieId,
          movies: results.filter((movie) => movie.id !== Number(movieId)),
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!isActive) return;

        console.error("Failed to load similar movies:", error);

        setRequest({
          movieId,
          movies: [],
          error: "Unable to load similar movies.",
          isLoading: false,
        });
      }
    }

    loadSimilarMovies();

    return () => {
      isActive = false;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          You May Also Like
        </h2>

        <div className="flex min-h-48 items-center justify-center">
          <Spinner label="Loading similar movies..." size="lg" />
        </div>
      </section>
    );
  }

  if (error || movies.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          You May Also Like
        </h2>

        <p
          role={error ? "alert" : undefined}
          className={`text-sm ${error ? "text-primary" : "text-muted"}`}
        >
          {error || "No similar movies available."}
        </p>
      </section>
    );
  }

  return (
    <MovieCarousel
      movies={movies}
      title="You May Also Like"
      titleId="similar-movies-title"
    />
  );
}

export default SimilarMovies;

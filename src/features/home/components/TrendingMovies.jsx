import { useEffect, useState } from "react";

import MovieCarousel from "../../../components/ui/MovieCarousel";
import Spinner from "../../../components/ui/Spinner";
import { getTrendingMovies } from "../../../services/tmdb/movieService";

function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ignore responses after the effect has been cleaned up.
    let isActive = true;

    async function loadTrendingMovies() {
      try {
        const trendingMovies = await getTrendingMovies();

        if (isActive) {
          setMovies(trendingMovies);
        }
      } catch (error) {
        console.error("Failed to load trending movies:", error);

        if (isActive) {
          setError("Unable to load trending movies. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadTrendingMovies();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Trending Movies
        </h2>

        <div className="flex min-h-64 items-center justify-center">
          <Spinner label="Loading trending movies..." size="lg" />
        </div>
      </section>
    );
  }

  if (error || movies.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Trending Movies
        </h2>

        <p
          role={error ? "alert" : undefined}
          className={`text-sm ${error ? "text-primary" : "text-muted"}`}
        >
          {error || "No movies available."}
        </p>
      </section>
    );
  }

  return (
    <MovieCarousel
      movies={movies}
      title="Trending Movies"
      titleId="trending-movies-title"
    />
  );
}

export default TrendingMovies;

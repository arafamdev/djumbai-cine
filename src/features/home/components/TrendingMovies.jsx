import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Spinner from "../../../components/ui/Spinner";
import { getTrendingMovies } from "../../../services/tmdb/movieService";

import MovieCard from "./MovieCard";

function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const carouselRef = useRef(null);

  // Fetch trending movies and ignore responses after cleanup.
  useEffect(() => {
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

  // Update navigation availability based on the scroll position.
  function updateScrollButtons() {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const { scrollLeft, scrollWidth, clientWidth } = carousel;

    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }

  // Recalculate navigation when movies or carousel dimensions change.
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const observer = new ResizeObserver(updateScrollButtons);

    observer.observe(carousel);
    updateScrollButtons();

    return () => observer.disconnect();
  }, [movies]);

  function scrollMovies(direction) {
    const carousel = carouselRef.current;

    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section
      aria-labelledby="trending-movies-title"
      className="mx-auto w-full max-w-7xl px-6 py-12"
    >
      {/* Section header and navigation */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="trending-movies-title"
          className="text-2xl font-bold text-foreground"
        >
          Trending Movies
        </h2>

        {!isLoading && !error && movies.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollMovies(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll trending movies left"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollMovies(1)}
              disabled={!canScrollRight}
              aria-label="Scroll trending movies right"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Loading, error, empty, and success states */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Spinner label="Loading trending movies..." size="lg" />
        </div>
      ) : error ? (
        <p role="alert" className="text-sm text-primary">
          {error}
        </p>
      ) : movies.length === 0 ? (
        <p className="text-sm text-muted">No movies available.</p>
      ) : (
        /* Horizontal movie carousel */
        <div
          ref={carouselRef}
          onScroll={updateScrollButtons}
          tabIndex={0}
          role="region"
          aria-label="Trending movies carousel"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-[calc((100%-1rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TrendingMovies;

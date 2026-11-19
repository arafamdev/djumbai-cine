import { useState } from "react";
import { Info, Play } from "lucide-react";

import Button from "../../../components/ui/Button";
import TrailerModal from "../../../components/ui/TrailerModal";
import { getMovieTrailer } from "../../../services/tmdb/movieService";

import featuredMovie from "../data/featuredMovie";

const imageBaseUrl = "https://image.tmdb.org/t/p/original";

function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [error, setError] = useState(null);

  // Featured movie backdrop
  const backdropUrl = `${imageBaseUrl}${featuredMovie.backdropPath}`;

  // Load the trailer when the user clicks the button.
  async function handleWatchTrailer() {
    setIsLoading(true);
    setError(null);

    try {
      const selectedTrailer = await getMovieTrailer(featuredMovie.id);

      if (!selectedTrailer) {
        setError("No trailer available for this movie.");
        return;
      }

      setTrailer(selectedTrailer);
    } catch (error) {
      console.error("Failed to load movie trailer:", error);
      setError("Unable to load the trailer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Close the modal and stop video playback.
  function handleCloseTrailer() {
    setTrailer(null);
  }

  return (
    <section
      aria-labelledby="featured-movie-title"
      className="relative isolate flex min-h-[85vh] items-end overflow-hidden bg-background pt-24"
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat lg:bg-[position:center_18%]"
        style={{ backgroundImage: `url("${backdropUrl}")` }}
      />

      {/* Horizontal gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/75 to-transparent"
      />

      {/* Vertical gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-transparent to-background/20"
      />

      {/* Hero content */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Featured Movie
          </p>

          <h1
            id="featured-movie-title"
            className="mb-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
          >
            {featuredMovie.title}
          </h1>

          {/* Movie metadata */}
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{featuredMovie.releaseYear}</span>
            <span aria-hidden="true">•</span>
            <span>{featuredMovie.genres.join(" / ")}</span>
            <span aria-hidden="true">•</span>
            <span>★ {featuredMovie.rating.toFixed(1)}</span>
          </div>

          <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
            {featuredMovie.overview}
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={handleWatchTrailer} disabled={isLoading}>
              <Play size={18} fill="currentColor" aria-hidden="true" />
              {isLoading ? "Loading..." : "Watch Trailer"}
            </Button>

            <Button variant="secondary" disabled>
              <Info size={18} aria-hidden="true" />
              More Details
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <p role="alert" className="mt-4 text-sm text-primary">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Trailer modal */}
      {trailer && (
        <TrailerModal trailer={trailer} onClose={handleCloseTrailer} />
      )}
    </section>
  );
}

export default HeroSection;

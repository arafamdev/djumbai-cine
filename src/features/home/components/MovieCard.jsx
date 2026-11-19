import { Link } from "react-router-dom";

import PosterPlaceholder from "../../../components/ui/PosterPlaceholder";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 4);

  const rating =
    typeof movie.vote_average === "number" && movie.vote_count > 0
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <article className="group min-w-0">
      <Link
        to={`/movies/${movie.id}`}
        aria-label={`View details for ${movie.title}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="aspect-2/3 overflow-hidden rounded-xl bg-elevated">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <PosterPlaceholder className="h-full w-full" />
          )}
        </div>

        <div className="mt-3">
          <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {movie.title}
          </h3>

          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted">
            <span>{releaseYear || "Unknown"}</span>

            {rating && <span>★ {rating}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;

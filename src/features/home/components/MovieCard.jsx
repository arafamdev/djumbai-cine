function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <article className="group min-w-0">
      <div className="aspect-2/3 overflow-hidden rounded-xl bg-elevated">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No poster available
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {movie.title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>{releaseYear || "Unknown"}</span>
          <span>★ {movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;

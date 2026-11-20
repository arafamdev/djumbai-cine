import { Link } from "react-router-dom";

import PosterPlaceholder from "./PosterPlaceholder";

function MediaCard({ media, mediaType }) {
  const isTvShow = mediaType === "tv";

  const title = isTvShow ? media.name : media.title;
  const releaseDate = isTvShow ? media.first_air_date : media.release_date;

  const detailsPath = isTvShow ? `/tv/${media.id}` : `/movies/${media.id}`;

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  const releaseYear = releaseDate?.slice(0, 4);

  const rating =
    typeof media.vote_average === "number" && media.vote_count > 0
      ? media.vote_average.toFixed(1)
      : null;

  return (
    <article className="group min-w-0">
      <Link
        to={detailsPath}
        aria-label={`View details for ${title}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="aspect-2/3 overflow-hidden rounded-xl bg-elevated">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <PosterPlaceholder className="h-full w-full" />
          )}
        </div>

        <div className="mt-3">
          <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
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

export default MediaCard;

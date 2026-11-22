import { Link } from "react-router-dom";

import SaveButton from "../../features/library/components/SaveButton";
import PosterPlaceholder from "./PosterPlaceholder";

function MediaCard({ media, mediaType }) {
  const isTvShow = mediaType === "tv";

  // Normalized TV shows use different field names from TMDB responses.
  const title = isTvShow ? (media.name ?? media.title) : media.title;

  const releaseDate = isTvShow
    ? (media.first_air_date ?? media.release_date)
    : media.release_date;

  const detailsPath = isTvShow ? `/tv/${media.id}` : `/movies/${media.id}`;

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w342${media.poster_path}`
    : null;

  const releaseYear = releaseDate?.slice(0, 4);

  const rating =
    typeof media.vote_average === "number" && media.vote_count > 0
      ? media.vote_average.toFixed(1)
      : null;

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link
          to={detailsPath}
          aria-label={`View details for ${title}`}
          className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <div className="aspect-2/3 overflow-hidden rounded-xl bg-elevated">
            {posterUrl ? (
              <img
                src={posterUrl}
                srcSet={`https://image.tmdb.org/t/p/w185${media.poster_path} 185w, ${posterUrl} 342w, https://image.tmdb.org/t/p/w500${media.poster_path} 500w`}
                sizes="(min-width: 1280px) 240px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                width="342"
                height="513"
                decoding="async"
                alt={`${title} poster`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            ) : (
              <PosterPlaceholder className="h-full w-full" />
            )}
          </div>
        </Link>

        {/* Keep buttons separate from the details link. */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-100 transition-[opacity,transform] duration-300 motion-reduce:transition-none sm:right-3 sm:top-3 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100">
          <SaveButton
            media={media}
            mediaType={mediaType}
            listType="favorites"
            compact
          />

          <SaveButton
            media={media}
            mediaType={mediaType}
            listType="watchlist"
            compact
          />
        </div>
      </div>

      <Link
        to={detailsPath}
        className="mt-3 block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted">
          <span>{releaseYear || "Unknown"}</span>

          {rating && <span>★ {rating}</span>}
        </div>
      </Link>
    </article>
  );
}

export default MediaCard;

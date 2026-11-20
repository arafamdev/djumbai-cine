import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import PosterPlaceholder from "../../../components/ui/PosterPlaceholder";

const MAX_SUGGESTIONS = 5;

function SearchSuggestions({
  suggestionsId,
  searchResults,
  isLoading,
  activeSuggestionIndex,
  onSuggestionSelect,
  onViewAllResults,
}) {
  const suggestedMedia = searchResults.slice(0, MAX_SUGGESTIONS);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-xl">
      {/* Suggestions header */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Suggestions
        </p>
      </div>

      {isLoading ? (
        <p role="status" className="px-4 py-5 text-sm text-muted">
          Searching...
        </p>
      ) : (
        <>
          {suggestedMedia.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted">
              No suggestions found.
            </p>
          ) : (
            /* Suggestions list */
            <ul id={suggestionsId} role="listbox">
              {suggestedMedia.map((mediaItem, suggestionIndex) => {
                const isTvShow = mediaItem.media_type === "tv";

                const mediaTitle = isTvShow ? mediaItem.name : mediaItem.title;

                const mediaReleaseDate = isTvShow
                  ? mediaItem.first_air_date
                  : mediaItem.release_date;

                const mediaDetailsPath = isTvShow
                  ? `/tv/${mediaItem.id}`
                  : `/movies/${mediaItem.id}`;

                const mediaPosterUrl = mediaItem.poster_path
                  ? `https://image.tmdb.org/t/p/w92${mediaItem.poster_path}`
                  : null;

                const mediaReleaseYear = mediaReleaseDate?.slice(0, 4);

                const mediaRating =
                  typeof mediaItem.vote_average === "number" &&
                  mediaItem.vote_count > 0
                    ? mediaItem.vote_average.toFixed(1)
                    : null;

                const isActiveSuggestion =
                  suggestionIndex === activeSuggestionIndex;

                return (
                  <li
                    key={`${mediaItem.media_type}-${mediaItem.id}`}
                    id={`${suggestionsId}-option-${suggestionIndex}`}
                    role="option"
                    aria-selected={isActiveSuggestion}
                    aria-label={`${mediaTitle}, ${isTvShow ? "TV Show" : "Movie"}${mediaReleaseYear ? `, ${mediaReleaseYear}` : ""}`}
                  >
                    <Link
                      to={mediaDetailsPath}
                      onClick={onSuggestionSelect}
                      tabIndex={-1}
                      className={`flex items-center gap-3 border-t border-white/5 px-4 py-3 transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary ${
                        isActiveSuggestion ? "bg-elevated" : ""
                      }`}
                    >
                      {/* Media poster */}
                      <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-elevated">
                        {mediaPosterUrl ? (
                          <img
                            src={mediaPosterUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PosterPlaceholder className="h-full w-full" />
                        )}
                      </div>

                      {/* Media information */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {mediaTitle}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {isTvShow ? "TV Show" : "Movie"}
                          {mediaReleaseYear && ` · ${mediaReleaseYear}`}
                        </p>
                      </div>

                      {/* Media rating */}
                      {mediaRating && (
                        <span className="shrink-0 text-xs text-muted">
                          ★ {mediaRating}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {/* View all results */}
      <button
        type="button"
        onClick={onViewAllResults}
        className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-4 text-sm font-medium text-foreground transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
      >
        View all results
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default SearchSuggestions;

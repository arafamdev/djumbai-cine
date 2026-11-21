import { useState } from "react";
import { Link } from "react-router-dom";

import MediaGrid from "../../../components/ui/MediaGrid";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

function LibraryCollection({
  items,
  Icon,
  title,
  description,
  emptyTitle,
  emptyDescription,
  emptyFilterDescription,
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Derive filtered results from the current items and selected category.
  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.mediaType === activeFilter);

  const hasItems = items.length > 0;
  const hasFilteredResults = filteredItems.length > 0;

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-32 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start gap-4">
          <div className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={24} aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>

            <p className="mt-3 text-muted">{description}</p>
          </div>
        </div>

        {!hasItems ? (
          <div className="mt-16 flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <Icon size={40} className="text-muted" aria-hidden="true" />

            <h2 className="mt-5 text-xl font-semibold">{emptyTitle}</h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              {emptyDescription}
            </p>

            <Link
              to="/movies"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <>
            <div
              role="group"
              aria-label={`Filter ${title.toLowerCase()} by media type`}
              className="mt-10 flex flex-wrap gap-2"
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={`min-h-11 cursor-pointer rounded-lg border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    activeFilter === filter.value
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-elevated text-muted hover:border-primary hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {hasFilteredResults ? (
              <MediaGrid movies={filteredItems} />
            ) : (
              <div className="mt-12 rounded-xl border border-border bg-surface px-6 py-12 text-center">
                <h2 className="text-lg font-semibold">Nothing here yet</h2>

                <p className="mt-2 text-sm text-muted">
                  {emptyFilterDescription}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default LibraryCollection;

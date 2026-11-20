import { SearchX } from "lucide-react";

function SearchEmptyState({ onTryAgain }) {
  return (
    <section
      aria-labelledby="search-empty-title"
      className="flex min-h-100 flex-col items-center justify-center px-4 py-12 text-center"
    >
      {/* Empty state illustration */}
      <div className="flex size-20 items-center justify-center rounded-2xl border border-white/10 bg-elevated">
        <SearchX
          size={36}
          strokeWidth={1.5}
          className="text-primary"
          aria-hidden="true"
        />
      </div>

      <h2
        id="search-empty-title"
        className="mt-7 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        No results found
      </h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-muted sm:text-base">
        We couldn't find any movies or TV shows matching your search. Try
        another title or check your spelling.
      </p>

      <button
        type="button"
        onClick={onTryAgain}
        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        Try another search
      </button>
    </section>
  );
}

export default SearchEmptyState;

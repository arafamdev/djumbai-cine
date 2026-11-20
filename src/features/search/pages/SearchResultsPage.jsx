import { useSearchParams } from "react-router-dom";

import MediaCard from "../../../components/ui/MediaCard";
import Pagination from "../../../components/ui/Pagination";
import Spinner from "../../../components/ui/Spinner";
import useSearchMedia from "../hooks/useSearchMedia";
import SearchEmptyState from "../components/SearchEmptyState";

const MIN_PAGE = 1;
const MAX_TMDB_PAGE = 500;

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the search query and requested page from the URL.
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const pageParameter = searchParams.get("page");
  const requestedPage = Number(pageParameter);

  // Reject invalid pages and respect TMDB's pagination limit.
  const isValidPage =
    pageParameter !== null &&
    pageParameter.trim() !== "" &&
    Number.isSafeInteger(requestedPage) &&
    requestedPage >= MIN_PAGE &&
    requestedPage <= MAX_TMDB_PAGE;

  const currentPage = isValidPage ? requestedPage : MIN_PAGE;

  const {
    results: searchResults,
    totalPages,
    isLoading,
    error: searchError,
  } = useSearchMedia(searchQuery, currentPage);

  const availablePages = Math.min(totalPages, MAX_TMDB_PAGE);

  function handlePageChange(selectedPage) {
    if (
      selectedPage === currentPage ||
      selectedPage < MIN_PAGE ||
      selectedPage > availablePages
    ) {
      return;
    }

    // Keep the search query when navigating between pages.
    setSearchParams({
      q: searchQuery,
      page: String(selectedPage),
    });
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Search Results
        </h1>

        {searchQuery ? (
          <p className="mt-3 text-sm text-muted sm:text-base">
            Results for{" "}
            <span className="font-semibold text-foreground">{searchQuery}</span>
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Enter a movie or TV show title to start searching.
          </p>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Searching movies and TV shows..." size="lg" />
          </div>
        )}

        {/* Error state */}
        {!isLoading && searchError && (
          <p role="alert" className="mt-8 text-sm text-primary">
            {searchError}
          </p>
        )}

        {/* Empty search results */}
        {searchQuery &&
          !isLoading &&
          !searchError &&
          searchResults.length === 0 && (
            <SearchEmptyState
              onTryAgain={() => {
                // The search panel will be connected in the next step.
              }}
            />
          )}

        {/* Search results and pagination */}
        {!isLoading && !searchError && searchResults.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {searchResults.map((mediaItem) => (
                <MediaCard
                  key={`${mediaItem.media_type}-${mediaItem.id}`}
                  media={mediaItem}
                  mediaType={mediaItem.media_type}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={availablePages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default SearchResultsPage;

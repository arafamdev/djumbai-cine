import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clapperboard } from "lucide-react";

import ErrorState from "../../../components/ui/ErrorState";
import MediaGrid from "../../../components/ui/MediaGrid";
import Pagination from "../../../components/ui/Pagination";
import Spinner from "../../../components/ui/Spinner";

import useGenreName from "../hooks/useGenreName";
import useGenreResults from "../hooks/useGenreResults";

const MIN_PAGE = 1;
const MAX_TMDB_PAGE = 500;

function GenreResultsPage({ mediaType }) {
  const { genreId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const requestedPage = Number(pageParam);

  const isValidPage =
    pageParam !== null &&
    pageParam.trim() !== "" &&
    Number.isSafeInteger(requestedPage) &&
    requestedPage >= MIN_PAGE &&
    requestedPage <= MAX_TMDB_PAGE;

  const currentPage = isValidPage ? requestedPage : MIN_PAGE;

  const { results, totalPages, isLoading, error, retry } = useGenreResults(
    mediaType,
    genreId,
    currentPage,
  );

  const { genreName, genreError, isGenreLoading } = useGenreName(
    mediaType,
    genreId,
  );

  const isInvalidGenre = !isGenreLoading && !genreError && genreName === null;

  const availablePages = Math.min(totalPages, MAX_TMDB_PAGE);

  const mediaLabel = mediaType === "tv" ? "TV Shows" : "Movies";

  function handlePageChange(selectedPage) {
    const isPageOutOfRange =
      selectedPage < MIN_PAGE || selectedPage > availablePages;

    if (selectedPage === currentPage || isPageOutOfRange) {
      return;
    }

    setSearchParams({ page: String(selectedPage) });
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Link
            to="/genres"
            className="group mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            <span>Back to genres</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore {mediaLabel}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {isGenreLoading ? (
              <Spinner label="Loading genre..." size="sm" />
            ) : genreName ? (
              <>
                <span className="inline-flex min-h-9 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  {genreName}
                </span>

                <span className="text-sm text-muted">Selected genre</span>
              </>
            ) : !genreError ? (
              <span className="text-sm text-muted">Genre not found</span>
            ) : null}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {genreName
              ? `Discover ${mediaLabel.toLowerCase()} in ${genreName}.`
              : `Discover ${mediaLabel.toLowerCase()} by genre.`}
          </p>
        </div>

        {isGenreLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Loading genre..." size="lg" />
          </div>
        ) : genreError ? (
          <ErrorState
            title="Unable to load genre"
            message={genreError}
            action={
              <Link
                to="/genres"
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Explore genres
              </Link>
            }
          />
        ) : isInvalidGenre ? (
          <ErrorState
            title="Genre not found"
            message="Please select a valid genre to explore movies or TV shows."
            action={
              <Link
                to="/genres"
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Explore genres
              </Link>
            }
          />
        ) : isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Loading results..." size="lg" />
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load results"
            message={error}
            onRetry={retry}
          />
        ) : results.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Clapperboard
              size={40}
              aria-hidden="true"
              className="mb-5 text-muted"
            />

            <h2 className="text-xl font-semibold text-foreground">
              No results found
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              There are no titles available for this genre right now.
            </p>

            <Link
              to="/genres"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Explore other genres
            </Link>
          </div>
        ) : (
          <>
            <MediaGrid movies={results} mediaType={mediaType} />

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

export default GenreResultsPage;

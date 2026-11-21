import { Link, useParams, useSearchParams } from "react-router-dom";

import MediaGrid from "../../../components/ui/MediaGrid";
import Pagination from "../../../components/ui/Pagination";
import Spinner from "../../../components/ui/Spinner";
import useGenreResults from "../hooks/useGenreResults";
import useGenreName from "../hooks/useGenreName";
import { ArrowLeft } from "lucide-react";

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

  const { results, totalPages, isLoading, error } = useGenreResults(
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
              <div className="flex min-h-64 items-center justify-center">
                <Spinner label="Loading results..." size="lg" />
              </div>
            ) : genreName ? (
              <>
                <span className="inline-flex min-h-9 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  {genreName}
                </span>

                <span className="text-sm text-muted">Selected genre</span>
              </>
            ) : (
              <span className="text-sm text-muted">
                {genreError ?? "Genre not found"}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {genreName
              ? `Discover ${mediaLabel.toLowerCase()} in ${genreName}.`
              : `Discover ${mediaLabel.toLowerCase()} by genre.`}
          </p>
        </div>

        {isInvalidGenre && (
          <div
            role="alert"
            className="mt-10 rounded-xl border border-white/10 bg-surface p-6 text-center"
          >
            <h2 className="text-xl font-semibold text-foreground">
              Genre not found
            </h2>

            <p className="mt-3 text-sm text-muted">
              Please select a valid genre to explore movies or TV shows.
            </p>

            <Link
              to="/genres"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Explore genres
            </Link>
          </div>
        )}

        {!isGenreLoading &&
          !isInvalidGenre &&
          !isLoading &&
          !error &&
          results.length > 0 && (
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

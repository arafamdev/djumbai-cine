import { useSearchParams } from "react-router-dom";

import MediaGrid from "../../../components/ui/MediaGrid";
import Pagination from "../../../components/ui/Pagination";
import Spinner from "../../../components/ui/Spinner";
import usePopularMovies from "../hooks/usePopularMovies";

const MIN_PAGE = 1;
const MAX_TMDB_PAGE = 500;

function ExploreMoviesPage() {
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

  const { movies, totalPages, isLoading, error } =
    usePopularMovies(currentPage);

  const availablePages = Math.min(totalPages, MAX_TMDB_PAGE);

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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Explore Movies
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Discover movies, explore genres, and find your next favorite film.
        </p>

        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Loading movies..." size="lg" />
          </div>
        )}

        {!isLoading && error && (
          <p role="alert" className="mt-8 text-center text-sm text-primary">
            {error}
          </p>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <p className="mt-8 text-sm text-muted">No movies available.</p>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <>
            <MediaGrid movies={movies} />

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

export default ExploreMoviesPage;

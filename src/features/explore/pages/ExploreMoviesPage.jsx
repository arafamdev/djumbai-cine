import MovieGrid from "../../../components/ui/MovieGrid";
import Spinner from "../../../components/ui/Spinner";
import usePopularMovies from "../hooks/usePopularMovies";

function ExploreMoviesPage() {
  const { movies, isLoading, isLoadingMore, error, hasMore, loadMore } =
    usePopularMovies();

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

        {!isLoading && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="cursor-pointer rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <p className="mt-8 text-sm text-muted">No movies available.</p>
        )}

        {error && (
          <p role="alert" className="mt-8 text-center text-sm text-primary">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

export default ExploreMoviesPage;

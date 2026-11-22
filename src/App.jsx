import { lazy, Suspense, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import RouteErrorBoundary from "./components/layout/RouteErrorBoundary";
import Spinner from "./components/ui/Spinner";
import HomePage from "./features/home/pages/HomePage";
import ScrollToTop from "./components/layout/ScrollToTop";

const ExploreMoviesPage = lazy(() =>
  import("./features/movies/pages/ExploreMoviesPage"),
);
const NotFoundPage = lazy(() =>
  import("./features/errors/pages/NotFoundPage"),
);
const MovieDetailsPage = lazy(() =>
  import("./features/movies/pages/MovieDetailsPage"),
);
const ExploreTvShowsPage = lazy(() =>
  import("./features/tv/pages/ExploreTvShowsPage"),
);
const TvShowDetailsPage = lazy(() =>
  import("./features/tv/pages/TvShowDetailsPage"),
);
const SearchResultsPage = lazy(() =>
  import("./features/search/pages/SearchResultsPage"),
);
const ExploreGenresPage = lazy(() =>
  import("./features/genres/pages/ExploreGenresPage"),
);
const GenreResultsPage = lazy(() =>
  import("./features/genres/pages/GenreResultsPage"),
);
const FavoritesPage = lazy(() =>
  import("./features/library/pages/FavoritesPage"),
);
const WatchlistPage = lazy(() =>
  import("./features/library/pages/WatchlistPage"),
);

function App() {
  const location = useLocation();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState(null);

  function openSearch() {
    setActiveHeaderPanel("search");
  }

  return (
    <>
      <ScrollToTop />

      <Header
        activePanel={activeHeaderPanel}
        onPanelChange={setActiveHeaderPanel}
      />

      <RouteErrorBoundary key={location.pathname}>
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-background pt-20">
              <Spinner label="Loading page..." size="lg" />
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Personal library */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />

            {/* Movies */}
            <Route path="/movies" element={<ExploreMoviesPage />} />
            <Route path="/movies/:movieId" element={<MovieDetailsPage />} />

            {/* Tv Shows  */}
            <Route path="/tv" element={<ExploreTvShowsPage />} />
            <Route path="/tv/:tvShowId" element={<TvShowDetailsPage />} />

            <Route
              path="/search"
              element={<SearchResultsPage onTryAgain={openSearch} />}
            />

            {/* Genres */}
            <Route path="/genres" element={<ExploreGenresPage />} />
            <Route
              path="/genres/movies/:genreId"
              element={<GenreResultsPage mediaType="movie" />}
            />
            <Route
              path="/genres/tv/:genreId"
              element={<GenreResultsPage mediaType="tv" />}
            />

            {/* Not found page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>

      <Footer />
    </>
  );
}

export default App;

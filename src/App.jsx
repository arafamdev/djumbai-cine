import { Route, Routes } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ExploreMoviesPage from "./features/movies/pages/ExploreMoviesPage";
import NotFoundPage from "./features/errors/pages/NotFoundPage";
import HomePage from "./features/home/pages/HomePage";
import MovieDetailsPage from "./features/movies/pages/MovieDetailsPage";
import ExploreTvShowsPage from "./features/tv/pages/ExploreTvShowsPage";
import TvShowDetailsPage from "./features/tv/pages/TvShowDetailsPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import SearchResultsPage from "./features/search/pages/SearchResultsPage";
import ExploreGenresPage from "./features/genres/pages/ExploreGenresPage";
import GenreResultsPage from "./features/genres/pages/GenreResultsPage";

function App() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Movies */}
        <Route path="/movies" element={<ExploreMoviesPage />} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage />} />

        {/* Tv Shows  */}
        <Route path="/tv" element={<ExploreTvShowsPage />} />
        <Route path="/tv/:tvShowId" element={<TvShowDetailsPage />} />

        <Route path="/search" element={<SearchResultsPage />} />

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

      <Footer />
    </>
  );
}

export default App;

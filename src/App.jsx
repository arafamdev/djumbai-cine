import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import NotFoundPage from "./features/errors/pages/NotFoundPage";
import HomePage from "./features/home/pages/HomePage";
import MovieDetailsPage from "./features/movies/pages/MovieDetailsPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

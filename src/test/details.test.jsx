import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import LibraryProvider from "../features/library/context/LibraryContext";
import MovieDetailsPage from "../features/movies/pages/MovieDetailsPage";
import TvShowDetailsPage from "../features/tv/pages/TvShowDetailsPage";
import * as movies from "../services/tmdb/movieService";
import * as tv from "../services/tmdb/tvService";

vi.mock("../services/tmdb/movieService", () => ({ getMovieDetails: vi.fn(), getMovieTrailer: vi.fn(), getMovieCredits: vi.fn() }));
vi.mock("../services/tmdb/tvService", () => ({ getTvShowDetails: vi.fn(), getTvShowTrailer: vi.fn(), getTvShowCredits: vi.fn() }));
vi.mock("../features/movies/components/SimilarMovies", () => ({ default: () => null }));
vi.mock("../features/tv/components/SimilarTvShows", () => ({ default: () => null }));

const cases = [
  { name: "movie", path: "/movies/:movieId", url: "/movies/1", Page: MovieDetailsPage, details: movies.getMovieDetails, trailer: movies.getMovieTrailer, credits: movies.getMovieCredits, data: { id: 1, title: "Example movie" }, title: "Example movie" },
  { name: "TV show", path: "/tv/:tvShowId", url: "/tv/1", Page: TvShowDetailsPage, details: tv.getTvShowDetails, trailer: tv.getTvShowTrailer, credits: tv.getTvShowCredits, data: { id: 1, name: "Example show" }, title: "Example show" },
];

beforeEach(() => {
  for (const item of cases) {
    item.details.mockReset().mockResolvedValue(item.data);
    item.trailer.mockReset().mockResolvedValue(null);
    item.credits.mockReset().mockResolvedValue([]);
  }
});

function renderDetails({ Page, path, url }) {
  return render(<MemoryRouter initialEntries={[url]}><LibraryProvider><Routes>
    <Route path={path} element={<Page />} />
  </Routes></LibraryProvider></MemoryRouter>);
}

for (const item of cases) {
  test(`${item.name} details render while optional requests remain pending`, async () => {
    let resolveTrailer;
    item.trailer.mockReturnValue(new Promise(resolve => { resolveTrailer = resolve; }));
    const view = renderDetails(item);
    expect(await screen.findByRole("heading", { name: item.title })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Watch Trailer" })).not.toBeInTheDocument();
    await act(async () => resolveTrailer({ key: "example", name: "Trailer" }));
    expect(await screen.findByRole("button", { name: "Watch Trailer" })).toBeInTheDocument();
    view.unmount();
  });

  test(`${item.name} optional failures preserve details and retry recovers main failures`, async () => {
    item.details.mockRejectedValueOnce(new Error("Offline"));
    item.trailer.mockRejectedValue(new Error("No video"));
    item.credits.mockRejectedValue(new Error("No cast"));
    renderDetails(item);
    await screen.findByRole("alert");
    await userEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(await screen.findByRole("heading", { name: item.title })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Watch Trailer" })).not.toBeInTheDocument();
  });

  test(`${item.name} 404 has a clear recovery link`, async () => {
    item.details.mockRejectedValue(Object.assign(new Error("Missing"), { status: 404 }));
    renderDetails(item);
    expect(await screen.findByRole("alert")).toHaveTextContent(/not found/i);
    expect(screen.queryByRole("button", { name: "Try Again" })).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
}

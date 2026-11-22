import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import App from "../App";
import LibraryProvider from "../features/library/context/LibraryContext";
import { discoverMoviesByGenre, getMovieGenres } from "../services/tmdb/genreService";

vi.mock("../services/tmdb/genreService", () => ({
  getMovieGenres: vi.fn(async () => [{ id: 28, name: "Action" }]),
  getTvGenres: vi.fn(),
  discoverMoviesByGenre: vi.fn(async () => ({ results: [{ id: 1, title: "Movie" }], total_pages: 2 })),
  discoverTvShowsByGenre: vi.fn(),
}));

test("genre pagination updates results without reloading the unchanged genre name", async () => {
  render(<MemoryRouter initialEntries={["/genres/movies/28"]}><LibraryProvider><App /></LibraryProvider></MemoryRouter>);
  await screen.findByRole("link", { name: "View details for Movie" });
  expect(getMovieGenres).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole("button", { name: "Next page" }));
  await waitFor(() => expect(discoverMoviesByGenre).toHaveBeenCalledWith("28", 2, expect.any(AbortSignal)));
  await screen.findByText("Page 2 of 2");
  expect(getMovieGenres).toHaveBeenCalledTimes(1);
  expect(screen.getByText("Action", { exact: true })).toBeInTheDocument();
});

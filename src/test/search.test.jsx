import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import App from "../App";
import LibraryProvider from "../features/library/context/LibraryContext";
import SearchResultsPage from "../features/search/pages/SearchResultsPage";
import SearchForm from "../features/search/components/SearchForm";
import { searchMedia } from "../services/tmdb/searchService";

vi.mock("../services/tmdb/searchService", () => ({ searchMedia: vi.fn() }));

const movie = { id: 603, media_type: "movie", title: "The Matrix" };

function Location() {
  const location = useLocation();
  return <output aria-label="Current URL">{location.pathname}{location.search}</output>;
}

function renderResults(url) {
  return render(<MemoryRouter initialEntries={[url]}><LibraryProvider>
    <SearchResultsPage onTryAgain={vi.fn()} /><Location />
  </LibraryProvider></MemoryRouter>);
}

beforeEach(() => {
  searchMedia.mockReset();
  searchMedia.mockResolvedValue({ results: [], total_pages: 0 });
});

test("empty results reopen header search, focus input, close with Escape, and exclude mobile menu", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/search?q=missing"]}><LibraryProvider><App /></LibraryProvider></MemoryRouter>);
  const retry = await screen.findByRole("button", { name: "Try another search" });
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  await user.click(retry);
  expect(screen.getByRole("combobox")).toHaveFocus();
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search movies and TV shows" })).toHaveFocus();
  retry.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("combobox")).toHaveFocus();
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});

test.each(["", "0", "-2", "1.2", "abc", "501"])("invalid page %s falls back to page one and trims the query", async (page) => {
  renderResults(`/search?q=%20Matrix%20&page=${page}`);
  await screen.findByRole("button", { name: "Try another search" });
  expect(searchMedia).toHaveBeenCalledWith("Matrix", 1, expect.any(AbortSignal));
});

test("pagination retains and encodes the search query", async () => {
  searchMedia.mockResolvedValue({ results: [movie], total_pages: 900 });
  renderResults("/search?q=Matrix%20%26%20Neo&page=2");
  await screen.findByText("The Matrix");
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await waitFor(() => expect(searchMedia).toHaveBeenCalledWith("Matrix & Neo", 3, expect.any(AbortSignal)));
  expect(screen.getByLabelText("Current URL")).toHaveTextContent("q=Matrix+%26+Neo&page=3");
  expect(screen.getByText("Page 3 of 500")).toBeInTheDocument();
});

test("loading, failure, and a missing query have distinct states", async () => {
  let rejectSearch;
  searchMedia.mockReturnValue(new Promise((resolve, reject) => { rejectSearch = reject; }));
  const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
  renderResults("/search?q=Matrix");
  expect(screen.getByRole("status", { name: "" })).toHaveTextContent("Searching movies");
  rejectSearch(new Error("Offline"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Unable to search");
  expect(screen.queryByRole("button", { name: "Try another search" })).not.toBeInTheDocument();
  expect(errorLog).toHaveBeenCalled();
});

test("empty query does not request results", () => {
  renderResults("/search?q=%20");
  expect(searchMedia).not.toHaveBeenCalled();
  expect(screen.getByText(/Enter a movie or TV show title/)).toBeInTheDocument();
});

test("suggestions debounce, wrap keyboard selection, and navigate on Enter", async () => {
  searchMedia.mockResolvedValue({ results: [movie, { id: 604, title: "Reloaded", media_type: "movie" }], total_pages: 1 });
  const user = userEvent.setup();
  const complete = vi.fn();
  render(<MemoryRouter><SearchForm isSearchOpen onSearchComplete={complete} /><Location /></MemoryRouter>);
  await user.type(screen.getByRole("combobox"), "Matrix");
  await screen.findByRole("option", { name: "The Matrix, Movie" });
  expect(searchMedia).toHaveBeenCalledTimes(1);
  await user.keyboard("{ArrowUp}");
  expect(screen.getByRole("option", { name: "Reloaded, Movie" })).toHaveAttribute("aria-selected", "true");
  await user.keyboard("{ArrowDown}{Enter}");
  expect(screen.getByLabelText("Current URL")).toHaveTextContent("/movies/603");
  expect(complete).toHaveBeenCalledOnce();
});

test("combobox only references an available listbox while suggestions load or are empty", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><SearchForm isSearchOpen /></MemoryRouter>);
  const input = screen.getByRole("combobox");
  await user.type(input, "missing");
  expect(input).toHaveAttribute("aria-expanded", "false");
  expect(input).not.toHaveAttribute("aria-controls");
  await screen.findByText("No suggestions found.");
  expect(input).not.toHaveAttribute("aria-controls");
});

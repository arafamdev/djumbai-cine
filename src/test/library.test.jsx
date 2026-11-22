import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import LibraryProvider from "../features/library/context/LibraryContext";
import SaveButton from "../features/library/components/SaveButton";
import FavoritesPage from "../features/library/pages/FavoritesPage";
import { normalizeMedia } from "../features/library/utils/normalizeMedia";
import { readLibrary, writeLibrary } from "../features/library/utils/libraryStorage";

const key = "djumbai-cine:library:v1";
const movie = { id: 1, title: " Movie ", vote_average: 8, vote_count: 2 };
const show = { id: 1, name: "Show", first_air_date: "2020-01-01" };

test("normalization supports API and saved TV records and rejects invalid identities", () => {
  const normalized = normalizeMedia(show, "tv");
  expect(normalized).toMatchObject({ title: "Show", mediaType: "tv", release_date: "2020-01-01" });
  expect(normalizeMedia(normalized, "tv")).toEqual(normalized);
  expect(normalizeMedia(movie, "movie").title).toBe("Movie");
  for (const invalid of [null, {}, { id: -1, title: "X" }, { id: 1, title: " " }]) {
    expect(normalizeMedia(invalid, "movie")).toBeNull();
  }
  expect(normalizeMedia(movie, "person")).toBeNull();
});

test("storage recovers from corruption and deduplicates within media types", () => {
  localStorage.setItem(key, "broken JSON");
  expect(readLibrary()).toEqual({ favorites: [], watchlist: [] });
  localStorage.setItem(key, JSON.stringify({ favorites: [null, { ...movie, mediaType: "movie" }, { ...movie, mediaType: "movie" }, { ...show, mediaType: "tv" }], watchlist: {} }));
  expect(readLibrary().favorites).toHaveLength(2);
  expect(readLibrary().watchlist).toEqual([]);
});

test("storage access and quota failures are handled", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Denied"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  expect(readLibrary()).toEqual({ favorites: [], watchlist: [] });
  expect(writeLibrary({ favorites: [], watchlist: [] })).toBe(false);
});

test("favorites and watchlist toggle independently and persist across remounts", async () => {
  const user = userEvent.setup();
  function Collection() {
    return <MemoryRouter><LibraryProvider>
      <SaveButton media={movie} mediaType="movie" listType="favorites" />
      <SaveButton media={show} mediaType="tv" listType="watchlist" />
    </LibraryProvider></MemoryRouter>;
  }
  const view = render(<Collection />);
  await user.click(screen.getByRole("button", { name: "Add to Favorites" }));
  await user.click(screen.getByRole("button", { name: "Add to Watchlist" }));
  expect(readLibrary().favorites).toHaveLength(1);
  expect(readLibrary().watchlist).toHaveLength(1);
  view.unmount();
  render(<Collection />);
  expect(screen.getByRole("button", { name: "Remove from Favorites" })).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "Remove from Favorites" }));
  expect(readLibrary().favorites).toHaveLength(0);
  expect(readLibrary().watchlist).toHaveLength(1);
});

test("failed writes do not change saved state", async () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  render(<LibraryProvider><SaveButton media={movie} mediaType="movie" listType="favorites" /></LibraryProvider>);
  await userEvent.click(screen.getByRole("button", { name: "Add to Favorites" }));
  expect(screen.getByRole("button", { name: "Add to Favorites" })).toHaveAttribute("aria-pressed", "false");
});

test("library filters distinguish movies and TV with the same ID", async () => {
  writeLibrary({ favorites: [{ ...movie, mediaType: "movie" }, { ...show, mediaType: "tv" }], watchlist: [] });
  render(<MemoryRouter><LibraryProvider><FavoritesPage /></LibraryProvider></MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: "TV Shows", exact: true }));
  expect(screen.getByRole("link", { name: "View details for Show" })).toHaveAttribute("href", "/tv/1");
  expect(screen.queryByText("Movie")).not.toBeInTheDocument();
});

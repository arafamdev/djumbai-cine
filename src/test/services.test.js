import { expect, test, vi } from "vitest";
import tmdbClient from "../services/tmdb/tmdbClient";
import { searchMedia } from "../services/tmdb/searchService";
import { getMovieTrailer } from "../services/tmdb/movieService";
import { getTvShowTrailer } from "../services/tmdb/tvService";

test("client uses same-origin proxy, forwards cancellation, and preserves HTTP status", async () => {
  const signal = new AbortController().signal;
  const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });
  vi.stubGlobal("fetch", fetchMock);
  await expect(tmdbClient("/movie/99", { signal })).rejects.toMatchObject({ status: 404 });
  expect(fetchMock).toHaveBeenCalledWith("/api/tmdb/movie/99", { signal });
});

test("search encodes reserved characters, trims whitespace and excludes people", async () => {
  const results = [{ id: 1, media_type: "person" }, { id: 2, media_type: "movie" }, { id: 3, media_type: "tv" }];
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results, total_pages: 3 }) });
  vi.stubGlobal("fetch", fetchMock);
  const data = await searchMedia("  A&B?  ", 2);
  const url = new URL(fetchMock.mock.calls[0][0], "https://example.com");
  expect(url.searchParams.get("query")).toBe("A&B?");
  expect(url.searchParams.get("page")).toBe("2");
  expect(url.searchParams.get("include_adult")).toBe("false");
  expect(data.results.map(item => item.id)).toEqual([2, 3]);
});

test.each([getMovieTrailer, getTvShowTrailer])("trailer selection prioritizes the official main YouTube trailer", async (getTrailer) => {
  const videos = [
    { key: "teaser", site: "YouTube", type: "Teaser" },
    { key: "other", site: "YouTube", type: "Trailer", official: false },
    { key: "official", site: "YouTube", type: "Trailer", official: true, name: "Trailer" },
  ];
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: videos }) }));
  expect(await getTrailer(1)).toMatchObject({ key: "official" });
});

// @vitest-environment node
import { beforeEach, expect, test, vi } from "vitest";
import handler from "../../api/tmdb";

function response() {
  return { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
}

beforeEach(() => vi.stubEnv("TMDB_ACCESS_TOKEN", "test-server-token"));

test("rejects non-GET requests without calling upstream", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const res = response();
  await handler({ method: "POST", url: "/api/tmdb/movie/1" }, res);
  expect(res.status).toHaveBeenCalledWith(405);
  expect(res.setHeader).toHaveBeenCalledWith("Allow", "GET");
  expect(fetchMock).not.toHaveBeenCalled();
});

test.each(["/api/tmdb/account", "/api/tmdb/movie/0", "/api/tmdb/movie/1/reviews", "/api/tmdb/https://evil.test", "/other/movie/1"])("blocks unapproved path %s", async url => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const res = response();
  await handler({ method: "GET", url }, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(fetchMock).not.toHaveBeenCalled();
});

test("forwards only server credentials and preserves query and upstream status", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ status: 429, json: async () => ({ status_message: "Rate limit" }) });
  vi.stubGlobal("fetch", fetchMock);
  const res = response();
  await handler({ method: "GET", url: "/api/tmdb/search/multi?query=A%26B&api_key=untrusted&API_KEY=other" }, res);
  const [url, options] = fetchMock.mock.calls[0];
  expect(url.origin).toBe("https://api.themoviedb.org");
  expect(url.searchParams.get("query")).toBe("A&B");
  expect([...url.searchParams.keys()]).toEqual(["query"]);
  expect(options.headers.Authorization).toBe("Bearer test-server-token");
  expect(options.signal).toBeInstanceOf(AbortSignal);
  expect(res.status).toHaveBeenCalledWith(429);
  expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "private, no-store");
});

test("missing configuration and upstream failures return safe errors", async () => {
  vi.stubEnv("TMDB_ACCESS_TOKEN", "");
  const res = response();
  await handler({ method: "GET", url: "/api/tmdb/movie/1" }, res);
  expect(res.status).toHaveBeenCalledWith(500);
  vi.stubEnv("TMDB_ACCESS_TOKEN", "test-server-token");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("secret upstream details")));
  await handler({ method: "GET", url: "/api/tmdb/movie/1" }, res);
  expect(res.status).toHaveBeenLastCalledWith(502);
  expect(res.json).toHaveBeenLastCalledWith({ error: "Unable to retrieve TMDB data" });
});

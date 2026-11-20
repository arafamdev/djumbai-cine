import tmdbClient from "./tmdbClient";

async function searchMedia(query, page = 1, signal) {
  const params = new URLSearchParams({
    query: query.trim(),
    page: String(page),
    language: "en-US",
    include_adult: "false",
  });

  const data = await tmdbClient(`/search/multi?${params.toString()}`, {
    signal,
  });

  return {
    ...data,
    results: data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv",
    ),
  };
}

export { searchMedia };

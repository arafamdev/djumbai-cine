import tmdbClient from "./tmdbClient";

const DEFAULT_PAGE = 1;
const DEFAULT_LANGUAGE = "en-US";

async function getPopularTvShows(page = DEFAULT_PAGE, signal) {
  const endpoint = `/tv/popular?language=${DEFAULT_LANGUAGE}&page=${page}`;

  return tmdbClient(endpoint, { signal });
}

async function getTvShowDetails(tvShowId) {
  const endpoint = `/tv/${tvShowId}?language=${DEFAULT_LANGUAGE}`;

  return tmdbClient(endpoint);
}

async function getTvShowVideos(tvShowId) {
  const endpoint = `/tv/${tvShowId}/videos?language=${DEFAULT_LANGUAGE}`;

  const data = await tmdbClient(endpoint);

  return data.results;
}

async function getTvShowTrailer(tvShowId) {
  const videos = await getTvShowVideos(tvShowId);

  const youtubeVideos = videos.filter(
    (video) => video.site === "YouTube" && Boolean(video.key),
  );

  const officialTrailer = youtubeVideos.find(
    (video) =>
      video.type === "Trailer" &&
      video.official === true &&
      video.name.toLowerCase() === "trailer",
  );

  const fallbackTrailer = youtubeVideos.find(
    (video) => video.type === "Trailer" && video.official === true,
  );

  const anyTrailer = youtubeVideos.find((video) => video.type === "Trailer");

  return officialTrailer ?? fallbackTrailer ?? anyTrailer ?? null;
}

async function getSimilarTvShows(tvShowId) {
  const endpoint = `/tv/${tvShowId}/similar?language=${DEFAULT_LANGUAGE}&page=1`;

  const data = await tmdbClient(endpoint);

  return data.results;
}

async function getTvShowCredits(tvShowId) {
  const endpoint = `/tv/${tvShowId}/credits?language=${DEFAULT_LANGUAGE}`;

  const data = await tmdbClient(endpoint);

  return data.cast;
}

export {
  getPopularTvShows,
  getTvShowDetails,
  getTvShowVideos,
  getTvShowTrailer,
  getSimilarTvShows,
  getTvShowCredits
};

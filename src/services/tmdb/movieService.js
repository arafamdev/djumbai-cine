import tmdbClient from "./tmdbClient";

async function getMovieVideos(movieId) {
  const data = await tmdbClient(`/movie/${movieId}/videos?language=en-US`);

  return data.results;
}

async function getMovieTrailer(movieId) {
  const videos = await getMovieVideos(movieId);

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

  // Prefer the official main trailer, then other trailers.
  return officialTrailer ?? fallbackTrailer ?? anyTrailer ?? null;
}

async function getTrendingMovies() {
  const data = await tmdbClient("/trending/movie/week?language=en-US");

  return data.results;
}

async function getMovieDetails(movieId) {
  const data = await tmdbClient(`/movie/${movieId}?language=en-US`);

  return data;
}

async function getSimilarMovies(movieId) {
  const data = await tmdbClient(
    `/movie/${movieId}/similar?language=en-US&page=1`,
  );

  return data.results;
}

export {
  getMovieVideos,
  getMovieTrailer,
  getTrendingMovies,
  getMovieDetails,
  getSimilarMovies,
};

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

  // Prefer the official main trailer, then fall back to other trailers.
  return officialTrailer ?? fallbackTrailer ?? anyTrailer ?? null;
}

export { getMovieVideos, getMovieTrailer };

import tmdbClient from "./tmdbClient";

const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_PAGE = 1;

async function getMovieGenres(signal) {
  const endpoint = `/genre/movie/list?language=${DEFAULT_LANGUAGE}`;

  const data = await tmdbClient(endpoint, { signal });

  return data.genres;
}

async function getTvGenres(signal) {
  const endpoint = `/genre/tv/list?language=${DEFAULT_LANGUAGE}`;

  const data = await tmdbClient(endpoint, { signal });

  return data.genres;
}

async function discoverMoviesByGenre(genreId, page = DEFAULT_PAGE, signal) {
  const endpoint = `/discover/movie?language=${DEFAULT_LANGUAGE}&with_genres=${genreId}&page=${page}`;

  return tmdbClient(endpoint, { signal });
}

async function discoverTvShowsByGenre(genreId, page = DEFAULT_PAGE, signal) {
  const endpoint = `/discover/tv?language=${DEFAULT_LANGUAGE}&with_genres=${genreId}&page=${page}`;

  return tmdbClient(endpoint, { signal });
}

export {
  getMovieGenres,
  getTvGenres,
  discoverMoviesByGenre,
  discoverTvShowsByGenre,
};

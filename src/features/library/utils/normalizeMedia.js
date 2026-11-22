const MEDIA_TYPE = {
  movie: "movie",
  tv: "tv",
};

export function normalizeMedia(media, mediaType) {
  if (!media || !Object.values(MEDIA_TYPE).includes(mediaType)) {
    return null;
  }

  if (!Number.isSafeInteger(media.id) || media.id <= 0) {
    return null;
  }

  const isTvShow = mediaType === MEDIA_TYPE.tv;

  const title = isTvShow ? (media.name ?? media.title) : media.title;

  if (typeof title !== "string" || !title.trim()) {
    return null;
  }

  const releaseDate = isTvShow
    ? (media.first_air_date ?? media.release_date)
    : media.release_date;

  return {
    id: media.id,
    mediaType,
    title: title.trim(),
    poster_path: typeof media.poster_path === "string" ? media.poster_path : null,
    release_date: typeof releaseDate === "string" ? releaseDate : null,
    vote_average: Number.isFinite(media.vote_average)
      ? media.vote_average
      : null,
    vote_count:
      Number.isSafeInteger(media.vote_count) && media.vote_count >= 0
        ? media.vote_count
        : 0,
  };
}

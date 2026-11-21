import MediaCard from "./MediaCard";

function MediaGrid({ movies, mediaType = "movie" }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((media) => (
        <MediaCard
          key={`${media.mediaType ?? mediaType}:${media.id}`}
          media={media}
          mediaType={media.mediaType ?? mediaType}
        />
      ))}
    </div>
  );
}

export default MediaGrid;

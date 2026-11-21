import { Link } from "react-router-dom";

function GenreNavigation({ genres, mediaType, selectedGenreId }) {
  const mediaPath = mediaType === "tv" ? "tv" : "movies";

  return (
    <nav aria-label={`${mediaType === "tv" ? "TV show" : "Movie"} genres`}>
      <ul className="flex flex-wrap gap-3">
        {genres.map((genre) => {
          const isSelected = String(genre.id) === String(selectedGenreId);

          const genrePath = `/genres/${mediaPath}/${genre.id}`;

          return (
            <li key={genre.id}>
              <Link
                to={genrePath}
                aria-current={isSelected ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-foreground hover:bg-elevated"
                }`}
              >
                {genre.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default GenreNavigation;

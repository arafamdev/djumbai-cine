import CastPlaceholder from "./CastPlaceholder";

function CastCard({ castMember }) {
  const actorName = castMember.name;
  const characterName = castMember.character;

  const actorPhotoUrl = castMember.profile_path
    ? `https://image.tmdb.org/t/p/w185${castMember.profile_path}`
    : null;

  return (
    <article className="group flex min-w-0 flex-col items-center text-center">
      {/* Actor avatar */}
      <div className="aspect-square w-full max-w-36 overflow-hidden rounded-full border-2 border-border bg-elevated transition-colors duration-300 group-hover:border-primary">
        {actorPhotoUrl ? (
          <img
            src={actorPhotoUrl}
            alt={actorName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CastPlaceholder className="h-full w-full border-0" />
        )}
      </div>

      {/* Actor information */}
      <div className="mt-4 w-full space-y-1">
        <h3 className="text-sm font-semibold leading-5 text-foreground">
          {actorName}
        </h3>

        {characterName && (
          <p className="text-xs leading-5 text-muted">{characterName}</p>
        )}
      </div>
    </article>
  );
}

export default CastCard;

function CastPlaceholder({ className = "" }) {
  return (
    <div
      role="img"
      aria-label="Actor photo unavailable"
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-full border border-border bg-linear-to-br from-elevated via-surface to-background ${className}`}
    >
      {/* Avatar silhouette */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="h-3/4 w-3/4 text-muted/50"
      >
        <circle cx="50" cy="35" r="17" fill="currentColor" />

        <path
          d="M18 90C18 71 32 60 50 60C68 60 82 71 82 90"
          fill="currentColor"
        />
      </svg>

      {/* Brand accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-1/4 bottom-0 h-0.5 rounded-full bg-primary/60"
      />
    </div>
  );
}

export default CastPlaceholder;

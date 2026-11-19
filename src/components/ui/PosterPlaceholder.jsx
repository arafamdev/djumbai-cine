import { Film } from "lucide-react";

function PosterPlaceholder({ className = "" }) {
  return (
    <div
      role="img"
      aria-label="No movie poster available"
      className={`flex aspect-2/3 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border bg-linear-to-br from-elevated via-surface to-background p-4 text-center ${className}`}
    >
      <Film
        size={36}
        strokeWidth={1.5}
        className="text-primary"
        aria-hidden="true"
      />

      <span className="text-xs font-medium text-muted">
        No poster available
      </span>

      <span className="text-[10px] font-semibold tracking-widest text-muted/60 uppercase">
        Djumbai Cine
      </span>
    </div>
  );
}

export default PosterPlaceholder;

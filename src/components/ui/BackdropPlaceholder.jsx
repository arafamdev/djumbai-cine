import { Clapperboard } from "lucide-react";

function BackdropPlaceholder() {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-linear-to-br from-elevated via-surface to-background">
      <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <Clapperboard
          size={56}
          strokeWidth={1}
          className="text-primary/50"
          aria-hidden="true"
        />

        <p className="text-xs font-medium tracking-[0.3em] text-muted/60 uppercase">
          Djumbai Cine
        </p>

        <p className="text-sm text-muted">No backdrop available</p>
      </div>
    </div>
  );
}

export default BackdropPlaceholder;

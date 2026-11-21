import { Bookmark, Heart } from "lucide-react";
import { toast } from "react-toastify";

import { useLibrary } from "../hooks/useLibrary";

const BUTTON_CONFIG = {
  favorites: {
    Icon: Heart,
    addLabel: "Add to Favorites",
    removeLabel: "Remove from Favorites",
  },
  watchlist: {
    Icon: Bookmark,
    addLabel: "Add to Watchlist",
    removeLabel: "Remove from Watchlist",
  },
};

const BASE_CLASSES =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function SaveButton({ media, mediaType, listType, compact = false }) {
  const { isSaved, toggleSaved } = useLibrary();

  const config = BUTTON_CONFIG[listType];

  if (!config || !media) {
    return null;
  }

  const { Icon, addLabel, removeLabel } = config;

  const saved = isSaved(listType, media.id, mediaType);
  const label = saved ? removeLabel : addLabel;

  function handleToggle() {
    const wasSaved = saved;

    const success = toggleSaved(listType, {
      ...media,
      mediaType,
    });

    if (!success) {
      toast.error("Unable to update your library. Please try again.");
      return;
    }

    const listName = listType === "favorites" ? "Favorites" : "Watchlist";

    if (wasSaved) {
      toast.info(`Removed from ${listName}`);
    } else {
      toast.success(`Added to ${listName}`);
    }
  }

  const sizeClasses = compact ? "w-11 p-2" : "gap-2 px-4 py-2";

  const stateClasses = saved
    ? "border-primary bg-primary text-white hover:bg-primary-hover"
    : compact
      ? "border-white/20 bg-black/70 text-white hover:border-primary hover:bg-black/90"
      : "border-border bg-elevated text-foreground hover:border-primary";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={label}
      title={compact ? label : undefined}
      className={`${BASE_CLASSES} ${sizeClasses} ${stateClasses}`}
    >
      <Icon
        size={18}
        fill={saved ? "currentColor" : "none"}
        aria-hidden="true"
      />

      {!compact && <span>{label}</span>}
    </button>
  );
}

export default SaveButton;

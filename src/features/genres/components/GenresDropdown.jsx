import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Clapperboard } from "lucide-react";

import Spinner from "../../../components/ui/Spinner";
import ErrorState from "../../../components/ui/ErrorState";

import {
  getMovieGenres,
  getTvGenres,
} from "../../../services/tmdb/genreService";

function GenresDropdown({ mobile = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaType, setMediaType] = useState("movie");
  const [genreState, setGenreState] = useState({
    mediaType: null,
    genres: [],
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();
  const location = useLocation();

  const isActive =
    location.pathname === "/genres" || location.pathname.startsWith("/genres/");

  const hasCurrentData = genreState.mediaType === mediaType;
  const genres = hasCurrentData ? genreState.genres : [];
  const error = hasCurrentData ? genreState.error : null;
  const isLoading = isOpen && !hasCurrentData;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;

    async function loadGenres() {
      try {
        const getGenres = mediaType === "movie" ? getMovieGenres : getTvGenres;

        const response = await getGenres(controller.signal);

        if (!isCurrentRequest) {
          return;
        }

        const receivedGenres = Array.isArray(response)
          ? response
          : response?.genres;

        if (!Array.isArray(receivedGenres)) {
          throw new Error("Invalid genres response.");
        }

        setGenreState({
          mediaType,
          genres: receivedGenres,
          error: null,
        });
      } catch (fetchError) {
        if (!isCurrentRequest || controller.signal.aborted) {
          return;
        }

        setGenreState({
          mediaType,
          genres: [],
          error: fetchError,
        });
      }
    }

    loadGenres();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [isOpen, mediaType, retryCount]);

  function handleToggle() {
    if (!isOpen) {
      setGenreState({
        mediaType: null,
        genres: [],
        error: null,
      });
    }

    setIsOpen((previousValue) => !previousValue);
  }

  function handleMediaTypeChange(nextMediaType) {
    if (nextMediaType === mediaType) {
      return;
    }

    setMediaType(nextMediaType);
  }

  function handleRetry() {
    setGenreState({
      mediaType: null,
      genres: [],
      error: null,
    });

    setRetryCount((previousCount) => previousCount + 1);
  }

  function handleNavigate() {
    setIsOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={handleToggle}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isActive ? "font-semibold text-foreground" : "font-medium text-muted"
        } ${mobile ? "hover:bg-elevated" : ""}`}
      >
        <span>Genres</span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className={
            mobile
              ? "mt-2 rounded-xl border border-border bg-surface p-4"
              : "absolute left-1/2 top-full z-50 mt-3 w-80 -translate-x-1/2 rounded-xl border border-border bg-surface p-4 shadow-xl"
          }
        >
          <p className="mb-4 text-sm font-semibold text-foreground">
            Explore by genre
          </p>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={mediaType === "movie"}
              onClick={() => handleMediaTypeChange("movie")}
              className={`min-h-10 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mediaType === "movie"
                  ? "bg-primary text-white"
                  : "bg-elevated text-muted hover:text-foreground"
              }`}
            >
              Movies
            </button>

            <button
              type="button"
              aria-pressed={mediaType === "tv"}
              onClick={() => handleMediaTypeChange("tv")}
              className={`min-h-10 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mediaType === "tv"
                  ? "bg-primary text-white"
                  : "bg-elevated text-muted hover:text-foreground"
              }`}
            >
              TV Shows
            </button>
          </div>

          {isLoading && (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner label="Loading genres..." size="sm" />
            </div>
          )}

          {!isLoading && error && (
            <ErrorState
              compact
              title="Unable to load genres"
              message="Please try again to explore genres."
              onRetry={handleRetry}
            />
          )}

          {!isLoading && !error && genres.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-3 text-center">
              <Clapperboard
                size={28}
                aria-hidden="true"
                className="text-muted"
              />

              <p className="text-sm font-medium text-foreground">
                No genres available
              </p>

              <p className="text-xs text-muted">
                There are no genres to explore right now.
              </p>
            </div>
          )}

          {!isLoading && !error && genres.length > 0 && (
            <div
              className="
                grid max-h-72 grid-cols-2 gap-2
                overflow-y-auto overscroll-contain pr-2
                scrollbar-thin
                [scrollbar-color:#3f3f46_transparent]
                hover:[scrollbar-color:#71717a_transparent]
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-zinc-700
                [&:hover::-webkit-scrollbar-thumb]:bg-zinc-500
              "
            >
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={
                    mediaType === "movie"
                      ? `/genres/movies/${genre.id}`
                      : `/genres/tv/${genre.id}`
                  }
                  onClick={handleNavigate}
                  className="flex min-h-10 items-center justify-center rounded-lg bg-elevated px-3 py-2 text-center text-sm text-foreground transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/genres"
            onClick={handleNavigate}
            className="mt-4 flex min-h-11 items-center justify-center gap-2 border-t border-border pt-3 text-sm font-medium text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>View all genres</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default GenresDropdown;

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import MediaCard from "./MediaCard";

function MediaCarousel({ movies, title, titleId, mediaType = "movie" }) {
  const carouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const { scrollLeft, scrollWidth, clientWidth } = carousel;

    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const observer = new ResizeObserver(updateScrollButtons);

    observer.observe(carousel);
    updateScrollButtons();

    return () => observer.disconnect();
  }, [movies]);

  function scrollMovies(direction) {
    const carousel = carouselRef.current;

    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto w-full max-w-7xl px-6 py-12"
    >
      {/* Section header and navigation */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-2xl font-bold text-foreground">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollMovies(-1)}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${title} left`}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollMovies(1)}
            disabled={!canScrollRight}
            aria-label={`Scroll ${title} right`}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal media carousel */}
      <div
        ref={carouselRef}
        onScroll={updateScrollButtons}
        tabIndex={0}
        role="region"
        aria-label={`${title} carousel`}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth motion-reduce:scroll-auto pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[calc((100%-1rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
          >
            <MediaCard media={movie} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MediaCarousel;

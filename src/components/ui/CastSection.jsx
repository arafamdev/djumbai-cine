import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CastCard from "./CastCard";

const SCROLL_DISTANCE_RATIO = 0.8;
const SCROLL_POSITION_TOLERANCE = 1;

function CastSection({ castMembers }) {
  const castCarouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasCastMembers = castMembers?.length > 0;

  function updateScrollButtons() {
    const castCarouselElement = castCarouselRef.current;

    if (!castCarouselElement) return;

    const { scrollLeft, scrollWidth, clientWidth } = castCarouselElement;

    // Account for fractional pixels at the scroll boundaries.
    const hasContentOnLeft = scrollLeft > SCROLL_POSITION_TOLERANCE;

    const hasContentOnRight =
      scrollLeft + clientWidth < scrollWidth - SCROLL_POSITION_TOLERANCE;

    setCanScrollLeft(hasContentOnLeft);
    setCanScrollRight(hasContentOnRight);
  }

  useEffect(() => {
    const castCarouselElement = castCarouselRef.current;

    if (!castCarouselElement) return;

    // Keep navigation buttons accurate when the carousel resizes.
    const resizeObserver = new ResizeObserver(updateScrollButtons);

    resizeObserver.observe(castCarouselElement);
    updateScrollButtons();

    return () => {
      resizeObserver.disconnect();
    };
  }, [castMembers]);

  function handleCastScroll(direction) {
    const castCarouselElement = castCarouselRef.current;

    if (!castCarouselElement) return;

    // Move by 80% of the visible width to keep some cards in view.
    const scrollDistance =
      castCarouselElement.clientWidth * SCROLL_DISTANCE_RATIO;

    castCarouselElement.scrollBy({
      left: direction * scrollDistance,
      behavior: "smooth",
    });
  }

  if (!hasCastMembers) return null;

  return (
    <section
      aria-labelledby="top-cast-title"
      className="mx-auto w-full max-w-7xl px-6 py-12"
    >
      {/* Section header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2
            id="top-cast-title"
            className="text-2xl font-bold text-foreground"
          >
            Top Cast
          </h2>

          <p className="mt-2 text-sm text-muted">
            Meet the people behind the characters.
          </p>
        </div>

        {/* Carousel navigation */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => handleCastScroll(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll cast left"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleCastScroll(1)}
            disabled={!canScrollRight}
            aria-label="Scroll cast right"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal cast carousel */}
      <div
        ref={castCarouselRef}
        onScroll={updateScrollButtons}
        tabIndex={0}
        role="region"
        aria-label="Top cast carousel"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 focus-visible:outline-2 focus-visible:outline-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {castMembers.map((castMember) => (
          <div
            key={`${castMember.id}-${castMember.cast_id ?? castMember.order}`}
            className="w-[calc((100%-2.5rem)/3)] shrink-0 snap-start sm:w-[calc((100%-5rem)/5)] lg:w-[calc((100%-7.5rem)/7)]"
          >
            <CastCard castMember={castMember} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CastSection;

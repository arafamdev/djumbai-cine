import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import LibraryProvider from "../features/library/context/LibraryContext";
import MediaCarousel from "../components/ui/MediaCarousel";
import CastSection from "../components/ui/CastSection";

for (const reducedMotion of [false, true]) {
  test.each(["media", "cast"])(`%s scrolling respects reduced motion: ${reducedMotion}`, (kind) => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: reducedMotion })));
    render(<MemoryRouter><LibraryProvider>{kind === "media"
      ? <MediaCarousel movies={[{ id: 1, title: "Movie" }]} title="Movies" titleId="movies" />
      : <CastSection castMembers={[{ id: 1, name: "Actor" }]} />
    }</LibraryProvider></MemoryRouter>);
    const carousel = screen.getByRole("region");
    Object.defineProperties(carousel, {
      clientWidth: { value: 500 },
      scrollWidth: { value: 1000 },
    });
    carousel.scrollBy = vi.fn();
    fireEvent.scroll(carousel);
    fireEvent.click(screen.getByRole("button", { name: /Scroll .* right/ }));
    expect(carousel.scrollBy).toHaveBeenCalledWith({ left: 400, behavior: reducedMotion ? "instant" : "smooth" });
  });
}

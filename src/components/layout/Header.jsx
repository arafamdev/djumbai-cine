import { useEffect, useId, useRef } from "react";
import { Menu, Search, X } from "lucide-react";

import SearchForm from "../../features/search/components/SearchForm";
import IconButton from "../ui/IconButton";
import Logo from "../ui/Logo";
import Navbar from "./Navbar";

function Header({ activePanel, onPanelChange }) {
  const isMobileMenuOpen = activePanel === "menu";
  const isSearchOpen = activePanel === "search";

  const mobileMenuId = useId();
  const searchPanelId = useId();

  const mobileMenuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchContentRef = useRef(null);

  function toggleMobileMenu() {
    onPanelChange((previousPanel) =>
      previousPanel === "menu" ? null : "menu",
    );
  }

  function closeMobileMenu() {
    onPanelChange(null);
  }

  function toggleSearch() {
    onPanelChange((previousPanel) =>
      previousPanel === "search" ? null : "search",
    );
  }

  function closeSearch() {
    onPanelChange(null);
  }

  useEffect(() => {
    if (!isMobileMenuOpen && !isSearchOpen) return;

    // Close active panels with Escape and restore keyboard focus.
    function handleEscapeKey(event) {
      if (event.key !== "Escape") return;

      if (isSearchOpen) {
        onPanelChange(null);
        searchButtonRef.current?.focus();
      }

      if (isMobileMenuOpen) {
        onPanelChange(null);
        mobileMenuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen, isSearchOpen, onPanelChange]);

  useEffect(() => {
    // Match the Tailwind lg breakpoint used by Navbar.
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");

    // Close the mobile menu when switching to desktop.
    function handleDesktopBreakpointChange(event) {
      if (event.matches) {
        onPanelChange((previousPanel) =>
          previousPanel === "menu" ? null : previousPanel,
        );
      }
    }

    desktopMediaQuery.addEventListener("change", handleDesktopBreakpointChange);

    return () => {
      desktopMediaQuery.removeEventListener(
        "change",
        handleDesktopBreakpointChange,
      );
    };
  }, [onPanelChange]);

  useEffect(() => {
    if (!isSearchOpen) return;

    // Close search only when clicking outside its content and trigger.
    function handlePointerDownOutsideSearch(event) {
      const clickedElement = event.target;

      const isClickInsideSearchContent =
        searchContentRef.current?.contains(clickedElement);

      const isClickOnSearchButton =
        searchButtonRef.current?.contains(clickedElement);

      if (isClickInsideSearchContent || isClickOnSearchButton) {
        return;
      }

      onPanelChange(null);
    }

    document.addEventListener("pointerdown", handlePointerDownOutsideSearch);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutsideSearch,
      );
    };
  }, [isSearchOpen, onPanelChange]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-xl">
      {/* Header navigation */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <Navbar />
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-1">
          <IconButton
            ref={searchButtonRef}
            icon={isSearchOpen ? X : Search}
            label={isSearchOpen ? "Close search" : "Search movies and TV shows"}
            onClick={toggleSearch}
            aria-expanded={isSearchOpen}
            aria-controls={searchPanelId}
          />

          <div className="lg:hidden">
            <IconButton
              ref={mobileMenuButtonRef}
              icon={isMobileMenuOpen ? X : Menu}
              label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
            />
          </div>
        </div>
      </div>

      {/* Search panel */}
      <div
        id={searchPanelId}
        inert={!isSearchOpen}
        className={`pointer-events-none absolute inset-x-0 top-full transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
          isSearchOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div
          ref={searchContentRef}
          className="pointer-events-auto mx-auto max-w-7xl px-6 py-5"
        >
          {isSearchOpen && (
            <SearchForm
              isSearchOpen={isSearchOpen}
              onSearchComplete={closeSearch}
            />
          )}
        </div>
      </div>

      {/* Mobile and tablet navigation panel */}
      <div
        id={mobileMenuId}
        inert={!isMobileMenuOpen}
        className={`absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-b border-border bg-background/85 backdrop-blur-xl shadow-xl transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:hidden ${
          isMobileMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 py-4">
          <Navbar mobile onNavigate={closeMobileMenu} />
        </div>
      </div>
    </header>
  );
}

export default Header;

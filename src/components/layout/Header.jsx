import { useEffect, useId, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";

import IconButton from "../ui/IconButton";
import Logo from "../ui/Logo";
import Navbar from "./Navbar";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const mobileMenuButtonRef = useRef(null);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((previousState) => !previousState);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        closeMobileMenu();
        mobileMenuButtonRef.current?.focus();
      }
    }

    // Listen for Escape only while the mobile menu is open.
    window.addEventListener("keydown", handleEscapeKey);

    // Remove the listener when the menu closes or unmounts.
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Detect when the viewport reaches the desktop breakpoint.
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");

    function handleDesktopBreakpointChange(event) {
      // Close the mobile menu when switching to desktop.
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    }

    desktopMediaQuery.addEventListener("change", handleDesktopBreakpointChange);

    return () => {
      desktopMediaQuery.removeEventListener(
        "change",
        handleDesktopBreakpointChange,
      );
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <Navbar />
        </div>

        <div className="flex items-center gap-1">
          <IconButton icon={Search} label="Search movies" />

          <div className="md:hidden">
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

      <div
        id={mobileMenuId}
        inert={!isMobileMenuOpen}
        className={`absolute inset-x-0 top-full overflow-hidden bg-surface/95 shadow-xl transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden ${
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

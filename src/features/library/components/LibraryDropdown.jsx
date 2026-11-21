import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bookmark, ChevronDown, Heart } from "lucide-react";

const LIBRARY_LINKS = [
  { label: "Favorites", href: "/favorites", Icon: Heart },
  { label: "Watchlist", href: "/watchlist", Icon: Bookmark },
];

function LibraryDropdown({ mobile = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();
  const location = useLocation();

  const isActive = LIBRARY_LINKS.some(
    (link) => link.href === location.pathname,
  );

  useEffect(() => {
    if (!isOpen) return;

    // Close on outside interaction or Escape, restoring keyboard focus.
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
        onClick={() => setIsOpen((current) => !current)}
        className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isActive ? "font-semibold text-foreground" : "font-medium text-muted"
        } ${mobile ? "hover:bg-elevated" : ""}`}
      >
        <span>My Library</span>

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
              ? "mt-2 rounded-xl border border-border bg-surface p-2"
              : "absolute right-0 top-full z-50 mt-3 w-52 rounded-xl border border-border bg-surface p-2 shadow-xl"
          }
        >
          {LIBRARY_LINKS.map(({ label, href, Icon }) => (
            <NavLink
              key={href}
              to={href}
              onClick={handleNavigate}
              className={({ isActive: linkActive }) =>
                `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  linkActive
                    ? "font-semibold text-primary"
                    : "font-medium text-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryDropdown;

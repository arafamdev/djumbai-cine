import { NavLink } from "react-router-dom";

import GenresDropdown from "../../features/genres/components/GenresDropdown";
import LibraryDropdown from "../../features/library/components/LibraryDropdown";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv" },
];

function Navbar({ mobile = false, onNavigate }) {
  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? "lg:hidden" : "hidden lg:block"}
    >
      <ul
        className={mobile ? "flex flex-col gap-2" : "flex items-center gap-5"}
      >
        {navigationLinks.map((navigationLink) => (
          <li key={navigationLink.href}>
            <NavLink
              to={navigationLink.href}
              end={navigationLink.href === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  isActive
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted"
                } ${mobile ? "hover:bg-elevated" : ""}`
              }
            >
              {navigationLink.label}
            </NavLink>
          </li>
        ))}

        <li>
          <GenresDropdown mobile={mobile} onNavigate={onNavigate} />
        </li>

        <li>
          <LibraryDropdown mobile={mobile} onNavigate={onNavigate} />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

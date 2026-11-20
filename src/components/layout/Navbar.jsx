import { NavLink } from "react-router-dom";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
];

function Navbar({ mobile = false, onNavigate }) {
  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? "md:hidden" : "hidden md:block"}
    >
      <ul
        className={mobile ? "flex flex-col gap-2" : "flex items-center gap-7"}
      >
        {navigationLinks.map((eachNavigationLink) => (
          <li key={eachNavigationLink.href}>
            <NavLink
              to={eachNavigationLink.href}
              end={eachNavigationLink.href === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  isActive
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted"
                } ${mobile ? "hover:bg-elevated" : ""}`
              }
            >
              {eachNavigationLink.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;

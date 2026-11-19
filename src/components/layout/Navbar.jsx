const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "#explore" },
  { label: "Genres", href: "#genres" },
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
            <a
              href={eachNavigationLink.href}
              onClick={onNavigate}
              aria-current={eachNavigationLink.href === "/" ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground ${
                eachNavigationLink.href === "/"
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted"
              } ${mobile ? "hover:bg-elevated" : ""}`}
            >
              {eachNavigationLink.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;

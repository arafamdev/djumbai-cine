import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Explore Movies", to: "/movies" },
  { label: "Explore TV Shows", to: "/tv" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/arafamdev",
    Icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arafam-mussa-silla-5a7866446/",
    Icon: FaLinkedinIn,
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="inline-flex text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              Djumbai<span className="text-primary">Cine</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
              Discover movies, explore new stories, and find your next favorite
              watch.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-semibold text-foreground">Explore</h2>

            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-foreground">About</h2>

            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
              Djumbai Cine is a movie and TV discovery project powered by data
              from The Movie Database (TMDB).
            </p>

            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary transition-opacity hover:opacity-80"
            >
              Visit TMDB
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs text-muted">
              © {currentYear} Djumbai Cine. All rights reserved.
            </p>

            <p className="text-xs text-muted">
              Designed &amp; developed by{" "}
              <a
                href="https://github.com/arafamdev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground transition-colors hover:text-primary"
              >
                Arafam Mussa Silla
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Arafam Mussa Silla on ${label}`}
                className="inline-flex items-center justify-center rounded-md p-1 text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/10 pt-6">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit The Movie Database"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <img
              src="/assets/brands/tmdb.png"
              alt="TMDB — The Movie Database"
              className="h-7 w-auto object-contain"
              loading="lazy"
            />
          </a>

          <p className="max-w-xl text-xs leading-6 text-muted">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

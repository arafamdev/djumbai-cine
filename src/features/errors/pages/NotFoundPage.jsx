import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center text-foreground">
      <p className="text-sm font-semibold tracking-widest text-primary">
        ERROR 404
      </p>

      <h1 className="mt-4 text-4xl font-bold md:text-6xl">Page not found</h1>

      <p className="mt-4 max-w-md leading-7 text-muted">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFoundPage;

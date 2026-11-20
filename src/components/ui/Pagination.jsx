import { ChevronLeft, ChevronRight } from "lucide-react";

const MIN_PAGE = 1;
const MOBILE_VISIBLE_PAGE_COUNT = 3;
const DESKTOP_VISIBLE_PAGE_COUNT = 5;

const paginationButtonClass =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40";

function getVisiblePages(currentPage, totalPages, visiblePageCount) {
  const halfVisiblePages = Math.floor(visiblePageCount / 2);

  const firstVisiblePage = Math.max(
    MIN_PAGE,
    Math.min(
      currentPage - halfVisiblePages,
      totalPages - visiblePageCount + MIN_PAGE,
    ),
  );

  const lastVisiblePage = Math.min(
    totalPages,
    firstVisiblePage + visiblePageCount - MIN_PAGE,
  );

  const visiblePages = [];

  for (
    let pageNumber = firstVisiblePage;
    pageNumber <= lastVisiblePage;
    pageNumber++
  ) {
    visiblePages.push(pageNumber);
  }

  return visiblePages;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= MIN_PAGE) return null;

  const mobileVisiblePages = getVisiblePages(
    currentPage,
    totalPages,
    MOBILE_VISIBLE_PAGE_COUNT,
  );

  const desktopVisiblePages = getVisiblePages(
    currentPage,
    totalPages,
    DESKTOP_VISIBLE_PAGE_COUNT,
  );

  const isFirstPage = currentPage === MIN_PAGE;
  const isLastPage = currentPage === totalPages;

  function handlePreviousPage() {
    if (isFirstPage) return;

    onPageChange(currentPage - MIN_PAGE);
  }

  function handleNextPage() {
    if (isLastPage) return;

    onPageChange(currentPage + MIN_PAGE);
  }

  function renderPageButton(pageNumber) {
    const isCurrentPage = currentPage === pageNumber;

    return (
      <button
        key={pageNumber}
        type="button"
        aria-label={`Go to page ${pageNumber}`}
        aria-current={isCurrentPage ? "page" : undefined}
        onClick={() => onPageChange(pageNumber)}
        className={`${paginationButtonClass} ${
          isCurrentPage
            ? "border-primary bg-primary text-white"
            : "border-white/10 text-foreground hover:bg-white/10"
        }`}
      >
        {pageNumber}
      </button>
    );
  }

  return (
    <nav aria-label="Pagination" className="mt-12">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={isFirstPage}
          onClick={handlePreviousPage}
          className={`${paginationButtonClass} border-white/10 text-foreground hover:bg-white/10`}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 sm:hidden">
          {mobileVisiblePages.map(renderPageButton)}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {desktopVisiblePages.map(renderPageButton)}
        </div>

        <button
          type="button"
          aria-label="Next page"
          disabled={isLastPage}
          onClick={handleNextPage}
          className={`${paginationButtonClass} border-white/10 text-foreground hover:bg-white/10`}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
}

export default Pagination;

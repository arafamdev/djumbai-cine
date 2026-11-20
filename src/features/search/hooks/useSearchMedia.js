import { useEffect, useState } from "react";

import { searchMedia } from "../../../services/tmdb/searchService";

function useSearchMedia(searchQuery, currentPage = 1) {
  const normalizedSearchQuery = searchQuery.trim();

  const [searchRequestState, setSearchRequestState] = useState({
    searchQuery: null,
    currentPage: null,
    searchResults: [],
    totalPages: 0,
    searchError: null,
  });

  useEffect(() => {
    if (!normalizedSearchQuery) return;

    const searchAbortController = new AbortController();

    async function loadSearchResults() {
      try {
        const searchResponse = await searchMedia(
          normalizedSearchQuery,
          currentPage,
          searchAbortController.signal,
        );

        if (searchAbortController.signal.aborted) return;

        setSearchRequestState({
          searchQuery: normalizedSearchQuery,
          currentPage,
          searchResults: searchResponse.results,
          totalPages: searchResponse.total_pages,
          searchError: null,
        });
      } catch (searchRequestError) {
        if (searchAbortController.signal.aborted) return;

        console.error("Failed to search media:", searchRequestError);

        setSearchRequestState({
          searchQuery: normalizedSearchQuery,
          currentPage,
          searchResults: [],
          totalPages: 0,
          searchError: "Unable to search. Please try again.",
        });
      }
    }

    loadSearchResults();

    return () => searchAbortController.abort();
  }, [normalizedSearchQuery, currentPage]);

  const isCurrentSearchRequest =
    searchRequestState.searchQuery === normalizedSearchQuery &&
    searchRequestState.currentPage === currentPage;

  return {
    results:
      normalizedSearchQuery && isCurrentSearchRequest
        ? searchRequestState.searchResults
        : [],
    totalPages:
      normalizedSearchQuery && isCurrentSearchRequest
        ? searchRequestState.totalPages
        : 0,
    isLoading: Boolean(normalizedSearchQuery) && !isCurrentSearchRequest,
    error: isCurrentSearchRequest ? searchRequestState.searchError : null,
  };
}

export default useSearchMedia;

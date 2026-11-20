import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import useDebounce from "../hooks/useDebounce";
import useSearchMedia from "../hooks/useSearchMedia";
import SearchSuggestions from "./SearchSuggestions";

const MIN_SEARCH_CHARACTERS = 3;
const SEARCH_DEBOUNCE_DELAY = 400;
const MAX_SUGGESTIONS = 5;
const NO_ACTIVE_SUGGESTION = -1;

function SearchForm({ isSearchOpen, onSearchComplete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState(NO_ACTIVE_SUGGESTION);

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const suggestionsId = useId();
  const normalizedSearchQuery = searchQuery.trim();

  const debouncedSearchQuery = useDebounce(
    normalizedSearchQuery,
    SEARCH_DEBOUNCE_DELAY,
  );

  const shouldSearchSuggestions =
    isSearchOpen &&
    normalizedSearchQuery.length >= MIN_SEARCH_CHARACTERS &&
    debouncedSearchQuery === normalizedSearchQuery;

  const suggestionsSearchQuery = shouldSearchSuggestions
    ? debouncedSearchQuery
    : "";

  const {
    results: searchResults,
    isLoading,
    error: searchError,
  } = useSearchMedia(suggestionsSearchQuery);

  const shouldShowSuggestions =
    isSearchOpen && normalizedSearchQuery.length >= MIN_SEARCH_CHARACTERS;

  const suggestedMedia = shouldSearchSuggestions
    ? searchResults.slice(0, MAX_SUGGESTIONS)
    : [];

  const areSuggestionsAvailable =
    shouldShowSuggestions &&
    shouldSearchSuggestions &&
    !isLoading &&
    !searchError &&
    suggestedMedia.length > 0;

  const isActiveSuggestionValid =
    areSuggestionsAvailable &&
    activeSuggestionIndex >= 0 &&
    activeSuggestionIndex < suggestedMedia.length;

  const activeSuggestionId = isActiveSuggestionValid
    ? `${suggestionsId}-option-${activeSuggestionIndex}`
    : undefined;

  // Focus the input whenever the search panel opens.
  useEffect(() => {
    if (!isSearchOpen) return;

    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  function completeSearch() {
    setSearchQuery("");
    setActiveSuggestionIndex(NO_ACTIVE_SUGGESTION);
    onSearchComplete?.();
  }

  function navigateToSearchResults() {
    if (!normalizedSearchQuery) return;

    const searchParameters = new URLSearchParams({
      q: normalizedSearchQuery,
    });

    navigate(`/search?${searchParameters.toString()}`);
    completeSearch();
  }

  function navigateToMediaDetails(mediaItem) {
    const mediaDetailsPath =
      mediaItem.media_type === "tv"
        ? `/tv/${mediaItem.id}`
        : `/movies/${mediaItem.id}`;

    navigate(mediaDetailsPath);
    completeSearch();
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (isActiveSuggestionValid) {
      navigateToMediaDetails(suggestedMedia[activeSuggestionIndex]);
      return;
    }

    navigateToSearchResults();
  }

  function handleSearchQueryChange(event) {
    setSearchQuery(event.target.value);
    setActiveSuggestionIndex(NO_ACTIVE_SUGGESTION);
  }

  function handleSearchInputKeyDown(event) {
    if (!areSuggestionsAvailable) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestionIndex((previousIndex) =>
        previousIndex >= suggestedMedia.length - 1 ? 0 : previousIndex + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestionIndex((previousIndex) =>
        previousIndex <= 0 ? suggestedMedia.length - 1 : previousIndex - 1,
      );
    }
  }

  function handleSuggestionSelect() {
    completeSearch();
  }

  function handleViewAllResults() {
    navigateToSearchResults();
  }

  return (
    <div className="w-full">
      {/* Search form */}
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="flex w-full items-center gap-3"
      >
        <label htmlFor="media-search-input" className="sr-only">
          Search movies and TV shows
        </label>

        <input
          ref={searchInputRef}
          id="media-search-input"
          type="search"
          role="combobox"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onKeyDown={handleSearchInputKeyDown}
          placeholder="Search movies and TV shows..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={shouldShowSuggestions ? suggestionsId : undefined}
          aria-expanded={shouldShowSuggestions && !searchError}
          aria-activedescendant={activeSuggestionId}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus-visible:border-primary"
        />

        <button
          type="submit"
          disabled={!normalizedSearchQuery}
          aria-label="Submit search"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Search size={20} aria-hidden="true" />
        </button>
      </form>

      {/* Search suggestions */}
      {shouldShowSuggestions && (
        <>
          {searchError && shouldSearchSuggestions ? (
            <p role="alert" className="mt-3 text-sm text-primary">
              Unable to load suggestions. Press Enter to search.
            </p>
          ) : (
            <SearchSuggestions
              suggestionsId={suggestionsId}
              searchResults={suggestedMedia}
              isLoading={!shouldSearchSuggestions || isLoading}
              activeSuggestionIndex={
                isActiveSuggestionValid
                  ? activeSuggestionIndex
                  : NO_ACTIVE_SUGGESTION
              }
              onSuggestionSelect={handleSuggestionSelect}
              onViewAllResults={handleViewAllResults}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SearchForm;

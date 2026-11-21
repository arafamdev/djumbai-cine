import { useRef, useState } from "react";

import { LibraryContext } from "../hooks/useLibrary";
import { readLibrary, writeLibrary } from "../utils/libraryStorage";
import { normalizeMedia } from "../utils/normalizeMedia";

const LIBRARY_TYPES = ["favorites", "watchlist"];

function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(readLibrary);
  const libraryRef = useRef(library);

  function isSaved(listType, mediaId, mediaType) {
    if (!LIBRARY_TYPES.includes(listType)) {
      return false;
    }

    return library[listType].some(
      (item) => item.id === mediaId && item.mediaType === mediaType,
    );
  }

  function toggleSaved(listType, media) {
    if (!LIBRARY_TYPES.includes(listType)) {
      return false;
    }

    const normalizedMedia = normalizeMedia(media, media?.mediaType);

    if (!normalizedMedia) {
      return false;
    }

    const currentLibrary = libraryRef.current;
    const currentList = currentLibrary[listType];

    const alreadySaved = currentList.some(
      (item) =>
        item.id === normalizedMedia.id &&
        item.mediaType === normalizedMedia.mediaType,
    );

    // Create a new list without mutating the existing library.
    const updatedList = alreadySaved
      ? currentList.filter(
          (item) =>
            !(
              item.id === normalizedMedia.id &&
              item.mediaType === normalizedMedia.mediaType
            ),
        )
      : [...currentList, normalizedMedia];

    const updatedLibrary = {
      ...currentLibrary,
      [listType]: updatedList,
    };

    // Commit the state change only after persistence succeeds.
    if (!writeLibrary(updatedLibrary)) {
      return false;
    }

    libraryRef.current = updatedLibrary;
    setLibrary(updatedLibrary);

    return true;
  }

  return (
    <LibraryContext.Provider
      value={{
        favorites: library.favorites,
        watchlist: library.watchlist,
        isSaved,
        toggleSaved,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export default LibraryProvider;

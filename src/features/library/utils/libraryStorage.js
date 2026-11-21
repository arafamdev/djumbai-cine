import { normalizeMedia } from "./normalizeMedia";

const STORAGE_KEY = "djumbai-cine:library:v1";

function createEmptyLibrary() {
  return {
    favorites: [],
    watchlist: [],
  };
}

function validateSavedList(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const uniqueItems = new Map();

  for (const item of items) {
    const normalizedItem = normalizeMedia(item, item?.mediaType);

    if (!normalizedItem) {
      continue;
    }

    // Keep movies and TV shows with identical TMDB IDs separate.
    const key = `${normalizedItem.mediaType}:${normalizedItem.id}`;

    uniqueItems.set(key, normalizedItem);
  }

  return [...uniqueItems.values()];
}

export function readLibrary() {
  try {
    const storedLibrary = localStorage.getItem(STORAGE_KEY);

    if (!storedLibrary) {
      return createEmptyLibrary();
    }

    const parsedLibrary = JSON.parse(storedLibrary);

    return {
      favorites: validateSavedList(parsedLibrary?.favorites),
      watchlist: validateSavedList(parsedLibrary?.watchlist),
    };
  } catch {
    return createEmptyLibrary();
  }
}

export function writeLibrary(library) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    return true;
  } catch {
    return false;
  }
}

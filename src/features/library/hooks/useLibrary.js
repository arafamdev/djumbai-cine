import { createContext, useContext } from "react";

export const LibraryContext = createContext(null);

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }

  return context;
}

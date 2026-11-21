import { Heart } from "lucide-react";

import LibraryCollection from "../components/LibraryCollection";
import { useLibrary } from "../hooks/useLibrary";

function FavoritesPage() {
  const { favorites } = useLibrary();

  return (
    <LibraryCollection
      items={favorites}
      Icon={Heart}
      title="My Favorites"
      description="Your favorite movies and TV shows, all in one place."
      emptyTitle="No favorites yet"
      emptyDescription="Start exploring movies and TV shows and save the ones you love."
      emptyFilterDescription="You haven't saved any favorites in this category."
    />
  );
}

export default FavoritesPage;

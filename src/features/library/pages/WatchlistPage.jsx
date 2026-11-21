import { Bookmark } from "lucide-react";

import LibraryCollection from "../components/LibraryCollection";
import { useLibrary } from "../hooks/useLibrary";

function WatchlistPage() {
  const { watchlist } = useLibrary();

  return (
    <LibraryCollection
      items={watchlist}
      Icon={Bookmark}
      title="My Watchlist"
      description="Movies and TV shows you've saved to watch later."
      emptyTitle="Your watchlist is empty"
      emptyDescription="Discover movies and TV shows and save what you want to watch next."
      emptyFilterDescription="You haven't saved anything in this category."
    />
  );
}

export default WatchlistPage;

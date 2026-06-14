import { useWatchlist } from "../../context/WatchlistContext";
import { MovieItem } from "../../components/movie-item/MovieItem";
import { useMemo } from "react";

export function WatchListPage() {
  const { watchlist } = useWatchlist();

  const groupedByGenre = useMemo(() => {
    return watchlist.reduce((groups: any, movie: any) => {
      const genre = movie.genre || "Other";
      if (!groups[genre]) {
        groups[genre] = [];
      }

      groups[genre].push(movie);
      return groups;
    }, {});
  }, [watchlist]);

  return (
    <>
      <h1 className="max-sm:pl-3 font-bold sm:text-center text-2xl">Watchlist</h1>
        {watchlist.length === 0 ? (
          <p>No movies saved yet</p>
        ) : (
          Object.entries(groupedByGenre).map(([genre, movies]: any) => (
            <div key={genre} className="p-3">
              <h2 className="text-lg sm:text-xl font-medium">{genre}</h2>
              <div className="flex  gap-2 overflow-x-auto scrollbar-none">
                {movies.map((movie: any) => (
                  <MovieItem
                    key={movie.movieId}
                    movieId={movie.movieId}
                    movieUrl={movie.movieUrl}
                    title={movie.title}
                    releaseDate={movie.releaseDate}
                    genre={movie.genre}
                    mediaType={movie.mediaType}
                  />
                ))}
              </div>
            </div>
          ))
        )}
    </>
  );
}

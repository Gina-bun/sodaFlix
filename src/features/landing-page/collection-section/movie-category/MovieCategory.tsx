import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieItem } from "../../../../components/movie-item/MovieItem";
import { getMovies } from "../../../../services/api_service";
import { useEffect, useMemo, useRef, useState } from "react";

export function MovieCategory({
  genre,
  genreId,
  mediaType,
}: {
  genre: string;
  genreId: number;
  mediaType?: "tv" | "movie";
}) {
  const [movies, setMovies] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  const validMovies = useMemo(() => {
    return movies.filter(
      (movie: any) => movie.backdrop_path && (movie.title || movie.name),
    );
  }, [movies]);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    getMovies(genreId).then((movies) => {
      setMovies(movies);
      setLoading(false);
    });
  }, [genreId]);

  //skeleton card is a function so that it is reusable
  // (so react gets a fresh copy each time)
  const SkeletonCard = () => (
    <div className="shrink-0 w-50 h-67 rounded-sm bg-gray-300 animate-pulse" />
  );

  return (
    <>
      <h1 className="text-2xl font-bold pl-5.5 md:pl-12">{genre}</h1>
      <div className="flex category py-3 items-center">
        <ChevronLeft size={120} onClick={scrollLeft} />
        <div
          className="movie-lineup flex-nowrap flex gap-2"
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollbarWidth: "none",
          }}
          ref={rowRef}
        >
          {/* note: the (_) in map means i am ignoring the items in the array */}
          {/* also Array.from({ length: 6 }) creates [undefined, undefined, undefined, undefined, undefined, undefined] */}
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : validMovies.map((movie: any) => (
                <MovieItem
                  movieId={movie.id}
                  key={movie.id}
                  movieUrl={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  title={movie.title || movie.name}
                  releaseDate={movie.release_date || movie.first_air_date}
                  genre={genre}
                  mediaType={movie.media_type || mediaType || 'movie'}
                />
              ))}
        </div>
        <ChevronRight size={120} onClick={scrollRight} />
      </div>
    </>
  );
}

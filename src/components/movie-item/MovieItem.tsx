import { useContext } from "react";
import { WatchlistContext } from "../../context/WatchlistContext";
import "./MovieItem.css";
import { Link } from "react-router-dom";
import { Bookmark, Diamond } from "lucide-react";

export function MovieItem({
  movieId,
  movieUrl,
  title,
  releaseDate,
  genre, 
  mediaType
}: {
  movieId?: number | string;
  movieUrl: string;
  title: string;
  releaseDate: number | string;
  genre?: string;
  mediaType?:string
}) {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useContext(WatchlistContext);
  

  const addRemoveMovieToggle = () => {
    if (movieId === undefined) return

    const hasMovie = watchlist.some((item) => item.movieId === movieId);

    if (hasMovie) {
      removeFromWatchlist(movieId);
    }else {
      addToWatchlist({
        movieId,
        movieUrl,
        title,
        releaseDate,
         genre
      });
    }
  };

  //normalizing the date
   const movieYear = releaseDate 
    ? new Date(releaseDate).getFullYear()
    : 'N/A'

  const content = (
    <div className="movie-item flex flex-col shrink-0 border rounded-sm h-57 sm:h-67 bg-amber-200 w-50">
      <div
        className="movie-poster h-40 flex justify-end p-1 bg-gray-200"
        style={{
          backgroundImage: `url(${movieUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "fill-available",
        }}
      >
        <Bookmark
          style={{ color: "gray" }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (movieId === undefined) return;
            addRemoveMovieToggle()
          }}
        />
      </div>
      <div className="movie-info h-fit px-2 pt-1 ">
        <p className="movie-title text-wrap font-medium">{title.length > 20 ? title.slice(0,20) + "..." : title }</p>
        <div className="flex items-center gap-3 text-sm">
          <p className="genre">{genre}</p>
          <Diamond size={6} style={{fill:"black"}}/>
          <p className="mediaType">{mediaType}</p>
        </div>
        <p className="movie-date">{movieYear}</p>
      </div>
    </div>
  );

  if (movieId === null || movieId === undefined) return content;
  return (
    <>
      <Link to={`/${mediaType || 'movie'}/${movieId}`}>{content}</Link>
    </>
  );
}

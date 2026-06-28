import { getMovieDetails, getTVDetails } from "../../services/api_service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieItem } from "../../components/movie-item/MovieItem";

export function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId?: string }>();
  const [movieItem, setMovieItem] = useState(null);
  const location = window.location.pathname
  const isTV = location.includes("/tv/")

  useEffect(() => {
    if (!movieId) return;
    const idNum = Number(movieId);

     if (isTV) {
        getTVDetails(idNum).then(setMovieItem).catch(console.error)
    } else {
        getMovieDetails(idNum).then(setMovieItem).catch(console.error)
    }
    
  }, [movieId, isTV]);

  if (!movieItem) {
    return <div className="h-screen gray animate-pulse"></div>;
  }

  const title = movieItem.title || movieItem.name
  const trailer = movieItem.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube",
  );

  const cast = movieItem.credits.cast;

  const releaseDate: Date = new Date(movieItem.release_date || movieItem.first_air_date);
  const movieYear = isNaN(releaseDate.getFullYear()) ? 'N/A' : releaseDate.getFullYear();

  const runtime = movieItem.runtime 
    ? `${movieItem.runtime} mins` 
    : movieItem.episode_run_time?.[0] 
    ? `${movieItem.episode_run_time[0]} mins/ep`
    : 'N/A'

  const genre = movieItem.genres?.[0]?.name || 'N/A';

  const allGenres = movieItem.genres;

  const similarShows = movieItem.similar?.results?.slice(0, 11);

  const languages = movieItem.spoken_languages;

  const productionCompanies = movieItem.production_companies;


  return (
    <>
      <div>
        {/* BACKDROP section */}
        <div
          className="back-drop h-90 text-gray-200 text-center flex flex-col justify-end"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)),  url(https://image.tmdb.org/t/p/original${movieItem.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="font-bold text-xl px-5">{title}</h1>
          <div className="backdrop-deets text-amber-500 flex gap-2 justify-center mb-15 font-light">
            <p>{movieYear}</p>
            <p>{genre}</p>
            <p>{movieItem.popularity}</p>
            <p>{runtime}</p>
          </div>
        </div>

        {/* OVERVIEW section */}

        <div className="overview px-3 pt-5 pb-3 rounded-tl-3xl rounded-tr-3xl -mt-5 bg-white">
          <h2 className="text-lg font-medium">Overview</h2>
          <p>{movieItem.overview}</p>
        </div>

        {/* GENRES */}
        <div className="genres px-3 pb-3">
          <h2 className="text-lg font-medium">Genres:</h2>
          <div className="flex flex-wrap gap-1">
            {allGenres.map((genre) => (
              <div key={genre.id} className="bg-amber-200 flex  p-1 rounded-md">
                {genre.name}
              </div>
            ))}
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="languages flex px-3 pb-3 gap-1.5">
          <h3 className="font-medium">Languages: </h3>
          {languages.map((lang) => (
            <p key={lang.iso_639_1}>{lang.english_name}</p>
          ))}
        </div>

        {/* TRAILER */}
        {trailer && (
          <div className="trailer px-3 pb-3">
            <h2 className="text-lg font-medium">Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allowFullScreen
              width="100%"
              height="200"
            ></iframe>
          </div>
        )}

        {/* CAST section */}
        <div className="cast px-3 pb-3">
          <h2 className="text-lg font-medium">Cast</h2>
          <div
            className="flex gap-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {cast.map((castMember) => (
              <div key={castMember.cast_id} className="w-fit text-center">
                <div
                  className="w-25 h-25 rounded-full bg-gray-300"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${castMember.profile_path})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>

                <p>{castMember.character}</p>
                <p className="hidden sm:block">{castMember.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROD companies */}
        <div className="prod-companies px-3 pb-3">
          <h2 className="text-lg font-medium ">Production companies</h2>
          <div 
          className="flex gap-3 overflow-x-auto"
          style={{scrollbarWidth: "none"}}
          >
            {productionCompanies.map((company) => (
              <div key={company.id}>
                {/* company logo */}
                <div
                  className="rounded-full w-15 h-15 bg-gray-200"
                  style={{
                    backgroundImage: company.logo_path
                      ? `url(https://image.tmdb.org/t/p/original${company.logo_path})`
                      : "none",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat"
                  }}
                ></div>
                <p>
                  {company.name}({company.origin_country})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SIMILAR shows */}
        <div className="similar pb-5 px-3">
          <h2 className="text-lg font-medium">Similar shows</h2>
          <div
            className="flex gap-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {similarShows.map((tvshow) => (
              <div key={tvshow.id}>
                <MovieItem
                  movieId={tvshow.id}
                  movieUrl={`https://image.tmdb.org/t/p/w500${tvshow.backdrop_path}`}
                  title={tvshow.title || tvshow.name}
                  releaseDate={movieYear}
                  genre={genre}
                  mediaType={tvshow.media_type || 'movie'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

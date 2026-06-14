import { Search } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../../utils/debounce";
import { searchMovies } from "../../../services/api_service";

export function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeSearchPopup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeSearchPopup.current &&
        !closeSearchPopup.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useRef(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      const data = await searchMovies(searchTerm);
      setResults(data);
      setIsOpen(true);
    }, 500),
  ).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleSelect = (movie: any) => {
    navigate(`/${movie.media_type}/${movie.id}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      <div ref={closeSearchPopup} style={{ position: "relative" }}>
        <div
          id="search-container"
          className="flex border rounded-md w-70 bg-amber-50 gap-2 md:w-100 md:px-2 md:py-1.5 p-1 max-sm:self-center"
        >
          <Search size={20} className="m-auto" />
          <input
            type="text"
            className="outline-none flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
          />
        </div>

        {isOpen && results.length > 0 && (
          <div
            style={{ position: "absolute" }}
            className="search-dropdown bg-amber-50 mt-2 w-70 md:w-100 rounded-md"
          >
            {results.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelect(movie)}
                className="search-result-item not-last:border-b p-1 first:rounded-t-md last:rounded-b-md border-gray-300 hover:bg-amber-100"
              >
                <p className="font-medium">
                  {movie.title || movie.name} {movie.genre}
                </p>
                <p>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : movie.first_air_date
                      ? new Date(movie.first_air_date).getFullYear()
                      : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

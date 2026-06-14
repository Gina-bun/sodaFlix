import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Searchbar } from "./search-bar/Searchbar";
import { Menu, ChevronDown } from "lucide-react";
import "./Navbar.css"
import { DropDown } from "./drop-down/DropDown";
import "./drop-down/DropDown.css"

const categoryTypes = [
  { label: "Movie", to: "/category/movie" },
  { label: "Series", to: "/category/series" },
  { label: "TV Show", to: "/category/tv-show" },
  { label: "Documentary", to: "/category/documentary" },
  { label: "Other", to: "/category/other" },
];

const genreItems = [
  { label: "Romcom", to: "/genre/romcom" },
  { label: "Horror", to: "/genre/horror" },
  { label: "Comedy", to: "/genre/comedy" },
  { label: "Sitcom", to: "/genre/sitcom" },
  { label: "Fantasy", to: "/genre/fantasy" },
  { label: "Drama", to: "/genre/drama" },
  { label: "Action", to: "/genre/action" },
  { label: "Mystery", to: "/genre/mystery" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [desktopCategoryOpen, setDesktopCategoryOpen] = useState(false);

  const closeMenu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(closeMenu.current && !closeMenu.current.contains(event.target as Node)){
        setMenuOpen(false)
        setMobileCategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-top flex items-center justify-between p-4">
        <Link to="/" className="brand-link">
          <h1 className="font-bold text-2xl">sodaFlix</h1>
        </Link>

        <div ref={closeMenu} className="navbar-actions  flex items-center gap-3">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => {
              setMenuOpen((current) => !current);
              setMobileCategoryOpen(false);
            }}
            aria-expanded={menuOpen}
            aria-label="Toggle mobile menu"
          >
            <Menu size={25} />
          </button>

           <div 
      
      className={`mobileNav ${menuOpen ? "open" : ""} absolute w-full`}
      style={{top:"4rem", right: "0", zIndex: "99"}}
      >
        <div className="mobile-menu-dropdown">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <div className="mobile-category-block">
            <button
              type="button"
              className="nav-button category-toggle"
              onClick={() => setMobileCategoryOpen((current) => !current)}
              aria-expanded={mobileCategoryOpen}
            >
              Category
              <ChevronDown size={16} className={mobileCategoryOpen ? "chevron open" : "chevron"} />
            </button>

            {mobileCategoryOpen && (
              <div className="mobile-category-dropdown">
                <DropDown
                  types={categoryTypes}
                  genres={genreItems}
                  onSelect={() => {
                    setMenuOpen(false);
                    setMobileCategoryOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          <Link to="/watchlist" className="nav-link">
            Watchlist
          </Link>
        </div>
      </div>
        </div>
      </div>

      <div className="navbar-search-row px-4 pb-4">
        <Searchbar />
      </div>

     

      <div className="desktopNav">
        <div className="desktop-nav-row flex items-center justify-between gap-8 p-4">
          <div className="desktop-nav-left flex justify-between items-center gap-4 md:w-[60vw]">
            <Link to="/" className="brand-link">
              <h1 className="font-bold text-2xl">sodaFlix</h1>
            </Link>
            <Searchbar />
          </div>

          <ul className="desktop-nav-list flex items-center gap-6">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="desktop-category-dropdown" onMouseEnter={() => setDesktopCategoryOpen(true)} onMouseLeave={() => setDesktopCategoryOpen(false)}>
              <button
                type="button"
                className="nav-button category-toggle"
                aria-expanded={desktopCategoryOpen}
              >
                Category
                <ChevronDown size={16} className={desktopCategoryOpen ? "chevron open" : "chevron"} />
              </button>

              {desktopCategoryOpen && (
                <div className="desktop-dropdown-panel">
                  <DropDown
                    types={categoryTypes}
                    genres={genreItems}
                    onSelect={() => setDesktopCategoryOpen(false)}
                  />
                </div>
              )}
            </li>
            <li>
              <Link to="/watchlist" className="nav-link">
                Watchlist
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

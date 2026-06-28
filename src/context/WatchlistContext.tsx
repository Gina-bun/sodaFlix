import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Movie } from '../types/movie';

interface WatchlistContextType {
    watchlist: Movie[];
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movieId: number | string) => void;
}

export const WatchlistContext = createContext<WatchlistContextType>({
    watchlist: [],
    addToWatchlist: () => {},
    removeFromWatchlist: () => {},
});




export const WatchlistProvider = ({children}: {children: ReactNode}) => {
    const [watchlist, setWatchlist] = useState<Movie[]>(() => {
         const savedMovies = localStorage.getItem("savedMovies")
         return savedMovies ? JSON.parse(savedMovies) : []
    })

    const addToWatchlist = (movie: Movie) => {
        const hasMovie = watchlist.some((item) => item.movieId === movie.movieId )
        if(!hasMovie){
              setWatchlist(prev => [...prev, movie])
        }
      
    }

    const removeFromWatchlist = (movieId: number | string) => {
        setWatchlist(prev => prev.filter(movie =>  movie.movieId !== movieId))
    }

    //to update/save movies to the watchlist
    useEffect(() => {
        localStorage.setItem("savedMovies", JSON.stringify(watchlist))
    },[watchlist])

    return (
        <WatchlistContext.Provider value={{watchlist, addToWatchlist, removeFromWatchlist}}>
            {children}
        </WatchlistContext.Provider>
    )
}

export const useWatchlist = () => useContext(WatchlistContext)

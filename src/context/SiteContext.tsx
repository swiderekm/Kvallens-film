import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  overview?: string;
}

export interface FilterState {
  genre: string;
  year: string;
  sortBy: string;
  minRating: string;
}

export const DEFAULT_FILTERS: FilterState = {
  genre: "",
  year: "",
  sortBy: "popularity.desc",
  minRating: "",
};

interface SiteContextType {
  watchlist: Movie[];
  watchedList: Movie[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  markAsWatched: (movie: Movie) => void;
  unmarkAsWatched: (id: number) => void;
  isWatched: (id: number) => boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("kvallens_watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchedList, setWatchedList] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("kvallens_watched");
    return saved ? JSON.parse(saved) : [];
  });

  // Persystencja filtrów podczas przechodzenia między podstronami
  const [filters, setFiltersState] = useState<FilterState>(() => {
    const savedFilters = sessionStorage.getItem("kvallens_filters");
    return savedFilters ? JSON.parse(savedFilters) : DEFAULT_FILTERS;
  });

  useEffect(() => {
    localStorage.setItem("kvallens_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("kvallens_watched", JSON.stringify(watchedList));
  }, [watchedList]);

  useEffect(() => {
    sessionStorage.setItem("kvallens_filters", JSON.stringify(filters));
  }, [filters]);

  const setFilters = (newFilters: FilterState) => {
    setFiltersState(newFilters);
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
    sessionStorage.removeItem("kvallens_filters");
  };

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter((m) => m.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((m) => m.id === id);
  };

  const markAsWatched = (movie: Movie) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
    if (!watchedList.some((m) => m.id === movie.id)) {
      setWatchedList((prev) => [...prev, movie]);
    }
  };

  const unmarkAsWatched = (id: number) => {
    setWatchedList((prev) => prev.filter((m) => m.id !== id));
  };

  const isWatched = (id: number) => {
    return watchedList.some((m) => m.id === id);
  };

  return (
    <SiteContext.Provider
      value={{
        watchlist,
        watchedList,
        filters,
        setFilters,
        resetFilters,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        markAsWatched,
        unmarkAsWatched,
        isWatched,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
};

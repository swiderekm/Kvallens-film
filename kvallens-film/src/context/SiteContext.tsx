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

interface SiteContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("kvallens_watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("kvallens_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

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

  return (
    <SiteContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
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

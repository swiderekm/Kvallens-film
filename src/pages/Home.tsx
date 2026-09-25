import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSiteContext, DEFAULT_FILTERS } from "../context/SiteContext";
import type { Movie, FilterState } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";
import { SearchForm } from "../components/SearchForm";
import { Header } from "../components/Header";
import { FilterBar } from "../components/FilterBar";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const INITIAL_LIMIT = 12;
const STEP = 8;

export const Home = () => {
  const { filters, setFilters, resetFilters } = useSiteContext();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [apiPage, setApiPage] = useState(1);
  const [hasMoreApiPages, setHasMoreApiPages] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const fetchMoviesWithFilters = useCallback(async (appliedFilters: FilterState) => {
    try {
      setLoading(true);
      setError("");
      setIsSearching(false);
      setCurrentQuery("");
      setApiPage(1);
      setVisibleCount(INITIAL_LIMIT);

      const params: Record<string, string | number> = {
        api_key: API_KEY,
        language: "sv-SE",
        page: 1,
        sort_by: appliedFilters.sortBy,
      };

      if (appliedFilters.genre) {
        params.with_genres = appliedFilters.genre;
      }
      if (appliedFilters.year) {
        params.primary_release_year = appliedFilters.year;
      }
      if (appliedFilters.minRating) {
        params["vote_average.gte"] = appliedFilters.minRating;
        params["vote_count.gte"] = 50;
      }

      const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
      setMovies(response.data.results || []);
      setHasMoreApiPages(response.data.page < response.data.total_pages);
    } catch {
      setError("Kunde inte hämta filmer. Kontrollera din internetanslutning eller API-nyckel.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      setIsSearching(true);
      setCurrentQuery(query);
      setApiPage(1);
      setVisibleCount(INITIAL_LIMIT);

      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: "sv-SE",
          page: 1,
        },
      });

      setMovies(response.data.results || []);
      setHasMoreApiPages(response.data.page < response.data.total_pages);
    } catch {
      setError("Ett fel uppstod vid sökningen. Kontrollera din anslutning.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchMoviesWithFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    fetchMoviesWithFilters(DEFAULT_FILTERS);
  };

  useEffect(() => {
    fetchMoviesWithFilters(filters);
  }, []);

  const handleLoadMore = async () => {
    const nextVisible = visibleCount + STEP;

    if (nextVisible <= movies.length) {
      setVisibleCount(nextVisible);
      return;
    }

    if (hasMoreApiPages) {
      try {
        setLoadingMore(true);
        const nextPage = apiPage + 1;

        let response;
        if (isSearching) {
          response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
              api_key: API_KEY,
              query: currentQuery,
              language: "sv-SE",
              page: nextPage,
            },
          });
        } else {
          const params: Record<string, string | number> = {
            api_key: API_KEY,
            language: "sv-SE",
            page: nextPage,
            sort_by: filters.sortBy,
          };
          if (filters.genre) params.with_genres = filters.genre;
          if (filters.year) params.primary_release_year = filters.year;
          if (filters.minRating) {
            params["vote_average.gte"] = filters.minRating;
            params["vote_count.gte"] = 50;
          }
          response = await axios.get(`${BASE_URL}/discover/movie`, { params });
        }

        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUnique = (response.data.results || []).filter(
            (m: Movie) => !existingIds.has(m.id)
          );
          return [...prev, ...newUnique];
        });

        setApiPage(nextPage);
        setHasMoreApiPages(response.data.page < response.data.total_pages);
        setVisibleCount(nextVisible);
      } catch {
        setError("Kunde inte hämta fler filmer.");
      } finally {
        setLoadingMore(false);
      }
    } else {
      setVisibleCount(movies.length);
    }
  };

  const visibleMovies = movies.slice(0, visibleCount);
  const canLoadMore = visibleCount < movies.length || hasMoreApiPages;

  return (
    <main className="container">
      <Header />
      <SearchForm
        onSearch={handleSearch}
        onReset={() => {
          fetchMoviesWithFilters(filters);
        }}
      />

      {!isSearching && (
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          disabled={loading}
        />
      )}

      {loading && <p className="status-text">Hämtar filmer...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Inga resultat hittades</h3>
          <p>
            {isSearching
              ? `Vi hittade inga filmer som matchade "${currentQuery}". Prova att söka på något annat.`
              : "Inga filmer matchade dina valda filter. Prova att ändra eller rensa filtren."}
          </p>
          {isSearching ? (
            <button
              type="button"
              className="empty-cta-btn"
              onClick={() => fetchMoviesWithFilters(filters)}
            >
              Tillbaka till alla filmer
            </button>
          ) : (
            <button
              type="button"
              className="empty-cta-btn"
              onClick={handleResetFilters}
            >
              Rensa alla filter
            </button>
          )}
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="section-header-row">
            <h2 className="section-title">
              {isSearching ? `Sökresultat för "${currentQuery}"` : "Upptäck filmer"}
            </h2>
            <span className="movies-count-badge">
              Visar {visibleMovies.length} av {movies.length}
            </span>
          </div>

          <section className="movies-grid">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>

          {canLoadMore && (
            <div className="load-more-container">
              <button
                type="button"
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="spinner"></span> Laddar fler filmer...
                  </>
                ) : (
                  "Ladda fler filmer"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

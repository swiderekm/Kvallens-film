import { useState, useEffect } from "react";
import axios from "axios";
import type { Movie } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";
import { SearchForm } from "../components/SearchForm";
import { Header } from "../components/Header";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const INITIAL_LIMIT = 12; // Początkowo 12 filmów (3 rzędy po 4)
const STEP = 8;           // Każde kliknięcie ładuje kolejne 8 filmów

export const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [apiPage, setApiPage] = useState(1);
  const [hasMoreApiPages, setHasMoreApiPages] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  // Pobieranie początkowych popularnych filmów
  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      setError("");
      setIsSearching(false);
      setCurrentQuery("");
      setApiPage(1);
      setVisibleCount(INITIAL_LIMIT);

      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: "sv-SE",
          page: 1,
        },
      });

      setMovies(response.data.results);
      setHasMoreApiPages(response.data.page < response.data.total_pages);
    } catch {
      setError("Kunde inte hämta filmer. Kontrollera din internetanslutning eller API-nyckel.");
    } finally {
      setLoading(false);
    }
  };

  // Wyszukiwanie filmów
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

      setMovies(response.data.results);
      setHasMoreApiPages(response.data.page < response.data.total_pages);

      if (response.data.results.length === 0) {
        setError("Inga filmer hittades med det namnet.");
      }
    } catch {
      setError("Ett fel uppstod vid sökningen.");
    } finally {
      setLoading(false);
    }
  };

  // Obsługa przycisku "Ladda fler"
  const handleLoadMore = async () => {
    const nextVisible = visibleCount + STEP;

    // Jeżeli mamy już pobrane filmy w tablicy, po prostu zwiększamy widoczną liczbę
    if (nextVisible <= movies.length) {
      setVisibleCount(nextVisible);
      return;
    }

    // Jeśli potrzebujemy więcej filmów i API ma kolejne strony, pobieramy następną stronę z TMDb
    if (hasMoreApiPages) {
      try {
        setLoadingMore(true);
        const nextPage = apiPage + 1;
        const endpoint = isSearching ? "/search/movie" : "/movie/popular";

        const params: Record<string, string | number> = {
          api_key: API_KEY,
          language: "sv-SE",
          page: nextPage,
        };

        if (isSearching) {
          params.query = currentQuery;
        }

        const response = await axios.get(`${BASE_URL}${endpoint}`, { params });

        // Łączymy nowe filmy, odfiltrowując ewentualne duplikaty
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUnique = response.data.results.filter(
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

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const visibleMovies = movies.slice(0, visibleCount);
  const canLoadMore = visibleCount < movies.length || hasMoreApiPages;

  return (
    <main className="container">
      <Header />
      <SearchForm onSearch={handleSearch} onReset={fetchPopularMovies} />

      {loading && <p className="status-text">Hämtar filmer...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="section-header-row">
            <h2 className="section-title">
              {isSearching ? `Sökresultat för "${currentQuery}"` : "Populära filmer"}
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

          {/* Przycisk Load More */}
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

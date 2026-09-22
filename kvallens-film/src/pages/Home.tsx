import { useState, useEffect } from "react";
import axios from "axios";
import type { Movie } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";
import { SearchForm } from "../components/SearchForm";
import { Header } from "../components/Header";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      setError("");
      setIsSearching(false);
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: "sv-SE",
          page: 1,
        },
      });
      setMovies(response.data.results);
    } catch {
      setError("Kunde inte hämta filmer. Kontrollera din internetanslutning eller API-nyckel.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      setIsSearching(true);
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: "sv-SE",
        },
      });
      setMovies(response.data.results);
      if (response.data.results.length === 0) {
        setError("Inga filmer hittades med det namnet.");
      }
    } catch {
      setError("Ett fel uppstod vid sökningen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  return (
    <main className="container">
      <Header />
      <SearchForm onSearch={handleSearch} onReset={fetchPopularMovies} />

      {loading && <p className="status-text">Hämtar filmer...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <h2 className="section-title">
            {isSearching ? "Sökresultat" : "Populära filmer"}
          </h2>
          <section className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
        </>
      )}
    </main>
  );
};

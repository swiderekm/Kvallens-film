import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSiteContext } from "../context/SiteContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface DetailedMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
}

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useSiteContext();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: "sv-SE",
          },
        });
        setMovie(response.data);
      } catch {
        setError("Kunde inte hämta information om filmen.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) return <div className="container"><p className="status-text">Laddar detaljer...</p></div>;
  if (error || !movie) return <div className="container"><p className="error-text">{error || "Filmen hittades inte."}</p></div>;

  const saved = isInWatchlist(movie.id);

  return (
    <main className="container movie-detail-page">
      <Link to="/" className="back-link">← Tillbaka till filmer</Link>
      <div className="detail-layout">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : "https://via.placeholder.com/300x450"
          }
          alt={movie.title}
        />
        <div className="detail-content">
          <h2>{movie.title}</h2>
          <p className="detail-meta">
            ★ {movie.vote_average.toFixed(1)} | {movie.release_date?.slice(0, 4)}
          </p>
          <div className="genre-tags">
            {movie.genres.map((g) => (
              <span key={g.id} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>
          <p className="detail-overview">
            {movie.overview || "Ingen svensk sammanfattning tillgänglig."}
          </p>
          <button
            className={saved ? "btn-saved" : "btn-save"}
            onClick={() =>
              saved
                ? removeFromWatchlist(movie.id)
                : addToWatchlist({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                  })
            }
          >
            {saved ? "Ta bort från lista" : "🔖 Lägg till i lista"}
          </button>
        </div>
      </div>
    </main>
  );
};

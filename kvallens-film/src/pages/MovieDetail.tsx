import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSiteContext } from "../context/SiteContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface DetailedMovie {
  id: number;
  title: string;
  tagline?: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime?: number;
  genres: { id: number; name: string }[];
}

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    markAsWatched,
    unmarkAsWatched,
  } = useSiteContext();

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

  if (loading) {
    return (
      <main className="container">
        <p className="status-text">Laddar detaljer...</p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container">
        <div className="empty-state">
          <h3>Hoppsan!</h3>
          <p>{error || "Filmen kunde inte hittas."}</p>
          <button type="button" onClick={() => navigate(-1)} className="empty-cta-btn">
            ← Tillbaka
          </button>
        </div>
      </main>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/340x510?text=Ingen+bild";

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "Okänt år";
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const minutes = movie.runtime ? movie.runtime % 60 : 0;
  const runtimeFormatted = movie.runtime ? `${hours}h ${minutes}m` : null;

  const moviePayload = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  };

  return (
    <main className="container movie-detail-page">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="detail-back-btn"
      >
        <span className="back-arrow">←</span> Tillbaka
      </button>

      <section className="detail-card">
        <div className="detail-poster-wrap">
          <img src={poster} alt={movie.title} />
          <div className="detail-poster-rating">
            ★ {movie.vote_average.toFixed(1)}
          </div>
          {watched && <div className="detail-badge-watched">✓ Sedd</div>}
        </div>

        <div className="detail-info">
          <div className="detail-header-block">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            <div className="detail-meta-row">
              <span className="meta-pill year-pill">{releaseYear}</span>
              {runtimeFormatted && (
                <span className="meta-pill">{runtimeFormatted}</span>
              )}
              <span className="meta-pill rating-pill">
                ★ {movie.vote_average.toFixed(1)} / 10
              </span>
              {watched && (
                <span className="meta-pill watched-pill">✓ Har sett denna</span>
              )}
            </div>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genre-pill-list">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="detail-overview-block">
            <h3>Handling</h3>
            <p className="detail-overview">
              {movie.overview
                ? movie.overview
                : "Ingen svensk sammanfattning tillgänglig för denna film."}
            </p>
          </div>

          <div className="detail-actions-group">
            <button
              type="button"
              className={inWatchlist ? "btn-detail-saved" : "btn-detail-save"}
              onClick={() =>
                inWatchlist
                  ? removeFromWatchlist(movie.id)
                  : addToWatchlist(moviePayload)
              }
            >
              {inWatchlist ? "✕ Ta bort från min lista" : "+ Lägg till i min lista"}
            </button>

            <button
              type="button"
              className={watched ? "btn-detail-watched-active" : "btn-detail-watched"}
              onClick={() =>
                watched
                  ? unmarkAsWatched(movie.id)
                  : markAsWatched(moviePayload)
              }
            >
              {watched ? "✓ Obejrzano (Klicka för att ångra)" : "👁 Markera som sedd"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

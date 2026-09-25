import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSiteContext } from "../context/SiteContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

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
  videos?: {
    results: VideoResult[];
  };
}

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
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
            append_to_response: "videos",
            include_video_language: "sv,en,null",
          },
        });

        const data: DetailedMovie = response.data;
        setMovie(data);

        const videos = data.videos?.results || [];
        const trailer =
          videos.find(
            (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
          ) ||
          videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          videos.find((v) => v.site === "YouTube" && v.type === "Teaser");

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
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
        <p className="error-text">{error || "Filmen hittades inte."}</p>
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          ← Tillbaka
        </button>
      </main>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      });
    }
  };

  const handleToggleWatched = () => {
    if (watched) {
      unmarkAsWatched(movie.id);
    } else {
      markAsWatched({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      });
    }
  };

  return (
    <main className="container">
      <div className="detail-top-nav">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          ← Tillbaka
        </button>
      </div>

      <article className="detail-card">
        <div className="detail-poster-wrap">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="detail-poster-img"
            />
          ) : (
            <div className="no-poster-box">Ingen bild</div>
          )}
        </div>

        <div className="detail-info-pane">
          <header className="detail-header-block">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}
          </header>

          <div className="detail-meta-row">
            <span className="detail-rating-pill">
              ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
            <span className="detail-meta-dot">•</span>
            <span className="detail-release-date">
              {movie.release_date ? movie.release_date.substring(0, 4) : "Okänt år"}
            </span>
            {movie.runtime ? (
              <>
                <span className="detail-meta-dot">•</span>
                <span className="detail-runtime-pill">{movie.runtime} min</span>
              </>
            ) : null}
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
            <p className="detail-overview-text">
              {movie.overview || "Ingen svensk beskrivning tillgänglig för denna film."}
            </p>
          </div>

          <div className="detail-actions-group">
            {trailerKey && (
              <button
                type="button"
                className="btn-detail-trailer"
                onClick={() => setShowModal(true)}
              >
                ▶ Se trailer
              </button>
            )}

            <button
              type="button"
              className={inWatchlist ? "btn-detail-saved" : "btn-detail-save"}
              onClick={handleToggleWatchlist}
            >
              {inWatchlist ? "✕ Ta bort från lista" : "+ Lägg till i Min lista"}
            </button>

            <button
              type="button"
              className={watched ? "btn-detail-watched-active" : "btn-detail-watched"}
              onClick={handleToggleWatched}
            >
              {watched ? "✓ Sedd" : "Markera som sedd"}
            </button>
          </div>
        </div>
      </article>

      {showModal && trailerKey && (
        <div className="trailer-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="trailer-modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕ Stäng
            </button>
            <div className="trailer-video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

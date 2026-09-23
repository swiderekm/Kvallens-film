import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";
import type { Movie } from "../context/SiteContext";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    markAsWatched,
    unmarkAsWatched,
  } = useSiteContext();

  const saved = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Ingen+bild";

  return (
    <div className={`movie-card ${watched ? "movie-card-watched" : ""}`}>
      <Link to={`/movie/${movie.id}`} className="card-image-wrap">
        <span className="badge-rating">★ {movie.vote_average.toFixed(1)}</span>
        {watched && <span className="badge-watched">✓ Sedd</span>}
        <img src={poster} alt={movie.title} loading="lazy" />
      </Link>
      <div className="card-info">
        <Link to={`/movie/${movie.id}`} className="card-title">
          {movie.title}
        </Link>
        <div className="card-actions">
          <button
            type="button"
            className={saved ? "btn-saved" : "btn-save"}
            onClick={() =>
              saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
            }
          >
            {saved ? "Ta bort" : "+ Min lista"}
          </button>

          <button
            type="button"
            className={`btn-watched-toggle ${watched ? "is-watched" : ""}`}
            title={watched ? "Ångra sedd markering" : "Markera som sedd"}
            onClick={() =>
              watched ? unmarkAsWatched(movie.id) : markAsWatched(movie)
            }
          >
            {watched ? "✓" : "👁"}
          </button>
        </div>
      </div>
    </div>
  );
};
